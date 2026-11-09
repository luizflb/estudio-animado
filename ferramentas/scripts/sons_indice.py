#!/usr/bin/env python3
"""Gera ~/.animador/sons/indice.json: duracao util, tempo ate o pico, forma, brilho e nivel de cada som. Rode pelo Python do venv (numpy)."""
import glob, json, os, subprocess
import numpy as np

RAIZ = os.path.expanduser('~/.animador/sons')
SR = 48000


def carregar(arq):
    bruto = subprocess.run(['ffmpeg', '-v', 'error', '-i', arq, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(bruto, dtype=np.float32)


def medir(x):
    pico_abs = float(np.abs(x).max()) or 1e-9
    limiar = pico_abs * 0.03  # -30 dB do pico marca o som util
    acima = np.where(np.abs(x) > limiar)[0]
    ini, fim = int(acima[0]), int(acima[-1])
    u = x[ini:fim + 1]
    j = int(0.01 * SR)  # envelope de 10 ms
    env = np.sqrt(np.convolve(u ** 2, np.ones(j) / j, mode='same'))
    t_pico = int(env.argmax()) / SR
    j100 = int(0.1 * SR)
    rms100 = float(np.sqrt(np.convolve(u ** 2, np.ones(j100) / j100, mode='full').max()))
    dur = len(u) / SR
    forma = 'seco' if t_pico < 0.05 else ('crescendo' if t_pico > dur * 0.6 else 'arco')
    janela = u[:min(len(u), SR)]
    esp = np.abs(np.fft.rfft(janela * np.hanning(len(janela)))) if len(janela) > 8 else np.array([1.0])
    fr = np.fft.rfftfreq(len(janela), 1 / SR) if len(janela) > 8 else np.array([0.0])
    brilho = float((esp * fr).sum() / (esp.sum() or 1))
    return dict(silencio_ini=round(ini / SR, 3), util=round(dur, 3), pico_em=round(t_pico, 3), forma=forma, brilho=round(brilho), pico_db=round(20 * np.log10(pico_abs), 1), rms100_db=round(20 * np.log10(max(rms100, 1e-9)), 1))


indice = {}
for arq in sorted(glob.glob(RAIZ + '/*/*.wav')):
    rel = os.path.relpath(arq, RAIZ).replace('\\', '/')
    x = carregar(arq)
    if len(x):
        indice[rel] = dict(medir(x), categoria=rel.split('/')[0], mixkit=os.path.basename(rel).startswith('mk'))
json.dump(indice, open(RAIZ + '/indice.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(len(indice), 'sons')
