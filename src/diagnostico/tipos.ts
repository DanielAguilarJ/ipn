/**
 * Tipos del dominio del diagnóstico.
 *
 * Todo es de solo lectura: el estado del examen se construye creando objetos
 * nuevos, nunca mutando los existentes.
 */

/** Identificador de una opción de respuesta. */
export type OpcionId = 'a' | 'b' | 'c' | 'd';

/** Rama del conocimiento del IPN elegida por la persona. */
export type RamaId = 'ingenieria' | 'medico-biologicas' | 'sociales-administrativas';

/** Un área evaluada dentro del examen. */
export interface Area {
  readonly id: string;
  /** Nombre visible, tomado de la nomenclatura oficial del IPN. */
  readonly nombre: string;
  /**
   * Nombre para enumeraciones dentro de una frase.
   * No debe contener la conjunción « y », o se generan listas como
   * «Redacción y ortografía y Inglés».
   */
  readonly nombreCorto: string;
  /** Una frase que explica qué mide el área. */
  readonly descripcion: string;
  /** Temas oficiales que cubre, para explicar el resultado con precisión. */
  readonly temas: readonly string[];
  /** Qué hacer si el resultado en esta área es bajo. */
  readonly comoMejorar: string;
}

/** Una opción de respuesta. */
export interface Opcion {
  readonly id: OpcionId;
  readonly texto: string;
}

/** Una pregunta original del diagnóstico. */
export interface Pregunta {
  readonly id: string;
  /** `id` de un `Area`. */
  readonly areaId: string;
  /** Ramas en las que aplica esta pregunta. */
  readonly ramas: readonly RamaId[];
  readonly enunciado: string;
  /** Texto de apoyo opcional: lectura, tabla o planteamiento previo. */
  readonly contexto?: string;
  readonly opciones: readonly Opcion[];
  readonly correcta: OpcionId;
  /** Por qué la respuesta correcta lo es. Se muestra al terminar. */
  readonly explicacion: string;
  readonly dificultad: 1 | 2 | 3;
}

/** Respuestas capturadas: id de pregunta → opción elegida. */
export type Respuestas = Readonly<Record<string, OpcionId>>;

/** Nivel de desempeño en un área. */
export type Nivel = 'solido' | 'medio' | 'atencion';

/** Resultado desglosado de un área. */
export interface ResultadoArea {
  readonly areaId: string;
  readonly nombre: string;
  readonly correctas: number;
  readonly total: number;
  /** Entero de 0 a 100. */
  readonly porcentaje: number;
  readonly nivel: Nivel;
}

/** Curso recomendado según el desempeño. */
export interface Recomendacion {
  readonly id: 'blindado' | 'estrategico' | 'intensivo';
  readonly nombre: string;
  readonly porQue: string;
  readonly enfoque: readonly string[];
}

/** Resultado completo del diagnóstico. */
export interface Resultado {
  readonly rama: RamaId;
  readonly correctas: number;
  readonly total: number;
  /** Entero de 0 a 100. */
  readonly porcentaje: number;
  readonly sinResponder: number;
  readonly porArea: readonly ResultadoArea[];
  /** Áreas con nivel sólido, de mayor a menor porcentaje. */
  readonly fortalezas: readonly ResultadoArea[];
  /** Áreas que requieren atención, de menor a mayor porcentaje. */
  readonly mejoras: readonly ResultadoArea[];
  readonly recomendacion: Recomendacion;
}
