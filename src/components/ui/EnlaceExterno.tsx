/**
 * Enlace a otro sitio, con el aviso de pestaña nueva incorporado.
 *
 * Existe porque el aviso se escribía a mano y por tanto se olvidaba: la auditoría
 * encontró quince enlaces repartidos por las seis páginas que abrían otra pestaña sin
 * decirlo, incluidos los de `/fuentes`, donde seguir enlaces a documentos originales
 * es la tarea principal.
 *
 * Quien navega con lector de pantalla no ve el icono, así que sin este texto la
 * pestaña nueva aparece sin explicación. Aquí el aviso viaja con el componente y no
 * puede quedarse fuera.
 *
 * `rel="noopener noreferrer"` va siempre de forma explícita: `noopener` no depende
 * del aislamiento implícito de los navegadores actuales y `noreferrer` evita enviar
 * la URL de esta página al destino externo.
 */

import type { ReactNode } from 'react';

interface Props {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export function EnlaceExterno({ href, children, className }: Props) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="solo-lectores">(se abre en una pestaña nueva)</span>
    </a>
  );
}
