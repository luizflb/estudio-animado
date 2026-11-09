#!/usr/bin/env python3
"""Baixa músicas de fundo de Kevin MacLeod (incompetech.com), licença CC BY 4.0: uso livre no YouTube, inclusive monetizado,
com CRÉDITO OBRIGATÓRIO na descrição. Faixas escolhidas por clima, sem as famosas em memes (que deixam o vídeo com cara de piada).
Uso: baixar_musicas.py   -> ~/.animador/musicas/<clima>/<Título>.mp3, LICENCAS.md e o índice (musicas_indice.py)
"""
import os, subprocess, sys, urllib.parse, urllib.request
FAIXAS = {
 "curioso": [
  "Airport Lounge",
  "Spy Glass"
 ],
 "epico": [
  "Achilles",
  "Five Armies",
  "Heroic Age",
  "Prelude and Action",
  "Rising Game"
 ],
 "feliz": [
  "Easy Lemon",
  "Fearless First",
  "Happy Alley",
  "Inspired",
  "Wholesome"
 ],
 "tenso": [
  "Dark Fog",
  "Darkest Child",
  "Hitman",
  "Impact Prelude",
  "Lightless Dawn",
  "Ossuary 6 - Air",
  "Unseen Horrors",
  "Volatile Reaction"
 ],
 "triste": [
  "Clean Soul",
  "Dreamer",
  "Healing",
  "Long Note Four",
  "Lost Frontier",
  "Sad Trio"
 ]
}
RAIZ = os.path.expanduser('~/.animador/musicas')
EVITAR = ['Investigations', 'Thinking Music', 'Life of Riley', 'Hidden Agenda', 'Sneaky Snitch', 'Monkeys Spinning Monkeys', 'Fluffing a Duck',
          'Scheming Weasel', 'Local Forecast', 'Quirky Dog', 'Pixel Peeker Polka', 'Merry Go', 'Carefree', 'Wallpaper']


def main():
    n = 0
    for clima, titulos in FAIXAS.items():
        for t in titulos:
            dst = os.path.join(RAIZ, clima, t + '.mp3')
            if os.path.exists(dst):
                continue
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            url = 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/' + urllib.parse.quote(t) + '.mp3'
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                open(dst, 'wb').write(urllib.request.urlopen(req, timeout=120).read()); n += 1
            except Exception as e:
                print('falhou', t, e)
    open(os.path.join(RAIZ, 'LICENCAS.md'), 'w', encoding='utf-8').write(
        '# Músicas

Kevin MacLeod (incompetech.com), CC BY 4.0. Crédito obrigatório na descrição, uma linha por faixa:
'
        '"<Título>" Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 4.0 http://creativecommons.org/licenses/by/4.0/

'
        'Evitar (famosas em memes): ' + ', '.join(EVITAR) + '
')
    print(n, 'faixas novas')
    subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'musicas_indice.py')])


if __name__ == '__main__':
    main()
