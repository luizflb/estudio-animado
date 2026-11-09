/* Personagens em SVG (definições). Cada um vira window.RIGS[nome] e anima com o Rig2 (mesmos gestos, andar, fala e expressões).
 * O personagem principal entra aqui como "principal_svg" na etapa /anim-personagem.
 * Campos: pele (clara | media | morena | escura | "#hex"), cabelo {estilo, cor}, olhos_cor, sobrancelha_cor,
 *   roupa {tipo: camiseta|blusa|social|terno|jaleco|vestido, cor, manga: curta|longa, gravata, cracha},
 *   calca {tipo: calca|saia|shorts, cor}, sapato {tipo: social|tenis|sapatilha, cor},
 *   extras {oculos: "sol"|"redondo", barba: "cheia"|"bigode"|"cavanhaque", barba_cor, fone, batom},
 *   cabeca_vetor: nome de uma cabeça vetorizada (cabeca_<nome>.js) para ficar idêntico a uma imagem. */
window.RIGS = window.RIGS || {};
window.RIGS["seguranca_svg"] = { tipo: "svg", pele: "morena", cabelo: { estilo: "raspado", cor: "#1f1a18" },
  roupa: { tipo: "terno", cor: "#26252c", gravata: "#141318" }, calca: { tipo: "calca", cor: "#26252c" }, sapato: { tipo: "social", cor: "#1b1a20" },
  extras: { oculos: "sol", fone: true } };
window.RIGS["mulher_svg"] = { tipo: "svg", pele: "clara", cabelo: { estilo: "chanel", cor: "#e8b04a" }, olhos_cor: "#3f6fa8",
  roupa: { tipo: "blusa", cor: "#ef5b8c" }, calca: { tipo: "saia", cor: "#2b2a31" }, sapato: { tipo: "sapatilha", cor: "#ef5b8c" }, extras: { batom: true } };
window.RIGS["senhor_svg"] = { tipo: "svg", pele: "media", cabelo: { estilo: "careca", cor: "#c9c9cf" }, sobrancelha_cor: "#9a9aa2",
  roupa: { tipo: "social", cor: "#f2f3f6", gravata: "#3b5fa8", cracha: true }, calca: { tipo: "calca", cor: "#4a4a55" }, sapato: { tipo: "social", cor: "#5a3a22" },
  extras: { barba: "cheia", barba_cor: "#c9c9cf", oculos: "redondo" } };
