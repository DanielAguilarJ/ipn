/**
 * Contenido de la página del curso.
 *
 * Vive separado del componente por la misma razón que `examenOficial.ts`: lo que
 * se afirma sobre el producto tiene que poder revisarse y probarse sin leer JSX.
 *
 * Regla igual de estricta que con los datos del examen: si un beneficio no está
 * en una fuente comercial de WorldBrain México, no se afirma. No se inventan
 * precios, fechas de inicio, tamaños de grupo, testimonios ni tasas de éxito.
 */

import { UMBRALES_CURSO } from '@/diagnostico/puntuacion';
import type { Recomendacion } from '@/diagnostico/tipos';

/**
 * De dónde sale lo que se afirma del curso.
 *
 * Dos fuentes, ambas de WorldBrain México:
 *  - La página pública de admisión universitaria, verificada en vivo el
 *    2026-08-25: nombres de los programas, duraciones y modalidades.
 *  - El manual comercial 2026, sección «Admisión a la universidad», entregado por
 *    el propietario el 2026-08-26: los beneficios incluidos.
 *
 * Del manual se descartaron dos cosas a propósito. Su tabla de 120 reactivos es
 * un «examen monitor» genérico y no la estructura del examen del IPN, que tiene
 * 140 preguntas y cuyo reparto por materia el IPN no publica. Y «validez oficial
 * de la SEP» corresponde a sus programas académicos, no a un curso de
 * preparación, así que afirmarlo aquí sería engañoso.
 */
export const FUENTE_COMERCIAL = {
  paginaCurso: {
    titulo: 'Curso de preparación para admisión UNAM, IPN y UAM 2026',
    consultada: '2026-08-25',
  },
  manual: {
    titulo: 'Manual comercial WorldBrain México 2026, sección «Admisión a la universidad»',
    consultada: '2026-08-26',
  },
  /**
   * Confirmación directa del propietario, 2026-08-26: los instructores
   * certificados y el horario flexible sí aplican a este curso. Aparecen en el
   * manual como beneficios generales de WorldBrain, no en el recuadro específico
   * de admisión, así que se dejan atados a esta confirmación explícita.
   */
  propietario: {
    titulo: 'Confirmación del propietario sobre instructores certificados y horario flexible',
    consultada: '2026-08-26',
  },
} as const;

export interface Programa {
  /** Coincide con el identificador que devuelve el diagnóstico. */
  readonly id: Recomendacion['id'];
  readonly nombre: string;
  /** Duración real del programa, en meses. */
  readonly meses: number;
  readonly idea: string;
  readonly paraQuien: string;
  readonly incluye: readonly string[];
}

/**
 * Los tres programas, tal como los ofrece WorldBrain México.
 *
 * Los nombres y las duraciones son suyos. Lo que este sitio añade es a quién
 * corresponde cada uno según el resultado del diagnóstico, y esa correspondencia
 * usa los mismos umbrales que el cálculo, no unos escritos a mano.
 */
export const PROGRAMAS: readonly Programa[] = [
  {
    id: 'intensivo',
    nombre: 'Intensivo',
    meses: 4,
    idea: 'Ya sabes el contenido. Lo que falta es precisión y reloj.',
    paraQuien: `Te toca si superaste el ${UMBRALES_CURSO.estrategico} % sin ningún área en refuerzo.`,
    incluye: [
      'Ritmo alto sobre contenido que ya dominas, sin repetir lo aprendido',
      'Simulacros para trabajar el tiempo y la precisión',
      'Corrección de errores por descuido y estrategia de descarte',
    ],
  },
  {
    id: 'estrategico',
    nombre: 'Estratégico',
    meses: 6,
    idea: 'Temario completo, con margen para simulacros y corrección fina.',
    paraQuien: `Te toca si estás entre el ${UMBRALES_CURSO.blindado} % y el ${UMBRALES_CURSO.estrategico} %, o si tienes un área concreta rezagada.`,
    incluye: [
      'Temario completo de tu rama, diferenciado para el IPN',
      'Refuerzo dirigido a las áreas más bajas de tu diagnóstico',
      'Grupos reducidos con revisión de tareas y seguimiento académico',
    ],
  },
  {
    id: 'blindado',
    nombre: 'Blindado',
    meses: 8,
    idea: 'Desde cero, sin dar nada por sabido.',
    paraQuien: `Te toca si quedaste por debajo del ${UMBRALES_CURSO.blindado} %, o con tres o más áreas en refuerzo.`,
    incluye: [
      'Reconstrucción tema por tema, empezando por las bases',
      'Ocho meses de margen para asentar lo que falta antes de los simulacros',
      'Parciales, control de calificaciones y monitoreo del avance',
    ],
  },
];

/** El programa que WorldBrain señala como el más elegido en su propia página. */
export const PROGRAMA_MAS_ELEGIDO: Recomendacion['id'] = 'estrategico';

/**
 * Los cuatro hechos del examen que encabezan la página, cada uno con una nota
 * corta que aporta la consecuencia práctica en vez de repetir una etiqueta.
 *
 * El `dato` debe existir tal cual en HECHOS_EXAMEN (examenOficial.ts), que es la
 * fuente con su cita; una prueba lo verifica para que no se cuele aquí una cifra
 * inventada. La `nota` resume el `detalle` de esa misma fuente, sin añadir nada.
 */
export const HECHOS_HERO: readonly { readonly dato: string; readonly nota: string }[] = [
  { dato: '140 preguntas', nota: 'una cada ~77 segundos' },
  { dato: '3 horas', nota: 'tiempo máximo' },
  { dato: '3 ramas', nota: 'eliges una' },
  { dato: 'En línea', nota: 'con cámara y micrófono' },
];

export type Enfasis = 'recomendado' | 'mas-elegido' | 'ninguno';

/**
 * Qué columna recibe el énfasis visual.
 *
 * Manda el diagnóstico: si la persona ya lo hizo, se destaca el programa que le
 * corresponde y ningún otro. Solo cuando no hay resultado se señala el más
 * elegido. Antes el énfasis estaba fijo en el de 6 meses y competía contra la
 * recomendación que la persona acababa de recibir.
 */
export function enfasisPrograma(
  programaId: Recomendacion['id'],
  recomendado: Recomendacion['id'] | null,
): Enfasis {
  if (recomendado) return programaId === recomendado ? 'recomendado' : 'ninguno';
  return programaId === PROGRAMA_MAS_ELEGIDO ? 'mas-elegido' : 'ninguno';
}

export interface Paso {
  readonly titulo: string;
  readonly texto: string;
}

/**
 * Cómo trabaja el curso, en cuatro pasos.
 *
 * Es el patrón que la investigación en Mobbin encontró en las páginas que
 * convencen sin prueba social: enseñar el proceso con acciones concretas en lugar
 * de afirmar que funciona. Cada paso describe algo que sí ocurre.
 */
export const METODO: readonly Paso[] = [
  {
    titulo: 'Medimos de dónde partes',
    texto:
      'El diagnóstico de esta página te da un porcentaje por área en unos veinte minutos, sin registro y sin enviar nada a ningún servidor. Ese resultado es el que decide la duración que te conviene, y es tuyo aunque nunca nos escribas.',
  },
  {
    titulo: 'Armamos el plan sobre tus huecos',
    texto:
      'El temario del IPN es el mismo para todos, pero tu punto de partida no. El plan de estudio se ajusta a tu nivel y a tu rama, incluido el bloque de Física, que el IPN publica distinto para cada una.',
  },
  {
    titulo: 'Practicas con simulacro cada mes',
    texto:
      'El curso incluye un simulacro mensual. No reproduce el examen del IPN ni sus preguntas, y no pretende hacerlo: sirve para que resolver bajo reloj deje de ser nuevo el día que importa.',
  },
  {
    titulo: 'Corregimos lo que sale mal',
    texto:
      'Después de cada práctica se revisa el error concreto: si fue de contenido, de planteamiento o de descuido. Es la parte que casi nadie hace solo, y la que más mueve el puntaje.',
  },
];

/**
 * Lo que incluyen los tres programas.
 *
 * Procedencia de cada punto, sin interpretación:
 *  - Simulacro mensual y acompañamiento en trámites: manual comercial 2026,
 *    recuadro de la sección «Admisión a la universidad».
 *  - En línea / presencial: modalidades confirmadas en la página pública.
 *  - Instructores certificados y horario flexible: beneficios generales de
 *    WorldBrain en el manual, confirmados para este curso por el propietario el
 *    2026-08-26 (ver FUENTE_COMERCIAL.propietario).
 */
export const INCLUYE: readonly string[] = [
  'Simulacro incluido cada mes',
  'Instructores certificados',
  'Plan de estudio ajustado a tu nivel',
  'Horario flexible',
  'En línea o presencial, según te acomode',
  'Acompañamiento en los trámites administrativos',
];

export interface Pregunta {
  readonly pregunta: string;
  readonly respuesta: string;
}

/**
 * Preguntas de esta página.
 *
 * Son las objeciones de compra, distintas de las dudas sobre el examen que
 * resuelve la portada. No se repite ninguna pregunta entre las dos páginas: dos
 * FAQPage con el mismo contenido no aportan nada y sí generan duplicado.
 */
export const PREGUNTAS_CURSO: readonly Pregunta[] = [
  {
    pregunta: '¿Cómo sé cuál de los tres programas me toca?',
    respuesta:
      'Lo decide tu diagnóstico, no una llamada de ventas. Si superas el 75 % sin áreas en refuerzo, te corresponde el Intensivo de 4 meses; entre 45 % y 75 %, o con un área rezagada, el Estratégico de 6; por debajo de 45 %, o con tres o más áreas en refuerzo, el Blindado de 8. El criterio está escrito y es el mismo para todos.',
  },
  {
    pregunta: '¿Por qué no publican el precio en la página?',
    respuesta:
      'Porque cambia según el programa que te corresponda, la modalidad y el grupo disponible, y publicar una cifra que no aplique a tu caso no te sirve de nada. Si escribes por WhatsApp te damos el costo completo en el primer mensaje, sin pasar por un cuestionario y sin que tengas que atender una llamada para conocerlo.',
  },
  {
    pregunta: '¿Me van a llamar o agregar a una lista si pido informes?',
    respuesta:
      'No. Escribes por WhatsApp, recibes el costo y lo que incluye, y si no continúas ahí termina. No pedimos correo ni teléfono en esta página, y el diagnóstico funciona completo sin dejar ningún dato.',
  },
  {
    pregunta: '¿Las clases son en línea o presenciales?',
    respuesta:
      'Las dos modalidades existen y eliges la que te acomode; los tres programas se ofrecen igual en línea y presencial. Conviene tener presente que el examen del IPN sí es en línea y pide computadora con cámara y micrófono, así que practicar en computadora ayuda aunque tomes el curso presencial.',
  },
  {
    pregunta: '¿El curso incluye simulacros?',
    respuesta:
      'Sí, uno cada mes. Son material de práctica elaborado a partir de las áreas y temas que el IPN publica: no contienen reactivos del examen real ni los reproducen. Su función es que llegues con el reloj entrenado y sepas cómo se siente resolver a poco más de un minuto por pregunta.',
  },
  {
    pregunta: '¿Este curso me garantiza entrar al IPN?',
    respuesta:
      'No, y nadie honesto te lo va a garantizar. La asignación depende del puntaje de todos los aspirantes de tu proceso y de los lugares que haya en la carrera y el plantel que pidas, así que el corte cambia en cada convocatoria. Lo que sí depende de ti es cuántas preguntas contestas bien, y eso es lo que se prepara aquí.',
  },
  {
    pregunta: '¿Sirve para el examen de nivel superior de la convocatoria vigente?',
    respuesta:
      'Sí. La preparación es para el examen de nivel superior del IPN, el de 140 preguntas en tres horas, y el temario se trabaja por rama. Hay varios periodos de ingreso al año con su propia convocatoria y sus propias fechas, así que al pedir informes conviene decir a cuál te presentas: de eso depende cuánto margen tienes y, por tanto, qué duración tiene sentido.',
  },
  {
    pregunta: '¿Es para licenciatura o también para vocacional?',
    respuesta:
      'Los tres programas de esta página son para el ingreso a nivel superior, es decir licenciatura e ingeniería. Si buscas entrar a una vocacional del IPN el proceso es otro y el examen también, así que dilo al escribir: es mejor que te orientemos bien que venderte un programa que no corresponde.',
  },
  {
    pregunta: '¿Qué pasa si mi diagnóstico sale muy bajo?',
    respuesta:
      'Que ya sabes algo útil y no lo supiste el día del examen. Un resultado bajo no descarta a nadie: indica que necesitas más meses y que hay que empezar por las bases en lugar de por los simulacros. Para eso existe el programa de 8 meses, y es la razón por la que no vendemos el curso corto a todo el mundo.',
  },
];

/**
 * Nodo FAQPage, generado desde el mismo texto visible.
 *
 * Sin `@context` porque se inserta dentro del `@graph` de la página, que ya lo
 * declara una vez. Las directrices generales exigen que el marcado represente el
 * contenido visible; generar ambos desde el mismo arreglo evita divergencias.
 */
export function nodoFaqCurso(): object {
  return {
    '@type': 'FAQPage',
    mainEntity: PREGUNTAS_CURSO.map((p) => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
    })),
  };
}

/** Mensaje de WhatsApp para quien llega sin haber hecho el diagnóstico. */
export const MENSAJE_GENERAL =
  'Hola, quiero informes del curso de preparación para el examen de admisión al IPN: costo, fechas y modalidad.';

/**
 * Mensaje para quien ya hizo el diagnóstico.
 *
 * Llega al chat con el expediente puesto, que es justo lo que se perdía cuando
 * esta página ignoraba el resultado guardado.
 */
export function mensajeConDiagnostico(programa: string, porcentaje: number): string {
  return (
    `Hola, ya hice el diagnóstico de admisionipn.com: saqué ${porcentaje} % y me recomienda el programa ${programa}. ` +
    'Quiero informes de ese programa: costo, fechas y modalidad.'
  );
}
