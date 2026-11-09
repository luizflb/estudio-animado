#!/usr/bin/env python3
"""Le e muda o estado do video (_CLAUDE/projeto.json) sem abrir o arquivo inteiro.

  estado.py <pasta> init [--perfil N] [--formato F] [--tipo T]   (fluxo /editar)
  estado.py <pasta> init --fluxo recriar                          (fluxo animador)
  estado.py <pasta> status
  estado.py <pasta> <bloco> [--json]
  estado.py <pasta> --item <id>
  estado.py <pasta> --set <caminho.com.pontos> <valor>   (valor em JSON, ou texto)
  estado.py <pasta> --etapa <etapa>=<status>
  estado.py <pasta> --pendencia <etapa> "<texto>"
  estado.py <pasta> --resolver <id>
"""
import json
import os
import re
import sys
import time
from pathlib import Path

ETAPAS = ["iniciar", "preparar", "cortes", "mapa", "assets", "motion", "camera", "sfx", "legendas"]
# Fluxo /recriar (rec-*): o estado leva "fluxo": "recriar". Sem a chave, e o /editar.
ETAPAS_RECRIAR = ["iniciar", "roteiro", "narracao", "mapa", "assets", "animacao", "sfx", "legendas"]
# Fluxo animador (pacote estudio-animado): estilo e personagem vêm antes do roteiro.
ETAPAS_ANIMADOR = ["iniciar", "estilo", "personagem", "roteiro", "narracao", "mapa", "assets", "animacao", "sfx", "legendas"]
# Blocos que dependem da narracao: guardam {"narracao_versao": {"c01": 2, ...}}.
DEPENDEM_DA_NARRACAO = ["mapa", "animacao", "sfx", "legendas"]
STATUS = {"pendente", "em_andamento", "aguardando_aprovacao", "concluido", "nao_precisa"}
FORMATOS = {"vertical", "horizontal"}
TIPOS = {"tutorial", "publi", "diario"}
# Blocos que dependem do corte: guardam a versao do corte em que foram feitos.
DEPENDEM_DO_CORTE = ["mapa", "motions", "camera", "sfx", "legendas"]


def erro(msg):
    print(f"erro: {msg}", file=sys.stderr)
    sys.exit(1)


def arquivo(pasta):
    return Path(pasta) / "_CLAUDE" / "projeto.json"


def ler(pasta):
    a = arquivo(pasta)
    if not a.exists():
        erro(f"nao existe {a}")
    return json.loads(a.read_text(encoding="utf-8"))


def salvar(pasta, d):
    a = arquivo(pasta)
    tmp = a.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # No D: algo (antivirus/indexador) segura o arquivo por instantes: tenta de novo
    # e, se continuar preso, grava por cima no proprio arquivo.
    for _ in range(12):
        try:
            os.replace(tmp, a)
            return
        except PermissionError:
            time.sleep(0.25)
    a.write_text(tmp.read_text(encoding="utf-8"), encoding="utf-8")
    try:
        tmp.unlink()
    except OSError:
        pass


def etapas_de(d):
    if d.get("fluxo") == "animador":
        return ETAPAS_ANIMADOR
    return ETAPAS_RECRIAR if d.get("fluxo") == "recriar" else ETAPAS


def valida_status(s):
    if s not in STATUS and not re.fullmatch(r"aguardando_\w+", s):
        erro(f"status invalido: {s}")


def valida_campos(formato, tipo):
    if formato is not None and formato not in FORMATOS:
        erro(f"formato invalido: {formato}")
    if tipo is not None and tipo not in TIPOS:
        erro(f"tipo invalido: {tipo}")


def init(pasta, opts):
    a = arquivo(pasta)
    if a.exists():
        erro(f"ja existe {a}; nao sobrescrevo")
    fluxo = opts.get("fluxo", "editar")
    if fluxo not in ("editar", "recriar", "animador"):
        erro(f"fluxo invalido: {fluxo}")
    a.parent.mkdir(parents=True, exist_ok=True)
    if fluxo in ("recriar", "animador"):
        d = {
            "projeto": Path(pasta).resolve().name,
            "fluxo": fluxo,
            "formato": "horizontal",
            "fps": 30,
            "ferramentas": {},
            "etapas": {e: "pendente" for e in (ETAPAS_ANIMADOR if fluxo == "animador" else ETAPAS_RECRIAR)},
            "original": {},
            "pendencias": [],
        }
        salvar(pasta, d)
        print(f"criado {a}")
        return
    valida_campos(opts.get("formato"), opts.get("tipo"))
    d = {
        "projeto": Path(pasta).resolve().name,
        "perfil": opts.get("perfil"),
        "formato": opts.get("formato"),
        "tipo": opts.get("tipo"),
        "ferramentas": {},
        "etapas": {e: "pendente" for e in ETAPAS},
        "pendencias": [],
    }
    salvar(pasta, d)
    print(f"criado {a}")


def alertas(d):
    if d.get("fluxo") in ("recriar", "animador"):
        return alertas_recriar(d)
    saida = []
    versao = (d.get("cortes") or {}).get("versao")
    if versao is not None:
        for nome in DEPENDEM_DO_CORTE:
            b = d.get(nome)
            feito = b.get("cortes_versao") if isinstance(b, dict) else None
            if feito is not None and feito != versao:
                saida.append(f"{nome} foi feito no corte v{feito}, mas o corte atual e v{versao}")
    return saida


def alertas_recriar(d):
    saida = []
    cenas = ((d.get("narracao") or {}).get("cenas")) or {}
    atual = {c: v.get("versao") for c, v in cenas.items() if isinstance(v, dict)}
    for nome in DEPENDEM_DA_NARRACAO:
        b = d.get(nome)
        feito = b.get("narracao_versao") if isinstance(b, dict) else None
        if not isinstance(feito, dict):
            continue
        for c, v in feito.items():
            if atual.get(c) is not None and v != atual[c]:
                saida.append(f"{nome} da {c} foi feito na narracao v{v}, mas a atual e v{atual[c]}")
    return saida


def aprendizados(pasta):
    a = Path(pasta) / "_CLAUDE" / "aprendizados.md"
    if not a.exists():
        return 0
    return sum(1 for l in a.read_text(encoding="utf-8").splitlines() if l.startswith("- [ ]"))


def status(pasta):
    d = ler(pasta)
    recriar = d.get("fluxo") in ("recriar", "animador")
    if recriar:
        o = d.get("original") or {}
        print(f"{d.get('projeto')} | {d.get('fluxo')} | {o.get('titulo') or '?'} ({o.get('canal') or '?'}, {o.get('duracao') or '?'})")
    else:
        print(f"{d.get('projeto')} | {d.get('formato') or '?'} | {d.get('tipo') or '?'}")
    print("\nEtapas:")
    for e, s in d.get("etapas", {}).items():
        print(f"  {e:<10} {s}")
    trechos = []
    for nome in (("narracao", "animacao", "sfx", "legendas") if recriar else ("motions", "camera", "sfx")):
        b = d.get(nome)
        t = b.get("trechos") if isinstance(b, dict) else None
        if t:
            trechos.append(f"  {nome}: {json.dumps(t, ensure_ascii=False)}")
    if trechos:
        print("\nTrechos:")
        print("\n".join(trechos))
    abertas = [p for p in d.get("pendencias", []) if not p.get("resolvida")]
    print(f"\nPendencias: {len(abertas)}")
    for p in abertas:
        print(f"  {p['id']} [{p['etapa']}] {p['texto']}")
    al = alertas(d)
    print(f"\nAlertas: {len(al)}")
    for x in al:
        print(f"  {x}")
    print(f"\nAprendizados anotados: {aprendizados(pasta)}")


def resumo(valor):
    if isinstance(valor, dict):
        for k, v in valor.items():
            if isinstance(v, (dict, list)):
                print(f"  {k}: {len(v)} itens")
            else:
                print(f"  {k}: {v}")
    elif isinstance(valor, list):
        print(f"  {len(valor)} itens")
        for i in valor:
            if isinstance(i, dict):
                curtos = {k: v for k, v in i.items() if not isinstance(v, (dict, list))}
                print("  " + json.dumps(curtos, ensure_ascii=False))
            else:
                print(f"  {i}")
    else:
        print(f"  {valor}")


def bloco(pasta, nome, como_json):
    d = ler(pasta)
    if nome not in d:
        erro(f"bloco nao existe: {nome} (ha: {', '.join(d)})")
    if como_json:
        print(json.dumps(d[nome], ensure_ascii=False, indent=2))
    else:
        print(f"{nome}:")
        resumo(d[nome])


def acha_item(no, alvo):
    if isinstance(no, dict):
        if no.get("id") == alvo:
            return no
        no = list(no.values())
    if isinstance(no, list):
        for v in no:
            r = acha_item(v, alvo)
            if r is not None:
                return r
    return None


def item(pasta, alvo):
    r = acha_item(ler(pasta), alvo)
    if r is None:
        erro(f"item nao encontrado: {alvo}")
    print(json.dumps(r, ensure_ascii=False, indent=2))


def set_campo(pasta, caminho, valor):
    d = ler(pasta)
    try:
        v = json.loads(valor)
    except json.JSONDecodeError:
        v = valor
    partes = caminho.split(".")
    if not all(partes):
        erro(f"caminho invalido: {caminho}")
    if caminho == "formato":
        valida_campos(v, None)
    if caminho == "tipo":
        valida_campos(None, v)
    if len(partes) == 2 and partes[0] == "etapas":
        if partes[1] not in etapas_de(d):
            erro(f"etapa invalida: {partes[1]}")
        valida_status(v if isinstance(v, str) else "")
    no = d
    for p in partes[:-1]:
        if not isinstance(no.setdefault(p, {}), dict):
            erro(f"{p} nao e um bloco")
        no = no[p]
    no[partes[-1]] = v
    salvar(pasta, d)
    print(f"{caminho} = {json.dumps(v, ensure_ascii=False)}")


def set_etapa(pasta, par):
    if "=" not in par:
        erro("use --etapa <etapa>=<status>")
    e, s = par.split("=", 1)
    d = ler(pasta)
    if e not in etapas_de(d):
        erro(f"etapa invalida: {e}")
    valida_status(s)
    d.setdefault("etapas", {})[e] = s
    salvar(pasta, d)
    print(f"{e} = {s}")


def pendencia(pasta, etapa, texto):
    d = ler(pasta)
    lista = d.setdefault("pendencias", [])
    n = max([int(p["id"][1:]) for p in lista] + [0]) + 1
    pid = f"p{n:02d}"
    lista.append({"id": pid, "etapa": etapa, "texto": texto})
    salvar(pasta, d)
    print(f"{pid} anotada")


def resolver(pasta, pid):
    d = ler(pasta)
    for p in d.get("pendencias", []):
        if p["id"] == pid:
            p["resolvida"] = True
            salvar(pasta, d)
            print(f"{pid} resolvida")
            return
    erro(f"pendencia nao encontrada: {pid}")


def main():
    for s in (sys.stdout, sys.stderr):
        s.reconfigure(encoding="utf-8")
    a = sys.argv[1:]
    if len(a) < 2:
        print(__doc__)
        sys.exit(2)
    pasta, cmd, resto = a[0], a[1], a[2:]
    if cmd == "init":
        opts = {}
        for i in range(0, len(resto) - 1, 2):
            opts[resto[i].lstrip("-")] = resto[i + 1]
        init(pasta, opts)
    elif cmd == "status":
        status(pasta)
    elif cmd == "--item" and len(resto) == 1:
        item(pasta, resto[0])
    elif cmd == "--set" and len(resto) == 2:
        set_campo(pasta, *resto)
    elif cmd == "--etapa" and len(resto) == 1:
        set_etapa(pasta, resto[0])
    elif cmd == "--pendencia" and len(resto) == 2:
        pendencia(pasta, *resto)
    elif cmd == "--resolver" and len(resto) == 1:
        resolver(pasta, resto[0])
    elif not cmd.startswith("--"):
        bloco(pasta, cmd, "--json" in resto)
    else:
        print(__doc__)
        sys.exit(2)


if __name__ == "__main__":
    main()
