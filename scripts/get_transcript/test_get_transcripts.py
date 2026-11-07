import io
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import get_transcripts as script


class TranscriptTests(unittest.TestCase):
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

    def test_empty_api_result_uses_fallback(self):
        with patch.object(script, "text_via_api", return_value=" "), \
             patch.object(script, "text_via_ytdlp", return_value="fallback"):
            self.assertEqual(script.get_text("video", Path("."), None), "fallback")

    def test_errors_keep_nonempty_messages(self):
        with patch.object(script, "text_via_api", side_effect=RuntimeError("\nBlocked by YouTube")), \
             patch.object(script, "text_via_ytdlp", side_effect=RuntimeError()):
            with self.assertRaisesRegex(RuntimeError, "api: Blocked by YouTube.*yt-dlp: RuntimeError"):
                script.get_text("video", Path("."), None)

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
