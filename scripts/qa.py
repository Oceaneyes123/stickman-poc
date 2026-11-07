"""Inspect local encoded output and create reproducible contact sheets. Requires Pillow + FFmpeg."""
import argparse
import json
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'out'
NAVY = '#14243A'


def run(args):
    result = subprocess.run(args, capture_output=True, text=True, check=True)
    return result.stdout


def sheet(paths, labels, output, columns=2, width=640):
    height = width * 9 // 16
    rows = (len(paths) + columns - 1) // columns
    canvas = Image.new('RGB', (columns * width, rows * (height + 38)), NAVY)
    draw = ImageDraw.Draw(canvas)
    for index, (path, label) in enumerate(zip(paths, labels)):
        image = Image.open(path).convert('RGB').resize((width, height), Image.Resampling.LANCZOS)
        x, y = index % columns * width, index // columns * (height + 38)
        canvas.paste(image, (x, y + 38))
        draw.text((x + 12, y + 12), label, fill='#F8FAFC')
    canvas.save(output)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--stills-only', action='store_true')
    args = parser.parse_args()
    manifest = json.loads((ROOT / 'src/timeline/generated.json').read_text())
    timeline = manifest['timeline']
    stills = OUT / 'stills'
    gallery = sorted(stills.glob('gallery-*.png'))
    sheet(gallery, [p.stem for p in gallery], OUT / 'gallery-contact-sheet.jpg', width=640)
    boundaries = sorted({scene['from'] + delta for scene in timeline['scenes'][1:] for delta in [-1, 0, 1]})
    sheet([stills / f'poc-{frame:04d}.png' for frame in boundaries], [f'Boundary / frame {frame}' for frame in boundaries], OUT / 'boundary-contact-sheet.jpg', columns=3, width=480)
    if args.stills_only:
        keys = [scene['from'] + min(180, int(scene['durationInFrames'] * 0.7)) for scene in timeline['scenes']]
        sheet([stills / f'poc-{frame:04d}.png' for frame in keys], [f'Beat {i+1} / frame {frame}' for i, frame in enumerate(keys)], OUT / 'preview-contact-sheet.jpg')
        return
    video = OUT / ('money-trap-poc.mp4' if manifest['audioPresent'] else 'money-trap-poc-silent-timing.mp4')
    metadata = json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(video)]))
    stream = next(s for s in metadata['streams'] if s['codec_type'] == 'video')
    assert (stream['width'], stream['height'], stream['codec_name'], stream['r_frame_rate'], stream['pix_fmt']) == (1920, 1080, 'h264', '30/1', 'yuv420p'), stream
    assert int(stream['nb_frames']) == timeline['durationInFrames'], stream['nb_frames']
    assert abs(float(stream['duration']) - timeline['durationMs'] / 1000) <= 1 / timeline['fps']
    audio = [s for s in metadata['streams'] if s['codec_type'] == 'audio']
    assert bool(audio) == manifest['audioPresent'], 'Audio stream does not match mode'
    # Decode every video/audio packet; a metadata-only probe cannot prove decodability.
    result = subprocess.run(['ffmpeg', '-v', 'error', '-xerror', '-i', str(video), '-f', 'null', '-'], capture_output=True, text=True, check=True)
    assert not result.stderr.strip(), result.stderr
    encoded = OUT / 'encoded-frames'
    encoded.mkdir(exist_ok=True)
    frames = []
    for i, scene in enumerate(timeline['scenes']):
        last_event = max(e['from'] for e in timeline['events'] if e['sceneId'] == scene['id'])
        frame = min(scene['from'] + scene['durationInFrames'] - 1, last_event + 70)
        output = encoded / f'beat-{i+1}.png'
        run(['ffmpeg', '-v', 'error', '-y', '-i', str(video), '-vf', rf'select=eq(n\,{frame})', '-frames:v', '1', str(output)])
        frames.append((output, f'Beat {i+1} / {scene["id"]} / frame {frame}'))
    sheet([f[0] for f in frames], [f[1] for f in frames], OUT / 'contact-sheet.jpg')
    # Mobile-size review uses a 480px-wide complete 16:9 frame, not a cropped layout.
    sheet([f[0] for f in frames], [f[1] for f in frames], OUT / 'mobile-contact-sheet.jpg', width=480)
    evidence = {'video': str(video), 'width': stream['width'], 'height': stream['height'], 'codec': stream['codec_name'], 'fps': stream['r_frame_rate'], 'pixelFormat': stream['pix_fmt'], 'frames': int(stream['nb_frames']), 'durationSeconds': float(stream['duration']), 'audioStreams': len(audio), 'fullDecode': 'passed', 'mode': timeline['mode'], 'syncVerified': False}
    (OUT / 'qa-evidence.json').write_text(json.dumps(evidence, indent=2) + '\n')
    (OUT / 'ffprobe.json').write_text(json.dumps(metadata, indent=2) + '\n')
    print(json.dumps(evidence, indent=2))


if __name__ == '__main__':
    main()
