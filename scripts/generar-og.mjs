/**
 * Genera `public/og.png`, la imagen que se ve al compartir un enlace del sitio.
 *
 * Se ejecuta con `npm run og` y solo hace falta repetirlo cuando cambie el texto
 * de `scripts/og.html`. El resultado se versiona en el repositorio, así que la
 * compilación normal no depende de tener un navegador instalado.
 *
 * Por qué así: `playwright-cli` captura con un visor fijo de 1280x720 y su verbo
 * `resize` no surtió efecto en dos intentos, así que en lugar de forzarlo se
 * recorta la región 1200x630 del cuerpo, que está anclado arriba a la izquierda.
 * 1200x630 es la proporción que WhatsApp, Facebook y X recortan sin perder nada.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, copyFileSync, readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { homedir, tmpdir } from 'node:os';

const PUERTO = 4181;
const ANCHO = 1200;
const ALTO = 630;
const SALIDA = 'public/og.png';
const PLANTILLA = 'scripts/og.html';
/** Registro versionado que ata la imagen a la plantilla con la que se hizo. */
const REGISTRO = 'og-plantilla.json';
const CLI = join(homedir(), '.npm-global/bin/playwright-cli');
const CAPTURAS = join(homedir(), '.kiro/crew/playwright-snapshots');

function correr(cmd, args, opciones = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: 'pipe', ...opciones });
}

/** La captura más reciente del directorio de salida de playwright. */
function capturaMasReciente() {
  const png = readdirSync(CAPTURAS)
    .filter((f) => f.endsWith('.png'))
    .map((f) => ({ f, t: statSync(join(CAPTURAS, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  if (png.length === 0) throw new Error('playwright no dejó ninguna captura');
  return join(CAPTURAS, png[0].f);
}

if (!existsSync(CLI)) {
  console.error(
    `No se encontró playwright-cli en ${CLI}.\n` +
      'Instálalo con: npm install -g @playwright/cli@latest\n' +
      `La imagen ya versionada en ${SALIDA} sigue siendo válida; solo hace falta ` +
      'regenerarla si cambiaste scripts/og.html.',
  );
  process.exit(1);
}

const servidor = execFileSync('sh', [
  '-c',
  `nohup python3 -m http.server ${PUERTO} --bind 127.0.0.1 --directory . > ${join(tmpdir(), 'og-serve.log')} 2>&1 & echo $!`,
])
  .toString()
  .trim();

try {
  execFileSync('sleep', ['2']);
  const url = `http://127.0.0.1:${PUERTO}/scripts/og.html`;

  correr(CLI, ['--s=og', 'open', url]);
  execFileSync('sleep', ['3']);
  correr(CLI, ['--s=og', 'screenshot']);

  const bruta = capturaMasReciente();
  const intermedia = join(tmpdir(), 'og-fuente.png');
  copyFileSync(bruta, intermedia);

  // Recorte anclado arriba a la izquierda: ahí está el cuerpo de 1200x630.
  correr('sips', [
    '-c',
    String(ALTO),
    String(ANCHO),
    '--cropOffset',
    '0',
    '0',
    intermedia,
    '--out',
    SALIDA,
  ]);

  const medidas = correr('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', SALIDA]);
  const ancho = Number(/pixelWidth:\s*(\d+)/.exec(medidas)?.[1]);
  const alto = Number(/pixelHeight:\s*(\d+)/.exec(medidas)?.[1]);

  if (ancho !== ANCHO || alto !== ALTO) {
    throw new Error(`la imagen salió ${ancho}x${alto} y debe ser ${ANCHO}x${ALTO}`);
  }

  /**
   * Se anota la huella de la plantilla con la que se generó esta imagen.
   *
   * Sin esto, editar `scripts/og.html` y olvidar `npm run og` deja la imagen
   * diciendo lo anterior mientras la plantilla dice lo nuevo, y nadie lo nota: la
   * imagen está versionada en el repositorio y es lo primero que ve quien recibe el
   * enlace. Una prueba compara esta huella con la de la plantilla actual.
   *
   * Se usa la huella del CONTENIDO y no la fecha del archivo, porque la fecha cambia
   * al restaurar una copia sin que el contenido cambie.
   */
  const plantillaHtml = readFileSync(PLANTILLA, 'utf-8');
  const huella = createHash('sha256').update(plantillaHtml).digest('hex').slice(0, 16);
  writeFileSync(
    REGISTRO,
    `${JSON.stringify({ plantilla: 'scripts/og.html', huella, ancho, alto }, null, 2)}\n`,
    'utf-8',
  );

  console.log(`Imagen social generada: ${SALIDA} (${ancho}x${alto}), huella ${huella}`);
} finally {
  try {
    correr(CLI, ['--s=og', 'detach']);
  } catch {
    // La sesión pudo no quedar abierta; no es motivo para fallar.
  }
  try {
    process.kill(Number(servidor));
  } catch {
    // El servidor pudo terminar solo.
  }
}
