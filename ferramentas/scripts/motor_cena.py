#!/usr/bin/env python3
"""Motor de cenas (canal recriar): ficha JSON da cena -> projeto HyperFrames pronto para renderizar.

Uso: motor_cena.py <ficha.json> <pasta_da_cena> [--render] [--previa]
  --render: renderiza (npx hyperframes) em <pasta>/../renders/<id>_vNN.mp4 (versão nova, nunca sobrescreve)
  --previa: junta o áudio da ficha ao render (MP4 com voz) e confere pisca (pisca.py)

Ficha (tempos em segundos da cena; "palavra:N" = início da N-ésima palavra da narração, contando de 1):
{
 "id": "t01", "duracao": 5.9, "audio": "caminho.mp3", "palavras": "caminho.json (tempos do ElevenLabs)",
 "cenario": {"tipo": "ruaComercio"},
 "camera": [{"t": 0, "zoom": 1, "x": 960, "y": 540}, {"t": 5, "zoom": 1.3, "x": 900, "y": 600, "ease": "power1.inOut"}],
 "atores": [{"id": "luiz", "rig": "principal", "x": 300, "pes": 800, "escala": 0.3, "fala": true,
             "acoes": [{"t": 0.2, "andar_ate": 900, "dur": 2}, {"t": "palavra:1", "gesto": "acenar", "lado": "d", "dur": 1},
                       {"t": 2, "expressao": "surpreso"}, {"t": 0, "piscar": true}]}],
 "objetos": [{"tipo": "carroHatch", "cor": "#e2544f", "camada": "frente", "x": -600, "pes": 1010, "escala": 0.55,
              "mover": {"t": 0.5, "ate_x": 2300, "dur": 3, "rodas": true}}],
 "textos": [{"t": "palavra:4", "texto": "US$ 1 TRILHÃO", "x": 960, "y": 200, "tam": 120, "ate": 5.5}],
 "efeitos": [{"t": 2, "tipo": "dinheiro_voando", "x": 700, "y": 300, "escala": 0.6, "fps": 12, "repetir": 3}]
}
Camera: "x","y" = ponto do cenário que fica no centro da tela; "zoom" = escala.
"""
import json, os, re, shutil, subprocess, sys, glob
from datetime import datetime

H = os.path.expanduser('~/.animador/perfil')
HF = 'hyperframes@0.9.23'


def tempo(v, pal):
    if isinstance(v, str) and v.startswith('palavra:'):
        n = int(v.split(':')[1])
        return round(pal[n - 1]['ini'] - 0.05, 3)
    return float(v)


def copiar(rel, dest):
    src = os.path.join(H, rel)
    dst = os.path.join(dest, 'assets', 'perfil', rel)
    if os.path.isdir(src):
        shutil.copytree(src, dst, dirs_exist_ok=True)
    else:
        os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copy(src, dst)


def gerar(ficha, pasta):
    os.makedirs(pasta, exist_ok=True)
    cid = ficha['id']
    json.dump({"$schema": "https://hyperframes.heygen.com/schema/hyperframes.json", "paths": {"blocks": "compositions", "components": "compositions/components", "assets": "assets"}, "media": {"autoProxy": True}},
              open(os.path.join(pasta, 'hyperframes.json'), 'w'), indent=2)
    json.dump({"id": cid, "name": cid, "createdAt": datetime.now().isoformat()}, open(os.path.join(pasta, 'meta.json'), 'w'), indent=2)
    json.dump({"name": cid, "private": True, "type": "module", "scripts": {k: f"npx --yes {HF} {k}" for k in ('preview', 'check', 'render')}},
              open(os.path.join(pasta, 'package.json'), 'w'), indent=2)
    # peças
    cabecas = sorted(os.path.basename(f) for f in glob.glob(os.path.join(H, 'pecas', 'rig2', 'cabeca_*.js')))
    copiar('estilo.js', pasta)  # traço e cores da pessoa (etapa de estilo)
    for rel in ['pecas/rig/seek_fix.js', 'pecas/rig2/rig2.js', 'pecas/rig2/pessoa_svg.js', 'pecas/rig2/pessoas_svg_def.js', 'pecas/svg/objetos.js', 'pecas/svg/cenarios.js'] + [f'pecas/rig2/{c}' for c in cabecas]:
        copiar(rel, pasta)
    raster = any(A.get('rig') == 'principal_raster' for A in ficha.get('atores', []))
    if raster:  # versão antiga do principal (peças raster), só se a ficha pedir
        for rel in ['pecas/rig2/principal.js', 'biblioteca/personagem_principal', 'kit_modular/maos']:
            copiar(rel, pasta)
    for e in ficha.get('efeitos', []):
        copiar(f"biblioteca/efeitos/{e['tipo']}", pasta)
    # secundários do kit: o rig gerado + só as peças que ele usa
    sec_scripts = []
    for A in ficha.get('atores', []):
        rg = A.get('rig', 'principal')
        if rg in ('principal', 'principal_raster') or rg in sec_scripts or not os.path.exists(os.path.join(H, 'pecas', 'rig2', f'sec_{rg}.js')):
            continue  # personagens em SVG (pessoas_svg_def.js) não têm peças para copiar
        copiar(f'pecas/rig2/sec_{rg}.js', pasta); sec_scripts.append(rg)
        txt = open(os.path.join(H, 'pecas', 'rig2', f'sec_{rg}.js'), encoding='utf-8').read()
        for rel in set(re.findall(r'"([^"]+\.png)"', txt)):
            copiar(os.path.normpath(os.path.join('kit_modular', rel)).replace(os.sep, '/'), pasta)
    pal = []
    if ficha.get('palavras'):
        pal = json.load(open(ficha['palavras'], encoding='utf-8'))['palavras']
    D = ficha['duracao']
    js = []
    # câmera
    cam = ficha.get('camera') or [{"t": 0, "zoom": 1, "x": 960, "y": 540}]
    def camv(c): return dict(scale=c.get('zoom', 1), x=round(960 - c.get('x', 960) * c.get('zoom', 1), 1), y=round(540 - c.get('y', 540) * c.get('zoom', 1), 1))
    c0 = camv(cam[0]); js.append(f'tl.set("#cam", {{transformOrigin:"0px 0px", scale:{c0["scale"]}, x:{c0["x"]}, y:{c0["y"]}}}, 0);')
    for a, b in zip(cam, cam[1:]):
        v = camv(b); t0 = tempo(a['t'], pal); t1 = tempo(b['t'], pal)
        js.append(f'tl.to("#cam", {{scale:{v["scale"]}, x:{v["x"]}, y:{v["y"]}, duration:{round(t1 - t0, 3)}, ease:"{b.get("ease", "power1.inOut")}", ...F}}, {t0});')
    # atores
    atores_html = []
    for A in ficha.get('atores', []):
        aid = A['id']; esc = A.get('escala', 0.3)
        atores_html.append(f'<div id="ator-{aid}" class="ator"></div>')
        rg = {'principal': 'principal_svg', 'principal_raster': 'principal'}.get(A.get('rig', 'principal'), A.get('rig'))
        js.append(f'const {aid} = Rig2.criar(document.getElementById("ator-{aid}"), "{rg}", {{id:"{aid}", base:"assets/perfil/", escala:{esc}}});')
        js.append(f'{aid}.iniciar(tl); {aid}.respirar(tl, 0, {D});')
        js.append(f'tl.set("#ator-{aid}", {{x:{A.get("x", 960)}}}, 0);')
        js.append(f'document.getElementById("ator-{aid}").style.top = ({A.get("pes", 800)} - window.RIGS["{rg}"].pe * {esc}) + "px";')
        if A.get('fala') and pal:
            js.append(f'{aid}.falar(tl, PALAVRAS, 0);')
        x_atual = A.get('x', 960)
        for ac in A.get('acoes', []):
            t = tempo(ac.get('t', 0), pal)
            if 'andar_ate' in ac:
                js.append(f'{aid}.andar(tl, {t}, {t + ac.get("dur", 2)}, {x_atual}, {ac["andar_ate"]});'); x_atual = ac['andar_ate']
            if 'gesto' in ac:
                js.append(f'{aid}.gesto(tl, {t}, "{ac["gesto"]}", "{ac.get("lado", "d")}", {ac.get("dur", 1.2)});')
            if 'expressao' in ac:
                js.append(f'{aid}.expressao(tl, {t}, "{ac["expressao"]}");')
            if ac.get('piscar'):
                js.append(f'{aid}.piscar(tl, {t}, {D}, {abs(hash(aid)) % 97 + 1});')
            if 'pose' in ac:
                js.append(f'{aid}.pose(tl, {t}, {json.dumps(ac["pose"])}, {ac.get("dur", 0.25)});')
    # objetos SVG
    obj_svg = {'meio': [], 'frente': []}
    for i, O in enumerate(ficha.get('objetos', [])):
        oid = O.get('id', f'obj{i}'); esc = O.get('escala', 0.5); y = O.get('pes', 1000) - 362 * esc
        esq = bool(O.get('mover')) and O['mover']['ate_x'] < O.get('x', 0)  # anda para a esquerda: espelha (objetos são desenhados virados para a direita)
        larg = O.get('largura', 900)
        tr = f'translate({O.get("x", 0) + larg * esc} {round(y, 1)}) scale({-esc} {esc})' if esq else f'translate({O.get("x", 0)} {round(y, 1)}) scale({esc})'
        obj_svg[O.get('camada', 'frente')].append(f'<g id="{oid}"><g transform="{tr}">${{Objetos.{O["tipo"]}({json.dumps({"cor": O.get("cor", "#F5C542"), "id": oid + "-o"})})}}</g></g>')
        js.append(f'tl.set("#{oid}", {{x:0}}, 0);')
        if O.get('mover'):
            M = O['mover']; t = tempo(M['t'], pal); d = M.get('dur', 3); dx = M['ate_x'] - O.get('x', 0)
            js.append(f'tl.to("#{oid}", {{x:{dx}, duration:{d}, ease:"{M.get("ease", "none")}", ...F}}, {t});')
            if M.get('rodas'):
                volta = abs(dx) / (2 * 3.1416 * 66 * esc) * 360  # no objeto espelhado o giro positivo já aparece para trás
                js.append(f'document.querySelectorAll("#{oid} .roda").forEach(r => tl.fromTo(r, {{rotation:0, svgOrigin:r.dataset.cx + " " + r.dataset.cy}}, {{rotation:{round(volta)}, svgOrigin:r.dataset.cx + " " + r.dataset.cy, duration:{d}, ease:"{M.get("ease", "none")}", ...F}}, {t}));')
    # textos
    txt_html = []
    for i, T in enumerate(ficha.get('textos', [])):
        tid = f'txt{i}'; t = tempo(T['t'], pal)
        txt_html.append(f'<div id="{tid}" class="txt" style="left:{T.get("x", 960)}px;top:{T.get("y", 200)}px;font-size:{T.get("tam", 110)}px">{T["texto"]}</div>')
        js.append(f'tl.set("#{tid}", {{opacity:0, xPercent:-50, yPercent:-50, transformOrigin:"50% 70%"}}, 0);')
        js.append(f'tl.fromTo("#{tid}", {{opacity:1, scale:0.4}}, {{scale:1, duration:0.32, ease:"back.out(1.8)", ...F}}, {t});')
        if T.get('ate'):
            js.append(f'tl.to("#{tid}", {{opacity:0, duration:0.15, ...F}}, {tempo(T["ate"], pal)});')
    # efeitos (quadro a quadro)
    ef_html = []
    for i, E in enumerate(ficha.get('efeitos', [])):
        eid = f'ef{i}'; t = tempo(E['t'], pal)
        qs = sorted(os.path.basename(f) for f in glob.glob(os.path.join(H, 'biblioteca', 'efeitos', E['tipo'], '*.png')))
        if E.get('prefixo'):
            qs = [q for q in qs if q.startswith(E['prefixo'])]
        imgs = ''.join(f'<img src="assets/perfil/biblioteca/efeitos/{E["tipo"]}/{q}" style="position:absolute;left:0;top:0;opacity:0;transform:translate(-50%,-50%) scale({E.get("escala", 0.6)})">' for q in qs)
        ef_html.append(f'<div id="{eid}" class="ef" style="left:{E.get("x", 960)}px;top:{E.get("y", 540)}px">{imgs}</div>')
        passo = 1 / E.get('fps', 12); k = 0
        for r in range(E.get('repetir', 1)):
            for j in range(len(qs)):
                tt = round(t + k * passo, 3)
                js.append(f'tl.set("#{eid} img:nth-child({j + 1})", {{opacity:1}}, {tt}); tl.set("#{eid} img:nth-child({j + 1})", {{opacity:0}}, {round(tt + passo, 3)});')
                k += 1
    cen = ficha.get('cenario', {}).get('tipo', 'ruaComercio')
    html = f'''<!doctype html>
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
{'<script src="assets/perfil/pecas/rig2/principal.js"></script>' if raster else ''}
{''.join(f'<script src="assets/perfil/pecas/rig2/sec_{r}.js"></script>' for r in sec_scripts)}
<style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:1920px; height:1080px; overflow:hidden; background:#bfe3f0; }}
#root {{ position:relative; width:1920px; height:1080px; overflow:hidden; font-family:Nunito, sans-serif; }}
#cam, .camada {{ position:absolute; left:0; top:0; width:1920px; height:1080px; }}
.ator, .ef {{ position:absolute; }}
.txt {{ position:absolute; font-weight:900; color:#F5C542; -webkit-text-stroke:6px #2E2A33; paint-order:stroke fill; text-shadow:0 8px 0 rgba(46,42,51,.35); white-space:nowrap; z-index:20; }}
#vinheta {{ position:absolute; inset:0; box-shadow:inset 0 0 220px rgba(70,40,20,.22); pointer-events:none; z-index:30; }}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{D}" data-width="1920" data-height="1080">
  <div id="cena" class="clip" data-start="0" data-duration="{D}" data-track-index="0" style="position:absolute;inset:0">
    <div id="cam">
      <svg class="camada" id="c-fundo" viewBox="0 0 1920 1080"></svg>
      <div class="camada" id="c-atores">{''.join(atores_html)}</div>
      <svg class="camada" id="c-frente" viewBox="0 0 1920 1080"></svg>
      {''.join(ef_html)}
    </div>
    {''.join(txt_html)}
    <div id="vinheta"></div>
  </div>
</div>
<script>
const PALAVRAS = {json.dumps(pal, ensure_ascii=False)};
const F = {{ immediateRender:false, lazy:false }};
const cen = Cenarios.{cen}({{id:"cen"}});
const tmp = document.createElement("div"); tmp.innerHTML = `<svg>${{cen}}</svg>`;
const g = tmp.querySelector("svg > g");
document.getElementById("c-fundo").innerHTML = g.querySelector("#cen-fundo").outerHTML + g.querySelector("#cen-meio").outerHTML + `{''.join(obj_svg['meio'])}`;
document.getElementById("c-frente").innerHTML = g.querySelector("#cen-frente").outerHTML + `{''.join(obj_svg['frente'])}`;
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
    open(os.path.join(pasta, 'index.html'), 'w', encoding='utf-8').write(html)
    return pasta


def renderizar(ficha, pasta, previa):
    rd = os.path.join(os.path.dirname(os.path.abspath(pasta)), 'renders'); os.makedirs(rd, exist_ok=True)
    n = 1
    while os.path.exists(os.path.join(rd, f"{ficha['id']}_v{n:02d}.mp4")):
        n += 1
    out = os.path.join(rd, f"{ficha['id']}_v{n:02d}.mp4")
    subprocess.run(f'npx --yes {HF} render -o "{out}"', cwd=pasta, shell=True, check=True)
    print('render', out)
    # registra a cena no estado do projeto (pasta da cena = <projeto>/_CLAUDE/animacao/cNN)
    proj = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(pasta))))
    if os.path.exists(os.path.join(proj, '_CLAUDE', 'projeto.json')):
        q = subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', out], capture_output=True, text=True)
        rel = os.path.relpath(out, proj).replace(os.sep, '/')
        subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'estado.py'), proj, '--set', 'animacao.cenas.' + ficha['id'], json.dumps({'versao': n, 'render': rel, 'frames': int(q.stdout.strip() or 0), 'projeto': os.path.relpath(pasta, proj).replace(os.sep, '/'), 'status': 'feito'})], capture_output=True)
    if previa:
        subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pisca.py'), out])
        if ficha.get('audio'):
            pv = out.replace('.mp4', '_com_voz.mp4')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', out, '-i', ficha['audio'], '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', pv], check=True)
            print('previa', pv)
    return out


if __name__ == '__main__':
    ficha = json.load(open(sys.argv[1], encoding='utf-8-sig'))  # aceita JSON com BOM (PowerShell)
    pasta = gerar(ficha, sys.argv[2])
    print('cena gerada em', pasta)
    if '--render' in sys.argv:
        renderizar(ficha, pasta, '--previa' in sys.argv)
