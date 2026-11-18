"""Episode-004 planning-document check, not a render or creative-approval gate.

Run: python videos/004-free-shipping/storyboard-check.py [--self-test]
"""
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
FIELDS = (
    "Narration or story moment", "What the viewer needs to understand",
    "Visual purpose", "Recommended medium", "Primary subject",
    "Animation or camera action", "Required assets", "Source/license requirements",
    "Expected viewer takeaway", "Phrase anchor", "On-screen text",
    "Motion references", "Transition", "Continuity",
)


def norm(text):
    return " ".join(text.split())


def field(block, name):
    found = re.findall(r"^\*\*" + re.escape(name) + r":\*\* (.+)$", block, re.M)
    assert len(found) == 1, f"Missing or repeated field: {name}"
    return found[0]


def check(board, raw, manifest):
    narration = raw.decode("utf-8")
    paragraphs = re.split(r"\n\s*\n", narration.strip())
    fingerprint = hashlib.sha256(raw).hexdigest()
    assert f"**Narration SHA-256:** `{fingerprint}`" in board, "Narration fingerprint differs"
    groups = list(re.finditer(r"^### (V4-S\d{2}) - [^\n]+\n(.*?)(?=^### V4-S\d{2} - |\Z)", board, re.M | re.S))
    assert groups, "No shot groups"
    ids = [m[1] for m in groups]
    assert ids == [f"V4-S{i:02}" for i in range(1, len(ids) + 1)], "Shot IDs are not sequential"
    assert f"**{len(ids)} shot groups**" in board and f"**{len(paragraphs)} narration paragraphs**" in board
    assets = manifest["assets"]
    by_id = {a["id"]: a for a in assets}
    assert len(by_id) == len(assets), "Duplicate asset IDs"
    assert manifest["planning_only"] is True
    sources = ROOT.joinpath("sources.md").read_text(encoding="utf-8")
    known_claims = set(re.findall(r"\b[FA]\d{2}\b", sources))
    script = ROOT.joinpath("script.md").read_text(encoding="utf-8")
    beat_ids = re.findall(r"^## (B\d{2}) - ", script, re.M)
    beat_text = re.findall(r"<!-- NARRATION -->(.*?)<!-- /NARRATION -->", script, re.S)
    assert len(beat_ids) == len(beat_text)
    assert norm(" ".join(beat_text)) == norm(narration), "Script and narration diverge"
    beats = dict(zip(beat_ids, map(norm, beat_text)))
    repo = ROOT.parent.parent
    motion_code = "\n".join(repo.joinpath(p).read_text(encoding="utf-8") for p in ("src/typography/index.tsx", "src/objects/motion.tsx"))
    transition_code = repo.joinpath("src/transitions/index.tsx").read_text(encoding="utf-8")
    math_code = repo.joinpath("src/finance/math.ts").read_text(encoding="utf-8")
    assert "export const freeShippingExample" in math_code and "export const calculateFreeShippingOrder" in math_code, "Missing episode-004 finance math exports"
    covered, quoted, uses = [], [], {a: [] for a in by_id}
    for match in groups:
        sid, block = match[1], match[2]
        values = {name: field(block, name) for name in FIELDS}
        anchor = values["Narration or story moment"]
        pids = [int(p) for p in re.findall(r"\bP(\d{2})\b", anchor)]
        assert pids and all(1 <= p <= len(paragraphs) for p in pids), f"{sid}: paragraph anchors"
        excerpts = re.findall(r"<!-- SHOT_NARRATION -->\s*(.*?)\s*<!-- /SHOT_NARRATION -->", block, re.S)
        assert len(excerpts) == 1, f"{sid}: narration excerpt"
        lines = excerpts[0].splitlines()
        assert all(line.startswith(">") for line in lines), f"{sid}: quote formatting"
        text = "\n".join(line[2:] if line.startswith("> ") else "" for line in lines)
        assert norm(text) == norm(" ".join(paragraphs[p - 1] for p in pids)), f"{sid}: excerpt mismatch"
        bid = re.search(r"\bB\d{2}\b", anchor).group()
        assert bid in beats and norm(text) in beats[bid], f"{sid}: wrong script beat"
        assert values["Phrase anchor"].casefold() in norm(text).casefold(), f"{sid}: invented phrase anchor"
        claims = set(re.findall(r"\b[FA]\d{2}\b", values["Source/license requirements"]))
        assert claims and claims <= known_claims, f"{sid}: unsupported claim IDs"
        asset_ids = re.findall(r"\b(?:DG|FO|EP)\d{2}\b", values["Required assets"])
        assert asset_ids and set(asset_ids) <= by_id.keys(), f"{sid}: missing asset record"
        for aid in asset_ids:
            uses[aid].append((sid, bid, claims))
        for name in re.findall(r"`([^`]+)`", values["Motion references"]):
            assert f"export function {name}(" in motion_code, f"{sid}: unknown motion {name}"
        transition = re.search(r"`([^`]+)`", values["Transition"]).group(1)
        assert f'| "{transition}"' in transition_code, f"{sid}: unknown transition"
        assert not re.search(r"\b(?:fictional|illustrative|hypothetical|demo)\b", values["On-screen text"], re.I), f"{sid}: decision 14 on-screen scenario label"
        covered.extend(pids)
        quoted.append(text)
    assert covered == list(range(1, len(paragraphs) + 1)), "Narration omitted, duplicated or reordered"
    assert norm(" ".join(quoted)) == norm(narration), "Narration coverage differs"
    for aid, asset in by_id.items():
        assert uses[aid], f"Unused asset: {aid}"
        assert asset["shot_ids"] == [u[0] for u in uses[aid]], f"{aid}: shot-use mismatch"
        assert asset["beat_ids"] == list(dict.fromkeys(u[1] for u in uses[aid])), f"{aid}: beat-use mismatch"
        assert set(asset["claim_ids"]) == set().union(*(u[2] for u in uses[aid])), f"{aid}: claim-use mismatch"
        assert asset["status"] == "pending" and asset["local_path"] is None and asset["sha256"] is None, f"{aid}: planning status changed"
        assert asset["verified_on"] is None and asset["verified_by"] is None
        assert asset["fallback_asset_id"] is None or asset["fallback_asset_id"] in by_id
    assert not re.search(r"\b\d+:\d{2}(?::\d{2})?(?:\.\d+)?\b", board), "Untimed board contains a timestamp"
    return {"shot_groups": len(ids), "paragraphs": len(paragraphs), "spoken_words": len(narration.split()), "pending_assets": len(assets), "narration_sha256": fingerprint}


def main():
    board = ROOT.joinpath("storyboard.md").read_text(encoding="utf-8")
    raw = ROOT.joinpath("narration.txt").read_bytes()
    manifest = json.loads(ROOT.joinpath("asset-manifest.json").read_text(encoding="utf-8"))
    result = check(board, raw, manifest)
    if "--self-test" in sys.argv:
        first_paragraph = raw.decode("utf-8").splitlines()[0]
        cases = [
            board.replace("**Visual purpose:**", "**Missing purpose:**", 1),
            board.replace("> " + first_paragraph, "> Omitted narration.", 1),
            board.replace("**Narration or story moment:** B01 / P01.", "**Narration or story moment:** B01 / P02.", 1),
            board.replace(hashlib.sha256(raw).hexdigest(), "0" * 64, 1),
            board.replace("**Required assets:** DG01, DG02, FO01.", "**Required assets:** DG99.", 1),
            board.replace("**On-screen text:** Charger; Delivery fee.", "**On-screen text:** Charger; Delivery fee; Illustrative example.", 1),
        ]
        for index, bad in enumerate(cases, 1):
            assert bad != board, f"Negative fixture {index} did not change the board"
            try:
                check(bad, raw, manifest)
            except AssertionError:
                continue
            raise AssertionError(f"Negative fixture {index} was accepted")
        result["negative_self_checks"] = len(cases)
    print(json.dumps({"status": "PASS", **result}, indent=2))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (AssertionError, KeyError, ValueError, OSError, AttributeError) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        sys.exit(1)
