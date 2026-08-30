/**
 * Recupera el diagnóstico que la persona ya hizo en esta sesión.
 *
 * Existe para cerrar un salto que costaba conversiones: quien terminaba el
 * diagnóstico y pulsaba «comparar los tres programas» llegaba a una página que no
 * sabía nada de su resultado y volvía a hablarle en genérico.
 *
 * Dos decisiones deliberadas:
 *
 *  - La lectura ocurre en un efecto, no durante el primer render. La página se
 *    prerenderiza en la compilación, así que el HTML que reciben los buscadores no
 *    tiene sesión; si personalizáramos en el primer render, el marcado del
 *    servidor y el del navegador no coincidirían.
 *  - Un examen a medias no cuenta. Las preguntas sin responder valen como error,
 *    así que un avance abandonado daría un porcentaje falsamente bajo y
 *    recomendaría el programa más largo a alguien que quizá no lo necesita.
 */

import { useEffect, useState } from 'react';
import { AREAS } from './areas';
import { calcularResultado } from './puntuacion';
import { leerGuardado } from './useExamen';
import type { Recomendacion } from './tipos';

export interface DiagnosticoPrevio {
  readonly programaId: Recomendacion['id'];
  /** Nombre con duración, tal como lo da el cálculo. */
  readonly programaNombre: string;
  /** Entero de 0 a 100. */
  readonly porcentaje: number;
  /** Nombres de las áreas que quedaron en nivel de refuerzo. */
  readonly areasEnRefuerzo: readonly string[];
}

export function useDiagnosticoPrevio(): DiagnosticoPrevio | null {
  const [previo, setPrevio] = useState<DiagnosticoPrevio | null>(null);

  useEffect(() => {
    const guardado = leerGuardado();
    if (!guardado) return;

    /**
     * El banco se carga aquí y no arriba a propósito.
     *
     * Este hook lo usa la página del curso, que no es el diagnóstico: importarlo de
     * forma estática metía las 40 preguntas con sus explicaciones en el paquete
     * inicial de todo el sitio. Al pedirlo dentro del efecto solo lo descarga quien
     * de verdad hizo el diagnóstico, y nunca antes de que la página esté en
     * pantalla, así que no retrasa nada de lo que ve el visitante.
     */
    let vigente = true;

    void import('./banco').then(({ BANCO }) => {
      if (!vigente) return;

      const resultado = calcularResultado(BANCO, AREAS, guardado.respuestas, guardado.rama);
      if (resultado.sinResponder > 0) return;

      setPrevio({
        programaId: resultado.recomendacion.id,
        programaNombre: resultado.recomendacion.nombre,
        porcentaje: resultado.porcentaje,
        areasEnRefuerzo: resultado.porArea
          .filter((a) => a.nivel === 'atencion')
          .map((a) => a.nombre),
      });
    });

    // Evita escribir estado si la persona cambió de página mientras cargaba.
    return () => {
      vigente = false;
    };
  }, []);

  return previo;
}
