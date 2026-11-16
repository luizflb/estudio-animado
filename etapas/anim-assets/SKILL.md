---
name: anim-assets
description: "Prepara o que as cenas precisam antes de animar: desenha em SVG, o mais detalhado possível e no traço da referência, os cenários, objetos e personagens secundários que faltam; busca logos e prints de páginas públicas; e, só para o que não fica bom em SVG (animais, efeitos orgânicos, comida em close), escreve o pedido de imagens para a pessoa gerar no Gemini. Use em /anim-assets, depois do mapa."
---

# anim-assets

- **Lê:** as listas de faltas do `mapa`, `~/.animador/perfil/` (`estilo.js`, `identidade.md`, `estilo-animacao.md`, `referencias/`, `pecas/`, `biblioteca/`).
- **Escreve:** desenhos novos em `pecas/svg/cenarios.js`, `objetos.js` e `pecas/rig2/pessoa_svg.js`; personagens em `pessoas_svg_def.js`; arquivos em `_CLAUDE/assets/`; `_CLAUDE/creditos.md`.
- **Próximo passo:** `/anim-animacao`

## Cenários e objetos (sempre SVG, sempre o mais detalhado possível)
Para cada falta, desenhe em código, em `cenarios.js` (cenário em 3 camadas: fundo, meio, frente, com o meio do chão livre) ou `objetos.js` (objeto com peças móveis separadas: rodas, hélices, portas):
- **Nível de detalhe:** vários elementos por cenário (fachadas com placas em texto de verdade, toldos, janelas com cortina e vaso, fios com passarinhos, calçada com desenho, objetos de rua, gente ao fundo); objetos com várias partes (reflexos, maçanetas, faróis, calotas, sombras simples). Nunca formas simples ou "quadrados".
- **Traço da referência:** cores e contorno do `estilo.js`; se a referência tem sombra suave, cenário com sombra suave; se é chapado, chapado.
- **Proporção** com o personagem.
- **Conferir olhando:** capture com o Chrome headless e confira antes de mostrar. Corrija o que estiver fora (sobreposição, texto cortado, peça solta).
- Aprovado, fica na biblioteca para os próximos vídeos.

## Personagens secundários (SVG)
1. **Já existe** em `pessoas_svg_def.js`: reaproveite (pode trocar cores).
2. **Novo:** escreva a definição; estilo de cabelo ou roupa que não existe, desenhe no `pessoa_svg.js` no mesmo nível de detalhe. Mostre parado e num gesto (`rig_teste_svg.html?nomes=<nome>&g=1`).
3. **Precisa ficar idêntico a uma imagem** que a pessoa mandou: `vetorizar_auto.py` (ver `anim-personagem`) e `cabeca_vetor`.

## Logos e prints
Logo oficial, sem redesenhar; print só de página pública; nada do vídeo original. Anote fonte e licença em `creditos.md`.

## Imagens geradas (só o que não fica bom em SVG)
Animais, efeitos orgânicos quadro a quadro (fumaça, fogo, água, explosão) e comida em close: veja primeiro a `biblioteca/`. Faltou:
1. Escreva `_CLAUDE/assets/pedido_imagens_vNN.md` para a pessoa gerar no Gemini (Nano Banana) ou ChatGPT, com uma **carta de estilo** no começo (o traço, as cores e a sombra do `identidade.md`, "sem texto, fundo branco liso, cada item separado numa grade") e as referências para anexar.
2. Marque `aguardando_pessoa`. Quando as folhas chegarem, corte: `PY ~/.animador/scripts/rec_folha_pecas.py <folha> <pasta> --nomes ... --conferir conf.jpg` (efeitos: `--celulas 6`; peças que quase se encostam: `--dilatar 0`; área branca só vira fundo com `--buracos`).
3. Confira a folha de conferência e guarde em `~/.animador/perfil/biblioteca/<categoria>/` com nomes.

## Resumo no chat
O que foi desenhado (com as capturas), personagens prontos, o que a pessoa precisa gerar. Marque `aguardando_aprovacao`, `aguardando_pessoa` ou `nao_precisa`.

## Aprovação
Marque `concluido`. Sugira `/clear` e `/animador`.

## Regras comuns
Antes de começar, leia `../animador/regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca mover, renomear ou apagar arquivos do projeto.
- Nunca copiar personagens ou artes das referências: o estilo vem delas, o desenho é próprio.
