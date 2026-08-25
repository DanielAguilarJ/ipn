/**
 * Tarjeta de una pregunta del examen.
 *
 * Decisiones tomadas de la investigación en Mobbin (docs/mobbin-a-examen.md):
 *  - El enunciado es el foco único; las opciones van en una sola columna.
 *  - Toda la fila de la opción es tocable, no solo un círculo pequeño.
 *  - La opción elegida se marca con DOS señales a la vez, fondo y letra activa,
 *    nunca solo con color: quien no distingue colores debe poder verlo igual.
 *  - El botón de avanzar vive fuera de la lista, para no confundirlo con una
 *    respuesta ni provocar envíos accidentales.
 *
 * Accesibilidad: se usa un grupo de radios real (`role="radiogroup"` con
 * `input type="radio"` oculto visualmente), así el teclado y los lectores de
 * pantalla funcionan sin código extra.
 */

import type { OpcionId, Pregunta } from '@/diagnostico/tipos';

interface Props {
  readonly pregunta: Pregunta;
  readonly numero: number;
  readonly total: number;
  readonly areaNombre: string;
  readonly elegida: OpcionId | undefined;
  readonly onResponder: (opcion: OpcionId) => void;
}

export function TarjetaPregunta({
  pregunta,
  numero,
  total,
  areaNombre,
  elegida,
  onResponder,
}: Props) {
  const idEnunciado = `enunciado-${pregunta.id}`;

  return (
    <article className="border border-regla bg-papel-alto">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-regla px-5 py-3.5 sm:px-7">
        <span className="eyebrow text-azul-texto">{areaNombre}</span>
        <span className="ml-auto text-sm text-tinta-suave">
          <span className="font-semibold text-tinta">{numero}</span> de {total}
        </span>
      </header>

      <div className="px-5 py-6 sm:px-7 sm:py-8">
        {pregunta.contexto && (
          <div className="mb-6 border-l-2 border-regla-fuerte bg-papel pl-4 py-3">
            <h3 className="eyebrow mb-2 text-tinta-suave">Lee el texto</h3>
            <p className="text-[0.95rem] leading-relaxed text-tinta-media">{pregunta.contexto}</p>
          </div>
        )}

        <h2
          id={idEnunciado}
          className="font-sans text-lg leading-snug font-semibold tracking-normal sm:text-xl"
        >
          {pregunta.enunciado}
        </h2>

        <div role="radiogroup" aria-labelledby={idEnunciado} className="mt-6 flex flex-col gap-2.5">
          {pregunta.opciones.map((opcion) => {
            const activa = elegida === opcion.id;
            return (
              <label
                key={opcion.id}
                className={[
                  'group flex cursor-pointer items-start gap-3.5 border p-4 transition-colors',
                  'has-focus-visible:outline has-focus-visible:outline-3 has-focus-visible:outline-azul has-focus-visible:outline-offset-2',
                  activa
                    ? 'border-azul bg-azul-tenue'
                    : 'border-regla bg-papel-alto hover:border-regla-fuerte hover:bg-papel',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name={`pregunta-${pregunta.id}`}
                  value={opcion.id}
                  checked={activa}
                  onChange={() => onResponder(opcion.id)}
                  className="solo-lectores"
                />
                {/* Primera señal: la letra cambia de relleno, no solo de color. */}
                <span
                  aria-hidden="true"
                  className={[
                    'mt-px flex size-7 shrink-0 items-center justify-center border text-sm font-bold',
                    activa
                      ? 'border-azul bg-azul text-white'
                      : 'border-regla-fuerte bg-papel text-tinta-media',
                  ].join(' ')}
                >
                  {opcion.id.toUpperCase()}
                </span>
                {/* Segunda señal: el texto se refuerza. */}
                <span
                  className={[
                    'text-[0.97rem] leading-relaxed',
                    activa ? 'font-medium text-tinta' : 'text-tinta-media',
                  ].join(' ')}
                >
                  {opcion.texto}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </article>
  );
}
