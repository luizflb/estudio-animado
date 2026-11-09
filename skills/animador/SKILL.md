---
name: animador
description: "Ponto de entrada do Estúdio Animado: faz vídeos todo animados em SVG, com personagem que fala e anda, cenários detalhados, narração, som e legendas. A pessoa escolhe entre um vídeo NOVO (história completa ou só o tema) ou COPIAR um vídeo de outro canal pelo link. Mostra onde o vídeo está e abre a etapa certa. Use em /animador, ao começar ou retomar um vídeo animado, depois de um /clear, ou quando perguntarem em que pé está."
---

# animador

Fluxo: anim-iniciar → anim-estilo → anim-personagem → anim-roteiro → anim-narracao → anim-mapa → anim-assets → anim-animacao → anim-sfx → anim-legendas

Antes de tudo, leia `regras-comuns.md` (nesta pasta), uma vez por sessão.

## 0. Instalação (primeira vez no computador)
Se `~/.animador/scripts/estado.py` não existe, as ferramentas ainda não foram instaladas.
1. Ache a pasta do pacote: é a pasta-mãe de `skills/` (a "Base directory" desta skill, duas pastas acima). Nela estão `instalar.ps1` (Windows) e `instalar.sh` (Mac/Linux).
2. Explique em 3 linhas o que o instalador faz (copia as ferramentas para `~/.animador`, cria um Python próprio, instala as bibliotecas e confere ffmpeg, Node e Chrome) e peça o "sim".
3. Rode o instalador e mostre o resultado. Se esta skill veio de um plugin (a "Base directory" está dentro de `~/.claude/plugins/`), use `-SemSkills` (Windows) ou `--sem-skills` (Mac/Linux): o plugin já traz as skills. Com placa NVIDIA, ofereça `-WhisperX` / `--whisperx`. Se faltar ffmpeg, Node ou Chrome, diga como instalar e espere.
4. Pergunte se pode baixar os sons (Mixkit, grátis) e as músicas (Kevin MacLeod, grátis com crédito): `PY ~/.animador/scripts/baixar_sons.py` e `baixar_musicas.py`.

## 1. Começo: novo ou cópia
Se não existe `_CLAUDE/projeto.json` na pasta atual:
- Se a pasta já tem outro projeto, peça para abrir o Claude Code numa pasta vazia, com o nome do vídeo.
- Pergunte (com botões, se der): **"Vamos fazer um vídeo novo ou copiar um vídeo que você já viu?"**
  - **Vídeo novo** → pergunte: "Você já tem a história completa ou quer que eu crie a partir de um tema?"
    - **História completa:** peça para colar o texto ou o prompt inteiro (pode ser um arquivo).
    - **Só o tema:** peça o tema principal e o estilo do conteúdo (ex.: "POV engraçado", "curiosidade com suspense", "história emocionante", "infantil"), o público e a duração alvo (Short de 30–60 s, médio de 3–6 min, longo de 8–15 min).
  - **Copiar um vídeo** → peça o link (YouTube ou outro site que o yt-dlp abre) e o que mudar (ângulo, público, duração).
- Depois, abra a `anim-iniciar` com o modo e as respostas.

## 2. Status
Se o projeto existe: rode `PY ~/.animador/scripts/estado.py <pasta> status` e mostre, curto:
- o modo (novo ou cópia) e o título;
- as etapas e o que já foi feito por trecho;
- pendências, alertas e quantos aprendizados estão anotados.

## 3. Próximo passo
Diga qual é e pergunte se segue. Com o "sim", abra a skill da etapa.
- Etapa aguardando revisão: continuar nela, nunca pular.
- Alerta de algo desatualizado: mostrar primeiro e esperar a decisão.
- Etapa `aguardando_pessoa`: lembrar o que falta.
- `estilo` e `personagem` já feitos no canal (existem em `~/.animador/perfil/`): marcar `nao_precisa`, mostrar numa linha o que vai ser usado e perguntar se quer trocar.

## 4. Uma etapa por vez
Não encadear etapas sozinho e não dar `/clear` (isso é sempre da pessoa). Sugira o modelo de cada etapa numa linha:

| Etapa | Modelo |
|---|---|
| animador, iniciar, assets, legendas | o mais leve que funcione bem |
| narracao, sfx | intermediário |
| estilo, personagem, roteiro, mapa, animacao | o mais capaz |

## /animador aprendizados
Leia as linhas `- [ ]` do caderno, proponha onde cada uma entra (gosto → `~/.animador/perfil/`; ofício → a skill da etapa; geral → `regras-comuns.md`), a pessoa filtra, grave só o aprovado e marque cada linha.

## Regras
- Não editar vídeo nem rodar scripts de etapa aqui: isso é das skills de cada etapa (salvo o instalador e os downloads, com o "sim").
- Nunca mover, renomear ou apagar arquivos do projeto.
