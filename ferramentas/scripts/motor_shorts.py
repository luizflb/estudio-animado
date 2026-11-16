#!/usr/bin/env python3
"""Motor de SHORTS (vertical 1080x1920), 11/11/2026, ajuste aprovado ("crie novo motor para shorts").

Usa o motor_planos.py sem mudar nada nele (mesmos cenarios, personagens, luz, noite, efeitos) e poe o mundo 1920x1080
dentro de uma CAMERA VERTICAL:
- "palco": o mundo inteiro escalado; padrao zoom 1.7778 (o cenario ocupa a altura toda e a tela mostra ~608 px de largura do mundo).
- A "camera" de cada plano (x, y, zoom) decide para onde a tela vertical olha; o motor prende x/y para nunca mostrar fora do cenario.
- Plano LARGO: "vertical": {"zoom": 1.0, "faixas": ["#cor_cima", "#cor_baixo"]} -> o mundo fica na faixa do meio e
  cima/baixo recebem o ceu e o chao do cenario (cores da tabela FAIXAS ou as da ficha).
- "textos" da cena vem em coordenadas VERTICAIS (x 0-1080, y 0-1920) e ficam numa camada propria, fora do recorte
  (os textos com "plano" continuam presos ao mundo do plano, como no motor_planos).

Uso: motor_shorts.py <ficha.json> <pasta_da_cena> [--render] [--previa]
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import motor_planos as MP  # noqa: E402
from motor_cena import tempo, renderizar  # noqa: E402

S = 1920 / 1080  # 1.7778: zoom do palco para o mundo encher a altura
VW, VH = 1080, 1920
FAIXAS = {  # cor de cima (ceu/teto) e de baixo (chao) por cenario, para o plano largo
    'marAberto': ('#8fd3f4', '#2f78b0'), 'conveIate': ('#f6b26b', '#7a4a2a'), 'terrenoCima': ('#6aa84f', '#4f8a3a'),
    'fachadaMansao': ('#9fd4f2', '#6aa84f'), 'fachadaPredio': ('#9fd4f2', '#8a8e98'), 'patioFabrica': ('#9fd4f2', '#8a8e98'),
    'entradaPropriedade': ('#9fd4f2', '#6aa84f'), 'ceuNoturno': ('#0d1030', '#141833'), 'fundoLiso': ('#2b2740', '#2b2740'),
}


def T_(v, pal, ant):
    if isinstance(v, str) and '+' in v:
        a, b = v.rsplit('+', 1)
        return round(T_(a, pal, ant) + float(b), 3)
    t = tempo(v, pal)
    if isinstance(v, str) and v.startswith('palavra:'):
        t -= ant
    return round(max(0.0, t), 3)


def prender_camera(P, zp):
    """Prende x/y da camera do plano para a janela vertical nunca sair do cenario (meia janela = 540/zp na largura, 540*S/zp... na altura)."""
    for c in P.get('camera') or []:
        z = c.get('zoom', 1)
        hw = (VW / 2) / (zp * z); hh = (VH / 2) / (zp * z)  # meia janela, em px do mundo
        x = c.get('x', 960); y = c.get('y', 540)
        c['x'] = round(min(max(x, hw), 1920 - hw), 1) if hw < 960 else 960
        c['y'] = round(min(max(y, hh), 1080 - hh), 1) if hh < 540 else 540


GESTO_TROCAS = [  # (original, shorts): gesto mais lento e sem o "estalo" do back.out, so na copia do rig desta cena
    ('{ rotation: -s * 6, duration: 0.07, ease: "power2.out", ...F }, t - 0.07)', '{ rotation: -s * 4, duration: 0.12, ease: "sine.out", ...F }, t - 0.12)'),
    ('{ rotation: s * G.braco, duration: 0.22, ease: "back.out(1.8)", ...F }, t)', '{ rotation: s * G.braco, duration: 0.42, ease: "power2.out", ...F }, t)'),
    ('{ rotation: s * G.antebraco, duration: 0.24, ease: "back.out(1.8)", ...F }, t + 0.03)', '{ rotation: s * G.antebraco, duration: 0.46, ease: "power2.out", ...F }, t + 0.05)'),
    ('duration: 0.14, ease: "sine.inOut", ...F }, t + 0.25 + k * 0.28)', 'duration: 0.24, ease: "sine.inOut", ...F }, t + 0.45 + k * 0.48)'),
    ('duration: 0.14, ease: "sine.inOut", ...F }, t + 0.39 + k * 0.28)', 'duration: 0.24, ease: "sine.inOut", ...F }, t + 0.69 + k * 0.48)'),
    ('{ rotation: s * G.cabeca, duration: 0.25, ease: "back.out(2)", ...F }, t + 0.04)', '{ rotation: s * G.cabeca, duration: 0.4, ease: "power2.out", ...F }, t + 0.06)'),
    ('tl.to([osso[b], osso[a]], { rotation: 0, duration: 0.25, ease: "power2.inOut", ...F }, t + dur)', 'tl.to([osso[b], osso[a]], { rotation: 0, duration: 0.42, ease: "power2.inOut", ...F }, t + dur)'),
]


def suavizar_gestos(pasta):
    """11/11 (feedback: "pernas e bracos bugado, mexendo rapido"): no vertical o personagem fica 1,78x maior e o gesto de 0,22 s
    atravessava a tela em 2-3 quadros. Na copia do rig2.js da cena: gestos ~1,8x mais lentos e sem passar do ponto."""
    arq = os.path.join(pasta, 'assets', 'perfil', 'pecas', 'rig2', 'rig2.js')
    s = open(arq, encoding='utf-8').read()
    for a, b in GESTO_TROCAS:
        assert a in s or b in s, a
        s = s.replace(a, b)
    open(arq, 'w', encoding='utf-8').write(s)


# ---- MUNDO VERTICAL nativo (11/11, feedback: "quero o cenario todo ajustado para vertical"): cenarios desenhados em 1080x1920
#      (pecas/svg/cenarios_vertical.js), sem recorte do horizontal. Ficha com "mundo": "vertical"; coordenadas de atores,
#      objetos e camera ja no mundo 1080x1920 (camera: x/y = centro da tela no mundo, zoom >= 1).
MP.FONTES.update({
    'quartoV': {'chao': 1380, 'kx': -0.3, 'ky': 0.5, 'janelas': [(580, 380, 920, 900, 2, 2)]},
})
MP.EXTERIORES.update({'conveIateV', 'ruaComercioV', 'avenidaTelaoV', 'fachadaPredioV', 'patioFabricaV', 'terrenoCimaV', 'marAbertoV',
                      'fachadaMansaoV', 'casaIrmaoV'})
MP.INFOGRAFICOS.update({'fundoLisoV'})


def gerar_vertical(ficha, pasta):
    f = json.loads(json.dumps(ficha))
    for P in f.get('planos') or []:
        if not P.get('camera'):
            P['camera'] = [{'t': P.get('t', 0), 'zoom': 1, 'x': 540, 'y': 960}]
        for c in P['camera']:
            z = c.get('zoom', 1); hw, hh = 540 / z, 960 / z
            x, y = c.get('x', 540), c.get('y', 960)
            if not P.get('livre'):  # "livre": cenario maior que o quadro (fachada alta, mar largo)
                x = min(max(x, hw), 1080 - hw); y = min(max(y, hh), 1920 - hh)
            # o motor centra em (960, 540); o mundo vertical centra em (540, 960)
            c['x'] = round(x + 420 / z, 1); c['y'] = round(y - 420 / z, 1)
    MP.gerar(f, pasta)
    MP.copiar('pecas/svg/cenarios_vertical.js', pasta)
    suavizar_gestos(pasta)
    arq = os.path.join(pasta, 'index.html')
    h = open(arq, encoding='utf-8').read()
    h = h.replace('<script src="assets/perfil/pecas/svg/cenarios.js"></script>',
                  '<script src="assets/perfil/pecas/svg/cenarios.js"></script>\n<script src="assets/perfil/pecas/svg/cenarios_vertical.js"></script>', 1)
    h = h.replace('viewBox="0 0 1920 1080"', f'viewBox="0 0 {VW} {VH}"')
    h = h.replace('data-resolution="landscape"', 'data-resolution="portrait"').replace('content="width=1920, height=1080"', f'content="width={VW}, height={VH}"')
    h = h.replace('data-width="1920" data-height="1080"', f'data-width="{VW}" data-height="{VH}"')
    a, b = h.index('<style>'), h.index('</style>')
    h = h[:a] + h[a:b].replace('width:1920px; height:1080px;', f'width:{VW}px; height:{VH}px;') + h[b:]
    h = h.replace('{x:1920, filter:"blur(18px)"}', f'{{x:{VW}, filter:"blur(18px)"}}').replace('{x:-1920, filter:"blur(18px)"', f'{{x:-{VW}, filter:"blur(18px)"')
    # poeira: posicoes sorteadas para 1920x1080 -> espalha no quadro vertical
    h = re.sub(r'(<circle id="pz[^"]+" )cx="([\d.]+)" cy="([\d.]+)"',
               lambda m: f'{m.group(1)}cx="{round(float(m.group(2)) * VW / 1920)}" cy="{round(float(m.group(3)) * VH / 1080)}"', h)
    for m2 in re.finditer(r'tl\.set\("(#ator-[^"]+)", \{rotation:(-?[\d.]+)\}, 0\);', h):
        el, rot = m2.group(1), m2.group(2)
        h = h.replace(m2.group(0), '', 1).replace(f'tl.set("{el}", {{rotation:0, transformOrigin:"0 0"}}, 0);', f'tl.set("{el}", {{rotation:{rot}, transformOrigin:"0 0"}}, 0);', 1)
    open(arq, 'w', encoding='utf-8').write(h)
    return pasta


def gerar(ficha, pasta):
    if ficha.get('mundo') == 'vertical':
        return gerar_vertical(ficha, pasta)
    f = json.loads(json.dumps(ficha))
    planos = f.get('planos') or []
    for P in planos:
        zp = (P.get('vertical') or {}).get('zoom', S)
        if not P.get('camera'):
            P['camera'] = [{'t': P.get('t', 0), 'zoom': 1, 'x': 960, 'y': 540}]
        if not P.get('livre'):  # "livre": cenario mais largo que 1920 (cabine747, mar com iate) -> sem prender
            prender_camera(P, zp)
    MP.gerar(f, pasta)
    suavizar_gestos(pasta)
    arq = os.path.join(pasta, 'index.html')
    h = open(arq, encoding='utf-8').read()
    # tempos de inicio dos planos (igual ao motor_planos)
    pal = []
    if f.get('palavras'):
        w = json.load(open(f['palavras'], encoding='utf-8'))
        pal = w.get('palavras', w) if isinstance(w, dict) else w
        pal = [{'palavra': p.get('palavra', ''), 'ini': p.get('ini'), 'fim': p.get('fim')} for p in pal]
    ant = f.get('antecipa', MP.ANTECIPA)
    js = []
    for i, P in enumerate(planos):
        t0 = 0.0 if i == 0 else T_(P['t'], pal, ant)
        V = P.get('vertical') or {}
        zp = V.get('zoom', S)
        cima, baixo = V.get('faixas') or FAIXAS.get(P.get('cenario', {}).get('tipo', ''), ('#15121f', '#15121f'))
        js.append(f'tl.set("#palco", {{scale:{round(zp, 4)}}}, {t0}); tl.set("#faixas", {{background:"linear-gradient(180deg, {cima} 0%, {cima} 45%, {baixo} 55%, {baixo} 100%)"}}, {t0});')
        if V.get('zoom_ate'):  # o palco abre/fecha ao longo do plano (ex.: largo que vira recorte)
            za, ta = V['zoom_ate'], T_(V.get('t_ate', P.get('t', 0)), pal, ant)
            js.append(f'tl.to("#palco", {{scale:{za}, duration:{V.get("dur", 0.6)}, ease:"power2.inOut", ...F}}, {ta});')
    # 1) documento vertical
    h = h.replace('data-resolution="landscape"', 'data-resolution="portrait"').replace('content="width=1920, height=1080"', f'content="width={VW}, height={VH}"')
    h = h.replace('html, body { width:1920px; height:1080px;', f'html, body {{ width:{VW}px; height:{VH}px;')
    h = h.replace('#root { position:relative; width:1920px; height:1080px;', f'#root {{ position:relative; width:{VW}px; height:{VH}px;')
    h = h.replace('data-width="1920" data-height="1080"', f'data-width="{VW}" data-height="{VH}"')
    h = h.replace('</style>', f'#palco {{ position:absolute; left:{(VW - 1920) // 2}px; top:{(VH - 1080) // 2}px; width:1920px; height:1080px; transform-origin:50% 50%; overflow:hidden; }}\n'
                  f'#faixas {{ position:absolute; inset:0; background:#15121f; }}\n'
                  f'#txtv {{ position:absolute; inset:0; z-index:40; pointer-events:none; }}\n'
                  f'#vinhetav {{ position:absolute; inset:0; box-shadow:inset 0 0 220px rgba(20,14,30,.22); pointer-events:none; z-index:35; }}\n</style>', 1)
    # 2) mundo dentro do palco; textos de tela para a camada vertical
    a = h.index('<div id="treme"'); b = h.index('<div id="vinheta"></div>') + len('<div id="vinheta"></div>')
    miolo = h[a:b]
    m = re.search(r'(<svg id="fxt"[^>]*></svg>)(.*?)(<div id="vinheta"></div>)', miolo, re.S)
    textos = m.group(2)
    miolo = miolo[:m.start(2)] + miolo[m.end(2):]
    h = h[:a] + f'<div id="faixas"></div><div id="palco">{miolo}</div><div id="vinhetav"></div><div id="txtv">{textos}</div>' + h[b:]
    # 2b) 11/11: dois sets de rotacao no tempo 0 (rotation:0 e depois a pose deitada) -> nos quadros 1-4 o render pegava o primeiro
    #     (personagem deitado aparecia em pe). Junta num set so.
    for m2 in re.finditer(r'tl\.set\("(#ator-[^"]+)", \{rotation:(-?[\d.]+)\}, 0\);', h):
        el, rot = m2.group(1), m2.group(2)
        h = h.replace(m2.group(0), '', 1).replace(f'tl.set("{el}", {{rotation:0, transformOrigin:"0 0"}}, 0);', f'tl.set("{el}", {{rotation:{rot}, transformOrigin:"0 0"}}, 0);', 1)
    # 3) palco por plano
    h = h.replace('tl.set({}, {}, ', '\n'.join(js) + '\ntl.set({}, {}, ', 1)
    open(arq, 'w', encoding='utf-8').write(h)
    return pasta


if __name__ == '__main__':
    ficha = json.load(open(sys.argv[1], encoding='utf-8-sig'))
    pasta = gerar(ficha, sys.argv[2])
    print('cena vertical gerada em', pasta)
    if '--render' in sys.argv:
        ficha.setdefault('workers', 1)  # como no motor_planos: com varios processos os tl.set do tempo 0 divergiam (pernas da pose sumiam)
        renderizar(ficha, pasta, '--previa' in sys.argv)
