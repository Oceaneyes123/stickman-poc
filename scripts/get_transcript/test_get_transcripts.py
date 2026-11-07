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
                "entries": [{"id": "video", "title": "Title"}]
            }
            self.assertEqual(script.list_videos("url", 1, "firefox"), [("video", "Title")])
            self.assertEqual(ydl.call_args.args[0]["cookiesfrombrowser"], ("firefox",))

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
                 patch.object(sys, "argv", ["get_transcripts.py", "test=url", "--count", "1"]), \
                 patch.object(sys, "stdout", console), \
                 patch.object(script, "list_videos", return_value=[("video", "Title 🤢")]), \
                 patch.object(script, "get_text", return_value="Transcript text"), \
                 patch.object(script.time, "sleep"):
                script.main()
            self.assertIn("Title 🤢", (out / "test" / "ALL.txt").read_text(encoding="utf-8"))
            self.assertEqual((out / "missing.txt").read_text(), "")

    def test_listing_failure_is_recorded(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script, "OUT", Path(tmp)), \
             patch.object(sys, "argv", ["get_transcripts.py", "test=url"]), \
             patch.object(sys, "stdout", io.StringIO()), \
             patch.object(script, "list_videos", side_effect=RuntimeError("blocked")):
            script.main()
            self.assertIn("could not list videos: blocked", (Path(tmp) / "missing.txt").read_text())

    def test_failed_fetch_preserves_existing_combined_transcript(self):
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(script, "OUT", Path(tmp)), \
             patch.object(sys, "argv", ["get_transcripts.py", "test=url"]), \
             patch.object(sys, "stdout", io.StringIO()), \
             patch.object(script, "list_videos", return_value=[("video", "New title")]), \
             patch.object(script, "get_text", side_effect=RuntimeError("blocked")):
            folder = Path(tmp) / "test"
            folder.mkdir()
            combined = folder / "ALL.txt"
            combined.write_text("Previously saved transcript", encoding="utf-8")
            self.assertEqual(script.main(), 1)
            self.assertEqual(combined.read_text(), "Previously saved transcript")


if __name__ == "__main__":
    unittest.main()
