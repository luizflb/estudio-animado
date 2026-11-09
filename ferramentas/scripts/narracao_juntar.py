#!/usr/bin/env python3
"""Junta as cenas narradas numa linha do tempo unica (fluxo animador).

Uso: narracao_juntar.py <pasta> [--pausa 0.3] [--pausa-parte 0.8]

- Usa a versao atual de cada cena (bloco narracao.cenas). A pausa de cada cena vem de
  narracao.cenas.cNN.pausa (se a pessoa pediu uma especifica), senao do padrao (virada de parte = pausa-parte).
- Cada cena comeca num frame inteiro (tempo30, 30 fps), sem somar arredondamentos.
- Grava _CLAUDE/narracao/narracao_completa_vNN.wav e a previa .mp3 (versao nova, nunca sobrescreve),
  mede o loudness e grava em narracao.completa: arquivo, duracao, lufs e ini/fim (s e frames) de cada cena.
"""
import argparse, json, pathlib, re, subprocess, sys

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from tempo30 import FPS, frames, segundos  # noqa: E402

SR = 48000  # 1600 amostras por frame
ESTADO = pathlib.Path(__file__).parent / 'estado.py'


def decodifica(arq):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(arq), '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'],
                       capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.int16)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pasta')
    ap.add_argument('--pausa', type=float, default=0.3)
    ap.add_argument('--pausa-parte', type=float, default=0.8)
    a = ap.parse_args()

    proj = pathlib.Path(a.pasta).resolve()
    pj = json.loads((proj / '_CLAUDE' / 'projeto.json').read_text(encoding='utf-8'))
    rot = pj['roteiro']['cenas']
    nar = (pj.get('narracao') or {}).get('cenas') or {}
    faltam = [c for c in rot if c not in nar]
    if faltam:
        sys.exit(f'faltam cenas narradas: {", ".join(faltam)}')

    ids = list(rot)
    pedacos, linha, f = [], {}, 0
    for i, cid in enumerate(ids):
        audio = decodifica(proj / nar[cid]['audio'])
        dur_f = int(np.ceil(len(audio) / (SR / FPS)))
        linha[cid] = {'ini': round(segundos(f), 3), 'fim': round(segundos(f) + len(audio) / SR, 3),
                      'ini_f': f, 'fim_f': f + dur_f, 'versao': nar[cid]['versao']}
        pedacos.append((f, audio))
        if i + 1 < len(ids):
            vira = rot[ids[i + 1]].get('parte') != rot[cid].get('parte')
            pausa = nar[cid].get('pausa', a.pausa_parte if vira else a.pausa)
            linha[cid]['pausa_depois'] = pausa
            f += dur_f + frames(pausa)
    total_f = f + dur_f
    buf = np.zeros(int(segundos(total_f) * SR) + SR // 10, dtype=np.int32)
    for f0, au in pedacos:
        s0 = f0 * SR // FPS
        buf[s0:s0 + len(au)] += au
    buf = np.clip(buf, -32768, 32767).astype(np.int16)

    pasta = proj / '_CLAUDE' / 'narracao'
    vs = [int(m.group(1)) for p in pasta.glob('narracao_completa_v*.wav')
          if (m := re.match(r'narracao_completa_v(\d+)\.wav$', p.name))]
    v = max(vs, default=0) + 1
    wav = pasta / f'narracao_completa_v{v:02d}.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', str(wav)],
                   input=buf.tobytes(), check=True)
    mp3 = wav.with_suffix('.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(wav), '-b:a', '160k', str(mp3)], check=True)

    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(wav), '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       capture_output=True, text=True)
    lufs = re.findall(r'I:\s+(-?[\d.]+) LUFS', r.stderr)
    pico = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r.stderr)
    dur = len(buf) / SR
    bloco = {'versao': v, 'arquivo': f'_CLAUDE/narracao/{wav.name}', 'previa': f'_CLAUDE/narracao/{mp3.name}',
             'duracao': round(dur, 3), 'frames': total_f, 'fps': FPS,
             'lufs': float(lufs[-1]) if lufs else None, 'pico_dbfs': float(pico[-1]) if pico else None,
             'pausa_padrao': a.pausa, 'pausa_parte': a.pausa_parte, 'cenas': linha}
    subprocess.run([sys.executable, str(ESTADO), str(proj), '--set', 'narracao.completa',
                    json.dumps(bloco, ensure_ascii=False)], check=True, capture_output=True)
    m, s = divmod(dur, 60)
    print(f'{wav.name}: {int(m)}:{s:05.2f} ({total_f} frames), {bloco["lufs"]} LUFS, pico {bloco["pico_dbfs"]} dBFS')


if __name__ == '__main__':
    main()
