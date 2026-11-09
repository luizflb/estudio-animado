# Voz da narração

Escolhida na etapa /anim-narracao. Duas opções:

## Grátis: edge-tts (vozes neurais da Microsoft)
- edge_voz: pt-BR-AntonioNeural
- edge_velocidade: +0%
Outras vozes: `python ~/.animador/scripts/narrar_edge.py --listar-vozes` (ex.: pt-BR-FranciscaNeural, pt-BR-ThalitaNeural).

## Paga: ElevenLabs (inclusive voz clonada)
- voice_id: (preencher)
- modelo: eleven_multilingual_v2
- estabilidade: 0.5
- similaridade: 0.75
- estilo: 0.0
- velocidade: 1.0
A chave fica em `~/.animador/.env` como `ELEVENLABS_API_KEY=...`, escrita pela própria pessoa. Nunca pedir, mostrar nem copiar a chave.

## Pronúncias
(só depois de ouvir um erro; formato: `- palavra → como falar`)
