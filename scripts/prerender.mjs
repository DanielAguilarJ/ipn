/**
 * Prerenderiza cada ruta a HTML estático y genera el sitemap.
 *
 * Se ejecuta después de las dos compilaciones de Vite (cliente y servidor).
 * Resultado: `dist/index.html` con el contenido de la portada ya escrito, y una
 * carpeta por cada ruta con su propio `index.html`. Los buscadores reciben texto
 * real; el navegador del visitante rehidrata la misma página y sigue siendo una
 * aplicación normal.
 */

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const generadas = [];

for (const ruta of RUTAS_PRERENDERIZADAS) {
  const renderizado = render(ruta);
  const { cabecera, cuerpo } = separarCabecera(renderizado);

  const html = limpiarPlantilla(plantilla)
    .replace('</head>', `  ${preloads}\n    ${cabecera}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`);

  const destino = ruta === '/' ? join(dist, 'index.html') : join(dist, ruta, 'index.html');
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, html, 'utf-8');
  generadas.push({ ruta, bytes: Buffer.byteLength(html) });
}

/** Sitemap con las rutas realmente generadas, nunca con una lista escrita a mano. */
const ORIGEN = 'https://admisionipn.com';
const hoy = new Date().toISOString().slice(0, 10);

const prioridad = (ruta) => (ruta === '/' ? '1.0' : ruta === '/diagnostico' ? '0.9' : '0.7');

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  generadas
    .map(
      ({ ruta }) =>
        `  <url>\n` +
        `    <loc>${ORIGEN}${ruta === '/' ? '/' : ruta}</loc>\n` +
        `    <lastmod>${hoy}</lastmod>\n` +
        `    <priority>${prioridad(ruta)}</priority>\n` +
        `  </url>`,
    )
    .join('\n') +
  `\n</urlset>\n`;

writeFileSync(join(dist, 'sitemap.xml'), sitemap, 'utf-8');

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
console.log(`Sitemap con ${generadas.length} URLs en dist/sitemap.xml`);
