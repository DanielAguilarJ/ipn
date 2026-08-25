/**
 * Metadatos de cada página.
 *
 * React 19 eleva automáticamente `title`, `meta` y `link` al `head` desde
 * cualquier punto del árbol, así que no hace falta una librería aparte.
 *
 * El canonical se construye desde el dominio de configuración, para que cambiarlo
 * en un solo lugar corrija todas las páginas a la vez.
 */

import { SITE } from '@/config/site';

interface Props {
  readonly titulo: string;
  readonly descripcion: string;
  /** Ruta con barra inicial, por ejemplo `/diagnostico`. */
  readonly ruta: string;
  /** Si es verdadero, se pide a los buscadores que no indexen la página. */
  readonly noIndexar?: boolean;
  /** Datos estructurados de la página, si aplica. */
  readonly datosEstructurados?: object;
}

export function Meta({ titulo, descripcion, ruta, noIndexar, datosEstructurados }: Props) {
  const canonical = `${SITE.origin.value}${ruta === '/' ? '/' : ruta}`;

  return (
    <>
      <title>{titulo}</title>
      <meta name="description" content={descripcion} />
      <link rel="canonical" href={canonical} />
      {noIndexar && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph: cómo se ve el enlace al compartirlo por WhatsApp. */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Rumbo IPN" />
      <meta property="og:locale" content="es_MX" />
      <meta property="og:title" content={titulo} />
      <meta property="og:description" content={descripcion} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />

      {datosEstructurados && (
        <script
          type="application/ld+json"
          // El contenido lo generamos nosotros desde datos propios, no viene de fuera.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }}
        />
      )}
    </>
  );
}
