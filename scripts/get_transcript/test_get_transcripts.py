import io
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from email.utils import format_datetime
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from requests import HTTPError, Response
from youtube_transcript_api import IpBlocked

import get_transcripts as script


class TranscriptTests(unittest.TestCase):
    def test_audio_mode_skips_captions_reuses_model_and_separates_labeled_outputs(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script, "OUT", Path(tmp)), \
             patch.object(sys, "argv", ["get_transcripts.py", "--transcribe", "@test"]), \
             patch.object(sys, "stdout", io.StringIO()), \
             patch.object(script, "list_videos", return_value=[("one", "First"), ("two", "Second")]), \
             patch.object(script, "load_transcriber") as load, \
             patch.object(script, "text_via_audio", return_value="Recognized speech") as audio, \
             patch.object(script, "get_text") as captions, \
             patch.object(script.time, "sleep"):
            folder = Path(tmp) / "test/longform"
            folder.mkdir(parents=True)
            caption = folder / "one.txt"
            caption.write_text("Original captions", encoding="utf-8")
            self.assertEqual(script.main(), 0)
            load.assert_called_once()
            self.assertEqual(audio.call_count, 2)
            self.assertIs(audio.call_args.args[3], load.return_value)
            captions.assert_not_called()
            self.assertEqual(caption.read_text(), "Original captions")
            combined = (folder / "transcribed/ALL.txt").read_text(encoding="utf-8")
            self.assertIn("SOURCE: local speech recognition", combined)
            self.assertIn("Recognized speech", combined)
            self.assertIn("https://www.youtube.com/watch?v=one", combined)

    def test_audio_transcription_reads_complete_audio_and_consumes_segments(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script.yt_dlp, "YoutubeDL") as ydl, \
             patch.object(sys, "stdout", io.StringIO()):
            path = Path(tmp) / "video.webm"
            path.write_bytes(b"audio data")
            client = ydl.return_value.__enter__.return_value
            client.prepare_filename.return_value = str(path)
            model = unittest.mock.Mock()
            model.transcribe.return_value = (iter([
                SimpleNamespace(text=" First sentence. "), SimpleNamespace(text=" Second sentence. "),
            ]), None)
            self.assertEqual(script.text_via_audio("video", Path(tmp), "firefox", model), "First sentence. Second sentence.")
            client.extract_info.assert_called_once_with("https://www.youtube.com/watch?v=video", download=True)
            self.assertEqual(ydl.call_args.args[0]["format"], "bestaudio")
            self.assertEqual(ydl.call_args.args[0]["cookiesfrombrowser"], ("firefox",))
            model.transcribe.assert_called_once_with(str(path), beam_size=5, vad_filter=True, log_progress=True)
            self.assertTrue(path.exists())

    def test_empty_speech_is_not_saved_as_success(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script.yt_dlp, "YoutubeDL") as ydl, \
             patch.object(sys, "stdout", io.StringIO()):
            path = Path(tmp) / "video.webm"
            path.write_bytes(b"audio data")
            ydl.return_value.__enter__.return_value.prepare_filename.return_value = str(path)
            model = unittest.mock.Mock()
            model.transcribe.return_value = (iter([]), None)
            with self.assertRaisesRegex(RuntimeError, "produced no text"):
                script.text_via_audio("video", Path(tmp), None, model)

    def test_missing_local_model_fails_once_without_downloading_audio(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script, "OUT", Path(tmp)), \
             patch.object(sys, "argv", ["get_transcripts.py", "--transcribe", "@test"]), \
             patch.object(sys, "stdout", io.StringIO()), \
             patch.object(script, "list_videos", return_value=[("video", "Title")]), \
             patch.object(script, "load_transcriber", side_effect=RuntimeError("model unavailable")) as load, \
             patch.object(script, "text_via_audio") as audio:
            self.assertEqual(script.main(), 1)
            load.assert_called_once()
            audio.assert_not_called()
            self.assertIn("model unavailable", (Path(tmp) / "missing.txt").read_text())

    def test_model_loading_uses_cached_files_without_silent_download(self):
        with patch("faster_whisper.WhisperModel") as model:
            self.assertIs(script.load_transcriber(), model.return_value)
            model.assert_called_once_with("small", device="cpu", compute_type="int8", local_files_only=True)

    def test_browser_cookies_apply_to_listing(self):
        with patch.object(script.yt_dlp, "YoutubeDL") as ydl:
            ydl.return_value.__enter__.return_value.extract_info.return_value = {
                "entries": [{"id": "video", "title": "Title", "view_count": 10}]
            }
            self.assertEqual(script.list_videos("url", 1, "firefox"), [("video", "Title")])
            self.assertEqual(ydl.call_args.args[0]["cookiesfrombrowser"], ("firefox",))

    def test_full_tab_is_sorted_before_limiting_and_duplicate_ids_are_removed(self):
        entries = [{"id": str(i), "view_count": i, "title": f"Video {i}"} for i in range(8)]
        entries.extend([None, {"title": "Unavailable"}, entries[-1]])
        with patch.object(script.yt_dlp, "YoutubeDL") as ydl:
            ydl.return_value.__enter__.return_value.extract_info.return_value = {"entries": entries}
            self.assertEqual(script.list_videos("url", 5), [
                (str(i), f"Video {i}") for i in range(7, 2, -1)
            ])
            self.assertNotIn("playlistend", ydl.call_args.args[0])
            self.assertTrue(ydl.call_args.args[0]["extract_flat"])
            ydl.return_value.__enter__.return_value.extract_info.assert_called_once_with("url", download=False)

    def test_missing_counts_cannot_silently_produce_latest_instead_of_top(self):
        with patch.object(script.yt_dlp, "YoutubeDL") as ydl:
            extract = ydl.return_value.__enter__.return_value.extract_info
            extract.return_value = {"entries": [{"id": "unknown"}]}
            with self.assertRaisesRegex(RuntimeError, "cannot rank"):
                script.list_videos("url", 5)
            extract.return_value = {"entries": []}
            with self.assertRaisesRegex(RuntimeError, "no videos found"):
                script.list_videos("url", 5)

    def test_live_and_upcoming_entries_are_not_ranked_as_recorded_videos(self):
        with patch.object(script.yt_dlp, "YoutubeDL") as ydl:
            ydl.return_value.__enter__.return_value.extract_info.return_value = {"entries": [
                {"id": "live", "live_status": "is_live"},
                {"id": "upcoming", "live_status": "is_upcoming"},
                {"id": "recorded", "view_count": 0},
            ]}
            self.assertEqual(script.list_videos("url", 5), [("recorded", "recorded")])

    def test_handle_modes_select_separate_tabs_and_override_legacy_url_tab(self):
        for mode, tab in [("longform", "videos"), ("short", "shorts")]:
            self.assertEqual(script.channel_url("@CasuallyFinance", mode), (
                "CasuallyFinance", f"https://www.youtube.com/@CasuallyFinance/{tab}"
            ))
            self.assertEqual(script.channel_url("alias=https://www.youtube.com/@test/shorts?sort=p", mode), (
                "alias", f"https://www.youtube.com/@test/{tab}"
            ))
        for value in ["bare-name", "@../test", "name=", "name=https://example.com/@test",
                      "name=https://www.youtube.com/watch?v=video", "@.."]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                script.channel_url(value, "longform")

    def test_distinct_handles_keep_distinct_output_folders(self):
        names = [script.channel_url(handle, "longform")[0] for handle in [
            "@foo.bar", "@foo-bar", "@foo_bar",
        ]]
        self.assertEqual(len(set(names)), 3)

    def test_three_handles_default_to_five_longform_videos(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script, "OUT", Path(tmp)), \
             patch.object(sys, "argv", ["get_transcripts.py", "--longform", "@jamesjani", "@howmoneyworks", "@CasuallyFinance"]), \
             patch.object(sys, "stdout", io.StringIO()), \
             patch.object(script, "list_videos", return_value=[("video", "Title")]) as listing, \
             patch.object(script, "get_text", return_value="Transcript"), \
             patch.object(script.time, "sleep"):
            self.assertEqual(script.main(), 0)
            self.assertEqual(listing.call_args_list, [
                unittest.mock.call(f"https://www.youtube.com/@{name}/videos", 5, None)
                for name in ["jamesjani", "howmoneyworks", "CasuallyFinance"]
            ])
            text = (Path(tmp) / "jamesjani/longform/ALL.txt").read_text(encoding="utf-8")
            self.assertIn("https://www.youtube.com/watch?v=video", text)
            self.assertNotIn("/shorts/", text)

    def test_short_mode_is_separate_and_cached_by_id_when_rank_or_title_changes(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script, "OUT", Path(tmp)), \
             patch.object(sys, "argv", ["get_transcripts.py", "--short", "@test", "--count", "2"]), \
             patch.object(sys, "stdout", io.StringIO()), \
             patch.object(script, "list_videos", return_value=[("video", "New title")]) as listing, \
             patch.object(script, "get_text") as fetch:
            folder = Path(tmp) / "test/short"
            folder.mkdir(parents=True)
            (folder / "video.txt").write_text("TITLE: Old title\nURL: old\n\nSaved transcript\n", encoding="utf-8")
            longform = Path(tmp) / "test/longform"
            longform.mkdir()
            (longform / "ALL.txt").write_text("Longform stays intact", encoding="utf-8")
            self.assertEqual(script.main(), 0)
            fetch.assert_not_called()
            listing.assert_called_once_with("https://www.youtube.com/@test/shorts", 2, None)
            text = (folder / "ALL.txt").read_text(encoding="utf-8")
            self.assertIn("https://www.youtube.com/shorts/video", text)
            self.assertIn("Saved transcript", text)
            self.assertEqual((longform / "ALL.txt").read_text(), "Longform stays intact")

    def test_invalid_cli_arguments_fail_before_network_or_output(self):
        for args in [["--short", "--longform"], ["--count", "0"], ["--count", "-1"], ["invalid"]]:
            with self.subTest(args=args), \
                 patch.object(sys, "argv", ["get_transcripts.py", *args]), \
                 patch.object(sys, "stderr", io.StringIO()), \
                 patch.object(script, "list_videos") as listing, \
                 self.assertRaises(SystemExit) as error:
                script.main()
            self.assertEqual(error.exception.code, 2)
            listing.assert_not_called()

    def test_failed_api_does_not_repeat_network_request(self):
        with patch("youtube_transcript_api.YouTubeTranscriptApi") as api:
            api.return_value.fetch.side_effect = RuntimeError("blocked")
            with self.assertRaisesRegex(RuntimeError, "blocked"):
                script.text_via_api("video")
            api.return_value.list.assert_not_called()

    def test_empty_ytdlp_result_uses_api_fallback(self):
        with patch.object(script, "text_via_api", return_value="fallback"), \
             patch.object(script, "text_via_ytdlp", return_value=" "):
            self.assertEqual(script.get_text("video", Path("."), None), "fallback")

    def test_errors_keep_nonempty_messages(self):
        with patch.object(script, "text_via_api", side_effect=RuntimeError("\nBlocked by YouTube")), \
             patch.object(script, "text_via_ytdlp", side_effect=RuntimeError()):
            with self.assertRaisesRegex(RuntimeError, "yt-dlp: RuntimeError.*api: RuntimeError: Blocked by YouTube"):
                script.get_text("video", Path("."), None)

    def test_caption_selection_prefers_manual_english_then_native_auto_english(self):
        manual = {"ext": "vtt", "url": "https://www.youtube.com/api/timedtext?lang=en"}
        original = {"ext": "vtt", "url": "https://www.youtube.com/api/timedtext?lang=en&kind=asr"}
        translated = {"ext": "vtt", "url": "https://www.youtube.com/api/timedtext?lang=es&tlang=en"}
        info = {"subtitles": {"en": [manual]}, "automatic_captions": {
            "en": [translated], "en-orig": [original],
        }}
        self.assertEqual(script.caption_track(info), ("en", manual))
        info["subtitles"] = {}
        self.assertEqual(script.caption_track(info), ("en-orig", original))
        del info["automatic_captions"]["en-orig"]
        with self.assertRaisesRegex(RuntimeError, "no native caption"):
            script.caption_track(info)

    def test_caption_selection_falls_back_to_native_language_without_translation(self):
        native = {"ext": "vtt", "url": "https://www.youtube.com/api/timedtext?lang=fr"}
        self.assertEqual(script.caption_track({"subtitles": {"fr": [native]}}), ("fr", native))
        with self.assertRaisesRegex(RuntimeError, "no native caption"):
            script.caption_track({"automatic_captions": {"live_chat": [native]}})

    def test_ytdlp_downloads_exactly_one_selected_track_without_refetching_metadata(self):
        with tempfile.TemporaryDirectory() as tmp, patch.object(script.yt_dlp, "YoutubeDL") as ydl:
            folder = Path(tmp)
            path = folder / "video.en-orig.vtt"
            path.write_text("WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nNative caption\n", encoding="utf-8")
            # A stale file from a different track must not be read.
            (folder / "video.en.vtt").write_text("Stale translated caption", encoding="utf-8")
            track = {"ext": "vtt", "url": "https://www.youtube.com/api/timedtext?lang=en"}
            info = {"automatic_captions": {"en-orig": [track]}}
            client = ydl.return_value.__enter__.return_value
            client.extract_info.return_value = info
            def download(selected):
                self.assertEqual(selected["requested_subtitles"], {"en-orig": track})
                track["filepath"] = str(path)
            client.process_info.side_effect = download
            self.assertEqual(script.text_via_ytdlp("video", folder, "firefox"), "Native caption")
            opts = ydl.call_args.args[0]
            self.assertTrue(opts["writeautomaticsub"])
            self.assertTrue(opts["skip_download"])
            self.assertEqual(opts["cookiesfrombrowser"], ("firefox",))
            self.assertNotIn("subtitleslangs", opts)
            client.extract_info.assert_called_once_with("https://www.youtube.com/watch?v=video", download=False)
            client.process_info.assert_called_once_with(info)

    def test_transient_rate_limit_retries_only_selected_method_after_backoff(self):
        with patch.object(script, "text_via_ytdlp", side_effect=[RuntimeError("HTTP Error 429"), "Transcript"]) as fetch, \
             patch.object(script, "text_via_api") as api, \
             patch.object(script.time, "sleep") as sleep, \
             patch.object(sys, "stdout", io.StringIO()):
            self.assertEqual(script.get_text("video", Path("."), None), "Transcript")
            self.assertEqual(fetch.call_count, 2)
            sleep.assert_called_once_with(30)
            api.assert_not_called()

    def test_persistent_rate_limit_has_bounded_backoff_and_no_same_ip_fallback(self):
        with patch.object(script, "text_via_ytdlp", side_effect=RuntimeError("HTTP Error 429")) as fetch, \
             patch.object(script, "text_via_api") as api, \
             patch.object(script.time, "sleep") as sleep, \
             patch.object(sys, "stdout", io.StringIO()):
            with self.assertRaisesRegex(script.RateLimitedError, "Stopping network requests"):
                script.get_text("video", Path("."), None)
            self.assertEqual(fetch.call_count, 3)
            self.assertEqual(sleep.call_args_list, [unittest.mock.call(30), unittest.mock.call(60)])
            api.assert_not_called()

    def test_rate_limit_reads_wrapped_status_and_retry_after_and_recognizes_api_block(self):
        response = Response()
        response.status_code = 429
        response.headers["Retry-After"] = "45"
        cause = HTTPError("Caption endpoint limited", response=response)
        wrapped = script.yt_dlp.utils.DownloadError("Download failed", exc_info=(HTTPError, cause, None))
        self.assertEqual(script.rate_limit_wait(wrapped, 0), 45)
        self.assertEqual(script.rate_limit_wait(IpBlocked("video"), 0), 30)
        self.assertIsNone(script.rate_limit_wait(RuntimeError("no captions"), 0))
        self.assertIsNone(script.rate_limit_wait(RuntimeError("video ID abc-429-xyz unavailable"), 0))
        response.headers["Retry-After"] = format_datetime(datetime.now(timezone.utc) + timedelta(minutes=5))
        self.assertGreater(script.rate_limit_wait(cause, 0), 290)

    def test_long_server_retry_after_stops_instead_of_retrying_too_early(self):
        response = Response()
        response.status_code = 429
        response.headers["Retry-After"] = "300"
        with patch.object(script, "text_via_ytdlp", side_effect=HTTPError("limited", response=response)) as fetch, \
             patch.object(script.time, "sleep") as sleep:
            with self.assertRaisesRegex(script.RateLimitedError, "at least 300s"):
                script.get_text("video", Path("."), None)
            fetch.assert_called_once()
            sleep.assert_not_called()

    def test_batch_stops_network_after_block_and_preserves_existing_combined_file(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script, "OUT", Path(tmp)), \
             patch.object(sys, "argv", ["get_transcripts.py", "--longform", "@first", "@second"]), \
             patch.object(sys, "stdout", io.StringIO()), \
             patch.object(script, "list_videos", return_value=[("saved", "Saved"), ("blocked", "Blocked"), ("pending", "Pending")]) as listing, \
             patch.object(script, "get_text", side_effect=script.RateLimitedError("HTTP 429; retry later")) as fetch:
            folder = Path(tmp) / "first/longform"
            folder.mkdir(parents=True)
            (folder / "saved.txt").write_text("TITLE: Saved\nURL: saved\n\nSaved transcript\n", encoding="utf-8")
            combined = folder / "ALL.txt"
            combined.write_text("Previously complete combined file", encoding="utf-8")
            self.assertEqual(script.main(), 1)
            listing.assert_called_once()
            fetch.assert_called_once_with("blocked", folder / "_raw", None)
            self.assertEqual(combined.read_text(), "Previously complete combined file")
            failures = (Path(tmp) / "missing.txt").read_text()
            for entry in ["blocked", "pending", "second"]:
                self.assertIn(entry, failures)

    def test_listing_rate_limit_skips_later_channels(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script, "OUT", Path(tmp)), \
             patch.object(sys, "argv", ["get_transcripts.py", "@first", "@second"]), \
             patch.object(sys, "stdout", io.StringIO()), \
             patch.object(script, "list_videos", side_effect=RuntimeError("HTTP Error 429")) as listing, \
             patch.object(script, "get_text") as fetch:
            self.assertEqual(script.main(), 1)
            listing.assert_called_once()
            fetch.assert_not_called()
            failures = (Path(tmp) / "missing.txt").read_text()
            self.assertIn("second", failures)
            self.assertIn("not requested", failures)

    def test_windows_output_handles_emoji_and_clears_stale_failures(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            (out / "missing.txt").write_text("old failure", encoding="utf-8")
            console = io.TextIOWrapper(io.BytesIO(), encoding="cp1252")
            with patch.object(script, "OUT", out), \
                 patch.object(sys, "argv", ["get_transcripts.py", "test=https://www.youtube.com/@test", "--count", "1"]), \
                 patch.object(sys, "stdout", console), \
                 patch.object(script, "list_videos", return_value=[("video", "Title 🤢")]), \
                 patch.object(script, "get_text", return_value="Transcript text"), \
                 patch.object(script.time, "sleep"):
                script.main()
            self.assertIn("Title 🤢", (out / "test" / "longform" / "ALL.txt").read_text(encoding="utf-8"))
            self.assertEqual((out / "missing.txt").read_text(), "")

    def test_listing_failure_is_recorded(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script, "OUT", Path(tmp)), \
             patch.object(sys, "argv", ["get_transcripts.py", "test=https://www.youtube.com/@test"]), \
             patch.object(sys, "stdout", io.StringIO()), \
             patch.object(script, "list_videos", side_effect=RuntimeError("blocked")):
            script.main()
            self.assertIn("could not list videos: blocked", (Path(tmp) / "missing.txt").read_text())

    def test_failed_fetch_preserves_existing_combined_transcript(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script, "OUT", Path(tmp)), \
             patch.object(sys, "argv", ["get_transcripts.py", "test=https://www.youtube.com/@test"]), \
             patch.object(sys, "stdout", io.StringIO()), \
             patch.object(script, "list_videos", return_value=[("video", "New title")]), \
             patch.object(script, "get_text", side_effect=RuntimeError("blocked")):
            folder = Path(tmp) / "test" / "longform"
            folder.mkdir(parents=True)
            combined = folder / "ALL.txt"
            combined.write_text("Previously saved transcript", encoding="utf-8")
            self.assertEqual(script.main(), 1)
            self.assertEqual(combined.read_text(), "Previously saved transcript")


if __name__ == "__main__":
    unittest.main()
