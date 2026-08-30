/**
 * Prerenderiza cada ruta a HTML estático y genera el sitemap.
 *
 * Se ejecuta después de las dos compilaciones de Vite (cliente y servidor).
 * Resultado: `dist/index.html` con el contenido de la portada ya escrito, y una
 * carpeta por cada ruta con su propio `index.html`. Los buscadores reciben texto
 * real; el navegador del visitante rehidrata la misma página y sigue siendo una
 * aplicación normal.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(raiz, 'dist');

const { render, RUTAS_PRERENDERIZADAS } = await import(
  join(dist, 'servidor', 'entrada-servidor.js')
);

const plantilla = readFileSync(join(dist, 'index.html'), 'utf-8');

if (!plantilla.includes('<div id="root"></div>')) {
  throw new Error('La plantilla no contiene <div id="root"></div>; el prerender no puede inyectar.');
}

/** Extrae los elementos que React eleva al head para moverlos allí de verdad. */
function separarCabecera(html) {
  const etiquetas = [];
  const cuerpo = html.replace(
    /<(title|meta|link|script type="application\/ld\+json")\b[^>]*(?:\/>|>[\s\S]*?<\/\1>)/g,
    (coincidencia) => {
      etiquetas.push(coincidencia);
      return '';
    },
  );
  return { cabecera: etiquetas.join('\n    '), cuerpo };
}

/**
 * Quita del head de la plantilla los metadatos genéricos que la página ya
 * aporta, para no emitir dos títulos ni dos descripciones.
 */
function limpiarPlantilla(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/, '');
}

/**
 * Precarga de las tipografías del primer pintado.
 *
 * Sin esto el navegador las descubre tarde: primero el HTML, luego el CSS, luego
 * el `@import` de dentro del CSS y solo entonces la fuente. Como el elemento más
 * grande de estas páginas es texto, esa cadena retrasa directamente el LCP.
 *
 * Solo se precargan los subconjuntos `latin` de las dos familias, que son los que
 * se usan en español; precargar `latin-ext` o `vietnamese` gastaría ancho de banda
 * en algo que casi nadie verá. Los nombres llevan hash del build, así que se leen
 * del disco en lugar de escribirse a mano.
 */
function preloadTipografias() {
  const assets = join(dist, 'assets');
  const archivos = readdirSync(assets).filter(
    (f) => f.endsWith('.woff2') && f.includes('-latin-') && !f.includes('latin-ext'),
  );

  if (archivos.length === 0) {
    throw new Error('No se encontró ninguna tipografía latin en dist/assets; revisa el build.');
  }

  return archivos
    .map(
      (f) =>
        `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin="anonymous">`,
    )
    .join('\n    ');
}

const preloads = preloadTipografias();

/**
 * Precarga del módulo propio de las rutas que se cargan aparte.
 *
 * El diagnóstico y los resultados viven en paquetes separados, y eso abarata las cinco
 * rutas que captan búsqueda. El coste apareció al medir el 30 de agosto: en esas dos
 * rutas el LCP subía de ~46 a ~340 ms, porque el navegador descubre su módulo cuando
 * el paquete principal ya se está ejecutando y el elemento mayor se repinta después.
 *
 * `modulepreload` lo resuelve sin deshacer el corte: el navegador pide los dos
 * archivos en paralelo desde el primer momento. Solo se añade en la ruta que de verdad
 * los necesita, así que la portada y el temario siguen sin descargarlos.
 *
 * Los nombres llevan hash, así que se leen del disco en lugar de escribirse a mano.
 * Si un módulo dejara de existir se avisa en voz alta: una precarga hacia un archivo
 * inexistente es peso perdido y un aviso en la consola del navegador.
 */
function preloadModulos(ruta) {
  const POR_RUTA = {
    '/diagnostico-ipn': ['Diagnostico-', 'banco-'],
    '/resultados': ['Resultados-', 'banco-'],
  };
  const prefijos = POR_RUTA[ruta];
  if (!prefijos) return '';

  const archivos = readdirSync(join(dist, 'assets'));
  const encontrados = prefijos.map((prefijo) => {
    const archivo = archivos.find((f) => f.startsWith(prefijo) && f.endsWith('.js'));
    if (!archivo) {
      throw new Error(
        `No se encontró el módulo «${prefijo}*.js» para precargar en ${ruta}. ` +
          'Si el paquete se renombró, actualiza POR_RUTA en scripts/prerender.mjs.',
      );
    }
    return archivo;
  });

  return encontrados
    .map((f) => `<link rel="modulepreload" href="/assets/${f}" crossorigin="anonymous">`)
    .join('\n    ');
}

const generadas = [];

for (const ruta of RUTAS_PRERENDERIZADAS) {
  const renderizado = render(ruta);
  const { cabecera, cuerpo } = separarCabecera(renderizado);

  const modulos = preloadModulos(ruta);
  const html = limpiarPlantilla(plantilla)
    .replace(
      '</head>',
      `  ${preloads}${modulos ? `\n    ${modulos}` : ''}\n    ${cabecera}\n  </head>`,
    )
    .replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`);

  const destino = ruta === '/' ? join(dist, 'index.html') : join(dist, ruta, 'index.html');
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, html, 'utf-8');
  generadas.push({ ruta, bytes: Buffer.byteLength(html), cabecera, cuerpo });
}

/**
 * Sitemap con las rutas realmente generadas, nunca con una lista escrita a mano.
 *
 * Se excluye toda ruta que declare `noindex` en su propia cabecera. Es una regla
 * que se mantiene sola: pedir a Google que no indexe una página y a la vez
 * anunciarla en el sitemap son instrucciones contradictorias, y basta con leer lo
 * que la página ya dice para no cometer ese error. Hoy afecta a `/resultados`, que
 * se prerenderiza para que recargarla funcione pero no debe indexarse porque su
 * contenido depende de respuestas guardadas en el navegador.
 */
const ORIGEN = 'https://admisionipn.com';
const hoy = new Date().toISOString().slice(0, 10);

const indexables = generadas.filter(({ cabecera }) => !/content="noindex/.test(cabecera));

/**
 * Prioridad relativa de cada ruta.
 *
 * La portada encabeza; el diagnóstico va por encima del resto porque es la acción
 * que este sitio quiere que ocurra. La comparación usa la ruta real: antes decía
 * `/diagnostico`, que se renombró a `/diagnostico-ipn`, así que esa rama llevaba
 * tiempo muerta y el diagnóstico recibía la prioridad genérica.
 */
const prioridad = (ruta) => (ruta === '/' ? '1.0' : ruta === '/diagnostico-ipn' ? '0.9' : '0.7');

/**
 * Fecha de última modificación, honesta.
 *
 * Antes se escribía la fecha de compilación en las seis rutas, así que cada build
 * afirmaba que todas las páginas habían cambiado ese día —incluido el aviso legal,
 * que no se toca en semanas—. Google usa `lastmod` para decidir cuándo volver a
 * rastrear y desconfía del sitemap cuando la fecha no se corresponde con cambios
 * reales, de modo que mentir aquí perjudica en lugar de ayudar.
 *
 * Lo que se compara es la huella del contenido que ve un buscador: la cabecera
 * renderizada (título, descripción, canonical y datos estructurados) más el
 * cuerpo. Deliberadamente NO entra el nombre de los archivos de assets: un ajuste
 * de CSS cambia su hash pero no cambia el contenido de ninguna página, y si
 * entrara volveríamos a marcar las seis rutas a la vez.
 *
 * El registro se versiona en el repositorio para que la fecha sobreviva a un
 * `dist` borrado o a una compilación en otra máquina.
 */
const REGISTRO = join(raiz, 'sitemap-fechas.json');

const previo = existsSync(REGISTRO) ? JSON.parse(readFileSync(REGISTRO, 'utf-8')) : {};
const registro = {};
let cambiadas = 0;

for (const { ruta, cabecera, cuerpo } of indexables) {
  const huella = createHash('sha256').update(`${cabecera}\u001f${cuerpo}`).digest('hex').slice(0, 16);
  const anterior = previo[ruta];

  if (anterior && anterior.huella === huella) {
    registro[ruta] = anterior;
  } else {
    registro[ruta] = { huella, lastmod: hoy };
    cambiadas += 1;
  }
}

writeFileSync(REGISTRO, `${JSON.stringify(registro, null, 2)}\n`, 'utf-8');

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  indexables
    .map(
      ({ ruta }) =>
        `  <url>\n` +
        `    <loc>${ORIGEN}${ruta === '/' ? '/' : ruta}</loc>\n` +
        `    <lastmod>${registro[ruta].lastmod}</lastmod>\n` +
        `    <priority>${prioridad(ruta)}</priority>\n` +
        `  </url>`,
    )
    .join('\n') +
  `\n</urlset>\n`;

writeFileSync(join(dist, 'sitemap.xml'), sitemap, 'utf-8');

/**
 * Página 404 real.
 *
 * Sin este archivo, la instrucción habitual de despliegue —«sirve index.html
 * cuando la ruta no exista»— convierte cualquier URL inventada en un HTTP 200 con
 * el contenido de la portada. Es un soft-404: Google encuentra la misma página
 * repetida en direcciones infinitas, gasta rastreo en ellas y lo reporta en Search
 * Console. Y el `noindex` que sí declara la pantalla de «no encontrada» nunca
 * llega, porque el rastreador recibe el HTML de la portada.
 *
 * Como las seis rutas se prerenderizan cada una con su propio `index.html`, el
 * reenvío a la portada no hace falta para que la navegación funcione: sobra y
 * perjudica. Netlify, Vercel y GitHub Pages sirven este archivo con estado 404 sin
 * configuración adicional.
 *
 * No entra en el sitemap ni en el registro de fechas: se genera aparte, después de
 * cerrar la lista de rutas indexables.
 */
const html404 = (() => {
  const { cabecera, cuerpo } = separarCabecera(render('/404'));
  return limpiarPlantilla(plantilla)
    .replace('</head>', `  ${preloads}\n    ${cabecera}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`);
})();

writeFileSync(join(dist, '404.html'), html404, 'utf-8');

/**
 * El bundle de servidor solo sirve para generar el HTML de arriba. Dejarlo en
 * `dist` significaría subirlo al servidor sin que nadie lo pida nunca, así que se
 * retira una vez cumplida su función.
 */
rmSync(join(dist, 'servidor'), { recursive: true, force: true });

console.log(`Prerenderizadas ${generadas.length} rutas:`);
for (const { ruta, bytes } of generadas) {
  console.log(`  ${ruta.padEnd(16)} ${(bytes / 1024).toFixed(1)} kB`);
}
console.log(`Sitemap con ${indexables.length} URLs en dist/sitemap.xml`);
console.log(
  cambiadas === 0
    ? '  lastmod: ninguna ruta cambió de contenido, se conservan las fechas anteriores'
    : `  lastmod: ${cambiadas} de ${indexables.length} rutas indexables cambiaron, fechadas hoy (${hoy})`,
);
