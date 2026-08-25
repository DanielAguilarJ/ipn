import { describe, expect, it } from 'vitest';
import { PREGUNTAS_FRECUENTES, esquemaFaq } from '@/components/inicio/Faq';
import { HECHOS_EXAMEN, NO_PUBLICADO, RAMAS, FUENTES } from '@/datos/examenOficial';
import { LEGAL } from '@/config/site';

/**
 * Guardas del contenido público.
 *
 * La investigación de competidores encontró que varios prometen reproducir el
 * examen real y publican saltos de puntaje concretos como prueba social. Esa es
 * exactamente la línea que este sitio no cruza, y una decisión así no sobrevive
 * sola a futuras ediciones de copy: estas pruebas fallan si alguien la reintroduce.
 */

/** Todo el texto que se muestra al público, en un solo lugar. */
function textoPublico(): string {
  return [
    ...PREGUNTAS_FRECUENTES.flatMap((p) => [p.pregunta, p.respuesta]),
    ...HECHOS_EXAMEN.flatMap((h) => [h.dato, h.detalle]),
    ...NO_PUBLICADO,
    ...RAMAS.flatMap((r) => [r.nombre, r.ejemplos]),
    LEGAL.independencia,
    LEGAL.diagnostico,
    LEGAL.marcas,
  ].join('\n');
}

/**
 * Busca un patrón que solo es problemático en afirmativo.
 *
 * «no predice ni garantiza tu admisión» contiene literalmente «garantiza tu
 * admisión», y es precisamente la frase que queremos conservar. Así que una
 * coincidencia solo cuenta si NO viene negada justo antes.
 */
function afirmaSinNegar(texto: string, patron: RegExp): string | null {
  const global = new RegExp(patron.source, 'gi');
  for (const m of texto.matchAll(global)) {
    const antes = texto.slice(Math.max(0, (m.index ?? 0) - 40), m.index ?? 0);
    if (!/\b(no|ni|nunca|jam[áa]s|sin)\b[^.]*$/i.test(antes)) {
      return m[0];
    }
  }
  return null;
}

describe('honestidad del contenido público', () => {
  const texto = textoPublico();

  it('no promete la admisión ni un lugar', () => {
    const patron =
      /garantiz\w*\s+(?:tu|el|su)?\s*(?:admisi|lugar|ingreso)|te aseguramos (?:un|tu) lugar|quedar\w* garantizad/;
    expect(afirmaSinNegar(texto, patron)).toBeNull();
  });

  it('sí niega expresamente que garantice la admisión', () => {
    // La contraparte de la prueba anterior: la negación debe existir de verdad.
    expect(LEGAL.diagnostico).toMatch(/no (predice|garantiza)/i);
  });

  it('no afirma reproducir el examen real ni sus preguntas', () => {
    const patron =
      /(?:mismas|iguales a las) preguntas del examen|r[ée]plica exacta del examen|el examen real completo/;
    expect(afirmaSinNegar(texto, patron)).toBeNull();
  });

  it('no publica un reparto de preguntas por materia', () => {
    // Un porcentaje junto a un nombre de materia sería una cifra que el IPN no publica.
    const materias =
      /(matem[áa]ticas|f[íi]sica|qu[íi]mica|biolog[íi]a|ingl[ée]s|historia)[^.]{0,30}\d{1,2}\s?%/i;
    expect(materias.test(texto), 'aparece un porcentaje por materia').toBe(false);
  });

  it('dice expresamente que el IPN no publica ese reparto', () => {
    expect(NO_PUBLICADO.join(' ')).toMatch(/no publica|no lo publica|confidencial/i);
  });

  it('afirma la independencia respecto al IPN en un texto visible', () => {
    expect(LEGAL.independencia).toMatch(/no es un sitio oficial/i);
    expect(LEGAL.independencia).toMatch(/no est[áa] afiliado/i);
    expect(LEGAL.independenciaCorta).toMatch(/no es un sitio oficial del IPN/i);
  });

  it('el aviso del diagnóstico niega que prediga la admisión', () => {
    expect(LEGAL.diagnostico).toMatch(/no predice|no garantiza/i);
  });

  it('no usa cifras de prueba social sin respaldo', () => {
    const inventadas = /\d+\s*(alumnos|aspirantes) (aceptad|admitid)|\d{1,3}\s?% de (aceptad|admisi)/i;
    expect(inventadas.test(texto)).toBe(false);
  });
});

describe('preguntas frecuentes', () => {
  it('no repite ninguna pregunta', () => {
    const preguntas = PREGUNTAS_FRECUENTES.map((p) => p.pregunta.toLowerCase().trim());
    expect(new Set(preguntas).size).toBe(preguntas.length);
  });

  it('toda respuesta tiene cuerpo suficiente para ser útil', () => {
    for (const p of PREGUNTAS_FRECUENTES) {
      expect(p.respuesta.trim().length, p.pregunta).toBeGreaterThan(80);
      expect(p.pregunta.trim().endsWith('?'), p.pregunta).toBe(true);
    }
  });

  it('cubre las objeciones de compra detectadas en la investigación', () => {
    const todo = PREGUNTAS_FRECUENTES.map((p) => `${p.pregunta} ${p.respuesta}`).join(' ').toLowerCase();
    for (const tema of ['tiempo', 'cámara', 'aciertos', 'cuesta', 'registro', 'promedio']) {
      expect(todo, `falta cubrir: ${tema}`).toContain(tema);
    }
  });

  it('el schema FAQPage se genera del mismo texto visible', () => {
    const schema = esquemaFaq() as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };
    expect(schema.mainEntity).toHaveLength(PREGUNTAS_FRECUENTES.length);
    for (const [i, entrada] of schema.mainEntity.entries()) {
      const fuente = PREGUNTAS_FRECUENTES[i];
      expect(entrada.name).toBe(fuente?.pregunta);
      expect(entrada.acceptedAnswer.text).toBe(fuente?.respuesta);
    }
  });
});

describe('trazabilidad de las fuentes', () => {
  it('cada fuente tiene URL absoluta y fecha de consulta en formato ISO', () => {
    for (const f of Object.values(FUENTES)) {
      expect(f.url, f.id).toMatch(/^https:\/\//);
      expect(f.consultada, f.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(f.titulo.trim().length, f.id).toBeGreaterThan(10);
    }
  });

  it('todo hecho del examen apunta a una fuente que existe', () => {
    for (const h of HECHOS_EXAMEN) {
      expect(FUENTES[h.fuenteId], `${h.dato} apunta a ${h.fuenteId}`).toBeDefined();
    }
  });
});
