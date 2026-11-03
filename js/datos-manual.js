/* Datos tomados del manual LG MFL71766718 (WD14WVC4S6 / WD14VVC4S6C / WD14PVC4S6C).
   "pag" = página impresa del manual. Todo lo que no venga del manual está en datos-prendas.js. */

const TEMPS = ['Fría', '20', '30', '40', '60', '95'];
const RPMS = ['No', '400', '800', '1000', '1200', '1400'];

const PROGRAMAS = {
  algodon: {
    nombre: 'Algodón', temp: { def: '40', disp: TEMPS }, rpm: { def: '1400', disp: RPMS },
    cargaMax: 14, op: { intensivo: true, prelavado: true, enjuague: true, secado: true }, ai: true,
    desc: 'Lava ropa con suciedad normal combinando diferentes movimientos del tambor.',
    usos: 'Toallas, sábanas, ropa interior de algodón, trapos, jeans, uniformes.',
    nota: 'Si presionas Inicio/Pausa sin elegir programa, arranca Algodón con sus ajustes predeterminados.', pag: 28
  },
  algodonPlus: {
    nombre: 'Algodón+', temp: { def: '60', disp: ['Fría', '20', '30', '40', '60'] }, rpm: { def: '1400', disp: RPMS },
    cargaMax: 14, op: { intensivo: false, prelavado: true, enjuague: true, secado: true },
    desc: 'Como Algodón, pero con menor consumo de energía que Algodón con ajustes comparables.',
    usos: 'Ropa de algodón con suciedad normal cuando quieres ahorrar energía.', pag: 28
  },
  turbowash: {
    nombre: 'TurboWash 59', temp: { def: '40', disp: ['Fría', '20', '30', '40', '60'] },
    rpm: { def: '1200', disp: ['400', '800', '1000', '1200', '1400'] },
    cargaMax: 5, minutos: 59, op: { intensivo: false, prelavado: true, enjuague: true, secado: true },
    desc: 'Termina todo el ciclo en 59 minutos sin sacrificar lavado ni cuidado de la ropa.',
    usos: 'Cuando tienes prisa y la carga es de hasta 5 kg.', pag: 28
  },
  mixtos: {
    nombre: 'Mixtos', temp: { def: '40', disp: ['Fría', '20', '30', '40', '60'] }, rpm: { def: '1000', disp: RPMS },
    cargaMax: 5, op: { intensivo: true, prelavado: true, enjuague: true, secado: true }, ai: true,
    desc: 'Lava juntos varios tipos de tela.',
    usos: 'Ropa del día a día de distintas telas.',
    nota: 'El manual dice que NO es para: seda/delicadas, ropa deportiva, prendas oscuras, lana ni ropa de cama/cortinas.', pag: 28
  },
  sintetico: {
    nombre: 'Sintético', temp: { def: '40', disp: ['Fría', '20', '30', '40', '60'] }, rpm: { def: '1400', disp: RPMS },
    cargaMax: 5, op: { intensivo: true, prelavado: true, enjuague: true, secado: true }, ai: true,
    desc: 'Prendas que no necesitan planchado: poliamida, acrílico, poliéster.',
    usos: 'Ropa deportiva, poliéster, sacos acrílicos, chaquetas sintéticas.', pag: 28
  },
  antialergico: {
    nombre: 'Antialérgico', vapor: true, temp: { def: '60', disp: ['60'] }, rpm: { def: '1400', disp: RPMS },
    cargaMax: 5, op: { intensivo: true, prelavado: false, enjuague: true, secado: true },
    desc: 'Ayuda a minimizar las sustancias que causan alergias.',
    usos: 'Algodón, ropa interior, fundas de almohada, sábanas, ropa de bebé.', pag: 28
  },
  infantil: {
    nombre: 'Cuidado Infantil con Vapor', corto: 'Cuidado Infantil', vapor: true, temp: { def: '60', disp: ['60'] },
    rpm: { def: '1000', disp: ['No', '400', '800', '1000'] },
    cargaMax: 4, op: { intensivo: true, prelavado: false, enjuague: true, secado: true },
    desc: 'Ayuda a quitar las manchas de comida en la ropa de bebé.',
    usos: 'Ropa de bebé con manchas de comida.', pag: 28
  },
  delicado: {
    nombre: 'Delicado', temp: { def: '20', disp: ['Fría', '20', '30', '40'] }, rpm: { def: '800', disp: ['No', '400', '800'] },
    cargaMax: 4, op: { intensivo: true, prelavado: false, enjuague: true, secado: false },
    desc: 'Lencería, ropa transparente y de encaje lavable a máquina.',
    usos: 'Lencería, brasieres, blusas finas, cortinas, prendas con encaje.', pag: 28
  },
  lana: {
    nombre: 'Lavado a Mano/Lana', corto: 'Lana', temp: { def: '30', disp: ['Fría', '20', '30', '40'] },
    rpm: { def: '800', disp: ['No', '400', '800'] },
    cargaMax: 2, op: { intensivo: true, prelavado: false, enjuague: true, secado: false },
    desc: 'Prendas lavables a mano o a máquina como lana, lencería, vestidos. Usa detergente para lanas.',
    usos: 'Suéteres de lana, seda, prendas con etiqueta "lavar a mano".', pag: 29
  },
  rapido: {
    nombre: 'Rápido 14', temp: { def: '20', disp: ['20', '30', '40'] }, rpm: { def: '400', disp: RPMS },
    cargaMax: 2, minutos: 14, op: { intensivo: false, prelavado: false, enjuague: true, secado: true },
    desc: 'Cargas pequeñas con suciedad ligera en unos 14 minutos.',
    usos: 'Refrescar 2–3 prendas poco sucias.', pag: 29
  },
  soloSecado: {
    nombre: 'Sólo Secado', temp: null, rpm: { def: '-', disp: ['-', '1000', '1200', '1400'] },
    cargaMax: 8, op: { intensivo: false, prelavado: false, enjuague: false, secado: 'auto' },
    desc: 'Programas automáticos de secado para la mayoría de cargas. Mejor si todas las prendas tienen grosor y tela parecidos.',
    usos: 'Secar ropa ya lavada (también la lavada en otro programa).', pag: 29
  },
  lavadoSecado: {
    nombre: 'Lavado+Secado', temp: { def: '40', disp: TEMPS }, rpm: { def: '1400', disp: ['1000', '1200', '1400'] },
    cargaMax: 8, op: { intensivo: true, prelavado: true, enjuague: true, secado: 'auto' },
    desc: 'Lava y seca en el mismo programa. El secado viene incluido y no se puede quitar.',
    usos: 'Cargas de hasta 8 kg que quieres sacar secas.', pag: 29
  },
  limpiezaTambor: {
    nombre: 'Limpieza de Tambor', temp: null, rpm: null, cargaMax: 0,
    op: { intensivo: false, prelavado: false, enjuague: false, secado: false },
    desc: 'Limpia el interior de la tina: remoja, lava, enjuaga y centrifuga. Sin ropa.',
    usos: 'Una vez al mes, o cuando aparezca tcL.', pag: 29
  },
  descarga: {
    nombre: 'Descarga de Ciclo', temp: null, rpm: null, cargaMax: 0,
    op: { intensivo: false, prelavado: false, enjuague: false, secado: false },
    desc: 'Usa el ciclo especial que hayas descargado con la app LG ThinQ (solo guarda uno a la vez). Si no has descargado ninguno, es Enjuague+Centrifugado.',
    usos: 'Ciclos extra desde LG ThinQ.', pag: 29
  }
};

// Orden real de la perilla (izquierda y derecha, de arriba a abajo).
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
  baja: { nombre: 'Temperatura baja', icono: 'secBaja', kg: 3.5, desc: 'Secado a baja temperatura, menos daño. Para telas delicadas. Máx. 3,5 kg.' },
  eco: { nombre: 'Normal Eco', icono: 'secEco', kg: 8, soloSecado: true, desc: 'Secado de bajo consumo para algodón, lino y telas más pesadas. Solo existe en Sólo Secado.' }
};
// Orden en que cambia el botón Secado (manual págs. 33-34).
const CICLO_SECADO_LAVADO = [null, 'normal', 't30', 't60', 't120', 'plancha', 'baja'];
const CICLO_SECADO_SOLO = ['normal', 't30', 't60', 't120', 'plancha', 'baja', 'eco'];

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
    id: 'temperatura', nombre: 'Temperatura', pag: 23,
    toque: 'Cambia la temperatura del agua (Fría, 20, 30, 40, 60, 95 °C). Solo muestra las que permite el programa.',
    mantener: 'Recién encendida y sin tocar otro botón: inicia el diagnóstico sonoro (Smart Diagnosis) para la app LG ThinQ. Acerca el micrófono del celular al botón de encendido.',
    claves: ['temperatura', 'grados', 'agua caliente', 'agua fria', 'calor', 'diagnostico', 'smart diagnosis']
  },
  {
    id: 'centrifugado', nombre: 'Centrifugado', pag: 31,
    toque: 'Cambia las revoluciones del centrifugado (No, 400, 800, 1000, 1200, 1400 rpm).',
    contextos: [
      ['Con un programa de lavado elegido', 'Ajusta las rpm dentro del tope del programa (Delicado y Lana: máx. 800; Cuidado Infantil: máx. 1000; Lavado+Secado: mínimo 1000).'],
      ['Recién encendida, sin girar la perilla', 'Activa SOLO CENTRIFUGADO: exprime ropa mojada sin lavarla. Luego Inicio/Pausa.'],
      ['En Sólo Secado', 'Elige un centrifugado antes de secar: ninguno (-), 1000, 1200 o 1400.'],
      ['Si eliges "No"', 'No hay centrifugado final; según el manual, el tambor solo gira antes de drenar. La ropa sale muy mojada.']
    ],
    claves: ['centrifugado', 'centrifugar', 'rpm', 'revoluciones', 'exprimir', 'escurrir', 'velocidad', 'solo centrifugado']
  },
  {
    id: 'intensivo', nombre: 'Intensivo', pag: 34,
    toque: 'Lavado más fuerte para ropa con suciedad normal a abundante. Se enciende su luz.',
    mantener: 'PRE-LAVADO: agrega un lavado previo para ropa muy sucia. Se enciende el ícono del recipiente. Pon detergente también en el compartimento de prelavado (no uses detergente líquido).',
    disponible: 'Intensivo: Algodón, Mixtos, Sintético, Antialérgico, Cuidado Infantil, Delicado, Lana, Lavado+Secado. Pre-Lavado: Algodón, Algodón+, TurboWash 59, Mixtos, Sintético, Lavado+Secado.',
    claves: ['intensivo', 'prelavado', 'pre-lavado', 'pre lavado', 'muy sucio', 'remojo']
  },
  {
    id: 'enjuague', nombre: 'Enjuague+', pag: 34,
    toque: 'Agrega un enjuague extra. Recomendado si hay alergia o piel sensible a los detergentes.',
    combo: 'Enjuague+ y Secado juntos por 3 s: activa o desactiva los sonidos.',
    disponible: 'Todos los programas de lavado (no en Sólo Secado).',
    claves: ['enjuague', 'enjuagar', 'enjuague+', 'enjuague extra', 'alergia', 'sonido', 'pitido', 'silencio']
  },
  {
    id: 'secado', nombre: 'Secado', pag: 33,
    toque: 'Elige el modo de secado. Cada toque pasa al siguiente.',
    contextos: [
      ['Recién encendida, sin girar la perilla', 'Entra en SÓLO SECADO. Ciclo: Normal → Tiempo 30 → 60 → 120 min → Plancha → Temperatura baja → Normal Eco.'],
      ['Con un programa de lavado elegido', 'Agrega secado al terminar el lavado. Ciclo: Normal → Tiempo 30/60/120 → Plancha → Temperatura baja (sin Normal Eco).'],
      ['En Delicado o Lavado a Mano/Lana', 'No está disponible: esas prendas no deberían ir a la secadora en el mismo ciclo.'],
      ['En Sólo Secado o Lavado+Secado', 'El secado viene incluido y no se puede quitar; el botón solo cambia el modo.'],
      ['Si ya elegiste un programa y querías solo secar', 'No te dejará. Apaga y enciende, y presiona Secado sin girar la perilla.']
    ],
    combo: 'Enjuague+ y Secado juntos por 3 s: activa o desactiva los sonidos.',
    claves: ['secado', 'secar', 'secadora', 'solo secado', 'secar solamente', 'modo secado', 'planchar', 'plancha']
  },
  {
    id: 'diferido', nombre: 'Tiempo Diferido', pag: 36,
    toque: 'Programa la hora a la que TERMINA el ciclo (no a la que empieza). Cada toque suma tiempo.',
    mantener: 'WI-FI: inicia la conexión con la app LG ThinQ (solo redes de 2,4 GHz).',
    combo: 'Tiempo Diferido y Añadir Elemento juntos por 3 s: Bloqueo infantil.',
    notas: [
      'Para cancelarlo hay que apagar la lavadora.',
      'No uses detergente líquido con Tiempo Diferido: se dispensa de una vez y se endurece.',
      'A los 20 minutos se apagan todas las luces menos la de Tiempo Diferido. Es normal.'
    ],
    claves: ['tiempo diferido', 'diferido', 'programar', 'retrasar', 'hora', 'temporizador', 'wifi', 'wi-fi', 'thinq', 'bloqueo']
  },
  {
    id: 'anadir', nombre: 'Añadir Elemento', pag: 36,
    toque: 'Con el ciclo en marcha: pausa y desbloquea la puerta para meter o sacar ropa. Si el agua está alta o caliente, la puerta no abre (seguridad).',
    mantener: 'INICIO REMOTO: permite arrancar el ciclo desde la app LG ThinQ. Mientras esté activo, solo se puede iniciar desde la app.',
    combo: 'Tiempo Diferido y Añadir Elemento juntos por 3 s: Bloqueo infantil.',
    claves: ['anadir', 'añadir', 'agregar ropa', 'meter ropa', 'olvide', 'abrir puerta', 'inicio remoto', 'remoto', 'bloqueo']
  }
];

const ICONOS_PANTALLA = [
  { id: 'ai', nombre: 'AI DD', pag: 23, desc: 'Detección inteligente de la carga: después de pesar la ropa elige los movimientos del tambor más adecuados. Solo aparece en Algodón, Mixtos y Sintético.', claves: ['ai', 'ai dd', 'inteligencia', 'cabeza'] },
  { id: 'faseLavado', nombre: 'Fase de lavado', pag: 23, desc: 'Indicador de fase (camisa en agua). La fase en curso parpadea; las que faltan quedan fijas; las terminadas se apagan. En pausa deja de parpadear.', claves: ['fase', 'lavado', 'camisa', 'estado'] },
  { id: 'faseCentrifugado', nombre: 'Fase de centrifugado', pag: 23, desc: 'Indicador de fase (camisa con espiral). Parpadea mientras está en curso.', duda: 'El manual solo dice que son indicadores de fase; el nombre lo deducimos del dibujo.', claves: ['fase', 'espiral', 'centrifugado', 'enjuague'] },
  { id: 'faseSecado', nombre: 'Fase de secado', pag: 23, desc: 'Indicador de fase (camisa con ondas de calor). Parpadea mientras seca.', duda: 'El manual solo dice que son indicadores de fase; el nombre lo deducimos del dibujo.', claves: ['fase', 'ondas', 'secado'] },
  { id: 'sonidoOff', nombre: 'Sonido apagado', pag: 24, desc: 'Los avisos sonoros están desactivados. Se cambia con Enjuague+ y Secado juntos por 3 s.', claves: ['sonido', 'parlante', 'bocina', 'silencio', 'mute', 'altavoz'] },
  { id: 'prelavado', nombre: 'Pre-Lavado', pag: 24, desc: 'Pre-Lavado activado (mantener Intensivo 3 s).', claves: ['prelavado', 'recipiente', 'vaso', 'cubeta'] },
  { id: 'bloqueo', nombre: 'Bloqueo infantil', pag: 24, desc: 'Panel bloqueado: solo funciona Encendido. En la pantalla alterna CL con el tiempo. Se quita con Tiempo Diferido y Añadir Elemento juntos por 3 s. Desenchufar NO lo quita.', claves: ['candado', 'bloqueo', 'nino', 'infantil', 'cl', 'carita'] },
  { id: 'wifi', nombre: 'Wi-Fi', pag: 24, desc: 'Conectada a la red Wi-Fi de tu casa (para LG ThinQ). Se configura manteniendo Tiempo Diferido 3 s.', claves: ['wifi', 'wi-fi', 'red', 'internet', 'antena'] },
  { id: 'remoto', nombre: 'Inicio remoto', pag: 24, desc: 'Control remoto activo: el ciclo solo se puede iniciar desde la app LG ThinQ. Se activa o quita manteniendo Añadir Elemento 3 s.', claves: ['remoto', 'control remoto', 'play', 'ondas'] },
  { id: 'puerta', nombre: 'Puerta bloqueada', pag: 24, desc: 'El ciclo comenzó y la puerta está trabada. Se puede abrir cuando este ícono se apague.', claves: ['llave', 'puerta', 'trabada', 'cerrada', 'no abre'] },
  { id: 'secNormal', nombre: 'Secado Normal', pag: 33, desc: SECADO.normal.desc, claves: ['secado normal', 'camisa ondas'] },
  { id: 'secPlancha', nombre: 'Secado Plancha', pag: 33, desc: SECADO.plancha.desc, claves: ['plancha', 'planchar'] },
  { id: 'secBaja', nombre: 'Secado Temperatura baja', pag: 33, desc: SECADO.baja.desc, claves: ['temperatura baja', 'termometro', 'delicado secado'] },
  { id: 'secEco', nombre: 'Secado Normal Eco', pag: 33, desc: SECADO.eco.desc, claves: ['eco', 'normal eco', 'hoja', 'ahorro'] }
];

const MENSAJES = [
  { cod: '---', nombre: 'Pesando la carga', tipo: 'info', pag: 24, desc: 'Está detectando el peso de la ropa. Después muestra el tiempo estimado. Es normal.' },
  { cod: 'ENd', nombre: 'Fin', tipo: 'info', pag: 32, desc: 'Terminó el ciclo. Saca la ropa enseguida para que no se arrugue ni tome olor.' },
  { cod: 'Cd', nombre: 'Antiarrugas', tipo: 'info', pag: 32, desc: 'Terminó el secado y la ropa sigue adentro: la gira de vez en cuando hasta ~4 horas para evitar arrugas. Presiona cualquier botón y sácala.' },
  { cod: 'CL', nombre: 'Bloqueo infantil', tipo: 'info', pag: 36, desc: 'Panel bloqueado. Para quitarlo: Tiempo Diferido y Añadir Elemento juntos por 3 s.' },
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

const FUNCIONES = [
  { id: 'prelavado', nombre: 'Pre-Lavado', como: 'Elige el programa y MANTÉN Intensivo 3 s.', icono: 'prelavado', desc: 'Lavado previo para ropa muy sucia. Detergente también en el compartimento de prelavado; nada de detergente líquido.', pag: 36, claves: ['prelavado', 'pre-lavado', 'pre lavado'] },
  { id: 'bloqueo', nombre: 'Bloqueo infantil', como: 'MANTÉN Tiempo Diferido y Añadir Elemento juntos 3 s (igual para quitarlo).', icono: 'bloqueo', desc: 'Bloquea todos los botones menos Encendido. Aparece CL. Apagar o desenchufar no lo quita.', pag: 36, claves: ['bloqueo', 'bloquear', 'desbloquear', 'ninos', 'candado', 'cl'] },
  { id: 'sonido', nombre: 'Sonidos on/off', como: 'MANTÉN Enjuague+ y Secado juntos 3 s.', icono: 'sonidoOff', desc: 'Silencia o reactiva la melodía de inicio y fin.', pag: 36, claves: ['sonido', 'silenciar', 'pitido', 'melodia', 'ruido de aviso', 'callar'] },
  { id: 'wifi', nombre: 'Conectar Wi-Fi', como: 'MANTÉN Tiempo Diferido 3 s y sigue los pasos en LG ThinQ.', icono: 'wifi', desc: 'Conecta la lavadora a la app LG ThinQ. Solo redes de 2,4 GHz; nombre de red sin caracteres especiales.', pag: 38, claves: ['wifi', 'wi-fi', 'conectar', 'thinq', 'app lg'] },
  { id: 'remoto', nombre: 'Inicio remoto', como: 'Mete la ropa, enciende y MANTÉN Añadir Elemento 3 s. Luego inicia desde LG ThinQ.', icono: 'remoto', desc: 'Arranca el ciclo desde el celular. Mientras esté activo, solo se puede iniciar desde la app. Si abres la puerta, no se puede iniciar remotamente.', pag: 40, claves: ['remoto', 'inicio remoto', 'desde el celular'] },
  { id: 'diagnostico', nombre: 'Diagnóstico sonoro', como: 'Enciende (sin tocar nada más), acerca el celular al botón de encendido y MANTÉN Temperatura 3 s.', desc: 'Envía tonos a la app LG ThinQ (Smart Diagnosis) para diagnosticar fallas.', pag: 41, claves: ['diagnostico', 'smart diagnosis', 'falla', 'tonos'] },
  { id: 'soloSecado', nombre: 'Solo secar', como: 'Enciende y, SIN girar la perilla, presiona Secado hasta el modo que quieras. Inicio/Pausa. (O gira la perilla a Sólo Secado.)', desc: 'No pongas detergente. Si ya elegiste un programa, no te dejará: apaga y enciende.', pag: 34, claves: ['solo secar', 'solo secado', 'secar solamente', 'secar sin lavar', 'secar nada mas', 'seco solamente', 'solo seco', 'seco sin lavar', 'solo quiero secar', 'unicamente secar', 'como seco'] },
  { id: 'soloCentrifugado', nombre: 'Solo centrifugar', como: 'Enciende y, SIN girar la perilla, presiona Centrifugado. Inicio/Pausa.', desc: 'Para exprimir ropa mojada (lavada a mano, por ejemplo). No pongas detergente.', pag: 35, claves: ['solo centrifugar', 'solo centrifugado', 'exprimir', 'escurrir', 'centrifugar solamente', 'solo centrifugo', 'centrifugo solamente', 'como centrifugo'] },
  { id: 'lavarSecar', nombre: 'Lavar y secar seguido', como: 'Elige un programa de lavado y presiona Secado hasta el modo deseado. O usa el programa Lavado+Secado.', desc: 'La capacidad de secado (8 kg) es menor que la de lavado (14 kg): si lavaste una carga completa, saca la mitad antes de secar.', pag: 33, claves: ['lavar y secar', 'lavado y secado', 'lavado secado', 'lavar secar'] },
  { id: 'anadirRopa', nombre: 'Agregar ropa olvidada', como: 'Con el ciclo en marcha, toca Añadir Elemento. Cuando la puerta se desbloquee, ábrela.', desc: 'Si el agua está alta o caliente, la puerta no abre.', pag: 36, claves: ['agregar ropa', 'se me olvido', 'meter una prenda', 'sacar una prenda'] },
  { id: 'diferido', nombre: 'Que termine a cierta hora', como: 'Elige programa, toca Tiempo Diferido hasta las horas deseadas, Inicio/Pausa.', desc: 'El tiempo es hasta que TERMINA. Cancela apagando. Sin detergente líquido.', pag: 36, claves: ['diferido', 'programar', 'que termine', 'dejar programada', 'temporizador'] },
  { id: 'descargaCiclo', nombre: 'Ciclos descargables', como: 'En LG ThinQ elige un ciclo y descárgalo; luego gira la perilla a Descarga de Ciclo.', desc: 'La lavadora guarda un solo ciclo descargado a la vez.', pag: 38, claves: ['descarga de ciclo', 'descargar', 'ciclo especial'] }
];

const DISPENSADOR = [
  { nombre: 'Compartimento principal', desc: 'Detergente del lavado principal. También ablandador de agua, cloro y quitamanchas.', pag: 26 },
  { nombre: 'Compartimento de prelavado', desc: 'Detergente para el prelavado. Solo si activas Pre-Lavado.', pag: 26 },
  { nombre: 'Compartimento de suavizante', desc: 'Suavizante líquido. Se dispensa solo en el último enjuague. No pases la línea MAX (se soltaría antes y mancharía). No lo dejes más de 1 día en la gaveta; si es muy espeso, dilúyelo.', pag: 26 },
  { nombre: 'Tabletas o cápsulas', desc: 'Directo al tambor, antes de la ropa. Nunca en el dispensador.', pag: 27 },
  { nombre: 'Detergente líquido', desc: 'Va en el compartimento principal si inicias enseguida. No lo uses con Tiempo Diferido ni con Pre-Lavado.', pag: 26 },
  { nombre: 'Dosis', desc: 'Carga completa: la dosis que indica el fabricante. Media carga: la mitad. Carga mínima: un tercio. El exceso hace mucha espuma, enjuaga mal y fuerza el motor.', pag: 26 },
  { nombre: 'Tipo de detergente', desc: 'Solo para lavadoras de carga frontal (alta eficiencia / HE). LG recomienda detergente neutro. Para blancos: polvo con blanqueador.', pag: 26 },
  { nombre: 'Lo que no se debe hacer', desc: 'No eches suavizante directo sobre la ropa (deja manchas oscuras). Nunca solventes como benceno. No abras la gaveta mientras entra agua.', pag: 27 }
];

const MANTENIMIENTO = [
  { nombre: 'Después de cada lavado', cada: 'Siempre', pag: 42, pasos: ['Saca la ropa apenas termine.', 'Seca la puerta y el sello de goma con un paño; revisa que no queden objetos en el sello.', 'Deja la puerta entreabierta para que se seque el tambor (solo si no hay niños sin supervisión).'] },
  { nombre: 'Limpieza de Tambor', cada: 'Una vez al mes, o cuando salga tcL', pag: 42, pasos: ['Saca toda la ropa y cierra la puerta.', 'Pon descalcificador en el compartimento principal (o una tableta en el tambor).', 'Enciende, gira la perilla a Limpieza de Tambor y presiona Inicio/Pausa.', 'Al terminar, deja la puerta abierta para que se seque.', 'Si hay mal olor o moho: hazlo una vez por semana durante 3 semanas.'] },
  { nombre: 'Gaveta del detergente', cada: '1 o 2 veces al mes', pag: 45, pasos: ['Hálala hasta el tope, presiona el botón de desenganche y sácala.', 'Enjuágala con agua tibia (solo agua).', 'Limpia la abertura con un cepillo que no sea de metal y seca.'] },
  { nombre: 'Filtro de entrada de agua', cada: 'Cada 6 meses (más si el agua es dura)', pag: 43, pasos: ['Apaga y cierra el grifo.', 'Desenrosca la manguera de entrada.', 'Saca el filtro con pinzas pequeñas y límpialo con un cepillo de dientes.', 'Si aparece IE, puede ser este filtro.'] },
  { nombre: 'Filtro de la bomba de drenaje', cada: 'Cada 6 meses', pag: 44, pasos: ['Desenchufa y espera a que el agua se enfríe.', 'Abre la tapa inferior y saca el tubo de drenaje.', 'Quita el tapón del tubo y vacía el agua en un recipiente.', 'Desenrosca despacio el filtro, quita hilos y objetos y limpia con un cepillo.', 'Enrósca de nuevo con cuidado (sin cruzar la rosca), pon el tapón, guarda el tubo y cierra la tapa.'] },
  { nombre: 'Mangueras', cada: 'Revisar seguido; cambiar cada 5 años', pag: 7, pasos: ['Revisa que no tengan grietas ni fugas.', 'Si te vas de viaje, cierra los grifos.'] }
];
