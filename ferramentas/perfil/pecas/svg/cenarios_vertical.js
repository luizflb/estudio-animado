/* ===== Cenarios VERTICAIS (1080x1920) para Shorts, 11/11/2026 =====
   Pedido de feedback: "quero o cenario todo ajustado para vertical" (nao recorte do horizontal).
   Mesmo traco, paleta e pecas dos cenarios horizontais, recompostos para 9:16: parede alta, piso fundo, objetos empilhados.
   Cada cenario devolve camadas fundo/meio/frente (id-fundo, id-meio, id-frente), como os horizontais.
   Linha do chao de cada um fica em CHAO_V (o gerador de fichas usa para encaixar personagens e objetos). */
(function () {
  const Cn = window.Cenarios, C = (window.ESTILO && window.ESTILO.contorno) || "#2E2A33";
  const F = "font-family:Nunito, sans-serif;font-weight:900";
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const camadas = (id, f, m, fr) => `<g id="${id}"><g id="${id}-fundo">${f}</g><g id="${id}-meio">${m}</g><g id="${id}-frente">${fr}</g></g>`;
  const livro = (x, y, w, h, cor) => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="2" fill="${cor}" stroke="${C}" stroke-width="3"/><path d="M${x + 3} ${y - h + 8} h${w - 6} M${x + 3} ${y - 10} h${w - 6}" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>`;
  window.CHAO_V = window.CHAO_V || {};

  /* ---------- QUARTO vertical: parede alta com janela, poster e quadro de cortica; piso fundo com tapete ---------- */
  window.CHAO_V.quartoV = 1380;
  function quartoV(o = {}) {
    const id = o.id || "quartoV", CH = 1380;
    let papel = "";
    for (let r = 0; r < 24; r++) for (let c = 0; c < 13; c++) { const x = c * 90 + (r % 2) * 45, y = 90 + r * 56; papel += `<path d="M${x} ${y - 9} l9 9 l-9 9 l-9 -9 Z" fill="#c8c2e3"/>`; }
    let piso = `<rect x="0" y="${CH}" width="1080" height="${1920 - CH}" fill="#c99a6b"/>`;
    for (let r = 0; r < 11; r++) { const y = CH + r * 50; piso += `<path d="M0 ${y} H1080" stroke="#a87a4e" stroke-width="4"/>`; for (let c = 0; c < 5; c++) { const x = (c * 260 + (r % 3) * 95) % 1080; piso += `<path d="M${x} ${y} V${y + 50}" stroke="#a87a4e" stroke-width="4"/>`; } piso += `<path d="M${(r * 331) % 900 + 60} ${y + 22} q30 -6 60 0" stroke="#b98a5c" stroke-width="3" fill="none"/>`; }
    // janela alta, com a cidade e o sol da manha
    const jx = 560, jy = 360, jw = 380, jh = 560;
    const janela = `<rect x="${jx}" y="${jy}" width="${jw}" height="${jh}" rx="6" fill="#f4efe4" stroke="${C}" stroke-width="6"/>
      <rect x="${jx + 20}" y="${jy + 20}" width="${jw - 40}" height="${jh - 40}" fill="#ffe7a8" stroke="${C}" stroke-width="5"/>
      <rect x="${jx + 20}" y="${jy + 240}" width="${jw - 40}" height="${jh - 260}" fill="#bfe1ee"/>
      <circle cx="${jx + 250}" cy="${jy + 150}" r="86" fill="#fff3c4" opacity="0.5"/><circle cx="${jx + 250}" cy="${jy + 150}" r="56" fill="#ffd36b" stroke="${C}" stroke-width="5"/>
      <path d="M${jx + 20} ${jy + jh - 20} V${jy + 380} h60 v-40 h60 v60 h50 v-90 h70 v100 h50 v-50 h50 V${jy + jh - 20} Z" fill="#9fb4cf" stroke="${C}" stroke-width="4" stroke-linejoin="round"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${jx + 40 + i * 40}" y="${jy + 440 + (i % 3) * 30}" width="14" height="18" fill="#f7f0c9"/>`).join("")}
      <path d="M${jx + 60} ${jy + 330} l60 -180" stroke="#fff" stroke-width="16" opacity="0.5"/><path d="M${jx + 100} ${jy + 330} l40 -110" stroke="#fff" stroke-width="7" opacity="0.5"/>
      <path d="M${jx + jw / 2} ${jy + 20} V${jy + jh - 20} M${jx + 20} ${jy + 260} H${jx + jw - 20}" stroke="${C}" stroke-width="6"/>
      <rect x="${jx - 10}" y="${jy + jh - 6}" width="${jw + 20}" height="22" rx="4" fill="#f4efe4" stroke="${C}" stroke-width="5"/>
      <g transform="translate(${jx + 310} ${jy + jh - 6}) scale(0.4)">${[-24, -8, 8, 24].map(a => `<path d="M0 -70 L${a * 1.6} ${-110 - Math.abs(a)}" stroke="#4f8f45" stroke-width="8"/><circle cx="${a * 1.6}" cy="${-110 - Math.abs(a)}" r="22" fill="#f29e4c" stroke="${C}" stroke-width="8"/><circle cx="${a * 1.6}" cy="${-110 - Math.abs(a)}" r="8" fill="#f5c542"/>`).join("")}<path d="M-34 -70 L34 -70 L26 0 L-26 0 Z" fill="#6fa8dc" stroke="${C}" stroke-width="10"/></g>`;
    const cortina = (x, d) => { const y0 = jy - 24, y1 = jy + jh + 70; let s = `<path d="M${x} ${y0} Q${x + d * 60} ${y0 + 260} ${x + d * 20} ${y1} L${x + d * 120} ${y1} Q${x + d * 150} ${y0 + 300} ${x + d * 150} ${y0} Z" fill="#f5c542" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>`; for (let i = 1; i < 5; i++) s += `<path d="M${x + d * i * 30} ${y0 + 4} Q${x + d * (i * 30 + 30)} ${y0 + 300} ${x + d * (20 + i * 24)} ${y1 - 4}" stroke="#d9a930" stroke-width="5" fill="none"/>`; return s + `<path d="M${x + d * 10} ${y0 + 300} Q${x + d * 80} ${y0 + 320} ${x + d * 150} ${y0 + 290}" stroke="${C}" stroke-width="10" fill="none"/><path d="M${x + d * 10} ${y0 + 300} Q${x + d * 80} ${y0 + 320} ${x + d * 150} ${y0 + 290}" stroke="#e2544f" stroke-width="5" fill="none"/>`; };
    const varao = `<rect x="${jx - 50}" y="${jy - 30}" width="${jw + 100}" height="12" rx="6" fill="#a86b42" stroke="${C}" stroke-width="4"/><circle cx="${jx - 50}" cy="${jy - 24}" r="12" fill="#a86b42" stroke="${C}" stroke-width="4"/><circle cx="${jx + jw + 50}" cy="${jy - 24}" r="12" fill="#a86b42" stroke="${C}" stroke-width="4"/>`;
    const poster = `<g transform="translate(250 560) rotate(-6) scale(0.95)"><rect x="-130" y="-170" width="260" height="330" fill="#fff8e6" stroke="${C}" stroke-width="6"/><rect x="-112" y="-150" width="224" height="220" fill="#9fcfc6" stroke="${C}" stroke-width="4"/><circle cx="40" cy="-90" r="36" fill="#f5c542" stroke="${C}" stroke-width="4"/><path d="M-112 70 L-50 -40 L-10 20 L30 -20 L112 70 Z" fill="#6d6a9c" stroke="${C}" stroke-width="4" stroke-linejoin="round"/><path d="M-50 -40 L-34 -12 L-50 -18 L-64 -14 Z" fill="#fff"/><text x="0" y="112" text-anchor="middle" style="${F};font-size:34px" fill="#2E2A33">SONHE</text><text x="0" y="146" text-anchor="middle" style="${F};font-size:34px" fill="#e2544f">GRANDE</text><circle cx="0" cy="-162" r="7" fill="#e2544f" stroke="${C}" stroke-width="3"/></g>`;
    const cortica = `<g transform="translate(110 150)"><rect x="0" y="0" width="250" height="180" rx="6" fill="#c9965a" stroke="${C}" stroke-width="6"/><rect x="12" y="12" width="226" height="156" fill="#d9ad74"/>${[[40, 40, -8, "#fff", "#9fcfc6"], [120, 30, 6, "#fff", "#f6d2bd"], [190, 80, -4, "#fff4c4", null], [60, 110, 5, "#fff", "#b9b3d9"]].map(([x, y, r, c1, c2]) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-28" y="-24" width="62" height="${c2 ? 70 : 52}" fill="${c1}" stroke="${C}" stroke-width="3"/>${c2 ? `<rect x="-22" y="-18" width="50" height="44" fill="${c2}"/><circle cx="2" cy="2" r="11" fill="#f2c6a0" stroke="${C}" stroke-width="2"/><path d="M-10 26 q12 -14 24 0" fill="#4a90d9" stroke="${C}" stroke-width="2"/>` : `<path d="M-20 -8 h46 M-20 4 h40 M-20 16 h30" stroke="#8a8e98" stroke-width="3"/>`}<circle cx="3" cy="-22" r="5" fill="#e2544f" stroke="${C}" stroke-width="2"/></g>`).join("")}</g>`;
    const prateleira = `<g transform="translate(90 860)"><rect x="0" y="0" width="300" height="16" rx="3" fill="#a86b42" stroke="${C}" stroke-width="4"/><path d="M30 16 l0 26 l20 0 M270 16 l0 26 l-20 0" stroke="${C}" stroke-width="4" fill="none"/>
      ${livro(18, 0, 22, 70, "#e2544f")}${livro(40, 0, 18, 60, "#4a90d9")}${livro(58, 0, 26, 76, "#6fae5a")}${livro(84, 0, 20, 64, "#f5c542")}<g transform="rotate(14 108 0)">${livro(108, 0, 20, 66, "#b07cc6")}</g>
      <path d="M190 0 L188 -30 Q220 -40 252 -30 L250 0 Z" fill="#f5c542" stroke="${C}" stroke-width="4"/><rect x="205" y="-50" width="30" height="22" fill="#f5c542" stroke="${C}" stroke-width="4"/><text x="220" y="-8" text-anchor="middle" style="${F};font-size:14px" fill="${C}">1º</text></g>`;
    const relogioP = `<g transform="translate(870 190)"><circle r="62" fill="#f4efe4" stroke="${C}" stroke-width="6"/><circle r="50" fill="#fff" stroke="#ddd6ee" stroke-width="3"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(k => `<path d="M${Math.sin(k * 0.5236) * 42} ${-Math.cos(k * 0.5236) * 42} L${Math.sin(k * 0.5236) * 48} ${-Math.cos(k * 0.5236) * 48}" stroke="${C}" stroke-width="4"/>`).join("")}<path d="M0 0 L0 -32 M0 0 L22 8" stroke="${C}" stroke-width="6" stroke-linecap="round"/><circle r="5" fill="#e2544f"/></g>`;
    const tomada = `<rect x="120" y="1270" width="40" height="56" rx="6" fill="#f4efe4" stroke="${C}" stroke-width="4"/><circle cx="133" cy="1298" r="4" fill="${C}"/><circle cx="147" cy="1298" r="4" fill="${C}"/>`;
    const luz = `<path d="M${jx + 20} ${jy + 20} L${jx + jw - 20} ${jy + 20} L1080 1920 L260 1920 Z" fill="#fff7d6" opacity="0.14"/>`;
    const tapete = `<ellipse cx="540" cy="1660" rx="500" ry="120" fill="#9fcfc6" stroke="${C}" stroke-width="6"/><ellipse cx="540" cy="1660" rx="400" ry="92" fill="none" stroke="#f4efe4" stroke-width="10"/><ellipse cx="540" cy="1660" rx="285" ry="64" fill="none" stroke="#7fb8ae" stroke-width="10"/><ellipse cx="540" cy="1660" rx="160" ry="34" fill="#f4efe4" opacity="0.7"/>`;
    const fundo = `<rect width="1080" height="${CH}" fill="#B9B3D9"/>${papel}
      <rect x="0" y="0" width="1080" height="44" fill="#f4efe4" stroke="${C}" stroke-width="5"/><rect x="0" y="44" width="1080" height="10" fill="#ddd6ee"/>
      ${piso}<rect x="0" y="${CH - 30}" width="1080" height="34" fill="#f4efe4" stroke="${C}" stroke-width="5"/>
      ${janela}${varao}${cortina(jx - 50, 1)}${cortina(jx + jw + 50, -1)}${poster}${cortica}${prateleira}${relogioP}${tomada}${luz}${tapete}`;
    // criado-mudo com abajur (o despertador vai em cima dele: topo em y 1190)
    const criado = `<g transform="translate(830 0)"><rect x="0" y="1200" width="210" height="190" rx="6" fill="#d49a63" stroke="${C}" stroke-width="6"/><rect x="-12" y="1190" width="234" height="22" rx="5" fill="#b07a48" stroke="${C}" stroke-width="5"/>
      <rect x="18" y="1230" width="174" height="60" rx="4" fill="#dfab76" stroke="${C}" stroke-width="4"/><circle cx="105" cy="1260" r="8" fill="#f5c542" stroke="${C}" stroke-width="3"/>
      <rect x="18" y="1306" width="174" height="60" rx="4" fill="#dfab76" stroke="${C}" stroke-width="4"/><circle cx="105" cy="1336" r="8" fill="#f5c542" stroke="${C}" stroke-width="3"/>
      <ellipse cx="160" cy="1080" rx="70" ry="22" fill="#fff3c4" opacity="0.45"/><path d="M140 1190 L150 1140 L170 1140 L180 1190 Z" fill="#9fcfc6" stroke="${C}" stroke-width="4"/><path d="M160 1140 V1060" stroke="${C}" stroke-width="5"/>
      <path d="M114 1066 L206 1066 L186 994 L134 994 Z" fill="#f6d2bd" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M130 1020 h60 M124 1044 h72" stroke="#e8b89c" stroke-width="5"/></g>`;
    const cesto = `<g transform="translate(-380 680)"><path d="M440 802 Q470 760 500 790 Q520 750 556 800 Z" fill="#4a90d9" stroke="${C}" stroke-width="4"/><path d="M420 920 L436 800 L560 800 L576 920 Z" fill="#e3c18a" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${438 + i * 2} ${822 + i * 20} H${560 - i * 2}" stroke="#c49f62" stroke-width="4"/>`).join("")}</g>`;
    const mochila = `<g transform="translate(960 1640) rotate(-8) scale(1.1)"><path d="M-60 0 L-56 -150 Q-50 -190 0 -192 Q50 -190 56 -150 L60 0 Z" fill="#e2544f" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><rect x="-40" y="-90" width="80" height="70" rx="10" fill="#c43f3b" stroke="${C}" stroke-width="4"/><path d="M-40 -66 h80" stroke="${C}" stroke-width="3"/><circle cx="0" cy="-56" r="5" fill="#f5c542"/><path d="M-20 -192 q20 -24 40 0" fill="none" stroke="${C}" stroke-width="6"/></g>`;
    const meio = `${criado}${cesto}${mochila}${Cn.tenis(400, 1760, -12, "#4a90d9")}${Cn.tenis(520, 1790, 18, "#4a90d9")}`;
    const frente = `${Cn.planta(70, 1930, 1.5)}<g transform="translate(860 1880) rotate(-10)"><ellipse cx="0" cy="0" rx="60" ry="18" fill="#6fae5a" stroke="${C}" stroke-width="4"/><path d="M-26 -6 Q0 -28 26 -6" fill="none" stroke="#4f8f45" stroke-width="7"/></g>`;
    return camadas(id, fundo, meio, frente);
  }

  /* ---------- CONVES DO IATE vertical: ceu de por do sol alto, sol no horizonte, mar com reflexo, guarda-corpo, deck fundo ---------- */
  window.CHAO_V.conveIateV = 1240;
  function conveIateV(o = {}) {
    const id = o.id || "iateV", CH = 1240, MAR = 980;
    const faixas = [["#2f2a5e", 0], ["#4b3f7a", 180], ["#7a4f8f", 380], ["#b65c84", 560], ["#e2766c", 720], ["#f29e5c", 850], ["#f9c46a", 930]];
    let ceu = faixas.map(([c, y], i) => `<rect x="0" y="${y}" width="1080" height="${(faixas[i + 1] ? faixas[i + 1][1] : MAR) - y + 2}" fill="${c}"/>`).join("");
    for (let k = 0; k < 26; k++) ceu += `<circle cx="${rnd(k) * 1080}" cy="${20 + rnd(k + 50) * 360}" r="${1.5 + rnd(k + 9) * 2.5}" fill="#fff" opacity="${0.4 + rnd(k + 3) * 0.5}"/>`;
    ceu += `<circle cx="640" cy="${MAR}" r="190" fill="#ffd36b" opacity="0.28"/><circle cx="640" cy="${MAR}" r="130" fill="#ffd36b" stroke="${C}" stroke-width="5"/><circle cx="640" cy="${MAR}" r="96" fill="#ffe7a0"/>`;
    ceu += [[60, 300, 300], [560, 470, 280], [180, 640, 360], [700, 760, 260], [80, 820, 220]].map(([x, y, w]) => `<path d="M${x} ${y} h${w} q20 0 20 12 h${-w - 60} q0 -12 20 -12 Z" fill="#f6b8a0" opacity="0.8"/>`).join("");
    ceu += `<path d="M300 520 q14 -12 28 0 q14 -12 28 0" fill="none" stroke="${C}" stroke-width="4"/><path d="M380 470 q10 -9 20 0 q10 -9 20 0" fill="none" stroke="${C}" stroke-width="3"/>`;
    let mar = `<rect x="0" y="${MAR}" width="1080" height="${CH - MAR}" fill="#3d5f8f"/><path d="M0 ${MAR} H1080" stroke="${C}" stroke-width="4"/>`;
    for (let i = 0; i < 30; i++) { const y = MAR + 16 + (i % 10) * 24, x = rnd(i) * 1040; mar += `<path d="M${x} ${y} h${30 + rnd(i + 3) * 70}" stroke="#5b80b0" stroke-width="4" stroke-linecap="round"/>`; }
    for (let i = 0; i < 10; i++) mar += `<rect x="${640 - 90 + (i % 3) * 10 + rnd(i) * 40}" y="${MAR + 12 + i * 22}" width="${170 - i * 12}" height="8" rx="4" fill="#ffd36b" opacity="${0.9 - i * 0.08}"/>`;
    mar += `<g transform="translate(150 ${MAR - 6})"><path d="M0 0 h70 l-10 14 h-50 Z" fill="#f4efe4" stroke="${C}" stroke-width="3"/><path d="M34 0 V-46 L60 -4 Z" fill="#fff" stroke="${C}" stroke-width="3"/></g>`;
    let deck = `<rect x="0" y="${CH}" width="1080" height="${1920 - CH}" fill="#b07a4a"/>`;
    for (let i = -14; i <= 14; i++) deck += `<path d="M${540 + i * 26} ${CH} L${540 + i * 150} 1920" stroke="#93613a" stroke-width="5"/>`;
    for (let i = 0; i < 6; i++) deck += `<path d="M0 ${CH + 50 + i * 90 + i * i * 10} H1080" stroke="#9d6b40" stroke-width="3" opacity="0.6"/>`;
    deck += `<path d="M0 ${CH} H1080" stroke="${C}" stroke-width="5"/>`;
    let grade = "";
    const g0 = CH - 150;
    [g0 + 50, g0 + 100].forEach(y => grade += `<path d="M0 ${y} H1080" stroke="${C}" stroke-width="7"/><path d="M0 ${y} H1080" stroke="#bfc3cc" stroke-width="3"/>`);
    for (let x = 60; x < 1080; x += 190) grade += `<rect x="${x - 8}" y="${g0 - 4}" width="16" height="156" fill="#d9dce3" stroke="${C}" stroke-width="4"/>`;
    grade += `<path d="M0 ${g0} H1080" stroke="${C}" stroke-width="16"/><path d="M0 ${g0} H1080" stroke="#d9dce3" stroke-width="9"/><path d="M0 ${g0 - 4} H1080" stroke="#fff" stroke-width="2"/>`;
    for (let x = 60; x < 1080; x += 190) grade += `<circle cx="${x}" cy="${g0}" r="10" fill="#e9ebf0" stroke="${C}" stroke-width="4"/>`;
    const a = (g) => g * Math.PI / 180;
    const boia = `<g transform="translate(150 ${g0 + 70})"><circle cx="0" cy="0" r="62" fill="#fff8e6" stroke="${C}" stroke-width="6"/>${[0, 90, 180, 270].map(g => `<path d="M${Math.cos(a(g - 22)) * 62} ${Math.sin(a(g - 22)) * 62} A62 62 0 0 1 ${Math.cos(a(g + 22)) * 62} ${Math.sin(a(g + 22)) * 62} L${Math.cos(a(g + 22)) * 30} ${Math.sin(a(g + 22)) * 30} A30 30 0 0 0 ${Math.cos(a(g - 22)) * 30} ${Math.sin(a(g - 22)) * 30} Z" fill="#e2544f" stroke="${C}" stroke-width="4"/>`).join("")}<circle cx="0" cy="0" r="30" fill="#b07a4a" stroke="${C}" stroke-width="6"/><text x="0" y="-40" text-anchor="middle" style="${F};font-size:15px" fill="${C}">TRI-1</text></g>`;
    const poste = (x) => `<circle cx="${x}" cy="${g0 - 140}" r="56" fill="#fff3c4" opacity="0.3"/><rect x="${x - 7}" y="${g0 - 120}" width="14" height="${CH - g0 + 120}" fill="#d9dce3" stroke="${C}" stroke-width="4"/><path d="M${x - 26} ${g0 - 120} h52 l-8 -50 h-36 Z" fill="#fff3c4" stroke="${C}" stroke-width="4"/><path d="M${x - 30} ${g0 - 170} h60" stroke="${C}" stroke-width="6"/>`;
    const mastro = `<path d="M1010 ${g0 - 4} V160" stroke="${C}" stroke-width="12"/><path d="M1010 ${g0 - 4} V160" stroke="#e9ebf0" stroke-width="6"/><path d="M1010 170 L900 200 L1010 236 Z" fill="#e2544f" stroke="${C}" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map(k => `<path d="M1010 ${260 + k * 90} L${1080} ${300 + k * 90}" stroke="${C}" stroke-width="2" opacity=".6"/>`).join("")}`;
    const fundo = `${ceu}${mar}${deck}${mastro}${grade}${boia}${poste(70)}`;
    const balde = `<g transform="translate(930 ${CH + 120})"><path d="M14 -230 L24 -330 L44 -330 L40 -230 Z" fill="#2f5b3a" stroke="${C}" stroke-width="4"/><rect x="24" y="-352" width="18" height="24" fill="#e0b23e" stroke="${C}" stroke-width="3"/><path d="M-10 0 V-140 M10 0 V-140 M-50 0 h100" stroke="${C}" stroke-width="7"/><path d="M-10 0 V-140 M10 0 V-140" stroke="#d9dce3" stroke-width="3"/><path d="M-60 -140 L60 -140 L50 -230 L-50 -230 Z" fill="#d9dce3" stroke="${C}" stroke-width="5"/>${[-30, -6, 20].map(x => `<path d="M${x} -232 l14 -18 l14 18 Z" fill="#dff3fb" stroke="${C}" stroke-width="3"/>`).join("")}</g>`;
    const meio = `${Cn.planta(70, CH + 110, 1.15, "#f4efe4")}${balde}`;
    const corda = `<g transform="translate(940 1850)">${[80, 62, 44, 26].map(r => `<ellipse cx="0" cy="0" rx="${r}" ry="${r * 0.35}" fill="${r === 80 ? "#d9b48a" : "none"}" stroke="${C}" stroke-width="9"/><ellipse cx="0" cy="0" rx="${r}" ry="${r * 0.35}" fill="none" stroke="#e8cf9e" stroke-width="5"/>`).join("")}</g>`;
    const espreg = `<g transform="translate(-60 1900) scale(1.1)"><path d="M0 0 L300 -20 L420 -150" stroke="${C}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M0 0 L300 -20 L420 -150" stroke="#f4efe4" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M10 -6 L296 -28 L410 -154 L404 -164 L290 -40 L6 -18 Z" fill="#4a90d9" stroke="${C}" stroke-width="4"/></g>`;
    return camadas(id, fundo, meio, corda + espreg);
  }

  Object.assign(Cn, { quartoV, conveIateV });

  /* ---------- RECOMPOSICAO VERTICAL dos outros cenarios ----------
     O miolo do cenario horizontal (largura 1080 a partir de x0) desce dy px; acima e abaixo entram partes NOVAS:
     ceu/parede/teto e chao/rua continuados (degrade ou faixa do proprio cenario repetida) + pecas desenhadas para o vertical
     (lustres, predios altos, nuvens, tapetes, moveis). Mapeamento das fichas: x_v = x - x0, y_v = y + dy (mesma escala). */
  const NS = "http://www.w3.org/2000/svg";
  function partes(str, id) {
    const s = document.createElementNS(NS, "svg"); s.innerHTML = str;
    const q = (k) => { const e = s.querySelector(`#${CSS.escape(id + "-" + k)}`); return e ? e.innerHTML : ""; };
    return [q("fundo"), q("meio"), q("frente")];
  }
  let NCL = 0;
  function clone(F, x0, ty, clipY, clipH) {  // copia do fundo (ids renomeados) recortada numa faixa do quadro vertical
    const n = ++NCL, suf = `-k${n}`;
    const G = F.replace(/ id="([^"]+)"/g, (m, a) => ` id="${a}${suf}"`).replace(/url\(#([^)]+)\)/g, (m, a) => `url(#${a}${suf})`);
    return `<clipPath id="clv${n}"><rect x="0" y="${clipY}" width="1080" height="${clipH}"/></clipPath><g clip-path="url(#clv${n})"><g transform="translate(${-x0} ${ty})">${G}</g></g>`;
  }
  function grad(id, y0, y1, c1, c2) {
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect x="0" y="${y0}" width="1080" height="${y1 - y0}" fill="url(#${id})"/>`;
  }
  function recompor(nome, spec) {
    const fn = function (o = {}) {
      const id = o.id || nome + "V", x0 = o.x0 ?? spec.x0, dy = o.dy ?? spec.dy;
      const base = Object.assign({}, spec.opts || {}, o, { id: id + "-h" });
      const [F, M, FR] = partes(Cn[nome](base), id + "-h");
      let cima = "", baixo = "";
      const top = spec.cima || {}, bot = spec.baixo || {};
      if (top.grad) cima += grad(id + "-gc", 0, dy + (top.ate ?? 40), top.grad[0], top.grad[1]);
      if (top.faixa) { const [ya, h] = top.faixa; for (let k = 1; dy + ya - (k - 1) * h > -h; k++) cima += clone(F, x0, dy - k * h, dy + ya - k * h, h + 1); }
      const yb0 = dy + (bot.de ?? 1080);
      if (bot.grad) baixo += grad(id + "-gb", yb0 - 2, 1920, bot.grad[0], bot.grad[1]);
      if (bot.faixa) { const [yb, h] = bot.faixa; for (let k = 1; dy + yb + k * h < 1920 + h; k++) baixo += clone(F, x0, dy + k * h, dy + yb + (k - 1) * h + h, h + 1); }
      const deco = (f) => (typeof f === "function" ? f(o, dy, x0) : f || "");
      const fundo = cima + deco(spec.decoCima) + `<g transform="translate(${-x0} ${dy})">${F}</g>` + baixo + deco(spec.decoBaixo);
      const meio = `<g transform="translate(${-x0} ${dy})">${M}</g>` + deco(spec.decoMeio);
      const frente = `<g transform="translate(${-x0} ${dy})">${FR}</g>` + deco(spec.decoFrente);
      return camadas(id, fundo, meio, frente);
    };
    fn.x0 = spec.x0; fn.dy = spec.dy;
    Cn[nome + "V"] = fn;
  }
  window.RecomporV = recompor;

  // pecas para as partes novas
  const nuvem = (x, y, s) => Cn.nuvem ? Cn.nuvem(x, y, s) : "";
  const passaro = (x, y, f) => Cn.passaro ? Cn.passaro(x, y, f) : "";
  const torre = (x, w, topo, chao, cor) => { let s = `<rect x="${x}" y="${topo}" width="${w}" height="${chao - topo}" fill="${cor}" stroke="${C}" stroke-width="5"/>`; for (let y = topo + 24; y < chao - 10; y += 46) s += `<path d="M${x + 10} ${y} h${w - 20}" stroke="#7f9fb5" stroke-opacity=".5" stroke-width="3"/>`; for (let xx = x + 34; xx < x + w - 8; xx += 40) s += `<path d="M${xx} ${topo + 10} V${chao - 6}" stroke="#7f9fb5" stroke-opacity=".35" stroke-width="2"/>`; return s + `<path d="M${x + w * .2} ${topo + 30} L${x + w * .6} ${topo + 220}" stroke="#fff" stroke-width="6" opacity=".45"/>`; };
  const antena = (x, topo) => `<path d="M${x} ${topo} V${topo - 90} M${x - 20} ${topo} L${x} ${topo - 60} L${x + 20} ${topo}" stroke="${C}" stroke-width="5" fill="none"/><circle cx="${x}" cy="${topo - 94}" r="8" fill="#e2544f" stroke="${C}" stroke-width="3"/>`;
  const pendente = (x, y0, y, cor = "#f5c542") => `<path d="M${x} ${y0} V${y - 40}" stroke="${C}" stroke-width="4"/><ellipse cx="${x}" cy="${y + 40}" rx="120" ry="40" fill="#fff3c4" opacity=".35"/><path d="M${x - 70} ${y} Q${x} ${y - 70} ${x + 70} ${y} Z" fill="${cor}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="${x}" cy="${y + 4}" rx="22" ry="10" fill="#fff8d6" stroke="${C}" stroke-width="3"/>`;
  const teto = (y, cor, cor2) => `<rect x="0" y="0" width="1080" height="${y}" fill="${cor}"/><rect x="0" y="${y}" width="1080" height="22" fill="${cor2}" stroke="${C}" stroke-width="5"/><rect x="0" y="${y + 22}" width="1080" height="10" fill="${cor2}" opacity=".5"/>`;
  const quadro = (x, y, w, h, cor, moldura = "#d9a93a") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${moldura}" stroke="${C}" stroke-width="6"/><rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="${h - 28}" fill="${cor}"/><path d="M${x + 14} ${y + h - 14} L${x + w * .4} ${y + h * .45} L${x + w * .6} ${y + h * .65} L${x + w * .75} ${y + h * .5} L${x + w - 14} ${y + h - 14} Z" fill="#6d6a9c" opacity=".8"/><circle cx="${x + w * .72}" cy="${y + h * .3}" r="${w * .08}" fill="#f5c542"/>`;
  const faixasRua = (y0, y1) => { let s = `<rect x="0" y="${y0}" width="1080" height="${y1 - y0}" fill="#4b4a55"/>`; for (let x = 20; x < 1080; x += 260) s += `<rect x="${x}" y="${y0 + (y1 - y0) * .55}" width="150" height="16" rx="4" fill="#f2c94c" stroke="${C}" stroke-width="3"/>`; for (let i = 0; i < 24; i++) s += `<circle cx="${rnd(i + 7) * 1080}" cy="${y0 + 10 + rnd(i + 31) * (y1 - y0 - 20)}" r="3" fill="#5a5965"/>`; return s + `<ellipse cx="820" cy="${y0 + (y1 - y0) * .3}" rx="50" ry="14" fill="#3b3a44" stroke="${C}" stroke-width="4"/>`; };
  const ceuCidade = (dy, c1, c2, base = 0) => grad("gcc" + dy + base, 0, dy + 60, c1, c2) + nuvem(60, 80, 1.1) + nuvem(700, 180, .9) + nuvem(360, 330, .7) + passaro(560, 260) + passaro(610, 248, -1);
  const piso = (y0, y1, cor, linha, passo = 60) => { let s = `<rect x="0" y="${y0}" width="1080" height="${y1 - y0}" fill="${cor}"/>`; for (let y = y0 + 20, i = 0; y < y1; y += passo + i * 6, i++) s += `<path d="M0 ${y} H1080" stroke="${linha}" stroke-width="4"/>`; return s; };
  const tapeteRet = (x, y, w, h, c1, c2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${c1}" stroke="${C}" stroke-width="5"/><rect x="${x + 20}" y="${y + 16}" width="${w - 40}" height="${h - 32}" rx="6" fill="none" stroke="${c2}" stroke-width="6" stroke-dasharray="18 12"/>`;

  const listras = (y1, cor, cl, passo = 90, w = 10) => { let s = `<rect x="0" y="0" width="1080" height="${y1}" fill="${cor}"/>`; for (let x = 0; x < 1080; x += passo) s += `<rect x="${x}" y="0" width="${w}" height="${y1}" fill="${cl}"/>`; return s; };
  const paineis = (y1, cor, cl, pw = 240, ph = 180) => { let s = `<rect x="0" y="0" width="1080" height="${y1}" fill="${cor}"/>`; for (let x = -60; x < 1080; x += pw) for (let y = y1 - ph; y > -ph; y -= ph) s += `<rect x="${x + 6}" y="${y + 6}" width="${pw - 12}" height="${ph - 12}" rx="6" fill="none" stroke="${cl}" stroke-width="5"/>`; return s; };
  const azulejo = (y1, cor, cl, p = 60) => { let s = `<rect x="0" y="0" width="1080" height="${y1}" fill="${cor}"/>`; for (let y = y1; y > 0; y -= p) s += `<path d="M0 ${y} H1080" stroke="${cl}" stroke-width="4"/>`; for (let x = 0; x < 1080; x += p) s += `<path d="M${x} 0 V${y1}" stroke="${cl}" stroke-width="4"/>`; return s; };
  // ===== especificacoes (dy/x0 escolhidos para o chao cair entre ~1250 e ~1460 e o principal do cenario ficar no centro) =====
  recompor("ruaComercio", { x0: 420, dy: 640, cima: { grad: ["#7fbfe2", "#bfe3f0"], ate: 0 },
    decoCima: (o, dy) => [[-20, 150, 300, "#c3d9e6"], [150, 120, 360, "#b4cfe0"], [760, 140, 220, "#c3d9e6"], [880, 220, 160, "#b4cfe0"]].map(([x, w, t, c]) => torre(x, w, t, dy + 140, c)).join("") + antena(225, 300) + antena(850, 220) + nuvem(80, 90, 1.1) + nuvem(640, 40, .9) + passaro(420, 200) + passaro(470, 188, -1),
    baixo: { de: 1080 }, decoBaixo: (o, dy) => faixasRua(dy + 1078, 1920) });
  recompor("avenidaTelao", { x0: 420, dy: 560, cima: { grad: ["#78bde0", "#9fd0ea"], ate: 0 },
    decoCima: (o, dy) => torre(-30, 170, 120, dy + 300, "#9fbdd0") + torre(900, 210, 60, dy + 300, "#a9c7d8") + antena(55, 120) + antena(1000, 60) + nuvem(260, 70, 1) + nuvem(560, 220, .8) + passaro(400, 330) + passaro(450, 318, -1),
    baixo: { de: 1080 }, decoBaixo: (o, dy) => { let s = faixasRua(dy + 1078, 1920); for (let x = 220; x < 860; x += 70) s += `<rect x="${x}" y="${dy + 1100}" width="40" height="150" fill="#f4efe4" opacity=".9"/>`; return s; } });
  recompor("fachadaPredio", { x0: 420, dy: 880 });
  recompor("salaApto", { x0: 420, dy: 520, decoCima: (o, dy) => listras(dy + 40, "#E8D7B5", "#dfcca5") + teto(70, "#f4efe4", "#e6dcc8") + pendente(540, 102, 300) + quadro(760, 330, 220, 150, "#9fd0ea") + `<rect x="80" y="380" width="260" height="14" fill="#a86b42" stroke="${C}" stroke-width="4"/>` + Cn.planta(140, 380, .55, "#c96b4a") + Cn.planta(270, 380, .45, "#4a90d9"),
    baixo: { faixa: [960, 100] }, decoFrente: (o, dy) => `<g transform="translate(330 1920)"><path d="M-120 -150 h340 l20 30 h-380 Z" fill="#a86b42" stroke="${C}" stroke-width="6"/><rect x="-140" y="-120" width="380" height="24" fill="#8a5a36" stroke="${C}" stroke-width="5"/><path d="M-110 -96 v96 M210 -96 v96" stroke="${C}" stroke-width="12"/><rect x="-40" y="-176" width="90" height="26" rx="4" fill="#4a90d9" stroke="${C}" stroke-width="4"/><path d="M110 -150 q-6 -40 30 -44 q36 4 30 44 Z" fill="#f4efe4" stroke="${C}" stroke-width="4"/></g>` });
  recompor("corredorClube", { x0: 420, dy: 560, decoCima: (o, dy) => paineis(dy + 40, "#efe3c8", "#c9a24a", 270, 220) + teto(60, "#3d2a22", "#c9a24a") + Cn.lustre(270, 92, 330) + Cn.lustre(810, 92, 330), baixo: { faixa: [980, 100] } });
  recompor("patioFabrica", { x0: 420, dy: 600, cima: { grad: ["#7cc4e6", "#9fd3ea"], ate: 0 }, decoCima: (o, dy) => nuvem(80, 120, 1.2) + nuvem(700, 60, 1) + nuvem(420, 330, .7) + passaro(620, 260) + passaro(680, 240, -1) + `<path d="M0 ${dy - 10} L180 ${dy - 120} L420 ${dy - 30} L640 ${dy - 150} L900 ${dy - 40} L1080 ${dy - 110} L1080 ${dy + 40} L0 ${dy + 40} Z" fill="#a8cfa0" stroke="${C}" stroke-width="4" opacity=".8"/>`,
    baixo: { faixa: [960, 120] } });
  recompor("terrenoCima", { x0: 420, dy: 420, cima: { faixa: [0, 200] }, baixo: { faixa: [880, 200] } });
  recompor("marAberto", { x0: 0, dy: 520, cima: { grad: ["#4fa6d8", "#7cc4e6"], ate: -360 }, decoCima: (o, dy) => nuvem(120, 260, 1.2) + nuvem(700, 380, .9) + nuvem(380, 140, .8) + passaro(300, 420) + passaro(340, 408, -1) + passaro(820, 300),
    baixo: { faixa: [960, 120] } });
  recompor("cofre", { x0: 420, dy: 560, decoCima: (o, dy) => paineis(dy + 6, "#E3D2B1", "#c4ae86") + teto(50, "#c9b48c", "#9a8a6a") + pendente(300, 82, 260, "#d9dce3") + pendente(780, 82, 260, "#d9dce3"), baixo: { faixa: [980, 100] } });
  recompor("balcaoLanchonete", { x0: 420, dy: 600, decoCima: (o, dy) => azulejo(dy - 60, "#f4f6f4", "#d9dfdd") + teto(60, "#f4efe4", "#d9dfdd") + pendente(260, 92, 300, "#e2544f") + pendente(820, 92, 300, "#e2544f") + `<g transform="translate(540 430)"><rect x="-300" y="-110" width="600" height="220" rx="12" fill="#2f4f3a" stroke="${C}" stroke-width="7"/><text x="0" y="-40" text-anchor="middle" style="${F};font-size:46px" fill="#f5c542">CARDÁPIO</text><text x="0" y="20" text-anchor="middle" style="${F};font-size:32px" fill="#e8f0e0">PÃO NA CHAPA · R$ 6</text><text x="0" y="70" text-anchor="middle" style="${F};font-size:32px" fill="#e8f0e0">PINGADO · R$ 5</text></g>`,
    baixo: { de: 1080 }, decoBaixo: (o, dy) => { let s = `<rect x="0" y="${dy + 1078}" width="1080" height="${1920 - dy - 1078}" fill="#e9e3d6"/>`; for (let r = 0; r * 80 < 1920 - dy - 1078; r++) for (let c = 0; c < 14; c++) if ((r + c) % 2) s += `<rect x="${c * 80}" y="${dy + 1078 + r * 80}" width="80" height="80" fill="#cfc6b4"/>`; return s; } });
  recompor("salaoMansao", { x0: 420, dy: 560, decoCima: (o, dy) => paineis(dy + 30, "#efe1c8", "#dcc9a6", 260, 260) + teto(80, "#f6ecd8", "#dcc9a6") + Cn.lustre(540, 112, 420) + quadro(80, 230, 200, 260, "#9fcfc6") + quadro(800, 230, 200, 260, "#f6d2bd"), baixo: { faixa: [980, 100] } });
  recompor("fachadaMansao", { x0: 420, dy: 560, cima: { grad: ["#6fb6dc", "#8fcbe6"], ate: -300 }, decoCima: (o, dy) => nuvem(100, 140, 1.2) + nuvem(720, 280, 1) + nuvem(420, 60, .8) + passaro(520, 220) + passaro(570, 206, -1), baixo: { faixa: [960, 120] } });
  recompor("mansaoCorte", { x0: 420, dy: 560, cima: { faixa: [-300, 160] }, baixo: { faixa: [960, 120] } });
  recompor("restaurante", { x0: 420, dy: 560, cima: { faixa: [-300, 240] }, decoCima: (o, dy) => teto(70, "#8a5a36", "#6b4a2e") + pendente(250, 102, 360) + pendente(830, 102, 360) + quadro(430, 250, 220, 160, "#f6d2bd", "#8a5a36"), baixo: { faixa: [980, 100] } });
  recompor("salaTelas", { x0: 420, dy: 520, cima: { faixa: [-300, 200] }, decoCima: () => teto(60, "#0b0f1c", "#1d2438"), baixo: { faixa: [980, 100] } });
  recompor("casaIrmao", { x0: 420, dy: 560, cima: { grad: ["#9fd3ee", "#bfe3f0"], ate: -300 }, decoCima: (o, dy) => nuvem(120, 180, 1) + nuvem(700, 90, 1.1) + passaro(480, 300) + passaro(520, 288, -1) + `<path d="M-20 ${dy - 120} Q540 ${dy - 40} 1100 ${dy - 140}" fill="none" stroke="${C}" stroke-width="3"/>`, baixo: { faixa: [960, 120] } });
  recompor("cabine747", { x0: 2700, dy: 560, cima: { faixa: [-300, 180] }, decoCima: () => { let s = `<path d="M0 0 H1080 V180 Q540 300 0 180 Z" fill="#e6dccb" stroke="${C}" stroke-width="5"/>`; for (let x = 20; x < 1080; x += 270) s += `<rect x="${x}" y="190" width="240" height="90" rx="14" fill="#f6f0e4" stroke="${C}" stroke-width="5"/><circle cx="${x + 200}" cy="250" r="8" fill="#c9a24a"/>`; return s; }, baixo: { faixa: [980, 100] } });
  recompor("casaMae", { x0: 420, dy: 560, cima: { faixa: [-300, 160] }, decoCima: (o, dy) => teto(60, "#f6ecd8", "#e2cfa6") + pendente(540, 92, 330, "#f29e4c") + `<g transform="translate(860 380)"><circle r="58" fill="#f4efe4" stroke="${C}" stroke-width="6"/><path d="M0 0 V-34 M0 0 L24 10" stroke="${C}" stroke-width="6" stroke-linecap="round"/></g>`, baixo: { faixa: [980, 100] } });
  recompor("salaReuniao", { x0: 420, dy: 560, cima: { faixa: [-300, 280] }, decoCima: () => teto(60, "#1d1a22", "#3a3340") + pendente(540, 92, 380, "#3a3340"), baixo: { faixa: [980, 100] } });
  recompor("corredorAlaLeste", { x0: 420, dy: 500, cima: { grad: ["#e3d2ae", "#efe2c4"], ate: -300 }, baixo: { faixa: [1180, 120] } });
  recompor("ceuNoturno", { x0: 420, dy: 760 });
  recompor("laje", { x0: 420, dy: 640, baixo: { faixa: [960, 120] } });
  recompor("fundoLiso", { x0: 420, dy: 420 });
  recompor("casaIrmao", { x0: 420, dy: 560, cima: { grad: ["#9fd3ee", "#bfe3f0"], ate: -300 }, decoCima: (o, dy) => nuvem(120, 180, 1) + nuvem(700, 90, 1.1) + passaro(480, 300) + passaro(520, 288, -1), baixo: { faixa: [960, 120] } });
})();
