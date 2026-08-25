/**
 * Botones y enlaces de acción.
 *
 * Un solo lugar define la forma, el tamaño táctil y los estados de foco, para
 * que todas las llamadas a la acción del sitio se comporten igual.
 * Altura mínima 44 px: objetivo táctil accesible en móvil.
 */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type Jerarquia = 'principal' | 'secundaria' | 'sobre-oscuro' | 'discreta' | 'whatsapp';
export type Medida = 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 font-sans font-semibold ' +
  'transition-colors duration-150 select-none ' +
  'disabled:cursor-not-allowed disabled:opacity-45';

/**
 * Cada jerarquía define su color completo.
 *
 * `sobre-oscuro` existe como variante propia y no como una lista de clases
 * pasada por `className`: sobrescribir el color del texto desde fuera no es
 * fiable, porque no gana la clase escrita al final sino la que Tailwind coloque
 * después en la hoja de estilos. Un botón secundario sobre el bloque azul salió
 * con texto oscuro sobre fondo oscuro justamente por eso.
 */
const POR_JERARQUIA: Readonly<Record<Jerarquia, string>> = {
  principal: 'bg-azul text-white hover:bg-azul-hover',
  secundaria: 'bg-papel-alto text-tinta border border-regla-fuerte hover:bg-papel-hondo',
  'sobre-oscuro': 'bg-transparent text-papel border border-white/35 hover:bg-white/12',
  discreta: 'bg-transparent text-tinta-media hover:text-tinta hover:bg-papel-hondo',
  whatsapp: 'bg-solido text-white hover:brightness-110',
};

const POR_MEDIDA: Readonly<Record<Medida, string>> = {
  md: 'min-h-11 px-5 text-sm rounded-lg',
  lg: 'min-h-13 px-7 text-base rounded-xl',
};

function clases(jerarquia: Jerarquia, medida: Medida, extra?: string): string {
  return [BASE, POR_JERARQUIA[jerarquia], POR_MEDIDA[medida], extra].filter(Boolean).join(' ');
}

interface Comun {
  readonly children: ReactNode;
  readonly jerarquia?: Jerarquia;
  readonly medida?: Medida;
  readonly className?: string;
}

/** Botón que ejecuta una acción dentro de la página. */
export function Boton({
  children,
  jerarquia = 'principal',
  medida = 'md',
  className,
  type = 'button',
  ...resto
}: Comun & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={clases(jerarquia, medida, className)} {...resto}>
      {children}
    </button>
  );
}

/** Enlace interno que se ve como botón. */
export function BotonRuta({
  children,
  to,
  jerarquia = 'principal',
  medida = 'md',
  className,
}: Comun & { readonly to: string }) {
  return (
    <Link to={to} className={clases(jerarquia, medida, className)}>
      {children}
    </Link>
  );
}

/**
 * Enlace externo que se ve como botón.
 * Siempre abre en pestaña nueva con `rel` seguro: evita el secuestro de pestaña.
 */
export function BotonExterno({
  children,
  href,
  jerarquia = 'principal',
  medida = 'md',
  className,
  onClick,
}: Comun & { readonly href: string; readonly onClick?: () => void }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clases(jerarquia, medida, className)}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
