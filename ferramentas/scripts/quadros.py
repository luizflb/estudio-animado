#!/usr/bin/env python
"""Quadros-chave e folhas de contato de um video, para o Claude ler (fluxo animador).
Uso: quadros.py <video> --pasta <saida> [--limiar 0.12] [--longa 5] [--fps 2] [--grade 6x5]
Um quadro por troca de cena (0,5 s depois do corte, fora da transicao), mais um a cada
--longa segundos em cena longa. Quadros em 320 px; folhas numeradas com o tempo.
Saida: <pasta>/quadros/q0001.jpg..., <pasta>/folhas/folha_01.jpg..., <pasta>/quadros.json"""
import argparse, json, pathlib, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ap = argparse.ArgumentParser()
ap.add_argument('video'); ap.add_argument('--pasta', required=True)
ap.add_argument('--limiar', type=float, default=0.12)
ap.add_argument('--longa', type=float, default=5.0)
ap.add_argument('--fps', type=float, default=2.0)
ap.add_argument('--grade', default='6x5')
a = ap.parse_args()
W, H = 320, 180
pasta = pathlib.Path(a.pasta); (pasta / 'quadros').mkdir(parents=True, exist_ok=True)
(pasta / 'folhas').mkdir(parents=True, exist_ok=True)

cmd = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', a.video, '-vf',
       f'fps={a.fps},scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2',
       '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
tam = W * H * 3

def tc(t):
    return f'{int(t // 60):02d}:{t % 60:04.1f}'

def assinatura(img):
    g = img.mean(axis=2)
    h = np.concatenate([np.histogram(img[..., c], 16, (0, 256))[0] for c in range(3)]) / (W * H)
    return g, h

escolhidos, ant, ultimo, i = [], None, -1e9, 0
while True:
    buf = proc.stdout.read(tam)
    if len(buf) < tam:
        break
    t = i / a.fps; i += 1
    img = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    g, h = assinatura(img)
    if ant is None:
        corte, score = True, 1.0
    else:
        # mistura diferenca de pixel e de histograma (0 a 1)
        score = 0.5 * np.abs(g - ant[0]).mean() / 255 + 0.5 * 0.5 * np.abs(h - ant[1]).sum() / 3
        corte = score >= a.limiar
    ant = (g, h)
    if corte:
        pend = {'t': t, 'tipo': 'corte', 'score': round(float(score), 3)}
        escolhidos.append(dict(pend, img=None, alvo=t + 0.5)); ultimo = t
        continue
    if escolhidos and escolhidos[-1]['img'] is None and t >= escolhidos[-1]['alvo']:
        escolhidos[-1]['img'] = img.copy(); escolhidos[-1]['t'] = t
        continue
    if t - ultimo >= a.longa:
        escolhidos.append({'t': t, 'tipo': 'cena_longa', 'score': round(float(score), 3), 'img': img.copy()}); ultimo = t
proc.wait()
dur = i / a.fps
if escolhidos and escolhidos[-1]['img'] is None:
    escolhidos.pop()
escolhidos = [e for e in escolhidos if e['img'] is not None]

indice = []
for n, e in enumerate(escolhidos, 1):
    nome = f'q{n:04d}.jpg'
    Image.fromarray(e['img']).save(pasta / 'quadros' / nome, quality=80)
    indice.append({'n': n, 't': round(e['t'], 2), 'tc': tc(e['t']), 'tipo': e['tipo'], 'score': e['score'], 'arquivo': nome})

cols, lins = map(int, a.grade.split('x'))
por = cols * lins
try:
    fonte = ImageFont.truetype('arialbd.ttf', 16)
except OSError:
    fonte = ImageFont.load_default()
folhas = []
for f in range(0, len(indice), por):
    lote = indice[f:f + por]
    folha = Image.new('RGB', (cols * W, lins * H), (20, 20, 20))
    d = ImageDraw.Draw(folha)
    for k, q in enumerate(lote):
        x, y = (k % cols) * W, (k // cols) * H
        folha.paste(Image.open(pasta / 'quadros' / q['arquivo']), (x, y))
        rot = f"{q['n']}  {q['tc']}" + ('' if q['tipo'] == 'corte' else ' +')
        d.rectangle([x, y, x + 8 + d.textlength(rot, font=fonte), y + 22], fill=(0, 0, 0))
        d.text((x + 4, y + 2), rot, fill=(255, 230, 0), font=fonte)
    nome = f'folha_{len(folhas) + 1:02d}.jpg'
    folha.save(pasta / 'folhas' / nome, quality=82)
    folhas.append({'arquivo': nome, 'de': lote[0]['tc'], 'ate': lote[-1]['tc'], 'quadros': [lote[0]['n'], lote[-1]['n']]})

(pasta / 'quadros.json').write_text(json.dumps({'video': a.video, 'duracao': round(dur, 2), 'limiar': a.limiar,
    'longa': a.longa, 'cortes': sum(q['tipo'] == 'corte' for q in indice), 'quadros': indice, 'folhas': folhas},
    ensure_ascii=False, indent=1), encoding='utf-8')
print(f'quadros: {len(indice)} (cortes {sum(q["tipo"] == "corte" for q in indice)}), folhas: {len(folhas)}, duracao {tc(dur)}')
