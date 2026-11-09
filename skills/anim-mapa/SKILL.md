---
name: anim-mapa
description: "Planeja cada cena do vídeo animado sem animar nada: o que o personagem faz, cenário, objetos, textos, efeitos, câmera e transições, amarrados às palavras da narração. Aprovado, cada cena vira a ficha do motor de cenas. Lista o que falta desenhar em SVG. Use em /anim-mapa, depois da narração."
---

# anim-mapa

- **Lê:** bloco `roteiro` (ideias visuais), tempo por palavra da `narracao`, briefing, `~/.animador/perfil/` (`identidade.md`, `estilo-animacao.md`, `pecas/MOTOR.md`), o que já existe em `pecas/svg/` (cenários e objetos), `pessoas_svg_def.js` (personagens) e `biblioteca/`.
- **Escreve:** `_CLAUDE/mapa/mapa_vNN.md`, o bloco `mapa`, as fichas `_CLAUDE/mapa/fichas/cNN.json` e as listas do que falta (personagens, cenários e objetos SVG, imagens a gerar).
- **Próximo passo:** `/anim-assets`

## Ofício
- **A fala decide a imagem.** Cada momento importante da cena é ligado a uma palavra da narração (`"palavra:N"`).
- **O personagem principal é o fio:** aparece na maior parte das cenas, reagindo, apontando para algo na tela, andando, mexendo em objetos. Cena sem ele serve de respiro ou para dado complexo.
- **Variedade:** não repetir o mesmo plano em cenas seguidas. Alterne plano geral, meio corpo, close, objeto em destaque, infográfico.
- **Cenários cheios e detalhados**, no traço da referência: o lugar tem vida (placas, janelas, plantas, objetos, gente ao fundo).
- **Uma ideia por vez na tela.** Texto só para número, nome ou palavra-chave.
- **Câmera:** aproximação lenta nas explicações, zoom rápido na virada; pouca, a serviço da fala.
- **Gancho primeiro e com mais detalhe**, com storyboard quadro a quadro dos primeiros segundos.
- **Proporção:** objetos na escala do personagem (carro ≈ 2,7× a escala do ator).

## Formato de cada cena (no mapa, para a pessoa ler)
```
c07 · 0:42–0:51 · personagem + objeto
Cenário: <existente ou NOVO: descrição detalhada>
Personagem: <ação> → <ação>, expressão, lado, enquadramento, fala sim/não
Momentos: c07m1 "inflação" (palavra 4) — gráfico sobe; c07m2 "dobrou" (palavra 9) — número bate na tela, personagem leva susto
Secundários: <nenhum | quem, como entra>
Câmera: <aproximação 1.0→1.15>
Transição para c08: <corte | chicote | ...>
Faltas: <cenário/objeto/personagem a desenhar>
```
Gestos disponíveis: acenar, apontar, joinha, mao_aberta, celular, pensar, comemorar, susto. Expressões: neutro, feliz, surpreso, bravo, preocupado, desconfiado. O que faltar entra na lista de faltas (gesto novo é acrescentado ao rig na animação).

## Ficha do motor (para cada cena aprovada)
`_CLAUDE/mapa/fichas/cNN.json`, no formato do `pecas/MOTOR.md`: `audio` e `palavras` da narração da cena, `duracao` (duração da cena + pausa), `cenario`, `camera`, `atores` (o principal é `"rig": "principal"`), `objetos`, `textos`, `efeitos`. Cena que o motor não faz (gráfico animado especial, efeito único): `"manual": true` com a descrição.

## Passo a passo
1. Status. 2. Confirmar numa linha o estilo e a proporção personagem/infográfico. 3. Planejar gancho, partes e fechamento; antes de mostrar, releia: cada cena nasce da fala? estou repetindo a fórmula? o personagem reage em cada virada? 4. Listar as faltas. 5. Mostrar por partes, começando pelo gancho. 6. Gravar as fichas das partes aprovadas.

## Revisão e aprovação
Por número ("c07 sem o susto", "c12 só infográfico"). Aprovado: `concluido`, sugira `/clear` e `/animador`.

## Regras comuns
Antes de começar, leia `../animador/regras-comuns.md` (uma vez por sessão).
