/**
 * Interpretación del resultado en lenguaje claro.
 *
 * La investigación en Mobbin (Liven, Bloom) muestra que una pantalla de
 * resultados funciona cuando lo primero es una frase que se entiende, y solo
 * después llega la cifra. Este módulo produce esa frase.
 *
 * Tres reglas de redacción, deliberadas:
 *  - Habla del resultado de hoy, nunca de la persona. «Tu diagnóstico muestra»,
 *    no «eres» ni «no tienes capacidad».
 *  - No predice la admisión. Ni promete un lugar ni lo descarta.
 *  - Es determinista: el mismo porcentaje produce siempre el mismo texto.
 */

import type { Resultado } from './tipos';
import type { Nivel } from './tipos';
import { UMBRALES, nivelDe } from './puntuacion';
import { areaPorId } from './areas';

export interface Interpretacion {
  /** Frase corta y honesta, encabeza la pantalla. */
  readonly titular: string;
  /** Dos o tres frases que explican qué significa el resultado. */
  readonly cuerpo: string;
  /** Etiqueta del tramo, para acompañar la barra de rangos. */
  readonly tramo: string;
  /** Nivel del puntaje global, para colorear la pastilla de nivel. */
  readonly tramoNivel: Nivel;
}

/**
 * Tramos descriptivos del puntaje global, ordenados de menor a mayor.
 *
 * El corte de «Sólido» coincide con `UMBRALES.solido` a propósito: si un 70 %
 * apareciera como sólido mientras el titular habla de un hueco, la pantalla se
 * contradiría a sí misma.
 */
export const TRAMOS = [
  { hasta: 34, etiqueta: 'Punto de partida' },
  { hasta: 49, etiqueta: 'En construcción' },
  { hasta: UMBRALES.solido - 1, etiqueta: 'En desarrollo' },
  { hasta: 89, etiqueta: 'Sólido' },
  { hasta: 100, etiqueta: 'Muy sólido' },
] as const;

/** Etiqueta de reserva si un porcentaje cayera fuera de todos los tramos. */
const TRAMO_MAXIMO = 'Muy sólido';

/** Devuelve la etiqueta del tramo en que cae un porcentaje. */
export function tramoDe(porcentaje: number): string {
  const encontrado = TRAMOS.find((t) => porcentaje <= t.hasta);
  return encontrado ? encontrado.etiqueta : TRAMO_MAXIMO;
}

/** Une nombres de áreas en una lista legible en español. */
export function listaLegible(nombres: readonly string[]): string {
  if (nombres.length === 0) return '';
  if (nombres.length === 1) return nombres[0] as string;
  const inicio = nombres.slice(0, -1).join(', ');
  return `${inicio} y ${nombres[nombres.length - 1]}`;
}

/**
 * Nombre de un área para usarlo dentro de una frase enumerada.
 * Cae al nombre completo solo si el área no estuviera registrada.
 */
function nombreParaLista(areaId: string): string {
  return areaPorId(areaId)?.nombreCorto ?? areaId;
}

export function interpretar(resultado: Resultado): Interpretacion {
  const { porcentaje, correctas, total, fortalezas, mejoras, sinResponder } = resultado;
  const tramo = tramoDe(porcentaje);
  const tramoNivel = nivelDe(porcentaje);

  const nombresFuertes = listaLegible(fortalezas.slice(0, 3).map((a) => nombreParaLista(a.areaId)));
  const nombresFlojos = listaLegible(mejoras.slice(0, 2).map((a) => nombreParaLista(a.areaId)));

  const notaSinResponder =
    sinResponder > 0
      ? ` Dejaste ${sinResponder} ${sinResponder === 1 ? 'pregunta' : 'preguntas'} sin responder, y cuentan como error, igual que en el examen real.`
      : '';

  if (porcentaje >= UMBRALES.solido && mejoras.length === 0) {
    return {
      titular: 'Vas bien encaminado en todas las áreas.',
      cuerpo: `Acertaste ${correctas} de ${total}. No hay un área que se te esté quedando atrás, así que de aquí en adelante lo que más rinde es precisión y manejo del tiempo, no aprender contenido nuevo.${notaSinResponder}`,
      tramo,
      tramoNivel,
    };
  }

  if (fortalezas.length > 0 && mejoras.length > 0) {
    return {
      titular: `Tienes base sólida en ${nombresFuertes}, y hueco en ${nombresFlojos}.`,
      cuerpo: `Acertaste ${correctas} de ${total}. Un resultado desigual es la situación más común y también la más fácil de corregir: se trabaja lo que falta sin volver a empezar lo que ya dominas.${notaSinResponder}`,
      tramo,
      tramoNivel,
    };
  }

  if (fortalezas.length === 0 && porcentaje >= UMBRALES.medio) {
    return {
      titular: 'Estás a medio camino en casi todas las áreas.',
      cuerpo: `Acertaste ${correctas} de ${total}. No hay un solo tema que te esté frenando, sino varios a medias. Ordenarlos por prioridad es lo que hace que el estudio empiece a rendir.${notaSinResponder}`,
      tramo,
      tramoNivel,
    };
  }

  return {
    titular: 'Hoy el examen te queda lejos, y eso es información útil.',
    cuerpo: `Acertaste ${correctas} de ${total}. Saberlo ahora, y no el día del examen, es exactamente para lo que sirve un diagnóstico: hay tiempo para reconstruir las bases y volver a medir.${notaSinResponder}`,
    tramo,
    tramoNivel,
  };
}
