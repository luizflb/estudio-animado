#!/usr/bin/env python3
"""Musica de fundo do video recriado: um WAV por trecho (muNN), com nivel abaixo da voz, respiro nas pausas e fades embutidos.

Uso: rec_musica.py <pasta do projeto> <plano musica_vNN.json>
Plano: {"distancia_db": 20, "respiro_db": 3, "denso_db": 2, "fade": 1.5,
        "trechos": [{"id": "mu01", "faixa": "epico/Rising Game.mp3", "ini": 0, "fim": 31.4, "fade_ini": 0.3, "fade_fim": 1.5}, ...]}
- Nivel: loudness da faixa levada a (voz - distancia_db). Onde a fala e densa (>3,2 palavras/s) desce mais denso_db;
  nas pausas >= 1 s (e nas viradas de parte) sobe respiro_db. Rampas de 0,3 s.
- Fades embutidos no arquivo (fades do CapCut ainda nao validados). Trechos vizinhos se sobrepoem pelo fade: fade cruzado.
- Faixa mais curta que o trecho: repete com fade cruzado de 2 s.
Grava _CLAUDE/sfx/musica/muNN <titulo>.wav e _CLAUDE/sfx/musica_vNN.json (clipes para a entrega, volume 1).
"""
import json, os, re, subprocess, sys
import numpy as np

SR = 48000
MUS = os.path.expanduser('~/.animador/musicas')


def ler_audio(arq):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', arq, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(b, dtype=np.float32).reshape(-1, 2).copy()


def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True)
    r = p.stderr.decode(errors='ignore')
    return float(re.search(r'I:\s+(-?[\d.]+) LUFS', r[r.rfind('Summary:'):]).group(1))


def gravar(x, arq):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s16le', arq],
                   input=np.clip(x, -1, 1).astype(np.float32).tobytes(), check=True)


def palavras_globais(pasta, pj):
    comp = pj['narracao']['completa']['cenas']
    out = []
    for c, n in pj['narracao']['cenas'].items():
        for w in json.load(open(os.path.join(pasta, n['tempos']), encoding='utf-8'))['palavras']:
            out.append((comp[c]['ini'] + w['ini'], comp[c]['ini'] + w['fim']))
    return sorted(out)


def envelope_db(n, t0, pal, plano):
    """Curva em dB (relativa ao nivel base) para n amostras a partir do tempo t0 do video. Calculada a 100 Hz e interpolada."""
    K = 100
    m = int(np.ceil(n / SR * K)) + 1
    t = t0 + np.arange(m) / K
    fala = np.zeros(m, dtype=bool)
    for a, b in pal:  # fala segura 0,3 s antes e 0,7 s depois de cada palavra
        i, j = max(0, int((a - 0.3 - t0) * K)), min(m, int((b + 0.7 - t0) * K))
        if j > i:
            fala[i:j] = True
    # pausas curtas (< 1 s) entre falas nao respiram
    d = np.diff(np.concatenate([[1], fala.astype(int), [1]]))
    for i, j in zip(np.where(d == -1)[0], np.where(d == 1)[0]):
        if (j - i) / K < 1.0 and i > 0 and j < m:
            fala[i:j] = True
    env = np.where(fala, 0.0, plano['respiro_db'])
    if plano.get('denso_db'):  # fala densa (> 3,2 palavras/s numa janela de 3 s): desce mais
        ini = np.array([a for a, b in pal])
        for k in range(0, m, K):
            a0 = t[k]
            if np.count_nonzero((ini >= a0 - 1) & (ini < a0 + 2)) / 3 > 3.2:
                env[k:k + K] = np.minimum(env[k:k + K], -plano['denso_db'])
    w = int(0.3 * K)  # rampa de 0,3 s
    env = np.convolve(np.pad(env, (w, w), mode='edge'), np.ones(w) / w, mode='same')[w:w + m]
    return np.interp(np.arange(n) / SR, np.arange(m) / K, env)


def main(pasta, plano_arq):
    c = os.path.join(pasta, '_CLAUDE')
    pj = json.load(open(os.path.join(c, 'projeto.json'), encoding='utf-8'))
    plano = json.load(open(plano_arq, encoding='utf-8'))
    voz = pj['narracao']['completa']['lufs']
    alvo = voz - plano['distancia_db']
    pal = palavras_globais(pasta, pj)
    os.makedirs(os.path.join(c, 'sfx', 'musica'), exist_ok=True)
    clipes = []
    for tr in plano['trechos']:
        dur = tr['fim'] - tr['ini']
        n = int(round(dur * SR))
        x = ler_audio(os.path.join(MUS, tr['faixa']))
        x = x[int(tr.get('desde', 0) * SR):]
        while len(x) < n:  # repete com fade cruzado de 2 s
            cf = 2 * SR
            r = np.linspace(0, 1, cf)[:, None]
            y = ler_audio(os.path.join(MUS, tr['faixa']))
            x = np.concatenate([x[:-cf], x[-cf:] * (1 - r) + y[:cf] * r, y[cf:]])
        x = x[:n]
        g0 = alvo - lufs(x)
        env = envelope_db(n, tr['ini'], pal, plano)
        x = x * (10 ** ((g0 + env) / 20))[:, None]
        fi, ff = int(tr.get('fade_ini', plano['fade']) * SR), int(tr.get('fade_fim', plano['fade']) * SR)
        if fi:
            x[:fi] *= np.linspace(0, 1, fi)[:, None] ** 1.5
        if ff:
            x[-ff:] *= np.linspace(1, 0, ff)[:, None] ** 1.5
        titulo = os.path.splitext(os.path.basename(tr['faixa']))[0]
        destino = os.path.abspath(os.path.join(c, 'sfx', 'musica', f"{tr['id']} {titulo}.wav")).replace('\\', '/')
        gravar(x, destino)
        clipes.append(dict(id=tr['id'], faixa=tr['faixa'], titulo=titulo, copia=destino, ini=round(tr['ini'], 4), fim=round(tr['fim'], 4),
                           fonte=0.0, volume=1.0, ganho_base_db=round(g0, 1), alvo_lufs=round(alvo, 1)))
        print(tr['id'], titulo, f"{tr['ini']:.1f}-{tr['fim']:.1f}", f'ganho {g0:.1f} dB')
    versao = re.search(r'_v(\d+)', plano_arq).group(1)
    json.dump(dict(voz=voz, alvo=alvo, clipes=clipes), open(os.path.join(c, 'sfx', f'musica_clipes_v{versao}.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
