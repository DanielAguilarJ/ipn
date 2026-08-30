import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { FUENTES } from '@/datos/examenOficial';
import { LINKS, SITE, WHATSAPP } from '@/config/site';

/**
 * Guarda de los destinos externos.
 *
 * Este sitio se sostiene sobre que cada dato tiene una fuente comprobable, así que un
 * enlace a un dominio sin verificar no es solo un riesgo de SEO —enlazar a basura
 * arrastra— sino una grieta en lo único que lo distingue de la competencia.
 *
 * La lista de destinos permitidos NO se escribe a mano: se deriva de la configuración
 * y de las fuentes oficiales. Así, añadir una fuente con su URL y su fecha permite su
 * dominio automáticamente, y añadir un enlace a cualquier otro sitio falla hasta que
 * alguien lo registre como fuente.
 *
 * Se revisa el CÓDIGO y no `dist/` a propósito: las pruebas corren antes de la
 * compilación, así que una comprobación sobre `dist/` validaría el build anterior y
 * daría por bueno un enlace recién escrito.
 */

const raiz = process.cwd();

/** Dominios permitidos, deducidos de lo que el proyecto declara como confirmado. */
function dominiosPermitidos(): ReadonlySet<string> {
  const urls = [
    ...Object.values(LINKS).map((l) => l.value),
    ...Object.values(FUENTES).map((f) => f.url),
    SITE.origin.value,
    `https://wa.me/${WHATSAPP.numero.value}`,
  ];

  const dominios = new Set<string>();
  for (const url of urls) {
    dominios.add(new URL(url).hostname);
  }

  /**
   * `schema.org` no es un destino, es un vocabulario.
   *
   * Aparece como `@context` en los datos estructurados de tres archivos, y nadie hace
   * clic en él: ningún `href` lo usa. Exigirle una fecha de consulta como si fuera una
   * fuente del examen sería aplicar la regla donde no significa nada, y un fallo que
   * nadie puede resolver enseña a ignorar la comprobación.
   */
  dominios.add('schema.org');

  return dominios;
}

/** Todos los archivos de interfaz, sin pruebas. */
function archivosDeInterfaz(): readonly string[] {
  const encontrados: string[] = [];
  const recorrer = (directorio: string): void => {
    for (const entrada of readdirSync(directorio)) {
      const completa = join(directorio, entrada);
      if (statSync(completa).isDirectory()) {
        recorrer(completa);
        continue;
      }
      if (/\.tsx?$/.test(entrada) && !entrada.includes('.test.')) encontrados.push(completa);
    }
  };
  recorrer(join(raiz, 'src'));
  return encontrados;
}

describe('destinos externos', () => {
  const permitidos = dominiosPermitidos();

  it('hay dominios permitidos deducidos de la configuración', () => {
    expect(permitidos.size).toBeGreaterThan(3);
    expect(permitidos).toContain('www.ipn.mx');
    expect(permitidos).toContain('ultravelozmente.com');
  });

  it('ningún archivo enlaza a un dominio que el proyecto no haya confirmado', () => {
    const intrusos: string[] = [];

    for (const archivo of archivosDeInterfaz()) {
      const lineas = readFileSync(archivo, 'utf-8').split('\n');

      for (const linea of lineas) {
        /**
         * Se descartan las líneas de comentario mirando cómo EMPIEZAN, no quitando los
         * comentarios del texto.
         *
         * El intento anterior usaba un patrón `//.*` para limpiar comentarios y eso
         * destruía las propias URLs, porque `https://` contiene `//`: la guarda quedaba
         * inerte y no detectaba nada. Solo se vio al invertirla.
         */
        const limpia = linea.trimStart();
        if (limpia.startsWith('//') || limpia.startsWith('*') || limpia.startsWith('/*')) continue;

        for (const coincidencia of linea.matchAll(/['"`](https:\/\/[^'"`\s]+)['"`]/g)) {
          const url = coincidencia[1];
          if (!url) continue;
          const host = new URL(url).hostname;
          if (!permitidos.has(host)) {
            intrusos.push(`${archivo.replace(raiz, '')} -> ${host}`);
          }
        }
      }
    }

    const unicos = [...new Set(intrusos)];
    expect(
      unicos,
      'enlazan a dominios sin confirmar. Regístralos en site.ts o en FUENTES con su ' +
        `fecha de consulta antes de enlazarlos: ${unicos.join(', ')}`,
    ).toEqual([]);
  });

  it('toda fuente oficial apunta a un dominio de gobierno o del IPN', () => {
    for (const f of Object.values(FUENTES)) {
      const host = new URL(f.url).hostname;
      expect(
        /\.ipn\.mx$|\.gob\.mx$|\.org\.mx$/.test(host),
        `${f.id} apunta a ${host}, que no parece una fuente oficial`,
      ).toBe(true);
    }
  });
});
