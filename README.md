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

## Como instalar
Abra o Claude Code e cole:

```
Instala esta skill para mim, clonando em ~/.claude/skills/animador: https://github.com/luizflb/estudio-animado
```

Ou, pelo terminal:

```bash
git clone https://github.com/luizflb/estudio-animado ~/.claude/skills/animador
```

Depois, abra o Claude Code **numa pasta vazia com o nome do vídeo** e digite **`/animador`**. Na primeira vez ele roda o instalador (com o seu "sim"): copia as skills de cada etapa para `~/.claude/skills`, as ferramentas para `~/.animador`, cria um Python próprio, instala as bibliotecas e confere ffmpeg, Node e Chrome. Com placa NVIDIA, ele oferece o WhisperX. Em seguida pergunta se pode baixar os sons (Mixkit) e as músicas (Kevin MacLeod), que são grátis.

Se preferir rodar o instalador você mesmo, na pasta clonada:
- **Windows:** `powershell -ExecutionPolicy Bypass -File instalar.ps1` (com placa NVIDIA: `-WhisperX`)
- **Mac/Linux:** `bash instalar.sh` (com placa NVIDIA: `--whisperx`)

**Atualizar:** `git pull` dentro de `~/.claude/skills/animador` e rode o instalador de novo. O seu perfil (estilo, voz e personagens) nunca é sobrescrito.

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

## Novidades da versão 1.1
- **Shorts e Reels verticais (1080x1920):** motor próprio (`motor_shorts.py`) e cenários redesenhados para o formato em pé (`cenarios_vertical.js`), não recortados do horizontal. Narração mais rápida e planos curtos.
- **Legenda dinâmica:** a palavra falada acende numa cor e cresce com um zoom suave, cada palavra no seu lugar (sem a linha "andar"), centralizada e dentro da área segura do Reels/Shorts.
- **Luz e noite:** luz que vem das janelas e lâmpadas do próprio cenário; cenas noturnas com luar branco e janelas acesas.
- **Música por clima:** a trilha muda com o clima da fala, só nas viradas da história, com fade cruzado.
- **Exportação:** junta as cenas em ordem e corta o áudio cena a cena (sem escorregar no fim); versão leve vertical para Shorts.
- Formato de skill, como o [fluxo de edição](https://github.com/luizflb/fluxo-de-edicao): instala colando o link no Claude Code.

## Licenças
- Sons: Mixkit Sound Effects Free License (uso em vídeos, inclusive monetizados; não redistribuir o som sozinho). Por isso o pacote só traz a lista e o script de download.
- Músicas: Kevin MacLeod (incompetech.com), CC BY 4.0, **crédito obrigatório na descrição** (o Claude anota em `_CLAUDE/creditos.md`).
- Motor de animação: HyperFrames (baixado na hora pelo `npx`).
- Vídeos de outros canais servem só de fonte de pesquisa: o roteiro é reescrito e nada do original vai para o vídeo final.
