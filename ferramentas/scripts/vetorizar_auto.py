#!/usr/bin/env python3
"""Vetoriza a cabeça de QUALQUER personagem (imagem PNG com fundo transparente ou liso) em camadas SVG por cor,
na escala da cabeça do pessoa_svg.js, para o personagem ficar idêntico à imagem e animar com o rig.

Uso:
  vetorizar_auto.py <imagem> <nome> --olhos XE Y XD [--cores 6] [--apagar x,y,rx,ry ...] [--fundo auto|#hex] [--cortar y_queixo]
- --olhos: centros dos olhos na imagem (x do olho esquerdo, y, x do olho direito). Ache olhando a imagem com uma grade.
- --apagar: elipses pintadas com a cor da pele antes de vetorizar (olhos, sobrancelhas e boca da imagem, que o rig
  troca por versões animáveis). Óculos, cabelo, barba e orelhas ficam.
- --cores: quantas cores (camadas). 5 a 8 costuma bastar; o contorno escuro vira a camada de baixo (silhueta).
- --cortar: corta a imagem abaixo dessa altura (pescoço/corpo), para vetorizar só a cabeça.
- --fundo: cor do fundo liso a tirar (auto = cor das bordas), se a imagem não tiver transparência.
Grava ~/.animador/perfil/pecas/rig2/cabeca_<nome>.js e acrescenta <nome> à lista cabecas_lista.js.
"""
import argparse, json, os, sys
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rec_vetorizar_cabeca import contornos  # mesmo traçado (contorno suavizado + simplificação)

RIG = os.path.expanduser('~/.animador/perfil/pecas/rig2')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('imagem'); ap.add_argument('nome'); ap.add_argument('--olhos', nargs=3, type=float, required=True)
    ap.add_argument('--cores', type=int, default=6); ap.add_argument('--apagar', nargs='*', default=[]); ap.add_argument('--fundo', default='auto')
    ap.add_argument('--cortar', type=float)
    a = ap.parse_args()
    im = Image.open(a.imagem).convert('RGBA')
    arr = np.asarray(im).astype(int)
    alfa = arr[..., 3] > 128
    if alfa.all():  # sem transparência: tira o fundo liso pela cor das bordas
        bordas = np.concatenate([arr[0, :, :3], arr[-1, :, :3], arr[:, 0, :3], arr[:, -1, :3]])
        fundo = np.median(bordas, 0) if a.fundo == 'auto' else np.array([int(a.fundo[i:i + 2], 16) for i in (1, 3, 5)])
        alfa = np.sqrt(((arr[..., :3] - fundo) ** 2).sum(-1)) > 40
    if a.cortar:
        alfa[int(a.cortar):] = False
    ox1, oy, ox2 = a.olhos
    # pele: amostra na testa, entre as sobrancelhas (abaixo dos olhos pode cair na barba); fica a cor clara mais comum
    d = ox2 - ox1; cx0 = int((ox1 + ox2) / 2)
    y0, y1 = int(oy - 0.6 * d), int(oy - 0.3 * d)
    amostra = arr[max(y0, 0):max(y1, 1), max(int(cx0 - 0.2 * d), 0):int(cx0 + 0.2 * d)].reshape(-1, 4)
    amostra = amostra[amostra[:, 3] > 128][:, :3]
    claros = amostra[amostra.sum(1) > np.percentile(amostra.sum(1), 40)] if len(amostra) else amostra
    pele = tuple(int(v) for v in np.median(claros, 0)) if len(claros) else (240, 180, 140)
    if a.apagar:
        d = ImageDraw.Draw(im)
        for e in a.apagar:
            x, y, rx, ry = map(float, e.split(','))
            d.ellipse([x - rx, y - ry, x + rx, y + ry], fill=pele + (255,))
        arr = np.asarray(im).astype(int)
    rgb = Image.fromarray(arr[..., :3].astype(np.uint8))
    q = rgb.quantize(colors=a.cores, method=Image.Quantize.MEDIANCUT)
    idx = np.asarray(q); pal = q.getpalette()[:a.cores * 3]
    k = 176 / (ox2 - ox1); cx = (ox1 + ox2) / 2
    transf = lambda s: np.column_stack([(s[:, 0] - cx) * k, -545 + (s[:, 1] - oy) * k])
    camadas = []
    lum = lambda c: 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]
    cores = []
    for i in range(a.cores):
        m = alfa & (idx == i)
        if m.sum() < 200:
            continue
        cor = pal[i * 3:i * 3 + 3]
        cores.append((m.sum(), i, cor, m))
    escura = min(cores, key=lambda c: lum(c[2]))
    # silhueta inteira na cor mais escura (vira o contorno); depois as outras cores, da maior área para a menor
    camadas.append(dict(nome='silhueta', cor='#%02x%02x%02x' % tuple(escura[2]), d=contornos(alfa, transf)))
    for area, i, cor, m in sorted(cores, key=lambda c: -c[0]):
        if i == escura[1]:
            continue
        camadas.append(dict(nome=f'cor{i}', cor='#%02x%02x%02x' % tuple(cor), d=contornos(m, transf)))
    ys, xs = np.where(alfa)
    info = dict(escala=round(k, 4), pele='#%02x%02x%02x' % pele, topo=round(-545 + (ys.min() - oy) * k, 1), base=round(-545 + (ys.max() - oy) * k, 1), camadas=camadas)
    os.makedirs(RIG, exist_ok=True)
    out = os.path.join(RIG, f'cabeca_{a.nome}.js')
    open(out, 'w', encoding='utf-8').write(f'window.CABECAS = window.CABECAS || {{}};\nwindow.CABECAS["{a.nome}"] = ' + json.dumps(info, ensure_ascii=False) + ';\n')
    lista_p = os.path.join(RIG, 'cabecas_lista.js')
    lista = []
    if os.path.exists(lista_p):
        t = open(lista_p, encoding='utf-8').read()
        lista = json.loads(t[t.index('['):t.rindex(']') + 1])
    if a.nome not in lista:
        lista.append(a.nome)
    open(lista_p, 'w', encoding='utf-8').write('window.CABECAS_LISTA = ' + json.dumps(lista) + ';\n')
    print(out, len(camadas), 'camadas | pele', info['pele'], '| topo', info['topo'], 'base', info['base'])


if __name__ == '__main__':
    main()
