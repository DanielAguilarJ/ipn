/**
 * Cómo trabaja el curso, en cuatro pasos.
 *
 * A propósito no son tarjetas. La página ya tiene una comparación en columnas y
 * repetir el mismo recipiente para todo deja un muro plano; aquí el ritmo lo dan
 * el numeral grande, la regla que separa cada paso y una sola columna de lectura.
 */

import { METODO } from '@/contenido/curso';

export function MetodoCurso() {
  return (
    <ol className="mt-10 border-t border-regla">
      {METODO.map((paso, i) => (
        <li
          key={paso.titulo}
          className="grid gap-x-6 gap-y-2 border-b border-regla py-7 sm:grid-cols-[4rem_1fr]"
        >
          <span aria-hidden="true" className="font-display text-3xl text-numeral">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="max-w-2xl">
            <h3 className="font-sans text-lg font-semibold tracking-normal">{paso.titulo}</h3>
            <p className="mt-2 leading-relaxed text-tinta-media">{paso.texto}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
