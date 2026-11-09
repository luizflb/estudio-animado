#!/usr/bin/env python3
"""Vetoriza uma cabeça raster (PNG transparente) em camadas SVG por cor, na escala da cabeça do pessoa_svg.js.

Uso: rec_vetorizar_cabeca.py <cabeca.png> <nome> --olhos x1 y x2 [--saida arquivo.js]
  --olhos: centros dos olhos na imagem (x esquerdo, y, x direito) para casar com os olhos do SVG (±88, -545).
Camadas (de baixo para cima): silhueta (contorno escuro), cabelo, pele, barba. Grava window.CABECAS[nome] = {camadas:[{cor, d}]}.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    a, b = pts[0], pts[-1]
    ab = b - a; n = np.hypot(*ab)
    if n < 1e-6:  # contorno fechado: simplifica as duas metades
        h = len(pts) // 2
        return np.vstack([rdp(pts[:h + 1], eps)[:-1], rdp(pts[h:], eps)])
    d = np.abs(ab[0] * (pts[:, 1] - a[1]) - ab[1] * (pts[:, 0] - a[0])) / n
    i = int(np.argmax(d))
    if d[i] > eps:
        return np.vstack([rdp(pts[:i + 1], eps)[:-1], rdp(pts[i:], eps)])
    return np.array([a, b])


def contornos(mask, transf, eps=1.2, area_min=40):
    m = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    arr = np.asarray(m).astype(float) / 255
    arr = np.pad(arr, 2)
    fig = plt.figure(); cs = plt.contour(arr, levels=[0.5]); plt.close(fig)
    d = []
    for seg in cs.allsegs[0]:
        if len(seg) < 4:
            continue
        seg = seg - 2  # tira o pad
        x, y = seg[:, 0], seg[:, 1]
        if abs(0.5 * np.dot(x, np.roll(y, 1)) - 0.5 * np.dot(y, np.roll(x, 1))) < area_min:
            continue
        s = rdp(seg, eps)
        p = transf(s)
        d.append('M ' + ' L '.join(f'{px:.1f} {py:.1f}' for px, py in p) + ' Z')
    return ' '.join(d)


def main():
    arq, nome = sys.argv[1], sys.argv[2]
    i = sys.argv.index('--olhos'); ox1, oy, ox2 = map(float, sys.argv[i + 1:i + 4])
    saida = sys.argv[sys.argv.index('--saida') + 1] if '--saida' in sys.argv else os.path.expanduser(f'~/.animador/perfil/pecas/rig2/cabeca_{nome}.js')
    im = np.asarray(Image.open(arq).convert('RGBA')).astype(int)
    a = im[..., 3] > 128; r, g, b = im[..., 0], im[..., 1], im[..., 2]; L = (r + g + b) / 3
    k = 176 / (ox2 - ox1); cx = (ox1 + ox2) / 2
    transf = lambda s: np.column_stack([(s[:, 0] - cx) * k, -545 + (s[:, 1] - oy) * k])
    pele = a & (r > 170)
    barba = a & (L >= 20) & (L < 44) & (np.abs(b - r) < 10) & ~pele
    cabelo = a & (L >= 40) & (L < 100) & (r < 150) & ~barba
    def cor_media(mk, padrao):
        return '#%02x%02x%02x' % tuple(int(v) for v in im[..., :3][mk].mean(0)) if mk.any() else padrao
    camadas = [dict(nome='silhueta', cor='#18161c', d=contornos(a, transf)),
               dict(nome='cabelo', cor=cor_media(cabelo, '#3a3a42'), d=contornos(cabelo, transf)),
               dict(nome='pele', cor=cor_media(pele, '#F4A46A'), d=contornos(pele, transf)),
               dict(nome='barba', cor=cor_media(barba, '#202020'), d=contornos(barba, transf))]
    ys, xs = np.where(a)
    info = dict(escala=round(k, 4), topo=round(-545 + (ys.min() - oy) * k, 1), base=round(-545 + (ys.max() - oy) * k, 1), camadas=camadas)
    open(saida, 'w', encoding='utf-8').write(f'window.CABECAS = window.CABECAS || {{}};\nwindow.CABECAS["{nome}"] = ' + json.dumps(info, ensure_ascii=False) + ';\n')
    print(saida, {c['nome']: len(c['d']) for c in camadas}, 'topo', info['topo'], 'base', info['base'])


if __name__ == '__main__':
    main()
