#!/usr/bin/env python3
"""Transcreve com tempo por palavra escolhendo o motor pelo PC:
- placa NVIDIA (CUDA) + WhisperX instalado: transcrever.py (WhisperX, o mais preciso);
- senão: transcrever_simples.py (faster-whisper, roda em qualquer PC).
Uso: transcrever_auto.py <audio_ou_video> --saida <json> [--idioma pt] [--contexto "termos"]
O arquivo é convertido antes para WAV 16 kHz mono (_CLAUDE/... ao lado da saída).
"""
import argparse, os, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))


def tem_whisperx():
    teste = "import torch, whisperx, sys; sys.exit(0 if torch.cuda.is_available() else 1)"
    try:
        return subprocess.run([sys.executable, '-c', teste], capture_output=True, timeout=180).returncode == 0
    except Exception:
        return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('arquivo'); ap.add_argument('--saida', required=True); ap.add_argument('--idioma', default='pt'); ap.add_argument('--contexto')
    a = ap.parse_args()
    wav = os.path.splitext(a.saida)[0] + '_16k.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.arquivo, '-ac', '1', '-ar', '16000', wav], check=True)
    if tem_whisperx():
        print('motor: WhisperX (placa de vídeo)')
        cmd = [sys.executable, os.path.join(AQUI, 'transcrever.py'), wav, '--saida', a.saida, '--idioma', a.idioma]
        if a.contexto:
            cmd += ['--contexto', a.contexto]
    else:
        print('motor: faster-whisper (este PC não tem placa NVIDIA com CUDA ou o WhisperX não está instalado)')
        cmd = [sys.executable, os.path.join(AQUI, 'transcrever_simples.py'), wav, a.saida, '--idioma', a.idioma]
    sys.exit(subprocess.run(cmd).returncode)


if __name__ == '__main__':
    main()
