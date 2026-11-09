#!/usr/bin/env python3
"""Separa uma folha de peças (fundo branco liso, grade de qualquer tamanho) em PNGs transparentes, um por peça.

Uso: rec_folha_pecas.py <folha.png> <pasta_saida> [--nomes n1 n2 ...] [--conferir conferencia.png] [--dilatar N] [--celulas 6,4]
- --dilatar N: quanto juntar pedaços vizinhos antes de separar (padrão 3; 0 separa peças que quase se encostam).
- --celulas 6,4: folhas de quadros (efeitos): cada linha da folha é cortada em N quadros (aqui 6 na 1a, 4 na 2a), pelos vãos mais próximos de larguras iguais.
- Fundo: pixels claros ligados à borda viram transparentes (o contorno escuro do traço segura o recorte).
  Com --buracos, áreas claras fechadas grandes (entre os dedos, dentro de alças) também viram fundo.
- Peças: componentes ligados. Pedaços pequenos (linhas de movimento, faíscas, gotas) são juntados à peça
  mais próxima; se estiverem longe de tudo, viram peça própria quando não forem minúsculos.
- Ordem: por linha (de cima para baixo) e, na linha, da esquerda para a direita.
- Sem --nomes: salva 01.png, 02.png... Com --nomes: precisa bater com a contagem, senão salva numerado e avisa.
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

TOL = 38          # distância de cor até o branco do fundo
BURACO_MIN = 0.0006   # fração da folha para um buraco fechado claro virar fundo
PECA_MIN = 0.0020     # fração da folha para ser peça própria
MINUSCULO = 0.00008   # abaixo disso, some
JUNTA_DIST = 0.06     # fração do lado da folha: até onde um pedaço pequeno se junta à peça vizinha
MARGEM = 6
BURACOS = '--buracos' in sys.argv  # só com --buracos: áreas claras fechadas (entre dedos, alças) viram fundo. Padrão desligado: camisa branca, prato e fumaça não somem


def mascara(img):
    rgb = np.asarray(img.convert('RGB')).astype(np.float32)
    h, w, _ = rgb.shape
    borda = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    fundo = np.median(borda, axis=0)
    claro = np.sqrt(((rgb - fundo) ** 2).sum(-1)) < TOL
    lab, n = ndimage.label(claro)
    ligados = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fundo_m = np.isin(lab, list(ligados))
    # buracos claros fechados e grandes (entre dedos, alças)
    tam = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
    grandes = [i + 1 for i, t in enumerate(tam) if t > BURACO_MIN * h * w and (i + 1) not in ligados]
    if BURACOS:
        fundo_m |= np.isin(lab, grandes)
    return ~fundo_m, rgb


def separar(m, dil=3):
    h, w = m.shape
    lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=dil) if dil else m)
    lab = lab * m
    objs = ndimage.find_objects(lab)
    area = ndimage.sum(m, lab, range(1, n + 1))
    cent = ndimage.center_of_mass(m, lab, range(1, n + 1))
    big = [i for i in range(n) if area[i] >= PECA_MIN * h * w]
    grupos = {i: [i] for i in big}
    for i in range(n):
        if i in grupos or area[i] < MINUSCULO * h * w:
            continue
        if big:
            d = [np.hypot(cent[i][0] - cent[j][0], cent[i][1] - cent[j][1]) for j in big]
            j = big[int(np.argmin(d))]
            # distância até a caixa da peça grande (não até o centro)
            sy, sx = objs[j]
            dy = max(sy.start - cent[i][0], 0, cent[i][0] - sy.stop); dx = max(sx.start - cent[i][1], 0, cent[i][1] - sx.stop)
            if np.hypot(dy, dx) < JUNTA_DIST * max(h, w):
                grupos[j].append(i); continue
        grupos[i] = [i]
    pecas = []
    for k, membros in grupos.items():
        mm = np.isin(lab, [x + 1 for x in membros])
        ys, xs = np.where(mm)
        pecas.append(dict(mask=mm, y0=ys.min(), y1=ys.max(), x0=xs.min(), x1=xs.max(), cy=(ys.min() + ys.max()) / 2, cx=(xs.min() + xs.max()) / 2))
    # linhas: agrupa por sobreposição vertical
    pecas.sort(key=lambda p: p['cy'])
    linhas = []
    for p in pecas:
        for L in linhas:
            if p['y0'] < L['y1'] - 0.35 * (L['y1'] - L['y0']) and p['cy'] > L['y0']:
                L['itens'].append(p); L['y1'] = max(L['y1'], p['y1']); break
        else:
            linhas.append(dict(y0=p['y0'], y1=p['y1'], itens=[p]))
    ordem = []
    for L in linhas:
        ordem += sorted(L['itens'], key=lambda p: p['cx'])
    return ordem


def por_celulas(m, cols):
    h, w = m.shape
    lin = m.any(1); faixas = []; y = 0
    while y < h:
        if lin[y]:
            y0 = y
            while y < h and lin[y]: y += 1
            faixas.append([y0, y])
        y += 1
    alt = max(b - a for a, b in faixas)
    juntas = []
    for f in faixas:
        if juntas and (f[0] - juntas[-1][1] < 0.25 * alt or ((f[1] - f[0]) < 0.15 * alt and f[0] - juntas[-1][1] < 0.6 * alt)):
            juntas[-1][1] = f[1]
        else:
            juntas.append(list(f))
    juntas = [f for f in juntas if f[1] - f[0] > 0.1 * alt]
    if len(juntas) != len(cols):
        print(f'AVISO: {len(juntas)} linhas achadas, {len(cols)} pedidas')
    pecas = []
    for (y0, y1), n in zip(juntas, cols):
        colx = m[y0:y1].any(0); xs = np.where(colx)[0]; a, b = xs.min(), xs.max()
        cortes = [a]
        for k in range(1, n):
            alvo = a + (b - a) * k / n; jan = int((b - a) / n * 0.35)
            vaos = [x for x in range(int(alvo) - jan, int(alvo) + jan) if not colx[x]]
            cortes.append(min(vaos, key=lambda x: abs(x - alvo)) if vaos else int(alvo))
        cortes.append(b + 1)
        for k in range(n):
            mm = np.zeros_like(m); mm[y0:y1, cortes[k]:cortes[k + 1]] = m[y0:y1, cortes[k]:cortes[k + 1]]
            ys, xx = np.where(mm)
            if len(ys): pecas.append(dict(mask=mm, y0=ys.min(), y1=ys.max(), x0=xx.min(), x1=xx.max()))
    return pecas


def main():
    ent, sai = sys.argv[1], sys.argv[2]
    nomes = sys.argv[sys.argv.index('--nomes') + 1:] if '--nomes' in sys.argv else None
    if nomes:
        corte = [i for i, x in enumerate(nomes) if x.startswith('--')]
        nomes = nomes[:corte[0]] if corte else nomes
    conf = sys.argv[sys.argv.index('--conferir') + 1] if '--conferir' in sys.argv else None
    img = Image.open(ent)
    m, rgb = mascara(img)
    dil = int(sys.argv[sys.argv.index('--dilatar') + 1]) if '--dilatar' in sys.argv else 3
    if '--celulas' in sys.argv:
        pecas = por_celulas(m, [int(x) for x in sys.argv[sys.argv.index('--celulas') + 1].split(',')])
    else:
        pecas = separar(m, dil)
    if nomes and len(nomes) != len(pecas):
        print(f'AVISO {os.path.basename(ent)}: {len(pecas)} peças achadas, {len(nomes)} nomes; salvo numerado')
        nomes = None
    os.makedirs(sai, exist_ok=True)
    h, w = m.shape
    rgba = np.dstack([rgb.astype(np.uint8), np.zeros((h, w), np.uint8)])
    saidas = []
    for i, p in enumerate(pecas):
        y0, y1 = max(p['y0'] - MARGEM, 0), min(p['y1'] + MARGEM + 1, h)
        x0, x1 = max(p['x0'] - MARGEM, 0), min(p['x1'] + MARGEM + 1, w)
        a = ndimage.gaussian_filter(p['mask'].astype(np.float32), 0.6)[y0:y1, x0:x1]
        pe = rgba[y0:y1, x0:x1].copy(); pe[..., 3] = np.clip(a * 255 * 1.3, 0, 255).astype(np.uint8)
        nome = (nomes[i] if nomes else f'{i + 1:02d}') + '.png'
        Image.fromarray(pe).save(os.path.join(sai, nome)); saidas.append((nome, p))
    if conf:
        c = img.convert('RGB').copy(); d = ImageDraw.Draw(c)
        for nome, p in saidas:
            d.rectangle([p['x0'], p['y0'], p['x1'], p['y1']], outline=(220, 40, 40), width=4)
            d.text((p['x0'] + 6, p['y0'] + 4), nome[:-4], fill=(220, 40, 40))
        c.thumbnail((900, 900)); c.save(conf)
    print(f'{os.path.basename(ent)}: {len(pecas)} peças')


if __name__ == '__main__':
    main()
