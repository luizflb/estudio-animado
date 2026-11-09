---
name: anim-animacao
description: "Constrói e renderiza as cenas animadas pelo motor de cenas (ficha JSON → cena HyperFrames): personagem em SVG que anda, fala em sincronia com a narração, gesticula e reage, em cenários detalhados, com objetos, textos, efeitos e câmera. Confere sem pisca e entrega a prévia MP4 com a voz. Use em /anim-animacao, depois dos assets, inteiro ou por trecho."
---

# anim-animacao

- **Lê:** as fichas `_CLAUDE/mapa/fichas/cNN.json`, a narração, `~/.animador/perfil/` (`pecas/MOTOR.md`, `estilo-animacao.md`).
- **Escreve:** `_CLAUDE/animacao/cNN/` (projeto de cada cena), `_CLAUDE/animacao/renders/cNN_vNN.mp4`, eventos para o som, o bloco `animacao`, a prévia do trecho.
- **Próximo passo:** `/anim-sfx`

Antes da primeira cena da sessão, leia a skill `hyperframes` (contrato de render) e o `pecas/MOTOR.md`.

## Por cena (caminho padrão: o motor)
1. **Gerar:** `PY ~/.animador/scripts/motor_cena.py _CLAUDE/mapa/fichas/cNN.json _CLAUDE/animacao/cNN`.
2. **Olhar antes do render:** `npx --yes hyperframes@<versão> snapshot --at <tempos dos momentos>` dentro da pasta da cena; leia a folha de contato. Confira: personagem no chão e em proporção, boca mexendo, gesto apontando para algo, objetos em escala, texto legível, nada cortado.
3. **Renderizar:** `PY ~/.animador/scripts/motor_cena.py <ficha> _CLAUDE/animacao/cNN --render --previa` (versão nova, confere pisca e junta a voz). Uma cena por vez.
4. **Eventos para o som:** escreva `_CLAUDE/animacao/cNN/eventos_cNN.json` (`{"cena", "eventos": [{"t", "tipo", "forca", "desc"}]}`) com entradas, gestos, impactos, objetos, troca de câmera.
5. Registre no estado: `animacao.cenas.cNN` com `render`, `frames`, `versao`, `status`.

Cena `"manual": true`: construa à mão em HyperFrames, com `seek_fix.js` (estado do tempo 0 em `tl.set(…, 0)`; o que muda por código como função do tempo) e os mesmos personagens e desenhos SVG.

## Faltou algo na hora?
- Gesto, pose ou expressão nova: acrescente ao rig2 (ângulos) ou ao `pessoa_svg.js` e teste na página de teste.
- Cenário ou objeto: desenhe em SVG no nível do `estilo-animacao.md` (o mais detalhado possível, no traço da referência) antes de usar.

## Cuidados (do MOTOR.md)
Gesto só depois do fim do `andar`; braço muito vertical some atrás da cabeça; objeto que anda para a esquerda é espelhado sozinho; o "flash" do `pisca.py` em cena que começa andando é falso (confira a diferença quadro a quadro).

## Entrega do trecho
Prévia sem editor: renders + narração juntados pelo FFmpeg, em 1080p e leve (720p, menos de 30 MB, para ver no celular). Mande as duas.

## Resumo no chat
Cenas feitas, o que não saiu como no mapa, faltas, prévias. Marque `aguardando_aprovacao`.

## Revisão
Por número ("c07 personagem mais expressivo", "c07m2 entra antes"): ajuste a ficha e gere versão nova. Feedback geral ("sem vida") pede refazer a cena, não retocar.

## Aprovação
Marque `concluido`. Sugira `/clear` e `/animador`.

## Regras comuns
Antes de começar, leia `../animador/regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca sobrescrever um render entregue. Nunca mover, renomear ou apagar arquivos do projeto.
- Cabelo e barba de personagem importado nunca são redesenhados à mão.
