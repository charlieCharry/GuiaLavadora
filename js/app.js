/* Interfaz: Asistente (chat), Filtros, Panel virtual y Guía. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const conIconos = html => html.replace(/\{i:(\w+)\}/g, (_, n) => icono(n, 'inline'));
  const pag = p => (p && p !== true ? `<span class="fuente m">Manual p. ${p}</span>` : p === true ? '<span class="fuente m">Manual</span>' : '');
  const general = '<span class="fuente g">General</span>';
  const duda = '<span class="fuente d">Por confirmar</span>';
  const { fmtT, fmtR, fmtKg } = Motor;
  const registro = []; // tandas mostradas, para "Ver en el panel"

  // ================= Navegación =================
  const TITULOS = { chat: 'Asistente', filtros: 'Filtros', panel: 'Panel virtual', guia: 'Guía' };
  function irA(tab) {
    $$('.tab').forEach(s => s.classList.toggle('activa', s.id === 'tab-' + tab));
    $$('.tabbar button').forEach(b => b.setAttribute('aria-current', b.dataset.tab === tab ? 'page' : 'false'));
    $('#titulo').textContent = TITULOS[tab];
    $('#btn-limpiar').hidden = tab !== 'chat';
    if (tab === 'chat') desplazarChat();
  }
  $$('.tabbar button').forEach(b => {
    b.innerHTML = `<span class="tab-ico">${icono(b.dataset.icono)}</span><span>${b.textContent}</span>`;
    b.addEventListener('click', () => irA(b.dataset.tab));
  });

  // ================= Tarjeta de resultado =================
  function htmlResultado(res) {
    let h = '';
    res.avisos.forEach(a => { h += `<div class="nota ${a.tipo === 'peligro' ? 'peligro' : a.tipo === 'info' ? 'info' : 'aviso'}">${icono(a.tipo === 'info' ? 'info' : 'alerta')}<p>${esc(a.txt)} ${a.manual ? pag(a.manual) : a.tipo === 'info' ? general : ''}</p></div>`; });
    res.noLavar.forEach(p => { h += `<div class="nota peligro">${icono('no')}<p><b>${esc(p.nombre)}:</b> ${esc(p.desc)} ${general}</p></div>`; });
    res.tandas.forEach(t => { h += htmlTanda(t); });
    return h;
  }

  function htmlVeredictos(veredictos) {
    return `<ul class="veredictos">${veredictos.map(v => `<li class="${v.ok ? 'si' : 'no'}"><span class="marca-v">${icono(v.ok ? 'ok' : 'no')}</span><div><b>${esc(v.nombre)}</b><span class="v-modo">${v.ok ? (v.modo ? 'Secadora · ' + SECADO[v.modo].nombre : 'Secadora') : 'Tender'}</span><small>${esc(v.txt)} ${v.manual ? pag(v.manual) : ''}</small></div></li>`).join('')}</ul>`;
  }

  function htmlSecado(s) {
    let plan = '';
    if (!s.pedido) plan = '<p class="sutil">Elegiste no secar en la máquina.</p>';
    else if (s.modo) {
      const ic = SECADO[s.modo].icono ? icono(SECADO[s.modo].icono, 'inline') : '';
      plan = `<div class="secado-plan">${s.quedan ? `<p>${esc(s.quedan)}</p>` : ''}<p>Sécalas en ${ic}<b>${SECADO[s.modo].nombre}</b> ${s.via === 'opcion' ? 'en el mismo ciclo' : 'después del lavado, con Sólo Secado'}. Deja el grifo abierto: la máquina usa agua para limpiar el filtro de pelusa mientras seca. ${pag(52)}</p></div>`;
    }
    const extras = [
      ...s.avisos.map(x => `<div class="nota aviso">${icono('alerta')}<p>${esc(x)} ${pag(33)}</p></div>`),
      ...(s.pedido ? s.notas.map(x => `<div class="nota info">${icono('info')}<p>${esc(x)} ${general}</p></div>`) : [])
    ].join('');
    return `<details class="bloque" open><summary>Secado: qué va a la máquina</summary>${htmlVeredictos(s.veredictos)}${plan}${extras}</details>`;
  }

  function htmlTanda(t) {
    const p = PROGRAMAS[t.prog];
    const reg = registro.push(t) - 1;
    const s = t.secado;
    let secTxt = '<strong>No</strong><small>La tiendes</small>';
    if (s.pedido && s.modo) {
      const ic = SECADO[s.modo].icono ? icono(SECADO[s.modo].icono, 'inline') : '';
      secTxt = `<strong>${ic}${SECADO[s.modo].nombre}</strong><small>${s.via === 'opcion' ? 'Mismo ciclo' : 'Después'}</small>`;
    } else if (s.pedido) secTxt = '<strong>No</strong><small>Ninguna va</small>';

    const ops = [];
    if (t.op.intensivo) ops.push('Intensivo');
    if (t.op.prelavado) ops.push('Pre-Lavado');
    if (t.op.enjuague) ops.push('Enjuague+');

    const notas = [...t.avisos.map(a => ({ ...a, cls: 'aviso' })), ...t.notas.map(n => ({ ...n, cls: 'info' }))];
    const alts = [...t.alternativas, ...(s.alternativa ? [s.alternativa] : []), ...(s.eco ? [s.eco] : [])];
    const pr = t.productos;

    return `<article class="tanda">
      <header class="tanda-cab">
        ${t.total > 1 ? `<span class="tanda-num">Carga ${t.numero} de ${t.total}</span>` : ''}
        <h3>${esc(t.nombres.join(', '))}</h3>
        <div class="tanda-meta">${t.colorTxt ? `<span>${esc(t.colorTxt)}</span>` : ''}${t.kg !== null ? `<span>≈ ${fmtKg(t.kg)}</span>` : ''}</div>
      </header>
      <div class="ajustes">
        <div class="ajuste prog"><small>Programa</small><strong>${p.nombre}</strong><small>${p.minutos ? p.minutos + ' min' : 'máx. ' + p.cargaMax + ' kg'}</small></div>
        <div class="ajuste"><small>Temperatura</small><strong>${t.temp ? fmtT(t.temp) : '—'}</strong></div>
        <div class="ajuste"><small>Centrifugado</small><strong>${t.rpm === 'No' ? 'No' : t.rpm}</strong><small>${t.rpm === 'No' ? '' : 'rpm'}</small></div>
        <div class="ajuste"><small>Secado</small>${secTxt}</div>
      </div>
      <div class="opciones">${ops.length ? ops.map(o => `<span class="chip-op">${icono('ok', 'inline')}${o}</span>`).join('') : '<span class="sin-op">Sin opciones extra</span>'}</div>
      <div class="productos">
        <div class="prod"><span class="prod-n">Detergente</span><p>${esc(cap(pr.tipo))}. ${esc(pr.dosis)}</p></div>
        <div class="prod ${pr.suavizante.ok ? 'si' : 'no'}"><span class="prod-n">Suavizante</span><p><b>${pr.suavizante.ok ? 'Sí' : 'No'}.</b> ${esc(pr.suavizante.txt.join(' '))}</p></div>
        <div class="prod ${pr.cloro.ok ? 'si' : 'no'}"><span class="prod-n">Cloro</span><p>${esc(pr.cloro.txt)}</p></div>
      </div>
      <details class="bloque" open><summary>Paso a paso en la lavadora ${pag(20)}</summary>
        <ol class="pasos">${t.pasos.map(x => `<li>${conIconos(x)}</li>`).join('')}</ol>
      </details>
      ${htmlSecado(s)}
      ${t.prep.length ? `<details class="bloque" ${t.prep.length <= 3 ? 'open' : ''}><summary>Antes de lavar ${general}</summary><ul class="lista">${t.prep.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}
      ${notas.length ? `<div class="en-cuenta"><h4>Ten en cuenta</h4><ul>${notas.map(n => `<li class="${n.cls}">${icono(n.cls === 'aviso' ? 'alerta' : 'info')}<p>${esc(n.txt)} ${n.manual ? pag(n.manual) : general}</p></li>`).join('')}</ul></div>` : ''}
      ${alts.length ? `<div class="alternativas">${alts.map(a => `<p>${icono('flecha', 'inline')}${esc(a)}</p>`).join('')}</div>` : ''}
      <footer class="tanda-pie">
        <button class="btn sec" data-ver-panel="${reg}">${icono('panel')} Ver cómo queda el panel</button>
      </footer>
    </article>`;
  }
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-ver-panel]');
    if (!b) return;
    Panel.cargarTanda(registro[+b.dataset.verPanel]);
    irA('panel');
  });

  // ================= Asistente (chat) =================
  const log = $('#chat-log');
  const chipsEl = $('#chat-chips');
  let ctx = Motor.nuevoContexto();
  let esperando = null;

  function desplazarChat() { requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; }); }
  function burbuja(html, quien) {
    const d = document.createElement('div');
    d.className = 'msg ' + quien;
    d.innerHTML = html;
    log.appendChild(d);
    desplazarChat();
    return d;
  }
  function ponerChips(lista) {
    chipsEl.innerHTML = '';
    lista.forEach(c => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.textContent = c.label;
      b.addEventListener('click', () => { c.accion ? c.accion() : enviar(c.texto || c.label); });
      chipsEl.appendChild(b);
    });
  }

  const PREGUNTAS = {
    prendas: { txt: '¿Qué vas a lavar? Escríbelo como le hablarías a alguien, por ejemplo: <i>"4 toallas blancas muy sucias y quiero secarlas"</i>.', chips: ['Toallas', 'Sábanas', 'Jeans', 'Camisetas', 'Ropa del diario', 'Ropa deportiva', 'Brasieres', 'Edredón', 'Chaqueta', 'Tapete de baño'].map(l => ({ label: l })) },
    color: { txt: '¿De qué color es la ropa? Si hay varios, escríbelos (p. ej. "blanca y pasteles").', chips: [['Blanca', 'blanco'], ['Clara o pastel', 'claro'], ['De color', 'color'], ['Oscura', 'oscuro'], ['Blanca y clara', 'blanco+claro'], ['Mezclada', 'mezcla']] },
    suciedad: { txt: '¿Qué tan sucia está?', chips: [['Poco sucia', 'poca'], ['Normal', 'normal'], ['Muy sucia o con manchas', 'mucha']] },
    carga: { txt: '¿Cuánta ropa es? (O dime cuántas prendas, p. ej. "3 jeans y 5 camisetas")', chips: [['Poquita', 'pequena'], ['Medio tambor', 'media'], ['Tambor casi lleno', 'grande']] },
    secar: { txt: '¿La secas en la lavadora?', chips: [['Sí, secar', 'si'], ['No, la tiendo', 'no']] }
  };

  function aplicarSlot(slot, val) {
    if (slot === 'color') ctx.colores = val === 'mezcla' ? new Set(['blanco', 'color', 'oscuro']) : new Set(val.split('+'));
    if (slot === 'suciedad') ctx.suciedad = val;
    if (slot === 'carga') ctx.carga = val;
    if (slot === 'secar') ctx.secar = val === 'si';
  }

  function textoPreguntaSecar() {
    const v = Motor.prendasValidas(ctx).map(it => Motor.veredictoSecado(it.id));
    const no = v.filter(x => !x.ok).map(x => x.nombre.toLowerCase());
    if (!no.length) return '¿La secas en la lavadora? Todas estas prendas pueden ir a la secadora.';
    if (no.length === v.length) return '¿La secas en la lavadora?';
    return `¿La secas en la lavadora? Ojo: ${no.join(', ')} no va${no.length > 1 ? 'n' : ''} a la secadora; si dices que sí, te indico cuándo sacarl${no.length > 1 ? 'as' : 'o'} y cómo secar el resto.`;
  }

  function preguntar(f) {
    if (f && f.slot === 'variante') {
      esperando = { slot: 'variante', prenda: f.prenda };
      const p = Motor.PRENDA[f.prenda.id];
      burbuja(`<p>${p.pregunta}</p>`, 'bot');
      ponerChips(p.variantes.map(([id, label]) => ({
        label, accion: () => {
          burbuja(esc(label), 'yo');
          f.prenda.id = id;
          esperando = null;
          seguir();
        }
      })));
      return;
    }
    esperando = { slot: f };
    const q = PREGUNTAS[f];
    burbuja(`<p>${f === 'secar' ? esc(textoPreguntaSecar()) : q.txt}</p>`, 'bot');
    ponerChips(q.chips.map(c => Array.isArray(c) ? {
      label: c[0], accion: () => { burbuja(esc(c[0]), 'yo'); aplicarSlot(f, c[1]); esperando = null; seguir(); }
    } : c));
  }

  function seguir() {
    const f = Motor.faltante(ctx);
    if (f) return preguntar(f);
    esperando = null;
    const res = Motor.recomendar(ctx);
    const resumen = [];
    if (ctx.colores.size) resumen.push('ropa ' + [...ctx.colores].map(c => Motor.NOMBRE_COLOR[c]).join(' y '));
    if (ctx.suciedad) resumen.push({ poca: 'poco sucia', normal: 'suciedad normal', mucha: 'muy sucia' }[ctx.suciedad]);
    if (ctx.carga) resumen.push('carga ' + Motor.NOMBRE_CARGA[ctx.carga]);
    if (ctx.secar !== null) resumen.push(ctx.secar ? 'secar en la máquina' : 'sin secadora');
    burbuja(`<p>Listo${resumen.length ? ` (${esc(resumen.join(', '))})` : ''}. Así configuras la lavadora:</p>${htmlResultado(res)}`, 'bot ancho');
    const chips = [{ label: 'Nueva consulta', accion: () => { ctx = Motor.nuevoContexto(); burbuja('Nueva consulta', 'yo'); preguntar('prendas'); } }];
    if (res.colores.hayMezcla && res.colores.juntas) chips.push({ label: 'Mejor en cargas separadas', accion: () => { burbuja('Mejor en cargas separadas', 'yo'); ctx.flags.add('separarColores'); seguir(); } });
    if (res.colores.separadoAMano) chips.push({ label: 'Juntarlas en una carga', accion: () => { burbuja('Juntarlas en una carga', 'yo'); ctx.flags.delete('separarColores'); seguir(); } });
    chips.push(
      { label: ctx.secar ? 'Mejor sin secar' : 'Quiero secarla', accion: () => { burbuja(ctx.secar ? 'Mejor sin secar' : 'Quiero secarla', 'yo'); ctx.secar = !ctx.secar; seguir(); } },
      { label: 'Cambiar color', accion: () => preguntar('color') },
      { label: 'Cambiar suciedad', accion: () => preguntar('suciedad') },
      { label: 'Cambiar cantidad', accion: () => preguntar('carga') }
    );
    ponerChips(chips);
  }

  function responderGuia(resultados) {
    let h = '<p>Esto dice la guía:</p>';
    resultados.forEach(e => { h += `<div class="guia-item en-chat">${htmlGuia(e.tipo, e.ref)}</div>`; });
    burbuja(h, 'bot ancho');
    ponerChips([{ label: 'Abrir la guía', accion: () => irA('guia') }, { label: '¿Qué voy a lavar?', accion: () => preguntar('prendas') }]);
  }

  // Respuestas directas a preguntas como "¿se pueden secar las toallas?" o "¿puedo mezclar blanco con pasteles?"
  function respuestasDirectas(r, c) {
    const ids = Motor.prendasValidas(c).map(p => p.id);
    const out = [];
    if (r.flags.has('preguntaSecado') && ids.length) {
      out.push(`<p><b>¿Van a la secadora?</b></p>${htmlVeredictos(ids.map(id => Motor.veredictoSecado(id)))}`);
    }
    if (r.pregunta && (r.flags.has('prodSuavizante') || r.flags.has('prodCloro')) && ids.length) {
      const filas = Motor.respuestaProducto(ids).map(x => `<li><b>${esc(x.nombre)}</b>${r.flags.has('prodSuavizante') ? `<span class="${x.suavizante.ok ? 'si' : 'no'}">Suavizante: ${x.suavizante.ok ? 'sí' : 'no'}. ${esc(x.suavizante.txt)}</span>` : ''}${r.flags.has('prodCloro') ? `<span class="${x.cloro.ok ? 'si' : 'no'}">Cloro: ${x.cloro.ok ? 'sí' : 'no'}. ${esc(x.cloro.txt)}</span>` : ''}</li>`).join('');
      out.push(`<p><b>Productos</b> ${general}</p><ul class="productos-resp">${filas}</ul>`);
    }
    if (r.flags.has('preguntaMezcla')) {
      const m = Motor.respuestaMezcla(c);
      const partes = m.pares.map(x => `<li class="${x.ok ? 'si' : 'no'}">${icono(x.ok ? 'ok' : 'no', 'inline')}${esc(x.txt)}</li>`);
      const grupos = Motor.recomendar({ ...c, colores: new Set(['color']), secar: false }).tandas;
      if (grupos.length > 1) partes.push(`<li class="no">${icono('no', 'inline')}Por tipo de prenda, mejor en cargas aparte: ${esc(grupos.map(t => t.nombres.join(' + ')).join(' · '))} (pelusa, temperatura o fuerza del lavado).</li>`);
      else if (ids.length > 1) partes.push(`<li class="si">${icono('ok', 'inline')}Por tipo de prenda, pueden ir juntas en la misma carga.</li>`);
      if (partes.length) out.push(`<p><b>¿Juntas o por separado?</b> ${general}</p><ul class="mezcla-resp">${partes.join('')}</ul><p class="sutil">Prueba rápida: moja una esquina escondida y presiónala con un paño blanco; si mancha, esa prenda va aparte.</p>`);
    }
    return out;
  }

  const PIDE_CONFIG = /\b(lav|ciclo|programa|temperatura|rpm|centrifug|configur|como (lo|la|las|los) )/;

  function enviar(texto) {
    texto = texto.trim();
    if (!texto) return;
    burbuja(esc(texto), 'yo');
    chipsEl.innerHTML = '';

    // ¿Es la respuesta a lo que pregunté?
    if (esperando && esperando.slot !== 'variante' && esperando.slot !== 'prendas') {
      const val = Motor.leerRespuesta(esperando.slot, texto);
      const r = Motor.leer(texto);
      if (val && !r.prendas.length) {
        if (esperando.slot === 'color' && r.colores.size > 1) ctx.colores = r.colores; else aplicarSlot(esperando.slot, val);
        Motor.fusionar(ctx, { ...r, prendas: [], colores: new Set() });
        return setTimeout(seguir, 120);
      }
    }
    if (esperando && esperando.slot === 'variante') {
      const p = Motor.PRENDA[esperando.prenda.id];
      const n = Motor.norm(texto);
      const v = p.variantes.find(([id, label]) => Motor.norm(label).split(/[ /]+/).some(w => w.length > 3 && n.includes(w)));
      if (v) { esperando.prenda.id = v[0]; esperando = null; return setTimeout(seguir, 120); }
    }

    const r = Motor.leer(texto);
    const g = Motor.buscarGuia(texto);
    // Solo pregunta (¿se secan?, ¿suavizante?) sin pedir configuración: respondo sobre esas prendas y ofrezco seguir.
    const deLoPreguntado = Motor.fusionar(Motor.nuevoContexto(), r);
    const directasSolas = r.prendas.length ? respuestasDirectas(r, deLoPreguntado) : [];
    const sinDatosDeLavado = !r.colores.size && !r.suciedad && !r.carga && !r.kg && r.secar === null;
    if (directasSolas.length && sinDatosDeLavado && !r.flags.has('preguntaMezcla') && !PIDE_CONFIG.test(r.texto)) {
      const mismas = ctx.prendas.length && r.prendas.every(p => ctx.prendas.some(q => q.id === p.id));
      if (!mismas) ctx = deLoPreguntado;
      setTimeout(() => burbuja(directasSolas.join(''), 'bot ancho'), 80);
      return setTimeout(() => ponerChips([
        { label: mismas ? 'Volver a mi lavado' : 'Configurar el lavado', accion: () => { burbuja(mismas ? 'Volver a mi lavado' : 'Configurar el lavado', 'yo'); seguir(); } },
        { label: 'Otra consulta', accion: () => { ctx = Motor.nuevoContexto(); preguntar('prendas'); } }
      ]), 140);
    }
    // Mismas prendas (o "ropa" en general) = sigue la misma consulta: actualiza sin perder lo ya dicho.
    const refina = ctx.prendas.length && r.prendas.length &&
      r.prendas.every(p => ctx.prendas.some(q => q.id === p.id) || Motor.PRENDA[p.id].generico);
    if (refina) {
      r.prendas.forEach(p => { const q = ctx.prendas.find(x => x.id === p.id); if (q && p.cant) q.cant = p.cant; });
      Motor.fusionar(ctx, { ...r, prendas: [] });
      const directas = respuestasDirectas(r, ctx);
      if (directas.length) setTimeout(() => burbuja(directas.join(''), 'bot ancho'), 60);
      return setTimeout(seguir, 150);
    }
    const hayModificadores = r.colores.size || r.suciedad || r.carga || r.secar !== null || r.kg || r.flags.size;

    if (!r.prendas.length && (g.mejor >= 10 || (g.pregunta && g.mejor >= 2))) return setTimeout(() => responderGuia(g.resultados), 120);
    if (r.prendas.length) {
      const nuevo = Motor.fusionar(Motor.nuevoContexto(), r);
      const directas = respuestasDirectas(r, nuevo);
      ctx = nuevo;
      if (g.mejor >= 10) setTimeout(() => responderGuia(g.resultados.slice(0, 1)), 60);
      if (directas.length) setTimeout(() => burbuja(directas.join(''), 'bot ancho'), 80);
      return setTimeout(seguir, 150);
    }
    if (hayModificadores && ctx.prendas.length) {
      Motor.fusionar(ctx, r);
      const directas = respuestasDirectas(r, ctx);
      if (directas.length) setTimeout(() => burbuja(directas.join(''), 'bot ancho'), 60);
      return setTimeout(seguir, 150);
    }
    if (r.flags.has('preguntaMezcla') && r.colores.size > 1) {
      const c = Motor.fusionar(Motor.nuevoContexto(), r);
      return setTimeout(() => { burbuja(respuestasDirectas(r, c).join(''), 'bot ancho'); preguntar('prendas'); }, 120);
    }
    if (r.peligro.length) {
      Motor.fusionar(ctx, r);
      return setTimeout(() => burbuja(`<div class="nota peligro">${icono('alerta')}<p>El manual prohíbe lavar o secar en la máquina prendas con ${esc(r.peligro.join(', '))}: riesgo de incendio o explosión. ${pag(6)}</p></div>`, 'bot'), 120);
    }
    setTimeout(() => {
      burbuja('<p>No reconocí qué prenda es. Prueba con palabras como <i>toallas, sábanas, jeans, camisetas, brasieres, chaqueta, edredón, tapete</i>… o pregúntame por un botón, un ícono o un error (p. ej. <i>"¿qué es el candado?"</i>, <i>"error UE"</i>).</p>', 'bot');
      preguntar('prendas');
    }, 120);
  }

  $('#chat-form').addEventListener('submit', e => {
    e.preventDefault();
    const inp = $('#chat-input');
    enviar(inp.value);
    inp.value = '';
  });

  function saludo() {
    burbuja('<p>¡Hola! Soy la guía de tu lavasecadora LG (14 kg lavado / 8 kg secado). Cuéntame qué vas a lavar y te digo cómo configurarla: programa, temperatura, centrifugado, secado, opciones y productos.</p><p class="sutil">También respondo si una prenda va a la secadora, qué colores se pueden mezclar, o qué es un botón, un ícono o un error. Todo funciona sin internet.</p>', 'bot');
    ponerChips([
      { label: '4 toallas blancas muy sucias, y secarlas' },
      { label: 'Blanca y pasteles, ¿juntas o separadas?' },
      { label: '¿Las toallas se pueden secar?' },
      { label: 'Sábanas blancas de 500 hilos' },
      { label: '¿Qué es el candado?' },
      { label: 'Error UE' }
    ]);
  }
  // Limpia la conversación: con el botón, o al volver a la app después de un rato.
  function limpiarChat() {
    log.innerHTML = '';
    ctx = Motor.nuevoContexto();
    esperando = null;
    saludo();
  }
  $('#btn-limpiar').addEventListener('click', limpiarChat);
  const REINICIO_MS = 10 * 60 * 1000;
  let ocultaDesde = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { ocultaDesde = Date.now(); return; }
    if (ocultaDesde && Date.now() - ocultaDesde > REINICIO_MS) { limpiarChat(); irA('chat'); }
    ocultaDesde = 0;
  });
  window.addEventListener('pageshow', e => { if (e.persisted) { limpiarChat(); irA('chat'); } });
  saludo();

  // ================= Filtros =================
  const F = { prendas: new Set(), colores: new Set(['color']), suciedad: 'normal', carga: 'media', secar: false, prisa: false, alergia: false, planchar: false, separarColores: false };
  function construirFiltros() {
    const lista = PRENDAS.filter(p => !p.variantes);
    $('#f-prendas').innerHTML = lista.map(p => `<button type="button" class="chip-prenda" data-id="${p.id}" aria-pressed="false"><span class="emo">${p.emoji}</span>${esc(p.nombre)}</button>`).join('');
    $$('#f-prendas .chip-prenda').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.id;
      F.prendas.has(id) ? F.prendas.delete(id) : F.prendas.add(id);
      b.setAttribute('aria-pressed', F.prendas.has(id));
      actualizarFiltros();
    }));
    $$('#tab-filtros .seg').forEach(seg => {
      const campo = seg.dataset.campo;
      const multiple = seg.classList.contains('multi');
      const marcar = () => $$('button', seg).forEach(x => x.setAttribute('aria-pressed', multiple ? F[campo].has(x.dataset.val) : String(F[campo]) === x.dataset.val));
      $$('button', seg).forEach(b => b.addEventListener('click', () => {
        const v = b.dataset.val;
        if (multiple) {
          if (F[campo].has(v) && F[campo].size > 1) F[campo].delete(v); else F[campo].add(v);
        } else F[campo] = v === 'true' ? true : v === 'false' ? false : v;
        marcar();
        actualizarFiltros();
      }));
      marcar();
    });
    $$('#tab-filtros input[type=checkbox]').forEach(c => c.addEventListener('change', () => { F[c.name] = c.checked; actualizarFiltros(); }));
    $('#f-buscar').addEventListener('input', e => {
      const q = Motor.norm(e.target.value);
      $$('#f-prendas .chip-prenda').forEach(b => {
        const p = Motor.PRENDA[b.dataset.id];
        b.hidden = q && !Motor.norm(p.nombre + ' ' + p.claves.join(' ')).includes(q);
      });
    });
    $('#f-limpiar').addEventListener('click', () => {
      F.prendas.clear();
      $$('#f-prendas .chip-prenda').forEach(b => b.setAttribute('aria-pressed', 'false'));
      actualizarFiltros();
    });
    actualizarFiltros();
  }
  function actualizarFiltros() {
    const n = F.prendas.size;
    $('#f-cuenta').textContent = n ? `${n} seleccionada${n > 1 ? 's' : ''}` : 'Ninguna seleccionada';
    const out = $('#f-resultado');
    if (!n) { out.innerHTML = '<p class="vacio">Elige una o varias prendas para ver la configuración.</p>'; return; }
    const c = Motor.nuevoContexto();
    c.prendas = [...F.prendas].map((id, i) => ({ id, cant: null, pos: i }));
    c.colores = new Set(F.colores);
    c.suciedad = F.suciedad;
    c.carga = F.carga;
    c.secar = F.secar;
    ['prisa', 'alergia', 'planchar', 'separarColores'].forEach(k => F[k] && c.flags.add(k));
    out.innerHTML = htmlResultado(Motor.recomendar(c));
  }

  // ================= Guía =================
  function htmlGuia(tipo, x) {
    switch (tipo) {
      case 'boton': return `
        <h4>${esc(x.nombre)} ${pag(x.pag)}</h4>
        <p><b>Toque:</b> ${esc(x.toque)}</p>
        ${x.mantener ? `<p class="secreto"><b>Mantener 3 s:</b> ${esc(x.mantener)}</p>` : ''}
        ${x.combo ? `<p class="secreto"><b>Combinación:</b> ${esc(x.combo)}</p>` : ''}
        ${x.contextos ? `<div class="contextos">${x.contextos.map(([c, d]) => `<div><b>${esc(c)}:</b> ${esc(d)}</div>`).join('')}</div>` : ''}
        ${x.disponible ? `<p class="sutil">Disponible en: ${esc(x.disponible)}</p>` : ''}
        ${x.notas ? `<ul class="lista">${x.notas.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}`;
      case 'icono': return `
        <div class="fila-ico"><span class="ico-pantalla">${icono(x.id)}</span><div><h4>${esc(x.nombre)} ${pag(x.pag)}</h4><p>${esc(x.desc)}</p>${x.duda ? `<p class="sutil">${esc(x.duda)} ${duda}</p>` : ''}</div></div>`;
      case 'mensaje': return `
        <div class="fila-ico"><span class="lcd-cod">${esc(x.cod)}</span><div><h4>${esc(x.nombre)} ${pag(x.pag)}</h4><p>${esc(x.desc)}</p>
        ${x.pasos ? `<ul class="lista">${x.pasos.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
        ${x.tipo === 'servicio' ? '<p class="etq servicio">Requiere servicio técnico</p>' : x.tipo === 'usuario' ? '<p class="etq usuario">Lo puedes resolver tú</p>' : ''}
        ${x.alias ? `<p class="sutil">También: ${x.alias.join(', ')}</p>` : ''}</div></div>`;
      case 'programa': {
        const t = x.temp ? `${fmtT(x.temp.def)} (${x.temp.disp.length > 1 ? `${fmtT(x.temp.disp[0])} a ${fmtT(x.temp.disp[x.temp.disp.length - 1])}` : 'fija'})` : '—';
        const r = x.rpm ? `${x.rpm.def === '-' ? 'ninguno' : x.rpm.def} (${x.rpm.disp.join(', ')})` : '—';
        const o = x.op;
        const ck = v => v === 'auto' ? 'incluido' : v ? icono('ok', 'inline si') : icono('no', 'inline no');
        return `<h4>${esc(x.nombre)} ${x.vapor ? '<span class="etq">Vapor</span>' : ''} ${pag(x.pag)}</h4>
          <p>${esc(x.desc)}</p>
          <dl class="datos"><dt>Temperatura</dt><dd>${t}</dd><dt>Centrifugado</dt><dd>${r}</dd><dt>Carga máx.</dt><dd>${x.cargaMax ? x.cargaMax + ' kg' : '—'}</dd>${x.minutos ? `<dt>Duración</dt><dd>${x.minutos} min</dd>` : ''}</dl>
          ${x.temp || x.rpm ? `<p class="ops-prog">Intensivo ${ck(o.intensivo)} · Pre-Lavado ${ck(o.prelavado)} · Enjuague+ ${ck(o.enjuague)} · Secado ${ck(o.secado)}</p>` : ''}
          <p class="sutil">Úsalo para: ${esc(x.usos)}</p>${x.nota ? `<p class="sutil">${esc(x.nota)}</p>` : ''}${x.ai ? '<p class="sutil">Usa AI DD (detección de carga).</p>' : ''}`;
      }
      case 'secado': return `<div class="fila-ico"><span class="ico-pantalla">${x.icono ? icono(x.icono) : '<b class="lcd-mini">0:30</b>'}</span><div><h4>${esc(x.nombre)} ${pag(33)}</h4><p>${esc(x.desc)}</p><p class="sutil">Carga máx.: ${String(x.kg).replace('.', ',')} kg</p>${x.icono ? '' : `<p class="sutil">No tiene ícono propio en la pantalla. ${duda}</p>`}</div></div>`;
      case 'funcion': return `<div class="fila-ico"><span class="ico-pantalla">${x.icono ? icono(x.icono) : icono('mano')}</span><div><h4>${esc(x.nombre)} ${pag(x.pag)}</h4><p class="secreto"><b>Cómo:</b> ${esc(x.como)}</p><p>${esc(x.desc)}</p></div></div>`;
      case 'disp': return `<h4>${esc(x.nombre)} ${pag(x.pag)}</h4><p>${esc(x.desc)}</p>`;
      case 'mant': return `<h4>${esc(x.nombre)} ${pag(x.pag)}</h4><p class="sutil">${esc(x.cada)}</p><ol class="lista">${x.pasos.map(p => `<li>${esc(p)}</li>`).join('')}</ol>`;
      case 'mezcla': return `<div class="fila-ico"><span class="par-colores"><i class="c-${x.a}"></i><i class="c-${x.b}"></i></span><div><h4>${cap(Motor.NOMBRE_COLOR[x.a])} + ${Motor.NOMBRE_COLOR[x.b]} ${general}</h4><p class="etq ${x.ok ? 'usuario' : 'servicio'}">${x.ok ? 'Pueden ir juntas' : 'Mejor aparte'}</p><p>${esc(x.txt)}</p></div></div>`;
      case 'consejo': return `<h4>${esc(x.titulo)} ${x.manual ? pag(x.manual) : general}</h4><p>${esc(x.txt)}</p>`;
      case 'etiqueta': return `<div class="fila-ico"><span class="ico-pantalla etq-ico">${simboloEtiqueta(x.s)}</span><div><h4>${esc(x.nombre)} ${x.manual ? pag(x.manual) : general}</h4><p>${esc(x.significa)}</p>${x.maquina ? `<p class="secreto"><b>En tu lavadora:</b> ${esc(x.maquina)}</p>` : ''}</div></div>`;
    }
    return '';
  }

  const SECCIONES_GUIA = [
    { id: 'consejos', titulo: 'Consejos para cuidar la ropa', desc: 'Lo básico para que la ropa dure y salga limpia.', tipo: 'consejo', items: () => CONSEJOS },
    { id: 'colores', titulo: '¿Qué colores puedo lavar juntos?', desc: 'Blancos, claros, colores y oscuros: qué se mezcla y qué no.', tipo: 'mezcla', items: () => MEZCLA_COLORES },
    { id: 'trucos', titulo: 'Funciones escondidas y trucos', desc: 'Lo que hacen los botones al mantenerlos 3 s o al combinarlos.', tipo: 'funcion', items: () => FUNCIONES },
    { id: 'botones', titulo: 'Botones', desc: 'Qué hace cada botón según el momento en que lo presionas.', tipo: 'boton', items: () => BOTONES },
    { id: 'iconos', titulo: 'Íconos de la pantalla', desc: 'Qué significa cada ícono iluminado.', tipo: 'icono', items: () => ICONOS_PANTALLA },
    { id: 'mensajes', titulo: 'Mensajes y códigos de error', desc: 'Lo que aparece en los números de la pantalla.', tipo: 'mensaje', items: () => MENSAJES },
    { id: 'programas', titulo: 'Programas de la perilla', desc: 'Temperatura, centrifugado, carga y opciones de cada uno.', tipo: 'programa', items: () => Object.entries(PROGRAMAS).map(([id, p]) => ({ id, ...p })) },
    { id: 'secado', titulo: 'Modos de secado', desc: 'Las opciones que recorre el botón Secado.', tipo: 'secado', items: () => Object.values(SECADO) },
    { id: 'dispensador', titulo: 'Detergente, suavizante y dispensador', desc: 'Dónde va cada producto y cuánto poner.', tipo: 'disp', items: () => DISPENSADOR },
    { id: 'etiquetas', titulo: 'Símbolos de las etiquetas', desc: 'Qué dice la etiqueta de la prenda y cómo traducirlo a la lavadora.', tipo: 'etiqueta', items: () => ETIQUETAS },
    { id: 'mantenimiento', titulo: 'Mantenimiento', desc: 'Limpiezas y cada cuánto hacerlas.', tipo: 'mant', items: () => MANTENIMIENTO }
  ];
  function construirGuia() {
    const cont = $('#guia-secciones');
    cont.innerHTML = SECCIONES_GUIA.map(s => `
      <details class="seccion" data-sec="${s.id}" ${s.id === 'trucos' ? 'open' : ''}>
        <summary><span><b>${s.titulo}</b><small>${s.desc}</small></span></summary>
        <div class="seccion-cuerpo">${s.items().map(x => `<div class="guia-item" data-texto="${esc(Motor.norm(textoPlano(htmlGuia(s.tipo, x)) + ' ' + [x.cod, ...(x.alias || []), ...(x.claves || [])].filter(Boolean).join(' ')))}">${htmlGuia(s.tipo, x)}</div>`).join('')}</div>
      </details>`).join('');
    $('#guia-buscar').addEventListener('input', e => filtrarGuia(e.target.value));
  }
  const textoPlano = html => html.replace(/<[^>]+>/g, ' ');
  function filtrarGuia(q) {
    const n = Motor.norm(q);
    let total = 0;
    $$('#guia-secciones .seccion').forEach(sec => {
      let vis = 0;
      $$('.guia-item', sec).forEach(it => {
        // Cada palabra buscada debe ser el comienzo de una palabra del texto ("UE" no encuentra "bloqueo").
        const palabras = it.dataset.texto.split(' ');
        const ok = !n || n.split(' ').every(w => palabras.some(p => (w.length <= 2 ? p === w : p.startsWith(w))));
        it.hidden = !ok;
        if (ok) vis++;
      });
      sec.hidden = n && !vis;
      if (n) sec.open = vis > 0;
      total += vis;
    });
    $('#guia-vacio').hidden = !n || total > 0;
  }

  // ================= Panel virtual =================
  const Panel = (() => {
    const AI_PROGS = ['algodon', 'mixtos', 'sintetico'];
    const S = { on: false, modo: 'apagada', prog: null, temp: null, rpm: null, int: false, pre: false, enj: false, sec: null, dif: 0, sonidoOff: false, bloqueo: false, wifi: false, remoto: false, corriendo: false, pausa: false, fases: [], fase: -1, pantalla: '', parpadeo: false, explicar: false };
    let msg = { txt: 'Presiona <b>Encendido</b> para empezar. Prueba las combinaciones: mantén presionado un botón para su función escondida.', ref: '' };
    let timer = null;

    const prog = () => (S.prog ? PROGRAMAS[S.prog] : null);
    const decir = (txt, ref = '') => { msg = { txt, ref }; };
    const nombreSec = k => SECADO[k].nombre;

    function encender() {
      Object.assign(S, { on: true, modo: 'inicial', prog: 'algodon', int: false, pre: false, enj: false, sec: null, dif: 0, corriendo: false, pausa: false, fases: [], fase: -1, pantalla: '', remoto: false });
      S.temp = PROGRAMAS.algodon.temp.def; S.rpm = PROGRAMAS.algodon.rpm.def;
      decir('Encendida. Se ilumina Algodón con sus ajustes predeterminados (40 °C, 1400 rpm). Si ahora presionas <b>Secado</b> o <b>Centrifugado</b> sin girar la perilla, entras en Sólo Secado o Sólo Centrifugado.' + (S.bloqueo ? ' Ojo: el bloqueo infantil sigue activo (CL).' : ''), pag(22) + ' ' + pag(34));
    }
    function apagar() {
      clearTimeout(timer);
      Object.assign(S, { on: false, modo: 'apagada', prog: null, temp: null, rpm: null, int: false, pre: false, enj: false, sec: null, dif: 0, corriendo: false, pausa: false, fases: [], fase: -1, pantalla: '', remoto: false });
      decir('Apagada. Se pierde la configuración. El bloqueo infantil y el sonido conservan su estado aunque la apagues.', pag(36));
    }
    function elegir(id) {
      const p = PROGRAMAS[id];
      Object.assign(S, { modo: id === 'soloSecado' ? 'soloSecado' : 'programa', prog: id, int: false, pre: false, enj: false, dif: 0 });
      S.temp = p.temp ? p.temp.def : null;
      S.rpm = p.rpm ? p.rpm.def : null;
      S.sec = p.op.secado === 'auto' ? 'normal' : null;
      const o = p.op;
      const ops = [o.intensivo && 'Intensivo', o.prelavado && 'Pre-Lavado', o.enjuague && 'Enjuague+', o.secado === true && 'Secado'].filter(Boolean);
      decir(`<b>${p.nombre}</b>: ${esc(p.desc)} ${p.temp ? `Temperatura ${fmtT(p.temp.def)}${p.temp.disp.length > 1 ? ` (puedes ${fmtT(p.temp.disp[0])}–${fmtT(p.temp.disp[p.temp.disp.length - 1])})` : ' fija'}.` : ''} ${p.rpm ? `Centrifugado ${p.rpm.def === '-' ? 'ninguno' : p.rpm.def}.` : ''} ${p.cargaMax ? `Máx. ${p.cargaMax} kg.` : ''} ${ops.length ? 'Opciones: ' + ops.join(', ') + '.' : ''}${o.secado === 'auto' ? ' El secado viene incluido.' : o.secado === false && p.temp ? ' Secado no disponible.' : ''}`, pag(p.pag));
    }

    function bloqueado() {
      if (!S.on) { decir('Primero presiona <b>Encendido</b>.'); return true; }
      if (S.bloqueo) { decir('Bloqueo infantil activo: la pantalla muestra <b>CL</b> y solo funciona Encendido. Para quitarlo: mantén Tiempo Diferido y Añadir Elemento juntos 3 s.', pag(36)); flashCL(); return true; }
      return false;
    }
    function flashCL() { S.pantalla = 'CL'; render(); clearTimeout(timer); timer = setTimeout(() => { S.pantalla = ''; render(); }, 1200); }
    function enMarcha(accion) {
      if (S.corriendo && !S.pausa) { decir(`Con el ciclo en marcha no se cambia ${accion}. Pausa con Inicio/Pausa o apaga para empezar de nuevo.`); return true; }
      return false;
    }
    function comprometerAlgodon() {
      if (S.modo === 'inicial') { S.modo = 'programa'; return ' (Al tocar un ajuste quedó elegido Algodón, el programa por defecto.)'; }
      return '';
    }
    const ciclar = (lista, actual) => lista[(lista.indexOf(actual) + 1) % lista.length];

    const acciones = {
      encendido: () => (S.on ? apagar() : encender()),
      inicio() {
        if (bloqueado()) return;
        if (S.remoto) return decir('Inicio remoto activo: el ciclo solo se puede iniciar desde la app LG ThinQ. Para quitarlo, mantén Añadir Elemento 3 s.', pag(40));
        if (S.corriendo) {
          S.pausa = !S.pausa;
          return decir(S.pausa ? 'En pausa: el LED de la fase actual deja de parpadear.' : 'Continúa el ciclo.', pag(23));
        }
        if (S.modo === 'inicial') { S.modo = 'programa'; }
        if (S.modo === 'programa' && ['limpiezaTambor', 'descarga'].includes(S.prog)) S.fases = ['faseLavado', 'faseCentrifugado'];
        else if (S.modo === 'soloSecado') S.fases = ['faseSecado'];
        else if (S.modo === 'soloCentrifugado') S.fases = ['faseCentrifugado'];
        else S.fases = ['faseLavado', 'faseCentrifugado', ...(S.sec ? ['faseSecado'] : [])];
        S.corriendo = true; S.pausa = false; S.fase = 0; S.pantalla = '---';
        decir(`Arrancó. La puerta se bloquea ({i:puerta}) y el tambor gira sin agua para pesar la ropa: verás <b>---</b>. Luego muestra el tiempo estimado${prog() && AI_PROGS.includes(S.prog) && S.modo === 'programa' ? ' y se enciende AI DD ({i:ai})' : ''}. Usa "Siguiente fase" para ver cómo avanzan los indicadores.`, pag(20) + ' ' + pag(23));
        clearTimeout(timer);
        timer = setTimeout(() => { if (S.pantalla === '---') { S.pantalla = ''; render(); } }, 1800);
      },
      temperatura() {
        if (bloqueado() || enMarcha('la temperatura')) return;
        if (S.modo === 'soloSecado' || S.modo === 'soloCentrifugado' || !prog() || !prog().temp) return decir('En este modo no hay temperatura de agua que elegir.');
        const extra = comprometerAlgodon();
        const d = prog().temp.disp;
        if (d.length === 1) return decir(`${prog().nombre} lava siempre a ${fmtT(d[0])}: el botón no cambia nada.`, pag(28));
        S.temp = ciclar(d, S.temp);
        decir(`Temperatura: <b>${fmtT(S.temp)}</b>. En ${prog().nombre} puedes elegir: ${d.map(fmtT).join(', ')}.${extra}`, pag(34) + ' ' + duda);
      },
      temperaturaLargo() {
        if (!S.on) return decir('Primero presiona Encendido.');
        decir('Mantener <b>Temperatura</b> 3 s (recién encendida, sin tocar nada más) inicia el <b>diagnóstico sonoro</b>: la lavadora emite tonos para que la app LG ThinQ (Smart Diagnosis) los escuche. Acerca el micrófono del celular al botón de encendido.', pag(41));
      },
      centrifugado() {
        if (bloqueado() || enMarcha('el centrifugado')) return;
        if (S.modo === 'inicial') {
          Object.assign(S, { modo: 'soloCentrifugado', prog: null, temp: null, rpm: '1400', sec: null });
          return decir('Entraste en <b>Sólo Centrifugado</b> (sin girar la perilla). Sirve para exprimir ropa mojada; sin detergente. Toca de nuevo para cambiar las rpm y luego Inicio/Pausa.', pag(35) + ' ' + duda);
        }
        if (S.modo === 'soloCentrifugado') { S.rpm = ciclar(RPMS, S.rpm); return decir(`Sólo Centrifugado a <b>${fmtR(S.rpm)}</b>.`, pag(35)); }
        if (S.modo === 'soloSecado') {
          S.rpm = ciclar(PROGRAMAS.soloSecado.rpm.disp, S.rpm);
          return decir(`Centrifugado antes de secar: <b>${S.rpm === '-' ? 'ninguno' : S.rpm + ' rpm'}</b>. Opciones en Sólo Secado: ninguno, 1000, 1200, 1400. Más centrifugado = secado más corto.`, pag(31));
        }
        if (!prog() || !prog().rpm) return decir('Este programa no permite cambiar el centrifugado.');
        const extra = comprometerAlgodon();
        const d = prog().rpm.disp;
        S.rpm = ciclar(d, S.rpm);
        decir(`Centrifugado: <b>${fmtR(S.rpm)}</b>. En ${prog().nombre}: ${d.join(', ')}.${S.rpm === 'No' ? ' Con "No" la ropa sale muy mojada.' : ''}${extra}`, pag(31));
      },
      secado() {
        if (bloqueado() || enMarcha('el secado')) return;
        if (S.modo === 'inicial') {
          Object.assign(S, { modo: 'soloSecado', prog: null, temp: null, rpm: '-', sec: 'normal' });
          return decir('Entraste en <b>Sólo Secado</b> porque no habías girado la perilla. Cada toque cambia: Normal → Tiempo 30 → 60 → 120 → Plancha → Temperatura baja → Normal Eco. No pongas detergente. Deja el grifo abierto.', pag(34));
        }
        if (S.modo === 'soloCentrifugado') return decir('Ya estás en Sólo Centrifugado. Para secar, apaga y enciende y presiona Secado sin girar la perilla.', pag(34));
        if (S.modo === 'soloSecado') {
          S.sec = ciclar(CICLO_SECADO_SOLO, S.sec);
          const sinIcono = !SECADO[S.sec].icono ? ` Este modo no tiene ícono propio; en el simulador mostramos el tiempo en los números. ${duda}` : '';
          return decir(`Modo de secado: <b>${nombreSec(S.sec)}</b>. ${esc(SECADO[S.sec].desc)}${sinIcono}`, pag(33));
        }
        const o = prog().op.secado;
        if (!o) return decir(`${prog().nombre} no permite Secado: no se enciende nada. Lava y luego usa Sólo Secado si la prenda lo admite.`, pag(30));
        if (o === 'auto') {
          S.sec = ciclar(CICLO_SECADO_LAVADO.filter(Boolean), S.sec);
          return decir(`${prog().nombre} siempre seca; cambiaste el modo a <b>${nombreSec(S.sec)}</b>.`, pag(30));
        }
        S.sec = ciclar(CICLO_SECADO_LAVADO, S.sec);
        decir(S.sec ? `Secado después del lavado: <b>${nombreSec(S.sec)}</b>. ${esc(SECADO[S.sec].desc)} Recuerda: seca máx. 8 kg.` : 'Secado desactivado: solo lavará.', pag(33) + (S.sec === null ? ' ' + duda : ''));
      },
      intensivo() {
        if (bloqueado() || enMarcha('las opciones')) return;
        if (S.modo !== 'programa' && S.modo !== 'inicial') return decir('Intensivo solo aplica a programas de lavado.');
        const extra = comprometerAlgodon();
        if (!prog().op.intensivo) return decir(`${prog().nombre} no permite Intensivo.`, pag(30));
        S.int = !S.int;
        decir(S.int ? `Intensivo <b>activado</b>: lavado más fuerte para ropa con suciedad normal o abundante.${extra}` : 'Intensivo desactivado.', pag(34));
      },
      intensivoLargo() {
        if (bloqueado() || enMarcha('las opciones')) return;
        if (S.modo !== 'programa' && S.modo !== 'inicial') return decir('Pre-Lavado solo aplica a programas de lavado.');
        const extra = comprometerAlgodon();
        if (!prog().op.prelavado) return decir(`${prog().nombre} no permite Pre-Lavado.`, pag(30));
        S.pre = !S.pre;
        decir(S.pre ? `<b>Pre-Lavado activado</b> (mantener Intensivo 3 s): se enciende {i:prelavado}. Pon detergente también en el compartimento de prelavado y no uses líquido.${extra}` : 'Pre-Lavado desactivado.', pag(36));
      },
      enjuague() {
        if (bloqueado() || enMarcha('las opciones')) return;
        if (S.modo !== 'programa' && S.modo !== 'inicial') return decir('Enjuague+ solo aplica a programas de lavado.');
        const extra = comprometerAlgodon();
        if (!prog().op.enjuague) return decir(`${prog().nombre} no permite Enjuague+.`, pag(30));
        S.enj = !S.enj;
        decir(S.enj ? `Enjuague+ <b>activado</b>: un enjuague extra, ideal con alergias o piel sensible.${extra}` : 'Enjuague+ desactivado.', pag(34));
      },
      diferido() {
        if (bloqueado() || enMarcha('el tiempo diferido')) return;
        if (S.modo === 'inicial') comprometerAlgodon();
        if (S.modo !== 'programa') return decir('Tiempo Diferido se usa con un programa de lavado.', pag(30));
        S.dif = S.dif ? S.dif + 1 : 3;
        if (S.dif > 19) S.dif = 0;
        decir(S.dif ? `Terminará en <b>${S.dif} h</b> (es la hora de FIN, no de inicio). Sin detergente líquido. Para cancelarlo hay que apagar.` : 'Tiempo Diferido quitado.', pag(36) + ' ' + duda);
      },
      diferidoLargo() {
        if (!S.on) return decir('Primero presiona Encendido.');
        if (S.bloqueo) return bloqueado();
        S.wifi = !S.wifi;
        decir(S.wifi ? 'Mantener <b>Tiempo Diferido</b> 3 s inicia la conexión Wi-Fi con LG ThinQ. Cuando se conecta, se enciende {i:wifi}. Solo redes de 2,4 GHz.' : 'Wi-Fi desconectado (en el simulador).', pag(22) + ' ' + pag(38));
      },
      anadir() {
        if (bloqueado()) return;
        if (!S.corriendo) return decir('Añadir Elemento funciona con el ciclo en marcha: pausa y desbloquea la puerta para meter o sacar ropa.', pag(36));
        if (S.fases[S.fase] === 'faseSecado') return decir('Durante el secado la ropa y la puerta están calientes. Pausa con Inicio/Pausa si necesitas sacar algo.', pag(32));
        S.pausa = true;
        decir('Pausado: cuando se apague {i:puerta} puedes abrir y agregar o sacar ropa. Si el agua está alta o caliente, la puerta no abre (seguridad). Luego cierra y presiona Inicio/Pausa.', pag(36));
      },
      anadirLargo() {
        if (!S.on) return decir('Primero presiona Encendido.');
        if (S.bloqueo) return bloqueado();
        if (!S.wifi) return decir('Inicio remoto necesita la lavadora conectada a LG ThinQ. Primero mantén Tiempo Diferido 3 s para conectar el Wi-Fi.', pag(40));
        S.remoto = !S.remoto;
        decir(S.remoto ? 'Mantener <b>Añadir Elemento</b> 3 s activa el <b>Inicio remoto</b> {i:remoto}: ahora solo puedes iniciar desde la app.' : 'Inicio remoto desactivado.', pag(40));
      },
      comboSonido() {
        if (!S.on) return decir('Primero presiona Encendido.');
        if (S.bloqueo) return bloqueado();
        S.sonidoOff = !S.sonidoOff;
        decir(S.sonidoOff ? '<b>Enjuague+ y Secado</b> juntos 3 s: sonidos <b>apagados</b> {i:sonidoOff}.' : 'Sonidos activados de nuevo.', pag(36));
      },
      comboBloqueo() {
        if (!S.on) return decir('Primero presiona Encendido.');
        S.bloqueo = !S.bloqueo;
        if (S.bloqueo) flashCL();
        decir(S.bloqueo ? '<b>Tiempo Diferido y Añadir Elemento</b> juntos 3 s: <b>Bloqueo infantil</b> {i:bloqueo}. Todo queda bloqueado menos Encendido; aparece CL. Apagar no lo quita.' : 'Bloqueo infantil quitado (misma combinación).', pag(36));
      },
      siguienteFase() {
        if (!S.corriendo) return;
        S.pausa = false;
        S.pantalla = '';
        S.fase++;
        if (S.fase >= S.fases.length) {
          const seco = S.fases.includes('faseSecado');
          S.corriendo = false; S.fase = -1; S.pantalla = 'ENd';
          decir(`Terminó: <b>ENd</b>, suena la melodía${S.sonidoOff ? ' (no, está silenciada)' : ''} y se apaga {i:puerta}.${seco ? ' Si no sacas la ropa, aparece <b>Cd</b> y el tambor la gira de vez en cuando hasta ~4 h para evitar arrugas.' : ' Saca la ropa enseguida.'}`, pag(20) + ' ' + pag(32));
          if (seco) { clearTimeout(timer); timer = setTimeout(() => { if (S.pantalla === 'ENd') { S.pantalla = 'Cd'; render(); } }, 2500); }
          return;
        }
        const n = { faseLavado: 'lavado', faseCentrifugado: 'enjuague y centrifugado', faseSecado: 'secado' }[S.fases[S.fase]];
        decir(`Fase de <b>${n}</b>: su ícono parpadea; las fases que faltan quedan fijas y las terminadas se apagan.`, pag(23));
      },
      reiniciar() { apagar(); Object.assign(S, { bloqueo: false, sonidoOff: false, wifi: false }); decir('Panel reiniciado.'); }
    };

    // Explicaciones del modo "¿Qué es esto?"
    function explicar(clave) {
      const [tipo, id] = clave.split(':');
      if (tipo === 'b') {
        const b = BOTONES.find(x => x.id === id);
        return decir(`<div class="guia-item en-panel">${htmlGuia('boton', b)}</div>`);
      }
      if (tipo === 'i') return decir(`<div class="guia-item en-panel">${htmlGuia('icono', ICONOS_PANTALLA.find(x => x.id === id))}</div>`);
      if (tipo === 'p') return decir(`<div class="guia-item en-panel">${htmlGuia('programa', { id, ...PROGRAMAS[id] })}</div>`);
      if (tipo === 'lcd') return decir('<div class="guia-item en-panel"><h4>Números de la pantalla</h4><p>Muestran el tiempo estimado restante (o el predeterminado del programa antes de iniciar), <b>---</b> mientras pesa la ropa, y mensajes como ENd, Cd, CL, tcL o códigos de error. Revisa la sección "Mensajes y códigos de error" de la guía.</p></div>', pag(24));
      if (tipo === 't') return decir('<div class="guia-item en-panel"><h4>Luces de temperatura</h4><p>Se ilumina la temperatura elegida. Cambia con el botón Temperatura. Cada programa permite solo algunas (las marcadas con borde en el simulador).</p></div>', pag(23));
      if (tipo === 'r') return decir('<div class="guia-item en-panel"><h4>Luces de centrifugado</h4><p>Se ilumina la velocidad elegida (rpm). Cambia con el botón Centrifugado. "No" = sin centrifugado final.</p></div>', pag(31));
    }

    function cargarTanda(t) {
      encender();
      if (t.prog) elegir(t.prog);
      if (t.temp) S.temp = t.temp;
      if (t.rpm) S.rpm = t.rpm;
      S.int = t.op.intensivo; S.pre = t.op.prelavado; S.enj = t.op.enjuague;
      if (t.secado && t.secado.modo && t.secado.via === 'opcion') S.sec = t.secado.modo;
      const despues = t.secado && t.secado.modo && t.secado.via === 'despues' ? ` El secado (${nombreSec(t.secado.modo)}) lo haces después, con Sólo Secado.` : '';
      decir(`Así debería verse tu panel para <b>${esc(t.nombres.join(', '))}</b>: ${PROGRAMAS[t.prog].nombre}, ${t.temp ? fmtT(t.temp) : ''}, ${fmtR(t.rpm)}${t.op.intensivo ? ', Intensivo' : ''}${t.op.prelavado ? ', Pre-Lavado' : ''}${t.op.enjuague ? ', Enjuague+' : ''}${S.sec ? ', Secado ' + nombreSec(S.sec) : ''}.${despues} Compáralo con tu lavadora antes de presionar Inicio/Pausa.`);
      render();
    }

    // ---------- dibujo ----------
    const knobAngulo = id => {
      const todos = [...PERILLA.izq, ...PERILLA.der.slice().reverse()];
      const i = todos.indexOf(id);
      return i < 0 ? 0 : -150 + (i * 300) / (todos.length - 1);
    };
    function render() {
      const root = $('#panel-sim');
      const on = S.on;
      const faseCls = f => {
        if (!S.corriendo) return '';
        const i = S.fases.indexOf(f);
        if (i < 0 || i < S.fase) return '';
        return i === S.fase ? (S.pausa ? 'on' : 'on parpadea') : 'on';
      };
      const lit = c => (c ? 'on' : '');
      const secIco = S.sec && SECADO[S.sec].icono;
      let pantalla = '';
      if (on) {
        if (S.bloqueo && S.pantalla === 'CL') pantalla = 'CL';
        else if (S.pantalla) pantalla = S.pantalla;
        else if (S.dif) pantalla = `${S.dif}:00`;
        else if (S.modo === 'soloSecado' && /^t\d+/.test(S.sec || '')) pantalla = { t30: '0:30', t60: '1:00', t120: '2:00' }[S.sec];
        else if (prog() && prog().minutos) pantalla = `0:${prog().minutos}`;
        else pantalla = '-:--';
      }
      const tdisp = prog() && prog().temp && S.modo !== 'soloSecado' ? prog().temp.disp : [];
      const rdisp = S.modo === 'soloCentrifugado' ? RPMS : prog() && prog().rpm ? prog().rpm.disp : S.modo === 'soloSecado' ? PROGRAMAS.soloSecado.rpm.disp : [];
      const celdaT = t => `<span class="luz ${on && S.temp === t ? 'on' : ''} ${on && tdisp.includes(t) ? 'disp' : ''}" data-explica="t">${t === 'Fría' ? 'Fría' : t + '℃'}</span>`;
      const celdaR = r => `<span class="luz ${on && S.rpm === r ? 'on' : ''} ${on && rdisp.includes(r) ? 'disp' : ''}" data-explica="r">${r}</span>`;
      const progItem = id => `<button type="button" class="prog-item ${on && S.prog === id ? 'on' : ''}" data-prog="${id}" data-explica="p:${id}"><i></i>${PROGRAMAS[id].corto || PROGRAMAS[id].nombre}</button>`;

      root.innerHTML = `
        <div class="perilla-zona">
          <div class="prog-col">${PERILLA.izq.map(progItem).join('')}</div>
          <div class="perilla"><div class="perilla-aro" style="transform:rotate(${on && S.prog ? knobAngulo(S.prog) : 0}deg)"><span class="perilla-marca"></span></div></div>
          <div class="prog-col der">${PERILLA.der.map(progItem).join('')}</div>
        </div>
        <div class="pantalla ${on ? '' : 'apagada'}">
          <div class="pant-fila arriba">
            <span class="pi ${lit(on && S.corriendo && S.pantalla !== '---' && S.modo === 'programa' && AI_PROGS.includes(S.prog))}" data-explica="i:ai">${icono('ai')}</span>
            <span class="sep"></span>
            <span class="pi ${faseCls('faseLavado')}" data-explica="i:faseLavado">${icono('faseLavado')}</span>
            <span class="pi ${faseCls('faseCentrifugado')}" data-explica="i:faseCentrifugado">${icono('faseCentrifugado')}</span>
            <span class="pi ${faseCls('faseSecado')}" data-explica="i:faseSecado">${icono('faseSecado')}</span>
          </div>
          <div class="lcd ${S.pantalla === '---' ? 'parpadea' : ''}" data-explica="lcd">${esc(pantalla)}</div>
          <div class="pant-fila">
            <span class="pi ${lit(on && S.sonidoOff)}" data-explica="i:sonidoOff">${icono('sonidoOff')}</span>
            <span class="pi ${lit(on && S.bloqueo)}" data-explica="i:bloqueo">${icono('bloqueo')}</span>
            <span class="pi ${lit(on && S.wifi)}" data-explica="i:wifi">${icono('wifi')}</span>
            <span class="pi ${lit(on && S.remoto)}" data-explica="i:remoto">${icono('remoto')}</span>
            <span class="pi ${lit(on && S.corriendo && !S.pausa)}" data-explica="i:puerta">${icono('puerta')}</span>
          </div>
          <div class="pant-fila">
            <span class="pi ${lit(on && S.pre)}" data-explica="i:prelavado">${icono('prelavado')}</span>
            <span class="pi caja ${lit(on && secIco === 'secNormal')}" data-explica="i:secNormal">${icono('secNormal')}</span>
            <span class="pi caja ${lit(on && secIco === 'secPlancha')}" data-explica="i:secPlancha">${icono('secPlancha')}</span>
            <span class="pi caja ${lit(on && secIco === 'secBaja')}" data-explica="i:secBaja">${icono('secBaja')}</span>
            <span class="pi caja ${lit(on && secIco === 'secEco')}" data-explica="i:secEco">${icono('secEco')}</span>
          </div>
        </div>
        <div class="ajustes-luces">
          <div class="rejilla">${TEMPS.map(celdaT).join('')}</div>
          <button type="button" class="tecla-sim ancha" data-b="temperatura" data-largo="1" data-explica="b:temperatura">Temperatura</button>
          <div class="rejilla">${RPMS.map(celdaR).join('')}</div>
          <button type="button" class="tecla-sim ancha" data-b="centrifugado" data-explica="b:centrifugado">Centrifugado</button>
        </div>
        <div class="teclas">
          <button type="button" class="tecla-sim ${lit(on && S.int)}" data-b="intensivo" data-largo="1" data-explica="b:intensivo"><i class="led"></i>Intensivo<small>*Pre-Lavado</small></button>
          <button type="button" class="tecla-sim ${lit(on && S.enj)}" data-b="enjuague" data-explica="b:enjuague"><i class="led"></i>Enjuague+<small>&nbsp;</small></button>
          <button type="button" class="tecla-sim ${lit(on && S.sec)}" data-b="secado" data-explica="b:secado"><i class="led"></i>Secado<small>${S.sec && on ? nombreSec(S.sec) : '&nbsp;'}</small></button>
          <button type="button" class="tecla-sim ${lit(on && S.dif)}" data-b="diferido" data-largo="1" data-explica="b:diferido"><i class="led"></i>Tiempo Diferido<small>*Wi-Fi</small></button>
          <button type="button" class="tecla-sim ${lit(on && S.pausa)}" data-b="anadir" data-largo="1" data-explica="b:anadir"><i class="led"></i>Añadir Elemento<small>*Inicio Remoto</small></button>
        </div>
        <div class="combos">
          <button type="button" class="chip" data-b="comboSonido">Enjuague+ + Secado (3 s) · Sonido</button>
          <button type="button" class="chip" data-b="comboBloqueo">T. Diferido + Añadir (3 s) · Bloqueo infantil</button>
        </div>
        <div class="power-fila">
          <button type="button" class="redondo ${lit(on)}" data-b="encendido" data-explica="b:encendido" aria-label="Encendido/Apagado"><svg viewBox="0 0 24 24" class="ico"><path d="M12 3v8M7 6.3a7.5 7.5 0 1 0 10 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
          ${S.corriendo ? '<button type="button" class="btn sec" data-b="siguienteFase">Siguiente fase ▸</button>' : '<span></span>'}
          <button type="button" class="redondo" data-b="inicio" data-explica="b:inicio" aria-label="Inicio/Pausa"><svg viewBox="0 0 24 24" class="ico"><path d="M6 6v12l7-6z" fill="currentColor"/><path d="M15.5 6v12M19 6v12" stroke="currentColor" stroke-width="2"/></svg></button>
        </div>`;
      const m = $('#panel-msg');
      m.innerHTML = `<div>${conIconos(msg.txt)}</div>${msg.ref ? `<div class="refs">${msg.ref}</div>` : ''}`;
      $$('#panel-modo button').forEach(b => b.setAttribute('aria-pressed', String(S.explicar) === b.dataset.val));
      $('#tab-panel').classList.toggle('modo-explicar', S.explicar);
    }

    // ---------- eventos: toque y "mantener presionado" ----------
    const MANTENER_MS = 900;
    let pulsado = null;
    function iniciarPulsacion(e) {
      const el = e.target.closest('[data-b], [data-prog], [data-explica]');
      if (!el || !$('#panel-sim').contains(el) && !el.closest('.combos')) return;
      if (S.explicar) return;
      const b = el.dataset.b;
      if (!b || !el.dataset.largo) return;
      el.classList.add('manteniendo');
      pulsado = { el, b, largo: false, t: setTimeout(() => { pulsado.largo = true; el.classList.remove('manteniendo'); acciones[b + 'Largo'](); render(); if (navigator.vibrate) navigator.vibrate(30); }, MANTENER_MS) };
    }
    function terminarPulsacion() {
      if (!pulsado) return;
      clearTimeout(pulsado.t);
      pulsado.el.classList.remove('manteniendo');
      const p = pulsado;
      pulsado = null;
      if (!p.largo) { acciones[p.b](); render(); }
    }
    const sim = $('#panel-sim');
    sim.addEventListener('pointerdown', iniciarPulsacion);
    sim.addEventListener('pointerup', terminarPulsacion);
    sim.addEventListener('pointercancel', () => { if (pulsado) { clearTimeout(pulsado.t); pulsado.el.classList.remove('manteniendo'); pulsado = null; } });
    sim.addEventListener('pointerleave', () => { if (pulsado) { clearTimeout(pulsado.t); pulsado.el.classList.remove('manteniendo'); pulsado = null; } });
    sim.addEventListener('contextmenu', e => e.preventDefault());
    sim.addEventListener('click', e => {
      const el = e.target.closest('[data-b], [data-prog], [data-explica]');
      if (!el) return;
      if (S.explicar) {
        if (el.dataset.explica) { explicar(el.dataset.explica); render(); }
        return;
      }
      if (el.dataset.prog) {
        if (bloqueado() || enMarcha('el programa')) return render();
        elegir(el.dataset.prog); render(); return;
      }
      const b = el.dataset.b;
      // Los botones con función de "mantener" se manejan en pointerup; con teclado (detail 0) cuentan como toque.
      if (b && (!el.dataset.largo || e.detail === 0)) { acciones[b](); render(); }
    });
    $$('#panel-modo button').forEach(b => b.addEventListener('click', () => {
      S.explicar = b.dataset.val === 'true';
      decir(S.explicar ? 'Modo <b>¿Qué es esto?</b>: toca cualquier botón, luz o ícono y te explico qué es. No cambia nada del panel.' : 'Modo <b>Simular</b>: toca los botones como en tu lavadora. Mantén presionado Intensivo, Tiempo Diferido, Añadir Elemento o Temperatura para sus funciones escondidas.');
      render();
    }));
    $('#panel-reiniciar').addEventListener('click', () => { acciones.reiniciar(); render(); });

    render();
    return { cargarTanda };
  })();

  // ================= Inicio =================
  construirFiltros();
  construirGuia();
  irA('chat');

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
