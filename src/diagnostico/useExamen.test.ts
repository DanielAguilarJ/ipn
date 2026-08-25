import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { borrarGuardado, leerGuardado, useExamen } from './useExamen';
import type { Pregunta } from './tipos';

/**
 * Pruebas de la navegación y la validación del examen.
 *
 * Cubren el comportamiento que se verificó a mano en el navegador, para que no
 * dependa de que alguien lo vuelva a probar: no avanzar sin responder, poder
 * volver atrás siempre, y no cerrar el examen con preguntas pendientes.
 */

const pregunta = (id: string): Pregunta => ({
  id,
  areaId: 'matematicas',
  ramas: ['ingenieria'],
  enunciado: `Enunciado de ${id}`,
  opciones: [
    { id: 'a', texto: 'A' },
    { id: 'b', texto: 'B' },
    { id: 'c', texto: 'C' },
    { id: 'd', texto: 'D' },
  ],
  correcta: 'a',
  explicacion: 'Explicación suficientemente larga para pasar la validación.',
  dificultad: 2,
});

const TRES = [pregunta('p1'), pregunta('p2'), pregunta('p3')];

const montar = (preguntas = TRES) =>
  renderHook(() => useExamen({ preguntas, rama: 'ingenieria' }));

beforeEach(() => borrarGuardado());
afterEach(() => borrarGuardado());

describe('navegación', () => {
  it('empieza en la primera pregunta', () => {
    const { result } = montar();
    expect(result.current.indice).toBe(0);
    expect(result.current.pregunta?.id).toBe('p1');
    expect(result.current.totalPreguntas).toBe(3);
    expect(result.current.esUltima).toBe(false);
  });

  it('no avanza sin responder, y lo avisa', () => {
    const { result } = montar();
    act(() => result.current.siguiente());
    expect(result.current.indice).toBe(0);
    expect(result.current.aviso).toBe('Elige una opción para poder continuar.');
  });

  it('avanza tras responder y limpia el aviso', () => {
    const { result } = montar();
    act(() => result.current.siguiente());
    expect(result.current.aviso).not.toBeNull();

    act(() => result.current.responder('a'));
    expect(result.current.aviso).toBeNull();

    act(() => result.current.siguiente());
    expect(result.current.indice).toBe(1);
  });

  it('permite volver atrás sin haber respondido', () => {
    const { result } = montar();
    act(() => result.current.responder('a'));
    act(() => result.current.siguiente());
    act(() => result.current.anterior());
    expect(result.current.indice).toBe(0);
    expect(result.current.aviso).toBeNull();
  });

  it('no se sale del rango por ninguno de los dos extremos', () => {
    const { result } = montar();
    act(() => result.current.anterior());
    expect(result.current.indice).toBe(0);

    act(() => result.current.irA(2));
    expect(result.current.indice).toBe(2);
    expect(result.current.esUltima).toBe(true);

    act(() => result.current.irA(99));
    expect(result.current.indice).toBe(2);
    act(() => result.current.irA(-1));
    expect(result.current.indice).toBe(2);
  });

  it('permite cambiar una respuesta ya dada', () => {
    const { result } = montar();
    act(() => result.current.responder('a'));
    expect(result.current.elegida).toBe('a');
    act(() => result.current.responder('c'));
    expect(result.current.elegida).toBe('c');
    expect(result.current.contestadas).toBe(1);
  });
});

describe('validación al terminar', () => {
  it('no deja terminar con una pregunta pendiente, y dice cuál', () => {
    const { result } = montar();
    act(() => result.current.responder('a'));
    act(() => result.current.irA(1));
    act(() => result.current.responder('a'));

    let pudo = true;
    act(() => {
      pudo = result.current.intentarTerminar();
    });
    expect(pudo).toBe(false);
    expect(result.current.aviso).toContain('la pregunta 3');
  });

  it('enumera las pendientes cuando son pocas', () => {
    const { result } = montar();
    act(() => result.current.responder('a'));

    act(() => {
      result.current.intentarTerminar();
    });
    expect(result.current.aviso).toContain('Faltan 2');
    expect(result.current.aviso).toContain('2, 3');
  });

  it('con muchas pendientes da el conteo y no una lista interminable', () => {
    const muchas = Array.from({ length: 20 }, (_, i) => pregunta(`q${i + 1}`));
    const { result } = renderHook(() => useExamen({ preguntas: muchas, rama: 'ingenieria' }));

    act(() => {
      result.current.intentarTerminar();
    });
    expect(result.current.aviso).toContain('Faltan 20');
    expect(result.current.aviso).toContain('empezando por la 1');
    // La lista completa sería ruido: no debe aparecer.
    expect(result.current.aviso).not.toContain('2, 3, 4, 5, 6, 7');
  });

  it('deja terminar cuando está todo respondido', () => {
    const { result } = montar();
    for (let i = 0; i < 3; i++) {
      act(() => result.current.irA(i));
      act(() => result.current.responder('a'));
    }
    expect(result.current.faltantes).toEqual([]);

    let pudo = false;
    act(() => {
      pudo = result.current.intentarTerminar();
    });
    expect(pudo).toBe(true);
  });
});

describe('avance guardado', () => {
  it('guarda cada respuesta para que una recarga no la pierda', () => {
    const { result } = montar();
    act(() => result.current.responder('b'));

    const guardado = leerGuardado();
    expect(guardado?.rama).toBe('ingenieria');
    expect(guardado?.respuestas).toEqual({ p1: 'b' });
  });

  it('guarda también la posición al navegar', () => {
    const { result } = montar();
    act(() => result.current.responder('a'));
    act(() => result.current.siguiente());
    expect(leerGuardado()?.indice).toBe(1);
  });

  it('reanuda desde lo guardado', () => {
    const { result: primero } = montar();
    act(() => primero.current.responder('c'));
    act(() => primero.current.siguiente());

    const g = leerGuardado();
    const { result: segundo } = renderHook(() =>
      useExamen({
        preguntas: TRES,
        rama: 'ingenieria',
        respuestasIniciales: g?.respuestas ?? {},
        indiceInicial: g?.indice ?? 0,
      }),
    );
    expect(segundo.current.indice).toBe(1);
    expect(segundo.current.contestadas).toBe(1);
  });

  it('ignora un guardado ilegible en lugar de romper la página', () => {
    window.sessionStorage.setItem('rumbo-ipn:examen', 'esto no es json');
    expect(leerGuardado()).toBeNull();
  });

  it('borrarGuardado deja el almacenamiento limpio', () => {
    const { result } = montar();
    act(() => result.current.responder('a'));
    expect(leerGuardado()).not.toBeNull();
    borrarGuardado();
    expect(leerGuardado()).toBeNull();
  });
});
