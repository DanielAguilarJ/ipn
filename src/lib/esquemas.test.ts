import { describe, expect, it } from 'vitest';
import { ID_ORGANIZACION, ID_SITIO, grafo, nodoMigas, nodoPagina, urlDe } from './esquemas';
import { RUTAS } from '@/App';
import { SITE } from '@/config/site';

/**
 * Guardas de los datos estructurados.
 *
 * El defecto que motiva este archivo ya ocurrió: la página del curso declaraba en
 * su breadcrumb `/curso` cuando la ruta real es `/curso-ipn`, así que Google
 * recibía una miga de pan hacia un 404. Ni el compilador ni las pruebas de
 * contenido lo detectaban, porque es una cadena de texto válida.
 */

interface Migas {
  readonly '@type': string;
  readonly itemListElement: ReadonlyArray<{
    readonly position: number;
    readonly name: string;
    readonly item: string;
  }>;
}

/** Rutas que el sitio publica de verdad, con su forma absoluta. */
const URLS_REALES = new Set(RUTAS.map((r) => urlDe(r)));

describe('migas de pan', () => {
  it('cada miga apunta a una ruta que el sitio publica', () => {
    for (const ruta of RUTAS) {
      const migas = nodoMigas('Prueba', ruta) as unknown as Migas;
      for (const item of migas.itemListElement) {
        expect(
          URLS_REALES.has(item.item),
          `la miga «${item.name}» apunta a ${item.item}, que no es una ruta del sitio`,
        ).toBe(true);
      }
    }
  });

  it('siempre arranca en la portada y numera desde 1', () => {
    const migas = nodoMigas('El curso', '/curso-ipn') as unknown as Migas;
    expect(migas.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(migas.itemListElement[0]?.item).toBe(`${SITE.origin.value}/`);
    expect(migas.itemListElement[1]?.item).toBe(`${SITE.origin.value}/curso-ipn`);
  });

  it('usa URLs absolutas, porque Google no resuelve rutas relativas', () => {
    for (const ruta of RUTAS) {
      const migas = nodoMigas('Prueba', ruta) as unknown as Migas;
      for (const item of migas.itemListElement) {
        expect(item.item, ruta).toMatch(/^https:\/\//);
      }
    }
  });
});

describe('nodo de página', () => {
  it('se enlaza al sitio y a la organización por identificador, sin duplicarlos', () => {
    const nodo = nodoPagina({
      nombre: 'Fuentes',
      descripcion: 'Fuentes oficiales del IPN con su fecha de consulta.',
      ruta: '/fuentes',
    }) as Record<string, unknown>;

    expect(nodo['@type']).toBe('WebPage');
    expect(nodo.url).toBe(`${SITE.origin.value}/fuentes`);
    expect(nodo.isPartOf).toEqual({ '@id': ID_SITIO });
    expect(nodo.publisher).toEqual({ '@id': ID_ORGANIZACION });
    expect(nodo.inLanguage).toBe('es-MX');
  });

  it('su identificador es único por ruta', () => {
    const ids = RUTAS.map(
      (ruta) =>
        (
          nodoPagina({ nombre: 'x', descripcion: 'y', ruta }) as Record<string, unknown>
        )['@id'] as string,
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('grafo', () => {
  it('antepone la identidad, declara el contexto una sola vez y conserva el orden', () => {
    const resultado = grafo({ '@type': 'A' }, { '@type': 'B' }) as {
      '@context': string;
      '@graph': ReadonlyArray<{ '@type': string }>;
    };
    expect(resultado['@context']).toBe('https://schema.org');

    /**
     * La identidad va primero y siempre.
     *
     * Google no sigue una referencia `@id` hasta otra página, así que una ruta que
     * declare `publisher` sin definir la organización ahí mismo publica un editor
     * ilegible. Antes esto solo se cumplía en la portada; ahora lo garantiza `grafo()`
     * y esta prueba lo fija, para que nadie lo «simplifique» sin ver qué rompe.
     */
    expect(resultado['@graph'].map((n) => n['@type'])).toEqual([
      'WebSite',
      'EducationalOrganization',
      'A',
      'B',
    ]);
  });

  it('ningún nodo del grafo trae su propio @context', () => {
    const resultado = grafo(
      nodoPagina({ nombre: 'x', descripcion: 'y', ruta: '/fuentes' }),
      nodoMigas('x', '/fuentes'),
    ) as { '@graph': ReadonlyArray<Record<string, unknown>> };

    for (const nodo of resultado['@graph']) {
      expect(nodo['@context'], `nodo ${String(nodo['@type'])}`).toBeUndefined();
    }
  });
});
