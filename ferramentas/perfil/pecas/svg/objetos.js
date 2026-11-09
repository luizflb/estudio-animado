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
