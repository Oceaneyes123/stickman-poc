"""Focused regression checks for this film's grip and insertion."""
import json
import math
from pathlib import Path
from playwright.sync_api import sync_playwright

folder = Path(__file__).resolve().parent
states = sorted((s for p in (folder/'shots').glob('st_*.json') for s in json.loads(p.read_text())), key=lambda s:s['f'])
assert [s['f'] for s in states] == list(range(300)), 'Expected exactly 300 sequential frames'
for s in states:
    for p in s['people'].values():
        assert max(p['over'].values()) < 1, f"Unreachable hand at frame {s['f']}"
    for name, a, b in s['contacts']:
        assert math.dist(a,b) < 3, f"Lost {name} at frame {s['f']}"
with sync_playwright() as p:
    browser = p.chromium.launch(args=['--allow-file-access-from-files'])
    page = browser.new_page()
    page.goto((folder/'index.html').as_uri())
    page.wait_for_function('window.READY')
    cash, wallet, cuts = page.evaluate('[cashAt(8.15),walletAt(9.2),FILM.cuts]')
    assert cash['y']-39 > wallet['y'], 'Cash must be fully below the wallet opening'
    assert wallet['close'] == 1, 'Wallet must close after deposit'
    assert cuts == [0,75,135,255,300]
    browser.close()
print('PASS: 300 frames, reachable hands, continuous grips, fully inserted cash, closed wallet.')
