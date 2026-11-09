---
name: anim-sfx
description: "Coloca efeitos sonoros alinhados às animações (whoosh, pop, impactos, passos, objetos) e música de fundo por parte do vídeo, abaixo da narração, e entrega a prévia com som. Usa sons da Mixkit e músicas de Kevin MacLeod baixados pela pessoa. Use em /anim-sfx, depois da animação, inteiro ou por trecho."
---

# anim-sfx

- **Lê:** eventos da animação (`_CLAUDE/animacao/cNN/eventos_cNN.json`), momentos do mapa, a narração, `~/.animador/sons/` e `~/.animador/musicas/` (com `indice.json` e `LICENCAS.md`).
- **Escreve:** `_CLAUDE/sfx/` (eventos, rascunho, sons, música, mixagem), blocos `sfx` e `musica`, a prévia, `creditos.md`.
- **Próximo passo:** `/anim-legendas`

Sem `~/.animador/sons/` ou `musicas/`: peça o "sim" e rode `PY ~/.animador/scripts/baixar_sons.py` e `baixar_musicas.py`.

## Efeitos
1. **Eventos:** `PY ~/.animador/scripts/rec_eventos.py <pasta>` → `_CLAUDE/sfx/eventos.json` (no tempo do vídeo, com a troca de cena como evento e a loudness da voz).
2. **Rascunho:** `_CLAUDE/sfx/rascunho_vNN.json`, uma linha por som: `["cNN tipo", t, "pico"|"inicio"|"fim", "categoria/arquivo.wav", "principal"|"grave"|"apoio"|"doce", ajuste_db, dur_max?]`.
   - O som segue o que se vê; um protagonista por momento, no máximo 3 camadas; whoosh com o pico na chegada; pop, clique e ding no início do evento.
   - Densidade aprovada como padrão: ~35 por minuto, com whoosh suave (de ar) nas trocas de cena sem outro som perto; eventos leves com som baixo (-3 dB). O maior impacto no ápice do gancho.
   - Sem repetir o mesmo arquivo em ~20 s (use as variações de cada categoria).
   - Sons longos (ambiente, passos, risada) com `dur_max`.
3. **Gravar:** `PY ~/.animador/scripts/sfx.py <pasta> _CLAUDE/sfx/rascunho_vNN.json --fim <duração total>`. Corrija os avisos (repetido, colados, sem principal).

## Música
- Uma faixa por parte (ou uma só, se o clima não muda), trocando só nas viradas, com fade cruzado. **Evite as faixas famosas em memes** (lista em `musicas/LICENCAS.md`): deixam o vídeo com cara de piada. Prefira trilha cinematográfica ou ambiente.
- Mostre a escolha antes de gravar: parte, faixa, por quê. A pessoa troca por número.
- Plano em `_CLAUDE/sfx/musica_vNN.json` (`distancia_db` 20, `respiro_db` 3, `denso_db` 2, `fade` 1.5, `trechos` com id, faixa, ini, fim) e `PY ~/.animador/scripts/rec_musica.py <pasta> _CLAUDE/sfx/musica_vNN.json`.

## Mixar e entregar
`PY ~/.animador/scripts/rec_mix.py <pasta> _CLAUDE/sfx/sons_vNN.json _CLAUDE/sfx/musica_clipes_vNN.json _CLAUDE/sfx/mix_sfx_vNN.wav` (mostra a distância música-voz por trecho: ~20 dB). Prévia: renders + mixagem pelo FFmpeg, em 1080p e leve. Créditos das músicas em `creditos.md`.

## Resumo e revisão
Quantos efeitos por categoria, músicas e onde, créditos. Revisão por número ("sfx12 mais baixo" = -3 dB, "sfx05 tira", "mu02 mais tensa", "mais efeitos"). Nível aprovado vira aprendizado. Marque `aguardando_aprovacao` e, aprovado, `concluido`.

## Regras comuns
Antes de começar, leia `../animador/regras-comuns.md` (uma vez por sessão).

## Regras
- Som ou música sem licença clara para YouTube não entra. Os sons da Mixkit não podem ser redistribuídos sozinhos.
