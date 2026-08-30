/**
 * Metadatos de cada página.
 *
 * React 19 eleva automáticamente `title`, `meta` y `link` al `head` desde
 * cualquier punto del árbol, así que no hace falta una librería aparte.
 *
 * El canonical se construye desde el dominio de configuración, para que cambiarlo
 * en un solo lugar corrija todas las páginas a la vez.
 */

import { URL_IMAGEN_SOCIAL } from '@/lib/esquemas';
import { PREGUNTAS_POR_PERSONA } from '@/diagnostico/conteo';
import { SITE } from '@/config/site';

/**
 * Imagen que se muestra al compartir un enlace del sitio.
 *
 * Se declara con URL absoluta porque WhatsApp, Facebook y X no resuelven rutas
 * relativas al leer las etiquetas. Mide 1200x630, la proporción que esas
 * plataformas recortan sin cortar contenido, y se genera desde
 * `scripts/og.html` con `npm run og`.
 *
 * Existía `twitter:card = summary_large_image` sin ninguna imagen declarada:
 * cada enlace compartido salía sin vista previa, y el CTA principal de este sitio
 * es justamente WhatsApp.
 */
const OG_IMAGEN = {
  url: URL_IMAGEN_SOCIAL,
  ancho: '1200',
  alto: '630',
  /**
   * La cifra sale de la constante con prueba, no escrita a mano.
   *
   * Este texto viaja en las siete páginas, así que era el sitio con más alcance donde
   * un número podía quedarse viejo: si el banco cambiara, la prueba de `conteo.ts`
   * avisaría de la constante y este texto seguiría diciendo lo anterior.
   */
  alt:
    `Rumbo IPN, de WorldBrain México: diagnóstico gratuito de ${PREGUNTAS_POR_PERSONA.cifra} ` +
    'preguntas por área para el examen de admisión al IPN. Sitio independiente, no oficial del IPN.',
} as const;

interface Props {
  readonly titulo: string;
  readonly descripcion: string;
  /** Ruta con barra inicial, por ejemplo `/diagnostico`. */
  readonly ruta: string;
  /** Si es verdadero, se pide a los buscadores que no indexen la página. */
  readonly noIndexar?: boolean;
  /**
   * Omite el canonical y la URL social.
   *
   * Solo lo usa la página de error. Ese archivo se sirve en CUALQUIER dirección que
   * no exista, así que no tiene una URL propia que declarar: apuntar a una inventada
   * como `/404` es declarar como canónica una dirección que devuelve error, y eso
   * aparece en Search Console como duplicado o canónica descartada. El `noindex` es
   * lo que hace el trabajo aquí.
   */
  readonly sinCanonical?: boolean;
  /**
   * Fechas del artículo, en formato ISO.
   *
   * Cuando se pasan, la página se declara como `article` en Open Graph en lugar de
   * `website` y emite sus dos fechas. Antes `/examen-ipn` decía a Google que era un
   * artículo en sus datos estructurados y a las redes que era un sitio genérico:
   * dos respuestas distintas a la misma pregunta.
   *
   * Deben ser las MISMAS que declaran los datos estructurados, o el sitio se
   * contradice consigo mismo. Una prueba lo comprueba.
   */
  readonly articulo?: { readonly publicada: string; readonly modificada: string };
  /** Datos estructurados de la página, si aplica. */
  readonly datosEstructurados?: object;
}

export function Meta({
  titulo,
  descripcion,
  ruta,
  noIndexar,
  sinCanonical,
  articulo,
  datosEstructurados,
}: Props) {
  const canonical = `${SITE.origin.value}${ruta === '/' ? '/' : ruta}`;

  return (
    <>
      <title>{titulo}</title>
      <meta name="description" content={descripcion} />
      {!sinCanonical && <link rel="canonical" href={canonical} />}
      {noIndexar && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph: cómo se ve el enlace al compartirlo por WhatsApp. */}
      <meta property="og:type" content={articulo ? 'article' : 'website'} />
      {articulo && (
        <>
          <meta property="article:published_time" content={articulo.publicada} />
          <meta property="article:modified_time" content={articulo.modificada} />
        </>
      )}
      <meta property="og:site_name" content="Rumbo IPN" />
      <meta property="og:locale" content="es_MX" />
      <meta property="og:title" content={titulo} />
      <meta property="og:description" content={descripcion} />
      {!sinCanonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={OG_IMAGEN.url} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content={OG_IMAGEN.ancho} />
      <meta property="og:image:height" content={OG_IMAGEN.alto} />
      <meta property="og:image:alt" content={OG_IMAGEN.alt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={OG_IMAGEN.url} />
      <meta name="twitter:image:alt" content={OG_IMAGEN.alt} />

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
