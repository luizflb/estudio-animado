#!/usr/bin/env python3
"""Narração GRÁTIS das cenas do roteiro com as vozes neurais da Microsoft (edge-tts), com tempo por palavra.
Mesmo formato do narrar.py (ElevenLabs): _CLAUDE/narracao/cNN_vNN.mp3 + .json com "palavras" e o estado atualizado.

Uso: narrar_edge.py <pasta> [--cenas c01,c05-c08] [--voz pt-BR-AntonioNeural] [--velocidade +0%] [--forcar] [--listar-vozes]
- Voz e velocidade: linha de comando, senão ~/.animador/perfil/voz.md (linhas "- edge_voz: ..." e "- edge_velocidade: ..."),
  senão pt-BR-AntonioNeural a +0%.
- Só gera cena nova ou com texto mudado, salvo --forcar. Versão nova a cada mudança (nunca sobrescreve).
"""
import argparse, asyncio, hashlib, json, pathlib, re, subprocess, sys

HOME = pathlib.Path.home() / '.animador'
ESTADO = HOME / 'scripts' / 'estado.py'


def voz_padrao():
    v, vel = 'pt-BR-AntonioNeural', '+0%'
    md = HOME / 'perfil' / 'voz.md'
    if md.exists():
        t = md.read_text(encoding='utf-8')
        m = re.search(r'^- edge_voz:\s*`?([\w-]+)', t, re.M); v = m.group(1) if m else v
        m = re.search(r'^- edge_velocidade:\s*`?([+-]\d+%)', t, re.M); vel = m.group(1) if m else vel
    return v, vel


async def sintetizar(texto, voz, vel, mp3):
    import edge_tts
    try:
        com = edge_tts.Communicate(texto, voz, rate=vel, boundary='WordBoundary')
    except TypeError:  # versões antigas não têm "boundary" (já mandam palavra por palavra)
        com = edge_tts.Communicate(texto, voz, rate=vel)
    palavras = []
    with open(mp3, 'wb') as f:
        async for ch in com.stream():
            if ch['type'] == 'audio':
                f.write(ch['data'])
            elif ch['type'] == 'WordBoundary':
                ini = ch['offset'] / 1e7; fim = (ch['offset'] + ch['duration']) / 1e7
                palavras.append({'palavra': ch['text'], 'ini': round(ini, 3), 'fim': round(fim, 3)})
    return palavras


def alinhar_ao_roteiro(texto, ws):
    """Os tempos vêm por palavra falada, sem pontuação: devolve as palavras do roteiro (com pontuação) com esses tempos."""
    rot = re.findall(r'\S+', texto); out = []; j = 0
    norm = lambda s: re.sub(r'[^\wÀ-ÿ]', '', s.lower())
    for w in rot:
        alvo = norm(w)
        k = j
        while k < len(ws) and norm(ws[k]['palavra']) != alvo and k < j + 3:
            k += 1
        if k < len(ws) and norm(ws[k]['palavra']) == alvo:
            j = k
        if j < len(ws):
            out.append({'palavra': w, 'ini': ws[j]['ini'], 'fim': ws[j]['fim']}); j += 1
    return out


def duracao(mp3):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(mp3)], capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def faixa(ids, sel):
    if not sel:
        return ids
    out = []
    for p in sel.split(','):
        if '-' in p:
            a, b = p.split('-'); out += ids[ids.index(a):ids.index(b) + 1]
        else:
            out.append(p)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pasta', nargs='?'); ap.add_argument('--cenas'); ap.add_argument('--voz'); ap.add_argument('--velocidade')
    ap.add_argument('--forcar', action='store_true'); ap.add_argument('--listar-vozes', action='store_true')
    a = ap.parse_args()
    if a.listar_vozes:
        import edge_tts
        vs = asyncio.run(edge_tts.list_voices())
        for v in vs:
            if v['Locale'].startswith('pt'):
                print(v['ShortName'], v['Gender'])
        return
    proj = pathlib.Path(a.pasta)
    pj = json.loads((proj / '_CLAUDE' / 'projeto.json').read_text(encoding='utf-8'))
    cenas = pj['roteiro']['cenas']; ids = list(cenas)
    voz, vel = voz_padrao()
    voz, vel = a.voz or voz, a.velocidade or vel
    saida = proj / '_CLAUDE' / 'narracao'; saida.mkdir(parents=True, exist_ok=True)
    narr = (pj.get('narracao') or {}).get('cenas', {})
    for cid in faixa(ids, a.cenas):
        txt = cenas[cid]['narracao']
        sig = hashlib.sha1(json.dumps([txt, voz, vel]).encode()).hexdigest()[:12]
        ant = narr.get(cid)
        if ant and not a.forcar:
            j = proj / ant['tempos']
            if j.exists() and json.loads(j.read_text(encoding='utf-8')).get('assinatura') == sig:
                continue
        v = 1
        while (saida / f'{cid}_v{v:02d}.mp3').exists():
            v += 1
        nome = f'{cid}_v{v:02d}'; mp3 = saida / f'{nome}.mp3'
        ws = asyncio.run(sintetizar(txt, voz, vel, mp3))
        ws = alinhar_ao_roteiro(txt, ws)
        dur = duracao(mp3)
        info = {'cena': cid, 'versao': v, 'texto': txt, 'falado': txt, 'voz': voz, 'ajustes': {'motor': 'edge-tts', 'velocidade': vel},
                'assinatura': sig, 'duracao': round(dur, 3), 'palavras': ws}
        (saida / f'{nome}.json').write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding='utf-8')
        subprocess.run([sys.executable, str(ESTADO), str(proj), '--set', f'narracao.cenas.{cid}',
                        json.dumps({'versao': v, 'audio': f'_CLAUDE/narracao/{nome}.mp3', 'tempos': f'_CLAUDE/narracao/{nome}.json',
                                    'duracao': round(dur, 3), 'modelo': 'edge-tts:' + voz}, ensure_ascii=False)], check=True, capture_output=True)
        print(f'{nome}: {dur:.2f}s, {len(ws)} palavras com tempo')


if __name__ == '__main__':
    main()
