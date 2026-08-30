/**
 * El temario, materia por materia.
 *
 * Sustituye la fila de etiquetas que solo mostraba nombres de área. Los temas, la
 * descripción y el consejo de estudio ya estaban escritos en `areas.ts` con el
 * temario público del IPN como origen: no había razón para dejarlos sin usar, y
 * son el argumento más concreto que esta página puede dar sobre qué se estudia.
 *
 * Si la persona ya hizo el diagnóstico, sus áreas en refuerzo aparecen abiertas y
 * señaladas: es lo primero que necesita ver de este bloque.
 */

import { AREAS } from '@/diagnostico/areas';

interface Props {
  /** Nombres de áreas que el diagnóstico marcó en nivel de refuerzo. */
  readonly enRefuerzo?: readonly string[];
}

export function TemarioAreas({ enRefuerzo = [] }: Props) {
  return (
    <div className="mt-10 border-t border-regla">
      {AREAS.map((area) => {
        const prioritaria = enRefuerzo.includes(area.nombre);

        return (
          <details key={area.id} className="group border-b border-regla" open={prioritaria}>
            <summary className="flex cursor-pointer list-none items-start gap-4 py-5 hover:text-azul-texto">
              <span className="flex-1 font-sans text-base font-semibold">
                {area.nombre}
                {prioritaria && (
                  <span className="eyebrow ml-3 bg-lapiz-tenue px-2 py-1 align-middle text-lapiz">
                    Tu área a reforzar
                  </span>
                )}
              </span>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-xl leading-none text-azul-texto transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>

            <div className="pb-7">
              <p className="max-w-2xl leading-relaxed text-tinta-media">{area.descripcion}</p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {area.temas.map((tema) => (
                  <li
                    key={tema}
                    className="border border-regla-fuerte bg-papel-alto px-3 py-1.5 text-sm text-tinta-media"
                  >
                    {tema}
                  </li>
                ))}
              </ul>

              <p className="mt-5 max-w-2xl border-l-2 border-azul pl-4 text-sm leading-relaxed text-tinta-media">
                {area.comoMejorar}
              </p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
