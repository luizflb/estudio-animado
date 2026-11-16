#!/usr/bin/env python3
"""Motor de cenas com PLANOS (extensao do motor_cena.py, 09/11/2026).

Uso: motor_planos.py <ficha.json> <pasta_da_cena> [--render] [--previa]
Aceita a ficha antiga (cenario/camera/atores/objetos no nivel da cena) e a nova com "planos":
 "planos": [{"t": 0 | "palavra:N", "transicao": "corte"|"chicote", "clima": "frio_vinheta"|"quente",
             "cenario": {...}, "camera": [...], "atores": [...], "objetos": [...]}]
 "textos" e "efeitos" ficam no nivel da cena (coordenadas de tela).

Atores (alem do motor_cena): "quadril_y" (posiciona pelo quadril, para sentado/deitado), acoes:
  {"pose": "deitado_cama"|"sentado_cama"|"sentado"|"em_pe"|{angulos}}, {"olhos": "fechados"|"abertos"},
  {"olhar": "e"|"d"|"baixo"|"frente"}, {"jogar": "maco", "repetir": N, "intervalo": s},
  {"roupa": "pijama"} (escolhe o rig), {"peca": "barba_branca"} (troca para o rig barbudo nesse tempo).
  "preso_a": "<id do objeto>.prato_e|prato_d" (anda junto com o prato da balanca).
Objetos: qualquer chave extra vai para a funcao do desenho (parte, cracha, texto, folhas...). Animacoes:
  "pular" {t, altura, vezes}, "entra" {t, dur}, "abrir_cordao" {t, dur}, "inclinar" [{t, graus, dur}],
  "cair" {t, quantas, intervalo, colunas, dx, dy, escala}, "arrancar" {t, ate}, "mover" {t, ate_x, dur, rodas}, "preso_a".
Textos: "cor", "contador" {de, ate, dur}, "prefixo", "sufixo", "placa": false (sem a placa escura; o padrao e COM placa, para o texto nunca sumir no cenario colorido).
"""
import json, os, sys, glob, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from motor_cena import tempo, copiar, renderizar, H, HF  # noqa: E402
from datetime import datetime

POSES = {
    'em_pe': {'coxa_e': {'rotation': 0, 'scaleY': 1}, 'coxa_d': {'rotation': 0, 'scaleY': 1}, 'canela_e': {'rotation': 0, 'scaleY': 1}, 'canela_d': {'rotation': 0, 'scaleY': 1}},
    'sentado_cama': {'coxa_e': {'rotation': -86, 'scaleY': 1}, 'coxa_d': {'rotation': -92, 'scaleY': 1}, 'canela_e': {'rotation': 0, 'scaleY': 1}, 'canela_d': {'rotation': 0, 'scaleY': 1}},
    'deitado_cama': {'coxa_e': {'rotation': 0, 'scaleY': 1}, 'coxa_d': {'rotation': 0, 'scaleY': 1}, 'canela_e': {'rotation': 0, 'scaleY': 1}, 'canela_d': {'rotation': 0, 'scaleY': 1}},
    'bracos_cruzados': {'braco_e': 14, 'antebraco_e': -118, 'braco_d': -14, 'antebraco_d': 118},
    'sentado': {'coxa_e': {'rotation': 6, 'scaleY': 0.3}, 'coxa_d': {'rotation': -6, 'scaleY': 0.3}, 'canela_e': {'rotation': -6, 'scaleY': 3.333}, 'canela_d': {'rotation': 6, 'scaleY': 3.333}},
    'deitado_rede': {'coxa_e': {'rotation': 0, 'scaleY': 1}, 'coxa_d': {'rotation': 0, 'scaleY': 1}, 'canela_e': {'rotation': 0, 'scaleY': 1}, 'canela_d': {'rotation': 0, 'scaleY': 1},
                     'braco_e': 150, 'antebraco_e': 120, 'braco_d': -150, 'antebraco_d': -120},
}
# objetos de mao (segurar): funcao, escala no espaco da mao, pose do braco (braco, antebraco), deslocamento do ponto de pegar
SEGURAR = {'pastel': ('pastel', 0.9, 25, 105, 70), 'xicara': ('xicaraCafe', 0.8, 20, 110, 60), 'xicaraCafe': ('xicaraCafe', 0.8, 20, 110, 60),
           'cartaoPreto': ('cartaoPreto', 0.9, 30, 110, 70), 'laptop': ('laptop', 1.0, 15, 95, 80), 'cameraFoto': ('cameraFoto', 1.0, 35, 120, 60),
           'bandeirinha': ('bandeirinha', 1.0, 20, 70, 50), 'portaRetrato': ('portaRetrato', 0.55, 30, 125, 90), 'tacaVinho': ('tacaVinho', 0.9, 20, 110, 40), 'envelopeMao': ('envelopeMao', 0.7, 30, 110, 60)}
ANTECIPA = 0.12  # alem dos 0,05 do tempo(): evento preso a palavra comeca ~0,17 s antes dela
RIG = {'principal': 'principal_svg'}
# ---- atmosfera (10/11/2026): luz, sombras e poeira em camadas 2D, tudo deterministico (posicoes com semente fixa, animado na timeline) ----
EXTERIORES = {'ruaComercio', 'fachadaPredio', 'fachadaMansao', 'fachadaMansaoLarga', 'entradaPropriedade', 'patioFabrica', 'marAberto', 'terrenoCima', 'terrenoAereo', 'avenidaTelao', 'conveIate'}
SOMBRA_LADO = {}
INFOGRAFICOS = {'infograficoBalanca', 'fundoLiso', 'espacoGlobo'}
# Fontes de luz reais dos cenarios (10/11, ajuste aprovado: a luz vem da janela/porta/lampada; janela com grade projeta a grade no chao).
# janela = (x0, y0, x1, y1, colunas, linhas[, kx]); chao = y da linha parede/chao; kx/ky = para onde a luz anda por unidade de altura.
FONTES = {
    'quarto': {'chao': 736, 'kx': -0.42, 'ky': 0.5, 'janelas': [(1050, 140, 1390, 520, 2, 2)]},
    'salaApto': {'chao': 740, 'kx': 0.3, 'ky': 0.42, 'janelas': [(520, 100, 1300, 500, 2, 2)]},
    'salaoMansao': {'chao': 700, 'ky': 0.36, 'janelas': [(60, 70, 280, 630, 2, 3, 0.6), (1640, 70, 1860, 630, 2, 3, -0.6)]},
    'andarEscritorio': {'chao': 340, 'kx': 0.32, 'ky': 0.42, 'janelas': [(x, 40, x + 240, 300, 2, 2) for x in range(-260, 2220, 300)]},
    'cofre': {'chao': 720, 'lampadas': [(560, 94), (1300, 94)]},
    'restaurante': {'chao': 760, 'kx': -0.3, 'ky': 0.42, 'janelas': [(1180, 70, 1660, 410, 2, 2)]},  # parte 7: janela do fim de tarde
}
SOMBRA_FONTE = {}


def _proj(F, kx, x, y):
    h = F['chao'] - y
    return (round(x + kx * h, 1), round(F['chao'] + F.get('ky', .4) * h, 1))


def _casco(pts):
    pts = sorted(set(pts))
    if len(pts) < 3:
        return pts
    def cr(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, hi = [], []
    for p in pts:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(pts):
        while len(hi) >= 2 and cr(hi[-2], hi[-1], p) <= 0: hi.pop()
        hi.append(p)
    return lo[:-1] + hi[:-1]


def luz_fontes(cen, i, intens=1.0):
    """Camadas no MUNDO (andam com a camera): (chao, ar). chao = manchas de luz da janela com a sombra da grade, abaixo dos atores;
    ar = volume de luz (nevoa) da janela ate o chao + brilho da janela/lampada, por cima dos atores."""
    F = FONTES.get(cen)
    if not F:
        return '', ''
    pt = lambda ps: ' '.join(f'{x},{y}' for x, y in ps)
    chao, ar, defs = [], [], []
    for k, J in enumerate(F.get('janelas', [])):
        x0, y0, x1, y1, nc, nl = J[:6]; kx = J[6] if len(J) > 6 else F.get('kx', 0)
        m = 16  # espessura do caixilho
        pw = (x1 - x0 - m * (nc - 1)) / nc; ph = (y1 - y0 - m * (nl - 1)) / nl
        for c in range(nc):
            for l in range(nl):
                a = x0 + c * (pw + m); b = y0 + l * (ph + m)
                chao.append(f'<polygon points="{pt([_proj(F, kx, a, b), _proj(F, kx, a + pw, b), _proj(F, kx, a + pw, b + ph), _proj(F, kx, a, b + ph)])}"/>')
        fundo = [_proj(F, kx, x, y) for x, y in ((x0, y0), (x1, y0), (x0, y1), (x1, y1))]
        vol = _casco([(x0, y0), (x1, y0), (x0, y1), (x1, y1)] + fundo)
        gid = f'gv{i}_{k}'
        defs.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{(x0 + x1) / 2}" y1="{y0}" x2="{fundo[0][0]}" y2="{max(p[1] for p in fundo)}"><stop offset="0" stop-color="rgb(255,196,120)" stop-opacity="{round(.26 * intens, 2)}"/><stop offset="1" stop-color="rgb(255,170,90)" stop-opacity="{round(.03 * intens, 2)}"/></linearGradient>')
        ar.append(f'<polygon points="{pt(vol)}" fill="url(#{gid})" style="filter:blur(34px)"/>')
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        ar.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{(x1 - x0) * .75}" ry="{(y1 - y0) * .65}" fill="rgb(255,214,150)" opacity="{round(.38 * intens, 2)}" style="filter:blur(40px)"/>')
    for k, (lx, ly) in enumerate(F.get('lampadas', [])):
        gid = f'gl{i}_{k}'; ch = F['chao']
        defs.append(f'<linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(255,205,130)" stop-opacity="{round(.5 * intens, 2)}"/><stop offset="1" stop-color="rgb(255,180,100)" stop-opacity="{round(.06 * intens, 2)}"/></linearGradient>')
        ar.append(f'<polygon points="{lx - 40},{ly} {lx + 40},{ly} {lx + 300},{ch + 40} {lx - 300},{ch + 40}" fill="url(#{gid})" style="filter:blur(24px)"/>')
        ar.append(f'<circle cx="{lx}" cy="{ly}" r="90" fill="rgb(255,222,160)" opacity="{round(.55 * intens, 2)}" style="filter:blur(26px)"/>')
        chao.append(f'<ellipse cx="{lx}" cy="{ch + 110}" rx="330" ry="80"/>')
    # mancha no chao: entra no cenario ENTRE o fundo e o meio (fica so no piso, por baixo de sofa, cama e objetos)
    h_chao = (f'<g style="mix-blend-mode:screen;opacity:{round(min(1, .85 * intens), 2)};filter:blur(4px)">'
              f'<g fill="rgb(255,200,125)">{"".join(chao)}</g></g>') if chao else ''
    h_ar = f'<svg class="camada lzw" viewBox="0 0 1920 1080" style="mix-blend-mode:screen"><defs>{"".join(defs)}</defs>{"".join(ar)}</svg>'
    return h_chao, h_ar


def sombra_dir(cen, i, ax):
    """(kx, ky) da sombra do personagem em x=ax: vem da fonte mais proxima; None = sem fonte (usa o lado da nevoa)."""
    F = FONTES.get(cen)
    if not F:
        return None
    if F.get('janelas'):
        J = min(F['janelas'], key=lambda J: abs((J[0] + J[2]) / 2 - ax))
        return (J[6] if len(J) > 6 else F.get('kx', 0), F.get('ky', .4))
    lx, ly = min(F['lampadas'], key=lambda L: abs(L[0] - ax))
    return (max(-1.2, min(1.2, (ax - lx) / (F['chao'] - ly))), 0.2)


def e_noite(P):  # 11/11 (ajuste aprovado): cena de noite = luz de LUA branca e fraca, ambiente bem mais escuro, nada de luz amarela de sol
    return P.get('clima') == 'noite' or bool((P.get('atmosfera') or {}).get('lua')) if isinstance(P.get('atmosfera', {}), dict) else P.get('clima') == 'noite'


def atmosfera(P, i, t0, t1, cid):
    """HTML (camada de luz por cima do plano, abaixo dos textos) + JS das particulas. P['atmosfera'] = false desliga; dict ajusta."""
    A = P.get('atmosfera', {})
    if A is False:
        return '', []
    cen = P.get('cenario', {}).get('tipo', '')
    tipo = A.get('tipo') or ('exterior' if cen in EXTERIORES else 'info' if cen in INFOGRAFICOS else 'interior')
    seed = sum(ord(ch) for ch in f'{cid}{i}') * 7919
    def rnd(k):
        x = math.sin(seed + k * 12.9898) * 43758.5453
        return x - math.floor(x)
    h, js = [], []
    # Luz em NEVOA (10/11, ajuste aprovado): sem raios desenhados. Uma direcao de luz (lado), uma nevoa alaranjada macia que
    # vem desse lado, o lado oposto mais escuro, e as sombras (chao e personagens) caem para longe da luz.
    forca = A.get('luz', 1.0)
    Fn = FONTES.get(cen)
    lado_auto = 'd' if tipo == 'exterior' else 'e'
    if Fn and Fn.get('janelas') and len(Fn['janelas']) <= 2:  # a nevoa vem do lado da janela
        mx = sum((J[0] + J[2]) / 2 for J in Fn['janelas']) / len(Fn['janelas'])
        lado_auto = 'e' if mx < 960 else 'd'
    lado = A.get('lado_luz', lado_auto)
    px = '0%' if lado == 'e' else '100%'
    op_lado = '100%' if lado == 'e' else '0%'
    intens = {'interior': 1.0, 'exterior': 1.25, 'info': .45}[tipo] * forca
    lua = e_noite(P)
    if lua:  # luar: branco azulado, mais fraco que o sol mas visivel (11/11: 0.32 ficou escuro demais)
        intens *= 0.8
    # 1) nevoa quente: grande brilho difuso vindo do canto de cima do lado da luz
    h.append(f'<div class="lz" id="nev{i}" style="background:radial-gradient(ellipse 85% 95% at {px} 0%, rgba({'205,220,255' if lua else '255,170,85'},{round(.62 * intens, 2)}) 0%, rgba({'185,200,240' if lua else '255,140,60'},{round(.30 * intens, 2)}) 38%, rgba({'170,185,230' if lua else '255,120,50'},0) 75%);mix-blend-mode:screen"></div>')
    # 2) veu de luz que atravessa o ar na diagonal (nevoa larga, sem bordas)
    ang = 120 if lado == 'e' else 240
    h.append(f'<div class="lz" style="background:linear-gradient({ang}deg, rgba({'205,220,255' if lua else '255,170,85'},{round(.42 * intens, 2)}) 0%, rgba({'185,200,240' if lua else '255,140,60'},{round(.18 * intens, 2)}) 35%, rgba({'170,185,230' if lua else '255,120,50'},0) 65%);mix-blend-mode:screen;filter:blur(30px)"></div>')
    # 3) lado oposto mais escuro e frio (da a direcao da luz)
    if tipo != 'info':
        h.append(f'<div class="lz" style="background:radial-gradient(ellipse 80% 110% at {op_lado} 70%, rgba(40,30,70,{round(.38 * intens, 2) if not lua else .3}), rgba(40,30,70,0) 70%);mix-blend-mode:multiply"></div>')
    if lua:  # ambiente sempre mais escuro a noite
        h.append('<div class="lz" style="background:#2a3058;mix-blend-mode:multiply;opacity:.15"></div>')
    # 4) sombras projetadas no chao vindas da janela/grade, inclinadas pela direcao da luz (interiores)
    if tipo == 'interior' and A.get('faixas', False):
        inc = 300 if lado == 'e' else -300
        barras = ''.join(f'<polygon points="{x},620 {x + 90},620 {x + 90 + inc},1080 {x + inc},1080" />' for x in ((140, 420, 700, 980) if lado == 'e' else (840, 1120, 1400, 1680)))
        h.append(f'<svg class="lz" viewBox="0 0 1920 1080" style="mix-blend-mode:multiply;opacity:{A.get("forca_faixas", .32)};filter:blur(14px)"><g fill="#2a1c3a">{barras}</g></svg>')
    # respiracao leve da nevoa
    js.append(f'tl.fromTo("#nev{i}", {{opacity:.85}}, {{opacity:1, duration:{max(.4, round((t1 - t0) / 2, 3))}, repeat:1, yoyo:true, ease:"sine.inOut", ...F}}, {t0});')
    SOMBRA_LADO[i] = lado
    # vinheta mais firme (multiplica), em todos
    h.append(f'<div class="lz" style="background:radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(25,18,40,{A.get("vinheta", .52 if lua else .45)}) 100%);mix-blend-mode:multiply"></div>')
    # poeira / polen: pontinhos claros que sobem devagar, balancam e piscam
    n = A.get('poeira', {'interior': 40, 'exterior': 18, 'info': 22}[tipo])
    if lua:
        n = n // 2
    dur = max(0.5, round(t1 - t0, 3))
    pts = []
    for k in range(n):
        x = round(rnd(k) * 1920); y = round(200 + rnd(k + 100) * 860); r = round(2 + rnd(k + 200) * 5, 1)
        b = 1.5 if rnd(k + 300) > .6 else 0
        pts.append(f'<circle id="pz{i}_{k}" cx="{x}" cy="{y}" r="{r}" fill="{'rgba(225,235,255,.8)' if lua else 'rgba(255,222,170,.95)'}" style="filter:blur({b}px)"/>')
        sobe = round(40 + rnd(k + 400) * 120) * (dur / 4)
        js.append(f'tl.fromTo("#pz{i}_{k}", {{y:0, opacity:0}}, {{y:{-round(sobe)}, duration:{dur}, ease:"none", ...F}}, {t0});')
        per = round(1.2 + rnd(k + 500) * 1.6, 2); rep = max(1, int(dur / per)); rep -= (rep + 1) % 2
        js.append(f'tl.fromTo("#pz{i}_{k}", {{x:{-round(8 + rnd(k + 600) * 18)}}}, {{x:{round(8 + rnd(k + 600) * 18)}, duration:{per}, repeat:{rep}, yoyo:true, ease:"sine.inOut", ...F}}, {t0});')
        op = round(.25 + rnd(k + 700) * .6, 2); per2 = round(.7 + rnd(k + 800), 2); rep2 = max(1, int(dur / per2)); rep2 -= (rep2 + 1) % 2
        js.append(f'tl.fromTo("#pz{i}_{k}", {{opacity:{round(op * .3, 2)}}}, {{opacity:{op}, duration:{per2}, repeat:{rep2}, yoyo:true, ease:"sine.inOut", ...F}}, {round(t0 + rnd(k + 900) * .4, 3)});')
    h.append(f'<svg class="lz" viewBox="0 0 1920 1080" style="mix-blend-mode:screen">{"".join(pts)}</svg>')
    return ''.join(h), js
BARBUDO = {'principal_svg': 'principal_barbudo', 'principal_pijama': 'principal_pijama_barbudo'}


def gerar(ficha, pasta):
    os.makedirs(pasta, exist_ok=True)
    cid = ficha['id']
    json.dump({"$schema": "https://hyperframes.heygen.com/schema/hyperframes.json", "paths": {"blocks": "compositions", "components": "compositions/components", "assets": "assets"}, "media": {"autoProxy": True}},
              open(os.path.join(pasta, 'hyperframes.json'), 'w'), indent=2)
    json.dump({"id": cid, "name": cid, "createdAt": datetime.now().isoformat()}, open(os.path.join(pasta, 'meta.json'), 'w'), indent=2)
    json.dump({"name": cid, "private": True, "type": "module", "scripts": {k: f"npx --yes {HF} {k}" for k in ('preview', 'check', 'render')}},
              open(os.path.join(pasta, 'package.json'), 'w'), indent=2)
    cabecas = sorted(os.path.basename(f) for f in glob.glob(os.path.join(H, 'pecas', 'rig2', 'cabeca_*.js')))
    copiar('estilo.js', pasta)
    for rel in ['pecas/rig/seek_fix.js', 'pecas/rig2/rig2.js', 'pecas/rig2/pessoa_svg.js', 'pecas/rig2/pessoas_svg_def.js', 'pecas/svg/objetos.js', 'pecas/svg/cenarios.js'] + [f'pecas/rig2/{c}' for c in cabecas]:
        copiar(rel, pasta)
    pal = []
    if ficha.get('palavras'):
        w = json.load(open(ficha['palavras'], encoding='utf-8'))
        pal = w.get('palavras', w) if isinstance(w, dict) else w
        pal = [{'palavra': p.get('palavra', p.get('word', '')), 'ini': p.get('ini', p.get('start')), 'fim': p.get('fim', p.get('end'))} for p in pal]
    for E in ficha.get('efeitos', []):
        if E['tipo'] not in ('estrelinha', 'puf', 'flashCamera', 'tremor', 'flash'):
            copiar(f"biblioteca/efeitos/{E['tipo']}", pasta)
    D = ficha['duracao']
    def T(v):
        if isinstance(v, str) and '+' in v:
            a, b = v.rsplit('+', 1)
            return round(T(a) + float(b), 3)
        t_ = tempo(v, pal)
        if isinstance(v, str) and v.startswith('palavra:'):
            t_ -= ficha.get('antecipa', ANTECIPA)  # o movimento ja esta acontecendo quando a palavra soa (10/11: animacoes pareciam atrasadas)
        return round(max(0.0, t_), 3)  # palavra 1 em 0,0 dava -0,05 e sumia o que comeca nela
    planos = ficha.get('planos') or [{'t': 0, 'cenario': ficha.get('cenario', {}), 'camera': ficha.get('camera', []), 'atores': ficha.get('atores', []), 'objetos': ficha.get('objetos', [])}]
    inicios = [0.0 if i == 0 else T(P['t']) for i, P in enumerate(planos)]
    js, html = [], []
    SEGS = {}
    SOMBRA_LADO.clear()

    def camv(c): return dict(scale=c.get('zoom', 1), x=round(960 - c.get('x', 960) * c.get('zoom', 1), 1), y=round(540 - c.get('y', 540) * c.get('zoom', 1), 1))

    for i, P in enumerate(planos):
        t0 = inicios[i]; t1 = inicios[i + 1] if i + 1 < len(planos) else D
        clima = ''
        if P.get('clima') == 'frio_vinheta':
            clima = '<div class="clima" style="background:#3B3A6B;mix-blend-mode:multiply;opacity:.58"></div><div class="clima" style="box-shadow:inset 0 0 360px 60px rgba(20,18,45,.75)"></div>'
            if e_noite(P):  # 11/11: noite de lua: azul frio mais leve, sem afogar a cena
                clima = '<div class="clima" style="background:#4a5488;mix-blend-mode:multiply;opacity:.42"></div><div class="clima" style="box-shadow:inset 0 0 320px 40px rgba(20,18,45,.5)"></div>'
        if P.get('clima') == 'noite':  # 11/11: noite profunda (fachada a noite, so as luzes acesas se destacam; o que fica acima vai em "acima_do_clima")
            clima = '<div class="clima" style="background:#1d2148;mix-blend-mode:multiply;opacity:.82"></div><div class="clima" style="box-shadow:inset 0 0 420px 120px rgba(8,8,24,.85)"></div>'
        if P.get('clima') == 'lembranca':  # memoria: cores apagadas e um veu quente
            clima = '<div class="clima" style="background:radial-gradient(ellipse at center, rgba(255,240,210,0) 55%, rgba(120,90,60,.45) 100%)"></div>'
            js.append(f'document.getElementById("cam{i}").style.filter = "saturate(0.35) sepia(0.3) contrast(0.95)";')
        lz_html, lz_js = atmosfera(P, i, t0, t1, cid)
        js.extend(lz_js)
        clima = clima + lz_html
        lc, la = ('', '') if P.get('atmosfera', {}) is False else luz_fontes(P.get('cenario', {}).get('tipo', ''), i, (P.get('atmosfera') or {}).get('luz', 1.0) * (0.7 if e_noite(P) else 1.0))
        if e_noite(P):  # luar entrando pela janela: branco azulado
            for q, w in (('255,200,125', '205,220,255'), ('255,214,150', '210,224,255'), ('255,222,160', '215,228,255'), ('255,170,90', '180,195,240'), ('255,180,100', '185,200,240'), ('255,196,120', '195,210,250'), ('255,205,130', '200,215,255')):
                lc = lc.replace(q, w); la = la.replace(q, w)
        html.append(f'<div class="plano" id="p{i}"><div class="cam" id="cam{i}"><svg class="camada" id="f{i}" viewBox="0 0 1920 1080"></svg><div class="camada" id="a{i}"></div>'
                    f'<svg class="camada" id="fr{i}" viewBox="0 0 1920 1080"></svg><svg class="camada" id="fx{i}" viewBox="0 0 1920 1080"></svg>{la}</div>{clima}'
                    f'<div class="cam" id="camA{i}"><svg class="camada" id="ac{i}" viewBox="0 0 1920 1080"></svg></div></div>')  # 11/11: camada acima do clima (luzes acesas)
        # visibilidade e transicao
        js.append(f'tl.set("#p{i}", {{opacity:{1 if i == 0 else 0}, x:0}}, 0);')
        if i > 0:
            if P.get('transicao') == 'chicote':
                ti = round(t0 - 0.09, 3)
                js.append(f'tl.set("#p{i}", {{opacity:1}}, {ti}); tl.fromTo("#p{i}", {{x:1920, filter:"blur(18px)"}}, {{x:0, filter:"blur(0px)", duration:0.2, ease:"power3.out", ...F}}, {ti});')
                js.append(f'tl.to("#p{i - 1}", {{x:-1920, filter:"blur(18px)", duration:0.2, ease:"power3.in", ...F}}, {ti}); tl.set("#p{i - 1}", {{opacity:0}}, {round(ti + 0.2, 3)});')
            else:
                js.append(f'tl.set("#p{i}", {{opacity:1}}, {t0}); tl.set("#p{i - 1}", {{opacity:0}}, {t0});')
        # cenario
        cen = P.get('cenario', {}).get('tipo', 'ruaComercio')
        copc = {k: v for k, v in P.get('cenario', {}).items() if k not in ('tipo', 'anim')}; copc['id'] = f'cen{i}'
        js.append(f'(function(){{ const c = Cenarios.{cen}({json.dumps(copc, ensure_ascii=False)}); const tmp = document.createElement("div"); tmp.innerHTML = `<svg>${{c}}</svg>`; const g = tmp.querySelector("svg > g");'
                  f' document.getElementById("f{i}").insertAdjacentHTML("afterbegin", g.querySelector("#cen{i}-fundo").outerHTML + {json.dumps(lc)} + g.querySelector("#cen{i}-meio").outerHTML);'
                  f' document.getElementById("fr{i}").insertAdjacentHTML("afterbegin", g.querySelector("#cen{i}-frente").outerHTML); }})();')
        if P.get('cenario', {}).get('desfoque'):  # fundo e meio desfocados (close com o cenario atras)
            js.append(f'document.getElementById("f{i}").style.filter = "blur({P["cenario"]["desfoque"]}px)";')
        # animacao de partes do cenario: {"t", "alvo": "olhos" | "ponto-*", "opacity"/outras props, "dur", "stagger", "ease"}
        for An in P.get('cenario', {}).get('anim', []):
            ta = T(An['t']); alvo = An['alvo']
            sel = f'[id^="cen{i}-{alvo[:-1]}"]' if alvo.endswith('*') else f'#cen{i}-{alvo}'
            props = {k: v for k, v in An.items() if k not in ('t', 'alvo', 'dur', 'stagger', 'ease')}
            if 'rotation' in props or 'scale' in props:  # gira/escala num <g> novo em volta da peca (o transform proprio dela fazia a peca voar)
                js.append(f'[...document.querySelectorAll({json.dumps(sel)})].forEach((e, k) => {{ const o = e.style.transformOrigin; const w = W(e); tl.to(w, {{...{json.dumps(props)}, ...(o ? {{transformOrigin: o}} : {{}}), duration:{An.get("dur", 0.2)}, ease:"{An.get("ease", "back.out(2)")}", ...F}}, +({ta} + k * {An.get("stagger", 0)}).toFixed(3)); }});')
            else:
                js.append(f'tl.to(document.querySelectorAll({json.dumps(sel)}), {{...{json.dumps(props)}, duration:{An.get("dur", 0.2)}, stagger:{An.get("stagger", 0)}, ease:"{An.get("ease", "back.out(2)")}", ...F}}, {ta});')
        # camera
        cams = sorted(P.get('camera') or [{'t': t0}], key=lambda c: T(c['t']))
        v0 = camv(cams[0])
        js.append(f'tl.set("#cam{i}, #camA{i}", {{scale:{v0["scale"]}, x:{v0["x"]}, y:{v0["y"]}, transformOrigin:"0 0"}}, 0);')
        for a, b in zip(cams, cams[1:]):
            ta, tb = T(a['t']), T(b['t']); v = camv(b)
            if tb - ta <= 0.001:
                js.append(f'tl.set("#cam{i}, #camA{i}", {{scale:{v["scale"]}, x:{v["x"]}, y:{v["y"]}}}, {tb});')
            else:
                js.append(f'tl.to("#cam{i}, #camA{i}", {{scale:{v["scale"]}, x:{v["x"]}, y:{v["y"]}, duration:{round(tb - ta, 3)}, ease:"{b.get("ease", "power1.inOut")}", ...F}}, {ta});')
        # objetos
        presos = {}  # "obj.prato_e" -> lista de (t, dy, dur)
        objs = P.get('objetos', [])
        for k, O in enumerate(objs):
            if O['tipo'] == 'balanca' and O.get('inclinar'):
                e = O.get('escala', 0.5); oid = O.get('id', f'o{i}_{k}')
                for I in O['inclinar']:
                    th = math.radians(I['graus']); dy = 540 * math.sin(th) * e
                    presos.setdefault(f'{oid}.prato_e', []).append((T(I['t']), round(-dy, 1), I.get('dur', 0.5)))
                    presos.setdefault(f'{oid}.prato_d', []).append((T(I['t']), round(dy, 1), I.get('dur', 0.5)))

        def preso(sel, chave, div=1.0):
            for (tt, dy, du) in presos.get(chave, []):
                dy = round(dy / div, 1)
                if tt <= t0 + 0.001:
                    js.append(f'tl.set("{sel}", {{y:{dy}}}, 0);')
                else:
                    js.append(f'tl.to("{sel}", {{y:{dy}, duration:{du}, ease:"elastic.out(1,0.5)", ...F}}, {tt});')

        reserv = {'tipo', 'id', 'x', 'pes', 'escala', 'camada', 'mover', 'pular', 'entra', 'abrir_cordao', 'inclinar', 'cair', 'arrancar', 'preso_a', 'largura', 'espelho', 'na_mao', 't',
                  'y', 'foto', 'tela', 'subir', 'girar', 'rolar', 'coracoes', 'mensagens', 'figurinhas', 'multiplicar', 'congelar', 'inicio', 'flashes', 'quantas', 'intervalo',
                  'bater', 'desenhar', 'anel', 'pousar', 'fechar', 'muro', 'portao', 'cascata', 'acender', 'vai_e_vem', 'ritmo', 'deriva', 'abrir_lateral', 'poltronas_voando',
                  'corte', 'placa', 'bandeira', 'helicoptero', 'submarino', 'cinema', 'hospital', 'revelar', 'flutuar', 'aranha', 'apagar', 'tremer'}
        movs = {}  # id/tipo do objeto -> tweens que um ator "preso_a"/"subir_com" repete
        for k, O in enumerate(objs):
            if O['tipo'] == 'fotinhosGlobo':  # fotinhos sobre os pontos do espacoGlobo, surgindo em cascata
                oid = O.get('id', f'o{i}_{k}'); e = O.get('escala', 0.32); t = T(O['t'])
                camf = "fr" if O.get("camada", "frente") == "frente" else "f"
                js.append(f'(function(){{ const R = Objetos.rostoDoRig("principal_svg", "{O.get("foto", "surpreso")}"); let m = ""; Cenarios.espacoGlobo.pontos.forEach(([x, y], k) => {{ if (k % {O.get("cada", 2)} === {O.get("resto", 1)}) m += `<g id="{oid}-q${{k}}"><g transform="translate(${{x}} ${{y}}) scale({e})">${{Objetos.fotinho({{rosto: R, id: "{oid}-r" + k}})}}</g></g>`; }});'
                          f' document.getElementById("{camf}{i}").insertAdjacentHTML("beforeend", `<g id="{oid}">${{m}}</g>`);'
                          f' const els = document.querySelectorAll(\'[id^="{oid}-q"]\'); tl.set(els, {{scale:0, transformOrigin:"50% 50%"}}, 0); tl.to(els, {{scale:1, duration:0.3, stagger:{O.get("intervalo", 0.05)}, ease:"back.out(2.5)", ...F}}, {t}); }})();')
                continue
            oid = O.get('id', f'o{i}_{k}'); e = O.get('escala', 0.5); y = O.get('pes', 1000) - 362 * e
            alvo = 'fr' if O.get('camada', 'meio' if O['tipo'] in ('cama',) and O.get('parte') == 'base' else 'frente') == 'frente' else 'f'
            if O.get('camada') == 'meio':
                alvo = 'f'
            if O.get('camada') == 'acima':  # acima do clima (nao escurece)
                alvo = 'ac'
            esq = O['espelho'] if 'espelho' in O else (bool(O.get('mover')) and O['mover']['ate_x'] < O.get('x', 0))
            larg = O.get('largura', 900)
            if 'y' in O:  # objeto flutuante (centrado em 0,0 ou com origem propria): posiciona pela origem
                y = O['y']
            tr = f'translate({O.get("x", 0) + larg * e} {round(y, 1)}) scale({-e} {e})' if esq else f'translate({O.get("x", 0)} {round(y, 1)}) scale({e})'
            op = {kk: vv for kk, vv in O.items() if kk not in reserv}
            op.setdefault('cor', '#F5C542'); op['id'] = oid + '-o'
            if O.get('tela'):
                op['modo'] = O['tela']
            if O['tipo'] == 'multidao':
                op['largura'] = O.get('largura', 1920)
            chamada = f'Objetos.{O["tipo"]}({json.dumps(op, ensure_ascii=False)})'
            foto = O.get('foto') or (O.get('bandeira') or {}).get('foto')
            if foto:
                chamada = f'Objetos.{O["tipo"]}(Object.assign({json.dumps(op, ensure_ascii=False)}, {{rosto: Objetos.rostoDoRig("principal_svg", "{foto}")}}))'
            if O['tipo'] in ('aviao', 'iate', 'iateGrande') and O.get('corte'):  # versao em corte embaixo, fechada por cima
                opc = dict(op, modo='corte', id=oid + '-c')
                chamada = f'Objetos.{O["tipo"]}({json.dumps(opc, ensure_ascii=False)}) + Objetos.{O["tipo"]}({json.dumps(op, ensure_ascii=False)})'
            ox, oy = O.get('x', 0), round(y, 1)  # origem do desenho na cena (para escala/giro)
            if O.get('cair') and 'quantas' not in O['cair']:  # um objeto so (alfinete) cai do alto
                js.append(f'document.getElementById("{alvo}{i}").insertAdjacentHTML("beforeend", `<g id="{oid}"><g transform="{tr}">${{{chamada}}}</g></g>`);')
                tc = T(O['cair']['t'])
                js.append(f'tl.set("#{oid}", {{y:-900, opacity:0}}, 0); tl.set("#{oid}", {{opacity:1}}, {tc}); tl.to("#{oid}", {{y:0, duration:0.4, ease:"bounce.out", ...F}}, {tc});')
            elif O.get('cair'):
                Cc = O['cair']; n = Cc.get('quantas', 10); col = Cc.get('colunas', 6); dx = Cc.get('dx', 44); dyy = Cc.get('dy', 56)
                partes = []; quedas = []  # quedas depois do insert: o seletor tem que achar o elemento ja desenhado
                for j in range(n):
                    r, c = divmod(j, col)
                    xx = round(O.get('x', 0) + (c - (col - 1) / 2) * dx + (r % 2) * dx / 2, 1); yy = round(O.get('pes', 1000) - r * dyy - 362 * e, 1)
                    partes.append(f'<g id="{oid}-c{j}"><g transform="translate({xx} {yy}) scale({e})">${{Objetos.{O["tipo"]}({json.dumps(dict(op, id=f"{oid}-o{j}"))})}}</g></g>')
                    tt = round(T(Cc['t']) + j * Cc.get('intervalo', 0.12), 3)
                    quedas.append(f'tl.set("#{oid}-c{j}", {{y:-900, opacity:0}}, 0); tl.set("#{oid}-c{j}", {{opacity:1}}, {tt}); tl.to("#{oid}-c{j}", {{y:0, duration:0.32, ease:"bounce.out", ...F}}, {tt});')
                js.append(f'document.getElementById("{alvo}{i}").insertAdjacentHTML("beforeend", `<g id="{oid}">{"".join(partes)}</g>`);')
                js.extend(quedas)
            else:
                js.append(f'document.getElementById("{alvo}{i}").insertAdjacentHTML("beforeend", `<g id="{oid}"><g transform="{tr}">${{{chamada}}}</g></g>`);')
            if not (O.get('cair') and 'quantas' not in O['cair']):
                js.append(f'tl.set("#{oid}", {{x:0, y:0}}, 0);')
            mv = movs.setdefault(O.get('id') or O['tipo'], [])
            p_ = f'"#{oid}-o'  # prefixo dos ids internos
            if O.get('subir'):  # cartaz (ou ilha) sobe de baixo da tela
                Su = O['subir']; t = round(T(Su['t']) + Su.get('atraso', 0), 3)
                js.append(f'tl.set("#{oid}", {{y:{Su.get("de", 520)}}}, 0); tl.to("#{oid}", {{y:0, duration:{Su.get("dur", 0.3)}, ease:"{Su.get("ease", "back.out(1.6)")}", ...F}}, {t});')
                mv.append(('set', 'y', Su.get('de', 520), 0, None, 0)); mv.append(('to', 'y', 0, Su.get('dur', 0.3), Su.get('ease', 'back.out(1.6)'), t))
                if O['tipo'] == 'ilha':
                    js.append(f'tl.set("#{oid}", {{opacity:0}}, 0); tl.to("#{oid}", {{opacity:1, duration:0.15, ...F}}, {t});')
            # ---- acoes dos objetos da parte 3 ----
            if O.get('bater'):  # carimbo: desce grande e bate
                t = T(O['bater']['t'])
                js.append(f'tl.set("#{oid}", {{opacity:0}}, 0); tl.set("#{oid}", {{opacity:1}}, {t}); tl.fromTo("#{oid}", {{scale:2.6, rotation:-10, svgOrigin:"{ox} {oy}"}}, {{scale:1, rotation:0, svgOrigin:"{ox} {oy}", duration:0.18, ease:"power4.in", ...F}}, {t});')
            if O.get('desenhar'):
                De = O['desenhar']; t = T(De['t']); du = De.get('dur', 0.8)
                js.append(f"""(function(){{ const p = document.getElementById("{oid}-o-tracejado");
  if (p) {{ const L = Math.ceil(p.getTotalLength()) + 10; const d = p.getAttribute("d"); const mk = "{oid}-mk";
    p.parentNode.insertAdjacentHTML("afterbegin", `<defs><mask id="${{mk}}" maskUnits="userSpaceOnUse" x="-4000" y="-4000" width="12000" height="12000"><path id="${{mk}}-p" d="${{d}}" fill="none" stroke="#fff" stroke-width="60" stroke-dasharray="${{L}} ${{L}}" stroke-dashoffset="${{L}}"/></mask></defs>`);
    [p, document.getElementById("{oid}-o-tracejado-fundo")].forEach(e => e && e.setAttribute("mask", `url(#${{mk}})`));
    tl.to("#" + mk + "-p", {{attr:{{"stroke-dashoffset":0}}, duration:{du}, ease:"power1.inOut", ...F}}, {t}); }}
  else {{ tl.set("#{oid}", {{opacity:0}}, 0); tl.set("#{oid}", {{opacity:1}}, {t}); tl.fromTo("#{oid}", {{scale:0, rotation:-160, svgOrigin:"{ox} {oy}"}}, {{scale:1, rotation:0, svgOrigin:"{ox} {oy}", duration:{du}, ease:"back.out(1.5)", ...F}}, {t}); }} }})();""")
            if O.get('anel'):  # lupa: o anel pulsa
                t = T(O['anel']['t'])
                js.append(f'(function(){{ const a = document.getElementById("{oid}-o-anel"); if (!a) return; const w = W(a); tl.fromTo(w, {{scale:1, transformOrigin:"50% 50%"}}, {{scale:1.18, duration:0.18, repeat:5, yoyo:true, ease:"sine.inOut", ...F}}, {t}); }})();')
            if O.get('pousar'):
                t = T(O['pousar']['t'])
                js.append(f'tl.set("#{oid}", {{opacity:0}}, 0); tl.set("#{oid}", {{opacity:1}}, {t}); tl.fromTo("#{oid}", {{y:-90}}, {{y:0, duration:0.35, ease:"bounce.out", ...F}}, {t});')
            if O.get('fechar') and O['tipo'] == 'mesaLivroCaixa':
                t = T(O['fechar']['t'])
                js.append(f'tl.set({p_}-livro-aberto", {{opacity:1}}, 0); tl.set({p_}-livro-fechado", {{opacity:0}}, 0); tl.set({p_}-livro-aberto", {{opacity:0}}, {t}); tl.set({p_}-livro-fechado", {{opacity:1}}, {t});'
                          f' (function(){{ const w = W(document.getElementById("{oid}-o-livro-fechado")); tl.fromTo(w, {{scale:1.12, transformOrigin:"50% 100%"}}, {{scale:1, duration:0.3, ease:"back.out(3)", ...F}}, {t}); }})();')
            if O.get('muro'):
                Mu_ = O['muro']; t = T(Mu_['t'])
                js.append(f'(function(){{ const w = W(document.getElementById("{oid}-o-muro")); tl.set("#{oid}-o-muro", {{opacity:0}}, 0); tl.set("#{oid}-o-muro", {{opacity:1}}, {t}); tl.fromTo(w, {{scale:1.06, transformOrigin:"50% 50%"}}, {{scale:1, duration:{Mu_.get("dur", 0.5)}, ease:"back.out(2)", ...F}}, {t}); }})();')
            if O.get('portao'):
                Po = O['portao']; t = T(Po['t'])
                js.append(f'tl.set({p_}-portao", {{opacity:0}}, 0); tl.set({p_}-portao", {{opacity:1}}, {t});'
                          f' (function(){{ const fe = document.getElementById("{oid}-o-portaoC-folha-e"), fd = document.getElementById("{oid}-o-portaoC-folha-d"); if (!fe || !fd) return; const we = W(fe), wd = W(fd);'
                          f' tl.set(we, {{rotation:-80, transformOrigin:"0% 50%"}}, 0); tl.set(wd, {{rotation:80, transformOrigin:"100% 50%"}}, 0);'
                          f' tl.to(we, {{rotation:0, duration:0.3, ease:"back.out(2)", ...F}}, {T(Po.get("fechar", Po["t"]))}); tl.to(wd, {{rotation:0, duration:0.3, ease:"back.out(2)", ...F}}, {T(Po.get("fechar", Po["t"]))}); }})();')
            if O.get('cascata'):  # campos de futebol surgem um a um
                Ca = O['cascata']; t = T(Ca['t'])
                js.append(f'(function(){{ const r = document.getElementById("{oid}-o-rotulo"); if (r) r.setAttribute("opacity", 0); const els = [...document.querySelectorAll(\'[id^="{oid}-o-{Ca.get("parte", "campo")}-"]\')].map(W);'
                          f' tl.set(els, {{scale:0, transformOrigin:"50% 50%"}}, 0); tl.to(els, {{scale:1, duration:0.3, stagger:{Ca.get("intervalo", 0.1)}, ease:"back.out(2.5)", ...F}}, {t}); }})();')
            for Rv in O.get('revelar', []):  # acende uma parte do desenho (check, carimbo, ponta...) com um pop
                t = T(Rv['t']); pid = f'{oid}-o-{Rv["parte"]}'
                js.append(f'(function(){{ const e = document.getElementById("{pid}"); if (!e) return; tl.set(e, {{opacity:0}}, 0); tl.set(e, {{opacity:1}}, {t}); const w = W(e); tl.fromTo(w, {{scale:{Rv.get("de", 1.8)}, transformOrigin:"50% 50%"}}, {{scale:1, duration:{Rv.get("dur", 0.22)}, ease:"{Rv.get("ease", "back.out(2.5)")}", ...F}}, {t}); }})();')
            for Ap in O.get('apagar', []):  # desbota uma parte (amigo do retrato, maos que trocam)
                t = T(Ap['t']); pid = f'{oid}-o-{Ap["parte"]}'
                js.append(f'tl.to("#{pid}", {{opacity:{Ap.get("ate", 0.15)}, filter:"grayscale(1)", duration:{Ap.get("dur", 0.6)}, ease:"power1.inOut", ...F}}, {t});')
            if O.get('tremer'):  # vibra no lugar (celular tocando)
                Tr = O['tremer']; t = T(Tr['t']); ate_ = T(Tr['ate']) if Tr.get('ate') else D; nrep = max(1, int((ate_ - t) / 0.05)); nrep -= (nrep + 1) % 2
                js.append(f'tl.fromTo("#{oid}", {{x:-6}}, {{x:6, duration:0.05, repeat:{nrep}, yoyo:true, ease:"none", ...F}}, {t}); tl.set("#{oid}", {{x:0}}, {ate_});')
            if O.get('flutuar'):  # letras (zzz) sobem e somem em loop, uma depois da outra
                Fl_ = O['flutuar']; t = T(Fl_['t']); ate_ = T(Fl_['ate']) if Fl_.get('ate') else D; per = Fl_.get('periodo', 1.2)
                js.append(f'document.querySelectorAll(`[id^="{oid}-o-z-"]`).forEach((z, k) => {{ const w = W(z); tl.set(w, {{opacity:0}}, 0); const t0 = +({t} + k * {per / 3}).toFixed(3); const n = Math.max(0, Math.floor(({ate_} - t0) / {per}) - 1); tl.fromTo(w, {{opacity:0, y:20}}, {{opacity:1, y:-40, duration:{per}, repeat:n, ease:"sine.out", ...F}}, t0); tl.set(w, {{opacity:0}}, {ate_}); }});')
            if O.get('aranha'):  # teia aparece e a aranha desce no fio
                Ar_ = O['aranha']; t = T(Ar_['t'])
                js.append(f'tl.set({p_}-teia", {{opacity:0}}, 0); tl.to({p_}-teia", {{opacity:1, duration:0.3, ...F}}, {t}); tl.set({p_}-aranha", {{y:-260, opacity:0}}, 0); tl.set({p_}-aranha", {{opacity:1}}, {round(t + 0.15, 3)}); tl.to({p_}-aranha", {{y:0, duration:0.9, ease:"bounce.out", ...F}}, {round(t + 0.15, 3)});')
            if O['tipo'] == 'trabalhadores':  # acender (surgem), vai_e_vem (andam no comodo), ritmo (pulam juntos no tique)
                Ac = O.get('acender') or {}; Vv = O.get('vai_e_vem'); Ri = O.get('ritmo')
                ta = T(Ac['t']) if Ac else 0
                tv = T(Vv['t']) if Vv else None; tr_ = T(Ri['t']) if Ri else None; per = 60 / Ri.get('bpm', 120) if Ri else 0.5
                js.append(f"""(function(){{ const els = [...document.querySelectorAll('#{oid} [id^="{oid}-o-t-"]')].filter(e => /-t-\\d+$/.test(e.id));
  els.forEach((e, k) => {{ const w = W(e), w2 = W(w);
    {f'tl.set(w2, {{scale:0, transformOrigin:"50% 100%"}}, 0); tl.to(w2, {{scale:1, duration:0.2, ease:"back.out(3)", ...F}}, +({ta} + k * {Ac.get("intervalo", 0.03)}).toFixed(3));' if Ac else ''}
    {f'const dv = 0.5 + (k % 5) * 0.12, nv = Math.max(1, Math.floor(({D} - {tv}) / dv) - 1); tl.fromTo(w, {{x:0}}, {{x:(k % 2 ? 26 : -26), duration:dv, repeat:(nv % 2 ? nv : nv - 1), yoyo:true, ease:"sine.inOut", ...F}}, {tv});' if Vv else ''}
    {f'const nr = Math.max(1, Math.floor(({D} - {tr_}) / {per / 2}) - 1); tl.fromTo(w2, {{y:0}}, {{y:-10, duration:{per / 2}, repeat:(nr % 2 ? nr : nr - 1), yoyo:true, ease:"power1.inOut", ...F}}, {tr_});' if Ri else ''}
  }}); }})();""")
            if O['tipo'] == 'engrenagens' and O.get('girar'):
                G_ = O['girar']; t = T(G_['t']); du = round(D - t, 3); passos = max(1, int(du * 2))
                js.append(f'document.querySelectorAll(\'[id^="{oid}-o-engrenagem-"]\').forEach((g, k) => tl.fromTo(g, {{rotation:0, svgOrigin:g.dataset.cx + " " + g.dataset.cy}}, {{rotation:(k % 2 ? -1 : 1) * {passos * 20}, svgOrigin:g.dataset.cx + " " + g.dataset.cy, duration:{du}, ease:"{"steps(" + str(passos) + ")" if G_.get("tique") else "none"}", ...F}}, {t}));')
            if O['tipo'] == 'aviao':  # cabine com poltronas atras da lateral; lateral sai, poltronas voam, aparece a versao em corte
                Al = O.get('abrir_lateral'); Pv = O.get('poltronas_voando'); Co_ = O.get('corte')
                if Al:
                    t = T(Al['t'])
                    js.append(f"""(function(){{ const lat = document.getElementById("{oid}-o-lateral"); let s = `<g id="{oid}-cab" opacity="0"><rect x="-600" y="-74" width="1240" height="124" fill="#f6e3c4"/>`;
  for (let j = 0; j < 22; j++) s += `<g transform="translate(${{-560 + j * 52}} -6)"><g id="{oid}-pol-${{j}}"><g transform="scale(0.42)">${{Objetos.poltrona({{id: "{oid}-pl" + j}})}}</g></g></g>`;
  lat.insertAdjacentHTML("beforebegin", s + `</g>`); tl.set("#{oid}-cab", {{opacity:1}}, {t});
  const wl = W(lat); tl.to(wl, {{y:-420, rotation:-8, opacity:0, transformOrigin:"50% 50%", duration:0.55, ease:"power2.in", ...F}}, {t}); }})();""")
                if Pv:
                    t = T(Pv['t']); iv = Pv.get('intervalo', 0.06)
                    js.append(f'for (let j = 0; j < 22; j++) {{ const tj = +({t} + j * {iv}).toFixed(3); tl.to("#{oid}-pol-" + j, {{y:-520 - (j % 4) * 90, x:(j % 2 ? 1 : -1) * (80 + (j % 5) * 40), rotation:(j % 2 ? 1 : -1) * 300, opacity:0, duration:0.75, ease:"power2.out", ...F}}, tj); }}')
                if Co_:
                    t = T(Co_['t'])
                    js.append(f'tl.set("#{oid}-cab", {{opacity:0}}, {t}); tl.to("#{oid}-o", {{opacity:0, duration:0.3, ...F}}, {t}); tl.fromTo("#{oid}-c-comodos", {{opacity:0}}, {{opacity:1, duration:0.3, ...F}}, {t});')
            if O['tipo'] == 'ilha':
                if O.get('placa'):
                    t = T(O['placa']['t'])
                    js.append(f'(function(){{ const w = W(document.getElementById("{oid}-o-placa")); tl.set("#{oid}-o-placa", {{opacity:1}}, 0); tl.set(w, {{scale:0, transformOrigin:"50% 100%"}}, 0); tl.to(w, {{scale:1, duration:0.3, ease:"back.out(2.5)", ...F}}, {t}); }})();')
                if O.get('bandeira'):
                    Ba = O['bandeira']; t = T(Ba['t'])
                    js.append(f'tl.fromTo({p_}-bandeira", {{y:0}}, {{y:-330, duration:{Ba.get("dur", 0.8)}, ease:"power2.out", ...F}}, {t});')
            if O['tipo'] in ('iate', 'iateGrande'):
                sel2 = f'#{oid} [id$="-porta-garagem"]'
                if O.get('helicoptero'):
                    t = T(O['helicoptero']['t'])
                    js.append(f"""(function(){{ const g = document.getElementById("{oid}-o"); g.insertAdjacentHTML("beforeend", `<g id="{oid}-heli"><g transform="translate(380 -120) scale(0.7)">${{Objetos.helicoptero({{id: "{oid}-hl"}})}}</g></g>`);
  tl.set("#{oid}-heli", {{opacity:0, x:900, y:-700}}, 0); tl.set("#{oid}-heli", {{opacity:1}}, {round(t - 0.9, 3)}); tl.to("#{oid}-heli", {{x:0, y:0, duration:1.0, ease:"power2.out", ...F}}, {round(t - 0.9, 3)});
  const h = document.getElementById("{oid}-hl-helice"); if (h) tl.fromTo(h, {{scaleX:1, transformOrigin:"50% 50%"}}, {{scaleX:-1, duration:0.06, repeat:{int((D - t + 0.9) / 0.06) // 2 * 2 - 1}, yoyo:true, ease:"none", ...F}}, {round(t - 0.9, 3)}); }})();""")
                if O.get('submarino'):
                    t = T(O['submarino']['t'])
                    js.append(f"""(function(){{ document.querySelectorAll('{sel2}').forEach(p => tl.to(p, {{scaleY:0.08, duration:0.3, ease:"power2.in", ...F}}, {t}));
  document.getElementById("{oid}-o").insertAdjacentHTML("afterbegin", `<g id="{oid}-sub"><g transform="translate(690 200) scale(0.55)">${{Objetos.submarino({{id: "{oid}-sb"}})}}</g></g>`);
  tl.set("#{oid}-sub", {{opacity:0, x:0, y:0}}, 0); tl.set("#{oid}-sub", {{opacity:1}}, {round(t + 0.25, 3)}); tl.to("#{oid}-sub", {{x:-360, y:150, duration:1.0, ease:"power1.inOut", ...F}}, {round(t + 0.25, 3)}); }})();""")
                if O.get('corte'):
                    t = T(O['corte']['t'])
                    js.append(f'(function(){{ const g = document.getElementById("{oid}-o"); const keep = ["{oid}-heli", "{oid}-sub"].map(i => document.getElementById(i)).filter(Boolean); keep.forEach(k => g.parentNode.appendChild(k));'
                              f' [...g.children].forEach(c => tl.to(c, {{opacity:0, duration:0.3, ...F}}, {t})); tl.fromTo("#{oid}-c-comodos", {{opacity:0}}, {{opacity:1, duration:0.3, ...F}}, {t}); }})();')
                if O.get('cinema'):
                    t = T(O['cinema']['t'])
                    js.append(f'tl.set("#{oid}-c-cinema-tela", {{opacity:0.25}}, 0); tl.to("#{oid}-c-cinema-tela", {{opacity:1, duration:0.08, repeat:3, yoyo:true, ...F}}, {t}); tl.set("#{oid}-c-cinema-tela", {{opacity:1}}, {round(t + 0.35, 3)});')
                if O.get('hospital'):
                    t = T(O['hospital']['t'])
                    js.append(f'(function(){{ const w = W(document.getElementById("{oid}-c-hospital")); tl.fromTo(w, {{scale:1, transformOrigin:"50% 50%"}}, {{scale:1.08, duration:0.15, repeat:3, yoyo:true, ease:"sine.inOut", ...F}}, {t}); }})();')
            if O.get('girar') and O['tipo'] not in ('engrenagens',):  # relogio: ponteiros giram em volta de 0 0
                G_ = O['girar']; t = T(G_['t']); vt = G_.get('voltas', 3)
                js.append(f'tl.to("#{oid}-o-min", {{rotation:{360 * vt}, svgOrigin:"0 0", duration:{G_.get("dur", 1.5)}, ease:"power2.inOut", ...F}}, {t});'
                          f' tl.to("#{oid}-o-hora", {{rotation:{30 * vt}, svgOrigin:"0 0", duration:{G_.get("dur", 1.5)}, ease:"power2.inOut", ...F}}, {t});')
            if O.get('rolar'):  # feed do celular rola para cima
                Ro = O['rolar']
                js.append(f'tl.to("#{oid}-o-lista", {{y:{Ro.get("dy", -420)}, duration:{Ro.get("dur", 0.6)}, ease:"power3.inOut", ...F}}, {T(Ro["t"])});')
            if O.get('coracoes'):
                Co = O['coracoes']; t = T(Co['t'])
                for j in range(Co.get('quantos', 8)):
                    tj = round(t + j * 0.09, 3)
                    js.append(f'(function(){{ const el = document.getElementById("{oid}-o-cor-{j}"); const w = W(el); tl.set(el, {{opacity:1}}, {tj}); tl.fromTo(w, {{y:60}}, {{y:-170, duration:1.0, ease:"power1.out", ...F}}, {tj}); tl.to(el, {{opacity:0, duration:0.25, ...F}}, {round(tj + 0.8, 3)}); }})();')
            if O.get('mensagens'):
                ult = 0
                for j, Me in enumerate(O['mensagens']):
                    tj = T(Me['t']); ult = tj
                    js.append(f'(function(){{ const el = document.getElementById("{oid}-o-msg-{j + 1}"); const w = W(el); tl.set(el, {{opacity:1}}, {tj}); tl.fromTo(w, {{scale:0.5, transformOrigin:"0% 100%"}}, {{scale:1, duration:0.3, ease:"back.out(2.4)", ...F}}, {tj}); }})();')
                for j in range(O.get('figurinhas', 4)):
                    tj = round(ult + 0.35 + j * 0.15, 3)
                    js.append(f'(function(){{ const el = document.getElementById("{oid}-o-fig-{j}"); const w = W(el); tl.set(el, {{opacity:1}}, {tj}); tl.fromTo(w, {{scale:0, transformOrigin:"50% 50%"}}, {{scale:1, duration:0.3, ease:"back.out(3)", ...F}}, {tj}); }})();')
            if O['tipo'] == 'multidao':  # multiplicar (surge em cascata), balanca ate congelar, flashes das cameras
                Mu = O.get('multiplicar'); cong = T(O['congelar']) if O.get('congelar') else D
                ini = O.get('inicio', 9999); tm = T(Mu['t']) if Mu else 0; iv = Mu.get('intervalo', 0.012) if Mu else 0
                Fl = O.get('flashes') or {}
                fa, fb = (T(Fl['t']), T(Fl['ate'])) if Fl else (0, 0)
                js.append(f"""(function(){{ const OP = {json.dumps(op)}; const L = Objetos.multidao.info(OP);
  const ord = L.map(p => [p, Math.abs(Math.sin(p.i * 12.9898) * 43758.5453) % 1]).sort((a, b) => a[1] - b[1]).map(a => a[0]);
  ord.forEach((p, k) => {{ const el = document.getElementById("{oid}-o-p" + p.i); const w = W(el); let tb = {t0};
    if (k >= {ini}) {{ const tk = +({tm} + (k - {ini}) * {iv}).toFixed(3); tl.set(w, {{opacity:0}}, 0); tl.set(w, {{opacity:1}}, tk); tl.fromTo(w, {{y:70}}, {{y:0, duration:0.2, ease:"back.out(2)", ...F}}, tk); tb = tk + 0.2; }}
    tb = +(tb + ((p.i * 7) % 10) * 0.025).toFixed(3); const per = 0.24; const n = Math.floor(({cong} - tb) / per);
    if (n >= 2) {{ const r = n % 2 ? n - 2 : n - 1; tl.fromTo(w, {{y:0}}, {{y:-9, duration:per, repeat:r, yoyo:true, ease:"sine.inOut", ...F}}, tb); }}
    if (p.cam && {'true' if Fl else 'false'}) {{ const fx = p.x + p.e * 60, fy = p.y - p.e * 335; w.insertAdjacentHTML("beforeend", `<g transform="translate(${{fx}} ${{fy}})"><g id="{oid}-fl${{p.i}}">${{Objetos.flashCamera({{id: "{oid}-flo" + p.i}})}}</g></g>`);
      const f = document.getElementById("{oid}-fl" + p.i); tl.set(f, {{scale:0, transformOrigin:"50% 50%"}}, 0);
      for (let j = 0; j < {Fl.get("vezes", 3)}; j++) {{ const tf = +({fa} + (((p.i * 37 + j * 101) % 97) / 97) * ({fb} - {fa} - 0.2)).toFixed(3);
        tl.to(f, {{scale:{Fl.get("escala", 0.55)}, duration:0.05, ease:"power2.out", ...F}}, tf); tl.to(f, {{scale:0, duration:0.12, ease:"power2.in", ...F}}, +(tf + 0.07).toFixed(3)); }} }}
  }}); }})();""")
            if O.get('preso_a'):
                preso(f'#{oid}', O['preso_a'])
            if O.get('mover'):
                M = O['mover']; t = T(M['t']); d = M.get('dur', 3); dxm = M['ate_x'] - O.get('x', 0)
                js.append(f'tl.to("#{oid}", {{x:{dxm}, duration:{d}, ease:"{M.get("ease", "none")}", ...F}}, {t});')
                mv.append(('to', 'x', dxm, d, M.get('ease', 'none'), t))
            if O.get('deriva'):  # segundo movimento, depois do mover (avião seguindo devagar)
                Dv = O['deriva']; t = T(Dv['t']); dxd = Dv['ate_x'] - O.get('x', 0)
                js.append(f'tl.to("#{oid}", {{x:{dxd}, duration:{Dv.get("dur", 3)}, ease:"{Dv.get("ease", "none")}", ...F}}, {t});')
                mv.append(('to', 'x', dxd, Dv.get('dur', 3), Dv.get('ease', 'none'), t))
            if O.get('mover'):
                M = O['mover']; t = T(M['t']); d = M.get('dur', 3); dxm = M['ate_x'] - O.get('x', 0)
                if M.get('rodas'):
                    volta = abs(dxm) / (2 * 3.1416 * 66 * e) * 360
                    js.append(f'document.querySelectorAll("#{oid} .roda").forEach(r => tl.fromTo(r, {{rotation:0, svgOrigin:r.dataset.cx + " " + r.dataset.cy}}, {{rotation:{round(volta)}, svgOrigin:r.dataset.cx + " " + r.dataset.cy, duration:{d}, ease:"none", ...F}}, {t}));')
            if O.get('entra'):
                En = O['entra']; t = T(En['t'])
                js.append(f'tl.set("#{oid} > g", {{opacity:0}}, 0); tl.set("#{oid} > g", {{opacity:1}}, {t}); tl.from("#{oid}", {{scale:0.2, transformOrigin:"50% 100%", duration:{En.get("dur", 0.25)}, ease:"back.out(2)", ...F}}, {t});')
            if O.get('pular'):
                Pu = O['pular']; t = T(Pu['t']); hh = Pu.get('altura', 30)
                for v in range(Pu.get('vezes', 1)):
                    tv = round(t + v * 0.22, 3)
                    js.append(f'tl.to("#{oid}", {{y:{-hh}, duration:0.1, ease:"power2.out", ...F}}, {tv}); tl.to("#{oid}", {{y:0, duration:0.12, ease:"power2.in", ...F}}, {round(tv + 0.1, 3)});')
                js.append(f'(function(){{ const s = document.getElementById("{oid}-o-sinos"); if (s) {{ {"".join(f"tl.to(s, {{rotation:{(8 if v % 2 else -8)}, svgOrigin:\"60 214\", duration:0.05, ...F}}, {round(t + v * 0.06, 3)});" for v in range(10))} tl.to(s, {{rotation:0, svgOrigin:"60 214", duration:0.05, ...F}}, {round(t + 0.6, 3)}); }} }})();')
            if O.get('abrir_cordao'):
                Ab = O['abrir_cordao']; t = T(Ab['t'])
                js.append(f'tl.to("#{oid}-o-cordao", {{rotation:78, svgOrigin:"-30 100", duration:{Ab.get("dur", 0.5)}, ease:"bounce.out", ...F}}, {t});')
            if O.get('inclinar'):
                for I in O['inclinar']:
                    t = T(I['t'])
                    if t <= t0 + 0.001:
                        js.append(f'tl.set("#{oid}-o-braco", {{rotation:{I["graus"]}, svgOrigin:"650 -420"}}, 0);')
                    else:
                        js.append(f'tl.to("#{oid}-o-braco", {{rotation:{I["graus"]}, svgOrigin:"650 -420", duration:{I.get("dur", 0.5)}, ease:"elastic.out(1,0.5)", ...F}}, {t});')
                for lado in ('e', 'd'):
                    preso(f'#{oid}-o-prato_{lado}', f'{oid}.prato_{lado}', e)
            if O.get('arrancar'):
                Ar = O['arrancar']; ta, tb = T(Ar['t']), T(Ar['ate']); n = O.get('folhas', 8) - 1
                for j in range(1, n + 1):
                    tj = round(ta + (tb - ta) * math.sqrt((j - 1) / n), 3)
                    js.append(f'tl.to("#{oid}-o-folha-{j}", {{x:{140 + j % 3 * 40}, y:-260, rotation:{30 + j % 4 * 12}, opacity:0, transformOrigin:"50% 0%", duration:0.28, ease:"power2.in", ...F}}, {tj});')
        # atores
        for A in P.get('atores', []):
            aid = f"{A['id']}{i}"; e = A.get('escala', 0.33)
            base = RIG.get(A.get('rig', 'principal'), A.get('rig'))
            acoes = A.get('acoes', [])
            if any(ac.get('roupa') == 'pijama' for ac in acoes) and base == 'principal_svg':
                base = 'principal_pijama'
            troca = [ac for ac in acoes if ac.get('peca') == 'barba_branca']
            variantes = [(base, 0.0)]
            if troca:
                tb_ = T(troca[0]['t'])
                if tb_ <= t0 + 0.001:
                    variantes = [(BARBUDO.get(base, base), 0.0)]
                else:
                    variantes = [(base, 0.0), (BARBUDO.get(base, base), tb_)]
            html_box = f'<div class="atorbox" id="box{aid}">' + ''.join(f'<div id="ator-{aid}{k}" class="ator"></div>' for k in range(len(variantes))) + '</div>'
            js.append(f'document.getElementById("a{i}").insertAdjacentHTML("beforeend", `{html_box}`);')
            js.append(f'tl.set("#box{aid}", {{x:0, y:0}}, 0);')
            for ac in acoes:
                if 'visivel' in ac:
                    tv_ = T(ac.get('t', 0))
                    js.append(f'tl.set("#box{aid}", {{opacity:{1 if ac["visivel"] else 0}}}, {0 if tv_ <= t0 + 0.001 else tv_});')
                    if ac['visivel'] and A.get('surgir_de') and tv_ > t0 + 0.001:
                        js.append(f'tl.fromTo("#box{aid}", {{y:110}}, {{y:0, duration:0.3, ease:"back.out(2.2)", ...F}}, {tv_});')
            def repete(sel, nome):
                for (kk_, prop, val, du_, ea_, tt_) in movs.get(nome, []):
                    if kk_ == 'set':
                        js.append(f'tl.set("{sel}", {{{prop}:{val}}}, {tt_});')
                    else:
                        js.append(f'tl.to("{sel}", {{{prop}:{val}, duration:{du_}, ease:"{ea_}", ...F}}, {tt_});')
            if A.get('preso_a') and '.' in A['preso_a']:
                preso(f'#box{aid}', A['preso_a'])
            elif A.get('preso_a'):
                repete(f'#box{aid}', A['preso_a'])
            if A.get('subir_com'):
                repete(f'#box{aid}', A['subir_com'])
            andar_fim = max([T(ac.get('t', 0)) + ac.get('dur', 2) for ac in acoes if 'andar_ate' in ac] or [0])
            for k, (rg, tv) in enumerate(variantes):
                v = f'{aid}{k}'
                js.append(f'const {v} = Rig2.criar(document.getElementById("ator-{v}"), "{rg}", {{id:"{v}", base:"assets/perfil/", escala:{e}}});')
                js.append(f'{v}.iniciar(tl); {v}.respirar(tl, 0, {D});')
                if 'quadril_y' not in A and P.get('atmosfera', {}) is not False:
                    sl = SOMBRA_LADO.get(i, 'e'); sk = -58 if sl == 'e' else 58  # luz da esquerda -> sombra deitada para a direita (e para o fundo)
                    tr = f'translate(0 ${{pe}}) skewX({sk}) scale(1 0.3) translate(0 ${{-pe}})'; op_s = .30
                    sd = sombra_dir(P.get('cenario', {}).get('tipo', ''), i, A.get('x', 960))
                    if sd:  # luz de janela/lampada: cada ponto a altura h acima do pe cai em pe + h*(kx, ky) -> sombra para longe da fonte
                        kx, ky = sd; tr = f'matrix(1 0 {-kx} {-ky} ${{{kx}*pe}} ${{pe*(1+{ky})}})'; op_s = .34
                    # sombra REAL: a silhueta do proprio personagem (<use> do desenho, anima junto), preta, achatada no chao e inclinada
                    js.append(f'(function(){{ const h = document.getElementById("ator-{v}"); const sv = [...h.querySelectorAll(":scope > svg")].pop(); const r = sv.firstElementChild; r.id = "rz{v}"; const pe = window.RIGS["{rg}"].pe * {e};'
                              f' h.insertAdjacentHTML("afterbegin", `<svg width="2" height="2" style="position:absolute;left:0;top:0;overflow:visible;pointer-events:none"><g transform="{tr}" style="filter:brightness(0) blur(3px);opacity:{op_s}"><use href="#rz{v}"/></g></svg><div style="position:absolute;left:{round(-170 * e)}px;top:${{pe - {round(26 * e)}}}px;width:{round(340 * e)}px;height:{round(64 * e)}px;border-radius:50%;background:radial-gradient(closest-side, rgba(20,14,30,.45), rgba(20,14,30,0));pointer-events:none"></div>`); }})();')
                js.append(f'document.getElementById("ator-{v}").style.left = "{A.get("x", 960)}px"; tl.set("#ator-{v}", {{rotation:0, transformOrigin:"0 0"}}, 0);')
                topo = f'{A["quadril_y"]}' if 'quadril_y' in A else f'({A.get("pes", 800)} - window.RIGS["{rg}"].pe * {e})'
                js.append(f'document.getElementById("ator-{v}").style.top = {topo} + "px";')
                if A.get('etiqueta'):  # rotulo acima da cabeca (anda junto)
                    js.append(f'document.getElementById("ator-{v}").insertAdjacentHTML("beforeend", `<div class="etq" style="top:{round(-960 * e - 30)}px;font-size:{max(26, round(110 * e))}px">{A["etiqueta"]}</div>`);')
                if len(variantes) > 1:
                    prox = variantes[k + 1][1] if k + 1 < len(variantes) else None
                    js.append(f'tl.set("#ator-{v}", {{opacity:{1 if k == 0 else 0}}}, 0);')
                    if k > 0:
                        js.append(f'tl.set("#ator-{v}", {{opacity:1}}, {tv}); tl.from("#ator-{v}", {{scale:1.15, duration:0.25, ease:"back.out(3)", ...F}}, {tv});')
                    if prox is not None:
                        js.append(f'tl.set("#ator-{v}", {{opacity:0}}, {prox});')
                if A.get('fala') and pal:
                    js.append(f'{v}.falar(tl, PALAVRAS, 0);')
                x_atual = A.get('x', 960)
                for ac in acoes:
                    t = T(ac.get('t', 0)); t = max(t, t0)  # acao no tempo 0 de um plano > 0 comeca quando o plano entra (antes acontecia no inicio da cena)
                    if 'andar_ate' in ac:
                        js.append(f'{v}.andar(tl, {t}, {t + ac.get("dur", 2)}, {x_atual - A.get("x", 960)}, {ac["andar_ate"] - A.get("x", 960)});'); x_atual = ac['andar_ate']
                    if 'gesto' in ac:
                        js.append(f'{v}.gesto(tl, {t}, "{ac["gesto"]}", "{ac.get("lado", "d")}", {ac.get("dur", 1.2)});')
                    if 'expressao' in ac:
                        js.append(f'{v}.expressao(tl, {t}, "{ac["expressao"]}");')
                    if 'olhos' in ac:
                        js.append(f'{v}.olhos(tl, {t}, "{ac["olhos"]}");')
                    if ac.get('piscar'):
                        fim = T(ac['ate']) if ac.get('ate') else D
                        js.append(f'{v}.piscar(tl, {t}, {fim}, {abs(hash(aid)) % 97 + 1});')
                    if 'olhar' in ac:
                        ang = {'e': -7, 'd': 7, 'frente': 0, 'baixo': 0}[ac['olhar']]
                        yy = 14 if ac['olhar'] == 'baixo' else 0
                        js.append(f'tl.to({v}.el.cabeca, {{rotation:{ang}, y:{yy}, duration:0.25, ease:"power2.out", ...F}}, {t});')
                        if ac['olhar'] == 'baixo':
                            js.append(f'{v}.olhos(tl, {t}, "semicerrados");')
                    if 'pose' in ac:
                        nome = ac['pose']; du = ac.get('dur', 0.25); imed = t <= t0 + 0.001 or du <= 0
                        ang = POSES.get(nome, nome) if isinstance(nome, str) else nome
                        for osso, alvo in ang.items():
                            alvo = alvo if isinstance(alvo, dict) else {'rotation': alvo}
                            if imed:
                                js.append(f'tl.set({v}.el.{osso}, {json.dumps(alvo)}, {0 if t <= t0 + 0.001 else t});')
                            else:
                                js.append(f'tl.to({v}.el.{osso}, {{...{json.dumps(alvo)}, duration:{du}, ease:"back.out(1.4)", ...F}}, {t});')
                        rot = -90 if nome in ('deitado_cama', 'deitado_rede') else 0
                        if imed:
                            js.append(f'tl.set("#ator-{v}", {{rotation:{rot}}}, {0 if t <= t0 + 0.001 else t});')
                        else:
                            js.append(f'tl.to("#ator-{v}", {{rotation:{rot}, duration:{du}, ease:"back.out(1.4)", ...F}}, {t});')
                    if 'segurar' in ac:  # objeto na mao: braco na pose de segurar, objeto dentro do osso da mao, contra-girado
                        fn, se, Bh, Ah, dy_ = SEGURAR.get(ac['segurar'], (ac['segurar'], 1.0, 20, 110, 60))
                        se *= ac.get('escala', 1); lado = ac.get('lado', 'd'); s_ = 1 if lado == 'e' else -1
                        tp = max(t, andar_fim) if t < andar_fim else t; im_ = tp <= t0 + 0.001
                        sid = f'seg{v}_{ac["segurar"]}'
                        dese = f'${{Objetos.{fn}({{id: "{sid}-o"}})}}'
                        if fn == 'pastel':
                            dese = f'<g id="{sid}-inteiro">${{Objetos.pastel({{id: "{sid}-o"}})}}</g><g id="{sid}-mordido" opacity="0">${{Objetos.pastel({{id: "{sid}-om", mordido: true}})}}</g>'
                        js.append(f'(function(){{ const m = [].concat({v}.el.mao_{lado}); m[Math.min(1, m.length - 1)].insertAdjacentHTML("beforeend", `<g id="{sid}"><g transform="translate(0 {dy_}) rotate({-s_ * (Bh + Ah)}) scale({se})"><g id="{sid}-gira">{dese}</g></g></g>`); }})();')
                        js.append(f'tl.set("#{sid}", {{opacity:0}}, 0); tl.set("#{sid}", {{opacity:1}}, {0 if t <= t0 + 0.001 else t});')
                        if t > t0 + 0.001:
                            js.append(f'(function(){{ const w = W(document.getElementById("{sid}-gira")); tl.fromTo(w, {{scale:0.3, transformOrigin:"50% 50%"}}, {{scale:1, duration:0.25, ease:"back.out(3)", ...F}}, {t}); }})();')
                        for osso_, ang_ in (('braco', Bh), ('antebraco', Ah)):
                            if im_:
                                js.append(f'tl.set({v}.el.{osso_}_{lado}, {{rotation:{s_ * ang_}}}, 0);')
                            else:
                                js.append(f'tl.to({v}.el.{osso_}_{lado}, {{rotation:{s_ * ang_}, duration:0.25, ease:"back.out(1.8)", ...F}}, {tp});')
                        js.append(f'{v}.mao(tl, {0 if im_ else tp}, "{lado}", "punho");')
                        if ac.get('girar'):
                            js.append(f'tl.fromTo("#{sid}-gira", {{scaleX:1}}, {{scaleX:-1, duration:0.35, repeat:{max(1, int((D - t) / 0.35) // 2 * 2 - 1)}, yoyo:true, ease:"sine.inOut", svgOrigin:"0 0", ...F}}, {round(t + 0.3, 3)});')
                        SEGS[v] = (sid, lado, s_, Bh, Ah)
                    if ac.get('morder') and SEGS.get(v):
                        sid, lado, s_, Bh, Ah = SEGS[v]
                        js.append(f'tl.to({v}.el.braco_{lado}, {{rotation:{s_ * (Bh + 30)}, duration:0.22, ease:"power2.out", ...F}}, {t}); tl.to({v}.el.antebraco_{lado}, {{rotation:{s_ * (Ah + 28)}, duration:0.22, ease:"power2.out", ...F}}, {t});'
                                  f' tl.to({v}.el.braco_{lado}, {{rotation:{s_ * Bh}, duration:0.3, ease:"back.out(2)", ...F}}, {round(t + 0.45, 3)}); tl.to({v}.el.antebraco_{lado}, {{rotation:{s_ * Ah}, duration:0.3, ease:"back.out(2)", ...F}}, {round(t + 0.45, 3)});'
                                  f' tl.set("#{sid}-inteiro", {{opacity:0}}, {round(t + 0.25, 3)}); tl.set("#{sid}-mordido", {{opacity:1}}, {round(t + 0.25, 3)});')
                    if 'assentir' in ac:  # concorda com a cabeca em loop (sim, sim, sim)
                        ate_ = T(ac['ate']) if ac.get('ate') else D; per = ac.get('periodo', 0.36); nrep = max(1, int((ate_ - t) / (per / 2)) - 1); nrep -= (nrep + 1) % 2
                        js.append(f'tl.fromTo({v}.el.cabeca, {{rotation:0, y:0}}, {{rotation:-4, y:14, duration:{per / 2}, repeat:{nrep}, yoyo:true, ease:"sine.inOut", ...F}}, {t}); tl.to({v}.el.cabeca, {{rotation:0, y:0, duration:0.15, ...F}}, {ate_});')
                    if ac.get('tremer') and SEGS.get(v):  # objeto na mao tremendo (xicara)
                        sid = SEGS[v][0]; ate_ = T(ac['ate']) if ac.get('ate') else D; nrep = max(1, int((ate_ - t) / 0.04)); nrep -= (nrep + 1) % 2
                        js.append(f'(function(){{ const w = W(document.getElementById("{sid}")); tl.fromTo(w, {{x:-5, rotation:-3}}, {{x:5, rotation:3, duration:0.04, repeat:{nrep}, yoyo:true, ease:"none", svgOrigin:"0 0", ...F}}, {t}); }})();')
                    if ac.get('peca') == 'gota_suor':
                        js.append(f'(function(){{ const cs = [].concat({v}.el.cabeca); const c = cs[cs.length - 1]; const bb = c.getBBox(); c.insertAdjacentHTML("beforeend", `<g transform="translate(${{bb.x + bb.width * {ac.get("px", 0.86)}}} ${{bb.y + bb.height * {ac.get("py", 0.3)}}}) scale(${{bb.width / 300}})"><g id="gota{v}">${{Objetos.gotaSuor({{id: "gotai{v}"}})}}</g></g>`);'
                                  f' const g = document.getElementById("gota{v}"); tl.set(g, {{opacity:0, y:0}}, 0); tl.set(g, {{opacity:1}}, {t}); tl.fromTo(g, {{scale:0.2, transformOrigin:"50% 50%"}}, {{scale:1, duration:0.25, ease:"back.out(3)", ...F}}, {t}); tl.to(g, {{y:60, duration:1.4, ease:"power1.in", ...F}}, {round(t + 0.3, 3)}); }})();')
                    if 'jogar' in ac:
                        rep = ac.get('repetir', 1); iv = ac.get('intervalo', 0.45)
                        for r in range(rep):
                            tr_ = round(t + r * iv, 3)
                            js.append(f'tl.to({v}.el.braco_d, {{rotation:-150, duration:0.12, ease:"power2.out", ...F}}, {tr_}); tl.to({v}.el.antebraco_d, {{rotation:-40, duration:0.12, ...F}}, {tr_});'
                                      f' tl.to({v}.el.braco_d, {{rotation:-20, duration:0.14, ease:"power2.in", ...F}}, {round(tr_ + 0.12, 3)}); tl.to({v}.el.antebraco_d, {{rotation:0, duration:0.14, ...F}}, {round(tr_ + 0.12, 3)});'
                                      f' tl.to({v}.el.braco_d, {{rotation:0, duration:0.15, ...F}}, {round(tr_ + 0.3, 3)});')
                            if k == len(variantes) - 1:
                                hx = A.get('x', 960) - 60 * e / 0.33; hy = (A['quadril_y'] if 'quadril_y' in A else A.get('pes', 800) - 552 * e) - 420 * e
                                mid = f'm{aid}_{r}'
                                js.append(f'document.getElementById("fx{i}").insertAdjacentHTML("beforeend", `<g id="{mid}"><g transform="translate({round(hx)} {round(hy)})">${{Objetos.macoSvg(0, 0, 110, 46, "")}}</g></g>`);'
                                          f' tl.set("#{mid}", {{opacity:0, x:0, y:0, rotation:0}}, 0); tl.set("#{mid}", {{opacity:1}}, {round(tr_ + 0.1, 3)});'
                                          f' tl.to("#{mid}", {{x:{-260 - r * 40}, duration:0.55, ease:"none", ...F}}, {round(tr_ + 0.1, 3)}); tl.to("#{mid}", {{y:-260, duration:0.25, ease:"power2.out", ...F}}, {round(tr_ + 0.1, 3)});'
                                          f' tl.to("#{mid}", {{y:120, duration:0.3, ease:"power2.in", ...F}}, {round(tr_ + 0.35, 3)}); tl.to("#{mid}", {{rotation:-320, svgOrigin:"{round(hx)} {round(hy)}", duration:0.55, ease:"none", ...F}}, {round(tr_ + 0.1, 3)});'
                                          f' tl.set("#{mid}", {{opacity:0}}, {round(tr_ + 0.65, 3)});')
    # textos (tela)
    txt = []
    ef = []
    for k, Tx in enumerate(ficha.get('textos', [])):
        tid = f'txt{k}'; t = max(T(Tx['t']), 0.04)  # no tempo 0 o set de opacidade vencia o fromTo e o texto nao aparecia
        cont = Tx.get('contador')
        ini = f'{Tx.get("prefixo", "")}{fmt(cont["de"])}{Tx.get("sufixo", "")}' if cont else Tx['texto']
        div_ = f'<div id="{tid}" class="txt{"" if Tx.get("placa", True) else " sem-placa"}" style="left:{Tx.get("x", 960)}px;top:{Tx.get("y", 200)}px;font-size:{Tx.get("tam", 110)}px;color:{Tx.get("cor", "#F5C542")}">{ini}</div>'
        if 'plano' in Tx:  # texto preso ao mundo do plano (anda com a camera)
            js.insert(0, f'document.getElementById("cam{Tx["plano"]}").insertAdjacentHTML("beforeend", `{div_}`);')
        else:
            txt.append(div_)
        js.append(f'tl.set("#{tid}", {{opacity:0, xPercent:-50, yPercent:-50, transformOrigin:"50% 70%"}}, 0);')
        js.append(f'tl.fromTo("#{tid}", {{opacity:1, scale:0.4}}, {{scale:1, duration:0.32, ease:"back.out(1.8)", ...F}}, {t});')
        if cont:
            n = max(2, int(cont.get('dur', 1) * 30))
            for j in range(1, n + 1):
                f_ = 1 - (1 - j / n) ** 3
                val = round(cont['de'] + (cont['ate'] - cont['de']) * f_)
                js.append(f'tl.set("#{tid}", {{innerHTML:"{Tx.get("prefixo", "")}{fmt(val)}{Tx.get("sufixo", "")}"}}, {round(t + j / 30, 3)});')
            js.append(f'tl.fromTo("#{tid}", {{scale:1.25}}, {{scale:1, duration:0.25, ease:"back.out(3)", ...F}}, {round(t + n / 30, 3)});')
        if Tx.get('ate'):
            js.append(f'tl.to("#{tid}", {{opacity:0, duration:0.15, ...F}}, {T(Tx["ate"])});')
        if Tx.get('murchar'):
            js.append(f'tl.to("#{tid}", {{scaleY:0.05, scaleX:1.3, opacity:0, duration:0.35, ease:"back.in(2)", ...F}}, {T(Tx["murchar"])});')
    # efeitos (quadro a quadro, tela)
    for k, E in enumerate(ficha.get('efeitos', [])):
        eid = f'ef{k}'; t = T(E['t'])
        if E['tipo'] == 'tremor':  # sacode o quadro todo, diminuindo
            n = max(3, int(E.get('dur', 0.3) * 30)); fo = E.get('forca', 10)
            for j in range(n):
                a = fo * (1 - j / n); dx = round(a * math.sin(j * 2.7 + 1), 1); dy = round(a * math.cos(j * 3.1 + 2), 1)
                js.append(f'tl.set("#treme", {{x:{dx}, y:{dy}}}, {round(t + j / 30, 3)});')
            js.append(f'tl.set("#treme", {{x:0, y:0}}, {round(t + n / 30, 3)});')
            continue
        if E['tipo'] == 'flash':  # varios flashes de camera numa area (x0, y0, x1, y1), espalhados de t ate "ate"
            q = E.get('quantos', 6); x0, y0, x1, y1 = E.get('area', [400, 300, 1500, 900]); tf_ = T(E['ate']) if E.get('ate') else t
            for j in range(q):
                fx_ = round(x0 + (x1 - x0) * ((j * 0.618 + 0.13) % 1)); fy_ = round(y0 + (y1 - y0) * ((j * 0.382 + 0.41) % 1))
                tj = round(t + (tf_ - t - 0.15) * ((j * 0.737) % 1), 3) if q > 1 else t
                js.append(f'document.getElementById("fxt").insertAdjacentHTML("beforeend", `<g transform="translate({fx_} {fy_})"><g id="{eid}-{j}">${{Objetos.flashCamera({{id: "{eid}-o{j}"}})}}</g></g>`);'
                          f' tl.set("#{eid}-{j}", {{scale:0, transformOrigin:"50% 50%"}}, 0); tl.to("#{eid}-{j}", {{scale:0.8, duration:0.05, ease:"power2.out", ...F}}, {tj}); tl.to("#{eid}-{j}", {{scale:0, duration:0.14, ease:"power2.in", ...F}}, {round(tj + 0.07, 3)});')
            if q == 1:
                ef.append(f'<div id="{eid}-b" style="position:absolute;inset:0;background:#fff;opacity:0;z-index:25;pointer-events:none"></div>')
                js.append(f'tl.set("#{eid}-b", {{opacity:0}}, 0); tl.to("#{eid}-b", {{opacity:0.75, duration:0.04, ...F}}, {t}); tl.to("#{eid}-b", {{opacity:0, duration:0.25, ...F}}, {round(t + 0.05, 3)});')
            continue
        if E['tipo'] in ('estrelinha', 'puf', 'flashCamera'):
            js.append(f'document.getElementById("fxt").insertAdjacentHTML("beforeend", `<g transform="translate({E.get("x", 960)} {E.get("y", 540)})"><g id="{eid}">${{Objetos.{E["tipo"]}({{id: "{eid}-o"}})}}</g></g>`);'
                      f' tl.set("#{eid}", {{scale:0, rotation:0, transformOrigin:"50% 50%"}}, 0); tl.to("#{eid}", {{scale:{E.get("escala", 1)}, rotation:90, duration:0.3, ease:"back.out(2.5)", ...F}}, {t});'
                      f' tl.to("#{eid}", {{scale:0, rotation:160, duration:0.25, ease:"power2.in", ...F}}, {round(t + E.get("dur", 0.9), 3)});')
            continue
        qs = sorted(os.path.basename(f) for f in glob.glob(os.path.join(H, 'biblioteca', 'efeitos', E['tipo'], '*.png')))
        if E.get('prefixo'):
            qs = [q for q in qs if q.startswith(E['prefixo'])]
        imgs = ''.join(f'<img src="assets/perfil/biblioteca/efeitos/{E["tipo"]}/{q}" style="position:absolute;left:0;top:0;opacity:0;transform:translate(-50%,-50%) scale({E.get("escala", 0.6)})">' for q in qs)
        ef.append(f'<div id="{eid}" class="ef" style="left:{E.get("x", 960)}px;top:{E.get("y", 540)}px">{imgs}</div>')
        passo = 1 / E.get('fps', 12); kk = 0
        for r in range(E.get('repetir', 1)):
            for j in range(len(qs)):
                tt = round(t + kk * passo, 3)
                js.append(f'tl.set("#{eid} img:nth-child({j + 1})", {{opacity:1}}, {tt}); tl.set("#{eid} img:nth-child({j + 1})", {{opacity:0}}, {round(tt + passo, 3)});')
                kk += 1
    doc = f'''<!doctype html>
<html lang="pt-BR" data-resolution="landscape">
<head>
<meta charset="UTF-8" /><meta name="viewport" content="width=1920, height=1080" />
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<script src="assets/perfil/estilo.js"></script>
<script src="assets/perfil/pecas/rig/seek_fix.js"></script>
<script src="assets/perfil/pecas/svg/objetos.js"></script>
<script src="assets/perfil/pecas/svg/cenarios.js"></script>
<script src="assets/perfil/pecas/rig2/rig2.js"></script>
{''.join(f'<script src="assets/perfil/pecas/rig2/{c}"></script>' for c in cabecas)}
<script src="assets/perfil/pecas/rig2/pessoa_svg.js"></script>
<script src="assets/perfil/pecas/rig2/pessoas_svg_def.js"></script>
<style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:1920px; height:1080px; overflow:hidden; background:#15121f; }}
#root {{ position:relative; width:1920px; height:1080px; overflow:hidden; font-family:Nunito, sans-serif; }}
.plano, .cam, .camada, .atorbox, .clima {{ position:absolute; left:0; top:0; width:1920px; height:1080px; }}
.plano {{ overflow:hidden; }} .clima {{ pointer-events:none; }} svg.camada {{ overflow:visible; }}
.ator, .ef {{ position:absolute; }}
.ator {{ filter: drop-shadow(-3px -2px 0 rgba(255,180,110,.55)) drop-shadow(0 10px 8px rgba(20,14,30,.18)); }}
.lz {{ position:absolute; left:0; top:0; width:1920px; height:1080px; pointer-events:none; }}
.txt {{ position:absolute; font-weight:900; line-height:1.05; -webkit-text-stroke:10px #2E2A33; paint-order:stroke fill; white-space:nowrap; z-index:20;
  background:rgba(38,34,48,.9); padding:.12em .42em .16em; border-radius:.32em; border:.06em solid rgba(255,248,230,.85); box-shadow:0 .1em 0 rgba(20,18,30,.45); }}
.txt.sem-placa {{ background:none; border:none; box-shadow:none; text-shadow:0 8px 0 rgba(46,42,51,.35); }}
.etq {{ position:absolute; left:0; transform:translateX(-50%); font-weight:900; color:#2E2A33; background:#F5C542; border:4px solid #2E2A33; border-radius:14px; padding:2px 12px; white-space:nowrap; }}
#vinheta {{ position:absolute; inset:0; box-shadow:inset 0 0 160px rgba(70,40,20,.10); pointer-events:none; z-index:30; }}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{D}" data-width="1920" data-height="1080">
  <div id="cena" class="clip" data-start="0" data-duration="{D}" data-track-index="0" style="position:absolute;inset:0">
    <div id="treme" style="position:absolute;inset:0">{''.join(html)}</div>
    {''.join(ef)}
    <svg id="fxt" class="camada" viewBox="0 0 1920 1080" style="z-index:15"></svg>
    {''.join(txt)}
    <div id="vinheta"></div>
  </div>
</div>
<script>
const PALAVRAS = {json.dumps(pal, ensure_ascii=False)};
const F = {{ immediateRender:false, lazy:false }};
const NS = "http://www.w3.org/2000/svg"; function W(el) {{ const w = document.createElementNS(NS, "g"); el.parentNode.insertBefore(w, el); w.appendChild(el); return w; }}
window.__timelines = window.__timelines || {{}};
const tl = gsap.timeline({{ paused:true }});
{chr(10).join(js)}
tl.set({{}}, {{}}, {D});
window.__timelines["main"] = Seguro(tl);
tl.seek(0);
</script>
</body>
</html>
'''
    open(os.path.join(pasta, 'index.html'), 'w', encoding='utf-8').write(doc)
    return pasta


def fmt(n):
    return f'{int(n):,}'.replace(',', '.')


if __name__ == '__main__':
    ficha = json.load(open(sys.argv[1], encoding='utf-8-sig'))
    pasta = gerar(ficha, sys.argv[2])
    print('cena gerada em', pasta)
    if '--render' in sys.argv:
        ficha.setdefault('workers', 1)  # 1 processo: com varios, tl.set no tempo 0 divergia entre processos (c08/c09, 09/11)
        renderizar(ficha, pasta, '--previa' in sys.argv)
