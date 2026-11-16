---
name: anim-estilo
description: "Define o estilo visual do canal a partir das referências da pessoa (imagens ou vídeos de animações que ela gosta): traço, espessura, cores, fontes, ritmo e câmera. Grava o perfil (estilo.js, identidade.md, estilo-animacao.md) e aprova com uma cena de teste em SVG bem detalhada. Use em /anim-estilo, depois da anim-iniciar, uma vez por canal."
---

# anim-estilo

Tudo o que for desenhado depois segue o que sair daqui. Vale para o canal inteiro: no próximo vídeo vira `nao_precisa`.

- **Lê:** as referências da pessoa, `~/.animador/perfil/`.
- **Escreve:** `~/.animador/perfil/referencias/`, `estilo.js`, `identidade.md`, `estilo-animacao.md`, `analises/`.
- **Próximo passo:** `/anim-personagem`

## 1. Pedir as referências (obrigatório)
Peça numa mensagem: **"Me mande o modelo de animação que você quer seguir: 2 a 5 imagens (prints) ou links/arquivos de vídeos de canais cujo visual você gosta. Diga também o que mais gosta em cada um (traço, cores, cenários, jeito do personagem, ritmo)."**
- Guarde tudo em `~/.animador/perfil/referencias/` (R1, R2...). Vídeo por link: baixe com o "sim" (720p, só o trecho necessário) e tire quadros com `quadros.py`.
- Sem referência, não siga: ofereça 3 estilos de exemplo descritos em palavras (traço grosso e cores chapadas; traço fino estilo palito; cartoon com sombra suave) para a pessoa escolher, e registre que não houve referência.

## 2. Analisar
Para cada referência, anote em `perfil/analises/RN.md`:
- **traço:** cor, espessura relativa (fino/médio/grosso), se tem contorno em tudo;
- **cor e sombra:** paleta (5 a 8 cores em hex), sombra (nenhuma, chapada, suave), textura;
- **personagens:** proporção da cabeça, olhos, mãos, nível de detalhe da roupa;
- **cenários:** quão cheios são, profundidade, perspectiva;
- **movimento e montagem:** troca de plano (segundos), câmera, transições, texto na tela, fontes.
Depois, a síntese: o que é comum às referências e o que a pessoa disse que gosta.

## 3. Gravar o perfil
- `estilo.js`: `contorno` (hex), `espessura` (4 a 10; 7 é traço grosso), `sombra`, `fonte` (Google Fonts parecida com a das referências), `paleta`.
- `identidade.md`: material, contorno, paleta (tabela), personagens, fontes, tom, o que nunca usar. Escreva "tendência, não regra".
- `estilo-animacao.md`: ritmo e troca de plano, curvas, câmera, personagem, ênfase, trocas de cena, clima e luz, infográficos, densidade por trecho, e o **§ Cenários e objetos**: sempre em SVG, o mais detalhado possível, no traço da referência.

## 4. Cena de teste
Desenhe em SVG um cenário de teste que combine com o tema do vídeo (use `~/.animador/perfil/pecas/svg/cenarios.js` como base e acrescente o que a referência pede), **o mais detalhado possível** e seguindo o traço e as cores da referência, mais 2 objetos (ex.: um veículo e um objeto de cena) e um personagem genérico de `pessoas_svg_def.js` parado na frente.
- Capture com o Chrome headless (`chrome --headless=new --screenshot=... --window-size=1920,1080 file:///...`) e confira olhando: está no nível da referência? Faltam detalhes (placas, janelas, plantas, sombras, objetos)? Corrija antes de mostrar.
- Mostre ao lado de uma referência. A pessoa aprova ou pede ajuste (traço, cor, quantidade de detalhe). Ajuste e mostre de novo.
- Cenários e objetos aprovados entram em `cenarios.js` e `objetos.js` para os próximos vídeos.

## Aprovação
Marque `concluido`. Sugira `/clear` e `/animador`.

## Regras comuns
Antes de começar, leia `../animador/regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca copiar personagens, logos ou telas das referências: elas mostram o estilo, o desenho é próprio.
- Nunca mover, renomear ou apagar arquivos do projeto.
