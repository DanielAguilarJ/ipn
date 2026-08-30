/**
 * Constructores de datos estructurados compartidos.
 *
 * Existen porque tres páginas —el diagnóstico, las fuentes y el aviso legal—
 * servían CERO datos estructurados, y las migas de pan estaban escritas a mano en
 * cada página que sí las tenía. Un solo constructor evita que la ruta del
 * breadcrumb vuelva a apuntar a una URL que no existe, que es el defecto que ya
 * apareció una vez en la página del curso (declaraba `/curso` en vez de
 * `/curso-ipn`).
 *
 * Regla: la ruta que se pasa aquí debe ser la misma que recibe `Meta`, para que
 * el canonical y la última miga coincidan siempre.
 */

import { BRAND, LINKS, SITE, WHATSAPP } from '@/config/site';

/** URL absoluta de una ruta del sitio. */
export function urlDe(ruta: string): string {
  return `${SITE.origin.value}${ruta === '/' ? '/' : ruta}`;
}

/** Identificador estable del nodo WebSite que declara la portada. */
export const ID_SITIO = `${SITE.origin.value}/#sitio`;

/** Identificador estable del nodo de la organización que declara la portada. */
export const ID_ORGANIZACION = `${SITE.origin.value}/#organizacion`;

/**
 * Migas de pan de una página interior.
 *
 * Google las usa para mostrar la ruta en el resultado en lugar de la URL cruda.
 * Siempre arrancan en la portada, así que solo hay que dar el nombre y la ruta de
 * la página actual.
 */
export function nodoMigas(nombre: string, ruta: string): object {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: urlDe('/') },
      { '@type': 'ListItem', position: 2, name: nombre, item: urlDe(ruta) },
    ],
  };
}

/**
 * Nodo de página, enlazado al sitio y a la organización que declara la portada.
 *
 * Se referencian por `@id` en lugar de repetir sus datos: las relaciones `isPartOf`
 * y `publisher` enlazan las seis rutas con los mismos nodos del sitio y del
 * proveedor, sin duplicar seis veces la descripción de la organización.
 */
export function nodoPagina(opciones: {
  readonly nombre: string;
  readonly descripcion: string;
  readonly ruta: string;
}): object {
  return {
    '@type': 'WebPage',
    '@id': `${urlDe(opciones.ruta)}#pagina`,
    url: urlDe(opciones.ruta),
    name: opciones.nombre,
    description: opciones.descripcion,
    inLanguage: 'es-MX',
    isPartOf: { '@id': ID_SITIO },
    publisher: { '@id': ID_ORGANIZACION },
  };
}

/**
 * El sitio y la organización, declarados en TODAS las páginas.
 *
 * Google no sigue una referencia `@id` hasta otra página. Cinco de las seis rutas
 * declaraban `publisher` e `isPartOf` apuntando a `#organizacion` y `#sitio` sin que
 * esos nodos existieran allí, así que su editor quedaba en un «elemento sin nombre»:
 * la referencia parecía correcta y no resolvía a nada. Incluida `/examen-ipn`, que es
 * la página pensada para captar búsqueda.
 *
 * Los valores salen de configuración, donde están marcados como confirmados contra el
 * sitio en vivo. No se inventa domicilio, horario ni logotipo.
 */
export function nodosIdentidad(): readonly object[] {
  return [
    {
      '@type': 'WebSite',
      '@id': ID_SITIO,
      url: urlDe('/'),
      name: BRAND.program,
      alternateName: [
        BRAND.program.replace(/\s+/g, ''),
        SITE.origin.value.replace(/^https?:\/\//, ''),
      ],
      inLanguage: 'es-MX',
      publisher: { '@id': ID_ORGANIZACION },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': ID_ORGANIZACION,
      name: BRAND.org,
      description: `${BRAND.tagline}. Organización independiente, no afiliada al Instituto Politécnico Nacional.`,
      url: LINKS.worldbrain.value,
      sameAs: [LINKS.worldbrain.value, LINKS.cursoDetalle.value],
      telephone: `+${WHATSAPP.numero.value}`,
      areaServed: { '@type': 'Country', name: 'México' },
    },
  ];
}

/**
 * Envuelve varios nodos en un grafo con un solo `@context`.
 *
 * Antepone siempre la identidad. Se hace aquí y no en cada página a propósito: si
 * dependiera de que cada ruta se acordara de incluirla, la siguiente página nueva
 * volvería a nacer con el editor sin resolver, que es el defecto que esto corrige.
 */
export function grafo(...nodos: readonly object[]): object {
  return { '@context': 'https://schema.org', '@graph': [...nodosIdentidad(), ...nodos] };
}

/**
 * Imagen que representa al sitio, en absoluto.
 *
 * Vive aquí y no en `Meta.tsx` porque la usan dos consumidores: las etiquetas
 * sociales y los datos estructurados. Duplicar la ruta garantizaría que un día
 * apunten a archivos distintos.
 */
export const URL_IMAGEN_SOCIAL = `${SITE.origin.value}/og.png`;

/**
 * Campos de identidad que Google espera en un `Article`.
 *
 * El autor y el editor son la organización, no una persona: el contenido lo
 * elabora WorldBrain México a partir de fuentes oficiales, y firmar con un nombre
 * propio inventado sería peor que no firmar. `Organization` como autor es válido en
 * schema.org y es lo que corresponde aquí.
 *
 * Importa más de lo que parece en un dominio nuevo: es lo que ata el artículo a una
 * entidad con existencia comprobable en lugar de dejarlo como texto anónimo.
 */
export function identidadDeArticulo(): object {
  return {
    author: { '@id': ID_ORGANIZACION },
    publisher: { '@id': ID_ORGANIZACION },
    isPartOf: { '@id': ID_SITIO },
    image: URL_IMAGEN_SOCIAL,
  };
}
