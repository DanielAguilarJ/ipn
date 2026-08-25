/**
 * Estado del examen diagnóstico.
 *
 * Concentra la navegación y la validación en un solo lugar, con dos reglas:
 *  - No se avanza sin haber elegido una respuesta. El aviso es inmediato y claro.
 *  - Siempre se puede volver atrás y cambiar una respuesta ya dada.
 *
 * El avance se guarda en el almacenamiento de la sesión para que recargar la
 * página por accidente no borre veinte minutos de trabajo. Se limpia al terminar.
 */

import { useCallback, useMemo, useState } from 'react';
import type { OpcionId, Pregunta, RamaId, Respuestas } from './tipos';

const CLAVE_GUARDADO = 'rumbo-ipn:examen';

interface Guardado {
  readonly rama: RamaId;
  readonly respuestas: Respuestas;
  readonly indice: number;
}

/** Lee el avance guardado. Devuelve null si no hay, o si está corrupto. */
export function leerGuardado(): Guardado | null {
  if (typeof window === 'undefined') return null;
  try {
    const crudo = window.sessionStorage.getItem(CLAVE_GUARDADO);
    if (!crudo) return null;
    const dato = JSON.parse(crudo) as Partial<Guardado>;
    if (typeof dato.rama !== 'string' || typeof dato.respuestas !== 'object') return null;
    if (dato.respuestas === null) return null;
    return {
      rama: dato.rama as RamaId,
      respuestas: dato.respuestas as Respuestas,
      indice: typeof dato.indice === 'number' ? dato.indice : 0,
    };
  } catch {
    // Un guardado ilegible no debe romper la página: se ignora y se empieza limpio.
    return null;
  }
}

function escribirGuardado(dato: Guardado): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(CLAVE_GUARDADO, JSON.stringify(dato));
  } catch {
    // Almacenamiento lleno o bloqueado: el examen sigue funcionando en memoria.
  }
}

export function borrarGuardado(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(CLAVE_GUARDADO);
  } catch {
    // Sin consecuencias: el estado en memoria es la fuente de verdad.
  }
}

export interface EstadoExamen {
  readonly preguntas: readonly Pregunta[];
  readonly pregunta: Pregunta | undefined;
  readonly indice: number;
  readonly totalPreguntas: number;
  readonly respuestas: Respuestas;
  /** Opción elegida en la pregunta actual, si ya se eligió alguna. */
  readonly elegida: OpcionId | undefined;
  readonly contestadas: number;
  /** Números de pregunta (base 1) que quedaron sin responder. */
  readonly faltantes: readonly number[];
  readonly esUltima: boolean;
  /** Mensaje de validación a mostrar, o null si no hay nada que avisar. */
  readonly aviso: string | null;
  readonly responder: (opcion: OpcionId) => void;
  readonly siguiente: () => void;
  readonly anterior: () => void;
  readonly irA: (indice: number) => void;
  /** Devuelve true si el examen puede cerrarse; si no, muestra el aviso. */
  readonly intentarTerminar: () => boolean;
}

interface Opciones {
  readonly preguntas: readonly Pregunta[];
  readonly rama: RamaId;
  readonly respuestasIniciales?: Respuestas;
  readonly indiceInicial?: number;
}

export function useExamen({
  preguntas,
  rama,
  respuestasIniciales = {},
  indiceInicial = 0,
}: Opciones): EstadoExamen {
  const [respuestas, setRespuestas] = useState<Respuestas>(respuestasIniciales);
  const [indice, setIndice] = useState(() =>
    Math.min(Math.max(indiceInicial, 0), Math.max(preguntas.length - 1, 0)),
  );
  const [aviso, setAviso] = useState<string | null>(null);

  const pregunta = preguntas[indice];
  const elegida = pregunta ? respuestas[pregunta.id] : undefined;

  const faltantes = useMemo(
    () =>
      preguntas
        .map((p, i) => (respuestas[p.id] === undefined ? i + 1 : null))
        .filter((n): n is number => n !== null),
    [preguntas, respuestas],
  );

  const guardar = useCallback(
    (nuevasRespuestas: Respuestas, nuevoIndice: number) => {
      escribirGuardado({ rama, respuestas: nuevasRespuestas, indice: nuevoIndice });
    },
    [rama],
  );

  const responder = useCallback(
    (opcion: OpcionId) => {
      if (!pregunta) return;
      // Objeto nuevo, nunca mutación del anterior.
      const siguientes: Respuestas = { ...respuestas, [pregunta.id]: opcion };
      setRespuestas(siguientes);
      setAviso(null);
      guardar(siguientes, indice);
    },
    [pregunta, respuestas, indice, guardar],
  );

  const siguiente = useCallback(() => {
    if (!pregunta) return;
    if (respuestas[pregunta.id] === undefined) {
      setAviso('Elige una opción para poder continuar.');
      return;
    }
    const nuevo = Math.min(indice + 1, preguntas.length - 1);
    setIndice(nuevo);
    setAviso(null);
    guardar(respuestas, nuevo);
  }, [pregunta, respuestas, indice, preguntas.length, guardar]);

  const anterior = useCallback(() => {
    const nuevo = Math.max(indice - 1, 0);
    setIndice(nuevo);
    setAviso(null);
    guardar(respuestas, nuevo);
  }, [indice, respuestas, guardar]);

  const irA = useCallback(
    (destino: number) => {
      if (destino < 0 || destino >= preguntas.length) return;
      setIndice(destino);
      setAviso(null);
      guardar(respuestas, destino);
    },
    [preguntas.length, respuestas, guardar],
  );

  /** Con más pendientes que esto, enumerarlas es ruido en lugar de ayuda. */
  const MAXIMO_A_ENUMERAR = 6;

  const intentarTerminar = useCallback((): boolean => {
    if (faltantes.length === 0) return true;

    if (faltantes.length === 1) {
      setAviso(
        `Falta responder la pregunta ${faltantes[0]}. Tócala en el índice de abajo para ir a ella.`,
      );
      return false;
    }

    if (faltantes.length <= MAXIMO_A_ENUMERAR) {
      setAviso(
        `Faltan ${faltantes.length} preguntas por responder: ${faltantes.join(', ')}. Están marcadas en el índice de abajo.`,
      );
      return false;
    }

    setAviso(
      `Faltan ${faltantes.length} preguntas por responder, empezando por la ${faltantes[0]}. Las pendientes están sin marcar en el índice de abajo.`,
    );
    return false;
  }, [faltantes]);

  return {
    preguntas,
    pregunta,
    indice,
    totalPreguntas: preguntas.length,
    respuestas,
    elegida,
    contestadas: preguntas.length - faltantes.length,
    faltantes,
    esUltima: indice === preguntas.length - 1,
    aviso,
    responder,
    siguiente,
    anterior,
    irA,
    intentarTerminar,
  };
}
