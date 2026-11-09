"""Le um roteiro_vNN.md do fluxo animador, estima o tempo de cada cena e grava o bloco `roteiro`.

  roteiro_cenas.py <pasta> <roteiro_vNN.md> [--ppm 150] [--pausa 0.4] [--gravar]

- Preenche o "~t" (ou um tempo antigo) de cada cabecalho de cena com o inicio estimado.
- Sem --gravar, so mostra o resumo. Com --gravar, reescreve os tempos no .md e grava o bloco
  `roteiro` em projeto.json pelo estado.py.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

CAB = re.compile(r'^(c\d+[a-z]?) · (~[^·]*?) · parte (\d+) "([^"]*)"\s*$')
CAMPOS = {"Narração": "narracao", "Tela": "tela", "Ideia visual": "visual", "Fonte": "fonte"}


def mmss(s):
    s = int(round(s))
    return f"{s // 60}:{s % 60:02d}"


def ler(md):
    cenas, atual = [], None
    for i, linha in enumerate(md.read_text(encoding="utf-8").splitlines()):
        m = CAB.match(linha)
        if m:
            atual = {"id": m.group(1), "parte": int(m.group(3)), "parte_titulo": m.group(4), "_linha": i}
            cenas.append(atual)
            continue
        if atual and ":" in linha:
            k, v = linha.split(":", 1)
            if k in CAMPOS:
                atual[CAMPOS[k]] = v.strip()
    return cenas


def main():
    a = sys.argv[1:]
    if len(a) < 2:
        print(__doc__)
        sys.exit(1)
    pasta, md = Path(a[0]), Path(a[1])
    ppm = float(a[a.index("--ppm") + 1]) if "--ppm" in a else 150.0
    pausa = float(a[a.index("--pausa") + 1]) if "--pausa" in a else 0.4
    cenas = ler(md)
    ids = [c["id"] for c in cenas]
    if len(ids) != len(set(ids)):
        print("erro: id de cena repetido")
        sys.exit(1)
    t, total_pal = 0.0, 0
    for c in cenas:
        pal = len(re.findall(r"\w+", c.get("narracao", "")))
        dur = pal / (ppm / 60.0)
        c["palavras"], c["inicio_est"], c["duracao_est"] = pal, round(t, 1), round(dur, 1)
        t += dur + pausa
        total_pal += pal
    partes = {}
    for c in cenas:
        p = partes.setdefault(c["parte"], {"titulo": c["parte_titulo"], "inicio": c["inicio_est"], "pal": 0})
        p["pal"] += c["palavras"]
    print(f"{len(cenas)} cenas · {total_pal} palavras · ~{mmss(t)} a {ppm:.0f} ppm")
    for n, p in partes.items():
        print(f"  parte {n:>2} {mmss(p['inicio']):>6}  {p['pal']:>4} pal  {p['titulo']}")
    conferir = [c["id"] for c in cenas if "[conferir]" in json.dumps(c, ensure_ascii=False)]
    print("conferir:", ", ".join(conferir) or "nenhum")
    if "--gravar" not in a:
        return
    linhas = md.read_text(encoding="utf-8").splitlines()
    for c in cenas:
        m = CAB.match(linhas[c["_linha"]])
        linhas[c["_linha"]] = f'{c["id"]} · ~{mmss(c["inicio_est"])} · parte {c["parte"]} "{c["parte_titulo"]}"'
    md.write_text("\n".join(linhas) + "\n", encoding="utf-8")
    vn = re.search(r"_v(\d+)", md.name)
    bloco = {
        "versao": int(vn.group(1)) if vn else 1,
        "arquivo": str(md.relative_to(pasta)).replace("\\", "/") if md.is_relative_to(pasta) else str(md),
        "palavras": total_pal,
        "duracao_est": mmss(t),
        "ppm": ppm,
        "conferir": conferir,
        "cenas": {c["id"]: {k: v for k, v in c.items() if not k.startswith("_")} for c in cenas},
    }
    sys.path.insert(0, str(Path(__file__).parent))
    import estado
    d = estado.ler(str(pasta))
    d["roteiro"] = bloco
    estado.salvar(str(pasta), d)
    print(f"roteiro gravado: v{bloco['versao']}, {len(cenas)} cenas")


if __name__ == "__main__":
    main()
