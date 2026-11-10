"""Stills only: chronological and composition-grouped visual review sheets."""
import argparse
import json
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

parser = argparse.ArgumentParser()
parser.add_argument("packet", type=Path)
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()
if args.out.exists():
    raise SystemExit("Choose a fresh contact-sheet folder")
args.out.mkdir(parents=True)
board = json.loads((args.packet / "index.json").read_text(encoding="utf-8"))
panels = [(s, im) for s in board["scenes"] for im in s["images"]]
assert len(panels) == 99 and len(board["scenes"]) == 67
font = ImageFont.truetype("public/fonts/Inter.ttf", 18)

# Baseline v3 families were identified from the rendered panels and scene source.
def baseline(scene, image):
    sid, phase = scene["id"], Path(image["file"]).stem
    if sid in {"S05", "S11", "S48", "S50", "S51", "S52", "S64"}:
        return "split-screen"
    if sid in {"S21", "S22", "S61", "S62"}:
        return "angled-table"
    if sid in {"S03", "S06", "S15", "S23", "S25", "S26", "S28", "S29", "S35", "S44", "S46", "S55", "S58", "S67"} or phase.endswith(("current-plan", "earlier-month-three")):
        return "phone-and-desk"
    if sid in {"S19", "S20"} or phase.endswith(("rental", "older-rental", "newer-seat")):
        return "vehicle"
    if sid in {"S01", "S49"}:
        return "character-isolated"
    if phase.endswith("meal"):
        return "dining"
    return "desk-and-paper"

def sheet(items, path, columns=3, width=480):
    height = width * 9 // 16
    result = Image.new("RGB", (width * columns, (height + 38) * math.ceil(len(items) / columns)), "#e2e8f0")
    draw = ImageDraw.Draw(result)
    for index, (scene, panel) in enumerate(items):
        image = Image.open(args.packet / panel["file"]).convert("RGB")
        assert image.size == (960, 540)
        image.thumbnail((width, height))
        x, y = index % columns * width, index // columns * (height + 38)
        result.paste(image, (x, y))
        label = Path(panel["file"]).stem
        draw.text((x + 8, y + height + 6), label, font=font, fill="#14243a")
    result.save(path)

sheet(panels, args.out / "complete-episode.png", columns=9, width=240)
for start in range(0, len(panels), 12):
    sheet(panels[start:start + 12], args.out / f"sequence-{start + 1:03d}-{min(start + 12, len(panels)):03d}.png")
groups = {}
for scene, panel in panels:
    category = panel.get("design", {}).get("category") or baseline(scene, panel)
    groups.setdefault(category, []).append((scene, panel))
for category, items in groups.items():
    name = category.lower().replace(" ", "-")
    for start in range(0, len(items), 12):
        sheet(items[start:start + 12], args.out / f"group-{name}-{start // 12 + 1}.png")
recurring = [(s, im) for s, im in panels if (im["design"]["propFocus"] in {"phone", "desk", "document"} if "design" in im else baseline(s, im) in {"phone-and-desk", "desk-and-paper", "angled-table"})]
for start in range(0, len(recurring), 12):
    sheet(recurring[start:start + 12], args.out / f"recurring-props-{start // 12 + 1}.png")
(args.out / "index.json").write_text(json.dumps({"panels": len(panels), "groups": {k: len(v) for k, v in groups.items()}}, indent=2), encoding="utf-8")
print(f"Saved {len(panels)} panels in chronological, grouped and recurring-prop sheets: {args.out}")
