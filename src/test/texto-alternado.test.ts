import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Prohíbe alternar DOS textos con CSS dentro del mismo control.
 *
 * El patrón consiste en escribir una etiqueta corta y una larga y ocultar con CSS la
 * que no toca según la anchura. A la vista funciona, y deja los dos textos en el HTML:
 * quien no aplica CSS lee «CursoEl curso». Doce enlaces del encabezado estuvieron así
 * desde que se arregló el desbordamiento en móvil, y nadie lo vio porque la vista era
 * correcta en las dos anchuras.
 *
 * Por qué la comprobación vive AQUÍ y no en la auditoría del HTML generado: la
 * auditoría solo puede leer lo que se prerenderiza, así que cualquier componente que
 * aparezca después de interactuar —los botones del examen, por ejemplo— queda fuera de
 * su alcance. La segunda instancia del defecto estaba justo ahí, en el botón «Anterior»
 * / «Atrás» del diagnóstico, invisible para todas las capas que miran `dist/`.
 *
 * La salida correcta cuando esto falla NO es duplicar el texto de otra forma: es elegir
 * una etiqueta que quepa en todas las anchuras. Se midió en el ciclo 17 que las cortas
 * caben (204 px pedidos, 204 disponibles), así que la versión larga no aportaba nada.
 */

const raiz = process.cwd();

/** Archivos de interfaz, sin pruebas. */
function archivosDeInterfaz(): readonly string[] {
  const encontrados: string[] = [];
  const recorrer = (directorio: string): void => {
    for (const entrada of readdirSync(directorio)) {
      const completa = join(directorio, entrada);
      if (statSync(completa).isDirectory()) {
        recorrer(completa);
        continue;
      }
      if (entrada.endsWith('.tsx') && !entrada.includes('.test.')) encontrados.push(completa);
    }
  };
  recorrer(join(raiz, 'src'));
  return encontrados;
}

describe('texto alternado por CSS', () => {
  it('ningún archivo oculta un texto en móvil y otro en escritorio', () => {
    const culpables: string[] = [];

    for (const archivo of archivosDeInterfaz()) {
      const lineas = readFileSync(archivo, 'utf-8').split('\n');

      lineas.forEach((linea, indice) => {
        // Se ignoran los comentarios: ahí el patrón es la explicación del defecto.
        const limpia = linea.trimStart();
        if (limpia.startsWith('*') || limpia.startsWith('//') || limpia.startsWith('/*')) return;
        if (!/\bsm:hidden\b/.test(linea)) return;

        /**
         * El defecto es la PAREJA. Un solo elemento oculto en una anchura es legítimo
         * —el botón de WhatsApp del encabezado no cabe en un teléfono y no tiene
         * gemelo—, así que se exige encontrar la contraparte cerca para no marcarlo.
         */
        const vecindad = lineas.slice(Math.max(0, indice - 3), indice + 4).join('\n');
        if (/\bhidden sm:(inline|block|flex)\b/.test(vecindad)) {
          culpables.push(`${archivo.replace(raiz, '')}:${indice + 1}`);
        }
      });
    }

    expect(
      [...new Set(culpables)],
      'alternan dos textos con CSS. Elige UNA etiqueta que quepa en todas las ' +
        `anchuras en vez de dejar las dos en el HTML: ${[...new Set(culpables)].join(', ')}`,
    ).toEqual([]);
  });
});
