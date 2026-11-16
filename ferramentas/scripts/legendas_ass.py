#!/usr/bin/env python3
"""Legendas sincronizadas com a narração, com o texto exato do roteiro, num arquivo .ass (para queimar no vídeo).

Uso: legendas_ass.py <pasta> [--palavras 3] [--fonte Nunito] [--tam 64] [--cor FFFFFF] [--contorno 2E2A33] [--y 930] [--maiusculas]
- Blocos de até N palavras, uma linha, sem cortar frase no meio de pontuação forte.
- Tempo de cada palavra: narração de cada cena + o início da cena na narração completa (bloco narracao.completa).
- --largura/--altura: tamanho do video (padrao 1920x1080; Shorts: 1080x1920).
- --y: altura da linha (em pixels do video), para não cobrir personagem nem infográfico.
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
    ap.add_argument('--largura', type=int, default=1920); ap.add_argument('--altura', type=int, default=1080)  # 12/11: Shorts vertical = 1080x1920
    ap.add_argument('--x', type=int, default=None)  # centro da linha (padrao: meio do video)
    ap.add_argument('--borda', type=float, default=6); ap.add_argument('--sombra', type=float, default=2)
    ap.add_argument('--dinamica', action='store_true')  # 12/11 (Shorts): palavra falada acesa em cor (rodizio de cores) + entrada com pulo
    ap.add_argument('--cores', default='F5C542,6FD38A,5BC0F8,FF8FA3,FFA552')
    ap.add_argument('--espaco', type=float, default=0)  # espacamento entre letras (Spacing do .ass)
    ap.add_argument('--max_letras', type=int, default=0)  # quebra o bloco antes de passar desse tanto de letras (0 = sem limite)
    ap.add_argument('--arquivo_fonte', default=os.path.expandvars(r'%LOCALAPPDATA%/Microsoft/Windows/Fonts/Fredoka-Bold.ttf'))  # fonte instalada so para o usuario
    ap.add_argument('--minusculas', action='store_true'); ap.add_argument('--sem_pontos', action='store_true')  # 12/11 (feedback): sem maiusculas e sem pontuacao
    ap.add_argument('--zoom', type=int, default=110)  # tamanho da palavra acesa (%), com --destaque
    ap.add_argument('--vao', type=float, default=0.0)  # espaco extra entre palavras no modo --destaque (fracao do tamanho; negativo aproxima)
    ap.add_argument('--destaque', default=None)  # uma cor so (referencia aprovada): so a palavra falada acende, com zoom suave; as outras na cor normal
    a = ap.parse_args()
    X = a.x if a.x is not None else a.largura // 2
    pj = json.load(open(os.path.join(a.pasta, '_CLAUDE', 'projeto.json'), encoding='utf-8'))
    comp = pj['narracao']['completa']['cenas']
    blocos = []
    for cid, n in pj['narracao']['cenas'].items():
        ws = json.load(open(os.path.join(a.pasta, n['tempos']), encoding='utf-8'))['palavras']
        base = comp[cid]['ini']; atual = []
        for i, w in enumerate(ws):
            atual.append(w)
            fim_frase = re.search(r'[.!?…:;]$', w['palavra'])
            prox_longo = a.max_letras and i + 1 < len(ws) and len(' '.join(x['palavra'] for x in atual + [ws[i + 1]])) > a.max_letras
            if len(atual) >= a.palavras or fim_frase or prox_longo or i == len(ws) - 1:
                blocos.append((base + atual[0]['ini'], base + atual[-1]['fim'], ' '.join(x['palavra'] for x in atual),
                               [(base + x['ini'], x['palavra']) for x in atual]))
                atual = []
    # cada bloco fica até o próximo começar (no máximo 0,6 s depois da última palavra), sem sobrepor
    linhas = []
    MED = None  # medidor de largura com a fonte real (para posicionar palavra por palavra no modo --destaque)
    if a.arquivo_fonte and os.path.exists(a.arquivo_fonte):
        from PIL import ImageFont
        f100 = ImageFont.truetype(a.arquivo_fonte, 100); asc, desc = f100.getmetrics()
        fnt = ImageFont.truetype(a.arquivo_fonte, max(8, round(100 * a.tam / (asc + desc))))  # libass: tamanho = altura da linha (conferido medindo o render, 12/11)  # medido: o libass desenha no tamanho em (a conta pela altura da linha deixava as palavras coladas)
        MED = lambda s: fnt.getlength(s) + a.espaco * len(s)
    bgr = lambda c: f'&H{c[4:6]}{c[2:4]}{c[0:2]}&'
    cores = a.cores.split(','); kc = 0
    for k, (ini, fim, txt, pals) in enumerate(blocos):
        prox = blocos[k + 1][0] if k + 1 < len(blocos) else fim + 0.6
        fim = min(max(fim + 0.35, ini + 0.35), prox)  # 12/11: segura ate 0,35 s depois da fala (menos piscada entre blocos)
        def up(s):
            s = s.upper() if a.maiusculas else s.lower() if a.minusculas else s
            return re.sub(r'[.,!?…:;"“”]', '', s) if a.sem_pontos else s
        if not a.dinamica:
            linhas.append(f'Dialogue: 0,{ts(ini)},{ts(fim)},Leg,,0,0,0,,{{\\pos({X},{a.y})}}{up(txt)}')
            continue
        if a.destaque and MED:
            # 12/11 (feedback: "ta torta"): cada palavra no seu lugar fixo (medida com a fonte), centrada na linha; so a falada cresce,
            # em volta do proprio centro, sem empurrar as vizinhas
            ws_ = [up(p) for _, p in pals]
            lw = [MED(w) for w in ws_]; sp_ = MED(' ') + 2 * a.borda + a.tam * a.vao  # o contorno ocupa dos dois lados
            total = sum(lw) + sp_ * (len(lw) - 1); x = X - total / 2; cx = []
            for w in lw:
                cx.append(round(x + w / 2)); x += w + sp_
            for j, (tw, _) in enumerate(pals):
                t0 = ini if j == 0 else tw; t1 = pals[j + 1][0] if j + 1 < len(pals) else fim
                if t1 - t0 < 0.02:
                    continue
                for jj, w in enumerate(ws_):
                    ent = '\\fscx90\\fscy90\\t(0,150,0.5,\\fscx100\\fscy100)' if j == 0 else ''
                    if jj == j:
                        z = a.zoom
                        ent = f'\\c{bgr(a.destaque)}' + (f'\\fscx90\\fscy90\\t(0,170,0.5,\\fscx{z}\\fscy{z})' if j == 0 else f'\\t(0,170,0.5,\\fscx{z}\\fscy{z})')
                    linhas.append(f'Dialogue: {1 if jj == j else 0},{ts(t0)},{ts(t1)},Leg,,0,0,0,,{{\\pos({cx[jj]},{a.y}){ent}}}{w}')
            continue
        # um evento por palavra: a falada fica colorida e um pouco maior; o bloco entra com um pulo curto
        for j, (tw, _) in enumerate(pals):
            t0 = ini if j == 0 else tw; t1 = pals[j + 1][0] if j + 1 < len(pals) else fim
            if t1 - t0 < 0.02:
                continue
            partes = []
            for jj, (_, p) in enumerate(pals):
                if a.destaque:
                    partes.append(f'{{\\c{bgr(a.destaque)}\\fscx100\\fscy100\\t(0,170,0.5,\\fscx114\\fscy114)}}{up(p)}{{\\c{bgr(a.cor)}\\fscx100\\fscy100}}' if jj == j else up(p))
                    continue
                if jj == j:
                    partes.append(f'{{\\c{bgr(cores[(kc + jj) % len(cores)])}\\fscx112\\fscy112}}{up(p)}{{\\c{bgr(a.cor)}\\fscx100\\fscy100}}')
                elif jj < j:
                    partes.append(f'{{\\c{bgr(cores[(kc + jj) % len(cores)])}}}{up(p)}{{\\c{bgr(a.cor)}}}')
                else:
                    partes.append(up(p))
            pulo = ('\\fscx90\\fscy90\\t(0,150,0.5,\\fscx100\\fscy100)' if a.destaque else '\\fscx70\\fscy70\\t(0,90,\\fscx100\\fscy100)') if j == 0 else ''
            linhas.append(f'Dialogue: 0,{ts(t0)},{ts(t1)},Leg,,0,0,0,,{{\\pos({X},{a.y}){pulo}}}' + ' '.join(partes))
        kc += len(pals)
    cab = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {a.largura}
PlayResY: {a.altura}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Leg,{a.fonte},{a.tam},&H00{a.cor[4:6]}{a.cor[2:4]}{a.cor[0:2]},&H000000FF,&H00{a.contorno[4:6]}{a.contorno[2:4]}{a.contorno[0:2]},&H64000000,-1,0,0,0,100,100,{a.espaco},0,1,{a.borda},{a.sombra},5,60,60,60,1

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
