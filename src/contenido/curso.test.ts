import { describe, expect, it } from 'vitest';
import {
  HECHOS_HERO,
  INCLUYE,
  METODO,
  PREGUNTAS_CURSO,
  PROGRAMAS,
  PROGRAMA_MAS_ELEGIDO,
  enfasisPrograma,
  mensajeConDiagnostico,
  nodoFaqCurso,
} from './curso';
import { PREGUNTAS_FRECUENTES } from '@/components/inicio/Faq';
import { HECHOS_EXAMEN } from '@/datos/examenOficial';
import { UMBRALES_CURSO, recomendarCurso } from '@/diagnostico/puntuacion';

/**
 * Guardas del contenido comercial del curso.
 *
 * La lección más cara de este proyecto fue publicar programas que no existían:
 * el aspirante acababa pidiendo por WhatsApp un curso que nadie podía venderle.
 * Estas pruebas atan lo que la página ofrece a lo que el cálculo recomienda, para
 * que las dos cosas no puedan separarse otra vez sin que algo falle.
 */

describe('los programas ofrecidos coinciden con los que recomienda el diagnóstico', () => {
  it('cada resultado posible del cálculo tiene su programa en la página', () => {
    const ofrecidos = new Set(PROGRAMAS.map((p) => p.id));

    // Un caso por tramo, incluido el que baja de escalón por áreas en refuerzo.
    const casos = [
      recomendarCurso(95, []),
      recomendarCurso(60, []),
      recomendarCurso(20, []),
      recomendarCurso(95, [
        { areaId: 'a', nombre: 'A', correctas: 0, total: 4, porcentaje: 0, nivel: 'atencion' },
      ]),
    ];

    for (const caso of casos) {
      expect(ofrecidos.has(caso.id), `el cálculo recomienda ${caso.id} y la página no lo ofrece`).toBe(
        true,
      );
    }
  });

  it('el nombre con duración es idéntico en la página y en el cálculo', () => {
    for (const programa of PROGRAMAS) {
      const delCalculo = [recomendarCurso(95, []), recomendarCurso(60, []), recomendarCurso(20, [])].find(
        (r) => r.id === programa.id,
      );
      expect(delCalculo?.nombre, programa.id).toBe(`${programa.nombre} · ${programa.meses} meses`);
    }
  });

  it('el programa señalado como más elegido es uno de los tres', () => {
    expect(PROGRAMAS.some((p) => p.id === PROGRAMA_MAS_ELEGIDO)).toBe(true);
  });

  it('las tres duraciones son las reales de WorldBrain México', () => {
    expect(PROGRAMAS.map((p) => p.meses)).toEqual([4, 6, 8]);
  });

  it('los umbrales citados en el texto son los que usa el cálculo', () => {
    const texto = PROGRAMAS.map((p) => p.paraQuien).join(' ');
    expect(texto).toContain(String(UMBRALES_CURSO.estrategico));
    expect(texto).toContain(String(UMBRALES_CURSO.blindado));
  });
});

describe('lo que el curso afirma incluir', () => {
  it('no reclama validez oficial ni acreditación para un curso de preparación', () => {
    const texto = [...INCLUYE, ...METODO.map((p) => p.texto)].join(' ').toLowerCase();
    expect(texto).not.toMatch(/validez oficial|acreditad[ao] por la sep|con reconocimiento de la sep/);
  });

  it('no publica precio, cupo ni fecha de inicio, que no están confirmados', () => {
    const texto = [...INCLUYE, ...METODO.map((p) => p.texto)].join(' ');
    expect(texto).not.toMatch(/\$\s?\d/);
    expect(texto.toLowerCase()).not.toMatch(/m[áa]ximo \d+ alumnos|cupo de \d+/);
  });

  it('cuando menciona simulacros, niega reproducir el examen real', () => {
    const conSimulacro = [...METODO.map((p) => p.texto), ...PREGUNTAS_CURSO.map((p) => p.respuesta)]
      .filter((t) => /simulacro/i.test(t))
      .join(' ');
    expect(conSimulacro.length, 'no hay texto sobre simulacros que revisar').toBeGreaterThan(0);
    expect(conSimulacro).toMatch(/no (contienen|reproduce|reproducen)/i);
  });
});

describe('preguntas del curso', () => {
  it('no repite ninguna pregunta dentro de la página', () => {
    const preguntas = PREGUNTAS_CURSO.map((p) => p.pregunta.toLowerCase().trim());
    expect(new Set(preguntas).size).toBe(preguntas.length);
  });

  it('no duplica ninguna pregunta de la portada', () => {
    const enPortada = new Set(PREGUNTAS_FRECUENTES.map((p) => p.pregunta.toLowerCase().trim()));
    for (const p of PREGUNTAS_CURSO) {
      expect(enPortada.has(p.pregunta.toLowerCase().trim()), p.pregunta).toBe(false);
    }
  });

  it('toda respuesta tiene cuerpo suficiente para ser útil', () => {
    for (const p of PREGUNTAS_CURSO) {
      expect(p.respuesta.trim().length, p.pregunta).toBeGreaterThan(80);
      expect(p.pregunta.trim().endsWith('?'), p.pregunta).toBe(true);
    }
  });

  it('cubre las objeciones de compra que frenan una inscripción', () => {
    const todo = PREGUNTAS_CURSO.map((p) => `${p.pregunta} ${p.respuesta}`).join(' ').toLowerCase();
    for (const tema of ['precio', 'llam', 'modalidad', 'simulacro', 'garantiz', 'vocacional']) {
      expect(todo, `falta cubrir: ${tema}`).toContain(tema);
    }
  });

  it('responde expresamente que no garantiza la admisión', () => {
    const sobreGarantia = PREGUNTAS_CURSO.find((p) => /garantiza/i.test(p.pregunta));
    expect(sobreGarantia, 'falta la pregunta sobre la garantía').toBeDefined();
    expect(sobreGarantia?.respuesta).toMatch(/^No[,.]/);
  });

  it('el nodo FAQPage se genera del mismo texto visible y sin @context propio', () => {
    const nodo = nodoFaqCurso() as {
      '@context'?: string;
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };
    expect(nodo['@context']).toBeUndefined();
    expect(nodo.mainEntity).toHaveLength(PREGUNTAS_CURSO.length);
    for (const [i, entrada] of nodo.mainEntity.entries()) {
      const fuente = PREGUNTAS_CURSO[i];
      expect(entrada.name).toBe(fuente?.pregunta);
      expect(entrada.acceptedAnswer.text).toBe(fuente?.respuesta);
    }
  });
});

describe('el énfasis visual sigue al diagnóstico, no a una preferencia fija', () => {
  it('sin diagnóstico, solo se señala el más elegido', () => {
    const marcados = PROGRAMAS.filter((p) => enfasisPrograma(p.id, null) !== 'ninguno');
    expect(marcados).toHaveLength(1);
    expect(marcados[0]?.id).toBe(PROGRAMA_MAS_ELEGIDO);
    expect(enfasisPrograma(PROGRAMA_MAS_ELEGIDO, null)).toBe('mas-elegido');
  });

  it('con diagnóstico, solo se señala el programa recomendado', () => {
    for (const recomendado of PROGRAMAS.map((p) => p.id)) {
      const marcados = PROGRAMAS.filter((p) => enfasisPrograma(p.id, recomendado) !== 'ninguno');
      expect(marcados.map((p) => p.id), `recomendado: ${recomendado}`).toEqual([recomendado]);
      expect(enfasisPrograma(recomendado, recomendado)).toBe('recomendado');
    }
  });

  it('el más elegido deja de destacarse cuando el diagnóstico recomienda otro', () => {
    expect(enfasisPrograma(PROGRAMA_MAS_ELEGIDO, 'intensivo')).toBe('ninguno');
    expect(enfasisPrograma(PROGRAMA_MAS_ELEGIDO, 'blindado')).toBe('ninguno');
  });
});

describe('las cifras del hero salen de la fuente oficial, no inventadas', () => {
  it('cada dato del hero existe tal cual en HECHOS_EXAMEN', () => {
    const oficiales = new Set(HECHOS_EXAMEN.map((h) => h.dato));
    for (const h of HECHOS_HERO) {
      expect(oficiales.has(h.dato), `el hero muestra "${h.dato}" y no está en la fuente`).toBe(true);
    }
  });

  it('ninguna nota del hero introduce una cifra que la fuente no respalde', () => {
    // La única cifra admitida en las notas es el ritmo derivado de 140 en 3 h.
    for (const h of HECHOS_HERO) {
      const cifras = h.nota.match(/\d+/g) ?? [];
      for (const c of cifras) {
        expect(['77'], `nota "${h.nota}" trae una cifra sin respaldo`).toContain(c);
      }
    }
  });
});

describe('mensaje de WhatsApp con diagnóstico', () => {
  it('lleva el porcentaje y el programa recomendado', () => {
    const mensaje = mensajeConDiagnostico('Estratégico · 6 meses', 62);
    expect(mensaje).toContain('62 %');
    expect(mensaje).toContain('Estratégico · 6 meses');
  });

  it('pide costo, fechas y modalidad, que es lo prometido en la página', () => {
    const mensaje = mensajeConDiagnostico('Intensivo · 4 meses', 88);
    expect(mensaje.toLowerCase()).toContain('costo');
    expect(mensaje.toLowerCase()).toContain('modalidad');
  });
});
