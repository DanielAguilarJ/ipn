/**
 * Progreso del examen.
 *
 * Barra segmentada en la cabecera, el patrón que Mobbin muestra en Duolingo ABC
 * y Commons: dice de un vistazo cuánto falta sin competir con la pregunta.
 * Cada segmento es una pregunta, así que también funciona como mapa del avance.
 *
 * En pantallas estrechas los segmentos se vuelven muy finos, así que la cifra
 * de al lado es la que realmente informa; la barra queda como apoyo visual.
 */

interface Props {
  readonly total: number;
  readonly indiceActual: number;
  /** Números de pregunta (base 1) ya respondidos. */
  readonly respondidas: readonly number[];
  readonly contestadas: number;
}

export function BarraProgreso({ total, indiceActual, respondidas, contestadas }: Props) {
  const porcentaje = total > 0 ? Math.round((contestadas / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="eyebrow text-tinta-suave">
          Pregunta {indiceActual + 1} de {total}
        </p>
        <p className="text-sm text-tinta-media">
          <span className="font-semibold text-tinta">{contestadas}</span> respondidas
        </p>
      </div>

      <div
        className="mt-2 flex gap-px"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={porcentaje}
        aria-label={`Avance del examen: ${contestadas} de ${total} preguntas respondidas`}
      >
        {Array.from({ length: total }, (_, i) => {
          const numero = i + 1;
          const respondida = respondidas.includes(numero);
          const actual = i === indiceActual;
          return (
            <span
              key={numero}
              aria-hidden="true"
              className={[
                'h-1.5 flex-1 transition-colors',
                actual
                  ? 'bg-lapiz'
                  : respondida
                    ? 'bg-azul'
                    : 'bg-regla-fuerte',
              ].join(' ')}
            />
          );
        })}
      </div>
    </div>
  );
}
