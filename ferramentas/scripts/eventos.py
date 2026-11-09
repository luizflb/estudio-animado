#!/usr/bin/env python3
"""Junta os eventos de som do video, com id estavel e palavra dita, e mede a voz.

Uso: eventos.py <pasta do projeto> [arquivo da voz]  ->  grava _CLAUDE/sfx/eventos.json
Le: _CLAUDE/motion/eventos_som.json, _CLAUDE/camera/eventos_som.json, _CLAUDE/preparar/palavras.json, bloco cortes.
Os eventos estao no tempo da sequencia e as palavras no do bruto: as palavras passam pelos segmentos do corte.
"""
import hashlib, json, os, re, subprocess, sys


def ler(caminho, padrao=None):
    return json.load(open(caminho, encoding='utf-8')) if os.path.exists(caminho) else padrao


def medir_voz(arquivo):
    """Loudness integrada e pico real da voz, em LUFS e dBTP."""
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', arquivo, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       capture_output=True, text=True, errors='ignore').stderr
    resumo = r[r.rfind('Summary:'):]
    return dict(lufs=float(re.search(r'I:\s+(-?[\d.]+) LUFS', resumo).group(1)), pico=float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', resumo).group(1)))


def palavras_na_sequencia(palavras, segmentos):
    """Leva as palavras do tempo do bruto para o da sequencia; so ficam as que sobreviveram ao corte."""
    saida = []
    for s in segmentos:
        for w in palavras:
            if s['ini'] < w['fim'] <= s['fim'] + 0.02:  # pelo fim: a transcricao as vezes estica o inicio para antes do corte
                d = s['seq_ini'] - s['ini']
                saida.append(dict(w, ini=max(w['ini'], s['ini']) + d, fim=w['fim'] + d))
    return saida


def palavra_em(palavras, t):
    for i, w in enumerate(palavras):
        if w['fim'] >= t:
            return ' '.join(x['w'] for x in palavras[max(0, i - 1):i + 2])
    return ''


def main(pasta):
    c = os.path.join(pasta, '_CLAUDE')
    os.makedirs(os.path.join(c, 'sfx'), exist_ok=True)
    pal = ler(os.path.join(c, 'preparar', 'palavras.json'), [])
    pal = pal if isinstance(pal, list) else pal['palavras']
    pj = ler(os.path.join(c, 'projeto.json'), {})
    segmentos = pj.get('cortes', {}).get('segmentos', [])
    if segmentos:
        pal = palavras_na_sequencia(pal, segmentos)
    eventos = []
    for origem in ('motion', 'camera'):
        for e in ler(os.path.join(c, origem, 'eventos_som.json'), []):
            chave = f"{e['item']}|{e['tipo']}|{e['t']:.3f}"
            eventos.append(dict(id='ev' + hashlib.md5(chave.encode()).hexdigest()[:6], origem=origem, item=e['item'], t=e['t'], tipo=e['tipo'],
                                forca=e['forca'], duracao=e['duracao'], descricao=e.get('descricao', ''), fala=palavra_em(pal, e['t'])))
    eventos.sort(key=lambda x: x['t'])
    voz = medir_voz(sys.argv[2] if len(sys.argv) > 2 else os.path.join(pasta, pj['midia']['video_principal']))
    json.dump(dict(voz=voz, eventos=eventos), open(os.path.join(c, 'sfx', 'eventos.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(voz, len(eventos), 'eventos')


if __name__ == '__main__':
    main(sys.argv[1])
