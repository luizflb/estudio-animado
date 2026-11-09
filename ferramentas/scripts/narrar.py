#!/usr/bin/env python3
"""Gera a narracao das cenas do roteiro no ElevenLabs, com tempo por palavra (fluxo animador).

Uso:
  narrar.py <pasta> [--cenas c01,c05-c08] [--modelo M] [--estabilidade X] [--similaridade X]
            [--estilo X] [--velocidade X] [--teste NOME] [--forcar] [--simular] [--aparar]
- --aparar: sem API, cria versao nova das cenas com pedaco da cena seguinte vazado no fim.

- Sem --cenas: todas. So gera cena nova ou mudada (texto, voz ou ajustes), salvo --forcar.
- Ajustes: o que vier na linha de comando, senao o que esta em perfil/voz.md, senao o padrao.
- --teste NOME: grava em _CLAUDE/narracao/teste/<NOME>/ e nao mexe no estado.
- --simular: so mostra o que geraria e quantos caracteres gastaria.
- A fala usa grafia.json (roteiro) e as pronuncias do voz.md; o json guarda as palavras do roteiro
  (o que vai para a legenda), cada uma com o tempo da parte falada correspondente.
- A chave vem de ~/.animador/.env e nunca e mostrada.
"""
import argparse, base64, hashlib, json, pathlib, re, subprocess, sys, time

import requests

HOME = pathlib.Path.home() / '.animador'
VOZ_MD = HOME / 'perfil' / 'voz.md'
ESTADO = HOME / 'scripts' / 'estado.py'
API = 'https://api.elevenlabs.io/v1/text-to-speech/{voz}/with-timestamps'
PADRAO = {'modelo': 'eleven_multilingual_v2', 'estabilidade': 0.5, 'similaridade': 0.75,
          'estilo': 0.0, 'velocidade': 1.0}


def chave():
    for l in (HOME / '.env').read_text(encoding='utf-8').splitlines():
        if l.strip().startswith('ELEVENLABS_API_KEY='):
            return l.split('=', 1)[1].strip().strip('"\'')
    sys.exit('ELEVENLABS_API_KEY nao encontrada em ~/.animador/.env')


def ler_voz():
    txt = VOZ_MD.read_text(encoding='utf-8')
    voz = re.search(r'voice_id:\s*`?([A-Za-z0-9]+)`?', txt)
    if not voz:
        sys.exit('voz.md sem voice_id')
    ajustes = {}
    for k in PADRAO:
        m = re.search(rf'^- {k}:[ \t]*`?([^`\s(]+)', txt, re.M)
        if m:
            ajustes[k] = m.group(1) if k == 'modelo' else float(m.group(1).replace(',', '.'))
    pron = {}
    if '## Pronúncias' in txt:
        for l in txt.split('## Pronúncias', 1)[1].splitlines():
            m = re.match(r'^-\s*(.+?)\s*→\s*(.+?)\s*$', l)
            if m:
                pron[m.group(1)] = m.group(2)
    return voz.group(1), ajustes, pron


def faixas(cenas, sel):
    ids = list(cenas)
    if not sel:
        return ids
    out = []
    for parte in sel.split(','):
        parte = parte.strip()
        if '-' in parte:
            a, b = parte.split('-')
            out += ids[ids.index(a):ids.index(b) + 1]
        else:
            out.append(parte)
    return out


def pedacos(texto, trocas):
    """Divide o texto em pedacos (original, falado). Trocas mais longas primeiro, palavra inteira."""
    if not trocas:
        return [(texto, texto)]
    chaves = sorted(trocas, key=len, reverse=True)
    rx = re.compile(r'(?<!\w)(' + '|'.join(re.escape(k) for k in chaves) + r')(?!\w)')
    out, i = [], 0
    for m in rx.finditer(texto):
        if m.start() > i:
            out.append((texto[i:m.start()], texto[i:m.start()]))
        out.append((m.group(0), trocas[m.group(0)]))
        i = m.end()
    if i < len(texto):
        out.append((texto[i:], texto[i:]))
    return out


def falado(texto, trocas):
    return ''.join(f for _, f in pedacos(texto, trocas))


def palavras(texto, trocas, al):
    """Palavras do roteiro com o tempo da fala. al = alignment do ElevenLabs sobre o texto falado."""
    chars, ini, fim = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
    falado_txt = ''.join(chars)
    pos, out = 0, []
    colado_fim_espaco = True
    for orig, fal in pedacos(texto, trocas):
        k = falado_txt.find(fal, pos) if fal else pos
        if k < 0:
            k = pos
        # palavras do pedaco falado, com tempo
        spans = [(m.start() + k, m.end() + k) for m in re.finditer(r'\S+', fal)]
        tempos = [(ini[a], fim[b - 1]) for a, b in spans if b - 1 < len(fim)]
        ws = re.findall(r'\S+', orig)
        novas = []
        if orig == fal or len(ws) == len(tempos):
            for w, (a, b) in zip(ws, tempos):
                novas.append({'palavra': w, 'ini': round(a, 3), 'fim': round(b, 3)})
        elif tempos:
            # troca com numero de palavras diferente: reparte o tempo pelo tamanho
            a0, b0 = tempos[0][0], tempos[-1][1]
            tot = sum(len(w) for w in ws) or 1
            t = a0
            for w in ws:
                d = (b0 - a0) * len(w) / tot
                novas.append({'palavra': w, 'ini': round(t, 3), 'fim': round(t + d, 3), 'troca': True})
                t += d
        # pedaco colado na palavra anterior (ex.: virgula depois de um nome trocado)
        if novas and out and orig[:1].strip() and not colado_fim_espaco:
            out[-1]['palavra'] += novas[0]['palavra']
            out[-1]['fim'] = max(out[-1]['fim'], novas[0]['fim'])
            novas = novas[1:]
        out += novas
        colado_fim_espaco = not orig[-1:].strip()
        pos = k + len(fal)
    return out


def fim_da_fala(mp3, dur):
    """Inicio do silencio final (ou a duracao, se o audio termina falando)."""
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(mp3), '-af', 'silencedetect=n=-35dB:d=0.12',
                        '-f', 'null', '-'], capture_output=True, text=True)
    ini = re.findall(r'silence_start: ([\d.]+)', r.stderr)
    fins = re.findall(r'silence_end: ([\d.]+)', r.stderr)
    if ini and (len(ini) > len(fins) or abs(float(fins[-1]) - dur) < 0.05):
        return float(ini[-1])
    return dur


def cauda_vazada(mp3, dur):
    """O next_text as vezes faz a voz comecar a palavra da cena seguinte no fim do audio
    (ex.: c08 terminava em "segurança... n"). Padrao: silencio e, depois dele, um pedacinho de som
    ate o fim. Devolve onde cortar (dentro do silencio) ou None."""
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(mp3), '-af', 'silencedetect=n=-35dB:d=0.15',
                        '-f', 'null', '-'], capture_output=True, text=True)
    ini = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r.stderr)]
    fins = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r.stderr)]
    if fins and len(fins) == len(ini) and 0.005 < dur - fins[-1] < 0.35:
        return round(ini[-1] + min(0.25, fins[-1] - ini[-1] - 0.02), 3)
    return None


def aparar(orig, dest, corte):
    fade = 0.03
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(orig), '-af',
                    f'atrim=0:{corte},afade=t=out:st={corte - fade}:d={fade}', '-b:a', '128k', str(dest)],
                   check=True)


def gravar_estado(proj, cid, nome, v, dur, modelo):
    subprocess.run([sys.executable, str(ESTADO), str(proj), '--set', f'narracao.cenas.{cid}',
                    json.dumps({'versao': v, 'audio': f'_CLAUDE/narracao/{nome}.mp3',
                                'tempos': f'_CLAUDE/narracao/{nome}.json', 'duracao': round(dur, 3),
                                'modelo': modelo}, ensure_ascii=False)],
                   check=True, capture_output=True)


def duracao(mp3):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of',
                        'default=nw=1:nk=1', str(mp3)], capture_output=True, text=True)
    return float(r.stdout.strip())


def assinatura(texto, voz, aj):
    return hashlib.sha1(json.dumps([texto, voz, aj], sort_keys=True).encode()).hexdigest()[:12]


def ultima_versao(pasta, cid):
    vs = [int(m.group(1)) for p in pasta.glob(f'{cid}_v*.json')
          if (m := re.match(rf'{cid}_v(\d+)\.json$', p.name))]
    return max(vs) if vs else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pasta')
    ap.add_argument('--cenas')
    ap.add_argument('--modelo')
    for k in ('estabilidade', 'similaridade', 'estilo', 'velocidade'):
        ap.add_argument('--' + k, type=float)
    ap.add_argument('--teste')
    ap.add_argument('--forcar', action='store_true')
    ap.add_argument('--simular', action='store_true')
    ap.add_argument('--aparar', action='store_true')
    a = ap.parse_args()

    proj = pathlib.Path(a.pasta).resolve()
    pj = json.loads((proj / '_CLAUDE' / 'projeto.json').read_text(encoding='utf-8'))
    cenas = pj['roteiro']['cenas']
    # Nomes vao escritos como no roteiro: a voz acerta sozinha, e a grafia fonetica
    # (ex.: "Ilon Mask") sai errada. So se troca o que esta nas pronuncias do voz.md (erro ja ouvido).
    voz, aj_md, pron = ler_voz()
    trocas = dict(pron)
    aj = {**PADRAO, **aj_md, **{k: getattr(a, k) for k in PADRAO if getattr(a, k) is not None}}

    saida = proj / '_CLAUDE' / 'narracao' / ('teste/' + a.teste if a.teste else '')
    saida.mkdir(parents=True, exist_ok=True)
    ids = list(cenas)
    alvo = faixas(cenas, a.cenas)
    if a.aparar:
        return aparar_existentes(proj, saida, alvo)

    fila = []
    for cid in alvo:
        txt = cenas[cid]['narracao']
        sig = assinatura(txt, voz, aj)
        v = ultima_versao(saida, cid)
        if v and not a.forcar and not a.teste:
            antigo = json.loads((saida / f'{cid}_v{v:02d}.json').read_text(encoding='utf-8'))
            if antigo.get('assinatura') == sig:
                continue
        fila.append((cid, txt, sig, v + 1))

    gasto = sum(len(falado(t, trocas)) for _, t, _, _ in fila)
    print(f'modelo {aj["modelo"]} | estab {aj["estabilidade"]} sim {aj["similaridade"]} '
          f'estilo {aj["estilo"]} vel {aj["velocidade"]}')
    print(f'{len(fila)} cena(s) a gerar, {gasto} caracteres' + (' (simulacao)' if a.simular else ''))
    if a.simular or not fila:
        return

    h = {'xi-api-key': chave(), 'Content-Type': 'application/json'}
    narr = pj.get('narracao') or {}
    for cid, txt, sig, v in fila:
        i = ids.index(cid)
        corpo = {
            'text': falado(txt, trocas),
            'model_id': aj['modelo'],
            'voice_settings': {'stability': aj['estabilidade'], 'similarity_boost': aj['similaridade'],
                               'style': aj['estilo'], 'speed': aj['velocidade'], 'use_speaker_boost': True},
            'previous_text': falado(cenas[ids[i - 1]]['narracao'], trocas) if i > 0 else None,
            'next_text': falado(cenas[ids[i + 1]]['narracao'], trocas) if i + 1 < len(ids) else None,
        }
        corpo = {k: x for k, x in corpo.items() if x is not None}
        for tent in range(3):
            r = requests.post(API.format(voz=voz), headers=h, json=corpo,
                              params={'output_format': 'mp3_44100_128'}, timeout=180)
            if r.status_code == 200:
                break
            if r.status_code in (429, 500, 502, 503) and tent < 2:
                time.sleep(5 * (tent + 1))
                continue
            # mensagem da API sem cabecalhos (a chave nunca aparece)
            sys.exit(f'{cid}: erro {r.status_code}: {r.text[:300]}')
        d = r.json()
        nome = f'{cid}_v{v:02d}'
        mp3 = saida / f'{nome}.mp3'
        mp3.write_bytes(base64.b64decode(d['audio_base64']))
        al = d.get('alignment') or d.get('normalized_alignment')
        ws = palavras(txt, trocas, al)
        dur = duracao(mp3)
        corte = cauda_vazada(mp3, dur)
        if corte:
            bruto = saida / f'{nome}_bruto.mp3'
            mp3.replace(bruto)
            aparar(bruto, mp3, corte)
            dur = duracao(mp3)
        fala_fim = fim_da_fala(mp3, dur)
        if ws and ws[-1]['fim'] > fala_fim:
            ws[-1]['fim'] = round(max(ws[-1]['ini'], fala_fim), 3)
        info = {'cena': cid, 'versao': v, 'texto': txt, 'falado': corpo['text'], 'voz': voz, 'ajustes': aj,
                'assinatura': sig, 'duracao': round(dur, 3), 'request_id': r.headers.get('request-id'),
                'fala_fim': round(fala_fim, 3), 'aparado_em': corte, 'palavras': ws, 'alinhamento': al}
        (saida / f'{nome}.json').write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding='utf-8')

        # conferencia
        avisos = []
        n_rot = len(re.findall(r'\S+', txt))
        if len(ws) != n_rot:
            avisos.append(f'{n_rot - len(ws)} palavra(s) sem tempo')
        for w0, w1 in zip(ws, ws[1:]):
            if w1['ini'] - w0['fim'] > 1.2:
                avisos.append(f'silencio de {w1["ini"] - w0["fim"]:.1f}s antes de "{w1["palavra"]}"')
        if ws and dur - ws[-1]['fim'] > 1.5:
            avisos.append(f'{dur - ws[-1]["fim"]:.1f}s de sobra no fim')
        if dur - fala_fim < 0.05:
            avisos.append('termina sem silencio (pode ter cortado)')
        if corte:
            avisos.append(f'aparado em {corte}s (pedaco da cena seguinte no fim)')
        est = cenas[cid].get('duracao_est')
        print(f'{nome}: {dur:.2f}s (est {est}) {len(txt)} car' + ('  ! ' + '; '.join(avisos) if avisos else ''))

        if not a.teste:
            gravar_estado(proj, cid, nome, v, dur, aj['modelo'])


def aparar_existentes(proj, saida, alvo):
    """--aparar: cria versao nova, sem API, das cenas cuja ultima versao tem cauda vazada."""
    n = 0
    for cid in alvo:
        v = ultima_versao(saida, cid)
        if not v:
            continue
        nome = f'{cid}_v{v:02d}'
        info = json.loads((saida / f'{nome}.json').read_text(encoding='utf-8'))
        corte = cauda_vazada(saida / f'{nome}.mp3', duracao(saida / f'{nome}.mp3'))
        if not corte:
            continue
        novo = f'{cid}_v{v + 1:02d}'
        aparar(saida / f'{nome}.mp3', saida / f'{novo}.mp3', corte)
        dur = duracao(saida / f'{novo}.mp3')
        ws = info['palavras']
        fala_fim = min(info.get('fala_fim') or corte, corte)
        if ws and ws[-1]['fim'] > fala_fim:
            ws[-1]['fim'] = round(max(ws[-1]['ini'], fala_fim), 3)
        info.update({'versao': v + 1, 'duracao': round(dur, 3), 'fala_fim': round(fala_fim, 3),
                     'aparado_em': corte, 'aparado_de': v, 'palavras': ws})
        (saida / f'{novo}.json').write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding='utf-8')
        gravar_estado(proj, cid, novo, v + 1, dur, info['ajustes']['modelo'])
        print(f'{novo}: aparado em {corte}s (era {info["alinhamento"]["character_end_times_seconds"][-1]:.2f}s)')
        n += 1
    print(f'{n} cena(s) aparada(s), 0 caracteres gastos')


if __name__ == '__main__':
    main()
