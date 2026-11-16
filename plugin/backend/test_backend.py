import asyncio
from io import BytesIO
from pathlib import Path
import tempfile
import time
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from plugin.backend.app import create_app
from plugin.backend.jobs import contained, publish
from plugin.backend.transcripts import Options, TranscriptRequest, import_transcript, parse_subtitles, sidecars, validate_segments, video_id
from plugin.backend.worker import caption_tracks, extract_captions, run

IDENTITY = "abcdefghijk"
EXTENSION = "a" * 32
ORIGIN = f"chrome-extension://{EXTENSION}"
HEADERS = {"Origin": ORIGIN, "X-Frame-Study-Extension": EXTENSION}
VTT = b"WEBVTT\n\n00:00:01.250 --> 00:00:03.850\nImagine losing your money.\n\n00:00:04.000 --> 00:00:05.000\nKeep it local.\n"


class FormatTests(unittest.TestCase):
    def test_identity_rejects_commands_non_youtube_urls_and_paths(self):
        for url in [IDENTITY, f"https://youtu.be/{IDENTITY}?t=5", f"https://www.youtube.com/watch?v={IDENTITY}&list=whatever", f"https://m.youtube.com/shorts/{IDENTITY}"]:
            self.assertEqual(video_id(url), IDENTITY)
        for url in ["../../escape", "https://example.com/watch?v=" + IDENTITY, "file:///etc/passwd", "http://www.youtube.com/watch?v=" + IDENTITY, "https://youtube.com.evil.test/watch?v=" + IDENTITY, f"https://user@youtube.com/watch?v={IDENTITY}", f"https://youtube.com:8765/watch?v={IDENTITY}", IDENTITY + ";whoami"]:
            with self.subTest(url=url), self.assertRaises(ValueError):
                video_id(url)
        with self.assertRaises(ValueError):
            TranscriptRequest(url=IDENTITY, model="../../other-model")
        with self.assertRaises(ValueError):
            TranscriptRequest(url=IDENTITY, output_path="C:/elsewhere")

    def test_subtitle_timing_srt_and_plain_text(self):
        segments = parse_subtitles(VTT.decode())
        self.assertEqual(segments[0], {"start": 1.25, "end": 3.85, "text": "Imagine losing your money."})
        files = sidecars({"videoId": IDENTITY, "segments": segments})
        self.assertIn(b"00:00:01,250 --> 00:00:03,850", files["transcript.srt"])
        self.assertEqual(import_transcript(files["transcript.srt"], ".srt"), segments)
        self.assertEqual(import_transcript(files["transcript.json"], ".json"), segments)
        self.assertEqual(import_transcript(b"No timing evidence.", ".txt")[0]["start"], None)
        self.assertEqual(sidecars({"segments": import_transcript(b"Untimed", ".txt")})["transcript.srt"], b"")

    def test_auto_caption_rollup_strips_repeated_words_without_inventing_word_timing(self):
        text = "WEBVTT\n\n00:00.000 --> 00:02.000\nhello &amp; <c>world</c>\n\n00:01.500 --> 00:03.000\nhello &amp; world again\n"
        segments = parse_subtitles(text, rolling=True)
        self.assertEqual([item["text"] for item in segments], ["hello & world", "again"])
        self.assertEqual(segments[1]["start"], 1.5)
        with self.assertRaises(ValueError):
            parse_subtitles("WEBVTT\n\n00:03.000 --> 00:01.000\nwrong")
        with self.assertRaises(ValueError):
            validate_segments([{"start": float("nan"), "end": 3, "text": "bad"}])

    def test_caption_selection_prefers_manual_and_excludes_translations(self):
        def track(language):
            return [{"ext": "vtt", "url": f"https://www.youtube.com/api/timedtext?lang={language}"}]
        info = {"subtitles": {"en": track("en")}, "automatic_captions": {"en-orig": track("en"), "fr": [{"ext": "vtt", "url": "https://www.youtube.com/api/timedtext?tlang=fr"}]}}
        self.assertEqual([item[0] for item in caption_tracks(info)], ["subtitles", "automatic_captions"])
        self.assertEqual(caption_tracks(info, "de"), [])
        class Downloader:
            def urlopen(self, _url): return BytesIO(VTT)
        result, errors = extract_captions(Downloader(), info, Options())
        self.assertEqual(result["source"], "youtube_manual")
        self.assertEqual(errors, [])

    def test_empty_and_failed_captions_fall_back_to_downloaded_audio(self):
        import yt_dlp
        for problem in ["empty", "failed", "force"]:
            class Downloader:
                def __init__(self, options): self.options = options
                def __enter__(self): return self
                def __exit__(self, *_args): pass
                def extract_info(self, _url, download):
                    if not download and problem == "failed":
                        raise RuntimeError("captions blocked")
                    info = {"id": IDENTITY, "title": "Fixture", "duration": 5, "subtitles": {"en": [{"ext": "vtt", "url": "https://www.youtube.com/api/timedtext"}]}}
                    if download:
                        (folder / "audio.wav").write_bytes(b"fixture")
                    return info
                def urlopen(self, _url): return BytesIO(VTT if problem == "force" else b"WEBVTT\n\n")
                def prepare_filename(self, _info): return str(folder / "audio.wav")
            with tempfile.TemporaryDirectory() as temporary:
                folder = Path(temporary)
                with patch.object(yt_dlp, "YoutubeDL", Downloader), patch("plugin.backend.worker.transcribe_audio", return_value={"source": "whisper", "model": "small", "language": "en", "segments": [{"start": 0, "end": 1, "text": "fallback"}]}) as whisper:
                    result = run({"videoId": IDENTITY, "options": Options(force_whisper=problem == "force").model_dump()}, folder, folder)
                self.assertEqual(result["source"], "whisper")
                whisper.assert_called_once()


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.app = create_app(EXTENSION, self.root / "result", self.root / "work")
        self.client = TestClient(self.app, base_url="http://127.0.0.1:8765", headers=HEADERS)
        self.client.__enter__()

    def tearDown(self):
        self.client.__exit__(None, None, None)
        self.temporary.cleanup()

    def wait_job(self, job_id):
        for _ in range(200):
            result = self.client.get(f"/api/jobs/{job_id}").json()
            if result["status"] in {"complete", "error", "cancelled"}:
                return result
            time.sleep(.05)
        self.fail("Job did not finish")

    def upload(self, contents=VTT, suffix="vtt"):
        return self.client.post(f"/api/transcript/upload/{IDENTITY}?kind=transcript", headers={"X-Upload-Name": "upload." + suffix, "Content-Type": "application/octet-stream"}, content=contents)

    def test_cors_origin_header_and_host_restrictions(self):
        self.assertEqual(self.client.get("/api/health").status_code, 200)
        self.assertEqual(self.client.get("/api/health", headers={"Origin": "https://evil.test"}).status_code, 403)
        self.assertEqual(self.client.get("/api/health", headers={"X-Frame-Study-Extension": "b" * 32}).status_code, 403)
        self.assertEqual(self.client.get("/api/health", headers={"Host": "evil.test"}).status_code, 400)
        preflight = self.client.options("/api/transcript", headers={"Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type,x-frame-study-extension"})
        self.assertEqual(preflight.headers["access-control-allow-origin"], ORIGIN)
        self.assertEqual(self.client.options("/api/transcript", headers={"Origin": "chrome-extension://" + "b" * 32, "Access-Control-Request-Method": "POST"}).status_code, 403)
        del self.client.headers["origin"]
        self.assertEqual(self.client.get("/api/health").status_code, 200)
        del self.client.headers["x-frame-study-extension"]
        self.assertEqual(self.client.get("/api/health").status_code, 403)

    def test_api_rejects_unsafe_inputs_without_starting_workers(self):
        for request in [{"url": "file:///etc/passwd"}, {"url": IDENTITY, "device": "shell"}, {"url": IDENTITY, "command": "whoami"}]:
            self.assertEqual(self.client.post("/api/transcript", json=request).status_code, 422)
        self.assertEqual(len(self.app.state.jobs.records), 0)
        self.assertEqual(self.client.post("/api/transcript", content=b"x" * 32769).status_code, 413)
        self.assertEqual(self.upload(b"", "vtt").status_code, 422)
        self.assertEqual(self.upload(b"x", "exe").status_code, 422)
        self.assertEqual(self.upload(b"x" * (5 * 1024 * 1024 + 1)).status_code, 413)

    def test_real_worker_import_saves_all_sidecars_and_cleans_temporary_files(self):
        response = self.upload()
        self.assertEqual(response.status_code, 202, response.text)
        result = self.wait_job(response.json()["id"])
        self.assertEqual(result["status"], "complete", result)
        transcript = self.client.get(f"/api/transcript/{IDENTITY}").json()
        self.assertEqual(transcript["source"], "manual")
        self.assertEqual(transcript["segments"][0]["start"], 1.25)
        folder = self.root / "result" / IDENTITY / "transcript"
        self.assertEqual({file.name for file in folder.iterdir()}, {"transcript.json", "transcript.txt", "transcript.srt"})
        self.assertEqual(list((self.root / "work").glob("job_*")), [])
        self.assertEqual(self.client.get(f"/api/jobs?video_id={IDENTITY}").json()[0]["status"], "complete")

    def test_failed_import_keeps_previous_transcript_and_cleans_temporary_files(self):
        original = self.wait_job(self.upload().json()["id"])
        bad = self.wait_job(self.upload(b"{broken", "json").json()["id"])
        self.assertEqual(bad["status"], "error")
        self.assertEqual(self.client.get(f"/api/transcript/{IDENTITY}").json()["jobId"], original["id"])
        self.assertEqual(list((self.root / "work").glob("job_*")), [])

    def test_bounded_queue_and_queued_cancellation(self):
        jobs = self.app.state.jobs
        records = self.client.portal.call(lambda: [jobs.create(IDENTITY, Options()) for _ in range(4)])
        self.assertEqual(self.client.post("/api/transcript", json={"url": IDENTITY}).status_code, 429)
        self.assertEqual(self.client.post(f"/api/jobs/{records[0]['id']}/cancel").json()["status"], "cancelled")
        self.assertFalse(records[0]["folder"].exists())

    def test_running_cancellation_kills_worker_and_cleans_audio(self):
        original_spawn = asyncio.create_subprocess_exec
        async def spawn(*args, **kwargs):
            if len(args) > 3 and args[3] == "plugin.backend.worker":
                args = (args[0], "-u", "-c", "import time; time.sleep(60)")
            return await original_spawn(*args, **kwargs)
        with patch("asyncio.create_subprocess_exec", spawn):
            response = self.upload()
            identity = response.json()["id"]
            for _ in range(100):
                if self.app.state.jobs.records[identity]["process"]:
                    break
                time.sleep(.02)
            process = self.app.state.jobs.records[identity]["process"]
            self.assertIsNotNone(process)
            self.client.post(f"/api/jobs/{identity}/cancel")
            self.assertEqual(self.wait_job(identity)["status"], "cancelled")
            self.assertIsNotNone(process.returncode)
            self.assertFalse(self.app.state.jobs.records[identity]["folder"].exists())

    def test_output_containment_and_commit_validation(self):
        with self.assertRaises(ValueError):
            contained(self.root, "..", "escape")
        folder = self.root / "staging"
        folder.mkdir()
        with self.assertRaises(ValueError):
            publish(self.root / "result", IDENTITY, {"videoId": "different12", "segments": []}, folder, False)

    def test_retained_audio_is_unique_and_requires_a_valid_successful_transcript(self):
        folder = self.root / "staging"
        folder.mkdir()
        (folder / "normalized.wav").write_bytes(b"local decoded audio")
        name = "audio_" + "b" * 32 + ".wav"
        document = {"videoId": IDENTITY, "retainedAudio": name, "segments": [{"start": 0, "end": 1, "text": "Speech"}]}
        publish(self.root / "result", IDENTITY, document, folder, True)
        self.assertEqual((self.root / "result" / IDENTITY / "transcript" / name).read_bytes(), b"local decoded audio")
        self.assertFalse((folder / "normalized.wav").exists())
        (folder / "normalized.wav").write_bytes(b"failed run audio")
        with self.assertRaises(ValueError):
            publish(self.root / "result", IDENTITY, {**document, "segments": []}, folder, True)
        self.assertEqual((self.root / "result" / IDENTITY / "transcript" / name).read_bytes(), b"local decoded audio")


if __name__ == "__main__":
    unittest.main()
