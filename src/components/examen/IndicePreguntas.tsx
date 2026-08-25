/**
 * Índice de preguntas.
 *
 * Rejilla de números para saltar a cualquier pregunta. Existe por dos razones
 * concretas: permite repasar antes de cerrar el examen, y es a donde apunta el
 * aviso «falta responder la pregunta N», para que ese aviso sea accionable y no
 * solo un reproche.
 */

interface Props {
  readonly total: number;
  readonly indiceActual: number;
  /** Números de pregunta (base 1) ya respondidos. */
  readonly respondidas: readonly number[];
  readonly onIr: (indice: number) => void;
}

export function IndicePreguntas({ total, indiceActual, respondidas, onIr }: Props) {
  return (
    <nav aria-label="Índice de preguntas">
      <h2 className="eyebrow text-tinta-suave">Ir a una pregunta</h2>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const numero = i + 1;
          const respondida = respondidas.includes(numero);
          const actual = i === indiceActual;
          const estado = actual ? 'actual' : respondida ? 'respondida' : 'sin responder';

          return (
            <li key={numero}>
              <button
                type="button"
                onClick={() => onIr(i)}
                aria-current={actual ? 'true' : undefined}
                aria-label={`Pregunta ${numero}, ${estado}`}
                className={[
                  'flex size-9 items-center justify-center border text-sm font-semibold transition-colors',
                  actual
                    ? 'border-lapiz bg-lapiz text-white'
                    : respondida
                      ? 'border-azul bg-azul-tenue text-azul-texto hover:bg-azul hover:text-white'
                      : 'border-regla-fuerte bg-papel-alto text-tinta-suave hover:border-tinta-suave hover:text-tinta',
                ].join(' ')}
              >
                {numero}
              </button>
            </li>
          );
        })}
      </ul>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-tinta-suave">
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-3 border border-lapiz bg-lapiz" />
          En la que estás
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-3 border border-azul bg-azul-tenue" />
          Respondida
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-3 border border-regla-fuerte bg-papel-alto" />
          Sin responder
        </li>
      </ul>
    </nav>
  );
}
