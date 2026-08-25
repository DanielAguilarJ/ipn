import { describe, expect, it } from 'vitest';
import { interpretar, listaLegible, tramoDe } from './interpretacion';
import { UMBRALES, calcularResultado } from './puntuacion';
import { AREAS } from './areas';
import { BANCO } from './banco';
import type { Respuestas } from './tipos';

describe('listaLegible', () => {
  it('une con «y» solo antes del último', () => {
    expect(listaLegible(['Inglés'])).toBe('Inglés');
    expect(listaLegible(['Física', 'Química'])).toBe('Física y Química');
    expect(listaLegible(['A', 'B', 'C'])).toBe('A, B y C');
  });

  it('devuelve cadena vacía sin elementos', () => {
    expect(listaLegible([])).toBe('');
  });
});

describe('nombres de área en listas', () => {
  /**
   * Un nombre que ya contenga « y » produce frases como
   * «Redacción y ortografía y Inglés». Se detectó en pantalla, no en las pruebas,
   * así que queda fijado aquí sobre el nombre corto, que es el que se enumera.
   */
  it('ningún nombre corto de área contiene la conjunción «y» suelta', () => {
    for (const area of AREAS) {
      expect(area.nombreCorto, `área ${area.id}`).not.toMatch(/\sy\s/);
    }
  });

  it('todas las áreas declaran un nombre corto no vacío', () => {
    for (const area of AREAS) {
      expect(area.nombreCorto.trim().length, `área ${area.id}`).toBeGreaterThan(2);
    }
  });
});

describe('tramoDe', () => {
  it('no llama «Sólido» a un puntaje por debajo del umbral de solidez', () => {
    expect(tramoDe(UMBRALES.solido - 1)).toBe('En desarrollo');
    expect(tramoDe(UMBRALES.solido)).toBe('Sólido');
  });

  it('cubre los extremos', () => {
    expect(tramoDe(0)).toBe('Punto de partida');
    expect(tramoDe(100)).toBe('Muy sólido');
  });

  it('es monótono: nunca baja de tramo al subir el puntaje', () => {
    const orden = ['Punto de partida', 'En construcción', 'En desarrollo', 'Sólido', 'Muy sólido'];
    let anterior = 0;
    for (let p = 0; p <= 100; p++) {
      const indice = orden.indexOf(tramoDe(p));
      expect(indice, `porcentaje ${p}`).toBeGreaterThanOrEqual(anterior);
      anterior = indice;
    }
  });
});

describe('interpretar', () => {
  const conRespuestas = (respuestas: Respuestas) =>
    calcularResultado(BANCO, AREAS, respuestas, 'ingenieria');

  it('nunca promete ni descarta la admisión', () => {
    const prohibido = /garantiz|asegura|te quedas|no vas a entrar|vas a entrar|seguro que/i;
    const casos: Respuestas[] = [
      {},
      Object.fromEntries(BANCO.map((p) => [p.id, p.correcta])),
    ];
    for (const caso of casos) {
      const i = interpretar(conRespuestas(caso));
      expect(prohibido.test(i.titular), i.titular).toBe(false);
      expect(prohibido.test(i.cuerpo), i.cuerpo).toBe(false);
    }
  });

  it('habla del resultado, no de la persona', () => {
    const i = interpretar(conRespuestas({}));
    expect(i.titular).not.toMatch(/\beres\b|\bno sirves\b|\bincapaz\b/i);
  });

  it('avisa de las preguntas sin responder y las cuenta como error', () => {
    const soloUna = BANCO.filter((p) => p.ramas.includes('ingenieria'))[0];
    const r = conRespuestas({ [soloUna!.id]: soloUna!.correcta });
    const i = interpretar(r);
    expect(r.sinResponder).toBeGreaterThan(0);
    expect(i.cuerpo).toContain('sin responder');
  });

  it('no menciona preguntas sin responder cuando se respondió todo', () => {
    const todas = Object.fromEntries(BANCO.map((p) => [p.id, p.correcta]));
    const i = interpretar(conRespuestas(todas));
    expect(i.cuerpo).not.toContain('sin responder');
  });

  it('con todo perfecto, el tramo es el más alto y no señala huecos', () => {
    const todas = Object.fromEntries(BANCO.map((p) => [p.id, p.correcta]));
    const r = conRespuestas(todas);
    const i = interpretar(r);
    expect(r.porcentaje).toBe(100);
    expect(i.tramo).toBe('Muy sólido');
    expect(i.titular).toContain('todas las áreas');
  });

  it('es determinista', () => {
    const respuestas = Object.fromEntries(
      BANCO.map((p, idx) => [p.id, idx % 2 === 0 ? p.correcta : 'a']),
    ) as Respuestas;
    const primero = interpretar(conRespuestas(respuestas));
    const segundo = interpretar(conRespuestas(respuestas));
    expect(primero).toEqual(segundo);
  });
});
