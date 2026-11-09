#!/usr/bin/env python3
"""Legendas sincronizadas com a narração, com o texto exato do roteiro, num arquivo .ass (para queimar no vídeo).

Uso: legendas_ass.py <pasta> [--palavras 3] [--fonte Nunito] [--tam 64] [--cor FFFFFF] [--contorno 2E2A33] [--y 930] [--maiusculas]
- Blocos de até N palavras, uma linha, sem cortar frase no meio de pontuação forte.
- Tempo de cada palavra: narração de cada cena + o início da cena na narração completa (bloco narracao.completa).
- --y: altura da linha (em 1080p), para não cobrir personagem nem infográfico.
Grava _CLAUDE/legendas/legendas_vNN.ass (versão nova).
"""
import argparse, json, os, re


def ts(t):
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f'{h}:{m:02d}:{s:05.2f}'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pasta'); ap.add_argument('--palavras', type=int, default=3); ap.add_argument('--fonte', default='Nunito')
    ap.add_argument('--tam', type=int, default=64); ap.add_argument('--cor', default='FFFFFF'); ap.add_argument('--contorno', default='2E2A33')
    ap.add_argument('--y', type=int, default=930); ap.add_argument('--maiusculas', action='store_true')
    a = ap.parse_args()
    pj = json.load(open(os.path.join(a.pasta, '_CLAUDE', 'projeto.json'), encoding='utf-8'))
    comp = pj['narracao']['completa']['cenas']
    blocos = []
    for cid, n in pj['narracao']['cenas'].items():
        ws = json.load(open(os.path.join(a.pasta, n['tempos']), encoding='utf-8'))['palavras']
        base = comp[cid]['ini']; atual = []
        for i, w in enumerate(ws):
            atual.append(w)
            fim_frase = re.search(r'[.!?…:;]$', w['palavra'])
            if len(atual) >= a.palavras or fim_frase or i == len(ws) - 1:
                blocos.append((base + atual[0]['ini'], base + atual[-1]['fim'], ' '.join(x['palavra'] for x in atual)))
                atual = []
    # cada bloco fica até o próximo começar (no máximo 0,6 s depois da última palavra), sem sobrepor
    linhas = []
    for k, (ini, fim, txt) in enumerate(blocos):
        prox = blocos[k + 1][0] if k + 1 < len(blocos) else fim + 0.6
        fim = min(max(fim, ini + 0.35), prox, fim + 0.6)
        if a.maiusculas:
            txt = txt.upper()
        linhas.append(f'Dialogue: 0,{ts(ini)},{ts(fim)},Leg,,0,0,0,,{{\\pos(960,{a.y})}}{txt}')
    cab = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Leg,{a.fonte},{a.tam},&H00{a.cor[4:6]}{a.cor[2:4]}{a.cor[0:2]},&H000000FF,&H00{a.contorno[4:6]}{a.contorno[2:4]}{a.contorno[0:2]},&H64000000,-1,0,0,0,100,100,0,0,1,6,2,5,60,60,60,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    d = os.path.join(a.pasta, '_CLAUDE', 'legendas'); os.makedirs(d, exist_ok=True)
    v = 1
    while os.path.exists(os.path.join(d, f'legendas_v{v:02d}.ass')):
        v += 1
    out = os.path.join(d, f'legendas_v{v:02d}.ass')
    open(out, 'w', encoding='utf-8').write(cab + '\n'.join(linhas) + '\n')
    print(out, len(linhas), 'legendas')


if __name__ == '__main__':
    main()
