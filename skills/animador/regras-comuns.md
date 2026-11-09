# Regras comuns das skills anim-*

Lidas uma vez por sessão por todas as skills do Estúdio Animado. Mudou uma regra geral? Mude aqui.

O Estúdio Animado faz vídeos todo animados, em português, de dois jeitos: **um vídeo novo** (a partir de uma história completa ou só de um tema) ou **a cópia de um vídeo** de outro canal (a partir do link, reescrito e não traduzido).

## Onde fica cada coisa
- **Ferramentas:** `~/.animador/` (instaladas pelo `instalar.ps1` / `instalar.sh` do pacote).
  - `scripts/`: os scripts de cada etapa.
  - Python do pacote (`PY` nas skills): `~/.animador/venv/Scripts/python.exe` no Windows, `~/.animador/venv/bin/python` no Mac/Linux. Rode os scripts sempre por ele.
  - `perfil/`: o estilo da pessoa e do canal.
    - `estilo.js`: traço, espessura, fonte e paleta (todos os desenhos leem daqui);
    - `identidade.md`: tom, cores, fontes, público;
    - `estilo-animacao.md`: como as cenas se movem (a partir das referências);
    - `referencias/`: as imagens e vídeos de referência que a pessoa mandou;
    - `voz.md`: voz da narração (edge-tts grátis ou ElevenLabs);
    - `pecas/`: rig (`rig2/`), personagens em SVG (`pessoa_svg.js`, `pessoas_svg_def.js`, `cabeca_*.js`), cenários e objetos (`svg/`), `MOTOR.md`;
    - `biblioteca/`: imagens geradas (animais, efeitos quadro a quadro, comida).
  - `sons/` e `musicas/`: baixados pela própria pessoa (`baixar_sons.py`, `baixar_musicas.py`), com as licenças.
  - `guias/roteiro_viral.md`: o guia de roteiro.
  - `.env`: chaves (ex.: `ELEVENLABS_API_KEY`). **Nunca** pedir, mostrar, copiar nem escrever uma chave fora desse arquivo.
- **Projeto do vídeo:** a pasta onde o Claude Code foi aberto. Tudo o que o Claude gera fica em `_CLAUDE/`.

## 1. Conversa e segurança
- Falar com a pessoa no idioma dela (padrão: português), de forma curta e sem jargão.
- Nunca mover, renomear ou apagar arquivos do projeto. Versão nova (`_v01`, `_v02`) em vez de sobrescrever o que já foi entregue.
- Não encadear etapas. A pessoa aprova uma e diz "sim" para a próxima.
- Instalar programa, baixar arquivo ou gastar crédito de serviço pago: só com o "sim" da pessoa.

## 2. Direitos
- Vídeo de outro canal é **fonte de pesquisa**: o roteiro é reescrito, nunca traduzido frase a frase. Nada de imagem, trecho, música ou arte do original no vídeo final. Crédito ao canal original em `_CLAUDE/creditos.md`.
- Tudo o que aparece é desenhado aqui (SVG) ou vem de fonte com licença clara (sons da Mixkit, músicas de Kevin MacLeod com crédito, imagens geradas pela pessoa).
- Personagem a partir de foto de pessoa real: só da própria pessoa ou de quem autorizou. Nunca imitar alguém famoso de forma enganosa.

## 3. Padrões técnicos
- Projeto e render: 1920x1080 (horizontal) ou 1080x1920 (vertical), **30 fps**. Toda conversão de tempo para frames passa pelo `tempo30.py`.
- O **tempo mestre é a narração**: cenas, animações, sons e legendas se alinham pelo tempo de cada palavra.
- Cada cena (`c01`, `c02`...) tem o próprio áudio e o próprio render.

## 4. Estado do vídeo
`_CLAUDE/projeto.json`, lido e mudado sempre pelo `estado.py` (`PY ~/.animador/scripts/estado.py <pasta> ...`), com `"fluxo": "animador"`. Etapas: `iniciar, estilo, personagem, roteiro, narracao, mapa, assets, animacao, sfx, legendas`.
- `status`, `<bloco>`, `--item <id>`, `--set <caminho> <valor>`, `--etapa <etapa>=<status>`, `--pendencia`, `--resolver`.
- Status: `pendente`, `em_andamento`, `aguardando_aprovacao`, `aguardando_pessoa`, `concluido`, `nao_precisa`.
- `estilo` e `personagem` valem para o canal inteiro: no segundo vídeo em diante, se já existem em `~/.animador/perfil/`, a etapa vira `nao_precisa` (a pessoa pode pedir para refazer).

## 5. Qualidade visual (vale para todas as etapas)
- **SVG sempre o mais detalhado possível**, no traço e no estilo da referência da pessoa: cenários cheios (placas com texto, janelas, plantas, objetos de rua, sombras simples), objetos com várias partes (reflexos, maçanetas, rodas que giram), personagens com roupa detalhada. Nunca formas simples ou "quadrados".
- **Proporção:** objeto na escala do personagem (carro ≈ 2,7× a escala do ator).
- **Conferir olhando:** todo desenho novo é capturado (Chrome headless `--screenshot`) e conferido pelo Claude antes de ir para a pessoa.
- **Render sem pisca:** `seek_fix.js` em toda cena; `pisca.py` depois de cada render.

## 6. Caderno de aprendizados (`_CLAUDE/aprendizados.md`)
Anotar na hora toda correção, elogio ou preferência que vale para outros vídeos: `- [ ] <etapa> · <o que foi pedido, com contexto> · <dd/mm>`. Só deste vídeo: `- [-] …`. Aplicado: `- [x] … → <onde entrou>`. Nunca apagar linhas. As skills só mudam quando a pessoa pedir (`/animador aprendizados`).

## 7. Trechos e fechamento
- Roteiro e mapa olham o vídeo inteiro e podem ser aprovados por partes. Narração, animação, som e legendas podem ir por trecho ("c01 a c08", "o gancho").
- Fechar uma etapa: marcar `concluido`, dizer quantos aprendizados ficaram anotados e sugerir `/clear` e `/animador`.
- Pedido ainda não aplicado é anotado como pendência na hora; nunca sugerir `/clear` com revisão pendente.
