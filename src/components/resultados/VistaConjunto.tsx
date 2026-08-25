/**
 * Vista de conjunto de las áreas, en cuadrícula.
 *
 * Responde al hueco que la investigación en Mobbin (docs/mobbin-resultados-b.md)
 * señaló: el desglose era una lista vertical plana sin una lectura de conjunto.
 * Se eligió una cuadrícula, no un radar: con ocho ejes el radar pierde precisión
 * y accesibilidad, mientras que la cuadrícula admite icono, nivel escrito y
 * aciertos en cada celda.
 *
 * Va ANTES del detalle: primero el panorama, después la explicación. Las áreas se
 * ordenan por prioridad de acción, así que las que requieren refuerzo encabezan.
 * Cada celda repite la señal con icono, texto y cifra, nunca solo con color.
 */

import { CircleAlert, CircleCheck, CircleDot } from 'lucide-react';
import type { Nivel, ResultadoArea } from '@/diagnostico/tipos';

const ICONO: Readonly<Record<Nivel, typeof CircleCheck>> = {
  solido: CircleCheck,
  medio: CircleDot,
  atencion: CircleAlert,
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

const ETIQUETA: Readonly<Record<Nivel, string>> = {
  solido: 'Sólido',
  medio: 'En desarrollo',
  atencion: 'Por reforzar',
};

interface Props {
  /** Áreas ya ordenadas por prioridad. */
  readonly areas: readonly ResultadoArea[];
}

export function VistaConjunto({ areas }: Props) {
  return (
    <ul className="grid grid-cols-2 gap-px border border-regla bg-regla lg:grid-cols-4">
      {areas.map((area) => {
        const Icono = ICONO[area.nivel];
        return (
          <li key={area.areaId} className="flex flex-col bg-papel-alto p-4">
            <div className="flex items-start justify-between gap-2">
              <span className={`inline-flex items-center ${COLOR_TEXTO[area.nivel]}`}>
                <Icono aria-hidden="true" className="size-4" />
              </span>
              <span className="text-sm text-tinta-suave">
                <span className="font-semibold text-tinta">{area.correctas}</span>/{area.total}
              </span>
            </div>
            <h3 className="mt-2 font-sans text-[0.9rem] leading-snug font-semibold tracking-normal">
              {area.nombre}
            </h3>
            <div className="mt-auto pt-3">
              <div className="h-1.5 w-full bg-papel-hondo">
                <div
                  className={`h-full ${COLOR_BARRA[area.nivel]}`}
                  style={{ width: `${area.porcentaje}%` }}
                />
              </div>
              <p className={`mt-1.5 text-xs font-medium ${COLOR_TEXTO[area.nivel]}`}>
                {ETIQUETA[area.nivel]}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
