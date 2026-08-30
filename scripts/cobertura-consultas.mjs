/**
 * Cobertura de la intención de búsqueda documentada.
 *
 * `docs/seo-intencion-busqueda.md` recoge lo que la gente escribe de verdad, según la
 * API de sugerencias de Google, y marca cuáles se pueden abordar con honestidad. Este
 * módulo comprueba que el texto SERVIDO siga cubriendo las que ya cubría.
 *
 * Por qué hace falta: la cobertura no la garantiza nada más. Un cambio de titular
 * perfectamente razonable puede quitar «nivel superior» o el año y hacer que varias
 * consultas dejen de tener sus palabras en ninguna página, sin que se caiga ninguna
 * prueba ni cambie ningún número visible. Ya pasó una vez: el título de `/curso-ipn`
 * no declaraba ni el nivel ni el año pese a estar los dos en la intención documentada.
 *
 * Se compara contra `cobertura-consultas.json`, que se versiona. Así la auditoría
 * nombra la consulta exacta que se perdió en lugar de dar una cifra que baja.
 *
 * Las consultas marcadas como no abordables se excluyen a propósito: cuatro de las
 * seis que hoy no se cubren llevan «2025», y el propio documento indica no perseguirlas
 * porque presentar material de un año que ya pasó como si fuera el vigente engaña a
 * quien busca.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Quita acentos y normaliza espacios, para comparar como compara quien busca. */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

/** Texto visible de una página, sin etiquetas ni scripts. */
function textoVisible(html) {
  const cuerpo = html.match(/<body[\s\S]*?<\/body>/)?.[0] ?? '';
  const sinScripts = cuerpo.replace(/<script[\s\S]*?<\/script>/g, ' ');
  return limpiar(sinScripts);
}

/**
 * Texto de las zonas que más pesan: título, descripción y encabezados.
 *
 * Cubrir una consulta en el cuerpo cuenta, pero no es lo mismo. Google compara primero
 * el título y la descripción, y los encabezados le dicen de qué trata cada tramo. La
 * medición del 30 de agosto encontró que 14 de las 59 consultas cubiertas solo
 * aparecían en el cuerpo, así que la métrica anterior las daba por igual de buenas.
 */
function textoProminente(html) {
  const titulo = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
  const descripcion = html.match(/name="description" content="([\s\S]*?)"/)?.[1] ?? '';
  const encabezados = [...html.matchAll(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/g)]
    .map((m) => m[1])
    .join(' ');
  return limpiar(`${titulo} ${descripcion} ${encabezados}`);
}

/** Quita etiquetas y entidades, y normaliza. */
function limpiar(fragmento) {
  const sinEtiquetas = fragmento.replace(/<[^>]+>/g, ' ');
  const conEntidades = sinEtiquetas
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  return normalizar(conEntidades);
}

/**
 * Comprueba que ninguna consulta ya cubierta se haya quedado sin cubrir, y que ninguna
 * que estaba en zona prominente haya caído al cuerpo.
 *
 * Devuelve los retrocesos. No exige cubrir más ni ascender ninguna: solo impide
 * retroceder, que es el fallo silencioso que puede colarse en un cambio de copy.
 */
export function consultasPerdidas(raiz, paginas) {
  const registro = join(raiz, 'cobertura-consultas.json');
  if (!existsSync(registro)) return [];

  const { consultas } = JSON.parse(readFileSync(registro, 'utf-8'));
  const htmls = paginas.map(({ archivo }) => readFileSync(archivo, 'utf-8'));
  const cuerpos = htmls.map(textoVisible);
  const prominentes = htmls.map(textoProminente);

  const retrocesos = [];
  for (const [consulta, dato] of Object.entries(consultas)) {
    const palabras = normalizar(consulta).split(' ');
    const contiene = (texto) => palabras.every((palabra) => texto.includes(palabra));

    if (!cuerpos.some(contiene)) {
      retrocesos.push(`ninguna página cubre ya «${consulta}», que sí se cubría`);
      continue;
    }
    if (dato?.prominente === true && !prominentes.some(contiene)) {
      retrocesos.push(
        `«${consulta}» ya no aparece en ningún título, descripción ni encabezado; ` +
          'quedó solo en el cuerpo, que pesa mucho menos',
      );
    }
  }
  return retrocesos;
}
