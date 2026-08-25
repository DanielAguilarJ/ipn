/**
 * Auditoría SEO técnica del sitio ya compilado.
 *
 * Se ejecuta con `npm run seo` sobre la carpeta `dist`, después de `npm run build`.
 * Comprueba lo que se puede comprobar sin adivinar: longitudes que Google corta,
 * un solo H1 por página, jerarquía de encabezados sin saltos, canonical propio,
 * datos estructurados que al menos son JSON válido, coherencia entre el sitemap y
 * robots, y que la pantalla de resultados no se indexe.
 *
 * Devuelve código de salida 1 si hay errores, para poder usarse como puerta.
 * No mide posiciones ni las promete: eso no depende de este archivo.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(raiz, 'dist');
const ORIGEN = 'https://admisionipn.com';

/** Límites prácticos de Google, no reglas absolutas. */
const LIMITES = { titulo: 60, descripcion: 155, tituloMinimo: 25, descripcionMinima: 70 };

const errores = [];
const avisos = [];
const notas = [];

const err = (pagina, mensaje) => errores.push(`${pagina}: ${mensaje}`);
const avi = (pagina, mensaje) => avisos.push(`${pagina}: ${mensaje}`);

if (!existsSync(dist)) {
  console.error('No existe dist/. Ejecuta primero: npm run build');
  process.exit(1);
}

/** Encuentra todos los index.html generados. */
function paginas(directorio = dist, ruta = '/') {
  const encontradas = [];
  if (existsSync(join(directorio, 'index.html'))) {
    encontradas.push({ ruta, archivo: join(directorio, 'index.html') });
  }
  for (const entrada of readdirSync(directorio)) {
    const completa = join(directorio, entrada);
    if (entrada === 'assets' || entrada === 'servidor') continue;
    if (statSync(completa).isDirectory()) {
      encontradas.push(...paginas(completa, ruta === '/' ? `/${entrada}` : `${ruta}/${entrada}`));
    }
  }
  return encontradas;
}

const uno = (html, patron) => {
  const m = patron.exec(html);
  return m ? m[1] : null;
};

const todos = (html, patron) => [...html.matchAll(patron)].map((m) => m[1]);

for (const { ruta, archivo } of paginas()) {
  const html = readFileSync(archivo, 'utf-8');
  const p = ruta;

  // --- Fundamentos del documento ---
  if (!/<html[^>]+lang="es(-MX)?"/.test(html)) err(p, 'falta lang="es-MX" en <html>');
  if (!/<meta charset="UTF-8"/i.test(html)) err(p, 'falta <meta charset>');
  if (!/name="viewport"/.test(html)) err(p, 'falta <meta viewport>');

  // --- Título ---
  const titulos = todos(html, /<title>([^<]*)<\/title>/g);
  if (titulos.length === 0) err(p, 'sin <title>');
  else if (titulos.length > 1) err(p, `${titulos.length} etiquetas <title>; debe haber una`);
  else {
    const t = titulos[0];
    if (t.length > LIMITES.titulo) err(p, `título de ${t.length} caracteres, Google corta sobre ${LIMITES.titulo}`);
    if (t.length < LIMITES.tituloMinimo) avi(p, `título corto (${t.length}), quizá desaprovechado`);
  }

  // --- Descripción ---
  const descripciones = todos(html, /name="description" content="([^"]*)"/g);
  if (descripciones.length === 0) err(p, 'sin meta description');
  else if (descripciones.length > 1) err(p, `${descripciones.length} meta description; debe haber una`);
  else {
    const d = descripciones[0];
    if (d.length > LIMITES.descripcion) err(p, `descripción de ${d.length} caracteres, se truncará`);
    if (d.length < LIMITES.descripcionMinima) avi(p, `descripción corta (${d.length})`);
  }

  // --- Canonical propio y coherente ---
  const canonicals = todos(html, /<link rel="canonical" href="([^"]*)"/g);
  if (canonicals.length === 0) err(p, 'sin canonical');
  else if (canonicals.length > 1) err(p, `${canonicals.length} canonicals; debe haber uno`);
  else {
    const esperado = ruta === '/' ? `${ORIGEN}/` : `${ORIGEN}${ruta}`;
    if (canonicals[0] !== esperado) err(p, `canonical apunta a ${canonicals[0]}, se esperaba ${esperado}`);
  }

  // --- Un solo H1 ---
  const h1 = todos(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g);
  if (h1.length === 0) err(p, 'sin H1');
  else if (h1.length > 1) err(p, `${h1.length} etiquetas H1; debe haber una`);

  // --- Jerarquía de encabezados sin saltos ---
  const niveles = [...html.matchAll(/<h([1-6])[^>]*>/g)].map((m) => Number(m[1]));
  let anterior = 0;
  for (const n of niveles) {
    if (anterior && n > anterior + 1) {
      err(p, `salto de encabezado H${anterior} a H${n}; la jerarquía debe ser continua`);
      break;
    }
    anterior = n;
  }

  // --- Open Graph, para cómo se ve al compartir por WhatsApp ---
  for (const propiedad of ['og:title', 'og:description', 'og:url', 'og:type']) {
    if (!html.includes(`property="${propiedad}"`)) avi(p, `falta ${propiedad}`);
  }

  // --- Datos estructurados: si están, deben ser JSON válido ---
  const bloques = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const [, contenido] of bloques) {
    try {
      const datos = JSON.parse(contenido);
      if (!datos['@context']) err(p, 'un bloque JSON-LD no declara @context');
    } catch {
      err(p, 'un bloque JSON-LD no es JSON válido');
    }
  }
  notas.push(`${p}: ${bloques.length} bloque(s) de datos estructurados`);

  // --- Contenido real en el HTML servido, no solo un contenedor vacío ---
  const texto = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const palabras = texto.split(' ').filter((w) => w.length > 1).length;
  if (palabras < 200) err(p, `solo ${palabras} palabras en el HTML servido; el prerenderizado falló`);
  notas.push(`${p}: ${palabras} palabras servidas sin ejecutar JavaScript`);

  // --- Precarga de tipografías, que afecta al LCP ---
  if (!/rel="preload"[^>]*as="font"/.test(html)) avi(p, 'sin precarga de tipografías; retrasa el LCP');
}

// --- Sitemap y robots ---
const rutaSitemap = join(dist, 'sitemap.xml');
if (!existsSync(rutaSitemap)) {
  err('sitemap.xml', 'no existe');
} else {
  const sitemap = readFileSync(rutaSitemap, 'utf-8');
  const urls = todos(sitemap, /<loc>([^<]*)<\/loc>/g);
  const rutasGeneradas = paginas().map(({ ruta }) => (ruta === '/' ? `${ORIGEN}/` : `${ORIGEN}${ruta}`));

  for (const u of rutasGeneradas) {
    if (!urls.includes(u)) err('sitemap.xml', `falta ${u}`);
  }
  for (const u of urls) {
    if (!rutasGeneradas.includes(u)) err('sitemap.xml', `incluye ${u}, que no existe en dist`);
  }
  if (urls.some((u) => u.includes('/resultados'))) {
    err('sitemap.xml', 'incluye /resultados, que es personal de cada visitante');
  }
  notas.push(`sitemap.xml: ${urls.length} URLs`);
}

const rutaRobots = join(dist, 'robots.txt');
if (!existsSync(rutaRobots)) {
  err('robots.txt', 'no existe');
} else {
  const robots = readFileSync(rutaRobots, 'utf-8');
  if (!robots.includes(`Sitemap: ${ORIGEN}/sitemap.xml`)) {
    err('robots.txt', 'no declara la URL del sitemap');
  }
  if (!/Disallow:\s*\/resultados/.test(robots)) {
    avi('robots.txt', 'no excluye /resultados');
  }
  const bloqueados = [...robots.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);
  for (const b of bloqueados) {
    if (b === '/') err('robots.txt', 'bloquea el sitio completo');
  }
}

// --- Peso de los recursos, que afecta a Core Web Vitals ---
const assets = join(dist, 'assets');
if (existsSync(assets)) {
  const porTipo = {};
  for (const f of readdirSync(assets)) {
    const ext = f.split('.').pop();
    porTipo[ext] = (porTipo[ext] ?? 0) + statSync(join(assets, f)).size;
  }
  for (const [ext, bytes] of Object.entries(porTipo)) {
    notas.push(`assets: ${ext} ${(bytes / 1024).toFixed(1)} kB`);
  }
  if ((porTipo.js ?? 0) > 400 * 1024) {
    avi('assets', `JavaScript de ${((porTipo.js ?? 0) / 1024).toFixed(0)} kB; vigila el tiempo de interacción`);
  }
}

// --- Informe ---
console.log('\nAuditoría SEO técnica de dist/\n');
for (const n of notas) console.log(`  · ${n}`);

if (avisos.length) {
  console.log(`\nAvisos (${avisos.length}), no bloquean:`);
  for (const a of avisos) console.log(`  ! ${a}`);
}

if (errores.length) {
  console.log(`\nErrores (${errores.length}):`);
  for (const e of errores) console.log(`  ✗ ${e}`);
  console.log('');
  process.exit(1);
}

console.log(`\nSin errores. ${avisos.length} aviso(s).\n`);
