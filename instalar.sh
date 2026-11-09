#!/usr/bin/env bash
# Instalador do Estúdio Animado (Mac/Linux).
# Uso: bash instalar.sh [--whisperx] [--sem-skills] [--raiz <pasta>]
set -e
PAC="$(cd "$(dirname "$0")" && pwd)"; RAIZ="$HOME"; WX=0; SEMSK=0
while [ $# -gt 0 ]; do case "$1" in --whisperx) WX=1;; --sem-skills) SEMSK=1;; --raiz) RAIZ="$2"; shift;; esac; shift; done
DEST="$RAIZ/.animador"; echo "Estúdio Animado -> $DEST"
mkdir -p "$DEST"
cp -R "$PAC/ferramentas/scripts" "$PAC/ferramentas/guias" "$DEST/"
# perfil: nunca sobrescreve estilo, voz e personagens da pessoa
( cd "$PAC/ferramentas/perfil" && find . -type f ) | while read -r f; do
  rel="${f#./}"; alvo="$DEST/perfil/$rel"
  case "$rel" in estilo.js|voz.md|pecas/rig2/pessoas_svg_def.js) [ -e "$alvo" ] && continue;; esac
  mkdir -p "$(dirname "$alvo")"; cp "$PAC/ferramentas/perfil/$rel" "$alvo"
done
mkdir -p "$DEST/perfil/referencias" "$DEST/perfil/analises" "$DEST/perfil/personagem" "$DEST/perfil/biblioteca" "$DEST/sons" "$DEST/musicas"
[ -e "$DEST/.env" ] || echo "# chaves (ex.: ELEVENLABS_API_KEY=...)" > "$DEST/.env"
if [ $SEMSK -eq 0 ]; then mkdir -p "$RAIZ/.claude/skills"; cp -R "$PAC/skills/"* "$RAIZ/.claude/skills/"; echo "Skills copiadas para $RAIZ/.claude/skills"; fi
PY=$(command -v python3 || command -v python || true)
[ -z "$PY" ] && { echo "FALTA: Python 3.10+"; exit 1; }
[ -x "$DEST/venv/bin/python" ] || "$PY" -m venv "$DEST/venv"
VPY="$DEST/venv/bin/python"
"$VPY" -m pip install --upgrade pip -q
"$VPY" -m pip install -q -r "$PAC/ferramentas/requirements.txt"
[ $WX -eq 1 ] && "$VPY" -m pip install -q whisperx
OK=1
command -v ffmpeg >/dev/null || { echo "FALTA: ffmpeg (Mac: brew install ffmpeg | Linux: sudo apt install ffmpeg)"; OK=0; }
command -v node >/dev/null || { echo "FALTA: Node.js 18+ (https://nodejs.org) - usado pelo HyperFrames"; OK=0; }
if [ -d "/Applications/Google Chrome.app" ] || command -v google-chrome >/dev/null || command -v chromium >/dev/null; then echo "Navegador ok"; else echo "FALTA: Google Chrome ou Chromium (para conferir os desenhos)"; OK=0; fi
command -v nvidia-smi >/dev/null && [ $WX -eq 0 ] && echo "Dica: este PC tem placa NVIDIA. Para a transcrição mais precisa, rode de novo com --whisperx."
echo "Python do pacote: $VPY"
[ $OK -eq 1 ] && echo "PRONTO. Abra o Claude Code numa pasta vazia com o nome do vídeo e digite /animador" || echo "Instale o que falta e rode de novo."
