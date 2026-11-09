import json
from pathlib import Path
import sys
import tempfile
import unittest
import wave

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from time_narration import compare_text, load_inputs, phrase_cues, sha256


class NarrationTimingTest(unittest.TestCase):
    def test_absolute_offsets_and_sentence_boundaries(self):
        words = [
            {"text": "Hello.", "start": 0.1, "end": 0.5},
            {"text": "More", "start": 0.6, "end": 0.8},
            {"text": "context", "start": 0.8, "end": 1.0},
        ]
        timed, cues = phrase_cues(words, "p002", 48001, 48000, 96000)
        self.assertAlmostEqual(timed[0]["startMs"], 48001 * 1000 / 48000 + 100)
        self.assertEqual([cue["id"] for cue in cues], ["p002-s001", "p002-s002"])
        self.assertEqual(cues[1]["text"], "More context")
        self.assertEqual(timed[1]["endMs"], timed[2]["startMs"])
        self.assertEqual(cues[1]["wordIds"], ["p002-w002", "p002-w003"])

    def test_rejects_empty_overlapping_nonfinite_and_out_of_bounds_words(self):
        for words in (
            [],
            [{"text": "x", "start": 0, "end": 0}],
            [{"text": "x", "start": 0, "end": float("nan")}],
            [{"text": "x", "start": 2, "end": 3}],
            [
                {"text": "x", "start": 0, "end": 0.5},
                {"text": "y", "start": 0.4, "end": 0.6},
            ],
        ):
            with self.subTest(words=words), self.assertRaises(ValueError):
                phrase_cues(words, "p001", 0, 48000, 48000)

    def test_small_tail_rounding_is_clamped_to_real_audio_end(self):
        words, _ = phrase_cues(
            [{"text": "End.", "start": 0.9, "end": 1.02}], "p001", 0, 48000, 48000
        )
        self.assertEqual(words[0]["endMs"], 1000)

    def test_script_comparison_exposes_differences_without_replacing_script(self):
        self.assertEqual(compare_text("Sam saves.", "sam saves.")["differences"], [])
        result = compare_text("six hundred dollars", "$600")
        self.assertLess(result["tokenMatchRatio"], 1)
        self.assertTrue(result["differences"])

    def test_input_provenance_and_corrupt_paragraph_detection(self):
        with tempfile.TemporaryDirectory(prefix="narration-timing-") as temporary:
            root = Path(temporary)
            script = root / "script.txt"
            script.write_text("Hello.\n", encoding="utf-8")
            for name in ("narration.wav", "audio-1.wav"):
                with wave.open(str(root / name), "wb") as audio:
                    audio.setnchannels(1)
                    audio.setsampwidth(2)
                    audio.setframerate(48000)
                    audio.writeframes(b"\x01\x00" * 48000)
            manifest = {
                "complete": True,
                "scriptHash": sha256(script),
                "sampleRate": 48000,
                "totalParagraphs": 1,
                "segments": [
                    {
                        "id": "p001",
                        "text": "Hello.",
                        "file": "audio-1.wav",
                        "samples": 48000,
                        "audioHash": sha256(root / "audio-1.wav"),
                    }
                ],
            }
            draft = {
                "complete": True,
                "scriptHash": sha256(script),
                "sourceAudioSha256": sha256(root / "narration.wav"),
            }
            (root / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
            (root / "cues.draft.json").write_text(json.dumps(draft), encoding="utf-8")
            self.assertEqual(load_inputs(script, root)[2], 48000)
            script.write_text("Changed.\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Script hash"):
                load_inputs(script, root)
            script.write_text("Hello.\n", encoding="utf-8")
            (root / "audio-1.wav").write_bytes(b"corrupt")
            with self.assertRaisesRegex(ValueError, "integrity"):
                load_inputs(script, root)


if __name__ == "__main__":
    unittest.main()
