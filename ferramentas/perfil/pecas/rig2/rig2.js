/* Rig 2.0 (canal recriar): personagem recortado por articulações, hierárquico, para HyperFrames + GSAP.
 * Tudo é função do tempo da timeline (sem timers, sem Math.random sem semente).
 *
 * Definição (window.RIGS[nome]): { base, escala, ossos: [ {nome, img, ancora:[x,y], pai, em:[x,y], z} ], rosto: {...}, maos: {...} }
 *   - img: caminho relativo a base; ancora: ponto de giro na imagem (px da imagem);
 *   - em: onde o osso se prende na imagem do pai (px da imagem do pai); z: ordem dentro do pai (negativo = atrás do pai).
 *   - O osso raiz (sem pai) fica com a âncora no ponto (0,0) do host: o host marca o ponto entre os pés... ver "pe".
 *
 * const p = Rig2.criar(hostEl, "principal", {id:"p1", escala:0.5});
 * p.pose(tl, t, {braco_e:-20, antebraco_e:-30}, dur, ease)   ângulos em graus por osso
 * p.mao(tl, t, "e"|"d", "apontando")                          troca a mão (kit_modular/maos)
 * p.olhos(tl, t, "abertos"|"semicerrados"|"fechados"|"piscadela")
 * p.sobrancelhas(tl, t, "neutras"|"levantadas"|"bravas"|"preocupadas")
 * p.boca(tl, t, nome)                                          fechada|pequena|media|A|O|E|sorriso|sorriso_aberto
 * p.expressao(tl, t, "neutro"|"feliz"|"surpreso"|"bravo"|"preocupado"|"desconfiado")
 * p.piscar(tl, t0, t1, semente) | p.respirar(tl, t0, t1) | p.falar(tl, palavras, t0)  palavras: [{palavra, ini, fim}]
 * p.andar(tl, t0, t1, x0, x1) | p.parar(tl, t) | p.gesto(tl, t, nome, lado)  apontar|acenar|joinha|mao_aberta|celular|pensar|comemorar|susto
 */
(function () {
  function rnd(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const F = { immediateRender: false, lazy: false };

  function criar(host, nome, op = {}) {
    const D = window.RIGS[nome], id = op.id || nome;
    const base = [op.base || "", D.base && D.base !== "." ? D.base : ""].filter(Boolean).map(x => x.replace(/\/$/, "")).join("/") + "/";
    const esc = (op.escala || 1) * (D.escala || 1);
    host.style.position = "absolute";
    if (D.tipo === "svg") return criarSVG(host, D, op, id);
    const raiz = document.createElement("div");
    raiz.style.cssText = `position:absolute;left:0;top:0;transform-origin:0 0;transform:scale(${esc})`;
    host.appendChild(raiz);
    const osso = {}, imgs = {};
    const porNome = Object.fromEntries(D.ossos.map(o => [o.nome, o]));
    function img(src, ancora, z, pai, e = 1, esp = false) {
      const im = document.createElement("img");
      im.src = base + src; im.draggable = false;
      im.style.cssText = `position:absolute;left:0;top:0;z-index:${z || 0};transform-origin:0 0;transform:scale(${esp ? -e : e},${e}) translate(${-ancora[0]}px,${-ancora[1]}px);`;
      pai.appendChild(im); return im;
    }
    // cria na ordem da lista (pai antes do filho)
    D.ossos.forEach(o => {
      const d = document.createElement("div");
      d.id = `${id}-${o.nome}`;
      const pai = o.pai ? osso[o.pai] : raiz, defPai = o.pai ? porNome[o.pai] : null;
      const ep = defPai ? (defPai.escala || 1) : 1;
      const sx = defPai && defPai.espelho ? -1 : 1;
      const x = o.pai ? (o.em[0] - defPai.ancora[0]) * ep * sx : (o.em ? o.em[0] : 0), y = o.pai ? (o.em[1] - defPai.ancora[1]) * ep : (o.em ? o.em[1] : 0);
      d.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:0;height:0;transform-origin:0 0;z-index:${o.z || 0};`;
      pai.appendChild(d); osso[o.nome] = d;
      if (o.img) imgs[o.nome] = img(o.img, o.ancora, 0, d, o.escala || 1, !!o.espelho);
    });
    // rosto: camadas trocáveis presas ao osso da cabeça
    const R = D.rosto, cab = osso[R.osso], defCab = porNome[R.osso];
    const camadas = {};
    function camada(grupo, variantes, cfg) {
      camadas[grupo] = {};
      Object.entries(variantes).forEach(([v, src]) => {
        const lista = Array.isArray(src) ? src : [src];
        const g = document.createElement("div");
        g.style.cssText = `position:absolute;left:0;top:0;z-index:${cfg.z || 5};opacity:0;`;
        lista.forEach((s, i) => {
          const c = Array.isArray(cfg.pos[0]) ? cfg.pos[i] : cfg.pos;   // posição no px da cabeça
          const a = Array.isArray(cfg.ancora[0]) ? cfg.ancora[i] : cfg.ancora; // ponto da imagem que vai na posição
          const im = document.createElement("img"); im.src = base + s;
          const he = defCab.escala || 1;
          im.style.cssText = `position:absolute;left:0;top:0;transform-origin:0 0;transform:translate(${(c[0] - defCab.ancora[0]) * he}px,${(c[1] - defCab.ancora[1]) * he}px) scale(${cfg.escala * he}) translate(${-a[0]}px,${-a[1]}px);`;
          g.appendChild(im);
        });
        cab.appendChild(g); camadas[grupo][v] = g;
      });
    }
    camada("olhos", R.olhos, R.cfg_olhos);
    camada("sobrancelhas", R.sobrancelhas, R.cfg_sobrancelhas);
    camada("boca", R.bocas, R.cfg_boca);
    // mãos trocáveis
    const maos = { e: {}, d: {} };
    if (D.maos) ["e", "d"].forEach(l => {
      const ossoMao = osso[D.maos.osso[l]], defM = porNome[D.maos.osso[l]];
      Object.entries(D.maos.variantes).forEach(([v, cfg]) => {
        const g = document.createElement("div"); g.style.cssText = "position:absolute;left:0;top:0;opacity:0;";
        const im = document.createElement("img"); im.src = (cfg.base ? cfg.base.replace(/\/$/, "") + "/" : base) + cfg.img;
        const s = cfg.escala || 1, fx = l === D.maos.espelhar ? -1 : 1, rot = cfg.rot || 0;
        im.style.cssText = `position:absolute;left:0;top:0;transform-origin:0 0;transform:translate(${(D.maos.punho[l][0])}px,${(D.maos.punho[l][1])}px) scale(${fx},1) rotate(${rot}deg) scale(${s}) translate(${-cfg.ancora[0]}px,${-cfg.ancora[1]}px);`;
        g.appendChild(im); ossoMao.appendChild(g); maos[l][v] = g;
      });
    });

    return fazerApi({ host, D, osso, camadas, maos, imgs, R, iniciarExtra: null });
  }

  function fazerApi({ host, D, osso, camadas, maos, imgs, R }) {
    const estado = { olhos: R.padrao.olhos, sobrancelhas: R.padrao.sobrancelhas, boca: R.padrao.boca };
    function mostra(tl, t, grupo, v) {
      const g = camadas[grupo];
      if (!g[v]) { console.warn("rig2: sem", grupo, v); return; }
      Object.entries(g).forEach(([k, el]) => tl.set(el, { opacity: k === v ? 1 : 0 }, t));
    }
    // estado inicial (no tempo 0)
    function iniciar(tl) {
      Object.entries(camadas).forEach(([grupo, g]) => Object.entries(g).forEach(([k, el]) => tl.set(el, { opacity: k === estado[grupo] ? 1 : 0 }, 0)));
      D.ossos.forEach(o => tl.set(osso[o.nome], { rotation: (D.pose0 && D.pose0[o.nome]) || 0, x: 0, y: 0 }, 0));
      if (D.maos) ["e", "d"].forEach(l => {
        const alvo = maos[l][D.maos.padrao];
        new Set(Object.values(maos[l])).forEach(g => tl.set(g, { opacity: g === alvo ? 1 : 0 }, 0));
        if (imgs[D.maos.osso[l]]) tl.set(imgs[D.maos.osso[l]], { opacity: D.maos.padrao ? 0 : 1 }, 0);
      });
      tl.set(host, { x: 0, y: 0 }, 0);
    }

    const api = {
      el: osso, host, def: D, iniciar,
      pose(tl, t, angulos, dur = 0.25, ease = "back.out(1.4)") {
        Object.entries(angulos).forEach(([n, a]) => {
          if (!osso[n]) return;
          if (typeof a === "object") tl.to(osso[n], { ...a, duration: dur, ease, ...F }, t);
          else tl.to(osso[n], { rotation: a, duration: dur, ease, ...F }, t);
        });
      },
      mao(tl, t, lado, v) {
        if (!v && D.maos.padrao) v = D.maos.padrao;
        const om = imgs[D.maos.osso[lado]];
        const alvo = maos[lado][v];  // vários nomes podem apontar para o mesmo desenho: acende pelo desenho, não pelo nome
        new Set(Object.values(maos[lado])).forEach(g => tl.set(g, { opacity: g === alvo ? 1 : 0 }, t));
        if (om) tl.set(om, { opacity: v && maos[lado][v] ? 0 : 1 }, t);
      },
      olhos(tl, t, v) { mostra(tl, t, "olhos", v); },
      sobrancelhas(tl, t, v) { mostra(tl, t, "sobrancelhas", v); },
      boca(tl, t, v) { mostra(tl, t, "boca", v); },
      expressao(tl, t, nome) {
        const E = D.expressoes[nome]; if (!E) return;
        if (E.sobrancelhas) mostra(tl, Math.max(0, t - 0.07), "sobrancelhas", E.sobrancelhas); // antecipa
        if (E.olhos) mostra(tl, t, "olhos", E.olhos);
        if (E.boca) mostra(tl, t, "boca", E.boca);
        // pequeno pulo de cabeça na troca
        tl.to(osso[R.osso], { y: -10, duration: 0.08, ease: "power2.out", ...F }, t);
        tl.to(osso[R.osso], { y: 0, duration: 0.2, ease: "back.out(3)", ...F }, t + 0.08);
      },
      piscar(tl, t0, t1, semente = 1, aberto = "abertos") {
        const r = rnd(semente); let t = t0 + 0.4 + r() * 1.5;
        while (t < t1 - 0.3) {
          mostra(tl, t, "olhos", "semicerrados"); mostra(tl, t + 1 / 30, "olhos", "fechados");
          mostra(tl, t + 3 / 30, "olhos", "semicerrados"); mostra(tl, t + 4 / 30, "olhos", aberto);
          t += 2 + r() * 3;
        }
      },
      respirar(tl, t0, t1, ciclo = 2.6) {
        const tr = osso[D.respirar.osso], cb = osso[R.osso];
        for (let t = t0; t < t1 - 0.05; t += ciclo) {
          const d = Math.min(ciclo / 2, t1 - t);
          tl.to(tr, { scaleY: 1.018, duration: d, ease: "sine.inOut", ...F }, t);
          tl.to(tr, { scaleY: 1, duration: Math.min(ciclo / 2, t1 - t - d), ease: "sine.inOut", ...F }, t + d);
          tl.to(cb, { y: -4, duration: d, ease: "sine.inOut", ...F }, t + 0.06);
          tl.to(cb, { y: 0, duration: Math.min(ciclo / 2, t1 - t - d), ease: "sine.inOut", ...F }, t + d + 0.06);
        }
      },
      falar(tl, palavras, t0 = 0) {
        // vogal dominante de cada sílaba aproximada: troca de boca a ~8-10 por segundo, fechada nas pausas > 0,15 s
        const forma = c => /[aáàãâ]/i.test(c) ? "A" : /[oóõôu]/i.test(c) ? "O" : /[eéêií]/i.test(c) ? "E" : /[mbp]/i.test(c) ? "fechada" : "media";
        let ult = -1;
        palavras.forEach((w, i) => {
          const a = t0 + w.ini, b = t0 + w.fim, txt = (w.palavra || w.w || "").replace(/[^a-záàãâéêíóõôúç]/gi, "");
          const vog = txt.match(/[aáàãâeéêiíoóõôuú]+|[mbp]/gi) || ["a"];
          const passo = Math.max(0.1, (b - a) / vog.length);
          vog.forEach((v, k) => {
            const t = a + k * passo; if (t - ult < 0.085) return;
            mostra(tl, t, "boca", forma(v)); ult = t;
          });
          const prox = palavras[i + 1];
          if (!prox || prox.ini - w.fim > 0.15) { mostra(tl, b, "boca", "fechada"); ult = b; }
          else if (k2(vog.length) && b - ult > 0.12) { mostra(tl, b - 0.04, "boca", "pequena"); ult = b - 0.04; }
        });
        function k2() { return true; }
      },
      andar(tl, t0, t1, x0, x1, passo = 0.34) {
        // vista de frente: pernas alternam, corpo quica, braços balançam ao contrário, leve gingado
        const W = D.andar, n = Math.max(2, Math.round((t1 - t0) / passo));
        tl.fromTo(host, { x: x0 }, { x: x1, duration: t1 - t0, ease: "none", ...F }, t0);
        for (let i = 0; i < n; i++) {
          const t = t0 + i * passo, lado = i % 2 ? "d" : "e", outro = i % 2 ? "e" : "d";
          tl.to(osso[W.coxa[lado]], { rotation: W.coxa_ang * (lado === "e" ? 1 : -1), duration: passo / 2, ease: "sine.out", ...F }, t);
          tl.to(osso[W.canela[lado]], { rotation: -W.canela_ang * (lado === "e" ? 1 : -1), y: -W.levanta, duration: passo / 2, ease: "sine.out", ...F }, t);
          tl.to(osso[W.coxa[lado]], { rotation: 0, duration: passo / 2, ease: "sine.in", ...F }, t + passo / 2);
          tl.to(osso[W.canela[lado]], { rotation: 0, y: 0, duration: passo / 2, ease: "sine.in", ...F }, t + passo / 2);
          tl.to(osso[W.braco[outro]], { rotation: W.braco_ang * (outro === "e" ? 1 : -1), duration: passo, ease: "sine.inOut", ...F }, t);
          tl.to(osso[W.corpo], { y: -W.quique, rotation: (lado === "e" ? 1 : -1) * W.ginga, duration: passo / 2, ease: "sine.out", ...F }, t);
          tl.to(osso[W.corpo], { y: 0, duration: passo / 2, ease: "sine.in", ...F }, t + passo / 2);
          tl.to(osso[R.osso], { rotation: (lado === "e" ? -1 : 1) * W.ginga * 0.6, duration: passo, ease: "sine.inOut", ...F }, t + 0.05); // cabeça atrasada
        }
        // braços voltam junto com o último passo (antes de qualquer gesto marcado depois do andar)
        const fimBracos = t0 + (n - 1) * passo + passo / 2;
        Object.values(W.braco).forEach(b => tl.to(osso[b], { rotation: 0, duration: passo / 2, ease: "sine.out", ...F }, fimBracos));
        api.parar(tl, t0 + n * passo);
      },
      parar(tl, t) {
        const W = D.andar;
        [...Object.values(W.coxa), ...Object.values(W.canela), W.corpo, R.osso].forEach(n =>
          tl.to(osso[n], { rotation: (D.pose0 && D.pose0[n]) || 0, y: 0, duration: 0.22, ease: "back.out(2)", ...F }, t));
      },
      gesto(tl, t, nome, lado = "d", dur = 1.2) {
        const G = D.gestos[nome]; if (!G) return;
        const s = lado === "e" ? 1 : -1, b = D.andar.braco[lado], a = G.antebraco_osso ? G.antebraco_osso[lado] : D.gestos._antebraco[lado];
        // antecipação curta para o lado oposto, depois a pose com passada
        tl.to(osso[b], { rotation: -s * 6, duration: 0.07, ease: "power2.out", ...F }, t - 0.07);
        tl.to(osso[b], { rotation: s * G.braco, duration: 0.22, ease: "back.out(1.8)", ...F }, t);
        tl.to(osso[a], { rotation: s * G.antebraco, duration: 0.24, ease: "back.out(1.8)", ...F }, t + 0.03);
        if (G.mao) api.mao(tl, t + 0.06, lado, G.mao);
        if (G.balanca) for (let k = 0; k < G.balanca.vezes; k++) {
          tl.to(osso[a], { rotation: s * (G.antebraco + G.balanca.ang), duration: 0.14, ease: "sine.inOut", ...F }, t + 0.25 + k * 0.28);
          tl.to(osso[a], { rotation: s * G.antebraco, duration: 0.14, ease: "sine.inOut", ...F }, t + 0.39 + k * 0.28);
        }
        if (G.cabeca) tl.to(osso[R.osso], { rotation: s * G.cabeca, duration: 0.25, ease: "back.out(2)", ...F }, t + 0.04);
        if (dur > 0) {
          tl.to([osso[b], osso[a]], { rotation: 0, duration: 0.25, ease: "power2.inOut", ...F }, t + dur);
          if (G.mao) api.mao(tl, t + dur + 0.12, lado, null);
          if (G.cabeca) tl.to(osso[R.osso], { rotation: 0, duration: 0.25, ease: "power2.inOut", ...F }, t + dur);
        }
      },
    };
    return api;
  }

  const PADRAO_SVG = {
    expressoes: { neutro: { olhos: "abertos", sobrancelhas: "neutras", boca: "fechada" }, feliz: { olhos: "abertos", sobrancelhas: "levantadas", boca: "sorriso_aberto" },
      surpreso: { olhos: "abertos", sobrancelhas: "levantadas", boca: "O" }, bravo: { olhos: "semicerrados", sobrancelhas: "bravas", boca: "fechada" },
      preocupado: { olhos: "abertos", sobrancelhas: "preocupadas", boca: "pequena" }, desconfiado: { olhos: "semicerrados", sobrancelhas: "neutras", boca: "sorriso" } },
    andar: { coxa: { e: "coxa_e", d: "coxa_d" }, canela: { e: "canela_e", d: "canela_d" }, braco: { e: "braco_e", d: "braco_d" }, corpo: "quadril", coxa_ang: 12, canela_ang: 8, levanta: 16, braco_ang: 10, quique: 9, ginga: 2 },
    gestos: { _antebraco: { e: "antebraco_e", d: "antebraco_d" }, apontar: { braco: 80, antebraco: 6, mao: "apontando" }, acenar: { braco: 140, antebraco: 22, mao: "acenando", balanca: { ang: 16, vezes: 3 }, cabeca: 4 },
      joinha: { braco: 35, antebraco: 95, mao: "joinha", cabeca: 3 }, mao_aberta: { braco: 30, antebraco: 70, mao: "palma_frente" }, celular: { braco: 20, antebraco: 125, mao: "segura_celular" },
      pensar: { braco: 15, antebraco: 145, mao: "punho", cabeca: 6 }, comemorar: { braco: 128, antebraco: 38, mao: "punho", cabeca: -3 }, susto: { braco: 115, antebraco: 40, mao: "aberta" } },
  };
  function criarSVG(host, D, op, id) {
    const S = window.PessoaSVG.construir(host, D, op);
    Object.keys(PADRAO_SVG).forEach(k => { if (!D[k]) D[k] = PADRAO_SVG[k]; });
    D.ossos = Object.keys(S.ossos).map(nome => ({ nome }));
    D.rosto = { osso: "cabeca", padrao: { olhos: "abertos", sobrancelhas: "neutras", boca: "fechada" } };
    D.maos = { osso: { e: "mao_e", d: "mao_d" }, padrao: "relaxada" };
    D.respirar = { osso: "tronco" };
    if (!D.pe) D.pe = 552;  // quadril 70 + coxa 200 + canela 220 + sola do sapato ~62
    return fazerApi({ host, D, osso: S.ossos, camadas: S.camadas, maos: S.maos, imgs: {}, R: D.rosto });
  }
  window.Rig2 = { criar, rnd };
  window.RIGS = window.RIGS || {};
})();
