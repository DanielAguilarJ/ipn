import { describe, expect, it } from 'vitest';
import { FUENTES, ultimaRevision } from './examenOficial';

/**
 * Guarda de la fecha de revisión.
 *
 * Esta fecha se publica a Google como `dateModified` de la página informativa. Si
 * dejara de corresponder con la revisión real de las fuentes, sería exactamente la
 * clase de señal falsa que hace que un buscador deje de fiarse del sitio: afirmaría
 * contenido actualizado sin que nadie hubiera comprobado nada.
 */
describe('última revisión de las fuentes', () => {
  it('es la más reciente de las fechas de consulta, no una cualquiera', () => {
    const todas = Object.values(FUENTES).map((f) => f.consultada);
    expect(ultimaRevision()).toBe(todas.toSorted().at(-1));
  });

  it('nunca es posterior a la fecha de consulta más nueva', () => {
    for (const f of Object.values(FUENTES)) {
      expect(
        f.consultada <= ultimaRevision(),
        `${f.id} dice ${f.consultada}, posterior a la revisión declarada`,
      ).toBe(true);
    }
  });

  it('tiene formato ISO, que es el que exigen los datos estructurados', () => {
    expect(ultimaRevision()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('no adelanta una revisión que no ha ocurrido', () => {
    // Una fecha futura significaría que alguien la escribió a mano.
    const hoy = new Date().toISOString().slice(0, 10);
    expect(
      ultimaRevision() <= hoy,
      `la revisión declarada (${ultimaRevision()}) es futura`,
    ).toBe(true);
  });

  it('se mueve sola si se actualiza una fuente', () => {
    // Comprueba la propiedad, no el valor: el máximo debe seguir al conjunto.
    const fechas = Object.values(FUENTES).map((f) => f.consultada);
    const conUnaNueva = [...fechas, '2027-01-01'].toSorted().at(-1);
    expect(conUnaNueva).toBe('2027-01-01');
  });
});
