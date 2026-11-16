#!/usr/bin/env python3
"""Exporta o vídeo final: renders das cenas em sequência + áudio (mixagem do som ou só a narração), normalizado para o YouTube
(-14 LUFS, pico -1 dBTP), com legendas queimadas se houver. Também gera a versão leve (720p, para ver no celular).

Uso: exportar_final.py <pasta> [--audio arquivo.wav] [--legendas arquivo.ass] [--titulo "Nome do vídeo"]
- Sem --audio: usa a mixagem mais nova de _CLAUDE/sfx/mix_*.wav; se não houver, a narração completa.
- Vídeo: os renders atuais de cada cena (bloco animacao.cenas), em ordem numérica (c01, c02 ... c117).
- Áudio: cortado cena a cena (início da cena na narração + duração do render), para não escorregar no fim.
Grava _CLAUDE/final/<titulo>_vNN.mp4 e _leve.mp4 (versão nova, nunca sobrescreve).
"""
import argparse, glob, json, os, re, subprocess, tempfile


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pasta'); ap.add_argument('--audio'); ap.add_argument('--legendas'); ap.add_argument('--titulo', default='video')
    a = ap.parse_args()
    c = os.path.join(a.pasta, '_CLAUDE')
    pj = json.load(open(os.path.join(c, 'projeto.json'), encoding='utf-8'))
    audio = a.audio
    if not audio:
        mixes = sorted(glob.glob(os.path.join(c, 'sfx', 'mix_*.wav')))
        audio = mixes[-1] if mixes else os.path.join(a.pasta, pj['narracao']['completa']['arquivo'])
    fin = os.path.join(c, 'final'); os.makedirs(fin, exist_ok=True)
    lista = os.path.join(fin, '_renders.txt')
    # 11/11/2026: cenas em ordem NUMERICA (o dict do estado pode sair fora de ordem) e audio cortado cena a cena
    # (inicio da cena na narracao + duracao do render): os renders somam um pouco mais que a narracao e o som continuo escorregava.
    cenas = sorted(pj['animacao']['cenas'].items(), key=lambda kv: int(re.sub(r'\D', '', kv[0]) or 0))
    comp = pj['narracao']['completa'].get('cenas', {})
    partes = []
    with open(lista, 'w', encoding='utf-8') as f:
        for cid, v in cenas:
            rend = os.path.abspath(os.path.join(a.pasta, v['render'])).replace('\\', '/')
            f.write("file '%s'\n" % rend)
            d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', rend], capture_output=True, text=True).stdout)
            partes.append((comp.get(cid, {}).get('ini'), d))
    if partes and all(t0 is not None for t0, _ in partes):
        fil = ';'.join(f'[0:a]atrim={t0:.3f}:{t0 + d:.3f},asetpts=PTS-STARTPTS,apad,atrim=0:{d:.3f}[a{k}]' for k, (t0, d) in enumerate(partes))
        fil += ';' + ''.join(f'[a{k}]' for k in range(len(partes))) + f'concat=n={len(partes)}:v=0:a=1[a]'
        cortado = os.path.join(fin, '_audio_cenas.wav')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', audio, '-filter_complex', fil, '-map', '[a]', '-ar', '48000', cortado], check=True)
        audio = cortado
    # áudio normalizado em duas passadas
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', audio, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True)
    m = json.loads(r.stderr[r.stderr.rfind('{'):r.stderr.rfind('}') + 1])
    norm = os.path.join(fin, '_audio_norm.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', audio, '-af',
                    f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000",
                    norm], check=True)
    nome = re.sub(r'[\\/:*?"<>|]', '', a.titulo).strip() or 'video'
    v = 1
    while os.path.exists(os.path.join(fin, f'{nome}_v{v:02d}.mp4')):
        v += 1
    out = os.path.join(fin, f'{nome}_v{v:02d}.mp4')
    if a.legendas:
        sub = os.path.abspath(a.legendas).replace('\\', '/').replace(':', '\\:')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-i', norm, '-map', '0:v', '-map', '1:a',
                        '-vf', f"subtitles='{sub}'", '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-c:a', 'aac', '-b:a', '320k',
                        '-shortest', '-movflags', '+faststart', out], check=True)
    else:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-i', norm, '-map', '0:v', '-map', '1:a',
                        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-shortest', '-movflags', '+faststart', out], check=True)
    leve = out.replace('.mp4', '_leve.mp4')
    # 12/11: video vertical (Shorts) gera a leve em 720x1280
    wh = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout.strip().split(',')
    esc = 'scale=720:1280' if len(wh) == 2 and int(wh[1]) > int(wh[0]) else 'scale=1280:720'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', out, '-vf', esc, '-c:v', 'libx264', '-crf', '30', '-preset', 'veryfast',
                    '-c:a', 'aac', '-b:a', '96k', leve], check=True)
    # conferência: decodifica tudo
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', out, '-f', 'null', '-'], capture_output=True, text=True)
    print(out, '| leve:', leve, '| erros de decodificação:', len(r.stderr.strip().splitlines()))
    os.remove(lista)


if __name__ == '__main__':
    main()
