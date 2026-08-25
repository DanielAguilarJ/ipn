import { describe, expect, it } from 'vitest';
import { BRAND, CURSO, LEGAL, LINKS, SITE, WHATSAPP, whatsappUrl } from './site';

/**
 * Pruebas de la configuración.
 *
 * Existen porque un enlace mal escrito aquí no rompe nada visible: la página
 * compila, se ve bien y el botón simplemente lleva a ningún sitio. Estas
 * comprobaciones convierten ese fallo silencioso en un fallo ruidoso.
 */

describe('enlaces', () => {
  it('todos son absolutos y con https', () => {
    for (const [nombre, enlace] of Object.entries(LINKS)) {
      expect(enlace.value, nombre).toMatch(/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}/i);
      expect(enlace.value, nombre).not.toMatch(/\s/);
    }
  });

  it('el sitio de la empresa y la página del curso comparten dominio', () => {
    const dominio = (url: string) => new URL(url).hostname;
    expect(dominio(LINKS.cursoDetalle.value)).toBe(dominio(LINKS.worldbrain.value));
  });

  it('los enlaces del IPN apuntan a dominios oficiales', () => {
    for (const clave of ['ipnOficial', 'ipnAdmision', 'ipnDae'] as const) {
      expect(new URL(LINKS[clave].value).hostname, clave).toMatch(/\.ipn\.mx$/);
    }
  });

  it('el dominio propio no se confunde con el del IPN', () => {
    // Publicar bajo un subdominio del IPN sería suplantación, no independencia.
    expect(new URL(SITE.origin.value).hostname).not.toMatch(/\.ipn\.mx$/);
  });
});

describe('WhatsApp', () => {
  it('el número tiene formato internacional sin signos', () => {
    expect(WHATSAPP.numero.value).toMatch(/^52\d{10}$/);
  });

  it('el número visible corresponde al que se marca', () => {
    const soloDigitos = WHATSAPP.numeroVisible.replace(/\D/g, '');
    expect(WHATSAPP.numero.value).toBe(`52${soloDigitos}`);
  });

  it('el enlace codifica el mensaje y no rompe con acentos', () => {
    const url = whatsappUrl('Hola, ¿cuánto cuesta el curso? Saqué 19 de 38.');
    const analizada = new URL(url);
    expect(analizada.hostname).toBe('wa.me');
    expect(analizada.pathname).toBe(`/${WHATSAPP.numero.value}`);
    expect(analizada.searchParams.get('text')).toBe(
      'Hola, ¿cuánto cuesta el curso? Saqué 19 de 38.',
    );
  });
});

describe('datos comerciales', () => {
  it('el precio solo se considera mostrable si está confirmado y no es nulo', () => {
    const mostrable = CURSO.precioMXN.confirmado && CURSO.precioMXN.value !== null;
    // Hoy no lo está: el sitio de la empresa no publica precio.
    expect(mostrable).toBe(false);
  });

  it('no hay ningún dato comercial confirmado con valor nulo', () => {
    // Confirmar algo como nulo dejaría un hueco visible en la interfaz.
    for (const [nombre, campo] of Object.entries(CURSO)) {
      if (campo.confirmado) {
        expect(campo.value, nombre).not.toBeNull();
      }
    }
  });
});

describe('identidad y avisos', () => {
  it('la marca declara organización y descriptor', () => {
    expect(BRAND.org).toBe('WorldBrain México');
    expect(BRAND.program.length).toBeGreaterThan(3);
    expect(BRAND.tagline).toMatch(/Instituto Politécnico Nacional/);
  });

  it('el aviso corto cabe en una franja y sigue siendo explícito', () => {
    expect(LEGAL.independenciaCorta.length).toBeLessThan(120);
    expect(LEGAL.independenciaCorta).toMatch(/no es un sitio oficial del IPN/i);
  });

  it('el canonical se construye sin barra doble', () => {
    expect(SITE.origin.value).not.toMatch(/\/$/);
  });
});
