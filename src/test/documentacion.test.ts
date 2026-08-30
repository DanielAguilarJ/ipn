import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { RUTAS } from '@/App';

/**
 * Guarda de la documentación.
 *
 * El README es lo que lee quien no programa, así que una cifra desactualizada ahí
 * hace más daño que en un comentario. Ya se quedó vieja dos veces: declaró 97
 * comprobaciones cuando eran 130, y 130 cuando eran 146.
 *
 * La solución no fue añadir una prueba que vigile la cifra, porque contar pruebas
 * leyendo los archivos es poco fiable —los `it` dentro de bucles y los generados no
 * se ven, y el conteo estático daba 139 frente a 149 reales—. La solución fue QUITAR
 * la cifra: el propio comando la imprime al terminar, y lo que no se escribe no puede
 * quedarse viejo. Esta prueba impide que alguien la vuelva a poner.
 *
 * También comprueba que los comandos que anuncia existan de verdad: prometer
 * `npm run verificar` y que no esté definido deja a alguien atascado sin saber por
 * qué.
 */

/** Vitest se ejecuta desde la raíz del proyecto, que es donde viven los dos archivos. */
const raiz = process.cwd();
const readme = readFileSync(join(raiz, 'README.md'), 'utf-8');
const paquete = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf-8'));

describe('el README dice la verdad', () => {
  it('no fija un número de comprobaciones, que caducaría en silencio', () => {
    const cifra = /(\d+)\s+comprobaciones/.exec(readme);
    expect(
      cifra?.[1],
      `el README dice «${cifra?.[0]}»: esa cifra se queda vieja en cuanto se añade una prueba. ` +
        'Descríbelo sin número; el comando lo imprime al terminar.',
    ).toBeUndefined();
  });

  it('todo comando que anuncia está definido en package.json', () => {
    const anunciados = [...readme.matchAll(/```bash\n(npm (?:run )?[a-z:]+)/g)]
      .map((m) => m[1] ?? '')
      .map((c) => c.replace(/^npm (run )?/, ''))
      .filter(Boolean);
    expect(anunciados.length, 'el README no muestra ningún comando').toBeGreaterThan(0);

    for (const comando of anunciados) {
      if (comando === 'install') continue;
      expect(
        Object.keys(paquete.scripts),
        `el README anuncia «npm run ${comando}» y no existe`,
      ).toContain(comando);
    }
  });

  /**
   * Las capas NO se enumeran a mano aquí.
   *
   * La versión anterior las fijaba en una lista literal, así que al añadir la
   * revisión en móvil y el recorrido del diagnóstico la prueba siguió pasando
   * mientras el README describía cinco de siete y no mencionaba las dos nuevas por
   * ningún lado. Derivarlas del propio comando convierte «añadir una capa» en
   * «documentarla», porque sin documentarla esta prueba falla.
   */
  const capas = [...(paquete.scripts.verificar as string).matchAll(/npm (?:run )?([a-z:]+)/g)].map(
    (m) => m[1] ?? '',
  );

  it('el comando único ejecuta al menos las capas conocidas', () => {
    expect(capas.length, 'no se pudieron leer las capas de verificar').toBeGreaterThanOrEqual(5);
    for (const capa of capas) {
      expect(Object.keys(paquete.scripts), `verificar llama a «${capa}» y no existe`).toContain(
        capa,
      );
    }
  });

  it('el README menciona cada capa que ejecuta el comando único', () => {
    const sinDocumentar = capas.filter(
      (capa) => !readme.includes(`npm run ${capa}`) && !readme.includes(`npm ${capa}`),
    );
    expect(
      sinDocumentar,
      `verificar ejecuta ${sinDocumentar.join(', ')} y el README no lo menciona. ` +
        'Quien lea el README daría por bueno el sitio sin saber qué se comprobó.',
    ).toEqual([]);
  });

  it('anuncia el comando único como la vía principal de verificación', () => {
    expect(readme).toContain('npm run verificar');
  });
});

/**
 * Guarda de las rutas citadas en la documentación.
 *
 * `docs/seo-rendimiento.md` medía `/curso` y `/diagnostico`, nombres que se
 * renombraron a `/curso-ipn` y `/diagnostico-ipn` antes de publicar. Nada lo
 * detectaba, y una ruta inexistente en un documento de medición hace dudar de todo
 * lo demás que ese documento afirma.
 *
 * Se comprueban solo las rutas escritas entre acentos graves y con barra inicial,
 * que es como el proyecto las cita. Se admiten las que existen de verdad y las tres
 * que el sitio genera sin ser navegables.
 */
describe('las rutas que citan los documentos existen', () => {
  const NO_NAVEGABLES = ['/404', '/resultados', '/sitemap.xml', '/robots.txt', '/og.png'];
  const validas = new Set([...RUTAS, ...NO_NAVEGABLES]);

  const documentos = readdirSync(join(raiz, 'docs'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ nombre: f, texto: readFileSync(join(raiz, 'docs', f), 'utf-8') }));

  it('hay documentos que revisar', () => {
    expect(documentos.length).toBeGreaterThan(0);
  });

  for (const { nombre, texto } of documentos) {
    it(`${nombre} no cita rutas que el sitio no publica`, () => {
      /**
       * Se ignoran las líneas que contienen una URL externa.
       *
       * Esos renglones citan rutas de OTROS sitios como evidencia: la investigación
       * del IPN, por ejemplo, transcribe el `robots.txt` de «Mi derecho, mi lugar»
       * con sus `/cmd`, `/profile`, `/services` y `/api`. Sin esta exclusión la
       * prueba los denunciaba como rutas renombradas, que es un falso positivo: el
       * documento es correcto y era la comprobación la que estaba mal.
       */
      const lineas = texto.split('\n').filter((l) => !/https?:\/\//.test(l));

      const citadas = [...lineas.join('\n').matchAll(/`(\/[a-z0-9-]*(?:\.[a-z]+)?)`/g)]
        .map((m) => m[1] ?? '')
        .filter((r) => r !== '/' && !r.startsWith('/assets'));

      const inexistentes = [...new Set(citadas)].filter((r) => !validas.has(r));
      expect(
        inexistentes,
        `${nombre} cita ${inexistentes.join(', ')}; ¿se renombró la ruta?`,
      ).toEqual([]);
    });
  }
});
