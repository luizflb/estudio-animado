---
name: anim-roteiro
description: "Escreve o roteiro do vídeo animado, dividido em cenas que já pensam na animação. Modo NOVO: a partir da história enviada (adaptada para narração) ou criada do zero a partir do tema, com o guia de roteiro viral e a pesquisa grátis de tendências. Modo CÓPIA: reescreve o vídeo original no tom da pessoa, sem traduzir. Aprovação por partes. Use em /anim-roteiro."
---

# anim-roteiro

A etapa que mais decide se o vídeo prende. Escreve para ser **ouvido** e divide em cenas com uma imagem clara cada.

- **Lê:** briefing, `~/.animador/guias/roteiro_viral.md` (sempre), `_CLAUDE/roteiro/tendencias.md` (se houver), `~/.animador/perfil/identidade.md` (tom); no modo cópia, `_CLAUDE/original/leitura.md` e a transcrição por frase.
- **Escreve:** `_CLAUDE/roteiro/roteiro_vNN.md` e o bloco `roteiro` (`PY ~/.animador/scripts/roteiro_cenas.py <pasta> <roteiro_vNN.md> --gravar`).
- **Próximo passo:** `/anim-narracao`

## Ofício (todos os modos)
- Siga o `roteiro_viral.md`: gancho nos primeiros 3–5 s, laços abertos, uma mudança a cada 5–8 s, uma surpresa por minuto, especificidade (números, nomes, coisas do dia a dia do público), fechamento com virada ou reflexão.
- **Escrita para o ouvido:** frases curtas, ordem direta, uma ideia por frase. Números como se falam na narração; a forma visual (R$ 1 tri, 2024) vai no campo `Tela`.
- **Duração:** ~150 palavras por minuto. Mostre a estimativa contra a duração alvo.
- **Cada cena:** 1 a 4 frases e uma ideia visual só. Troca de cena quando muda o que se mostra.
- O personagem principal aparece na maior parte das cenas, fazendo algo (reage, aponta, anda, mexe num objeto).

## Modo NOVO com história enviada
- Preserve a história, os personagens e o que a pessoa escreveu de mais importante. Adapte só para funcionar narrado e animado: gancho na frente, frases faladas, cenas com imagem.
- Mostre antes o que mudou e por quê (gancho novo, cortes, ordem). Nada de inventar fatos ou mudar o final sem perguntar.

## Modo NOVO só com o tema
1. Releia a pesquisa de tendências e o ângulo escolhido.
2. Proponha numa mensagem: título (2 opções), gancho (2 opções), estrutura escolhida no guia (escada, círculo da história, antes e depois, perguntas em camadas) com as partes e a duração de cada, e o personagem principal no papel de quê. Espere o "sim".
3. Escreva a história inteira.

## Modo CÓPIA
- **Reescrever, não traduzir:** manter os fatos e a estrutura que funciona; frases, exemplos e comparações novos, adaptados ao público da pessoa (moeda, cidades, situações daqui); piadas adaptadas ou trocadas.
- Número ou fato que pode ter mudado ganha `[conferir]` (pesquise ou deixe a marca).
- Corte a enrolação do original. O gancho pode ser melhor que o dele.

## Formato de cada cena
```
c07 · ~0:42 · parte 2 "O preço da fama"
Narração: <texto exatamente como vai ser falado>
Tela: <número, palavra ou nome escrito, se houver>
Ideia visual: <o personagem faz X em Y; objeto ou infográfico Z>
Fonte: <original 3:10–3:35 | história enviada | criado>
```

## Passo a passo
1. Status. 2. Proposta (ângulo, gancho, partes) e "sim". 3. Escrever e gravar; mostrar por partes, começando pelo gancho. 4. Antes de mostrar, releia em voz alta de cabeça e passe a conferência do guia (seção 7). 5. Gravar o bloco `roteiro` e `_CLAUDE/roteiro/grafia.json` (forma escrita dos nomes, para as legendas).

## Resumo no chat
Duração estimada, número de cenas, marcas `[conferir]`. Marque `aguardando_aprovacao`.

## Revisão
Por cena: "c07 mais curta", "troca o gancho pela opção 2". Ajuste só o citado, versão nova, ids mantidos (cena nova: `c07b`).

## Aprovação
Marque `concluido`. Mudar o texto de uma cena depois exige refazer a narração dela. Sugira `/clear` e `/animador`.

## Regras comuns
Antes de começar, leia `../animador/regras-comuns.md` (uma vez por sessão).

## Regras
- Modo cópia: nunca copiar frases do original traduzidas ao pé da letra em sequência.
- Nunca mover, renomear ou apagar arquivos do projeto.
