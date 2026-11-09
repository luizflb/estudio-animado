/* Personagens desenhados em SVG por código (canal recriar), compatíveis com o Rig2 (mesma API de animação).
 * Braços e pernas em duas passadas (contorno embaixo, cor por cima): as juntas não aparecem, o membro parece uma peça só.
 * Definição: window.RIGS[nome] = { tipo:"svg", pele, cabelo:{estilo,cor}, olhos_cor, roupa:{...}, calca:{...}, sapato:{...}, extras:{...} }
 *   roupa.tipo: camiseta | blusa | social | terno | jaleco | vestido ; roupa.cor, roupa.manga: curta|longa, roupa.gravata (cor), roupa.cracha
 *   calca.tipo: calca | saia | shorts ; calca.cor ; sapato.tipo: social | tenis | sapatilha ; sapato.cor
 *   cabelo.estilo: raspado | curto | lateral | chanel | longo | coque | careca | cacheado ; extras: oculos ("sol"|"redondo"), barba ("cheia"|"bigode"|"cavanhaque"), barba_cor, fone (segurança), batom
 * Unidades na escala do personagem principal (quadril em 0,0; pés em y≈pe).
 */
(function () {
  const C = (window.ESTILO && window.ESTILO.contorno) || "#2E2A33", LW = (window.ESTILO && window.ESTILO.espessura) || 7;
  const NS = "http://www.w3.org/2000/svg";
  const esc = (h, f) => { const n = parseInt(h.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const k = f < 0 ? 0 : 255, t = Math.abs(f); r = Math.round(r + (k - r) * t); g = Math.round(g + (k - g) * t); b = Math.round(b + (k - b) * t); return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); };
  const PELES = { clara: "#F7C9A4", media: "#F2A877", morena: "#C98B5E", escura: "#8A5A3C" };

  // cápsula vertical com largura variando de w0 (topo) a w1 (base), comprimento L (juntas em 0 e L)
  const capsula = (L, w0, w1) => { const a = w0 / 2, b = w1 / 2; return `M ${-a} 0 L ${-b} ${L} A ${b} ${b} 0 0 0 ${b} ${L} L ${a} 0 A ${a} ${a} 0 0 0 ${-a} 0 Z`; };
  const el = (tag, attrs, pai) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (pai) pai.appendChild(e); return e; };
  const grupo = (pai, tr) => el("g", tr ? { transform: tr } : {}, pai);
  // forma em duas passadas: no contorno vira silhueta escura gorda; no preenchimento, a cor
  function forma(par, d, cor, detalhe) {
    el("path", { d, fill: C, stroke: C, "stroke-width": LW * 2, "stroke-linejoin": "round" }, par.c);
    el("path", { d, fill: cor }, par.f);
    if (detalhe) par.f.insertAdjacentHTML("beforeend", detalhe);
  }
  function osso(par, tr, nome, mapa) { const c = grupo(par.c, tr), f = grupo(par.f, tr); const o = { c: grupo(c), f: grupo(f) }; mapa[nome] = [o.c, o.f]; return o; }

  // ---------- mãos (punho em 0,0, dedos para +y) ----------
  function maos(par, pele, lado) {
    const sombra = esc(pele, -0.12), v = {};
    const s = lado === "d" ? -1 : 1; // polegar para dentro do corpo
    const linhas = (xs) => xs.map(x => `<path d="M ${x} 70 L ${x} 88" stroke="${sombra}" stroke-width="5" stroke-linecap="round"/>`).join("");
    const desenhos = {
      relaxada: [`M -34 8 Q -40 60 -26 92 Q 0 110 26 92 Q 40 60 34 8 Z`, `M ${s * 30} 18 Q ${s * 52} 40 ${s * 40} 62 Q ${s * 30} 64 ${s * 26} 50 Z`, linhas([-12, 4, 18])],
      aberta: [`M -32 6 Q -36 40 -30 60 L -40 108 Q -34 118 -26 110 L -16 72 L -14 118 Q -6 128 2 118 L 2 74 L 10 120 Q 18 128 24 118 L 20 70 L 32 108 Q 40 114 42 104 L 32 56 Q 36 30 32 6 Z`,
        `M ${s * 30} 22 Q ${s * 62} 30 ${s * 66} 54 Q ${s * 58} 64 ${s * 44} 56 Q ${s * 34} 46 ${s * 28} 44 Z`, ""],
      apontando: [`M -32 6 Q -40 46 -28 70 Q 0 86 28 70 Q 40 46 32 6 Z M -9 66 L -9 134 Q 0 146 9 134 L 9 66 Z`, `M ${s * 28} 26 Q ${s * 52} 40 ${s * 38} 60 Q ${s * 28} 60 ${s * 24} 48 Z`, linhas([14, 26])],
      joinha: [`M -32 6 Q -42 46 -30 72 Q 0 88 30 72 Q 42 46 32 6 Z M ${-s * 10} 70 Q ${-s * 14} 120 ${-s * 4} 132 Q ${s * 10} 136 ${s * 10} 118 L ${s * 10} 70 Z`, "", linhas([-14, 0, 14]).replace(/70/g, "20").replace(/88/g, "40")],
      punho: [`M -34 6 Q -44 50 -30 76 Q 0 92 30 76 Q 44 50 34 6 Z`, `M ${s * 30} 30 Q ${s * 48} 46 ${s * 30} 64 Q ${s * 20} 60 ${s * 22} 46 Z`, linhas([-14, 0, 14])],
    };
    const nomes = { aberta_relaxada: "relaxada", relaxada: "relaxada", aberta: "aberta", palma_frente: "aberta", acenando: "aberta", oferecendo: "aberta", ok: "aberta", palmas: "aberta",
      apontando: "apontando", contando_um: "apontando", contando_dois: "apontando", contando_tres: "apontando", paz: "apontando", joinha: "joinha", punho: "punho",
      segura_celular: "celular", segura_xicara: "punho", segura_caneta: "punho", segura_pasta: "punho", segura_alca_bolsa: "punho", segura_microfone: "punho", segura_taca: "punho", segura_pegada: "punho" };
    const feitos = {};
    Object.entries(nomes).forEach(([nome, base]) => {
      if (!feitos[base]) {
        const gc = grupo(par.c), gf = grupo(par.f);
        gc.setAttribute("opacity", 0); gf.setAttribute("opacity", 0);
        const d = base === "celular" ? desenhos.punho : desenhos[base];
        el("path", { d: d[0], fill: C, stroke: C, "stroke-width": LW * 2, "stroke-linejoin": "round" }, gc);
        el("path", { d: d[0], fill: pele }, gf);
        if (d[1]) { el("path", { d: d[1], fill: pele, stroke: C, "stroke-width": LW, "stroke-linejoin": "round" }, gf); }
        if (d[2]) gf.insertAdjacentHTML("beforeend", d[2]);
        if (base === "celular") gf.insertAdjacentHTML("beforeend", `<g transform="translate(${s * -6} 40)"><rect x="-26" y="0" width="52" height="96" rx="9" fill="#26252c" stroke="${C}" stroke-width="5"/><rect x="-19" y="9" width="38" height="70" rx="4" fill="#5b8fd9"/><path d="M -12 60 L 8 20" stroke="#fff" stroke-width="6" opacity=".5"/></g>`);
        feitos[base] = [gc, gf];
      }
      v[nome] = feitos[base];
    });
    return v;
  }

  // ---------- rosto ----------
  function rosto(g, D, pele) {
    const cam = { olhos: {}, sobrancelhas: {}, boca: {} };
    const iris = D.olhos_cor || "#5a3a22";
    const add = (grupoNome, nome, html) => { const x = el("g", { opacity: 0 }, g); x.innerHTML = html; cam[grupoNome][nome] = x; };
    const olho = (x, tipo) => {
      if (tipo === "fechado") return `<path d="M ${x - 44} -540 Q ${x} -512 ${x + 44} -540" fill="none" stroke="${C}" stroke-width="9" stroke-linecap="round"/>`;
      const base = `<ellipse cx="${x}" cy="-545" rx="44" ry="52" fill="#fff" stroke="${C}" stroke-width="7"/><circle cx="${x + 2}" cy="-538" r="27" fill="${iris}"/><circle cx="${x + 2}" cy="-538" r="14" fill="#1b1520"/><circle cx="${x + 12}" cy="-550" r="9" fill="#fff"/><circle cx="${x - 6}" cy="-528" r="4.5" fill="#fff"/>`;
      if (tipo === "semi") return base + `<path d="M ${x - 48} -600 L ${x + 48} -600 L ${x + 48} -548 Q ${x} -538 ${x - 48} -548 Z" fill="${pele}"/><path d="M ${x - 46} -547 Q ${x} -537 ${x + 46} -547" fill="none" stroke="${C}" stroke-width="8" stroke-linecap="round"/>`;
      return base;
    };
    add("olhos", "abertos", olho(-88) + olho(88));
    add("olhos", "semicerrados", olho(-88, "semi") + olho(88, "semi"));
    add("olhos", "fechados", olho(-88, "fechado") + olho(88, "fechado"));
    add("olhos", "piscadela", olho(-88) + olho(88, "fechado"));
    const cor_s = D.sobrancelha_cor || esc((D.cabelo && D.cabelo.cor) || "#2b2522", -0.15);
    const sob = (pts) => pts.map(p => `<path d="${p}" fill="none" stroke="${cor_s}" stroke-width="17" stroke-linecap="round"/>`).join("");
    add("sobrancelhas", "neutras", sob(["M -128 -618 Q -90 -632 -52 -620", "M 52 -620 Q 90 -632 128 -618"]));
    add("sobrancelhas", "levantadas", sob(["M -128 -636 Q -90 -658 -52 -640", "M 52 -640 Q 90 -658 128 -636"]));
    add("sobrancelhas", "bravas", sob(["M -128 -628 Q -88 -624 -54 -604", "M 54 -604 Q 88 -624 128 -628"]));
    add("sobrancelhas", "preocupadas", sob(["M -128 -606 Q -92 -616 -56 -632", "M 56 -632 Q 92 -616 128 -606"]));
    const boca_c = "#7a1f2b", lingua = "#e8707a";
    const B = {
      fechada: `<path d="M -34 -440 Q 0 -420 34 -440" fill="none" stroke="${C}" stroke-width="8" stroke-linecap="round"/>`,
      pequena: `<ellipse cx="0" cy="-436" rx="22" ry="12" fill="${boca_c}" stroke="${C}" stroke-width="6"/>`,
      media: `<path d="M -36 -446 Q 0 -452 36 -446 Q 30 -412 0 -410 Q -30 -412 -36 -446 Z" fill="${boca_c}" stroke="${C}" stroke-width="6"/><path d="M -18 -418 Q 0 -428 18 -418" fill="${lingua}"/>`,
      A: `<path d="M -42 -452 Q 0 -460 42 -452 Q 38 -394 0 -390 Q -38 -394 -42 -452 Z" fill="${boca_c}" stroke="${C}" stroke-width="6"/><path d="M -24 -400 Q 0 -420 24 -400 Q 0 -390 -24 -400 Z" fill="${lingua}"/><path d="M -34 -450 Q 0 -456 34 -450 L 30 -440 Q 0 -444 -30 -440 Z" fill="#fff"/>`,
      O: `<ellipse cx="0" cy="-430" rx="24" ry="30" fill="${boca_c}" stroke="${C}" stroke-width="6"/><ellipse cx="0" cy="-416" rx="13" ry="8" fill="${lingua}"/>`,
      E: `<path d="M -46 -446 Q 0 -440 46 -446 Q 40 -418 0 -416 Q -40 -418 -46 -446 Z" fill="${boca_c}" stroke="${C}" stroke-width="6"/><path d="M -38 -444 Q 0 -438 38 -444 L 34 -432 Q 0 -428 -34 -432 Z" fill="#fff"/>`,
      sorriso: `<path d="M -40 -446 Q 0 -414 40 -446" fill="none" stroke="${C}" stroke-width="9" stroke-linecap="round"/><path d="M -46 -452 Q -40 -446 -36 -440 M 46 -452 Q 40 -446 36 -440" stroke="${C}" stroke-width="6" stroke-linecap="round"/>`,
      sorriso_aberto: `<path d="M -50 -452 Q 0 -448 50 -452 Q 44 -398 0 -394 Q -44 -398 -50 -452 Z" fill="${boca_c}" stroke="${C}" stroke-width="6"/><path d="M -42 -450 Q 0 -446 42 -450 L 38 -436 Q 0 -432 -38 -436 Z" fill="#fff"/><path d="M -24 -404 Q 0 -424 24 -404 Q 0 -396 -24 -404 Z" fill="${lingua}"/>`,
    };
    if (D.extras && D.extras.batom) Object.keys(B).forEach(k => B[k] = B[k].replace(`stroke="${C}" stroke-width="8"`, `stroke="#c0394f" stroke-width="10"`));
    Object.entries(B).forEach(([k, h]) => add("boca", k, h));
    return cam;
  }

  function cabelo(g, D, fase) {
    const H = D.cabelo || {}, cor = H.cor || "#2b2522", luz = esc(cor, 0.22), C2 = C;
    const p = (d, extra = "") => `<path d="${d}" fill="${cor}" stroke="${C2}" stroke-width="7" stroke-linejoin="round"/>${extra}`;
    const brilho = (d) => `<path d="${d}" fill="none" stroke="${luz}" stroke-width="10" stroke-linecap="round" opacity=".8"/>`;
    const est = H.estilo || "curto";
    if (fase === "tras") {
      if (est === "chanel") g.insertAdjacentHTML("beforeend", p("M -235 -560 Q -250 -440 -228 -390 L 228 -390 Q 250 -440 235 -560 Z"));
      if (est === "longo") g.insertAdjacentHTML("beforeend", p("M -232 -570 Q -262 -380 -230 -250 L 230 -250 Q 262 -380 232 -570 Z"));
      if (est === "coque") g.insertAdjacentHTML("beforeend", p("M -78 -790 A 78 70 0 1 1 78 -790 A 78 70 0 1 1 -78 -790 Z", brilho("M -40 -820 Q 0 -840 36 -824")));
      return;
    }
    const F = {
      raspado: p("M -205 -600 Q -200 -775 0 -785 Q 200 -775 205 -600 Q 170 -680 0 -688 Q -170 -680 -205 -600 Z") + Array.from({ length: 14 }, (_, i) => `<path d="M ${-150 + i * 22} -705 l 4 -14" stroke="${luz}" stroke-width="5" stroke-linecap="round"/>`).join(""),
      curto: p("M -212 -590 Q -228 -760 -40 -790 Q 120 -812 200 -720 Q 230 -680 212 -590 Q 190 -650 120 -660 Q 60 -700 -20 -668 Q -120 -700 -160 -640 Q -190 -630 -212 -590 Z") + brilho("M -120 -740 Q -40 -770 40 -760"),
      lateral: p("M -214 -580 Q -230 -770 -10 -792 Q 190 -800 214 -620 Q 205 -580 196 -560 Q 170 -660 40 -676 Q -80 -650 -150 -690 Q -190 -640 -214 -580 Z") + brilho("M -60 -760 Q 40 -780 120 -748"),
      chanel: p("M -238 -560 Q -250 -790 0 -800 Q 250 -790 238 -560 Q 200 -600 180 -660 Q 60 -630 -60 -690 Q -150 -650 -200 -600 Q -220 -575 -238 -560 Z") + brilho("M -150 -730 Q -40 -780 80 -760"),
      longo: p("M -238 -570 Q -250 -790 0 -800 Q 250 -790 238 -570 Q 190 -660 0 -700 Q -190 -660 -238 -570 Z") + brilho("M -140 -740 Q -30 -780 90 -762"),
      coque: p("M -216 -590 Q -226 -770 0 -782 Q 226 -770 216 -590 Q 180 -670 0 -684 Q -180 -670 -216 -590 Z") + brilho("M -120 -740 Q -20 -768 90 -748"),
      careca: p("M -214 -560 Q -224 -640 -196 -660 Q -186 -600 -186 -560 Z") + p("M 214 -560 Q 224 -640 196 -660 Q 186 -600 186 -560 Z"),
      ondulado: p("M -230 -540 C -264 -620 -252 -700 -208 -748 Q -218 -804 -160 -814 Q -150 -862 -88 -850 Q -58 -886 2 -866 Q 52 -890 98 -852 Q 154 -866 176 -818 Q 232 -812 226 -756 Q 270 -700 232 -540 C 216 -598 198 -630 162 -650 Q 122 -632 98 -668 Q 52 -718 2 -682 Q -40 -714 -82 -678 Q -132 -702 -162 -654 Q -198 -622 -212 -582 Q -222 -560 -230 -540 Z")
        + ["M -186 -760 Q -168 -792 -132 -790", "M -110 -812 Q -80 -836 -46 -824", "M 20 -836 Q 56 -852 86 -828", "M 126 -812 Q 162 -812 186 -780", "M -60 -740 Q -10 -770 40 -742", "M 90 -730 Q 140 -742 170 -706", "M -200 -690 Q -186 -722 -150 -726"].map(d => `<path d="${d}" fill="none" stroke="${luz}" stroke-width="11" stroke-linecap="round" opacity=".9"/>`).join("")
        + ["M -150 -700 Q -120 -730 -90 -704", "M -30 -710 Q 0 -740 30 -712", "M 80 -706 Q 110 -732 136 -700"].map(d => `<path d="${d}" fill="none" stroke="${C2}" stroke-width="6" stroke-linecap="round"/>`).join(""),
      cacheado: Array.from({ length: 13 }, (_, i) => { const a = Math.PI * (0.05 + 0.9 * i / 12); return `<circle cx="${-Math.cos(a) * 205}" cy="${-600 - Math.sin(a) * 175}" r="62" fill="${cor}" stroke="${C2}" stroke-width="7"/>`; }).join("") + p("M -200 -600 Q -190 -720 0 -735 Q 190 -720 200 -600 Q 150 -660 0 -665 Q -150 -660 -200 -600 Z"),
    };
    g.insertAdjacentHTML("beforeend", F[est] || F.curto);
  }

  function construir(host, D, op) {
    const e = (op.escala || 1) * (D.escala || 1);
    const pele = PELES[D.pele] || D.pele || PELES.media, sombraPele = esc(pele, -0.13);
    const R = D.roupa || {}, Ca = D.calca || {}, S = D.sapato || {}, X = D.extras || {};
    const rc = R.cor || "#3b6ea8", rcs = esc(rc, -0.18), cc = Ca.cor || "#2b2a31", sc = S.cor || (S.tipo === "tenis" ? "#f4f4f6" : "#232228");
    const svg = el("svg", { width: 2, height: 2, overflow: "visible", style: "position:absolute;left:0;top:0;overflow:visible" });
    host.appendChild(svg);
    const raiz = grupo(svg, `scale(${e})`);
    const ossos = {};
    const quadril = grupo(raiz); ossos.quadril = [quadril];
    // ----- pernas (duas passadas, uma cadeia por perna) -----
    const saia = Ca.tipo === "saia", shorts = Ca.tipo === "shorts", vestido = R.tipo === "vestido";
    const corPerna = (saia || vestido) ? pele : cc;
    const pernas = { c: grupo(quadril), f: grupo(quadril) };
    ["e", "d"].forEach(l => {
      const sx = l === "e" ? -1 : 1;
      const cx = osso(pernas, `translate(${sx * 54} 70)`, `coxa_${l}`, ossos);
      forma(cx, capsula(200, 96, 86), corPerna, shorts ? `<path d="${capsula(118, 96, 92)}" fill="${cc}"/><path d="M -44 112 L 44 112" stroke="${esc(cc, -0.25)}" stroke-width="6"/>` : "");
      if (shorts) cx.c.firstChild && 0;
      const cn = osso(cx, "translate(0 200)", `canela_${l}`, ossos);
      forma(cn, capsula(220, 84, 70), shorts ? pele : corPerna, (!saia && !vestido && !shorts) ? `<path d="M -36 190 L 36 190" stroke="${esc(cc, -0.3)}" stroke-width="6"/>` : "");
      const pe = osso(cn, "translate(0 220)", `tenis_${l}`, ossos);
      const sapato = S.tipo === "sapatilha" ? `M -54 -6 Q -66 34 -44 52 Q 10 60 70 46 Q 84 24 56 6 Q 0 -14 -54 -6 Z`
        : `M -58 -16 Q -72 36 -48 58 Q 10 68 80 54 Q 96 26 64 2 Q 30 -22 -58 -16 Z`;
      const det = S.tipo === "tenis" ? `<path d="M -54 30 Q 10 44 82 34 Q 94 46 82 56 Q 10 68 -48 58 Q -62 46 -54 30 Z" fill="#f6f6f8" stroke="${C}" stroke-width="5"/><path d="M 36 14 Q 66 10 84 30 Q 60 36 40 32 Z" fill="#f6f6f8" stroke="${C}" stroke-width="5"/><path d="M -24 0 L 14 10 M -18 14 L 22 22" stroke="${C}" stroke-width="11" stroke-linecap="round"/><path d="M -24 0 L 14 10 M -18 14 L 22 22" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`
        : S.tipo === "sapatilha" ? `<path d="M 6 4 q 10 -10 20 0 q -10 10 -20 0" fill="${esc(sc, -0.25)}"/>`
          : `<path d="M 0 2 Q 30 18 56 26" stroke="#fff" stroke-width="7" opacity=".35" stroke-linecap="round"/>`;
      forma({ c: grupo(pe.c, `scale(${sx} 1)`), f: grupo(pe.f, `scale(${sx} 1)`) }, sapato, sc, det);
    });
    // ----- quadril / calça / saia -----
    const hp = grupo(quadril);
    if (saia || vestido) {
      const sk = vestido ? rc : cc;
      hp.innerHTML = `<path d="M -118 -10 L 118 -10 L 150 150 Q 0 175 -150 150 Z" fill="${sk}" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M -70 0 L -86 156 M 0 0 L 0 162 M 70 0 L 86 156" stroke="${esc(sk, -0.2)}" stroke-width="6"/>`;
    } else {
      hp.innerHTML = `<path d="M -116 -10 L 116 -10 L 124 104 Q 60 116 6 96 L -6 96 Q -60 116 -124 104 Z" fill="${cc}" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M 0 0 L 0 92" stroke="${esc(cc, -0.3)}" stroke-width="5"/><rect x="-116" y="-10" width="232" height="22" fill="${esc(cc, -0.35)}" stroke="${C}" stroke-width="6"/><rect x="-18" y="-12" width="36" height="26" rx="5" fill="#c9a24a" stroke="${C}" stroke-width="5"/>`;
    }
    // ----- tronco (com braços e cabeça) -----
    const tronco = grupo(quadril); ossos.tronco = [tronco];
    const pesc = grupo(tronco); pesc.innerHTML = `<path d="M -42 -380 L -42 -300 L 42 -300 L 42 -380 Z" fill="${sombraPele}" stroke="${C}" stroke-width="7"/>`;
    const torso = "M -112 -318 Q -150 -312 -152 -262 L -138 22 Q 0 42 138 22 L 152 -262 Q 150 -312 112 -318 Q 60 -334 0 -334 Q -60 -334 -112 -318 Z";
    const tg = grupo(tronco);
    let det = "";
    const T = R.tipo || "camiseta";
    if (T === "terno") {
      const camisa = "#f2f3f6";
      det = `<path d="M -44 -330 L 0 -200 L 44 -330 Z" fill="${camisa}" stroke="${C}" stroke-width="6"/><path d="M -14 -300 L 14 -300 L 22 -200 L 0 -170 L -22 -200 Z" fill="${R.gravata || "#1b1a20"}" stroke="${C}" stroke-width="5"/><path d="M -16 -318 L 16 -318 L 12 -298 L -12 -298 Z" fill="${R.gravata || "#1b1a20"}" stroke="${C}" stroke-width="5"/>
        <path d="M -60 -326 L 0 -150 L -20 -40 L -40 -330 Z M 60 -326 L 0 -150 L 20 -40 L 40 -330 Z" fill="${rcs}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
        <path d="M 0 -150 L 0 30" stroke="${C}" stroke-width="5"/><circle cx="16" cy="-90" r="8" fill="${esc(rc, 0.2)}" stroke="${C}" stroke-width="4"/><circle cx="16" cy="-30" r="8" fill="${esc(rc, 0.2)}" stroke="${C}" stroke-width="4"/>
        <path d="M -118 -40 L -56 -40" stroke="${C}" stroke-width="6" stroke-linecap="round"/><path d="M 56 -40 L 118 -40" stroke="${C}" stroke-width="6" stroke-linecap="round"/><path d="M 66 -230 L 112 -230" stroke="${C}" stroke-width="5"/><path d="M 74 -236 l 10 -16 l 10 16 Z" fill="#f5c542"/>`;
    } else if (T === "social" || T === "jaleco") {
      det = `<path d="M -44 -330 L 0 -290 L 44 -330 L 30 -340 L 0 -318 L -30 -340 Z" fill="#fff" stroke="${C}" stroke-width="6"/><path d="M 0 -300 L 0 30" stroke="${esc(rc, -0.25)}" stroke-width="6"/>` +
        [-250, -190, -130, -70].map(y => `<circle cx="10" cy="${y}" r="6" fill="${esc(rc, -0.3)}"/>`).join("") +
        (R.gravata ? `<path d="M -14 -306 L 14 -306 L 22 -200 L 0 -170 L -22 -200 Z" fill="${R.gravata}" stroke="${C}" stroke-width="5"/>` : "") +
        `<path d="M 50 -230 L 104 -230 L 104 -186 Q 77 -176 50 -186 Z" fill="none" stroke="${esc(rc, -0.25)}" stroke-width="5"/>`;
      if (T === "jaleco") det += `<path d="M -150 -262 L -60 -330 L -10 -60 L -40 30 L -138 22 Z M 150 -262 L 60 -330 L 10 -60 L 40 30 L 138 22 Z" fill="#f7f8fb" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M -60 -320 Q -100 -160 -60 -130 Q -30 -110 -26 -160" fill="none" stroke="#3a3a44" stroke-width="10"/><circle cx="-26" cy="-160" r="14" fill="#9aa0ab" stroke="${C}" stroke-width="5"/><rect x="62" y="-90" width="56" height="50" rx="6" fill="none" stroke="#c9ccd4" stroke-width="5"/>`;
    } else if (T === "blusa" || T === "vestido") {
      det = `<path d="M -54 -330 Q 0 -250 54 -330" fill="${pele}" stroke="${C}" stroke-width="6"/><path d="M -120 -150 Q 0 -126 120 -150" stroke="${rcs}" stroke-width="8" fill="none" opacity=".7"/>`;
    } else { // camiseta
      det = `<path d="M -54 -332 Q 0 -290 54 -332" fill="${pele}" stroke="${C}" stroke-width="6"/><path d="M -62 -334 Q 0 -280 62 -334" fill="none" stroke="${rcs}" stroke-width="9"/>`;
    }
    if (R.cracha) det += `<path d="M -40 -300 L -70 -150 M -100 -296 L -70 -150" stroke="#3a64b0" stroke-width="7"/><rect x="-98" y="-156" width="56" height="70" rx="6" fill="#fff" stroke="${C}" stroke-width="5"/><circle cx="-70" cy="-130" r="10" fill="#9aa0ab"/><path d="M -88 -104 h 36" stroke="#9aa0ab" stroke-width="5"/>`;
    if (X.fone) det += `<path d="M 150 -400 Q 120 -330 92 -300 Q 70 -270 84 -240" fill="none" stroke="#e8e9ee" stroke-width="5"/><path d="M 150 -400 Q 120 -330 92 -300 Q 70 -270 84 -240" fill="none" stroke="#9aa0ab" stroke-width="2" stroke-dasharray="6 6"/>`;
    tg.innerHTML = `<path d="${torso}" fill="${rc}" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M -138 22 Q 0 42 138 22 L 140 0 Q 0 20 -140 0 Z" fill="${rcs}"/><path d="M -150 -262 Q -146 -200 -120 -180" stroke="${rcs}" stroke-width="10" fill="none" opacity=".6"/>${det}`;
    // braços (duas passadas cada), na frente do tronco e atrás da cabeça
    const bracos = { c: grupo(tronco), f: grupo(tronco) };
    const maoV = { e: {}, d: {} };
    const longa = R.manga === "longa" || T === "terno" || T === "jaleco";
    const corManga = T === "jaleco" ? "#f7f8fb" : rc, punho = T === "terno" ? "#f2f3f6" : esc(corManga, -0.12);
    ["e", "d"].forEach(l => {
      const sx = l === "e" ? -1 : 1;
      const b = osso(bracos, `translate(${sx * 128} -282) rotate(${sx * -8})`, `braco_${l}`, ossos);
      const mangaCurta = !longa && T !== "vestido_alca";
      forma(b, capsula(190, 70, 60), longa ? corManga : pele,
        mangaCurta ? `<path d="M -42 -30 Q 0 -44 42 -30 L 46 84 Q 0 96 -46 84 Z" fill="${corManga}"/><path d="M -46 80 Q 0 92 46 80" stroke="${esc(corManga, -0.25)}" stroke-width="7" fill="none"/>` : `<path d="M -26 40 Q -30 110 -24 160" stroke="${esc(corManga, -0.15)}" stroke-width="8" fill="none"/>`);
      if (mangaCurta) b.c.insertAdjacentHTML("afterbegin", `<path d="M -42 -30 Q 0 -44 42 -30 L 46 84 Q 0 96 -46 84 Z" fill="${C}" stroke="${C}" stroke-width="${LW * 2}" stroke-linejoin="round"/>`);
      const a = osso(b, `translate(0 190) rotate(${sx * 6})`, `antebraco_${l}`, ossos);
      forma(a, capsula(160, 60, 52), longa ? corManga : pele, longa ? `<path d="M -30 128 L 30 128 L 30 152 Q 0 158 -30 152 Z" fill="${punho}"/><path d="M -30 128 L 30 128" stroke="${C}" stroke-width="5"/>` : "");
      const m = osso(a, "translate(0 160)", `mao_${l}`, ossos);
      maoV[l] = maos(m, pele, l);
    });
    // ----- cabeça -----
    const cabecaPos = grupo(tronco, "translate(0 -330)"); const cabeca = grupo(cabecaPos); const cab = grupo(cabeca, "translate(0 330)"); ossos.cabeca = [cabeca];
    const V = D.cabeca_vetor && window.CABECAS && window.CABECAS[D.cabeca_vetor];
    let camadas;
    if (V) {
      // cabeça vetorizada do original (cabelo, barba, rosto, orelhas e óculos idênticos); olhos, sobrancelhas e boca animáveis por cima
      V.camadas.forEach(c => el("path", { d: c.d, fill: c.cor, "fill-rule": "evenodd" }, cab));
      const faceG = grupo(cab);
      camadas = rosto(faceG, D, pele);
    } else {
    cabelo(cab, D, "tras");
    cab.insertAdjacentHTML("beforeend", `<circle cx="-205" cy="-540" r="42" fill="${pele}" stroke="${C}" stroke-width="7"/><circle cx="205" cy="-540" r="42" fill="${pele}" stroke="${C}" stroke-width="7"/><path d="M -205 -555 q 14 10 0 30 M 205 -555 q -14 10 0 30" stroke="${sombraPele}" stroke-width="7" fill="none"/>
      <path d="M -200 -620 Q -205 -780 0 -790 Q 205 -780 200 -620 L 196 -500 Q 180 -380 0 -352 Q -180 -380 -196 -500 Z" fill="${pele}" stroke="${C}" stroke-width="8" stroke-linejoin="round"/>
      <ellipse cx="-128" cy="-470" rx="34" ry="20" fill="#e88a8a" opacity=".35"/><ellipse cx="128" cy="-470" rx="34" ry="20" fill="#e88a8a" opacity=".35"/>
      <path d="M -14 -492 Q 0 -478 16 -492" fill="none" stroke="${sombraPele}" stroke-width="8" stroke-linecap="round"/>`);
    const faceG = grupo(cab);
    camadas = rosto(faceG, D, pele);
    if (X.barba) {
      const bc = X.barba_cor || (D.cabelo && D.cabelo.cor) || "#2b2522";
      const serra = () => { let d = ""; const n = 26; for (let i = 0; i <= n; i++) { const a = Math.PI * i / n, r = i % 2 ? 1.0 : 1.075; const x = 204 * Math.cos(a) * (i % 2 ? 0.985 : 1.02), y = -500 + 166 * Math.sin(a) * r; d += (i ? " L " : "M ") + x.toFixed(1) + " " + y.toFixed(1); }
        return d + " Q -196 -420 -150 -410 Q -110 -420 -84 -468 Q -40 -496 0 -478 Q 40 -496 84 -468 Q 110 -420 150 -410 Q 196 -420 204 -500 Z M -46 -446 Q 0 -456 46 -446 Q 42 -414 0 -410 Q -42 -414 -46 -446 Z"; };
      const B = { principal: serra(), cheia: `M -198 -520 Q -196 -390 -110 -350 Q 0 -310 110 -350 Q 196 -390 198 -520 Q 170 -440 120 -430 Q 60 -470 0 -470 Q -60 -470 -120 -430 Q -170 -440 -198 -520 Z M -52 -452 Q 0 -464 52 -452 Q 50 -410 0 -404 Q -50 -410 -52 -452 Z`,
        bigode: `M -70 -462 Q -40 -486 0 -472 Q 40 -486 70 -462 Q 40 -452 0 -458 Q -40 -452 -70 -462 Z`,
        cavanhaque: `M -44 -410 Q 0 -400 44 -410 Q 40 -350 0 -340 Q -40 -350 -44 -410 Z M -60 -462 Q -30 -482 0 -470 Q 30 -482 60 -462 Q 30 -454 0 -458 Q -30 -454 -60 -462 Z` };
      faceG.insertAdjacentHTML("afterbegin", `<path d="${B[X.barba] || B.cheia}" fill="${bc}" stroke="${C}" stroke-width="6" fill-rule="evenodd" stroke-linejoin="round"/>`);
    }
    cabelo(cab, D, "frente");
    if (X.oculos === "sol") cab.insertAdjacentHTML("beforeend", `<path d="M -150 -580 L 150 -580" stroke="#1b1a20" stroke-width="12"/><path d="M -150 -584 L -30 -584 Q -24 -520 -60 -505 Q -130 -500 -146 -540 Z M 150 -584 L 30 -584 Q 24 -520 60 -505 Q 130 -500 146 -540 Z" fill="#1f1e26" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M -120 -572 L -80 -572 M 60 -572 L 100 -572" stroke="#5c5b6a" stroke-width="8" stroke-linecap="round"/><path d="M -150 -580 L -200 -560 M 150 -580 L 200 -560" stroke="#1b1a20" stroke-width="10"/>`);
    if (X.oculos === "redondo") cab.insertAdjacentHTML("beforeend", `<circle cx="-88" cy="-545" r="62" fill="none" stroke="#3a2a22" stroke-width="9"/><circle cx="88" cy="-545" r="62" fill="none" stroke="#3a2a22" stroke-width="9"/><path d="M -26 -548 Q 0 -560 26 -548 M -150 -550 L -200 -560 M 150 -550 L 200 -560" stroke="#3a2a22" stroke-width="8" fill="none"/>`);
    }
    // preparar giros nas juntas (0,0 de cada osso)
    Object.values(ossos).flat().forEach(g => gsap.set(g, { svgOrigin: "0 0" }));
    gsap.set(cabeca, { svgOrigin: "0 0" });
    return { ossos, camadas, maos: maoV };
  }

  window.PessoaSVG = { construir, PELES };
  window.RIGS = window.RIGS || {};
})();
