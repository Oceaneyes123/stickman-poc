"""Assemble local reference render samples for visual inspection."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json
import math
import sys

root = Path(sys.argv[1])
font = ImageFont.truetype("public/fonts/Inter.ttf", 17)
for directory in (p for p in root.iterdir() if (p / "frame-index.json").is_file()):
    frames = json.loads((directory / "frame-index.json").read_text())
    def sheet(items, name):
        canvas = Image.new("RGB", (1600, math.ceil(len(items) / 4) * 260), "#e2e8f0")
        draw = ImageDraw.Draw(canvas)
        for i, item in enumerate(items):
            image = Image.open(directory / "frames" / f"{item['frame']:05}.png")
            image.thumbnail((400, 225))
            x, y = i % 4 * 400, i // 4 * 260
            canvas.paste(image, (x, y))
            label = f"F{item['frame']} " + ", ".join(item["beats"])
            draw.text((x + 8, y + 230), label[:43], font=font, fill="#14243a")
        canvas.save(directory / name)
    sheet(frames, "contact-sheet.png")
    sequence = json.loads((directory / "direction.json").read_text())
    last = sequence["timeline"]["durationInFrames"] - 1
    wanted = sorted({0, last, *(min(last, beat["endFrame"]) for beat in sequence["beats"]
        if beat.get("financial") or beat["action"] in ("file", "place", "open", "walk", "lift", "settle", "read"))})
    heroes = [min(frames, key=lambda item: abs(item["frame"] - frame)) for frame in wanted]
    sheet(heroes, "hero-sheet.png")
