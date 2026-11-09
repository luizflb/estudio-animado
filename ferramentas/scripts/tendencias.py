#!/usr/bin/env python3
"""Pesquisa grátis do que está funcionando num tema: busca no YouTube pelo yt-dlp (sem conta, sem chave)
e ordena por visualizações. O Claude lê a lista para estudar ganchos, títulos e formatos antes de escrever o roteiro.

Uso: tendencias.py "<tema>" [--n 30] [--saida tendencias.md] [--curtos]
- --curtos: só vídeos de até 3 minutos (Shorts/Reels); sem ele, todos.
"""
import argparse, json, subprocess, sys


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('tema'); ap.add_argument('--n', type=int, default=30); ap.add_argument('--saida'); ap.add_argument('--curtos', action='store_true')
    a = ap.parse_args()
    linhas = []
    for busca in (a.tema, a.tema + ' animação', a.tema + ' história'):
        r = subprocess.run([sys.executable, '-m', 'yt_dlp', f'ytsearch{a.n}:{busca}', '--flat-playlist', '-j', '--no-warnings'],
                           capture_output=True, text=True, encoding='utf-8', errors='ignore')
        for l in r.stdout.splitlines():
            try:
                d = json.loads(l)
            except ValueError:
                continue
            dur = d.get('duration') or 0
            if a.curtos and dur and dur > 180:
                continue
            linhas.append((d.get('view_count') or 0, d.get('title') or '', d.get('channel') or d.get('uploader') or '', dur, d.get('url') or d.get('webpage_url') or ''))
    vistos, saida = set(), []
    for v, t, c, dur, u in sorted(linhas, reverse=True):
        if u in vistos:
            continue
        vistos.add(u)
        saida.append(f'| {v:,} | {t} | {c} | {int(dur // 60)}:{int(dur % 60):02d} | {u} |'.replace(',', '.'))
    md = f'# Tendências: {a.tema}\n\n| Visualizações | Título | Canal | Duração | Link |\n|---|---|---|---|---|\n' + '\n'.join(saida[:a.n]) + '\n'
    if a.saida:
        open(a.saida, 'w', encoding='utf-8').write(md)
    print(md)


if __name__ == '__main__':
    main()
