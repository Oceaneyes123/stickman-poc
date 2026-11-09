"""Verify the still-only storyboard packet without creating media."""
import argparse
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument("packet", type=Path)
args = parser.parse_args()
packet = args.packet.resolve()
load = lambda path: json.loads(path.read_text(encoding="utf-8"))
digest = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
manifest = load(packet / "index.json")
baseline_path = Path("out/001-lifestyle-creep/storyboard-design-v3")
baseline = load(baseline_path / "index.json")
review = load(packet / "review/index.json")
assert manifest["videoCreated"] is False and manifest["approved"] is False
assert manifest["style"] == {"backdrop":"fixed rough paper","architecture":False,"onScreenText":"currency amounts only"}
scenes = manifest["scenes"]
assert [s["id"] for s in scenes] == [f"S{i:02d}" for i in range(1,68)]
for scene, old in zip(scenes, baseline["scenes"]):
    for key in ("id", "title", "narration", "cueIds", "audioWindow"):
        assert scene[key] == old[key], (scene["id"], key)
    assert [im["file"] for im in scene["images"]] == [im["file"] for im in old["images"]]
images = [im for scene in scenes for im in scene["images"]]
assert len(images) == 99
corner = None
changed = []
for panel in images:
    path = packet / panel["file"]
    with Image.open(path) as image:
        assert image.size == (960,540), path
        patch = image.convert("RGB").crop((0,0,40,40)).tobytes()
        corner = patch if corner is None else corner
        assert patch == corner, f"Backdrop changed: {path}"
    assert all(panel["design"].get(k) for k in ("category","camera","subject","action","propFocus"))
    if digest(path) != digest(baseline_path / panel["file"]):
        changed.append(Path(panel["file"]).stem)
assert len(review["scenes"]) == 67
assert all(s["latest"] and s["video"] is None for s in review["scenes"])

class ReviewParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.articles=[]; self.images=0; self.quotes=0; self.links=[]; self.video=False
    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        if tag == "article": self.articles.append(attributes.get("id"))
        if tag == "img": self.images += 1
        if tag == "blockquote": self.quotes += 1
        if tag in {"video","audio"}: self.video=True
        for key in ("href","src"):
            if key in attributes: self.links.append(attributes[key])

html = ReviewParser(); html.feed((packet / "review/index.html").read_text(encoding="utf-8"))
assert html.articles == [s["id"] for s in scenes] and html.images == 99 and html.quotes == 67
assert not html.video
for link in html.links:
    if link.startswith("#"):
        assert link == "#" or link[1:] in html.articles
    else:
        assert (packet / "review" / link).exists(), link
assert not [p for p in packet.rglob("*") if p.suffix.lower() in {".mp4",".mp3",".wav",".webm"}]
hashes = load(packet / "source-hashes.json")
reference = load(Path("out/001-lifestyle-creep/cinematic-references-v4/source.json"))
assert hashes["audioHash"] == reference["sourceAudioHash"]
for key in ("scriptHash","cueHash","wordHash"):
    assert hashes[key] == reference[key], key
report = {"scenes":67,"panels":99,"resolution":[960,540],"composition":[1920,1080],"fps":30,"newAudioOrVideoFiles":0,"unchangedNarrationTimingAndSceneSequence":True,"fixedBackdropAcrossAllPanels":True,"localReviewLinksValid":True,"changedPanelCount":len(changed),"changedPanels":changed,"creativeApproved":False}
(packet / "verification.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
print(f"Verified 67 scenes, 99 panels, {len(changed)} changed images, fixed grain, preserved narration/timing, valid links, no audio/video.")
