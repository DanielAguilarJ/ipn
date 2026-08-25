/**
 * Banco completo de preguntas del diagnóstico.
 *
 * Todas son originales, redactadas para este proyecto a partir de las áreas y
 * temas que el IPN publica. Ninguna proviene de la guía oficial, de un banco
 * publicado ni de un examen real.
 *
 * El orden importa: es el orden en que se presentan. Se agrupa por área para que
 * el examen se sienta como secciones y no como un revoltijo, siguiendo el mismo
 * criterio de las guías de estudio.
 */

import type { Pregunta } from '../tipos';
import { PREGUNTAS_MATEMATICAS } from './matematicas';
import { PREGUNTAS_COMUNICACION } from './comunicacion';
import { PREGUNTAS_INGLES_HISTORIA } from './inglesHistoria';
import { PREGUNTAS_CIENCIAS } from './ciencias';

export const BANCO: readonly Pregunta[] = [
  ...PREGUNTAS_MATEMATICAS,
  ...PREGUNTAS_COMUNICACION,
  ...PREGUNTAS_INGLES_HISTORIA,
  ...PREGUNTAS_CIENCIAS,
];
