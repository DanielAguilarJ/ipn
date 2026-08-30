/**
 * Preguntas de la página del curso.
 *
 * Mismo mecanismo que la FAQ de la portada, con otro contenido: aquí se resuelven
 * las objeciones de compra, no las dudas sobre el examen. El texto visible y el
 * del schema son el mismo, siempre.
 */

import { PREGUNTAS_CURSO } from '@/contenido/curso';

export function FaqCurso() {
  return (
    <div className="mt-10 max-w-3xl border-t border-regla">
      {PREGUNTAS_CURSO.map((p) => (
        <details key={p.pregunta} className="group border-b border-regla">
          <summary className="flex cursor-pointer list-none items-start gap-4 py-5 font-sans text-base font-semibold hover:text-azul-texto">
            <span className="flex-1">{p.pregunta}</span>
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 text-xl leading-none text-azul-texto transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-6 text-[0.97rem] leading-relaxed text-tinta-media">{p.respuesta}</p>
        </details>
      ))}
    </div>
  );
}
