/**
 * Cálculo del resultado del diagnóstico.
 *
 * Es deliberadamente puro y determinista: las mismas respuestas producen
 * siempre el mismo resultado. Aquí no hay azar, ni reloj, ni red, ni estado
 * global, para que el resultado sea reproducible y verificable con pruebas.
 */

import type {
  Area,
  Nivel,
  Pregunta,
  Recomendacion,
  Respuestas,
  Resultado,
  ResultadoArea,
  RamaId,
} from './tipos';

/** Umbrales de nivel, en porcentaje. Un solo lugar para ajustarlos. */
export const UMBRALES = {
  /** A partir de aquí el área se considera una fortaleza. */
  solido: 75,
  /** A partir de aquí el área se considera aceptable pero mejorable. */
  medio: 50,
} as const;

/** Umbrales que deciden el curso recomendado, en porcentaje global. */
export const UMBRALES_CURSO = {
  /** Por debajo de esto se recomienda el programa largo, que empieza desde cero. */
  blindado: 45,
  /** Por debajo de esto se recomienda el programa de temario completo. */
  estrategico: 75,
} as const;

/**
 * Los tres programas reales de WorldBrain México, verificados en su página de
 * admisión universitaria el 2026-08-25. Los nombres y las duraciones son los
 * suyos, no invenciones de este sitio: recomendar un programa que no existe
 * dejaría al aspirante pidiendo algo que nadie puede venderle.
 */
const CURSOS: Readonly<Record<Recomendacion['id'], Recomendacion>> = {
  blindado: {
    id: 'blindado',
    nombre: 'Blindado · 8 meses',
    porQue:
      'Tu diagnóstico muestra que varias áreas todavía no están firmes. Este programa empieza desde cero y es el que WorldBrain destina a quien reconstruye bases o va por una carrera de altísima demanda: reconstruir es lo que más sube el puntaje, porque casi todo lo demás se apoya en ello.',
    enfoque: [
      'Desde cero, tema por tema, sin dar nada por sabido',
      'Ocho meses de margen para asentar lo que falta antes de los simulacros',
      'Seguimiento del avance con parciales y control de calificaciones',
    ],
  },
  estrategico: {
    id: 'estrategico',
    nombre: 'Estratégico · 6 meses',
    porQue:
      'Tienes una base con la que se puede trabajar y áreas concretas por cerrar. Es el programa más elegido, y por una razón: cubre el temario completo y deja tiempo para simulacros y corrección fina justo donde te falta.',
    enfoque: [
      'Temario completo de tu rama, con refuerzo dirigido a tus áreas bajas',
      'Tiempo suficiente para simulacros y corrección de errores',
      'Grupos reducidos con revisión de tareas y seguimiento académico',
    ],
  },
  intensivo: {
    id: 'intensivo',
    nombre: 'Intensivo · 4 meses',
    porQue:
      'Dominas la mayor parte del contenido. Lo que te separa del acierto ya no es el tema, es la precisión y el reloj, así que el programa corto es el que te corresponde: está pensado para quien tiene el examen cerca y necesita resultados ya.',
    enfoque: [
      'Ritmo alto sobre contenido que ya dominas, sin repetir lo aprendido',
      'Simulacros periódicos para trabajar tiempo y precisión',
      'Corrección de errores por descuido y estrategia de descarte',
    ],
  },
};

/** Clasifica un porcentaje en un nivel de desempeño. */
export function nivelDe(porcentaje: number): Nivel {
  if (porcentaje >= UMBRALES.solido) return 'solido';
  if (porcentaje >= UMBRALES.medio) return 'medio';
  return 'atencion';
}

/**
 * Redondeo determinista a entero, con el 0.5 siempre hacia arriba.
 * `Math.round` ya se comporta así, pero lo dejamos explícito y aislado
 * para que el criterio no dependa de un detalle del lenguaje.
 */
function porcentajeEntero(correctas: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correctas / total) * 100);
}

/** Devuelve las preguntas que aplican a una rama, en su orden original. */
export function preguntasDeRama(
  preguntas: readonly Pregunta[],
  rama: RamaId,
): readonly Pregunta[] {
  return preguntas.filter((p) => p.ramas.includes(rama));
}

/** Indica si una respuesta es la correcta para una pregunta. */
export function esCorrecta(pregunta: Pregunta, respuestas: Respuestas): boolean {
  return respuestas[pregunta.id] === pregunta.correcta;
}

/**
 * Elige el curso recomendado.
 *
 * Regla: manda el porcentaje global, pero si hay tres o más áreas en nivel de
 * atención se baja un escalón, porque un promedio decente puede esconder
 * huecos grandes en varias áreas.
 */
export function recomendarCurso(
  porcentajeGlobal: number,
  porArea: readonly ResultadoArea[],
): Recomendacion {
  const areasEnRiesgo = porArea.filter((a) => a.nivel === 'atencion').length;

  if (porcentajeGlobal < UMBRALES_CURSO.blindado || areasEnRiesgo >= 3) {
    return CURSOS.blindado;
  }
  if (porcentajeGlobal < UMBRALES_CURSO.estrategico || areasEnRiesgo >= 1) {
    return CURSOS.estrategico;
  }
  return CURSOS.intensivo;
}

/**
 * Calcula el resultado completo.
 *
 * Las preguntas sin responder cuentan como incorrectas, igual que en el examen
 * real, y además se reportan por separado para poder decirlo con claridad.
 * El orden de las áreas en el desglose respeta el orden de `areas`.
 */
export function calcularResultado(
  preguntas: readonly Pregunta[],
  areas: readonly Area[],
  respuestas: Respuestas,
  rama: RamaId,
): Resultado {
  const delExamen = preguntasDeRama(preguntas, rama);

  const porArea: readonly ResultadoArea[] = areas
    .map((area) => {
      const suyas = delExamen.filter((p) => p.areaId === area.id);
      const correctas = suyas.filter((p) => esCorrecta(p, respuestas)).length;
      const porcentaje = porcentajeEntero(correctas, suyas.length);
      return {
        areaId: area.id,
        nombre: area.nombre,
        correctas,
        total: suyas.length,
        porcentaje,
        nivel: nivelDe(porcentaje),
      };
    })
    .filter((r) => r.total > 0);

  const correctas = porArea.reduce((suma, a) => suma + a.correctas, 0);
  const total = delExamen.length;
  const porcentaje = porcentajeEntero(correctas, total);
  const sinResponder = delExamen.filter((p) => respuestas[p.id] === undefined).length;

  /**
   * Desempate estable: a igual porcentaje, se respeta el orden original de las
   * áreas. `toSorted` no muta el arreglo de entrada.
   */
  const porPorcentajeDesc = (a: ResultadoArea, b: ResultadoArea): number =>
    b.porcentaje - a.porcentaje;
  const porPorcentajeAsc = (a: ResultadoArea, b: ResultadoArea): number =>
    a.porcentaje - b.porcentaje;

  const fortalezas = porArea.filter((a) => a.nivel === 'solido').toSorted(porPorcentajeDesc);
  const mejoras = porArea.filter((a) => a.nivel !== 'solido').toSorted(porPorcentajeAsc);

  return {
    rama,
    correctas,
    total,
    porcentaje,
    sinResponder,
    porArea,
    fortalezas,
    mejoras,
    recomendacion: recomendarCurso(porcentaje, porArea),
  };
}
