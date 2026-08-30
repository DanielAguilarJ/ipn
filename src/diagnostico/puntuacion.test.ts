import { describe, expect, it } from 'vitest';
import {
  UMBRALES,
  areasSolidas,
  calcularResultado,
  nivelDe,
  ordenarPorPrioridad,
  preguntasDeRama,
  recomendarCurso,
} from './puntuacion';
import type { Area, Pregunta, Respuestas, ResultadoArea } from './tipos';

/** Fábricas mínimas para no acoplar las pruebas al banco real de preguntas. */

const area = (id: string, nombre = id): Area => ({
  id,
  nombre,
  nombreCorto: nombre,
  descripcion: `Descripción de ${nombre}`,
  temas: ['tema uno', 'tema dos'],
  comoMejorar: `Cómo mejorar en ${nombre}`,
});

const pregunta = (id: string, areaId: string, ramas: Pregunta['ramas']): Pregunta => ({
  id,
  areaId,
  ramas,
  enunciado: `Enunciado ${id}`,
  opciones: [
    { id: 'a', texto: 'A' },
    { id: 'b', texto: 'B' },
    { id: 'c', texto: 'C' },
    { id: 'd', texto: 'D' },
  ],
  correcta: 'a',
  explicacion: 'Explicación',
  dificultad: 2,
});

const TODAS_LAS_RAMAS: Pregunta['ramas'] = [
  'ingenieria',
  'medico-biologicas',
  'sociales-administrativas',
];

describe('nivelDe', () => {
  it('clasifica exactamente en los umbrales', () => {
    expect(nivelDe(UMBRALES.solido)).toBe('solido');
    expect(nivelDe(UMBRALES.solido - 1)).toBe('medio');
    expect(nivelDe(UMBRALES.medio)).toBe('medio');
    expect(nivelDe(UMBRALES.medio - 1)).toBe('atencion');
  });

  it('trata los extremos como cabe esperar', () => {
    expect(nivelDe(0)).toBe('atencion');
    expect(nivelDe(100)).toBe('solido');
  });
});

describe('preguntasDeRama', () => {
  it('deja solo las preguntas de la rama y conserva su orden', () => {
    const preguntas = [
      pregunta('p1', 'mat', ['ingenieria']),
      pregunta('p2', 'bio', ['medico-biologicas']),
      pregunta('p3', 'mat', TODAS_LAS_RAMAS),
    ];
    const resultado = preguntasDeRama(preguntas, 'ingenieria');
    expect(resultado.map((p) => p.id)).toEqual(['p1', 'p3']);
  });

  it('no modifica el arreglo original', () => {
    const preguntas = [pregunta('p1', 'mat', ['ingenieria'])];
    const copia = [...preguntas];
    preguntasDeRama(preguntas, 'medico-biologicas');
    expect(preguntas).toEqual(copia);
  });
});

describe('calcularResultado', () => {
  const areas = [area('mat', 'Matemáticas'), area('lect', 'Comprensión lectora')];
  const preguntas = [
    pregunta('m1', 'mat', TODAS_LAS_RAMAS),
    pregunta('m2', 'mat', TODAS_LAS_RAMAS),
    pregunta('m3', 'mat', TODAS_LAS_RAMAS),
    pregunta('m4', 'mat', TODAS_LAS_RAMAS),
    pregunta('l1', 'lect', TODAS_LAS_RAMAS),
    pregunta('l2', 'lect', TODAS_LAS_RAMAS),
  ];

  it('cuenta los aciertos por área y en total', () => {
    const respuestas: Respuestas = { m1: 'a', m2: 'a', m3: 'b', m4: 'c', l1: 'a', l2: 'a' };
    const r = calcularResultado(preguntas, areas, respuestas, 'ingenieria');

    expect(r.total).toBe(6);
    expect(r.correctas).toBe(4);
    expect(r.porcentaje).toBe(67);

    const mat = r.porArea.find((a) => a.areaId === 'mat') as ResultadoArea;
    expect(mat.correctas).toBe(2);
    expect(mat.total).toBe(4);
    expect(mat.porcentaje).toBe(50);
    expect(mat.nivel).toBe('medio');

    const lect = r.porArea.find((a) => a.areaId === 'lect') as ResultadoArea;
    expect(lect.porcentaje).toBe(100);
    expect(lect.nivel).toBe('solido');
  });

  it('cuenta las preguntas sin responder como incorrectas y las reporta', () => {
    const respuestas: Respuestas = { m1: 'a' };
    const r = calcularResultado(preguntas, areas, respuestas, 'ingenieria');

    expect(r.correctas).toBe(1);
    expect(r.sinResponder).toBe(5);
    expect(r.porcentaje).toBe(17);
  });

  it('devuelve todo en cero cuando no hay ninguna respuesta', () => {
    const r = calcularResultado(preguntas, areas, {}, 'ingenieria');
    expect(r.correctas).toBe(0);
    expect(r.porcentaje).toBe(0);
    expect(r.fortalezas).toEqual([]);
    expect(r.mejoras).toHaveLength(2);
  });

  it('es determinista: dos cálculos idénticos dan el mismo resultado', () => {
    const respuestas: Respuestas = { m1: 'a', m2: 'b', m3: 'a', l1: 'a' };
    const primero = calcularResultado(preguntas, areas, respuestas, 'ingenieria');
    const segundo = calcularResultado(preguntas, areas, respuestas, 'ingenieria');
    expect(primero).toEqual(segundo);
  });

  it('no altera el objeto de respuestas ni los arreglos de entrada', () => {
    const respuestas: Respuestas = { m1: 'a', l1: 'a' };
    const copiaRespuestas = { ...respuestas };
    const copiaPreguntas = [...preguntas];
    calcularResultado(preguntas, areas, respuestas, 'ingenieria');
    expect(respuestas).toEqual(copiaRespuestas);
    expect(preguntas).toEqual(copiaPreguntas);
  });

  it('omite del desglose las áreas sin preguntas en esa rama', () => {
    const soloIngenieria = [
      pregunta('m1', 'mat', ['ingenieria']),
      pregunta('b1', 'bio', ['medico-biologicas']),
    ];
    const conBio = [...areas, area('bio', 'Biología')];
    const r = calcularResultado(soloIngenieria, conBio, { m1: 'a' }, 'ingenieria');
    expect(r.porArea.map((a: ResultadoArea) => a.areaId)).toEqual(['mat']);
  });

  it('ordena fortalezas de mayor a menor y mejoras de menor a mayor', () => {
    const tresAreas = [area('a1'), area('a2'), area('a3')];
    const set = [
      pregunta('x1', 'a1', TODAS_LAS_RAMAS),
      pregunta('x2', 'a1', TODAS_LAS_RAMAS),
      pregunta('y1', 'a2', TODAS_LAS_RAMAS),
      pregunta('y2', 'a2', TODAS_LAS_RAMAS),
      pregunta('z1', 'a3', TODAS_LAS_RAMAS),
      pregunta('z2', 'a3', TODAS_LAS_RAMAS),
    ];
    // a1 = 100 %, a2 = 50 %, a3 = 0 %
    const r = calcularResultado(
      set,
      tresAreas,
      { x1: 'a', x2: 'a', y1: 'a', y2: 'b', z1: 'b', z2: 'b' },
      'ingenieria',
    );
    expect(r.fortalezas.map((a: ResultadoArea) => a.areaId)).toEqual(['a1']);
    expect(r.mejoras.map((a: ResultadoArea) => a.areaId)).toEqual(['a3', 'a2']);
  });
});

describe('recomendarCurso', () => {
  const areaResultado = (id: string, porcentaje: number): ResultadoArea => ({
    areaId: id,
    nombre: id,
    correctas: porcentaje,
    total: 100,
    porcentaje,
    nivel: nivelDe(porcentaje),
  });

  it('recomienda Blindado cuando el puntaje global es bajo', () => {
    expect(recomendarCurso(30, [areaResultado('a', 30)]).id).toBe('blindado');
  });

  it('recomienda Estratégico en el rango intermedio', () => {
    expect(recomendarCurso(60, [areaResultado('a', 60)]).id).toBe('estrategico');
  });

  it('recomienda Intensivo solo con puntaje alto y sin áreas en riesgo', () => {
    const fuerte = [areaResultado('a', 90), areaResultado('b', 85)];
    expect(recomendarCurso(88, fuerte).id).toBe('intensivo');
  });

  it('baja de Intensivo a Estratégico si un área quedó en atención', () => {
    const desigual = [areaResultado('a', 100), areaResultado('b', 100), areaResultado('c', 30)];
    expect(recomendarCurso(77, desigual).id).toBe('estrategico');
  });

  it('baja a Blindado si tres o más áreas quedaron en atención', () => {
    const hueco = [
      areaResultado('a', 100),
      areaResultado('b', 100),
      areaResultado('c', 30),
      areaResultado('d', 30),
      areaResultado('e', 30),
    ];
    expect(recomendarCurso(58, hueco).id).toBe('blindado');
  });
});

describe('ordenarPorPrioridad', () => {
  const r = (id: string, porcentaje: number): ResultadoArea => ({
    areaId: id,
    nombre: id,
    correctas: porcentaje,
    total: 100,
    porcentaje,
    nivel: nivelDe(porcentaje),
  });

  it('pone primero lo que requiere refuerzo y al final lo sólido', () => {
    const areas = [r('solida', 90), r('atencion', 20), r('media', 60)];
    const orden = ordenarPorPrioridad(areas).map((a: ResultadoArea) => a.areaId);
    expect(orden).toEqual(['atencion', 'media', 'solida']);
  });

  it('dentro del mismo nivel, ordena de menor a mayor porcentaje', () => {
    const areas = [r('a', 30), r('b', 10), r('c', 44)];
    // Los tres son nivel atención (<50): el más bajo encabeza.
    expect(ordenarPorPrioridad(areas).map((a: ResultadoArea) => a.porcentaje)).toEqual([10, 30, 44]);
  });

  it('no muta el arreglo de entrada', () => {
    const areas = [r('a', 90), r('b', 20)];
    const copia = [...areas];
    ordenarPorPrioridad(areas);
    expect(areas).toEqual(copia);
  });
});

describe('areasSolidas', () => {
  const r = (porcentaje: number): ResultadoArea => ({
    areaId: 'x',
    nombre: 'x',
    correctas: porcentaje,
    total: 100,
    porcentaje,
    nivel: nivelDe(porcentaje),
  });

  it('cuenta solo las áreas en nivel sólido', () => {
    expect(areasSolidas([r(90), r(80), r(40), r(60)])).toBe(2);
  });

  it('devuelve cero cuando ninguna es sólida', () => {
    expect(areasSolidas([r(10), r(40)])).toBe(0);
  });
});
