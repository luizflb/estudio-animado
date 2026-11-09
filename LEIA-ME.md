# Estúdio Animado para o Claude Code

Faça vídeos **todo animados** com o Claude Code: personagem próprio que anda, fala em sincronia com a narração e gesticula, cenários e objetos desenhados em SVG com muito detalhe no estilo que você escolher, narração, efeitos sonoros, música e legendas.

Dois jeitos de começar:
- **Vídeo novo:** mande a história completa ou só o tema e o estilo do conteúdo. O Claude pesquisa o que está funcionando no tema (grátis, pelo YouTube) e escreve o roteiro com um guia de histórias virais.
- **Copiar um vídeo:** mande o link. O Claude baixa, transcreve, lê a estrutura e reescreve no seu tom (sem traduzir frase a frase).

## O que você precisa
- **Claude Code** (app desktop, terminal ou extensão).
- **Python 3.10+**, **ffmpeg**, **Node.js 18+** e **Google Chrome** (ou Edge). O instalador confere e diz o que falta.
- Opcional: placa de vídeo NVIDIA, para a transcrição mais precisa (WhisperX). Sem ela, usa o faster-whisper.
- Opcional: conta no ElevenLabs, se quiser narrar com a sua voz clonada. Sem ela, a narração é grátis (vozes neurais da Microsoft).

## Instalação

### Opção A: como plugin (pelo próprio Claude Code)
1. No Claude Code, digite:
   ```
   /plugin marketplace add luizflb/estudio-animado
   /plugin install estudio-animado@estudio-animado
   ```
2. Abra o Claude Code numa pasta vazia com o nome do vídeo e digite `/animador`. Na primeira vez ele roda o instalador das ferramentas (com o seu "sim").

### Opção B: baixando a pasta
1. Baixe em https://github.com/luizflb/estudio-animado (botão **Code → Download ZIP**) e descompacte em qualquer lugar.
2. Rode o instalador:
   - **Windows:** clique com o botão direito em `instalar.ps1` → "Executar com o PowerShell"; ou, num terminal: `powershell -ExecutionPolicy Bypass -File instalar.ps1`
     (com placa NVIDIA: acrescente `-WhisperX`)
   - **Mac/Linux:** `bash instalar.sh` (com placa NVIDIA: `--whisperx`)
3. O instalador copia as ferramentas para `~/.animador`, as skills para `~/.claude/skills`, cria um Python próprio e instala as bibliotecas.
4. Abra o Claude Code **numa pasta vazia com o nome do vídeo** e digite **`/animador`**.
   No primeiro uso ele pergunta se pode baixar os sons (Mixkit) e as músicas (Kevin MacLeod), que são grátis.

**Como plugin:** se você colocar esta pasta num repositório (GitHub), dá para instalar como plugin do Claude Code. Nesse caso, rode o instalador com `-SemSkills` (Windows) ou `--sem-skills` (Mac/Linux) só para as ferramentas; o próprio `/animador` oferece isso na primeira vez.

## Etapas
`/animador` mostra onde o vídeo está e abre a etapa certa:

| Etapa | O que faz |
|---|---|
| iniciar | vídeo novo (história ou tema + pesquisa de tendências) ou cópia (baixa, transcreve, lê) |
| estilo | **pede a referência do modelo de animação** e define traço, cores, fontes e ritmo (uma vez por canal) |
| personagem | **importa o seu personagem** ou cria a partir de uma **foto real ou de animação** (uma vez por canal) |
| roteiro | escreve para ser ouvido, dividido em cenas, com o guia viral |
| narração | grátis (edge-tts) ou ElevenLabs, com o tempo de cada palavra |
| mapa | planeja cada cena e gera a ficha do motor de cenas |
| assets | desenha em SVG os cenários, objetos e personagens que faltam, **sempre o mais detalhado possível** |
| animação | o motor transforma cada ficha em cena animada e renderiza |
| som | efeitos alinhados às animações e música por parte |
| legendas | **pergunta se você quer legendas** e exporta o vídeo final |

## Licenças
- Sons: Mixkit Sound Effects Free License (uso em vídeos, inclusive monetizados; não redistribuir o som sozinho). Por isso o pacote só traz a lista e o script de download.
- Músicas: Kevin MacLeod (incompetech.com), CC BY 4.0, **crédito obrigatório na descrição** (o Claude anota em `_CLAUDE/creditos.md`).
- Motor de animação: HyperFrames (baixado na hora pelo `npx`).
- Vídeos de outros canais servem só de fonte de pesquisa: o roteiro é reescrito e nada do original vai para o vídeo final.
