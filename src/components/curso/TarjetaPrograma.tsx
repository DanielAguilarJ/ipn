/**
 * Una de las tres columnas de programa.
 *
 * El énfasis no está fijo en el código. Si la persona ya hizo el diagnóstico, se
 * destaca el programa que le corresponde; si no, se señala el que WorldBrain
 * indica como el más elegido. Antes el énfasis estaba clavado en el de 6 meses y
 * competía visualmente contra la recomendación que el diagnóstico acababa de dar.
 */

import { Check } from 'lucide-react';
import type { Enfasis, Programa } from '@/contenido/curso';

const ETIQUETA: Readonly<Record<Exclude<Enfasis, 'ninguno'>, string>> = {
  recomendado: 'Tu resultado',
  'mas-elegido': 'El más elegido',
};

interface Props {
  readonly programa: Programa;
  readonly enfasis: Enfasis;
}

export function TarjetaPrograma({ programa, enfasis }: Props) {
  const destacado = enfasis !== 'ninguno';

  return (
    <article className={destacado ? 'bg-azul-tenue p-6 sm:p-7' : 'bg-papel-alto p-6 sm:p-7'}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-sans text-lg font-semibold tracking-normal">
          {programa.nombre}
          <span className="block font-display text-3xl font-semibold tracking-tight">
            {programa.meses} meses
          </span>
        </h3>
        {destacado && (
          <span className="eyebrow shrink-0 bg-azul px-2 py-1 text-white">
            {ETIQUETA[enfasis]}
          </span>
        )}
      </div>

      <p className="mt-4 font-display text-lg leading-snug">{programa.idea}</p>
      <p className="mt-3 text-sm leading-relaxed text-tinta-media">{programa.paraQuien}</p>

      <ul className="mt-6 flex flex-col gap-3 border-t border-regla pt-5">
        {programa.incluye.map((linea) => (
          <li key={linea} className="flex gap-2.5 text-sm leading-relaxed text-tinta-media">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-azul-texto" />
            {linea}
          </li>
        ))}
      </ul>
    </article>
  );
}
