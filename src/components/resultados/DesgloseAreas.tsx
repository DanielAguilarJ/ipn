/**
 * Desglose del resultado por área.
 *
 * Barras horizontales con la misma escala para todas las áreas, como en las
 * pantallas de Equinox+ y Bloom que revisamos: el gráfico permite comparar de un
 * vistazo, y la fila de al lado permite interpretar.
 *
 * El nivel se comunica con tres señales a la vez, no solo con color: la etiqueta
 * escrita, el ancho de la barra y el número. Quien no distingue verde de ámbar
 * lee exactamente la misma información.
 */

import { CircleAlert, CircleCheck, CircleDot } from 'lucide-react';
import type { Nivel, ResultadoArea } from '@/diagnostico/tipos';
import { areaPorId } from '@/diagnostico/areas';

const ETIQUETA: Readonly<Record<Nivel, string>> = {
  solido: 'Sólido',
  medio: 'En desarrollo',
  atencion: 'Requiere refuerzo',
};

const COLOR_TEXTO: Readonly<Record<Nivel, string>> = {
  solido: 'text-solido',
  medio: 'text-atencion',
  atencion: 'text-lapiz',
};

const COLOR_BARRA: Readonly<Record<Nivel, string>> = {
  solido: 'bg-solido',
  medio: 'bg-atencion',
  atencion: 'bg-lapiz',
};

const ICONO: Readonly<Record<Nivel, typeof CircleCheck>> = {
  solido: CircleCheck,
  medio: CircleDot,
  atencion: CircleAlert,
};

interface Props {
  readonly porArea: readonly ResultadoArea[];
}

export function DesgloseAreas({ porArea }: Props) {
  return (
    <section aria-labelledby="titulo-desglose">
      <h2 id="titulo-desglose" className="text-2xl sm:text-3xl">
        Área por área
      </h2>
      <p className="mt-2 max-w-2xl text-tinta-media">
        Todas las barras usan la misma escala, así que puedes compararlas directamente. El porcentaje
        es de las preguntas de esa área en este diagnóstico, no del examen real.
      </p>

      <ul className="mt-7 flex flex-col gap-px border-y border-regla">
        {porArea.map((area) => {
          const Icono = ICONO[area.nivel];
          const detalle = areaPorId(area.areaId);

          return (
            <li key={area.areaId} className="bg-papel-alto px-4 py-5 sm:px-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-sans text-base font-semibold tracking-normal">{area.nombre}</h3>
                <span
                  className={`ml-auto inline-flex items-center gap-1.5 text-sm font-semibold ${COLOR_TEXTO[area.nivel]}`}
                >
                  <Icono aria-hidden="true" className="size-4" />
                  {ETIQUETA[area.nivel]}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-4">
                <div className="h-2.5 flex-1 bg-papel-hondo">
                  <div
                    className={`h-full ${COLOR_BARRA[area.nivel]}`}
                    style={{ width: `${area.porcentaje}%` }}
                    role="img"
                    aria-label={`${area.porcentaje} por ciento`}
                  />
                </div>
                <p className="w-24 shrink-0 text-right text-sm text-tinta-media">
                  <span className="text-base font-semibold text-tinta">{area.correctas}</span>
                  {' de '}
                  {area.total}
                </p>
              </div>

              {area.nivel !== 'solido' && detalle && (
                <p className="mt-3 border-l-2 border-regla-fuerte pl-3 text-sm leading-relaxed text-tinta-media">
                  {detalle.comoMejorar}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
