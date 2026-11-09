#!/usr/bin/env python3
"""Detector de pisca em renders: flash nos primeiros quadros e quadro diferente dos dois vizinhos (com os vizinhos iguais).

Uso: pisca.py <render.mp4> [mais renders...]   |   pisca.py --projeto <pasta>  (todos os renders atuais do estado)
Imprime, por render: os quadros 0-3 contra o 4 (flash) e os tempos suspeitos de pisca. Os ultimos 10 quadros sao ignorados (chicote, saida).
Tremor proposital de 10 Hz (vibracao, folhas virando) tambem e marcado: conferir olhando antes de corrigir.
"""
import json, os, subprocess, sys
import numpy as np


def quadros(arq, regiao=None):
    vf = 'scale=160:90,format=gray' if not regiao else f'crop={regiao},scale=160:90,format=gray'
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', arq, '-vf', vf, '-f', 'rawvideo', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.uint8).reshape(-1, 90, 160).astype(float)


def checar(arq, limiar=0.8):
    f = quadros(arq)
    flash = [round(float(np.abs(f[i] - f[4]).mean()), 2) for i in range(min(4, len(f) - 1))]
    a = np.abs(f[1:-1] - f[:-2]).mean((1, 2))
    b = np.abs(f[1:-1] - f[2:]).mean((1, 2))
    viz = np.abs(f[2:] - f[:-2]).mean((1, 2))
    m = (np.minimum(a, b) > limiar) & (viz < 0.35 * np.minimum(a, b))
    m[:2] = False
    m[-10:] = False
    tempos = [round(float(i + 1) / 30, 2) for i in np.where(m)[0]]
    return len(f), flash, tempos


def main(args):
    if args and args[0] == '--projeto':
        pj = json.load(open(os.path.join(args[1], '_CLAUDE', 'projeto.json'), encoding='utf-8'))
        lista = [(c, os.path.join(args[1], v['render'])) for c, v in pj['animacao']['cenas'].items()]
    else:
        lista = [(os.path.basename(a), a) for a in args]
    suspeitos = 0
    for nome, arq in lista:
        n, flash, tempos = checar(arq)
        alerta = max(flash) > 3 or len(tempos) >= 3
        suspeitos += alerta
        if alerta or len(lista) <= 5:
            print(f"{nome}: {n} quadros | flash 0-3 vs 4: {flash} | pisca em {tempos[:8]}{' ...' if len(tempos) > 8 else ''}{'  <- conferir' if alerta else ''}")
    print(f'{suspeitos} suspeito(s) de {len(lista)}')


if __name__ == '__main__':
    main(sys.argv[1:])
