/* Íconos SVG dibujados a mano, parecidos a los de la pantalla de la lavadora. */

const CAMISA = 'M8.3 3.5 4.6 5.6l1.4 3.1 1.5-.7V14.5h8.8V8l1.5.7 1.4-3.1-3.7-2.1c-.6 1.2-1.9 1.9-3.6 1.9s-3-.7-3.6-1.9Z';
const camisaEn = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="${CAMISA}"/>`;
// Ondas a la izquierda, base de los íconos de secado del recuadro inferior.
const OLAS_IZQ = '<path d="M2.6 13.6c1 .7 2 .7 3 0s2-.7 3 0M2.6 16.9c1 .7 2 .7 3 0s2-.7 3 0M2.6 20.2c1 .7 2 .7 3 0s2-.7 3 0"/>';

const ICONOS = {
  ai: '<path d="M7.5 20.5V17C5.4 15.8 4.3 13.8 4.3 11.4c0-4 3.1-7 7.1-7 3.5 0 6.2 2.3 6.8 5.5l1.6 3.1-1.7.5v2.4c0 1-.7 1.6-1.6 1.6h-1.8v3"/><text x="11.2" y="13.9" font-size="5.8" font-weight="800" text-anchor="middle" fill="currentColor" stroke="none" font-family="system-ui,sans-serif">AI</text>',
  faseLavado: camisaEn(1.6, -1.3, 0.86) + '<path d="M2.5 17.5c1.6 1.2 3.2 1.2 4.8 0s3.2-1.2 4.8 0 3.2 1.2 4.8 0 3.2-1.2 4.8 0M2.5 21c1.6 1.2 3.2 1.2 4.8 0s3.2-1.2 4.8 0 3.2 1.2 4.8 0 3.2-1.2 4.8 0"/>',
  faseCentrifugado: camisaEn(-1, 0, 0.92) + '<path d="M17.6 19.2a1.4 1.4 0 1 1 1.4-1.4 2.8 2.8 0 1 1-2.8-2.8 4.2 4.2 0 0 1 4.2 4.2 4.2 4.2 0 0 1-2.9 4"/>',
  faseSecado: camisaEn(-1, 0, 0.92) + '<path d="M16.5 13c1 .8 2 .8 3 0s2-.8 3 0M16.5 16.5c1 .8 2 .8 3 0s2-.8 3 0M16.5 20c1 .8 2 .8 3 0s2-.8 3 0"/>',
  secNormal: camisaEn(-1, 0, 0.92) + '<path d="M16.5 13c1 .8 2 .8 3 0s2-.8 3 0M16.5 16.5c1 .8 2 .8 3 0s2-.8 3 0M16.5 20c1 .8 2 .8 3 0s2-.8 3 0"/>',
  secPlancha: '<path d="M3 18h18v-3.2A5.3 5.3 0 0 0 15.7 9.5H9.4"/><path d="M3 18l2.2-5.7a5 5 0 0 1 4.2-2.8"/><path d="M9.4 9.5V6.5h7.8"/>',
  secBaja: camisaEn(4.5, .2, .74) + OLAS_IZQ + '<path d="M17.9 19.6v-6.8a1.6 1.6 0 0 0-3.2 0v6.8a2.7 2.7 0 1 0 3.2 0Z"/><path d="M16.3 15.4v4.6"/>',
  ecoE: camisaEn(4.5, .2, .74) + OLAS_IZQ + '<circle cx="16.4" cy="18" r="3.9"/><text x="16.4" y="19.9" font-size="5.6" font-weight="800" text-anchor="middle" fill="currentColor" stroke="none" font-family="system-ui,sans-serif">e</text>',
  ecoAgua: camisaEn(4.5, .2, .74) + OLAS_IZQ + '<path d="M16.4 13.2c1.9 2.4 3.1 4 3.1 5.6a3.1 3.1 0 0 1-6.2 0c0-1.6 1.2-3.2 3.1-5.6Z"/>',
  antiArrugas: camisaEn(3.4, 3.4, .8) + '<path d="M6.4 19a1.1 1.1 0 1 1 1.1-1.1 2.3 2.3 0 1 1-2.3-2.3 3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-2.4 3.3"/><path d="M18.6 1.8c.9.7.9 1.4 0 2.1s-.9 1.4 0 2.1M21.3 2.6c.7.6.7 1.2 0 1.8s-.7 1.2 0 1.8"/>',
  enjuague: '<path d="M3.6 9.5 5.5 20.2h13l1.9-10.7"/><path d="M4.4 14c1.3 1 2.6 1 3.9 0s2.6-1 3.9 0 2.6 1 3.9 0 2.4-.9 3.5-.3"/><path d="M17.6 2.6v5M15.1 5.1h5"/>',
  prelavado: '<path d="M4.5 7l2 12h11l2-12"/><path d="M12 7v6.5"/>',
  wifi: '<path d="M3 9.5a13 13 0 0 1 18 0M6 12.8a8.6 8.6 0 0 1 12 0M9 16a4.2 4.2 0 0 1 6 0"/><circle cx="12" cy="19.2" r="1" fill="currentColor"/>',
  puerta: '<circle cx="12" cy="12" r="8.6"/><path d="M5.9 5.9l12.2 12.2"/><circle cx="8.4" cy="12" r="1.9"/><path d="M10.3 12h7.2M15.5 12v2M17.5 12v1.6"/>',
  // Navegación y UI
  chat: '<path d="M4 5.5h16v10H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  filtros: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="12" r="3.5"/><path d="M9 12l1.8-1.8"/><path d="M15 9h3M15 12h3M15 15h3"/>',
  guia: '<path d="M5 4.5h10.5a2.5 2.5 0 0 1 2.5 2.5v12.5H7.5A2.5 2.5 0 0 1 5 17z"/><path d="M5 17a2.5 2.5 0 0 1 2.5-2.5H18M9 8.5h5"/>',
  enviar: '<path d="M4 12l16-7-6 16-3-6.5z"/><path d="M11 14.5 20 5"/>',
  ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  no: '<path d="M6 6l12 12M18 6 6 18"/>',
  alerta: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.2" r=".7" fill="currentColor"/>',
  info: '<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.5"/><circle cx="12" cy="8" r=".8" fill="currentColor"/>',
  libro: '<path d="M4 6c3-1.3 5.7-1.3 8 .5 2.3-1.8 5-1.8 8-.5v12.5c-3-1.3-5.7-1.3-8 .5-2.3-1.8-5-1.8-8-.5z"/><path d="M12 6.5V19"/>',
  buscar: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
  reiniciar: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/>',
  mano: '<path d="M8.5 13V6.5a1.3 1.3 0 0 1 2.6 0V12m0-5.8V5a1.3 1.3 0 0 1 2.6 0v7m0-5.5a1.3 1.3 0 0 1 2.6 0V13m0-4a1.3 1.3 0 0 1 2.6 0v5.5c0 3.5-2.6 6-6 6h-1c-2 0-3.4-.9-4.5-2.6L5.2 14a1.3 1.3 0 0 1 2.1-1.5l1.2 1.4"/>',
  flecha: '<path d="M9 5l7 7-7 7"/>',
  basura: '<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2c.1.9.8 1.6 1.7 1.6h5.8c.9 0 1.6-.7 1.7-1.6L17.5 7"/>',
  consejo: '<path d="M9.2 17.6h5.6M9.9 20.6h4.2"/><path d="M12 3.4a5.8 5.8 0 0 0-3.5 10.4c.6.5 1 1.2 1 2v.4h5v-.4c0-.8.4-1.5 1-2A5.8 5.8 0 0 0 12 3.4Z"/>',
  perilla: '<circle cx="12" cy="12.5" r="8"/><circle cx="12" cy="12.5" r="4.6"/><path d="M12 8v2.6M12 1.8v1.2M3 12.5h1.2M19.8 12.5H21M5.6 6.1l.9.9M18.4 6.1l-.9.9"/>',
  gaveta: '<rect x="3.5" y="3.5" width="17" height="13" rx="2"/><path d="M12.4 3.5v13M12.4 10h8.1"/><path d="M2.5 16.5h19v2.5a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M10 18.5h4"/>',
  llave: '<path d="M15 3.8a4.6 4.6 0 0 0-4.4 6L3.9 16.5a1.9 1.9 0 0 0 2.7 2.7l6.7-6.7a4.6 4.6 0 0 0 6-4.4l-2.8 2.8-2.6-.6-.6-2.6z"/>',
  tambor: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M4 7.5h16"/><circle cx="12" cy="14" r="4.3"/><circle cx="7.4" cy="5.3" r=".6" fill="currentColor"/>',
  perlas: '<circle cx="8" cy="9.5" r="2.7"/><circle cx="15.6" cy="8.3" r="2.2"/><circle cx="12.4" cy="15.6" r="3.1"/><circle cx="6.6" cy="17" r="1.5"/>'
};

function icono(nombre, clase = '') {
  const d = ICONOS[nombre];
  if (!d) return '';
  return `<svg class="ico ${clase}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

/* Símbolos de etiqueta de cuidado (norma ISO 3758). */
function simboloEtiqueta(s) {
  const X = '<path d="M4 4l16 16M20 4 4 20" stroke-width="1.7"/>';
  let d = '';
  if (s.t === 'lavado') {
    d = '<path d="M3 8l2.2 11h13.6L21 8"/><path d="M3 8c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0"/>';
    if (s.temp) d += `<text x="12" y="17" font-size="6.5" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="system-ui,sans-serif">${s.temp}</text>`;
    if (s.mano) d += '<path transform="translate(6.6 9.6) scale(.45)" d="M8.5 13V6.5a1.3 1.3 0 0 1 2.6 0V12m0-5.8V5a1.3 1.3 0 0 1 2.6 0v7m0-5.5a1.3 1.3 0 0 1 2.6 0V13m0-4a1.3 1.3 0 0 1 2.6 0v5.5c0 3.5-2.6 6-6 6h-1c-2 0-3.4-.9-4.5-2.6L5.2 14a1.3 1.3 0 0 1 2.1-1.5l1.2 1.4"/>';
    for (let i = 0; i < (s.barras || 0); i++) d += `<path d="M4.5 ${21.3 + i * 1.6}h15"/>`;
  } else if (s.t === 'blanqueo') {
    d = '<path d="M12 3.5 21.5 20h-19z"/>';
    if (s.oxigeno) d += '<path d="M10 11l-3 6M14 11l-3 6"/>';
  } else if (s.t === 'secadora') {
    d = '<rect x="3.5" y="3.5" width="17" height="17" rx="1"/><circle cx="12" cy="12" r="6"/>';
    if (s.puntos === 1) d += '<circle cx="12" cy="12" r="1.1" fill="currentColor"/>';
    if (s.puntos === 2) d += '<circle cx="9.8" cy="12" r="1.1" fill="currentColor"/><circle cx="14.2" cy="12" r="1.1" fill="currentColor"/>';
  } else if (s.t === 'natural') {
    d = '<rect x="3.5" y="3.5" width="17" height="17" rx="1"/>';
    if (s.forma === 'tender') d += '<path d="M5 5.5c4 4 10 4 14 0"/>';
    if (s.forma === 'plano') d += '<path d="M6.5 12h11"/>';
    if (s.forma === 'goteo') d += '<path d="M9 7v10M12 7v10M15 7v10"/>';
  } else if (s.t === 'plancha') {
    d = '<path d="M3 18h18v-3.2A5.3 5.3 0 0 0 15.7 9.5H9.4"/><path d="M3 18l2.2-5.7a5 5 0 0 1 4.2-2.8"/><path d="M9.4 9.5V6.5h7.8"/>';
    for (let i = 0; i < (s.puntos || 0); i++) d += `<circle cx="${(s.puntos === 1 ? 13 : s.puntos === 2 ? 11.5 : 10) + i * 3}" cy="14.5" r=".9" fill="currentColor"/>`;
  } else if (s.t === 'seco') {
    d = '<circle cx="12" cy="12" r="8.5"/>';
    if (s.letra) d += `<text x="12" y="15.3" font-size="9" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="system-ui,sans-serif">${s.letra}</text>`;
  }
  if (s.x) d += X;
  return `<svg class="ico etiqueta" viewBox="0 0 24 25" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

const ETIQUETAS = [
  { s: { t: 'lavado', temp: '95' }, nombre: 'Tina con 95', significa: 'Lavable hasta 95 °C.', maquina: 'Tu lavadora llega hasta 60 °C: usa Algodón a 60 °C. Para blancos muy sucios súmale Vapor o Pre-Lavado.' },
  { s: { t: 'lavado', temp: '60' }, nombre: 'Tina con 60', significa: 'Lavable hasta 60 °C.', maquina: 'Algodón o Algodón+ hasta 60 °C.' },
  { s: { t: 'lavado', temp: '40' }, nombre: 'Tina con 40', significa: 'Lavable hasta 40 °C.', maquina: 'Algodón o Mixtos hasta 40 °C.' },
  { s: { t: 'lavado', temp: '30' }, nombre: 'Tina con 30', significa: 'Lavable hasta 30 °C.', maquina: 'Cualquier programa a 30 °C o menos.' },
  { s: { t: 'lavado', temp: '40', barras: 1 }, nombre: 'Tina con una raya', significa: 'Lavado suave para sintéticos (manual: "Sintético").', maquina: 'Sintético o Mixtos, centrifugado medio (máx. 1000).', manual: 24 },
  { s: { t: 'lavado', temp: '30', barras: 2 }, nombre: 'Tina con dos rayas', significa: 'Lavado muy suave, delicados (manual: "Lavado especial delicado").', maquina: 'Delicado o Lana, centrifugado máx. 800.', manual: 24 },
  { s: { t: 'lavado', mano: true }, nombre: 'Tina con mano', significa: 'Lavar únicamente a mano (manual: lana, seda).', maquina: 'Programa Lavado a Mano/Lana, Fría o 30 °C.', manual: 24 },
  { s: { t: 'lavado', x: true }, nombre: 'Tina tachada', significa: 'No lavar con agua.', maquina: 'No la metas en la lavadora. Tintorería.', manual: 25 },
  { s: { t: 'blanqueo' }, nombre: 'Triángulo vacío', significa: 'Admite cualquier blanqueador, incluso cloro.', maquina: 'Cloro diluido en el compartimento principal.' },
  { s: { t: 'blanqueo', oxigeno: true }, nombre: 'Triángulo con rayas', significa: 'Solo blanqueador sin cloro (oxígeno activo).', maquina: 'Nada de cloro; quitamanchas de oxígeno sí.' },
  { s: { t: 'blanqueo', x: true }, nombre: 'Triángulo tachado', significa: 'No usar ningún blanqueador.', maquina: 'Ni cloro ni quitamanchas blanqueadores.' },
  { s: { t: 'secadora', puntos: 2 }, nombre: 'Cuadrado con círculo y 2 puntos', significa: 'Secadora a temperatura normal.', maquina: 'Secado Normal. Para ahorrar, EcoHybrid ⓔ (mantén Secado 3 s).' },
  { s: { t: 'secadora', puntos: 1 }, nombre: 'Cuadrado con círculo y 1 punto', significa: 'Secadora a baja temperatura.', maquina: 'Secado Temperatura baja (máx. 3,5 kg).' },
  { s: { t: 'secadora', x: true }, nombre: 'Secadora tachada', significa: 'No usar secadora.', maquina: 'No uses Secado: tiéndela.' },
  { s: { t: 'natural', forma: 'tender' }, nombre: 'Cuadrado con curva arriba', significa: 'Secar colgada.', maquina: 'Tender en cuerda o gancho.' },
  { s: { t: 'natural', forma: 'plano' }, nombre: 'Cuadrado con línea horizontal', significa: 'Secar extendida en horizontal.', maquina: 'Típico de lana: sobre una toalla, sin colgar.' },
  { s: { t: 'natural', forma: 'goteo' }, nombre: 'Cuadrado con 3 rayas verticales', significa: 'Colgar mojada, sin escurrir.', maquina: 'Centrifugado No o 400.' },
  { s: { t: 'plancha', puntos: 1 }, nombre: 'Plancha con 1 punto', significa: 'Plancha baja (máx. ~110 °C).', maquina: 'Sintéticos, seda.' },
  { s: { t: 'plancha', puntos: 2 }, nombre: 'Plancha con 2 puntos', significa: 'Plancha media (máx. ~150 °C).', maquina: 'Lana, mezclas.' },
  { s: { t: 'plancha', puntos: 3 }, nombre: 'Plancha con 3 puntos', significa: 'Plancha alta (máx. ~200 °C).', maquina: 'Algodón, lino.' },
  { s: { t: 'plancha', x: true }, nombre: 'Plancha tachada', significa: 'No planchar.', maquina: '' },
  { s: { t: 'seco', letra: 'P' }, nombre: 'Círculo con letra', significa: 'Limpieza en seco profesional.', maquina: 'Tintorería. Si no hay tina tachada, a veces también admite lavado suave.' },
  { s: { t: 'seco', x: true }, nombre: 'Círculo tachado', significa: 'No limpiar en seco.', maquina: '' }
];
