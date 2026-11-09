#!/usr/bin/env python
"""Silencios (>= min) e transcricao por frase, a partir do palavras.json. Nao corta nada.
Uso: frases.py <palavras.json> <wav> --pasta <saida> [--min 0.3] [--grafia "errado=certo,..."]
A grafia so anota ao lado: o texto falado nao muda."""
import json, pathlib, re, subprocess, sys

def arg(n, d=None):
    return sys.argv[sys.argv.index(n) + 1] if n in sys.argv else d

d = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
wav = sys.argv[2]; pasta = pathlib.Path(arg('--pasta')); minimo = float(arg('--min', '0.3'))
grafia = dict(x.split('=') for x in arg('--grafia', '').split(',') if x)
P, dur = d['palavras'], d['duracao']

log = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', wav, '-af', f'silencedetect=n=-35dB:d={minimo}', '-f', 'null', '-'],
                     capture_output=True, text=True, encoding='utf-8', errors='replace').stderr
ss = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', log)]
se = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
ffm = list(zip(ss, se + [dur] * (len(ss) - len(se))))

sil = []
for a, b in [(0.0, P[0]['ini'])] + [(P[i]['fim'], P[i + 1]['ini']) for i in range(len(P) - 1)] + [(P[-1]['fim'], dur)]:
    if b - a >= minimo:
        coberto = sum(max(0, min(b, y) - max(a, x)) for x, y in ffm)
        sil.append({'ini': round(a, 3), 'fim': round(b, 3), 'dur': round(b - a, 3),
                    'quieto': round(coberto / (b - a), 2)})  # quieto baixo = tem som sem palavra

def tc(t):
    return f'{int(t // 60):02d}:{t % 60:06.3f}'

fr, cur = [], []
for i, w in enumerate(P):
    cur.append(w)
    prox = P[i + 1]['ini'] - w['fim'] if i + 1 < len(P) else 99
    if re.search(r'[.!?]$', w['w']) or prox >= 0.5:
        fr.append({'id': f'f{len(fr) + 1:03d}', 'ini': cur[0]['ini'], 'fim': w['fim'], 'texto': ' '.join(x['w'] for x in cur),
                   'pausa_depois': round(prox, 3) if prox != 99 else None,
                   'duvidas': [x['w'] for x in cur if (x.get('score') or 1) < 0.4 or x.get('interpolado')]})
        cur = []

def anota(t):
    for e, c in grafia.items():
        t = re.sub(e, lambda m: f'{m.group(0)} [{c}]', t)
    return t

L = [f'# Transcricao por frase ({dur:.1f} s, motor {d["motor"]["modelo"]})', '']
pos = 0
for f in fr:
    L.append(f"{f['id']} [{tc(f['ini'])} - {tc(f['fim'])}] {anota(f['texto'])}" + (f"  (duvida: {', '.join(f['duvidas'])})" if f['duvidas'] else ''))
    if f['pausa_depois'] and f['pausa_depois'] >= minimo:
        L.append(f"     ... pausa {f['pausa_depois']:.2f} s")
pasta.mkdir(parents=True, exist_ok=True)
(pasta / 'frases.md').write_text('\n'.join(L) + '\n', encoding='utf-8')
(pasta / 'frases.json').write_text(json.dumps(fr, ensure_ascii=False, indent=0), encoding='utf-8')
(pasta / 'silencios.json').write_text(json.dumps(sil, ensure_ascii=False, indent=0), encoding='utf-8')
print('\n'.join(L))
print('\nsilencios:', len(sil), 'total', round(sum(s['dur'] for s in sil), 2), 's; com som sem palavra (quieto<0.5):',
      [s for s in sil if s['quieto'] < 0.5])
