/**
 * Aviso de independencia.
 *
 * Aparece en todas las páginas, no solo en el pie: es la afirmación de que este
 * no es un sitio oficial del IPN. Se muestra como texto legible, nunca en letra
 * diminuta ni escondido tras un enlace.
 */

import { Info } from 'lucide-react';
import { LEGAL, LINKS } from '@/config/site';

/** Franja superior compacta, visible en toda la navegación. */
export function FranjaIndependencia() {
  return (
    <div className="bloque-hondo border-b border-white/10">
      <p className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2 text-[0.78rem] leading-snug sm:items-center">
        <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 sm:mt-0" />
        <span>
          {LEGAL.independenciaCorta} Consulta la convocatoria en{' '}
          <a
            href={LINKS.ipnOficial.value}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline decoration-white/40 underline-offset-2 hover:decoration-white"
          >
            ipn.mx
          </a>
          .
        </span>
      </p>
    </div>
  );
}

/** Bloque completo, para el pie de página y la página de aviso legal. */
export function BloqueIndependencia() {
  return (
    <div className="border-l-4 border-lapiz bg-lapiz-tenue p-5 sm:p-6">
      <h2 className="eyebrow text-lapiz">Aviso importante</h2>
      <p className="mt-2.5 text-sm leading-relaxed text-tinta">{LEGAL.independencia}</p>
      <p className="mt-3 text-sm leading-relaxed text-tinta-media">{LEGAL.diagnostico}</p>
      <p className="mt-3 text-xs leading-relaxed text-tinta-suave">{LEGAL.marcas}</p>
    </div>
  );
}
