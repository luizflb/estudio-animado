/* Cenarios detalhados em SVG (biblioteca do canal). 1920x1080, camadas separadas em <g id="...-fundo|-meio|-frente">
 * para parallax e para o personagem passar entre elas. Texto em portugues de verdade (fonte Nunito). */
(function () {
  const C = (window.ESTILO && window.ESTILO.contorno) || "#2E2A33";
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";

  const nuvem = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 40 Q0 10 30 12 Q40 -14 72 0 Q96 -10 110 14 Q140 14 138 40 Z" fill="#fff" stroke="${C}" stroke-width="4" stroke-linejoin="round"/></g>`;
  const passaro = (x, y, f = 1) => `<g transform="translate(${x} ${y}) scale(${f} 1)"><ellipse cx="0" cy="0" rx="16" ry="12" fill="#6d6a7a" stroke="${C}" stroke-width="3"/><circle cx="12" cy="-10" r="8" fill="#6d6a7a" stroke="${C}" stroke-width="3"/><circle cx="14" cy="-12" r="2" fill="${C}"/><path d="M19 -10 L26 -8 L19 -6 Z" fill="#f2b33d" stroke="${C}" stroke-width="1.5"/><path d="M-14 -2 L-26 4 L-14 6 Z" fill="#5a576a" stroke="${C}" stroke-width="2"/><path d="M-2 11 L-2 18 M4 11 L4 18" stroke="${C}" stroke-width="2.5"/></g>`;

  function toldo(x, y, w, c1, c2) {
    const n = Math.round(w / 60), lw = w / n;
    let s = `<rect x="${x}" y="${y}" width="${w}" height="34" fill="${c1}" stroke="${C}" stroke-width="5"/>`;
    for (let i = 0; i < n; i++) {
      const cor = i % 2 ? c2 : c1, xi = x + i * lw;
      s += `<path d="M${xi} ${y} L${xi + lw} ${y} L${xi + lw} ${y + 34} A${lw / 2} ${lw / 2} 0 0 1 ${xi} ${y + 34} Z" fill="${cor}" stroke="${C}" stroke-width="4" stroke-linejoin="round"/>`;
    }
    return s + `<rect x="${x}" y="${y - 6}" width="${w}" height="10" fill="${C}" opacity="0.25"/>`;
  }
  function janela(x, y, w, h, o = {}) {
    let s = `<rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" rx="4" fill="${o.moldura || "#f4efe4"}" stroke="${C}" stroke-width="4"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#bfe1ee" stroke="${C}" stroke-width="4"/>
      <path d="M${x + w * 0.15} ${y + h * 0.75} L${x + w * 0.5} ${y + h * 0.1}" stroke="#fff" stroke-width="10" opacity="0.6"/>
      <path d="M${x + w / 2} ${y} L${x + w / 2} ${y + h} M${x} ${y + h * 0.45} L${x + w} ${y + h * 0.45}" stroke="${C}" stroke-width="4"/>`;
    if (o.cortina) s += `<path d="M${x + 4} ${y + 4} Q${x + w * 0.22} ${y + h * 0.5} ${x + 6} ${y + h - 4} L${x + 4} ${y + h - 4} Z" fill="${o.cortina}" stroke="${C}" stroke-width="3"/><path d="M${x + w - 4} ${y + 4} Q${x + w * 0.78} ${y + h * 0.5} ${x + w - 6} ${y + h - 4} L${x + w - 4} ${y + h - 4} Z" fill="${o.cortina}" stroke="${C}" stroke-width="3"/>`;
    if (o.vaso) s += `<rect x="${x + 6}" y="${y + h - 4}" width="${w - 12}" height="22" fill="#c96b4a" stroke="${C}" stroke-width="3"/>` + [0.2, 0.45, 0.7].map(f => `<circle cx="${x + w * f}" cy="${y + h - 12}" r="16" fill="#6fae5a" stroke="${C}" stroke-width="3"/><circle cx="${x + w * f}" cy="${y + h - 18}" r="5" fill="#e2544f"/>`).join("");
    if (o.arcond) s += `<rect x="${x + w + 14}" y="${y + h * 0.4}" width="70" height="44" rx="5" fill="#e9ebef" stroke="${C}" stroke-width="4"/><path d="M${x + w + 22} ${y + h * 0.4 + 14} h54 M${x + w + 22} ${y + h * 0.4 + 24} h54 M${x + w + 22} ${y + h * 0.4 + 34} h54" stroke="#9aa0ab" stroke-width="3"/>`;
    return s;
  }
  function predio(x, w, topo, cor, o = {}) {
    let s = `<rect x="${x}" y="${topo}" width="${w}" height="${640 - topo}" fill="${cor}" stroke="${C}" stroke-width="5"/>
      <rect x="${x - 10}" y="${topo - 18}" width="${w + 20}" height="22" fill="${Objetos.esc(cor, -0.2)}" stroke="${C}" stroke-width="5"/>
      <path d="M${x + 5} ${topo + 10} L${x + w - 5} ${topo + 10}" stroke="${Objetos.esc(cor, -0.08)}" stroke-width="10"/>`;
    // tijolinhos aparentes
    for (let i = 0; i < 6; i++) { const bx = x + 30 + ((i * 97) % (w - 80)), by = topo + 40 + ((i * 53) % 160); s += `<rect x="${bx}" y="${by}" width="34" height="14" rx="2" fill="none" stroke="${Objetos.esc(cor, -0.15)}" stroke-width="3"/>`; }
    const jw = 110, jh = 120, y = topo + 60;
    s += janela(x + 70, y, jw, jh, o.j1 || {});
    s += janela(x + w - 70 - jw, y, jw, jh, o.j2 || {});
    return s;
  }
  function placa(x, y, w, h, fundo, texto, sub, corTxt = "#fff8e6", tam = 54) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fundo}" stroke="${C}" stroke-width="5"/>
      <rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" rx="6" fill="none" stroke="${Objetos.esc(fundo, 0.25)}" stroke-width="3"/>
      <text x="${x + w / 2}" y="${y + h * (sub ? 0.56 : 0.66)}" text-anchor="middle" style="${F};font-size:${tam}px" fill="${corTxt}" stroke="${C}" stroke-width="2">${texto}</text>
      ${sub ? `<text x="${x + w / 2}" y="${y + h * 0.86}" text-anchor="middle" style="${F};font-size:22px;letter-spacing:2px" fill="${corTxt}">${sub}</text>` : ""}`;
  }
  const pao = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="34" ry="18" fill="#e3a656" stroke="${C}" stroke-width="3"/><path d="M-18 -6 l8 8 M-4 -10 l8 8 M10 -8 l8 8" stroke="#b9772f" stroke-width="3" stroke-linecap="round"/></g>`;
  function vitrinePadaria(x, y) {
    let s = `<rect x="${x}" y="${y}" width="250" height="150" fill="#cfe8f1" stroke="${C}" stroke-width="5"/>
      <rect x="${x}" y="${y + 92}" width="250" height="10" fill="#d9b48a" stroke="${C}" stroke-width="3"/>`;
    s += pao(x + 50, y + 80) + pao(x + 110, y + 82, 0.9) + pao(x + 80, y + 64, 0.85);
    s += `<g transform="translate(${x + 190} ${y + 30})"><rect x="-38" y="30" width="76" height="30" fill="#f7c6d0" stroke="${C}" stroke-width="3"/><rect x="-30" y="6" width="60" height="26" fill="#f9dbe1" stroke="${C}" stroke-width="3"/><path d="M-30 6 q10 10 20 0 q10 10 20 0 q10 10 20 0" fill="#fff" stroke="${C}" stroke-width="3"/><circle cx="0" cy="-2" r="7" fill="#d9534f" stroke="${C}" stroke-width="3"/></g>`;
    s += pao(x + 60, y + 128, 0.7) + pao(x + 130, y + 128, 0.7) + pao(x + 200, y + 128, 0.7);
    return s + `<path d="M${x + 20} ${y + 70} L${x + 70} ${y + 10}" stroke="#fff" stroke-width="10" opacity="0.5"/>`;
  }
  function vitrineFarmacia(x, y) {
    let s = `<rect x="${x}" y="${y}" width="250" height="150" fill="#dff1ec" stroke="${C}" stroke-width="5"/>`;
    const cores = ["#e2544f", "#4a90d9", "#f5c542", "#6fae5a", "#b07cc6", "#f29e4c"];
    for (let r = 0; r < 3; r++) { s += `<rect x="${x + 10}" y="${y + 40 + r * 42}" width="230" height="6" fill="#b9c6c2" stroke="${C}" stroke-width="2"/>`; for (let i = 0; i < 9; i++) s += `<rect x="${x + 16 + i * 25}" y="${y + 14 + r * 42}" width="18" height="26" rx="2" fill="${cores[(i + r * 2) % 6]}" stroke="${C}" stroke-width="2"/>`; }
    return s + `<path d="M${x + 20} ${y + 120} L${x + 90} ${y + 10}" stroke="#fff" stroke-width="10" opacity="0.5"/>`;
  }
  function porta(x, y, cor, plaqa) {
    return `<rect x="${x}" y="${y}" width="120" height="${640 - y}" fill="${cor}" stroke="${C}" stroke-width="5"/>
      <rect x="${x + 16}" y="${y + 16}" width="88" height="${(640 - y) * 0.55}" fill="#cfe8f1" stroke="${C}" stroke-width="4"/>
      <circle cx="${x + 100}" cy="${y + (640 - y) * 0.68}" r="7" fill="#f5c542" stroke="${C}" stroke-width="3"/>
      ${plaqa ? `<rect x="${x + 22}" y="${y + 40}" width="76" height="26" rx="4" fill="#fff4c4" stroke="${C}" stroke-width="3"/><text x="${x + 60}" y="${y + 60}" text-anchor="middle" style="${F};font-size:16px" fill="#c0392b">${plaqa}</text>` : ""}`;
  }
  function frutas(x, y) {
    let s = `<rect x="${x}" y="${y}" width="150" height="60" fill="#c58b4c" stroke="${C}" stroke-width="4"/><path d="M${x} ${y + 20} h150 M${x} ${y + 40} h150" stroke="#9b6a33" stroke-width="3"/>`;
    for (let i = 0; i < 6; i++) s += `<circle cx="${x + 18 + i * 23}" cy="${y - 4}" r="13" fill="#f29e4c" stroke="${C}" stroke-width="3"/>`;
    s += `<rect x="${x + 160}" y="${y}" width="150" height="60" fill="#c58b4c" stroke="${C}" stroke-width="4"/><path d="M${x + 160} ${y + 20} h150 M${x + 160} ${y + 40} h150" stroke="#9b6a33" stroke-width="3"/>`;
    for (let i = 0; i < 3; i++) s += `<path d="M${x + 175 + i * 42} ${y - 4} q18 -36 36 -4" fill="none" stroke="${C}" stroke-width="12" stroke-linecap="round"/><path d="M${x + 175 + i * 42} ${y - 4} q18 -36 36 -4" fill="none" stroke="#f5d547" stroke-width="7" stroke-linecap="round"/>`;
    return s;
  }
  function bicicleta(x, y) {
    const r = 48;
    const rodaB = (cx) => `<circle cx="${cx}" cy="${y}" r="${r}" fill="none" stroke="${C}" stroke-width="7"/><circle cx="${cx}" cy="${y}" r="${r - 6}" fill="none" stroke="#dfe2e8" stroke-width="3"/>` + [0, 30, 60, 90, 120, 150].map(a => `<path d="M${cx + Math.cos(a * Math.PI / 180) * r} ${y + Math.sin(a * Math.PI / 180) * r} L${cx - Math.cos(a * Math.PI / 180) * r} ${y - Math.sin(a * Math.PI / 180) * r}" stroke="#9aa0ab" stroke-width="2"/>`).join("") + `<circle cx="${cx}" cy="${y}" r="6" fill="${C}"/>`;
    return rodaB(x) + rodaB(x + 170) + `<path d="M${x} ${y} L${x + 60} ${y - 70} L${x + 140} ${y - 70} L${x + 170} ${y} M${x + 60} ${y - 70} L${x + 85} ${y} L${x + 140} ${y - 70} M${x + 85} ${y} L${x} ${y}" fill="none" stroke="#d9534f" stroke-width="9" stroke-linejoin="round"/>
      <path d="M${x + 60} ${y - 70} L${x + 50} ${y - 92} M${x + 34} ${y - 94} L${x + 68} ${y - 90}" stroke="${C}" stroke-width="8" stroke-linecap="round"/>
      <path d="M${x + 140} ${y - 70} L${x + 148} ${y - 100} L${x + 170} ${y - 104}" fill="none" stroke="${C}" stroke-width="7" stroke-linecap="round"/>
      <path d="M${x + 170} ${y} L${x + 196} ${y - 104} M${x + 214} ${y - 104} L${x + 178} ${y - 30}" stroke="#8a8e98" stroke-width="5"/><rect x="${x + 156}" y="${y - 150}" width="80" height="50" fill="#d9b48a" stroke="${C}" stroke-width="4"/><path d="M${x + 150} ${y - 134} h80 M${x + 150} ${y - 118} h80" stroke="#b08655" stroke-width="3"/>
      ${pao(x + 181, y - 152, 0.7)}${pao(x + 211, y - 156, 0.6)}`;
  }
  function poste(x) {
    return `<rect x="${x - 12}" y="150" width="24" height="650" fill="#a9adb6" stroke="${C}" stroke-width="5"/>
      <rect x="${x - 70}" y="190" width="140" height="16" rx="4" fill="#8a8e98" stroke="${C}" stroke-width="4"/>
      <rect x="${x + 20}" y="230" width="44" height="64" rx="8" fill="#9aa0ab" stroke="${C}" stroke-width="4"/>
      <circle cx="${x - 60}" cy="186" r="7" fill="#e9ebef" stroke="${C}" stroke-width="3"/><circle cx="${x + 60}" cy="186" r="7" fill="#e9ebef" stroke="${C}" stroke-width="3"/>
      <rect x="${x - 95}" y="470" width="190" height="36" rx="6" fill="#2f6db3" stroke="${C}" stroke-width="4"/>
      <text x="${x}" y="496" text-anchor="middle" style="${F};font-size:20px" fill="#fff">R. DAS FLORES</text>
      <rect x="${x - 26}" y="770" width="52" height="30" fill="#8a8e98" stroke="${C}" stroke-width="4"/>`;
  }
  function fios(xp) {
    let s = "";
    [[-60, 186], [60, 186]].forEach(([dx, y0]) => {
      s += `<path d="M-20 ${y0 + 40} Q${(xp + dx) / 2} ${y0 + 110} ${xp + dx} ${y0} Q${(xp + dx + 1940) / 2} ${y0 + 110} 1940 ${y0 + 30}" fill="none" stroke="${C}" stroke-width="3"/>`;
    });
    return s;
  }
  function arvore(x) {
    return `<path d="M${x - 16} 800 L${x - 10} 520 L${x + 10} 520 L${x + 16} 800 Z" fill="#8a5a3b" stroke="${C}" stroke-width="5"/>
      <path d="M${x} 600 L${x + 50} 540 M${x} 640 L${x - 46} 586" stroke="${C}" stroke-width="10" stroke-linecap="round"/><path d="M${x} 600 L${x + 50} 540 M${x} 640 L${x - 46} 586" stroke="#8a5a3b" stroke-width="5" stroke-linecap="round"/>
      ${[[-70, 500, 70], [60, 490, 74], [0, 430, 84], [-40, 560, 58], [50, 560, 58]].map(([dx, cy, r]) => `<circle cx="${x + dx}" cy="${cy}" r="${r}" fill="#5f9f4f" stroke="${C}" stroke-width="5"/>`).join("")}
      ${[[-40, 450], [30, 420], [-80, 500], [70, 500], [10, 550]].map(([dx, cy]) => `<path d="M${x + dx - 18} ${cy} q18 -18 36 0" stroke="#7fbf6a" stroke-width="6" fill="none" stroke-linecap="round"/>`).join("")}
      <rect x="${x - 60}" y="790" width="120" height="16" fill="#8b6b4a" stroke="${C}" stroke-width="4"/>`;
  }
  function banca(x) {
    let s = `<rect x="${x}" y="560" width="230" height="200" fill="#2f6db3" stroke="${C}" stroke-width="5"/>
      <rect x="${x - 14}" y="530" width="258" height="40" fill="#f4efe4" stroke="${C}" stroke-width="5"/>
      <text x="${x + 115}" y="560" text-anchor="middle" style="${F};font-size:28px" fill="#2f6db3">BANCA</text>
      <rect x="${x + 14}" y="586" width="202" height="160" fill="#f7f3ea" stroke="${C}" stroke-width="4"/>`;
    const cores = ["#e2544f", "#f5c542", "#4a90d9", "#6fae5a", "#f29e4c", "#b07cc6", "#9fcfc6"];
    for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) s += `<rect x="${x + 22 + i * 32}" y="${594 + r * 50}" width="26" height="40" fill="${cores[(i + r * 3) % 7]}" stroke="${C}" stroke-width="2"/><rect x="${x + 25 + i * 32}" y="${600 + r * 50}" width="20" height="8" fill="#fff" opacity="0.7"/>`;
    return s;
  }
  function calcada() {
    let s = `<rect x="0" y="640" width="1920" height="170" fill="#ece7de"/>`;
    for (let r = 0; r < 4; r++) {
      const y = 662 + r * 40; let d = `M-40 ${y}`;
      for (let x = -40; x < 1960; x += 80) d += ` q20 ${r % 2 ? 14 : -14} 40 0 t40 0`;
      s += `<path d="${d}" fill="none" stroke="#b9b3a8" stroke-width="7" stroke-linecap="round"/>`;
    }
    s += `<path d="M0 640 L1920 640" stroke="${C}" stroke-width="5"/>`;
    s += `<rect x="0" y="806" width="1920" height="28" fill="#f2c94c" stroke="${C}" stroke-width="5"/>`;
    for (let x = 30; x < 1920; x += 70) s += `<circle cx="${x}" cy="820" r="5" fill="#c99b25"/>`;
    return s;
  }
  function rua() {
    let s = `<rect x="0" y="834" width="1920" height="246" fill="#4b4a55"/>`;
    for (let x = 40; x < 1920; x += 260) s += `<rect x="${x}" y="1010" width="150" height="16" rx="4" fill="#f2c94c" stroke="${C}" stroke-width="3"/>`;
    s += `<ellipse cx="1500" cy="930" rx="50" ry="14" fill="#3b3a44" stroke="${C}" stroke-width="4"/><path d="M1462 930 h76 M1470 924 h60 M1470 936 h60" stroke="#55545f" stroke-width="3"/>`;
    for (let i = 0; i < 40; i++) s += `<circle cx="${(i * 197) % 1920}" cy="${860 + (i * 71) % 200}" r="3" fill="#5a5965"/>`;
    return s;
  }
  const cone = (x, y) => `<path d="M${x - 30} ${y} L${x - 8} ${y - 90} L${x + 8} ${y - 90} L${x + 30} ${y} Z" fill="#f2793a" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M${x - 20} ${y - 38} L${x + 20} ${y - 38} L${x + 16} ${y - 56} L${x - 16} ${y - 56} Z" fill="#fff"/><rect x="${x - 44}" y="${y - 6}" width="88" height="14" rx="4" fill="#f2793a" stroke="${C}" stroke-width="5"/>`;
  const vaso = (x) => `<path d="M${x - 34} 720 L${x + 34} 720 L${x + 26} 790 L${x - 26} 790 Z" fill="#c96b4a" stroke="${C}" stroke-width="5"/>${[-30, -14, 0, 14, 30].map(a => `<path d="M${x} 722 Q${x + a * 1.6} ${690 - Math.abs(a)} ${x + a * 2.4} ${640 + Math.abs(a) * 1.5}" fill="none" stroke="#4f8f45" stroke-width="12" stroke-linecap="round"/>`).join("")}`;
  const lixeira = (x) => `<rect x="${x - 30}" y="700" width="60" height="96" rx="8" fill="#f29e4c" stroke="${C}" stroke-width="5"/><rect x="${x - 36}" y="692" width="72" height="16" rx="6" fill="#d9822f" stroke="${C}" stroke-width="5"/><path d="M${x - 14} 724 v50 M${x} 724 v50 M${x + 14} 724 v50" stroke="#d9822f" stroke-width="4"/>`;

  /* Rua de comercio de bairro. Camadas: fundo (ceu, predios, lojas), meio (calcada, poste, banca, objetos), frente (rua). */
  function ruaComercio(o = {}) {
    const id = o.id || "rua";
    const fundo = `<rect x="0" y="0" width="1920" height="640" fill="#bfe3f0"/>
      ${nuvem(120, 40, 1.1)}${nuvem(820, 20, 0.9)}${nuvem(1500, 50, 1.2)}
      ${predio(0, 480, 120, "#f3e3c3", { j1: { cortina: "#e2544f" }, j2: { arcond: 1 } })}
      ${predio(480, 480, 90, "#d3ead8", { j1: { vaso: 1 }, j2: { cortina: "#4a90d9" } })}
      ${predio(960, 480, 140, "#f6d2bd", { j1: { arcond: 1 }, j2: { vaso: 1 } })}
      ${predio(1440, 480, 100, "#dcd6ee", { j1: { cortina: "#6fae5a" }, j2: { cortina: "#f5c542" } })}
      <!-- padaria -->
      ${placa(30, 340, 420, 80, "#c0392b", "PÃO QUENTE", "PADARIA &amp; CONFEITARIA")}
      ${toldo(20, 430, 440, "#e2544f", "#fff8e6")}
      <rect x="20" y="470" width="440" height="170" fill="#f3e3c3" stroke="${C}" stroke-width="5"/>
      ${vitrinePadaria(40, 482)}${porta(316, 482, "#9fcfc6", "ABERTO")}
      <!-- farmacia -->
      ${placa(510, 340, 420, 80, "#2e8b57", "&#160;&#160;&#160;FARMÁCIA", "&#160;&#160;&#160;&#160;24 HORAS", "#fff8e6", 50)}
      <g transform="translate(548 380) scale(0.8)"><path d="M-12 -30 h24 v18 h18 v24 h-18 v18 h-24 v-18 h-18 v-24 h18 Z" fill="#fff" stroke="${C}" stroke-width="3"/></g>
      ${toldo(500, 430, 440, "#3aa36b", "#fff8e6")}
      <rect x="500" y="470" width="440" height="170" fill="#d3ead8" stroke="${C}" stroke-width="5"/>
      ${vitrineFarmacia(520, 482)}${porta(796, 482, "#e9f2ef")}
      <!-- pastelaria -->
      ${placa(990, 340, 420, 80, "#f5c542", "PASTEL", "&amp; CALDO DE CANA", "#7a3b12")}
      ${toldo(980, 430, 440, "#f29e4c", "#fff8e6")}
      <rect x="980" y="470" width="440" height="170" fill="#f6d2bd" stroke="${C}" stroke-width="5"/>
      <rect x="1000" y="482" width="270" height="150" fill="#fff4dc" stroke="${C}" stroke-width="5"/>
      <rect x="1000" y="574" width="270" height="58" fill="#c97b4a" stroke="${C}" stroke-width="4"/>
      ${[1030, 1090, 1150, 1210].map(x => `<path d="M${x - 22} 556 q22 -26 44 0 Z" fill="#f0c36b" stroke="${C}" stroke-width="3"/><path d="M${x - 16} 552 l6 -4 l6 4 l6 -4 l6 4 l6 -4" fill="none" stroke="#c98f2f" stroke-width="2"/>`).join("")}
      <rect x="1020" y="494" width="110" height="46" rx="4" fill="#2f4f3a" stroke="${C}" stroke-width="4"/><path d="M1032 508 h60 M1032 520 h80 M1032 532 h50" stroke="#e8f0e0" stroke-width="3"/>
      ${porta(1286, 482, "#f29e4c")}
      <!-- mercadinho -->
      ${placa(1470, 340, 420, 80, "#2f6db3", "MERCADINHO", "DO ZÉ", "#fff8e6", 46)}
      ${toldo(1460, 430, 440, "#4a90d9", "#fff8e6")}
      <rect x="1460" y="470" width="440" height="170" fill="#dcd6ee" stroke="${C}" stroke-width="5"/>
      <rect x="1480" y="482" width="400" height="150" fill="#3c3a46" stroke="${C}" stroke-width="5"/>
      ${[0, 1, 2].map(r => `<rect x="1490" y="${520 + r * 38}" width="380" height="6" fill="#8a8e98"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<rect x="${1496 + i * 31}" y="${494 + r * 38}" width="24" height="26" rx="2" fill="${["#e2544f", "#f5c542", "#6fae5a", "#4a90d9", "#f29e4c"][(i + r) % 5]}" stroke="${C}" stroke-width="2"/>`).join("")).join("")}`;
    const meio = `${calcada()}
      ${fios(940)}
      ${passaro(700, 228)}${passaro(760, 236, -1)}${passaro(1220, 236)}
      ${poste(940)}
      ${bicicleta(70, 750)}
      ${vaso(470)}
      ${lixeira(1010)}
      ${banca(1230)}
      ${frutas(1500, 740)}
      ${arvore(1880)}`;
    const frente = `${rua()}${cone(1880, 1000)}`;
    return `<g id="${id}"><g id="${id}-fundo">${fundo}</g><g id="${id}-meio">${meio}</g><g id="${id}-frente">${frente}</g></g>`;
  }

  window.Cenarios = { ruaComercio, nuvem, passaro, toldo, janela, predio, placa, poste, arvore, banca, bicicleta, cone, vaso, lixeira };
})();

/* ===== Cenarios do gancho do video do trilionario (09/11/2026) =====
 * Escala: personagem em pe ~460 px (escala 0.33) => 1 m ~ 263 px. Interiores: parede ate ~730, chao ate 1080.
 * Mesma estrutura: <g id> com -fundo, -meio (atras do personagem) e -frente (na frente dele). */
(function () {
  const C = (window.ESTILO && window.ESTILO.contorno) || "#2E2A33";
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const esc = (h, f) => window.Objetos.esc(h, f);
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const camadas = (id, fundo, meio, frente) => `<g id="${id}"><g id="${id}-fundo">${fundo}</g><g id="${id}-meio">${meio}</g><g id="${id}-frente">${frente}</g></g>`;
  const livro = (x, y, w, h, cor) => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="2" fill="${cor}" stroke="${C}" stroke-width="3"/><path d="M${x + 3} ${y - h + 8} h${w - 6} M${x + 3} ${y - 10} h${w - 6}" stroke="${esc(cor, 0.4)}" stroke-width="3"/>`;
  const planta = (x, y, s = 1, cor = "#c96b4a") => `<g transform="translate(${x} ${y}) scale(${s})">${[[-70, -110], [-30, -150], [10, -165], [50, -140], [80, -95], [-85, -60], [90, -50]].map(([dx, dy]) => `<path d="M0 -6 Q${dx * 0.3} ${dy * 0.6} ${dx} ${dy} Q${dx * 0.7 + 14} ${dy * 0.55} 6 -6 Z" fill="#5f9f4f" stroke="${C}" stroke-width="4" stroke-linejoin="round"/><path d="M2 -8 Q${dx * 0.35} ${dy * 0.55} ${dx * 0.85} ${dy * 0.9}" stroke="#7fbf6a" stroke-width="3" fill="none"/>`).join("")}<path d="M-40 0 L40 0 L30 70 L-30 70 Z" fill="${cor}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><rect x="-46" y="-10" width="92" height="16" rx="5" fill="${esc(cor, -0.15)}" stroke="${C}" stroke-width="5"/></g>`;
  const tenis = (x, y, r = 0, cor = "#e2544f") => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-46 0 Q-50 -26 -30 -30 L4 -32 Q20 -18 44 -14 Q58 -10 56 4 Z" fill="${cor}" stroke="${C}" stroke-width="4" stroke-linejoin="round"/><path d="M-50 0 L58 0 Q60 10 50 12 L-46 12 Q-54 8 -50 0 Z" fill="#f6f6f8" stroke="${C}" stroke-width="4"/><path d="M-8 -28 L4 -16 M-2 -30 L10 -18" stroke="#fff" stroke-width="3"/></g>`;
  const lustre = (x, y0, y) => {
    let s = `<path d="M${x} ${y0} L${x} ${y - 40}" stroke="${C}" stroke-width="4"/>${[0, 1, 2, 3, 4].map(i => `<circle cx="${x}" cy="${y0 + 12 + i * ((y - 52 - y0) / 5)}" r="4" fill="none" stroke="#c9a24a" stroke-width="3"/>`).join("")}
      <path d="M${x - 130} ${y} Q${x} ${y + 70} ${x + 130} ${y}" fill="none" stroke="${C}" stroke-width="12"/><path d="M${x - 130} ${y} Q${x} ${y + 70} ${x + 130} ${y}" fill="none" stroke="#e0b23e" stroke-width="6"/>
      <path d="M${x - 40} ${y - 40} L${x + 40} ${y - 40} L${x + 26} ${y + 34} L${x - 26} ${y + 34} Z" fill="#e0b23e" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><circle cx="${x}" cy="${y + 46}" r="12" fill="#f3d27a" stroke="${C}" stroke-width="4"/>`;
    [-130, -65, 0, 65, 130].forEach((dx) => { const yy = y + (dx === 0 ? 34 : Math.abs(dx) === 65 ? 26 : 0) - 10; s += `<circle cx="${x + dx}" cy="${yy - 48}" r="26" fill="#ffe9a0" opacity="0.35"/><rect x="${x + dx - 9}" y="${yy - 34}" width="18" height="34" fill="#fff8e6" stroke="${C}" stroke-width="3"/><path d="M${x + dx} ${yy - 36} q-9 -14 0 -28 q9 14 0 28 Z" fill="#f5c542" stroke="${C}" stroke-width="2.5"/>`; });
    for (let i = 0; i < 9; i++) { const dx = -110 + i * 27.5, yy = y + 18 + Math.sin(i / 8 * Math.PI) * 42; s += `<path d="M${x + dx} ${yy} l-6 12 l6 14 l6 -14 Z" fill="#dff3fb" stroke="${C}" stroke-width="2"/>`; }
    return s;
  };

  /* ---------- QUARTO simples, manha ---------- */
  function quarto(o = {}) {
    const id = o.id || "quarto";
    let papel = "";
    for (let r = 0; r < 12; r++) for (let c = 0; c < 22; c++) { const x = c * 90 + (r % 2) * 45, y = 70 + r * 56; papel += `<path d="M${x} ${y - 9} l9 9 l-9 9 l-9 -9 Z" fill="#c8c2e3"/>`; }
    let piso = `<rect x="0" y="736" width="1920" height="344" fill="#c99a6b"/>`;
    for (let r = 0; r < 7; r++) { const y = 736 + r * 50; piso += `<path d="M0 ${y} H1920" stroke="#a87a4e" stroke-width="4"/>`; for (let c = 0; c < 8; c++) { const x = (c * 280 + (r % 3) * 95) % 1920; piso += `<path d="M${x} ${y} V${y + 50}" stroke="#a87a4e" stroke-width="4"/>`; } piso += `<path d="M${(r * 331) % 1700 + 60} ${y + 22} q30 -6 60 0" stroke="#b98a5c" stroke-width="3" fill="none"/>`; }
    const janela = `<rect x="1030" y="120" width="380" height="420" rx="6" fill="#f4efe4" stroke="${C}" stroke-width="6"/>
      <rect x="1050" y="140" width="340" height="380" fill="#ffe7a8" stroke="${C}" stroke-width="5"/>
      <rect x="1050" y="300" width="340" height="220" fill="#bfe1ee"/>
      <circle cx="1300" cy="250" r="86" fill="#fff3c4" opacity="0.5"/><circle cx="1300" cy="250" r="56" fill="#ffd36b" stroke="${C}" stroke-width="5"/>
      <path d="M1050 520 L1050 410 L1110 410 L1110 380 L1170 380 L1170 430 L1220 430 L1220 360 L1290 360 L1290 440 L1340 440 L1340 400 L1390 400 L1390 520 Z" fill="#9fb4cf" stroke="${C}" stroke-width="4" stroke-linejoin="round"/>
      ${[1120, 1180, 1240, 1250, 1300, 1360].map((x, i) => `<rect x="${x}" y="${450 + (i % 2) * 30}" width="14" height="18" fill="#f7f0c9"/>`).join("")}
      <path d="M1090 360 l60 -150" stroke="#fff" stroke-width="16" opacity="0.5"/><path d="M1130 360 l40 -100" stroke="#fff" stroke-width="7" opacity="0.5"/>
      <path d="M1220 140 V520 M1050 330 H1390" stroke="${C}" stroke-width="6"/>
      <rect x="1020" y="534" width="400" height="22" rx="4" fill="#f4efe4" stroke="${C}" stroke-width="5"/>
      <g transform="translate(1340 534) scale(0.4)">${[-24, -8, 8, 24].map(a => `<path d="M0 -70 L${a * 1.6} ${-110 - Math.abs(a)}" stroke="#4f8f45" stroke-width="8"/><circle cx="${a * 1.6}" cy="${-110 - Math.abs(a)}" r="22" fill="#f29e4c" stroke="${C}" stroke-width="8"/><circle cx="${a * 1.6}" cy="${-110 - Math.abs(a)}" r="8" fill="#f5c542"/>`).join("")}<path d="M-34 -70 L34 -70 L26 0 L-26 0 Z" fill="#6fa8dc" stroke="${C}" stroke-width="10"/></g>`;
    const cortina = (x, d) => { let s = `<path d="M${x} 96 Q${x + d * 60} 300 ${x + d * 20} 600 L${x + d * 120} 600 Q${x + d * 150} 330 ${x + d * 150} 96 Z" fill="#f5c542" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>`; for (let i = 1; i < 5; i++) s += `<path d="M${x + d * i * 30} 100 Q${x + d * (i * 30 + 30)} 330 ${x + d * (20 + i * 24)} 596" stroke="#d9a930" stroke-width="5" fill="none"/>`; return s + `<path d="M${x + d * 10} 330 Q${x + d * 80} 350 ${x + d * 150} 320" stroke="${C}" stroke-width="10" fill="none"/><path d="M${x + d * 10} 330 Q${x + d * 80} 350 ${x + d * 150} 320" stroke="#e2544f" stroke-width="5" fill="none"/>`; };
    const poster = `<g transform="translate(850 290) rotate(-6) scale(0.8)"><rect x="-130" y="-170" width="260" height="330" fill="#fff8e6" stroke="${C}" stroke-width="6"/><rect x="-112" y="-150" width="224" height="220" fill="#9fcfc6" stroke="${C}" stroke-width="4"/><circle cx="40" cy="-90" r="36" fill="#f5c542" stroke="${C}" stroke-width="4"/><path d="M-112 70 L-50 -40 L-10 20 L30 -20 L112 70 Z" fill="#6d6a9c" stroke="${C}" stroke-width="4" stroke-linejoin="round"/><path d="M-50 -40 L-34 -12 L-50 -18 L-64 -14 Z" fill="#fff"/><text x="0" y="112" text-anchor="middle" style="${F};font-size:34px" fill="#2E2A33">SONHE</text><text x="0" y="146" text-anchor="middle" style="${F};font-size:34px" fill="#e2544f">GRANDE</text><circle cx="0" cy="-162" r="7" fill="#e2544f" stroke="${C}" stroke-width="3"/></g>`;
    const cortica = `<rect x="560" y="200" width="250" height="180" rx="6" fill="#c9965a" stroke="${C}" stroke-width="6"/><rect x="572" y="212" width="226" height="156" fill="#d9ad74"/>${[[600, 240, -8, "#fff", "#9fcfc6"], [680, 230, 6, "#fff", "#f6d2bd"], [750, 280, -4, "#fff4c4", null], [620, 310, 5, "#fff", "#b9b3d9"]].map(([x, y, r, c1, c2]) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-28" y="-24" width="62" height="${c2 ? 70 : 52}" fill="${c1}" stroke="${C}" stroke-width="3"/>${c2 ? `<rect x="-22" y="-18" width="50" height="44" fill="${c2}"/><circle cx="2" cy="2" r="11" fill="#f2c6a0" stroke="${C}" stroke-width="2"/><path d="M-10 26 q12 -14 24 0" fill="#4a90d9" stroke="${C}" stroke-width="2"/>` : `<path d="M-20 -8 h46 M-20 4 h40 M-20 16 h30" stroke="#8a8e98" stroke-width="3"/>`}<circle cx="3" cy="-22" r="5" fill="#e2544f" stroke="${C}" stroke-width="2"/></g>`).join("")}`;
    const prateleira = `<rect x="560" y="470" width="260" height="16" rx="3" fill="#a86b42" stroke="${C}" stroke-width="4"/><path d="M590 486 l0 26 l20 0 M790 486 l0 26 l-20 0" stroke="${C}" stroke-width="4" fill="none"/>
      ${livro(578, 470, 22, 70, "#e2544f")}${livro(600, 470, 18, 60, "#4a90d9")}${livro(618, 470, 26, 76, "#6fae5a")}${livro(644, 470, 20, 64, "#f5c542")}<g transform="rotate(14 668 470)">${livro(668, 470, 20, 66, "#b07cc6")}</g>
      <path d="M730 470 L728 440 Q760 430 792 440 L790 470 Z" fill="#f5c542" stroke="${C}" stroke-width="4"/><rect x="745" y="420" width="30" height="22" fill="#f5c542" stroke="${C}" stroke-width="4"/><path d="M745 426 q-14 0 -14 10 q0 8 14 8 M775 426 q14 0 14 10 q0 8 -14 8" fill="none" stroke="${C}" stroke-width="3"/><text x="760" y="462" text-anchor="middle" style="${F};font-size:14px" fill="${C}">1º</text>`;
    const tomada = `<rect x="560" y="640" width="40" height="56" rx="6" fill="#f4efe4" stroke="${C}" stroke-width="4"/><circle cx="573" cy="668" r="4" fill="${C}"/><circle cx="587" cy="668" r="4" fill="${C}"/>`;
    const luz = `<path d="M1050 140 L1390 140 L1700 1080 L700 1080 Z" fill="#fff7d6" opacity="0.16"/>`;
    const fundo = `<rect width="1920" height="736" fill="#B9B3D9"/>${papel}
      <rect x="0" y="0" width="1920" height="34" fill="#f4efe4" stroke="${C}" stroke-width="5"/><rect x="0" y="34" width="1920" height="10" fill="#ddd6ee"/>
      ${piso}<rect x="0" y="706" width="1920" height="34" fill="#f4efe4" stroke="${C}" stroke-width="5"/>
      ${janela}<rect x="1000" y="90" width="440" height="12" rx="6" fill="#a86b42" stroke="${C}" stroke-width="4"/><circle cx="1000" cy="96" r="12" fill="#a86b42" stroke="${C}" stroke-width="4"/><circle cx="1440" cy="96" r="12" fill="#a86b42" stroke="${C}" stroke-width="4"/>
      ${cortina(1000, 1)}${cortina(1440, -1)}${poster}<g transform="translate(-150 0)">${cortica}${prateleira}</g>${tomada}${luz}
      <ellipse cx="960" cy="960" rx="470" ry="78" fill="#9fcfc6" stroke="${C}" stroke-width="6"/><ellipse cx="960" cy="960" rx="380" ry="60" fill="none" stroke="#f4efe4" stroke-width="10"/><ellipse cx="960" cy="960" rx="270" ry="42" fill="none" stroke="#7fb8ae" stroke-width="10"/><ellipse cx="960" cy="960" rx="150" ry="22" fill="#f4efe4" opacity="0.7"/>`;
    const guardaRoupa = `<rect x="40" y="250" width="320" height="640" rx="6" fill="#d49a63" stroke="${C}" stroke-width="6"/><rect x="28" y="236" width="344" height="28" rx="5" fill="#b07a48" stroke="${C}" stroke-width="5"/>
      <rect x="60" y="280" width="134" height="520" rx="4" fill="#dfab76" stroke="${C}" stroke-width="5"/><rect x="206" y="280" width="134" height="520" rx="4" fill="#dfab76" stroke="${C}" stroke-width="5"/>
      <rect x="80" y="300" width="94" height="200" fill="none" stroke="#c48a55" stroke-width="4"/><rect x="226" y="300" width="94" height="200" fill="none" stroke="#c48a55" stroke-width="4"/>
      <circle cx="182" cy="560" r="9" fill="#f5c542" stroke="${C}" stroke-width="3"/><circle cx="218" cy="560" r="9" fill="#f5c542" stroke="${C}" stroke-width="3"/>
      <rect x="60" y="814" width="280" height="60" rx="4" fill="#dfab76" stroke="${C}" stroke-width="5"/><rect x="180" y="836" width="40" height="12" rx="6" fill="#b07a48" stroke="${C}" stroke-width="3"/>
      <path d="M194 380 Q206 420 198 470 L214 470 Q222 420 206 380 Z" fill="#e2544f" stroke="${C}" stroke-width="3"/>
      <rect x="60" y="890" width="24" height="20" fill="#8a5a3b" stroke="${C}" stroke-width="3"/><rect x="316" y="890" width="24" height="20" fill="#8a5a3b" stroke="${C}" stroke-width="3"/>
      <rect x="70" y="170" width="150" height="66" rx="4" fill="#c9a76a" stroke="${C}" stroke-width="5"/><path d="M70 196 h150" stroke="#a88648" stroke-width="4"/><rect x="230" y="190" width="110" height="46" rx="4" fill="#e9b5c9" stroke="${C}" stroke-width="5"/>`;
    const cesto = `<path d="M440 802 Q470 760 500 790 Q520 750 556 800 Z" fill="#4a90d9" stroke="${C}" stroke-width="4"/><path d="M500 790 Q540 770 548 760 L560 770 Q540 790 520 800 Z" fill="#f29e4c" stroke="${C}" stroke-width="4"/><path d="M420 920 L436 800 L560 800 L576 920 Z" fill="#e3c18a" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${438 + i * 2} ${822 + i * 20} H${560 - i * 2}" stroke="#c49f62" stroke-width="4"/>`).join("")}`;
    const criado = `<rect x="1520" y="700" width="200" height="190" rx="6" fill="#d49a63" stroke="${C}" stroke-width="6"/><rect x="1508" y="690" width="224" height="22" rx="5" fill="#b07a48" stroke="${C}" stroke-width="5"/>
      <rect x="1538" y="730" width="164" height="60" rx="4" fill="#dfab76" stroke="${C}" stroke-width="4"/><circle cx="1620" cy="760" r="8" fill="#f5c542" stroke="${C}" stroke-width="3"/>
      <rect x="1538" y="806" width="164" height="60" rx="4" fill="#dfab76" stroke="${C}" stroke-width="4"/><circle cx="1620" cy="836" r="8" fill="#f5c542" stroke="${C}" stroke-width="3"/>
      <rect x="1530" y="888" width="20" height="18" fill="#8a5a3b" stroke="${C}" stroke-width="3"/><rect x="1690" y="888" width="20" height="18" fill="#8a5a3b" stroke="${C}" stroke-width="3"/>
      <ellipse cx="1680" cy="580" rx="70" ry="22" fill="#fff3c4" opacity="0.45"/><path d="M1660 690 L1670 640 L1690 640 L1700 690 Z" fill="#9fcfc6" stroke="${C}" stroke-width="4"/><path d="M1680 640 V560" stroke="${C}" stroke-width="5"/>
      <path d="M1634 566 L1726 566 L1706 494 L1654 494 Z" fill="#f6d2bd" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M1650 520 h60 M1644 544 h72" stroke="#e8b89c" stroke-width="5"/>
      <rect x="1546" y="660" width="40" height="30" rx="3" fill="#4a90d9" stroke="${C}" stroke-width="3"/><rect x="1542" y="652" width="48" height="10" rx="2" fill="#e2544f" stroke="${C}" stroke-width="3"/>`;
    const mochila = `<g transform="translate(1810 920) rotate(-8)"><path d="M-60 0 L-56 -150 Q-50 -190 0 -192 Q50 -190 56 -150 L60 0 Z" fill="#e2544f" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><rect x="-40" y="-90" width="80" height="70" rx="10" fill="#c43f3b" stroke="${C}" stroke-width="4"/><path d="M-40 -66 h80" stroke="${C}" stroke-width="3"/><circle cx="0" cy="-56" r="5" fill="#f5c542"/><path d="M-20 -192 q20 -24 40 0" fill="none" stroke="${C}" stroke-width="6"/></g>`;
    const meio = `${guardaRoupa}${cesto}${criado}${mochila}${tenis(660, 1000, -12, "#4a90d9")}${tenis(760, 1020, 18, "#4a90d9")}`;
    const frente = `${planta(70, 1010, 1.25)}<g transform="translate(1340 1060) rotate(-10)"><ellipse cx="0" cy="0" rx="54" ry="16" fill="#6fae5a" stroke="${C}" stroke-width="4"/><path d="M-24 -6 Q0 -26 24 -6" fill="none" stroke="#4f8f45" stroke-width="7"/></g>`;
    return camadas(id, fundo, meio, frente);
  }

  /* ---------- CORREDOR do clube (marmore, lustres, quadros) ---------- */
  function corredorClube(o = {}) {
    const id = o.id || "clube";
    let painel = "";
    [[60, 150, 260, 340], [1600, 150, 260, 340]].forEach(([x, y, w, h]) => { painel += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#c9a24a" stroke-width="6"/><rect x="${x + 16}" y="${y + 16}" width="${w - 32}" height="${h - 32}" fill="none" stroke="#dcc07a" stroke-width="3"/>`; });
    let lambri = `<rect x="0" y="520" width="1920" height="240" fill="#6b3f2a" stroke="${C}" stroke-width="5"/><rect x="0" y="512" width="1920" height="18" fill="#8a5a3b" stroke="${C}" stroke-width="4"/>`;
    for (let x = 30; x < 1900; x += 190) lambri += `<rect x="${x}" y="556" width="160" height="170" rx="4" fill="#7a4a32" stroke="#4f2c1c" stroke-width="5"/><rect x="${x + 14}" y="570" width="132" height="142" fill="none" stroke="#a06a48" stroke-width="3"/>`;
    let piso = `<rect x="0" y="760" width="1920" height="320" fill="#efe8dc"/>`;
    for (let r = 0; r < 5; r++) { const y0 = 760 + r * 64, h = 64; for (let c = -2; c < 26; c++) { const off = (r % 2) * 0.5, x0 = (c + off) * 90 + (r * 22), cor = (c + r) % 2 ? "#d9cfbf" : "#f4efe6"; piso += `<path d="M${x0} ${y0} L${x0 + 90} ${y0} L${x0 + 112} ${y0 + h} L${x0 + 22} ${y0 + h} Z" fill="${cor}"/>`; } piso += `<path d="M0 ${y0} H1920" stroke="#c9bda9" stroke-width="2"/>`; }
    for (let i = 0; i < 14; i++) piso += `<path d="M${rnd(i) * 1900} ${780 + rnd(i + 30) * 280} q40 ${-10 + rnd(i + 7) * 20} 90 ${-6 + rnd(i + 9) * 12}" stroke="#bfb3a0" stroke-width="2" fill="none"/>`;
    const tapete = `<path d="M1090 760 L1410 760 L1660 1080 L840 1080 Z" fill="#b8262f" stroke="${C}" stroke-width="5"/><path d="M1104 760 L1396 760 L1628 1080 L872 1080 Z" fill="none" stroke="#e0b23e" stroke-width="6"/><path d="M1250 760 V1080" stroke="#a11f28" stroke-width="3" stroke-dasharray="14 18"/>`;
    const coluna = (x) => `<rect x="${x - 46}" y="120" width="92" height="640" fill="#f1ece4" stroke="${C}" stroke-width="5"/>${[-26, -9, 8, 25].map(d => `<path d="M${x + d} 150 V730" stroke="#d8d0c2" stroke-width="7"/>`).join("")}<path d="M${x - 30} 300 q20 40 6 90 M${x + 10} 520 q-12 50 10 100" stroke="#cfc5b4" stroke-width="3" fill="none"/><rect x="${x - 64}" y="96" width="128" height="30" rx="4" fill="#e9e1d3" stroke="${C}" stroke-width="5"/><path d="M${x - 64} 126 q-16 10 -4 22 M${x + 64} 126 q16 10 4 22" stroke="${C}" stroke-width="5" fill="none"/><rect x="${x - 60}" y="740" width="120" height="26" rx="4" fill="#e9e1d3" stroke="${C}" stroke-width="5"/>`;
    const quadroGato = `<rect x="560" y="160" width="300" height="330" rx="8" fill="#d9a93a" stroke="${C}" stroke-width="6"/><rect x="580" y="180" width="260" height="290" fill="#3d5a4a" stroke="${C}" stroke-width="5"/>
      <path d="M620 470 Q610 380 710 360 Q810 380 800 470 Z" fill="#26252c" stroke="${C}" stroke-width="4"/><path d="M690 372 L710 420 L730 372 Z" fill="#fff"/><path d="M702 380 L710 400 L718 380 Z" fill="#b8262f"/>
      <path d="M656 290 L662 238 L696 270 Z M764 290 L758 238 L724 270 Z" fill="#f29e4c" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><circle cx="710" cy="320" r="62" fill="#f29e4c" stroke="${C}" stroke-width="5"/>
      <rect x="670" y="204" width="80" height="54" fill="#26252c" stroke="${C}" stroke-width="4"/><rect x="656" y="252" width="108" height="14" rx="4" fill="#26252c" stroke="${C}" stroke-width="4"/><rect x="670" y="240" width="80" height="10" fill="#b8262f"/>
      <circle cx="688" cy="316" r="9" fill="${C}"/><circle cx="732" cy="316" r="14" fill="#dff3fb" stroke="#e0b23e" stroke-width="4"/><circle cx="732" cy="316" r="7" fill="${C}"/><path d="M746 320 q14 30 0 60" stroke="#e0b23e" stroke-width="2" fill="none"/>
      <path d="M702 340 l8 8 l8 -8 M710 348 v8" stroke="${C}" stroke-width="4" fill="none"/><path d="M670 346 h-34 M672 356 h-30 M750 346 h34 M748 356 h30" stroke="${C}" stroke-width="2.5"/>
      <rect x="650" y="496" width="120" height="26" rx="4" fill="#e0b23e" stroke="${C}" stroke-width="4"/><text x="710" y="515" text-anchor="middle" style="${F};font-size:15px" fill="${C}">SR. BIGODES</text>`;
    const arandela = (x) => `<ellipse cx="${x}" cy="290" rx="70" ry="60" fill="#fff3c4" opacity="0.3"/><path d="M${x} 300 v40" stroke="${C}" stroke-width="5"/><path d="M${x - 24} 340 h48 l-8 18 h-32 Z" fill="#e0b23e" stroke="${C}" stroke-width="4"/><path d="M${x - 30} 300 L${x + 30} 300 L${x + 20} 254 L${x - 20} 254 Z" fill="#fff3c4" stroke="${C}" stroke-width="4"/>`;
    const arco = `<path d="M1000 760 L1000 300 Q1000 130 1250 130 Q1500 130 1500 300 L1500 760 Z" fill="#cdb98c" stroke="${C}" stroke-width="6"/><path d="M1030 760 L1030 306 Q1030 160 1250 160 Q1470 160 1470 306 L1470 760 Z" fill="#b39b6b"/>`;
    const fundo = `<rect width="1920" height="760" fill="#EADBB8"/>
      <rect x="0" y="0" width="1920" height="92" fill="#4f2c1c"/><rect x="0" y="84" width="1920" height="22" fill="#d9a93a" stroke="${C}" stroke-width="5"/>${Array.from({ length: 48 }, (_, i) => `<rect x="${i * 40 + 8}" y="106" width="24" height="12" fill="#c9a24a" stroke="${C}" stroke-width="2"/>`).join("")}
      ${painel}${lambri}${piso}${arco}${tapete}${coluna(420)}${coluna(1580)}${quadroGato}${arandela(930)}${arandela(1720)}${lustre(240, 0, 230)}${lustre(1250, 0, 150)}`;
    const busto = `<rect x="150" y="610" width="140" height="290" fill="#f1ece4" stroke="${C}" stroke-width="5"/><rect x="134" y="596" width="172" height="24" rx="4" fill="#e9e1d3" stroke="${C}" stroke-width="5"/><rect x="134" y="886" width="172" height="24" rx="4" fill="#e9e1d3" stroke="${C}" stroke-width="5"/>
      <path d="M160 596 Q166 540 220 530 Q274 540 280 596 Z" fill="#e6e1d8" stroke="${C}" stroke-width="5"/><ellipse cx="220" cy="480" rx="44" ry="54" fill="#e6e1d8" stroke="${C}" stroke-width="5"/><path d="M196 504 q24 -12 48 0 q-8 12 -24 6 q-16 6 -24 -6 Z" fill="#cfc8bc" stroke="${C}" stroke-width="3"/><path d="M200 470 h12 M228 470 h12" stroke="${C}" stroke-width="4"/><path d="M178 450 q42 -48 84 0" fill="#d8d2c6" stroke="${C}" stroke-width="4"/>`;
    const meio = `${busto}${planta(930, 690, 1.1, "#d9a93a")}${planta(1570, 690, 1.1, "#d9a93a")}`;
    return camadas(id, fundo, meio, ``);
  }

  /* ---------- PALCO escuro com holofotes ---------- */
  function palco(o = {}) {
    const id = o.id || "palco";
    const cortinaLado = (x0, w, d) => { let s = `<rect x="${x0}" y="0" width="${w}" height="900" fill="#b8262f"/>`; for (let i = 0; i < 7; i++) { const x = x0 + i * (w / 7); s += `<path d="M${x + 6} 0 Q${x + w / 14} 450 ${x + 4} 900" stroke="#8c1b23" stroke-width="12" fill="none"/><path d="M${x + w / 14 + 6} 0 Q${x + w / 10} 450 ${x + w / 14} 900" stroke="#d4434b" stroke-width="5" fill="none" opacity="0.7"/>`; } const xr = d > 0 ? x0 + w : x0, xc = x0 + (d > 0 ? w * 0.85 : w * 0.15); s += `<path d="M${xr} 0 L${xr} 900" stroke="${C}" stroke-width="6"/><path d="M${x0 + w * 0.15} 470 Q${x0 + w / 2} 500 ${x0 + w * 0.85} 460" stroke="${C}" stroke-width="16" fill="none"/><path d="M${x0 + w * 0.15} 470 Q${x0 + w / 2} 500 ${x0 + w * 0.85} 460" stroke="#e0b23e" stroke-width="9" fill="none"/><circle cx="${xc}" cy="468" r="18" fill="#e0b23e" stroke="${C}" stroke-width="4"/><path d="M${xc - 10} 484 l-6 50 h32 l-6 -50 Z" fill="#e0b23e" stroke="${C}" stroke-width="4"/>`; return s; };
    let bambinela = `<rect x="0" y="0" width="1920" height="96" fill="#b8262f" stroke="${C}" stroke-width="5"/>`;
    for (let x = 0; x < 1920; x += 120) bambinela += `<path d="M${x} 96 Q${x + 60} 160 ${x + 120} 96 Z" fill="#a11f28" stroke="${C}" stroke-width="5"/><path d="M${x + 10} 110 Q${x + 60} 150 ${x + 110} 110" stroke="#e0b23e" stroke-width="6" fill="none"/>`;
    const lata = (x) => `<rect x="${x - 6}" y="96" width="12" height="40" fill="#3d3a46"/><g transform="rotate(${(960 - x) / 30} ${x} 150)"><rect x="${x - 34}" y="130" width="68" height="70" rx="10" fill="#3d3a46" stroke="${C}" stroke-width="5"/><ellipse cx="${x}" cy="202" rx="34" ry="10" fill="#fff3c4" stroke="${C}" stroke-width="4"/></g>`;
    const feixe = (x, xb) => `<path d="M${x - 30} 200 L${x + 30} 200 L${xb + 180} 860 L${xb - 180} 860 Z" fill="#fff3c4" opacity="0.13"/><ellipse cx="${xb}" cy="850" rx="200" ry="34" fill="#fff3c4" opacity="0.22"/>`;
    const telao = `<rect x="560" y="220" width="800" height="300" rx="12" fill="#1c1830" stroke="${C}" stroke-width="7"/><rect x="580" y="240" width="760" height="260" rx="6" fill="#2f2a58"/>
      ${Array.from({ length: 30 }, (_, i) => `<circle cx="${600 + rnd(i) * 720}" cy="${255 + rnd(i + 50) * 230}" r="${2 + rnd(i + 9) * 3}" fill="#fff3c4" opacity="0.6"/>`).join("")}
      <text x="960" y="332" text-anchor="middle" style="${F};font-size:62px" fill="#F5C542" stroke="${C}" stroke-width="3">OS MAIS RICOS</text><text x="960" y="402" text-anchor="middle" style="${F};font-size:50px" fill="#fff8e6" stroke="${C}" stroke-width="2">DO MUNDO</text>
      <path d="M700 450 h520" stroke="#F5C542" stroke-width="5"/>${[640, 1280].map(x => `<path d="M${x} 290 l10 24 l26 2 l-20 16 l8 26 l-24 -14 l-24 14 l8 -26 l-20 -16 l26 -2 Z" fill="#F5C542" stroke="${C}" stroke-width="3"/>`).join("")}<rect x="940" y="520" width="40" height="80" fill="#3d3a46" stroke="${C}" stroke-width="4"/>`;
    let piso = `<rect x="0" y="760" width="1920" height="150" fill="#8a5a3b"/>`;
    for (let i = 0; i < 6; i++) piso += `<path d="M0 ${770 + i * 24} H1920" stroke="#734a30" stroke-width="3"/>`;
    for (let i = 0; i < 30; i++) piso += `<path d="M${(i * 173) % 1920} ${770 + (i % 6) * 24} v24" stroke="#734a30" stroke-width="3"/>`;
    piso += `<path d="M0 760 H1920" stroke="${C}" stroke-width="5"/><rect x="0" y="900" width="1920" height="60" fill="#3a2418" stroke="${C}" stroke-width="5"/>`;
    for (let x = 60; x < 1920; x += 150) piso += `<ellipse cx="${x}" cy="890" rx="60" ry="16" fill="#fff3c4" opacity="0.3"/><path d="M${x - 26} 902 a26 22 0 0 1 52 0 Z" fill="#fff3c4" stroke="${C}" stroke-width="4"/>`;
    const fundo = `<rect width="1920" height="1080" fill="#15121f"/><rect width="1920" height="760" fill="#2b2440"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${200 + i * 190} 130 V760" stroke="#352d50" stroke-width="40"/>`).join("")}
      <g transform="translate(1300 370) scale(0.72) translate(-960 -370)">${telao}</g><rect x="0" y="100" width="1920" height="16" fill="#3d3a46"/>${piso}${feixe(500, 700)}${feixe(800, 820)}${feixe(1120, 1110)}${feixe(1420, 1240)}${[500, 800, 1120, 1420].map(lata).join("")}
      ${cortinaLado(0, 300, 1)}${cortinaLado(1620, 300, -1)}${bambinela}`;
    let confete = "";
    const cc = ["#F5C542", "#e2544f", "#4a90d9", "#6fae5a", "#fff8e6", "#b07cc6"];
    for (let i = 0; i < 70; i++) { const x = 320 + rnd(i) * 1280, y = 776 + rnd(i + 3) * 110; confete += `<rect x="${x}" y="${y}" width="14" height="8" rx="2" fill="${cc[i % 6]}" transform="rotate(${rnd(i + 11) * 180} ${x} ${y})"/>`; }
    const microfone = `<path d="M1560 880 L1600 870 L1640 880" stroke="${C}" stroke-width="6" fill="none"/><path d="M1600 872 V640 L1560 600" stroke="${C}" stroke-width="12" fill="none"/><path d="M1600 872 V640 L1560 600" stroke="#8a8e98" stroke-width="6" fill="none"/><rect x="1530" y="574" width="34" height="54" rx="16" fill="#3d3a46" stroke="${C}" stroke-width="4" transform="rotate(-45 1547 601)"/>`;
    const meio = `${confete}${microfone}`;
    let plateia = "";
    for (let i = 0; i < 16; i++) { const x = i * 128 + (i % 2) * 30 - 20, y = 1000 + (i % 3) * 22; plateia += `<path d="M${x - 70} 1090 Q${x - 66} ${y + 10} ${x} ${y + 6} Q${x + 66} ${y + 10} ${x + 70} 1090 Z" fill="#1d1929"/><circle cx="${x}" cy="${y - 30}" r="40" fill="#1d1929"/>`; if (i % 4 === 1) plateia += `<path d="M${x + 40} ${y + 10} L${x + 60} ${y - 70}" stroke="#1d1929" stroke-width="20" stroke-linecap="round"/><rect x="${x + 46}" y="${y - 120}" width="34" height="56" rx="6" fill="#bfe3f0" stroke="#1d1929" stroke-width="6"/>`; }
    return camadas(id, fundo, meio, plateia);
  }

  /* ---------- INFOGRAFICO com fundo de papel (a balanca vem de Objetos.balanca) ---------- */
  function infograficoBalanca(o = {}) {
    const id = o.id || "info";
    let s = `<rect width="1920" height="1080" fill="#F2E6C9"/>`;
    for (let x = 0; x <= 1920; x += 60) s += `<path d="M${x} 0 V1080" stroke="#eadcbc" stroke-width="2"/>`;
    for (let y = 0; y <= 1080; y += 60) s += `<path d="M0 ${y} H1920" stroke="#eadcbc" stroke-width="2"/>`;
    for (let i = 0; i < 260; i++) s += `<circle cx="${rnd(i) * 1920}" cy="${rnd(i + 400) * 1080}" r="${1 + rnd(i + 800) * 2}" fill="#d8c59e" opacity="0.6"/>`;
    s += `<rect x="40" y="40" width="1840" height="1000" rx="30" fill="none" stroke="#d9c49a" stroke-width="6" stroke-dasharray="26 18"/>`;
    const cifrao = (x, y, r, t) => `<text x="${x}" y="${y}" transform="rotate(${r} ${x} ${y})" text-anchor="middle" style="${F};font-size:${t}px" fill="#e8d199" stroke="#d6b96c" stroke-width="2">$</text>`;
    const estrela = (x, y, k) => `<path d="M${x} ${y - 22 * k} Q${x + 4 * k} ${y - 4 * k} ${x + 22 * k} ${y} Q${x + 4 * k} ${y + 4 * k} ${x} ${y + 22 * k} Q${x - 4 * k} ${y + 4 * k} ${x - 22 * k} ${y} Q${x - 4 * k} ${y - 4 * k} ${x} ${y - 22 * k} Z" fill="#F5C542" stroke="${C}" stroke-width="3"/>`;
    const moedinha = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="6" rx="30" ry="30" fill="#c9962f" stroke="${C}" stroke-width="4"/><circle cx="0" cy="0" r="30" fill="#e8b84a" stroke="${C}" stroke-width="4"/><circle cx="0" cy="0" r="21" fill="none" stroke="#c9962f" stroke-width="3"/><text x="0" y="11" text-anchor="middle" style="${F};font-size:30px" fill="#c9962f">$</text></g>`;
    const seta = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 Q60 -40 120 -10" fill="none" stroke="#c9b282" stroke-width="7" stroke-linecap="round"/><path d="M104 -28 L124 -8 L98 2" fill="none" stroke="#c9b282" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    s += cifrao(180, 220, -14, 90) + cifrao(1740, 260, 12, 110) + cifrao(150, 860, 10, 70) + cifrao(1790, 900, -10, 80) + cifrao(330, 560, 6, 50) + cifrao(1600, 600, -8, 54);
    s += estrela(300, 150, 1.2) + estrela(1640, 140, 0.9) + estrela(110, 520, 0.8) + estrela(1820, 480, 1.1) + estrela(420, 960, 0.7) + estrela(1500, 980, 0.9);
    s += moedinha(240, 380, 1) + moedinha(1700, 400, 0.8) + moedinha(1660, 760, 1.1) + moedinha(260, 720, 0.7);
    s += seta(1450, 200, -10) + seta(330, 980, -20);
    s += `<ellipse cx="960" cy="1000" rx="700" ry="40" fill="#e3d2b1"/><path d="M300 1000 H1620" stroke="#d6c194" stroke-width="6" stroke-linecap="round"/>`;
    return camadas(id, s, ``, ``);
  }

  /* ---------- COFRE: paredes de cofre, porta redonda aberta, caixas-fortes ---------- */
  function cofre(o = {}) {
    const id = o.id || "cofre";
    let parede = `<rect width="1920" height="720" fill="#E3D2B1"/>`;
    for (let x = 0; x < 1920; x += 240) for (let y = 0; y < 720; y += 180) { parede += `<rect x="${x + 6}" y="${y + 6}" width="228" height="168" rx="6" fill="#dcc8a2" stroke="#c4ae86" stroke-width="4"/>`; [[18, 18], [216, 18], [18, 156], [216, 156]].forEach(([dx, dy]) => parede += `<circle cx="${x + dx}" cy="${y + dy}" r="5" fill="#b49c72" stroke="#9c8560" stroke-width="2"/>`); }
    let caixas = `<rect x="1290" y="110" width="600" height="560" rx="8" fill="#9aa0ab" stroke="${C}" stroke-width="6"/>`;
    for (let r = 0; r < 7; r++) for (let c = 0; c < 6; c++) { const x = 1306 + c * 96, y = 126 + r * 76; if (r === 4 && c === 3) { caixas += `<rect x="${x}" y="${y}" width="86" height="66" fill="#3a3842" stroke="${C}" stroke-width="3"/><rect x="${x + 8}" y="${y + 30}" width="60" height="30" fill="#7fbf6a" stroke="${C}" stroke-width="2"/>`; continue; } caixas += `<rect x="${x}" y="${y}" width="86" height="66" rx="4" fill="#c0c5cf" stroke="${C}" stroke-width="3"/><circle cx="${x + 70}" cy="${y + 33}" r="7" fill="#e0b23e" stroke="${C}" stroke-width="2.5"/><rect x="${x + 12}" y="${y + 24}" width="30" height="16" rx="2" fill="#f4f4f6" stroke="${C}" stroke-width="2"/><text x="${x + 27}" y="${y + 37}" text-anchor="middle" style="${F};font-size:11px" fill="${C}">${100 + r * 6 + c}</text>`; }
    caixas += `<path d="M1594 430 L1540 404 L1540 470 L1594 496 Z" fill="#c0c5cf" stroke="${C}" stroke-width="3"/>`;
    const furoX = 800, furoY = 360, R = 230;
    let porta = `<circle cx="${furoX}" cy="${furoY}" r="${R + 34}" fill="#a9adb6" stroke="${C}" stroke-width="7"/><circle cx="${furoX}" cy="${furoY}" r="${R}" fill="#3a3842" stroke="${C}" stroke-width="6"/>`;
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; porta += `<circle cx="${furoX + Math.cos(a) * (R + 18)}" cy="${furoY + Math.sin(a) * (R + 18)}" r="7" fill="#8a8e98" stroke="${C}" stroke-width="2.5"/>`; }
    for (let r = 0; r < 3; r++) { const y = furoY - 120 + r * 100; porta += `<rect x="${furoX - 190}" y="${y + 60}" width="380" height="12" fill="#8a8e98" stroke="${C}" stroke-width="3"/>`; for (let i = 0; i < 6 - r; i++) porta += `<path d="M${furoX - 160 + i * 56 + r * 20} ${y + 60} l10 -26 h36 l10 26 Z" fill="#f5c542" stroke="${C}" stroke-width="3"/><path d="M${furoX - 148 + i * 56 + r * 20} ${y + 40} h22" stroke="#fff3c4" stroke-width="3"/>`; }
    const px = furoX - R - 170;
    porta += `<path d="M${px + 60} ${furoY - R - 10} Q${px - 30} ${furoY} ${px + 60} ${furoY + R + 10} L${px + 160} ${furoY + R + 10} Q${px + 70} ${furoY} ${px + 160} ${furoY - R - 10} Z" fill="#b9bdc6" stroke="${C}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M${px + 158} ${furoY - R} Q${px + 72} ${furoY} ${px + 158} ${furoY + R}" fill="none" stroke="#8a8e98" stroke-width="14"/>
      <ellipse cx="${px + 66}" cy="${furoY}" rx="34" ry="80" fill="#d9dce3" stroke="${C}" stroke-width="5"/>${[-60, -20, 20, 60].map(d => `<path d="M${px + 66} ${furoY} L${px + 66 + d * 0.3} ${furoY + d}" stroke="${C}" stroke-width="7"/>`).join("")}<circle cx="${px + 66}" cy="${furoY}" r="12" fill="#e0b23e" stroke="${C}" stroke-width="4"/>
      ${[-170, -60, 60, 170].map(d => `<rect x="${px + 150}" y="${furoY + d - 10}" width="50" height="20" rx="6" fill="#d9dce3" stroke="${C}" stroke-width="4"/>`).join("")}`;
    const lampada = (x) => `<path d="M${x - 60} 80 L${x + 60} 80 L${x + 260} 720 L${x - 260} 720 Z" fill="#fff3c4" opacity="0.1"/><path d="M${x} 0 V50" stroke="${C}" stroke-width="5"/><path d="M${x - 40} 50 h80 l-14 30 h-52 Z" fill="#6d6a7a" stroke="${C}" stroke-width="4"/><circle cx="${x}" cy="94" r="18" fill="#fff3c4" stroke="${C}" stroke-width="4"/><path d="M${x - 16} 82 L${x + 16} 106 M${x + 16} 82 L${x - 16} 106" stroke="${C}" stroke-width="3"/>`;
    let piso = `<rect x="0" y="720" width="1920" height="360" fill="#b9b3a8"/>`;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 17; c++) { const x = c * 120 + (r % 2) * 60 - 60, y = 720 + r * 60; piso += `<rect x="${x}" y="${y}" width="120" height="60" fill="${(c + r) % 2 ? "#aea79b" : "#c4beb3"}" stroke="#9c958a" stroke-width="2"/>`; }
    piso += `<path d="M0 720 H1920" stroke="${C}" stroke-width="5"/><rect x="0" y="700" width="1920" height="22" fill="#8a8e98" stroke="${C}" stroke-width="4"/><path d="M300 1000 L700 760" stroke="#fff" stroke-width="18" opacity="0.15"/>`;
    const cartaz = `<rect x="1080" y="30" width="200" height="64" rx="6" fill="#e2544f" stroke="${C}" stroke-width="5"/><text x="1180" y="74" text-anchor="middle" style="${F};font-size:30px" fill="#fff8e6">COFRE 1</text>`;
    const fundo = `${parede}${caixas}${porta}${cartaz}${piso}${lampada(560)}${lampada(1300)}`;
    const carrinho = `<g transform="translate(60 900)"><rect x="0" y="-130" width="240" height="110" rx="6" fill="#8a8e98" stroke="${C}" stroke-width="5"/><path d="M240 -130 L290 -190" stroke="${C}" stroke-width="8"/><circle cx="40" cy="0" r="22" fill="#2b2a31" stroke="${C}" stroke-width="4"/><circle cx="200" cy="0" r="22" fill="#2b2a31" stroke="${C}" stroke-width="4"/>
      ${[[80, -210], [40, -150], [110, -160], [180, -150]].map(([x, y]) => `<path d="M${x - 40} ${y + 30} Q${x - 46} ${y - 20} ${x - 12} ${y - 30} L${x + 12} ${y - 30} Q${x + 46} ${y - 20} ${x + 40} ${y + 30} Z" fill="#c9a76a" stroke="${C}" stroke-width="4"/><path d="M${x - 14} ${y - 30} q14 -10 28 0" stroke="${C}" stroke-width="5" fill="none"/><text x="${x}" y="${y + 14}" text-anchor="middle" style="${F};font-size:28px" fill="#6b5330">$</text>`).join("")}</g>`;
    let chao = "";
    for (let i = 0; i < 14; i++) { const x = 40 + rnd(i) * 1840, y = 1010 + rnd(i + 5) * 60, r = rnd(i + 9) * 60 - 30; chao += i % 3 ? `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-40" y="-18" width="80" height="36" rx="3" fill="#7fbf6a" stroke="${C}" stroke-width="3"/><circle cx="0" cy="0" r="9" fill="none" stroke="#4f8f45" stroke-width="3"/></g>` : `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="4" rx="22" ry="12" fill="#c9962f" stroke="${C}" stroke-width="3"/><ellipse cx="0" cy="0" rx="22" ry="12" fill="#e8b84a" stroke="${C}" stroke-width="3"/></g>`; }
    return camadas(id, fundo, carrinho, chao);
  }

  /* ---------- CONVES do iate ao por do sol (mar vazio) ---------- */
  function conveIate(o = {}) {
    const id = o.id || "iate";
    const faixas = [["#4b3f7a", 0], ["#7a4f8f", 130], ["#b65c84", 250], ["#e2766c", 360], ["#f29e5c", 450], ["#f9c46a", 520]];
    let ceu = faixas.map(([c, y], i) => `<rect x="0" y="${y}" width="1920" height="${(faixas[i + 1] ? faixas[i + 1][1] : 580) - y + 2}" fill="${c}"/>`).join("");
    ceu += `<circle cx="1380" cy="580" r="150" fill="#ffd36b" opacity="0.35"/><circle cx="1380" cy="580" r="110" fill="#ffd36b" stroke="${C}" stroke-width="5"/><circle cx="1380" cy="580" r="80" fill="#ffe7a0"/>`;
    ceu += [[200, 200, 360], [900, 320, 300], [1500, 160, 420], [520, 420, 260]].map(([x, y, w]) => `<path d="M${x} ${y} h${w} q20 0 20 12 h${-w - 60} q0 -12 20 -12 Z" fill="#f6b8a0" opacity="0.8"/>`).join("");
    ceu += `<path d="M640 260 q14 -12 28 0 q14 -12 28 0" fill="none" stroke="${C}" stroke-width="4"/>`;
    let mar = `<rect x="0" y="580" width="1920" height="200" fill="#3d5f8f"/><path d="M0 580 H1920" stroke="${C}" stroke-width="4"/>`;
    for (let i = 0; i < 40; i++) { const y = 596 + (i % 8) * 22, x = rnd(i) * 1900; mar += `<path d="M${x} ${y} h${30 + rnd(i + 3) * 70}" stroke="#5b80b0" stroke-width="4" stroke-linecap="round"/>`; }
    for (let i = 0; i < 9; i++) mar += `<rect x="${1380 - 90 + (i % 3) * 10 + rnd(i) * 40}" y="${592 + i * 20}" width="${160 - i * 12}" height="8" rx="4" fill="#ffd36b" opacity="${0.9 - i * 0.08}"/>`;
    let deck = `<rect x="0" y="780" width="1920" height="300" fill="#b07a4a"/>`;
    for (let i = -12; i <= 12; i++) deck += `<path d="M${960 + i * 22} 780 L${960 + i * 190} 1080" stroke="#93613a" stroke-width="5"/>`;
    for (let i = 0; i < 4; i++) deck += `<path d="M0 ${820 + i * 70 + i * i * 6} H1920" stroke="#9d6b40" stroke-width="3" opacity="0.6"/>`;
    deck += `<path d="M0 780 H1920" stroke="${C}" stroke-width="5"/>`;
    let grade = "";
    [690, 735].forEach(y => grade += `<path d="M0 ${y} H1920" stroke="${C}" stroke-width="7"/><path d="M0 ${y} H1920" stroke="#bfc3cc" stroke-width="3"/>`);
    for (let x = 40; x < 1920; x += 200) grade += `<rect x="${x - 8}" y="636" width="16" height="148" fill="#d9dce3" stroke="${C}" stroke-width="4"/>`;
    grade += `<path d="M0 640 H1920" stroke="${C}" stroke-width="16"/><path d="M0 640 H1920" stroke="#d9dce3" stroke-width="9"/><path d="M0 636 H1920" stroke="#fff" stroke-width="2"/>`;
    for (let x = 40; x < 1920; x += 200) grade += `<circle cx="${x}" cy="640" r="10" fill="#e9ebf0" stroke="${C}" stroke-width="4"/>`;
    const a = (g) => g * Math.PI / 180;
    const boia = `<g transform="translate(300 710)"><circle cx="0" cy="0" r="62" fill="#fff8e6" stroke="${C}" stroke-width="6"/>${[0, 90, 180, 270].map(g => `<path d="M${Math.cos(a(g - 22)) * 62} ${Math.sin(a(g - 22)) * 62} A62 62 0 0 1 ${Math.cos(a(g + 22)) * 62} ${Math.sin(a(g + 22)) * 62} L${Math.cos(a(g + 22)) * 30} ${Math.sin(a(g + 22)) * 30} A30 30 0 0 0 ${Math.cos(a(g - 22)) * 30} ${Math.sin(a(g - 22)) * 30} Z" fill="#e2544f" stroke="${C}" stroke-width="4"/>`).join("")}<circle cx="0" cy="0" r="30" fill="#b07a4a" stroke="${C}" stroke-width="6"/><text x="0" y="-40" text-anchor="middle" style="${F};font-size:15px" fill="${C}">TRI-1</text><path d="M0 -62 L0 -72" stroke="${C}" stroke-width="5"/></g>`;
    const poste = (x) => `<circle cx="${x}" cy="498" r="50" fill="#fff3c4" opacity="0.3"/><rect x="${x - 7}" y="520" width="14" height="260" fill="#d9dce3" stroke="${C}" stroke-width="4"/><path d="M${x - 26} 520 h52 l-8 -50 h-36 Z" fill="#fff3c4" stroke="${C}" stroke-width="4"/><path d="M${x - 30} 470 h60" stroke="${C}" stroke-width="6"/>`;
    const fundo = `${ceu}${mar}${deck}${grade}${boia}${poste(120)}${poste(1800)}`;
    const balde = `<g transform="translate(1680 880)"><path d="M14 -230 L24 -330 L44 -330 L40 -230 Z" fill="#2f5b3a" stroke="${C}" stroke-width="4"/><rect x="24" y="-352" width="18" height="24" fill="#e0b23e" stroke="${C}" stroke-width="3"/><path d="M-10 0 V-140 M10 0 V-140 M-50 0 h100" stroke="${C}" stroke-width="7"/><path d="M-10 0 V-140 M10 0 V-140" stroke="#d9dce3" stroke-width="3"/><path d="M-60 -140 L60 -140 L50 -230 L-50 -230 Z" fill="#d9dce3" stroke="${C}" stroke-width="5"/><path d="M-40 -150 L-34 -220" stroke="#fff" stroke-width="6" opacity="0.7"/>${[-30, -6, 20].map(x => `<path d="M${x} -232 l14 -18 l14 18 Z" fill="#dff3fb" stroke="${C}" stroke-width="3"/>`).join("")}</g>`;
    const meio = `${planta(70, 860, 1.1, "#f4efe4")}${balde}`;
    const corda = `<g transform="translate(1780 1040)">${[70, 54, 38, 22].map(r => `<ellipse cx="0" cy="0" rx="${r}" ry="${r * 0.35}" fill="${r === 70 ? "#d9b48a" : "none"}" stroke="${C}" stroke-width="9"/><ellipse cx="0" cy="0" rx="${r}" ry="${r * 0.35}" fill="none" stroke="#e8cf9e" stroke-width="5"/>`).join("")}</g>`;
    const espreguicadeira = `<g transform="translate(-40 1000)"><path d="M0 0 L300 -20 L420 -150" stroke="${C}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M0 0 L300 -20 L420 -150" stroke="#f4efe4" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M10 -6 L296 -28 L410 -154 L404 -164 L290 -40 L6 -18 Z" fill="#4a90d9" stroke="${C}" stroke-width="4"/></g>`;
    const mesinha = `<g transform="translate(110 1060)"><ellipse cx="0" cy="-120" rx="80" ry="18" fill="#f4efe4" stroke="${C}" stroke-width="5"/><path d="M0 -104 V0 M-40 0 h80" stroke="${C}" stroke-width="8"/><path d="M0 -104 V0" stroke="#d9dce3" stroke-width="3"/><path d="M-30 -126 q10 -6 20 0 L-14 -170 q-6 -20 0 -36 h-12 q6 16 0 36 Z" fill="#dff3fb" stroke="${C}" stroke-width="3"/><path d="M-26 -148 h12" stroke="#f29e5c" stroke-width="10"/><circle cx="-12" cy="-196" r="8" fill="#f29e5c" stroke="${C}" stroke-width="2"/></g>`;
    return camadas(id, fundo, meio, corda + mesinha);
  }

  Object.assign(window.Cenarios, { quarto, corredorClube, palco, infograficoBalanca, cofre, conveIate, planta, lustre, tenis });
})();

/* ===== Cenarios da parte 2 do video do trilionario (09/11/2026) =====
 * espacoGlobo, avenidaTelao, fachadaPredio (alta: vai de y=-1700 a 1080, para a camera subir), salaApto.
 * Mesma estrutura: <g id> com -fundo, -meio (atras do personagem) e -frente (na frente dele).
 * Ganchos para animar (ids): ver o comentario de cada cenario. */
(function () {
  const C = (window.ESTILO && window.ESTILO.contorno) || "#2E2A33";
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const esc = (h, f) => window.Objetos.esc(h, f);
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const camadas = (id, fundo, meio, frente) => `<g id="${id}"><g id="${id}-fundo">${fundo}</g><g id="${id}-meio">${meio}</g><g id="${id}-frente">${frente}</g></g>`;
  const P = window.Cenarios;

  /* ---------- ESPACO COM GLOBO ----------
   * ids: -terra (globo, centro 960 560 r 380), -pontos (pontinhos amarelos, opacity 0; cada um -ponto-N),
   *      -brilho (aura amarela, opacity 0), -satelite (gira em volta), -lua.
   * espacoGlobo.pontos: lista [x, y] dos pontos sobre os continentes (para pôr as fotinhos). */
  const PONTOS_GLOBO = [[700, 380], [760, 430], [640, 460], [820, 360], [720, 520], [800, 620], [850, 700], [820, 800], [870, 760], [1040, 330], [1100, 360], [990, 380], [1060, 480], [1130, 520], [1090, 600], [1160, 640], [1120, 720], [1200, 470], [1260, 400], [1300, 520], [1220, 330], [930, 470], [680, 600], [1240, 760]];
  function espacoGlobo(o = {}) {
    const id = o.id || "espaco";
    let fundo = `<defs><radialGradient id="${id}-gc" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#2a3a78"/><stop offset="1" stop-color="#0f1430"/></radialGradient>
      <clipPath id="${id}-clip"><circle cx="960" cy="560" r="380"/></clipPath></defs>
      <rect width="1920" height="1080" fill="url(#${id}-gc)"/>`;
    [[300, 260, 260, "#5b4a9a"], [1600, 820, 300, "#3a5a9a"], [1500, 200, 180, "#7a4a8a"]].forEach(([x, y, r, c]) => fundo += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="0.18"/><circle cx="${x + 40}" cy="${y - 30}" r="${r * 0.6}" fill="${c}" opacity="0.14"/>`);
    for (let i = 0; i < 140; i++) { const x = rnd(i) * 1920, y = rnd(i + 500) * 1080, r = 1.5 + rnd(i + 900) * 3; fundo += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff8e6" opacity="${(0.5 + rnd(i + 77) * 0.5).toFixed(2)}"/>`; }
    const estrela4 = (x, y, s) => `<path d="M${x} ${y - 18 * s} Q${x + 3 * s} ${y - 3 * s} ${x + 18 * s} ${y} Q${x + 3 * s} ${y + 3 * s} ${x} ${y + 18 * s} Q${x - 3 * s} ${y + 3 * s} ${x - 18 * s} ${y} Q${x - 3 * s} ${y - 3 * s} ${x} ${y - 18 * s} Z" fill="#fff3c4"/>`;
    [[180, 140, 1.2], [420, 900, 1], [1320, 120, 0.9], [1760, 520, 1.3], [90, 640, 0.8], [1180, 980, 0.9], [560, 120, 0.7]].forEach(([x, y, s]) => fundo += estrela4(x, y, s));
    // lua no canto
    fundo += `<g id="${id}-lua"><circle cx="1660" cy="190" r="96" fill="#e9e4d6" stroke="${C}" stroke-width="6"/><path d="M1600 120 Q1700 140 1736 250 Q1680 296 1610 270 Q1580 200 1600 120 Z" fill="#d3ccba" opacity="0.7"/>
      ${[[1630, 160, 18], [1690, 210, 12], [1650, 240, 9], [1700, 150, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#cfc7b2" stroke="${esc("#cfc7b2", -0.25)}" stroke-width="3"/>`).join("")}</g>`;
    // atmosfera e globo
    const brilho = `<g id="${id}-brilho" opacity="0"><circle cx="960" cy="560" r="520" fill="#F5C542" opacity="0.18"/><circle cx="960" cy="560" r="450" fill="#F5C542" opacity="0.3"/><circle cx="960" cy="560" r="400" fill="#ffe08a" opacity="0.5"/></g>`;
    let terra = `<circle cx="960" cy="560" r="420" fill="#7fb8e0" opacity="0.25"/><circle cx="960" cy="560" r="396" fill="#9fd0f0" opacity="0.35"/>
      <circle cx="960" cy="560" r="380" fill="#3d7fc9"/>
      <g clip-path="url(#${id}-clip)">
      <path d="M560 560 Q620 300 960 180 Q1300 190 1360 560 Q1300 860 960 940 Q640 900 560 560 Z" fill="#4a8fd6" opacity="0.6"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${600 + i * 30} ${300 + i * 110} q60 -14 120 0 t120 0" fill="none" stroke="#5b9ee0" stroke-width="6" stroke-linecap="round"/>`).join("")}
      <!-- america do norte (topo esquerdo) -->
      <path d="M560 300 Q620 250 700 270 Q760 250 830 300 Q860 340 820 380 Q790 400 800 440 Q760 470 720 450 Q700 500 660 480 Q620 460 600 420 Q560 400 560 300 Z" fill="#6fae5a" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M610 330 Q660 320 690 350 M720 300 Q760 310 780 340" fill="none" stroke="#4f8f45" stroke-width="6" stroke-linecap="round"/>
      <!-- america do sul -->
      <path d="M740 560 Q800 530 860 560 Q900 600 890 660 Q880 720 850 770 Q830 830 800 880 Q780 900 770 870 Q780 800 760 740 Q720 690 720 630 Q720 580 740 560 Z" fill="#6fae5a" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M780 610 Q820 620 840 660 M790 720 Q810 740 812 780" fill="none" stroke="#4f8f45" stroke-width="6" stroke-linecap="round"/>
      <!-- europa e africa -->
      <path d="M990 300 Q1040 270 1100 290 Q1150 300 1140 340 Q1110 360 1080 352 Q1060 380 1020 372 Q990 350 990 300 Z" fill="#8cc272" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M1000 420 Q1080 400 1160 430 Q1210 470 1200 540 Q1190 600 1150 660 Q1120 730 1090 760 Q1060 770 1050 730 Q1040 660 1010 610 Q970 560 980 500 Q980 440 1000 420 Z" fill="#d9b45a" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M1040 460 Q1100 470 1150 500 Q1160 560 1120 620 Q1090 660 1070 640 Q1060 580 1030 540 Q1020 490 1040 460 Z" fill="#6fae5a"/>
      <!-- asia (borda direita) -->
      <path d="M1180 300 Q1260 270 1340 300 L1400 330 L1400 600 Q1340 560 1300 580 Q1260 540 1230 500 Q1200 460 1220 420 Q1180 380 1180 300 Z" fill="#6fae5a" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M1240 340 Q1290 350 1320 390 M1260 450 Q1290 470 1300 500" fill="none" stroke="#4f8f45" stroke-width="6" stroke-linecap="round"/>
      <path d="M1220 720 Q1270 700 1300 730 Q1290 770 1240 776 Q1210 760 1220 720 Z" fill="#d9b45a" stroke="${C}" stroke-width="6"/>
      <!-- gelo -->
      <path d="M760 180 Q960 150 1160 180 L1160 200 Q960 220 760 200 Z" fill="#f4f7fb" stroke="${C}" stroke-width="5"/>
      <path d="M800 930 Q960 960 1120 930 L1140 960 Q960 990 780 960 Z" fill="#f4f7fb" stroke="${C}" stroke-width="5"/>
      <!-- nuvens em faixas -->
      ${[[640, 400, 220], [900, 520, 260], [1150, 380, 200], [700, 700, 180], [1000, 820, 240], [1240, 620, 160]].map(([x, y, w]) => `<path d="M${x} ${y} h${w} q16 0 16 10 h${-w - 40} q0 -10 24 -10 Z" fill="#fff" opacity="0.75"/>`).join("")}
      <!-- sombra do lado da noite -->
      <path d="M1200 220 Q1400 560 1180 900 L1400 900 L1400 220 Z" fill="#0f1430" opacity="0.22"/>
      <circle cx="830" cy="410" r="210" fill="#fff" opacity="0.07"/>
      </g>
      <circle cx="960" cy="560" r="380" fill="none" stroke="${C}" stroke-width="8"/>
      <path d="M700 300 Q760 250 840 232" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.5"/>`;
    let pontos = `<g id="${id}-pontos">`;
    PONTOS_GLOBO.forEach(([x, y], i) => pontos += `<g id="${id}-ponto-${i}" opacity="0"><circle cx="${x}" cy="${y}" r="20" fill="#F5C542" opacity="0.35"/><circle cx="${x}" cy="${y}" r="9" fill="#F5C542" stroke="${C}" stroke-width="3"/></g>`);
    pontos += `</g>`;
    const satelite = `<g id="${id}-satelite" transform="translate(1440 760) rotate(-18)">
      <rect x="-110" y="-26" width="76" height="52" fill="#3a5fb0" stroke="${C}" stroke-width="4"/>${[0, 1, 2].map(i => `<path d="M${-110 + i * 25 + 25} -26 v52" stroke="#9fc4f0" stroke-width="3"/>`).join("")}<path d="M-110 0 h76" stroke="#9fc4f0" stroke-width="3"/>
      <rect x="34" y="-26" width="76" height="52" fill="#3a5fb0" stroke="${C}" stroke-width="4"/>${[0, 1, 2].map(i => `<path d="M${34 + i * 25 + 25} -26 v52" stroke="#9fc4f0" stroke-width="3"/>`).join("")}<path d="M34 0 h76" stroke="#9fc4f0" stroke-width="3"/>
      <path d="M-34 0 h68" stroke="${C}" stroke-width="6"/><rect x="-26" y="-34" width="52" height="68" rx="8" fill="#d9dce3" stroke="${C}" stroke-width="5"/><rect x="-16" y="-22" width="32" height="18" rx="3" fill="#F5C542" stroke="${C}" stroke-width="3"/>
      <path d="M0 -34 v-24" stroke="${C}" stroke-width="4"/><circle cx="0" cy="-62" r="7" fill="#e2544f" stroke="${C}" stroke-width="3"/>
      <path d="M-6 34 q6 22 26 30" fill="none" stroke="${C}" stroke-width="4"/><path d="M8 52 q16 -6 22 -24 q-20 0 -22 24 Z" fill="#f4efe4" stroke="${C}" stroke-width="4"/></g>`;
    const cometa = `<g opacity="0.85"><path d="M260 470 L420 410" stroke="#fff3c4" stroke-width="6" stroke-linecap="round" opacity="0.5"/><path d="M300 466 L420 410" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="424" cy="408" r="9" fill="#fff8e6" stroke="${C}" stroke-width="3"/></g>`;
    return camadas(id, fundo + cometa, brilho + `<g id="${id}-terra">${terra}</g>` + pontos, satelite);
  }
  espacoGlobo.pontos = PONTOS_GLOBO;

  /* ---------- AVENIDA COM TELAO ----------
   * ids: -tela (grupo da tela do telao; area 660x372 em x 630..1290, y 112..484: pôr a foto aqui), -ledsTelao.
   * Chao: calcada 700..840, rua 840..1080. Placa "AV. PAULISTA" no poste da esquerda. */
  function avenidaTelao(o = {}) {
    const id = o.id || "avenida";
    let fundo = `<defs><linearGradient id="${id}-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0ea"/><stop offset="1" stop-color="#e3f2f6"/></linearGradient></defs>
      <rect width="1920" height="720" fill="url(#${id}-ceu)"/>${P.nuvem(80, 60, 1)}${P.nuvem(1500, 30, 1.1)}`;
    // predios de vidro ao fundo (mais claros)
    [[0, 230, 140, "#a9c7d8"], [200, 200, 60, "#b8d2df"], [380, 250, 220, "#9fbdd0"], [1320, 220, 100, "#a9c7d8"], [1520, 180, 40, "#b8d2df"], [1700, 240, 150, "#9fbdd0"]].forEach(([x, w, topo, c]) => {
      fundo += `<rect x="${x}" y="${topo}" width="${w}" height="${720 - topo}" fill="${c}" stroke="${C}" stroke-width="5"/>`;
      for (let yy = topo + 24; yy < 700; yy += 46) fundo += `<path d="M${x + 10} ${yy} h${w - 20}" stroke="${esc(c, -0.12)}" stroke-width="3"/>`;
      for (let xx = x + 40; xx < x + w - 10; xx += 46) fundo += `<path d="M${xx} ${topo + 10} V700" stroke="${esc(c, -0.08)}" stroke-width="2"/>`;
      fundo += `<path d="M${x + w * 0.2} ${topo + 30} L${x + w * 0.55} ${topo + 200} M${x + w * 0.4} ${topo + 30} L${x + w * 0.75} ${topo + 200}" stroke="#fff" stroke-width="6" opacity="0.5"/>`;
    });
    // antena com luz vermelha (torres da avenida)
    [[110, 140], [1810, 150], [1420, 100]].forEach(([x, topo]) => fundo += `<path d="M${x} ${topo} V${topo - 90} M${x - 20} ${topo} L${x} ${topo - 60} L${x + 20} ${topo}" stroke="${C}" stroke-width="5" fill="none"/><path d="M${x - 14} ${topo - 30} h28 M${x - 8} ${topo - 55} h16" stroke="${C}" stroke-width="4"/><circle cx="${x}" cy="${topo - 94}" r="9" fill="#e2544f" stroke="${C}" stroke-width="3"/>`);
    // predio do telao (centro)
    fundo += `<rect x="560" y="40" width="800" height="680" fill="#5c7f9c" stroke="${C}" stroke-width="6"/>`;
    for (let yy = 520; yy < 710; yy += 40) for (let xx = 580; xx < 1350; xx += 64) fundo += `<rect x="${xx}" y="${yy}" width="50" height="30" fill="#8fb4cf" stroke="${C}" stroke-width="3"/><path d="M${xx + 6} ${yy + 24} L${xx + 22} ${yy + 6}" stroke="#d4e8f4" stroke-width="3"/>`;
    fundo += `<rect x="610" y="92" width="700" height="412" rx="10" fill="#1c1a24" stroke="${C}" stroke-width="6"/>`;
    let leds = `<g id="${id}-ledsTelao">`; for (let i = 0; i < 28; i++) leds += `<circle cx="${624 + i * 25}" cy="100" r="4" fill="#F5C542"/><circle cx="${624 + i * 25}" cy="496" r="4" fill="#F5C542"/>`; leds += `</g>`;
    fundo += leds + `<g id="${id}-tela"><rect x="630" y="112" width="660" height="372" fill="#2a2f4a"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M630 ${130 + i * 40} h660" stroke="#33395a" stroke-width="3"/>`).join("")}</g>`;
    fundo += `<rect x="900" y="504" width="120" height="16" fill="#3d3a46" stroke="${C}" stroke-width="4"/>`;
    // fachada da rua: lojas no terreo
    fundo += `<rect x="0" y="600" width="1920" height="120" fill="#e7dfd0" stroke="${C}" stroke-width="5"/>`;
    [[20, "#e2544f", "CAFÉ"], [300, "#2f6db3", "BANCO"], [1380, "#3aa36b", "LIVRARIA"], [1660, "#f29e4c", "LANCHES"]].forEach(([x, c, t]) => fundo += `<rect x="${x}" y="610" width="240" height="44" rx="4" fill="${c}" stroke="${C}" stroke-width="4"/><text x="${x + 120}" y="644" text-anchor="middle" style="${F};font-size:30px" fill="#fff8e6">${t}</text><rect x="${x + 10}" y="660" width="220" height="60" fill="#cfe8f1" stroke="${C}" stroke-width="4"/><path d="M${x + 30} 714 L${x + 70} 666 M${x + 60} 714 L${x + 100} 666" stroke="#fff" stroke-width="5" opacity="0.7"/>`);
    // calcada
    let meio = `<rect x="0" y="720" width="1920" height="120" fill="#ece7de"/><path d="M0 720 H1920" stroke="${C}" stroke-width="5"/>`;
    for (let x = -40; x < 1960; x += 80) meio += `<path d="M${x} 726 q40 22 80 0 M${x} 770 q40 22 80 0" fill="none" stroke="#d8d0c2" stroke-width="5"/>`;
    meio += `<rect x="0" y="832" width="1920" height="16" fill="#cfc8bb" stroke="${C}" stroke-width="4"/>`;
    // arvores e poste com placa
    const arvore = (x) => `<rect x="${x - 12}" y="600" width="24" height="210" fill="#8a5a36" stroke="${C}" stroke-width="5"/><circle cx="${x - 50}" cy="610" r="56" fill="#5f9f4f" stroke="${C}" stroke-width="5"/><circle cx="${x + 50}" cy="604" r="60" fill="#6fae5a" stroke="${C}" stroke-width="5"/><circle cx="${x}" cy="566" r="64" fill="#78b864" stroke="${C}" stroke-width="5"/><circle cx="${x - 20}" cy="556" r="16" fill="#9fd08a" opacity="0.6"/><rect x="${x - 40}" y="800" width="80" height="16" rx="4" fill="#9a8f7e" stroke="${C}" stroke-width="4"/>`;
    meio += arvore(640) + arvore(1290);
    meio += `<rect x="186" y="420" width="16" height="400" fill="#4a4d57" stroke="${C}" stroke-width="4"/><rect x="60" y="440" width="270" height="88" rx="8" fill="#2e7d4f" stroke="${C}" stroke-width="6"/><rect x="70" y="450" width="250" height="68" rx="5" fill="none" stroke="#fff8e6" stroke-width="3"/><text x="195" y="498" text-anchor="middle" style="${F};font-size:33px" fill="#fff8e6">AV. PAULISTA</text>
      <path d="M194 420 V380 Q194 350 230 350 H300" fill="none" stroke="#4a4d57" stroke-width="12"/><path d="M290 340 h60 l-8 24 h-44 Z" fill="#fff3c4" stroke="${C}" stroke-width="4"/>`;
    // semaforo
    meio += `<rect x="1712" y="500" width="14" height="320" fill="#4a4d57" stroke="${C}" stroke-width="4"/><rect x="1690" y="420" width="58" height="150" rx="10" fill="#2b2a31" stroke="${C}" stroke-width="5"/><circle cx="1719" cy="450" r="16" fill="#e2544f" stroke="${C}" stroke-width="3"/><circle cx="1719" cy="495" r="16" fill="#6b5a2a"/><circle cx="1719" cy="540" r="16" fill="#2a4a2e"/>`;
    // ponto de onibus
    meio += `<path d="M820 610 h300 l-14 26 h-272 Z" fill="#3a5fb0" stroke="${C}" stroke-width="5"/><path d="M836 636 V800 M1104 636 V800" stroke="#9aa0ab" stroke-width="8"/><rect x="850" y="650" width="120" height="130" fill="#cfe8f1" opacity="0.7" stroke="${C}" stroke-width="3"/><rect x="870" y="760" width="220" height="16" rx="4" fill="#d49a63" stroke="${C}" stroke-width="4"/><rect x="990" y="650" width="100" height="90" rx="4" fill="#f5c542" stroke="${C}" stroke-width="4"/><text x="1040" y="704" text-anchor="middle" style="${F};font-size:26px" fill="${C}">BUS</text>`;
    // rua com faixa de pedestre e carros parados
    let frente = `<rect x="0" y="848" width="1920" height="232" fill="#4b4a55"/>`;
    for (let x = 640; x < 1280; x += 70) frente += `<rect x="${x}" y="860" width="40" height="70" fill="#f4efe4" opacity="0.9"/>`;
    for (let x = 40; x < 1920; x += 260) frente += `<rect x="${x}" y="1000" width="150" height="14" rx="4" fill="#f2c94c" stroke="${C}" stroke-width="3"/>`;
    const carro = (x, pes, e, cor, esp) => `<g transform="translate(${x} ${pes - 362 * e}) scale(${esp ? -e : e} ${e})">${window.Objetos.carroHatch({ id: id + "-carro" + x, cor })}</g>`;
    frente += carro(-60, 1060, 0.62, "#4a90d9") + carro(1500, 1060, 0.62, "#f5c542", true) + carro(1960, 1070, 0.62, "#6fae5a", true);
    return camadas(id, fundo, meio, frente);
  }

  /* ---------- FACHADA DO PREDIO (alta) ----------
   * Desenha de y=-1700 (topo) ate 1080: a camera comeca em 0..1080 (portaria) e sobe.
   * ids: -janelaDele (janela com a cortina amarela, centro em fachadaPredio.janela), -olhos (opacity 0: os olhos atras da cortina),
   *      -portaria. Chao: calcada 820..960, rua 960..1080. */
  function fachadaPredio(o = {}) {
    const id = o.id || "fachada";
    const T = -1700;
    let fundo = `<defs><linearGradient id="${id}-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec6e6"/><stop offset="1" stop-color="#d9eef5"/></linearGradient></defs>
      <rect x="0" y="${T}" width="1920" height="${2780}" fill="url(#${id}-ceu)"/>${P.nuvem(80, -1600, 1.3)}${P.nuvem(1520, -1300, 1.1)}${P.nuvem(160, -700, 0.9)}${P.nuvem(1600, -300, 1)}`;
    // vizinhos dos lados
    fundo += `<rect x="0" y="-600" width="380" height="1420" fill="#d8cfe8" stroke="${C}" stroke-width="5"/><rect x="1540" y="-900" width="380" height="1720" fill="#f3d9c4" stroke="${C}" stroke-width="5"/>`;
    for (let yy = -540; yy < 700; yy += 150) for (let xx = 40; xx < 360; xx += 110) fundo += `<rect x="${xx}" y="${yy}" width="70" height="90" fill="#bfe3f0" stroke="${C}" stroke-width="4"/>`;
    for (let yy = -840; yy < 700; yy += 150) for (let xx = 1580; xx < 1900; xx += 110) fundo += `<rect x="${xx}" y="${yy}" width="70" height="90" fill="#bfe3f0" stroke="${C}" stroke-width="4"/>`;
    // predio principal
    const X0 = 400, W = 1120;
    fundo += `<rect x="${X0}" y="${T + 160}" width="${W}" height="${820 - T - 160}" fill="#f2e6cf" stroke="${C}" stroke-width="6"/>
      <rect x="${X0 - 20}" y="${T + 140}" width="${W + 40}" height="40" fill="#d9c7a6" stroke="${C}" stroke-width="6"/>
      <rect x="${X0 + 420}" y="${T + 40}" width="280" height="100" fill="#d9c7a6" stroke="${C}" stroke-width="5"/><rect x="${X0 + 460}" y="${T + 60}" width="80" height="60" fill="#9aa0ab" stroke="${C}" stroke-width="4"/><path d="M${X0 + 640} ${T + 40} V${T - 40}" stroke="${C}" stroke-width="5"/><circle cx="${X0 + 640}" cy="${T - 44}" r="8" fill="#e2544f" stroke="${C}" stroke-width="3"/>
      <rect x="${X0 + 120}" y="${T + 60}" width="160" height="80" fill="#4a90d9" stroke="${C}" stroke-width="5"/><path d="M${X0 + 130} ${T + 80} h140 M${X0 + 130} ${T + 100} h140 M${X0 + 130} ${T + 120} h140" stroke="#9fc4f0" stroke-width="3"/>`;
    // andares: 3 colunas de janelas com varanda
    const andarH = 200, cores = ["#e2544f", "#4a90d9", "#6fae5a", "#b07cc6", "#f29e4c"];
    const JX = [X0 + 90, X0 + 450, X0 + 810];
    let k = 0;
    for (let y = T + 230; y < 300; y += andarH) {
      JX.forEach((jx, c) => {
        k++;
        const dele = (c === 1 && y === T + 230 + andarH * 2);
        if (dele) return; // desenhada a parte
        fundo += `<rect x="${jx}" y="${y}" width="220" height="130" rx="4" fill="#bfe3f0" stroke="${C}" stroke-width="5"/><path d="M${jx + 110} ${y} V${y + 130}" stroke="${C}" stroke-width="4"/><path d="M${jx + 20} ${y + 110} L${jx + 70} ${y + 20} M${jx + 130} ${y + 110} L${jx + 180} ${y + 20}" stroke="#fff" stroke-width="5" opacity="0.6"/>`;
        if (rnd(k) > 0.45) fundo += `<path d="M${jx + 6} ${y + 6} Q${jx + 40} ${y + 65} ${jx + 8} ${y + 124} L${jx + 6} ${y + 124} Z M${jx + 214} ${y + 6} Q${jx + 180} ${y + 65} ${jx + 212} ${y + 124} Z" fill="${cores[k % 5]}" stroke="${C}" stroke-width="3"/>`;
        // varanda
        fundo += `<rect x="${jx - 20}" y="${y + 130}" width="260" height="14" fill="#d9c7a6" stroke="${C}" stroke-width="4"/><rect x="${jx - 20}" y="${y + 100}" width="260" height="8" fill="#9aa0ab" stroke="${C}" stroke-width="3"/>`;
        for (let b = 0; b < 9; b++) fundo += `<path d="M${jx - 10 + b * 30} ${y + 108} V${y + 130}" stroke="#9aa0ab" stroke-width="4"/>`;
        if (rnd(k + 40) > 0.5) fundo += `<path d="M${jx + 190} ${y + 100} l-10 30 h40 l-10 -30 Z" fill="#c96b4a" stroke="${C}" stroke-width="3"/><circle cx="${jx + 200}" cy="${y + 88}" r="18" fill="#6fae5a" stroke="${C}" stroke-width="3"/>`;
        if (rnd(k + 80) > 0.7) fundo += `<rect x="${jx + 240}" y="${y + 40}" width="56" height="36" rx="4" fill="#e9ebef" stroke="${C}" stroke-width="4"/><path d="M${jx + 246} ${y + 52} h44 M${jx + 246} ${y + 62} h44" stroke="#9aa0ab" stroke-width="3"/>`;
      });
    }
    // a janela dele (cortina amarela), no 3o andar de cima, coluna do meio
    const jy = T + 230 + andarH * 2, jx = JX[1];
    const janelaDele = `<g id="${id}-janelaDele"><rect x="${jx - 10}" y="${jy - 10}" width="240" height="150" rx="6" fill="#F5C542" opacity="0.35"/>
      <rect x="${jx}" y="${jy}" width="220" height="130" rx="4" fill="#3a3550" stroke="${C}" stroke-width="5"/>
      <g id="${id}-olhos" opacity="0"><ellipse cx="${jx + 96}" cy="${jy + 62}" rx="13" ry="16" fill="#fff" stroke="${C}" stroke-width="3"/><ellipse cx="${jx + 128}" cy="${jy + 62}" rx="13" ry="16" fill="#fff" stroke="${C}" stroke-width="3"/><circle cx="${jx + 98}" cy="${jy + 66}" r="6" fill="${C}"/><circle cx="${jx + 130}" cy="${jy + 66}" r="6" fill="${C}"/><path d="M${jx + 82} ${jy + 40} q14 -8 28 0 M${jx + 114} ${jy + 40} q14 -8 28 0" fill="none" stroke="#26221f" stroke-width="5" stroke-linecap="round"/></g>
      <path d="M${jx + 4} ${jy + 4} H${jx + 100} Q${jx + 92} ${jy + 70} ${jx + 104} ${jy + 126} H${jx + 4} Z" fill="#F5C542" stroke="${C}" stroke-width="4"/><path d="M${jx + 216} ${jy + 4} H${jx + 126} Q${jx + 132} ${jy + 70} ${jx + 122} ${jy + 126} H${jx + 216} Z" fill="#F5C542" stroke="${C}" stroke-width="4"/>
      ${[24, 50, 76].map(d => `<path d="M${jx + d} ${jy + 8} V${jy + 122} M${jx + 220 - d} ${jy + 8} V${jy + 122}" stroke="#d9a93a" stroke-width="3"/>`).join("")}
      <path d="M${jx} ${jy + 4} H${jx + 220}" stroke="${C}" stroke-width="6"/>
      <rect x="${jx - 20}" y="${jy + 130}" width="260" height="14" fill="#d9c7a6" stroke="${C}" stroke-width="4"/><rect x="${jx - 20}" y="${jy + 100}" width="260" height="8" fill="#9aa0ab" stroke="${C}" stroke-width="3"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(b => `<path d="M${jx - 10 + b * 30} ${jy + 108} V${jy + 130}" stroke="#9aa0ab" stroke-width="4"/>`).join("")}</g>`;
    fundo += janelaDele;
    // faixa entre andares e portaria
    fundo += `<rect x="${X0}" y="420" width="${W}" height="30" fill="#d9c7a6" stroke="${C}" stroke-width="5"/>`;
    const portaria = `<g id="${id}-portaria"><rect x="${X0}" y="450" width="${W}" height="370" fill="#e3d4b6" stroke="${C}" stroke-width="5"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${X0} ${480 + i * 50} H${X0 + W}" stroke="#d2c19f" stroke-width="3"/>`).join("")}
      <rect x="${X0 + 330}" y="520" width="460" height="300" fill="#8fb4cf" stroke="${C}" stroke-width="6"/><path d="M${X0 + 560} 520 V820" stroke="${C}" stroke-width="6"/>
      <path d="M${X0 + 360} 800 L${X0 + 450} 540 M${X0 + 420} 800 L${X0 + 510} 540 M${X0 + 600} 800 L${X0 + 690} 540" stroke="#d4e8f4" stroke-width="8" opacity="0.7"/>
      <rect x="${X0 + 540}" y="640" width="10" height="70" rx="4" fill="#d9dce3" stroke="${C}" stroke-width="3"/><rect x="${X0 + 570}" y="640" width="10" height="70" rx="4" fill="#d9dce3" stroke="${C}" stroke-width="3"/>
      <path d="M${X0 + 290} 470 H${X0 + 830} L${X0 + 800} 520 H${X0 + 320} Z" fill="#2e4a6b" stroke="${C}" stroke-width="6"/>
      <text x="${X0 + 560}" y="507" text-anchor="middle" style="${F};font-size:25px;letter-spacing:3px" fill="#F5C542">EDIFÍCIO AURORA</text>
      <rect x="${X0 + 830}" y="560" width="110" height="70" rx="8" fill="#2e4a6b" stroke="${C}" stroke-width="5"/><text x="${X0 + 885}" y="608" text-anchor="middle" style="${F};font-size:40px" fill="#fff8e6">1500</text>
      <rect x="${X0 + 160}" y="560" width="120" height="140" rx="6" fill="#f4efe4" stroke="${C}" stroke-width="5"/><rect x="${X0 + 176}" y="576" width="88" height="40" rx="3" fill="#3c3a46"/>${[0, 1, 2].map(r => [0, 1, 2].map(c => `<circle cx="${X0 + 190 + c * 30}" cy="${636 + r * 20}" r="7" fill="#d9dce3" stroke="${C}" stroke-width="2"/>`).join("")).join("")}
      <path d="M${X0 + 60} 820 l20 -70 h60 l20 70 Z" fill="#c96b4a" stroke="${C}" stroke-width="5"/><circle cx="${X0 + 110}" cy="730" r="40" fill="#5f9f4f" stroke="${C}" stroke-width="5"/>
      <path d="M${X0 + 960} 820 l20 -70 h60 l20 70 Z" fill="#c96b4a" stroke="${C}" stroke-width="5"/><circle cx="${X0 + 1010}" cy="730" r="40" fill="#5f9f4f" stroke="${C}" stroke-width="5"/>
      <rect x="${X0 + 310}" y="800" width="500" height="20" fill="#9a8f7e" stroke="${C}" stroke-width="4"/></g>`;
    fundo += portaria;
    // calcada e rua
    let meio = `<rect x="0" y="820" width="1920" height="140" fill="#ece7de"/><path d="M0 820 H1920" stroke="${C}" stroke-width="5"/>`;
    for (let x = -40; x < 1960; x += 80) meio += `<path d="M${x} 840 q40 20 80 0 M${x} 884 q40 20 80 0 M${x} 928 q40 20 80 0" fill="none" stroke="#d8d0c2" stroke-width="5"/>`;
    meio += `<rect x="0" y="950" width="1920" height="16" fill="#cfc8bb" stroke="${C}" stroke-width="4"/>`;
    // arvore e poste
    meio += `<rect x="208" y="620" width="26" height="250" fill="#8a5a36" stroke="${C}" stroke-width="5"/><circle cx="160" cy="610" r="80" fill="#5f9f4f" stroke="${C}" stroke-width="5"/><circle cx="290" cy="600" r="84" fill="#6fae5a" stroke="${C}" stroke-width="5"/><circle cx="222" cy="530" r="92" fill="#78b864" stroke="${C}" stroke-width="5"/><circle cx="200" cy="510" r="22" fill="#9fd08a" opacity="0.6"/>`;
    meio += `<rect x="1712" y="420" width="16" height="450" fill="#4a4d57" stroke="${C}" stroke-width="4"/><path d="M1720 420 Q1720 380 1680 380 H1620" fill="none" stroke="#4a4d57" stroke-width="12"/><path d="M1590 370 h60 l-8 24 h-44 Z" fill="#fff3c4" stroke="${C}" stroke-width="4"/>`;
    const frente = `<rect x="0" y="966" width="1920" height="114" fill="#4b4a55"/>${[40, 300, 560, 820, 1080, 1340, 1600, 1860].map(x => `<rect x="${x}" y="1030" width="150" height="14" rx="4" fill="#f2c94c" stroke="${C}" stroke-width="3"/>`).join("")}`;
    return camadas(id, fundo, meio, frente);
  }
  fachadaPredio.janela = [960, -1005]; // centro da janela dele
  fachadaPredio.topo = -1700;

  /* ---------- SALA DO APARTAMENTO ----------
   * Reaproveitada muitas vezes. Parede 0..740, chao 740..1080. Sofa no meio (assento ~ y 790, x 560..1360).
   * ids: -tv (tela da TV, x 1492..1788 y 282..448), -quadro (quadro torto), -cidade (vista da janela), -abajur (luz).
   * Lugar livre na parede para o calendario: x ~ 190..420, y 120..520 (escala 0.75, pes ~ 560). */
  function salaApto(o = {}) {
    const id = o.id || "sala";
    let fundo = `<rect width="1920" height="740" fill="#E8D7B5"/>`;
    for (let x = 0; x < 1920; x += 90) fundo += `<path d="M${x} 0 V740" stroke="#dfcca5" stroke-width="10"/>`;
    fundo += `<rect x="0" y="700" width="1920" height="40" fill="#f4efe4" stroke="${C}" stroke-width="5"/><rect x="0" y="0" width="1920" height="34" fill="#f4efe4" stroke="${C}" stroke-width="5"/>`;
    // janela grande com a cidade
    fundo += `<rect x="500" y="80" width="820" height="440" rx="6" fill="#f4efe4" stroke="${C}" stroke-width="6"/>
      <g id="${id}-cidade"><rect x="520" y="100" width="780" height="400" fill="#bfe3f0"/>${P.nuvem(560, 120, 0.7)}${P.nuvem(1100, 140, 0.6)}`;
    [[520, 120, 300, "#9fbdd0"], [640, 90, 230, "#b8d2df"], [730, 140, 330, "#a9c7d8"], [870, 100, 210, "#9fbdd0"], [970, 160, 280, "#b8d2df"], [1130, 110, 250, "#a9c7d8"], [1240, 60, 330, "#9fbdd0"]].forEach(([x, w, topo, c]) => { fundo += `<rect x="${x}" y="${topo}" width="${w}" height="${500 - topo}" fill="${c}" stroke="${C}" stroke-width="4"/>`; for (let yy = topo + 20; yy < 490; yy += 34) for (let xx = x + 14; xx < x + w - 20; xx += 30) fundo += `<rect x="${xx}" y="${yy}" width="16" height="18" fill="${esc(c, 0.25)}"/>`; });
    fundo += `</g><path d="M910 80 V520 M500 300 H1320" stroke="${C}" stroke-width="6"/><path d="M500 300 H1320" stroke="#f4efe4" stroke-width="2"/>
      <rect x="480" y="510" width="860" height="26" rx="4" fill="#f4efe4" stroke="${C}" stroke-width="5"/>`;
    // cortinas
    const cortina = (x, d) => `<path d="M${x} 60 Q${x + d * 40} 300 ${x + d * 10} 600 L${x + d * 110} 600 Q${x + d * 90} 300 ${x + d * 110} 60 Z" fill="#c25b4e" stroke="${C}" stroke-width="5"/>${[30, 60, 85].map(f => `<path d="M${x + d * f} 70 Q${x + d * (f + 10)} 330 ${x + d * (f - 4)} 594" fill="none" stroke="${esc("#c25b4e", -0.2)}" stroke-width="4"/>`).join("")}`;
    fundo += `<rect x="440" y="50" width="940" height="16" rx="8" fill="#a86b42" stroke="${C}" stroke-width="4"/>` + cortina(440, 1) + cortina(1380, -1);
    // quadro torto
    fundo += `<g id="${id}-quadro" transform="rotate(-7 1630 120)"><path d="M1630 44 L1560 70 M1630 44 L1700 70" stroke="${C}" stroke-width="3"/><rect x="1530" y="60" width="200" height="150" rx="4" fill="#d9a93a" stroke="${C}" stroke-width="6"/><rect x="1546" y="76" width="168" height="118" fill="#9fd0ea"/><path d="M1546 194 L1600 130 L1640 170 L1670 140 L1714 194 Z" fill="#6fae5a" stroke="${C}" stroke-width="4"/><circle cx="1680" cy="106" r="14" fill="#F5C542" stroke="${C}" stroke-width="3"/></g>`;
    // estante com livros e TV (direita)
    let estante = `<rect x="1440" y="240" width="400" height="500" fill="#b98250" stroke="${C}" stroke-width="6"/>
      <rect x="1460" y="258" width="360" height="214" fill="#a06f43" stroke="${C}" stroke-width="4"/>
      <rect x="1480" y="270" width="320" height="190" rx="8" fill="#2b2a31" stroke="${C}" stroke-width="5"/>
      <g id="${id}-tv"><rect x="1492" y="282" width="296" height="166" rx="4" fill="#3a4466"/><path d="M1510 432 L1580 300 M1540 432 L1610 300" stroke="#56628a" stroke-width="8" opacity="0.6"/></g>
      <circle cx="1782" cy="452" r="3" fill="#e2544f"/>`;
    [580, 700].forEach(y => { estante += `<rect x="1460" y="${y}" width="360" height="12" fill="#8a5a36" stroke="${C}" stroke-width="3"/>`; let x = 1470; const cs = ["#e2544f", "#4a90d9", "#f5c542", "#6fae5a", "#b07cc6", "#f29e4c", "#9fcfc6", "#e2544f", "#4a90d9"]; for (let i = 0; i < 9; i++) { const w = 24 + rnd(y + i) * 16, h = 60 + rnd(y + i * 3) * 30; if (i === 6 && y === 580) { estante += `<path d="M${x} ${y} l${h * 0.9} ${-h * 0.4}" stroke="${C}" stroke-width="${w}" stroke-linecap="butt"/><path d="M${x + 2} ${y - 2} l${h * 0.86} ${-h * 0.38}" stroke="${cs[i]}" stroke-width="${w - 8}"/>`; x += h * 0.9; continue; } estante += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="2" fill="${cs[i]}" stroke="${C}" stroke-width="3"/><path d="M${x + 3} ${y - h + 10} h${w - 6}" stroke="${esc(cs[i], 0.4)}" stroke-width="3"/>`; x += w + 2; if (x > 1780) break; } });
    estante += `<path d="M1760 700 l-12 -50 h44 l-12 50 Z" fill="#c96b4a" stroke="${C}" stroke-width="3"/><circle cx="1770" cy="640" r="22" fill="#6fae5a" stroke="${C}" stroke-width="3"/>`;
    fundo += estante;
    // chao de madeira
    fundo += `<rect x="0" y="740" width="1920" height="340" fill="#c58f5c"/><path d="M0 740 H1920" stroke="${C}" stroke-width="6"/>`;
    for (let i = 0; i < 6; i++) { const y = 770 + i * 52 + i * i * 4; fundo += `<path d="M0 ${y} H1920" stroke="#a9774a" stroke-width="4"/>`; for (let j = 0; j < 7; j++) { const x = ((j * 311 + i * 157) % 1920); fundo += `<path d="M${x} ${y} v${46 + i * 6}" stroke="#a9774a" stroke-width="4"/>`; } }
    // tapete
    let meio = `<ellipse cx="960" cy="960" rx="700" ry="100" fill="#4a7fa8" stroke="${C}" stroke-width="6"/><ellipse cx="960" cy="960" rx="620" ry="78" fill="none" stroke="#f4efe4" stroke-width="5" stroke-dasharray="20 14"/><ellipse cx="960" cy="960" rx="420" ry="46" fill="#6a9fc6"/>`;
    // luminaria de pe
    meio += `<g id="${id}-abajur" transform="translate(-272 0)"><path d="M362 300 L250 740 L474 740 Z" fill="#fff3c4" opacity="0.16"/><rect x="356" y="290" width="12" height="520" fill="#4a4d57" stroke="${C}" stroke-width="4"/><ellipse cx="362" cy="812" rx="60" ry="14" fill="#4a4d57" stroke="${C}" stroke-width="4"/><path d="M300 200 h124 l30 110 h-184 Z" fill="#f4e2b8" stroke="${C}" stroke-width="5"/><path d="M290 260 h144" stroke="#e3caa0" stroke-width="5"/></g>`;
    // sofa grande
    meio += `<g id="${id}-sofa">
      <rect x="520" y="560" width="880" height="190" rx="40" fill="#e08b4a" stroke="${C}" stroke-width="7"/>
      ${[0, 1, 2].map(i => `<rect x="${560 + i * 270}" y="580" width="260" height="170" rx="26" fill="#ea9a5a" stroke="${C}" stroke-width="5"/><path d="M${600 + i * 270} 610 q90 -14 180 0" fill="none" stroke="#f4b47e" stroke-width="6"/>`).join("")}
      <rect x="500" y="730" width="920" height="110" rx="26" fill="#d07a3c" stroke="${C}" stroke-width="7"/>
      ${[0, 1, 2].map(i => `<rect x="${560 + i * 270}" y="716" width="260" height="70" rx="22" fill="#ea9a5a" stroke="${C}" stroke-width="5"/>`).join("")}
      <rect x="470" y="640" width="100" height="210" rx="40" fill="#d07a3c" stroke="${C}" stroke-width="7"/><rect x="1350" y="640" width="100" height="210" rx="40" fill="#d07a3c" stroke="${C}" stroke-width="7"/>
      <path d="M530 850 l-10 40 h30 l4 -40 Z M1390 850 l10 40 h-30 l-4 -40 Z" fill="#6b4a2e" stroke="${C}" stroke-width="4"/>
      <g transform="translate(640 640) rotate(-12)"><rect x="-56" y="-50" width="112" height="100" rx="24" fill="#F5C542" stroke="${C}" stroke-width="5"/><path d="M-30 -20 l60 40 M30 -20 l-60 40" stroke="#d9a93a" stroke-width="5"/></g>
      <g transform="translate(1290 650) rotate(10)"><rect x="-52" y="-46" width="104" height="92" rx="22" fill="#6fae5a" stroke="${C}" stroke-width="5"/><circle cx="0" cy="0" r="18" fill="#9fd08a" stroke="${C}" stroke-width="3"/></g></g>`;
    // planta grande e mesinha lateral
    meio += P.planta(1500, 860, 1.05, "#f4efe4");
    meio += `<rect x="1180" y="1046" width="0" height="0"/>`;
    // frente: mesa de centro baixa (canto inferior) e controle
    const frente = `<g transform="translate(160 1080)"><path d="M-120 -150 h340 l20 30 h-380 Z" fill="#a86b42" stroke="${C}" stroke-width="6"/><rect x="-140" y="-120" width="380" height="24" fill="#8a5a36" stroke="${C}" stroke-width="5"/><path d="M-110 -96 v96 M210 -96 v96" stroke="${C}" stroke-width="12"/>
      <rect x="-40" y="-176" width="90" height="26" rx="4" fill="#4a90d9" stroke="${C}" stroke-width="4"/><rect x="-30" y="-196" width="80" height="22" rx="4" fill="#e2544f" stroke="${C}" stroke-width="4"/>
      <path d="M110 -150 q-6 -40 30 -44 q36 4 30 44 Z" fill="#f4efe4" stroke="${C}" stroke-width="4"/><path d="M170 -180 q20 0 18 16 q-2 12 -18 12" fill="none" stroke="${C}" stroke-width="4"/><path d="M124 -204 q6 -12 0 -24 M146 -206 q6 -12 0 -24" fill="none" stroke="#bfc3cc" stroke-width="4" stroke-linecap="round"/></g>`;
    return camadas(id, fundo, meio, frente);
  }

  Object.assign(window.Cenarios, { espacoGlobo, avenidaTelao, fachadaPredio, salaApto });
})();

/* ===== fundoLiso (inserts de celular/tela, 09/11/2026): gradiente suave com bolinhas e raios discretos ===== */
(function () {
  const camadas = (id, fundo, meio, frente) => `<g id="${id}"><g id="${id}-fundo">${fundo}</g><g id="${id}-meio">${meio}</g><g id="${id}-frente">${frente}</g></g>`;
  function fundoLiso(o = {}) {
    const id = o.id || "liso", c1 = o.cor || "#ffe9b0", c2 = o.cor2 || "#f6b85c";
    let f = `<defs><radialGradient id="${id}-g" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs><rect x="-400" y="-400" width="2720" height="1880" fill="url(#${id}-g)"/>`;
    for (let i = 0; i < 16; i++) { const a = i * 22.5 * Math.PI / 180; f += `<path d="M960 540 L${960 + Math.cos(a - 0.07) * 1600} ${540 + Math.sin(a - 0.07) * 1600} L${960 + Math.cos(a + 0.07) * 1600} ${540 + Math.sin(a + 0.07) * 1600} Z" fill="#fff" opacity="0.13"/>`; }
    for (let r = 0; r < 9; r++) for (let c = 0; c < 15; c++) { const x = c * 140 + (r % 2) * 70, y = 40 + r * 130; f += `<circle cx="${x}" cy="${y}" r="7" fill="#fff" opacity="0.28"/>`; }
    return camadas(id, f, "", "");
  }
  Object.assign(window.Cenarios, { fundoLiso });
})();

/* ===== Cenarios da parte 3 do video do trilionario (09/11/2026) =====
 * patioFabrica, balcaoLanchonete (variante pastelaria|padaria), terrenoCima, entradaPropriedade (larga),
 * fachadaMansao (desfoque opcional), salaoMansao, mansaoCorte, marAberto.
 * Mesma estrutura: <g id> com -fundo, -meio (atras do personagem) e -frente (na frente dele).
 * Chao do personagem (pes): patio 930, balcao (meio corpo, atras do balcao) 1180, entrada 930, mansao 960, salao 960, mar (ver cada objeto). */
(function () {
  const C = (window.ESTILO && window.ESTILO.contorno) || "#2E2A33";
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const esc = (h, f) => window.Objetos.esc(h, f);
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const camadas = (id, fundo, meio, frente) => `<g id="${id}"><g id="${id}-fundo">${fundo}</g><g id="${id}-meio">${meio}</g><g id="${id}-frente">${frente}</g></g>`;
  const P = window.Cenarios;
  const T = (x, y, txt, tam, cor = "#fff8e6", anc = "middle", extra = "") => `<text x="${x}" y="${y}" text-anchor="${anc}" style="${F};font-size:${tam}px" fill="${cor}" ${extra}>${txt}</text>`;
  const copa = (x, y, r, cor = "#5f9f4f") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${cor}" stroke="${C}" stroke-width="5"/><path d="M${x - r * 0.5} ${y - r * 0.2} q${r * 0.3} ${-r * 0.4} ${r * 0.7} ${-r * 0.3}" fill="none" stroke="${esc(cor, 0.3)}" stroke-width="5" stroke-linecap="round"/>`;
  const arvoreG = (x, chao, s = 1, cor = "#5f9f4f") => `<g transform="translate(${x} ${chao}) scale(${s})"><path d="M-16 0 L-10 -230 L10 -230 L16 0 Z" fill="#8a5a3b" stroke="${C}" stroke-width="5"/>${[[-62, -270, 64], [58, -280, 68], [0, -340, 78], [-36, -220, 52], [44, -220, 52]].map(([dx, dy, r]) => copa(dx, dy, r, cor)).join("")}</g>`;
  const palmeiraVaso = (x, chao, s = 1) => `<g transform="translate(${x} ${chao}) scale(${s})"><path d="M-6 -60 Q-14 -180 4 -300" fill="none" stroke="${C}" stroke-width="22" stroke-linecap="round"/><path d="M-6 -60 Q-14 -180 4 -300" fill="none" stroke="#a87a4a" stroke-width="14" stroke-linecap="round"/>${[-200, -150, -100].map(y => `<path d="M-14 ${y} h18" stroke="${C}" stroke-width="3"/>`).join("")}${[[-120, -250], [-100, -340], [-10, -380], [100, -350], [120, -260], [40, -240]].map(([dx, dy]) => `<path d="M4 -300 Q${dx * 0.5} ${dy - 40} ${dx} ${dy} Q${dx * 0.55} ${dy - 12} 4 -300 Z" fill="#5f9f4f" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>`).join("")}<path d="M-50 -64 h100 l-12 64 h-76 Z" fill="#d8d2c4" stroke="${C}" stroke-width="5"/><rect x="-56" y="-76" width="112" height="18" rx="5" fill="#ece6d8" stroke="${C}" stroke-width="5"/></g>`;
  const sombraChao = (cx, cy, rx, ry = 14) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="0.16"/>`;

  /* ---------- PATIO DA FABRICA (c13) ----------
   * ids: -letreiro (texto BUGATTI, centro 960 250), -fachada (area 260..1660 x 120..640, onde o carimbo bate), -bandeiras. */
  function patioFabrica(o = {}) {
    const id = o.id || "fabrica";
    let fundo = `<defs><linearGradient id="${id}-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd3ea"/><stop offset="1" stop-color="#d9f0f6"/></linearGradient></defs><rect x="-300" y="-300" width="2520" height="1100" fill="url(#${id}-ceu)"/>`;
    fundo += P.nuvem(120, 80, 1.1) + P.nuvem(1500, 60, 1.3) + P.nuvem(1120, 150, 0.7) + P.passaro(700, 90) + P.passaro(760, 70, -1);
    // morros e arvores ao fundo
    fundo += `<path d="M-300 640 Q200 520 600 600 Q1000 500 1400 590 Q1800 520 2220 610 L2220 700 L-300 700 Z" fill="#9cc98a" stroke="${C}" stroke-width="5"/>`;
    for (let i = 0; i < 12; i++) fundo += copa(-100 + i * 190 + rnd(i) * 60, 610 + rnd(i + 3) * 20, 40 + rnd(i + 7) * 16, "#6fae5a");
    // fachada: bloco principal de vidro e metal
    let fach = `<g id="${id}-fachada"><rect x="240" y="150" width="1440" height="520" fill="#d8dde6" stroke="${C}" stroke-width="7"/>
      <path d="M200 150 L960 60 L1720 150 Z" fill="#b9c1ce" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M300 140 L960 76 L1620 140" fill="none" stroke="#e6ebf2" stroke-width="5"/>`;
    // painel do letreiro
    fach += `<rect x="560" y="176" width="800" height="120" rx="12" fill="#1f2a44" stroke="${C}" stroke-width="7"/><rect x="574" y="190" width="772" height="92" rx="8" fill="none" stroke="#3b4a70" stroke-width="4"/>
      <g id="${id}-letreiro">${T(960, 270, "BUGATTI", 92, "#f4efe4", "middle", `letter-spacing="18" stroke="${C}" stroke-width="3"`)}</g>`;
    // vidros em grade
    for (let c = 0; c < 12; c++) for (let r = 0; r < 3; r++) { const x = 270 + c * 116, y = 320 + r * 96; if (c >= 5 && c <= 6 && r >= 1) continue; fach += `<rect x="${x}" y="${y}" width="104" height="84" fill="${(c + r) % 3 ? "#8fc3dc" : "#a9d6ea"}" stroke="${C}" stroke-width="4"/><path d="M${x + 14} ${y + 70} L${x + 56} ${y + 12}" stroke="#fff" stroke-width="7" opacity="0.45"/>`; }
    // porta grande central (vidro com logo do carro)
    fach += `<rect x="852" y="408" width="216" height="262" fill="#6b9fbd" stroke="${C}" stroke-width="6"/><path d="M960 408 V670" stroke="${C}" stroke-width="5"/><rect x="930" y="520" width="12" height="60" rx="5" fill="#d8dde6" stroke="${C}" stroke-width="3"/><rect x="978" y="520" width="12" height="60" rx="5" fill="#d8dde6" stroke="${C}" stroke-width="3"/>
      <path d="M840 400 h240 l20 -26 h-280 Z" fill="#9aa4b4" stroke="${C}" stroke-width="5"/>`;
    // pilares de metal
    [[240, 150], [820, 300], [1100, 300], [1680, 150]].forEach(([x, y0]) => fach += `<rect x="${x - 14}" y="${y0}" width="28" height="${670 - y0}" fill="#9aa4b4" stroke="${C}" stroke-width="5"/>`);
    fach += `<rect x="240" y="300" width="1440" height="16" fill="#9aa4b4" stroke="${C}" stroke-width="4"/></g>`;
    fundo += fach;
    // galpao lateral com caminhao-cegonha
    fundo += `<rect x="1700" y="330" width="420" height="340" fill="#c9ced8" stroke="${C}" stroke-width="6"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M1700 ${360 + i * 50} H2120" stroke="#b3b9c5" stroke-width="5"/>`).join("")}<rect x="1760" y="480" width="200" height="190" fill="#8a909c" stroke="${C}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M1760 ${500 + i * 30} H1960" stroke="#767c88" stroke-width="4"/>`).join("")}`;
    fundo += `<rect x="-300" y="330" width="540" height="340" fill="#c9ced8" stroke="${C}" stroke-width="6"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M-300 ${360 + i * 50} H240" stroke="#b3b9c5" stroke-width="5"/>`).join("")}`;
    // chao de concreto com faixas
    fundo += `<rect x="-300" y="670" width="2520" height="700" fill="#b8b4aa"/><path d="M-300 670 H2220" stroke="${C}" stroke-width="6"/>`;
    for (let i = 0; i < 6; i++) fundo += `<path d="M-300 ${700 + i * i * 14 + i * 30} H2220" stroke="#a6a297" stroke-width="3"/>`;
    for (let i = -6; i < 14; i++) fundo += `<path d="M${960 + i * 40} 670 L${960 + i * 200} 1300" stroke="#a6a297" stroke-width="3"/>`;
    fundo += `<path d="M-300 760 H2220" stroke="#f5c542" stroke-width="10" stroke-dasharray="70 40"/><path d="M200 1000 L520 760 M1720 1000 L1400 760" stroke="#fff" stroke-width="8" opacity="0.85"/>`;
    for (let i = 0; i < 6; i++) fundo += `<rect x="${620 + i * 120}" y="${940}" width="70" height="16" fill="#fff" opacity="0.85" transform="skewX(-20)"/>`;
    // caminhao-cegonha ao fundo (direita)
    let cegonha = `<g id="${id}-cegonha" transform="translate(1520 520) scale(0.62)">
      <rect x="0" y="120" width="560" height="22" fill="#5a6070" stroke="${C}" stroke-width="5"/><path d="M0 120 L40 20 L560 20 L560 40 L60 40 L30 120" fill="none" stroke="${C}" stroke-width="10"/><path d="M0 120 L40 20 L560 20" fill="none" stroke="#e2544f" stroke-width="5"/>
      <path d="M80 20 q30 -50 90 -50 h60 q30 0 50 50 Z" fill="#6fae5a" stroke="${C}" stroke-width="5"/><path d="M300 20 q30 -50 90 -50 h60 q30 0 50 50 Z" fill="#F5C542" stroke="${C}" stroke-width="5"/>
      <path d="M90 120 q30 -50 90 -50 h60 q30 0 50 50 Z" fill="#4a90d9" stroke="${C}" stroke-width="5"/><path d="M320 120 q30 -50 90 -50 h60 q30 0 50 50 Z" fill="#b07cc6" stroke="${C}" stroke-width="5"/>
      <path d="M560 142 V40 h90 l50 60 v42 Z" fill="#e2544f" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><path d="M590 60 h52 l34 40 h-86 Z" fill="#a9d8ea" stroke="${C}" stroke-width="4"/>
      ${[60, 160, 420, 520, 640].map(x => `<circle cx="${x}" cy="150" r="30" fill="#3a3842" stroke="${C}" stroke-width="5"/><circle cx="${x}" cy="150" r="12" fill="#c9ccd4"/>`).join("")}</g>`;
    fundo += cegonha;
    // operarios pequenos de macacao
    const operario = (x, y, s, cor, f = 1) => `<g transform="translate(${x} ${y}) scale(${s * f} ${s})"><rect x="-14" y="-90" width="28" height="56" rx="10" fill="${cor}" stroke="${C}" stroke-width="4"/><path d="M-12 -36 l-4 36 M12 -36 l4 36" stroke="${C}" stroke-width="12" stroke-linecap="round"/><path d="M-12 -36 l-4 36 M12 -36 l4 36" stroke="${esc(cor, -0.2)}" stroke-width="6" stroke-linecap="round"/><circle cx="0" cy="-106" r="16" fill="#c98a5e" stroke="${C}" stroke-width="4"/><path d="M-18 -110 q18 -26 36 0 Z" fill="#F5C542" stroke="${C}" stroke-width="4"/><path d="M14 -78 l22 18" stroke="${C}" stroke-width="10" stroke-linecap="round"/><path d="M14 -78 l22 18" stroke="${cor}" stroke-width="5" stroke-linecap="round"/></g>`;
    fundo += operario(760, 740, 0.9, "#4a90d9") + operario(1360, 735, 0.85, "#f29e4c", -1) + operario(1600, 760, 1, "#4a90d9");
    // meio: bandeiras, palmeiras, cones
    let meio = `<g id="${id}-bandeiras">`;
    [[140, "#e2544f"], [260, "#F5C542"], [1660, "#4a90d9"], [1780, "#e2544f"]].forEach(([x, cor], i) => meio += `<rect x="${x - 5}" y="330" width="10" height="420" fill="#c9ccd4" stroke="${C}" stroke-width="4"/><circle cx="${x}" cy="326" r="10" fill="#e0b23e" stroke="${C}" stroke-width="3"/><path id="${id}-bandeira-${i}" d="M${x + 5} 344 q50 -14 100 6 q-2 34 0 70 q-50 -18 -100 -6 Z" fill="${cor}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M${x + 20} 370 q34 -8 64 4" stroke="${esc(cor, 0.35)}" stroke-width="5" fill="none"/>`);
    meio += `</g>` + palmeiraVaso(420, 790, 0.95) + palmeiraVaso(1500, 790, 0.95);
    const frente = P.cone(110, 1010) + P.cone(200, 1050) + P.cone(1780, 1030) + `<rect x="1660" y="985" width="240" height="22" rx="6" fill="#f5c542" stroke="${C}" stroke-width="5"/>${[0, 1, 2, 3].map(i => `<path d="M${1680 + i * 56} 1007 l20 -22" stroke="${C}" stroke-width="8"/>`).join("")}`;
    return camadas(id, fundo, meio, frente);
  }

  /* ---------- BALCAO DE LANCHONETE (c15) / PADARIA (c16) ----------
   * o.variante: "pastelaria" (padrao) ou "padaria". Personagem em meio corpo atras do balcao (frente cobre da cintura pra baixo).
   * Balcao: tampo y 800. ids: -ventilador-helice (gira, centro 1700 230), -tv, -placa. */
  function balcaoLanchonete(o = {}) {
    const id = o.id || "balcao", pad = o.variante === "padaria";
    let fundo = `<rect x="-300" y="-300" width="2520" height="1200" fill="#f4f6f4"/>`;
    // azulejo branco
    for (let y = -300; y < 820; y += 60) fundo += `<path d="M-300 ${y} H2220" stroke="#d9dfdd" stroke-width="4"/>`;
    for (let x = -300; x < 2220; x += 60) fundo += `<path d="M${x} -300 V820" stroke="#d9dfdd" stroke-width="4"/>`;
    fundo += `<rect x="-300" y="560" width="2520" height="40" fill="${pad ? "#c9935a" : "#3f8f6a"}" stroke="${C}" stroke-width="5"/>`;
    for (let x = -300; x < 2220; x += 60) fundo += `<rect x="${x + 4}" y="604" width="52" height="52" fill="${pad ? "#f1dfc0" : "#d8efe2"}"/>`;
    // placa de precos
    const placaTxt = pad ? ["PADARIA DA ESQUINA", "PÃO R$ 1 · CAFÉ R$ 5"] : ["PASTEL R$ 7", "CALDO R$ 3"];
    fundo += `<g id="${id}-placa"><rect x="560" y="70" width="800" height="210" rx="16" fill="${pad ? "#7a3f2a" : "#2f4f3e"}" stroke="${C}" stroke-width="7"/><rect x="576" y="86" width="768" height="178" rx="10" fill="none" stroke="${pad ? "#a65d3e" : "#4f7a62"}" stroke-width="4"/>
      ${T(960, 160, placaTxt[0], pad ? 64 : 76, "#fff8e6")}${T(960, 238, placaTxt[1], 54, "#F5C542")}</g>`;
    // TV pequena no alto (esquerda)
    fundo += `<g id="${id}-tv"><path d="M250 60 V110" stroke="${C}" stroke-width="8"/><rect x="140" y="110" width="230" height="150" rx="10" fill="#2b2a31" stroke="${C}" stroke-width="6"/><rect x="154" y="124" width="202" height="122" rx="4" fill="#4a7a5a"/><rect x="154" y="200" width="202" height="46" fill="#3a6a4a"/><circle cx="255" cy="210" r="12" fill="#fff"/><path d="M170 150 h60 M170 166 h40" stroke="#bfe3c8" stroke-width="6"/></g>`;
    // ventilador de parede (direita)
    fundo += `<g><rect x="1680" y="300" width="40" height="70" rx="8" fill="#e8ecef" stroke="${C}" stroke-width="5"/><circle cx="1700" cy="230" r="96" fill="#fff" opacity="0.5" stroke="${C}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M1700 230 m${Math.cos(i * 0.785) * 92} ${Math.sin(i * 0.785) * 92} L1700 230" stroke="#bfc6cc" stroke-width="3"/>`).join("")}
      <g id="${id}-ventilador-helice">${[0, 120, 240].map(a => `<path d="M1700 230 Q${1700 + 80 * Math.cos((a - 20) * Math.PI / 180)} ${230 + 80 * Math.sin((a - 20) * Math.PI / 180)} ${1700 + 84 * Math.cos((a + 10) * Math.PI / 180)} ${230 + 84 * Math.sin((a + 10) * Math.PI / 180)} Z" fill="#7fb7d9" stroke="${C}" stroke-width="4" stroke-linejoin="round"/>`).join("")}</g><circle cx="1700" cy="230" r="16" fill="#e8ecef" stroke="${C}" stroke-width="4"/></g>`;
    // prateleira na parede com produtos
    fundo += `<g transform="translate(0 70)"><rect x="1400" y="430" width="440" height="16" fill="#a86b42" stroke="${C}" stroke-width="4"/>`;
    if (pad) {
      for (let i = 0; i < 4; i++) fundo += `<rect x="${1420 + i * 104}" y="356" width="80" height="74" rx="8" fill="${["#e2544f", "#F5C542", "#4a90d9", "#6fae5a"][i]}" stroke="${C}" stroke-width="4"/><rect x="${1432 + i * 104}" y="378" width="56" height="26" rx="4" fill="#fff8e6"/>`;
    } else {
      for (let i = 0; i < 6; i++) fundo += `<rect x="${1416 + i * 70}" y="${360 + (i % 2) * 10}" width="40" height="${70 - (i % 2) * 10}" rx="6" fill="${["#e2544f", "#f29e4c", "#6fae5a"][i % 3]}" stroke="${C}" stroke-width="4"/><rect x="${1422 + i * 70}" y="350" width="28" height="14" rx="3" fill="#fff" stroke="${C}" stroke-width="3"/>`;
    }
    fundo += `</g>`;
    // esquerda: moenda de cana (pastelaria) ou maquina de cafe (padaria)
    let meio = "";
    if (pad) {
      meio += `<g id="${id}-cafeteira" transform="translate(1400 0)"><rect x="120" y="560" width="300" height="240" rx="18" fill="#c9ccd4" stroke="${C}" stroke-width="7"/><rect x="140" y="580" width="260" height="70" rx="10" fill="#2b2a31" stroke="${C}" stroke-width="4"/>${T(270, 628, "ESPRESSO", 34, "#F5C542")}
        <rect x="180" y="660" width="60" height="40" rx="6" fill="#4a4d57" stroke="${C}" stroke-width="4"/><rect x="300" y="660" width="60" height="40" rx="6" fill="#4a4d57" stroke="${C}" stroke-width="4"/><path d="M200 700 v20 M330 700 v20" stroke="${C}" stroke-width="6"/>
        <circle cx="160" cy="740" r="12" fill="#e2544f" stroke="${C}" stroke-width="3"/><circle cx="390" cy="740" r="12" fill="#6fae5a" stroke="${C}" stroke-width="3"/></g>`;
    } else {
      meio += `<g id="${id}-moenda"><rect x="130" y="580" width="280" height="220" rx="16" fill="#e2544f" stroke="${C}" stroke-width="7"/><rect x="150" y="600" width="240" height="100" rx="10" fill="#c9ccd4" stroke="${C}" stroke-width="5"/>
        ${[0, 1, 2].map(i => `<circle cx="${200 + i * 70}" cy="650" r="30" fill="#9aa0aa" stroke="${C}" stroke-width="5"/><path d="M${185 + i * 70} 650 h30 M${200 + i * 70} 635 v30" stroke="${C}" stroke-width="4"/>`).join("")}
        <path d="M60 640 L470 610" stroke="${C}" stroke-width="20" stroke-linecap="round"/><path d="M60 640 L470 610" stroke="#9cc46a" stroke-width="12" stroke-linecap="round"/>${[120, 200, 380, 440].map(x => `<path d="M${x} ${640 - (x - 60) * 0.073 - 8} v16" stroke="#6f9a3f" stroke-width="4"/>`).join("")}
        ${T(270, 770, "CALDO DE CANA", 30, "#fff8e6")}<rect x="250" y="700" width="40" height="30" fill="#c9ccd4" stroke="${C}" stroke-width="4"/></g>`;
    }
    // frente: balcao de formica com vitrine estufada
    let frente = `<rect x="-300" y="800" width="2520" height="400" fill="${pad ? "#d9b48a" : "#e8a24a"}" stroke="${C}" stroke-width="7"/>`;
    for (let x = -300; x < 2220; x += 120) frente += `<path d="M${x} 860 V1200" stroke="${pad ? "#c69f75" : "#d48f3a"}" stroke-width="5"/>`;
    frente += `<rect x="-300" y="780" width="2520" height="34" rx="6" fill="${pad ? "#f1dfc0" : "#f6d7a0"}" stroke="${C}" stroke-width="6"/><path d="M-300 790 H2220" stroke="#fff" stroke-width="5" opacity="0.6"/>`;
    // vitrine estufada (direita)
    const vx = pad ? -1000 : 0;
    frente += `<g id="${id}-vitrine" transform="translate(${vx} 0)"><path d="M1080 790 L1120 600 Q1130 580 1160 580 L1760 580 Q1790 580 1800 600 L1840 790 Z" fill="#cfeaf4" opacity="0.65" stroke="${C}" stroke-width="6"/><path d="M1140 690 H1780" stroke="${C}" stroke-width="4"/><path d="M1160 610 L1200 760 M1180 610 L1210 700" stroke="#fff" stroke-width="10" opacity="0.6"/>`;
    const salgado = (x, y, t) => t === 0 ? `<path d="M${x - 34} ${y} q34 -40 68 0 Z" fill="#e3b45e" stroke="${C}" stroke-width="4"/><path d="M${x - 26} ${y - 4} l6 -6 M${x - 10} ${y - 14} l6 -6 M${x + 8} ${y - 14} l6 -6" stroke="#c4913e" stroke-width="3"/>`
      : t === 1 ? `<path d="M${x - 30} ${y} Q${x} ${y - 56} ${x + 30} ${y} Z" fill="#d98e3e" stroke="${C}" stroke-width="4"/><circle cx="${x}" cy="${y - 20}" r="5" fill="#f3c27a"/>`
      : `<ellipse cx="${x}" cy="${y - 16}" rx="30" ry="18" fill="#c9783a" stroke="${C}" stroke-width="4"/><path d="M${x - 16} ${y - 20} q16 -8 32 0" fill="none" stroke="#e8a35e" stroke-width="4"/>`;
    const pao = (x, y) => `<ellipse cx="${x}" cy="${y - 16}" rx="34" ry="18" fill="#e0a85a" stroke="${C}" stroke-width="4"/><path d="M${x - 16} ${y - 28} l10 16 M${x} ${y - 32} l10 16 M${x + 14} ${y - 28} l8 12" stroke="#b7803a" stroke-width="4"/>`;
    for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) { const x = 1200 + i * 80 + (r ? 30 : 0), y = r ? 780 : 686; frente += pad ? pao(x, y) : salgado(x, y, (i + r) % 3); }
    frente += `</g>`;
    // guardanapos, ketchup e mostarda (esquerda do balcao)
    const cx0 = pad ? 870 : 1150;
    frente += `<g transform="translate(${cx0} 784)"><rect x="-50" y="-70" width="100" height="70" rx="8" fill="#c9ccd4" stroke="${C}" stroke-width="5"/><path d="M-40 -70 q10 -30 20 0 q10 -30 20 0 q10 -30 20 0 q10 -30 20 0" fill="#fff" stroke="${C}" stroke-width="4"/></g>
      <g transform="translate(${cx0 + 90} 784)"><path d="M-20 0 v-80 q0 -14 20 -14 q20 0 20 14 v80 Z" fill="#e2544f" stroke="${C}" stroke-width="5"/><path d="M-6 -94 l6 -26 l6 26 Z" fill="#e2544f" stroke="${C}" stroke-width="4"/><rect x="-14" y="-60" width="28" height="22" rx="4" fill="#fff8e6"/></g>
      <g transform="translate(${cx0 + 140} 784)"><path d="M-20 0 v-80 q0 -14 20 -14 q20 0 20 14 v80 Z" fill="#F5C542" stroke="${C}" stroke-width="5"/><path d="M-6 -94 l6 -26 l6 26 Z" fill="#F5C542" stroke="${C}" stroke-width="4"/><rect x="-14" y="-60" width="28" height="22" rx="4" fill="#fff8e6"/></g>`;
    // banquetas (na frente do balcao)
    [260, 860, 1460].forEach(x => frente += `<rect x="${x - 10}" y="960" width="20" height="160" fill="#9aa0aa" stroke="${C}" stroke-width="5"/><ellipse cx="${x}" cy="950" rx="80" ry="24" fill="#e2544f" stroke="${C}" stroke-width="6"/><path d="M${x - 50} 942 q50 -14 100 0" stroke="#f08a84" stroke-width="5" fill="none"/>`);
    return camadas(id, fundo, meio, frente);
  }

  /* ---------- TERRENO VISTO DE CIMA (c17) ----------
   * ids: -contorno (poligono tracejado amarelo, comeca com stroke-dashoffset para desenhar), -casa (telhado no meio, 960 560).
   * terrenoCima.contorno: pontos do poligono (para o muro seguir). */
  const CONTORNO_TERRENO = [[470, 230], [1450, 200], [1560, 420], [1500, 880], [430, 900], [360, 560]];
  function terrenoCima(o = {}) {
    const id = o.id || "terreno";
    let fundo = `<rect x="-300" y="-300" width="2520" height="1680" fill="#7dbb5f"/>`;
    for (let i = 0; i < 40; i++) fundo += `<ellipse cx="${rnd(i) * 1920}" cy="${rnd(i + 40) * 1080}" rx="${60 + rnd(i + 80) * 120}" ry="${30 + rnd(i + 90) * 60}" fill="#8cc86c" opacity="0.7"/>`;
    // gramado interno em dois tons (faixas)
    const pts = CONTORNO_TERRENO.map(p => p.join(" ")).join(" L");
    fundo += `<defs><clipPath id="${id}-clip"><path d="M${pts} Z"/></clipPath></defs><g clip-path="url(#${id}-clip)"><rect x="300" y="150" width="1300" height="800" fill="#9ed27a"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="${300 + i * 150}" y="150" width="75" height="800" fill="#93c96f"/>`).join("")}</g>`;
    // riacho
    fundo += `<path d="M-300 980 Q200 900 360 760 Q520 620 700 690 Q900 760 1000 660 Q1100 560 1300 600 Q1600 660 1800 520 Q1980 400 2220 420" fill="none" stroke="${C}" stroke-width="58" stroke-linecap="round"/><path d="M-300 980 Q200 900 360 760 Q520 620 700 690 Q900 760 1000 660 Q1100 560 1300 600 Q1600 660 1800 520 Q1980 400 2220 420" fill="none" stroke="#6fbfe0" stroke-width="44" stroke-linecap="round"/><path d="M-200 960 Q200 890 350 760 M720 680 Q900 740 980 660 M1320 596 Q1560 650 1760 530" fill="none" stroke="#bfe6f4" stroke-width="7" stroke-linecap="round"/>`;
    // lago
    fundo += `<path d="M1180 330 q80 -60 170 -20 q70 40 30 110 q-50 70 -150 40 q-90 -30 -50 -130 Z" fill="#6fbfe0" stroke="${C}" stroke-width="6"/><path d="M1220 340 q60 -30 110 -6" stroke="#bfe6f4" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    // estrada de terra entrando por baixo
    fundo += `<path d="M900 1380 Q940 1100 930 960 Q920 800 960 640" fill="none" stroke="${C}" stroke-width="74" stroke-linecap="round"/><path d="M900 1380 Q940 1100 930 960 Q920 800 960 640" fill="none" stroke="#d8b47a" stroke-width="60" stroke-linecap="round"/><path d="M900 1380 Q940 1100 930 960 Q920 800 960 640" fill="none" stroke="#c49a5e" stroke-width="4" stroke-dasharray="14 24"/>`;
    // ponte sobre o riacho
    fundo += `<rect x="884" y="690" width="96" height="70" rx="6" fill="#a86b42" stroke="${C}" stroke-width="5" transform="rotate(-4 932 725)"/>${[0, 1, 2, 3].map(i => `<path d="M${890} ${700 + i * 16} h86" stroke="#7a4a2e" stroke-width="3" transform="rotate(-4 932 725)"/>`).join("")}`;
    // mata nas bordas: copas redondas vistas de cima
    const copaCima = (x, y, r, k) => `<circle cx="${x}" cy="${y + r * 0.18}" r="${r}" fill="#000" opacity="0.15"/><circle cx="${x}" cy="${y}" r="${r}" fill="${["#4f8f45", "#5f9f4f", "#3f7f3f"][k % 3]}" stroke="${C}" stroke-width="5"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.35}" fill="${["#6fae5a", "#7dbb66", "#5a9a4a"][k % 3]}"/>`;
    let k = 0;
    for (let x = -60; x < 2000; x += 70) { fundo += copaCima(x + rnd(x) * 30, 40 + rnd(x + 3) * 60, 50 + rnd(x + 5) * 20, k++); fundo += copaCima(x + rnd(x + 9) * 30, 1040 + rnd(x + 4) * 50, 50 + rnd(x + 6) * 20, k++); }
    for (let y = 60; y < 1060; y += 70) { fundo += copaCima(30 + rnd(y) * 80, y, 50 + rnd(y + 2) * 20, k++); fundo += copaCima(1880 - rnd(y + 1) * 80, y, 50 + rnd(y + 7) * 20, k++); if (y > 300) fundo += copaCima(1700 - rnd(y + 11) * 60, y + 20, 40 + rnd(y + 8) * 14, k++); }
    // arvores soltas dentro
    [[560, 380], [600, 760], [1350, 760], [1240, 220], [700, 290]].forEach(([x, y], i) => fundo += copaCima(x, y, 36, i));
    // casa no meio (telhado visto de cima)
    fundo += `<g id="${id}-casa"><rect x="890" y="510" width="140" height="100" fill="#000" opacity="0.18" transform="translate(10 10)"/><path d="M890 510 h140 v100 h-140 Z" fill="#d9654f" stroke="${C}" stroke-width="5"/><path d="M890 510 L960 560 L1030 510 M890 610 L960 560 L1030 610" stroke="${C}" stroke-width="4" fill="none"/><path d="M960 560 h0" stroke="${C}"/><path d="M900 520 L960 562 M1020 520 L960 562" stroke="#f08a74" stroke-width="3"/><rect x="1040" y="560" width="70" height="50" fill="#5fb8d8" stroke="${C}" stroke-width="4"/></g>`;
    // contorno tracejado amarelo (para desenhar)
    const meio = !o.contorno ? "" : `<path id="${id}-contorno" d="M${pts} Z" fill="none" stroke="${C}" stroke-width="16" stroke-linejoin="round" opacity="1"/><path id="${id}-contorno-amarelo" d="M${pts} Z" fill="none" stroke="#F5C542" stroke-width="9" stroke-dasharray="34 18" stroke-linejoin="round"/>`;
    return camadas(id, fundo, meio, "");
  }
  terrenoCima.contorno = CONTORNO_TERRENO;

  /* ---------- ENTRADA DA PROPRIEDADE (c18) ----------
   * Larga: o.largura (padrao 3840) para travelling para a direita. Pes do personagem: 930.
   * ids: -guarita-janela (centro 600 560; o vigia aparece atras), -placa24 (opacity 0, acende), -cancela (gira em 760 820),
   *      -portao (folhas -portao-e / -portao-d), -mansao (minuscula no fim, x = largura - 520, y 470). */
  function entradaPropriedade(o = {}) {
    const id = o.id || "entrada", W = o.largura || 3840;
    let fundo = `<defs><linearGradient id="${id}-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fcbe6"/><stop offset="1" stop-color="#e2f3f7"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="1100" fill="url(#${id}-ceu)"/>`;
    for (let i = 0; i < Math.ceil(W / 600); i++) fundo += P.nuvem(i * 600 + rnd(i) * 200, 60 + rnd(i + 3) * 120, 0.8 + rnd(i + 5) * 0.6);
    // colinas
    fundo += `<path d="M-300 520 Q${W * 0.15} 380 ${W * 0.35} 480 Q${W * 0.55} 360 ${W * 0.75} 470 Q${W * 0.9} 400 ${W + 300} 470 L${W + 300} 700 L-300 700 Z" fill="#a9d48c" stroke="${C}" stroke-width="5"/>
      <path d="M-300 600 Q${W * 0.25} 500 ${W * 0.5} 580 Q${W * 0.75} 520 ${W + 300} 590 L${W + 300} 700 L-300 700 Z" fill="#8fc472" stroke="${C}" stroke-width="5"/>`;
    // mansao minuscula no fim
    const mx = W - 520;
    fundo += `<g id="${id}-mansao"><rect x="${mx - 70}" y="440" width="140" height="70" fill="#f4efe4" stroke="${C}" stroke-width="4"/><path d="M${mx - 84} 444 L${mx} 404 L${mx + 84} 444 Z" fill="#c25b4e" stroke="${C}" stroke-width="4"/>${[-50, -24, 2, 28].map(d => `<rect x="${mx + d}" y="456" width="14" height="18" fill="#9fd0ea" stroke="${C}" stroke-width="2"/>`).join("")}<rect x="${mx - 8}" y="486" width="16" height="24" fill="#a86b42" stroke="${C}" stroke-width="2"/></g>`;
    // estrada comprida (vai afinando ate a mansao)
    fundo += `<path d="M300 1300 Q${W * 0.3} 820 ${W * 0.6} 640 Q${W * 0.8} 540 ${mx} 512" fill="none" stroke="${C}" stroke-width="150" stroke-linecap="round"/><path d="M300 1300 Q${W * 0.3} 820 ${W * 0.6} 640 Q${W * 0.8} 540 ${mx} 512" fill="none" stroke="#d8c9a8" stroke-width="136" stroke-linecap="round"/><path d="M300 1300 Q${W * 0.3} 820 ${W * 0.6} 640 Q${W * 0.8} 540 ${mx} 512" fill="none" stroke="#fff8e6" stroke-width="6" stroke-dasharray="40 40"/>`;
    // gramado do chao
    fundo += `<path d="M-300 690 H${W + 300} V1400 H-300 Z" fill="#7dbb5f"/><path d="M-300 690 H${W + 300}" stroke="${C}" stroke-width="5"/>`;
    for (let i = 0; i < W / 40; i++) fundo += `<path d="M${i * 40 + rnd(i) * 30} ${720 + rnd(i + 1) * 300} l6 -16 l6 16" stroke="#5f9f4f" stroke-width="4" fill="none"/>`;
    // estrada em primeiro plano (sobe para a direita)
    fundo += `<path d="M700 1100 Q1500 860 ${W * 0.55} 760 Q${W * 0.75} 720 ${W + 300} 720 L${W + 300} 800 Q${W * 0.75} 800 ${W * 0.55} 840 Q1500 960 900 1200 Z" fill="#d8c9a8" stroke="${C}" stroke-width="5"/><path d="M800 1140 Q1500 900 ${W * 0.55} 800 Q${W * 0.75} 760 ${W + 300} 760" fill="none" stroke="#fff8e6" stroke-width="6" stroke-dasharray="40 36"/>`;
    // arvores dos dois lados da estrada (para passar no travelling)
    let meio = "";
    for (let x = 1300; x < W + 200; x += 280) meio += arvoreG(x, 720 - (x - 1300) * 0.01, 0.62 - (x - 1300) / W * 0.2, (x / 280) % 2 ? "#5f9f4f" : "#4f8f45");
    // muro com portao de ferro
    let muro = `<g id="${id}-muro"><rect x="-300" y="560" width="680" height="300" fill="#e6d8bd" stroke="${C}" stroke-width="7"/>${[0, 1, 2, 3, 4].map(r => `<path d="M-300 ${600 + r * 56} H380" stroke="#d1c09f" stroke-width="5"/>`).join("")}${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${-280 + i * 100 + (i % 2) * 50} 560 v300" stroke="#d1c09f" stroke-width="4" opacity="0.6"/>`).join("")}<rect x="-300" y="540" width="690" height="30" fill="#f4efe4" stroke="${C}" stroke-width="6"/>
      <rect x="350" y="440" width="70" height="420" fill="#d8cab0" stroke="${C}" stroke-width="7"/><path d="M340 440 h90 l-10 -30 h-70 Z" fill="#f4efe4" stroke="${C}" stroke-width="5"/><circle cx="385" cy="400" r="22" fill="#fff3c4" stroke="${C}" stroke-width="5"/></g>`;
    // portao: folhas de ferro (abertas para a estrada passar)
    const folha = (x, d, fid) => `<g id="${fid}"><rect x="${x}" y="470" width="${d * 210}" height="390" fill="none"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${x + d * (14 + i * 30)} 860 V${470 + (i % 2) * 18}" stroke="${C}" stroke-width="10"/><path d="M${x + d * (14 + i * 30)} 470 l-8 -20 l8 -14 l8 14 Z" fill="${C}"/>`).join("")}<path d="M${x} 520 H${x + d * 210} M${x} 820 H${x + d * 210}" stroke="${C}" stroke-width="12"/>${[0, 1, 2].map(i => `<circle cx="${x + d * (50 + i * 60)}" cy="670" r="22" fill="none" stroke="${C}" stroke-width="6"/>`).join("")}</g>`;
    muro += `<g id="${id}-portao">${folha(420, 0.55, id + "-portao-e")}</g>`;
    meio += muro;
    // guarita
    meio += `<g id="${id}-guarita"><rect x="470" y="520" width="260" height="340" fill="#f4efe4" stroke="${C}" stroke-width="7"/><path d="M450 520 L600 450 L750 520 Z" fill="#7a8a9a" stroke="${C}" stroke-width="7" stroke-linejoin="round"/>
      <rect x="500" y="570" width="200" height="130" fill="#ffe8a0" stroke="${C}" stroke-width="6"/><g id="${id}-guarita-janela"><rect x="506" y="576" width="188" height="118" fill="#fff3c4"/></g><path d="M600 570 V700" stroke="${C}" stroke-width="5"/>
      <rect x="490" y="700" width="220" height="20" fill="#d8cab0" stroke="${C}" stroke-width="5"/><rect x="540" y="740" width="120" height="120" fill="#a86b42" stroke="${C}" stroke-width="5"/><circle cx="640" cy="800" r="7" fill="#e0b23e"/>
      <g id="${id}-placa24" opacity="0"><rect x="690" y="470" width="110" height="60" rx="10" fill="#2b2a31" stroke="${C}" stroke-width="5"/>${T(745, 514, "24 h", 38, "#7CFC6A")}</g><rect x="690" y="470" width="110" height="60" rx="10" fill="none" stroke="${C}" stroke-width="5"/>
      <circle cx="600" cy="480" r="14" fill="#F5C542" stroke="${C}" stroke-width="4"/></g>`;
    // cancela
    meio += `<rect x="740" y="770" width="40" height="100" fill="#e6d8bd" stroke="${C}" stroke-width="5"/><g id="${id}-cancela"><rect x="760" y="770" width="430" height="22" rx="10" fill="#fff" stroke="${C}" stroke-width="5"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${790 + i * 80}" y="772" width="40" height="18" fill="#e2544f"/>`).join("")}</g><circle cx="760" cy="781" r="16" fill="#e2544f" stroke="${C}" stroke-width="5"/>`;
    // placa PROPRIEDADE PARTICULAR
    meio += `<g><rect x="1240" y="760" width="14" height="140" fill="#8a5a3b" stroke="${C}" stroke-width="4"/><rect x="1340" y="760" width="14" height="140" fill="#8a5a3b" stroke="${C}" stroke-width="4"/><rect x="1150" y="640" width="300" height="130" rx="10" fill="#2f4f3e" stroke="${C}" stroke-width="6"/><rect x="1162" y="652" width="276" height="106" rx="6" fill="none" stroke="#4f7a62" stroke-width="3"/>${T(1300, 700, "PROPRIEDADE", 36, "#fff8e6")}${T(1300, 745, "PARTICULAR", 36, "#F5C542")}</g>`;
    const frente = P.vaso(-100) + `<path d="M-300 1010 Q-100 980 120 1020 L120 1100 L-300 1100 Z" fill="#5f9f4f" stroke="${C}" stroke-width="5"/>` + `<g transform="translate(${W - 300} 0)">${arvoreG(0, 1120, 1.1)}</g>`;
    return camadas(id, fundo, meio, frente);
  }

  /* ---------- FACHADA DA MANSAO (c19 desfocada, c20) ----------
   * Pes do personagem: 960 (minusculo, escala ~0.16 a 0.22). o.desfoque: px de blur (c19).
   * ids: -cam-0..3 (cameras de seguranca; girar o -cam-N-cab em torno do proprio ponto), -fonte-agua, -portao (entrada a esquerda). */
  function fachadaMansao(o = {}) {
    if ((o.largura || 1920) > 1920) return fachadaMansaoLarga(o);
    const id = o.id || "mansao";
    let fundo = `<defs><linearGradient id="${id}-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fcbe6"/><stop offset="1" stop-color="#e8f5f8"/></linearGradient></defs><rect x="-300" y="-300" width="2520" height="1000" fill="url(#${id}-ceu)"/>` + P.nuvem(100, 70, 1) + P.nuvem(1560, 100, 1.2) + P.passaro(1300, 80);
    for (let i = 0; i < 14; i++) fundo += copa(-200 + i * 170, 560 + rnd(i) * 30, 70 + rnd(i + 2) * 30, i % 2 ? "#5f9f4f" : "#4f8f45");
    // corpo da casa: 3 andares, ala central com fronta e colunas
    let casa = `<rect x="160" y="250" width="1600" height="470" fill="#f6efe0" stroke="${C}" stroke-width="7"/><path d="M130 250 H1790 L1740 200 H180 Z" fill="#8a96a6" stroke="${C}" stroke-width="7" stroke-linejoin="round"/>
      <rect x="640" y="140" width="640" height="580" fill="#fbf5e8" stroke="${C}" stroke-width="7"/><path d="M600 150 L960 20 L1320 150 Z" fill="#f4ead6" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M660 140 L960 40 L1260 140" fill="none" stroke="#e3d6bc" stroke-width="6"/><circle cx="960" cy="100" r="30" fill="#9fd0ea" stroke="${C}" stroke-width="5"/><path d="M930 100 h60 M960 70 v60" stroke="${C}" stroke-width="4"/>
      <rect x="610" y="140" width="700" height="22" fill="#e3d6bc" stroke="${C}" stroke-width="5"/>`;
    // telhados das alas
    casa += `<path d="M150 252 L260 150 H600 L640 252" fill="#c25b4e" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><path d="M1280 252 L1320 150 H1660 L1770 252" fill="#c25b4e" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${200 + i * 70} 230 h40 M${1340 + i * 70} 230 h40" stroke="#a84a40" stroke-width="5"/>`).join("")}`;
    casa += `<rect x="340" y="110" width="50" height="70" fill="#d8cab0" stroke="${C}" stroke-width="5"/><rect x="1530" y="110" width="50" height="70" fill="#d8cab0" stroke="${C}" stroke-width="5"/>`;
    // janelas (3 andares nas alas)
    const jan = (x, y, w, h) => `<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" rx="4" fill="#e3d6bc" stroke="${C}" stroke-width="4"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#9fd0ea" stroke="${C}" stroke-width="4"/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h * 0.45} H${x + w}" stroke="${C}" stroke-width="3"/><path d="M${x + 8} ${y + h - 10} L${x + w * 0.45} ${y + 10}" stroke="#fff" stroke-width="6" opacity="0.55"/><path d="M${x - 10} ${y - 12} h${w + 20}" stroke="${C}" stroke-width="8"/><path d="M${x - 10} ${y - 12} h${w + 20}" stroke="#f4ead6" stroke-width="4"/>`;
    [[200, 4], [1340, 4]].forEach(([x0]) => { for (let c = 0; c < 4; c++) for (let r = 0; r < 3; r++) casa += jan(x0 + 20 + c * 96, 290 + r * 140, 56, 90); });
    // varanda e porta central
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) casa += jan(690 + c * 150, 200 + r * 150, 80, 100);
    casa += `<rect x="640" y="430" width="640" height="18" fill="#e3d6bc" stroke="${C}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => `<path d="M${660 + i * 40} 448 v-40" stroke="${C}" stroke-width="5"/>`).join("")}<path d="M650 408 H1270" stroke="${C}" stroke-width="7"/>`;
    casa += `<path d="M880 720 V560 Q880 500 960 500 Q1040 500 1040 560 V720 Z" fill="#7a4a2e" stroke="${C}" stroke-width="7"/><path d="M960 510 V720" stroke="${C}" stroke-width="5"/><circle cx="945" cy="620" r="7" fill="#e0b23e"/><circle cx="975" cy="620" r="7" fill="#e0b23e"/><path d="M890 560 Q960 470 1030 560" fill="#9fd0ea" stroke="${C}" stroke-width="4"/>`;
    // colunas
    [680, 790, 1130, 1240].forEach(x => casa += `<rect x="${x - 22}" y="460" width="44" height="260" fill="#fbf5e8" stroke="${C}" stroke-width="6"/>${[-10, 0, 10].map(d => `<path d="M${x + d} 474 V706" stroke="#e3d6bc" stroke-width="4"/>`).join("")}<rect x="${x - 30}" y="452" width="60" height="16" fill="#e3d6bc" stroke="${C}" stroke-width="4"/><rect x="${x - 30}" y="706" width="60" height="16" fill="#e3d6bc" stroke="${C}" stroke-width="4"/>`);
    // cameras de seguranca nos cantos
    const cam = (x, y, d, i) => `<g id="${id}-cam-${i}"><path d="M${x} ${y} h${d * 24}" stroke="${C}" stroke-width="8"/><g id="${id}-cam-${i}-cab" style="transform-box:fill-box;transform-origin:${d > 0 ? "0% 50%" : "100% 50%"}"><rect x="${d > 0 ? x + 20 : x - 84}" y="${y - 18}" width="64" height="36" rx="8" fill="#fff" stroke="${C}" stroke-width="5"/><rect x="${d > 0 ? x + 80 : x - 96}" y="${y - 14}" width="16" height="28" rx="4" fill="#2b2a31" stroke="${C}" stroke-width="3"/><circle cx="${d > 0 ? x + 34 : x - 34}" cy="${y}" r="5" fill="#e2544f"/></g></g>`;
    casa += cam(160, 290, -1, 0) + cam(1760, 290, 1, 1) + cam(640, 190, -1, 2) + cam(1280, 190, 1, 3);
    fundo += casa;
    // escadaria
    for (let i = 0; i < 5; i++) fundo += `<rect x="${840 - i * 30}" y="${720 + i * 20}" width="${240 + i * 60}" height="20" fill="#ece4d2" stroke="${C}" stroke-width="5"/>`;
    // chao: caminho de pedra e grama
    fundo += `<rect x="-300" y="720" width="2520" height="700" fill="#7dbb5f"/><path d="M-300 720 H840 M1080 720 H2220" stroke="${C}" stroke-width="5"/>`;
    fundo += `<path d="M720 820 L1200 820 L1500 1300 L420 1300 Z" fill="#e6dccb" stroke="${C}" stroke-width="5"/>`;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) { const y = 840 + r * 44 + r * r * 3, w = 60 + r * 14, x = 960 - 4 * w + c * w + (r % 2) * w / 2; if (x > 700 - r * 50 && x < 1180 + r * 50) fundo += `<rect x="${x}" y="${y}" width="${w - 8}" height="${34 + r * 3}" rx="6" fill="#d9ccb4" stroke="#c4b496" stroke-width="3"/>`; }
    // carros na entrada (esquerda) — pequenos, atras da cerca
    const carrinho = (x, y, cor, f = 1) => `<g transform="translate(${x} ${y}) scale(${0.32 * f} 0.32)">${window.Objetos.carroHatch({ cor, id: id + "-c" + x })}</g>`;
    fundo += carrinho(-110, 700, "#2b2a31") + carrinho(1780, 700, "#c9ccd4", -1);
    // meio: fonte redonda e cerca viva podada
    let meio = `<g id="${id}-fonte"><ellipse cx="960" cy="900" rx="260" ry="60" fill="#d8cab0" stroke="${C}" stroke-width="7"/><ellipse cx="960" cy="890" rx="230" ry="46" fill="#6fbfe0" stroke="${C}" stroke-width="5"/><path d="M800 890 q40 -10 80 0 M1040 896 q40 -10 80 0" stroke="#bfe6f4" stroke-width="5" fill="none"/>
      <rect x="940" y="780" width="40" height="110" fill="#ece4d2" stroke="${C}" stroke-width="5"/><ellipse cx="960" cy="784" rx="80" ry="20" fill="#ece4d2" stroke="${C}" stroke-width="5"/><ellipse cx="960" cy="778" rx="64" ry="12" fill="#6fbfe0"/>
      <g id="${id}-fonte-agua"><path d="M960 760 Q930 700 900 780 M960 760 Q990 700 1020 780 M960 760 V720" fill="none" stroke="#9fd8f5" stroke-width="8" stroke-linecap="round"/><circle cx="960" cy="714" r="10" fill="#bfe6f4" stroke="${C}" stroke-width="3"/></g></g>`;
    const cerca = (x, w) => `<rect x="${x}" y="760" width="${w}" height="80" rx="30" fill="#4f8f45" stroke="${C}" stroke-width="6"/><path d="M${x + 20} 780 q${w / 2 - 20} -16 ${w - 40} 0" stroke="#6fae5a" stroke-width="6" fill="none"/>`;
    meio += cerca(-100, 640) + cerca(1380, 640);
    meio += `<g transform="translate(560 860)"><circle r="54" fill="#4f8f45" stroke="${C}" stroke-width="6"/><circle cx="-14" cy="-16" r="18" fill="#6fae5a"/><rect x="-36" y="40" width="72" height="50" fill="#c96b4a" stroke="${C}" stroke-width="5"/></g><g transform="translate(1360 860)"><circle r="54" fill="#4f8f45" stroke="${C}" stroke-width="6"/><circle cx="-14" cy="-16" r="18" fill="#6fae5a"/><rect x="-36" y="40" width="72" height="50" fill="#c96b4a" stroke="${C}" stroke-width="5"/></g>`;
    // portao de entrada (esquerda), por onde a fila entra
    meio += `<g id="${id}-portao"><rect x="40" y="560" width="40" height="300" fill="#d8cab0" stroke="${C}" stroke-width="6"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${90 + i * 26} 860 V${640 + (i % 2) * 12}" stroke="${C}" stroke-width="8"/>`).join("")}<path d="M80 680 H220 M80 820 H220" stroke="${C}" stroke-width="10"/><rect x="220" y="560" width="40" height="300" fill="#d8cab0" stroke="${C}" stroke-width="6"/><circle cx="60" cy="548" r="16" fill="#fff3c4" stroke="${C}" stroke-width="4"/><circle cx="240" cy="548" r="16" fill="#fff3c4" stroke="${C}" stroke-width="4"/></g>`;
    const frente = `<path d="M-300 1040 Q0 1010 300 1050 L300 1100 L-300 1100 Z" fill="#5f9f4f" stroke="${C}" stroke-width="5"/>` + `<g transform="translate(1780 1080)">${[[-70, -40], [-20, -70], [40, -50], [80, -20]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="40" fill="${i % 2 ? "#e2544f" : "#F5C542"}" stroke="${C}" stroke-width="5"/><circle cx="${x}" cy="${y}" r="12" fill="#fff3c4"/>`).join("")}</g>`;
    const g = camadas(id, fundo, meio, frente);
    if (!o.desfoque) return g;
    return `<defs><filter id="${id}-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${o.desfoque}"/></filter></defs>` + g.replace(`<g id="${id}">`, `<g id="${id}" filter="url(#${id}-blur)">`);
  }

  /* fachada larga (c20, plano do desfile): o.largura; a casa fica no fim (x = largura - 1920 ... largura) e o portao no comeco (x 40..260).
   * ids extras: -luminaria-N. As cameras continuam -cam-0..3 (deslocadas junto com a casa). */
  function fachadaMansaoLarga(o) {
    const id = o.id || "mansao", W = o.largura, dx = W - 1920;
    const base = fachadaMansao(Object.assign({}, o, { largura: 1920, id }));
    const pega = (camada) => { const m = base.match(new RegExp(`<g id="${id}-${camada}">([\\s\\S]*?)</g><g id="${id}-(meio|frente)">`)); return m ? m[1] : ""; };
    const iF = base.indexOf(`<g id="${id}-fundo">`) + `<g id="${id}-fundo">`.length, iM = base.indexOf(`</g><g id="${id}-meio">`), iFr = base.indexOf(`</g><g id="${id}-frente">`);
    const fundoCasa = base.slice(iF, iM), meioCasa = base.slice(iM + `</g><g id="${id}-meio">`.length, iFr), frenteCasa = base.slice(iFr + `</g><g id="${id}-frente">`.length, base.length - 8);
    let fundo = `<rect x="-300" y="-300" width="${W + 600}" height="1000" fill="#bfe3f0"/>`;
    for (let i = 0; i * 520 < dx + 300; i++) fundo += P.nuvem(i * 520 - 100 + rnd(i) * 120, 60 + rnd(i + 2) * 100, 0.9 + rnd(i + 5) * 0.4);
    for (let i = 0; i * 170 < dx + 300; i++) fundo += copa(-200 + i * 170, 560 + rnd(i + 11) * 30, 70 + rnd(i + 12) * 30, i % 2 ? "#5f9f4f" : "#4f8f45");
    fundo += `<rect x="-300" y="720" width="${dx + 600}" height="700" fill="#7dbb5f"/><path d="M-300 720 H${dx + 300}" stroke="${C}" stroke-width="5"/>`;
    // caminho de pedras do portao ate a casa
    fundo += `<path d="M150 1300 Q300 900 ${dx * 0.5} 860 Q${dx * 0.85} 830 ${dx + 760} 820 L${dx + 1160} 820 Q${dx * 0.85 + 200} 900 ${dx * 0.5} 960 Q400 1000 420 1300 Z" fill="#e6dccb" stroke="${C}" stroke-width="5"/>`;
    for (let i = 0; i < dx / 90; i++) { const x = 300 + i * 90, y = 900 + Math.sin(i * 0.7) * 10; fundo += `<ellipse cx="${x}" cy="${y}" rx="34" ry="14" fill="#d9ccb4" stroke="#c4b496" stroke-width="3"/>`; }
    fundo += `<g transform="translate(${dx} 0)">${fundoCasa}</g>`;
    let meio = `<g transform="translate(${dx} 0)">${meioCasa}</g>`;
    // canteiros, luminarias e cerca viva ao longo do jardim
    for (let i = 0; i * 420 + 420 < dx; i++) {
      const x = 420 + i * 420;
      meio += `<g id="${id}-luminaria-${i}"><rect x="${x - 6}" y="640" width="12" height="160" fill="#4a4d57" stroke="${C}" stroke-width="4"/><path d="M${x - 26} 640 h52 l-10 -40 h-32 Z" fill="#fff3c4" stroke="${C}" stroke-width="5"/><ellipse cx="${x}" cy="802" rx="26" ry="8" fill="#4a4d57"/></g>`;
      meio += `<rect x="${x + 80}" y="760" width="240" height="70" rx="30" fill="#4f8f45" stroke="${C}" stroke-width="6"/><path d="M${x + 100} 780 q100 -16 200 0" stroke="#6fae5a" stroke-width="6" fill="none"/>`;
      meio += [0, 1, 2].map(k => `<circle cx="${x + 120 + k * 80}" cy="${750}" r="16" fill="${["#e2544f", "#F5C542", "#ef5b8c"][(i + k) % 3]}" stroke="${C}" stroke-width="4"/>`).join("");
    }
    meio += `<g id="${id}-portao-entrada"><rect x="40" y="560" width="40" height="300" fill="#d8cab0" stroke="${C}" stroke-width="6"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${90 + i * 26} 860 V${640 + (i % 2) * 12}" stroke="${C}" stroke-width="8"/>`).join("")}<path d="M80 680 H220 M80 820 H220" stroke="${C}" stroke-width="10"/><rect x="220" y="560" width="40" height="300" fill="#d8cab0" stroke="${C}" stroke-width="6"/><circle cx="60" cy="548" r="16" fill="#fff3c4" stroke="${C}" stroke-width="4"/><circle cx="240" cy="548" r="16" fill="#fff3c4" stroke="${C}" stroke-width="4"/></g>`;
    const frente = `<g transform="translate(${dx} 0)">${frenteCasa}</g>`;
    return camadas(id, fundo, meio, frente);
  }

  /* ---------- SALAO DA MANSAO (c21, c23) ----------
   * Pes do personagem: 960. ids: -lustre (balanca), -quadro-0..2, -escada. */
  function salaoMansao(o = {}) {
    const id = o.id || "salao";
    let fundo = `<rect x="-300" y="-300" width="2520" height="1100" fill="#efe1c8"/>`;
    // painel de parede (boiserie)
    for (let i = 0; i < 9; i++) { const x = -200 + i * 260; fundo += `<rect x="${x}" y="470" width="220" height="200" rx="6" fill="none" stroke="#dcc9a6" stroke-width="6"/><rect x="${x + 16}" y="486" width="188" height="168" rx="4" fill="none" stroke="#e6d6b8" stroke-width="3"/>`; }
    fundo += `<rect x="-300" y="440" width="2520" height="20" fill="#e0cfae" stroke="${C}" stroke-width="4"/><rect x="-300" y="-40" width="2520" height="50" fill="#e6d6b8" stroke="${C}" stroke-width="5"/>`;
    for (let x = -300; x < 2220; x += 60) fundo += `<path d="M${x} 10 v20 h30 v-20" fill="none" stroke="#cbb68e" stroke-width="4"/>`;
    // janelas altas com cortinas pesadas
    const janelaAlta = (x) => `<rect x="${x}" y="70" width="220" height="560" rx="110" fill="#bfe3f0" stroke="${C}" stroke-width="7"/><path d="M${x + 110} 70 V630 M${x} 300 H${x + 220} M${x} 460 H${x + 220}" stroke="#f4efe4" stroke-width="10"/><path d="M${x + 110} 70 V630 M${x} 300 H${x + 220} M${x} 460 H${x + 220}" stroke="${C}" stroke-width="3"/><path d="M${x + 30} 600 L${x + 100} 160" stroke="#fff" stroke-width="12" opacity="0.5"/>
      <path d="M${x - 60} 40 Q${x - 20} 300 ${x - 40} 690 L${x + 40} 690 Q${x + 30} 300 ${x + 40} 40 Z" fill="#8a2e3a" stroke="${C}" stroke-width="6"/><path d="M${x + 180} 40 Q${x + 190} 300 ${x + 180} 690 L${x + 260} 690 Q${x + 240} 300 ${x + 280} 40 Z" fill="#8a2e3a" stroke="${C}" stroke-width="6"/>
      ${[-30, -6, 200, 226].map(dx => `<path d="M${x + dx} 60 Q${x + dx + 8} 360 ${x + dx - 4} 680" stroke="#6e2230" stroke-width="5" fill="none"/>`).join("")}<path d="M${x - 70} 30 H${x + 290}" stroke="${C}" stroke-width="16" stroke-linecap="round"/><path d="M${x - 70} 30 H${x + 290}" stroke="#e0b23e" stroke-width="8" stroke-linecap="round"/><path d="M${x - 70} 30 Q${x + 110} 110 ${x + 290} 30" fill="#a63a48" stroke="${C}" stroke-width="5"/>`;
    fundo += janelaAlta(60) + janelaAlta(1640);
    // quadros com moldura dourada
    const quadro = (x, y, w, h, i, arte) => `<g id="${id}-quadro-${i}"><rect x="${x - 18}" y="${y - 18}" width="${w + 36}" height="${h + 36}" rx="6" fill="#d9a93a" stroke="${C}" stroke-width="6"/><rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" fill="none" stroke="#f3d27a" stroke-width="4"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f4e9cf" stroke="${C}" stroke-width="4"/>${arte}</g>`;
    fundo += quadro(470, 130, 240, 300, 0, `<rect x="470" y="130" width="240" height="300" fill="#7aa7c7"/><circle cx="590" cy="240" r="60" fill="#f2c9a0" stroke="${C}" stroke-width="4"/><circle cx="570" cy="236" r="6" fill="${C}"/><circle cx="610" cy="236" r="6" fill="${C}"/><path d="M572 266 q18 12 36 0" fill="none" stroke="${C}" stroke-width="4" stroke-linecap="round"/><path d="M556 216 q12 -8 24 0 M600 216 q12 -8 24 0" fill="none" stroke="${C}" stroke-width="4"/><path d="M560 300 q30 30 60 0" fill="#7a5a3a" stroke="${C}" stroke-width="3"/><path d="M520 430 Q590 300 660 430 Z" fill="#3a4a6a" stroke="${C}" stroke-width="4"/><path d="M540 220 Q590 160 640 220 Q620 190 590 190 Q560 190 540 220 Z" fill="#4a3a2a"/>`);
    fundo += quadro(1230, 150, 300, 220, 1, `<rect x="1230" y="150" width="300" height="220" fill="#9fd0ea"/><path d="M1230 370 L1310 260 L1370 320 L1430 230 L1530 370 Z" fill="#6fae5a" stroke="${C}" stroke-width="4"/><circle cx="1470" cy="200" r="22" fill="#F5C542" stroke="${C}" stroke-width="3"/>`);
    // escada curva (direita, ao fundo)
    let escada = `<g id="${id}-escada"><path d="M1180 700 Q1200 520 1400 470 L1560 470 L1560 500 L1420 500 Q1250 540 1250 700 Z" fill="#e6d6b8" stroke="${C}" stroke-width="6"/>`;
    for (let i = 0; i < 9; i++) { const t = i / 9; escada += `<path d="M${1190 + t * 180} ${690 - t * 200} l${60 - t * 10} ${-6}" stroke="${C}" stroke-width="4"/>`; }
    escada += `<path d="M1170 560 Q1190 380 1400 330 L1560 330" fill="none" stroke="${C}" stroke-width="12"/><path d="M1170 560 Q1190 380 1400 330 L1560 330" fill="none" stroke="#a86b42" stroke-width="6"/>`;
    for (let i = 0; i < 12; i++) { const t = i / 11, x = 1180 + t * 370, y = 640 - Math.sin(t * 1.4) * 260; escada += `<path d="M${x} ${y + 40} V${y - 60 + t * 10}" stroke="${C}" stroke-width="5"/>`; }
    escada += `<rect x="1160" y="540" width="26" height="160" fill="#a86b42" stroke="${C}" stroke-width="5"/><circle cx="1173" cy="532" r="16" fill="#e0b23e" stroke="${C}" stroke-width="4"/></g>`;
    fundo += escada;
    // piso xadrez em perspectiva
    fundo += `<rect x="-300" y="700" width="2520" height="700" fill="#f4efe4"/><path d="M-300 700 H2220" stroke="${C}" stroke-width="6"/>`;
    const lin = [700, 740, 790, 850, 922, 1006, 1104, 1220];
    for (let r = 0; r < lin.length - 1; r++) for (let c = -14; c < 14; c++) { if ((r + c) % 2 === 0) continue; const y0 = lin[r], y1 = lin[r + 1], k0 = 1 + (y0 - 700) / 260, k1 = 1 + (y1 - 700) / 260, w = 110; fundo += `<path d="M${960 + c * w * k0} ${y0} L${960 + (c + 1) * w * k0} ${y0} L${960 + (c + 1) * w * k1} ${y1} L${960 + c * w * k1} ${y1} Z" fill="#3a3842" opacity="0.85"/>`; }
    fundo += `<rect x="-300" y="680" width="2520" height="24" fill="#e0cfae" stroke="${C}" stroke-width="5"/>`;
    // tapete persa
    let meio = `<ellipse cx="960" cy="930" rx="560" ry="90" fill="#8a2e3a" stroke="${C}" stroke-width="6"/><ellipse cx="960" cy="930" rx="500" ry="72" fill="none" stroke="#e0b23e" stroke-width="6" stroke-dasharray="18 10"/><ellipse cx="960" cy="930" rx="260" ry="36" fill="#a63a48" stroke="#e0b23e" stroke-width="4"/>`;
    // lustre de cristal
    meio += `<g id="${id}-lustre"><path d="M960 -40 V90" stroke="${C}" stroke-width="5"/>`;
    [[-180, 150], [-100, 170], [0, 180], [100, 170], [180, 150]].forEach(([dx, y]) => meio += `<path d="M960 120 Q${960 + dx * 0.5} ${y + 10} ${960 + dx} ${y}" fill="none" stroke="${C}" stroke-width="10"/><path d="M960 120 Q${960 + dx * 0.5} ${y + 10} ${960 + dx} ${y}" fill="none" stroke="#e0b23e" stroke-width="5"/><rect x="${960 + dx - 8}" y="${y - 36}" width="16" height="30" rx="3" fill="#fff8e6" stroke="${C}" stroke-width="3"/><path d="M${960 + dx} ${y - 50} q-6 8 0 14 q6 -6 0 -14 Z" fill="#F5C542"/>${[0, 1, 2].map(j => `<path d="M${960 + dx - 10 + j * 10} ${y + 4} l-5 18 l5 8 l5 -8 Z" fill="#dff2fa" stroke="${C}" stroke-width="2"/>`).join("")}`);
    meio += `<ellipse cx="960" cy="110" rx="70" ry="26" fill="#e0b23e" stroke="${C}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5, 6].map(j => `<path d="M${912 + j * 16} 130 l-5 24 l5 10 l5 -10 Z" fill="#dff2fa" stroke="${C}" stroke-width="2"/>`).join("")}<circle cx="960" cy="200" r="12" fill="#dff2fa" stroke="${C}" stroke-width="3"/></g>`;
    // vasos com plantas grandes
    meio += P.planta(330, 760, 1.1, "#e6d6b8") + P.planta(1560, 760, 1.1, "#e6d6b8");
    if (o.sofa_gigante) meio += `<g id="${id}-sofa" transform="translate(260 ${980 - 362})">${window.Objetos.sofaGigante({ id: id + "-sofaG" })}</g>`;
    // aparador com vaso (esquerda)
    meio += `<rect x="740" y="610" width="240" height="20" rx="4" fill="#a86b42" stroke="${C}" stroke-width="5"/><path d="M760 630 v70 M960 630 v70" stroke="${C}" stroke-width="10"/><path d="M820 610 q-10 -60 40 -70 q50 10 40 70 Z" fill="#4a90d9" stroke="${C}" stroke-width="5"/>${[[-30, -110], [0, -130], [30, -110]].map(([dx, dy]) => `<circle cx="${860 + dx}" cy="${610 + dy}" r="18" fill="#e2544f" stroke="${C}" stroke-width="4"/>`).join("")}<path d="M860 540 v-70 M840 545 l-10 -45 M880 545 l10 -45" stroke="#5f9f4f" stroke-width="5"/>`;
    return camadas(id, fundo, meio, "");
  }

  /* ---------- MANSAO EM CORTE / casa de bonecas (c22) ----------
   * Fundo creme de infografico. ids: -comodo-N (cada um com -comodo-N-luz, opacity 0 = apagado, e -comodo-N-escuro sobreposto, opacity 1),
   *      -engrenagens (sotao; -engrenagem-0..2 giram em torno do centro), -rede (quarto de cima, onde o personagem deita).
   * mansaoCorte.comodos: [{x,y,w,h,nome}] para pôr os trabalhadores (pes = y+h-14). */
  const COMODOS = [
    { x: 420, y: 560, w: 360, h: 190, nome: "cozinha" }, { x: 780, y: 560, w: 360, h: 190, nome: "sala" }, { x: 1140, y: 560, w: 360, h: 190, nome: "garagem" },
    { x: 420, y: 370, w: 360, h: 190, nome: "lavanderia" }, { x: 780, y: 370, w: 360, h: 190, nome: "escritorio" }, { x: 1140, y: 370, w: 360, h: 190, nome: "quarto" },
    { x: 420, y: 180, w: 360, h: 190, nome: "biblioteca" }, { x: 780, y: 180, w: 360, h: 190, nome: "quartoRede" }, { x: 1140, y: 180, w: 360, h: 190, nome: "academia" },
  ];
  function mansaoCorte(o = {}) {
    const id = o.id || "corte";
    let fundo = `<rect x="-300" y="-300" width="2520" height="1680" fill="#f2e6c9"/>`;
    for (let x = -300; x < 2220; x += 80) fundo += `<path d="M${x} -300 V1380" stroke="#e8dab8" stroke-width="3"/>`;
    for (let y = -300; y < 1380; y += 80) fundo += `<path d="M-300 ${y} H2220" stroke="#e8dab8" stroke-width="3"/>`;
    // chao, gramado e arvores laterais
    fundo += `<rect x="-300" y="750" width="2520" height="40" fill="#7dbb5f" stroke="${C}" stroke-width="5"/><rect x="-300" y="790" width="2520" height="600" fill="#b8865a"/>${[0, 1, 2, 3].map(i => `<path d="M-300 ${830 + i * 60} H2220" stroke="#a37548" stroke-width="5"/>`).join("")}`;
    fundo += arvoreG(230, 760, 0.8) + arvoreG(1700, 760, 0.85, "#4f8f45");
    // estrutura: telhado (sotao) e paredes
    let s = `<path d="M380 180 L960 -40 L1540 180 Z" fill="#c25b4e" stroke="${C}" stroke-width="8" stroke-linejoin="round"/><path d="M450 170 L960 -10 L1470 170 Z" fill="#7a5040" stroke="${C}" stroke-width="5"/>`;
    s += `<rect x="410" y="170" width="1100" height="590" fill="#f4efe4" stroke="${C}" stroke-width="8"/>`;
    // moveis de cada comodo
    const mov = {
      cozinha: (c) => `<rect x="${c.x + 20}" y="${c.y + 110}" width="200" height="66" fill="#fff" stroke="${C}" stroke-width="4"/><rect x="${c.x + 20}" y="${c.y + 104}" width="200" height="10" fill="#c9ccd4" stroke="${C}" stroke-width="3"/><rect x="${c.x + 240}" y="${c.y + 40}" width="90" height="136" rx="6" fill="#dfe6ea" stroke="${C}" stroke-width="4"/><path d="M${c.x + 240} ${c.y + 90} h90" stroke="${C}" stroke-width="3"/><rect x="${c.x + 30}" y="${c.y + 30}" width="160" height="40" fill="#e6c79a" stroke="${C}" stroke-width="4"/><circle cx="${c.x + 70}" cy="${c.y + 104}" r="10" fill="#4a4d57"/><circle cx="${c.x + 110}" cy="${c.y + 104}" r="10" fill="#4a4d57"/>`,
      sala: (c) => `<rect x="${c.x + 70}" y="${c.y + 110}" width="220" height="56" rx="16" fill="#e08b4a" stroke="${C}" stroke-width="4"/><rect x="${c.x + 70}" y="${c.y + 80}" width="220" height="40" rx="14" fill="#ea9a5a" stroke="${C}" stroke-width="4"/><rect x="${c.x + 120}" y="${c.y + 20}" width="120" height="50" rx="4" fill="#2b2a31" stroke="${C}" stroke-width="4"/><circle cx="${c.x + 30}" cy="${c.y + 140}" r="22" fill="#6fae5a" stroke="${C}" stroke-width="3"/>`,
      garagem: (c) => `<g transform="translate(${c.x + 40} ${c.y + 66}) scale(0.32)">${window.Objetos.carroHatch({ cor: "#2b2a31", id: id + "-gar" })}</g><rect x="${c.x + 300}" y="${c.y + 30}" width="50" height="146" fill="#c9ccd4" stroke="${C}" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<path d="M${c.x + 300} ${c.y + 60 + i * 30} h50" stroke="${C}" stroke-width="3"/>`).join("")}`,
      lavanderia: (c) => [0, 1].map(i => `<rect x="${c.x + 30 + i * 110}" y="${c.y + 80}" width="96" height="96" rx="8" fill="#fff" stroke="${C}" stroke-width="4"/><circle cx="${c.x + 78 + i * 110}" cy="${c.y + 132}" r="30" fill="#9fd8f5" stroke="${C}" stroke-width="4"/>`).join("") + `<path d="M${c.x + 250} ${c.y + 40} h90" stroke="${C}" stroke-width="3"/>${[0, 1, 2].map(i => `<rect x="${c.x + 256 + i * 28}" y="${c.y + 40}" width="22" height="34" fill="${["#e2544f", "#F5C542", "#4a90d9"][i]}" stroke="${C}" stroke-width="3"/>`).join("")}`,
      escritorio: (c) => `<rect x="${c.x + 60}" y="${c.y + 110}" width="200" height="16" fill="#a86b42" stroke="${C}" stroke-width="4"/><path d="M${c.x + 76} ${c.y + 126} v50 M${c.x + 244} ${c.y + 126} v50" stroke="${C}" stroke-width="6"/><rect x="${c.x + 120}" y="${c.y + 60}" width="80" height="50" rx="4" fill="#2b2a31" stroke="${C}" stroke-width="4"/><rect x="${c.x + 280}" y="${c.y + 30}" width="60" height="146" fill="#b98250" stroke="${C}" stroke-width="4"/>${[0, 1, 2].map(i => `<path d="M${c.x + 280} ${c.y + 70 + i * 36} h60" stroke="${C}" stroke-width="3"/>`).join("")}`,
      quarto: (c) => `<rect x="${c.x + 80}" y="${c.y + 120}" width="220" height="56" rx="8" fill="#9fcfc6" stroke="${C}" stroke-width="4"/><rect x="${c.x + 70}" y="${c.y + 80}" width="20" height="96" fill="#a86b42" stroke="${C}" stroke-width="4"/><rect x="${c.x + 100}" y="${c.y + 104}" width="60" height="22" rx="8" fill="#fff" stroke="${C}" stroke-width="3"/><rect x="${c.x + 20}" y="${c.y + 30}" width="60" height="50" fill="#9fd0ea" stroke="${C}" stroke-width="4"/>`,
      biblioteca: (c) => [0, 1, 2].map(r => `<path d="M${c.x + 20} ${c.y + 60 + r * 50} h320" stroke="${C}" stroke-width="5"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `<rect x="${c.x + 26 + i * 28}" y="${c.y + 24 + r * 50}" width="22" height="34" fill="${["#e2544f", "#4a90d9", "#F5C542", "#6fae5a", "#b07cc6"][(i + r) % 5]}" stroke="${C}" stroke-width="2"/>`).join("")).join(""),
      quartoRede: (c) => `<rect x="${c.x + 20}" y="${c.y + 30}" width="70" height="60" fill="#9fd0ea" stroke="${C}" stroke-width="4"/><path d="M${c.x + 55} ${c.y + 30} v60" stroke="${C}" stroke-width="3"/><g id="${id}-rede" opacity="${o.rede === false ? 0 : 1}"><path d="M${c.x + 60} ${c.y + 100} L${c.x + 110} ${c.y + 130} M${c.x + 300} ${c.y + 100} L${c.x + 250} ${c.y + 130}" stroke="${C}" stroke-width="4"/><path d="M${c.x + 100} ${c.y + 126} Q${c.x + 180} ${c.y + 190} ${c.x + 260} ${c.y + 126} Q${c.x + 180} ${c.y + 160} ${c.x + 100} ${c.y + 126} Z" fill="#f29e4c" stroke="${C}" stroke-width="5"/>${[0, 1, 2, 3].map(i => `<path d="M${c.x + 120 + i * 36} ${c.y + 136 + Math.sin(i) * 6} v${16 + (i % 2) * 6}" stroke="#e2544f" stroke-width="5"/>`).join("")}</g><rect x="${c.x + 52}" y="${c.y + 96}" width="12" height="80" fill="#a86b42" stroke="${C}" stroke-width="3"/><rect x="${c.x + 296}" y="${c.y + 96}" width="12" height="80" fill="#a86b42" stroke="${C}" stroke-width="3"/>`,
      academia: (c) => `<rect x="${c.x + 30}" y="${c.y + 120}" width="150" height="40" rx="10" fill="#4a4d57" stroke="${C}" stroke-width="4"/><path d="M${c.x + 160} ${c.y + 120} l20 -60" stroke="${C}" stroke-width="8"/><path d="M${c.x + 220} ${c.y + 80} h110" stroke="${C}" stroke-width="8"/><rect x="${c.x + 212}" y="${c.y + 60}" width="16" height="40" rx="4" fill="#e2544f" stroke="${C}" stroke-width="3"/><rect x="${c.x + 324}" y="${c.y + 60}" width="16" height="40" rx="4" fill="#e2544f" stroke="${C}" stroke-width="3"/><circle cx="${c.x + 290}" cy="${c.y + 150}" r="24" fill="#4a90d9" stroke="${C}" stroke-width="4"/>`,
    };
    const papel = ["#f6e3c4", "#dcebf2", "#e6e2ee", "#e3f0dc", "#f2e0d6", "#dfe9f6", "#efe3cf", "#fbe7b5", "#e1ecdf"];
    COMODOS.forEach((c, i) => {
      s += `<g id="${id}-comodo-${i}"><rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" fill="${papel[i]}" stroke="${C}" stroke-width="6"/>${mov[c.nome](c)}
        <rect id="${id}-comodo-${i}-luz" x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" fill="#fff3c4" opacity="0"/>
        <rect id="${id}-comodo-${i}-escuro" x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" fill="#2E2A33" opacity="0.45"/>
        <circle cx="${c.x + c.w / 2}" cy="${c.y + 12}" r="8" fill="#F5C542" stroke="${C}" stroke-width="3"/></g>`;
    });
    // lajes grossas entre andares
    [180, 370, 560, 750].forEach(y => s += `<rect x="400" y="${y - 8}" width="1120" height="16" fill="#d8cab0" stroke="${C}" stroke-width="5"/>`);
    // escada interna (lado esquerdo do corte)
    s += `<rect x="410" y="170" width="10" height="590" fill="${C}"/>`;
    // sotao com engrenagens
    const eng = (cx, cy, r, i, cor) => { let d = ""; const n = Math.round(r / 7); for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2, b = a + Math.PI / n * 0.9; d += `${k ? "L" : "M"}${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r} L${cx + Math.cos(a) * (r + 12)} ${cy + Math.sin(a) * (r + 12)} L${cx + Math.cos(b) * (r + 12)} ${cy + Math.sin(b) * (r + 12)} L${cx + Math.cos(b) * r} ${cy + Math.sin(b) * r} `; } return `<g id="${id}-engrenagem-${i}" style="transform-box:fill-box;transform-origin:50% 50%"><path d="${d}Z" fill="${cor}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy}" r="${r * 0.45}" fill="${esc(cor, 0.25)}" stroke="${C}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${r * 0.15}" fill="${C}"/></g>`; };
    if (o.engrenagens !== false) s += `<g id="${id}-engrenagens">${eng(860, 112, 44, 0, "#e0b23e")}${eng(950, 82, 28, 1, "#c9ccd4")}${eng(1040, 116, 38, 2, "#e0b23e")}</g>`;
    s += `<rect x="1180" y="100" width="80" height="60" fill="#d8b47a" stroke="${C}" stroke-width="4"/><path d="M1180 120 h80" stroke="${C}" stroke-width="3"/><rect x="660" y="112" width="70" height="50" fill="#d8b47a" stroke="${C}" stroke-width="4"/>`;
    // chamine
    s += `<rect x="1300" y="0" width="70" height="120" fill="#b85a46" stroke="${C}" stroke-width="6"/><rect x="1290" y="-10" width="90" height="22" fill="#9a4a3a" stroke="${C}" stroke-width="5"/>`;
    fundo += s;
    return camadas(id, fundo, "", "");
  }
  mansaoCorte.comodos = COMODOS;

  /* ---------- MAR ABERTO (c24, c25, c26) ----------
   * Horizonte em y 600. ids: -ondas (faixas que deslizam), -gaivota-0..2, -sol. */
  function marAberto(o = {}) {
    const id = o.id || "mar", hz = o.horizonte || 600, W = Math.max(1920, o.largura || 1920), WD = W + 600;
    let fundo = `<defs><linearGradient id="${id}-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4e6"/><stop offset="1" stop-color="#d6f0f8"/></linearGradient></defs><rect x="-600" y="-400" width="${WD + 600}" height="${hz + 400}" fill="url(#${id}-ceu)"/>`;
    fundo += `<g id="${id}-sol"><circle cx="1560" cy="170" r="150" fill="#fff3c4" opacity="0.45"/><circle cx="1560" cy="170" r="92" fill="#F5C542" stroke="${C}" stroke-width="6"/><circle cx="1530" cy="140" r="26" fill="#fbe08a"/></g>`;
    // nuvens em camadas
    for (let i = 0; i * 420 - 200 < WD; i++) fundo += P.nuvem(i * 420 - 200 + rnd(i) * 120, 50 + rnd(i + 9) * 120, 0.9 + rnd(i + 4) * 0.7);
    for (let i = 1; i * 1400 < W; i++) fundo += `<g transform="translate(${i * 1400} 0)">` + [[420, 230, 1], [520, 280, 0.8]].map(([x, y, s]) => `<path d="M${x - 30 * s} ${y} q${15 * s} -18 ${30 * s} 0 q${15 * s} -18 ${30 * s} 0" fill="none" stroke="${C}" stroke-width="5" stroke-linecap="round"/>`).join("") + `</g>`;
    { let d = `M-600 ${hz - 70}`; for (let x = -600; x < WD; x += 600) d += ` Q${x + 300} ${hz - 140 + (x / 600 % 2 ? 10 : 0)} ${x + 600} ${hz - 75}`; fundo += `<path d="${d} L${WD} ${hz} L-600 ${hz} Z" fill="#fff" opacity="0.7"/>`; }
    fundo += `<g id="${id}-gaivotas">${[[420, 230, 1], [520, 280, 0.8], [1180, 300, 0.9]].map(([x, y, s], i) => `<path id="${id}-gaivota-${i}" d="M${x - 30 * s} ${y} q${15 * s} -18 ${30 * s} 0 q${15 * s} -18 ${30 * s} 0" fill="none" stroke="${C}" stroke-width="5" stroke-linecap="round"/>`).join("")}</g>`;
    // mar em faixas
    const cores = ["#2f7fb8", "#3a8fc6", "#4a9fd2", "#5aaedc", "#68bbe2"];
    let mar = `<rect x="-600" y="${hz}" width="${WD + 600}" height="${1080 - hz + 400}" fill="#2f7fb8"/><path d="M-600 ${hz} H${WD}" stroke="${C}" stroke-width="5"/>`;
    for (let i = 0; i < 5; i++) { const y = hz + 20 + i * i * 14 + i * 40; mar += `<rect x="-600" y="${y}" width="${WD + 600}" height="${1480 - y}" fill="${cores[i]}"/>`; }
    mar += `<g id="${id}-ondas">`;
    for (let r = 0; r < 9; r++) { const y = hz + 24 + r * r * 7 + r * 26, w = 40 + r * 14; for (let c = -2; c < WD / (w * 3) + 2; c++) { const x = -600 + c * w * 3 + (r % 2) * w * 1.5 + rnd(r * 50 + c) * w; mar += `<path d="M${x} ${y} q${w / 2} ${-w / 5} ${w} 0" fill="none" stroke="#e6f6fb" stroke-width="${3 + r * 0.8}" stroke-linecap="round" opacity="${0.55 + r * 0.04}"/>`; } }
    mar += `</g>`;
    // brilho do sol na agua, veleiro e farol distantes, boia
    for (let i = 0; i < 7; i++) mar += `<rect x="${1500 - i * 10 - rnd(i) * 40}" y="${hz + 16 + i * 26}" width="${70 + i * 18 + rnd(i + 3) * 40}" height="8" rx="4" fill="#fff3c4" opacity="${0.75 - i * 0.07}"/>`;
    mar += `<g id="${id}-veleiro" transform="translate(760 ${hz - 4})"><path d="M-40 0 h80 l-12 16 h-56 Z" fill="#fff" stroke="${C}" stroke-width="4"/><path d="M0 -4 V-90" stroke="${C}" stroke-width="4"/><path d="M4 -86 L44 -10 H4 Z" fill="#fff8e6" stroke="${C}" stroke-width="4"/><path d="M-4 -70 L-34 -10 H-4 Z" fill="#e2544f" stroke="${C}" stroke-width="4"/></g>`;
    mar += `<g transform="translate(260 ${hz})"><path d="M-80 0 q80 -40 160 0 Z" fill="#8fc472" stroke="${C}" stroke-width="4"/><rect x="10" y="-86" width="22" height="70" fill="#fff" stroke="${C}" stroke-width="4"/><rect x="10" y="-66" width="22" height="14" fill="#e2544f"/><rect x="10" y="-38" width="22" height="14" fill="#e2544f"/><path d="M6 -86 h30 l-15 -18 Z" fill="#e2544f" stroke="${C}" stroke-width="4"/><circle cx="21" cy="-96" r="4" fill="#F5C542"/></g>`;
    mar += `<g id="${id}-boia" transform="translate(300 900)"><path d="M-36 0 q36 -16 72 0 l-8 30 h-56 Z" fill="#e2544f" stroke="${C}" stroke-width="5"/><rect x="-10" y="-70" width="20" height="70" fill="#fff" stroke="${C}" stroke-width="4"/><rect x="-10" y="-50" width="20" height="16" fill="#e2544f"/><circle cx="0" cy="-80" r="10" fill="#F5C542" stroke="${C}" stroke-width="4"/><path d="M-60 32 q30 -12 60 0 q30 12 60 0" fill="none" stroke="#e6f6fb" stroke-width="6" stroke-linecap="round"/></g>`;
    fundo += mar;
    return camadas(id, fundo, "", "");
  }

  const liso0 = P.fundoLiso;
  function fundoLisoEstante(o = {}) {
    const g = liso0(o); if (!o.estante) return g;
    const id = o.id || "liso";
    let e = `<g id="${id}-estante"><rect x="360" y="120" width="1200" height="620" fill="#b98250" stroke="${C}" stroke-width="8"/>`;
    [300, 480, 660].forEach((y, r) => { e += `<rect x="380" y="${y}" width="1160" height="16" fill="#8a5a36" stroke="${C}" stroke-width="4"/>`; let x = 392; for (let i = 0; x < 1520; i++) { const w = 26 + rnd(r * 40 + i) * 22, h = 90 + rnd(r * 40 + i + 5) * 60, c = ["#2f4f3e", "#7a3f2a", "#3a4a6a", "#c9a24a", "#8a2e3a", "#4a6a5a"][(i + r) % 6]; if (i % 9 === 4) { e += `<rect x="${x}" y="${y - 60}" width="70" height="60" rx="4" fill="#d8c09a" stroke="${C}" stroke-width="3"/><path d="M${x + 6} ${y - 40} h58 M${x + 6} ${y - 24} h58" stroke="#b79c70" stroke-width="3"/>`; x += 78; continue; } e += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="2" fill="${c}" stroke="${C}" stroke-width="3"/><path d="M${x + 4} ${y - h + 14} h${w - 8} M${x + 4} ${y - 20} h${w - 8}" stroke="#e0b23e" stroke-width="3"/>`; x += w + 2; } });
    e += `<rect x="360" y="120" width="1200" height="40" fill="#a06f43" stroke="${C}" stroke-width="6"/></g>`;
    return g.replace(`</g><g id="${id}-meio">`, e + `</g><g id="${id}-meio">`);
  }
  Object.assign(window.Cenarios, { patioFabrica, balcaoLanchonete, terrenoCima, entradaPropriedade, fachadaMansao, salaoMansao, mansaoCorte, marAberto, copa, arvoreG, palmeiraVaso, fundoLiso: fundoLisoEstante, terrenoAereo: terrenoCima, fachadaMansaoLarga });
})();

/* ===== Cenarios e objetos da parte 6 do video do trilionario (10/11/2026): os processos ===== */
(function () {
  const O = window.Objetos, Cn = window.Cenarios, C = O.C, esc = O.esc;
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const T = (x, y, txt, tam, cor = "#fff8e6", anc = "middle", extra = "") => `<text x="${x}" y="${y}" text-anchor="${anc}" style="${F};font-size:${tam}px" fill="${cor}" ${extra}>${txt}</text>`;
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const camadas = (id, f, m, fr) => `<g id="${id}"><g id="${id}-fundo">${f}</g><g id="${id}-meio">${m}</g><g id="${id}-frente">${fr}</g></g>`;

  /* ---------- TRIBUNAL (c49): parede de madeira, brasao, bandeiras, bancada do juiz, bancos ---------- */
  function tribunal(o = {}) {
    const id = o.id || "trib";
    let f = `<rect x="-300" y="-300" width="2520" height="1100" fill="#d9c3a0"/>`;
    for (let x = -300; x < 2220; x += 120) f += `<rect x="${x}" y="-300" width="120" height="1000" fill="${x % 240 ? "#cfb690" : "#d6be98"}" stroke="#b89a70" stroke-width="3"/>`;
    f += `<rect x="-300" y="430" width="2520" height="270" fill="#8a5a36" stroke="${C}" stroke-width="6"/>`;
    for (let x = -280; x < 2220; x += 160) f += `<rect x="${x}" y="460" width="130" height="210" rx="6" fill="#7a4e2e" stroke="#5e3a20" stroke-width="5"/>`;
    // brasao e bandeiras
    f += `<g transform="translate(960 150)"><circle r="96" fill="#e0b23e" stroke="${C}" stroke-width="7"/><circle r="74" fill="#2f6e4a" stroke="${C}" stroke-width="5"/>${T(0, 18, "⚖", 70, "#e0b23e")}
      ${[-1, 1].map(s => `<path d="M${s * 90} 40 Q${s * 150} 0 ${s * 140} -70" fill="none" stroke="#6fae5a" stroke-width="16" stroke-linecap="round"/>`).join("")}</g>`;
    const bandeira = (x, cor1, cor2) => `<path d="M${x} 80 V560" stroke="${C}" stroke-width="10"/><circle cx="${x}" cy="72" r="12" fill="#e0b23e" stroke="${C}" stroke-width="4"/><path d="M${x + 4} 90 Q${x + 70} 110 ${x + 60} 200 Q${x + 50} 290 ${x + 4} 300 Z" fill="${cor1}" stroke="${C}" stroke-width="5"/><path d="M${x + 4} 160 Q${x + 50} 175 ${x + 42} 230 L${x + 4} 236 Z" fill="${cor2}"/>`;
    f += bandeira(640, "#3fae5a", "#F5C542") + bandeira(1240, "#2f5aa8", "#fff");
    // relogio de parede
    f += `<g transform="translate(1600 160)"><circle r="58" fill="#fff8e6" stroke="${C}" stroke-width="7"/><path d="M0 0 V-38 M0 0 L26 12" stroke="${C}" stroke-width="7" stroke-linecap="round"/></g>`;
    // piso
    f += `<rect x="-300" y="700" width="2520" height="500" fill="#b98a5a"/>`;
    for (let y = 700; y < 1200; y += 46) f += `<path d="M-300 ${y} H2220" stroke="#a87a4a" stroke-width="4"/>`;
    // bancada do juiz (meio) com juiz pequeno atras
    let m = `<rect x="560" y="330" width="800" height="380" rx="10" fill="#7a4e2e" stroke="${C}" stroke-width="8"/><rect x="540" y="310" width="840" height="40" rx="8" fill="#5e3a20" stroke="${C}" stroke-width="7"/>
      ${[0, 1, 2].map(i => `<rect x="${610 + i * 250}" y="380" width="200" height="290" rx="8" fill="none" stroke="#5e3a20" stroke-width="6"/>`).join("")}
      <rect x="880" y="270" width="160" height="44" rx="6" fill="#2b2a31" stroke="${C}" stroke-width="5"/>${T(960, 302, "JUIZ", 26, "#e0b23e")}
      <g transform="translate(1250 300)"><rect x="-50" y="-18" width="100" height="26" rx="8" fill="#a86b42" stroke="${C}" stroke-width="5"/><rect x="-14" y="-90" width="28" height="80" rx="6" fill="#a86b42" stroke="${C}" stroke-width="5" transform="rotate(-30)"/></g>`;
    // grade e bancos (frente)
    let fr = `<rect x="-300" y="930" width="2520" height="28" fill="#7a4e2e" stroke="${C}" stroke-width="6"/>`;
    for (let x = -280; x < 2220; x += 70) fr += `<rect x="${x}" y="958" width="18" height="140" fill="#8a5a36" stroke="${C}" stroke-width="4"/>`;
    return camadas(id, f, m, fr);
  }

  /* ---------- ESCRITORIO ABERTO (c56): andar inteiro de mesas com advogados (bonequinhos) ---------- */
  function andarEscritorio(o = {}) {
    const id = o.id || "andar";
    let f = `<rect x="-300" y="-300" width="2520" height="1100" fill="#e6ecf2"/>`;
    for (let x = -260; x < 2220; x += 300) f += `<rect x="${x}" y="40" width="240" height="260" rx="6" fill="#bfe3f0" stroke="${C}" stroke-width="6"/><path d="M${x + 120} 40 V300 M${x} 170 H${x + 240}" stroke="${C}" stroke-width="4"/>`;
    f += `<rect x="-300" y="-20" width="2520" height="40" fill="#cdd6e0" stroke="${C}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${i * 340 - 40}" y="20" width="200" height="14" fill="#fffbe6" stroke="${C}" stroke-width="3"/>`).join("")}`;
    f += `<rect x="-300" y="340" width="2520" height="860" fill="#a9b7c6"/>`;
    for (let y = 340; y < 1200; y += 60) f += `<path d="M-300 ${y} H2220" stroke="#9aa9b9" stroke-width="3"/>`;
    // plaquinha
    f += `<rect x="760" y="320" width="400" height="70" rx="10" fill="#2E2A33" stroke="${C}" stroke-width="5"/>${T(960, 368, "JURÍDICO · TRILHÃO", 34, "#F5C542")}`;
    let m = "", k = 0;
    [[470, 0.6], [640, 0.78], [840, 1.0]].forEach(([y, e], r) => {
      const n = r === 2 ? 5 : 7, w = 1920 / n;
      for (let i = 0; i < n; i++) {
        const x = w * (i + 0.5) + (r % 2 ? w * 0.25 : 0) - (r % 2 ? 120 : 0);
        m += `<g transform="translate(${x} ${y}) scale(${e})"><g id="${id}-b-${k}" transform="translate(0 -18) scale(1.3)">${O.bonequinho({ id: id + "-bq" + k, cor: ["#2f4f6e", "#3a4a6a", "#4a4d57", "#6b2f3a", "#2b2a31"][k % 5], k, chapeu: null })}</g>
          <rect x="-110" y="-20" width="220" height="20" rx="4" fill="#c9a77a" stroke="${C}" stroke-width="5"/><path d="M-90 0 V90 M90 0 V90" stroke="${C}" stroke-width="8"/>
          <rect x="-60" y="-96" width="96" height="70" rx="6" fill="#2b2a31" stroke="${C}" stroke-width="5"/><rect x="-52" y="-88" width="80" height="54" fill="#9fd0ea"/><path d="M-12 -26 v10" stroke="${C}" stroke-width="6"/>
          <rect x="44" y="-50" width="50" height="30" rx="3" fill="#fff" stroke="${C}" stroke-width="3"/><rect x="48" y="-62" width="44" height="14" fill="#f7efe0" stroke="${C}" stroke-width="3"/></g>`;
        k++;
      }
    });
    return camadas(id, f, m, "");
  }

  /* ---------- envelope de mao (centro 0,0; ~ 200 x 130) ---------- */
  function envelopeMao(o = {}) {
    const id = o.id || "envm";
    return `<g id="${id}"><rect x="-100" y="-64" width="200" height="128" rx="8" fill="#f7efe0" stroke="${C}" stroke-width="6"/><path d="M-100 -64 L0 6 L100 -64" fill="none" stroke="${C}" stroke-width="5"/>
      <circle cx="0" cy="4" r="18" fill="#c25b4e" stroke="${C}" stroke-width="4"/>${T(-60, 48, "INTIMAÇÃO", 18, "#c25b4e", "start")}</g>`;
  }

  /* ---------- envelope de chao (chao em 362; ~ 300 x 70) com tarja "PROCESSO" ---------- */
  function envelopeProcesso(o = {}) {
    const id = o.id || "envp" + Math.round(rnd(o.k || 1) * 1e6);
    return `<g id="${id}"><rect x="0" y="292" width="300" height="70" rx="6" fill="#f7efe0" stroke="${C}" stroke-width="5"/><path d="M0 292 L150 336 L300 292" fill="none" stroke="${C}" stroke-width="4"/>
      <rect x="196" y="334" width="96" height="22" rx="4" fill="#c25b4e" stroke="${C}" stroke-width="3"/>${T(244, 351, "PROCESSO", 13, "#fff")}</g>`;
  }

  /* ---------- mapa do Brasil (flutuante, centro 0,0; ~ 900 x 900) ---------- */
  function mapaBrasil(o = {}) {
    const id = o.id || "brasil";
    const d = "M-132 -418 L44 -396 L88 -352 L132 -286 L220 -264 L308 -242 L418 -198 L418 -110 L330 -22 L330 88 L286 176 L198 220 L132 264 L110 330 L22 440 L-66 352 L-22 286 L0 242 L-88 132 L-88 44 L-132 0 L-242 -66 L-352 -66 L-440 -132 L-418 -220 L-352 -264 L-330 -330 L-220 -352 Z";
    let s = `<g id="${id}"><path d="${d}" transform="translate(8 12)" fill="#000" opacity="0.15"/><path d="${d}" fill="#7ac27a" stroke="${C}" stroke-width="9" stroke-linejoin="round"/>`;
    s += `<path d="M-330 -330 L-66 -132 L176 -242 M-66 -132 L-154 66 M-66 -132 L176 -22 L330 -66 M176 -22 L66 132 L220 176 M66 132 L-44 242" fill="none" stroke="#4f9a54" stroke-width="5" stroke-linejoin="round"/>`;
    s += `<path d="M-396 -220 Q-176 -242 0 -253 T110 -286" fill="none" stroke="#6fb8e8" stroke-width="9" stroke-linecap="round"/>`;
    s += `<g transform="translate(-44 35)"><circle r="16" fill="#e2544f" stroke="${C}" stroke-width="5"/>${T(0, 58, "CUIABÁ", 36, "#2E2A33")}</g>`;
    s += `<g transform="translate(134 40)"><circle r="10" fill="#2E2A33"/>${T(0, 38, "Brasília", 26, "#2E2A33")}</g><g transform="translate(163 209)"><circle r="10" fill="#2E2A33"/>${T(18, 10, "SP", 26, "#2E2A33", "start")}</g>`;
    return s + `</g>`;
  }

  /* ---------- balao de fala (centro do balao em 0,0; ponta para baixo-esquerda) ---------- */
  function balaoFala(o = {}) {
    const id = o.id || "balao", t = o.texto || "SEM FUNDAMENTO", w = Math.max(240, t.length * 26 + 70);
    return `<g id="${id}"><path d="M${-w / 2 + 40} 46 L${-w / 2 + 20} 96 L${-w / 2 + 90} 46 Z" fill="#fff" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><rect x="${-w / 2}" y="-50" width="${w}" height="100" rx="40" fill="#fff" stroke="${C}" stroke-width="6"/>
      <path d="M${-w / 2 + 40} 44 h46" stroke="#fff" stroke-width="8"/>${T(0, 14, t, 38, "#2E2A33")}</g>`;
  }

  /* ---------- alvo gigante pintado no chao (chao em 362; elipse ~ 1600 x 300) ---------- */
  function alvoChao(o = {}) {
    const id = o.id || "alvo";
    let s = `<g id="${id}">`;
    [[800, 160, "#e2544f"], [640, 128, "#fff8e6"], [480, 96, "#e2544f"], [320, 64, "#fff8e6"], [160, 32, "#e2544f"]].forEach(([rx, ry, cor]) => { s += `<ellipse cx="0" cy="300" rx="${rx}" ry="${ry}" fill="${cor}" stroke="${C}" stroke-width="7"/>`; });
    return s + `</g>`;
  }

  /* ---------- grade de envelopes (flutuante, centro 0,0): -g1 (1), -g2 (+4 = 5), -g3 (+20 = 25), cada com opacity 0 ---------- */
  function envelopesGrade(o = {}) {
    const id = o.id || "grade";
    const env = (x, y, e) => `<g transform="translate(${x} ${y}) scale(${e})">${envelopeMao({ id: id + "-e" + Math.round(x * 10 + y) })}</g>`;
    const pos = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) pos.push([(c - 2) * 230, (r - 2) * 150]);
    const centro = pos[12], anel = [7, 11, 13, 17].map(i => pos[i]), resto = pos.filter((_, i) => ![12, 7, 11, 13, 17].includes(i));
    return `<g id="${id}"><g id="${id}-g1">${env(centro[0], centro[1], 0.95)}</g><g id="${id}-g2" opacity="0">${anel.map(p => env(p[0], p[1], 0.95)).join("")}</g><g id="${id}-g3" opacity="0">${resto.map(p => env(p[0], p[1], 0.95)).join("")}</g></g>`;
  }

  /* ---------- relatorio grosso (chao em 362; ~ 420 x 200) ---------- */
  function relatorio(o = {}) {
    const id = o.id || "relat";
    let s = `<g id="${id}"><ellipse cx="210" cy="364" rx="220" ry="14" fill="#000" opacity="0.15"/>`;
    for (let k = 0; k < 14; k++) s += `<rect x="${6 + (k % 3) * 3}" y="${350 - k * 12}" width="400" height="12" fill="${k % 2 ? "#fff" : "#f2ede2"}" stroke="${C}" stroke-width="2"/>`;
    s += `<rect x="0" y="174" width="410" height="16" rx="3" fill="#2f4f6e" stroke="${C}" stroke-width="5"/><rect x="0" y="162" width="410" height="20" rx="4" fill="#3a6a9a" stroke="${C}" stroke-width="5"/>
      <rect x="110" y="126" width="190" height="34" rx="6" fill="#fff8e6" stroke="${C}" stroke-width="4"/>${T(205, 152, "RESUMO SEMANAL", 20, "#2E2A33")}
      <rect x="-14" y="190" width="20" height="160" rx="6" fill="#2b2a31" stroke="${C}" stroke-width="4"/></g>`;
    return s;
  }

  Object.assign(Cn, { tribunal, andarEscritorio });
  Object.assign(O, { envelopeMao, envelopeProcesso, mapaBrasil, balaoFala, alvoChao, envelopesGrade, relatorio });
})();

/* ===== Cenarios e objetos da parte 7 do video do trilionario (10/11/2026): ela ===== */
(function () {
  const O = window.Objetos, Cn = window.Cenarios, C = O.C;
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const T = (x, y, txt, tam, cor = "#fff8e6", anc = "middle", extra = "") => `<text x="${x}" y="${y}" text-anchor="${anc}" style="${F};font-size:${tam}px" fill="${cor}" ${extra}>${txt}</text>`;
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const camadas = (id, f, m, fr) => `<g id="${id}"><g id="${id}-fundo">${f}</g><g id="${id}-meio">${m}</g><g id="${id}-frente">${fr}</g></g>`;
  const xadrez = (id, x, y, w, h, q, c1, c2) => {  // toalha xadrez (pattern proprio por id)
    return `<defs><pattern id="${id}" x="${x}" y="${y}" width="${q * 2}" height="${q * 2}" patternUnits="userSpaceOnUse"><rect width="${q * 2}" height="${q * 2}" fill="${c2}"/><rect width="${q}" height="${q * 2}" fill="${c1}" opacity=".55"/><rect width="${q * 2}" height="${q}" fill="${c1}" opacity=".55"/></pattern></defs>`;
  };
  const vela = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="34" ry="10" fill="#c9a77a" stroke="${C}" stroke-width="4"/><rect x="-12" y="-62" width="24" height="62" rx="4" fill="#fff8e6" stroke="${C}" stroke-width="4"/><path d="M0 -62 v-8" stroke="${C}" stroke-width="3"/><path d="M0 -96 Q14 -80 0 -70 Q-14 -80 0 -96 Z" fill="#F5C542" stroke="#e8902a" stroke-width="3"/><circle cx="0" cy="-80" r="34" fill="#ffd27a" opacity=".25"/></g>`;
  const prato = (x, y, comida) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="92" ry="26" fill="#fff" stroke="${C}" stroke-width="5"/><ellipse cx="0" cy="-2" rx="62" ry="16" fill="#f2ede2" stroke="#d9d2c2" stroke-width="3"/>${comida ? `<path d="M-40 -6 Q-20 -30 10 -16 Q30 -30 44 -8 Q10 2 -40 -6 Z" fill="#e8b04a" stroke="${C}" stroke-width="3"/><circle cx="-10" cy="-14" r="7" fill="#6fae5a" stroke="${C}" stroke-width="2"/><circle cx="16" cy="-12" r="6" fill="#c25b4e" stroke="${C}" stroke-width="2"/>` : ""}</g>`;
  const taca = (x, y, cor = "#8a2433") => `<g transform="translate(${x} ${y})"><path d="M-22 -96 Q-26 -50 0 -42 Q26 -50 22 -96 Z" fill="#e8f4fa" stroke="${C}" stroke-width="4"/><path d="M-20 -70 Q-18 -48 0 -45 Q18 -48 20 -70 Z" fill="${cor}"/><path d="M0 -42 V-6" stroke="${C}" stroke-width="5"/><ellipse cx="0" cy="-4" rx="22" ry="6" fill="#e8f4fa" stroke="${C}" stroke-width="4"/></g>`;
  let nB = 0;  // busto do rig recortado num circulo (forma "c") ou retangulo (forma "r"), centro x,y, lado/diametro d
  const busto = (rig, ex, x, y, d, forma = "c") => { const k = "bu" + (nB++) + Math.round(rnd(nB + d) * 1e5); const cl = forma === "c" ? `<circle cx="${x}" cy="${y}" r="${d / 2}"/>` : `<rect x="${x - d / 2}" y="${y - d / 2}" width="${d}" height="${d}"/>`;
    return `<defs><clipPath id="${k}">${cl}</clipPath></defs><g clip-path="url(#${k})"><g transform="translate(${x} ${y + d * 0.08}) scale(${(d / 300).toFixed(3)})">${O.rostoDoRig(rig, ex)}</g></g>`; };
  const cadeiraCostas = (x, y, e = 1) => `<g transform="translate(${x} ${y}) scale(${e})"><rect x="-70" y="-190" width="140" height="190" rx="18" fill="#8a5a36" stroke="${C}" stroke-width="6"/><rect x="-50" y="-170" width="100" height="40" rx="8" fill="#a86b42" stroke="${C}" stroke-width="4"/><path d="M-40 -110 V-10 M0 -110 V-10 M40 -110 V-10" stroke="#5e3a20" stroke-width="10" stroke-linecap="round"/></g>`;

  /* ---------- RESTAURANTE (c59, c61, c67): simples e quente. Chao em ~760. o.mesa (padrao true) poe a mesa com toalha xadrez na frente;
     o.planta (padrao true) poe a planta grande a direita (o garcom se esconde atras dela no c67). ---------- */
  function restaurante(o = {}) {
    const id = o.id || "rest", mesa = o.mesa !== false, planta = o.planta !== false;
    let f = `<rect x="-300" y="-300" width="2520" height="1100" fill="#f1d9b5"/>`;
    // papel de parede com listras finas
    for (let x = -300; x < 2220; x += 60) f += `<rect x="${x}" y="-300" width="22" height="760" fill="#ecd0a6" opacity=".7"/>`;
    // lambri de madeira
    f += `<rect x="-300" y="460" width="2520" height="300" fill="#a86b42" stroke="${C}" stroke-width="6"/><rect x="-300" y="452" width="2520" height="20" fill="#8a5a36" stroke="${C}" stroke-width="5"/>`;
    for (let x = -280; x < 2220; x += 150) f += `<rect x="${x}" y="500" width="120" height="220" rx="8" fill="#96603a" stroke="#6e4426" stroke-width="5"/>`;
    // janela com a rua no fim de tarde
    f += `<g transform="translate(1180 70)"><rect x="-14" y="-14" width="508" height="368" rx="10" fill="#8a5a36" stroke="${C}" stroke-width="6"/>
      <rect x="0" y="0" width="480" height="340" fill="#f6b36b"/><rect x="0" y="0" width="480" height="140" fill="#f39a5b" opacity=".7"/><circle cx="360" cy="220" r="60" fill="#ffe08a" opacity=".85"/>
      ${[[20, 150, 90, 190], [120, 110, 80, 230], [210, 170, 110, 170], [330, 130, 70, 210], [410, 190, 70, 150]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#b26a52" stroke="${C}" stroke-width="3"/>` + Array.from({ length: 6 }, (_, k) => `<rect x="${x + 14 + (k % 2) * (w / 2 - 6)}" y="${y + 18 + Math.floor(k / 2) * 46}" width="${w / 2 - 22}" height="26" fill="#ffe7a8" opacity="${0.5 + rnd(x + k) * 0.5}"/>`).join("")).join("")}
      <path d="M240 0 V340 M0 170 H480" stroke="${C}" stroke-width="12"/><rect x="0" y="0" width="480" height="340" fill="none" stroke="${C}" stroke-width="6"/>
      <path d="M-30 -30 Q20 160 -10 360 L-70 360 Q-60 160 -60 -30 Z" fill="#c25b4e" stroke="${C}" stroke-width="5"/><path d="M510 -30 Q460 160 490 360 L550 360 Q540 160 540 -30 Z" fill="#c25b4e" stroke="${C}" stroke-width="5"/>
      <rect x="-80" y="-44" width="640" height="26" rx="8" fill="#6e4426" stroke="${C}" stroke-width="5"/>
      ${T(240, 70, "TRATTORIA", 40, "#fff8e6", "middle", 'opacity=".9" transform="scale(-1 1) translate(-480 0)"')}</g>`;
    // quadro-negro com o cardapio
    f += `<g transform="translate(250 90)"><rect x="0" y="0" width="330" height="280" rx="10" fill="#2E3A33" stroke="#8a5a36" stroke-width="16"/>
      ${T(165, 52, "CARDÁPIO", 38, "#fff8e6")}<path d="M60 70 H270" stroke="#fff8e6" stroke-width="3" stroke-dasharray="8 8"/>
      ${T(30, 112, "Massa da casa", 24, "#fff8e6", "start")}${T(300, 112, "32", 24, "#F5C542", "end")}${T(30, 156, "Risoto", 24, "#fff8e6", "start")}${T(300, 156, "38", 24, "#F5C542", "end")}
      ${T(30, 200, "Prato do dia", 24, "#fff8e6", "start")}${T(300, 200, "29", 24, "#F5C542", "end")}${T(30, 244, "Pudim", 24, "#fff8e6", "start")}${T(300, 244, "12", 24, "#F5C542", "end")}</g>`;
    // quadros e arandelas
    [[640, 140, "#6fae5a"], [830, 120, "#3f6fa8"]].forEach(([x, y, c], k) => {
      f += `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="140" height="110" rx="4" fill="#fff8e6" stroke="#8a5a36" stroke-width="12"/><path d="M10 96 L50 50 L80 80 L100 60 L130 96 Z" fill="${c}" stroke="${C}" stroke-width="3"/><circle cx="${k ? 40 : 100}" cy="34" r="12" fill="#F5C542"/></g>`;
    });
    [130, 1060, 1780].forEach(x => f += `<g transform="translate(${x} 250)"><circle r="70" fill="#ffd27a" opacity=".22"/><path d="M-6 30 V0 H6 V30" fill="#6e4426" stroke="${C}" stroke-width="3"/><path d="M-30 0 L30 0 L18 -40 L-18 -40 Z" fill="#fff1c8" stroke="${C}" stroke-width="4"/></g>`);
    // prateleira com garrafas
    f += `<g transform="translate(1720 380)"><rect x="-120" y="0" width="300" height="18" rx="4" fill="#6e4426" stroke="${C}" stroke-width="4"/>${[0, 1, 2, 3, 4].map(k => `<g transform="translate(${-90 + k * 58} 0)"><rect x="-14" y="-80" width="28" height="80" rx="6" fill="${["#3f6a3a", "#8a2433", "#c9a77a", "#3f6a3a", "#5a3424"][k]}" stroke="${C}" stroke-width="4"/><rect x="-6" y="-104" width="12" height="26" fill="${["#3f6a3a", "#8a2433", "#c9a77a", "#3f6a3a", "#5a3424"][k]}" stroke="${C}" stroke-width="3"/><rect x="-12" y="-56" width="24" height="22" fill="#fff8e6"/></g>`).join("")}</g>`;
    // luminarias pendentes
    [520, 960].forEach(x => f += `<g transform="translate(${x} -40)"><path d="M0 -300 V60" stroke="${C}" stroke-width="4"/><path d="M-60 120 Q-60 60 0 60 Q60 60 60 120 Z" fill="#2f5a3a" stroke="${C}" stroke-width="5"/><ellipse cx="0" cy="120" rx="34" ry="10" fill="#fff1c8"/><path d="M-50 124 L-140 380 L140 380 L50 124 Z" fill="#ffd27a" opacity=".12"/></g>`);
    // piso xadrez
    f += `<rect x="-300" y="760" width="2520" height="440" fill="#e8dcc0"/>`;
    for (let r = 0; r < 6; r++) for (let x = -300 + (r % 2) * 80; x < 2220; x += 160) f += `<rect x="${x}" y="${760 + r * 60}" width="80" height="60" fill="#c9b48e"/>`;
    f += `<path d="M-300 760 H2220" stroke="${C}" stroke-width="6"/>`;
    // mesas ao fundo com gente (silhuetas simples)
    let m = "";
    [[180, 0.55], [1700, 0.55]].forEach(([x, e], k) => {
      m += `<g transform="translate(${x} 760) scale(${e})"><rect x="-150" y="-40" width="300" height="20" fill="#fff" stroke="${C}" stroke-width="6"/><path d="M-150 -20 L-150 60 L150 60 L150 -20 Z" fill="url(#${id}-xd)" stroke="${C}" stroke-width="6"/>${vela(0, -40)}
        <g opacity=".85"><circle cx="-110" cy="-200" r="56" fill="${["#c98a5a", "#8a5a3b"][k]}" stroke="${C}" stroke-width="6"/><path d="M-180 -40 Q-180 -140 -110 -140 Q-40 -140 -40 -40 Z" fill="${["#3f6fa8", "#6fae5a"][k]}" stroke="${C}" stroke-width="6"/>
        <circle cx="110" cy="-200" r="56" fill="${["#f0c8a0", "#c98a5a"][k]}" stroke="${C}" stroke-width="6"/><path d="M40 -40 Q40 -140 110 -140 Q180 -140 180 -40 Z" fill="${["#e2544f", "#9fcfc6"][k]}" stroke="${C}" stroke-width="6"/></g></g>`;
    });
    let fr = xadrez(id + "-xd", 0, 0, 0, 0, 44, "#c25b4e", "#fff8e6") + `<g>`;
    if (mesa) {
      fr += `<g id="${id}-mesa"><path d="M520 820 L1400 820 L1440 1120 L480 1120 Z" fill="url(#${id}-xd)" stroke="${C}" stroke-width="7"/><path d="M520 820 L1400 820 L1408 850 L512 850 Z" fill="#fff8e6" stroke="${C}" stroke-width="5"/>
        <path d="M600 850 Q620 980 580 1120 M1320 850 Q1300 980 1340 1120" stroke="#b04a40" stroke-width="5" fill="none" opacity=".5"/>
        ${prato(760, 836, true)}${prato(1160, 836, true)}${taca(880, 838)}${taca(1040, 838, "#c9a77a")}${vela(960, 838)}
        <g transform="translate(640 832)"><rect x="-6" y="-6" width="60" height="12" rx="4" fill="#c9ccd4" stroke="${C}" stroke-width="3"/></g><g transform="translate(1260 832)"><rect x="-54" y="-6" width="60" height="12" rx="4" fill="#c9ccd4" stroke="${C}" stroke-width="3"/></g></g>`;
    }
    if (planta) fr += `<g id="${id}-planta" transform="translate(1690 1080)"><path d="M-70 0 L-90 -170 L90 -170 L70 0 Z" fill="#c9774a" stroke="${C}" stroke-width="7"/><rect x="-100" y="-196" width="200" height="34" rx="8" fill="#b0653c" stroke="${C}" stroke-width="6"/>
      ${Array.from({ length: 11 }, (_, k) => { const a = -150 + k * 30, r = 260 + rnd(k) * 140, x = Math.cos(a * Math.PI / 180) * r * 0.9, y = -190 + Math.sin(a * Math.PI / 180) * r * 0.75 - 120; return `<path d="M0 -190 Q${x * 0.4} ${y + 60} ${x} ${y} Q${x * 0.6} ${y + 70} 0 -190 Z" fill="${k % 2 ? "#4f9a4a" : "#6fbf5a"}" stroke="${C}" stroke-width="5"/><path d="M0 -190 Q${x * 0.45} ${y + 40} ${x * 0.9} ${y + 6}" fill="none" stroke="#2f6a32" stroke-width="3"/>`; }).join("")}</g>`;
    fr += `</g>`;
    return camadas(id, f, m, fr);
  }

  /* ---------- CINEMA (c60): sala escura, tela acesa, cortina vermelha, fileiras de poltronas vistas por tras (frente) ---------- */
  function cinema(o = {}) {
    const id = o.id || "cine";
    let f = `<rect x="-300" y="-300" width="2520" height="1500" fill="#2a1f2e"/>`;
    for (let x = -300; x < 2220; x += 90) f += `<rect x="${x}" y="-300" width="44" height="1100" fill="#33263a"/>`;
    // tela com o filme (por do sol e montanhas) e luz que sai dela
    f += `<path d="M560 330 L-200 1100 L2120 1100 L1360 330 Z" fill="#9fd0ea" opacity=".07"/>
      <rect x="430" y="40" width="1060" height="470" rx="8" fill="#1b1a20" stroke="${C}" stroke-width="8"/>
      <g><rect x="450" y="60" width="1020" height="430" fill="#f6b36b"/><rect x="450" y="60" width="1020" height="200" fill="#f39a5b"/><circle cx="1180" cy="260" r="90" fill="#ffe08a"/>
      <path d="M450 490 L620 300 L760 420 L920 260 L1100 440 L1260 330 L1470 490 Z" fill="#6b4a6e" stroke="${C}" stroke-width="5"/><path d="M450 490 L700 390 L900 470 L1120 400 L1470 490 Z" fill="#4a3550"/>
      <path d="M680 160 q14 -12 28 0 q14 -12 28 0" fill="none" stroke="${C}" stroke-width="4"/><path d="M820 130 q10 -9 20 0 q10 -9 20 0" fill="none" stroke="${C}" stroke-width="4"/></g>`;
    // cortinas
    f += `<path d="M330 -20 Q300 300 340 580 L470 580 Q440 300 470 -20 Z" fill="#a8323e" stroke="${C}" stroke-width="6"/><path d="M1590 -20 Q1620 300 1580 580 L1450 580 Q1480 300 1450 -20 Z" fill="#a8323e" stroke="${C}" stroke-width="6"/>
      ${[360, 400, 440, 1480, 1520, 1560].map(x => `<path d="M${x} 0 Q${x - 10} 300 ${x + 4} 570" stroke="#7e2230" stroke-width="5" fill="none"/>`).join("")}
      <rect x="300" y="-40" width="1320" height="60" rx="10" fill="#7e2230" stroke="${C}" stroke-width="6"/>`;
    // arandelas e placa de saida
    [130, 1790].forEach(x => f += `<g transform="translate(${x} 300)"><circle r="80" fill="#ffd27a" opacity=".14"/><path d="M-26 20 L26 20 L18 -30 L-18 -30 Z" fill="#ffcf7a" stroke="${C}" stroke-width="4"/></g>`);
    f += `<g transform="translate(1720 120)"><rect x="0" y="0" width="150" height="60" rx="8" fill="#2f9a4a" stroke="${C}" stroke-width="5"/>${T(75, 42, "SAÍDA", 32, "#fff")}</g>`;
    f += `<rect x="-300" y="600" width="2520" height="600" fill="#3a2a30"/><path d="M-300 600 H2220" stroke="${C}" stroke-width="6"/>`;
    // fileiras ao fundo (meio) e a da frente (frente)
    const fileira = (y, e, n, x0, cor) => Array.from({ length: n }, (_, k) => `<g transform="translate(${x0 + k * 190 * e} ${y}) scale(${e})"><path d="M-84 0 L-84 -170 Q-84 -200 -54 -200 L54 -200 Q84 -200 84 -170 L84 0 Z" fill="${cor}" stroke="${C}" stroke-width="7"/><path d="M-60 -180 L60 -180" stroke="#e86a6e" stroke-width="6" stroke-linecap="round" opacity=".6"/><rect x="-96" y="-10" width="16" height="70" rx="6" fill="#2b2a31" stroke="${C}" stroke-width="5"/></g>`).join("");
    const m = fileira(700, 0.6, 18, -60, "#9e2f3c") + fileira(830, 0.8, 14, -120, "#a8323e");
    const fr = `<g>${fileira(1150, 1.15, 10, -60, "#b8384a")}</g>`;
    return camadas(id, f, m, fr);
  }

  /* ---------- SALA DAS TELAS (c76-c78): escritorio escuro, janela com a cidade a noite, sete telas em arco.
     Telas: ids ${id}-tela-0..6 (grupo do conteudo, opacity 0 = apagada), ${id}-luz-k (brilho azul). o.acesas = quantas comecam acesas.
     o.manchete (texto), o.silhueta (indice da tela com a silhueta do amigo; -1 nenhuma). Mesa na frente (o personagem senta atras). ---------- */
  function salaTelas(o = {}) {
    const id = o.id || "telas", acesas = o.acesas ?? 7, man = o.manchete || "O TRILIONÁRIO QUE NINGUÉM CONHECIA", sil = o.silhueta ?? -1;
    let f = `<rect x="-300" y="-300" width="2520" height="1500" fill="#141a2b"/>`;
    // janela de vidro com a cidade
    f += `<rect x="-300" y="-40" width="2520" height="640" fill="#0e1424"/>`;
    for (let k = 0; k < 26; k++) { const x = -300 + k * 100 + rnd(k) * 40, w = 70 + rnd(k + 5) * 60, h = 180 + rnd(k + 9) * 330; f += `<rect x="${x}" y="${600 - h}" width="${w}" height="${h}" fill="#1c2540"/>` + Array.from({ length: Math.floor(h / 40) * 2 }, (_, j) => rnd(k * 31 + j) > 0.55 ? `<rect x="${x + 10 + (j % 2) * (w / 2 - 4)}" y="${600 - h + 14 + Math.floor(j / 2) * 40}" width="${w / 2 - 18}" height="18" fill="#ffd98a" opacity=".55"/>` : "").join(""); }
    for (let x = -300; x < 2220; x += 320) f += `<rect x="${x}" y="-40" width="18" height="640" fill="#0a0e1a"/>`;
    f += `<rect x="-300" y="-60" width="2520" height="30" fill="#0a0e1a"/><circle cx="1650" cy="90" r="40" fill="#e8eef8" opacity=".8"/>`;
    f += `<rect x="-300" y="600" width="2520" height="600" fill="#1b2238"/><path d="M-300 600 H2220" stroke="#0a0e1a" stroke-width="6"/>`;
    for (let x = -300; x < 2220; x += 120) f += `<path d="M${x} 600 L${(x - 960) * 1.8 + 960} 1200" stroke="#232b45" stroke-width="3"/>`;
    // sete telas em arco (meio)
    let m = "";
    for (let k = 0; k < 7; k++) { const u = (k - 3) / 3, x = 960 + u * 800, y = 230 + u * u * 170; m += tela(k, x, y, u * 14); }
    function tela(k, x, y, r) {
      const lit = k < acesas;
      let s = `<g transform="translate(${x} ${y}) rotate(${r}) scale(0.78)"><circle id="${id}-luz-${k}" r="230" fill="#5fb8ff" opacity="${lit ? 0.16 : 0}"/>
        <path d="M-10 120 L-30 330 M10 120 L30 330" stroke="#0a0e1a" stroke-width="12"/>
        <rect x="-160" y="-100" width="320" height="210" rx="10" fill="#0a0e1a" stroke="#3a4560" stroke-width="6"/><rect x="-148" y="-88" width="296" height="186" fill="#10182a"/>
        <g id="${id}-tela-${k}" opacity="${lit ? 1 : 0}"><rect x="-148" y="-88" width="296" height="186" fill="#cfe8ff"/><rect x="-148" y="-88" width="296" height="36" fill="#c25b4e"/>${T(-140, -62, "URGENTE", 22, "#fff", "start")}
        ${k === sil ? `<g><rect x="-140" y="-44" width="130" height="134" fill="#3a4560"/><circle cx="-75" cy="-4" r="30" fill="#0a0e1a"/><path d="M-130 90 Q-130 30 -75 30 Q-20 30 -20 90 Z" fill="#0a0e1a"/>${T(-75, 10, "?", 34, "#F5C542")}</g>` : `<g><rect x="-140" y="-44" width="130" height="134" fill="#9fb8d8"/><circle cx="-75" cy="0" r="30" fill="#F4A46A" stroke="${C}" stroke-width="3"/><path d="M-102 -14 Q-75 -46 -48 -14" fill="#26221f"/><circle cx="-86" cy="0" r="9" fill="none" stroke="${C}" stroke-width="3"/><circle cx="-64" cy="0" r="9" fill="none" stroke="${C}" stroke-width="3"/><path d="M-130 90 Q-130 36 -75 36 Q-20 36 -20 90 Z" fill="#0b3df0"/></g>`}
        <foreignObject x="0" y="-44" width="142" height="134"><div xmlns="http://www.w3.org/1999/xhtml" style="${F};font-size:19px;line-height:1.05;color:#141a2b">${man}</div></foreignObject></g></g>`;
      return s;
    }
    // mesa curva na frente, teclado, caneca e celular
    const fr = `<g id="${id}-mesa"><path d="M200 870 Q960 790 1720 870 L1760 1120 L160 1120 Z" fill="#2b2f3e" stroke="#0a0e1a" stroke-width="8"/><path d="M200 870 Q960 790 1720 870 L1726 900 Q960 822 194 900 Z" fill="#3a4058" stroke="#0a0e1a" stroke-width="6"/>
      <g transform="translate(960 860)"><rect x="-150" y="-20" width="300" height="34" rx="8" fill="#1b1f2c" stroke="#0a0e1a" stroke-width="5"/>${Array.from({ length: 12 }, (_, k) => `<rect x="${-140 + k * 24}" y="-14" width="18" height="10" rx="2" fill="#3a4560"/>`).join("")}</g>
      <g transform="translate(1350 846)"><rect x="-26" y="-50" width="52" height="56" rx="8" fill="#e8eef8" stroke="#0a0e1a" stroke-width="5"/><path d="M26 -36 Q50 -30 26 -8" fill="none" stroke="#0a0e1a" stroke-width="6"/><path d="M-10 -66 q8 -10 0 -20 M8 -66 q8 -10 0 -20" stroke="#8a9ab8" stroke-width="3" fill="none" opacity=".6"/></g>
      <g id="${id}-celular" transform="translate(620 862) rotate(-8)"><rect x="-50" y="-16" width="100" height="26" rx="8" fill="#1b1a20" stroke="#0a0e1a" stroke-width="4"/><rect x="-42" y="-12" width="84" height="16" rx="4" fill="#3a4560"/></g></g>`;
    return camadas(id, f, m, fr);
  }

  /* ================= OBJETOS (flutuantes: centro 0,0) ================= */
  function guardanapo(o = {}) {  // guardanapo com rabisco + lampadinha (id-lamp, id-brilho)
    const id = o.id || "guard";
    return `<g id="${id}"><path d="M-150 -110 L150 -120 L160 110 L-140 120 Z" fill="#fff" stroke="${C}" stroke-width="6"/><path d="M-150 -110 L-120 -80 L150 -120" fill="none" stroke="#d9d2c2" stroke-width="3"/>
      <path d="M-100 40 Q-60 -20 -20 30 T60 20 T120 -10" fill="none" stroke="#3f6fa8" stroke-width="5" stroke-linecap="round"/><path d="M-90 80 H40 M-90 -40 l30 30 l30 -40" fill="none" stroke="#3f6fa8" stroke-width="4" stroke-linecap="round"/>
      <g id="${id}-lamp" transform="translate(70 -170)" opacity="${o.lamp === false ? 0 : 1}"><circle id="${id}-brilho" r="90" fill="#ffe08a" opacity=".55"/><path d="M-40 0 A50 50 0 1 1 40 0 Q24 16 22 40 L-22 40 Q-24 16 -40 0 Z" fill="#ffe08a" stroke="${C}" stroke-width="6"/><rect x="-24" y="40" width="48" height="30" rx="6" fill="#c9ccd4" stroke="${C}" stroke-width="5"/><path d="M-10 30 L0 -8 L10 30" fill="none" stroke="#e8902a" stroke-width="4"/>
      ${[0, 45, 90, 135, 180].map(a => `<path d="M${Math.cos((a + 180) * Math.PI / 180) * 80} ${Math.sin((a + 180) * Math.PI / 180) * 80 - 10} L${Math.cos((a + 180) * Math.PI / 180) * 106} ${Math.sin((a + 180) * Math.PI / 180) * 106 - 10}" stroke="#e8902a" stroke-width="7" stroke-linecap="round"/>`).join("")}</g></g>`;
  }
  function cifraoX(o = {}) {  // moeda/cifrao com X vermelho (id-x)
    const id = o.id || "cifx";
    return `<g id="${id}"><circle r="110" fill="#F5C542" stroke="${C}" stroke-width="8"/><circle r="84" fill="none" stroke="#d99a2a" stroke-width="6"/>${T(0, 46, "$", 130, "#8a5a1a")}
      <g id="${id}-x"><path d="M-120 -120 L120 120 M120 -120 L-120 120" stroke="#fff" stroke-width="44" stroke-linecap="round"/><path d="M-120 -120 L120 120 M120 -120 L-120 120" stroke="#e2544f" stroke-width="30" stroke-linecap="round"/></g></g>`;
  }
  function pipoca(o = {}) {
    const id = o.id || "pip";
    let s = `<g id="${id}">`;
    for (let k = 0; k < 16; k++) s += `<circle cx="${-90 + rnd(k) * 180}" cy="${-150 + rnd(k + 3) * 60}" r="${26 + rnd(k + 7) * 10}" fill="${k % 4 ? "#fff8e6" : "#ffe7a8"}" stroke="${C}" stroke-width="5"/>`;
    s += `<path d="M-120 -120 L120 -120 L90 150 L-90 150 Z" fill="#fff" stroke="${C}" stroke-width="7"/>${[-80, -30, 20, 70].map(x => `<path d="M${x} -120 L${x + 20} -120 L${x * 0.75 + 15} 150 L${x * 0.75} 150 Z" fill="#e2544f"/>`).join("")}<path d="M-120 -120 L120 -120 L90 150 L-90 150 Z" fill="none" stroke="${C}" stroke-width="7"/>
      <rect x="-70" y="-30" width="140" height="56" rx="10" fill="#F5C542" stroke="${C}" stroke-width="5"/>${T(0, 10, "POP", 32, "#c25b4e")}</g>`;
    return s;
  }
  function sorvete(o = {}) {
    const id = o.id || "sorv";
    return `<g id="${id}"><path d="M-70 -20 L0 200 L70 -20 Z" fill="#e8b04a" stroke="${C}" stroke-width="7"/><path d="M-50 20 L40 60 M-40 60 L30 100 M50 20 L-30 70 M40 60 L-20 120" stroke="#c98a2a" stroke-width="5"/>
      <circle cx="0" cy="-60" r="70" fill="#f6c6d4" stroke="${C}" stroke-width="7"/><circle cx="0" cy="-150" r="60" fill="#8a5a3b" stroke="${C}" stroke-width="7"/><path d="M-40 -110 q20 20 40 0 q20 20 40 0" fill="none" stroke="${C}" stroke-width="4"/>
      <circle cx="10" cy="-214" r="18" fill="#e2544f" stroke="${C}" stroke-width="5"/><path d="M14 -230 q10 -20 24 -20" fill="none" stroke="#3f6a3a" stroke-width="4"/>${[[-30, -80], [20, -50], [-10, -170], [30, -150]].map(([x, y], k) => `<rect x="${x}" y="${y}" width="14" height="5" rx="2" fill="${["#3f6fa8", "#6fae5a", "#F5C542", "#fff"][k]}" transform="rotate(${k * 40} ${x} ${y})"/>`).join("")}</g>`;
  }
  function coracao(o = {}) {
    const id = o.id || "cor", c = o.cor || "#e2544f";
    return `<g id="${id}"><path d="M0 90 C-160 -10 -120 -150 -40 -130 Q-10 -122 0 -90 Q10 -122 40 -130 C120 -150 160 -10 0 90 Z" fill="${c}" stroke="${C}" stroke-width="8"/><path d="M-80 -90 Q-60 -110 -36 -100" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/></g>`;
  }
  function barraBusca(o = {}) {  // barra de busca generica; texto em id-texto (cada letra id-texto-k para digitar), cursor id-cursor
    const id = o.id || "busca", txt = o.texto || "trilionário";
    return `<g id="${id}"><rect x="-460" y="-60" width="920" height="120" rx="60" fill="#fff" stroke="${C}" stroke-width="7"/><rect x="-452" y="34" width="904" height="18" rx="9" fill="#000" opacity=".06"/>
      <g transform="translate(-390 0)"><circle cx="-6" cy="-6" r="24" fill="none" stroke="#7a7f8c" stroke-width="7"/><path d="M12 12 L30 30" stroke="#7a7f8c" stroke-width="8" stroke-linecap="round"/></g>
      <defs><clipPath id="${id}-cl"><rect id="${id}-revela" x="-340" y="-50" width="${o.revela ?? 640}" height="100"/></clipPath></defs>
      <g clip-path="url(#${id}-cl)"><text id="${id}-texto" x="-330" y="16" style="${F};font-size:48px" fill="#2E2A33">${txt}</text></g>
      <rect id="${id}-cursor" x="${-330 + txt.length * 21 + 8}" y="-28" width="5" height="54" fill="#3f6fa8"/>
      <g transform="translate(380 0)"><rect x="-56" y="-40" width="112" height="80" rx="40" fill="#3f6fa8" stroke="${C}" stroke-width="5"/>${T(0, 12, "Buscar", 26, "#fff")}</g></g>`;
  }
  function interrogacao(o = {}) {
    const id = o.id || "inter", c = o.cor || "#F5C542";
    return `<g id="${id}"><path d="M-80 -90 Q-80 -200 0 -200 Q90 -200 90 -110 Q90 -50 30 -20 Q10 -6 10 40 L-30 40 Q-34 -20 0 -50 Q40 -80 40 -110 Q40 -150 0 -150 Q-34 -150 -34 -90 Z" fill="${c}" stroke="${C}" stroke-width="9" stroke-linejoin="round"/><circle cx="-10" cy="100" r="34" fill="${c}" stroke="${C}" stroke-width="9"/><path d="M-50 -140 Q-30 -180 10 -180" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".6"/></g>`;
  }
  function postFofoca(o = {}) {  // post de perfil de fofoca generico; manchete em id-manchete (linha por linha id-manchete-k)
    const id = o.id || "post", lin = o.linhas || ["O ROMANCE SECRETO", "DO TRILIONÁRIO"];
    return `<g id="${id}"><rect x="-330" y="-430" width="660" height="860" rx="36" fill="#fff" stroke="${C}" stroke-width="8"/>
      <g transform="translate(-270 -368)"><circle r="34" fill="#e2544f" stroke="${C}" stroke-width="5"/>${T(0, 14, "!", 40, "#fff")}${T(50, -4, "@fofoca.total", 30, "#2E2A33", "start")}${T(50, 26, "Patrocinado · agora", 20, "#9a9aa2", "start")}<circle cx="560" cy="0" r="6" fill="#2E2A33"/><circle cx="580" cy="0" r="6" fill="#2E2A33"/><circle cx="540" cy="0" r="6" fill="#2E2A33"/></g>
      <rect x="-330" y="-310" width="660" height="420" fill="#2b2a31"/><rect x="-330" y="-310" width="660" height="420" fill="#f39a5b" opacity=".35"/>
      ${busto("principal_svg", "feliz", -110, -140, 230)}${busto("ela_svg", "feliz", 120, -140, 230)}
      <circle cx="-110" cy="-140" r="120" fill="none" stroke="#e2544f" stroke-width="10"/><circle cx="120" cy="-140" r="120" fill="none" stroke="#e2544f" stroke-width="10"/>
      <rect x="-330" y="-310" width="660" height="420" fill="url(#${id}-gr)" opacity=".35"/><defs><pattern id="${id}-gr" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#fff" opacity=".4"/></pattern></defs>
      <g id="${id}-manchete">${lin.map((l, k) => `<g id="${id}-manchete-${k}"><rect x="-300" y="${140 + k * 74}" width="600" height="64" rx="8" fill="${k ? "#2E2A33" : "#e2544f"}"/>${T(0, 186 + k * 74, l, 40, "#fff")}</g>`).join("")}</g>
      <g transform="translate(-280 340)"><path d="M0 0 C-14 -14 -14 -30 0 -28 C14 -30 14 -14 0 0 Z" transform="scale(1.6)" fill="#e2544f" stroke="${C}" stroke-width="3"/>${T(34, 10, "48 mil", 26, "#2E2A33", "start")}<path d="M180 -14 h40 v28 h-26 l-14 12 Z" fill="none" stroke="${C}" stroke-width="5"/>${T(236, 10, "9.312", 26, "#2E2A33", "start")}</g></g>`;
  }
  function polaroide(o = {}) {  // foto com moldura branca. o.cena: restaurante|portao|bicicleta|festa. Circulo vermelho em id-circulo. o.cinza
    const id = o.id || "pol" + Math.round(rnd(o.k || 2) * 1e6), cena = o.cena || "restaurante";
    const rosto = (rig, ex, x, y, e) => `<g transform="translate(${x} ${y + 40}) scale(${e})">${O.rostoDoRig(rig, ex)}</g>`;
    let img = "";
    if (cena === "restaurante") img = `<rect x="-250" y="-250" width="500" height="380" fill="#f1d9b5"/><rect x="-250" y="-250" width="500" height="120" fill="#e8c89a"/><circle cx="-160" cy="-200" r="40" fill="#ffd27a" opacity=".5"/>${rosto("principal_svg", "feliz", -105, -70, 0.62)}${rosto("ela_svg", "feliz", 110, -70, 0.62)}
      <path d="M-210 50 H210 L230 130 H-230 Z" fill="#c25b4e" stroke="${C}" stroke-width="5"/><path d="M-170 50 v80 M-90 50 v80 M-10 50 v80 M70 50 v80 M150 50 v80" stroke="#fff8e6" stroke-width="12" opacity=".6"/>`;
    if (cena === "portao") img = `<rect x="-250" y="-250" width="500" height="380" fill="#2b3550"/><rect x="-250" y="40" width="500" height="90" fill="#4a4d57"/>${Array.from({ length: 9 }, (_, k) => `<rect x="${-230 + k * 54}" y="-200" width="14" height="250" fill="#1b1a20"/>`).join("")}<rect x="-240" y="-210" width="480" height="20" fill="#1b1a20"/>
      <rect x="-60" y="-200" width="120" height="250" fill="#ffd27a" opacity=".4"/>${rosto("ela_svg", "neutro", 0, -60, 0.6)}`;
    if (cena === "bicicleta") img = `<rect x="-250" y="-250" width="500" height="380" fill="#9fd8f0"/><circle cx="160" cy="-170" r="46" fill="#ffe08a"/><rect x="-250" y="40" width="500" height="90" fill="#8fd06a"/><g transform="translate(-20 30) scale(1.15)">${Cn.bicicleta(0, 0)}</g>${rosto("ela_svg", "feliz", -150, -110, 0.42)}`;
    if (cena === "festa") img = `<rect x="-250" y="-250" width="500" height="380" fill="#3a2a4e"/>${Array.from({ length: 30 }, (_, k) => `<rect x="${-240 + rnd(k) * 480}" y="${-240 + rnd(k + 40) * 360}" width="12" height="6" fill="${["#F5C542", "#e2544f", "#6fae5a", "#5fb8ff"][k % 4]}" transform="rotate(${k * 37} ${-240 + rnd(k) * 480} ${-240 + rnd(k + 40) * 360})"/>`).join("")}
      <path d="M-200 -250 Q-100 -160 0 -250 Q100 -160 200 -250" fill="none" stroke="#F5C542" stroke-width="5"/><g id="${id}-careta">${rosto("principal_svg", "feliz", 0, -70, 0.8)}</g>`;
    const filtro = o.cinza ? `filter="url(#${id}-pb)"` : "";
    return `<g id="${id}"><defs><filter id="${id}-pb"><feColorMatrix type="saturate" values="0.05"/></filter><clipPath id="${id}-cl"><rect x="-250" y="-250" width="500" height="380"/></clipPath></defs>
      <rect x="-290" y="-290" width="580" height="560" rx="10" fill="#fff" stroke="${C}" stroke-width="7"/><rect x="-282" y="258" width="564" height="14" fill="#000" opacity=".05"/>
      <g clip-path="url(#${id}-cl)" ${filtro}><g id="${id}-img">${img}</g><rect x="-250" y="-250" width="500" height="380" fill="url(#${id}-gr)" opacity=".25"/></g><defs><pattern id="${id}-gr" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#fff"/></pattern></defs>
      <rect x="-250" y="-250" width="500" height="380" fill="none" stroke="${C}" stroke-width="4"/>${o.legenda ? T(0, 220, o.legenda, 36, "#2E2A33") : ""}
      <ellipse id="${id}-circulo" cx="${o.cx ?? 0}" cy="${o.cy ?? -60}" rx="${o.rx ?? 220}" ry="${o.ry ?? 150}" fill="none" stroke="#e2544f" stroke-width="12" opacity="${o.circulo ? 1 : 0}" transform="rotate(-6 0 -60)"/></g>`;
  }
  function cartaoInfo(o = {}) {  // cartao de dado exposto: icone rosto|trabalho|predio + texto
    const id = o.id || "card" + (o.icone || "x"), ic = o.icone || "rosto";
    const icone = {
      rosto: busto("ela_svg", "neutro", 0, 0, 140, "c"),
      trabalho: `<rect x="-60" y="-34" width="120" height="84" rx="10" fill="#8a5a36" stroke="${C}" stroke-width="5"/><path d="M-26 -34 V-52 H26 V-34" fill="none" stroke="${C}" stroke-width="6"/><path d="M-60 2 H60" stroke="${C}" stroke-width="4"/><rect x="-10" y="-6" width="20" height="16" fill="#F5C542" stroke="${C}" stroke-width="3"/>`,
      predio: `<rect x="-50" y="-70" width="100" height="130" fill="#9fb8d8" stroke="${C}" stroke-width="5"/>${Array.from({ length: 8 }, (_, k) => `<rect x="${-36 + (k % 2) * 40}" y="${-58 + Math.floor(k / 2) * 28}" width="32" height="18" fill="#ffe7a8" stroke="${C}" stroke-width="2"/>`).join("")}<circle cx="70" cy="-60" r="26" fill="#e2544f" stroke="${C}" stroke-width="4"/><circle cx="70" cy="-64" r="9" fill="#fff"/><path d="M58 -46 L70 -24 L82 -46" fill="#e2544f"/>`,
    }[ic];
    const txt = o.texto || { rosto: "ROSTO", trabalho: "TRABALHO", predio: "ONDE MORA" }[ic];
    return `<g id="${id}"><rect x="-150" y="-130" width="300" height="260" rx="22" fill="#fff" stroke="${C}" stroke-width="7"/><rect x="-150" y="70" width="300" height="60" rx="0" fill="#e2544f"/><path d="M-150 70 H150" stroke="${C}" stroke-width="5"/><rect x="-150" y="-130" width="300" height="260" rx="22" fill="none" stroke="${C}" stroke-width="7"/>
      <g transform="translate(0 -20)">${icone}</g>${T(0, 112, txt, 32, "#fff")}<circle cx="120" cy="-100" r="18" fill="#F5C542" stroke="${C}" stroke-width="4"/></g>`;
  }
  function notificacao(o = {}) {  // banner de mensagem: o.titulo, o.texto, o.vermelha (fundo id-fundo; a parte vermelha em id-alerta)
    const id = o.id || "notif" + Math.round(rnd(o.k || 3) * 1e6);
    return `<g id="${id}"><rect x="-300" y="-70" width="600" height="140" rx="28" fill="#fff" stroke="${C}" stroke-width="6"/><rect id="${id}-alerta" x="-300" y="-70" width="600" height="140" rx="28" fill="#ffd9d6" stroke="#e2544f" stroke-width="6" opacity="${o.vermelha ? 1 : 0}"/>
      <rect x="-276" y="-46" width="92" height="92" rx="22" fill="#6fae5a" stroke="${C}" stroke-width="4"/><path d="M-252 -18 h44 v30 h-28 l-16 12 Z" fill="#fff"/>
      ${T(-166, -12, o.titulo || "Desconhecido", 32, "#2E2A33", "start")}${T(-166, 30, o.texto || "vi você no jornal...", 26, o.vermelha ? "#c0392b" : "#5a5f6a", "start")}${T(280, -20, "agora", 20, "#9a9aa2", "end")}</g>`;
  }
  function borracha(o = {}) {
    const id = o.id || "borr";
    return `<g id="${id}" transform="rotate(-24)"><rect x="-160" y="-70" width="320" height="140" rx="22" fill="#f6a6b8" stroke="${C}" stroke-width="8"/><rect x="40" y="-70" width="120" height="140" rx="22" fill="#5fb8ff" stroke="${C}" stroke-width="8"/><path d="M40 -70 V70" stroke="${C}" stroke-width="6"/><path d="M-130 -40 H10" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".6"/>${T(-60, 18, "APAGA", 34, "#c25b7a")}</g>`;
  }
  function cadeiraRestaurante(o = {}) {  // cadeira vazia de chao (chao em 362), vista de frente/lado
    const id = o.id || "cad";
    return `<g id="${id}"><ellipse cx="0" cy="364" rx="130" ry="16" fill="#000" opacity=".15"/>
      <path d="M-84 -170 V180 M84 -170 V180" stroke="${C}" stroke-width="30" stroke-linecap="round"/><path d="M-84 -170 V180 M84 -170 V180" stroke="#8a5a36" stroke-width="18" stroke-linecap="round"/>
      <rect x="-100" y="-200" width="200" height="90" rx="20" fill="#a86b42" stroke="${C}" stroke-width="7"/><path d="M-60 -170 H60" stroke="#c98a5a" stroke-width="8" stroke-linecap="round"/><path d="M-84 -100 H84 M-84 -40 H84" stroke="#6e4426" stroke-width="10"/>
      <rect x="-112" y="150" width="224" height="44" rx="12" fill="#a86b42" stroke="${C}" stroke-width="7"/><rect x="-104" y="118" width="208" height="40" rx="14" fill="#c25b4e" stroke="${C}" stroke-width="6"/><path d="M-70 120 v36 M-24 120 v36 M24 120 v36 M70 120 v36" stroke="#fff8e6" stroke-width="10" opacity=".6"/>
      <path d="M-92 194 L-100 362 M92 194 L100 362" stroke="${C}" stroke-width="26" stroke-linecap="round"/><path d="M-92 194 L-100 360 M92 194 L100 360" stroke="#8a5a36" stroke-width="14" stroke-linecap="round"/><path d="M-96 290 H96" stroke="#6e4426" stroke-width="10"/></g>`;
  }
  function aviaoPapel(o = {}) {
    const id = o.id || "avp";
    return `<g id="${id}"><path d="M-160 20 L170 -60 L-60 80 Z" fill="#fff" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M170 -60 L-60 80 L-40 30 Z" fill="#e8e9ee" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><path d="M-60 80 L-30 120 L-40 30" fill="#d9dbe2" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      ${T(-30, 18, "NOTA OFICIAL", 22, "#2E2A33", "middle", 'transform="rotate(-14 -30 18)"')}</g>`;
  }
  function botaoMesa(o = {}) {  // botao vermelho em pedestal (chao em 362); id-tampa desce no aperto
    const id = o.id || "botao";
    return `<g id="${id}"><ellipse cx="0" cy="364" rx="110" ry="16" fill="#000" opacity=".15"/><path d="M-70 362 L-50 120 L50 120 L70 362 Z" fill="#4a4d57" stroke="${C}" stroke-width="7"/><rect x="-90" y="100" width="180" height="40" rx="12" fill="#5a5f6a" stroke="${C}" stroke-width="7"/>
      <g id="${id}-tampa"><ellipse cx="0" cy="100" rx="70" ry="22" fill="#a8323e" stroke="${C}" stroke-width="6"/><path d="M-70 100 V70 A70 22 0 0 1 70 70 V100" fill="#e2544f" stroke="${C}" stroke-width="6"/><ellipse cx="0" cy="70" rx="70" ry="22" fill="#ef6b5f" stroke="${C}" stroke-width="6"/><ellipse cx="-24" cy="64" rx="20" ry="6" fill="#fff" opacity=".6"/></g>
      ${T(0, 250, "ENVIAR", 30, "#fff8e6")}</g>`;
  }
  function conversa(o = {}) {  // tela de conversa no celular. o.msgs [{t, lado:"d"|"e"}], o.nome, o.visto. ids: id-msg-k, id-tique (cinza), id-tiqueAzul, id-digitando, id-apagada
    const id = o.id || "conv", msgs = o.msgs || [{ t: "me desculpa. de verdade.", lado: "d" }];
    let y = -260, bal = "";
    msgs.forEach((m, k) => {
      const w = Math.max(220, m.t.length * 19 + 60), x = m.lado === "d" ? 250 - w : -250, cor = m.lado === "d" ? "#d6f5c8" : "#fff";
      bal += `<g id="${id}-msg-${k}"><rect x="${x}" y="${y}" width="${w}" height="84" rx="22" fill="${cor}" stroke="${C}" stroke-width="5"/>${T(x + 28, y + 52, m.t, 32, "#2E2A33", "start")}
        ${m.lado === "d" ? `<g transform="translate(${x + w - 52} ${y + 70})"><g id="${id}-tique"><path d="M0 -6 l8 8 l14 -16 M12 -6 l8 8 l14 -16" fill="none" stroke="#9a9aa2" stroke-width="4" stroke-linecap="round"/></g><g id="${id}-tiqueAzul" opacity="${o.visto ? 1 : 0}"><path d="M0 -6 l8 8 l14 -16 M12 -6 l8 8 l14 -16" fill="none" stroke="#3f9ae8" stroke-width="5" stroke-linecap="round"/></g></g>` : ""}</g>`;
      y += 110;
    });
    const avatar = busto(o.rig || "ela_svg", "neutro", -196, -410, 92);
    return `<g id="${id}"><rect x="-320" y="-560" width="640" height="1120" rx="70" fill="#1b1a20" stroke="${C}" stroke-width="8"/><rect x="-292" y="-530" width="584" height="1060" rx="48" fill="#ece5dd"/>
      <rect x="-292" y="-530" width="584" height="190" rx="48" fill="#2f6a5a"/><rect x="-292" y="-400" width="584" height="60" fill="#2f6a5a"/><rect x="-60" y="-520" width="120" height="26" rx="13" fill="#1b1a20"/>
      <circle cx="-196" cy="-410" r="48" fill="#fff" stroke="${C}" stroke-width="4"/>${avatar}${T(-128, -404, o.nome || "Ela", 38, "#fff", "start")}${T(-128, -366, o.status || "online", 22, "#cfe8dd", "start")}
      <path d="M-262 -410 l-14 -14 M-262 -410 l-14 14" stroke="#fff" stroke-width="0"/>${bal}
      <g id="${id}-digitando" opacity="0"><rect x="-250" y="${y}" width="250" height="76" rx="22" fill="#fff" stroke="${C}" stroke-width="5"/>${T(-222, y + 48, "digitando", 28, "#3f9a7a", "start")}${[0, 1, 2].map(k => `<circle cx="${-60 + k * 18}" cy="${y + 40}" r="6" fill="#3f9a7a"/>`).join("")}</g>
      <rect x="-292" y="430" width="584" height="100" rx="0" fill="#f7f4ef"/><rect x="-270" y="448" width="460" height="64" rx="32" fill="#fff" stroke="#d9d2c2" stroke-width="3"/><circle cx="240" cy="480" r="34" fill="#2f9a7a"/>
      <rect id="${id}-apagada" x="-292" y="-530" width="584" height="1060" rx="48" fill="#0a0a0e" opacity="0"/></g>`;
  }
  function rachadura(o = {}) {  // rachadura na parede: id-r1 (inicio), id-r2 (abre), id-agua (fio d'agua que escorre; scaleY 0->1 a partir do topo)
    const id = o.id || "rach";
    return `<g id="${id}"><g id="${id}-r1"><path d="M0 -300 L-20 -220 L14 -160 L-24 -80 L10 -10 L-14 60" fill="none" stroke="${C}" stroke-width="10" stroke-linejoin="round"/><path d="M14 -160 L60 -130 M-24 -80 L-70 -60" fill="none" stroke="${C}" stroke-width="6"/></g>
      <g id="${id}-r2"><path d="M0 -300 L-20 -220 L14 -160 L-24 -80 L10 -10 L-14 60 L-30 120 Q-8 116 6 64 L30 -6 L-4 -78 L36 -158 L6 -222 Z" fill="#3a2a22" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M60 -130 L110 -150 M-70 -60 L-120 -70 L-150 -40 M10 -10 L60 20" fill="none" stroke="${C}" stroke-width="6"/></g>
      <g id="${id}-agua"><path d="M-14 60 Q-22 140 -18 260 Q-16 300 -10 320" fill="none" stroke="#5fb8ff" stroke-width="12" stroke-linecap="round"/><path d="M-10 320 Q-28 350 -10 362 Q8 350 -10 320 Z" fill="#5fb8ff" stroke="#2f7ac0" stroke-width="3"/><ellipse cx="-12" cy="372" rx="60" ry="12" fill="#5fb8ff" opacity=".5"/></g></g>`;
  }
  function tesoura(o = {}) {  // lamina de cima id-l1, de baixo id-l2 (giram em volta do pino 0,0)
    const id = o.id || "tes";  // o.virar: laminas para a esquerda (sem o espelho do motor, que inverte o "mover")
    return `<g id="${id}"><g transform="scale(${o.virar ? -1 : 1} 1)"><g id="${id}-l2"><path d="M0 0 L240 30 Q250 40 236 46 L0 18 Z" fill="#e8eef8" stroke="${C}" stroke-width="6"/><ellipse cx="-80" cy="40" rx="56" ry="38" fill="none" stroke="#e2544f" stroke-width="22"/><ellipse cx="-80" cy="40" rx="56" ry="38" fill="none" stroke="${C}" stroke-width="4"/><path d="M-30 30 L0 14" stroke="#e2544f" stroke-width="22"/></g>
      <g id="${id}-l1"><path d="M0 0 L240 -30 Q250 -40 236 -46 L0 -18 Z" fill="#f7fbff" stroke="${C}" stroke-width="6"/><ellipse cx="-80" cy="-40" rx="56" ry="38" fill="none" stroke="#e2544f" stroke-width="22"/><ellipse cx="-80" cy="-40" rx="56" ry="38" fill="none" stroke="${C}" stroke-width="4"/><path d="M-30 -30 L0 -14" stroke="#e2544f" stroke-width="22"/></g>
      <circle r="12" fill="#c9ccd4" stroke="${C}" stroke-width="5"/></g></g>`;
  }
  function telinha(o = {}) {  // telinha (TV/celular) com a manchete; o.manchete; brilho id-brilho
    const id = o.id || "tel" + Math.round(rnd(o.k || 4) * 1e6), man = o.manchete || "PIADA DE 2011!!!";
    return `<g id="${id}"><circle id="${id}-brilho" r="190" fill="#5fb8ff" opacity=".14"/><rect x="-170" y="-110" width="340" height="220" rx="16" fill="#1b1a20" stroke="${C}" stroke-width="7"/><rect x="-154" y="-94" width="308" height="170" fill="#e8f0fa"/><rect x="-154" y="-94" width="308" height="40" fill="#c25b4e"/>${T(-144, -66, "URGENTE", 24, "#fff", "start")}
      <rect x="-144" y="-46" width="110" height="112" fill="#3a2a4e"/>${busto("principal_svg", "feliz", -89, 10, 108, "r")}
      <foreignObject x="-26" y="-48" width="172" height="120"><div xmlns="http://www.w3.org/1999/xhtml" style="${F};font-size:22px;line-height:1.05;color:#141a2b">${man}</div></foreignObject><rect x="-30" y="110" width="60" height="30" fill="#2b2a31" stroke="${C}" stroke-width="5"/></g>`;
  }
  function balaoRabisco(o = {}) {  // balao de fala com rabisco (opiniao de desconhecido)
    const id = o.id || "bal" + Math.round(rnd(o.k || 5) * 1e6), cor = o.cor || "#fff";
    return `<g id="${id}"><path d="M-120 -70 Q-120 -100 -90 -100 L90 -100 Q120 -100 120 -70 L120 30 Q120 60 90 60 L-10 60 L-50 100 L-40 60 L-90 60 Q-120 60 -120 30 Z" fill="${cor}" stroke="${C}" stroke-width="7"/>
      <path d="M-84 -50 Q-60 -80 -40 -50 T0 -50 T40 -50 T80 -54 M-84 0 Q-50 -26 -20 4 T40 -2 T84 0" fill="none" stroke="#e2544f" stroke-width="7" stroke-linecap="round"/>${T(70, 46, "!", 34, "#e2544f")}</g>`;
  }
  function ondaCor(o = {}) {  // circulo de cor que se espalha (c58): escala 0 -> 1 a partir do centro; cobre 2000 px
    const id = o.id || "onda";
    return `<g id="${id}"><circle r="1100" fill="${o.cor || "#ffb36b"}" opacity="${o.opacity ?? 0.22}"/><circle r="1100" fill="none" stroke="#fff1c8" stroke-width="40" opacity=".5"/></g>`;
  }

  Object.assign(Cn, { restaurante, cinema, salaTelas });
  Object.assign(O, { guardanapo, cifraoX, pipoca, sorvete, coracao, barraBusca, interrogacao, postFofoca, polaroide, cartaoInfo, notificacao, borracha, cadeiraRestaurante, aviaoPapel, botaoMesa, conversa, rachadura, tesoura, telinha, balaoRabisco, ondaCor });
})();

/* ===== Cenarios e objetos da parte 8 do video do trilionario (10/11/2026): a familia ===== */
(function () {
  const O = window.Objetos, Cn = window.Cenarios, C = O.C;
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const T = (x, y, txt, tam, cor = "#fff8e6", anc = "middle", extra = "") => `<text x="${x}" y="${y}" text-anchor="${anc}" style="${F};font-size:${tam}px" fill="${cor}" ${extra}>${txt}</text>`;
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const camadas = (id, f, m, fr) => `<g id="${id}"><g id="${id}-fundo">${f}</g><g id="${id}-meio">${m}</g><g id="${id}-frente">${fr}</g></g>`;
  let nB = 0;
  const busto = (rig, ex, x, y, d, forma = "c") => { const k = "b8u" + (nB++) + Math.round(rnd(nB + d) * 1e5); const cl = forma === "c" ? `<circle cx="${x}" cy="${y}" r="${d / 2}"/>` : `<rect x="${x - d / 2}" y="${y - d / 2}" width="${d}" height="${d}"/>`;
    return `<defs><clipPath id="${k}">${cl}</clipPath></defs><g clip-path="url(#${k})"><g transform="translate(${x} ${y + d * 0.08}) scale(${(d / 300).toFixed(3)})">${O.rostoDoRig(rig, ex)}</g></g>`; };
  const folha = (x, y, r, a, cor = "#5aa64a") => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.45}" transform="rotate(${a} ${x} ${y})" fill="${cor}" stroke="${C}" stroke-width="3"/>`;
  const acerola = (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="#e2443c" stroke="${C}" stroke-width="3"/><circle cx="${x - 3}" cy="${y - 4}" r="3" fill="#fff" opacity=".6"/>`;
  const porta = (x, y, w, h, cor) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${cor}" stroke="${C}" stroke-width="6"/><rect x="${x + 14}" y="${y + 16}" width="${w - 28}" height="${h * 0.4}" rx="4" fill="none" stroke="${C}" stroke-width="3" opacity=".5"/><rect x="${x + 14}" y="${y + h * 0.5}" width="${w - 28}" height="${h * 0.42}" rx="4" fill="none" stroke="${C}" stroke-width="3" opacity=".5"/><circle cx="${x + w - 22}" cy="${y + h * 0.52}" r="8" fill="#F5C542" stroke="${C}" stroke-width="3"/>`;
  const janela = (x, y, w, h, cortina = "#f6c6d4") => `<rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${h + 20}" rx="6" fill="#f7f4ef" stroke="${C}" stroke-width="5"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#bfe3f0" stroke="${C}" stroke-width="4"/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="${C}" stroke-width="5"/>
    <path d="M${x - 6} ${y - 6} Q${x + w * 0.22} ${y + h * 0.5} ${x + 8} ${y + h + 6} L${x - 6} ${y + h + 6} Z" fill="${cortina}" stroke="${C}" stroke-width="3"/><path d="M${x + w + 6} ${y - 6} Q${x + w * 0.78} ${y + h * 0.5} ${x + w - 8} ${y + h + 6} L${x + w + 6} ${y + h + 6} Z" fill="${cortina}" stroke="${C}" stroke-width="3"/><rect x="${x - 16}" y="${y + h + 8}" width="${w + 32}" height="14" rx="4" fill="#e6dccb" stroke="${C}" stroke-width="4"/>`;

  /* ---------- QUINTAL DA MAE (c79): muro baixo, casa com janela, varal, horta, pe de acerola (folhas id-copa). Chao em ~800. ---------- */
  function quintalMae(o = {}) {
    const id = o.id || "quint";
    let f = `<rect x="-300" y="-300" width="2520" height="1100" fill="#9fd8f0"/><circle cx="1650" cy="120" r="70" fill="#ffe08a" opacity=".9"/>`;
    [[220, 120, 1], [900, 70, 0.8], [1350, 160, 0.7]].forEach(([x, y, s]) => f += `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 40 Q0 10 30 12 Q40 -14 72 0 Q96 -10 110 14 Q140 14 138 40 Z" fill="#fff" stroke="${C}" stroke-width="4"/></g>`);
    // casa da mae ao fundo
    f += `<g><rect x="-60" y="250" width="780" height="520" fill="#f2d9a8" stroke="${C}" stroke-width="6"/><path d="M-100 260 L330 60 L760 260 Z" fill="#c9774a" stroke="${C}" stroke-width="6"/>${Array.from({ length: 7 }, (_, k) => `<path d="M${-60 + k * 55} ${240 - k * 26} L${720 - k * 55} ${240 - k * 26}" stroke="#a85f38" stroke-width="3" opacity=".6"/>`).join("")}
      ${porta(420, 470, 170, 300, "#3f8a8a")}${janela(80, 360, 220, 170)}<rect x="420" y="770" width="170" height="20" fill="#d8c6a8" stroke="${C}" stroke-width="4"/>
      <g transform="translate(120 600)"><path d="M-40 0 L-30 70 L30 70 L40 0 Z" fill="#c9774a" stroke="${C}" stroke-width="5"/>${[0, 1, 2, 3, 4].map(k => `<path d="M0 0 Q${-50 + k * 25} -60 ${-40 + k * 20} -90" stroke="#3f8a3a" stroke-width="6" fill="none"/>`).join("")}<circle cx="-30" cy="-80" r="12" fill="#e2544f" stroke="${C}" stroke-width="3"/><circle cx="20" cy="-90" r="12" fill="#F5C542" stroke="${C}" stroke-width="3"/></g></g>`;
    // muro baixo com chapisco
    f += `<rect x="720" y="560" width="1600" height="230" fill="#e9dcc4" stroke="${C}" stroke-width="6"/>${Array.from({ length: 60 }, (_, k) => `<circle cx="${740 + rnd(k) * 1560}" cy="${580 + rnd(k + 9) * 190}" r="3" fill="#cdbd9e"/>`).join("")}<rect x="710" y="545" width="1620" height="24" rx="4" fill="#d6c6a6" stroke="${C}" stroke-width="5"/>`;
    // varal
    f += `<path d="M760 330 V560 M1180 330 V560" stroke="#8a5a36" stroke-width="12"/><path d="M760 345 Q970 380 1180 345" stroke="${C}" stroke-width="3" fill="none"/>
      ${[[820, "#3f6fa8", 70, 90], [920, "#f6c6d4", 80, 70], [1040, "#F5C542", 60, 100]].map(([x, c, w, h]) => `<rect x="${x}" y="${360 + (x - 970) * (x - 970) / 4000 * -0}" width="${w}" height="${h}" rx="6" fill="${c}" stroke="${C}" stroke-width="4"/><path d="M${x + 10} 356 v10 M${x + w - 10} 356 v10" stroke="#e2544f" stroke-width="5"/>`).join("")}`;
    // chao: terra batida e grama
    f += `<rect x="-300" y="780" width="2520" height="420" fill="#d9b98a"/><path d="M-300 780 H2220" stroke="${C}" stroke-width="5"/>${Array.from({ length: 40 }, (_, k) => `<path d="M${-280 + k * 62} ${800 + rnd(k) * 260} q8 -16 16 0" stroke="#7aa84a" stroke-width="4" fill="none"/>`).join("")}`;
    // horta
    f += `<g transform="translate(260 880)"><rect x="-200" y="-20" width="400" height="60" rx="10" fill="#8a5a36" stroke="${C}" stroke-width="5"/>${Array.from({ length: 6 }, (_, k) => `<g transform="translate(${-160 + k * 64} -20)"><path d="M0 0 Q-16 -40 -6 -60 M0 0 Q14 -36 10 -56 M0 0 V-50" stroke="#4f9a4a" stroke-width="6" fill="none"/></g>`).join("")}</g>`;
    // pe de acerola (meio: o sabia pousa nele)
    let m = `<g id="${id}-arvore"><path d="M1540 800 Q1530 640 1560 520 Q1500 470 1470 420 M1556 600 Q1620 540 1660 500" stroke="#7a4e2e" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M1540 800 Q1530 640 1560 520" stroke="${C}" stroke-width="4" fill="none"/>
      <g id="${id}-copa">${Array.from({ length: 70 }, (_, k) => { const a = rnd(k) * 6.28, r = Math.sqrt(rnd(k + 50)) * 230; return folha(1560 + Math.cos(a) * r * 1.2, 380 + Math.sin(a) * r * 0.7, 26 + rnd(k + 3) * 10, rnd(k + 7) * 180, k % 3 ? "#5aa64a" : "#4a8f3e"); }).join("")}
      ${Array.from({ length: 22 }, (_, k) => { const a = rnd(k + 90) * 6.28, r = Math.sqrt(rnd(k + 130)) * 210; return acerola(1560 + Math.cos(a) * r * 1.2, 390 + Math.sin(a) * r * 0.7); }).join("")}</g></g>
      <g transform="translate(1780 800)"><rect x="-60" y="-80" width="120" height="80" rx="8" fill="#3f6fa8" stroke="${C}" stroke-width="5"/><ellipse cx="0" cy="-80" rx="60" ry="14" fill="#5fb8ff" stroke="${C}" stroke-width="4"/></g>`;
    return camadas(id, f, m, "");
  }

  /* ---------- FRENTE DA CASA DO IRMAO (c81, c90): casa simples de bloco, garagem aberta, portao baixo, poste, calcada. Chao em ~880. o.cortina: o irmao espia (id-espia) ---------- */
  function casaIrmao(o = {}) {
    const id = o.id || "irmao";
    let f = `<rect x="-300" y="-300" width="2520" height="1100" fill="#bfe3f0"/>`;
    [[1500, 110, 1], [300, 90, 0.8]].forEach(([x, y, s]) => f += `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 40 Q0 10 30 12 Q40 -14 72 0 Q96 -10 110 14 Q140 14 138 40 Z" fill="#fff" stroke="${C}" stroke-width="4"/></g>`);
    // casa vizinha
    f += `<rect x="-300" y="380" width="380" height="500" fill="#d9c3e0" stroke="${C}" stroke-width="6"/>${janela(-210, 480, 160, 130, "#fff")}`;
    // casa do irmao: reboco por pintar em partes, laje, caixa d'agua
    f += `<rect x="140" y="300" width="1300" height="580" fill="#f3e3c4" stroke="${C}" stroke-width="6"/><rect x="900" y="300" width="540" height="580" fill="#d9cfc0" stroke="${C}" stroke-width="6"/>
      ${Array.from({ length: 9 }, (_, r) => Array.from({ length: 5 }, (_, k) => `<rect x="${910 + k * 90 + (r % 2) * 45}" y="${310 + r * 62}" width="84" height="56" fill="none" stroke="#bfb3a2" stroke-width="3"/>`).join("")).join("")}
      <rect x="120" y="270" width="1340" height="36" fill="#cfc4b3" stroke="${C}" stroke-width="6"/><g transform="translate(1250 200)"><rect x="-70" y="0" width="140" height="70" rx="8" fill="#5fb8ff" stroke="${C}" stroke-width="5"/><ellipse cx="0" cy="0" rx="70" ry="14" fill="#3f8ae8" stroke="${C}" stroke-width="5"/></g>
      ${porta(260, 560, 170, 320, "#c25b4e")}
      <g id="${id}-janela">${janela(520, 470, 260, 190, "#9fcfc6")}<g id="${id}-espia" opacity="${o.espia ? 1 : 0}">${busto("irmao_svg", "desconfiado", 610, 565, 150, "r")}<path d="M514 464 Q600 560 580 668 L514 668 Z" fill="#9fcfc6" stroke="${C}" stroke-width="3"/></g></g>
      <rect x="940" y="520" width="460" height="360" fill="#5a5f6a" stroke="${C}" stroke-width="6"/><rect x="940" y="520" width="460" height="40" fill="#8a8e98" stroke="${C}" stroke-width="5"/>${Array.from({ length: 4 }, (_, k) => `<path d="M950 ${600 + k * 70} H1390" stroke="#6b707c" stroke-width="4"/>`).join("")}`;
    // casa vizinha da direita (preenche o fundo)
    f += `<rect x="1470" y="420" width="760" height="460" fill="#cde3c0" stroke="${C}" stroke-width="6"/><path d="M1450 430 L1850 300 L2240 430 Z" fill="#a85f38" stroke="${C}" stroke-width="6"/>${janela(1560, 520, 180, 140, "#f29e4c")}${porta(1820, 600, 140, 280, "#3f6fa8")}`;
    // calcada e rua
    f += `<rect x="-300" y="880" width="2520" height="100" fill="#cfcfd6" stroke="${C}" stroke-width="5"/>${Array.from({ length: 22 }, (_, k) => `<path d="M${-300 + k * 120} 880 v100" stroke="#b5b5bd" stroke-width="3"/>`).join("")}<rect x="-300" y="980" width="2520" height="300" fill="#5a5f6a"/>`;
    f += `<g transform="translate(1640 880)"><rect x="-10" y="-560" width="20" height="560" fill="#8a8e98" stroke="${C}" stroke-width="5"/><path d="M0 -540 H-120" stroke="#8a8e98" stroke-width="14"/><ellipse cx="-120" cy="-526" rx="34" ry="12" fill="#ffe08a" stroke="${C}" stroke-width="4"/></g>
      <path d="M-300 160 Q600 240 1640 330 Q1900 300 2220 280" stroke="${C}" stroke-width="3" fill="none"/>`;
    // muro baixo e portao (frente)
    const fr = `<g><rect x="80" y="800" width="560" height="80" fill="#e9dcc4" stroke="${C}" stroke-width="5"/>${Array.from({ length: 9 }, (_, k) => `<rect x="${660 + k * 30}" y="760" width="12" height="120" fill="#4a4d57" stroke="${C}" stroke-width="3"/>`).join("")}<rect x="650" y="752" width="280" height="14" fill="#4a4d57" stroke="${C}" stroke-width="3"/></g>`;
    return camadas(id, f, "", fr);
  }

  /* ---------- CASA DA MAE por dentro (c86, c87, c88): o.variante "cozinha" (pia, fogao, mesinha com toalha) | "sala" (estante com porta-retratos). Chao em ~790. o.mesa: mesinha na frente ---------- */
  function casaMae(o = {}) {
    const id = o.id || "casam", v = o.variante || "cozinha";
    let f = `<rect x="-300" y="-300" width="2520" height="1100" fill="#f6e7c8"/>`;
    for (let x = -300; x < 2220; x += 80) for (let y = -300; y < 460; y += 80) f += `<circle cx="${x + ((y / 80) % 2) * 40}" cy="${y}" r="6" fill="#efd8ae"/>`;
    f += `<rect x="-300" y="460" width="2520" height="330" fill="#e9d2a4"/>`;
    if (v === "cozinha") {
      for (let x = -300; x < 2220; x += 60) for (let y = 460; y < 790; y += 60) f += `<rect x="${x}" y="${y}" width="60" height="60" fill="${(x / 60 + y / 60) % 2 ? "#fff8e6" : "#f2ecdc"}" stroke="#e0d6c0" stroke-width="2"/>`;
      f += janela(1200, 170, 320, 230, "#f29e4c");
      f += `<rect x="1050" y="560" width="760" height="230" fill="#f7f4ef" stroke="${C}" stroke-width="6"/><rect x="1040" y="540" width="780" height="30" rx="4" fill="#c9ccd4" stroke="${C}" stroke-width="5"/>${[1110, 1310, 1510, 1710].map(x => `<rect x="${x}" y="590" width="170" height="180" rx="8" fill="#eef0f4" stroke="${C}" stroke-width="4"/><circle cx="${x + 150}" cy="680" r="6" fill="${C}"/>`).join("")}
        <path d="M1360 540 V490 Q1360 470 1390 470 L1420 470" fill="none" stroke="#8a8e98" stroke-width="10"/>`;
      f += `<g transform="translate(200 790)"><rect x="0" y="-330" width="300" height="330" rx="8" fill="#f2f3f6" stroke="${C}" stroke-width="6"/><rect x="10" y="-320" width="280" height="40" rx="6" fill="#4a4d57"/>${[60, 150, 240].map(x => `<circle cx="${x}" cy="-300" r="14" fill="#2b2a31" stroke="#8a8e98" stroke-width="4"/>`).join("")}<rect x="30" y="-250" width="240" height="160" rx="10" fill="#2b2a31" stroke="${C}" stroke-width="5"/>
        <g transform="translate(110 -340)"><path d="M-50 0 L-40 -60 L40 -60 L50 0 Z" fill="#c25b4e" stroke="${C}" stroke-width="5"/><rect x="-56" y="-70" width="112" height="14" rx="5" fill="#a8323e" stroke="${C}" stroke-width="4"/><path d="M0 -84 q10 -18 0 -30 M18 -84 q10 -18 0 -30" stroke="#c9ccd4" stroke-width="4" fill="none" opacity=".7"/></g></g>`;
      f += `<g transform="translate(700 150)">${[0, 1, 2].map(k => `<circle cx="${k * 90}" cy="${k % 2 * 10}" r="34" fill="#c9774a" stroke="${C}" stroke-width="4"/><path d="M${k * 90} -34 v-24" stroke="${C}" stroke-width="4"/>`).join("")}<path d="M-40 -60 H220" stroke="#8a5a36" stroke-width="8"/></g>
        <g transform="translate(860 330)"><circle r="60" fill="#fff" stroke="${C}" stroke-width="6"/><path d="M0 0 V-40 M0 0 L28 14" stroke="${C}" stroke-width="6" stroke-linecap="round"/></g>`;
    } else {
      f += `<rect x="-300" y="460" width="2520" height="20" fill="#d6b98a" stroke="${C}" stroke-width="4"/>${janela(260, 160, 300, 230, "#f6c6d4")}`;
      f += `<g transform="translate(1100 790)"><rect x="0" y="-560" width="620" height="560" fill="#a86b42" stroke="${C}" stroke-width="7"/>${[-420, -280, -140].map(y => `<rect x="20" y="${y}" width="580" height="16" fill="#8a5a36" stroke="${C}" stroke-width="4"/>`).join("")}
        ${[[40, -540, 40, "#3f6fa8"], [84, -540, 30, "#e2544f"], [118, -540, 36, "#6fae5a"], [420, -540, 34, "#F5C542"], [458, -540, 40, "#8a5a3b"]].map(([x, y, w, c]) => `<rect x="${x}" y="${y + 20}" width="${w}" height="100" fill="${c}" stroke="${C}" stroke-width="3"/>`).join("")}
        <g transform="translate(300 -360)"><path d="M-40 0 L-30 -50 L30 -50 L40 0 Z" fill="#9fcfc6" stroke="${C}" stroke-width="4"/><path d="M0 -50 Q-20 -90 -30 -110 M0 -50 Q20 -90 30 -100" stroke="#4f9a4a" stroke-width="6" fill="none"/></g>
        <rect x="40" y="-120" width="540" height="100" rx="6" fill="#2b2a31" stroke="${C}" stroke-width="5"/><rect x="56" y="-108" width="508" height="76" rx="4" fill="#3a4560"/></g>`;
      f += `<g transform="translate(240 790)"><rect x="0" y="-180" width="520" height="140" rx="40" fill="#c97b9a" stroke="${C}" stroke-width="6"/><rect x="-20" y="-120" width="80" height="120" rx="20" fill="#b56a88" stroke="${C}" stroke-width="6"/><rect x="460" y="-120" width="80" height="120" rx="20" fill="#b56a88" stroke="${C}" stroke-width="6"/><rect x="40" y="-60" width="440" height="60" rx="12" fill="#b56a88" stroke="${C}" stroke-width="6"/><rect x="200" y="-170" width="110" height="80" rx="14" fill="#f6e3b4" stroke="${C}" stroke-width="4"/></g>`;
    }
    f += `<rect x="-300" y="790" width="2520" height="410" fill="#c9a77a"/>${Array.from({ length: 8 }, (_, k) => `<path d="M-300 ${820 + k * 50} H2220" stroke="#b8956a" stroke-width="3"/>`).join("")}<path d="M-300 790 H2220" stroke="${C}" stroke-width="5"/>`;
    let fr = "";
    if (o.mesa !== false && v === "cozinha") fr = `<g id="${id}-mesa"><rect x="560" y="820" width="800" height="26" rx="6" fill="#a86b42" stroke="${C}" stroke-width="6"/><path d="M560 846 L590 1120 M1360 846 L1330 1120" stroke="#8a5a36" stroke-width="22"/><path d="M560 846 L590 1120 M1360 846 L1330 1120" stroke="${C}" stroke-width="4" opacity=".5"/>
      <path d="M548 810 H1372 L1340 900 H580 Z" fill="#fff8e6" stroke="${C}" stroke-width="5"/>${Array.from({ length: 13 }, (_, k) => `<circle cx="${600 + k * 60}" cy="860" r="10" fill="#e2544f" opacity=".7"/>`).join("")}
      <g transform="translate(760 812)"><path d="M-46 0 Q-46 -50 0 -50 Q46 -50 46 0 Z" fill="#f7f4ef" stroke="${C}" stroke-width="5"/><path d="M-20 -50 q6 -16 0 -26 M10 -50 q6 -16 0 -26" stroke="#c9ccd4" stroke-width="4" fill="none"/></g><g transform="translate(1120 812)"><rect x="-20" y="-60" width="40" height="60" rx="8" fill="#f2f3f6" stroke="${C}" stroke-width="4"/><path d="M20 -48 q22 8 0 30" fill="none" stroke="${C}" stroke-width="5"/></g></g>`;
    return camadas(id, f, "", fr);
  }

  /* ---------- CABINE DO 747 com a mesa de Natal (c84, c88): bem comprida (o.largura, padrao 4200), janelinhas, enfeites; mesa na frente. o.cadeiras_vazias: so as cadeiras ---------- */
  function cabine747(o = {}) {
    const id = o.id || "cab747", L = o.largura || 4200;
    let f = `<rect x="-300" y="-300" width="${L + 600}" height="1500" fill="#f2ece0"/><path d="M-300 120 Q${L / 2} -60 ${L + 300} 120 L${L + 300} -300 L-300 -300 Z" fill="#e6dccb"/>`;
    for (let x = 0; x < L; x += 220) f += `<g transform="translate(${x} 330)"><rect x="-50" y="-80" width="100" height="150" rx="50" fill="#d6cdbd" stroke="${C}" stroke-width="5"/><rect x="-36" y="-66" width="72" height="122" rx="36" fill="#3a4a7a"/><circle cx="-10" cy="-30" r="3" fill="#fff"/><circle cx="14" cy="10" r="2" fill="#fff"/></g>`;
    for (let x = 0; x < L; x += 440) f += `<g transform="translate(${x + 110} 150)"><path d="M-110 0 Q0 60 110 0" stroke="#3f8a3a" stroke-width="16" fill="none"/>${[-70, 0, 70].map((dx, k) => `<circle cx="${dx}" cy="${30 - Math.abs(dx) / 5}" r="16" fill="${["#e2544f", "#F5C542", "#3f6fa8"][k]}" stroke="${C}" stroke-width="3"/>`).join("")}</g>`;
    f += `<rect x="-300" y="560" width="${L + 600}" height="640" fill="#7a2f3a"/><path d="M-300 560 H${L + 300}" stroke="${C}" stroke-width="5"/>${Array.from({ length: Math.ceil((L + 600) / 160) }, (_, k) => `<path d="M${-300 + k * 160} 600 l40 40 l-40 40 l-40 -40 Z" fill="none" stroke="#933a47" stroke-width="4"/>`).join("")}`;
    // arvorezinha de Natal no fundo
    f += `<g transform="translate(${L - 300} 560)"><path d="M0 -380 L120 -100 L60 -100 L150 0 L-150 0 L-60 -100 L-120 -100 Z" fill="#3f8a3a" stroke="${C}" stroke-width="6"/><path d="M0 -420 l12 26 l28 2 l-22 18 l8 28 l-26 -16 l-26 16 l8 -28 l-22 -18 l28 -2 Z" fill="#F5C542" stroke="${C}" stroke-width="4"/>${[[-50, -60], [40, -150], [-30, -220], [70, -40], [10, -300]].map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="12" fill="${["#e2544f", "#5fb8ff", "#F5C542"][k % 3]}" stroke="${C}" stroke-width="3"/>`).join("")}</g>`;
    // cadeiras atras da mesa (meio)
    let m = "";
    for (let x = 140; x < L - 400; x += 300) m += `<g transform="translate(${x} 760)"><rect x="-60" y="-200" width="120" height="200" rx="20" fill="#f6e3b4" stroke="${C}" stroke-width="6"/><rect x="-46" y="-186" width="92" height="80" rx="12" fill="#efd59a"/></g>`;
    // mesa comprida (frente)
    let fr = `<g id="${id}-mesa"><rect x="0" y="790" width="${L - 400}" height="40" fill="#fff8e6" stroke="${C}" stroke-width="6"/><rect x="0" y="826" width="${L - 400}" height="300" fill="#c25b4e" stroke="${C}" stroke-width="6"/><rect x="0" y="826" width="${L - 400}" height="40" fill="#3f8a3a"/>`;
    for (let x = 140; x < L - 400; x += 300) fr += `<g transform="translate(${x} 800)"><ellipse rx="60" ry="16" fill="#fff" stroke="${C}" stroke-width="4"/><ellipse rx="38" ry="9" fill="#f2ede2"/></g>`;
    for (let x = 290; x < L - 500; x += 600) fr += `<g transform="translate(${x} 800)"><ellipse cx="0" cy="-6" rx="70" ry="30" fill="#c98a3a" stroke="${C}" stroke-width="5"/><ellipse cx="0" cy="-16" rx="54" ry="18" fill="#e0a85a"/><path d="M-60 -10 l-14 -20 M60 -10 l14 -20" stroke="#f7f4ef" stroke-width="8" stroke-linecap="round"/></g>`;
    for (let x = 140; x < L - 500; x += 900) fr += `<g transform="translate(${x + 450} 798)"><rect x="-10" y="-70" width="20" height="70" fill="#fff8e6" stroke="${C}" stroke-width="4"/><path d="M0 -70 q12 -16 0 -30 q-12 14 0 30" fill="#F5C542" stroke="#e8902a" stroke-width="3"/></g>`;
    fr += `</g>`;
    return camadas(id, f, m, fr);
  }

  /* ================= OBJETOS (flutuantes: centro 0,0) ================= */
  function sabia(o = {}) {  // sabia-laranjeira: cabeca em id-cabeca (gira para bicar em volta de 30,-30)
    const id = o.id || "sabia";
    return `<g id="${id}"><path d="M-70 10 L-120 30 L-110 0 L-120 -20 Z" fill="#6b5a4a" stroke="${C}" stroke-width="4"/><ellipse cx="0" cy="0" rx="70" ry="44" fill="#8a7a66" stroke="${C}" stroke-width="5"/><path d="M-10 10 Q20 50 60 20 Q50 -10 10 -6 Z" fill="#e8893a" stroke="${C}" stroke-width="3"/>
      <path d="M-40 -10 Q-10 -36 30 -20" fill="none" stroke="#6b5a4a" stroke-width="10" stroke-linecap="round"/><path d="M-8 40 v26 M14 40 v26" stroke="#c9a77a" stroke-width="5"/>
      <g id="${id}-cabeca"><circle cx="50" cy="-34" r="30" fill="#8a7a66" stroke="${C}" stroke-width="5"/><circle cx="60" cy="-40" r="7" fill="#fff"/><circle cx="62" cy="-40" r="4" fill="${C}"/><circle cx="60" cy="-40" r="10" fill="none" stroke="#f2c86a" stroke-width="3"/><path d="M76 -34 L104 -26 L76 -22 Z" fill="#e8b04a" stroke="${C}" stroke-width="3"/></g></g>`;
  }
  function balaoPrato(o = {}) {  // balao de pensamento com prato de comida
    const id = o.id || "bprato";
    return `<g id="${id}"><circle cx="-150" cy="150" r="16" fill="#fff" stroke="${C}" stroke-width="5"/><circle cx="-110" cy="110" r="24" fill="#fff" stroke="${C}" stroke-width="5"/>
      <path d="M-120 0 Q-150 -90 -60 -100 Q-20 -150 50 -120 Q120 -140 140 -70 Q190 -20 130 40 Q110 90 40 70 Q-20 110 -70 70 Q-140 70 -120 0 Z" fill="#fff" stroke="${C}" stroke-width="6"/>
      <ellipse cx="10" cy="-10" rx="100" ry="34" fill="#f7f4ef" stroke="${C}" stroke-width="5"/><ellipse cx="10" cy="-14" rx="70" ry="22" fill="#fff"/><path d="M-40 -20 Q-10 -46 20 -24 Q40 -44 60 -18 Q10 -2 -40 -20 Z" fill="#f6f0d8" stroke="${C}" stroke-width="3"/>
      <ellipse cx="-20" cy="-18" rx="26" ry="10" fill="#6b3a22" stroke="${C}" stroke-width="3"/><circle cx="40" cy="-22" r="12" fill="#e2544f" stroke="${C}" stroke-width="3"/><path d="M0 -30 l10 -6 l6 8" fill="#6fae5a" stroke="${C}" stroke-width="2"/></g>`;
  }
  function carne(o = {}) {  // carne de pagamento com carimbo ATRASADA (id-carimbo)
    const id = o.id || "carne";
    return `<g id="${id}" transform="rotate(-4)"><rect x="-220" y="-140" width="440" height="280" rx="10" fill="#fff8e6" stroke="${C}" stroke-width="7"/><rect x="-220" y="-140" width="440" height="56" rx="10" fill="#3f6fa8" stroke="${C}" stroke-width="7"/>${T(0, -100, "CARNÊ · CASA", 30, "#fff")}
      ${["Parcela 47/120", "Vencimento 05/09", "Valor R$ 1.380,00"].map((t, k) => T(-190, -40 + k * 44, t, 26, "#2E2A33", "start")).join("")}<path d="M-190 100 H190" stroke="#c9ccd4" stroke-width="4" stroke-dasharray="10 8"/>
      <g id="${id}-carimbo" transform="rotate(-14 60 40)"><rect x="-80" y="0" width="300" height="80" rx="10" fill="none" stroke="#d9333a" stroke-width="9"/>${T(70, 56, "ATRASADA", 50, "#d9333a")}</g></g>`;
  }
  function fotoIrmaos(o = {}) {  // porta-retratos com os dois irmaos criancas (desenho simples)
    const id = o.id || "fotoirm";
    const crianca = (x, cab, rou, ocu) => `<g transform="translate(${x} 0)"><path d="M-50 140 Q-50 50 0 50 Q50 50 50 140 Z" fill="${rou}" stroke="${C}" stroke-width="5"/><circle cx="0" cy="0" r="52" fill="#F4A46A" stroke="${C}" stroke-width="5"/><path d="M-54 -6 Q-60 -64 0 -64 Q60 -64 54 -6 Q40 -40 0 -36 Q-40 -40 -54 -6 Z" fill="${cab}" stroke="${C}" stroke-width="4"/>
      ${ocu ? `<circle cx="-18" cy="0" r="14" fill="none" stroke="${C}" stroke-width="4"/><circle cx="18" cy="0" r="14" fill="none" stroke="${C}" stroke-width="4"/>` : ""}<circle cx="-18" cy="0" r="5" fill="${C}"/><circle cx="18" cy="0" r="5" fill="${C}"/><path d="M-16 24 Q0 38 16 24" fill="none" stroke="${C}" stroke-width="4" stroke-linecap="round"/></g>`;
    return `<g id="${id}"><rect x="-260" y="-210" width="520" height="420" rx="16" fill="#a86b42" stroke="${C}" stroke-width="8"/><rect x="-226" y="-176" width="452" height="352" fill="#f2d9a8" stroke="${C}" stroke-width="5"/>
      <rect x="-226" y="60" width="452" height="116" fill="#8fd06a"/><circle cx="150" cy="-110" r="34" fill="#ffe08a"/>${crianca(-80, "#26221f", "#3f6fa8", true)}${crianca(80, "#26221f", "#e2544f", false)}<path d="M-30 90 Q0 70 30 90" stroke="#F4A46A" stroke-width="16" stroke-linecap="round" fill="none"/>
      <rect x="-226" y="-176" width="452" height="352" fill="#c98a5a" opacity=".18"/>${T(150, 160, "1998", 26, "#8a5a36")}</g>`;
  }
  function telaTransferencia(o = {}) {  // tela generica de transferencia; check em id-ok
    const id = o.id || "transf";
    return `<g id="${id}"><rect x="-300" y="-520" width="600" height="1040" rx="64" fill="#1b1a20" stroke="${C}" stroke-width="8"/><rect x="-274" y="-492" width="548" height="984" rx="44" fill="#f4f6fa"/>
      ${T(0, -380, "Transferir", 40, "#2E2A33")}<rect x="-230" y="-320" width="460" height="150" rx="20" fill="#fff" stroke="#d9dde6" stroke-width="4"/>${T(-200, -270, "Para", 24, "#8a8e98", "start")}${T(-200, -220, "Irmão", 40, "#2E2A33", "start")}
      <rect x="-230" y="-140" width="460" height="170" rx="20" fill="#fff" stroke="#d9dde6" stroke-width="4"/>${T(-200, -96, "Valor", 24, "#8a8e98", "start")}${T(-200, -30, "US$ 3.000.000", 50, "#2E2A33", "start")}
      <g id="${id}-ok"><circle cx="0" cy="190" r="90" fill="#2f9a6a" stroke="${C}" stroke-width="6"/><path d="M-40 190 l28 30 l54 -64" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>${T(0, 340, "Transferência enviada", 36, "#2f9a6a")}</g></g>`;
  }
  function pudim(o = {}) {  // pudim no prato (chao em 362: em cima da mesa use pes)
    const id = o.id || "pudim";
    return `<g id="${id}"><ellipse cx="0" cy="350" rx="150" ry="22" fill="#fff" stroke="${C}" stroke-width="5"/><path d="M-100 340 L-80 230 Q0 210 80 230 L100 340 Q0 360 -100 340 Z" fill="#f6d38a" stroke="${C}" stroke-width="6"/>
      <path d="M-80 230 Q0 210 80 230 L76 254 Q40 280 20 252 Q0 290 -20 256 Q-50 282 -78 252 Z" fill="#a8541e" stroke="${C}" stroke-width="5"/><ellipse cx="0" cy="226" rx="40" ry="10" fill="#c9702e"/><path d="M-60 300 Q-40 320 -20 300" stroke="#fff" stroke-width="6" fill="none" opacity=".6"/></g>`;
  }
  function portaRetratoFilho(o = {}) {  // porta-retratos de um filho (o.rig); o.costas = de costas (so o verso)
    const id = o.id || "prf" + Math.round(rnd(o.k || 1) * 1e5);
    if (o.costas) return `<g id="${id}"><path d="M-110 140 L-90 -140 L90 -140 L110 140 Z" fill="#8a5a36" stroke="${C}" stroke-width="7"/><path d="M0 -40 L0 140 M-30 140 L0 60 L30 140" stroke="#6e4426" stroke-width="8" fill="none"/><circle cx="0" cy="-100" r="10" fill="#c9ccd4" stroke="${C}" stroke-width="3"/></g>`;
    return `<g id="${id}"><rect x="-110" y="-140" width="220" height="280" rx="10" fill="#a86b42" stroke="${C}" stroke-width="7"/><rect x="-86" y="-116" width="172" height="232" fill="#9fd8f0"/>${busto(o.rig || "irmao_svg", "feliz", 0, 0, 200, "r")}</g>`;
  }
  function telaContato(o = {}) {  // contato "Irmao" com o botao de ligar; polegar em id-polegar; tela apaga em id-apagada
    const id = o.id || "contato";
    return `<g id="${id}"><rect x="-300" y="-520" width="600" height="1040" rx="64" fill="#1b1a20" stroke="${C}" stroke-width="8"/><rect x="-274" y="-492" width="548" height="984" rx="44" fill="#eef2f8"/>
      <circle cx="0" cy="-250" r="120" fill="#fff" stroke="${C}" stroke-width="5"/>${busto("irmao_svg", "neutro", 0, -250, 220)}${T(0, -60, "Irmão", 64, "#2E2A33")}${T(0, -10, "celular", 30, "#8a8e98")}
      <g transform="translate(0 220)"><circle r="90" fill="#2f9a6a" stroke="${C}" stroke-width="6"/><path d="M-34 -30 q-10 40 34 70 q20 14 34 4 l-16 -24 q-14 6 -24 -6 q-14 -16 -10 -30 l-16 -16 Z" fill="#fff"/>${T(0, 150, "ligar", 34, "#2f9a6a")}</g>
      <g id="${id}-polegar"><path d="M60 560 Q40 420 70 330 Q90 290 120 320 Q140 380 150 560 Z" fill="#F4A46A" stroke="${C}" stroke-width="6"/><path d="M76 340 Q96 320 114 336" fill="#ffd9c0" stroke="${C}" stroke-width="3"/></g>
      <rect id="${id}-apagada" x="-274" y="-492" width="548" height="984" rx="44" fill="#0a0a0e" opacity="0"/></g>`;
  }
  function abismo(o = {}) {  // rachadura no chao (centro 0,0): id-a1 fina, id-a2 aberta (escalar em x a partir do centro)
    const id = o.id || "abismo";
    if (o.deitado) {  // no chao em perspectiva: estreita ao fundo (y -80), larga perto da camera (y 160)
      const zz = (w0, w1, lado) => Array.from({ length: 9 }, (_, k) => { const u = k / 8, w = w0 + (w1 - w0) * u; return `${lado * (w + (k % 2 ? 10 : -6) * (0.4 + u))} ${-80 + u * 240}`; });
      const piso = o.piso === false ? "" : `<path d="M-1600 -96 H1600 L1900 400 H-1900 Z" fill="${o.piso || "#e3d3b4"}"/><path d="M-1600 -96 H1600" stroke="${C}" stroke-width="5"/>${Array.from({ length: 5 }, (_, k) => `<path d="M-1700 ${-40 + k * 70} H1700" stroke="#d6c4a2" stroke-width="3"/>`).join("")}`;
      return `<g id="${id}">${piso}<g id="${id}-a1"><path d="M${zz(2, 8, 1).join(" L")}" fill="none" stroke="${C}" stroke-width="6" stroke-linejoin="round"/></g>
        <g id="${id}-a2"><path d="M${zz(8, 150, -1).join(" L")} L${zz(8, 150, 1).reverse().join(" L")} Z" fill="#2b2230" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><path d="M${zz(4, 90, -1).join(" L")}" fill="none" stroke="#4a3a50" stroke-width="8"/></g></g>`;
    }
    const z = Array.from({ length: 13 }, (_, k) => `${(k % 2 ? 18 : -18) * (1 + rnd(k))} ${-300 + k * 50}`).join(" L");
    return `<g id="${id}"><g id="${id}-a1"><path d="M${z}" fill="none" stroke="${C}" stroke-width="8" stroke-linejoin="round"/></g>
      <g id="${id}-a2"><path d="M-60 -300 L-20 -240 L-80 -170 L-30 -100 L-90 -20 L-40 60 L-100 140 L-50 220 L-70 300 L70 300 L40 220 L100 140 L40 60 L80 -20 L30 -100 L90 -170 L20 -240 L60 -300 Z" fill="#2b2230" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M-40 -260 L-60 -170 L-20 -100 L-70 -20 L-30 60 L-80 140" fill="none" stroke="#4a3a50" stroke-width="10"/></g></g>`;
  }

  Object.assign(Cn, { quintalMae, casaIrmao, casaMae, cabine747 });
  Object.assign(O, { sabia, balaoPrato, carne, fotoIrmaos, telaTransferencia, pudim, portaRetratoFilho, telaContato, abismo });
})();

/* ===== Cenarios e objetos da parte 9 do video do trilionario (10/11/2026): a mesa para um ===== */
(function () {
  const O = window.Objetos, Cn = window.Cenarios, C = O.C;
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const T = (x, y, txt, tam, cor = "#fff8e6", anc = "middle", extra = "") => `<text x="${x}" y="${y}" text-anchor="${anc}" style="${F};font-size:${tam}px" fill="${cor}" ${extra}>${txt}</text>`;
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const camadas = (id, f, m, fr) => `<g id="${id}"><g id="${id}-fundo">${f}</g><g id="${id}-meio">${m}</g><g id="${id}-frente">${fr}</g></g>`;

  /* ---------- SALA DE REUNIAO ESCURA (c93): lambri escuro, quadros, persiana com a noite, mesa comprida na frente com abajur aceso.
     Mesa em ~830; os personagens ficam atras dela (meio corpo). ---------- */
  function salaReuniao(o = {}) {
    const id = o.id || "reun";
    let f = `<rect x="-300" y="-300" width="2520" height="1500" fill="#2a2630"/>`;
    for (let x = -300; x < 2220; x += 140) f += `<rect x="${x}" y="-300" width="130" height="1060" fill="#332d38" stroke="#24202a" stroke-width="4"/>`;
    // persiana com a cidade a noite
    f += `<g transform="translate(1180 110)"><rect x="-14" y="-14" width="588" height="408" rx="8" fill="#1b1820" stroke="${C}" stroke-width="6"/><rect x="0" y="0" width="560" height="380" fill="#16203a"/>
      ${Array.from({ length: 9 }, (_, k) => `<rect x="${20 + k * 62}" y="${150 + rnd(k) * 120}" width="50" height="${230 - rnd(k) * 120}" fill="#22305a"/>`).join("")}${Array.from({ length: 30 }, (_, k) => `<rect x="${28 + rnd(k + 3) * 520}" y="${170 + rnd(k + 9) * 190}" width="10" height="8" fill="#ffd98a" opacity=".6"/>`).join("")}
      ${Array.from({ length: 19 }, (_, k) => `<rect x="0" y="${k * 20}" width="560" height="9" fill="#3a3540" opacity=".85"/>`).join("")}<path d="M520 0 V380" stroke="#8a8e98" stroke-width="3"/></g>`;
    // quadros e relogio
    f += `<g transform="translate(240 140)"><rect width="300" height="200" fill="#c9a77a" stroke="#8a5a36" stroke-width="12"/><path d="M14 186 L100 90 L160 140 L210 100 L286 186 Z" fill="#4a6a5a" stroke="${C}" stroke-width="3"/></g>
      <g transform="translate(760 220)"><circle r="56" fill="#e8e9ee" stroke="${C}" stroke-width="6"/><path d="M0 0 V-36 M0 0 L26 10" stroke="${C}" stroke-width="6" stroke-linecap="round"/></g>`;
    f += `<rect x="-300" y="760" width="2520" height="440" fill="#1f1b24"/><path d="M-300 760 H2220" stroke="#14111a" stroke-width="5"/>`;
    // cadeiras de espaldar alto atras da mesa (meio)
    let m = "";
    [520, 960, 1400].forEach(x => m += `<g transform="translate(${x} 830)"><rect x="-90" y="-330" width="180" height="330" rx="26" fill="#3a2a22" stroke="${C}" stroke-width="7"/><rect x="-70" y="-310" width="140" height="200" rx="18" fill="#4a362c"/></g>`);
    // mesa comprida com abajur (frente)
    const fr = `<g id="${id}-mesa"><path d="M200 820 H1720 L1800 1120 H120 Z" fill="#4a2f22" stroke="${C}" stroke-width="7"/><path d="M200 820 H1720 L1728 850 H192 Z" fill="#6b4430" stroke="${C}" stroke-width="5"/>
      <g id="${id}-abajur" transform="translate(1560 820)"><path d="M-120 0 L-260 340 L260 340 L120 0 Z" fill="#ffd27a" opacity=".1"/><rect x="-10" y="-150" width="20" height="150" fill="#c9a227" stroke="${C}" stroke-width="5"/><ellipse cx="0" cy="-2" rx="60" ry="14" fill="#c9a227" stroke="${C}" stroke-width="5"/>
        <path d="M-90 -150 L-60 -250 L60 -250 L90 -150 Z" fill="#2f6a4a" stroke="${C}" stroke-width="6"/><ellipse cx="0" cy="-150" rx="90" ry="14" fill="#ffe7a8"/><circle cx="0" cy="-130" r="160" fill="#ffd27a" opacity=".16"/></g>
      <g transform="translate(420 826)"><rect x="-60" y="-20" width="120" height="20" rx="4" fill="#e8e9ee" stroke="${C}" stroke-width="4"/><rect x="-50" y="-34" width="100" height="16" rx="3" fill="#f7f4ef" stroke="${C}" stroke-width="3"/></g>
      <g transform="translate(700 822)"><path d="M-22 0 V-56 H22 V0 Z" fill="#e8f4fa" stroke="${C}" stroke-width="4"/><path d="M-20 -24 H20" stroke="#9fd0ea" stroke-width="20" opacity=".6"/></g></g>`;
    return camadas(id, f, m, fr);
  }

  /* ---------- CORREDOR DA ALA LESTE (c98): corredor da mansao em perspectiva, portas dos dois lados, tapete, arandelas, janela no fundo. Chao em ~900. ---------- */
  function corredorAlaLeste(o = {}) {
    const id = o.id || "corr";
    const fx = 960, fy = 470, fw = 300, fh = 330;  // parede do fundo
    let f = `<rect x="-300" y="-300" width="2520" height="1500" fill="#efe2c4"/>`;
    f += `<path d="M-300 -300 L${fx - fw / 2} ${fy - fh / 2} L${fx - fw / 2} ${fy + fh / 2} L-300 1300 Z" fill="#e6d4ae" stroke="${C}" stroke-width="5"/><path d="M2220 -300 L${fx + fw / 2} ${fy - fh / 2} L${fx + fw / 2} ${fy + fh / 2} L2220 1300 Z" fill="#e6d4ae" stroke="${C}" stroke-width="5"/>`;
    f += `<path d="M-300 -300 L${fx - fw / 2} ${fy - fh / 2} H${fx + fw / 2} L2220 -300 Z" fill="#f7efdc" stroke="${C}" stroke-width="5"/><path d="M-300 1300 L${fx - fw / 2} ${fy + fh / 2} H${fx + fw / 2} L2220 1300 Z" fill="#a86b42" stroke="${C}" stroke-width="5"/>`;
    f += `<rect x="${fx - fw / 2}" y="${fy - fh / 2}" width="${fw}" height="${fh}" fill="#f2e6cc" stroke="${C}" stroke-width="5"/><rect x="${fx - 70}" y="${fy - 110}" width="140" height="170" fill="#bfe3f0" stroke="${C}" stroke-width="5"/><path d="M${fx} ${fy - 110} V${fy + 60} M${fx - 70} ${fy - 25} H${fx + 70}" stroke="${C}" stroke-width="4"/>`;
    // tapete vermelho no chao
    f += `<path d="M${fx - 70} ${fy + fh / 2} L${fx + 70} ${fy + fh / 2} L1400 1300 L520 1300 Z" fill="#8a2f3a" stroke="${C}" stroke-width="4"/><path d="M${fx - 56} ${fy + fh / 2} L560 1300 M${fx + 56} ${fy + fh / 2} L1360 1300" stroke="#c9a227" stroke-width="5"/>`;
    // portas dos lados (perspectiva) e arandelas
    const L = (u) => ({ x: -300 + (fx - fw / 2 + 300) * u, top: -300 + (fy - fh / 2 + 300) * u, bot: 1300 + (fy + fh / 2 - 1300) * u });
    [0.28, 0.56, 0.78].forEach((u, k) => {
      const a = L(u), b = L(u + 0.1);
      const pa = (p, h) => p.top + (p.bot - p.top) * h;
      f += `<path d="M${a.x} ${pa(a, 0.35)} L${b.x} ${pa(b, 0.35)} L${b.x} ${pa(b, 0.92)} L${a.x} ${pa(a, 0.92)} Z" fill="#8a5a36" stroke="${C}" stroke-width="4"/><circle cx="${b.x - 8 * (1 - u)}" cy="${pa(b, 0.65)}" r="${6 * (1 - u) + 3}" fill="#c9a227"/>`;
      f += `<path d="M${2 * fx - a.x} ${pa(a, 0.35)} L${2 * fx - b.x} ${pa(b, 0.35)} L${2 * fx - b.x} ${pa(b, 0.92)} L${2 * fx - a.x} ${pa(a, 0.92)} Z" fill="#8a5a36" stroke="${C}" stroke-width="4"/>`;
      if (k < 2) { const s = L(u + 0.16); f += `<g transform="translate(${s.x} ${pa(s, 0.25)}) scale(${1.2 - u})"><circle r="50" fill="#ffd27a" opacity=".25"/><path d="M-16 0 L16 0 L10 -26 L-10 -26 Z" fill="#fff1c8" stroke="${C}" stroke-width="3"/></g><g transform="translate(${2 * fx - s.x} ${pa(s, 0.25)}) scale(${1.2 - u})"><circle r="50" fill="#ffd27a" opacity=".25"/><path d="M-16 0 L16 0 L10 -26 L-10 -26 Z" fill="#fff1c8" stroke="${C}" stroke-width="3"/></g>`; }
    });
    f += `<g transform="translate(${fx} ${fy - fh / 2 - 60})"><rect x="-120" y="-24" width="240" height="48" rx="10" fill="#2E2A33"/>${T(0, 12, "ALA LESTE", 30, "#F5C542")}</g>`;
    return camadas(id, f, "", "");
  }

  /* ================= OBJETOS ================= */
  function pastaConfidencial(o = {}) {  // pasta fechada (id-fechada) / aberta com a pagina de fofoca (id-aberta)
    const id = o.id || "pasta";
    return `<g id="${id}"><g id="${id}-aberta"><rect x="-330" y="-200" width="660" height="400" rx="10" fill="#d9b06a" stroke="${C}" stroke-width="7"/><path d="M0 -200 V200" stroke="#b58a46" stroke-width="6"/>
        <rect x="-300" y="-170" width="280" height="350" fill="#fff" stroke="${C}" stroke-width="4"/><rect x="-300" y="-170" width="280" height="50" fill="#e2544f"/>${T(-160, -136, "@fofoca.total", 22, "#fff")}
        ${[0, 1, 2, 3, 4].map(k => `<rect x="-280" y="${-100 + k * 40}" width="${240 - (k % 2) * 60}" height="14" rx="4" fill="#d9dde6"/>`).join("")}<rect x="-280" y="100" width="120" height="60" fill="#3a3540"/>
        <rect x="20" y="-170" width="280" height="350" fill="#f7f4ef" stroke="${C}" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map(k => `<rect x="40" y="${-140 + k * 44}" width="${230 - (k % 3) * 50}" height="14" rx="4" fill="#d9dde6"/>`).join("")}${T(160, 150, "fonte interna", 24, "#c25b4e")}</g>
      <g id="${id}-fechada"><rect x="-260" y="-200" width="520" height="400" rx="12" fill="#d9b06a" stroke="${C}" stroke-width="7"/><path d="M-260 -150 H-120 L-90 -200" fill="none" stroke="${C}" stroke-width="5"/>
        <g transform="rotate(-8)"><rect x="-210" y="-40" width="420" height="90" rx="10" fill="none" stroke="#d9333a" stroke-width="9"/>${T(0, 22, "CONFIDENCIAL", 56, "#d9333a")}</g></g></g>`;
  }
  function plantaCasa(o = {}) {  // planta da mansao (vista de cima) com a ala leste; janela alvo (id-janela) e linha vermelha (id-linha) saindo de (-560,-120)
    const id = o.id || "planta";
    let s = `<g id="${id}"><rect x="-420" y="-300" width="840" height="600" fill="#1f3a5a" stroke="#9fd0ea" stroke-width="6"/>`;
    for (let x = -400; x < 420; x += 40) s += `<path d="M${x} -300 V300" stroke="#2a4a6e" stroke-width="2"/>`;
    for (let y = -280; y < 300; y += 40) s += `<path d="M-420 ${y} H420" stroke="#2a4a6e" stroke-width="2"/>`;
    s += `<path d="M-360 -240 H360 V240 H-360 Z M-360 -40 H-60 M-60 -240 V240 M120 -240 V60 H360 M-360 120 H-60 M120 160 H360" fill="none" stroke="#e8f4fa" stroke-width="8"/>
      <rect x="120" y="-240" width="240" height="300" fill="#9fd0ea" opacity=".18"/>${T(240, -170, "ALA LESTE", 34, "#F5C542")}${T(-210, -130, "SALÃO", 28, "#cfe8ff")}${T(-210, 50, "COZINHA", 28, "#cfe8ff")}${T(30, 200, "HALL", 28, "#cfe8ff")}
      <g id="${id}-janela"><rect x="352" y="-150" width="24" height="90" fill="#F5C542" stroke="#e2544f" stroke-width="5"/><circle cx="364" cy="-105" r="54" fill="none" stroke="#e2544f" stroke-width="7"/></g>
      <g id="${id}-corredor">${[160, 230, 300].map((x, k) => `<g id="${id}-f${k}" transform="translate(${x} 0)"><circle cx="0" cy="-36" r="16" fill="#e8e9ee"/><path d="M-16 20 Q-16 -14 0 -14 Q16 -14 16 20 Z" fill="#e8e9ee"/></g>`).join("")}</g>
      <path id="${id}-linha" d="M-560 -120 L364 -105" stroke="#e2544f" stroke-width="8" stroke-dasharray="20 12" fill="none"/></g>`;
    return s;
  }
  function gradePixels(o = {}) {  // grade de pixels por cima de uma foto ampliada (500 x 380, centro 0,0)
    const id = o.id || "grade";
    let s = `<g id="${id}" opacity="${o.opacity ?? 0.5}">`;
    for (let x = -250; x <= 250; x += 25) s += `<path d="M${x} -250 V130" stroke="#fff" stroke-width="2"/>`;
    for (let y = -250; y <= 130; y += 25) s += `<path d="M-250 ${y} H250" stroke="#fff" stroke-width="2"/>`;
    for (let k = 0; k < 40; k++) s += `<rect x="${-250 + Math.floor(rnd(k) * 20) * 25}" y="${-250 + Math.floor(rnd(k + 50) * 15) * 25}" width="25" height="25" fill="${["#c98a5a", "#e8c89a", "#3a2a22", "#c25b4e"][k % 4]}" opacity=".35"/>`;
    return s + `</g>`;
  }
  function caixaPapelao(o = {}) {  // caixa de mudanca com porta-retratos e planta aparecendo (centro 0,0; ~ 300 x 220)
    const id = o.id || "caixa";
    return `<g id="${id}"><g transform="translate(-60 -110) rotate(-8)"><rect x="-50" y="-70" width="100" height="120" rx="6" fill="#a86b42" stroke="${C}" stroke-width="5"/><rect x="-36" y="-56" width="72" height="92" fill="#9fd8f0"/><circle cx="0" cy="-20" r="16" fill="#8a5a3b"/><path d="M-26 36 Q-26 6 0 6 Q26 6 26 36 Z" fill="#4a6a8a"/></g>
      <g transform="translate(70 -110)"><path d="M0 0 Q-20 -60 -10 -90 M0 0 Q20 -50 26 -80" stroke="#4f9a4a" stroke-width="8" fill="none"/><path d="M-26 0 L26 0 L20 30 L-20 30 Z" fill="#c9774a" stroke="${C}" stroke-width="4"/></g>
      <path d="M-150 -80 L150 -80 L140 110 L-140 110 Z" fill="#c9a06a" stroke="${C}" stroke-width="7"/><path d="M-150 -80 L-190 -130 L-110 -130 L-80 -80 Z M150 -80 L190 -130 L110 -130 L80 -80 Z" fill="#b58a52" stroke="${C}" stroke-width="5"/>
      <path d="M-80 -10 H80" stroke="#8a6a3a" stroke-width="4"/>${T(0, 60, "PESSOAL", 30, "#6b4a22")}</g>`;
  }
  function cloche(o = {}) {  // prato com tampa prateada (id-tampa) e o peixe embaixo (id-peixe). Centro na base do prato.
    const id = o.id || "cloche";
    return `<g id="${id}"><ellipse cx="0" cy="0" rx="230" ry="50" fill="#fff" stroke="${C}" stroke-width="7"/><ellipse cx="0" cy="-6" rx="170" ry="34" fill="#f2ede2"/>
      <g id="${id}-peixe"><path d="M-130 -16 Q-40 -76 70 -30 L130 -66 L120 -6 L130 46 L70 10 Q-40 50 -130 -16 Z" fill="#e8a05a" stroke="${C}" stroke-width="6"/><circle cx="-90" cy="-22" r="8" fill="${C}"/><path d="M-40 -40 Q-30 -16 -40 10 M0 -42 Q10 -16 0 14 M40 -36 Q48 -14 40 12" fill="none" stroke="#c97a3a" stroke-width="5"/>
        <path d="M-150 20 q20 -14 40 0 M120 30 q16 -16 36 0" stroke="#6fae5a" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="-160" cy="-10" r="12" fill="#F5C542" stroke="${C}" stroke-width="3"/></g>
      <g id="${id}-tampa"><path d="M-200 -20 Q-200 -260 0 -260 Q200 -260 200 -20 Z" fill="#d9dde6" stroke="${C}" stroke-width="8"/><path d="M-150 -70 Q-140 -200 -40 -230" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".7"/>
        <rect x="-214" y="-28" width="428" height="22" rx="10" fill="#c9ccd4" stroke="${C}" stroke-width="6"/><circle cx="0" cy="-274" r="22" fill="#c9ccd4" stroke="${C}" stroke-width="6"/></g></g>`;
  }

  Object.assign(Cn, { salaReuniao, corredorAlaLeste });
  Object.assign(O, { pastaConfidencial, plantaCasa, gradePixels, caixaPapelao, cloche });
})();

/* ===== Cenarios e objetos da parte 10 do video do trilionario (10/11/2026): tres da manha ===== */
(function () {
  const O = window.Objetos, Cn = window.Cenarios, C = O.C;
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const T = (x, y, txt, tam, cor = "#fff8e6", anc = "middle", extra = "") => `<text x="${x}" y="${y}" text-anchor="${anc}" style="${F};font-size:${tam}px" fill="${cor}" ${extra}>${txt}</text>`;
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const camadas = (id, f, m, fr) => `<g id="${id}"><g id="${id}-fundo">${f}</g><g id="${id}-meio">${m}</g><g id="${id}-frente">${fr}</g></g>`;
  const estrela = (x, y, r, op = 1) => `<path d="M${x} ${y - r} Q${x + r * 0.2} ${y - r * 0.2} ${x + r} ${y} Q${x + r * 0.2} ${y + r * 0.2} ${x} ${y + r} Q${x - r * 0.2} ${y + r * 0.2} ${x - r} ${y} Q${x - r * 0.2} ${y - r * 0.2} ${x} ${y - r} Z" fill="#fff8e6" opacity="${op}"/>`;

  /* ---------- CEU NOTURNO (c107, c108, c110): degrade azul-roxo, lua, estrelas em grupos (ids -e0..-e5 para acender em ondas)
     e uma constelacao (id -const, com as linhas em -const-linhas). Alto: vai de y -1800 a 1080 (a camera pode subir). ---------- */
  function ceuNoturno(o = {}) {
    const id = o.id || "ceu";
    let f = `<defs><linearGradient id="${id}-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0f2a"/><stop offset=".6" stop-color="#23204a"/><stop offset="1" stop-color="#4a3a6e"/></linearGradient></defs>
      <rect x="-300" y="-1900" width="2520" height="3100" fill="url(#${id}-g)"/><ellipse cx="960" cy="1150" rx="1600" ry="300" fill="#6a4a7e" opacity=".35"/>`;
    for (let g = 0; g < 6; g++) {
      f += `<g id="${id}-e${g}">`;
      for (let k = 0; k < 40; k++) { const s = g * 100 + k; f += rnd(s) > 0.85 ? estrela(-280 + rnd(s + 1) * 2480, -1850 + rnd(s + 2) * 2700, 6 + rnd(s + 3) * 6, 0.9) : `<circle cx="${-280 + rnd(s + 1) * 2480}" cy="${-1850 + rnd(s + 2) * 2700}" r="${1.5 + rnd(s + 4) * 2.5}" fill="#fff8e6" opacity="${0.5 + rnd(s + 5) * 0.5}"/>`; }
      f += `</g>`;
    }
    f += `<g transform="translate(1560 -200)"><circle r="90" fill="#f2ecd8" opacity=".95"/><circle r="140" fill="#f2ecd8" opacity=".08"/><circle cx="-26" cy="-20" r="16" fill="#d9d0b4" opacity=".6"/><circle cx="30" cy="20" r="10" fill="#d9d0b4" opacity=".6"/></g>`;
    const pts = [[700, 160], [820, 90], [950, 140], [1060, 60], [1180, 120], [1010, 250]];
    f += `<g id="${id}-const"><circle cx="940" cy="140" r="260" fill="#9fb8ff" opacity=".06"/><g id="${id}-const-linhas"><path d="M${pts.slice(0, 5).map(p => p.join(" ")).join(" L")} M950 140 L1010 250" fill="none" stroke="#cfe0ff" stroke-width="3" opacity=".55" stroke-dasharray="6 8"/></g>${pts.map(([x, y]) => estrela(x, y, 14) + `<circle cx="${x}" cy="${y}" r="26" fill="#cfe0ff" opacity=".18"/>`).join("")}</g>`;
    return camadas(id, f, "", "");
  }

  /* ---------- LAJE DO PREDIO ANTIGO (c109): ceu noturno atras, cidade simples com janelas acesas, mureta, caixa d'agua, antena, varal com o boleto (id -boleto).
     Piso da laje de y 760 a 1080 (o personagem deita em ~880). ---------- */
  function laje(o = {}) {
    const id = o.id || "laje";
    let f = Cn.ceuNoturno({ id: id + "-ceu" }).replace(/<g id="[^"]+-ceu"><g id="[^"]+-ceu-fundo">/, "").replace(/<\/g><g id="[^"]+-ceu-meio"><\/g><g id="[^"]+-ceu-frente"><\/g><\/g>$/, "");
    for (let k = 0; k < 14; k++) { const x = -300 + k * 190 + rnd(k) * 40, w = 140 + rnd(k + 1) * 60, h = 160 + rnd(k + 2) * 260; f += `<rect x="${x}" y="${640 - h}" width="${w}" height="${h + 40}" fill="#2e2a48" stroke="#1b1830" stroke-width="3"/>` + Array.from({ length: 10 }, (_, j) => rnd(k * 11 + j) > 0.5 ? `<rect x="${x + 16 + (j % 3) * (w / 3 - 4)}" y="${640 - h + 20 + Math.floor(j / 3) * 46}" width="${w / 3 - 20}" height="22" fill="#ffd98a" opacity=".7"/>` : "").join(""); }
    // piso da laje e mureta
    f += `<rect x="-300" y="740" width="2520" height="460" fill="#8a8e98"/>${Array.from({ length: 8 }, (_, k) => `<path d="M-300 ${780 + k * 50} H2220" stroke="#7a7e88" stroke-width="3"/>`).join("")}${Array.from({ length: 30 }, (_, k) => `<path d="M${-300 + k * 90} 740 L${(-300 + k * 90 - 960) * 1.6 + 960} 1200" stroke="#7a7e88" stroke-width="2"/>`).join("")}
      <rect x="-300" y="690" width="2520" height="60" fill="#b5b8c0" stroke="${C}" stroke-width="5"/><rect x="-300" y="682" width="2520" height="14" fill="#c9ccd4" stroke="${C}" stroke-width="4"/>`;
    // caixa d'agua, antena
    f += `<g transform="translate(1540 690)"><rect x="-40" y="-60" width="16" height="60" fill="#5a5f6a"/><rect x="104" y="-60" width="16" height="60" fill="#5a5f6a"/><rect x="-60" y="-220" width="200" height="160" rx="10" fill="#5fb8ff" stroke="${C}" stroke-width="6"/><ellipse cx="40" cy="-220" rx="100" ry="20" fill="#3f8ae8" stroke="${C}" stroke-width="5"/></g>
      <g transform="translate(300 690)"><path d="M0 0 V-300 M-60 -260 H60 M-40 -220 H40 M-80 -300 H80" stroke="#c9ccd4" stroke-width="7" fill="none"/></g>`;
    // varal com roupas e o boleto
    let m = `<path d="M620 760 V420 M1300 760 V420" stroke="#8a5a36" stroke-width="12"/><path d="M620 440 Q960 500 1300 440" stroke="${C}" stroke-width="3" fill="none"/>
      <rect x="680" y="452" width="90" height="110" rx="6" fill="#e2544f" stroke="${C}" stroke-width="4"/><rect x="800" y="466" width="70" height="80" rx="6" fill="#F5C542" stroke="${C}" stroke-width="4"/>
      <g id="${id}-boleto" transform="translate(1000 474)"><rect x="-90" y="0" width="180" height="120" rx="4" fill="#fff8e6" stroke="${C}" stroke-width="4"/><rect x="-90" y="0" width="180" height="26" fill="#3f6fa8"/>${T(0, 20, "ALUGUEL", 18, "#fff")}${[0, 1].map(k => `<rect x="-74" y="${40 + k * 22}" width="${120 - k * 30}" height="10" rx="3" fill="#d9dde6"/>`).join("")}
        <g transform="rotate(-12 0 90)"><rect x="-70" y="72" width="140" height="36" rx="6" fill="none" stroke="#d9333a" stroke-width="5"/>${T(0, 99, "ATRASADO", 22, "#d9333a")}</g><path d="M-30 0 v-14 M30 0 v-14" stroke="#e2544f" stroke-width="5"/></g>
      <rect x="1140" y="456" width="100" height="90" rx="6" fill="#6fae5a" stroke="${C}" stroke-width="4"/>`;
    return camadas(id, f, m, "");
  }

  /* ---------- PISTA PARTICULAR (c112): ceu claro e frio, hangar com "HANGAR 1", torre, biruta, pista com faixas. Chao em ~860. ---------- */
  function pistaParticular(o = {}) {
    const id = o.id || "pista";
    let f = `<rect x="-300" y="-300" width="2520" height="1160" fill="#cfe0ec"/><rect x="-300" y="300" width="2520" height="560" fill="#dce8f0"/>`;
    [[300, 120, 1], [1300, 80, 0.8], [1750, 180, 0.7]].forEach(([x, y, s]) => f += `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 40 Q0 10 30 12 Q40 -14 72 0 Q96 -10 110 14 Q140 14 138 40 Z" fill="#fff" stroke="${C}" stroke-width="4"/></g>`);
    f += `<path d="M-300 640 Q300 560 900 620 Q1500 560 2220 630 V860 H-300 Z" fill="#9fb89a" stroke="${C}" stroke-width="4"/>`;
    // hangar
    f += `<g transform="translate(1180 860)"><path d="M0 0 V-300 Q300 -460 600 -300 V0 Z" fill="#c9ccd4" stroke="${C}" stroke-width="7"/>${Array.from({ length: 9 }, (_, k) => `<path d="M${k * 66 + 36} 0 V${-300 - Math.sin(Math.PI * (k * 66 + 36) / 600) * 150}" stroke="#b5b8c0" stroke-width="4"/>`).join("")}
      <rect x="120" y="-220" width="360" height="220" fill="#3a3f4a" stroke="${C}" stroke-width="6"/><rect x="200" y="-330" width="200" height="50" rx="8" fill="#2E2A33"/>${T(300, -296, "HANGAR 1", 30, "#F5C542")}</g>`;
    // torre e biruta
    f += `<g transform="translate(320 860)"><rect x="-30" y="-360" width="60" height="360" fill="#e8e9ee" stroke="${C}" stroke-width="6"/><path d="M-90 -360 L90 -360 L70 -460 L-70 -460 Z" fill="#9fd0ea" stroke="${C}" stroke-width="6"/><rect x="-100" y="-480" width="200" height="24" rx="6" fill="#5a5f6a" stroke="${C}" stroke-width="5"/></g>
      <g transform="translate(860 860)"><path d="M0 0 V-220" stroke="#8a8e98" stroke-width="8"/><path d="M0 -220 L120 -200 L120 -170 L0 -180 Z" fill="#f29e4c" stroke="${C}" stroke-width="4"/><path d="M40 -214 V-176 M80 -207 V-172" stroke="#fff" stroke-width="8"/></g>`;
    // pista
    f += `<rect x="-300" y="860" width="2520" height="340" fill="#5a5f6a"/><path d="M-300 860 H2220" stroke="${C}" stroke-width="5"/>${Array.from({ length: 14 }, (_, k) => `<rect x="${-260 + k * 180}" y="1000" width="110" height="14" fill="#f7f8fb"/>`).join("")}<path d="M-300 900 H2220 M-300 1160 H2220" stroke="#F5C542" stroke-width="6"/>`;
    return camadas(id, f, "", "");
  }

  /* ================= OBJETOS ================= */
  function contornoApe(o = {}) {  // contorno tracejado do apartamento antigo (no chao, perspectiva), com rotulo (id-rotulo)
    const id = o.id || "contApe";
    return `<g id="${id}"><path d="M-260 -60 L260 -60 L360 120 L-360 120 Z" fill="#9fb8d8" opacity=".12"/><path d="M-260 -60 L260 -60 L360 120 L-360 120 Z M-60 -60 L-90 120 M140 -60 L170 120 M-300 20 H-75" fill="none" stroke="#cfe0ff" stroke-width="6" stroke-dasharray="18 12"/>
      <g id="${id}-rotulo"><rect x="-150" y="140" width="300" height="50" rx="10" fill="#2E2A33" opacity=".85"/>${T(0, 174, "seu apê antigo", 28, "#cfe0ff")}</g></g>`;
  }
  function relogioDigital(o = {}) {  // relogio digital de cabeceira com a hora (o.hora); dois pontos em id-pontos
    const id = o.id || "relDig", h = (o.hora || "3:00").split(":");
    return `<g id="${id}"><path d="M-200 110 L-180 -90 Q-176 -110 -150 -110 L150 -110 Q176 -110 180 -90 L200 110 Z" fill="#2b2a31" stroke="${C}" stroke-width="8"/><rect x="-160" y="-80" width="320" height="150" rx="12" fill="#14121a"/>
      ${T(-40, 40, h[0], 130, "#ff4a3a", "end")}<g id="${id}-pontos"><circle cx="-14" cy="-6" r="10" fill="#ff4a3a"/><circle cx="-14" cy="30" r="10" fill="#ff4a3a"/></g>${T(10, 40, h[1], 130, "#ff4a3a", "start")}
      <circle cx="0" cy="0" r="220" fill="#ff4a3a" opacity=".07"/><rect x="-200" y="110" width="400" height="16" rx="6" fill="#1b1a20"/></g>`;
  }
  function telaRec(o = {}) {  // moldura de camera de seguranca por cima da imagem (tela inteira 1920x1080, origem no canto): REC piscando (id-ponto), hora (o.hora)
    const id = o.id || "rec";
    let s = `<g id="${id}">`;
    for (let y = 0; y < 1080; y += 6) s += `<rect x="0" y="${y}" width="1920" height="2" fill="#000" opacity=".12"/>`;
    s += `<path d="M60 160 V60 H160 M1760 60 H1860 V160 M1860 920 V1020 H1760 M160 1020 H60 V920" fill="none" stroke="#fff" stroke-width="8"/>
      <g id="${id}-ponto"><circle cx="130" cy="120" r="18" fill="#ff3a3a"/></g>${T(165, 134, "REC", 44, "#fff", "start")}
      ${T(1830, 134, "CAM 02", 40, "#fff", "end")}${T(1830, 990, o.hora || "03:07:12", 44, "#fff", "end")}${T(90, 990, "CORREDOR LESTE", 36, "#fff", "start")}</g>`;
    return s;
  }

  Object.assign(Cn, { ceuNoturno, laje, pistaParticular });
  Object.assign(O, { contornoApe, relogioDigital, telaRec });
})();

/* ===== Objetos do c113 (11/11/2026, ajuste aprovado: piscina, quadra e adega precisam aparecer na fala) — objetos de chao (base em y 362) ===== */
(function () {
  const O = window.Objetos, C = O.C;
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };

  function piscina(o = {}) {  // piscina retangular em perspectiva, com borda, escada, espreguicadeira e guarda-sol fechado (pouco usada)
    const id = o.id || "pisc";
    let s = `<g id="${id}"><ellipse cx="0" cy="368" rx="330" ry="16" fill="#000" opacity=".12"/>
      <path d="M-300 362 L-240 210 L240 210 L300 362 Z" fill="#e8e2d4" stroke="${C}" stroke-width="7"/>
      <path d="M-262 346 L-214 228 L214 228 L262 346 Z" fill="#5fb8ff" stroke="${C}" stroke-width="5"/><path d="M-250 336 L-206 238 L206 238 L250 336 Z" fill="#7fcaff" opacity=".6"/>
      ${[0, 1, 2, 3].map(k => `<path d="M${-170 + k * 90} ${262 + k * 16} q20 -10 40 0 q20 10 40 0" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>`).join("")}
      <path d="M160 216 V180 M196 216 V180 M160 190 H196 M160 204 H196" stroke="#c9ccd4" stroke-width="7"/>`;
    s += `<g transform="translate(-330 362)"><path d="M-90 0 L-70 -60 L80 -60 L100 0" fill="none" stroke="${C}" stroke-width="7"/><path d="M-70 -60 L70 -60 L110 -110 L-30 -110 Z" fill="#f29e4c" stroke="${C}" stroke-width="6"/><path d="M-50 -60 V0 M60 -60 V0" stroke="${C}" stroke-width="6"/></g>
      <g transform="translate(360 362)"><path d="M0 0 V-260" stroke="#8a5a36" stroke-width="10"/><path d="M-14 -260 Q0 -120 14 -260 Z" fill="#e2544f" stroke="${C}" stroke-width="5"/><ellipse cx="0" cy="0" rx="40" ry="10" fill="#8a8e98" stroke="${C}" stroke-width="4"/></g></g>`;
    return s;
  }
  function quadraTenis(o = {}) {  // quadra em perspectiva, linhas brancas, rede, alambrado e folhas secas (nunca usada)
    const id = o.id || "quadra";
    let s = `<g id="${id}"><path d="M-380 362 L-260 170 L260 170 L380 362 Z" fill="#4f9a6a" stroke="${C}" stroke-width="7"/>
      <path d="M-330 344 L-240 186 L240 186 L330 344 Z" fill="#3f8a5a" stroke="#fff" stroke-width="6"/><path d="M-285 265 H285 M0 186 V344 M-262 304 H262 M-246 226 H246" stroke="#fff" stroke-width="5"/>
      <path d="M-300 262 L-300 220 L300 220 L300 262" fill="none" stroke="${C}" stroke-width="6"/>${Array.from({ length: 24 }, (_, k) => `<path d="M${-296 + k * 25} 222 V262" stroke="#2b2a31" stroke-width="2" opacity=".6"/>`).join("")}<path d="M-300 222 H300" stroke="#fff" stroke-width="8"/>
      ${Array.from({ length: 8 }, (_, k) => `<path d="M${-380 + k * 108} 362 V140" stroke="#8a8e98" stroke-width="7"/>`).join("")}<path d="M-380 150 H380" stroke="#8a8e98" stroke-width="6"/>
      ${Array.from({ length: 6 }, (_, r) => `<path d="M-380 ${170 + r * 34} H380" stroke="#8a8e98" stroke-width="2" opacity=".5"/>`).join("")}`;
    for (let k = 0; k < 26; k++) { const x = -300 + rnd(k) * 600, y = 196 + rnd(k + 40) * 150; s += `<ellipse cx="${x}" cy="${y}" rx="14" ry="7" transform="rotate(${rnd(k + 9) * 180} ${x} ${y})" fill="${["#c98a3a", "#a8541e", "#d9a24a"][k % 3]}" stroke="${C}" stroke-width="2"/>`; }
    return s + `</g>`;
  }
  function adega(o = {}) {  // entrada de adega em pedra, porta aberta, prateleiras com garrafas empoeiradas e teia
    const id = o.id || "adega";
    let s = `<g id="${id}"><path d="M-260 362 V40 Q0 -140 260 40 V362 Z" fill="#b5aa96" stroke="${C}" stroke-width="7"/>`;
    for (let r = 0; r < 9; r++) for (let k = 0; k < 6; k++) { const x = -250 + k * 90 + (r % 2) * 45, y = 330 - r * 36; if (Math.abs(x + 22) < 300) s += `<rect x="${x}" y="${y}" width="84" height="32" rx="6" fill="${(r + k) % 3 ? "#c9bfa8" : "#a89c86"}" stroke="#8a8070" stroke-width="2"/>`; }
    s += `<path d="M-170 362 V110 Q0 0 170 110 V362 Z" fill="#2b1f1a" stroke="${C}" stroke-width="7"/>`;
    [170, 240, 310].forEach(y => { s += `<rect x="-150" y="${y}" width="300" height="12" fill="#6e4426"/>`; for (let k = 0; k < 9; k++) s += `<g transform="translate(${-136 + k * 32} ${y})"><rect x="-9" y="-52" width="18" height="52" rx="6" fill="${["#3f6a3a", "#5a1a24", "#3a2a22"][k % 3]}" stroke="${C}" stroke-width="2"/><rect x="-4" y="-66" width="8" height="16" fill="#2b2a31"/><rect x="-9" y="-30" width="18" height="12" fill="#e8dcc0" opacity=".7"/></g>`; });
    for (let k = 0; k < 40; k++) s += `<circle cx="${-150 + rnd(k) * 300}" cy="${110 + rnd(k + 20) * 220}" r="3" fill="#d9d2c2" opacity=".55"/>`;
    s += `<path d="M120 110 L170 110 L170 160 M170 110 L130 150 M150 110 L170 130 M135 110 Q150 130 170 135" fill="none" stroke="#e8e9ee" stroke-width="2" opacity=".8"/>
      <path d="M170 362 L240 300 V60 L170 110 Z" fill="#6e4426" stroke="${C}" stroke-width="6"/><circle cx="222" cy="210" r="8" fill="#c9a227" stroke="${C}" stroke-width="3"/></g>`;
    return s;
  }
  Object.assign(O, { piscina, quadraTenis, adega });
})();

/* ===== Final do video (11/11/2026, ajuste aprovado: final com mais impacto): a janela acesa dele na mansao escura ===== */
(function () {
  const O = window.Objetos, C = O.C;
  function janelaAcesa(o = {}) {  // vidro amarelo aceso do tamanho de uma janela da fachada (80 x 100, centro 0,0) com brilho em volta; apagar a parte "luz"
    const id = o.id || "janAcesa", w = o.w || 80, h = o.h || 100;
    return `<g id="${id}"><g id="${id}-luz"><ellipse cx="0" cy="10" rx="${w * 1.6}" ry="${h * 1.3}" fill="#ffd27a" opacity=".22"/><ellipse cx="0" cy="0" rx="${w * 0.95}" ry="${h * 0.8}" fill="#ffe7a8" opacity=".35"/>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#ffe08a" stroke="${C}" stroke-width="4"/><path d="M0 ${-h / 2} V${h / 2} M${-w / 2} 0 H${w / 2}" stroke="${C}" stroke-width="4"/>
      <path d="M${-w / 2 + 4} ${-h / 2 + 4} Q${-w / 4} 0 ${-w / 2 + 6} ${h / 2 - 4}" fill="#f29e4c" opacity=".7"/><path d="M${w / 2 - 4} ${-h / 2 + 4} Q${w / 4} 0 ${w / 2 - 6} ${h / 2 - 4}" fill="#f29e4c" opacity=".7"/></g></g>`;
  }
  Object.assign(O, { janelaAcesa });
})();
