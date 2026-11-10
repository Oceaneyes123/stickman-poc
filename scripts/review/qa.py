"""Verify local review video and create encoded contact sheet. Requires Pillow and FFmpeg."""
import argparse
import json
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True).stdout


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('video', type=Path)
    parser.add_argument('--frames', type=int, help='Expected frame count')
    args = parser.parse_args()
    video = args.video.resolve(strict=True)
    metadata = json.loads(run(['ffprobe', '-v', 'error', '-show_streams',
                               '-show_format', '-of', 'json', str(video)]))
    stream = next(s for s in metadata['streams'] if s['codec_type'] == 'video')
    assert (stream['width'], stream['height'], stream['codec_name'],
            stream['r_frame_rate'], stream['pix_fmt']) == (1920, 1080, 'h264', '30/1', 'yuv420p'), stream
    count = int(stream['nb_frames'])
    assert count > 0, count
    if args.frames is not None:
        assert count == args.frames, (count, args.frames)
    assert abs(float(stream['duration']) - count / 30) <= 1 / 30
    run(['ffmpeg', '-v', 'error', '-xerror', '-i', str(video), '-f', 'null', '-'])
    output = video.parent / f'{video.stem}-qa'
    output.mkdir(exist_ok=True)
    sheet = Image.new('RGB', (1280, 1194), '#14243A')
    draw = ImageDraw.Draw(sheet)
    for index in range(6):
        frame = round(index * (count - 1) / 5)
        path = output / f'frame-{frame:04d}.png'
        run(['ffmpeg', '-v', 'error', '-y', '-i', str(video), '-vf',
             rf'select=eq(n\,{frame})', '-frames:v', '1', str(path)])
        with Image.open(path) as image:
            x, y = index % 2 * 640, index // 2 * 398
            sheet.paste(image.convert('RGB').resize((640, 360), Image.Resampling.LANCZOS), (x, y + 38))
            draw.text((x + 12, y + 12), f'Frame {frame}', fill='#F8FAFC')
    sheet.save(output / 'contact-sheet.jpg')
    evidence = {'video': str(video), 'frames': count, 'fullDecode': 'passed',
                'visualApproval': 'requires human review'}
    (output / 'ffprobe.json').write_text(json.dumps(metadata, indent=2) + chr(10))
    (output / 'evidence.json').write_text(json.dumps(evidence, indent=2) + chr(10))
    print(json.dumps(evidence, indent=2))


if __name__ == '__main__':
    main()
