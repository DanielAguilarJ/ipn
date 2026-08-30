import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { PREGUNTAS_POR_PERSONA } from './conteo';
import { BANCO } from './banco';
import { preguntasDeRama } from './puntuacion';
import { AREAS } from './areas';
import { HECHOS_EXAMEN } from '@/datos/examenOficial';
import { RAMAS } from '@/datos/examenOficial';

/**
 * Ata la cifra publicada al banco real.
 *
 * La portada dice en público cuántas preguntas tiene el diagnóstico. Esa cifra ya
 * no se calcula en el navegador —arrastraba el banco entero al paquete inicial—,
 * así que la comprobación tiene que vivir aquí: si el banco cambia y nadie ajusta
 * la constante, la portada estaría mintiendo y solo esta prueba puede avisarlo.
 */
describe('la cifra publicada del diagnóstico', () => {
  const porRama = RAMAS.map((r) => ({ rama: r.id, total: preguntasDeRama(BANCO, r.id).length }));

  it('coincide con el mínimo real entre las tres ramas', () => {
    const minimo = Math.min(...porRama.map((p) => p.total));
    expect(
      PREGUNTAS_POR_PERSONA.cifra,
      `el banco entrega ${porRama.map((p) => `${p.rama}=${p.total}`).join(', ')}; ` +
        `pon cifra: ${minimo} en src/diagnostico/conteo.ts`,
    ).toBe(minimo);
  });

  it('declara «exacta» solo si las tres ramas coinciden', () => {
    const todas = porRama.map((p) => p.total);
    const coinciden = todas.every((n) => n === todas[0]);
    expect(
      PREGUNTAS_POR_PERSONA.exacta,
      coinciden
        ? 'las tres ramas coinciden, así que exacta debe ser true'
        : `las ramas difieren (${todas.join(', ')}), así que exacta debe ser false y la interfaz dirá «Desde N»`,
    ).toBe(coinciden);
  });

  it('ninguna rama se queda sin preguntas', () => {
    for (const { rama, total } of porRama) {
      expect(total, `la rama ${rama} no tiene preguntas`).toBeGreaterThan(0);
    }
  });

  /**
   * `index.html` es una plantilla estática: no puede importar la constante, así que
   * su cifra solo puede vigilarse desde aquí.
   *
   * Importa aunque las seis rutas se prerenderizan con su propia descripción: esta es
   * la que recibe cualquier dirección que no se haya prerenderizado, y ya estuvo mal
   * una vez —decía 30 cuando eran 38— sin que nada lo detectara.
   */
  it('la plantilla index.html declara la misma cifra', () => {
    const plantilla = readFileSync(join(process.cwd(), 'index.html'), 'utf-8');
    const declarada = /(\d+) preguntas/.exec(plantilla)?.[1];

    expect(declarada, 'index.html ya no menciona un número de preguntas').toBeDefined();
    expect(
      Number(declarada),
      `index.html dice ${declarada} y cada rama entrega ${PREGUNTAS_POR_PERSONA.cifra}`,
    ).toBe(PREGUNTAS_POR_PERSONA.cifra);
  });

  it('ningún archivo de interfaz repite la cifra a mano', () => {
    const raiz = join(process.cwd(), 'src');
    const sospechosos: string[] = [];

    const recorrer = (directorio: string): void => {
      for (const entrada of readdirSync(directorio)) {
        const completa = join(directorio, entrada);
        if (statSync(completa).isDirectory()) {
          recorrer(completa);
          continue;
        }
        if (!/\.tsx?$/.test(entrada) || entrada.includes('.test.')) continue;
        if (completa.endsWith(join('diagnostico', 'conteo.ts'))) continue;

        const texto = readFileSync(completa, 'utf-8');
        // Se ignoran los comentarios: ahí la cifra es una explicación, no una afirmación.
        const sinComentarios = texto.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        if (new RegExp(`\\b${PREGUNTAS_POR_PERSONA.cifra} preguntas`).test(sinComentarios)) {
          sospechosos.push(completa.replace(process.cwd(), ''));
        }
      }
    };
    recorrer(raiz);

    expect(
      sospechosos,
      `escriben la cifra a mano en vez de usar PREGUNTAS_POR_PERSONA: ${sospechosos.join(', ')}`,
    ).toEqual([]);
  });

  /**
   * La plantilla de la imagen social, que tampoco puede importar nada.
   *
   * `scripts/og.html` es HTML suelto que se convierte en `public/og.png`, la imagen
   * que aparece en cada enlace compartido por WhatsApp. Fija cuatro cifras a mano y
   * quedaba fuera de toda comprobación: la guarda de arriba solo recorre `src/`.
   *
   * Es el peor sitio para una cifra vieja, por dos razones: se ve antes que la página,
   * y la imagen está versionada en el repositorio, así que solo se regenera cuando
   * alguien ejecuta `npm run og`. Podría contradecir al sitio durante meses.
   */
  it('la plantilla de la imagen social declara las cifras reales', () => {
    const plantilla = readFileSync(join(process.cwd(), 'scripts', 'og.html'), 'utf-8');
    const compacta = plantilla.replace(/\s+/g, '');

    const preguntas = /(\d+)preguntasporárea/.exec(compacta)?.[1];
    expect(
      Number(preguntas),
      `og.html dice ${preguntas} preguntas por área y cada rama entrega ${PREGUNTAS_POR_PERSONA.cifra}`,
    ).toBe(PREGUNTAS_POR_PERSONA.cifra);

    const areas = /<b>(\d+)<\/b><span>áreasdeltemario/.exec(compacta)?.[1];
    expect(
      Number(areas),
      `og.html dice ${areas} áreas y el temario tiene ${AREAS.length}`,
    ).toBe(AREAS.length);

    // Los datos del examen deben seguir existiendo en la fuente con su cita: la
    // imagen no es un sitio donde relajar la regla del proyecto.
    const oficiales = HECHOS_EXAMEN.map((h) => h.dato);
    expect(oficiales, 'la fuente ya no declara las 140 preguntas').toContain('140 preguntas');
    expect(oficiales, 'la fuente ya no declara las 3 horas').toContain('3 horas');
    expect(compacta, 'og.html dejó de mostrar el total del examen').toContain('<b>140</b>');
    expect(compacta, 'og.html dejó de mostrar la duración del examen').toContain('<b>3h</b>');
  });

  /**
   * La imagen versionada debe corresponder a la plantilla actual.
   *
   * La comprobación anterior verifica que la PLANTILLA dice cifras correctas. Esta
   * verifica lo siguiente en la cadena: que `public/og.png` se generó a partir de esa
   * plantilla y no de una versión anterior. Editar el texto y olvidar `npm run og`
   * deja la imagen diciendo lo de antes, y es lo primero que ve quien recibe el enlace
   * por WhatsApp.
   *
   * Se compara la huella del contenido, no la fecha del archivo: restaurar una copia
   * mueve la fecha sin cambiar el contenido, así que la fecha no distingue un cambio
   * real de una copia.
   */
  it('la imagen social se generó con la plantilla actual', () => {
    const registro = JSON.parse(
      readFileSync(join(process.cwd(), 'og-plantilla.json'), 'utf-8'),
    ) as { huella: string };
    const plantilla = readFileSync(join(process.cwd(), 'scripts', 'og.html'), 'utf-8');
    const actual = createHash('sha256').update(plantilla).digest('hex').slice(0, 16);

    expect(
      actual,
      'scripts/og.html cambió después de generar la imagen. Ejecuta «npm run og» para ' +
        'que public/og.png diga lo mismo que la plantilla.',
    ).toBe(registro.huella);
  });
});
