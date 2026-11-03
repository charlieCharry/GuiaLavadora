/* Motor de reglas: entiende el texto por palabras clave y arma la configuración de la lavadora.
   No usa IA ni internet: todo sale de datos-manual.js y datos-prendas.js. */

const Motor = (() => {
  const PRENDA = Object.fromEntries(PRENDAS.map(p => [p.id, p]));
  const RANGO_PROGRAMA = { algodon: 0, algodonPlus: 0, antialergico: 1, mixtos: 2, sintetico: 3, infantil: 4, delicado: 5, lana: 6 };
  const ORDEN_COLOR = ['oscuro', 'color', 'claro', 'blanco'];
  const KG_CARGA = { pequena: 2, media: 4.5, grande: 8 };
  const NOMBRE_CARGA = { pequena: 'pequeña', media: 'media', grande: 'grande' };
  const NOMBRE_COLOR = { blanco: 'blanca', claro: 'clara', color: 'de color', oscuro: 'oscura' };

  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9+\-\s]/g, ' ').replace(/\s+/g, ' ').trim();

  const NUMEROS = { un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, quince: 15, veinte: 20, par: 2, docena: 12 };

  const VOCAB = {
    color: {
      blanco: ['blanco', 'blanca'],
      claro: ['claro', 'clara', 'muy claro', 'muy clara', 'pastel', 'tono pastel', 'beige', 'crema', 'hueso', 'blanco hueso', 'marfil', 'perla', 'celeste', 'lila', 'color claro', 'color muy claro', 'de color claro', 'de color muy claro', 'tono claro', 'gris claro', 'azul claro', 'rosado claro', 'rosa claro', 'verde claro', 'amarillo claro', 'palo de rosa', 'rosa palo', 'gris', 'gris perla'],
      color: ['color', 'de color', 'estampado', 'estampada', 'rojo', 'roja', 'azul', 'verde', 'amarillo', 'amarilla', 'rosado', 'rosada', 'morado', 'morada', 'naranja', 'fucsia', 'colorido', 'colorida', 'color vivo', 'color fuerte', 'de colores vivos'],
      oscuro: ['oscuro', 'oscura', 'negro', 'negra', 'azul oscuro', 'azul marino', 'gris oscuro', 'vinotinto', 'cafe oscuro', 'oscurito', 'oscurita', 'color oscuro', 'de color oscuro', 'gris carbon', 'grafito'],
      mezcla: ['mezclado', 'mezclada', 'revuelto', 'revuelta', 'de todos los colores', 'varios colores', 'colores variados']
    },
    suciedad: {
      mucha: ['muy sucio', 'muy sucia', 'bastante sucio', 'bastante sucia', 'sucisimo', 'sucisima', 'super sucio', 'super sucia', 'manchado', 'manchada', 'mugre', 'mugroso', 'mugrosa', 'percudido', 'percudida', 'barro', 'pantano', 'grasa', 'engrasado', 'engrasada', 'sudado', 'sudada', 'mucha suciedad', 'muy manchado', 'muy manchada', 'cochino', 'cochina'],
      poca: ['poco sucio', 'poco sucia', 'poca suciedad', 'casi limpio', 'casi limpia', 'usado una vez', 'usada una vez', 'refrescar', 'solo refrescar', 'suciedad ligera', 'poquito sucio', 'poquito sucia', 'casi nueva', 'casi nuevo'],
      normal: ['suciedad normal', 'sucio normal', 'sucia normal', 'uso normal', 'medio sucio', 'medio sucia', 'normalita', 'normal', 'sucio', 'sucia']
    },
    carga: {
      pequena: ['poca ropa', 'poquita ropa', 'pocas prendas', 'pocas cosas', 'carga pequena', 'carga baja', 'carga chica', 'poquitas prendas'],
      media: ['carga media', 'media carga', 'medio tambor', 'mitad del tambor', 'carga mediana', 'carga normal'],
      grande: ['carga grande', 'carga llena', 'carga completa', 'tambor lleno', 'mucha ropa', 'bastante ropa', 'harta ropa', 'monton de ropa', 'montonera', 'full']
    },
    secar: {
      si: ['secar', 'secado', 'secarla', 'secarlas', 'secarlo', 'secarlos', 'seca', 'secas', 'secadora', 'que salga seca', 'que salgan secas', 'lista para usar', 'listas para usar', 'lavar y secar', 'lavado y secado'],
      no: ['al aire', 'al sol', 'tender', 'tenderla', 'tenderlas', 'tenderlo', 'tenderlos', 'la tiendo', 'las tiendo', 'lo tiendo', 'los tiendo', 'colgar', 'colgarla', 'colgarlas', 'solo lavar', 'sin secar', 'no secar', 'sin secado', 'no la seco', 'no las seco', 'en el patio', 'en el tendedero']
    },
    flag: {
      planchar: ['planchar', 'plancharla', 'plancharlas', 'plancharlo', 'plancharlos', 'para planchar'],
      prisa: ['rapido', 'rapida', 'prisa', 'afan', 'apurado', 'apurada', 'urgente', 'ya mismo', 'poco tiempo', 'express', 'de afan', 'corriendo'],
      alergia: ['alergia', 'alergico', 'alergica', 'piel sensible', 'dermatitis', 'acaros', 'asma', 'rinitis'],
      olor: ['olor', 'huele', 'hediondo', 'hedionda', 'mal olor', 'humedad', 'apesta', 'moho', 'guardado', 'guardada'],
      preguntaMezcla: ['mezclar', 'mezclo', 'mezclarla', 'mezclarlo', 'juntar', 'juntarla', 'junta', 'junto', 'junto con', 'por separado', 'separado', 'separada', 'separar', 'separarla', 'aparte', 'dos cargas', '2 cargas', 'dos tandas', '2 tandas', 'misma carga', 'misma tanda', 'combinar'],
      preguntaSecado: ['se puede secar', 'se puede secarla', 'puedo secar', 'puedo secarla', 'puedo secarlo', 'se seca', 'van a la secadora', 'va a la secadora', 'pueden ir a la secadora', 'puede ir a la secadora', 'aguanta secadora', 'aguanta la secadora', 'meter a la secadora', 'meterla a la secadora', 'se puede meter a la secadora', 'sirve la secadora', 'se pueden meter en la secadora', 'se pueden secar', 'se secan', 'pueden secarse', 'puede secarse', 'se pueden meter a la secadora', 'puedo meterlas a la secadora'],
      prodSuavizante: ['suavizante'],
      prodCloro: ['cloro', 'blanqueador', 'clorox', 'hipoclorito']
    }
  };

  // ---------- coincidencias por palabras ----------
  const tokens = s => (s ? s.split(' ') : []);
  function coincideEn(tk, i, kw) {
    for (let j = 0; j < kw.length; j++) {
      const t = tk[i + j];
      if (t === undefined) return false;
      const k = kw[j];
      if (t === k || t === k + 's' || t === k + 'es') continue;
      return false;
    }
    return true;
  }

  function construirIndice() {
    const idx = [];
    for (const p of PRENDAS) for (const c of p.claves) idx.push({ kw: tokens(c), tipo: 'prenda', ref: p.id });
    for (const [cat, grupos] of Object.entries(VOCAB))
      for (const [val, lista] of Object.entries(grupos))
        for (const c of lista) idx.push({ kw: tokens(c), tipo: cat, ref: val });
    idx.sort((a, b) => b.kw.length - a.kw.length);
    return idx;
  }
  const INDICE = construirIndice();
  // Primeras palabras de los colores concretos, para leer "color blanco" como blanco.
  const INICIO_COLOR = new Set(INDICE.filter(e => e.tipo === 'color' && e.ref !== 'color' && e.ref !== 'mezcla').flatMap(e => [e.kw[0], e.kw[0] + 's', e.kw[0] + 'es']));

  function buscarTodas(tk, kwList) {
    const out = [];
    for (let i = 0; i < tk.length; i++)
      for (const kw of kwList) if (coincideEn(tk, i, tokens(kw))) out.push({ i, n: tokens(kw).length, kw });
    return out;
  }

  // ---------- lectura del texto ----------
  function leer(texto) {
    const n = norm(texto);
    const tk = tokens(n);
    const usado = new Array(tk.length).fill(false);
    const r = { prendas: [], colores: new Set(), suciedad: null, carga: null, secar: null, flags: new Set(), kg: null, manchas: [], peligro: [] };

    for (let i = 0; i < tk.length; i++) {
      for (const e of INDICE) {
        if (usado.slice(i, i + e.kw.length).some(Boolean)) continue;
        if (!coincideEn(tk, i, e.kw)) continue;
        for (let j = 0; j < e.kw.length; j++) usado[i + j] = true;
        const negado = ['no', 'sin', 'ni'].includes(tk[i - 1]) || (tk[i - 2] === 'no' && tk[i - 1] === 'quiero');
        if (e.tipo === 'prenda') {
          r.prendas.push({ id: e.ref, cant: contarAntes(tk, i), pos: i, palabra: e.kw.join(' ') });
        } else if (e.tipo === 'color') {
          if (e.ref === 'color' && e.kw[e.kw.length - 1] === 'color' && INICIO_COLOR.has(tk[i + e.kw.length])) { /* "color blanco" */ }
          else if (e.ref === 'mezcla') ['blanco', 'color', 'oscuro'].forEach(c => r.colores.add(c)); else r.colores.add(e.ref);
        } else if (e.tipo === 'suciedad') r.suciedad = e.ref;
        else if (e.tipo === 'carga') r.carga = e.ref;
        else if (e.tipo === 'secar') r.secar = negado ? e.ref !== 'si' : e.ref === 'si';
        else if (e.tipo === 'flag' && !negado) r.flags.add(e.ref);
        break;
      }
    }

    // Kilos explícitos: "5 kilos", "3 kg"
    const mkg = n.match(/(\d+(?:[.,]\d+)?)\s*(kg|kilo|kilos|kilogramos)\b/);
    if (mkg) r.kg = parseFloat(mkg[1].replace(',', '.'));

    aplicarMateriales(tk, r);

    // Una prenda nombrada varias veces se cuenta una sola vez.
    const vistos = new Map();
    for (const p of r.prendas) {
      const prev = vistos.get(p.id);
      if (!prev) vistos.set(p.id, { ...p });
      else if (p.cant) prev.cant = (prev.cant || 0) + p.cant;
    }
    r.prendas = [...vistos.values()];

    for (const m of MANCHAS) if (buscarTodas(tk, m.claves).length) r.manchas.push(m.tip);
    r.peligro = PELIGROSOS.filter(p => buscarTodas(tk, [p]).length);
    if (buscarTodas(tk, ['aceite', 'aceite de cocina', 'fritura', 'grasa']).length) r.flags.add('aceite');
    r.pregunta = /\?/.test(texto) || buscarTodas(tk, ['puedo', 'se puede', 'sirve', 'conviene', 'es mejor', 'sera mejor', 'debo', 'hay que', 'le pongo', 'le echo', 'uso', 'usar', 'echar', 'recomiendas', 'que tal', 'es posible']).length > 0;
    r.texto = n;
    return r;
  }

  function contarAntes(tk, i) {
    for (let k = i - 1; k >= Math.max(0, i - 3); k--) {
      const t = tk[k];
      if (/^\d+$/.test(t)) return parseInt(t, 10);
      if (t in NUMEROS) return NUMEROS[t];
      if (!['de', 'del', 'mis', 'las', 'los', 'unas', 'unos', 'mas', 'grandes', 'pequenas', 'pequenos', 'blancas', 'blancos', 'oscuras', 'oscuros'].includes(t)) return null;
    }
    return null;
  }

  function aplicarMateriales(tk, r) {
    for (const m of MATERIALES) {
      const hits = buscarTodas(tk, m.claves);
      if (!hits.length) continue;
      if (m.excepto && buscarTodas(tk, m.excepto).length) continue;
      const objetivo = r.prendas.find(p => m.de.includes(p.id));
      if (!objetivo) continue;
      objetivo.id = m.a;
      objetivo.nombre = null;
      // Quita la prenda que salió de la misma palabra del material ("lana" sola, "pano" como trapo, etc.)
      r.prendas = r.prendas.filter(p => p === objetivo || !hits.some(h => h.i === p.pos));
    }
  }

  // Respuesta corta a una pregunta concreta del asistente ("media", "sí", "blancas"…)
  const RESPUESTAS = {
    color: { blanco: ['blanco', 'blanca', 'blancos', 'blancas'], claro: ['claro', 'clara', 'claros', 'claras', 'pastel'], color: ['color', 'colores', 'de color'], oscuro: ['oscuro', 'oscura', 'oscuros', 'oscuras', 'negro', 'negra'], mezcla: ['mezclado', 'mezclada', 'revuelto', 'revuelta', 'de todo', 'varios'] },
    suciedad: { poca: ['poca', 'poco', 'poquito', 'ligera', 'casi limpia', 'casi limpio'], normal: ['normal', 'regular', 'media', 'medio'], mucha: ['mucha', 'mucho', 'muy sucia', 'muy sucio', 'bastante', 'harta'] },
    carga: { pequena: ['pequena', 'poca', 'poquita', 'baja', 'chica', 'poco'], media: ['media', 'mediana', 'medio', 'mitad', 'normal'], grande: ['grande', 'llena', 'lleno', 'mucha', 'full', 'alta', 'completa'] },
    secar: { si: ['si', 'sii', 'claro', 'dale', 'ok', 'secar', 'secarla', 'secarlas', 'en la maquina', 'en la lavadora'], no: ['no', 'nop', 'al aire', 'tender', 'la tiendo', 'las tiendo', 'colgar', 'al sol'] }
  };
  function leerRespuesta(slot, texto) {
    const tk = tokens(norm(texto));
    const tabla = RESPUESTAS[slot];
    if (!tabla) return null;
    for (const [val, lista] of Object.entries(tabla))
      if (buscarTodas(tk, lista).length) return val;
    return null;
  }

  // ---------- contexto de conversación ----------
  function nuevoContexto() {
    return { prendas: [], colores: new Set(), suciedad: null, carga: null, secar: null, flags: new Set(), kg: null, manchas: [], peligro: [] };
  }
  function fusionar(ctx, r) {
    if (r.prendas.length) ctx.prendas = r.prendas;
    if (r.colores.size) ctx.colores = r.colores;
    if (r.suciedad) ctx.suciedad = r.suciedad;
    if (r.carga) ctx.carga = r.carga;
    if (r.kg) ctx.kg = r.kg;
    if (r.secar !== null) ctx.secar = r.secar;
    r.flags.forEach(f => ctx.flags.add(f));
    ctx.manchas = [...new Set([...ctx.manchas, ...r.manchas])];
    ctx.peligro = [...new Set([...ctx.peligro, ...r.peligro])];
    return ctx;
  }

  function prendasValidas(ctx) { return ctx.prendas.filter(p => PRENDA[p.id] && !PRENDA[p.id].noLavar && !PRENDA[p.id].variantes); }

  function faltante(ctx) {
    if (!ctx.prendas.length) return 'prendas';
    const sinVariante = ctx.prendas.find(p => PRENDA[p.id].variantes);
    if (sinVariante) return { slot: 'variante', prenda: sinVariante };
    const validas = prendasValidas(ctx);
    if (!validas.length) return null;
    if (!ctx.colores.size) return 'color';
    if (!ctx.suciedad) return 'suciedad';
    const todasContadas = validas.every(p => p.cant);
    if (!todasContadas && !ctx.carga && !ctx.kg) return 'carga';
    const algunaSeca = validas.some(p => PRENDA[p.id].secado);
    if (ctx.secar === null && algunaSeca) return 'secar';
    return null;
  }

  // ---------- recomendación ----------
  const idxT = t => TEMPS.indexOf(t);
  const idxR = r => RPMS.indexOf(r);
  const menorTemp = (a, b) => (idxT(a) <= idxT(b) ? a : b);
  const menorRpm = (a, b) => (idxR(a) <= idxR(b) ? a : b);
  const unico = arr => [...new Set(arr.filter(Boolean))];
  const fmtKg = kg => (kg < 10 ? kg.toFixed(1).replace('.0', '').replace('.', ',') : Math.round(kg)) + ' kg';
  const fmtT = t => (t === 'Fría' ? 'Fría' : `${t} °C`);
  const fmtR = r => (r === 'No' || r === '-' ? 'Sin centrifugado' : `${r} rpm`);

  function ajustarTemp(prog, t) {
    const p = PROGRAMAS[prog];
    if (!p.temp) return null;
    const disp = p.temp.disp;
    if (disp.includes(t)) return t;
    const menores = disp.filter(x => idxT(x) <= idxT(t));
    return menores.length ? menores[menores.length - 1] : disp[0];
  }
  function ajustarRpm(prog, r) {
    const p = PROGRAMAS[prog];
    if (!p.rpm) return null;
    const disp = p.rpm.disp.filter(x => x !== '-');
    if (disp.includes(r)) return r;
    const menores = disp.filter(x => idxR(x) <= idxR(r));
    return menores.length ? menores[menores.length - 1] : disp[0];
  }

  function agrupar(ctx) {
    const validas = prendasValidas(ctx);
    const grupos = new Map();
    for (const item of validas) {
      const p = PRENDA[item.id];
      let clave = p.solo ? p.id : p.grupo;
      for (const par of GRUPOS_COMPATIBLES) if (par.includes(clave)) {
        const otro = par.find(g => g !== clave);
        if (grupos.has(otro)) clave = otro;
      }
      if (!grupos.has(clave)) grupos.set(clave, []);
      grupos.get(clave).push(item);
    }
    return [...grupos.values()];
  }

  // ---------- colores: qué se puede lavar junto ----------
  const ORDEN_CLARO = ['blanco', 'claro', 'color', 'oscuro'];
  const infoMezcla = (a, b) => MEZCLA_COLORES.find(m => (m.a === a && m.b === b) || (m.a === b && m.b === a));
  const mezclaOk = (a, b) => a === b || !!(infoMezcla(a, b) || {}).ok;
  const colorMasDelicado = cols => ORDEN_COLOR.find(c => cols.includes(c));
  const nombreColores = cols => cols.map(c => NOMBRE_COLOR[c]).join(' y ');

  // Agrupa los colores de la carga: juntos solo si todos los pares son compatibles.
  function gruposColor(ctx) {
    const orden = ORDEN_CLARO.filter(c => ctx.colores.has(c));
    if (!orden.length) return [['color']];
    if (ctx.flags.has('separarColores')) return orden.map(c => [c]);
    const g = [];
    for (const c of orden) {
      const ult = g[g.length - 1];
      if (ult && ult.every(x => mezclaOk(x, c))) ult.push(c); else g.push([c]);
    }
    return g;
  }

  // Explica qué colores pueden ir juntos y cuáles no.
  function respuestaMezcla(ctx) {
    const orden = ORDEN_CLARO.filter(c => ctx.colores.has(c));
    const pares = [];
    for (let i = 0; i < orden.length; i++)
      for (let j = i + 1; j < orden.length; j++) pares.push(infoMezcla(orden[i], orden[j]));
    const gc = gruposColor({ ...ctx, flags: new Set() });
    return { pares: pares.filter(Boolean), grupos: gc, juntas: gc.length === 1 };
  }

  function recomendar(ctx) {
    const res = { tandas: [], noLavar: [], avisos: [] };
    for (const it of ctx.prendas) if (PRENDA[it.id] && PRENDA[it.id].noLavar) res.noLavar.push(PRENDA[it.id]);
    if (ctx.peligro.length) res.avisos.push({ tipo: 'peligro', manual: 7, txt: `Mencionaste ${ctx.peligro.join(', ')}. El manual prohíbe lavar o secar en la máquina prendas empapadas o manchadas con combustibles, solventes, ceras, pintura o aceites: riesgo de incendio o explosión. Límpialas a mano primero, al aire libre.` });

    const gc = gruposColor(ctx);
    const mezcla = respuestaMezcla(ctx);
    res.colores = { grupos: gc, hayMezcla: ctx.colores.size > 1, juntas: gc.length === 1, separadoAMano: ctx.flags.has('separarColores') };
    if (ctx.colores.size > 1) {
      if (gc.length === 1) {
        mezcla.pares.forEach(m => res.avisos.push({ tipo: 'info', txt: m.txt }));
      } else {
        const malos = mezcla.pares.filter(m => !m.ok);
        res.avisos.push({ tipo: 'aviso', manual: 25, txt: `${res.colores.separadoAMano ? 'Separé' : 'Te separé'} la ropa por color en ${gc.length} cargas: ${gc.map(g => 'ropa ' + nombreColores(g)).join(' · ')}.${malos.length ? ' ' + malos.map(m => m.txt).join(' ') : ''}` });
      }
    }

    const grupos = agrupar(ctx);
    const total = gc.length * grupos.length;
    gc.forEach(cols => grupos.forEach(items => res.tandas.push(configurarTanda(items, ctx, cols, total, gc.length))));
    res.tandas.forEach((t, i) => { t.numero = i + 1; t.total = res.tandas.length; });
    if (grupos.length > 1) res.avisos.push({ tipo: 'info', txt: `Las prendas van en ${grupos.length} grupos distintos: necesitan cuidados diferentes (pelusa, temperatura o fuerza del lavado). Si igual quieres meter todo junto, usa los ajustes de la tanda más suave y no seques en la máquina.` });
    return res;
  }

  function configurarTanda(items, ctx, cols, nTandas, nColores) {
    const color = colorMasDelicado(cols);
    const ps = items.map(it => PRENDA[it.id]);
    const avisos = [], notas = [], alternativas = [];
    const nombres = items.map(it => (it.cant ? `${it.cant} × ` : '') + (it.nombre || PRENDA[it.id].nombre));
    const colorTxt = ctx.colores.size ? 'Ropa ' + nombreColores(cols) : null;

    // Programa: el más suave de las prendas de la tanda.
    let prog = ps.map(p => p.programa).sort((a, b) => RANGO_PROGRAMA[b] - RANGO_PROGRAMA[a])[0];
    if (prog === 'mixtos' && color === 'oscuro') {
      prog = 'algodon';
      notas.push({ manual: 28, txt: 'Uso Algodón y no Mixtos porque el manual dice que Mixtos no es para prendas oscuras.' });
    }

    // Temperatura y centrifugado
    let temp = ps.map(p => p.temp[color]).reduce(menorTemp);
    const tempMax = ps.map(p => p.tempMax).reduce(menorTemp);
    if (ctx.suciedad === 'mucha' && idxT(temp) < idxT(tempMax)) {
      const subida = TEMPS[idxT(temp) + 1];
      if (subida !== '95' || color === 'blanco') temp = subida;
    }
    if (ctx.suciedad === 'poca' && idxT(temp) >= idxT('60') && !ps.some(p => p.id === 'trapos')) temp = '40';
    let rpm = ps.map(p => p.rpm).reduce(menorRpm);

    // Kilos
    // Si la ropa se separa por color, la cantidad se reparte entre las cargas.
    let kg = null;
    if (items.every(it => it.cant)) kg = items.reduce((s, it) => s + it.cant * PRENDA[it.id].kg, 0) / nColores;
    else if (ctx.kg) kg = ctx.kg / nTandas;
    else if (ctx.carga) kg = KG_CARGA[ctx.carga] / nTandas;

    // Prisa
    const suave = RANGO_PROGRAMA[prog] >= 4;
    if (ctx.flags.has('prisa')) {
      if (!suave && kg !== null && kg <= 2 && ctx.suciedad !== 'mucha') {
        notas.push({ txt: `Por la prisa uso Rápido 14 (unos 14 min, máx. 2 kg, poca suciedad) en vez de ${PROGRAMAS[prog].nombre}.` });
        prog = 'rapido';
      } else if (!suave && (kg === null || kg <= 5)) {
        notas.push({ txt: `Por la prisa uso TurboWash 59 (todo el ciclo en 59 min, máx. 5 kg) en vez de ${PROGRAMAS[prog].nombre}.` });
        prog = 'turbowash';
      } else {
        notas.push({ txt: 'No hay un programa rápido adecuado para estas prendas o esta cantidad: mejor no apurarlas.' });
      }
    } else if (!suave && kg !== null && kg <= 5 && ctx.suciedad !== 'mucha' && !['trapos', 'edredon', 'mascotas'].includes(ps[0].id)) {
      alternativas.push(kg <= 2 && ctx.suciedad === 'poca'
        ? '¿Con prisa? Rápido 14: unos 14 min, 20–40 °C, máx. 2 kg y poca suciedad.'
        : '¿Con prisa? TurboWash 59: todo el ciclo en 59 min, hasta 5 kg.');
    }

    // Límite de carga del programa
    let p = PROGRAMAS[prog];
    if (kg !== null && kg > p.cargaMax) {
      if (['mixtos', 'sintetico', 'turbowash', 'antialergico'].includes(prog) && kg <= 14) {
        notas.push({ manual: 28, txt: `${p.nombre} admite máx. ${p.cargaMax} kg y esta carga ronda ${fmtKg(kg)}: uso Algodón con la misma temperatura y centrifugado. (También puedes dividirla en dos tandas.)` });
        prog = 'algodon';
      } else {
        const partes = Math.ceil(kg / Math.max(p.cargaMax, 1));
        avisos.push({ manual: 28, txt: `${p.nombre} admite máx. ${p.cargaMax} kg y esta carga ronda ${fmtKg(kg)}: divídela en ${partes} tandas.` });
      }
      p = PROGRAMAS[prog];
    }
    if (kg !== null && kg > 14) avisos.push({ manual: 4, txt: 'Más de 14 kg no cabe: divide la ropa en dos tandas. El tambor no debe ir apretado; la puerta debe cerrar fácil.' });

    const tempFinal = ajustarTemp(prog, temp);
    if (tempFinal && tempFinal !== temp) {
      if (PROGRAMAS[prog].temp.disp.length === 1) notas.push({ manual: 28, txt: `${PROGRAMAS[prog].nombre} siempre lava a ${fmtT(tempFinal)}.` });
      else notas.push({ txt: `${PROGRAMAS[prog].nombre} no ofrece ${fmtT(temp)}; uso ${fmtT(tempFinal)}.` });
    }
    temp = tempFinal;
    const rpmFinal = ajustarRpm(prog, rpm);
    if (rpmFinal !== rpm) notas.push({ manual: 31, txt: `${PROGRAMAS[prog].nombre} permite como ${idxR(rpmFinal) < idxR(rpm) ? 'máximo' : 'mínimo'} ${fmtR(rpmFinal)}.` });
    rpm = rpmFinal;
    p = PROGRAMAS[prog];

    // Opciones
    const op = { intensivo: false, prelavado: false, enjuague: false };
    const quiereIntensivo = ctx.suciedad === 'mucha' || (ps.some(x => x.intensivo) && ctx.suciedad !== 'poca');
    if (quiereIntensivo) {
      if (p.op.intensivo) op.intensivo = true;
      else if (ctx.suciedad === 'mucha') notas.push({ manual: 30, txt: `${p.nombre} no permite Intensivo.` });
    }
    if (ctx.suciedad === 'mucha' && p.op.prelavado && !suave) op.prelavado = true;
    if ((ps.some(x => x.enjuague) || ctx.flags.has('alergia')) && p.op.enjuague) op.enjuague = true;
    if (ctx.flags.has('olor') && p.op.enjuague) {
      notas.push({ manual: 52, txt: 'Si la ropa sale con olor: no te pases de detergente, sácala apenas termine y haz Limpieza de Tambor una vez al mes.' });
    }
    if (ctx.flags.has('alergia')) {
      const apta = ps.some(x => x.alergia === 'antialergico') && (kg === null || kg <= 5) && prog !== 'antialergico';
      if (apta) alternativas.push('Por la alergia: el programa Antialérgico (60 °C con vapor, máx. 5 kg) ayuda a eliminar alérgenos y ácaros. Solo si las prendas aguantan 60 °C.');
    }

    // Secado
    const secado = calcularSecado(items, ctx, prog, kg);

    // Productos
    const productos = calcularProductos(ps, color, kg, op, ctx);

    // Preparación y avisos
    const prep = unico([...ps.flatMap(x => x.prep), ...ctx.manchas]);
    ps.forEach(x => x.avisos.forEach(a => avisos.push({ txt: a, manual: /manual/i.test(a) ? true : undefined })));
    if (ctx.flags.has('aceite') && ps.some(x => x.secado)) avisos.push({ manual: 4, txt: 'Prendas con aceite (de cocina o vegetal): el manual pide lavarlas en agua caliente con detergente extra antes de secarlas. Si siguen oliendo a aceite, no las seques en la máquina.' });

    const tanda = {
      nombres, items, prog, temp, rpm, op, kg, secado, productos, prep, colorTxt,
      avisos: dedupe(avisos), notas: dedupe(notas), alternativas: unico(alternativas), color
    };
    tanda.pasos = construirPasos(tanda);
    return tanda;
  }
  const dedupe = arr => { const s = new Set(); return arr.filter(a => (s.has(a.txt) ? false : s.add(a.txt))); };

  // ¿Esta prenda puede ir a la secadora? Respuesta corta con su motivo.
  function veredictoSecado(id) {
    const p = PRENDA[id];
    if (p.noLavar) return { ok: false, nombre: p.nombre, txt: p.desc };
    if (p.secado) return { ok: true, nombre: p.nombre, modo: p.secado, manual: p.secadoManual, txt: p.secadoInfo || p.secadoNota || '' };
    return { ok: false, nombre: p.nombre, txt: p.secadoNota || 'Mejor tenderla.' };
  }

  function calcularSecado(items, ctx, prog, kg) {
    const p = PROGRAMAS[prog];
    const no = items.filter(it => !PRENDA[it.id].secado);
    const si = items.filter(it => PRENDA[it.id].secado);
    const veredictos = items.map(it => ({ ...veredictoSecado(it.id), nombre: it.nombre || PRENDA[it.id].nombre }));
    const s = { pedido: ctx.secar === true, veredictos, modo: null, via: null, sacar: no.map(it => it.nombre || PRENDA[it.id].nombre), notas: [], avisos: [] };
    if (!s.pedido) return s;
    if (!si.length) {
      s.avisos.push('Ninguna de estas prendas debería ir a la secadora: tiéndelas.');
      return s;
    }
    const modos = si.map(it => PRENDA[it.id].secado);
    s.modo = modos.includes('baja') ? 'baja'
      : (ctx.flags.has('planchar') || modos.every(m => m === 'plancha')) ? 'plancha' : 'normal';
    if (s.modo === 'normal' && modos.includes('plancha')) s.notas.push('Si piensas planchar camisas o pantalones de tela, usa el modo Plancha (las deja apenas húmedas).');

    // Lo que queda en el tambor después de sacar lo que no se seca.
    let kgSecar = kg;
    if (kg !== null && no.length) {
      if (items.every(it => it.cant)) kgSecar = kg * si.reduce((t, it) => t + it.cant * PRENDA[it.id].kg, 0) / items.reduce((t, it) => t + it.cant * PRENDA[it.id].kg, 0);
      else kgSecar = kg * si.length / items.length;
      s.quedan = `Al sacar ${s.sacar.join(', ').toLowerCase()}, quedan ${items.every(it => it.cant) ? '' : 'aprox. '}${fmtKg(kgSecar)} en el tambor.`;
    }
    s.kgSecar = kgSecar;
    const lim = SECADO[s.modo].kg;
    // Con grasa o aceite conviene revisar el olor antes de secar (manual p. 4): secado aparte.
    if (p.op.secado === true && !no.length && (kgSecar === null || kgSecar <= lim) && !ctx.flags.has('aceite')) s.via = 'opcion';
    else s.via = 'despues';
    if (ctx.flags.has('aceite')) s.notas.push('Seca en un paso aparte: antes huele la ropa; si todavía huele a aceite, no la seques en la máquina.');
    if (p.op.secado !== true && !no.length) s.notas.push(`${p.nombre} no permite agregar Secado: lava y luego usa Sólo Secado.`);
    if (kgSecar !== null && kgSecar > lim) {
      s.avisos.push(s.modo === 'baja'
        ? `Temperatura baja admite máx. 3,5 kg y vas a secar unos ${fmtKg(kgSecar)}: sécala en ${Math.ceil(kgSecar / 3.5)} partes.`
        : `La secadora admite máx. 8 kg (la mitad de lo que lava). Con unos ${fmtKg(kgSecar)}, saca parte de la ropa y sécala en dos tandas (manual).`);
    }
    if (s.modo === 'normal' && kgSecar !== null && kgSecar <= 4) {
      const t = kgSecar <= 1 ? 't30' : kgSecar <= 2 ? 't60' : 't120';
      s.alternativa = `Con esa cantidad también sirve ${SECADO[t].nombre} (secado por tiempo fijo).`;
    }
    if (kgSecar !== null && kgSecar < 1) s.avisos.push('Con tan poca ropa la secadora seca peor: el manual sugiere agregar algunas toallas para que gire bien (p. 52).');
    if (s.via === 'despues' && s.modo === 'normal') s.eco = 'En Sólo Secado también está Normal Eco: consume menos energía.';
    return s;
  }

  function calcularProductos(ps, color, kg, op, ctx) {
    const tipos = unico(ps.map(x => x.detergente));
    let tipo = tipos[0] || (color === 'blanco' ? 'en polvo con blanqueador (el manual lo recomienda para blancos)' : 'polvo o líquido para carga frontal (HE)');
    if (op.prelavado && /l[ií]quido/.test(tipo)) tipo = 'en polvo (con Pre-Lavado no se usa líquido)';
    let dosis;
    const carga = kg !== null ? (kg <= 3 ? 'pequena' : kg <= 7 ? 'media' : 'grande') : ctx.carga;
    if (carga === 'pequena') dosis = 'Un tercio de la dosis que indica el detergente (carga mínima).';
    else if (carga === 'media') dosis = 'La mitad de la dosis que indica el detergente (media carga).';
    else if (carga === 'grande') dosis = 'La dosis completa que indica el detergente.';
    else dosis = 'Completa si el tambor va lleno; la mitad si va a media carga; un tercio si es poca ropa.';

    const sinSuav = ps.filter(x => x.suavizante === false);
    const suavizante = sinSuav.length
      ? { ok: false, txt: unico(sinSuav.map(x => x.suavizanteNota || `No recomendado para ${x.nombre.toLowerCase()}.`)) }
      : { ok: true, txt: ['Opcional. En su compartimento, sin pasar la línea MAX.'] };

    let cloro;
    const sinCloro = ps.filter(x => !x.cloro);
    if (color !== 'blanco') cloro = { ok: false, txt: color === 'claro' ? 'No: también decolora los tonos claros y pasteles. Si quieres reforzar, usa blanqueador con oxígeno (sin cloro).' : 'No: decolora la ropa de color.' };
    else if (!sinCloro.length) cloro = { ok: true, txt: 'Puedes usarlo si la etiqueta lo permite (triángulo vacío). Diluido, en el compartimento principal.' };
    else cloro = { ok: false, txt: unico(sinCloro.map(x => x.cloroNota || `No para ${x.nombre.toLowerCase()}.`)).join(' ') };
    return { tipo, dosis, suavizante, cloro };
  }

  function construirPasos(t) {
    const p = PROGRAMAS[t.prog];
    const pasos = [];
    const b = n => `<b class="tecla">${n}</b>`;
    pasos.push('Mete la ropa suelta, sin apretar: tiene que girar libre.');
    let det = `Pon el detergente en el ${b('compartimento principal')}.`;
    if (t.op.prelavado) det += ` Pon también un poco en el ${b('compartimento de prelavado')}.`;
    if (t.productos.suavizante.ok) det += ' Si quieres suavizante, en su compartimento sin pasar MAX.';
    pasos.push(det);
    pasos.push(`Presiona ${b('Encendido')}.`);
    pasos.push(`Gira la perilla a ${b(p.nombre)}.`);
    if (t.temp) pasos.push(t.temp === p.temp.def
      ? `Temperatura: déjala en ${b(fmtT(t.temp))} (ya viene así).`
      : `Presiona ${b('Temperatura')} hasta que se ilumine ${b(fmtT(t.temp))} (viene en ${fmtT(p.temp.def)}).`);
    if (t.rpm) pasos.push(t.rpm === p.rpm.def
      ? `Centrifugado: déjalo en ${b(t.rpm === 'No' ? 'No' : t.rpm)} (ya viene así).`
      : `Presiona ${b('Centrifugado')} hasta que se ilumine ${b(t.rpm)} (viene en ${p.rpm.def}).`);
    if (t.op.intensivo) pasos.push(`Toca ${b('Intensivo')}: se enciende su luz.`);
    if (t.op.prelavado) pasos.push(`Mantén ${b('Intensivo')} 3 segundos para Pre-Lavado: se enciende el ícono {i:prelavado} en la pantalla.`);
    if (t.op.enjuague) pasos.push(`Toca ${b('Enjuague+')}: se enciende su luz.`);
    const s = t.secado;
    if (s && s.modo && s.via === 'opcion') pasos.push(`Presiona ${b('Secado')} hasta que se encienda ${SECADO[s.modo].icono ? `{i:${SECADO[s.modo].icono}} ` : ''}${b(SECADO[s.modo].nombre)}. Deja el grifo abierto: lo usa durante el secado.`);
    pasos.push(`Presiona ${b('Inicio/Pausa')}. Verás --- mientras pesa la ropa${p.minutos ? `; termina en unos ${p.minutos} min` : ' y luego el tiempo estimado'}.`);
    if (s && s.modo && s.via === 'despues') {
      if (s.sacar.length) pasos.push(`Cuando termine (ENd), saca: ${s.sacar.join(', ')}.`);
      pasos.push(`Para secar: apaga y enciende, y SIN girar la perilla presiona ${b('Secado')} hasta ${SECADO[s.modo].icono ? `{i:${SECADO[s.modo].icono}} ` : ''}${b(SECADO[s.modo].nombre)}. Sin detergente. Deja el grifo abierto.`);
      pasos.push(`Presiona ${b('Inicio/Pausa')}.`);
    }
    pasos.push('Cuando termine, saca la ropa enseguida para que no se arrugue ni tome olor.');
    return pasos;
  }

  // ---------- búsqueda en la guía (preguntas sobre la máquina) ----------
  const DISPARADORES = ['que significa', 'que es', 'que hace', 'para que sirve', 'para que', 'como', 'cuando', 'error', 'codigo', 'icono', 'simbolo', 'aparece', 'sale', 'dice', 'muestra', 'se prende', 'se enciende', 'luz', 'boton', 'pantalla', 'cada cuanto', 'limpiar', 'filtro', 'mantenimiento', 'significa', 'funciona', 'sirve', 'activar', 'desactivar', 'quitar', 'poner'];
  const COD_SIEMPRE = ['tcl', 'ue', 'oe', 'ie', '1e', 'dhe', 'pf', 'ff', 'ae', 'de1', 'de2', 'de4', 'vs', 'cl', 'cd', 'end'];

  function entradasGuia() {
    const e = [];
    MENSAJES.forEach(m => e.push({ tipo: 'mensaje', ref: m, claves: [m.cod, ...(m.alias || []), m.nombre].map(norm) }));
    BOTONES.forEach(b => e.push({ tipo: 'boton', ref: b, claves: [b.nombre, ...b.claves].map(norm) }));
    FUNCIONES.forEach(f => e.push({ tipo: 'funcion', ref: f, claves: [f.nombre, ...f.claves].map(norm) }));
    ICONOS_PANTALLA.forEach(i => e.push({ tipo: 'icono', ref: i, claves: [i.nombre, ...i.claves].map(norm) }));
    Object.entries(PROGRAMAS).forEach(([id, p]) => e.push({ tipo: 'programa', ref: { id, ...p }, claves: [p.nombre, p.corto].filter(Boolean).map(norm) }));
    MANTENIMIENTO.forEach(m => e.push({ tipo: 'mant', ref: m, claves: [m.nombre, 'limpieza', 'limpiar'].map(norm) }));
    DISPENSADOR.forEach(d => e.push({ tipo: 'disp', ref: d, claves: [d.nombre, 'detergente', 'suavizante', 'dispensador', 'gaveta', 'cajon'].map(norm) }));
    return e;
  }
  const GUIA = entradasGuia();

  function buscarGuia(texto) {
    const n = norm(texto);
    const tk = tokens(n);
    const crudo = texto.split(/[^A-Za-z0-9]+/);
    const pregunta = DISPARADORES.some(d => buscarTodas(tk, [d]).length) || /\?/.test(texto);
    const puntajes = [];
    for (const e of GUIA) {
      let pts = 0;
      if (e.tipo === 'mensaje') {
        // Códigos como "dE" o "LE" también son palabras ("de", "le"): solo cuentan si los escribes con mayúscula.
        const cods = [e.ref.cod, ...(e.ref.alias || [])].map(c => c.toLowerCase());
        const hit = crudo.some(t => {
          const tl = t.toLowerCase();
          if (!cods.includes(tl)) return false;
          return t !== tl || COD_SIEMPRE.includes(tl);
        });
        if (hit || (e.ref.cod === '---' && texto.includes('---'))) pts += 10;
        // "error de la puerta" → dE: palabras del nombre del error, cuando el texto habla de un error.
        if (tk.includes('error') || tk.includes('codigo')) {
          const sig = norm(e.ref.nombre).split(' ').filter(w => w.length > 3 && w !== 'error');
          pts += 3 * sig.filter(w => buscarTodas(tk, [w]).length).length;
        }
      }
      for (const c of e.claves) {
        if (c.length < 3 && e.tipo !== 'mensaje') continue;
        if (c.length >= 3 && buscarTodas(tk, [c]).length) pts += c.split(' ').length + 1;
      }
      if (pts) puntajes.push({ e, pts });
    }
    puntajes.sort((a, b) => b.pts - a.pts);
    return { pregunta, resultados: puntajes.slice(0, 3).map(x => x.e), mejor: puntajes[0] ? puntajes[0].pts : 0 };
  }

  // Suavizante y cloro, prenda por prenda.
  function respuestaProducto(ids) {
    return ids.map(id => PRENDA[id]).filter(p => p && !p.noLavar && !p.variantes).map(p => ({
      nombre: p.nombre,
      suavizante: { ok: p.suavizante !== false, txt: p.suavizante === false ? (p.suavizanteNota || 'No recomendado.') : 'Sí, opcional, sin pasar la línea MAX.' },
      cloro: { ok: !!p.cloro, txt: p.cloro ? 'Solo si es blanca de algodón y la etiqueta lo permite.' : (p.cloroNota || 'No.') }
    }));
  }

  return {
    veredictoSecado, respuestaMezcla, respuestaProducto, gruposColor, prendasValidas,
    leer, leerRespuesta, nuevoContexto, fusionar, faltante, recomendar, buscarGuia, norm,
    PRENDA, NOMBRE_CARGA, NOMBRE_COLOR, fmtT, fmtR, fmtKg
  };
})();
