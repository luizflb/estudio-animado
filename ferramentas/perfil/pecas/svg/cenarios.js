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
