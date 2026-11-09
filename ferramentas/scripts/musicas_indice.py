"""Gera ~/.animador/musicas/indice.json: duração, BPM estimado, energia, clima (pasta), loudness.
Uso: python musicas_indice.py  (relê tudo; preserva campos editados à mão: clima, tem_voz, obs, pontos_loop)
"""
import json, os, subprocess, sys
import numpy as np

M = os.path.expanduser('~/.animador/musicas')
IDX = os.path.join(M, 'indice.json')
SR = 11025

def decode(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)

def bpm(x):
    hop = 256
    n = len(x) // hop
    fr = x[:n*hop].reshape(n, hop)
    e = np.log1p(100 * np.sqrt((fr**2).mean(1)))
    on = np.maximum(0, np.diff(e))
    on = on - on.mean()
    ac = np.correlate(on, on, 'full')[len(on)-1:]
    fps = SR / hop
    lo, hi = int(fps*60/180), int(fps*60/60)
    lag = lo + int(np.argmax(ac[lo:hi]))
    return round(60 * fps / lag)

def energia(x):
    w = SR  # janelas de 1 s
    n = len(x) // w
    r = np.sqrt((x[:n*w].reshape(n, w)**2).mean(1)) + 1e-9
    db = 20*np.log10(r)
    med = float(np.median(db))
    return round(med, 1), round(float(np.percentile(db, 95) - np.percentile(db, 10)), 1)

old = {}
if os.path.exists(IDX):
    old = {f['arquivo']: f for f in json.load(open(IDX, encoding='utf-8'))['faixas']}

faixas = []
for clima in sorted(os.listdir(M)):
    d = os.path.join(M, clima)
    if not os.path.isdir(d) or clima.startswith('_'):
        continue
    for f in sorted(os.listdir(d)):
        if not f.lower().endswith(('.mp3', '.wav', '.m4a')):
            continue
        rel = f'{clima}/{f}'
        x = decode(os.path.join(d, f))
        med, din = energia(x)
        item = dict(arquivo=rel, titulo=os.path.splitext(f)[0], clima=clima,
                    duracao_s=round(len(x)/SR, 1), bpm_estimado=bpm(x),
                    rms_mediano_db=med, dinamica_db=din, tem_voz=False, pontos_loop=[], obs='')
        for k in ('clima', 'tem_voz', 'pontos_loop', 'obs'):
            if rel in old and old[rel].get(k) not in (None, '', []):
                item[k] = old[rel][k]
        faixas.append(item)
        print(rel, item['duracao_s'], item['bpm_estimado'], med, file=sys.stderr)

rms = [f['rms_mediano_db'] for f in faixas]
if rms:
    a, b = np.percentile(rms, [33, 66])
    for f in faixas:
        f['energia'] = 'baixa' if f['rms_mediano_db'] < a else 'media' if f['rms_mediano_db'] < b else 'alta'

json.dump(dict(atualizado=__import__('datetime').date.today().isoformat(),
               obs='bpm_estimado é aproximado (autocorrelação do envelope); conferir de ouvido quando importar',
               faixas=faixas), open(IDX, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('faixas:', len(faixas))
