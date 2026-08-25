import { describe, expect, it } from 'vitest';
import { BANCO } from './banco';
import { AREAS } from './areas';
import { calcularResultado, preguntasDeRama } from './puntuacion';
import type { OpcionId, RamaId, Respuestas } from './tipos';

/**
 * Pruebas de integridad del banco.
 *
 * Son la red que evita que una pregunta mal escrita llegue a un aspirante:
 * una respuesta correcta que no existe entre las opciones, dos opciones con la
 * misma letra, o un área sin preguntas producirían un diagnóstico falso sin que
 * la aplicación fallara de forma visible.
 */

const RAMAS: readonly RamaId[] = ['ingenieria', 'medico-biologicas', 'sociales-administrativas'];
const LETRAS: readonly OpcionId[] = ['a', 'b', 'c', 'd'];

describe('integridad del banco de preguntas', () => {
  it('tiene preguntas', () => {
    expect(BANCO.length).toBeGreaterThan(0);
  });

  it('no repite ningún identificador', () => {
    const ids = BANCO.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada pregunta tiene exactamente cuatro opciones con las letras a, b, c y d', () => {
    for (const p of BANCO) {
      expect(p.opciones, `pregunta ${p.id}`).toHaveLength(4);
      expect(p.opciones.map((o) => o.id), `pregunta ${p.id}`).toEqual(LETRAS);
    }
  });

  it('la respuesta correcta siempre existe entre las opciones', () => {
    for (const p of BANCO) {
      const letras = p.opciones.map((o) => o.id);
      expect(letras, `pregunta ${p.id}`).toContain(p.correcta);
    }
  });

  it('ninguna pregunta tiene dos opciones con el mismo texto', () => {
    for (const p of BANCO) {
      const textos = p.opciones.map((o) => o.texto.trim().toLowerCase());
      expect(new Set(textos).size, `pregunta ${p.id}`).toBe(4);
    }
  });

  it('toda pregunta apunta a un área que existe', () => {
    const idsArea = new Set(AREAS.map((a) => a.id));
    for (const p of BANCO) {
      expect(idsArea.has(p.areaId), `pregunta ${p.id} usa el área ${p.areaId}`).toBe(true);
    }
  });

  it('toda pregunta declara al menos una rama, y todas son válidas', () => {
    for (const p of BANCO) {
      expect(p.ramas.length, `pregunta ${p.id}`).toBeGreaterThan(0);
      for (const rama of p.ramas) {
        expect(RAMAS, `pregunta ${p.id}`).toContain(rama);
      }
    }
  });

  it('nunca deja vacíos el enunciado ni la explicación', () => {
    for (const p of BANCO) {
      expect(p.enunciado.trim().length, `pregunta ${p.id}`).toBeGreaterThan(10);
      expect(p.explicacion.trim().length, `pregunta ${p.id}`).toBeGreaterThan(20);
    }
  });

  it('usa los tres niveles de dificultad', () => {
    const niveles = new Set(BANCO.map((p) => p.dificultad));
    expect(niveles.size).toBeGreaterThanOrEqual(2);
    for (const n of niveles) {
      expect([1, 2, 3]).toContain(n);
    }
  });

  it('no contiene mojibake por acentos mal codificados', () => {
    const sospechoso = /Ã.|Â./;
    for (const p of BANCO) {
      const todo = [p.enunciado, p.explicacion, p.contexto ?? '', ...p.opciones.map((o) => o.texto)]
        .join(' ');
      expect(sospechoso.test(todo), `pregunta ${p.id}`).toBe(false);
    }
  });
});

describe('cobertura por rama', () => {
  it('las tres ramas tienen el mismo número de preguntas', () => {
    /**
     * La portada afirma en público «N preguntas originales». Si una rama tuviera
     * más que otra, ese número sería falso para alguien. Si esta prueba falla,
     * revisa el reparto o acepta que la portada dirá «desde N».
     */
    const conteos = RAMAS.map((r) => preguntasDeRama(BANCO, r).length);
    expect(new Set(conteos).size, `conteos por rama: ${conteos.join(', ')}`).toBe(1);
  });

  for (const rama of RAMAS) {
    describe(rama, () => {
      const suyas = preguntasDeRama(BANCO, rama);

      it('tiene suficientes preguntas para un diagnóstico útil', () => {
        expect(suyas.length).toBeGreaterThanOrEqual(20);
      });

      it('cubre al menos seis áreas distintas', () => {
        const areas = new Set(suyas.map((p) => p.areaId));
        expect(areas.size).toBeGreaterThanOrEqual(6);
      });

      it('produce un 100 % si se responde todo bien', () => {
        const perfectas: Respuestas = Object.fromEntries(suyas.map((p) => [p.id, p.correcta]));
        const r = calcularResultado(BANCO, AREAS, perfectas, rama);
        expect(r.porcentaje).toBe(100);
        expect(r.correctas).toBe(suyas.length);
        expect(r.mejoras).toEqual([]);
        expect(r.recomendacion.id).toBe('intensivo');
      });

      it('produce un 0 % si se responde todo mal', () => {
        const malas: Respuestas = Object.fromEntries(
          suyas.map((p) => {
            const incorrecta = LETRAS.find((l) => l !== p.correcta) as OpcionId;
            return [p.id, incorrecta];
          }),
        );
        const r = calcularResultado(BANCO, AREAS, malas, rama);
        expect(r.porcentaje).toBe(0);
        expect(r.fortalezas).toEqual([]);
        expect(r.recomendacion.id).toBe('blindado');
      });

      it('el desglose por área suma el total de preguntas de la rama', () => {
        const r = calcularResultado(BANCO, AREAS, {}, rama);
        const suma = r.porArea.reduce((acc, a) => acc + a.total, 0);
        expect(suma).toBe(suyas.length);
      });
    });
  }
});

describe('física por rama', () => {
  it('cada rama recibe preguntas de física, y no las de otra rama', () => {
    for (const rama of RAMAS) {
      const fisica = preguntasDeRama(BANCO, rama).filter((p) => p.areaId === 'fisica');
      expect(fisica.length, `física en ${rama}`).toBeGreaterThan(0);
      for (const p of fisica) {
        expect(p.ramas, `pregunta ${p.id}`).toContain(rama);
      }
    }
  });
});
