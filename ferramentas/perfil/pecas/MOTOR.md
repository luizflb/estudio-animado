# Motor de cenas

Ficha JSON por cena → `python ~/.animador/scripts/motor_cena.py <ficha.json> <pasta_da_cena> [--render] [--previa]` → projeto HyperFrames, render versionado (`renders/<id>_vNN.mp4`), conferência de pisca e prévia com a voz.

## Peças
- `pecas/rig2/rig2.js`: rig hierárquico (osso dentro do osso, giro na junta). API: `pose`, `mao`, `olhos`, `sobrancelhas`, `boca`, `expressao`, `piscar`, `respirar`, `falar`, `andar`, `parar`, `gesto`.
- `pecas/rig2/pessoa_svg.js`: desenha o personagem em SVG (braços e pernas em duas passadas: contorno embaixo, cor por cima, juntas sem emenda). `pessoas_svg_def.js`: as definições (o principal entra como `principal_svg`).
- `pecas/rig2/cabeca_<nome>.js`: cabeças vetorizadas de uma imagem (`rec_vetorizar_cabeca.py`), para um personagem ficar idêntico à referência.
- `pecas/svg/cenarios.js` e `objetos.js`: cenários em 3 camadas (fundo, meio, frente) e objetos detalhados.
- `estilo.js`: traço, espessura, fonte e paleta da pessoa (todos os desenhos leem daqui).
- `pecas/rig/seek_fix.js`: sem flash nem pisca no render.
- `biblioteca/`: imagens geradas (animais, efeitos quadro a quadro, comida), cortadas por `rec_folha_pecas.py`.

## Ficha (exemplo)
```json
{
 "id": "c01", "duracao": 5.9,
 "audio": "<projeto>/_CLAUDE/narracao/c01_v01.mp3", "palavras": "<projeto>/_CLAUDE/narracao/c01_v01.json",
 "cenario": {"tipo": "ruaComercio"},
 "camera": [{"t": 0, "zoom": 1, "x": 960, "y": 540}, {"t": "palavra:4", "zoom": 1.3, "x": 900, "y": 600, "ease": "back.out(1.2)"}],
 "atores": [{"id": "eu", "rig": "principal", "x": 240, "pes": 800, "escala": 0.33, "fala": true,
             "acoes": [{"t": 0, "piscar": true}, {"t": 0, "andar_ate": 860, "dur": 0.7},
                       {"t": "palavra:2", "gesto": "acenar", "lado": "d", "dur": 0.8}, {"t": "palavra:4", "expressao": "surpreso"}]}],
 "objetos": [{"tipo": "carroHatch", "cor": "#e2544f", "camada": "frente", "x": -1000, "pes": 1045, "escala": 0.9,
              "mover": {"t": 2.6, "ate_x": 2300, "dur": 2.3, "rodas": true}}],
 "textos": [{"t": "palavra:4", "texto": "R$ 1 TRILHÃO", "x": 960, "y": 170, "tam": 120, "ate": 5.6}],
 "efeitos": [{"t": "palavra:4", "tipo": "dinheiro_voando", "x": 1260, "y": 380, "escala": 0.45, "fps": 12, "repetir": 4}]
}
```
- Tempos em segundos ou `"palavra:N"` (início da N-ésima palavra da narração da cena).
- `rig`: `principal` (o personagem principal), ou um nome de `pessoas_svg_def.js`.
- Gestos: acenar, apontar, joinha, mao_aberta, celular, pensar, comemorar, susto (+ `lado` e|d, lado da tela, e `dur`). Expressões: neutro, feliz, surpreso, bravo, preocupado, desconfiado.
- `fala: true` mexe a boca pela narração. `objetos`: função de `Objetos`; objeto que anda para a esquerda é espelhado sozinho.

## Cuidados aprendidos
- **Proporção:** objeto em escala com o personagem. Carro: escala ≈ 2,7 × a escala do ator. Na dúvida, maior.
- Gesto não pode começar antes do fim do `andar` do mesmo personagem.
- Braço quase na vertical some atrás da cabeça grande: gestos para cima abrem para os lados.
- Rodas SVG giram com `svgOrigin`; objeto SVG animado fica num `<g>` externo.
- Vários nomes de mão apontam para o mesmo desenho: o rig acende pelo desenho, não pelo nome.
- O "flash 0-3" do `pisca.py` dispara quando a cena começa em movimento: confira a diferença quadro a quadro (uniforme = movimento).
- Cortador de folhas: área branca fechada NÃO é fundo por padrão (`--buracos` só para mãos e alças), senão camisa branca, prato e fumaça somem.
