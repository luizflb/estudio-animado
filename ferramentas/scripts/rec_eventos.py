#!/usr/bin/env python3
"""Eventos de som do video recriado: junta os eventos_<cena>.json da animacao no tempo do video inteiro, com id estavel e fala, e mede a voz.

Uso: rec_eventos.py <pasta do projeto>  ->  grava _CLAUDE/sfx/eventos.json (mesmo formato do eventos.py, lido pelo sfx.py)
Tempo do video = inicio da cena na narracao completa + t do evento. Cada evento guarda a versao da narracao da cena.
"""
import hashlib, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from eventos import medir_voz


def main(pasta):
    c = os.path.join(pasta, '_CLAUDE')
    pj = json.load(open(os.path.join(c, 'projeto.json'), encoding='utf-8'))
    comp = pj['narracao']['completa']
    eventos = []
    for cena, a in pj['animacao']['cenas'].items():
        ini = comp['cenas'][cena]['ini']
        nar = pj['narracao']['cenas'][cena]
        pal = json.load(open(os.path.join(pasta, nar['tempos']), encoding='utf-8'))['palavras']
        arq = os.path.join(c, 'animacao', cena, f'eventos_{cena}.json')
        lista = json.load(open(arq, encoding='utf-8'))['eventos']
        if ini > 0:  # a troca de cena tambem e um evento visivel
            lista = [dict(t=0.0, tipo='troca_de_cena', forca='leve', desc='corte para a cena')] + lista
        for e in lista:
            chave = f"{cena}|{e['tipo']}|{e['t']:.3f}"
            i = next((k for k, w in enumerate(pal) if w['fim'] >= e['t']), len(pal) - 1)
            fala = ' '.join(w['palavra'] for w in pal[max(0, i - 1):i + 2]) if pal else ''
            eventos.append(dict(id='ev' + hashlib.md5(chave.encode()).hexdigest()[:6], origem='animacao', item=cena, t=round(ini + e['t'], 3),
                                t_cena=e['t'], tipo=e['tipo'], forca=e.get('forca', 'leve'), duracao=e.get('dur', 0), descricao=e.get('desc', ''),
                                fala=fala, narracao_versao=nar['versao']))
    eventos.sort(key=lambda x: x['t'])
    voz = medir_voz(os.path.join(pasta, comp['arquivo']))
    os.makedirs(os.path.join(c, 'sfx'), exist_ok=True)
    json.dump(dict(voz=voz, duracao=comp['duracao'], eventos=eventos), open(os.path.join(c, 'sfx', 'eventos.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    print(voz, len(eventos), 'eventos')


if __name__ == '__main__':
    main(sys.argv[1])
