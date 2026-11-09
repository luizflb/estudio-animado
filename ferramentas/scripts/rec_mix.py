#!/usr/bin/env python3
"""Mixagem de conferencia do video recriado: voz + efeitos (sons_vNN) + musica (musica_clipes_vNN), mede niveis e grava WAV.

Uso: rec_mix.py <pasta> <sons_vNN.json> <musica_clipes_vNN.json> <saida.wav>
Imprime loudness da voz, da musica e dos efeitos, e a distancia musica-voz por trecho. A entrega real e o projeto do CapCut;
este WAV serve para a previa MP4 e para medir.
"""
import json, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rec_musica import ler_audio, lufs, gravar, SR


def somar(dest, x, ini):
    i = int(round(ini * SR))
    if i >= len(dest):
        return
    x = x[:len(dest) - i]
    dest[i:i + len(x)] += x


def main(pasta, sons_arq, mus_arq, saida):
    pj = json.load(open(os.path.join(pasta, '_CLAUDE', 'projeto.json'), encoding='utf-8'))
    voz = ler_audio(os.path.join(pasta, pj['narracao']['completa']['arquivo']))
    fim = sum(v['frames'] for v in pj['animacao']['cenas'].values()) / 30
    n = int(round(fim * SR))
    V = np.zeros((n, 2), np.float32); V[:min(n, len(voz))] = voz[:n]
    S = np.zeros_like(V); M = np.zeros_like(V)
    cache = {}
    for s in json.load(open(sons_arq, encoding='utf-8'))['sons']:
        x = cache.get(s['copia']) if s['copia'] in cache else cache.setdefault(s['copia'], ler_audio(s['copia']))
        a = int(s['fonte'] * SR); d = int((s['fim'] - s['ini']) * SR)
        somar(S, x[a:a + d] * s['volume'], s['ini'])
    clipes = json.load(open(mus_arq, encoding='utf-8'))['clipes']
    for c in clipes:
        somar(M, ler_audio(c['copia']) * c['volume'], c['ini'])
    print('voz', lufs(V), 'LUFS | musica', lufs(M), '| efeitos', lufs(S))
    for c in clipes:
        i, j = int(c['ini'] * SR), int(c['fim'] * SR)
        print(c['id'], c['titulo'], 'musica-voz', round(lufs(M[i:j]) - lufs(V[i:j]), 1), 'dB')
    mix = V + S + M
    pico = np.abs(mix).max()
    print('pico da mix', round(20 * np.log10(pico), 1), 'dBFS')
    if pico > 0.98:
        mix *= 0.98 / pico
    gravar(mix, saida)
    print(saida, f'{fim:.2f} s')


if __name__ == '__main__':
    main(*sys.argv[1:5])
