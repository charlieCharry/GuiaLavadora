/* Datos de la lavasecadora LG WD14 (14 kg lavado / 8 kg secado).
   Fuentes: el manual LG MFL71766718 ("pag" = página impresa) y la foto del panel real del usuario
   (pag: 'panel'). El panel real es distinto al del manual: tiene Vapor, TurboWash, Retrasar fin y
   EcoHybrid, y temperaturas hasta 60 °C. Lo que no viene del manual está en datos-prendas.js. */

const TEMPS = ['Fría', '20', '30', '40', '50', '60'];
const RPMS = ['No', '400', '800', '1000', '1200', '1400'];

/* op.vapor y op.turbo son botones del panel real que el manual no trae: la disponibilidad por
   programa es deducida (si su luz no enciende, el programa no lo admite). 'auto' = ya lo incluye. */
const PROGRAMAS = {
  algodon: {
    nombre: 'Algodón', temp: { def: '40', disp: TEMPS }, rpm: { def: '1400', disp: RPMS },
    cargaMax: 14, op: { vapor: true, turbo: true, prelavado: true, enjuague: true, secado: true }, ai: true,
    desc: 'Lava ropa con suciedad normal combinando diferentes movimientos del tambor.',
    usos: 'Toallas, sábanas, ropa interior de algodón, trapos, jeans, uniformes.',
    nota: 'Si presionas Inicio/Pausa sin elegir programa, arranca Algodón con sus ajustes predeterminados.', pag: 28
  },
  algodonPlus: {
    nombre: 'Algodón+', temp: { def: '60', disp: TEMPS }, rpm: { def: '1400', disp: RPMS },
    cargaMax: 14, op: { vapor: true, turbo: true, prelavado: true, enjuague: true, secado: true },
    desc: 'Como Algodón, pero con menor consumo de energía que Algodón con ajustes comparables.',
    usos: 'Ropa de algodón con suciedad normal cuando quieres ahorrar energía.', pag: 28
  },
  turbowash: {
    nombre: 'TurboWash 59', temp: { def: '40', disp: TEMPS },
    rpm: { def: '1200', disp: ['400', '800', '1000', '1200', '1400'] },
    cargaMax: 5, minutos: 59, op: { vapor: false, turbo: 'auto', prelavado: true, enjuague: true, secado: true },
    desc: 'Termina todo el ciclo en 59 minutos sin sacrificar lavado ni cuidado de la ropa.',
    usos: 'Cuando tienes prisa y la carga es de hasta 5 kg.', pag: 28
  },
  mixtos: {
    nombre: 'Mixtos', temp: { def: '40', disp: TEMPS }, rpm: { def: '1000', disp: RPMS },
    cargaMax: 5, op: { vapor: true, turbo: true, prelavado: true, enjuague: true, secado: true }, ai: true,
    desc: 'Lava juntos varios tipos de tela.',
    usos: 'Ropa del día a día de distintas telas.',
    nota: 'El manual dice que NO es para: seda/delicadas, ropa deportiva, prendas oscuras, lana ni ropa de cama/cortinas.', pag: 28
  },
  sintetico: {
    nombre: 'Sintético', temp: { def: '40', disp: TEMPS }, rpm: { def: '1400', disp: RPMS },
    cargaMax: 5, op: { vapor: true, turbo: true, prelavado: true, enjuague: true, secado: true }, ai: true,
    desc: 'Prendas que no necesitan planchado: poliamida, acrílico, poliéster.',
    usos: 'Ropa deportiva, poliéster, sacos acrílicos, chaquetas sintéticas.', pag: 28
  },
  antialergico: {
    nombre: 'Antialérgico', vapor: true, temp: { def: '60', disp: ['60'] }, rpm: { def: '1400', disp: RPMS },
    cargaMax: 5, op: { vapor: 'auto', turbo: false, prelavado: false, enjuague: true, secado: true },
    desc: 'Ayuda a minimizar las sustancias que causan alergias.',
    usos: 'Algodón, ropa interior, fundas de almohada, sábanas, ropa de bebé.', pag: 28
  },
  infantil: {
    nombre: 'Cuidado Infantil con Vapor', corto: 'Cuidado Infantil', vapor: true, temp: { def: '60', disp: ['60'] },
    rpm: { def: '1000', disp: ['No', '400', '800', '1000'] },
    cargaMax: 4, op: { vapor: 'auto', turbo: false, prelavado: false, enjuague: true, secado: true },
    desc: 'Ayuda a quitar las manchas de comida en la ropa de bebé.',
    usos: 'Ropa de bebé con manchas de comida.', pag: 28
  },
  delicado: {
    nombre: 'Delicado', temp: { def: '20', disp: ['Fría', '20', '30', '40'] }, rpm: { def: '800', disp: ['No', '400', '800'] },
    cargaMax: 4, op: { vapor: false, turbo: false, prelavado: false, enjuague: true, secado: false },
    desc: 'Lencería, ropa transparente y de encaje lavable a máquina.',
    usos: 'Lencería, brasieres, blusas finas, cortinas, prendas con encaje.', pag: 28
  },
  lana: {
    nombre: 'Lavado a Mano/Lana', corto: 'Lana', temp: { def: '30', disp: ['Fría', '20', '30', '40'] },
    rpm: { def: '800', disp: ['No', '400', '800'] },
    cargaMax: 2, op: { vapor: false, turbo: false, prelavado: false, enjuague: true, secado: false },
    desc: 'Prendas lavables a mano o a máquina como lana, lencería, vestidos. Usa detergente para lanas.',
    usos: 'Suéteres de lana, seda, prendas con etiqueta "lavar a mano".', pag: 29
  },
  rapido: {
    nombre: 'Rápido 14', temp: { def: '20', disp: ['20', '30', '40'] }, rpm: { def: '400', disp: RPMS },
    cargaMax: 2, minutos: 14, op: { vapor: false, turbo: false, prelavado: false, enjuague: true, secado: true },
    desc: 'Cargas pequeñas con suciedad ligera en unos 14 minutos.',
    usos: 'Refrescar 2–3 prendas poco sucias.', pag: 29
  },
  soloSecado: {
    nombre: 'Sólo Secado', temp: null, rpm: { def: '-', disp: ['-', '1000', '1200', '1400'] },
    cargaMax: 8, op: { vapor: false, turbo: false, prelavado: false, enjuague: false, secado: 'auto' },
    desc: 'Programas automáticos de secado para la mayoría de cargas. Mejor si todas las prendas tienen grosor y tela parecidos.',
    usos: 'Secar ropa ya lavada (también la lavada en otro programa).', pag: 29
  },
  lavadoSecado: {
    nombre: 'Lavado+Secado', temp: { def: '40', disp: TEMPS }, rpm: { def: '1400', disp: ['1000', '1200', '1400'] },
    cargaMax: 8, op: { vapor: true, turbo: true, prelavado: true, enjuague: true, secado: 'auto' },
    desc: 'Lava y seca en el mismo programa. El secado viene incluido y no se puede quitar.',
    usos: 'Cargas de hasta 8 kg que quieres sacar secas.', pag: 29
  },
  limpiezaTambor: {
    nombre: 'Limpieza de Tambor', temp: null, rpm: null, cargaMax: 0,
    op: { vapor: false, turbo: false, prelavado: false, enjuague: false, secado: false },
    desc: 'Limpia el interior de la tina: remoja, lava, enjuaga y centrifuga. Sin ropa.',
    usos: 'Una vez al mes, o cuando aparezca tcL.', pag: 29
  },
  descarga: {
    nombre: 'Descarga de Ciclo', temp: null, rpm: null, cargaMax: 0,
    op: { vapor: false, turbo: false, prelavado: false, enjuague: false, secado: false },
    desc: 'Usa el ciclo especial que hayas descargado con la app LG ThinQ (solo guarda uno a la vez). Si no has descargado ninguno, es Enjuague+Centrifugado.',
    usos: 'Ciclos extra desde LG ThinQ.', pag: 29
  }
};

// Orden de la perilla según el manual (izquierda y derecha, de arriba a abajo).
const PERILLA = {
  izq: ['algodon', 'algodonPlus', 'turbowash', 'mixtos', 'sintetico', 'antialergico', 'infantil'],
  der: ['delicado', 'lana', 'rapido', 'soloSecado', 'lavadoSecado', 'limpiezaTambor', 'descarga']
};

const SECADO = {
  normal: { nombre: 'Normal', icono: 'secNormal', kg: 8, desc: 'Secado general. Reduce tiempo y consumo. Algodón o lino: toallas, camisetas.' },
  t30: { nombre: 'Tiempo 30 min', kg: 1, desc: 'Secado por tiempo fijo, hasta 1 kg (algodón, toallas).' },
  t60: { nombre: 'Tiempo 60 min', kg: 2, desc: 'Secado por tiempo fijo, hasta 2 kg (algodón, toallas).' },
  t120: { nombre: 'Tiempo 120 min', kg: 4, desc: 'Secado por tiempo fijo, hasta 4 kg (algodón, toallas).' },
  plancha: { nombre: 'Plancha', icono: 'secPlancha', kg: 8, desc: 'Deja la ropa apenas húmeda, lista para planchar. Algodón o lino.' },
  baja: { nombre: 'Temperatura baja', icono: 'secBaja', kg: 3.5, desc: 'Secado a baja temperatura, menos daño. Para telas delicadas. Máx. 3,5 kg.' }
};
// Orden en que cambia el botón Secado (manual págs. 33-34).
const CICLO_SECADO_LAVADO = [null, 'normal', 't30', 't60', 't120', 'plancha', 'baja'];
const CICLO_SECADO_SOLO = ['normal', 't30', 't60', 't120', 'plancha', 'baja'];

// Función escondida del botón Secado en el panel real. El manual no la trae: lo de abajo es deducido.
const ECOHYBRID = {
  nombre: 'EcoHybrid', icono: 'ecoE', kg: null, pag: 'panel', duda: true,
  desc: 'Mantén Secado 3 s. En la pantalla hay un recuadro con dos íconos: ⓔ (Eco) y la gota (con agua). Eco seca casi sin usar agua y ahorra recursos, pero tarda más; con la gota usa agua para condensar el vapor y seca más rápido. Mira cuál se enciende en tu lavadora al mantener Secado.'
};

const BOTONES = [
  {
    id: 'encendido', nombre: 'Encendido/Apagado', pag: 22,
    toque: 'Enciende o apaga la lavadora.',
    notas: [
      'Si no presionas Inicio/Pausa en un rato, se apaga sola y pierdes lo que configuraste.',
      'Apagar y volver a encender es la forma de "empezar de cero", por ejemplo si elegiste un programa y querías Sólo Secado o Sólo Centrifugado.',
      'Es el único botón que funciona con el Bloqueo infantil activo.'
    ],
    claves: ['encender', 'apagar', 'prender', 'encendido', 'apagado', 'power', 'resetear', 'reiniciar']
  },
  {
    id: 'perilla', nombre: 'Perilla de programas', pag: 22,
    toque: 'Gírala para elegir el programa. Se ilumina la luz del programa elegido.',
    notas: [
      'Cada programa trae su temperatura y centrifugado predeterminados; aparecen iluminados al elegirlo.',
      'Si presionas Inicio/Pausa sin girarla, arranca Algodón con sus ajustes predeterminados.'
    ],
    claves: ['perilla', 'rueda', 'selector', 'programa', 'programas', 'ciclo', 'ciclos']
  },
  {
    id: 'inicio', nombre: 'Inicio/Pausa', pag: 20,
    toque: 'Inicia el ciclo o lo pausa.',
    notas: [
      'Al iniciar, el tambor gira un momento sin agua para pesar la ropa: la pantalla parpadea o muestra --- mientras tanto.',
      'Si en pleno secado abres la puerta y sacas ropa, vuelve a presionar Inicio/Pausa.'
    ],
    claves: ['inicio', 'pausa', 'iniciar', 'arrancar', 'empezar', 'pausar', 'play']
  },
  {
    id: 'temperatura', nombre: 'Temperatura', pag: 'panel',
    toque: 'Cambia la temperatura del agua: Fría, 20, 30, 40, 50 o 60 °C. Solo se iluminan las que permite el programa.',
    mantener: 'Según el manual, recién encendida y sin tocar otro botón inicia el diagnóstico sonoro (Smart Diagnosis) para la app LG ThinQ. Acerca el micrófono del celular al botón de encendido.',
    claves: ['temperatura', 'grados', 'agua caliente', 'agua fria', 'calor', 'diagnostico', 'smart diagnosis']
  },
  {
    id: 'centrifugado', nombre: 'Centrifugado', pag: 'panel',
    toque: 'Cambia las revoluciones del centrifugado (No, 400, 800, 1000, 1200, 1400 rpm).',
    mantener: 'AVISOS SONOROS ON/OFF: silencia o vuelve a activar la melodía de inicio y fin.',
    contextos: [
      ['Con un programa de lavado elegido', 'Ajusta las rpm dentro del tope del programa (Delicado y Lana: máx. 800; Cuidado Infantil: máx. 1000; Lavado+Secado: mínimo 1000).'],
      ['Recién encendida, sin girar la perilla', 'Activa SOLO CENTRIFUGADO: exprime ropa mojada sin lavarla. Luego Inicio/Pausa.'],
      ['En Sólo Secado', 'Elige un centrifugado antes de secar: ninguno (-), 1000, 1200 o 1400.'],
      ['Si eliges "No"', 'No hay centrifugado final; según el manual, el tambor solo gira antes de drenar. La ropa sale muy mojada.']
    ],
    claves: ['centrifugado', 'centrifugar', 'rpm', 'revoluciones', 'exprimir', 'escurrir', 'velocidad', 'solo centrifugado', 'sonido', 'avisos sonoros', 'pitido', 'silencio', 'silenciar']
  },
  {
    id: 'vapor', nombre: 'Vapor', pag: 'panel', duda: true,
    toque: 'Agrega vapor al lavado: ayuda con manchas, olores y alérgenos. Se enciende la luz del botón. Si no enciende, el programa no lo admite.',
    mantener: 'ANTI ARRUGAS: al terminar, el tambor sigue girando de vez en cuando para que la ropa no se arrugue si no la sacas enseguida. Se enciende el ícono de la camisa con espiral.',
    combo: 'Vapor y TurboWash juntos 3 s: Pre-Lavado.',
    disponible: 'Deducido: Algodón, Algodón+, Mixtos, Sintético y Lavado+Secado. Antialérgico y Cuidado Infantil ya traen vapor. No en Delicado, Lana ni Rápido 14.',
    claves: ['vapor', 'steam', 'anti arrugas', 'antiarrugas', 'arrugas', 'prelavado', 'pre-lavado', 'pre lavado']
  },
  {
    id: 'turbowash', nombre: 'TurboWash', pag: 'panel', duda: true,
    toque: 'Acorta el ciclo con chorros de agua a presión, sin perder limpieza. Se enciende la luz del botón.',
    mantener: 'ENJUAGUE+: agrega un enjuague extra (alergias, piel sensible o mucho detergente). Se enciende el ícono de la tina con +.',
    combo: 'Vapor y TurboWash juntos 3 s: Pre-Lavado.',
    disponible: 'Enjuague+: todos los programas de lavado. TurboWash (toque), deducido: Algodón, Algodón+, Mixtos, Sintético y Lavado+Secado.',
    claves: ['turbowash', 'turbo', 'acortar', 'enjuague', 'enjuagar', 'enjuague+', 'enjuague extra', 'alergia', 'prelavado', 'pre-lavado']
  },
  {
    id: 'secado', nombre: 'Secado', pag: 33,
    toque: 'Elige el modo de secado. Cada toque pasa al siguiente.',
    mantener: 'ECOHYBRID: alterna el modo del recuadro de la pantalla: ⓔ Eco (casi sin agua, tarda más) o la gota (con agua, más rápido). Deducido del dibujo.',
    contextos: [
      ['Recién encendida, sin girar la perilla', 'Entra en SÓLO SECADO. Ciclo: Normal → Tiempo 30 → 60 → 120 min → Plancha → Temperatura baja.'],
      ['Con un programa de lavado elegido', 'Agrega secado al terminar el lavado. Mismo ciclo de modos.'],
      ['En Delicado o Lavado a Mano/Lana', 'No está disponible: esas prendas no deberían ir a la secadora en el mismo ciclo.'],
      ['En Sólo Secado o Lavado+Secado', 'El secado viene incluido y no se puede quitar; el botón solo cambia el modo.'],
      ['Si ya elegiste un programa y querías solo secar', 'No te dejará. Apaga y enciende, y presiona Secado sin girar la perilla.']
    ],
    claves: ['secado', 'secar', 'secadora', 'solo secado', 'secar solamente', 'modo secado', 'planchar', 'plancha', 'ecohybrid', 'eco hybrid', 'eco']
  },
  {
    id: 'retrasar', nombre: 'Retrasar fin', pag: 36,
    toque: 'Programa la hora a la que TERMINA el ciclo (no a la que empieza). Cada toque suma tiempo.',
    mantener: 'WI-FI: inicia la conexión con la app LG ThinQ (solo redes de 2,4 GHz).',
    combo: 'Retrasar fin y Añadir elemento juntos 3 s: Bloqueo infantil.',
    notas: [
      'Para cancelarlo hay que apagar la lavadora.',
      'No uses detergente líquido con Retrasar fin: se dispensa de una vez y se endurece.',
      'Pasado un rato se apagan casi todas las luces menos la de Retrasar fin. Es normal.'
    ],
    claves: ['retrasar fin', 'retrasar', 'tiempo diferido', 'diferido', 'programar', 'hora', 'temporizador', 'wifi', 'wi-fi', 'thinq', 'bloqueo']
  },
  {
    id: 'anadir', nombre: 'Añadir elemento', pag: 36,
    toque: 'Con el ciclo en marcha: pausa y desbloquea la puerta para meter o sacar ropa. Si el agua está alta o caliente, la puerta no abre (seguridad).',
    mantener: 'INICIO REMOTO: permite arrancar el ciclo desde la app LG ThinQ. Mientras esté activo, solo se puede iniciar desde la app.',
    combo: 'Retrasar fin y Añadir elemento juntos 3 s: Bloqueo infantil.',
    claves: ['anadir', 'añadir', 'anadir elemento', 'agregar ropa', 'meter ropa', 'olvide', 'abrir puerta', 'inicio remoto', 'remoto', 'bloqueo']
  }
];

// Íconos de la pantalla, en el orden del panel real.
const ICONOS_PANTALLA = [
  { id: 'ai', nombre: 'AI DD', pag: 23, desc: 'Detección inteligente de la carga: después de pesar la ropa elige los movimientos del tambor más adecuados. Solo aparece en Algodón, Mixtos y Sintético.', claves: ['ai', 'ai dd', 'inteligencia', 'cabeza'] },
  { id: 'faseLavado', nombre: 'Fase de lavado', pag: 23, desc: 'Indicador de fase (camisa en agua). La fase en curso parpadea; las que faltan quedan fijas; las terminadas se apagan. En pausa deja de parpadear.', claves: ['fase', 'lavado', 'camisa', 'estado'] },
  { id: 'faseCentrifugado', nombre: 'Fase de centrifugado', pag: 23, desc: 'Indicador de fase (camisa con espiral). Parpadea mientras está en curso.', duda: 'El manual solo dice que son indicadores de fase; el nombre lo deducimos del dibujo.', claves: ['fase', 'espiral', 'centrifugado', 'enjuague'] },
  { id: 'faseSecado', nombre: 'Fase de secado', pag: 23, desc: 'Indicador de fase (camisa con ondas de calor). Parpadea mientras seca.', duda: 'El manual solo dice que son indicadores de fase; el nombre lo deducimos del dibujo.', claves: ['fase', 'ondas', 'secado'] },
  { id: 'antiArrugas', nombre: 'Anti arrugas', pag: 'panel', desc: 'Anti arrugas activado (mantener Vapor 3 s): al terminar, el tambor gira de vez en cuando para que la ropa no se arrugue.', duda: 'Deducido del dibujo (camisa con espiral y vapor) y de la etiqueta del botón.', claves: ['anti arrugas', 'antiarrugas', 'arrugas', 'vapor', 'espiral'] },
  { id: 'enjuague', nombre: 'Enjuague+', pag: 'panel', desc: 'Enjuague extra activado (mantener TurboWash 3 s). Útil con alergias, piel sensible o si la ropa queda con detergente.', claves: ['enjuague', 'enjuague+', 'tina', 'mas', 'tina con mas'] },
  { id: 'prelavado', nombre: 'Pre-Lavado', pag: 24, desc: 'Pre-Lavado activado (Vapor y TurboWash juntos 3 s). Pon detergente también en el compartimento de prelavado.', claves: ['prelavado', 'pre-lavado', 'recipiente', 'vaso', 'cubeta'] },
  { id: 'wifi', nombre: 'Wi-Fi', pag: 24, desc: 'Conectada a la red Wi-Fi de tu casa (para LG ThinQ). Se configura manteniendo Retrasar fin 3 s.', claves: ['wifi', 'wi-fi', 'red', 'internet', 'antena'] },
  { id: 'puerta', nombre: 'Puerta bloqueada', pag: 24, desc: 'El ciclo comenzó y la puerta está trabada. Se puede abrir cuando este ícono se apague.', claves: ['llave', 'puerta', 'trabada', 'cerrada', 'no abre', 'candado'] },
  { id: 'secNormal', nombre: 'Secado Normal', pag: 33, desc: SECADO.normal.desc, claves: ['secado normal', 'camisa ondas'] },
  { id: 'secPlancha', nombre: 'Secado Plancha', pag: 33, desc: SECADO.plancha.desc, claves: ['plancha', 'planchar'] },
  { id: 'secBaja', nombre: 'Secado Temperatura baja', pag: 33, desc: SECADO.baja.desc, claves: ['temperatura baja', 'termometro', 'delicado secado'] },
  { id: 'ecoE', nombre: 'EcoHybrid: Eco', pag: 'panel', desc: 'Recuadro de EcoHybrid, ícono ⓔ: secado Eco, casi sin agua. Ahorra, pero tarda más. Se cambia manteniendo Secado 3 s.', duda: 'Deducido del dibujo y de cómo describe LG la función EcoHybrid.', claves: ['eco', 'ecohybrid', 'eco hybrid', 'e', 'ahorro'] },
  { id: 'ecoAgua', nombre: 'EcoHybrid: con agua', pag: 'panel', desc: 'Recuadro de EcoHybrid, ícono de la gota: secado que usa agua para condensar el vapor. Más rápido. Se cambia manteniendo Secado 3 s.', duda: 'Deducido del dibujo y de cómo describe LG la función EcoHybrid.', claves: ['gota', 'agua', 'ecohybrid', 'eco hybrid'] }
];

const MENSAJES = [
  { cod: '---', nombre: 'Pesando la carga', tipo: 'info', pag: 24, desc: 'Está detectando el peso de la ropa. Después muestra el tiempo estimado. Es normal.' },
  { cod: 'ENd', nombre: 'Fin', tipo: 'info', pag: 32, desc: 'Terminó el ciclo. Saca la ropa enseguida para que no se arrugue ni tome olor.' },
  { cod: 'Cd', nombre: 'Antiarrugas', tipo: 'info', pag: 32, desc: 'Terminó el secado y la ropa sigue adentro: la gira de vez en cuando hasta ~4 horas para evitar arrugas. Presiona cualquier botón y sácala.' },
  { cod: 'CL', nombre: 'Bloqueo infantil', tipo: 'info', pag: 36, desc: 'Panel bloqueado. Para quitarlo: Retrasar fin y Añadir elemento juntos por 3 s.' },
  { cod: 'tcL', nombre: 'Toca limpiar el tambor', tipo: 'info', pag: 42, desc: 'Recordatorio para correr Limpieza de Tambor (sin ropa).' },
  { cod: 'IE', alias: ['1E'], nombre: 'Error de entrada de agua', tipo: 'usuario', pag: 46, desc: 'No entra agua o entra muy lento.', pasos: ['Abre el grifo por completo.', 'Revisa que la manguera de entrada no esté doblada.', 'Prueba otro grifo de la casa (puede ser la presión).', 'Cierra el grifo y limpia el filtro de la manguera de entrada.'] },
  { cod: 'UE', nombre: 'Desequilibrio', tipo: 'usuario', pag: 46, desc: 'La ropa quedó mal repartida, la carga es muy pequeña o hay un solo artículo pesado (tapete, bata de baño).', pasos: ['Reacomoda la ropa.', 'Si es un solo artículo pesado, agrega 1 o 2 prendas parecidas.', 'Cierra la puerta y presiona Inicio/Pausa. Puede tardar unos minutos en volver a girar.'] },
  { cod: 'OE', nombre: 'Error de desagüe', tipo: 'usuario', pag: 47, desc: 'El agua no sale o sale muy lento.', pasos: ['Endereza y limpia la manguera de drenaje.', 'Limpia el filtro de la bomba de drenaje (ver Mantenimiento).'] },
  { cod: 'dE', alias: ['dE1', 'dE2', 'dE4'], nombre: 'Error de puerta', tipo: 'servicio', pag: 47, desc: 'Falla el sensor de la puerta.', pasos: ['Verifica que nada quede atrapado y que la puerta cierre bien.', 'Si sigue, llama al servicio técnico LG.'] },
  { cod: 'tE', nombre: 'Error de control', tipo: 'servicio', pag: 47, desc: 'Falla del control electrónico.', pasos: ['Desenchufa y llama al servicio técnico.'] },
  { cod: 'LE', nombre: 'Motor bloqueado', tipo: 'usuario', pag: 47, desc: 'Sobrecarga del motor.', pasos: ['Espera 30 minutos a que el motor se enfríe.', 'Reinicia el ciclo (quizá con menos ropa).'] },
  { cod: 'FE', nombre: 'Exceso de agua', tipo: 'servicio', pag: 47, desc: 'Se llenó de más, posible falla de la válvula.', pasos: ['Cierra el grifo.', 'Desenchufa.', 'Llama al servicio técnico.'] },
  { cod: 'PE', nombre: 'Sensor de presión', tipo: 'servicio', pag: 47, desc: 'El sensor de nivel de agua no funciona bien.', pasos: ['Cierra el grifo.', 'Desenchufa.', 'Llama al servicio técnico.'] },
  { cod: 'vS', nombre: 'Sensor de vibración', tipo: 'servicio', pag: 47, desc: 'El sensor de vibración no funciona bien.', pasos: ['Llama al servicio técnico.'] },
  { cod: 'FF', nombre: 'Congelación', tipo: 'usuario', pag: 47, desc: 'La manguera o la bomba se congelaron.', pasos: ['Pon agua caliente en el tambor.', 'Cubre la manguera de drenaje con una toalla húmeda y caliente.'] },
  { cod: 'AE', nombre: 'Fuga de agua', tipo: 'servicio', pag: 47, desc: 'Se detectó una fuga.', pasos: ['Llama al servicio técnico.'] },
  { cod: 'PF', nombre: 'Corte de energía', tipo: 'usuario', pag: 47, desc: 'Se fue la luz o hubo una falla eléctrica durante el ciclo.', pasos: ['Presiona Inicio/Pausa para reanudar.'] },
  { cod: 'dHE', nombre: 'Error de secado', tipo: 'servicio', pag: 47, desc: 'Solo el secado no funciona (el lavado sí).', pasos: ['Llama al servicio técnico.'] }
];

// Funciones escondidas: botones que se mantienen 3 s o se combinan (según el panel real).
const FUNCIONES = [
  { id: 'prelavado', nombre: 'Pre-Lavado', como: 'Elige el programa y MANTÉN Vapor y TurboWash juntos 3 s.', icono: 'prelavado', desc: 'Lavado previo para ropa muy sucia. Detergente también en el compartimento de prelavado; nada de detergente líquido.', pag: 'panel', claves: ['prelavado', 'pre-lavado', 'pre lavado'] },
  { id: 'enjuague', nombre: 'Enjuague+', como: 'MANTÉN TurboWash 3 s.', icono: 'enjuague', desc: 'Un enjuague extra. Recomendado con alergias, piel sensible o si la ropa queda con restos de detergente.', pag: 'panel', claves: ['enjuague', 'enjuague+', 'enjuague extra', 'enjuagar'] },
  { id: 'antiArrugas', nombre: 'Anti arrugas', como: 'MANTÉN Vapor 3 s.', icono: 'antiArrugas', desc: 'Al terminar, el tambor gira de vez en cuando para que la ropa no se arrugue si no la sacas enseguida.', pag: 'panel', duda: true, claves: ['anti arrugas', 'antiarrugas', 'arrugas', 'arrugada'] },
  { id: 'ecohybrid', nombre: 'EcoHybrid', como: 'Con Secado elegido, MANTÉN Secado 3 s.', icono: 'ecoE', desc: 'Cambia entre ⓔ Eco (casi sin agua, tarda más) y la gota (con agua, más rápido).', pag: 'panel', duda: true, claves: ['ecohybrid', 'eco hybrid', 'eco', 'ahorro secado'] },
  { id: 'bloqueo', nombre: 'Bloqueo infantil', como: 'MANTÉN Retrasar fin y Añadir elemento juntos 3 s (igual para quitarlo).', lcd: 'CL', desc: 'Bloquea todos los botones menos Encendido. En la pantalla aparece CL. Apagar o desenchufar no lo quita.', pag: 'panel', claves: ['bloqueo', 'bloquear', 'desbloquear', 'ninos', 'candado', 'cl', 'bloqueo infantil'] },
  { id: 'sonido', nombre: 'Avisos sonoros on/off', como: 'MANTÉN Centrifugado 3 s.', desc: 'Silencia o reactiva la melodía de inicio y fin.', pag: 'panel', claves: ['sonido', 'silenciar', 'pitido', 'melodia', 'ruido de aviso', 'callar', 'avisos sonoros'] },
  { id: 'wifi', nombre: 'Conectar Wi-Fi', como: 'MANTÉN Retrasar fin 3 s y sigue los pasos en LG ThinQ.', icono: 'wifi', desc: 'Conecta la lavadora a la app LG ThinQ. Solo redes de 2,4 GHz; nombre de red sin caracteres especiales.', pag: 38, claves: ['wifi', 'wi-fi', 'conectar', 'thinq', 'app lg'] },
  { id: 'remoto', nombre: 'Inicio remoto', como: 'Mete la ropa, enciende y MANTÉN Añadir elemento 3 s. Luego inicia desde LG ThinQ.', desc: 'Arranca el ciclo desde el celular. Mientras esté activo, solo se puede iniciar desde la app. Si abres la puerta, no se puede iniciar remotamente.', pag: 40, claves: ['remoto', 'inicio remoto', 'desde el celular'] },
  { id: 'diagnostico', nombre: 'Diagnóstico sonoro', como: 'Enciende (sin tocar nada más), acerca el celular al botón de encendido y MANTÉN Temperatura 3 s.', desc: 'Envía tonos a la app LG ThinQ (Smart Diagnosis) para diagnosticar fallas. Así lo indica el manual.', pag: 41, claves: ['diagnostico', 'smart diagnosis', 'falla', 'tonos'] },
  { id: 'soloSecado', nombre: 'Solo secar', como: 'Enciende y, SIN girar la perilla, presiona Secado hasta el modo que quieras. Inicio/Pausa. (O gira la perilla a Sólo Secado.)', desc: 'No pongas detergente. Si ya elegiste un programa, no te dejará: apaga y enciende.', pag: 34, claves: ['solo secar', 'solo secado', 'secar solamente', 'secar sin lavar', 'secar nada mas', 'seco solamente', 'solo seco', 'seco sin lavar', 'solo quiero secar', 'unicamente secar', 'como seco'] },
  { id: 'soloCentrifugado', nombre: 'Solo centrifugar', como: 'Enciende y, SIN girar la perilla, presiona Centrifugado. Inicio/Pausa.', desc: 'Para exprimir ropa mojada (lavada a mano, por ejemplo). No pongas detergente.', pag: 35, claves: ['solo centrifugar', 'solo centrifugado', 'exprimir', 'escurrir', 'centrifugar solamente', 'solo centrifugo', 'centrifugo solamente', 'como centrifugo'] },
  { id: 'lavarSecar', nombre: 'Lavar y secar seguido', como: 'Elige un programa de lavado y presiona Secado hasta el modo deseado. O usa el programa Lavado+Secado.', desc: 'La capacidad de secado (8 kg) es menor que la de lavado (14 kg): si lavaste una carga completa, saca la mitad antes de secar.', pag: 33, claves: ['lavar y secar', 'lavado y secado', 'lavado secado', 'lavar secar'] },
  { id: 'anadirRopa', nombre: 'Agregar ropa olvidada', como: 'Con el ciclo en marcha, toca Añadir elemento. Cuando la puerta se desbloquee, ábrela.', desc: 'Si el agua está alta o caliente, la puerta no abre.', pag: 36, claves: ['agregar ropa', 'se me olvido', 'meter una prenda', 'sacar una prenda'] },
  { id: 'retrasar', nombre: 'Que termine a cierta hora', como: 'Elige programa, toca Retrasar fin hasta las horas deseadas, Inicio/Pausa.', desc: 'El tiempo es hasta que TERMINA. Cancela apagando. Sin detergente líquido.', pag: 36, claves: ['retrasar fin', 'diferido', 'programar', 'que termine', 'dejar programada', 'temporizador'] },
  { id: 'descargaCiclo', nombre: 'Ciclos descargables', como: 'En LG ThinQ elige un ciclo y descárgalo; luego gira la perilla a Descarga de Ciclo.', desc: 'La lavadora guarda un solo ciclo descargado a la vez.', pag: 38, claves: ['descarga de ciclo', 'descargar', 'ciclo especial'] }
];

/* Gaveta (manual p. 26): al sacarla, el compartimento grande de la izquierda es el principal;
   a la derecha, atrás el de suavizante (flor y línea MAX) y adelante el de prelavado. */
const DISPENSADOR = [
  { nombre: 'Lavado principal', pos: 'principal', num: 1, desc: 'El grande, a la izquierda. Detergente del lavado (polvo o líquido). También cloro diluido, ablandador de agua y quitamanchas.', pag: 26, claves: ['detergente', 'principal', 'cloro', 'blanqueador', 'quitamanchas'] },
  { nombre: 'Prelavado', pos: 'prelavado', num: 2, desc: 'Adelante a la derecha. Detergente en polvo, solo si activas Pre-Lavado (Vapor y TurboWash juntos 3 s). Si no, déjalo vacío.', pag: 26, claves: ['prelavado', 'pre-lavado'] },
  { nombre: 'Suavizante', pos: 'suavizante', num: 3, desc: 'Atrás a la derecha, el de la flor. Se suelta solo en el último enjuague. No pases la línea MAX (se soltaría antes y mancharía). No lo dejes más de 1 día en la gaveta; si es muy espeso, dilúyelo.', pag: 26, claves: ['suavizante', 'flor', 'max'] },
  { nombre: 'Cápsulas o tabletas de detergente', pos: 'tambor', desc: 'Directo al fondo del tambor vacío, antes de la ropa. Nunca en la gaveta: ahí no se disuelven.', pag: 27, claves: ['capsulas', 'capsula', 'tabletas', 'pods'] },
  {
    nombre: 'Perlas de olor', pos: 'tambor', icono: 'perlas', general: true,
    desc: 'Potenciador de aroma (tipo Downy o Lenor en perlas). Solo da perfume: no reemplaza el detergente ni el suavizante.',
    lista: [
      'Cuándo: al inicio. Échalas al fondo del tambor vacío y luego mete la ropa encima.',
      'Nunca en la gaveta: se apelmazan y tapan los conductos.',
      'Cuánto: un cuarto de tapa para poca ropa, media tapa para media carga y una tapa con el tambor lleno.',
      'En agua fría (Fría o 20 °C) o en Rápido 14 se disuelven peor: disuélvelas antes en un vaso de agua tibia y échalo al tambor.',
      'Si se te olvidaron: al comienzo del lavado toca Añadir elemento, échalas sobre la ropa y continúa. No las agregues al final.',
      'Evítalas en lana, seda, plumas, ropa impermeable, ropa de bebé y si hay alergia o piel sensible. No sirven en Sólo Secado.'
    ],
    claves: ['perlas', 'perlas de olor', 'perlas de aroma', 'perlitas', 'aroma', 'aromatizante', 'potenciador de aroma', 'unstopables', 'perfume']
  },
  { nombre: 'Detergente líquido', pos: 'principal', desc: 'Va en el compartimento principal si inicias enseguida. No lo uses con Retrasar fin ni con Pre-Lavado: se dispensa de una vez y se endurece.', pag: 26, claves: ['liquido', 'detergente liquido'] },
  { nombre: 'Dosis', desc: 'Carga completa: la dosis que indica el fabricante. Media carga: la mitad. Carga mínima: un tercio. El exceso hace mucha espuma, enjuaga mal y fuerza el motor.', pag: 26, claves: ['dosis', 'cantidad', 'cuanto detergente'] },
  { nombre: 'Tipo de detergente', desc: 'Solo para lavadoras de carga frontal (alta eficiencia / HE). LG recomienda detergente neutro. Para blancos: polvo con blanqueador.', pag: 26, claves: ['tipo de detergente', 'he', 'alta eficiencia'] },
  { nombre: 'Lo que no se debe hacer', desc: 'No eches suavizante directo sobre la ropa (deja manchas oscuras). Nunca solventes como benceno. No abras la gaveta mientras entra agua.', pag: 27, claves: ['no hacer', 'manchas'] }
];

const MANTENIMIENTO = [
  { nombre: 'Después de cada lavado', cada: 'Siempre', pag: 42, pasos: ['Saca la ropa apenas termine.', 'Seca la puerta y el sello de goma con un paño; revisa que no queden objetos en el sello.', 'Deja la puerta entreabierta para que se seque el tambor (solo si no hay niños sin supervisión).'] },
  { nombre: 'Limpieza de Tambor', cada: 'Una vez al mes, o cuando salga tcL', pag: 42, pasos: ['Saca toda la ropa y cierra la puerta.', 'Pon descalcificador en el compartimento principal (o una tableta en el tambor).', 'Enciende, gira la perilla a Limpieza de Tambor y presiona Inicio/Pausa.', 'Al terminar, deja la puerta abierta para que se seque.', 'Si hay mal olor o moho: hazlo una vez por semana durante 3 semanas.'] },
  { nombre: 'Gaveta del detergente', cada: '1 o 2 veces al mes', pag: 45, pasos: ['Hálala hasta el tope, presiona el botón de desenganche y sácala.', 'Enjuágala con agua tibia (solo agua).', 'Limpia la abertura con un cepillo que no sea de metal y seca.'] },
  { nombre: 'Filtro de entrada de agua', cada: 'Cada 6 meses (más si el agua es dura)', pag: 43, pasos: ['Apaga y cierra el grifo.', 'Desenrosca la manguera de entrada.', 'Saca el filtro con pinzas pequeñas y límpialo con un cepillo de dientes.', 'Si aparece IE, puede ser este filtro.'] },
  { nombre: 'Filtro de la bomba de drenaje', cada: 'Cada 6 meses', pag: 44, pasos: ['Desenchufa y espera a que el agua se enfríe.', 'Abre la tapa inferior y saca el tubo de drenaje.', 'Quita el tapón del tubo y vacía el agua en un recipiente.', 'Desenrosca despacio el filtro, quita hilos y objetos y limpia con un cepillo.', 'Enrósca de nuevo con cuidado (sin cruzar la rosca), pon el tapón, guarda el tubo y cierra la tapa.'] },
  { nombre: 'Mangueras', cada: 'Revisar seguido; cambiar cada 5 años', pag: 7, pasos: ['Revisa que no tengan grietas ni fugas.', 'Si te vas de viaje, cierra los grifos.'] }
];
