import { describe, expect, it } from 'vitest';
import { nodosIdentidad, urlDe } from '@/lib/esquemas';
import { BRAND, LINKS, WHATSAPP } from '@/config/site';
import { ID_ORGANIZACION, ID_SITIO } from '@/lib/esquemas';

/**
 * Guarda de la identidad que se declara a los buscadores.
 *
 * La portada es el único sitio donde se describe la organización; las otras seis
 * páginas la referencian por `@id`. Si esos datos se desvían de la configuración
 * confirmada, Google recibiría una entidad distinta de la real y no podría atar
 * este dominio con WorldBrain México, que es justo para lo que existen.
 *
 * Se comprueba contra `site.ts` en lugar de contra literales escritos aquí: una
 * prueba que repite el valor a mano no detecta nada.
 */

interface Nodo {
  readonly '@type': string;
  readonly '@id'?: string;
  readonly url?: string;
  readonly sameAs?: readonly string[];
  readonly telephone?: string;
  readonly name?: string;
  readonly publisher?: { readonly '@id': string };
}

function nodos(): readonly Nodo[] {
  /**
   * Se leen los nodos directamente.
   *
   * La versión anterior sacaba `['@graph']` del resultado, que es justo la forma que
   * producía el defecto: la portada envolvía los nodos en un documento y los servía
   * dentro de otro `@graph`. La prueba pasaba porque comprobaba la misma estructura
   * equivocada que el error creaba.
   */
  return nodosIdentidad() as readonly Nodo[];
}

function nodoDe(tipo: string): Nodo {
  const encontrado = nodos().find((n) => n['@type'] === tipo);
  if (!encontrado) throw new Error(`el grafo de la portada no declara ${tipo}`);
  return encontrado;
}

describe('identidad de la organización', () => {
  it('usa el identificador que referencian las demás páginas', () => {
    expect(nodoDe('EducationalOrganization')['@id']).toBe(ID_ORGANIZACION);
    expect(nodoDe('WebSite')['@id']).toBe(ID_SITIO);
  });

  it('declara el sitio de la empresa como su URL', () => {
    expect(nodoDe('EducationalOrganization').url).toBe(LINKS.worldbrain.value);
  });

  it('se identifica con el sitio de la empresa y la página real del curso', () => {
    const sameAs = nodoDe('EducationalOrganization').sameAs ?? [];
    expect(sameAs).toContain(LINKS.worldbrain.value);
    expect(sameAs).toContain(LINKS.cursoDetalle.value);
  });

  it('solo se identifica con enlaces confirmados', () => {
    const confirmados = new Set(
      Object.values(LINKS)
        .filter((l) => l.confirmado)
        .map((l) => l.value),
    );
    for (const url of nodoDe('EducationalOrganization').sameAs ?? []) {
      expect(confirmados.has(url), `${url} no está confirmado en site.ts`).toBe(true);
    }
  });

  it('publica el mismo teléfono que usan los botones de WhatsApp', () => {
    expect(nodoDe('EducationalOrganization').telephone).toBe(`+${WHATSAPP.numero.value}`);
  });

  it('el sitio declara a la organización como responsable', () => {
    expect(nodoDe('WebSite').publisher).toEqual({ '@id': ID_ORGANIZACION });
  });

  it('no inventa domicilio, horario ni logotipo', () => {
    const org = nodoDe('EducationalOrganization') as unknown as Record<string, unknown>;
    for (const campo of ['address', 'openingHours', 'openingHoursSpecification', 'logo', 'image']) {
      expect(org[campo], `${campo} no está verificado y no debe declararse`).toBeUndefined();
    }
  });

  it('el nombre y el dominio salen de configuración, no de literales', () => {
    expect(nodoDe('EducationalOrganization').name).toBe(BRAND.org);
    expect(nodoDe('WebSite').name).toBe(BRAND.program);
    expect(nodoDe('WebSite').url).toBe(urlDe('/'));
  });
});
