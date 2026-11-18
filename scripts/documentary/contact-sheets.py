"""Build labeled documentary scene and gallery contact sheets from PNG stills."""
import argparse
from pathlib import Path
from PIL import Image, ImageDraw


def make_sheet(images: list[tuple[str, Path]], out_path: Path, cols: int):
    rows = max(1, (len(images) + cols - 1) // cols)
    cell_w, cell_h = 640, 360
    header_h = 38
    sheet = Image.new("RGB", (cols * cell_w, rows * (cell_h + header_h)), "#14243A")
    draw = ImageDraw.Draw(sheet)

    for idx, (label, path) in enumerate(images):
        col = idx % cols
        row = idx // cols
        x = col * cell_w
        y = row * (cell_h + header_h)
        with Image.open(path) as img:
            thumb = img.convert("RGB").resize((cell_w, cell_h), Image.Resampling.LANCZOS)
            sheet.paste(thumb, (x, y + header_h))
        draw.text((x + 14, y + 11), label, fill="#F8FAFC")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path, quality=92)
    print(f"Wrote contact sheet {out_path} ({len(images)} panels)")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--stills-dir", type=Path, required=True)
    parser.add_argument("--gallery-dir", type=Path, required=True)
    parser.add_argument("--out-dir", type=Path, required=True)
    args = parser.parse_args()

    scene_files = sorted(args.stills_dir.glob("s*.png"))
    if scene_files:
        make_sheet(
            [(p.stem.upper(), p) for p in scene_files],
            args.out_dir / "contact-sheet.jpg",
            cols=2,
        )

    gallery_files = sorted(args.gallery_dir.glob("p*.png"))
    if gallery_files:
        make_sheet(
            [(p.stem, p) for p in gallery_files],
            args.out_dir / "gallery-contact-sheet.jpg",
            cols=4,
        )


if __name__ == "__main__":
    main()
