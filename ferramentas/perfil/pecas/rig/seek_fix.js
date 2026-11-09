/* Evita "flash" nos primeiros quadros do render (cada processo do render abria a cena num estado velho).
 * 1) tudo que a timeline poe no tempo 0 (tl.set e o "from" de tl.fromTo) ja e aplicado na hora,
 *    assim voltar ao tempo 0 nunca mostra o estado cru do CSS;
 * 2) Seguro(tl) devolve a timeline com seek/totalTime/time que sempre redesenham o quadro.
 * Uso: carregar logo depois do gsap; registrar window.__timelines["main"] = Seguro(tl).
 */
(function () {
  const TL = gsap.core.Timeline.prototype;
  const noZero = p => p === 0 || p === "0" || (typeof p === "number" && Math.abs(p) < 1e-6);
  const limpa = v => { const o = {}; for (const k in v) if (!/^(on[A-Z]|immediateRender|lazy|duration|ease|delay|repeat|yoyo|stagger)/.test(k)) o[k] = v[k]; return o; };
  const set0 = TL.set;
  TL.set = function (alvo, vars, pos) {
    if (noZero(pos)) { try { gsap.set(alvo, limpa(vars)); } catch (e) {} }
    return set0.apply(this, arguments);
  };
  const ft0 = TL.fromTo;
  TL.fromTo = function (alvo, de, para, pos) {
    if (noZero(pos)) { try { gsap.set(alvo, limpa(de)); } catch (e) {} }
    return ft0.apply(this, arguments);
  };
  /* 3) Tweens com onUpdate (contadores, borracha, textos) sao redesenhados a forca no tempo certo depois de cada salto:
   *    sem isso, um processo do render as vezes ficava com o valor de um quadro anterior (pisca x29/x30 na c02, borracha na c69). */
  const comUpdate = tl => tl.getChildren(true, true, false).filter(tw => tw.vars && typeof tw.vars.onUpdate === "function")
    .sort((a, b) => a.startTime() - b.startTime());
  const inicioGlobal = tw => { let s = tw.startTime(), p = tw.parent; while (p && p.parent) { s = p.startTime() + s / (p.timeScale() || 1); p = p.parent; } return s; };
  const reforca = (tl, t) => {
    comUpdate(tl).forEach(tw => {
      const local = t - inicioGlobal(tw);
      if (local < 0) return;  // ainda nao comecou: fica o estado de antes
      tw.render(Math.min(local, tw.totalDuration()), false, true);
      try { tw.vars.onUpdate.apply(tw, tw.vars.onUpdateParams || []); } catch (e) {}
    });
  };
  window.Seguro = function (tl) {
    const empurra = t => { t = Number(t) || 0; const d = tl.duration(); const vizinho = t > 0.002 ? t - 0.002 : Math.min(d, t + 0.002); tl.totalTime(vizinho, false); };
    const p = new Proxy(tl, {
      get(o, k) {
        if (k === "seek" || k === "totalTime" || k === "time") {
          return function (...a) {
            if (!a.length) return o[k]();
            empurra(a[0]); o[k](...a); reforca(o, o.time()); return p;
          };
        }
        const v = o[k];
        return typeof v === "function" ? v.bind(o) : v;
      }
    });
    return p;
  };
})();
