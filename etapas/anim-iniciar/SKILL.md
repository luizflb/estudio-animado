---
name: anim-iniciar
description: "Abre um vídeo animado do Estúdio Animado: no modo NOVO organiza a história ou o tema, o estilo de conteúdo, o público e a duração; no modo CÓPIA baixa o vídeo do link, transcreve, tira os quadros-chave e lê a estrutura. Cria o estado e o briefing. Use em /anim-iniciar, chamada pelo /animador."
---

# anim-iniciar

Abre o projeto. Ainda não escreve roteiro.

- **Escreve:** `_CLAUDE/projeto.json` (`PY ~/.animador/scripts/estado.py <pasta> init --fluxo animador`), `_CLAUDE/briefing.md`, `_CLAUDE/aprendizados.md` (vazio), `_CLAUDE/creditos.md`; no modo cópia, `_CLAUDE/original/`.
- **Próximo passo:** `/anim-estilo` (ou `/anim-roteiro`, se estilo e personagem já existem no canal)

## 1. Conferir a pasta
Vazia ou deste vídeo. Se o estado já existe, mostre o status em vez de recomeçar. Grave no estado: `modo` (`novo` ou `copia`), formato (`horizontal` ou `vertical`, pergunte se não souber) e duração alvo.

## 2a. Modo NOVO
- **História completa:** guarde o texto como veio em `_CLAUDE/briefing.md` ("História enviada"), sem mexer. Resuma em 5 linhas: personagens, lugar, começo, virada, fim. Pergunte só o que faltar (tom, público, duração, formato).
- **Só o tema:** registre tema, estilo do conteúdo, público e duração. Rode a pesquisa grátis de tendências e leia:
  `PY ~/.animador/scripts/tendencias.py "<tema>" --saida _CLAUDE/roteiro/tendencias.md` (`--curtos` para Shorts/Reels).
  Mostre 3 ângulos possíveis (um por linha, com o gancho em uma frase) e deixe a pessoa escolher ou misturar. A história completa é escrita na `anim-roteiro`.

## 2b. Modo CÓPIA
Baixe só o vídeo pedido, para uso como fonte de pesquisa (peça o "sim" antes do primeiro download).
1. **Baixar** em 720p, com metadados, capítulos e legendas, em `_CLAUDE/original/`:
   - `PY -m yt_dlp --no-playlist --skip-download --write-subs --write-auto-subs --sub-langs "en.*,pt.*" --sub-format vtt -o "_CLAUDE/original/original.%(ext)s" <link>` (se der erro 429, peça um idioma por vez);
   - `PY -m yt_dlp --no-playlist -f "bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720]" --merge-output-format mp4 --write-info-json --write-description -o "_CLAUDE/original/original.%(ext)s" <link>`. Se o yt-dlp avisar de JavaScript, acrescente `--js-runtimes node`.
   - Título, canal, duração e capítulos saem do `original.info.json`. Anote no bloco `original` e em `creditos.md`.
2. **Transcrever** (escolhe sozinho: WhisperX se o PC tem placa NVIDIA, senão faster-whisper):
   `PY ~/.animador/scripts/transcrever_auto.py _CLAUDE/original/original.mp4 --saida _CLAUDE/original/transcricao.json --idioma <idioma do vídeo>`
   e as frases: `PY ~/.animador/scripts/frases.py _CLAUDE/original/transcricao.json _CLAUDE/original/transcricao_16k.wav --pasta _CLAUDE/original`.
   Números vêm da transcrição (a legenda automática corta). O Whisper às vezes inventa "Thank you" na música final.
3. **Quadros-chave:** `PY ~/.animador/scripts/quadros.py _CLAUDE/original/original.mp4 --pasta _CLAUDE/original`. Leia as folhas de contato, não os quadros soltos.
4. **Ler o original** sem escrever o roteiro. Anote em `_CLAUDE/original/leitura.md`: estrutura com tempos (gancho, partes, viradas, fechamento), fatos e números, o que é visual e não está na fala, o que não faz sentido para o público da pessoa.
5. Mostre a estrutura em 5 a 8 linhas e pergunte numa mensagem só: ângulo, público, o que cortar ou acrescentar, duração alvo.

## 3. Briefing
`_CLAUDE/briefing.md`: sobre o vídeo, direcionamentos (nas palavras da pessoa, sem inventar), observações por etapa. Marque `iniciar` como `concluido`. Diga o que vem: estilo e personagem (se ainda não existem no canal), depois o roteiro. Sugira `/clear` e `/animador`.

## Regras comuns
Antes de começar, leia `../animador/regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca mover, renomear ou apagar arquivos do projeto.
- No modo cópia, baixar só o vídeo pedido.
