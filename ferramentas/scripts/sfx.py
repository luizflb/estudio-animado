#!/usr/bin/env python3
"""Do rascunho aos sons alinhados: acha o arquivo, alinha, calcula nivel e trilha, copia para _CLAUDE/sfx e avisa problemas.

Uso: sfx.py <pasta do projeto> <rascunho.json> [--fim segundos]
Rascunho: lista de [evento, t, "pico"|"inicio"|"fim", "categoria/arquivo.wav", camada, ajuste_db, (dur_max opcional)].
Grava _CLAUDE/sfx/sons_vNN.json (mesmo NN do rascunho). Tempos passam pela funcao unica us() do capcut.py na entrega.
"""
import json, os, re, shutil, subprocess, sys

SONS = os.path.expanduser('~/.animador/sons')
# Alvo do trecho mais forte do som (RMS de 100 ms), em dB abaixo da loudness da voz.
ALVO = dict(whoosh=-15, impacto=-12, grave=-13, riser=-20, pop=-15, clique=-14, teclado=-16, interface=-15, glitch=-18, ding=-16, correto=-16, dinheiro=-15, erro=-15, camera=-15, scratch=-15, humor=-15,
            papel=-16, caneta=-17, relogio=-20, porta=-15, carimbo=-13, passos=-19, risada=-18, ambiente=-26, veiculo=-17, celular=-16)
CAMADA = dict(principal=0, grave=0, apoio=-3, doce=-6, cauda=-8)
TETO_PICO, GANHO_MAX, JANELA_REPETIR = -9.0, 12.0, 20.0


def main(pasta, rascunho, fim_video):
    c = os.path.join(pasta, '_CLAUDE')
    indice = json.load(open(os.path.join(SONS, 'indice.json'), encoding='utf-8'))
    ev = json.load(open(os.path.join(c, 'sfx', 'eventos.json'), encoding='utf-8'))
    voz = ev['voz']['lufs']
    nomes = {f"{e['item']} {e['tipo']}" for e in ev['eventos']}
    versao = re.search(r'_v(\d+)', rascunho).group(1)
    sons, avisos, trilhas, ultimo = [], [], [], {}
    linhas = json.load(open(rascunho, encoding='utf-8'))
    for n, linha in enumerate(linhas, 1):
        evento, t, alinhar, arq, camada, ajuste = linha[:6]
        dur_max = linha[6] if len(linha) > 6 else None  # opcional: corta sons longos (ambiente, passos) com fade-out
        sid = f'sfx{n:02d}'
        info = indice.get(arq)
        if not info:
            avisos.append(f'{sid} som nao achado: {arq}')
            continue
        if evento not in nomes:
            avisos.append(f'{sid} evento nao existe: {evento}')
        if arq in ultimo and t - ultimo[arq] < JANELA_REPETIR:
            avisos.append(f'{sid} repete {arq} em {t - ultimo[arq]:.1f} s')
        ultimo[arq] = t
        util = info['util']
        ini = t - (info['pico_em'] if alinhar == 'pico' else util if alinhar == 'fim' else 0)
        fonte = info['silencio_ini']
        if ini < 0:
            fonte -= ini
            util += ini
            ini = 0.0
        if dur_max and dur_max < util:
            util = dur_max
        fim = min(ini + util, fim_video)
        cat = arq.split('/')[0]
        alvo = voz + ALVO[cat] + CAMADA[camada] + ajuste
        ganho = alvo - info['rms100_db']
        if ganho > GANHO_MAX:
            avisos.append(f'{sid} ganho limitado: {ganho:.1f} dB')
            ganho = GANHO_MAX
        if info['pico_db'] + ganho > TETO_PICO:
            ganho = TETO_PICO - info['pico_db']
        # Trilha: a primeira livre; camadas do mesmo evento caem em trilhas diferentes por sobreposicao.
        for i, livre in enumerate(trilhas):
            if livre <= ini:
                trilhas[i] = fim
                trilha = i
                break
        else:
            trilhas.append(fim)
            trilha = len(trilhas) - 1
        nome = f"{sid} {os.path.splitext(os.path.basename(arq))[0]}.wav"
        destino = os.path.abspath(os.path.join(c, 'sfx', 'sons', nome))  # o CapCut precisa de caminho absoluto
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        if dur_max:
            # Copia cortada com fade-out embutido (fades do CapCut ainda nao validados); fonte passa a ser 0.
            fo = min(0.4, util / 3)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{fonte:.3f}', '-t', f'{util:.3f}', '-i', os.path.join(SONS, arq),
                            '-af', f'afade=t=in:d=0.03,afade=t=out:st={util - fo:.3f}:d={fo:.3f}', destino], check=True)
            fonte = 0.0
        elif not os.path.exists(destino):
            shutil.copy(os.path.join(SONS, arq), destino)
        sons.append(dict(id=sid, evento=evento, t=t, alinhar=alinhar, arquivo=arq, copia=destino.replace('\\', '/'), camada=camada, categoria=cat,
                         ini=round(ini, 4), fim=round(fim, 4), fonte=round(fonte, 4), ganho_db=round(ganho, 1), volume=round(10 ** (ganho / 20), 4), trilha=trilha))
    # Evento sem principal e principais colados
    por_evento = {}
    for s in sons:
        por_evento.setdefault((s['evento'], s['t']), []).append(s)
    for (e, t), lista in por_evento.items():
        if not any(s['camada'] == 'principal' for s in lista) and not any(abs(o['t'] - t) < 0.02 and o['camada'] == 'principal' for o in sons):
            avisos.append(f'{e} em {t}: sem principal')
        if len(lista) > 3:
            avisos.append(f'{e} em {t}: mais de 3 camadas')
    pri = sorted((s for s in sons if s['camada'] == 'principal'), key=lambda s: s['t'])
    for a, b in zip(pri, pri[1:]):
        if b['t'] - a['t'] < 0.12:
            avisos.append(f"{a['id']} e {b['id']}: principais colados ({b['t'] - a['t']:.2f} s)")
    json.dump(dict(voz=voz, trilhas=len(trilhas), sons=sons), open(os.path.join(c, 'sfx', f'sons_v{versao}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    cats = {}
    for s in sons:
        cats[s['categoria']] = cats.get(s['categoria'], 0) + 1
    print(len(sons), 'sons,', len(trilhas), 'trilhas', cats)
    print('ganho min/max', min(s['ganho_db'] for s in sons), max(s['ganho_db'] for s in sons))
    print('\n'.join(avisos) or 'sem avisos')


if __name__ == '__main__':
    args = sys.argv[1:]
    pj = json.load(open(os.path.join(args[0], '_CLAUDE', 'projeto.json'), encoding='utf-8'))
    fim_v = float(args[args.index('--fim') + 1]) if '--fim' in args else pj['cortes']['duracao']
    main(args[0], args[1], fim_v)
