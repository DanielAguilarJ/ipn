/**
 * Revisa el sitio compilado en un teléfono emulado.
 *
 * Comprueba cinco cosas que las auditorías del HTML estático no pueden observar por
 * completo después de que el navegador maqueta e hidrata la página:
 *
 * 1. **Desbordamiento horizontal.** Detecta contenido que excede el ancho del
 *    teléfono y obliga a desplazarse lateralmente.
 * 2. **Tamaño de los controles.** Los enlaces y botones que no están dentro de un
 *    párrafo deben poder tocarse con el dedo. Los que sí están en línea con el texto
 *    quedan exentos a propósito: agrandarlos rompería la lectura.
 * 3. **Contraste.** Comprueba el color efectivo del texto frente a su fondo real.
 * 4. **H1 vivo y visible.** Exige uno solo tras la hidratación y revisa también sus
 *    dimensiones y la visibilidad de toda su cadena de ancestros.
 * 5. **Errores de JavaScript.** Falla si el navegador registra un error de ejecución.
 *
 * Requiere `playwright-cli`. Si no está instalado, avisa y termina sin error, para que
 * `npm run verificar` siga siendo utilizable en una máquina sin navegador.
 *
 * Se ejecuta con `npm run movil`.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir, tmpdir } from 'node:os';

const PUERTO = 4192;
/** Alto mínimo cómodo para un dedo. WCAG 2.2 AA pide 24; 44 es la recomendación amplia. */
const OBJETIVO_MINIMO = 44;
const CLI = join(homedir(), '.npm-global/bin/playwright-cli');
const SESION = 'movil';

const raiz = join(import.meta.dirname, '..');
const dist = join(raiz, 'dist');

if (!existsSync(dist)) {
  console.error('No existe dist/. Ejecuta npm run build primero.');
  process.exit(1);
}

if (!existsSync(CLI)) {
  console.log(
    'playwright-cli no está instalado, así que se omite la revisión en móvil.\n' +
      '  Para activarla: npm install -g @playwright/cli@latest',
  );
  process.exit(0);
}

/** Rutas generadas, deducidas de las carpetas con `index.html`. */
function rutas() {
  const encontradas = ['/'];
  for (const entrada of readdirSync(dist, { withFileTypes: true })) {
    if (!entrada.isDirectory() || entrada.name === 'assets') continue;
    if (existsSync(join(dist, entrada.name, 'index.html'))) encontradas.push(`/${entrada.name}/`);
  }
  return encontradas;
}

/**
 * Qué cuenta como control que debe poder tocarse con el dedo.
 *
 * Solo la navegación principal y los elementos que declaran una altura mínima, que
 * son los botones del sistema de diseño. Deliberadamente NO entran:
 *
 * - Los enlaces dentro de un párrafo: WCAG 2.2 los exime, y agrandarlos rompería la
 *   lectura del texto.
 * - Las listas de enlaces del pie: son un índice, no controles de acción, y llevarlas
 *   a 44 px triplicaría el alto del pie.
 *
 * Un primer intento midió «todo enlace» y produjo siete fallos, casi todos falsos
 * positivos. Una comprobación que siempre está en rojo enseña a ignorar la
 * verificación entera, así que es peor que no tenerla.
 */
const SELECTOR_CONTROLES = 'header nav a, a[class*="min-h"], button[class*="min-h"], summary';

/**
 * Cómo se mide el contraste, y por qué así.
 *
 * Los colores NO se interpretan leyendo la cadena que devuelve `getComputedStyle`.
 * Tailwind 4 emite `oklab()` para cualquier color con transparencia, y un intento
 * previo que asumía `rgb()` produjo nueve fallos de los que ocho eran falsos: leía
 * «oklab(0.97 ...)» y tomaba 0.97 como un rojo de 0 a 255, es decir casi negro. La
 * auditoría anterior del proyecto tropezó con lo mismo pero con `color-mix`.
 *
 * En su lugar se pinta el color en un lienzo de un píxel y se lee el resultado. Eso
 * funciona con `oklab`, `color-mix`, `lab` o cualquier formato que llegue después,
 * porque el navegador hace la conversión. Pintar primero el fondo y encima el texto
 * resuelve además la transparencia sin componerla a mano.
 *
 * Se excluye lo decorativo (`aria-hidden`): los numerales de sección son un ejemplo,
 * y el tema los documenta como legibles a 3:1 a propósito.
 */
const UMBRAL_NORMAL = 4.5;
const UMBRAL_GRANDE = 3;

const MEDICION = `() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const aRgb = (color, sobre) => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = sobre; cx.fillRect(0, 0, 1, 1);
    cx.fillStyle = color; cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const fondoOpaco = (el) => {
    let n = el;
    while (n) {
      const b = getComputedStyle(n).backgroundColor;
      const sobreBlanco = aRgb(b, 'rgb(255,255,255)'), sobreNegro = aRgb(b, 'rgb(0,0,0)');
      if (sobreBlanco[0] === sobreNegro[0] && sobreBlanco[1] === sobreNegro[1] && sobreBlanco[2] === sobreNegro[2]) return b;
      n = n.parentElement;
    }
    return 'rgb(255,255,255)';
  };

  const d = document.documentElement;

  const controles = [...document.querySelectorAll('${SELECTOR_CONTROLES}')];
  const chicos = controles
    .map((e) => ({ t: (e.innerText || '').trim().slice(0, 30), r: e.getBoundingClientRect() }))
    .filter((x) => x.r.width > 1 && x.r.height > 1 && x.r.height < ${OBJETIVO_MINIMO})
    .map((x) => x.t + ' (' + Math.round(x.r.height) + ' px)');

  const anchos = [...document.querySelectorAll('body *')]
    .filter((e) => e.getBoundingClientRect().right > d.clientWidth + 1)
    .slice(0, 3)
    .map((e) => e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).slice(0, 30) : ''));

  const flojos = [];
  for (const el of document.querySelectorAll('main *, footer *, header *')) {
    const t = (el.textContent || '').trim();
    if (!t || el.children.length > 0) continue;
    if (el.getAttribute('aria-hidden') === 'true' || el.closest('[aria-hidden="true"]')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const bg = fondoOpaco(el);
    const r = ratio(aRgb(cs.color, bg), aRgb(bg, 'rgb(255,255,255)'));
    const px = parseFloat(cs.fontSize);
    const grande = px >= 24 || (px >= 18.66 && parseInt(cs.fontWeight) >= 700);
    const minimo = grande ? ${UMBRAL_GRANDE} : ${UMBRAL_NORMAL};
    if (r < minimo) flojos.push(t.slice(0, 28) + ' (' + r.toFixed(2) + ' < ' + minimo + ')');
  }

  return JSON.stringify({ visor: d.clientWidth, scroll: d.scrollWidth, culpables: anchos, chicos, flojos: flojos.slice(0, 5), totalFlojos: flojos.length });
}`;

const servidor = execFileSync('sh', [
  '-c',
  `nohup python3 -m http.server ${PUERTO} --bind 127.0.0.1 --directory ${dist} > ${join(tmpdir(), 'movil.log')} 2>&1 & echo $!`,
])
  .toString()
  .trim();

let problemas = 0;

try {
  execFileSync('sleep', ['2']);

  for (const ruta of rutas()) {
    execFileSync(CLI, [`--s=${SESION}`, 'open', '--mobile', `http://127.0.0.1:${PUERTO}${ruta}`], {
      stdio: 'pipe',
    });
    execFileSync('sleep', ['1']);

    const salida = execFileSync(CLI, [`--s=${SESION}`, 'eval', MEDICION], {
      encoding: 'utf8',
      stdio: 'pipe',
    });

    const crudo = /"(\{.*\})"/s.exec(salida.replace(/\\"/g, '"'))?.[1];
    if (!crudo) {
      console.error(`  ✗ ${ruta}: no se pudo medir`);
      problemas += 1;
      continue;
    }
    const m = JSON.parse(crudo);

    /**
     * El HTML estático ya exige un H1, pero una clase responsive o la hidratación
     * pueden ocultarlo o retirarlo después. Se mide el árbol vivo y toda la cadena de
     * ancestros, porque un H1 visible por sí mismo también desaparece si su padre usa
     * `display:none`, `visibility:hidden`, opacidad cero o `aria-hidden`.
     */
    const salidaH1 = execFileSync(
      CLI,
      [
        `--s=${SESION}`,
        'eval',
        `() => {
          const todos = [...document.querySelectorAll('h1')];
          const esVisible = (el) => {
            const r = el.getBoundingClientRect();
            if (r.width <= 1 || r.height <= 1 || !(el.innerText || '').trim()) return false;
            let nodo = el;
            while (nodo) {
              const cs = getComputedStyle(nodo);
              if (
                cs.display === 'none' ||
                cs.visibility === 'hidden' ||
                cs.visibility === 'collapse' ||
                Number(cs.opacity) === 0 ||
                nodo.hidden ||
                nodo.getAttribute('aria-hidden') === 'true'
              ) return false;
              nodo = nodo.parentElement;
            }
            return true;
          };
          const visibles = todos.filter(esVisible);
          return JSON.stringify({
            total: todos.length,
            visibles: visibles.length,
            textos: visibles.map((el) => (el.innerText || '').trim().slice(0, 60)),
          });
        }`,
      ],
      { encoding: 'utf8', stdio: 'pipe' },
    );
    const crudoH1 = /"(\{.*\})"/s.exec(salidaH1.replace(/\\"/g, '"'))?.[1];
    const h1 = crudoH1 ? JSON.parse(crudoH1) : null;
    if (!h1 || h1.total !== 1 || h1.visibles !== 1) {
      console.error(
        `  ✗ ${ruta}: H1 tras cargar la página: ${h1?.total ?? 0} en el DOM, ${h1?.visibles ?? 0} visible(s)`,
      );
      problemas += 1;
      continue;
    }

    /**
     * Errores de JavaScript en ejecución.
     *
     * Es el único fallo de esta lista que el HTML no delata: una página
     * prerenderizada se ve perfecta aunque la hidratación reviente, porque el texto ya
     * está escrito. Lo que se rompe es todo lo que necesita JavaScript —el diagnóstico
     * completo, el índice de preguntas, la personalización del curso— y las pruebas
     * unitarias siguen en verde porque ejercitan la lógica, no la página.
     *
     * Se pide el nivel `error`, que en este CLI incluye solo lo más severo.
     *
     * Ojo con `--clear`: esa bandera limpia la lista y NO devuelve su contenido, así
     * que pedir «console error --clear» en una sola llamada informaba siempre de cero
     * errores. Se comprobó inyectando un fallo real en el HTML compilado: la primera
     * versión de esta comprobación no lo detectaba. Hay que leer primero y limpiar
     * después, en dos llamadas.
     */
    const consola = execFileSync(CLI, [`--s=${SESION}`, 'console', 'error'], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    execFileSync(CLI, [`--s=${SESION}`, 'console', '--clear'], { stdio: 'pipe' });
    const totalErrores = Number(/Errors:\s*(\d+)/.exec(consola)?.[1] ?? 0);
    if (totalErrores > 0) {
      const primeras = consola
        .split('\n')
        .filter((l) => /error/i.test(l) && !/^Total messages/.test(l))
        .slice(0, 2)
        .map((l) => l.trim())
        .join(' | ');
      console.error(`  ✗ ${ruta}: ${totalErrores} error(es) de JavaScript. ${primeras}`);
      problemas += 1;
    }

    if (m.scroll > m.visor) {
      console.error(
        `  ✗ ${ruta}: desborda ${m.scroll - m.visor} px de ancho. Culpables: ${m.culpables.join(', ')}`,
      );
      problemas += 1;
    }
    if (m.chicos.length > 0) {
      console.error(
        `  ✗ ${ruta}: ${m.chicos.length} control(es) por debajo de ${OBJETIVO_MINIMO} px: ${m.chicos.join(', ')}`,
      );
      problemas += 1;
    }
    if (m.totalFlojos > 0) {
      console.error(
        `  ✗ ${ruta}: ${m.totalFlojos} texto(s) con contraste insuficiente: ${m.flojos.join(', ')}`,
      );
      problemas += 1;
    }
    if (m.scroll <= m.visor && m.chicos.length === 0 && m.totalFlojos === 0 && totalErrores === 0) {
      console.log(
        `  · ${ruta}: sin desbordes, controles a medida, contraste suficiente y sin errores (visor ${m.visor} px)`,
      );
    }
  }
} finally {
  try {
    execFileSync(CLI, [`--s=${SESION}`, 'detach'], { stdio: 'pipe' });
  } catch {
    // La sesión pudo no quedar abierta.
  }
  try {
    process.kill(Number(servidor));
  } catch {
    // El servidor pudo terminar solo.
  }
}

if (problemas > 0) {
  console.error(`\n${problemas} problema(s) en móvil.`);
  process.exit(1);
}
console.log(`\nMóvil: H1 visible, sin desbordes, controles tocables, contraste suficiente y sin errores de JavaScript.`);
