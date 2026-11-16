---
name: anim-narracao
description: "Gera a narração do roteiro cena por cena, com o tempo de cada palavra (o relógio de toda a animação): grátis com as vozes neurais da Microsoft (edge-tts) ou com o ElevenLabs (inclusive voz clonada). Junta a narração completa com as pausas e entrega para ouvir. Use em /anim-narracao, depois do roteiro, inteiro ou por trecho."
---

# anim-narracao

O tempo de cada palavra que sai daqui comanda mapa, animação, som e legendas.

- **Lê:** bloco `roteiro`, `~/.animador/perfil/voz.md`, `~/.animador/.env` (só se for ElevenLabs).
- **Escreve:** `_CLAUDE/narracao/cNN_vNN.mp3` e `.json` (tempo por palavra), `narracao_completa_vNN.wav`/`.mp3`, o bloco `narracao`.
- **Próximo passo:** `/anim-mapa`

## Primeira vez no canal: escolher a voz
Pergunte: **"Narração grátis (vozes da Microsoft, muito boas em português) ou ElevenLabs (paga, permite clonar a sua voz)?"**
- **Grátis (edge-tts):** liste as vozes (`PY ~/.animador/scripts/narrar_edge.py --listar-vozes`), gere a c01 em 2 ou 3 vozes com `--cenas c01 --voz <voz>` e deixe a pessoa escolher. Grave `edge_voz` e `edge_velocidade` no `voz.md`.
- **ElevenLabs:** a pessoa cria a conta, escolhe ou clona a voz no site e cola a chave no `~/.animador/.env` (`ELEVENLABS_API_KEY=...`); confira só se a linha existe, sem ler o valor. Ache o `voice_id` pela API e grave no `voz.md`. Pesquise na hora o modelo com melhor português.
- Teste com uma cena que tenha números e nomes próprios e ajuste velocidade e entonação.

## Gerar
- Grátis: `PY ~/.animador/scripts/narrar_edge.py <pasta> [--cenas c01-c08]`.
- ElevenLabs: `PY ~/.animador/scripts/narrar.py <pasta> [--cenas ...] [--simular]` (mostre antes o custo em caracteres com `--simular`).
- Os dois só geram cena nova ou mudada e gravam versão nova.

## Conferir
- Duração de cada cena e do total contra a estimativa; palavras sem tempo; silêncio longo; corte no fim.
- ElevenLabs: o `next_text` às vezes vaza o começo da cena seguinte no fim do áudio; o `narrar.py` apara sozinho (`--aparar` corrige as já geradas).
- Nomes vão escritos como no roteiro; pronúncia só se corrige depois de ouvir um erro (vai para o `voz.md`).

## Juntar
`PY ~/.animador/scripts/narracao_juntar.py <pasta> [--pausa 0.3] [--pausa-parte 0.8]` → narração completa com as pausas e o tempo de cada cena; mande a prévia em MP3 para ouvir.

## Resumo no chat
Duração total, cenas geradas, voz usada (e créditos gastos, se ElevenLabs), avisos. Marque `aguardando_aprovacao`.

## Revisão
Por cena: "c05 mais animada", "c09 pronuncia errado". Gere só a citada, em versão nova. Troca de texto é revisão de roteiro.

## Aprovação
Marque `concluido`. Regerar uma cena depois desatualiza o que depende dela: avise. Sugira `/clear` e `/animador`.

## Regras comuns
Antes de começar, leia `../animador/regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca pedir, mostrar ou copiar a chave do ElevenLabs.
- Nunca mover, renomear ou apagar arquivos do projeto.
