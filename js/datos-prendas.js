/* Base de conocimiento general de cuidado textil (no viene del manual LG).
   Se combina con los límites del manual (programas, cargas, secado) en motor.js.
   temp: temperatura recomendada según el color de la carga. rpm: centrifugado recomendado.
   secado: modo recomendado ('normal' | 'plancha' | 'baja') o false si no debe ir a la secadora.
   grupo: prendas del mismo grupo se pueden lavar juntas en una misma tanda. */

const T = (blanco, claro, color, oscuro) => ({ blanco, claro, color, oscuro });

const PRENDAS = [
  {
    id: 'toallas', nombre: 'Toallas', emoji: '🛁', comun: true, grupo: 'toallas', kg: 0.6,
    programa: 'algodon', temp: T('60', '40', '40', '40'), tempMax: '60', rpm: '1400',
    secado: 'normal', secadoManual: 33, suavizante: false, cloro: true,
    secadoInfo: 'Sí van a la secadora: el manual pone las toallas de algodón como ejemplo de secado Normal y por tiempo. Quedan más suaves que tendidas. Solo evítala si la etiqueta tacha la secadora (algunas de bambú, decorativas o con hilos metálicos).',
    suavizanteNota: 'El suavizante recubre las fibras y las toallas absorben menos. Para que queden suaves: centrifugado alto y secado Normal.',
    prep: ['Lávalas sin otra ropa: sueltan mucha pelusa.', 'Las nuevas destiñen las primeras veces: lávalas aparte.'],
    avisos: ['Si quedan ásperas, casi siempre es exceso de detergente: usa menos y activa Enjuague+.'],
    claves: ['toalla', 'toallon', 'toallita', 'toalla de bano', 'toalla de mano', 'toalla de playa', 'toalla playera', 'bata de bano', 'levantadora']
  },
  {
    id: 'tapete', nombre: 'Tapete de baño', emoji: '🟫', comun: true, grupo: 'tapete', kg: 1.0,
    programa: 'algodon', temp: T('40', '40', '40', '30'), tempMax: '40', rpm: '800',
    secado: false, secadoNota: 'Si tiene base de goma o plástico (lo más común), el manual prohíbe secarlo en la máquina. Tiéndelo.',
    suavizante: false, cloro: false,
    prep: ['Sacúdelo bien antes de meterlo.', 'Lávalo con 1 o 2 toallas: un solo artículo pesado desequilibra el tambor (error UE).'],
    avisos: ['Alfombras grandes no: deben caber holgadas en el tambor.', 'El agua muy caliente reseca la goma de la base.'],
    claves: ['tapete', 'tapete de bano', 'alfombra de bano', 'alfombrilla', 'alfombra', 'tapetico']
  },
  {
    id: 'trapos', nombre: 'Trapos y limpiones de cocina', emoji: '🧽', comun: true, grupo: 'trapos', kg: 0.1,
    programa: 'algodon', temp: T('60', '60', '60', '60'), tempMax: '95', rpm: '1400', intensivo: true,
    secado: 'normal', suavizante: false, cloro: true,
    secadoNota: 'Si tenían aceite de cocina: el manual pide lavarlos en agua caliente con detergente extra antes de secar. Si después todavía huelen a aceite, NO los seques en la máquina (riesgo de incendio).',
    prep: ['Lávalos solos: la grasa y la suciedad pasan a la ropa.', 'Sacude migas y restos antes.'],
    avisos: [],
    claves: ['trapo', 'limpion', 'pano de cocina', 'pano', 'bayetilla', 'toalla de cocina', 'dulce abrigo', 'trapito', 'repasador', 'secador de platos']
  },
  {
    id: 'microfibra', nombre: 'Paños de microfibra', emoji: '🧼', grupo: 'microfibra', kg: 0.05,
    programa: 'sintetico', temp: T('40', '40', '40', '40'), tempMax: '60', rpm: '1000',
    secado: 'baja', suavizante: false, cloro: false,
    suavizanteNota: 'El suavizante tapa las microfibras y dejan de limpiar.',
    prep: ['No los mezcles con algodón: atrapan toda la pelusa.'],
    avisos: [],
    claves: ['microfibra', 'pano de microfibra', 'toalla de microfibra', 'toalla deportiva de microfibra']
  },
  {
    id: 'sabanas', nombre: 'Sábanas y fundas', emoji: '🛏️', comun: true, grupo: 'cama', kg: 0.6,
    programa: 'algodon', temp: T('60', '40', '40', '30'), tempMax: '60', rpm: '1200',
    secado: 'normal', suavizante: true, cloro: true, alergia: 'antialergico',
    prep: ['Voltea las fundas al revés y cierra cremalleras o botones (si no, todo se enrolla adentro).', 'No llenes el tambor: deben poder moverse.'],
    avisos: [],
    claves: ['sabana', 'funda', 'funda de almohada', 'juego de cama', 'ropa de cama', 'tendido', 'tendidos', 'sobresabana', 'funda de edredon']
  },
  {
    id: 'sabanasFinas', nombre: 'Sábanas finas (alto hilaje, percal o satín de algodón)', emoji: '🛏️', grupo: 'cama', kg: 0.7,
    programa: 'algodon', temp: T('40', '40', '30', '30'), tempMax: '60', rpm: '800',
    secado: 'plancha', secadoInfo: 'Sí, pero sin resecarlas: el modo Plancha las deja apenas húmedas; estíralas y casi no necesitan plancha. El exceso de calor debilita la fibra larga y arruga.',
    suavizante: false, cloro: false, detergente: 'líquido suave',
    suavizanteNota: 'Recubre la fibra: pierden frescura y transpirabilidad. El algodón de fibra larga se ablanda solo con los lavados.',
    cloroNota: 'El cloro debilita la fibra larga y amarillea con el tiempo; para mantenerlas blancas usa blanqueador con oxígeno.',
    prep: ['Lávalas antes del primer uso.', 'Sin toallas: la pelusa y el roce les sacan motas.', 'Máximo 1 o 2 juegos por tanda: así no se enredan ni se arrugan.', 'Las de satín (satén) de algodón, al revés.', 'Cierra la funda del edredón y los botones de las fundas.'],
    avisos: ['Más hilos = tela más fina, no más resistente: 40 °C y 800 rpm las cuidan sin perder limpieza. Si hay alergias y la etiqueta lo permite, puedes subir a 60 °C de vez en cuando.', 'Sácalas apenas termine el ciclo y estíralas.'],
    claves: ['sabanas finas', 'percal', 'alto hilaje', 'satin de algodon', 'saten de algodon', 'algodon egipcio', 'algodon pima', 'supima', 'sabana de hilos']
  },
  {
    id: 'protector', nombre: 'Protector de colchón', emoji: '🛏️', grupo: 'cama', kg: 0.8,
    programa: 'algodon', temp: T('40', '40', '40', '40'), tempMax: '60', rpm: '800',
    secado: false, secadoNota: 'Si es impermeable, el manual prohíbe secar telas impermeables en esta máquina. Tiéndelo.',
    suavizante: false, cloro: false,
    prep: ['Revisa la etiqueta: algunos son solo para lavar a mano.'],
    avisos: [],
    claves: ['protector de colchon', 'protector', 'cubrecolchon', 'forro de colchon', 'protector impermeable']
  },
  {
    id: 'cobijas', nombre: 'Cobijas y mantas', emoji: '🧣', comun: true, grupo: 'cama', kg: 1.5,
    programa: 'algodon', temp: T('30', '30', '30', '30'), tempMax: '40', rpm: '800', enjuague: true,
    secado: 'baja', secadoNota: 'Temperatura baja si son polares o sintéticas. Algodón puro: Normal. El manual advierte que algunas mantas encogen con aire caliente: revisa la etiqueta.',
    suavizante: false, cloro: false,
    suavizanteNota: 'En cobijas polares el suavizante apelmaza el pelo y quita lo esponjoso.',
    prep: ['Máximo 1 o 2 por tanda: tienen que moverse libremente.'],
    avisos: [],
    claves: ['cobija', 'manta', 'frazada', 'cobertor', 'plaid', 'cobija polar', 'manta polar', 'cobijita']
  },
  {
    id: 'edredon', nombre: 'Edredón o cubrelecho', emoji: '🛌', comun: true, grupo: 'edredon', kg: 2.5, solo: true,
    programa: 'algodon', temp: T('30', '30', '30', '30'), tempMax: '40', rpm: '800', enjuague: true,
    secado: 'baja', secadoNota: 'Relleno sintético o de plumas: Temperatura baja (máx. 3,5 kg); sácalo y sacúdelo a mitad de secado y termina al aire si hace falta. Si tiene gomaespuma, NO lo seques (manual).',
    suavizante: false, cloro: false, detergente: 'líquido suave, poca cantidad',
    suavizanteNota: 'Apelmaza el relleno.',
    prep: ['Debe caber holgado: si queda apretado en el tambor, mejor llévalo a una lavandería.', 'Uno por tanda.'],
    avisos: ['Tu lavadora no trae un programa específico para edredones; en LG ThinQ › Descarga de Ciclo puedes revisar si hay uno para ropa de cama.'],
    claves: ['edredon', 'plumon', 'cubrelecho', 'acolchado', 'nordico', 'duvet', 'colcha', 'cubrecama']
  },
  {
    id: 'almohadas', nombre: 'Almohadas y cojines', emoji: '💤', grupo: 'almohadas', kg: 0.8, solo: true,
    programa: 'algodon', temp: T('30', '30', '30', '30'), tempMax: '40', rpm: '800', enjuague: true,
    secado: 'baja', secadoNota: 'Solo las de fibra o plumas. Las de espuma, látex o viscoelásticas NO se lavan ni se secan en la máquina (manual: gomaespuma).',
    suavizante: false, cloro: false,
    prep: ['Lava 2 a la vez para equilibrar el tambor.', 'Revisa la etiqueta del relleno.'],
    avisos: [],
    claves: ['almohada', 'cojin', 'almohadon']
  },
  {
    id: 'jeans', nombre: 'Jeans', emoji: '👖', comun: true, grupo: 'diaria', kg: 0.7,
    programa: 'algodon', temp: T('40', '30', '30', '30'), tempMax: '40', rpm: '1000',
    secado: 'normal', secadoNota: 'Si tienen licra (stretch), mejor Temperatura baja o al aire: el calor afloja el elástico.',
    suavizante: true, cloro: false,
    prep: ['Voltéalos al revés y cierra cremallera y botón: conservan el color.', 'Las primeras lavadas destiñen: solos o con ropa oscura.'],
    avisos: [],
    claves: ['jean', 'bluejean', 'blue jean', 'vaquero', 'mezclilla', 'denim', 'chaqueta de jean', 'chaqueta de mezclilla', 'falda de jean']
  },
  {
    id: 'pantalones', nombre: 'Pantalones, faldas y shorts de tela', emoji: '👖', grupo: 'diaria', kg: 0.5,
    programa: 'mixtos', temp: T('40', '30', '30', '30'), tempMax: '40', rpm: '800',
    secado: 'plancha', suavizante: true, cloro: false,
    prep: ['Al revés y con los bolsillos vacíos.'],
    avisos: ['Centrifugado moderado = menos arrugas.'],
    claves: ['pantalon', 'dril', 'chino', 'pantalon de vestir', 'falda', 'short', 'bermuda', 'pantalon de tela']
  },
  {
    id: 'camisetas', nombre: 'Camisetas y polos', emoji: '👕', comun: true, grupo: 'diaria', kg: 0.2,
    programa: 'mixtos', temp: T('40', '40', '30', '30'), tempMax: '60', rpm: '1000',
    secado: 'normal', secadoManual: 33, secadoNota: 'El algodón puede encoger un poco: si te quedan justas, usa Temperatura baja.',
    suavizante: true, cloro: true,
    prep: ['Las estampadas, al revés.'],
    avisos: [],
    claves: ['camiseta', 'franela', 'polo', 'tshirt', 't-shirt', 'esqueleto', 'top', 'camisilla', 'remera', 'playera']
  },
  {
    id: 'camisas', nombre: 'Camisas y blusas', emoji: '👔', comun: true, grupo: 'diaria', kg: 0.25,
    programa: 'mixtos', temp: T('40', '30', '30', '30'), tempMax: '40', rpm: '800',
    secado: 'plancha', suavizante: true, cloro: false,
    prep: ['Desabotónalas (también los botones del cuello).', 'Cuellos y puños: frota antes con un poco de detergente.'],
    avisos: ['Sácalas apenas termine para que no se arruguen.'],
    claves: ['camisa', 'blusa', 'camisa de vestir', 'guayabera', 'camisa formal']
  },
  {
    id: 'interior', nombre: 'Ropa interior y medias', emoji: '🩲', comun: true, grupo: 'diaria', kg: 0.08,
    programa: 'algodon', temp: T('60', '40', '40', '30'), tempMax: '60', rpm: '1200',
    secado: 'normal', suavizante: true, cloro: true, alergia: 'antialergico',
    prep: ['En bolsa de malla: el manual la recomienda para medias, ropa interior y calcetines (se meten entre el tambor y el sello).'],
    avisos: [],
    claves: ['ropa interior', 'interiores', 'calzoncillo', 'boxer', 'panty', 'panti', 'cucos', 'calzon', 'medias', 'calcetin', 'tobillera', 'tanga']
  },
  {
    id: 'pijamas', nombre: 'Pijamas', emoji: '😴', grupo: 'diaria', kg: 0.4,
    programa: 'mixtos', temp: T('40', '30', '30', '30'), tempMax: '40', rpm: '1000',
    secado: 'baja', suavizante: true, cloro: false,
    prep: [], avisos: [],
    claves: ['pijama', 'piyama', 'bata de dormir', 'camison', 'pijamas']
  },
  {
    id: 'sueteres', nombre: 'Sacos, suéteres y buzos', emoji: '🧥', comun: true, grupo: 'sintetica', kg: 0.5,
    programa: 'sintetico', temp: T('30', '30', '30', '30'), tempMax: '40', rpm: '800',
    secado: 'baja', secadoNota: 'O sécalos extendidos para que no se estiren.',
    suavizante: true, cloro: false,
    prep: ['Al revés, para que no salgan motas.', 'No los laves con toallas (pelusa).'],
    avisos: ['Si son de lana, cambia a "Lana".'],
    claves: ['saco', 'sueter', 'buzo', 'buso', 'hoodie', 'cardigan', 'canguro', 'chaleco tejido', 'sudadera de capota']
  },
  {
    id: 'deportiva', nombre: 'Ropa deportiva', emoji: '🏃', comun: true, grupo: 'sintetica', kg: 0.2,
    programa: 'sintetico', temp: T('30', '30', '30', '30'), tempMax: '40', rpm: '1000',
    secado: 'baja', secadoNota: 'O al aire. El calor alto daña la licra.',
    suavizante: false, cloro: false, detergente: 'líquido, poca cantidad',
    suavizanteNota: 'Tapa los poros de las telas técnicas: dejan de absorber el sudor y guardan el olor.',
    prep: ['Al revés.', 'No la guardes sudada muchos días antes de lavar: el olor se fija.'],
    avisos: [],
    claves: ['deportiva', 'ropa deportiva', 'dry fit', 'dryfit', 'licra', 'lycra', 'leggins', 'leggings', 'pantaloneta', 'top deportivo', 'uniforme deportivo', 'ropa de gimnasio', 'ropa de gym', 'ciclismo', 'camiseta de futbol', 'sudadera', 'conjunto deportivo', 'malla deportiva']
  },
  {
    id: 'brasieres', nombre: 'Brasieres', emoji: '👙', comun: true, grupo: 'delicada', kg: 0.1,
    programa: 'delicado', temp: T('30', '30', '30', '20'), tempMax: '30', rpm: '400',
    secado: false, secadoNota: 'El calor deforma aros, copas y elásticos.',
    suavizante: true, cloro: false,
    prep: ['Abróchalos y mételos en bolsa de malla (el manual pide atar los tirantes largos o usar malla).'],
    avisos: [],
    claves: ['brasier', 'brassier', 'brasiere', 'sosten', 'bra', 'corpino']
  },
  {
    id: 'lenceria', nombre: 'Lencería y encaje', emoji: '🎀', grupo: 'delicada', kg: 0.05,
    programa: 'delicado', temp: T('20', '20', '20', 'Fría'), tempMax: '30', rpm: '400',
    secado: false, suavizante: true, cloro: false, detergente: 'líquido para delicados',
    prep: ['En bolsa de malla, llena a menos de la mitad (manual).'],
    avisos: [],
    claves: ['lenceria', 'encaje', 'babydoll', 'transparente', 'tul', 'liguero', 'body de encaje']
  },
  {
    id: 'seda', nombre: 'Seda y satín', emoji: '🪭', grupo: 'delicada', kg: 0.15,
    programa: 'lana', temp: T('Fría', 'Fría', 'Fría', 'Fría'), tempMax: '20', rpm: '400',
    secado: false, suavizante: false, cloro: false, detergente: 'neutro, para delicados',
    prep: ['Solo si la etiqueta permite lavadora o lavado a mano; si dice limpieza en seco, a la tintorería.', 'Al revés y en bolsa de malla.'],
    avisos: ['El manual clasifica la seda como "lavar únicamente a mano": por eso el programa Lavado a Mano/Lana.'],
    claves: ['seda', 'saten', 'satin', 'chiffon', 'gasa', 'crepe']
  },
  {
    id: 'pantimedias', nombre: 'Pantimedias y medias veladas', emoji: '🦵', grupo: 'delicada', kg: 0.03,
    programa: 'delicado', temp: T('20', '20', '20', '20'), tempMax: '30', rpm: '400',
    secado: false, suavizante: true, cloro: false,
    prep: ['En bolsa de malla (lo recomienda el manual).'],
    avisos: [],
    claves: ['pantimedia', 'media velada', 'medias veladas', 'panty media', 'pantyhose', 'medias de nylon']
  },
  {
    id: 'banio', nombre: 'Vestidos de baño', emoji: '🩱', grupo: 'delicada', kg: 0.1,
    programa: 'delicado', temp: T('Fría', 'Fría', 'Fría', 'Fría'), tempMax: '20', rpm: '400',
    secado: false, secadoNota: 'El calor destruye la licra. Sécalo a la sombra.',
    suavizante: false, cloro: false,
    prep: ['Enjuágalo con agua fría apenas lo uses (cloro de piscina o sal de mar).'],
    avisos: [],
    claves: ['vestido de bano', 'traje de bano', 'bikini', 'banador', 'pantaloneta de bano', 'enterizo de bano']
  },
  {
    id: 'lana', nombre: 'Prendas de lana', emoji: '🧶', comun: true, grupo: 'lana', kg: 0.4,
    programa: 'lana', temp: T('30', '30', '30', '20'), tempMax: '30', rpm: '800',
    secado: false, secadoNota: 'El manual dice no secar lana en la máquina: estírala a su forma y sécala extendida en horizontal.',
    suavizante: false, cloro: false, detergente: 'para lanas (lo pide el manual)',
    suavizanteNota: 'No hace falta: usa detergente para lanas.',
    prep: ['Solo si la etiqueta permite lavadora o lavado a mano.', 'Al revés. Máximo 2 kg por tanda.'],
    avisos: [],
    claves: ['lana', 'merino', 'cachemir', 'cashmere', 'alpaca', 'angora', 'mohair', 'sueter de lana', 'saco de lana', 'ruana']
  },
  {
    id: 'chaqueta', nombre: 'Chaqueta', emoji: '🧥', comun: true, grupo: 'sintetica', kg: 0.7,
    pregunta: '¿De qué es la chaqueta?',
    variantes: [
      ['chaquetaNormal', 'Algodón o sintética normal'],
      ['chaquetaImpermeable', 'Impermeable / rompevientos'],
      ['chaquetaPlumas', 'Plumas o acolchada'],
      ['jeans', 'De jean'],
      ['pano', 'Paño o lana'],
      ['cuero', 'Cuero o gamuza']
    ],
    claves: ['chaqueta', 'chamarra', 'abrigo', 'campera', 'chompa', 'casaca', 'gabardina', 'chaquetas']
  },
  {
    id: 'chaquetaNormal', nombre: 'Chaqueta de algodón o sintética', emoji: '🧥', grupo: 'sintetica', kg: 0.7,
    programa: 'sintetico', temp: T('30', '30', '30', '30'), tempMax: '40', rpm: '800',
    secado: 'baja', suavizante: true, cloro: false,
    prep: ['Cierra cremalleras y velcros; vacía bolsillos; quita pines y broches.', 'Al revés.'],
    avisos: [],
    claves: []
  },
  {
    id: 'chaquetaImpermeable', nombre: 'Chaqueta impermeable o rompevientos', emoji: '🌧️', grupo: 'impermeable', kg: 0.6, solo: true,
    programa: 'sintetico', temp: T('30', '30', '30', '30'), tempMax: '30', rpm: '800', enjuague: true,
    secado: false, secadoNota: 'El manual prohíbe secar telas impermeables en esta máquina. Cuélgala.',
    suavizante: false, cloro: false, detergente: 'líquido suave, poca cantidad',
    suavizanteNota: 'Tapa la membrana y deja de ser impermeable y transpirable.',
    prep: ['Cierra todas las cremalleras y velcros.', 'Enjuague+ quita restos de detergente que afectan la impermeabilidad.'],
    avisos: [],
    claves: ['impermeable', 'rompevientos', 'gore-tex', 'goretex', 'chaqueta impermeable', 'chaqueta de lluvia', 'chubasquero']
  },
  {
    id: 'chaquetaPlumas', nombre: 'Chaqueta de plumas o acolchada', emoji: '🧥', grupo: 'plumas', kg: 0.8, solo: true,
    programa: 'delicado', temp: T('30', '30', '30', '30'), tempMax: '30', rpm: '800', enjuague: true,
    secado: 'baja', secadoNota: 'Solo si la etiqueta lo permite. Sácala y sacúdela a mitad de secado para soltar grumos; termina al aire.',
    suavizante: false, cloro: false, detergente: 'líquido suave (ideal para plumas)',
    suavizanteNota: 'Apelmaza las plumas y pierden abrigo.',
    prep: ['Cierra cremalleras. Una o dos por tanda.'],
    avisos: [],
    claves: ['chaqueta de plumas', 'plumas', 'pluma', 'acolchada', 'parka', 'puffer', 'chaqueta inflada', 'chaqueta de plumon', 'chaqueta acolchada']
  },
  {
    id: 'pano', nombre: 'Abrigo de paño o lana', emoji: '🧥', grupo: 'lana', kg: 1.2,
    programa: 'lana', temp: T('Fría', 'Fría', 'Fría', 'Fría'), tempMax: '20', rpm: '400',
    secado: false, secadoNota: 'Sécalo extendido o en gancho ancho.',
    suavizante: false, cloro: false, detergente: 'para lanas',
    prep: ['Casi todos los abrigos de paño son de tintorería. Solo lávalo si la etiqueta muestra tina o mano.'],
    avisos: ['El programa Lana admite máximo 2 kg.'],
    claves: ['abrigo de pano', 'abrigo de lana', 'gaban', 'chaqueta de pano']
  },
  {
    id: 'cuero', nombre: 'Cuero, gamuza o cuerina', emoji: '🚫', noLavar: true, grupo: 'cuero', kg: 1,
    desc: 'No se lava ni se seca en lavadora: el agua y el calor lo cuartean o lo encogen. Llévalo a limpieza especializada o límpialo con un paño húmedo.',
    claves: ['cuero', 'gamuza', 'ante', 'cuerina', 'ecocuero', 'piel sintetica', 'charol']
  },
  {
    id: 'cortinas', nombre: 'Cortinas', emoji: '🪟', comun: true, grupo: 'cortinas', kg: 1.0, solo: true,
    programa: 'delicado', temp: T('30', '30', '30', '30'), tempMax: '30', rpm: '400',
    secado: false, secadoNota: 'Cuélgalas húmedas en su sitio: se estiran solas. Las plásticas o de baño nunca a la secadora (manual).',
    suavizante: true, cloro: false,
    prep: ['Quita ganchos, argollas y pesas.'],
    avisos: [],
    claves: ['cortina', 'visillo', 'velo', 'cortina de bano', 'persiana de tela']
  },
  {
    id: 'manteles', nombre: 'Manteles y servilletas', emoji: '🍽️', grupo: 'cama', kg: 0.5,
    programa: 'algodon', temp: T('60', '40', '40', '30'), tempMax: '60', rpm: '1000', intensivo: true,
    secado: 'plancha', secadoNota: 'Los plastificados nunca a la secadora (manual).',
    suavizante: true, cloro: true,
    prep: ['Trata antes las manchas de comida o vino.'],
    avisos: [],
    claves: ['mantel', 'individual de tela', 'servilleta', 'camino de mesa', 'manteles']
  },
  {
    id: 'bebe', nombre: 'Ropa de bebé', emoji: '🍼', comun: true, grupo: 'bebe', kg: 0.1, solo: true,
    programa: 'infantil', temp: T('60', '60', '60', '60'), tempMax: '60', rpm: '1000', enjuague: true,
    secado: 'normal', secadoNota: 'Prendas delicadas o con estampado: Temperatura baja. Baberos con plástico: no se secan (manual).',
    suavizante: false, cloro: false, detergente: 'hipoalergénico, sin perfume',
    suavizanteNota: 'La piel del bebé es sensible; si lo usas, que sea uno especial para bebé.',
    prep: ['Trata antes las manchas de comida.', 'Lávala aparte de la ropa de los adultos.'],
    avisos: ['Cuidado Infantil lava siempre a 60 °C. Si alguna prenda destiñe o es delicada, lávala en Delicado a 30 °C.'],
    claves: ['bebe', 'ropa de bebe', 'body', 'bodies', 'mameluco', 'panalero', 'babero', 'panal de tela', 'cobija de bebe', 'ropita']
  },
  {
    id: 'trabajo', nombre: 'Uniformes y ropa de trabajo', emoji: '🦺', grupo: 'trabajo', kg: 0.7,
    programa: 'algodon', temp: T('60', '40', '40', '40'), tempMax: '60', rpm: '1200', intensivo: true,
    secado: 'normal', suavizante: true, cloro: true,
    prep: ['Lávala aparte de la ropa diaria.', 'Delantales con plástico: no se secan (manual).'],
    avisos: [],
    claves: ['uniforme', 'overol', 'dotacion', 'ropa de trabajo', 'bata de laboratorio', 'bata medica', 'filipina', 'delantal', 'uniforme del colegio']
  },
  {
    id: 'peluches', nombre: 'Peluches', emoji: '🧸', grupo: 'peluches', kg: 0.3, solo: true,
    programa: 'delicado', temp: T('30', '30', '30', '30'), tempMax: '30', rpm: '400',
    secado: false, secadoNota: 'El relleno tarda en secar: al aire, en un lugar ventilado.',
    suavizante: true, cloro: false,
    prep: ['Dentro de una funda de almohada cerrada o bolsa de malla.', 'Solo si no tienen pilas, sonidos ni partes pegadas.'],
    avisos: [],
    claves: ['peluche', 'muneco de peluche', 'osito', 'muneco', 'peluches']
  },
  {
    id: 'tenis', nombre: 'Tenis de tela', emoji: '👟', grupo: 'tenis', kg: 0.8, solo: true,
    programa: 'lana', temp: T('Fría', 'Fría', 'Fría', 'Fría'), tempMax: '30', rpm: '400',
    secado: false, secadoNota: 'El calor despega las suelas. Sécalos al aire con papel adentro.',
    suavizante: false, cloro: false,
    prep: ['Sin cordones ni plantillas, dentro de una bolsa de malla.', 'Agrega 2 o 3 toallas viejas para amortiguar y equilibrar.', 'Solo tenis de tela o lona; de cuero, no.'],
    avisos: ['El manual de LG no menciona calzado: hazlo con precaución.'],
    claves: ['tenis', 'zapatillas', 'zapatos', 'calzado', 'converse', 'zapatos deportivos']
  },
  {
    id: 'mascotas', nombre: 'Cosas de mascota', emoji: '🐾', grupo: 'mascotas', kg: 1.0, solo: true,
    programa: 'algodon', temp: T('40', '40', '40', '40'), tempMax: '60', rpm: '1000', enjuague: true,
    secado: 'normal', secadoNota: 'Camas con espuma: NO a la secadora (manual: gomaespuma).',
    suavizante: false, cloro: false,
    prep: ['Quita los pelos antes con cepillo o rodillo: tapan el filtro de la bomba.'],
    avisos: ['Después haz una Limpieza de Tambor (pelos y bacterias).'],
    claves: ['mascota', 'perro', 'gato', 'cama del perro', 'cama de perro', 'manta del perro', 'ropa de perro', 'cama del gato']
  },
  {
    id: 'gorras', nombre: 'Gorras', emoji: '🧢', grupo: 'delicada', kg: 0.1,
    programa: 'delicado', temp: T('Fría', 'Fría', 'Fría', 'Fría'), tempMax: '30', rpm: '400',
    secado: false, secadoNota: 'Pierden la forma. Sécalas sobre algo redondo.',
    suavizante: false, cloro: false,
    prep: ['Las de visera rígida se deforman: mejor a mano.', 'Si la metes, en bolsa de malla.'],
    avisos: [],
    claves: ['gorra', 'cachucha', 'cachuchas', 'visera']
  },
  {
    id: 'morral', nombre: 'Morrales y bolsos de tela', emoji: '🎒', grupo: 'morral', kg: 0.7, solo: true,
    programa: 'delicado', temp: T('30', '30', '30', '30'), tempMax: '30', rpm: '400',
    secado: false, suavizante: false, cloro: false,
    prep: ['Vacíalos, quita marcos o partes metálicas y mételos al revés en una funda.', 'Agrega 1 o 2 toallas para equilibrar.'],
    avisos: [],
    claves: ['morral', 'mochila', 'maleta', 'bolso', 'lonchera', 'cartuchera']
  },
  {
    id: 'lino', nombre: 'Ropa de lino', emoji: '🌾', grupo: 'diaria', kg: 0.3,
    programa: 'mixtos', temp: T('40', '40', '30', '30'), tempMax: '40', rpm: '800',
    secado: 'plancha', secadoManual: 33, secadoInfo: 'Sí, en Plancha (el manual lo nombra para lino): sale apenas húmedo, que es como mejor se plancha. Secarlo del todo lo arruga mucho.',
    suavizante: true, cloro: true,
    prep: ['Al revés.', 'La primera lavada puede encoger un poco.'],
    avisos: ['Centrifugado bajo = menos arrugas, que en el lino son difíciles de quitar.'],
    claves: ['lino', 'camisa de lino', 'pantalon de lino', 'vestido de lino']
  },
  {
    id: 'viscosa', nombre: 'Viscosa, rayón o modal', emoji: '👗', grupo: 'delicada', kg: 0.25,
    programa: 'delicado', temp: T('30', '30', '30', '20'), tempMax: '30', rpm: '400',
    secado: false, secadoNota: 'Encoge mucho con el calor y se deforma: sécala colgada o extendida.',
    suavizante: true, cloro: false,
    prep: ['Al revés y sin apretar el tambor: mojada es frágil.'],
    avisos: ['Muchas blusas y vestidos "frescos" son de viscosa: revisa la etiqueta.'],
    claves: ['viscosa', 'rayon', 'modal', 'challis', 'chalis']
  },
  {
    id: 'lentejuelas', nombre: 'Prendas con lentejuelas, pedrería o bordados', emoji: '✨', grupo: 'delicada', kg: 0.3,
    programa: 'delicado', temp: T('20', '20', '20', 'Fría'), tempMax: '30', rpm: '400',
    secado: false, secadoNota: 'El calor despega apliques y deforma el bordado. Sécala extendida.',
    suavizante: false, cloro: false, detergente: 'líquido para delicados',
    prep: ['Al revés y dentro de una bolsa de malla.', 'Nada de cremalleras ni ganchos abiertos cerca: se enganchan.'],
    avisos: ['Si la etiqueta dice limpieza en seco, a la tintorería.'],
    claves: ['lentejuela', 'pedreria', 'aplique', 'bordado', 'chaquira', 'canutillo']
  },
  {
    id: 'termica', nombre: 'Ropa térmica', emoji: '🧊', grupo: 'sintetica', kg: 0.2,
    programa: 'sintetico', temp: T('30', '30', '30', '30'), tempMax: '40', rpm: '800',
    secado: 'baja', suavizante: false, cloro: false,
    suavizanteNota: 'Tapa las fibras técnicas y deja de abrigar y de sacar el sudor.',
    prep: ['Al revés.'],
    avisos: ['Si es de lana merino, usa el programa Lana.'],
    claves: ['termica', 'ropa termica', 'primera capa', 'interior termico', 'camiseta termica']
  },
  {
    id: 'compresion', nombre: 'Medias de compresión', emoji: '🦵', grupo: 'delicada', kg: 0.1,
    programa: 'delicado', temp: T('30', '30', '30', '30'), tempMax: '30', rpm: '400',
    secado: false, secadoNota: 'El calor afloja el elástico y pierden la compresión. Sécalas extendidas, lejos del sol.',
    suavizante: false, cloro: false, detergente: 'suave',
    prep: ['En bolsa de malla.'],
    avisos: [],
    claves: ['medias de compresion', 'media de compresion', 'medias antiembolicas', 'medias de varices']
  },
  {
    id: 'forros', nombre: 'Forros de muebles y fundas de cojín', emoji: '🛋️', grupo: 'forros', kg: 1.0, solo: true,
    programa: 'algodon', temp: T('30', '30', '30', '30'), tempMax: '40', rpm: '800',
    secado: false, secadoNota: 'Pueden encoger y luego no ajustan. Póntelos de nuevo un poco húmedos: se acomodan solos.',
    suavizante: true, cloro: false,
    prep: ['Cierra cremalleras y velcros.', 'Quita rellenos o espumas: solo se lava la funda.'],
    avisos: [],
    claves: ['forro de mueble', 'forro de sofa', 'funda de sofa', 'funda de cojin', 'cubre sofa', 'forro del sofa', 'forros del mueble']
  },
  {
    id: 'mantaElectrica', nombre: 'Mantas eléctricas o con calefacción', emoji: '🚫', noLavar: true, grupo: 'noLavar', kg: 1,
    desc: 'No se lavan ni se secan en lavadora: tienen cables y control. Sigue las instrucciones del fabricante (muchas solo admiten limpieza superficial).',
    claves: ['manta electrica', 'cobija electrica', 'cobija termica electrica', 'almohadilla electrica']
  },
  {
    id: 'espuma', nombre: 'Almohadas o cojines de espuma, látex o viscoelásticos', emoji: '🚫', noLavar: true, grupo: 'noLavar', kg: 1,
    desc: 'La espuma se rompe al centrifugar y el manual prohíbe secar gomaespuma en esta máquina. Lava solo la funda.',
    claves: ['almohada viscoelastica', 'almohada de espuma', 'almohada de latex', 'memory foam', 'cojin de espuma', 'espuma', 'gomaespuma', 'viscoelastica']
  },
  {
    id: 'ropa', nombre: 'Ropa del diario', emoji: '👚', comun: true, grupo: 'diaria', kg: 0.3, generico: true,
    programa: 'mixtos', temp: T('40', '40', '30', '30'), tempMax: '40', rpm: '1000',
    secado: 'normal', secadoNota: 'Prendas con licra: Temperatura baja.',
    suavizante: true, cloro: false,
    prep: ['Vacía bolsillos.', 'Cierra cremalleras y ganchos para que no enganchen otras prendas.'],
    avisos: [],
    claves: ['ropa', 'ropa diaria', 'ropa normal', 'ropa del diario', 'ropa de uso diario', 'prendas', 'muda', 'mudas', 'vestido', 'vestidos', 'ropita de diario']
  }
];

// Palabras de material que cambian el tipo de prenda: "saco de lana" → lana.
const MATERIALES = [
  { claves: ['lana', 'merino', 'cachemir', 'cashmere', 'alpaca', 'angora'], a: 'lana', de: ['sueteres', 'ropa', 'chaqueta', 'chaquetaNormal', 'pantalones', 'cobijas', 'camisetas', 'interior'] },
  { claves: ['seda', 'saten', 'satin'], excepto: ['satin de algodon', 'saten de algodon'], a: 'seda', de: ['camisas', 'pijamas', 'ropa', 'lenceria', 'pantalones', 'sabanas', 'camisetas'] },
  { claves: ['hilos', 'percal', 'satin de algodon', 'saten de algodon', 'egipcio', 'pima', 'supima', 'hilaje'], a: 'sabanasFinas', de: ['sabanas'] },
  { claves: ['lino'], a: 'lino', de: ['camisas', 'pantalones', 'ropa', 'camisetas'] },
  { claves: ['viscosa', 'rayon', 'modal'], a: 'viscosa', de: ['camisas', 'pantalones', 'ropa', 'camisetas', 'pijamas'] },
  { claves: ['lentejuelas', 'pedreria', 'apliques', 'bordado', 'chaquiras'], a: 'lentejuelas', de: ['camisas', 'camisetas', 'ropa', 'pantalones'] },
  { claves: ['cuero', 'gamuza', 'cuerina', 'ecocuero'], a: 'cuero', de: ['chaqueta', 'chaquetaNormal', 'pantalones', 'tenis', 'morral', 'ropa'] },
  { claves: ['plumas', 'pluma', 'acolchada', 'acolchado'], a: 'chaquetaPlumas', de: ['chaqueta', 'chaquetaNormal'] },
  { claves: ['impermeable', 'rompevientos'], a: 'chaquetaImpermeable', de: ['chaqueta', 'chaquetaNormal'] },
  { claves: ['jean', 'mezclilla', 'denim'], a: 'jeans', de: ['chaqueta', 'chaquetaNormal', 'pantalones', 'camisas'] },
  { claves: ['pano'], a: 'pano', de: ['chaqueta', 'chaquetaNormal'] },
  { claves: ['deportiva', 'deportivo', 'dry fit', 'licra', 'lycra'], a: 'deportiva', de: ['camisetas', 'ropa', 'pantalones', 'chaquetaNormal'] }
];

// Grupos que pueden ir juntos en la misma tanda.
const GRUPOS_COMPATIBLES = [['toallas', 'cama'], ['tapete', 'toallas'], ['diaria', 'trabajo']];

const MANCHAS = [
  { claves: ['sangre'], tip: 'Sangre: enjuaga con agua FRÍA cuanto antes; el agua caliente la fija.' },
  { claves: ['grasa', 'aceite', 'mantequilla'], tip: 'Grasa: pon detergente líquido directo sobre la mancha 10 minutos antes de lavar.' },
  { claves: ['vino', 'cafe', 'jugo'], tip: 'Vino, café o jugo: enjuaga con agua fría y frota con un poco de detergente antes de lavar.' },
  { claves: ['pasto', 'barro', 'tierra', 'pantano'], tip: 'Barro o pasto: deja secar el barro, cepíllalo y pretrata con detergente; activa Pre-Lavado.' },
  { claves: ['desodorante', 'axila', 'sudor'], tip: 'Axilas amarillas o sudor: frota con detergente y un cepillo suave antes de lavar.' },
  { claves: ['tinta', 'lapicero', 'marcador'], tip: 'Tinta: alcohol en un algodón sobre la mancha (por fuera de la lavadora) y enjuaga bien antes de lavar.' },
  { claves: ['chocolate', 'comida', 'salsa'], tip: 'Comida: retira el exceso, enjuaga por el revés con agua fría y pretrata con detergente.' },
  { claves: ['mancha', 'manchas', 'manchado', 'manchada'], tip: 'Manchas: el manual recomienda tratarlas antes con un cepillo y un poco de detergente disuelto en agua.' }
];

// Sustancias que el manual prohíbe lavar o secar en la máquina.
const PELIGROSOS = ['gasolina', 'thinner', 'tiner', 'solvente', 'acpm', 'petroleo', 'queroseno', 'kerosene', 'varsol', 'aguarras', 'trementina', 'acetona', 'cera', 'removedor', 'pintura', 'desengrasante', 'combustible', 'aceite de motor'];

// ¿Qué colores se pueden lavar juntos? (recomendación general; el manual solo pide separar lo oscuro de lo claro y blanco)
const MEZCLA_COLORES = [
  { a: 'blanco', b: 'claro', ok: true, txt: 'Blanco con colores claros (pasteles, beige, crema, gris claro): sí pueden ir juntos, a máx. 40 °C y sin cloro, siempre que las prendas claras no destiñan (cuidado con las nuevas). Lava los blancos aparte solo si quieres dejarlos más blancos (60 °C o cloro) o si están percudidos.' },
  { a: 'blanco', b: 'color', ok: false, txt: 'Blanco con colores medios o vivos: mejor aparte. El tinte pasa a lo blanco y lo deja grisáceo o manchado.' },
  { a: 'blanco', b: 'oscuro', ok: false, txt: 'Blanco con oscuros: siempre aparte (el manual lo advierte).' },
  { a: 'claro', b: 'color', ok: true, txt: 'Claros con colores medios: pueden ir juntos en frío (30 °C) si no destiñen. Rojos, fucsias, naranjas y prendas nuevas, aparte.' },
  { a: 'claro', b: 'oscuro', ok: false, txt: 'Claros con oscuros: aparte, los oscuros sueltan tinte.' },
  { a: 'color', b: 'oscuro', ok: true, txt: 'Colores con oscuros: pueden ir juntos en frío (30 °C) y al revés, para que no se decoloren.' }
];

const CONSEJOS = [
  { titulo: 'Prueba de color antes de mezclar', txt: 'Moja una esquina escondida de la prenda y presiónala con un paño blanco. Si lo mancha, esa prenda destiñe: lávala aparte o con colores iguales.' },
  { titulo: 'Ropa nueva', txt: 'Las primeras 2 o 3 lavadas, sola o con colores parecidos y en frío: es cuando más destiñe.' },
  { titulo: 'Pelusa', txt: 'Toallas, felpas y algodones nuevos sueltan pelusa; la ropa oscura, los sintéticos y la microfibra la atrapan. El manual pide lavarlos por separado.', manual: 24 },
  { titulo: 'Peso parecido', txt: 'Mezclar prendas muy pesadas con muy livianas desequilibra el centrifugado (error UE) y desgasta la ropa liviana.', manual: 50 },
  { titulo: 'No llenes de más', txt: 'La ropa tiene que poder girar: si la puerta no cierra fácil, sobra ropa. Lava peor, arruga más y fuerza el motor.', manual: 51 },
  { titulo: 'Menos detergente', txt: 'En carga frontal se usa poco: el exceso hace espuma, enjuaga mal y deja la ropa áspera y con olor.', manual: 26 },
  { titulo: 'Suavizante: cuándo no', txt: 'No en toallas, ropa deportiva y térmica, microfibra, impermeables ni ropa de bebé. Nunca directo sobre la ropa (mancha).', manual: 27 },
  { titulo: 'Cloro: solo blancos resistentes', txt: 'Solo algodón o lino blanco. Nunca con lana, seda, licra, poliéster (amarillea) ni con prendas de color. Jamás lo mezcles con vinagre ni amoníaco: suelta gases tóxicos.' },
  { titulo: 'Qué encoge en la secadora', txt: 'Algodón 100 % (un poco), lana, viscosa o rayón y prendas tejidas. Para ellas: Temperatura baja o tender.', manual: 32 },
  { titulo: 'Qué no va a la secadora', txt: 'Goma, plástico o espuma (tapetes con base de goma, baberos, cortinas de baño, almohadas de espuma), telas impermeables, lana, fibra de vidrio y ropa con restos de aceite o solventes.', manual: 5 },
  { titulo: 'Al revés', txt: 'Jeans, oscuros, estampados, vinilos y prendas con lentejuelas: al revés conservan el color y el estampado.' },
  { titulo: 'Bolsa de malla', txt: 'Para medias, ropa interior, brasieres y cosas pequeñas: no se pierden entre el tambor y el sello. Llénala a menos de la mitad.', manual: 25 },
  { titulo: 'Sácala enseguida', txt: 'La ropa húmeda dentro del tambor se arruga y toma olor. Si no alcanzas, usa Tiempo Diferido para que termine cuando llegues.', manual: 42 },
  { titulo: 'Ahorro', txt: 'Para la mayoría de la ropa, 30–40 °C basta. Algodón+ ahorra energía frente a Algodón con los mismos ajustes. Centrifugar alto acorta el secado.', manual: 28 },
  { titulo: 'Olor a humedad', txt: 'Limpieza de Tambor una vez al mes, puerta entreabierta después de lavar y gaveta limpia. Si persiste, una vez por semana durante 3 semanas.', manual: 52 }
];
