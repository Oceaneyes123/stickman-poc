"""Local sound effects only; no voice or music."""
import json, os, sys
sys.path.insert(0, os.environ['STICKMAN_SCRIPTS'])
from audio_kit import Mix, SR
import numpy as np
info = json.load(open('film.json'))
m = Mix(info['dur'], seed=9)
for e in info['events']:
    t, k = e['t'], e['k']
    if k == 'key':
        a = np.arange(int(SR * .10)) / SR
        m.put(t, np.sin(2*np.pi*880*a)*np.sin(np.pi*a/.10)**2, .12, .3, .04)
    elif k == 'motor':
        m.nb(t, 120, 1300, 1.1, .12, .25, .11, .3)
    elif k == 'paper':
        m.nb(t, 650, 5200, .5, .07, .22, .17)
    elif k == 'close':
        m.cloth(t, g=.2)
        m.nb(t+.12, 150, 900, .1, .01, .07, .2)
m.write('audio.wav')
