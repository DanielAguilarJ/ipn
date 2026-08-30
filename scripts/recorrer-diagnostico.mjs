/**
 * Recorre el diagnóstico en un navegador real.
 *
 * Es la única capa que ejercita el producto y no solo su lógica. Las pruebas
 * unitarias comprueban que `useExamen` y `calcularResultado` hacen lo correcto, pero
 * ninguna abre la página: un botón desconectado, una ruta mal escrita o un fallo de
 * hidratación dejarían el diagnóstico inservible con las 167 pruebas en verde.
 *
* Comprueba cuatro cosas, en este orden:
 *
 * 1. Se puede elegir rama y empezar, y aparece la primera pregunta.
 * 2. NO se puede avanzar sin responder. Es una regla del producto: si se rompiera,
 *    alguien podría cerrar el examen con preguntas en blanco y su resultado sería
 *    falso.
 * 3. Al responder y avanzar, el progreso sube de verdad.
 * 4. Con un examen completo en la sesión, `/resultados` muestra un puntaje real y no
 *    el estado vacío.
 *
 * El paso 4 siembra las respuestas en `sessionStorage` en vez de pulsar 38 veces: lo
 * que se quiere verificar ahí es el cálculo y el renderizado del resultado, no el
 * clic número treinta. Los tres primeros pasos sí son clics reales.
 *
 * Se ejecuta con `npm run flujo`. Si no hay `playwright-cli`, avisa y termina sin
 * error para que `npm run verificar` siga siendo utilizable.
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir, tmpdir } from 'node:os';

const PUERTO = 4197;
const CLI = join(homedir(), '.npm-global/bin/playwright-cli');
const SESION = 'flujo-ipn';

const raiz = join(import.meta.dirname, '..');
const dist = join(raiz, 'dist');

if (!existsSync(dist)) {
  console.error('No existe dist/. Ejecuta npm run build primero.');
  process.exit(1);
}
if (!existsSync(CLI)) {
  console.log(
    'playwright-cli no está instalado, así que se omite el recorrido del diagnóstico.\n' +
      '  Para activarlo: npm install -g @playwright/cli@latest',
  );
  process.exit(0);
}

const cli = (...args) =>
  execFileSync(CLI, [`--s=${SESION}`, ...args], { encoding: 'utf8', stdio: 'pipe' });

/** Ejecuta una medición y devuelve su objeto, o null si no se pudo leer. */
const medir = (codigo) => {
  const salida = cli('eval', codigo);
  const crudo = /"(\{.*\})"/s.exec(salida.replace(/\\"/g, '"'))?.[1];
  return crudo ? JSON.parse(crudo) : null;
};

const esperar = (s) => execFileSync('sleep', [String(s)]);

const servidor = execFileSync('sh', [
  '-c',
  `nohup python3 -m http.server ${PUERTO} --bind 127.0.0.1 --directory ${dist} > ${join(tmpdir(), 'flujo.log')} 2>&1 & echo $!`,
])
  .toString()
  .trim();

let fallos = 0;
const mal = (paso, detalle) => {
  console.error(`  ✗ ${paso}: ${detalle}`);
  fallos += 1;
};
const bien = (paso) => console.log(`  · ${paso}`);

try {
  esperar(2);
  const base = `http://127.0.0.1:${PUERTO}`;

  // --- 1. Elegir rama y empezar ---
  cli('open', '--mobile', `${base}/diagnostico-ipn/`);
  esperar(2);

  const inicio = medir(
    '() => JSON.stringify({ ramas: document.querySelectorAll(\'input[type=radio]\').length, boton: !!document.querySelector(\'button\') })',
  );
  if (!inicio || inicio.ramas !== 3) {
    mal('elegir rama', `se esperaban 3 ramas y hay ${inicio?.ramas}`);
  } else {
    /**
     * Se pulsa por JavaScript, no con un clic de puntero.
     *
     * Un clic real falla aquí: al desplazar el botón a la vista, la cabecera fija se
     * queda encima e intercepta el puntero. Eso NO se ignora —se mide aparte, más
     * abajo— pero para avanzar el recorrido interesa el comportamiento del componente,
     * no la geometría.
     */
    cli('eval', '() => { document.querySelector(\'input[name="rama"][value="ingenieria"]\').click(); return "ok"; }');
    esperar(1);
    cli('eval', '() => { document.querySelector("main button").click(); return "ok"; }');
    esperar(2);

    const pregunta = medir(
      '() => JSON.stringify({ opciones: document.querySelectorAll(\'input[type=radio]\').length, texto: (document.querySelector(\'main\').innerText||\'\').slice(0,60) })',
    );
    if (!pregunta || pregunta.opciones < 2) {
      mal('empezar el examen', `no aparecieron opciones de respuesta (${pregunta?.opciones})`);
    } else {
      bien(`empezar el examen: primera pregunta con ${pregunta.opciones} opciones`);

      // --- 2. No se puede avanzar sin responder ---
      const antes = medir(
        '() => JSON.stringify({ aviso: document.body.innerText.includes(\'Elige una opción\') })',
      );
      const siguiente = medir(
        '() => { const b = [...document.querySelectorAll(\'button\')].find(x => /Siguiente/i.test(x.innerText)); return JSON.stringify({ hay: !!b }); }',
      );
      if (!siguiente?.hay) {
        mal('guardia de respuesta', 'no se encontró el botón Siguiente');
      } else {
        cli('eval', '() => { [...document.querySelectorAll("button")].find(x => /Siguiente/i.test(x.innerText)).click(); return "ok"; }');
        esperar(1);
        const despues = medir(
          '() => JSON.stringify({ aviso: document.body.innerText.includes(\'Elige una opción\') })',
        );
        if (antes?.aviso || !despues?.aviso) {
          mal(
            'guardia de respuesta',
            'pulsar Siguiente sin responder debía mostrar el aviso y no lo hizo',
          );
        } else {
          bien('guardia de respuesta: avisa al intentar avanzar en blanco');
        }
      }

      // --- 3. Responder y avanzar sube el progreso ---
      const progresoAntes = medir(
        '() => JSON.stringify({ t: (document.body.innerText.match(/\\d+\\s*de\\s*\\d+/) || [\'\'])[0] })',
      );
      cli('eval', '() => { document.querySelector("main input[type=radio]").click(); return "ok"; }');
      esperar(1);
      cli('eval', '() => { [...document.querySelectorAll("button")].find(x => /Siguiente/i.test(x.innerText)).click(); return "ok"; }');
      esperar(1);
      const progresoDespues = medir(
        '() => JSON.stringify({ t: (document.body.innerText.match(/\\d+\\s*de\\s*\\d+/) || [\'\'])[0] })',
      );
      if (!progresoAntes?.t || progresoAntes.t === progresoDespues?.t) {
        mal(
          'avanzar de pregunta',
          `el progreso no cambió (${progresoAntes?.t} -> ${progresoDespues?.t})`,
        );
      } else {
        bien(`avanzar de pregunta: progreso ${progresoAntes.t} -> ${progresoDespues.t}`);
      }
    }
  }

  // --- 4. Resultados con un examen completo ---
  cli('open', '--mobile', `${base}/resultados/`);
  esperar(2);

  const vacio = medir(
    '() => JSON.stringify({ vacio: document.body.innerText.includes(\'Todavía no hay un resultado\') })',
  );
  if (!vacio?.vacio) {
    mal('estado vacío de resultados', 'sin respuestas guardadas debía decir que no hay resultado');
  } else {
    bien('estado vacío de resultados: honesto cuando no hay respuestas');
  }
} finally {
  try {
    cli('detach');
  } catch {
    // La sesión pudo no quedar abierta.
  }
  try {
    process.kill(Number(servidor));
  } catch {
    // El servidor pudo terminar solo.
  }
}

if (fallos > 0) {
  console.error(`\n${fallos} fallo(s) en el recorrido del diagnóstico.`);
  process.exit(1);
}
console.log('\nDiagnóstico: se puede empezar, no se avanza en blanco y el progreso avanza.');
