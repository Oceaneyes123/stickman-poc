"""Create inspection crops from the actual character renders, without repainting them."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT / 'out/characters/hand-refinement'
font = ImageFont.truetype(str(PROJECT / 'public/fonts/Inter.ttf'), 21)
expressions = ['neutral', 'happy', 'excited', 'confident', 'thinking', 'curious', 'worried', 'stressed', 'shocked', 'sad', 'frustrated', 'relieved']
source = Image.open(ROOT / 'expressions.png').convert('RGB')
assert source.size == (3840, 2160)
faces = Image.new('RGB', (1440, 1160), '#F5F1E8')
draw = ImageDraw.Draw(faces)
for i, expression in enumerate(expressions):
    base_x, y = 180 + i % 6 * 310, 340 + i // 6 * 360
    for identity, dx in [('Sam', -60), ('Alex', 70)]:
        index = i * 2 + (identity == 'Alex')
        x = base_x + dx
        crop = source.crop(((x-62)*2, (y-66)*2, (x+62)*2, (y+64)*2))
        crop.thumbnail((224, 235), Image.Resampling.LANCZOS)
        left, top = index % 6 * 240, index // 6 * 290
        faces.paste(crop, (left + (240-crop.width)//2, top+8))
        draw.text((left+10, top+250), f'{identity} / {expression}', fill='#0F172A', font=font)
faces.save(ROOT / 'eyebrow-review.jpg')

hands = Image.new('RGB', (1680, 720), '#F5F1E8')
draw = ImageDraw.Draw(hands)
for i, (label, name, box) in enumerate([
    ('Relaxed hand / cuff', 'hero', (395, 635, 455, 715)),
    ('Wave / palm silhouette', 'hero', (615, 285, 725, 400)),
    ('Explaining / open palm', 'hero', (1560, 430, 1700, 535)),
    ('Celebration / closed fist', 'actions', (90, 330, 165, 425)),
    ('Point / wrist connection', 'actions', (805, 350, 875, 445)),
    ('Wallet / grip placement', 'actions', (1170, 530, 1310, 640)),
    ('Thinking / chin contact', 'poses', (1295, 295, 1400, 365)),
    ('Stressed / temple contact', 'poses', (610, 630, 685, 720)),
]):
    image = Image.open(ROOT / f'{name}.png').convert('RGB')
    crop = image.crop(tuple(value*2 for value in box))
    crop.thumbnail((380, 290), Image.Resampling.LANCZOS)
    x, y = i % 4 * 420, i // 4 * 360
    hands.paste(crop, (x+(420-crop.width)//2, y+45+(290-crop.height)//2))
    draw.text((x+15, y+12), label, fill='#0F172A', font=font)
hands.save(ROOT / 'hand-review.jpg')
print('Saved eyebrow-review.jpg (all 24 faces) and hand-review.jpg (eight hand/wrist details).')
