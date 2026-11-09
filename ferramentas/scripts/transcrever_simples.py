#!/usr/bin/env python3
"""Transcreve um áudio ou vídeo com tempo por palavra (faster-whisper; roda em CPU ou placa de vídeo, o que tiver).

Uso: transcrever_simples.py <arquivo> <saida.json> [--idioma en] [--modelo small]
Reserva do transcrever.py (WhisperX), para PC sem placa NVIDIA. Mesmo formato de saída:
{"motor": {...}, "duracao": s, "palavras": [{"w", "ini", "fim"}], "segmentos": [...], "texto": "..."}
Modelos: tiny, base, small (padrão, bom equilíbrio), medium, large-v3 (mais preciso e mais lento).
"""
import argparse, json


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('arquivo'); ap.add_argument('saida'); ap.add_argument('--idioma'); ap.add_argument('--modelo', default='small')
    a = ap.parse_args()
    from faster_whisper import WhisperModel
    try:
        modelo = WhisperModel(a.modelo, device='cuda', compute_type='float16')
    except Exception:
        modelo = WhisperModel(a.modelo, device='cpu', compute_type='int8')
    segs, info = modelo.transcribe(a.arquivo, language=a.idioma, word_timestamps=True, vad_filter=True)
    palavras, segmentos, texto = [], [], []
    for s in segs:
        segmentos.append({'ini': round(s.start, 3), 'fim': round(s.end, 3), 'texto': s.text.strip()})
        texto.append(s.text.strip())
        for w in (s.words or []):
            palavras.append({'w': w.word.strip(), 'ini': round(w.start, 3), 'fim': round(w.end, 3)})
    json.dump({'motor': {'modelo': a.modelo, 'via': 'faster-whisper'}, 'duracao': round(info.duration, 3), 'texto': ' '.join(texto),
               'idioma': info.language, 'palavras': palavras, 'segmentos': segmentos},
              open(a.saida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(a.saida, len(palavras), 'palavras,', info.language)


if __name__ == '__main__':
    main()
