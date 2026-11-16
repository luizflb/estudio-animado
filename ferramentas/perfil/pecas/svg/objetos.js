/* Objetos detalhados em SVG (biblioteca do canal). Cada funcao devolve uma string <g>...</g>.
 * Rodas ficam em <g class="roda"> com transform-origin no centro, para girar na animacao. */
(function () {
  const C = (window.ESTILO && window.ESTILO.contorno) || "#2E2A33";
  const esc = (h, f) => { // escurece/clareia cor hex
    const n = parseInt(h.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const k = f < 0 ? 0 : 255, t = Math.abs(f);
    r = Math.round(r + (k - r) * t); g = Math.round(g + (k - g) * t); b = Math.round(b + (k - b) * t);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  function roda(cx, cy, r, id) {
    let raios = "";
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * Math.PI / 180, a2 = a + 0.32;
      const x1 = cx + Math.cos(a) * r * 0.2, y1 = cy + Math.sin(a) * r * 0.2;
      const x2 = cx + Math.cos(a) * r * 0.56, y2 = cy + Math.sin(a) * r * 0.56;
      const x3 = cx + Math.cos(a2) * r * 0.56, y3 = cy + Math.sin(a2) * r * 0.56;
      raios += `<path d="M${x1} ${y1} L${x2} ${y2} A${r * 0.56} ${r * 0.56} 0 0 1 ${x3} ${y3} Z" fill="#8f939e"/>`;
    }
    return `<g class="roda" id="${id}" data-cx="${cx}" data-cy="${cy}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#2b2a31" stroke="${C}" stroke-width="5"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.86}" fill="none" stroke="#3d3c45" stroke-width="3" stroke-dasharray="6 7"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.66}" fill="#d9dce3" stroke="${C}" stroke-width="4"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.58}" fill="#bfc3cc"/>
      ${raios}
      <circle cx="${cx}" cy="${cy}" r="${r * 0.17}" fill="#e9ebf0" stroke="${C}" stroke-width="3"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.05}" fill="${C}"/>
      <path d="M${cx - r * 0.45} ${cy - r * 0.32} A${r * 0.6} ${r * 0.6} 0 0 1 ${cx - r * 0.05} ${cy - r * 0.6}" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>
    </g>`;
  }

  /* Carro hatch de lado, virado para a direita. Caixa 0 0 900 380, chao em y=360. */
  function carroHatch(o = {}) {
    const cor = o.cor || "#F5C542", som = esc(cor, -0.18), luz = esc(cor, 0.35);
    const id = o.id || "carro";
    return `<g id="${id}">
      <ellipse cx="450" cy="362" rx="380" ry="16" fill="#000" opacity="0.18"/>
      <!-- carroceria -->
      <path d="M70 300 L66 250 Q66 222 96 214 L250 190 Q300 120 360 104 Q470 84 600 98 Q650 104 690 150 L740 196 Q820 206 842 228 Q856 244 852 276 L850 300 Z"
            fill="${cor}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <!-- sombra de baixo da lataria -->
      <path d="M70 300 L68 262 L850 262 L850 300 Z" fill="${som}"/>
      <path d="M70 300 L66 250 Q66 222 96 214 L250 190 Q300 120 360 104 Q470 84 600 98 Q650 104 690 150 L740 196 Q820 206 842 228 Q856 244 852 276 L850 300 Z"
            fill="none" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <!-- brilho no teto -->
      <path d="M372 114 Q470 96 590 108" stroke="${luz}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <!-- vidros -->
      <path d="M282 196 Q318 136 372 120 L470 112 L470 196 Z" fill="#a9d8ea" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M492 196 L492 110 L592 114 Q630 120 660 156 L692 196 Z" fill="#a9d8ea" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M330 190 L392 124 L420 122 L356 190 Z" fill="#fff" opacity="0.55"/>
      <path d="M540 190 L586 120 L600 121 L556 190 Z" fill="#fff" opacity="0.5"/>
      <rect x="470" y="108" width="22" height="92" fill="${C}"/>
      <!-- portas e linhas -->
      <path d="M262 198 L262 300" stroke="${C}" stroke-width="4"/>
      <path d="M480 200 L486 300" stroke="${C}" stroke-width="4"/>
      <path d="M700 200 Q712 250 706 300" stroke="${C}" stroke-width="4" fill="none"/>
      <path d="M96 236 L842 238" stroke="${som}" stroke-width="5"/>
      <rect x="402" y="222" width="46" height="12" rx="6" fill="${som}" stroke="${C}" stroke-width="3"/>
      <rect x="626" y="222" width="46" height="12" rx="6" fill="${som}" stroke="${C}" stroke-width="3"/>
      <!-- retrovisor -->
      <path d="M672 200 L690 178 Q694 168 682 166 L660 172 L656 196 Z" fill="${cor}" stroke="${C}" stroke-width="4" stroke-linejoin="round"/>
      <!-- farol e lanterna -->
      <path d="M800 214 Q838 220 846 244 L812 246 Q798 232 800 214 Z" fill="#fff7c2" stroke="${C}" stroke-width="4"/>
      <path d="M72 226 L104 220 L104 252 L68 254 Z" fill="#e2544f" stroke="${C}" stroke-width="4"/>
      <path d="M76 232 L98 228" stroke="#ffb3a8" stroke-width="4" stroke-linecap="round"/>
      <!-- tampa do tanque -->
      <circle cx="178" cy="236" r="12" fill="${som}" stroke="${C}" stroke-width="3"/>
      <!-- para-choques -->
      <rect x="50" y="278" width="96" height="30" rx="12" fill="#c9ccd4" stroke="${C}" stroke-width="5"/>
      <rect x="772" y="278" width="96" height="30" rx="12" fill="#c9ccd4" stroke="${C}" stroke-width="5"/>
      <rect x="800" y="288" width="40" height="8" rx="4" fill="#fff" opacity="0.7"/>
      <!-- caixas das rodas -->
      <path d="M150 304 A92 92 0 0 1 334 304 Z" fill="#3a3842"/>
      <path d="M592 304 A92 92 0 0 1 776 304 Z" fill="#3a3842"/>
      <path d="M150 304 A92 92 0 0 1 334 304" fill="none" stroke="${C}" stroke-width="6"/>
      <path d="M592 304 A92 92 0 0 1 776 304" fill="none" stroke="${C}" stroke-width="6"/>
      ${roda(242, 300, 66, id + "-roda-tras")}
      ${roda(684, 300, 66, id + "-roda-frente")}
    </g>`;
  }

  window.Objetos = { C, esc, roda, carroHatch };
})();

/* ===== Objetos do gancho do video do trilionario (09/11/2026) =====
 * Mesma convencao do carroHatch: x=0 na esquerda, chao em y=362, 1 m ~ 290 unidades.
 * Use escala ~ 2,7 x a escala do ator (ator 0.33 -> objeto 0.9). Pecas moveis em <g> com id proprio. */
(function () {
  const C = window.Objetos.C, esc = window.Objetos.esc;
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const sombra = (cx, rx) => `<ellipse cx="${cx}" cy="364" rx="${rx}" ry="14" fill="#000" opacity="0.16"/>`;

  /* Nota de dinheiro e maco (reaproveitados) */
  const nota = (x, y, w = 90, h = 40, r = 0, cor = "#8cc97a") => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="3" fill="${cor}" stroke="${C}" stroke-width="3"/><rect x="${-w / 2 + 5}" y="${-h / 2 + 5}" width="${w - 10}" height="${h - 10}" rx="2" fill="none" stroke="${esc(cor, -0.2)}" stroke-width="2"/><circle cx="0" cy="0" r="${h * 0.28}" fill="${esc(cor, 0.3)}" stroke="${esc(cor, -0.25)}" stroke-width="2"/><text x="0" y="${h * 0.16}" text-anchor="middle" style="${F};font-size:${h * 0.42}px" fill="${esc(cor, -0.35)}">$</text></g>`;
  function macoSvg(x, y, w = 120, h = 54, texto = "", r = 0) {
    let s = `<g transform="translate(${x} ${y}) rotate(${r})">`;
    for (let i = 4; i >= 0; i--) s += `<rect x="${-w / 2 + i * 1.5}" y="${-h / 2 + i * 3}" width="${w}" height="${h}" rx="3" fill="${i ? "#7ab868" : "#8cc97a"}" stroke="${C}" stroke-width="3"/>`;
    s += `<rect x="${-w / 2 + 6}" y="${-h / 2 + 6}" width="${w - 12}" height="${h - 12}" rx="2" fill="none" stroke="#5e9a4e" stroke-width="2"/><circle cx="${-w * 0.3}" cy="0" r="${h * 0.22}" fill="#b5e0a6" stroke="#5e9a4e" stroke-width="2"/><circle cx="${w * 0.3}" cy="0" r="${h * 0.22}" fill="#b5e0a6" stroke="#5e9a4e" stroke-width="2"/>`;
    s += `<rect x="${-w * 0.16}" y="${-h / 2 - 3}" width="${w * 0.32}" height="${h + 18}" fill="#F5C542" stroke="${C}" stroke-width="3"/>`;
    if (texto) s += `<text x="0" y="${h * 0.12}" text-anchor="middle" style="${F};font-size:${Math.min(h * 0.3, w * 0.11)}px" fill="${C}">${texto}</text>`;
    return s + `</g>`;
  }
  function moedaSvg(x, y, r = 30) {
    return `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="${r * 0.18}" rx="${r}" ry="${r}" fill="#c9962f" stroke="${C}" stroke-width="4"/><circle cx="0" cy="0" r="${r}" fill="#e8b84a" stroke="${C}" stroke-width="4"/><circle cx="0" cy="0" r="${r * 0.72}" fill="none" stroke="#c9962f" stroke-width="3"/><text x="0" y="${r * 0.36}" text-anchor="middle" style="${F};font-size:${r}px" fill="#b8862a">$</text><path d="M${-r * 0.55} ${-r * 0.35} A${r * 0.65} ${r * 0.65} 0 0 1 ${-r * 0.1} ${-r * 0.66}" stroke="#fff3c4" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
  }
  const barraOuro = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-50 0 L-36 -34 L36 -34 L50 0 Z" fill="#f5c542" stroke="${C}" stroke-width="4" stroke-linejoin="round"/><path d="M-36 -34 L36 -34 L30 -28 L-30 -28 Z" fill="#ffe08a"/><path d="M-30 -22 h22" stroke="#fff3c4" stroke-width="4" stroke-linecap="round"/><text x="0" y="-8" text-anchor="middle" style="${F};font-size:12px" fill="#b8862a">999</text></g>`;

  /* ---------- CAMA de solteiro (o.parte: "base" fica atras do personagem, "coberta" na frente) ---------- */
  function cama(o = {}) {
    const id = o.id || "cama", parte = o.parte || "tudo";
    const pid = id + "-xadrez";
    const base = `<g id="${id}-base">${sombra(330, 320)}
      <rect x="20" y="300" width="20" height="62" fill="#8a5a3b" stroke="${C}" stroke-width="4"/><rect x="600" y="300" width="20" height="62" fill="#8a5a3b" stroke="${C}" stroke-width="4"/>
      <path d="M0 330 L0 70 Q0 40 30 40 L70 40 Q100 40 100 70 L100 330 Z" fill="#c48a55" stroke="${C}" stroke-width="6"/>
      <rect x="18" y="80" width="64" height="70" rx="8" fill="#d49a63" stroke="${C}" stroke-width="4"/><rect x="18" y="168" width="64" height="70" rx="8" fill="#d49a63" stroke="${C}" stroke-width="4"/>
      <path d="M20 46 L22 300" stroke="#dfab76" stroke-width="5" opacity="0.6"/>
      <rect x="90" y="250" width="540" height="64" rx="6" fill="#c48a55" stroke="${C}" stroke-width="6"/><path d="M100 268 H620" stroke="#a86b42" stroke-width="4"/>
      <path d="M590 330 L590 200 Q590 180 610 180 L630 180 Q650 180 650 200 L650 330 Z" fill="#c48a55" stroke="${C}" stroke-width="6"/>
      <rect x="96" y="214" width="500" height="44" rx="14" fill="#f4f4f6" stroke="${C}" stroke-width="5"/><path d="M110 248 H580" stroke="#dfe2e8" stroke-width="4"/>
      <path d="M110 214 Q104 170 150 166 L250 164 Q292 166 290 206 Q288 226 250 228 L148 230 Q112 230 110 214 Z" fill="#bfe1ee" stroke="${C}" stroke-width="5"/><path d="M130 196 Q190 182 270 190" stroke="#fff" stroke-width="5" fill="none" opacity="0.8"/><path d="M200 168 Q196 196 204 226" stroke="#9fc5d6" stroke-width="3" fill="none"/></g>`;
    let quad = "";
    for (let i = 0; i < 4; i++) quad += `<rect x="${i * 10}" y="0" width="5" height="40" fill="#c43f3b" opacity="0.5"/><rect x="0" y="${i * 10}" width="40" height="5" fill="#c43f3b" opacity="0.5"/>`;
    const coberta = `<g id="${id}-coberta"><defs><pattern id="${pid}" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="#e2544f"/><rect x="0" y="0" width="40" height="80" fill="#4a90d9" opacity="0.45"/><rect x="0" y="0" width="80" height="40" fill="#4a90d9" opacity="0.45"/><path d="M20 0 V80 M60 0 V80 M0 20 H80 M0 60 H80" stroke="#fff8e6" stroke-width="3" opacity="0.6"/></pattern></defs>
      <path d="M250 214 Q240 200 262 196 L586 196 Q610 200 606 228 L612 300 Q560 314 520 300 Q470 320 420 302 Q370 318 320 300 Q280 312 252 300 Z" fill="url(#${pid})" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M244 210 Q236 196 260 192 L300 192 Q314 198 304 214 L300 296 Q276 306 252 298 Z" fill="#f4efe4" stroke="${C}" stroke-width="5"/><path d="M262 206 L268 290" stroke="#dcd6c8" stroke-width="4"/>
      <path d="M380 210 Q420 230 470 214 M500 240 Q540 256 580 236" stroke="#b33a36" stroke-width="5" fill="none" opacity="0.6"/></g>`;
    return `<g id="${id}">${parte !== "coberta" ? base : ""}${parte !== "base" ? coberta : ""}</g>`;
  }

  /* ---------- DESPERTADOR de dois sinos (o sino treme: #id-sinos) ---------- */
  function despertador(o = {}) {
    const id = o.id || "desp", cor = o.cor === "#F5C542" || !o.cor ? "#e2544f" : o.cor;
    return `<g id="${id}">${sombra(60, 50)}
      <path d="M26 340 L14 362 M94 340 L106 362" stroke="${C}" stroke-width="8" stroke-linecap="round"/>
      <g id="${id}-sinos"><path d="M22 232 A30 30 0 0 1 62 196 Z" fill="#f5c542" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M98 232 A30 30 0 0 0 58 196 Z" fill="#f5c542" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M60 214 V188 M54 186 h12" stroke="${C}" stroke-width="6" stroke-linecap="round"/><path d="M30 216 q8 -10 18 -14" stroke="#fff3c4" stroke-width="4" fill="none"/></g>
      <circle cx="60" cy="290" r="62" fill="${cor}" stroke="${C}" stroke-width="6"/><circle cx="60" cy="290" r="48" fill="#fff8e6" stroke="${C}" stroke-width="4"/>
      ${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<path d="M${60 + Math.sin(a) * 40} ${290 - Math.cos(a) * 40} L${60 + Math.sin(a) * (i % 3 ? 44 : 34)} ${290 - Math.cos(a) * (i % 3 ? 44 : 34)}" stroke="${C}" stroke-width="${i % 3 ? 3 : 5}"/>`; }).join("")}
      <path d="M60 290 L42 304" stroke="${C}" stroke-width="6" stroke-linecap="round"/><path d="M60 290 L60 256" stroke="${C}" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="290" r="5" fill="#e2544f" stroke="${C}" stroke-width="2"/>
      <path d="M26 262 A40 40 0 0 1 46 248" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  }

  /* ---------- PORTA do clube: porta dupla dourada, placa e cordao de veludo (#id-cordao, #id-placa) ---------- */
  function portaClube(o = {}) {
    const id = o.id || "portaClube";
    const folha = (x, d) => `<g id="${id}-folha-${d > 0 ? "e" : "d"}"><path d="M${x} 362 L${x} -260 ${d > 0 ? `Q${x} -390 ${x + 250} -400 L${x + 250} 362` : `Q${x} -390 ${x - 250} -400 L${x - 250} 362`} Z" fill="#d9a93a" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <rect x="${d > 0 ? x + 34 : x - 216}" y="-240" width="182" height="250" rx="10" fill="#e8bd52" stroke="${C}" stroke-width="5"/><rect x="${d > 0 ? x + 52 : x - 198}" y="-222" width="146" height="214" rx="6" fill="none" stroke="#b8862a" stroke-width="4"/>
      <rect x="${d > 0 ? x + 34 : x - 216}" y="40" width="182" height="290" rx="10" fill="#e8bd52" stroke="${C}" stroke-width="5"/><rect x="${d > 0 ? x + 52 : x - 198}" y="58" width="146" height="254" rx="6" fill="none" stroke="#b8862a" stroke-width="4"/>
      <circle cx="${x + d * 125}" cy="-116" r="34" fill="none" stroke="#b8862a" stroke-width="5"/><path d="M${x + d * 125} -146 l8 22 l22 0 l-18 14 l7 22 l-19 -13 l-19 13 l7 -22 l-18 -14 l22 0 Z" fill="#fff3c4" stroke="#b8862a" stroke-width="2"/>
      <rect x="${d > 0 ? x + 218 : x - 236}" y="-20" width="18" height="90" rx="9" fill="#fff3c4" stroke="${C}" stroke-width="4"/>
      <path d="M${x + d * 40} -200 L${x + d * 70} 300" stroke="#f3d27a" stroke-width="10" opacity="0.5"/></g>`;
    const poste = (x) => `<rect x="${x - 34}" y="350" width="68" height="14" rx="6" fill="#c9962f" stroke="${C}" stroke-width="4"/><path d="M${x - 24} 352 Q${x} 320 ${x + 24} 352 Z" fill="#e0b23e" stroke="${C}" stroke-width="4"/><rect x="${x - 9}" y="94" width="18" height="236" fill="#e0b23e" stroke="${C}" stroke-width="4"/><path d="M${x - 4} 110 V320" stroke="#fff3c4" stroke-width="4"/><circle cx="${x}" cy="88" r="20" fill="#f5c542" stroke="${C}" stroke-width="5"/><circle cx="${x - 6}" cy="82" r="5" fill="#fff8e6"/>`;
    return `<g id="${id}">${sombra(350, 360)}
      <path d="M50 362 L50 -270 Q50 -440 350 -450 Q650 -440 650 -270 L650 362 Z" fill="#6b3f2a" stroke="${C}" stroke-width="7"/><path d="M76 362 L76 -262 Q76 -414 350 -424 Q624 -414 624 -262 L624 362 Z" fill="#3a2418"/>
      ${folha(100, 1)}${folha(600, -1)}<path d="M350 -400 V362" stroke="${C}" stroke-width="6"/>
      <g id="${id}-letreiro"><rect x="110" y="-540" width="480" height="84" rx="12" fill="#2b2440" stroke="${C}" stroke-width="6"/><rect x="122" y="-528" width="456" height="60" rx="8" fill="none" stroke="#e0b23e" stroke-width="4"/><text x="350" y="-504" text-anchor="middle" style="${F};font-size:24px;letter-spacing:4px" fill="#F5C542">CLUBE DOS</text><text x="350" y="-476" text-anchor="middle" style="${F};font-size:28px;letter-spacing:3px" fill="#F5C542">TRILIONÁRIOS</text></g>
      <path d="M350 -456 L350 -440" stroke="${C}" stroke-width="6"/>
      ${poste(-40)}${poste(740)}
      <g id="${id}-cordao"><path d="M-30 100 Q350 250 730 100" fill="none" stroke="${C}" stroke-width="26" stroke-linecap="round"/><path d="M-30 100 Q350 250 730 100" fill="none" stroke="#b8262f" stroke-width="16" stroke-linecap="round"/><path d="M40 122 Q350 236 660 122" fill="none" stroke="#e2544f" stroke-width="4" opacity="0.7"/><circle cx="-30" cy="100" r="12" fill="#e0b23e" stroke="${C}" stroke-width="4"/><circle cx="730" cy="100" r="12" fill="#e0b23e" stroke="${C}" stroke-width="4"/></g>
      <g id="${id}-placa"><path d="M740 150 L700 205 M740 150 L780 205" stroke="${C}" stroke-width="5"/><rect x="660" y="200" width="160" height="96" rx="8" fill="#fff8e6" stroke="${C}" stroke-width="5"/><rect x="668" y="208" width="144" height="80" rx="5" fill="none" stroke="#e0b23e" stroke-width="3"/><text x="740" y="240" text-anchor="middle" style="${F};font-size:22px" fill="${C}">membros:</text><text x="740" y="280" text-anchor="middle" style="${F};font-size:38px" fill="#e2544f">2</text></g></g>`;
  }

  /* ---------- PODIO de dois degraus iguais (os dois sao "1") ---------- */
  function podio(o = {}) {
    const id = o.id || "podio";
    const bloco = (x) => `<rect x="${x}" y="130" width="290" height="232" fill="#f4efe4" stroke="${C}" stroke-width="6"/><rect x="${x - 10}" y="118" width="310" height="26" rx="5" fill="#e0b23e" stroke="${C}" stroke-width="5"/><rect x="${x}" y="144" width="290" height="16" fill="#e8e1d2"/>
      <circle cx="${x + 145}" cy="250" r="64" fill="#F5C542" stroke="${C}" stroke-width="6"/><circle cx="${x + 145}" cy="250" r="50" fill="none" stroke="#c9962f" stroke-width="4"/><text x="${x + 145}" y="276" text-anchor="middle" style="${F};font-size:76px" fill="#fff8e6" stroke="${C}" stroke-width="4">1</text>
      ${[-1, 1].map(d => `<path d="M${x + 145 + d * 80} 300 Q${x + 145 + d * 104} 250 ${x + 145 + d * 82} 200" fill="none" stroke="#6fae5a" stroke-width="7" stroke-linecap="round"/>${[0, 1, 2].map(i => `<ellipse cx="${x + 145 + d * (92 - i * 2)}" cy="${280 - i * 34}" rx="14" ry="7" fill="#6fae5a" stroke="${C}" stroke-width="2.5" transform="rotate(${d * -40} ${x + 145 + d * (92 - i * 2)} ${280 - i * 34})"/>`).join("")}`).join("")}
      <path d="M${x + 20} 170 L${x + 20} 340" stroke="#fff" stroke-width="10" opacity="0.6"/>`;
    return `<g id="${id}">${sombra(300, 320)}${bloco(10)}${bloco(300)}<path d="M300 130 V362" stroke="${C}" stroke-width="6"/></g>`;
  }

  /* ---------- SILHUETA generica, sem rosto (o.cracha: texto opcional) ---------- */
  function silhueta(o = {}) {
    const id = o.id || "silhueta", cor = o.cor && o.cor !== "#F5C542" ? o.cor : "#3a3550", luz = esc(cor, 0.18);
    const cr = o.cracha ? `<g id="${id}-cracha"><path d="M84 -30 L100 30 L116 -30" fill="none" stroke="#e2544f" stroke-width="6"/><rect x="60" y="24" width="80" height="54" rx="6" fill="#fff8e6" stroke="${C}" stroke-width="4"/><rect x="60" y="24" width="80" height="14" rx="4" fill="#4a90d9"/><text x="100" y="66" text-anchor="middle" style="${F};font-size:${o.cracha.length > 9 ? 13 : 16}px" fill="${C}">${o.cracha}</text></g>` : "";
    return `<g id="${id}">${sombra(100, 80)}
      <path d="M58 362 L62 200 L138 200 L142 362 L112 362 L104 230 L96 230 L88 362 Z" fill="${cor}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M40 -40 Q40 -70 100 -72 Q160 -70 160 -40 L156 210 L44 210 Z" fill="${cor}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M40 -36 Q20 40 26 170 L48 172 Q50 60 58 -10 Z M160 -36 Q180 40 174 170 L152 172 Q150 60 142 -10 Z" fill="${cor}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="100" cy="-140" r="64" fill="${cor}" stroke="${C}" stroke-width="5"/><path d="M62 -170 Q80 -196 112 -196" stroke="${luz}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M52 -20 Q50 60 54 180" stroke="${luz}" stroke-width="6" fill="none"/>
      <text x="100" y="-112" text-anchor="middle" style="${F};font-size:80px" fill="${luz}">?</text>${cr}</g>`;
  }

  /* ---------- BALANCA dourada grande: #id-braco gira no pivo (650,-420); pratos #id-prato_e e #id-prato_d
   * (pontos de pendurar em data-x/data-y; mova o prato junto com a ponta do braco) ---------- */
  function balanca(o = {}) {
    const id = o.id || "balanca", ouro = "#e0b23e", som = "#b8892b", luz = "#f3d27a";
    const prato = (lado, x) => `<g id="${id}-prato_${lado}" data-x="${x}" data-y="-420">
      <path d="M${x} -404 L${x - 170} -96 M${x} -404 L${x + 170} -96 M${x} -404 L${x} -100" stroke="${C}" stroke-width="5" stroke-dasharray="14 6"/>
      <circle cx="${x}" cy="-406" r="12" fill="${ouro}" stroke="${C}" stroke-width="4"/>
      <path d="M${x - 200} -100 L${x + 200} -100 Q${x + 180} -20 ${x} -16 Q${x - 180} -20 ${x - 200} -100 Z" fill="${ouro}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M${x - 196} -98 L${x + 196} -98" stroke="${C}" stroke-width="6"/><ellipse cx="${x}" cy="-100" rx="198" ry="14" fill="${luz}" stroke="${C}" stroke-width="5"/><path d="M${x - 150} -76 Q${x - 60} -40 ${x + 40} -46" stroke="#fff3c4" stroke-width="6" fill="none" opacity="0.8"/></g>`;
    return `<g id="${id}">${sombra(650, 260)}
      <path d="M430 362 Q440 300 520 290 L780 290 Q860 300 870 362 Z" fill="${ouro}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><rect x="500" y="270" width="300" height="30" rx="10" fill="${som}" stroke="${C}" stroke-width="5"/>
      <path d="M470 340 Q650 320 830 340" stroke="${luz}" stroke-width="6" fill="none"/>
      ${[540, 650, 760].map(x => `<circle cx="${x}" cy="330" r="10" fill="#e2544f" stroke="${C}" stroke-width="3"/>`).join("")}
      <path d="M620 270 L630 -400 L670 -400 L680 270 Z" fill="${ouro}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><path d="M640 250 L646 -380" stroke="${luz}" stroke-width="6"/>
      ${[0, 1, 2, 3].map(i => `<rect x="${614 + i * 2}" y="${200 - i * 160}" width="${72 - i * 4}" height="18" rx="6" fill="${som}" stroke="${C}" stroke-width="4"/>`).join("")}
      <g id="${id}-braco" data-cx="650" data-cy="-420"><path d="M110 -432 Q650 -470 1190 -432 L1190 -410 Q650 -440 110 -410 Z" fill="${ouro}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><path d="M140 -428 Q650 -458 1160 -428" stroke="${luz}" stroke-width="5" fill="none"/>
        ${[-1, 1].map(d => `<path d="M${650 + d * 470} -420 q${d * 40} -30 ${d * 70} 0" fill="none" stroke="${C}" stroke-width="6"/><circle cx="${650 + d * 540} " cy="-420" r="14" fill="${som}" stroke="${C}" stroke-width="4"/>`).join("")}
        <circle cx="650" cy="-420" r="30" fill="${som}" stroke="${C}" stroke-width="6"/><circle cx="650" cy="-420" r="12" fill="${luz}" stroke="${C}" stroke-width="3"/></g>
      <path d="M650 -450 L650 -500 M610 -500 L690 -500 L670 -540 L650 -510 L630 -540 Z" stroke="${C}" stroke-width="5" fill="${ouro}" stroke-linejoin="round"/>${[610, 650, 690].map(x => `<circle cx="${x}" cy="-544" r="8" fill="#e2544f" stroke="${C}" stroke-width="3"/>`).join("")}
      ${prato("e", 110)}${prato("d", 1190)}</g>`;
  }

  /* ---------- SACO DE DINHEIRO com etiqueta (o.texto) ---------- */
  function sacoDinheiro(o = {}) {
    const id = o.id || "saco", tx = o.texto || "US$ 1 TRI";
    return `<g id="${id}">${sombra(150, 140)}
      ${nota(110, 40, 90, 40, -24)}${nota(190, 34, 90, 40, 18)}${nota(150, 24, 90, 40, -4)}
      <path d="M40 362 Q-10 240 40 160 Q80 100 110 90 L190 90 Q220 100 260 160 Q310 240 260 362 Z" fill="#c9a76a" stroke="${C}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M70 330 Q30 240 70 170" stroke="#e0c590" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M230 340 Q260 260 236 190" stroke="#a88648" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M100 92 Q150 66 200 92 L196 116 Q150 96 104 116 Z" fill="#a88648" stroke="${C}" stroke-width="5"/>
      <path d="M100 104 Q150 120 200 104" stroke="${C}" stroke-width="10" fill="none"/><path d="M100 104 Q150 120 200 104" stroke="#e2544f" stroke-width="5" fill="none"/>
      <text x="150" y="280" text-anchor="middle" style="${F};font-size:120px" fill="#8a6c38" stroke="${C}" stroke-width="3">$</text>
      <g id="${id}-etiqueta" transform="rotate(-10 210 120)"><path d="M196 110 L232 160" stroke="${C}" stroke-width="4"/><rect x="200" y="150" width="${tx.length * 15 + 30}" height="54" rx="8" fill="#fff8e6" stroke="${C}" stroke-width="5"/><circle cx="214" cy="177" r="6" fill="${C}"/><text x="${226 + tx.length * 7.5}" y="187" text-anchor="middle" style="${F};font-size:26px" fill="#2e8b57">${tx}</text></g></g>`;
  }

  /* ---------- MOEDA (de frente, para pular) ---------- */
  function moeda(o = {}) { const id = o.id || "moeda"; return `<g id="${id}">${sombra(40, 30)}${moedaSvg(40, 322, 36)}</g>`; }

  /* ---------- MACO de dinheiro com cinta (o.texto, ex. "US$ 1 mi") ---------- */
  function maco(o = {}) { const id = o.id || "maco"; return `<g id="${id}">${sombra(80, 70)}${macoSvg(80, 330, 150, 60, o.texto || "US$ 1 mi")}</g>`; }

  /* ---------- MONTANHA DE DINHEIRO (~2,5 m de altura, 1500 de largura) ---------- */
  function montanhaDinheiro(o = {}) {
    const id = o.id || "montanha";
    const W = 1500, H = 720, topo = 362 - H;
    const perfil = (x) => 362 - H * Math.pow(Math.sin(Math.PI * x / W), 0.85) * (0.92 + 0.08 * Math.sin(x / 70));
    let d = `M0 362`; for (let x = 0; x <= W; x += 20) d += ` L${x} ${perfil(x).toFixed(1)}`; d += ` L${W} 362 Z`;
    let s = `<g id="${id}">${sombra(W / 2, W / 2)}<path d="${d}" fill="#5e9a4e" stroke="${C}" stroke-width="7" stroke-linejoin="round"/>`;
    let k = 0;
    for (let y = 340; y > topo + 20; y -= 34) for (let x = 40; x < W - 40; x += 70) {
      k++; const xx = x + (rnd(k) - 0.5) * 30 + ((y / 34) % 2) * 30, yy = y + (rnd(k + 5) - 0.5) * 10;
      if (xx < 30 || xx > W - 30 || !(yy >= perfil(xx) + 26)) continue;
      const tipo = rnd(k + 9);
      if (tipo < 0.62) s += macoSvg(xx, yy, 96, 40, "", (rnd(k + 2) - 0.5) * 40);
      else if (tipo < 0.82) s += nota(xx, yy, 88, 38, (rnd(k + 3) - 0.5) * 90);
      else if (tipo < 0.94) s += moedaSvg(xx, yy, 18);
      else s += barraOuro(xx, yy + 10, 0.8);
    }
    for (let i = 0; i < 6; i++) s += barraOuro(80 + i * 260 + rnd(i) * 60, 362, 1.1);
    for (let i = 0; i < 10; i++) s += moedaSvg(30 + rnd(i + 40) * (W - 60), 350 + rnd(i + 70) * 10, 16);
    s += `<path d="M${W * 0.4} ${perfil(W * 0.4) + 30} Q${W * 0.48} ${perfil(W * 0.48) + 10} ${W * 0.56} ${perfil(W * 0.56) + 30}" stroke="#fff" stroke-width="10" fill="none" opacity="0.35" stroke-linecap="round"/>`;
    [[0.5, -60, 1.2], [0.3, 40, 0.8], [0.7, 30, 1]].forEach(([fx, dy, kk]) => { const x = W * fx, y = perfil(x) + dy; s += `<path d="M${x} ${y - 26 * kk} Q${x + 4} ${y - 4} ${x + 26 * kk} ${y} Q${x + 4} ${y + 4} ${x} ${y + 26 * kk} Q${x - 4} ${y + 4} ${x - 26 * kk} ${y} Q${x - 4} ${y - 4} ${x} ${y - 26 * kk} Z" fill="#fff8e6" stroke="${C}" stroke-width="3"/>`; });
    return s + `</g>`;
  }

  /* ---------- CALENDARIO de parede com folhas soltas (#id-folha-1 por cima, ate o.folhas) ---------- */
  function calendario(o = {}) {
    const id = o.id || "cal", n = o.folhas || 8;
    const dias = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
    let s = `<g id="${id}"><path d="M150 -40 L60 30 M150 -40 L240 30" stroke="${C}" stroke-width="4"/><circle cx="150" cy="-44" r="8" fill="#8a8e98" stroke="${C}" stroke-width="3"/>
      <rect x="20" y="20" width="260" height="342" rx="10" fill="#d9cfbf" stroke="${C}" stroke-width="6"/>`;
    for (let i = n; i >= 1; i--) {
      const off = (i - 1) * 2;
      s += `<g id="${id}-folha-${i}"><rect x="${32 + off}" y="${84 + off}" width="236" height="${266 - off}" rx="6" fill="#fff8e6" stroke="${C}" stroke-width="4"/>
        <text x="${150 + off}" y="${126 + off}" text-anchor="middle" style="${F};font-size:26px" fill="#8a8e98">${dias[(i - 1) % 7]}</text>
        <text x="${150 + off}" y="${270 + off}" text-anchor="middle" style="${F};font-size:130px" fill="${C}">${i}</text>
        <path d="M${60 + off} ${300 + off} h${180}" stroke="#e3d2b1" stroke-width="4"/><path d="M${60 + off} ${322 + off} h${120}" stroke="#e3d2b1" stroke-width="4"/></g>`;
    }
    s += `<rect x="20" y="20" width="260" height="70" rx="10" fill="#e2544f" stroke="${C}" stroke-width="6"/><text x="150" y="68" text-anchor="middle" style="${F};font-size:30px;letter-spacing:3px" fill="#fff8e6">JANEIRO</text>`;
    for (let i = 0; i < 9; i++) s += `<path d="M${46 + i * 26} 10 q-10 14 0 26" fill="none" stroke="${C}" stroke-width="8" stroke-linecap="round"/><path d="M${46 + i * 26} 10 q-10 14 0 26" fill="none" stroke="#bfc3cc" stroke-width="4" stroke-linecap="round"/>`;
    return s + `</g>`;
  }

  /* ---------- MESA LONGA posta para um, no iate (cadeiras vazias; prato tampado na ponta direita) ---------- */
  function mesaLonga(o = {}) {
    const id = o.id || "mesa", Wd = 1800, topo = 150, nc = o.cadeiras || 10;
    const cadeira = (x, k = 1) => `<g transform="translate(${x} 0)"><path d="M${-44 * k} ${topo + 40} L${-40 * k} ${topo - 120 * k} Q0 ${topo - 150 * k} ${40 * k} ${topo - 120 * k} L${44 * k} ${topo + 40} Z" fill="#f4efe4" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M${-26 * k} ${topo - 98 * k} Q0 ${topo - 118 * k} ${26 * k} ${topo - 98 * k} L${26 * k} ${topo - 16} L${-26 * k} ${topo - 16} Z" fill="#9fcfc6" stroke="${C}" stroke-width="3"/><path d="M${-18 * k} ${topo - 60 * k} h${36 * k}" stroke="#7fb8ae" stroke-width="3"/><circle cx="0" cy="${topo - 134 * k}" r="${7 * k}" fill="#e0b23e" stroke="${C}" stroke-width="3"/></g>`;
    let s = `<g id="${id}">${sombra(Wd / 2, Wd / 2 + 40)}`;
    s += cadeira(-40, 1.15);
    const lugar = o.lugar, livre = (x) => lugar === undefined || Math.abs(x - lugar) > 110;
    for (let i = 0; i < nc - 1; i++) { const x = 140 + i * ((Wd - 280) / (nc - 2)); if (livre(x)) s += cadeira(x); }
    s += `<g id="${id}-cadeira-ponta">${cadeira(Wd + 40, 1.15)}</g>`;
    s += `<rect x="60" y="${topo + 50}" width="26" height="${362 - topo - 50}" fill="#8a5a3b" stroke="${C}" stroke-width="4"/><rect x="${Wd - 86}" y="${topo + 50}" width="26" height="${362 - topo - 50}" fill="#8a5a3b" stroke="${C}" stroke-width="4"/><rect x="${Wd / 2 - 13}" y="${topo + 50}" width="26" height="${362 - topo - 50}" fill="#8a5a3b" stroke="${C}" stroke-width="4"/>`;
    let barra = `M10 ${topo}`; for (let x = 10; x <= Wd - 10; x += 60) barra += ` L${x} ${topo + 96 + (x / 60 % 2 ? 8 : 0)}`; barra += ` L${Wd - 10} ${topo} Z`;
    s += `<rect x="0" y="${topo - 14}" width="${Wd}" height="28" rx="6" fill="#fff8e6" stroke="${C}" stroke-width="6"/><path d="${barra}" fill="#fff8e6" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>`;
    for (let x = 70; x < Wd - 40; x += 60) s += `<path d="M${x} ${topo + 16} L${x + 4} ${topo + 96}" stroke="#e3dccb" stroke-width="4"/>`;
    s += `<path d="M10 ${topo + 4} H${Wd - 10}" stroke="#e0b23e" stroke-width="4"/>`;
    for (let i = 0; i < nc - 1; i++) { const x = 140 + i * ((Wd - 280) / (nc - 2)); if (!livre(x)) continue; s += `<path d="M${x - 10} ${topo - 14} q10 -6 20 0 L${x + 6} ${topo - 50} q-6 -20 0 -36 h-12 q6 16 0 36 Z" fill="#dff3fb" stroke="${C}" stroke-width="3"/>`; }
    const cx = Wd / 2;
    s += `<g id="${id}-castical"><path d="M${cx - 40} ${topo - 14} h80 l-10 -16 h-60 Z" fill="#e0b23e" stroke="${C}" stroke-width="4"/><path d="M${cx} ${topo - 30} V${topo - 110} M${cx - 70} ${topo - 110} Q${cx} ${topo - 60} ${cx + 70} ${topo - 110}" stroke="${C}" stroke-width="10" fill="none"/><path d="M${cx} ${topo - 30} V${topo - 110} M${cx - 70} ${topo - 110} Q${cx} ${topo - 60} ${cx + 70} ${topo - 110}" stroke="#e0b23e" stroke-width="5" fill="none"/>
      ${[-70, 0, 70].map(dx => `<rect x="${cx + dx - 8}" y="${topo - 160 - (dx ? 0 : 20)}" width="16" height="${50 + (dx ? 0 : 20)}" fill="#fff8e6" stroke="${C}" stroke-width="3"/><path d="M${cx + dx} ${topo - 164 - (dx ? 0 : 20)} q-9 -14 0 -30 q9 16 0 30 Z" fill="#f5c542" stroke="${C}" stroke-width="2.5"/>`).join("")}</g>`;
    s += `<g transform="translate(${cx - 330} ${topo - 14})"><path d="M-30 0 L30 0 L22 -46 L-22 -46 Z" fill="#9fcfc6" stroke="${C}" stroke-width="4"/>${[[-30, -90], [0, -110], [30, -92], [-14, -70], [16, -72]].map(([x, y]) => `<path d="M0 -46 L${x} ${y + 14}" stroke="#4f8f45" stroke-width="5"/><circle cx="${x}" cy="${y}" r="16" fill="#f6d2bd" stroke="${C}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="6" fill="#e2544f"/>`).join("")}</g>`;
    if (o.prato_tampado !== false) {
      const px = (lugar !== undefined ? lugar : Wd - 120) + (o.prato_dx || 0);
      s += `<g id="${id}-prato"><ellipse cx="${px}" cy="${topo - 12}" rx="90" ry="14" fill="#fff" stroke="${C}" stroke-width="5"/><path d="M${px - 74} ${topo - 16} Q${px - 74} ${topo - 120} ${px} ${topo - 122} Q${px + 74} ${topo - 120} ${px + 74} ${topo - 16} Z" fill="#d9dce3" stroke="${C}" stroke-width="5"/><path d="M${px - 50} ${topo - 40} Q${px - 50} ${topo - 96} ${px - 10} ${topo - 106}" stroke="#fff" stroke-width="8" fill="none" opacity="0.8"/><circle cx="${px}" cy="${topo - 130}" r="10" fill="#bfc3cc" stroke="${C}" stroke-width="4"/>
        <path d="M${px - 120} ${topo - 14} v-60 M${px - 128} ${topo - 74} v20 M${px - 112} ${topo - 74} v20" stroke="${C}" stroke-width="5"/><path d="M${px + 116} ${topo - 14} v-70 q12 10 0 30" stroke="${C}" stroke-width="5" fill="none"/>
        <path d="M${px - 160} ${topo - 14} q10 -6 20 0 L${px - 144} ${topo - 50} q-6 -20 0 -36 h-12 q6 16 0 36 Z" fill="#dff3fb" stroke="${C}" stroke-width="3"/><path d="M${px - 156} ${topo - 64} h20" stroke="#b8262f" stroke-width="8"/></g>`;
    }
    return s + `</g>`;
  }

  Object.assign(window.Objetos, { cama, despertador, portaClube, podio, silhueta, balanca, sacoDinheiro, moeda, maco, montanhaDinheiro, calendario, mesaLonga, nota, macoSvg, moedaSvg, barraOuro });
})();

/* ===== Objetos da parte 2 do video do trilionario (09/11/2026) =====
 * Objetos de chao seguem a regra da biblioteca: base (pe) em y = 362, x a partir de 0.
 * Objetos flutuantes (fotinho, flash, puf, estrelinha, gota) sao centrados em (0, 0).
 * Rosto da foto: Objetos.rostoDoRig("principal_svg", "surpreso") devolve o SVG do busto do rig
 * encaixado num quadrado de 300 x 300 centrado em (0, 0); passe em o.rosto (fotinho, tvEstante, celularGrande). */
(function () {
  const C = window.Objetos.C, esc = window.Objetos.esc;
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const sombra = (cx, rx) => `<ellipse cx="${cx}" cy="364" rx="${rx}" ry="14" fill="#000" opacity="0.16"/>`;
  let nClip = 0;

  /* Busto do rig, congelado numa expressao, encaixado em 300x300 centrado em 0,0 (precisa de DOM, Rig2 e gsap). */
  const cacheRosto = {};
  function rostoDoRig(rig = "principal_svg", expr = "surpreso", zoom = 1) {
    const k = rig + "|" + expr + "|" + zoom; if (cacheRosto[k]) return cacheRosto[k];
    const host = document.createElement("div"); host.style.cssText = "position:absolute;left:-6000px;top:0";
    document.body.appendChild(host);
    const tl = gsap.timeline({ paused: true });
    const p = Rig2.criar(host, rig, { escala: 1, id: "foto" + (nClip++) });
    p.iniciar(tl); if (expr) p.expressao(tl, 0.05, expr); tl.seek(0.6);
    const svg = host.querySelector("svg"), raiz = svg.firstElementChild, bb = raiz.getBBox();
    const cab = window.CABECAS && window.CABECAS.principal;
    const headH = bb.height * 0.4, cy = bb.y + headH * 0.62, cx = bb.x + bb.width / 2;
    const s = 300 / (headH * 1.25) * zoom;
    const html = `<g transform="scale(${s.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})">${raiz.outerHTML}</g>`;
    host.remove(); tl.kill();
    return (cacheRosto[k] = html);
  }

  /* Fotinho redonda (o.r raio, o.rosto markup, o.fundo cor) */
  function fotinho(o = {}) {
    const id = o.id || "foto", r = o.r || 120, cid = id + "-clip" + (nClip++), s = (r * 2) / 300;
    const rosto = o.rosto || `<circle cx="0" cy="-20" r="90" fill="#F4A46A" stroke="${C}" stroke-width="7"/>`;
    return `<g id="${id}"><circle cx="6" cy="8" r="${r + 10}" fill="#000" opacity="0.18"/>
      <clipPath id="${cid}"><circle cx="0" cy="0" r="${r}"/></clipPath>
      <circle cx="0" cy="0" r="${r + 10}" fill="#fff8e6" stroke="${C}" stroke-width="6"/>
      <g clip-path="url(#${cid})"><circle cx="0" cy="0" r="${r}" fill="${o.fundo || "#9fd0ea"}"/><circle cx="${-r * 0.4}" cy="${-r * 0.5}" r="${r * 0.6}" fill="#fff" opacity="0.25"/><g transform="scale(${s})">${rosto}</g></g>
      <circle cx="0" cy="0" r="${r}" fill="none" stroke="${C}" stroke-width="5"/></g>`;
  }

  /* Foto retangular (para TV, telao, post) */
  function fotoRet(id, x, y, w, h, rosto, fundo = "#9fd0ea") {
    const cid = id + "-clip" + (nClip++), s = Math.max(w, h) / 300 * 0.92;
    return `<clipPath id="${cid}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>
      <g clip-path="url(#${cid})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fundo}"/><circle cx="${x + w * 0.2}" cy="${y + h * 0.2}" r="${h * 0.5}" fill="#fff" opacity="0.2"/><g transform="translate(${x + w / 2} ${y + h / 2 + h * 0.06}) scale(${s})">${rosto || ""}</g></g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${C}" stroke-width="4"/>`;
  }

  /* ---------- TV na estante (o.modo "jornal"; ids: -tela, -foto, -tarja) ---------- largura ~760 */
  function tvEstante(o = {}) {
    const id = o.id || "tv";
    let s = `<g id="${id}">${sombra(380, 380)}
      <rect x="0" y="210" width="760" height="150" rx="10" fill="#b98250" stroke="${C}" stroke-width="6"/>
      <rect x="20" y="230" width="230" height="110" rx="6" fill="#a06f43" stroke="${C}" stroke-width="4"/><rect x="510" y="230" width="230" height="110" rx="6" fill="#a06f43" stroke="${C}" stroke-width="4"/>
      <circle cx="236" cy="285" r="7" fill="#d9a93a" stroke="${C}" stroke-width="3"/><circle cx="524" cy="285" r="7" fill="#d9a93a" stroke="${C}" stroke-width="3"/>
      <rect x="280" y="240" width="200" height="40" rx="4" fill="#2b2a31" stroke="${C}" stroke-width="4"/><circle cx="460" cy="260" r="5" fill="#6fae5a"/>
      <path d="M30 360 v8 M730 360 v8" stroke="${C}" stroke-width="10"/>
      <path d="M340 210 l-30 -16 h140 l-30 16 Z" fill="#2b2a31" stroke="${C}" stroke-width="4"/>
      <rect x="80" y="-200" width="600" height="396" rx="14" fill="#2b2a31" stroke="${C}" stroke-width="7"/>
      <g id="${id}-tela"><rect x="100" y="-180" width="560" height="340" fill="#1e3a6b"/>
        ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M100 ${-170 + i * 56} h560" stroke="#24457c" stroke-width="10"/>`).join("")}
        <!-- apresentador em silhueta -->
        <path d="M140 160 Q150 40 240 30 Q330 40 340 160 Z" fill="#141a2e"/><circle cx="240" cy="-14" r="52" fill="#141a2e"/><path d="M226 40 l14 50 l14 -50 Z" fill="#e2544f"/>
        <rect x="120" y="100" width="260" height="60" fill="#3a3550"/><rect x="120" y="100" width="260" height="8" fill="#6a6290"/>
        <g id="${id}-foto">${fotoRet(id + "-f", 400, -150, 230, 200, o.rosto)}</g>
        <g id="${id}-tarja"><rect x="100" y="70" width="560" height="56" fill="#d9333a"/><rect x="100" y="70" width="140" height="56" fill="#F5C542"/><text x="170" y="108" text-anchor="middle" style="${F};font-size:24px" fill="${C}">AO VIVO</text>
          <text x="450" y="110" text-anchor="middle" style="${F};font-size:32px" fill="#fff8e6">PLANTÃO · TRILIONÁRIO</text></g>
        <rect x="100" y="126" width="560" height="34" fill="#141a2e"/><text x="112" y="150" style="${F};font-size:20px" fill="#bfc3cc">JORNAL DA NOITE · 21:47 · BOLSA SOBE 3%</text>
        <rect x="590" y="-170" width="60" height="30" rx="4" fill="#fff8e6" opacity="0.85"/><text x="620" y="-148" text-anchor="middle" style="${F};font-size:18px" fill="#1e3a6b">JN+</text>
        <path d="M120 -170 L220 -40" stroke="#fff" stroke-width="10" opacity="0.08"/></g>
      <circle cx="640" cy="186" r="4" fill="#e2544f"/>
      <!-- enfeites -->
      <path d="M20 210 l10 -60 h50 l10 60 Z" fill="#c96b4a" stroke="${C}" stroke-width="4"/>${[-24, -8, 8, 24].map(a => `<path d="M55 152 q${a} -40 ${a * 2} -70" fill="none" stroke="#4f8f45" stroke-width="9" stroke-linecap="round"/>`).join("")}
      <rect x="690" y="150" width="20" height="60" rx="3" fill="#4a90d9" stroke="${C}" stroke-width="3"/><rect x="712" y="160" width="18" height="50" rx="3" fill="#F5C542" stroke="${C}" stroke-width="3"/><rect x="732" y="146" width="20" height="64" rx="3" fill="#e2544f" stroke="${C}" stroke-width="3"/>
    </g>`;
    return s;
  }

  /* ---------- CELULAR GRANDE na mao (o.modo "feed" | "conversa") ----------
   * Tela 500x900 em x 30..530, y -560..340 (o aparelho ocupa ~ 560 x 1000; mao embaixo).
   * feed: ids -lista (rola para cima), -post (o post dele), -coracoes (cada -cor-N, opacity 0).
   * conversa: ids -msg-1, -msg-2 (opacity 0), -figurinhas (cada -fig-N, opacity 0). */
  function celularGrande(o = {}) {
    const id = o.id || "cel", modo = o.modo || "feed";
    const cid = id + "-clip" + (nClip++);
    let tela = "";
    if (modo === "feed") {
      tela += `<rect x="30" y="-560" width="500" height="900" fill="#f6f3ee"/>`;
      let lista = `<g id="${id}-lista">`;
      const post = (y, dono, cor, comFoto, k) => {
        let p = `<g ${comFoto ? `id="${id}-post"` : ""}><rect x="40" y="${y}" width="480" height="${comFoto ? 520 : 400}" rx="14" fill="#fff" stroke="#e0dad0" stroke-width="3"/>
          <circle cx="80" cy="${y + 40}" r="24" fill="${cor}" stroke="${C}" stroke-width="3"/><text x="116" y="${y + 38}" style="${F};font-size:22px" fill="${C}">${dono}</text><text x="116" y="${y + 62}" style="${F};font-size:16px" fill="#9a96a3">agora · Brasil</text>
          <text x="490" y="${y + 46}" text-anchor="end" style="${F};font-size:28px" fill="#9a96a3">···</text>`;
        if (comFoto) p += fotoRet(id + "-pf", 50, y + 80, 460, 330, o.rosto, "#ffe08a") + `<rect x="64" y="${y + 92}" width="200" height="44" rx="10" fill="${C}" opacity="0.85"/><text x="164" y="${y + 122}" text-anchor="middle" style="${F};font-size:22px" fill="#F5C542">É ELE!!! 😱</text>`;
        else p += `<rect x="50" y="${y + 80}" width="460" height="230" fill="${esc(cor, 0.4)}"/><circle cx="160" cy="${y + 170}" r="50" fill="${esc(cor, 0.2)}"/><path d="M50 ${y + 310} L200 ${y + 200} L300 ${y + 270} L380 ${y + 220} L510 ${y + 310} Z" fill="${esc(cor, -0.1)}"/>`;
        const yb = y + (comFoto ? 440 : 330);
        p += `<path d="M66 ${yb} q-14 -16 0 -26 q10 -6 16 4 q6 -10 16 -4 q14 10 0 26 l-16 14 Z" fill="${comFoto ? "#e2544f" : "none"}" stroke="${C}" stroke-width="3"/>
          <path d="M126 ${yb - 24} h30 a6 6 0 0 1 6 6 v14 a6 6 0 0 1 -6 6 h-18 l-10 8 v-8 h-2 a6 6 0 0 1 -6 -6 v-14 a6 6 0 0 1 6 -6 Z" fill="none" stroke="${C}" stroke-width="3"/>
          <path d="M190 ${yb - 6} l30 -16 l-6 30 Z" fill="none" stroke="${C}" stroke-width="3"/>
          <text x="66" y="${yb + 44}" style="${F};font-size:20px" fill="${C}">${comFoto ? "9,8 mi curtidas" : (1 + k) + "2 curtidas"}</text></g>`;
        return p;
      };
      lista += post(-480, "maria.fotos", "#6fae5a", false, 1) + post(-60, "noticias_ja", "#e2544f", true, 0) + post(480, "gato.do.dia", "#b07cc6", false, 3) + post(900, "receitas", "#f29e4c", false, 2) + `</g>`;
      tela += lista;
      tela += `<rect x="30" y="-560" width="500" height="80" fill="#fff" stroke="#e0dad0" stroke-width="3"/><text x="60" y="-506" style="${F};font-size:34px" fill="${C}">feed</text><path d="M440 -530 h50 M440 -518 h50 M440 -506 h50" stroke="${C}" stroke-width="4"/>
        <rect x="30" y="270" width="500" height="70" fill="#fff" stroke="#e0dad0" stroke-width="3"/>${[90, 190, 280, 370, 470].map((x, i) => `<circle cx="${x}" cy="305" r="${i === 2 ? 20 : 14}" fill="${i === 2 ? "#F5C542" : "none"}" stroke="${C}" stroke-width="4"/>`).join("")}`;
      let cor = `<g id="${id}-coracoes">`;
      for (let i = 0; i < 10; i++) { const x = 140 + rnd(i) * 320, y = 120 - rnd(i + 9) * 80, s = 0.8 + rnd(i + 3) * 0.8; cor += `<g id="${id}-cor-${i}" opacity="0" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)})"><path d="M0 14 q-30 -24 -16 -40 q12 -12 16 4 q4 -16 16 -4 q14 16 -16 40 Z" fill="#e2544f" stroke="${C}" stroke-width="3"/><circle cx="-8" cy="-18" r="4" fill="#fff" opacity="0.7"/></g>`; }
      tela += cor + `</g>`;
    } else {
      tela += `<rect x="30" y="-560" width="500" height="900" fill="#efe6d6"/>`;
      for (let i = 0; i < 30; i++) tela += `<circle cx="${50 + rnd(i) * 460}" cy="${-460 + rnd(i + 40) * 720}" r="${4 + rnd(i + 7) * 6}" fill="#e3d7c2"/>`;
      tela += `<rect x="30" y="-560" width="500" height="100" fill="#2e7d4f"/><path d="M60 -510 l-14 0 l12 -14 M46 -510 l12 14" fill="none" stroke="#fff8e6" stroke-width="4" stroke-linecap="round"/>
        <circle cx="110" cy="-510" r="30" fill="#F5C542" stroke="${C}" stroke-width="3"/><text x="110" y="-500" text-anchor="middle" style="${F};font-size:26px" fill="${C}">F</text>
        <text x="156" y="-514" style="${F};font-size:28px" fill="#fff8e6">Família 💛</text><text x="156" y="-484" style="${F};font-size:17px" fill="#cfe9d8">Tia Cida, Mãe, Vô, +14</text>`;
      tela += `<g><rect x="50" y="-430" width="300" height="70" rx="16" fill="#fff" stroke="${C}" stroke-width="3"/><text x="70" y="-404" style="${F};font-size:17px" fill="#3aa36b">Vô</text><text x="70" y="-376" style="${F};font-size:22px" fill="${C}">bom dia a todos 🌻</text></g>`;
      tela += `<g>${fotoRet(id + "-cf", 210, -330, 300, 220, o.rosto, "#ffe08a")}<rect x="200" y="-340" width="320" height="270" rx="14" fill="none" stroke="#cfe9c0" stroke-width="10"/><text x="500" y="-84" text-anchor="end" style="${F};font-size:16px" fill="#6b8a6b">21:48 ✓✓</text></g>`;
      tela += `<g id="${id}-msg-1" opacity="0"><rect x="50" y="-40" width="330" height="96" rx="16" fill="#fff" stroke="${C}" stroke-width="3"/><text x="70" y="-12" style="${F};font-size:18px" fill="#e2544f">Tia Cida</text><text x="70" y="24" style="${F};font-size:32px" fill="${C}">é ele??</text></g>`;
      tela += `<g id="${id}-msg-2" opacity="0"><rect x="50" y="70" width="400" height="96" rx="16" fill="#fff" stroke="${C}" stroke-width="3"/><text x="70" y="98" style="${F};font-size:18px" fill="#4a90d9">Mãe</text><text x="70" y="134" style="${F};font-size:30px" fill="${C}">o nosso menino!!!</text></g>`;
      tela += `<rect x="30" y="270" width="500" height="70" fill="#f6f3ee"/><rect x="50" y="284" width="380" height="44" rx="22" fill="#fff" stroke="${C}" stroke-width="3"/><text x="74" y="314" style="${F};font-size:18px" fill="#b0aab8">Mensagem</text><circle cx="480" cy="306" r="26" fill="#2e7d4f" stroke="${C}" stroke-width="3"/><path d="M470 294 l20 12 l-20 12 Z" fill="#fff8e6"/>`;
      const figs = [
        (x, y) => `<circle cx="${x}" cy="${y}" r="44" fill="#F5C542" stroke="${C}" stroke-width="4"/><circle cx="${x - 14}" cy="${y - 10}" r="7" fill="${C}"/><circle cx="${x + 14}" cy="${y - 10}" r="7" fill="${C}"/><ellipse cx="${x}" cy="${y + 18}" rx="12" ry="15" fill="${C}"/><path d="M${x - 50} ${y - 34} l12 10 M${x + 50} ${y - 34} l-12 10" stroke="${C}" stroke-width="4"/>`,
        (x, y) => `<path d="M${x} ${y + 34} q-56 -40 -30 -70 q22 -20 30 8 q8 -28 30 -8 q26 30 -30 70 Z" fill="#e2544f" stroke="${C}" stroke-width="4"/>`,
        (x, y) => `<path d="M${x} ${y - 46} l13 30 l32 3 l-24 21 l8 32 l-29 -17 l-29 17 l8 -32 l-24 -21 l32 -3 Z" fill="#F5C542" stroke="${C}" stroke-width="4" stroke-linejoin="round"/>`,
        (x, y) => `<circle cx="${x}" cy="${y}" r="44" fill="#F5C542" stroke="${C}" stroke-width="4"/><path d="M${x - 24} ${y - 8} q8 -14 16 0 M${x + 8} ${y - 8} q8 -14 16 0" fill="none" stroke="${C}" stroke-width="5"/><path d="M${x - 24} ${y + 10} q24 30 48 0 Z" fill="${C}"/><path d="M${x - 34} ${y - 2} q-8 14 -2 24" fill="#9fd0ea" stroke="${C}" stroke-width="3"/>`];
      let fg = `<g id="${id}-figurinhas">`; [[400, 210], [130, 230], [300, 200], [460, 110]].forEach(([x, y], i) => fg += `<g id="${id}-fig-${i}" opacity="0">${figs[i % 4](x, y)}</g>`);
      tela += fg + `</g>`;
    }
    return `<g id="${id}">
      <rect x="0" y="-600" width="560" height="980" rx="64" fill="#2b2a31" stroke="${C}" stroke-width="8"/><rect x="14" y="-586" width="532" height="952" rx="54" fill="#3c3a46"/>
      <clipPath id="${cid}"><rect x="30" y="-560" width="500" height="900" rx="30"/></clipPath><g clip-path="url(#${cid})">${tela}</g>
      <rect x="30" y="-560" width="500" height="900" rx="30" fill="none" stroke="${C}" stroke-width="4"/>
      <rect x="220" y="-582" width="120" height="16" rx="8" fill="#1b1a20"/><path d="M70 -540 L150 -400" stroke="#fff" stroke-width="16" opacity="0.07"/>
      <rect x="-8" y="-380" width="10" height="80" rx="4" fill="#2b2a31" stroke="${C}" stroke-width="3"/>
      <!-- mao (pele do principal): dedos na borda direita, polegar na esquerda, punho com a manga azul saindo por baixo -->
      ${[120, 210, 300].map(y => `<path d="M548 ${y - 34} q70 -6 74 30 q2 34 -74 36 Z" fill="#F4A46A" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M596 ${y - 10} q10 0 14 8" fill="none" stroke="${esc("#F4A46A", -0.2)}" stroke-width="4"/>`).join("")}
      <path d="M12 300 Q-34 250 -20 190 Q-10 160 14 176 L40 250 Q60 300 40 340 Z" fill="#F4A46A" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M-8 196 q10 -6 18 4" fill="none" stroke="#fff" stroke-width="5" opacity="0.4"/>
      <path d="M60 380 Q120 420 280 420 Q460 420 520 380 L470 560 H110 Z" fill="#F4A46A" stroke="${C}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M150 440 q60 18 130 6" fill="none" stroke="${esc("#F4A46A", -0.2)}" stroke-width="5"/>
      <path d="M100 520 H480 L500 700 H80 Z" fill="#0b3df0" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M96 556 H484" stroke="#0a32c4" stroke-width="10"/></g>`;
  }

  /* ---------- MULTIDAO de costas (o.n pessoas por fileira, o.fileiras, o.semente) ----------
   * Base em 362. Cada pessoa: -p<i> (para multiplicar em cascata); quem segura camera tem -cam<i> (flash vai aqui).
   * multidao.info(o): lista {i, x, y, e, cam} de cada pessoa. Fileiras de tras sao menores e mais acima. Largura ~1900. */
  function pessoasMultidao(o = {}) {
    const n = o.n || 9, fil = o.fileiras || 4, sem = o.semente || 1, W = o.largura || 1900, lista = [];
    let i = 0;
    for (let f = fil - 1; f >= 0; f--) {
      const e = 1 - f * 0.16, y = 362 - f * 70;
      const nn = n + f * 2;
      for (let j = 0; j < nn; j++) {
        const x = (j + 0.5 + (rnd(sem + i) - 0.5) * 0.5 + (f % 2) * 0.5) * (W / nn);
        lista.push({ i, x: Math.round(x), y, e: +e.toFixed(2), f, cam: rnd(sem + i + 300) > 0.72 });
        i++;
      }
    }
    return lista;
  }
  function multidao(o = {}) {
    const id = o.id || "multi", L = pessoasMultidao(o);
    const peles = ["#F4C7A1", "#E0A47A", "#C68642", "#8D5524", "#F1D2B6", "#A86B42"];
    const cabelos = ["#2b2522", "#5a3a22", "#e8b04a", "#1f1a18", "#8a8e98", "#b8412e", "#3d2b1f"];
    const roupas = ["#e2544f", "#4a90d9", "#6fae5a", "#F5C542", "#b07cc6", "#f29e4c", "#9fcfc6", "#ef5b8c", "#3c3a46", "#f4efe4"];
    let s = `<g id="${id}">`;
    L.forEach(P => {
      const k = P.i + (o.semente || 1) * 17, pele = peles[k % 6], cab = cabelos[(k * 3) % 7], roupa = roupas[(k * 7) % 10];
      const h = 0.9 + rnd(k) * 0.25, larg = 0.9 + rnd(k + 5) * 0.25;
      const tom = P.f > 0 ? esc(roupa, -0.08 * P.f) : roupa;
      let p = `<g id="${id}-p${P.i}" transform="translate(${P.x} ${P.y}) scale(${P.e})">
        <path d="M${-60 * larg} 0 Q${-64 * larg} ${-150 * h} ${-30 * larg} ${-170 * h} L${30 * larg} ${-170 * h} Q${64 * larg} ${-150 * h} ${60 * larg} 0 Z" fill="${tom}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
        <path d="M${-20 * larg} ${-168 * h} Q0 ${-150 * h} ${20 * larg} ${-168 * h}" fill="none" stroke="${esc(tom, -0.2)}" stroke-width="5"/>
        <rect x="-14" y="${-196 * h}" width="28" height="30" fill="${pele}" stroke="${C}" stroke-width="5"/>
        <circle cx="0" cy="${-240 * h}" r="50" fill="${pele}" stroke="${C}" stroke-width="6"/><circle cx="-50" cy="${-236 * h}" r="12" fill="${pele}" stroke="${C}" stroke-width="5"/><circle cx="50" cy="${-236 * h}" r="12" fill="${pele}" stroke="${C}" stroke-width="5"/>`;
      const est = k % 5;
      if (est === 0) p += `<path d="M-52 ${-236 * h} Q-56 ${-300 * h} 0 ${-296 * h} Q56 ${-300 * h} 52 ${-236 * h} Q40 ${-214 * h} 0 ${-212 * h} Q-40 ${-214 * h} -52 ${-236 * h} Z" fill="${cab}" stroke="${C}" stroke-width="6"/>`;
      else if (est === 1) p += `<path d="M-54 ${-236 * h} Q-60 ${-300 * h} 0 ${-298 * h} Q60 ${-300 * h} 54 ${-236 * h} L58 ${-160 * h} Q0 ${-150 * h} -58 ${-160 * h} Z" fill="${cab}" stroke="${C}" stroke-width="6"/>`;
      else if (est === 2) p += `<path d="M-52 ${-240 * h} Q-50 ${-296 * h} 0 ${-294 * h} Q50 ${-296 * h} 52 ${-240 * h} Q0 ${-224 * h} -52 ${-240 * h} Z" fill="${cab}" stroke="${C}" stroke-width="6"/><circle cx="0" cy="${-300 * h}" r="22" fill="${cab}" stroke="${C}" stroke-width="5"/>`;
      else if (est === 3) p += `<path d="M-54 ${-246 * h} Q-50 ${-298 * h} 0 ${-298 * h} Q50 ${-298 * h} 54 ${-246 * h} Z" fill="${roupas[(k + 3) % 10]}" stroke="${C}" stroke-width="6"/><path d="M-54 ${-248 * h} h108" stroke="${C}" stroke-width="6"/>`;
      else p += `<path d="M-50 ${-250 * h} Q-40 ${-290 * h} 0 ${-290 * h} Q40 ${-290 * h} 50 ${-250 * h} Q20 ${-262 * h} 0 ${-262 * h} Q-20 ${-262 * h} -50 ${-250 * h} Z" fill="${cab}" stroke="${C}" stroke-width="5"/>`;
      if (P.cam) p += `<g id="${id}-cam${P.i}"><path d="M40 ${-150 * h} Q70 ${-230 * h} 50 ${-300 * h}" fill="none" stroke="${C}" stroke-width="22" stroke-linecap="round"/><path d="M40 ${-150 * h} Q70 ${-230 * h} 50 ${-300 * h}" fill="none" stroke="${tom}" stroke-width="13" stroke-linecap="round"/>
        <rect x="20" y="${-360 * h}" width="80" height="54" rx="8" fill="#2b2a31" stroke="${C}" stroke-width="5"/><rect x="30" y="${-372 * h}" width="26" height="14" rx="3" fill="#2b2a31" stroke="${C}" stroke-width="4"/><circle cx="60" cy="${-333 * h}" r="14" fill="#6a6f7d" stroke="${C}" stroke-width="3"/></g>`;
      s += p + `</g>`;
    });
    return s + `</g>`;
  }
  multidao.info = pessoasMultidao;

  /* ---------- CARTAZ na vara (o.texto, o.cor, o.w) ---------- base em 362 (ponta da vara); placa no alto */
  function cartaz(o = {}) {
    const id = o.id || "cartaz", w = o.w || 360, cor = o.cor || "#fff8e6", t = o.texto || "TE AMO", tam = o.tam || Math.min(64, (w - 40) / (t.length * 0.62));
    return `<g id="${id}"><rect x="${w / 2 - 9}" y="40" width="18" height="322" fill="#c58b4c" stroke="${C}" stroke-width="5"/>
      <g transform="rotate(${o.giro || -3} ${w / 2} 0)"><rect x="6" y="-116" width="${w}" height="170" rx="6" fill="#000" opacity="0.15"/><rect x="0" y="-124" width="${w}" height="170" rx="6" fill="${cor}" stroke="${C}" stroke-width="6"/>
      <text x="${w / 2}" y="${-38 + tam * 0.35}" text-anchor="middle" style="${F};font-size:${tam.toFixed(0)}px" fill="${o.corTexto || "#d9333a"}">${t}</text>
      ${o.coracao ? `<path d="M${w - 40} -90 q-24 -18 -12 -32 q10 -8 12 4 q2 -12 12 -4 q12 14 -12 32 Z" fill="#e2544f" stroke="${C}" stroke-width="3"/>` : ""}
      <path d="M14 -110 l14 0 M${w - 28} 30 l14 0" stroke="#bfc3cc" stroke-width="5"/></g></g>`;
  }

  /* ---------- RELOGIO DE PAREDE grande (ids -hora e -min giram em volta do centro 0 0; r 160) ---------- */
  function relogioParede(o = {}) {
    const id = o.id || "relogio", r = o.r || 160;
    let s = `<g id="${id}"><circle cx="8" cy="10" r="${r + 20}" fill="#000" opacity="0.15"/><circle cx="0" cy="0" r="${r + 20}" fill="#d9a93a" stroke="${C}" stroke-width="8"/><circle cx="0" cy="0" r="${r}" fill="#fff8e6" stroke="${C}" stroke-width="6"/>`;
    for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180, l = i % 5 ? 10 : 24; s += `<path d="M${Math.sin(a) * (r - 8)} ${-Math.cos(a) * (r - 8)} L${Math.sin(a) * (r - 8 - l)} ${-Math.cos(a) * (r - 8 - l)}" stroke="${C}" stroke-width="${i % 5 ? 3 : 7}" stroke-linecap="round"/>`; }
    [12, 3, 6, 9].forEach(n => { const a = n * 30 * Math.PI / 180; s += `<text x="${Math.sin(a) * (r - 58)}" y="${-Math.cos(a) * (r - 58) + 17}" text-anchor="middle" style="${F};font-size:46px" fill="${C}">${n}</text>`; });
    s += `<g id="${id}-hora"><path d="M-10 18 L-7 ${-r * 0.5} Q0 ${-r * 0.58} 7 ${-r * 0.5} L10 18 Z" fill="${C}"/></g>
      <g id="${id}-min"><path d="M-6 24 L-4 ${-r * 0.8} Q0 ${-r * 0.86} 4 ${-r * 0.8} L6 24 Z" fill="#d9333a" stroke="${C}" stroke-width="2"/></g>
      <circle cx="0" cy="0" r="14" fill="#F5C542" stroke="${C}" stroke-width="5"/><path d="M${-r * 0.6} ${-r * 0.55} Q${-r * 0.2} ${-r * 0.9} ${r * 0.3} ${-r * 0.8}" fill="none" stroke="#fff" stroke-width="12" opacity="0.6" stroke-linecap="round"/></g>`;
    return s;
  }

  /* ---------- EFEITOS (centrados em 0,0) ---------- */
  // flash de camera: estrela de raios + miolo (animar scale 0 -> 1 -> 0 em ~0,15 s)
  function flashCamera(o = {}) {
    const id = o.id || "flash", r = o.r || 90;
    let raios = ""; for (let i = 0; i < 8; i++) { const a = i * 45 * Math.PI / 180, l = i % 2 ? r * 0.6 : r; raios += `<path d="M${Math.cos(a + 0.12) * 16} ${Math.sin(a + 0.12) * 16} L${Math.cos(a) * l} ${Math.sin(a) * l} L${Math.cos(a - 0.12) * 16} ${Math.sin(a - 0.12) * 16} Z" fill="#fff8e6" stroke="#F5C542" stroke-width="3"/>`; }
    return `<g id="${id}"><circle cx="0" cy="0" r="${r * 0.9}" fill="#fff8d0" opacity="0.35"/>${raios}<circle cx="0" cy="0" r="${r * 0.3}" fill="#fff" stroke="#F5C542" stroke-width="4"/></g>`;
  }
  // puf de fumaca: 7 bolas (-b0..-b6) para crescer em cascata e sumir; centro 0,0; ~ 360 x 300
  function puf(o = {}) {
    const id = o.id || "puf", cor = o.cor || "#eeeaf2";
    const B = [[0, 0, 90], [-100, 30, 70], [100, 30, 74], [-60, -70, 66], [70, -66, 70], [-140, -20, 48], [150, -10, 50]];
    let s = `<g id="${id}">`;
    B.forEach(([x, y, r], i) => s += `<g id="${id}-b${i}"><circle cx="${x}" cy="${y}" r="${r}" fill="${cor}" stroke="${C}" stroke-width="6"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.35}" fill="#fff" opacity="0.7"/><path d="M${x - r * 0.5} ${y + r * 0.5} q${r * 0.5} ${r * 0.25} ${r} 0" fill="none" stroke="${esc(cor, -0.15)}" stroke-width="5"/></g>`);
    [[-190, -100], [200, -110], [-200, 90], [210, 80]].forEach(([x, y], i) => s += `<circle id="${id}-g${i}" cx="${x}" cy="${y}" r="16" fill="${cor}" stroke="${C}" stroke-width="4"/>`);
    return s + `</g>`;
  }
  // estrelinha de brilho (4 pontas) + 2 pequenas
  function estrelinha(o = {}) {
    const id = o.id || "estrela", r = o.r || 50, cor = o.cor || "#F5C542";
    const e = (x, y, k) => `<path d="M${x} ${y - r * k} Q${x + r * 0.16 * k} ${y - r * 0.16 * k} ${x + r * k} ${y} Q${x + r * 0.16 * k} ${y + r * 0.16 * k} ${x} ${y + r * k} Q${x - r * 0.16 * k} ${y + r * 0.16 * k} ${x - r * k} ${y} Q${x - r * 0.16 * k} ${y - r * 0.16 * k} ${x} ${y - r * k} Z" fill="${cor}" stroke="${C}" stroke-width="${4 * Math.max(k, 0.6)}" stroke-linejoin="round"/>`;
    return `<g id="${id}">${e(0, 0, 1)}<circle cx="${-r * 0.2}" cy="${-r * 0.2}" r="${r * 0.1}" fill="#fff"/>${e(r * 1.1, -r * 0.9, 0.38)}${e(-r * 1.0, r * 0.8, 0.3)}</g>`;
  }
  // gota de suor (ponta para cima; ~ 40 x 64)
  function gotaSuor(o = {}) {
    const id = o.id || "gota", k = o.k || 1;
    return `<g id="${id}" transform="scale(${k})"><path d="M0 -36 Q26 0 22 14 Q18 30 0 30 Q-18 30 -22 14 Q-26 0 0 -36 Z" fill="#9fd8f5" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M-8 0 Q-12 12 -6 20" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`;
  }

  Object.assign(window.Objetos, { rostoDoRig, fotinho, tvEstante, celularGrande, multidao, cartaz, relogioParede, flashCamera, puf, estrelinha, gotaSuor });
})();

/* ===== Objetos da parte 3 do video do trilionario (09/11/2026) =====
 * Convencao: objetos "de chao" desenhados com o chao em y=362 (usar com obj(tipo, x, pes, escala));
 * objetos "de mao" e "flutuantes" centrados em 0,0 (usar com flut). Pecas moveis com id proprio. */
(function () {
  const O = window.Objetos, C = O.C, esc = O.esc;
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const T = (x, y, txt, tam, cor = "#fff8e6", anc = "middle", extra = "") => `<text x="${x}" y="${y}" text-anchor="${anc}" style="${F};font-size:${tam}px" fill="${cor}" ${extra}>${txt}</text>`;
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  let n = 0;

  /* ---------- c12: carne e hatch velho ---------- */
  // carne de parcelas (flutuante, ~ 300 x 200): "PARCELA 23 DE 60"
  function carne(o = {}) {
    const id = o.id || "carne", a = o.parcela || 23, b = o.total || 60;
    return `<g id="${id}"><rect x="-146" y="-92" width="300" height="196" rx="8" fill="#000" opacity="0.15"/>
      <rect x="-150" y="-100" width="300" height="196" rx="8" fill="#fff8e6" stroke="${C}" stroke-width="6"/>
      <rect x="-150" y="-100" width="300" height="44" rx="8" fill="#4a90d9" stroke="${C}" stroke-width="6"/>${T(0, -68, "CARNÊ", 30)}
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<circle cx="${-130 + i * 29}" cy="-56" r="4" fill="${C}" opacity="0.5"/>`).join("")}
      ${T(0, -14, "PARCELA", 30, "#2E2A33")}${T(0, 40, `${a} DE ${b}`, 52, "#d9333a")}
      <path d="M-120 70 h240" stroke="#bfc3cc" stroke-width="4"/><path d="M-120 82 h160" stroke="#bfc3cc" stroke-width="4"/>
      <rect x="-26" y="-118" width="52" height="30" rx="4" fill="#d9dce3" stroke="${C}" stroke-width="4" opacity="0.9"/></g>`;
  }
  // hatch velho: hatch prata sujo com uma calota faltando
  function carroVelho(o = {}) {
    const id = o.id || "velho";
    let s = O.carroHatch({ cor: o.cor || "#c3c7cf", id });
    // roda da frente sem calota: tampa escura por cima
    s = s.replace(/<\/g>\s*$/, `<g id="${id}-sem-calota"><circle cx="684" cy="300" r="44" fill="#4a4d57" stroke="${C}" stroke-width="4"/>${[0, 1, 2, 3, 4].map(i => { const a = i * 72 * Math.PI / 180; return `<circle cx="${684 + Math.cos(a) * 24}" cy="${300 + Math.sin(a) * 24}" r="6" fill="#8f939e" stroke="${C}" stroke-width="2"/>`; }).join("")}<circle cx="684" cy="300" r="12" fill="#6b6e78" stroke="${C}" stroke-width="3"/></g>
      <g id="${id}-sujeira" opacity="0.55">${[[120, 280, 40], [210, 268, 26], [380, 288, 34], [560, 276, 30], [760, 284, 40], [820, 262, 18], [300, 250, 14]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.45}" fill="#8a6a4a"/>`).join("")}
      <path d="M100 290 q30 -10 60 0 M640 292 q30 -12 70 0" stroke="#7a5a3a" stroke-width="5" fill="none"/></g>
      <path d="M560 210 l40 -6 M590 220 l30 -4" stroke="#8f939e" stroke-width="3"/></g>`);
    return s;
  }

  /* ---------- c13: esportivo, carimbo ---------- */
  // esportivo generico (sem marca), azul em dois tons, de lado virado para a direita. Chao em 362, largura ~920.
  function carroEsportivo(o = {}) {
    const id = o.id || "esportivo", c1 = o.cor || "#1f4fa8", c2 = o.cor2 || "#7fb2e8";
    return `<g id="${id}"><ellipse cx="460" cy="362" rx="420" ry="16" fill="#000" opacity="0.2"/>
      <path d="M40 300 L36 262 Q40 236 80 228 L250 200 Q330 140 430 130 Q560 124 640 160 L760 210 Q860 222 892 252 Q904 270 900 300 Z" fill="${c2}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M40 300 L36 262 Q40 236 80 228 L250 200 Q300 210 330 240 Q380 290 360 300 Z" fill="${c1}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M640 300 Q620 240 700 214 L760 210 Q860 222 892 252 Q904 270 900 300 Z" fill="${c1}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M330 240 Q420 300 640 280" fill="none" stroke="${C}" stroke-width="5"/><path d="M340 232 Q430 286 630 270" fill="none" stroke="#fff" stroke-width="5" opacity="0.6"/>
      <path d="M300 196 Q360 150 440 144 L560 146 Q610 152 650 186 Z" fill="#2b3a55" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M360 186 L420 152 L450 152 L392 186 Z" fill="#fff" opacity="0.45"/>
      <path d="M470 146 V196" stroke="${C}" stroke-width="5"/>
      <path d="M790 226 Q850 232 880 252 L838 258 Q800 246 790 226 Z" fill="#fff7c2" stroke="${C}" stroke-width="4"/><path d="M42 248 L90 240 L90 262 L40 266 Z" fill="#e2544f" stroke="${C}" stroke-width="4"/>
      <path d="M470 220 h80 l-10 30 h-60 Z" fill="#1a2a4a" stroke="${C}" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<path d="M${480 + i * 18} 226 v20" stroke="#4a5a7a" stroke-width="3"/>`).join("")}
      <path d="M130 196 h120 l-10 -16 h-110 Z" fill="${c1}" stroke="${C}" stroke-width="4"/>
      <path d="M150 304 A88 88 0 0 1 326 304 Z" fill="#2b2a31"/><path d="M640 304 A88 88 0 0 1 816 304 Z" fill="#2b2a31"/>
      ${O.roda(238, 304, 64, id + "-roda-tras")}${O.roda(728, 304, 64, id + "-roda-frente")}
      <path d="M150 304 A88 88 0 0 1 326 304 M640 304 A88 88 0 0 1 816 304" fill="none" stroke="${C}" stroke-width="6"/>
      <path d="M860 300 h50 v-12 h-40 Z M30 300 h40 v-10 h-36 Z" fill="#4a4d57" stroke="${C}" stroke-width="4"/></g>`;
  }
  // marca de carimbo "VENDIDA" (flutuante, ~ 560 x 220), girada
  function carimbo(o = {}) {
    const id = o.id || "carimbo", t = o.texto || "VENDIDA", cor = o.cor || "#d9333a";
    return `<g id="${id}" transform="rotate(${o.giro ?? -12})"><rect x="-280" y="-110" width="560" height="220" rx="24" fill="#fff" opacity="0.25"/>
      <rect x="-280" y="-110" width="560" height="220" rx="24" fill="none" stroke="${cor}" stroke-width="18"/><rect x="-252" y="-84" width="504" height="168" rx="14" fill="none" stroke="${cor}" stroke-width="6"/>
      ${T(0, 40, t, 112, cor, "middle", 'letter-spacing="6"')}${[[-230, -60], [200, 70], [120, -80], [-150, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${6 + rnd(x) * 6}" fill="#fff" opacity="0.7"/>`).join("")}</g>`;
  }

  /* ---------- c14: pizza e lupa ---------- */
  // pizza "SEU PATRIMONIO": circulo verde com uma fatia fininha (pct) destacada. Centro 0,0, raio r.
  // ids: -cheio (circulo), -fatia (fatia, amarela), -rotulo
  function pizza(o = {}) {
    const id = o.id || "pizza", r = o.r || 300, pct = o.pct ?? 0.2, a0 = -90, a1 = a0 + Math.max(pct, 0.6) * 3.6;
    const p = (a) => [Math.cos(a * Math.PI / 180) * r, Math.sin(a * Math.PI / 180) * r];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `<g id="${id}"><circle cx="10" cy="14" r="${r}" fill="#000" opacity="0.15"/>
      <circle id="${id}-cheio" cx="0" cy="0" r="${r}" fill="#4caf6a" stroke="${C}" stroke-width="8"/>
      <circle cx="0" cy="0" r="${r * 0.82}" fill="none" stroke="#6fca88" stroke-width="6" stroke-dasharray="10 16"/>
      <path d="M${-r * 0.5} ${-r * 0.55} q${r * 0.3} ${-r * 0.2} ${r * 0.6} ${-r * 0.12}" stroke="#8ee0a4" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path id="${id}-fatia" d="M0 0 L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z" fill="#F5C542" stroke="${C}" stroke-width="4"/>
      <g id="${id}-rotulo"><rect x="-210" y="${-30}" width="420" height="70" rx="16" fill="#2E2A33" opacity="0.85"/>${T(0, 18, o.rotulo || "SEU PATRIMÔNIO", 40, "#fff8e6")}</g></g>`;
  }
  // lupa (flutuante): centro da lente em 0,0, raio r; cabo para baixo-direita. ids: -lente, -anel (amarelo, pulsa)
  function lupa(o = {}) {
    const id = o.id || "lupa", r = o.r || 120;
    return `<g id="${id}"><path d="M${r * 0.7} ${r * 0.7} L${r * 1.7} ${r * 1.7}" stroke="${C}" stroke-width="${r * 0.36}" stroke-linecap="round"/><path d="M${r * 0.74} ${r * 0.74} L${r * 1.66} ${r * 1.66}" stroke="#a86b42" stroke-width="${r * 0.24}" stroke-linecap="round"/><path d="M${r * 0.9} ${r * 0.9} L${r * 1.0} ${r * 1.0}" stroke="#d9a93a" stroke-width="${r * 0.3}"/>
      <circle id="${id}-lente" cx="0" cy="0" r="${r}" fill="#dff2fa" fill-opacity="0.35" stroke="${C}" stroke-width="${r * 0.2}"/><circle cx="0" cy="0" r="${r}" fill="none" stroke="#c9ccd4" stroke-width="${r * 0.1}"/>
      <path d="M${-r * 0.6} ${-r * 0.2} A${r * 0.65} ${r * 0.65} 0 0 1 ${-r * 0.15} ${-r * 0.62}" stroke="#fff" stroke-width="${r * 0.1}" fill="none" stroke-linecap="round"/>
      <circle id="${id}-anel" cx="0" cy="0" r="${r * 1.18}" fill="none" stroke="#F5C542" stroke-width="${r * 0.08}" opacity="0"/></g>`;
  }

  /* ---------- c15/c16: comidas, livro-caixa, lixeira, camera, bandeirinha ---------- */
  // pastel (de mao, ~ 160 x 90); o.mordido = true tira uma mordida
  function pastel(o = {}) {
    const id = o.id || "pastel";
    const corpo = `<path d="M-80 20 Q-84 -40 0 -46 Q84 -40 80 20 Q0 34 -80 20 Z" fill="#f2c46a" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>${[-60, -40, -20, 0, 20, 40, 60].map(x => `<path d="M${x - 6} ${24 - Math.abs(x) * 0.06} l6 8 l6 -8" fill="none" stroke="#c4913e" stroke-width="3"/>`).join("")}<circle cx="-30" cy="-18" r="5" fill="#e0a64a"/><circle cx="20" cy="-26" r="4" fill="#e0a64a"/><circle cx="44" cy="-6" r="5" fill="#e0a64a"/><path d="M-50 -30 q30 -12 60 -8" stroke="#fbe0a0" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    if (!o.mordido) return `<g id="${id}">${corpo}</g>`;
    const cid = id + "-m" + (n++);
    return `<g id="${id}"><clipPath id="${cid}"><path d="M-200 -200 H200 V200 H-200 Z M84 -40 m0 0 a26 26 0 1 0 0.1 0 Z M60 10 a22 22 0 1 0 0.1 0 Z" clip-rule="evenodd"/></clipPath><g clip-path="url(#${cid})">${corpo}</g><path d="M58 -50 a26 26 0 0 0 4 30 a22 22 0 0 0 -4 26" fill="none" stroke="${C}" stroke-width="4"/><path d="M60 -10 l10 4 M56 4 l12 0" stroke="#7a4a2e" stroke-width="4"/></g>`;
  }
  // copo de caldo de cana (de mao, ~ 70 x 130)
  function copoCaldo(o = {}) {
    const id = o.id || "caldo";
    return `<g id="${id}"><path d="M-36 -60 L36 -60 L28 64 L-28 64 Z" fill="#e3f4c9" fill-opacity="0.55" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M-33 -36 L33 -36 L28 60 L-28 60 Z" fill="#c9de6a"/><path d="M-30 -36 h60" stroke="#f4fadf" stroke-width="6"/>${[[-14, -20], [8, -10], [-6, 10]].map(([x, y]) => `<rect x="${x}" y="${y}" width="16" height="14" rx="3" fill="#fff" opacity="0.8" stroke="${C}" stroke-width="2"/>`).join("")}<path d="M-20 -50 L-16 52" stroke="#fff" stroke-width="6" opacity="0.6"/><path d="M14 -60 L30 -100" stroke="${C}" stroke-width="10" stroke-linecap="round"/><path d="M14 -60 L30 -100" stroke="#e2544f" stroke-width="5" stroke-linecap="round"/><path d="M-36 -60 L36 -60" stroke="${C}" stroke-width="6"/></g>`;
  }
  // xicara de cafe com pires (de mao, ~ 130 x 90)
  function xicaraCafe(o = {}) {
    const id = o.id || "xicara";
    return `<g id="${id}"><ellipse cx="0" cy="36" rx="66" ry="12" fill="#f4efe4" stroke="${C}" stroke-width="5"/><path d="M-42 -20 h84 q-2 50 -42 56 q-40 -6 -42 -56 Z" fill="#fff" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="0" cy="-20" rx="42" ry="9" fill="#6b3f22" stroke="${C}" stroke-width="4"/><path d="M42 -10 q26 -2 24 18 q-2 16 -28 16" fill="none" stroke="${C}" stroke-width="5"/><path d="M-26 0 q4 20 14 26" stroke="#e8e2d6" stroke-width="6" fill="none" stroke-linecap="round"/>
      <g id="${id}-vapor" opacity="0.9"><path d="M-14 -36 q-10 -16 0 -30 q10 -14 0 -28 M10 -38 q-10 -16 0 -30 q10 -14 0 -28" fill="none" stroke="#c9ccd4" stroke-width="5" stroke-linecap="round"/></g></g>`;
  }
  // mesa de escritorio com livro-caixa. Chao em 362, largura ~640. o.fechado = livro fechado.
  // ids: -livro-aberto, -livro-fechado (um com opacity 0), -luminaria
  function mesaLivroCaixa(o = {}) {
    const id = o.id || "mesaCaixa", fe = !!o.fechado;
    return `<g id="${id}"><ellipse cx="320" cy="362" rx="320" ry="12" fill="#000" opacity="0.15"/>
      <rect x="0" y="150" width="640" height="34" rx="6" fill="#a86b42" stroke="${C}" stroke-width="6"/><rect x="20" y="184" width="600" height="178" fill="#8a5a36" stroke="${C}" stroke-width="6"/>
      <rect x="40" y="204" width="200" height="66" rx="4" fill="#9a6a42" stroke="${C}" stroke-width="4"/><rect x="40" y="280" width="200" height="66" rx="4" fill="#9a6a42" stroke="${C}" stroke-width="4"/><rect x="120" y="230" width="40" height="10" rx="5" fill="#e0b23e" stroke="${C}" stroke-width="2"/><rect x="120" y="306" width="40" height="10" rx="5" fill="#e0b23e" stroke="${C}" stroke-width="2"/>
      <g id="${id}-livro-aberto" opacity="${fe ? 0 : 1}"><path d="M170 150 L180 108 Q260 96 320 112 Q380 96 460 108 L470 150 Z" fill="#fff8e6" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M320 112 V150" stroke="${C}" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<path d="M${196} ${122 + i * 7} h100 M${340} ${122 + i * 7} h100" stroke="#9fb8d0" stroke-width="2"/>`).join("")}<path d="M200 140 h40 M350 140 h60" stroke="#d9333a" stroke-width="3"/></g>
      <g id="${id}-livro-fechado" opacity="${fe ? 1 : 0}"><rect x="210" y="118" width="220" height="32" rx="4" fill="#2f4f3e" stroke="${C}" stroke-width="5"/><path d="M216 130 h208" stroke="#fff8e6" stroke-width="3"/>${T(320, 146, "CAIXA", 18, "#F5C542")}</g>
      <g id="${id}-luminaria"><path d="M560 150 V70 L520 40" fill="none" stroke="${C}" stroke-width="8"/><path d="M490 20 l60 -10 l10 40 l-80 14 Z" fill="#6fae5a" stroke="${C}" stroke-width="5"/><ellipse cx="560" cy="148" rx="34" ry="8" fill="#4a4d57" stroke="${C}" stroke-width="4"/></g>
      <rect x="60" y="112" width="60" height="38" rx="4" fill="#c9ccd4" stroke="${C}" stroke-width="4"/>${[0, 1, 2].map(i => `<rect x="${68 + i * 16}" y="${130}" width="10" height="8" fill="#4a4d57"/>`).join("")}<rect x="68" y="118" width="44" height="8" fill="#9fd0a0"/></g>`;
  }
  // lixeira de rua (chao em 362, ~ 120 x 230); o paparazzo surge de dentro. ids: -tampa
  function lixeiraRua(o = {}) {
    const id = o.id || "lixeira";
    return `<g id="${id}"><ellipse cx="60" cy="362" rx="70" ry="10" fill="#000" opacity="0.15"/><path d="M0 150 h120 l-10 212 h-100 Z" fill="#3f8f6a" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>${[30, 60, 90].map(x => `<path d="M${x} 170 l${(x - 60) * 0.05} 170" stroke="#2f6f50" stroke-width="6"/>`).join("")}
      <rect x="20" y="230" width="80" height="44" rx="6" fill="#fff8e6" stroke="${C}" stroke-width="3"/>${T(60, 262, "LIXO", 22, "#3f8f6a")}
      <g id="${id}-tampa"><rect x="-8" y="132" width="136" height="24" rx="10" fill="#4fa07a" stroke="${C}" stroke-width="6"/><rect x="44" y="118" width="32" height="18" rx="6" fill="#4fa07a" stroke="${C}" stroke-width="5"/></g></g>`;
  }
  // camera fotografica profissional com flash (de mao, ~ 150 x 110). ids: -flash (opacity 0)
  function cameraFoto(o = {}) {
    const id = o.id || "camFoto";
    return `<g id="${id}"><rect x="-70" y="-30" width="140" height="80" rx="12" fill="#2b2a31" stroke="${C}" stroke-width="5"/><rect x="-70" y="-30" width="140" height="18" rx="8" fill="#4a4d57"/><rect x="-40" y="-56" width="60" height="30" rx="5" fill="#2b2a31" stroke="${C}" stroke-width="5"/><rect x="-34" y="-50" width="48" height="16" rx="3" fill="#dff2fa"/>
      <circle cx="10" cy="12" r="30" fill="#4a4d57" stroke="${C}" stroke-width="5"/><circle cx="10" cy="12" r="18" fill="#2a3a55" stroke="${C}" stroke-width="3"/><circle cx="4" cy="6" r="6" fill="#fff" opacity="0.7"/><rect x="44" y="-22" width="16" height="10" rx="3" fill="#e2544f"/>
      <g id="${id}-flash" opacity="0"><circle cx="-14" cy="-41" r="60" fill="#fff8c4" opacity="0.7"/><circle cx="-14" cy="-41" r="30" fill="#fff"/></g></g>`;
  }
  // bandeirinha de guia turistico (de mao): haste com bandeira amarela "TOUR". Ponta da mao em 0,0, haste para cima.
  function bandeirinha(o = {}) {
    const id = o.id || "bandeirinha", cor = o.cor || "#F5C542";
    return `<g id="${id}"><path d="M0 40 V-240" stroke="${C}" stroke-width="10" stroke-linecap="round"/><path d="M0 40 V-240" stroke="#c9ccd4" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-246" r="10" fill="#e2544f" stroke="${C}" stroke-width="4"/>
      <g id="${id}-pano"><path d="M4 -236 q60 -14 120 6 q-4 34 0 70 q-60 -18 -120 -6 Z" fill="${cor}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>${T(62, -184, o.texto || "TOUR", 30, "#2E2A33")}</g></g>`;
  }

  /* ---------- c17: mapa visto de cima ---------- */
  // campo de futebol em traco branco (flutuante, centro 0,0; ~ 210 x 140 na escala 1)
  function campoFutebol(o = {}) {
    const id = o.id || "campo", w = o.w || 210, h = o.h || 140, L = `stroke="#fff" stroke-width="5" fill="none"`;
    return `<g id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#5fae4a" fill-opacity="0.35" ${L}/><path d="M0 ${-h / 2} V${h / 2}" ${L}/><circle cx="0" cy="0" r="${h * 0.18}" ${L}/><rect x="${-w / 2}" y="${-h * 0.25}" width="${w * 0.14}" height="${h * 0.5}" ${L}/><rect x="${w / 2 - w * 0.14}" y="${-h * 0.25}" width="${w * 0.14}" height="${h * 0.5}" ${L}/><circle cx="0" cy="0" r="3" fill="#fff"/></g>`;
  }
  // muro visto de cima seguindo um poligono (o.pontos). Para "subir": animar #-muro (scale a partir do proprio contorno) ou o stroke-dashoffset de #-muro-topo.
  function muroCima(o = {}) {
    const id = o.id || "muroCima", pts = o.pontos || window.Cenarios.terrenoCima.contorno, d = "M" + pts.map(p => p.join(" ")).join(" L") + " Z";
    return `<g id="${id}"><path d="${d}" fill="none" stroke="#000" stroke-width="30" opacity="0.18" transform="translate(8 10)"/><path d="${d}" fill="none" stroke="${C}" stroke-width="30" stroke-linejoin="round"/><path id="${id}-topo" d="${d}" fill="none" stroke="#e6d8bd" stroke-width="20" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#c9b48e" stroke-width="4" stroke-dasharray="16 22" stroke-linejoin="round"/></g>`;
  }
  // portao de ferro visto de cima (centro 0,0, ~ 140 de largura): duas folhas que fecham. ids: -folha-e, -folha-d (girar em torno das pontas)
  function portaoCima(o = {}) {
    const id = o.id || "portaoCima", w = o.w || 140;
    const folha = (lado) => `<g id="${id}-folha-${lado}" style="transform-box:fill-box;transform-origin:${lado === "e" ? "0% 50%" : "100% 50%"}"><rect x="${lado === "e" ? -w / 2 : 0}" y="-8" width="${w / 2}" height="16" rx="3" fill="#4a4d57" stroke="${C}" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<path d="M${(lado === "e" ? -w / 2 : 0) + 8 + i * (w / 8)} -8 v16" stroke="#8f939e" stroke-width="3"/>`).join("")}</g>`;
    return `<g id="${id}">${folha("e")}${folha("d")}<rect x="${-w / 2 - 20}" y="-20" width="24" height="40" fill="#d8cab0" stroke="${C}" stroke-width="4"/><rect x="${w / 2 - 4}" y="-20" width="24" height="40" fill="#d8cab0" stroke="${C}" stroke-width="4"/></g>`;
  }
  // alfinete de mapa com a fotinho (ponta em 0,0). o.rosto = Objetos.rostoDoRig(...)
  function alfinete(o = {}) {
    const id = o.id || "alfinete", r = o.r || 70;
    return `<g id="${id}"><ellipse cx="0" cy="0" rx="22" ry="8" fill="#000" opacity="0.25"/><path d="M0 0 L${-r * 0.55} ${-r * 1.6} A${r} ${r} 0 1 1 ${r * 0.55} ${-r * 1.6} Z" fill="#e2544f" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>
      <g transform="translate(0 ${-r * 2.3})">${O.fotinho({ id: id + "-foto", r: r * 0.72, rosto: o.rosto, fundo: "#fff3c4" })}</g></g>`;
  }

  /* ---------- c20: ferramentas dos funcionarios ---------- */
  // cada uma de mao, centrada no ponto de pegar
  function vassouraBalde(o = {}) {
    const id = o.id || "vassoura";
    return `<g id="${id}"><path d="M0 -150 V90" stroke="${C}" stroke-width="12" stroke-linecap="round"/><path d="M0 -150 V90" stroke="#c58b4c" stroke-width="6"/><path d="M-36 90 h72 l12 60 h-96 Z" fill="#e0b23e" stroke="${C}" stroke-width="5" stroke-linejoin="round"/>${[-30, -15, 0, 15, 30].map(x => `<path d="M${x} 100 l${x * 0.2} 46" stroke="#b7862a" stroke-width="3"/>`).join("")}
      <g transform="translate(70 120)"><path d="M-34 -40 h68 l-8 64 h-52 Z" fill="#4a90d9" stroke="${C}" stroke-width="5"/><path d="M-34 -40 q34 -40 68 0" fill="none" stroke="${C}" stroke-width="4"/><ellipse cx="0" cy="-40" rx="34" ry="8" fill="#9fd8f5" stroke="${C}" stroke-width="4"/></g></g>`;
  }
  function tesouraPoda(o = {}) {
    const id = o.id || "tesoura";
    return `<g id="${id}"><path d="M-10 0 L60 -110 M10 0 L-60 -110" stroke="${C}" stroke-width="14" stroke-linecap="round"/><path d="M-10 0 L60 -110 M10 0 L-60 -110" stroke="#c9ccd4" stroke-width="7" stroke-linecap="round"/><path d="M-10 0 L-30 60 M10 0 L30 60" stroke="${C}" stroke-width="18" stroke-linecap="round"/><path d="M-10 0 L-30 60 M10 0 L30 60" stroke="#e2544f" stroke-width="10" stroke-linecap="round"/><circle cx="0" cy="0" r="10" fill="#8f939e" stroke="${C}" stroke-width="4"/></g>`;
  }
  function prancheta(o = {}) {
    const id = o.id || "prancheta";
    return `<g id="${id}"><rect x="-56" y="-76" width="112" height="152" rx="8" fill="#a86b42" stroke="${C}" stroke-width="5"/><rect x="-46" y="-60" width="92" height="126" fill="#fff8e6" stroke="${C}" stroke-width="3"/><rect x="-22" y="-84" width="44" height="22" rx="6" fill="#c9ccd4" stroke="${C}" stroke-width="4"/>${[0, 1, 2, 3, 4].map(i => `<path d="M-34 ${-38 + i * 20} l6 6 l10 -12" fill="none" stroke="#4caf6a" stroke-width="4"/><path d="M-12 ${-34 + i * 20} h44" stroke="#9fb8d0" stroke-width="3"/>`).join("")}</g>`;
  }
  function caixaFerramentas(o = {}) {
    const id = o.id || "caixaFerr";
    return `<g id="${id}"><path d="M-30 -40 v-24 h60 v24" fill="none" stroke="${C}" stroke-width="10"/><path d="M-30 -40 v-24 h60 v24" fill="none" stroke="#8f939e" stroke-width="5"/><rect x="-80" y="-40" width="160" height="90" rx="10" fill="#e2544f" stroke="${C}" stroke-width="6"/><path d="M-80 -6 h160" stroke="${C}" stroke-width="4"/><rect x="-14" y="-14" width="28" height="18" rx="4" fill="#c9ccd4" stroke="${C}" stroke-width="3"/><path d="M-60 -40 l20 -40 M50 -40 l10 -30" stroke="${C}" stroke-width="8" stroke-linecap="round"/><path d="M-60 -40 l20 -40" stroke="#c9ccd4" stroke-width="4"/><circle cx="60" cy="-74" r="10" fill="none" stroke="${C}" stroke-width="5"/></g>`;
  }
  // laptop aberto (de mao/colo, ~ 200 x 140). ids: -tela
  function laptop(o = {}) {
    const id = o.id || "laptop", cor = o.cor || "#c9ccd4";
    return `<g id="${id}"><path d="M-90 -110 h180 l6 110 h-192 Z" fill="${cor}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><g id="${id}-tela"><rect x="-80" y="-100" width="160" height="90" rx="4" fill="#2a3a55"/><path d="M-66 -84 h70 M-66 -70 h100 M-66 -56 h50 M-66 -42 h84" stroke="#7fb2e8" stroke-width="5"/><circle cx="56" cy="-36" r="10" fill="#4caf6a"/></g>
      <path d="M-110 0 h220 l-14 22 h-192 Z" fill="${esc(cor, -0.12)}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><rect x="-24" y="4" width="48" height="8" rx="4" fill="${esc(cor, -0.3)}"/><circle cx="0" cy="-104" r="3" fill="${C}"/></g>`;
  }

  /* ---------- c22: trabalhador pequeno de frente (bonequinho) ---------- */
  // pes em 0,0; ~ 40 x 110. o.cor (roupa), o.chapeu: "chef"|"capacete"|"bone"|null
  function bonequinho(o = {}) {
    const id = o.id || "bon" + (n++), cor = o.cor || "#4a90d9", pele = o.pele || ["#f2c9a0", "#c98a5e", "#8a5a3a", "#e8b088"][(o.k || 0) % 4];
    const ch = o.chapeu === "chef" ? `<path d="M-14 -96 h28 v-14 q8 -14 -6 -18 q-8 -10 -16 0 q-14 4 -6 18 Z" fill="#fff" stroke="${C}" stroke-width="3"/>` : o.chapeu === "capacete" ? `<path d="M-15 -94 q15 -26 30 0 Z" fill="#F5C542" stroke="${C}" stroke-width="3"/>` : o.chapeu === "bone" ? `<path d="M-14 -94 q14 -20 28 0 h10 Z" fill="${esc(cor, -0.2)}" stroke="${C}" stroke-width="3"/>` : `<path d="M-14 -92 q14 -18 28 0" fill="#3a2a22"/>`;
    return `<g id="${id}"><ellipse cx="0" cy="0" rx="18" ry="5" fill="#000" opacity="0.2"/><g id="${id}-corpo"><path d="M-8 -30 v28 M8 -30 v28" stroke="${C}" stroke-width="9" stroke-linecap="round"/><path d="M-8 -30 v28 M8 -30 v28" stroke="#3a3842" stroke-width="5" stroke-linecap="round"/><rect x="-15" y="-66" width="30" height="40" rx="9" fill="${cor}" stroke="${C}" stroke-width="3.5"/>
      <g id="${id}-bracos"><path d="M-14 -58 l-12 22 M14 -58 l12 22" stroke="${C}" stroke-width="8" stroke-linecap="round"/><path d="M-14 -58 l-12 22 M14 -58 l12 22" stroke="${cor}" stroke-width="4" stroke-linecap="round"/></g>
      <circle cx="0" cy="-82" r="14" fill="${pele}" stroke="${C}" stroke-width="3.5"/><circle cx="-5" cy="-82" r="2" fill="${C}"/><circle cx="5" cy="-82" r="2" fill="${C}"/><path d="M-4 -76 q4 3 8 0" stroke="${C}" stroke-width="2" fill="none"/>${ch}</g></g>`;
  }

  /* ---------- c23: sofa gigante e cartao preto ---------- */
  // sofa gigante (chao em 362, ~ 1400 x 640 -> usar escala ~0.9 e o personagem pequeno nele). Assento em y ~ 120.
  function sofaGigante(o = {}) {
    const id = o.id || "sofaG", cor = o.cor || "#7a3f8a", c2 = esc(cor, 0.15), c3 = esc(cor, -0.15);
    return `<g id="${id}"><ellipse cx="700" cy="362" rx="720" ry="20" fill="#000" opacity="0.18"/>
      <rect x="60" y="-300" width="1280" height="420" rx="90" fill="${cor}" stroke="${C}" stroke-width="10"/>
      ${[0, 1, 2].map(i => `<rect x="${110 + i * 400}" y="-260" width="380" height="360" rx="70" fill="${c2}" stroke="${C}" stroke-width="7"/>${[0, 1].map(j => `<circle cx="${230 + i * 400 + j * 140}" cy="-90" r="10" fill="${c3}" stroke="${C}" stroke-width="3"/>`).join("")}<path d="M${160 + i * 400} -220 q140 -26 280 0" fill="none" stroke="${esc(cor, 0.35)}" stroke-width="10" stroke-linecap="round"/>`).join("")}
      <rect x="20" y="80" width="1360" height="200" rx="60" fill="${c3}" stroke="${C}" stroke-width="10"/>
      ${[0, 1, 2].map(i => `<rect x="${110 + i * 400}" y="60" width="380" height="120" rx="44" fill="${c2}" stroke="${C}" stroke-width="7"/>`).join("")}
      <rect x="-40" y="-120" width="200" height="420" rx="90" fill="${c3}" stroke="${C}" stroke-width="10"/><rect x="1240" y="-120" width="200" height="420" rx="90" fill="${c3}" stroke="${C}" stroke-width="10"/>
      <path d="M0 -100 q60 -30 120 0 M1280 -100 q60 -30 120 0" stroke="${esc(cor, 0.3)}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M60 280 l-16 82 h56 l10 -82 Z M1340 280 l16 82 h-56 l-10 -82 Z" fill="#d9a93a" stroke="${C}" stroke-width="6"/>
      <g transform="translate(1180 20) rotate(10)"><rect x="-90" y="-80" width="180" height="160" rx="40" fill="#F5C542" stroke="${C}" stroke-width="7"/><path d="M-50 -40 l100 80 M50 -40 l-100 80" stroke="#d9a93a" stroke-width="7"/></g></g>`;
  }
  // cartao preto (de mao, ~ 170 x 108), centrado. ids: -brilho (faixa de luz, para passar)
  function cartaoPreto(o = {}) {
    const id = o.id || "cartao", cid = id + "-c" + (n++);
    return `<g id="${id}"><clipPath id="${cid}"><rect x="-85" y="-54" width="170" height="108" rx="12"/></clipPath><rect x="-85" y="-54" width="170" height="108" rx="12" fill="#1c1b22" stroke="${C}" stroke-width="5"/>
      <g clip-path="url(#${cid})"><path d="M-85 30 Q0 0 85 40 V54 H-85 Z" fill="#2b2a33"/><rect id="${id}-brilho" x="-160" y="-80" width="30" height="180" fill="#fff" opacity="0.35" transform="rotate(20)"/></g>
      <rect x="-64" y="-26" width="34" height="26" rx="5" fill="#e0b23e" stroke="${C}" stroke-width="3"/><path d="M-64 -13 h34 M-47 -26 v26" stroke="#b7862a" stroke-width="2"/>
      <path d="M-64 22 h18 M-40 22 h18 M-16 22 h18 M8 22 h18" stroke="#8f939e" stroke-width="5" stroke-linecap="round"/>${T(60, -28, "BLACK", 16, "#c9a24a")}<circle cx="52" cy="34" r="12" fill="#e2544f" opacity="0.9"/><circle cx="66" cy="34" r="12" fill="#F5C542" opacity="0.9"/></g>`;
  }

  /* ---------- c24: aviao jumbo e poltrona ---------- */
  // Boeing generico de perfil (sem logo), virado para a direita. Centro aprox em 0,0; ~ 1400 x 420.
  // o.modo: "fechado" (padrao) | "corte" (lateral aberta, comodos). ids: -lateral (painel de janelas, some no corte), -comodos, -poltronas (cada -poltrona-N), -sala
  function aviao(o = {}) {
    const id = o.id || "aviao", corte = o.modo === "corte";
    const casco = `M-680 -10 Q-700 -70 -620 -90 L520 -90 Q640 -90 700 -20 Q720 10 680 40 Q640 70 520 70 L-560 70 Q-660 60 -680 -10 Z`;
    let s = `<g id="${id}"><defs><clipPath id="${id}-clip"><path d="M-600 -74 L520 -74 Q610 -74 650 -20 L650 50 L-600 50 Z"/></clipPath></defs>`;
    // asa de tras e cauda
    s += `<path d="M-560 -80 L-700 -300 L-620 -300 L-440 -86 Z" fill="#e8ecf2" stroke="${C}" stroke-width="7" stroke-linejoin="round"/><path d="M-660 -280 L-620 -300 L-560 -240 Z" fill="#4a90d9"/><path d="M-600 -10 L-780 -40 L-760 0 L-600 30 Z" fill="#d8dde6" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>`;
    s += `<path transform="translate(-300 0)" d="M-60 20 L-320 200 L-230 210 L120 40 Z" fill="#c9ced8" stroke="${C}" stroke-width="7" stroke-linejoin="round"/>`;
    // casco
    s += `<path d="${casco}" fill="#f4f6fa" stroke="${C}" stroke-width="8" stroke-linejoin="round"/><path d="M-660 30 Q-600 66 -520 66 L520 66 Q620 66 660 40" fill="none" stroke="#d8dde6" stroke-width="16"/><path d="M-660 -20 L690 -20" stroke="#4a90d9" stroke-width="10"/><path d="M-660 -6 L690 -6" stroke="#F5C542" stroke-width="5"/>`;
    // corcunda do 747
    s += `<path d="M300 -88 Q360 -150 500 -140 Q600 -130 640 -60" fill="#f4f6fa" stroke="${C}" stroke-width="7"/><path d="M560 -100 l40 -18 l20 26 l-44 10 Z M620 -86 l26 -6 l8 24 l-22 4 Z" fill="#2b3a55" stroke="${C}" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<rect x="${360 + i * 44}" y="-126" width="22" height="18" rx="6" fill="#9fd0ea" stroke="${C}" stroke-width="3"/>`).join("")}`;
    if (corte) {
      // interior: casa que voa
      s += `<g id="${id}-comodos" clip-path="url(#${id}-clip)"><rect x="-620" y="-80" width="1300" height="140" fill="#f6e3c4"/>
        <g id="${id}-sala"><rect x="-200" y="-80" width="420" height="140" fill="#dcebf2"/><rect x="-140" y="10" width="220" height="40" rx="14" fill="#e08b4a" stroke="${C}" stroke-width="4"/><rect x="-140" y="-14" width="220" height="30" rx="12" fill="#ea9a5a" stroke="${C}" stroke-width="4"/><rect x="120" y="-50" width="70" height="44" rx="4" fill="#2b2a31" stroke="${C}" stroke-width="3"/><rect x="-170" y="-60" width="40" height="40" fill="#d9a93a" stroke="${C}" stroke-width="3"/>
          <g transform="translate(0 -74)"><path d="M0 0 v14" stroke="${C}" stroke-width="3"/><path d="M-30 14 h60 l-10 18 h-40 Z" fill="#e0b23e" stroke="${C}" stroke-width="3"/>${[-20, 0, 20].map(x => `<path d="M${x} 32 l-3 10 l3 4 l3 -4 Z" fill="#dff2fa" stroke="${C}" stroke-width="1.5"/>`).join("")}</g></g>
        <rect x="-600" y="-80" width="380" height="140" fill="#e3f0dc"/><rect x="-560" y="10" width="200" height="40" rx="6" fill="#9fcfc6" stroke="${C}" stroke-width="4"/><rect x="-570" y="-20" width="16" height="70" fill="#a86b42" stroke="${C}" stroke-width="3"/><rect x="-540" y="-6" width="60" height="18" rx="6" fill="#fff" stroke="${C}" stroke-width="3"/><rect x="-330" y="-60" width="70" height="40" fill="#9fd0ea" stroke="${C}" stroke-width="3"/>
        <rect x="240" y="-80" width="420" height="140" fill="#efe3cf"/><rect x="280" y="0" width="160" height="12" fill="#a86b42" stroke="${C}" stroke-width="3"/><path d="M296 12 v40 M424 12 v40" stroke="${C}" stroke-width="5"/><circle cx="360" cy="-10" r="12" fill="#e2544f" stroke="${C}" stroke-width="3"/><rect x="480" y="-60" width="60" height="110" fill="#b98250" stroke="${C}" stroke-width="3"/>
        <path d="M-220 -80 V60 M220 -80 V60" stroke="${C}" stroke-width="6"/></g>
        <path d="M-600 -74 L520 -74 Q610 -74 650 -20 L650 50 L-600 50 Z" fill="none" stroke="${C}" stroke-width="6"/>`;
    } else {
      s += `<g id="${id}-lateral">${Array.from({ length: 26 }, (_, i) => `<rect x="${-560 + i * 42}" y="-56" width="22" height="28" rx="9" fill="#9fd0ea" stroke="${C}" stroke-width="3"/>`).join("")}<path d="M-600 -74 V50 M-300 -74 V50 M0 -74 V50 M300 -74 V50" stroke="#d8dde6" stroke-width="4"/>
        <rect x="-580" y="-66" width="34" height="90" rx="8" fill="none" stroke="${C}" stroke-width="4"/><rect x="420" y="-66" width="34" height="90" rx="8" fill="none" stroke="${C}" stroke-width="4"/></g>`;
    }
    // nariz e cabine (sempre)
    s += `<path d="M640 -60 l30 10 l14 26 l-40 -4 Z" fill="#2b3a55" stroke="${C}" stroke-width="4"/>`;
    // asa da frente e motores
    s += `<g transform="translate(-300 0)"><path d="M-40 10 L-300 260 L-200 270 L160 30 Z" fill="#e8ecf2" stroke="${C}" stroke-width="8" stroke-linejoin="round"/>${[[-160, 170], [-40, 110]].map(([x, y]) => `<rect x="${x - 70}" y="${y}" width="140" height="56" rx="26" fill="#c9ced8" stroke="${C}" stroke-width="6"/><ellipse cx="${x + 70}" cy="${y + 28}" rx="10" ry="24" fill="#4a4d57" stroke="${C}" stroke-width="4"/>`).join("")}</g>`;
    return s + `</g>`;
  }
  // poltrona de aviao (flutuante, ~ 90 x 120), para voar em cascata
  function poltrona(o = {}) {
    const id = o.id || "poltrona", cor = o.cor || "#4a6fa8";
    return `<g id="${id}"><rect x="-30" y="-64" width="60" height="96" rx="16" fill="${cor}" stroke="${C}" stroke-width="5"/><rect x="-26" y="-60" width="52" height="26" rx="8" fill="#fff" stroke="${C}" stroke-width="3"/><rect x="-44" y="16" width="88" height="30" rx="10" fill="${esc(cor, -0.15)}" stroke="${C}" stroke-width="5"/><path d="M-36 46 v20 M36 46 v20" stroke="${C}" stroke-width="6"/><rect x="-46" y="-6" width="12" height="40" rx="5" fill="#8f939e" stroke="${C}" stroke-width="3"/></g>`;
  }

  /* ---------- c25: ilha ---------- */
  // ilhazinha de areia com palmeira, mastro e bandeira (com a fotinho) e plaquinha. Chao (areia) em y 362; ~ 900 x 700.
  // ids: -placa (opacity 0), -bandeira (sobe no mastro: animar y de 0 ate -330), -agua (espuma). Personagem pisa em ~ y 300, x 420.
  function ilha(o = {}) {
    const id = o.id || "ilha";
    return `<g id="${id}"><ellipse id="${id}-agua" cx="450" cy="372" rx="470" ry="40" fill="#e6f6fb" opacity="0.9"/><path d="M40 370 Q100 280 300 262 Q450 250 600 262 Q800 280 860 370 Z" fill="#f2d79a" stroke="${C}" stroke-width="7"/><path d="M120 340 Q300 300 500 304" stroke="#fbe8bc" stroke-width="10" fill="none" stroke-linecap="round"/>${[[200, 330], [640, 320], [720, 344], [330, 346]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#d8b47a"/>`).join("")}
      <g transform="translate(700 300) rotate(-20)"><path d="M0 0 l14 -6 l10 10 l-14 8 Z" fill="#f2a6a0" stroke="${C}" stroke-width="3"/></g>
      <g id="${id}-palmeira"><path d="M220 290 Q180 120 260 -40" fill="none" stroke="${C}" stroke-width="30" stroke-linecap="round"/><path d="M220 290 Q180 120 260 -40" fill="none" stroke="#a87a4a" stroke-width="20" stroke-linecap="round"/>${[240, 180, 120, 60, 0].map((y, i) => `<path d="M${196 + i * 8} ${y} h28" stroke="${C}" stroke-width="3"/>`).join("")}
        ${[[100, -40], [120, -140], [250, -170], [380, -130], [400, -30], [300, 10]].map(([x, y]) => `<path d="M260 -40 Q${(260 + x) / 2} ${y - 50} ${x} ${y} Q${(260 + x) / 2 + 10} ${y - 10} 260 -40 Z" fill="#5f9f4f" stroke="${C}" stroke-width="6" stroke-linejoin="round"/>`).join("")}
        <circle cx="250" cy="-30" r="16" fill="#8a5a3b" stroke="${C}" stroke-width="4"/><circle cx="276" cy="-24" r="16" fill="#8a5a3b" stroke="${C}" stroke-width="4"/></g>
      <g id="${id}-mastro"><rect x="650" y="-80" width="12" height="400" fill="#c9ccd4" stroke="${C}" stroke-width="4"/><circle cx="656" cy="-88" r="12" fill="#e0b23e" stroke="${C}" stroke-width="4"/>
        <g id="${id}-bandeira"><path d="M662 240 h180 v110 h-180 Z" fill="#fff8e6" stroke="${C}" stroke-width="5"/><g transform="translate(752 295)">${O.fotinho({ id: id + "-foto", r: 42, rosto: o.rosto, fundo: "#9fd0ea" })}</g></g></g>
      <g id="${id}-placa" opacity="0"><rect x="502" y="230" width="10" height="90" fill="#8a5a3b" stroke="${C}" stroke-width="3"/><rect x="420" y="190" width="180" height="60" rx="6" fill="#d8b47a" stroke="${C}" stroke-width="5"/>${T(510, 218, "PACÍFICO", 24, "#5a3a22")}${T(510, 242, "SUL", 22, "#5a3a22")}</g></g>`;
  }

  /* ---------- c26: iate, helicoptero, submarino ---------- */
  // mega iate de perfil, virado para a direita. Linha d'agua em y 362; ~ 2400 x 760 (maior que o quadro).
  // o.modo: "fechado" | "corte". ids: -heliponto (centro 380 -330), -porta-garagem (abre girando no topo), -cinema-tela (opacity 0 -> acende), -hospital,
  // -casco-lateral (some no corte), -conves (personagem acenando no convés de cima: pes em y -190, x ~ 1500)
  function iate(o = {}) {
    const id = o.id || "iate", corte = o.modo === "corte";
    let s = `<g id="${id}"><ellipse cx="1200" cy="370" rx="1260" ry="30" fill="#1f5f90" opacity="0.5"/>`;
    // casco
    const casco = `M0 120 L2300 120 Q2420 120 2440 60 L2400 260 Q2380 362 2200 362 L180 362 Q60 362 30 260 Z`;
    s += `<path d="${casco}" fill="#fff" stroke="${C}" stroke-width="9" stroke-linejoin="round"/><path d="M30 260 Q60 362 180 362 L2200 362 Q2380 362 2400 260 Z" fill="#1f2a44" stroke="${C}" stroke-width="7"/><path d="M40 250 H2405" stroke="#F5C542" stroke-width="10"/>`;
    // superestrutura em degraus
    s += `<path d="M200 120 L260 -20 L2050 -20 L2200 120 Z" fill="#f4f6fa" stroke="${C}" stroke-width="8" stroke-linejoin="round"/><path d="M420 -20 L470 -140 L1850 -140 L1960 -20 Z" fill="#f4f6fa" stroke="${C}" stroke-width="8" stroke-linejoin="round"/><path d="M700 -140 L740 -230 L1600 -230 L1680 -140 Z" fill="#f4f6fa" stroke="${C}" stroke-width="8" stroke-linejoin="round"/>`;
    // faixas de vidro escuro
    s += `<path d="M300 10 L2080 10 L2140 70 L280 70 Z" fill="#2a3a55" stroke="${C}" stroke-width="5"/><path d="M500 -110 L1860 -110 L1910 -60 L480 -60 Z" fill="#2a3a55" stroke="${C}" stroke-width="5"/><path d="M760 -205 L1600 -205 L1640 -165 L745 -165 Z" fill="#2a3a55" stroke="${C}" stroke-width="5"/>`;
    for (let i = 0; i < 24; i++) s += `<path d="M${320 + i * 76} 64 l40 -50" stroke="#4a6a90" stroke-width="5" opacity="0.7"/>`;
    // gradis
    [[260, 2050, -20], [470, 1850, -140], [740, 1600, -230]].forEach(([a, b, y]) => { s += `<path d="M${a} ${y - 30} H${b}" stroke="${C}" stroke-width="5"/>`; for (let x = a; x <= b; x += 40) s += `<path d="M${x} ${y} v-30" stroke="${C}" stroke-width="3"/>`; });
    // radar, mastro e antenas
    s += `<path d="M1300 -230 V-330 M1260 -300 H1340" stroke="${C}" stroke-width="8"/><ellipse cx="1300" cy="-340" rx="40" ry="12" fill="#fff" stroke="${C}" stroke-width="5"/><circle cx="1380" cy="-260" r="24" fill="#fff" stroke="${C}" stroke-width="5"/>`;
    // heliponto na popa (esquerda, alto)
    s += `<g id="${id}-heliponto"><path d="M120 -40 L640 -40 L620 -10 L140 -10 Z" fill="#c9ccd4" stroke="${C}" stroke-width="6"/><path d="M200 -10 L230 120 M560 -10 L520 120" stroke="${C}" stroke-width="12"/><ellipse cx="380" cy="-44" rx="150" ry="16" fill="#4a4d57" stroke="${C}" stroke-width="4"/>${T(380, -36, "H", 22, "#F5C542")}</g>`;
    // porta da garagem do submarino (casco, perto da agua)
    s += `<g id="${id}-garagem"><rect x="560" y="150" width="260" height="96" rx="6" fill="#0f1a2e" stroke="${C}" stroke-width="5"/></g><g id="${id}-porta-garagem" style="transform-box:fill-box;transform-origin:50% 0%"><rect x="560" y="150" width="260" height="96" rx="6" fill="#e8ecf2" stroke="${C}" stroke-width="6"/>${[0, 1, 2].map(i => `<path d="M560 ${178 + i * 24} h260" stroke="#c9ced8" stroke-width="4"/>`).join("")}</g>`;
    // vigias
    for (let i = 0; i < 14; i++) s += `<circle cx="${960 + i * 90}" cy="${190}" r="14" fill="#9fd0ea" stroke="${C}" stroke-width="4"/>`;
    if (corte) {
      // casco aberto com comodos (cinema e hospital, mais suite e piscina)
      s += `<g id="${id}-comodos"><rect x="900" y="134" width="1300" height="112" fill="#f6e3c4" stroke="${C}" stroke-width="6"/>
        <g id="${id}-cinema"><rect x="900" y="134" width="460" height="112" fill="#2b2a31"/><rect id="${id}-cinema-tela" x="940" y="146" width="240" height="70" rx="4" fill="#fff3c4" opacity="0.25" stroke="${C}" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${1200 + (i % 3) * 50}" y="${184 + Math.floor(i / 3) * 28}" width="40" height="24" rx="8" fill="#c25b4e" stroke="${C}" stroke-width="3"/>`).join("")}${T(1060, 240, "CINEMA", 22, "#F5C542")}</g>
        <g id="${id}-hospital"><rect x="1360" y="134" width="420" height="112" fill="#f4fbff"/><rect x="1390" y="200" width="160" height="22" rx="6" fill="#9fd8f5" stroke="${C}" stroke-width="3"/><path d="M1400 222 v20 M1540 222 v20" stroke="${C}" stroke-width="4"/><rect x="1400" y="186" width="40" height="16" rx="6" fill="#fff" stroke="${C}" stroke-width="3"/><g transform="translate(1690 180)"><rect x="-32" y="-32" width="64" height="64" rx="10" fill="#fff" stroke="${C}" stroke-width="4"/><path d="M-10 -24 h20 v14 h14 v20 h-14 v14 h-20 v-14 h-14 v-20 h14 Z" fill="#e2544f" stroke="${C}" stroke-width="3"/></g><path d="M1600 150 v80 M1590 150 h20" stroke="${C}" stroke-width="4"/><rect x="1584" y="160" width="30" height="40" rx="6" fill="#bfe6f4" stroke="${C}" stroke-width="3"/></g>
        <g><rect x="1780" y="134" width="420" height="112" fill="#dcebf2"/><rect x="1820" y="190" width="200" height="40" rx="8" fill="#9fcfc6" stroke="${C}" stroke-width="4"/><rect x="1810" y="160" width="18" height="70" fill="#a86b42" stroke="${C}" stroke-width="3"/><rect x="2060" y="150" width="100" height="60" fill="#9fd0ea" stroke="${C}" stroke-width="3"/></g>
        <path d="M1360 134 V246 M1780 134 V246" stroke="${C}" stroke-width="6"/></g>`;
    }
    // proa: ancora e nome
    s += `<g transform="translate(2280 170)"><circle cx="0" cy="-20" r="10" fill="none" stroke="${C}" stroke-width="5"/><path d="M0 -10 v50 M-24 26 q24 26 48 0 M-14 4 h28" fill="none" stroke="${C}" stroke-width="6" stroke-linecap="round"/></g>${T(360, 216, "TRILHÃO I", 44, "#1f2a44")}`;
    s += `<path d="M2440 60 l60 -20 l-60 0 Z" fill="#fff" stroke="${C}" stroke-width="5"/>`;
    return s + `</g>`;
  }
  // helicoptero (flutuante, centro 0,0; ~ 460 x 200), virado para a direita. ids: -helice (gira em scaleX), -helice-cauda
  function helicoptero(o = {}) {
    const id = o.id || "heli", cor = o.cor || "#e2544f";
    return `<g id="${id}"><path d="M-60 0 L-260 -20 L-260 6 L-60 30 Z" fill="${cor}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><path d="M-250 -20 l-20 -40 l20 -6 l20 46 Z" fill="${cor}" stroke="${C}" stroke-width="5"/>
      <g id="${id}-helice-cauda" style="transform-box:fill-box;transform-origin:50% 50%"><circle cx="-262" cy="-14" r="26" fill="#c9ccd4" opacity="0.5" stroke="${C}" stroke-width="3"/><path d="M-262 -40 v52" stroke="${C}" stroke-width="5"/></g>
      <path d="M-100 20 Q-110 -60 -10 -66 L80 -66 Q160 -56 170 20 Q160 60 80 64 L-50 64 Q-100 60 -100 20 Z" fill="${cor}" stroke="${C}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M40 -56 Q130 -50 150 10 L60 10 Z" fill="#9fd0ea" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><path d="M70 -40 l20 40" stroke="#fff" stroke-width="7" opacity="0.6"/><rect x="-40" y="-40" width="60" height="44" rx="8" fill="#9fd0ea" stroke="${C}" stroke-width="5"/>
      <path d="M-60 64 v26 M90 64 v26 M-100 92 H150" stroke="${C}" stroke-width="8" stroke-linecap="round"/>
      <rect x="10" y="-86" width="20" height="22" fill="#4a4d57" stroke="${C}" stroke-width="4"/>
      <g id="${id}-helice" style="transform-box:fill-box;transform-origin:50% 50%"><rect x="-200" y="-96" width="440" height="12" rx="6" fill="#4a4d57" stroke="${C}" stroke-width="4"/></g><circle cx="20" cy="-90" r="10" fill="#c9ccd4" stroke="${C}" stroke-width="4"/></g>`;
  }
  // submarino amarelo (flutuante, centro 0,0; ~ 360 x 170), virado para a direita. ids: -helice
  function submarino(o = {}) {
    const id = o.id || "sub", cor = o.cor || "#F5C542";
    return `<g id="${id}"><path d="M-170 10 Q-170 -60 -60 -60 L100 -60 Q190 -60 190 10 Q190 70 100 70 L-60 70 Q-170 70 -170 10 Z" fill="${cor}" stroke="${C}" stroke-width="7"/><path d="M-150 40 Q-100 64 -40 64 L100 64 Q160 60 180 30" fill="none" stroke="${esc(cor, -0.18)}" stroke-width="12"/>
      <path d="M-40 -60 L-30 -110 L60 -110 L70 -60 Z" fill="${cor}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><path d="M20 -110 V-150 h30" fill="none" stroke="${C}" stroke-width="8"/><path d="M20 -110 V-150 h30" fill="none" stroke="#c9ccd4" stroke-width="4"/>
      ${[-80, 0, 80].map(x => `<circle cx="${x}" cy="4" r="22" fill="#9fd0ea" stroke="${C}" stroke-width="6"/><circle cx="${x - 6}" cy="-2" r="6" fill="#fff"/>`).join("")}
      <path d="M-170 10 l-30 -40 v80 Z" fill="${esc(cor, -0.18)}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><g id="${id}-helice" style="transform-box:fill-box;transform-origin:50% 50%"><ellipse cx="-214" cy="10" rx="10" ry="36" fill="#c9ccd4" stroke="${C}" stroke-width="4"/></g>
      ${[[-110, 50], [130, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${C}" opacity="0.5"/>`).join("")}</g>`;
  }

  Object.assign(window.Objetos, { carne, carroVelho, carroEsportivo, carimbo, pizza, lupa, pastel, copoCaldo, xicaraCafe, mesaLivroCaixa, lixeiraRua, cameraFoto, bandeirinha, campoFutebol, muroCima, portaoCima, alfinete, vassouraBalde, tesouraPoda, prancheta, caixaFerramentas, laptop, bonequinho, sofaGigante, cartaoPreto, aviao, poltrona, ilha, iate, helicoptero, submarino });
})();

/* ===== Pecas e apelidos que as fichas da parte 3 usam (09/11/2026) =====
 * Coordenadas: contornoTerreno, camposFutebol, trabalhadores e engrenagens sao desenhados nas coordenadas da cena
 * (usar com x 0, pes 362, escala 1 -> sem deslocamento). */
(function () {
  const O = window.Objetos, C = O.C, esc = O.esc;
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const T = (x, y, txt, tam, cor = "#fff8e6") => `<text x="${x}" y="${y}" text-anchor="middle" style="${F};font-size:${tam}px" fill="${cor}">${txt}</text>`;
  const rnd = (s) => { let x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  // carroHatch com sujo/sem_calota vira o hatch velho
  const hatch0 = O.carroHatch;
  O.carroHatch = (o = {}) => (o.sujo || o.sem_calota) ? O.carroVelho(o) : hatch0(o);
  const velho0 = O.carroVelho;
  O.carroVelho = (o = {}) => { const s0 = O.carroHatch; O.carroHatch = hatch0; try { return velho0(o); } finally { O.carroHatch = s0; } };
  // pizzaGrafico: fatia como fracao (0.002 = 0,2%)
  const pizzaGrafico = (o = {}) => O.pizza(Object.assign({}, o, { pct: o.fatia != null ? o.fatia * 100 : o.pct }));
  // contorno do terreno: tracejado (-tracejado, desenha com dashoffset), muro (-muro, sobe) e portao (-portao, fecha) no ponto onde a estrada entra
  function contornoTerreno(o = {}) {
    const id = o.id || "contorno", pts = o.pontos || window.Cenarios.terrenoCima.contorno, d = "M" + pts.map(p => p.join(" ")).join(" L") + " Z";
    return `<g id="${id}"><g id="${id}-muro" opacity="0">${O.muroCima({ id: id + "-muroC", pontos: pts })}</g>
      <path id="${id}-tracejado-fundo" d="${d}" fill="none" stroke="${C}" stroke-width="16" stroke-linejoin="round"/><path id="${id}-tracejado" d="${d}" fill="none" stroke="#F5C542" stroke-width="9" stroke-dasharray="34 18" stroke-linejoin="round"/>
      <g id="${id}-portao" transform="translate(945 892)" opacity="0">${O.portaoCima({ id: id + "-portaoC", w: 120 })}</g></g>`;
  }
  // 8 campos de futebol dentro do terreno (ids -campo-0..7, para a cascata)
  function camposFutebol(o = {}) {
    const id = o.id || "campos", n = o.quantos || 8; let s = `<g id="${id}">`;
    for (let i = 0; i < n; i++) { const c = i % 4, r = Math.floor(i / 4); s += `<g id="${id}-campo-${i}" transform="translate(${615 + c * 230} ${r ? 790 : 370}) rotate(${(rnd(i) - 0.5) * 6})">${O.campoFutebol({ id: id + "-c" + i, w: 200, h: 130 })}</g>`; }
    return s + `<g id="${id}-rotulo" transform="translate(960 1010)"><rect x="-420" y="-44" width="840" height="70" rx="16" fill="#2E2A33" opacity="0.9"/>${T(0, 6, "5,7 hectares ≈ 8 campos de futebol", 40)}</g></g>`;
  }
  // plaquinha "24 h" (centro 0,0); -luz acende
  function placa24h(o = {}) {
    const id = o.id || "placa24";
    return `<g id="${id}"><rect x="-60" y="-34" width="120" height="68" rx="12" fill="#2b2a31" stroke="${C}" stroke-width="6"/><g id="${id}-luz" opacity="0">${T(0, 16, "24 h", 42, "#7CFC6A")}<rect x="-60" y="-34" width="120" height="68" rx="12" fill="#7CFC6A" opacity="0.15"/></g></g>`;
  }
  // seta com texto (ponta para baixo, em 0,0)
  function seta(o = {}) {
    const id = o.id || "seta", t = o.texto || "a casa", w = Math.max(200, t.length * 34 + 60);
    return `<g id="${id}"><rect x="${-w / 2}" y="-320" width="${w}" height="90" rx="20" fill="#2E2A33" stroke="${C}" stroke-width="6"/>${T(0, -258, t, 56, "#F5C542")}<path d="M0 -226 V-60" stroke="${C}" stroke-width="30" stroke-linecap="round"/><path d="M0 -226 V-60" stroke="#F5C542" stroke-width="18" stroke-linecap="round"/><path d="M-60 -80 L0 0 L60 -80 Z" fill="#F5C542" stroke="${C}" stroke-width="7" stroke-linejoin="round"/></g>`;
  }
  // camera de seguranca de parede (suporte em 0,0, olhando para a direita); -cab gira em torno do suporte
  function cameraSeguranca(o = {}) {
    const id = o.id || "camSeg";
    return `<g id="${id}"><rect x="-14" y="-40" width="28" height="80" rx="6" fill="#c9ccd4" stroke="${C}" stroke-width="5"/><path d="M0 0 h30" stroke="${C}" stroke-width="10"/><g id="${id}-cab"><rect x="24" y="-26" width="110" height="52" rx="12" fill="#fff" stroke="${C}" stroke-width="6"/><rect x="128" y="-20" width="26" height="40" rx="6" fill="#2b2a31" stroke="${C}" stroke-width="4"/><circle cx="60" cy="0" r="7" fill="#e2544f"/><path d="M30 -26 h100" stroke="#e8ecf2" stroke-width="6"/></g></g>`;
  }
  // rede solta (pontas em 0,0 e 260,0)
  function rede(o = {}) {
    const id = o.id || "rede";
    return `<g id="${id}"><path d="M0 0 L50 30 M260 0 L210 30" stroke="${C}" stroke-width="5"/><path d="M40 26 Q130 110 220 26 Q130 70 40 26 Z" fill="#f29e4c" stroke="${C}" stroke-width="6"/>${[0, 1, 2, 3].map(i => `<path d="M${64 + i * 40} ${40 + Math.sin(i) * 6} v22" stroke="#e2544f" stroke-width="6"/>`).join("")}</g>`;
  }
  // 63 trabalhadores nos comodos da mansao em corte (ids -t-N); cada um com -t-N-corpo para o vai e vem
  function trabalhadores(o = {}) {
    const id = o.id || "trab", n = o.quantos || 63, L = window.Cenarios.mansaoCorte.comodos, cores = ["#4a90d9", "#e2544f", "#6fae5a", "#F5C542", "#b07cc6", "#f29e4c", "#3fa7c9"];
    const chap = { cozinha: "chef", garagem: "capacete", academia: "bone", lavanderia: null };
    let s = `<g id="${id}">`, k = 0;
    for (let i = 0; i < n; i++) {
      const ci = i % L.length, c = L[ci], j = Math.floor(i / L.length);
      if (c.nome === "quartoRede" && j > 3) continue;
      const x = c.x + 34 + ((j * 47 + ci * 13) % (c.w - 60)), y = c.y + c.h - 10;
      s += `<g id="${id}-t-${k}" transform="translate(${x} ${y}) scale(0.82)">${O.bonequinho({ id: id + "-b" + k, cor: cores[(i * 3) % cores.length], k: i, chapeu: chap[c.nome] || null })}</g>`; k++;
    }
    return s + `</g>`;
  }
  // engrenagens do sotao (nas coordenadas da cena; -engrenagem-0..2)
  function engrenagens(o = {}) {
    const id = o.id || "engr";
    const eng = (cx, cy, r, i, cor) => { let d = ""; const n = Math.round(r / 7); for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2, b = a + Math.PI / n * 0.9; d += `${k ? "L" : "M"}${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r} L${cx + Math.cos(a) * (r + 12)} ${cy + Math.sin(a) * (r + 12)} L${cx + Math.cos(b) * (r + 12)} ${cy + Math.sin(b) * (r + 12)} L${cx + Math.cos(b) * r} ${cy + Math.sin(b) * r} `; } return `<g id="${id}-engrenagem-${i}" data-cx="${cx}" data-cy="${cy}"><path d="${d}Z" fill="${cor}" stroke="${C}" stroke-width="5" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy}" r="${r * 0.45}" fill="${esc(cor, 0.25)}" stroke="${C}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${r * 0.15}" fill="${C}"/></g>`; };
    return `<g id="${id}">${eng(860, 112, 44, 0, "#e0b23e")}${eng(950, 82, 28, 1, "#c9ccd4")}${eng(1040, 116, 38, 2, "#e0b23e")}</g>`;
  }
  // iateGrande = iate
  Object.assign(O, { pizzaGrafico, lixeira: O.lixeiraRua, contornoTerreno, camposFutebol, placa24h, seta, cameraSeguranca, rede, trabalhadores, engrenagens, iateGrande: O.iate });
})();

/* ===== Objetos da parte 4 do video do trilionario (10/11/2026) =====
 * Convencao igual a da parte 3: objetos "de chao" com o chao em y=362; pecas que animam com id proprio. */
(function () {
  const O = window.Objetos, C = O.C, esc = O.esc;
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const T = (x, y, txt, tam, cor = "#fff8e6", anc = "middle", extra = "") => `<text x="${x}" y="${y}" text-anchor="${anc}" style="${F};font-size:${tam}px" fill="${cor}" ${extra}>${txt}</text>`;

  /* ---------- c28: cofre fechado com teia e aranha (chao em 362, ~ 460 x 520) ----------
   * ids: -teia (opacity 0), -aranha (desce no fio: animar y de -140 ate 0), -etiqueta */
  function cofreFechado(o = {}) {
    const id = o.id || "cofreF", rot = o.texto || "US$ 1 TRI";
    const aco = "#8f96a3", acoC = "#b4bac5", acoE = "#6b7280";
    let s = `<g id="${id}"><ellipse cx="230" cy="366" rx="250" ry="22" fill="#000" opacity="0.14"/>`;
    // pes
    s += [40, 380].map(x => `<rect x="${x}" y="330" width="40" height="34" rx="6" fill="${acoE}" stroke="${C}" stroke-width="6"/>`).join("");
    // corpo com chanfro e brilho
    s += `<rect x="0" y="-150" width="460" height="490" rx="26" fill="${aco}" stroke="${C}" stroke-width="8"/>
      <rect x="22" y="-128" width="416" height="446" rx="18" fill="${acoC}" stroke="${C}" stroke-width="5"/>
      <path d="M40 -110 L40 290" stroke="#d6dae2" stroke-width="10" stroke-linecap="round" opacity="0.8"/>`;
    // rebites
    for (let k = 0; k < 6; k++) [34, 426].forEach(x => { s += `<circle cx="${x}" cy="${-110 + k * 76}" r="7" fill="#d6dae2" stroke="${C}" stroke-width="3"/>`; });
    // porta redonda com volante
    s += `<circle cx="230" cy="90" r="150" fill="${aco}" stroke="${C}" stroke-width="7"/><circle cx="230" cy="90" r="124" fill="#a3a9b5" stroke="${C}" stroke-width="5"/>
      ${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<circle cx="${230 + Math.cos(a) * 138}" cy="${90 + Math.sin(a) * 138}" r="6" fill="#d6dae2" stroke="${C}" stroke-width="2.5"/>`; }).join("")}
      <g>${[0, 60, 120].map(a => `<rect x="222" y="0" width="16" height="180" rx="8" fill="#e0b23e" stroke="${C}" stroke-width="4" transform="rotate(${a} 230 90)"/>`).join("")}
      <circle cx="230" cy="90" r="38" fill="#e0b23e" stroke="${C}" stroke-width="6"/><circle cx="230" cy="90" r="14" fill="${C}"/></g>`;
    // fechadura de segredo
    s += `<circle cx="380" cy="-70" r="30" fill="#2b2a31" stroke="${C}" stroke-width="5"/>${Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return `<path d="M${380 + Math.cos(a) * 20} ${-70 + Math.sin(a) * 20} L${380 + Math.cos(a) * 27} ${-70 + Math.sin(a) * 27}" stroke="#fff8e6" stroke-width="3"/>`; }).join("")}<path d="M380 -70 L380 -92" stroke="#e2544f" stroke-width="5" stroke-linecap="round"/>`;
    // etiqueta
    s += `<g id="${id}-etiqueta"><rect x="80" y="-112" width="230" height="64" rx="10" fill="#2E2A33" stroke="${C}" stroke-width="5"/>${T(195, -68, rot, 38, "#F5C542")}</g>`;
    // teia no canto de cima a esquerda (aparece) e aranha no fio
    let teia = "";
    for (let r = 1; r <= 4; r++) { const rr = r * 34; teia += `<path d="M${-10 + rr} -160 Q${-10 + rr * 0.62} ${-160 + rr * 0.62} -10 ${-160 + rr}" fill="none" stroke="#fff" stroke-width="3" opacity="0.9"/>`; }
    [[150, 0], [130, 40], [100, 75], [60, 115], [0, 150]].forEach(([dx, dy]) => { teia += `<path d="M-10 -160 L${-10 + dx} ${-160 + dy}" stroke="#fff" stroke-width="3" opacity="0.9"/>`; });
    s += `<g id="${id}-teia" opacity="0">${teia}</g>`;
    s += `<g id="${id}-aranha"><path d="M120 -400 V-60" stroke="#fff" stroke-width="2.5"/><g transform="translate(120 -48)">
      ${[-1, 1].map(sx => [0, 1, 2, 3].map(k => `<path d="M${sx * 8} ${-4 + k * 5} q${sx * 14} ${-8 + k * 3} ${sx * 22} ${4 + k * 4}" fill="none" stroke="${C}" stroke-width="3" stroke-linecap="round"/>`).join("")).join("")}
      <ellipse cx="0" cy="4" rx="12" ry="14" fill="#2b2a31" stroke="${C}" stroke-width="3"/><circle cx="0" cy="-12" r="8" fill="#2b2a31" stroke="${C}" stroke-width="3"/>
      <circle cx="-3" cy="-13" r="2.4" fill="#fff"/><circle cx="3" cy="-13" r="2.4" fill="#fff"/></g></g>`;
    return s + `</g>`;
  }

  /* ---------- c28: grafico de linha que sobe sozinho (coordenadas da cena; origem do eixo em o.x0, o.y0) ----------
   * ids: -tracejado (linha amarela, desenhada pelo "desenhar"), -tracejado-fundo (contorno), -ponta (seta, opacity 0), -eixos */
  function graficoLinha(o = {}) {
    const id = o.id || "graf", x0 = o.x0 || 700, y0 = o.y0 || 860, w = o.w || 1000, h = o.h || 600;
    const pts = [];
    for (let i = 0; i <= 24; i++) { const f = i / 24; pts.push([x0 + f * w, y0 - h * (0.06 + 0.94 * Math.pow(f, 1.6)) + (i % 3 === 1 ? 14 : i % 3 === 2 ? -6 : 0) * (1 - f)]); }
    const d = "M" + pts.map(p => p.map(v => v.toFixed(1)).join(" ")).join(" L");
    const fim = pts[pts.length - 1], pen = pts[pts.length - 2], ang = Math.atan2(fim[1] - pen[1], fim[0] - pen[0]) * 180 / Math.PI;
    let s = `<g id="${id}"><g id="${id}-eixos">`;
    for (let k = 1; k <= 4; k++) s += `<path d="M${x0} ${y0 - k * h / 4} H${x0 + w}" stroke="#d9c79f" stroke-width="3" stroke-dasharray="10 10"/>`;
    s += `<path d="M${x0} ${y0 - h - 40} V${y0} H${x0 + w + 40}" fill="none" stroke="${C}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<path d="M${x0 - 14} ${y0 - h - 20} L${x0} ${y0 - h - 44} L${x0 + 14} ${y0 - h - 20}" fill="none" stroke="${C}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<path d="M${x0 + w + 20} ${y0 - 14} L${x0 + w + 44} ${y0} L${x0 + w + 20} ${y0 + 14}" fill="none" stroke="${C}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"].forEach((dia, i) => { s += T(x0 + (i + 0.5) * w / 7, y0 + 44, dia, 26, "#9a8a6a"); });
    s += `</g><path id="${id}-tracejado-fundo" d="${d}" fill="none" stroke="${C}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
      <path id="${id}-tracejado" d="${d}" fill="none" stroke="#5fbf6a" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      <g id="${id}-ponta" opacity="0"><g transform="translate(${fim[0].toFixed(1)} ${fim[1].toFixed(1)}) rotate(${ang.toFixed(1)})"><path d="M-6 -30 L40 0 L-6 30 Z" fill="#5fbf6a" stroke="${C}" stroke-width="7" stroke-linejoin="round"/></g></g></g>`;
    return s;
  }

  /* ---------- c29: zzz (centro 0,0 na base; tres letras ids -z-0..2, para o "flutuar") ---------- */
  function zzz(o = {}) {
    const id = o.id || "zzz";
    return `<g id="${id}">${[0, 1, 2].map(i => `<g id="${id}-z-${i}"><g transform="translate(${i * 46} ${-i * 58}) scale(${1 - i * 0.18})">${T(0, 0, "Z", 74, "#dfe8ff", "middle", `stroke="${C}" stroke-width="8" paint-order="stroke"`)}</g></g>`).join("")}</g>`;
  }

  /* ---------- c30: quadro de tarefas no cavalete (chao em 362; ~ 640 x 1000) ----------
   * ids: -check-N (opacity 0) para cada item; -carimbo (opacity 0) "RESOLVIDO" */
  function quadroTarefas(o = {}) {
    const id = o.id || "quadro", itens = o.itens || ["Dinheiro", "Segurança", "Carro", "Casa", "Funcionários"], tit = o.titulo || "PENDÊNCIAS";
    const madeira = "#a86b42", madE = "#8a5532";
    let s = `<g id="${id}"><ellipse cx="320" cy="364" rx="300" ry="20" fill="#000" opacity="0.14"/>`;
    // pernas do cavalete (tras e frente)
    s += `<path d="M320 -560 L470 362" stroke="${C}" stroke-width="30" stroke-linecap="round"/><path d="M320 -560 L470 362" stroke="${madE}" stroke-width="18" stroke-linecap="round"/>`;
    s += [[150, 362], [490, 362]].map(([x, y]) => `<path d="M320 -600 L${x} ${y}" stroke="${C}" stroke-width="34" stroke-linecap="round"/><path d="M320 -600 L${x} ${y}" stroke="${madeira}" stroke-width="22" stroke-linecap="round"/>`).join("");
    s += `<rect x="210" y="210" width="220" height="24" rx="8" fill="${madeira}" stroke="${C}" stroke-width="6"/>`;
    // apoio e quadro
    s += `<rect x="20" y="130" width="600" height="34" rx="10" fill="${madeira}" stroke="${C}" stroke-width="6"/>
      <rect x="30" y="-560" width="580" height="700" rx="18" fill="#fff8e6" stroke="${C}" stroke-width="9"/>
      <rect x="30" y="-560" width="580" height="110" rx="18" fill="#2E2A33" stroke="${C}" stroke-width="9"/>${T(320, -487, tit, 58, "#F5C542")}
      <rect x="296" y="-596" width="48" height="44" rx="10" fill="#c9ccd4" stroke="${C}" stroke-width="5"/>`;
    // linhas de caderno
    for (let k = 0; k < 6; k++) s += `<path d="M60 ${-340 + k * 92} H580" stroke="#e3d7bd" stroke-width="3"/>`;
    // itens
    itens.forEach((t, i) => {
      const y = -380 + i * 98;
      s += `<rect x="70" y="${y - 32}" width="58" height="58" rx="10" fill="#fff" stroke="${C}" stroke-width="6"/>${T(156, y + 14, t, 50, "#2E2A33", "start")}`;
      s += `<g id="${id}-check-${i}" opacity="0"><path d="M78 ${y - 4} L98 ${y + 20} L144 ${y - 46}" fill="none" stroke="${C}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><path d="M78 ${y - 4} L98 ${y + 20} L144 ${y - 46}" fill="none" stroke="#3fae5a" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    });
    // marca de giz, apagador e caneta
    s += `<rect x="460" y="110" width="90" height="26" rx="6" fill="#4a90d9" stroke="${C}" stroke-width="4"/><rect x="90" y="114" width="110" height="16" rx="8" fill="#e2544f" stroke="${C}" stroke-width="4"/>`;
    // carimbo final
    s += `<g id="${id}-carimbo" opacity="0"><g transform="translate(330 -60) rotate(-14)"><rect x="-250" y="-70" width="500" height="140" rx="16" fill="none" stroke="#3fae5a" stroke-width="14"/><rect x="-234" y="-54" width="468" height="108" rx="10" fill="none" stroke="#3fae5a" stroke-width="5"/>${T(0, 28, "RESOLVIDO", 84, "#3fae5a")}</g></g>`;
    return s + `</g>`;
  }

  Object.assign(O, { cofreFechado, graficoLinha, zzz, quadroTarefas });
})();

/* ===== Objetos da parte 5 do video do trilionario (10/11/2026) =====
 * Mesma convencao: "de chao" com chao em y=362; "flutuantes" centrados em 0,0 (posicionar com "y" na ficha). */
(function () {
  const O = window.Objetos, C = O.C, esc = O.esc;
  const F = "font-family:Nunito, 'Arial Rounded MT Bold', sans-serif;font-weight:900";
  const T = (x, y, txt, tam, cor = "#fff8e6", anc = "middle", extra = "") => `<text x="${x}" y="${y}" text-anchor="${anc}" style="${F};font-size:${tam}px" fill="${cor}" ${extra}>${txt}</text>`;
  const rosto = (rig, expr) => { try { return O.rostoDoRig(rig, expr); } catch (e) { return undefined; } };
  let n = 0;

  /* ---------- c36: cheque gigante num suporte (chao em 362; ~ 1100 x 760) ----------
   * ids: -tracejado (assinatura, desenhada pelo "desenhar"), -valor, -para (opacity 0) */
  function chequeGigante(o = {}) {
    const id = o.id || "cheque";
    let s = `<g id="${id}"><ellipse cx="550" cy="364" rx="480" ry="22" fill="#000" opacity="0.14"/>`;
    s += [[260, 362], [840, 362]].map(([x]) => `<rect x="${x - 14}" y="-60" width="28" height="424" fill="#8a5532" stroke="${C}" stroke-width="6"/>`).join("");
    s += `<rect x="0" y="-400" width="1100" height="440" rx="16" fill="#e8f3e2" stroke="${C}" stroke-width="9"/>
      <rect x="18" y="-382" width="1064" height="404" rx="10" fill="none" stroke="#9fcf8f" stroke-width="5" stroke-dasharray="14 10"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${60 + i * 120} -380 q60 30 120 0" fill="none" stroke="#cfe6c4" stroke-width="4"/>`).join("")}
      <circle cx="90" cy="-320" r="36" fill="#5fbf6a" stroke="${C}" stroke-width="5"/>${T(90, -306, "$", 40, "#fff")}${T(150, -308, "BANCO TRILHÃO", 34, "#2E2A33", "start")}
      ${T(1050, -320, "Nº 000001", 26, "#6b7a66", "end")}`;
    s += `${T(60, -200, "PAGUE A", 30, "#6b7a66", "start")}<path d="M200 -200 H760" stroke="#6b7a66" stroke-width="4"/>
      <g id="${id}-para" opacity="0">${T(210, -212, "Vítimas da enchente", 50, "#2E2A33", "start")}</g>
      <rect x="800" y="-262" width="260" height="84" rx="10" fill="#fff" stroke="${C}" stroke-width="6"/>
      <g id="${id}-valor" opacity="0">${T(930, -204, "US$ 500 mi", 44, "#1f7a3a")}</g>
      ${T(60, -100, "QUINHENTOS MILHÕES DE DÓLARES", 30, "#6b7a66", "start")}<path d="M60 -88 H760" stroke="#6b7a66" stroke-width="4"/>
      <path d="M620 -10 H1040" stroke="#6b7a66" stroke-width="4"/>${T(830, 22, "assinatura", 24, "#9aa59a")}
      <path id="${id}-tracejado-fundo" d="M650 -30 c30 -60 60 -60 50 0 c-10 40 40 -50 70 -40 c20 10 -10 50 20 40 c30 -10 40 -60 70 -50 c20 8 0 40 30 40 c40 0 60 -30 120 -20" fill="none" stroke="#1d2b55" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0.25"/>
      <path id="${id}-tracejado" d="M650 -30 c30 -60 60 -60 50 0 c-10 40 40 -50 70 -40 c20 10 -10 50 20 40 c30 -10 40 -60 70 -50 c20 8 0 40 30 40 c40 0 60 -30 120 -20" fill="none" stroke="#1d2b55" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
    return s + `</g>`;
  }

  /* ---------- c37: telao de noticias (flutuante, centro 0,0; ~ 900 x 760) ----------
   * ids: -lista (desce: a manchete dele sai por baixo e as outras noticias entram por cima) */
  function telaoNoticias(o = {}) {
    const id = o.id || "noticias", cid = id + "-clip" + (n++);
    const card = (y, cor, tag, tit, sub) => `<g transform="translate(0 ${y})"><rect x="-400" y="-110" width="800" height="210" rx="18" fill="#fff" stroke="${C}" stroke-width="5"/>
      <rect x="-380" y="-90" width="190" height="170" rx="12" fill="${cor}" stroke="${C}" stroke-width="4"/><circle cx="-285" cy="-20" r="40" fill="#fff" opacity="0.35"/><path d="M-380 80 L-320 20 L-270 60 L-230 30 L-190 80 Z" fill="#fff" opacity="0.35"/>
      <rect x="-170" y="-88" width="${tag.length * 17 + 30}" height="36" rx="8" fill="${cor}"/>${T(-155, -61, tag, 24, "#fff", "start")}
      ${T(-170, -8, tit, 34, "#2E2A33", "start")}${T(-170, 34, sub, 26, "#9a96a3", "start")}<path d="M-170 66 H340" stroke="#e8e4dc" stroke-width="6" stroke-linecap="round"/></g>`;
    let lista = `<g id="${id}-lista">`;
    // noticias de cima (fora da tela no comeco) e a dele no topo visivel
    [["#4a90d9", "ESPORTE", "Final decidida nos pênaltis", "há 2 min"], ["#b07cc6", "FAMOSOS", "Cantora anuncia turnê", "há 5 min"], ["#f29e4c", "ECONOMIA", "Dólar fecha em queda", "há 8 min"], ["#e2544f", "TRÂNSITO", "Marginal parada há 3 h", "há 12 min"]]
      .forEach((c, i) => { lista += card(-400 - i * 240, ...c); });
    lista += `<g id="${id}-dele">${card(-160, "#5fbf6a", "URGENTE", "Trilionário doa US$ 500 mi", "há 1 h · 4,2 mi de curtidas")}</g>`;
    lista += card(80, "#3fa7c9", "CLIMA", "Frente fria chega amanhã", "há 1 h") + card(320, "#e0b23e", "TECNOLOGIA", "Celular novo esgota em 1 h", "há 2 h");
    lista += `</g>`;
    return `<g id="${id}"><rect x="-470" y="-430" width="940" height="860" rx="34" fill="#2b2a31" stroke="${C}" stroke-width="9"/>
      <rect x="-440" y="-400" width="880" height="80" rx="16" fill="#e2544f"/>${T(-410, -347, "● AO VIVO  |  NOTÍCIAS", 34, "#fff", "start")}
      <clipPath id="${cid}"><rect x="-440" y="-310" width="880" height="700" rx="12"/></clipPath><rect x="-440" y="-310" width="880" height="700" rx="12" fill="#f6f3ee"/>
      <g clip-path="url(#${cid})">${lista}</g><rect x="-80" y="400" width="160" height="12" rx="6" fill="#4a4d57"/></g>`;
  }

  /* ---------- c38: maos (flutuante; fileira de maos na base da tela, base em y 0, ~ 1900 de largura) ----------
   * ids: -juntas (maos agradecendo, coracoes), -abertas (opacity 0, maos estendidas pedindo), -mais (opacity 0, mais maos) */
  function maosMultidao(o = {}) {
    const id = o.id || "maos", peles = ["#F4A46A", "#c98a5a", "#8a5a3b", "#f2c6a0", "#a86b42", "#e8b089"];
    const juntas = (x, k) => { const p = peles[k % 6]; return `<g transform="translate(${x} 0) rotate(${(k % 3 - 1) * 5})"><path d="M-46 0 Q-50 -120 -16 -230 Q-4 -260 6 -230 L8 -40 Z" fill="${p}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><path d="M46 0 Q50 -120 16 -230 Q4 -260 -6 -230 L-8 -40 Z" fill="${esc(p, -0.08)}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/><rect x="-60" y="-10" width="120" height="70" rx="20" fill="${["#4a90d9", "#e2544f", "#6fae5a", "#F5C542", "#b07cc6", "#f29e4c"][k % 6]}" stroke="${C}" stroke-width="6"/><path d="M0 -300 q-20 -24 0 -36 q20 12 0 36 Z" fill="#e2544f" stroke="${C}" stroke-width="4" transform="translate(0 -10)"/></g>`; };
    const aberta = (x, k, alt = 0) => { const p = peles[(k + 2) % 6]; return `<g transform="translate(${x} ${alt}) rotate(${(k % 4 - 1.5) * 8})"><rect x="-44" y="-150" width="88" height="220" rx="30" fill="${["#4a90d9", "#e2544f", "#6fae5a", "#F5C542", "#b07cc6", "#f29e4c"][(k + 1) % 6]}" stroke="${C}" stroke-width="6"/>
      <path d="M-52 -150 Q-60 -230 -40 -290 L-30 -300 Q-20 -290 -24 -250 L-20 -330 Q-8 -346 4 -330 L6 -262 L10 -350 Q22 -364 34 -348 L32 -262 L40 -330 Q54 -340 62 -322 L58 -230 L74 -270 Q92 -272 90 -250 Q80 -190 56 -150 Z" fill="${p}" stroke="${C}" stroke-width="6" stroke-linejoin="round"/></g>`; };
    let a = "", b = "", m = "";
    for (let k = 0; k < 9; k++) a += juntas(-860 + k * 215, k);
    for (let k = 0; k < 9; k++) b += aberta(-860 + k * 215, k);
    for (let k = 0; k < 8; k++) m += `<g id="${id}-mais-${k}">${aberta(-750 + k * 215, k + 3, 70)}</g>`;
    return `<g id="${id}"><g id="${id}-juntas">${a}</g><g id="${id}-abertas" opacity="0">${b}</g><g id="${id}-mais">${m}</g></g>`;
  }

  /* ---------- c39/c42: porta-retratos com 4 amigos (de mao/mesa, centro 0,0; ~ 420 x 330) ----------
   * ids: -amigo-0..3 (cada rosto; o "apagar" desbota um a um) */
  function portaRetrato(o = {}) {
    const id = o.id || "retrato", cid = id + "-clip" + (n++);
    const quem = o.quem || [["amigo_jovem_svg", "feliz"], ["principal_svg", "feliz"], ["cliente1_svg", "feliz"], ["cliente2_svg", "feliz"]];
    let s = `<g id="${id}"><rect x="-206" y="-158" width="420" height="330" rx="14" fill="#000" opacity="0.18"/>
      <rect x="-210" y="-165" width="420" height="330" rx="14" fill="#c98a4a" stroke="${C}" stroke-width="8"/><rect x="-186" y="-141" width="372" height="282" rx="6" fill="#e9f2f7" stroke="${C}" stroke-width="5"/>
      <clipPath id="${cid}"><rect x="-186" y="-141" width="372" height="282" rx="6"/></clipPath><g clip-path="url(#${cid})"><rect x="-186" y="40" width="372" height="120" fill="#9fcf8f"/><circle cx="130" cy="-90" r="34" fill="#F5C542" opacity="0.8"/>`;
    quem.forEach(([rig, ex], i) => {
      const x = -132 + i * 88, y = 20 + (i % 2) * 14;
      s += `<g id="${id}-amigo-${i}"><g transform="translate(${x} ${y}) scale(0.34)"><rect x="-90" y="60" width="180" height="200" rx="60" fill="${["#e2544f", "#0b3df0", "#9fcfc6", "#f29e4c"][i]}" stroke="${C}" stroke-width="10"/><g transform="translate(0 70) scale(0.95)">${rosto(rig, ex) || `<circle r="90" fill="#F4A46A" stroke="${C}" stroke-width="8"/>`}</g></g></g>`;
    });
    s += `</g>${T(0, 158, "REPÚBLICA · 2009", 20, "#fff8e6")}<path d="M-120 -165 L-90 -200 L90 -200 L120 -165" fill="none" stroke="${C}" stroke-width="5" opacity="0"/></g>`;
    return s;
  }

  /* ---------- c40: celular com fila de chamadas (flutuante, centro 0,0; ~ 560 x 1000) ----------
   * ids: -ch-0..3 (cada chamada, opacity 0), -vibra (ondas, opacity 0) */
  function celularChamadas(o = {}) {
    const id = o.id || "chamadas";
    const cargos = o.cargos || [["Advogado", "⚖", "#4a6fa8"], ["Gestor de fortuna", "$", "#1f7a3a"], ["Presidente de país", "★", "#c25b4e"], ["Diretor de ONG", "♥", "#e0912e"]];
    let s = `<g id="${id}"><g id="${id}-vibra" opacity="0">${[0, 1].map(k => `<path d="M${-320 - k * 30} ${-120} q-30 120 0 240 M${320 + k * 30} -120 q30 120 0 240" fill="none" stroke="#e2544f" stroke-width="10" stroke-linecap="round"/>`).join("")}</g>
      <rect x="-290" y="-510" width="580" height="1020" rx="70" fill="#2b2a31" stroke="${C}" stroke-width="10"/><rect x="-256" y="-470" width="512" height="940" rx="44" fill="#f6f3ee"/>
      <rect x="-70" y="-460" width="140" height="30" rx="15" fill="#2b2a31"/>${T(-220, -380, "Chamadas", 48, "#2E2A33", "start")}${T(220, -380, "4 perdidas", 28, "#e2544f", "end")}`;
    cargos.forEach(([nome, ic, cor], i) => {
      const y = -300 + i * 190;
      s += `<g id="${id}-ch-${i}" opacity="0"><rect x="-236" y="${y}" width="472" height="160" rx="24" fill="#fff" stroke="${C}" stroke-width="5"/>
        <circle cx="-160" cy="${y + 80}" r="54" fill="${cor}" stroke="${C}" stroke-width="5"/>${T(-160, y + 100, ic, 56, "#fff")}
        ${T(-86, y + 70, nome, 32, "#2E2A33", "start")}${T(-86, y + 112, "chamando…", 26, "#9a96a3", "start")}
        <circle cx="190" cy="${y + 80}" r="30" fill="#5fbf6a" stroke="${C}" stroke-width="4"/><path d="M178 ${y + 70} q4 18 22 24 l6 -6 l-8 -8 l-6 4 q-8 -4 -10 -12 l4 -6 l-8 -8 Z" fill="#fff"/></g>`;
    });
    s += `</g>`;
    return s;
  }

  /* ---------- c41: envelope de convite, contrato e cheque pequeno (de chao, chao em 362; ~ 300 x 60) ---------- */
  function envelope(o = {}) {
    const id = o.id || "env" + (n++);
    return `<g id="${id}"><rect x="0" y="302" width="300" height="60" rx="6" fill="#f7efe0" stroke="${C}" stroke-width="5"/><path d="M0 302 L150 340 L300 302" fill="none" stroke="${C}" stroke-width="4"/><circle cx="150" cy="338" r="12" fill="#c25b4e" stroke="${C}" stroke-width="3"/></g>`;
  }
  function contrato(o = {}) {
    const id = o.id || "ctr" + (n++);
    return `<g id="${id}"><rect x="0" y="310" width="300" height="52" rx="4" fill="#fff" stroke="${C}" stroke-width="5"/><path d="M20 326 H200 M20 340 H260" stroke="#c4c0b8" stroke-width="4"/><rect x="230" y="318" width="54" height="20" rx="4" fill="#F5C542" stroke="${C}" stroke-width="3"/></g>`;
  }
  function chequePequeno(o = {}) {
    const id = o.id || "chq" + (n++);
    return `<g id="${id}"><rect x="0" y="312" width="300" height="50" rx="5" fill="#e8f3e2" stroke="${C}" stroke-width="5"/><circle cx="26" cy="336" r="12" fill="#5fbf6a" stroke="${C}" stroke-width="3"/><path d="M50 330 H180 M190 346 H280" stroke="#9fcf8f" stroke-width="4"/></g>`;
  }

  /* ---------- c43: videochamada (flutuante, centro 0,0; ~ 560 x 1000), rosto do amigo ----------
   * ids: -mala (opacity 0, a mala pronta atras dele), -rosto */
  function videochamada(o = {}) {
    const id = o.id || "video", cid = id + "-clip" + (n++);
    const r = rosto(o.rig || "amigo_svg", o.expr || "feliz");
    return `<g id="${id}"><rect x="-290" y="-510" width="580" height="1020" rx="70" fill="#2b2a31" stroke="${C}" stroke-width="10"/>
      <clipPath id="${cid}"><rect x="-256" y="-470" width="512" height="940" rx="44"/></clipPath><g clip-path="url(#${cid})">
      <rect x="-256" y="-470" width="512" height="940" fill="#d9cdb4"/><rect x="-256" y="-470" width="512" height="560" fill="#e8dcc0"/><rect x="60" y="-380" width="160" height="200" rx="6" fill="#9fd0ea" stroke="${C}" stroke-width="5"/><path d="M140 -380 V-180 M60 -280 H220" stroke="${C}" stroke-width="4"/>
      <g id="${id}-mala" opacity="0"><rect x="-240" y="80" width="190" height="250" rx="24" fill="#c25b4e" stroke="${C}" stroke-width="7"/><rect x="-180" y="40" width="70" height="50" rx="12" fill="none" stroke="${C}" stroke-width="10"/><path d="M-200 120 V300 M-90 120 V300" stroke="${esc("#c25b4e", -0.25)}" stroke-width="8"/>${T(-145, 230, "✈", 70, "#fff8e6")}</g>
      <g id="${id}-rosto"><g transform="translate(20 230) scale(1.05)">${r || `<circle r="140" fill="#F4A46A" stroke="${C}" stroke-width="8"/>`}</g></g>
      </g><rect x="-256" y="-470" width="512" height="90" fill="#000" opacity="0.35"/>${T(-220, -412, "Rafa · faculdade", 30, "#fff", "start")}${T(220, -412, "00:12", 28, "#fff", "end")}
      <rect x="150" y="250" width="90" height="140" rx="16" fill="#0b3df0" stroke="#fff" stroke-width="5"/>
      <circle cx="-80" cy="420" r="38" fill="#e2544f" stroke="${C}" stroke-width="5"/><circle cx="80" cy="420" r="38" fill="#4a4d57" stroke="${C}" stroke-width="5"/></g>`;
  }

  /* ---------- c44: taca de vinho (de mao, centro 0,0; ~ 90 x 200) e mala de rodinhas (chao em 362; ~ 220 x 360) ---------- */
  function tacaVinho(o = {}) {
    const id = o.id || "taca";
    return `<g id="${id}"><path d="M-44 -100 Q-50 -20 0 0 Q50 -20 44 -100 Z" fill="#fff" fill-opacity="0.55" stroke="${C}" stroke-width="5"/><path d="M-40 -60 Q-38 -14 0 -4 Q38 -14 40 -60 Z" fill="#8a1f3a"/><path d="M0 0 V80 M-34 84 H34" stroke="${C}" stroke-width="7" stroke-linecap="round"/><path d="M-28 -90 Q-32 -60 -22 -40" stroke="#fff" stroke-width="5" fill="none" opacity="0.8"/></g>`;
  }
  function mala(o = {}) {
    const id = o.id || "mala", cor = o.cor || "#c25b4e";
    return `<g id="${id}"><ellipse cx="110" cy="364" rx="110" ry="12" fill="#000" opacity="0.15"/><path d="M80 40 V-60 H140 V40" fill="none" stroke="${C}" stroke-width="14" stroke-linejoin="round"/><path d="M80 40 V-60 H140 V40" fill="none" stroke="#9aa0ab" stroke-width="7"/>
      <rect x="0" y="30" width="220" height="300" rx="26" fill="${cor}" stroke="${C}" stroke-width="8"/>${[55, 110, 165].map(x => `<path d="M${x} 50 V310" stroke="${esc(cor, -0.2)}" stroke-width="8"/>`).join("")}
      <circle cx="40" cy="344" r="16" fill="#2b2a31" stroke="${C}" stroke-width="5"/><circle cx="180" cy="344" r="16" fill="#2b2a31" stroke="${C}" stroke-width="5"/><rect x="130" y="80" width="70" height="44" rx="6" fill="#F5C542" stroke="${C}" stroke-width="4"/></g>`;
  }

  Object.assign(O, { chequeGigante, telaoNoticias, maosMultidao, portaRetrato, celularChamadas, envelope, contrato, chequePequeno, videochamada, tacaVinho, mala });
})();
