#!/usr/bin/env python
"""WhisperX local: tempo por palavra + revisao de trechos engolidos.
Uso: transcrever.py <wav 16k mono> --saida <json> [--contexto "termos"] [--idioma pt] [--modelo large-v3]
Tenta do mais preciso ao mais leve na GPU. NUNCA cai para CPU: sem GPU, para com erro."""
import argparse, dataclasses, gc, json, os, pathlib, sys, time
import numpy as np, torch
if hasattr(os, 'add_dll_directory'):
    os.add_dll_directory(str(pathlib.Path(torch.__file__).parent / 'lib'))
import whisperx

ap = argparse.ArgumentParser()
ap.add_argument('wav'); ap.add_argument('--saida', required=True)
ap.add_argument('--contexto', default=None); ap.add_argument('--idioma', default='pt')
ap.add_argument('--modelo', default='large-v3')
a = ap.parse_args()
if not torch.cuda.is_available():
    sys.exit('ERRO: GPU nao disponivel; nao vou cair para CPU sem avisar.')

TENTATIVAS = [(a.modelo, 'float16', 8), (a.modelo, 'int8_float16', 4), (a.modelo, 'int8', 2),
              ('medium', 'float16', 8), ('medium', 'int8', 4)]
SR = 16000

def limpar():
    gc.collect(); torch.cuda.empty_cache()

def carregar(modelo, ct, ctx):
    opts = {'initial_prompt': ctx, 'condition_on_previous_text': False, 'suppress_numerals': False}
    return whisperx.load_model(modelo, 'cuda', compute_type=ct, language=a.idioma, asr_options=opts)

audio = whisperx.load_audio(a.wav)
seg, usado = None, None
for modelo, ct, lote in TENTATIVAS:
    try:
        t = time.time()
        m = carregar(modelo, ct, a.contexto)
        seg = m.transcribe(audio, batch_size=lote, language=a.idioma)['segments']
        usado = {'modelo': modelo, 'compute_type': ct, 'batch': lote, 'segundos': round(time.time() - t, 1)}
        del m; limpar()
        print('OK', usado, flush=True)
        break
    except Exception as e:
        print(f'FALHOU {modelo}/{ct}/{lote}: {str(e)[:200]}', flush=True)
        m = None; limpar()
if seg is None:
    sys.exit('ERRO: nenhuma configuracao coube na GPU.')

alinhador, meta = whisperx.load_align_model(language_code=a.idioma, device='cuda')

def alinhar(segs, aud, deslocamento=0.0, fonte='contexto'):
    r = whisperx.align(segs, alinhador, meta, aud, 'cuda', return_char_alignments=False)
    saida = []
    for s in r['segments']:
        pal = []
        for w in s.get('words', []):
            pal.append({'w': w['word'], 'ini': w.get('start'), 'fim': w.get('end'), 'score': w.get('score')})
        # palavra sem tempo (numero, simbolo): interpola entre vizinhas e marca
        for i, w in enumerate(pal):
            if w['ini'] is None:
                ant = next((p['fim'] for p in reversed(pal[:i]) if p['fim'] is not None), s['start'])
                pro = next((p['ini'] for p in pal[i + 1:] if p['ini'] is not None), s['end'])
                w['ini'], w['fim'], w['interpolado'] = ant, pro, True
            w['ini'] = round(w['ini'] + deslocamento, 3); w['fim'] = round(w['fim'] + deslocamento, 3)
            w['fonte'] = fonte
        saida += pal
    return saida

palavras = alinhar(seg, audio)

# trechos com energia e sem palavra
def engolidos(pal, min_s=0.6, folga=0.15):
    h = int(0.05 * SR)
    rms = np.sqrt(np.convolve(audio ** 2, np.ones(h) / h, 'same'))[::h]
    limiar = max(10 ** (-40 / 20), np.percentile(rms, 95) * 0.1)
    voz = rms > limiar
    for w in pal:
        voz[max(0, int((w['ini'] - folga) / 0.05)):int((w['fim'] + folga) / 0.05) + 1] = False
    out, i = [], 0
    while i < len(voz):
        if voz[i]:
            j = i
            while j < len(voz) and (voz[j] or (j + 4 < len(voz) and voz[j:j + 5].any())):
                j += 1
            if (j - i) * 0.05 >= min_s:
                out.append((round(i * 0.05, 2), round(j * 0.05, 2)))
            i = j
        else:
            i += 1
    return out

trechos = engolidos(palavras)
print('trechos com som e sem palavra:', trechos, flush=True)
revistos = []
if trechos:
    m = carregar(usado['modelo'], usado['compute_type'], None)
    for ini, fim in trechos:
        p0 = max(0, ini - 0.3); p1 = min(len(audio) / SR, fim + 0.3)
        aud = audio[int(p0 * SR):int(p1 * SR)]
        seg2 = m.transcribe(aud, batch_size=usado['batch'], language=a.idioma)['segments']
        novas = alinhar(seg2, aud, p0, 'sem_contexto') if seg2 else []
        # so entram palavras que caem dentro do buraco
        novas = [w for w in novas if not any(w['ini'] < v['fim'] and w['fim'] > v['ini'] for v in palavras)]
        revistos.append({'ini': ini, 'fim': fim, 'texto': ' '.join(w['w'] for w in novas)})
        palavras += novas
    palavras.sort(key=lambda w: w['ini'])

saida = pathlib.Path(a.saida); saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({'motor': usado, 'contexto': a.contexto, 'duracao': round(len(audio) / SR, 3),
                             'revistos': revistos, 'palavras': palavras}, ensure_ascii=False, indent=0), encoding='utf-8')
print('palavras:', len(palavras), 'revistos:', revistos, flush=True)
print(' '.join(w['w'] for w in palavras))
