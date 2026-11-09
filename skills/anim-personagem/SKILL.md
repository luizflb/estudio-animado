---
name: anim-personagem
description: "Cria o personagem principal do canal em SVG animável (anda, fala, gesticula, muda de expressão), no estilo das referências: importando um personagem que a pessoa já tem, ou criando a partir de uma foto (real ou de animação). Também cria os secundários. Use em /anim-personagem, depois da anim-estilo, uma vez por canal (ou quando pedirem um personagem novo)."
---

# anim-personagem

O personagem principal é o fio dos vídeos. Ele sai daqui uma vez e é reaproveitado em todos.

- **Lê:** `~/.animador/perfil/` (`estilo.js`, `identidade.md`, `referencias/`), as imagens que a pessoa mandar.
- **Escreve:** `~/.animador/perfil/pecas/rig2/pessoas_svg_def.js` (`principal_svg` e secundários), `cabeca_<nome>.js`, `cabecas_lista.js`, `~/.animador/perfil/personagem/` (as imagens recebidas e a folha de aprovação).
- **Próximo passo:** `/anim-roteiro`

## Como o personagem é feito
- **Corpo:** desenhado pelo `pessoa_svg.js` (braços e pernas sem emenda nas juntas, roupas detalhadas), no traço do `estilo.js`.
- **Cabeça:** desenhada pelo `pessoa_svg.js` (estilos de cabelo, barba, óculos) **ou** vetorizada de uma imagem (`vetorizar_auto.py`), quando precisa ficar idêntica.
- **Rosto animável por cima:** olhos (abertos, semicerrados, fechados, piscadela), sobrancelhas e 8 bocas para a fala.
- **Animação:** a mesma para todos (rig2): gestos, andar, fala, expressões, piscar, respirar.

## 1. Perguntar o caminho
"Como você quer o personagem principal?"
1. **Importar um personagem que já tenho** (desenho, avatar, mascote): peça a imagem de frente, corpo inteiro se tiver, em boa resolução, de preferência com fundo liso ou transparente.
2. **Criar a partir de uma foto minha (ou de alguém que autorizou):** peça 1 a 3 fotos de frente, com o rosto bem visível.
3. **Criar a partir de uma imagem de animação** (um personagem desenhado que serve de base): peça a imagem.
4. **Descrever em palavras:** cabelo, pele, barba, óculos, roupa.
Guarde o que chegar em `~/.animador/perfil/personagem/`.

## 2a. Importar (caminhos 1 e 3): fica idêntico
1. Olhe a imagem com uma grade (desenhe linhas a cada 50 px com o PIL) e anote: centros dos olhos, posição da boca, sobrancelhas, altura do queixo.
2. Vetorize só a cabeça, apagando olhos, sobrancelhas e boca (o rig põe os animáveis por cima):
   `PY ~/.animador/scripts/vetorizar_auto.py <imagem> principal --olhos XE Y XD --cortar <y do queixo + um pouco> --apagar "XE,Y,RX,RY" "XD,Y,RX,RY" "XB,YB,RXB,RYB" --cores 6`
   - Óculos, cabelo, barba e orelhas ficam como na imagem.
   - Se sair borrado ou faltando uma cor, aumente `--cores`; se sair manchado, diminua.
3. Corpo: leia na imagem as cores da roupa, da calça e do sapato (amostre os pixels) e escolha os tipos (`camiseta`, `blusa`, `social`, `terno`, `jaleco`, `vestido`; `calca`, `saia`, `shorts`; `tenis`, `social`, `sapatilha`). Se a roupa da imagem tiver detalhe que o `pessoa_svg.js` não faz (estampa, jaqueta, capuz), desenhe esse tipo novo no `pessoa_svg.js`, no mesmo nível de detalhe.
4. Defina em `pessoas_svg_def.js`: `window.RIGS["principal_svg"] = { tipo:"svg", cabeca_vetor:"principal", pele:"<cor da pele da cabeça>", olhos_cor, roupa, calca, sapato }`.

## 2b. A partir de foto real (caminho 2): caricatura no estilo
Duas opções; recomende a A quando a pessoa tem Gemini ou ChatGPT, porque fica mais parecido:
- **A. Cartoon gerado + vetorizado:** escreva um prompt para a pessoa gerar no Gemini (ou ChatGPT), anexando a foto e 1 ou 2 referências de estilo: "Transforme a pessoa da foto num personagem de animação 2D no estilo das imagens de referência: [descrição do traço do estilo.js e identidade.md]. De frente, corpo inteiro, expressão neutra, boca fechada, fundo branco liso, sem texto." Quando a imagem voltar, siga o 2a.
- **B. Desenhado direto em SVG:** observe a foto e monte a definição: tom de pele, formato e cor do cabelo (escolha o estilo mais próximo ou **desenhe um estilo novo** no `pessoa_svg.js` quando nenhum servir), barba, óculos, cor dos olhos, roupa típica. Capriche no que identifica a pessoa (topete, franja, barba, óculos).

## 2c. Descrição em palavras (caminho 4)
Monte a definição direto e desenhe o que faltar no `pessoa_svg.js`.

## 3. Conferir e aprovar
- Abra `~/.animador/perfil/pecas/rig2/rig_teste_svg.html?nomes=principal_svg` e `...&g=1` (gestos) no Chrome headless e capture.
- Confira olhando, ao lado da imagem ou foto: cabelo e barba no lugar, olhos dentro dos óculos, cores certas, proporção, braços e pernas sem emenda, gesto natural. Corrija antes de mostrar.
- Mostre parado, num gesto e num close do rosto com expressão feliz. A pessoa aprova ou pede ajuste.
- **Cabelo e barba importados nunca são redesenhados à mão:** se precisar mudar, vetorize de novo.

## 4. Secundários
Os que o roteiro pedir vêm na `anim-assets`. Se a pessoa já quiser alguns recorrentes (família, amigo, chefe), faça aqui do mesmo jeito: definição em `pessoas_svg_def.js` (ou importados com `vetorizar_auto.py` e `cabeca_vetor`).

## Aprovação
Marque `concluido` (etapa `personagem`). Sugira `/clear` e `/animador`.

## Regras comuns
Antes de começar, leia `../animador/regras-comuns.md` (uma vez por sessão).

## Regras
- Foto de pessoa real: só da própria pessoa ou de quem autorizou; nunca para se passar por alguém.
- Nunca alterar as imagens recebidas: as versões trabalhadas são arquivos novos.
