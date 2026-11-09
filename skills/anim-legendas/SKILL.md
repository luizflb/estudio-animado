---
name: anim-legendas
description: "Sempre pergunta se o vídeo terá legendas. Se sim, gera legendas sincronizadas com a narração, com o texto exato do roteiro, sem cobrir o personagem nem os textos da tela. Depois exporta o vídeo final (1080p, -14 LUFS para o YouTube, com ou sem legendas) e a versão leve. Use em /anim-legendas, a última etapa."
---

# anim-legendas

- **Lê:** tempo por palavra da narração, bloco `roteiro`, `_CLAUDE/roteiro/grafia.json`, `mapa` (onde há texto ou personagem embaixo), `~/.animador/perfil/identidade.md` (fonte e cores).
- **Escreve:** `_CLAUDE/legendas/legendas_vNN.ass`, `_CLAUDE/final/<título>_vNN.mp4` e `_leve.mp4`.

## 1. Sempre perguntar primeiro
**"Este vídeo vai ter legendas?"** (botões: Sim / Não). A resposta é de cada vídeo: nunca assumir pela resposta de um vídeo anterior.
- **Não:** marque `legendas` como `nao_precisa` e vá direto para a exportação (passo 4), sem legendas.
- **Sim:** pergunte, se ainda não estiver no perfil: até quantas palavras por vez (padrão 3), maiúsculas ou não, posição (padrão: faixa de baixo, centralizada).

## 2. Gerar
`PY ~/.animador/scripts/legendas_ass.py <pasta> [--palavras 3] [--fonte <fonte do estilo>] [--tam 64] [--y 930] [--maiusculas]`
- Texto do roteiro (a grafia dele), não o da pronúncia.
- Nunca separar número da unidade, nem nome próprio.
- Cena em que o mapa põe texto, gráfico ou o rosto do personagem na faixa de baixo: suba a legenda (`--y`) ou gere essas cenas com outra altura. Liste essas cenas.

## 3. Conferir
Gere 3 quadros com a legenda queimada em momentos diferentes (ffmpeg `subtitles=` num trecho curto) e olhe: legível, sem cobrir o personagem nem os textos da tela.

## 4. Exportar o vídeo final
`PY ~/.animador/scripts/exportar_final.py <pasta> --titulo "<título>" [--legendas _CLAUDE/legendas/legendas_vNN.ass]`
- Usa a mixagem mais nova do som (ou a narração, se não houve som), normaliza para -14 LUFS (pico -1 dB) e gera a versão leve.
- Confira a decodificação (o script mostra os erros) e mande a versão leve.

## Resumo e fechamento
Quantas legendas (ou "sem legendas"), arquivo final, créditos para a descrição (`_CLAUDE/creditos.md`: canal original no modo cópia, músicas). Marque `concluido` e lembre: `/animador aprendizados` aplica o que foi anotado para os próximos vídeos.

## Regras comuns
Antes de começar, leia `../animador/regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca sobrescrever um vídeo entregue: versão nova.
- Nunca mover, renomear ou apagar arquivos do projeto.
