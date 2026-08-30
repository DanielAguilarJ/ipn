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
import { consultasPerdidas } from './cobertura-consultas.mjs';

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

  /**
   * Si la página no se indexa, su título y su descripción no se van a mostrar en
   * ningún resultado, así que medir si Google los cortaría no significa nada. Se
   * siguen exigiendo —los necesita el navegador y quien comparta el enlace— pero sin
   * juzgar su longitud. Evita un aviso permanente que nadie puede resolver y que
   * termina enseñando a ignorar la auditoría.
   */
  const seIndexa = !/content="noindex/.test(html);

  // --- Título ---
  const titulos = todos(html, /<title>([^<]*)<\/title>/g);
  if (titulos.length === 0) err(p, 'sin <title>');
  else if (titulos.length > 1) err(p, `${titulos.length} etiquetas <title>; debe haber una`);
  else if (seIndexa) {
    const t = titulos[0];
    if (t.length > LIMITES.titulo) err(p, `título de ${t.length} caracteres, Google corta sobre ${LIMITES.titulo}`);
    if (t.length < LIMITES.tituloMinimo) avi(p, `título corto (${t.length}), quizá desaprovechado`);
  }

  // --- Descripción ---
  const descripciones = todos(html, /name="description" content="([^"]*)"/g);
  if (descripciones.length === 0) err(p, 'sin meta description');
  else if (descripciones.length > 1) err(p, `${descripciones.length} meta description; debe haber una`);
  else if (seIndexa) {
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

  /**
   * Imagen social.
   *
   * Se comprueba porque el fallo es silencioso: declarar `twitter:card` de imagen
   * grande sin imagen, o apuntar a un archivo que no se desplegó, deja cada enlace
   * compartido sin vista previa y nada lo delata. En este sitio importa más que en
   * otros, porque el botón principal de conversión abre WhatsApp y ahí la vista
   * previa es lo primero que ve la persona.
   */
  const imagenes = todos(html, /<meta property="og:image" content="([^"]*)"/g);
  const tarjeta = /<meta name="twitter:card" content="summary_large_image"/.test(html);

  if (imagenes.length === 0) {
    if (tarjeta) {
      err(p, 'declara twitter:card de imagen grande pero no declara og:image');
    } else {
      avi(p, 'sin og:image: los enlaces compartidos saldrán sin vista previa');
    }
  } else {
    if (imagenes.length > 1) err(p, `${imagenes.length} og:image; debe haber una`);

    const url = imagenes[0];
    if (!url.startsWith('https://')) {
      err(p, `og:image debe ser absoluta y es ${url}`);
    } else if (url.startsWith(`${ORIGEN}/`)) {
      const archivoImagen = join(dist, url.slice(`${ORIGEN}/`.length));
      if (!existsSync(archivoImagen)) {
        err(p, `og:image apunta a ${url}, que no existe en dist`);
      }
    }

    const altOpenGraph = /<meta property="og:image:alt" content="([^"]*)"/.exec(html)?.[1].trim();
    if (!altOpenGraph) err(p, 'og:image sin texto alternativo no vacío');

    const altTwitter = /<meta name="twitter:image:alt" content="([^"]*)"/.exec(html)?.[1].trim();
    if (!altTwitter) err(p, 'twitter:image sin texto alternativo no vacío');

    /**
     * Las medidas declaradas deben coincidir con el archivo real.
     *
     * Antes solo se comprobaba que la imagen existiera. Si alguien la reemplaza a
     * mano por otra de distinto tamaño, las etiquetas siguen anunciando 1200x630 y
     * las plataformas la recortan mal, sin que nada avise: el archivo está, la
     * etiqueta está, y el fallo solo se ve al compartir el enlace.
     *
     * Las medidas se leen de la cabecera IHDR del PNG, que las guarda en cuatro
     * bytes cada una a partir del decimosexto. No hace falta ninguna dependencia.
     */
    const anchoDeclarado = /og:image:width" content="(\d+)"/.exec(html)?.[1];
    const altoDeclarado = /og:image:height" content="(\d+)"/.exec(html)?.[1];

    if (!anchoDeclarado) err(p, 'og:image sin ancho declarado');
    if (!altoDeclarado) err(p, 'og:image sin alto declarado');

    if (anchoDeclarado && altoDeclarado && url.startsWith(`${ORIGEN}/`)) {
      const archivoImagen = join(dist, url.slice(`${ORIGEN}/`.length));
      if (existsSync(archivoImagen) && archivoImagen.endsWith('.png')) {
        const bytes = readFileSync(archivoImagen);
        const anchoReal = bytes.readUInt32BE(16);
        const altoReal = bytes.readUInt32BE(20);

        if (anchoReal !== Number(anchoDeclarado) || altoReal !== Number(altoDeclarado)) {
          err(
            p,
            `og:image declara ${anchoDeclarado}x${altoDeclarado} y el archivo mide ${anchoReal}x${altoReal}`,
          );
        }
        // 1.91:1 es la proporción que WhatsApp y Facebook recortan sin perder nada.
        const proporcion = anchoReal / altoReal;
        if (Math.abs(proporcion - 1.91) > 0.06) {
          avi(p, `og:image con proporción ${proporcion.toFixed(2)}:1; se recomienda 1.91:1`);
        }
      }
    }
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

  /**
   * Toda imagen visible debe declarar `alt`.
   *
   * Se permite `alt=""`, que es la forma correcta de marcar una imagen puramente
   * decorativa; lo que se rechaza es omitir el atributo y dejar su propósito sin
   * alternativa textual para lectores de pantalla y buscadores de imágenes.
   */
  const imagenesHtml = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  for (const [indice, etiqueta] of imagenesHtml.entries()) {
    if (!/\salt\s*=\s*(?:"[^"]*"|'[^']*')/.test(etiqueta)) {
      err(p, `imagen HTML ${indice + 1} sin atributo alt`);
    }
  }

  // --- Open Graph, para cómo se ve al compartir por WhatsApp ---
  for (const propiedad of ['og:title', 'og:description', 'og:url', 'og:type']) {
    const valores = todos(html, new RegExp(`<meta property="${propiedad}" content="([^"]*)"`, 'g'));
    if (valores.length === 0) err(p, `falta ${propiedad}`);
    else if (valores.length > 1) err(p, `${propiedad} aparece ${valores.length} veces; debe haber una`);
    else if (!valores[0].trim()) err(p, `${propiedad} tiene contenido vacío`);
  }

  /**
   * Open Graph y los datos estructurados deben decir lo mismo.
   *
   * `/examen-ipn` declaraba `Article` en su JSON-LD y `og:type="website"` en sus
   * etiquetas sociales: dos respuestas distintas a la misma pregunta, y ninguna
   * herramienta lo señalaba porque cada mitad era válida por separado.
   *
   * Cuando la página es un artículo, además debe publicar sus dos fechas, y esas
   * fechas tienen que coincidir con las del esquema. Si divergieran, el sitio estaría
   * anunciando dos frescuras distintas del mismo contenido.
   */
  const tipoOg = /og:type" content="([^"]*)"/.exec(html)?.[1];
  const esArticulo = /"@type":"Article"/.test(html);

  if (esArticulo && tipoOg !== 'article') {
    err(p, `declara Article en sus datos estructurados y og:type="${tipoOg}"`);
  }
  if (!esArticulo && tipoOg === 'article') {
    err(p, 'declara og:type="article" y su esquema no dice que sea un Article');
  }

  if (esArticulo) {
    const publicadaOg = /article:published_time" content="([^"]*)"/.exec(html)?.[1];
    const modificadaOg = /article:modified_time" content="([^"]*)"/.exec(html)?.[1];
    const publicadaSchema = /"datePublished":"([^"]*)"/.exec(html)?.[1];
    const modificadaSchema = /"dateModified":"([^"]*)"/.exec(html)?.[1];

    if (!publicadaOg || !modificadaOg) {
      err(p, 'es un artículo y no publica article:published_time y article:modified_time');
    } else if (publicadaOg !== publicadaSchema || modificadaOg !== modificadaSchema) {
      err(
        p,
        `las fechas de Open Graph (${publicadaOg}, ${modificadaOg}) no coinciden con las del esquema (${publicadaSchema}, ${modificadaSchema})`,
      );
    }
  }

  // --- Datos estructurados: si están, deben ser JSON válido y sin huecos ---
  const bloques = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const [, contenido] of bloques) {
    try {
      const datos = JSON.parse(contenido);
      if (!datos['@context']) err(p, 'un bloque JSON-LD no declara @context');

      /**
       * Un nodo malformado no da error: Google lo descarta en silencio.
       *
       * Que el JSON parsee no dice nada sobre su contenido. Un `"telephone": ""` o un
       * `"name": "undefined"` —los dos, residuos típicos de un dato que la plantilla
       * esperaba y no llegó— son JSON perfectamente válido, y hasta ahora pasaban en
       * verde. El resultado sería peor que no declarar nada: se paga el trabajo de
       * marcar seis páginas y no se recibe nada a cambio, sin ninguna señal de que
       * algo falla.
       */
      const revisarNodo = (nodo, camino) => {
        if (Array.isArray(nodo)) {
          nodo.forEach((v, i) => revisarNodo(v, `${camino}[${i}]`));
          return;
        }
        if (nodo === null || typeof nodo !== 'object') return;

        /**
         * Un `@graph` dentro de otro `@graph` esconde todo lo que contiene.
         *
         * Le pasó a la portada: `esquemaSitio()` devolvía un documento completo y el
         * punto de uso lo envolvía otra vez, así que el sitio, la organización y el
         * curso quedaban un nivel demasiado abajo. Para un lector de datos
         * estructurados ahí no hay entidades, y era la página con más probabilidades
         * de ser la primera indexada.
         *
         * No lo detectó ni la validación de valores vacíos —que exime a los nodos con
         * `@context`, y el envoltorio tenía uno— ni la prueba de identidad, que leía
         * la misma estructura anidada que el error producía.
         */
        if (camino !== '' && '@graph' in nodo) {
          err(p, `hay un @graph anidado en ${camino}: sus nodos no se pueden extraer`);
        }

        if (!nodo['@type'] && !nodo['@context'] && !nodo['@id']) {
          err(p, `el nodo ${camino || 'raíz'} del esquema no declara @type`);
        }

        for (const [clave, valor] of Object.entries(nodo)) {
          const donde = camino ? `${camino}.${clave}` : clave;
          if (clave === 'inLanguage') {
            const idiomaDocumento = /<html[^>]+lang="([^"]+)"/i.exec(html)?.[1];
            if (valor !== idiomaDocumento) {
              err(
                p,
                `el esquema declara ${donde}="${valor}" y <html> declara lang="${idiomaDocumento}"`,
              );
            }
          }
          if (valor === null || valor === '' || (Array.isArray(valor) && valor.length === 0)) {
            err(p, `el esquema declara ${donde} vacío; es peor que omitirlo`);
          }
          if (typeof valor === 'string' && /^(undefined|null|NaN)$/.test(valor.trim())) {
            err(p, `el esquema declara ${donde}="${valor}": un dato que no llegó`);
          }
          revisarNodo(valor, donde);
        }
      };
      revisarNodo(datos, '');

      /**
       * Toda referencia `@id` debe resolver DENTRO de la misma página.
       *
       * Google no sigue un `@id` hasta otra página: lo comprueba su propia prueba de
       * resultados enriquecidos, que responde «elemento sin nombre». Cinco de las seis
       * rutas apuntaban su `publisher` e `isPartOf` a nodos definidos solo en la
       * portada, así que declaraban un editor que no se podía leer.
       */
      const definidos = new Set();
      const referencias = new Map();
      const recorrer = (nodo, camino) => {
        if (Array.isArray(nodo)) return nodo.forEach((v, i) => recorrer(v, camino + '[' + i + ']'));
        if (nodo === null || typeof nodo !== 'object') return;
        const claves = Object.keys(nodo);
        if (claves.length === 1 && claves[0] === '@id') referencias.set(nodo['@id'], camino);
        else if (nodo['@id']) definidos.add(nodo['@id']);
        for (const [k, v] of Object.entries(nodo)) recorrer(v, camino ? camino + '.' + k : k);
      };
      recorrer(datos, '');
      for (const [id, donde] of referencias) {
        if (!definidos.has(id)) {
          err(p, 'la referencia ' + donde + ' apunta a ' + id + ', que no se define en esta página');
        }
      }

      /**
       * Cada miga debe apuntar a una página que exista de verdad.
       *
       * Tiene precedente en este repositorio: al renombrar `/diagnostico` a
       * `/diagnostico-ipn` quedó una comparación viva contra el nombre viejo y la
       * página más importante se quedó con la prioridad equivocada en el sitemap.
       * Una miga hacia una dirección retirada es el mismo error con peor cara: Google
       * la sigue, recibe un 404 y descarta la ruta de navegación entera.
       *
       * Se comprueba contra los archivos generados, no contra una lista escrita a
       * mano, para que renombrar una ruta rompa la auditoría en el mismo build.
       */
      for (const nodo of datos['@graph'] ?? []) {
        if (nodo['@type'] !== 'BreadcrumbList') continue;
        for (const elemento of nodo.itemListElement ?? []) {
          const url = typeof elemento.item === 'string' ? elemento.item : elemento.item?.['@id'];
          if (!url) continue;
          const ruta = url.replace(ORIGEN, '').replace(/^\/|\/$/g, '');
          const destino = ruta === '' ? join(dist, 'index.html') : join(dist, ruta, 'index.html');
          if (!existsSync(destino)) {
            err(p, `la miga ${elemento.position} apunta a ${url}, que no se genera`);
          }
        }
      }
    } catch (error) {
      if (error instanceof SyntaxError) err(p, 'un bloque JSON-LD no es JSON válido');
      else throw error;
    }
  }

  /**
   * El canonical y la entidad que representa la página deben identificar la misma URL.
   *
   * Cada capa puede ser válida por separado y aun así contradecir a la otra. Además se
   * exige una sola entidad representativa: `WebSite` en la portada y `WebPage` en las
   * rutas interiores, para no ofrecer dos respuestas sobre cuál es la página actual.
   */
  const nodosEstructurados = bloques.flatMap(([, contenido]) => {
    try {
      const datos = JSON.parse(contenido);
      return datos['@graph'] ?? [datos];
    } catch {
      return []; // El JSON inválido ya se informa en el bloque anterior.
    }
  });
  const tipoEntidadPagina = p === '/' ? 'WebSite' : 'WebPage';
  const entidadesPagina = nodosEstructurados.filter((nodo) => nodo['@type'] === tipoEntidadPagina);

  if (seIndexa && canonicals.length === 1) {
    if (entidadesPagina.length !== 1) {
      err(
        p,
        `declara ${entidadesPagina.length} entidades ${tipoEntidadPagina}; debe declarar exactamente una`,
      );
    } else if (entidadesPagina[0].url !== canonicals[0]) {
      err(
        p,
        `${tipoEntidadPagina}.url apunta a ${entidadesPagina[0].url}, pero el canonical es ${canonicals[0]}`,
      );
    }
  }

  notas.push(`${p}: ${bloques.length} bloque(s) de datos estructurados`);

  /**
   * Cada página indexable debe traer datos estructurados y, si es interior, migas.
   *
   * Hasta ahora esto solo se CONTABA, no se exigía: una página podía quedarse sin
   * ningún bloque y la auditoría lo reportaba como una nota informativa y pasaba en
   * verde. Tres de seis rutas estuvieron así durante un tiempo sin que nada avisara.
   *
   * Las migas solo se piden a las páginas interiores: la portada es la raíz de la
   * ruta de navegación y una miga de un solo elemento no aporta nada.
   *
   * Se comprueba solo en lo indexable. Una página con `noindex` puede prescindir de
   * ambas cosas, y de hecho `/resultados` lo hace.
   */
  const esIndexable = !/content="noindex/.test(html);
  if (esIndexable) {
    if (bloques.length === 0) {
      err(p, 'sin datos estructurados: falta la representación Schema.org esperada por el sitio');
    }
    if (p !== '/' && !html.includes('BreadcrumbList')) {
      err(p, 'página interior sin migas de pan');
    }
  }

  /**
   * Todo enlace que abre otra pestaña debe anunciarlo a quien no ve el icono.
   *
   * El pie ya lo hacía con un texto para lectores de pantalla junto al icono, pero
   * `/fuentes` tenía el icono sin ese texto: siete enlaces que abrían otra pestaña sin
   * avisar, en la página que existe precisamente para que cualquiera verifique los
   * datos, así que son los que más se van a seguir.
   *
   * Se exceptúan los enlaces que ya son un botón con texto explícito de acción («Pedir
   * informes por WhatsApp»), donde el destino externo se entiende del propio texto.
   */
  /**
   * Los enlaces en otra pestaña declaran explícitamente aislamiento y privacidad.
   *
   * `noopener` evita depender del comportamiento implícito del navegador respecto a
   * `window.opener`; `noreferrer` evita enviar la URL de origen al destino externo.
   */
  const aperturasNuevaPestana = [
    ...html.matchAll(/<a\b(?=[^>]*target="_blank")[^>]*>/g),
  ].map((m) => m[0]);

  for (const [indice, etiqueta] of aperturasNuevaPestana.entries()) {
    const rel = /\brel="([^"]*)"/.exec(etiqueta)?.[1] ?? '';
    const tokens = new Set(rel.toLowerCase().split(/\s+/).filter(Boolean));
    const faltantes = ['noopener', 'noreferrer'].filter((token) => !tokens.has(token));
    if (faltantes.length > 0) {
      err(p, `enlace target="_blank" ${indice + 1} sin ${faltantes.join(' ni ')} en rel`);
    }
  }

  const esIndexable2 = !/content="noindex/.test(html);
  if (esIndexable2) {
    const nuevaPestana = [
      ...html.matchAll(/<a\b(?=[^>]*target="_blank")[^>]*>([\s\S]*?)<\/a>/g),
    ].map((m) => m[1] ?? '');

    const sinAviso = nuevaPestana.filter((interior) => {
      if (/se abre en una pestaña nueva/.test(interior)) return false;
      const texto = interior.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      // Un botón que ya nombra la acción y el destino no necesita el aviso.
      return !/whatsapp|worldbrain|informes/i.test(texto);
    });

    for (const interior of sinAviso.slice(0, 3)) {
      const texto = interior.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40);
      err(p, `el enlace «${texto}» abre otra pestaña y no lo anuncia`);
    }
  }
  /**
   * El umbral debe medir el contenido propio, no el menú y el pie compartidos.
   *
   * Antes se limpiaba el HTML entero: una ruta con `<main>` vacío aún sumaba más de
   * 200 palabras de navegación y avisos, así que el fallo de prerenderizado podía
   * pasar en verde. Las páginas indexables conservan el umbral de 200 palabras. Una
   * ruta `noindex` como resultados puede ser breve, pero debe traer algo más que un
   * contenedor vacío.
   */
  const contenidoPrincipal = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1];
  if (contenidoPrincipal === undefined) err(p, 'no trae <main> en el HTML servido');

  const texto = (contenidoPrincipal ?? '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const palabras = texto.split(' ').filter((w) => w.length > 1).length;
  const minimo = seIndexa ? 200 : 10;
  if (palabras < minimo) {
    err(p, `solo ${palabras} palabras dentro de <main>; el prerenderizado falló`);
  }
  notas.push(`${p}: ${palabras} palabras en <main> sin ejecutar JavaScript`);

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

  /**
   * Solo las páginas indexables deben estar en el sitemap.
   *
   * Una página que se declara `noindex` y aparece en el sitemap le da a Google dos
   * instrucciones contradictorias. `/resultados` es el caso real: se prerenderiza
   * para que recargarla no caiga en la 404, pero su contenido depende de respuestas
   * guardadas en el navegador y no debe indexarse. La regla se lee de la propia
   * página en lugar de mantener una lista aparte, que envejecería.
   */
  const indexables = paginas().filter(
    ({ archivo }) => !/content="noindex/.test(readFileSync(archivo, 'utf-8')),
  );
  const rutasIndexables = indexables.map(({ ruta }) =>
    ruta === '/' ? `${ORIGEN}/` : `${ORIGEN}${ruta}`,
  );
  const rutasGeneradas = paginas().map(({ ruta }) =>
    ruta === '/' ? `${ORIGEN}/` : `${ORIGEN}${ruta}`,
  );

  /**
   * Toda página indexable debe atarse a la organización.
   *
   * La portada es la única que DESCRIBE la entidad; las demás la referencian por
   * identificador. Si una página no la referencia, para un buscador es contenido
   * suelto sin proveedor conocido, y en un dominio nuevo sin historial eso es
   * justamente lo que hay que evitar. Ocurrió de verdad: `/examen-ipn` y
   * `/curso-ipn` —la página que capta tráfico y la que convierte— no la
   * referenciaban por ningún lado.
   */
  for (const { ruta, archivo } of indexables) {
    const contenido = readFileSync(archivo, 'utf-8');
    if (!contenido.includes('#organizacion')) {
      err(ruta, 'sus datos estructurados no referencian la organización del sitio');
    }
  }

  for (const u of rutasIndexables) {
    if (!urls.includes(u)) err('sitemap.xml', `falta ${u}`);
  }
  for (const u of urls) {
    if (!rutasGeneradas.includes(u)) err('sitemap.xml', `incluye ${u}, que no existe en dist`);
    if (!rutasIndexables.includes(u)) {
      err('sitemap.xml', `incluye ${u}, que se declara noindex`);
    }
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
  const bloqueados = [...robots.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);
  for (const b of bloqueados) {
    if (b === '/') err('robots.txt', 'bloquea el sitio completo');
  }

  /**
   * Una página con `noindex` NO debe estar bloqueada en robots.txt.
   *
   * Son instrucciones que se anulan: si el rastreador no puede entrar, no puede leer
   * la etiqueta que le pide no indexar, y Google puede registrar la dirección sin
   * contenido porque nunca averiguó que debía descartarla. Para sacar una página del
   * índice hay que dejarla rastrear y que ella misma lo diga.
   *
   * Esta comprobación sustituye a un aviso anterior que pedía justo lo contrario
   * —exigía `Disallow: /resultados`—, y que tenía sentido cuando esa ruta no se
   * prerenderizaba y no había ningún HTML con la etiqueta que un rastreador pudiera
   * leer. Al prerenderizarla, la regla de robots quedó obsoleta y perjudicial.
   */
  for (const { ruta, archivo } of paginas()) {
    if (!/content="noindex/.test(readFileSync(archivo, 'utf-8'))) continue;
    const chocan = bloqueados.filter((b) => b !== '/' && ruta.startsWith(b.replace(/\*$/, '')));
    for (const b of chocan) {
      err(
        'robots.txt',
        `bloquea ${b}, y ${ruta} declara noindex: el rastreador no podrá leer la etiqueta`,
      );
    }
  }
}

// --- Separación del banco de preguntas del paquete inicial ---

/**
 * El banco pesa decenas de KB y solo lo necesitan el diagnóstico y sus resultados.
 *
 * Vite puede seguir compilándolo como chunk propio y, aun así, un `modulepreload`
 * accidental en la portada haría que el navegador lo descargara antes de usarlo. Se
 * cruza el archivo real con cada HTML porque el nombre lleva una huella que cambia en
 * cada build y no debe escribirse a mano.
 */
{
  const chunksBanco = readdirSync(join(dist, 'assets')).filter((nombre) =>
    /^banco-[A-Za-z0-9_-]+\.js$/.test(nombre),
  );
  const rutasQueUsanBanco = new Set(['/diagnostico-ipn', '/resultados']);

  if (chunksBanco.length !== 1) {
    err('assets', `se esperaban 1 chunk del banco de preguntas y hay ${chunksBanco.length}`);
  } else {
    const chunk = chunksBanco[0];
    for (const { ruta, archivo } of paginas()) {
      const html = readFileSync(archivo, 'utf-8');
      const loPrecarga = html.includes(
        `<link rel="modulepreload" href="/assets/${chunk}" crossorigin="anonymous">`,
      );
      const debePrecargarlo = rutasQueUsanBanco.has(ruta);

      if (loPrecarga && !debePrecargarlo) {
        err(ruta, `precarga ${chunk} aunque esta página no usa el banco de preguntas`);
      }
      if (!loPrecarga && debePrecargarlo) {
        err(ruta, `no precarga ${chunk}; el diagnóstico esperará una descarga adicional`);
      }
    }
  }
}

// --- Peso de los recursos, que afecta a Core Web Vitals ---

/**
 * Títulos, descripciones y H1 no deben repetirse entre páginas indexables.
 *
 * Dos páginas con el mismo título compiten entre sí: Google tiene que elegir cuál
 * mostrar y reparte las señales entre ambas. Es el defecto que aparece en cuanto
 * alguien crea una página copiando otra y se olvida de cambiar los metadatos, y no
 * lo detecta ninguna de las comprobaciones anteriores porque cada página, por
 * separado, está perfecta.
 *
 * Hoy los seis títulos, las seis descripciones y los seis H1 son distintos; esta
 * comprobación lo mantiene así.
 */
const vistos = { titulo: new Map(), descripcion: new Map(), h1: new Map() };

for (const { ruta, archivo } of paginas()) {
  const contenido = readFileSync(archivo, 'utf-8');
  if (/content="noindex/.test(contenido)) continue;

  const campos = {
    titulo: todos(contenido, /<title>([^<]*)<\/title>/g)[0],
    descripcion: todos(contenido, /name="description" content="([^"]*)"/g)[0],
    h1: todos(contenido, /<h1[^>]*>([\s\S]*?)<\/h1>/g)[0]
      ?.replace(/<[^>]+>/g, '')
      .trim(),
  };

  for (const [campo, valor] of Object.entries(campos)) {
    if (!valor) continue;
    const previo = vistos[campo].get(valor);
    if (previo) {
      err(ruta, `su ${campo} es idéntico al de ${previo}; deben distinguirse`);
    } else {
      vistos[campo].set(valor, ruta);
    }
  }
}

/**
 * La página de error, que hasta ahora no se revisaba.
 *
 * `paginas()` recorre archivos `index.html`, así que `404.html` quedaba fuera de
 * todas las comprobaciones. Se audita aparte, con las reglas que le corresponden y
 * no con las de una página normal: este archivo se sirve en CUALQUIER dirección
 * inexistente, así que no tiene URL propia.
 *
 * Debe pedir `noindex` y NO debe declarar canonical: apuntar a una dirección
 * inventada como `/404` significa declarar canónica una URL que devuelve error.
 */
const ruta404 = join(dist, '404.html');
if (!existsSync(ruta404)) {
  err('404.html', 'no existe: cualquier URL inventada devolverá la portada con estado 200');
} else {
  const html404 = readFileSync(ruta404, 'utf-8');

  if (!/content="noindex/.test(html404)) {
    err('404.html', 'no pide noindex');
  }
  if (/<link rel="canonical"/.test(html404)) {
    err('404.html', 'declara canonical, y no tiene una URL propia que declarar');
  }
  if (/<meta property="og:url"/.test(html404)) {
    err('404.html', 'declara og:url, y no tiene una URL propia que declarar');
  }
  if (todos(html404, /<h1[^>]*>([\s\S]*?)<\/h1>/g).length !== 1) {
    err('404.html', 'debe tener exactamente un H1');
  }
  if (!/<a[^>]+href="\/"/.test(html404)) {
    err('404.html', 'no ofrece ningún enlace de vuelta al inicio');
  }
  notas.push('404.html: presente, noindex y sin canonical');
}

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

/**
 * Cobertura de la intención de búsqueda: no se permite retroceder.
 *
 * Detalle y motivo en scripts/cobertura-consultas.mjs.
 */
for (const retroceso of consultasPerdidas(raiz, paginas())) {
  err('(cobertura)', retroceso);
}

/**
 * Ningún enlace debe llevar dentro dos etiquetas alternadas por CSS.
 *
 * Detalle del defecto en `src/components/layout/Encabezado.tsx`: renderizar una
 * etiqueta corta y una larga ocultando una con CSS deja las DOS en el HTML, y quien
 * no aplica CSS lee «CursoEl curso». Doce enlaces del sitio estuvieron así.
 *
 * Se detecta el MECANISMO —un enlace que contiene a la vez un trozo oculto en móvil y
 * otro oculto en escritorio— y no la costura del texto. El primer intento buscaba una
 * minúscula seguida de mayúscula y marcaba «RumboIPN», que es la marca y la lleva de
 * forma legítima: un fallo que nadie puede resolver enseña a ignorar la comprobación.
 */
for (const { ruta, archivo } of paginas()) {
  const html = readFileSync(archivo, 'utf-8');
  const cuerpo = html.match(/<body[\s\S]*?<\/body>/)?.[0] ?? '';
  for (const enlace of cuerpo.matchAll(/<a [^>]*>([\s\S]*?)<\/a>/g)) {
    const interior = enlace[1];
    const ocultoEnMovil = /class="[^"]*\bsm:hidden\b/.test(interior);
    const ocultoEnEscritorio = /class="[^"]*\bhidden sm:(inline|block|flex)\b/.test(interior);
    if (ocultoEnMovil && ocultoEnEscritorio) {
      const texto = interior.replace(/<[^>]+>/g, '').trim().slice(0, 40);
      err(ruta, `el enlace «${texto}» lleva dos etiquetas alternadas por CSS; sin CSS se leen las dos`);
    }
  }
}

/**
 * Todo recurso local anunciado por HTML o CSS debe existir en `dist/`.
 *
 * El verificador de enlaces omite a propósito `/assets/*` y destinos con extensión,
 * porque no son páginas. Eso dejaba fuera CSS, JavaScript, fuentes, favicon y cualquier
 * imagen pública: Vite protege sus propios imports, pero no una ruta escrita a mano.
 *
 * El favicon y la imagen social tienen además reglas específicas de formato y tamaño;
 * esta capa responde a la pregunta anterior y más básica: «¿el archivo llega al
 * despliegue?». Se incluyen `404.html` y las páginas noindex, no solo el sitemap.
 */
{
  const documentos = paginas().map(({ ruta, archivo }) => ({ ruta, archivo }));
  const error404 = join(dist, '404.html');
  if (existsSync(error404)) documentos.push({ ruta: '/404.html', archivo: error404 });

  const faltantes = new Set();
  for (const { ruta, archivo } of documentos) {
    const html = readFileSync(archivo, 'utf-8');
    for (const coincidencia of html.matchAll(/(?:href|src)="(\/[^"?#]+)"/g)) {
      const referencia = coincidencia[1];
      const esRecurso = referencia.startsWith('/assets/') || /\.[a-z0-9]{2,5}$/i.test(referencia);
      if (!esRecurso) continue;
      const destino = join(dist, referencia.replace(/^\//, ''));
      if (!existsSync(destino)) faltantes.add(`${ruta} -> ${referencia}`);
    }
  }

  const carpetaAssets = join(dist, 'assets');
  if (existsSync(carpetaAssets)) {
    for (const nombre of readdirSync(carpetaAssets).filter((f) => f.endsWith('.css'))) {
      const archivoCss = join(carpetaAssets, nombre);
      const css = readFileSync(archivoCss, 'utf-8');
      for (const coincidencia of css.matchAll(/url\(([^)]+)\)/g)) {
        const referencia = coincidencia[1].trim().replace(/^['"]|['"]$/g, '');
        if (/^(data:|https?:)/.test(referencia)) continue;
        const destino = referencia.startsWith('/')
          ? join(dist, referencia.replace(/^\//, ''))
          : join(dirname(archivoCss), referencia.replace(/^\.\//, ''));
        if (!existsSync(destino)) faltantes.add(`/assets/${nombre} -> ${referencia}`);
      }
    }
  }

  for (const falta of faltantes) {
    err('(recursos)', `${falta}: anuncia un archivo que no existe en el despliegue`);
  }
}

/**
 * Nombre que Google puede mostrar encima del título de cada resultado.
 *
 * Google recomienda un nombre único, corto y consistente en WebSite, Open Graph y la
 * portada, más `alternateName` como respaldo. El nodo decía «Rumbo IPN · WorldBrain
 * México» mientras `og:site_name` decía «Rumbo IPN»: dos preferencias distintas. Su
 * URL además omitía la barra que sí lleva el canonical de la portada.
 *
 * No se fija el nombre a mano en esta guarda: se deriva de `og:site_name`, y la URL se
 * deriva del canonical. Así se vigila la consistencia entre las señales que Google
 * compara, no una copia nueva que también pueda quedarse vieja.
 */
{
  const portada = readFileSync(join(dist, 'index.html'), 'utf-8');
  const ogNombre = portada.match(/property="og:site_name" content="([^"]+)"/)?.[1];
  const canonical = portada.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const bloques = [...portada.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const nodos = bloques.flatMap(([, contenido]) => JSON.parse(contenido)['@graph'] ?? []);
  const sitio = nodos.find((nodo) => nodo['@type'] === 'WebSite');

  if (!sitio) {
    err('/', 'no declara un nodo WebSite: Google no recibe el nombre preferido del sitio');
  } else {
    if (!ogNombre || sitio.name !== ogNombre) {
      err('/', `WebSite.name («${sitio.name ?? 'ausente'}») no coincide con og:site_name («${ogNombre ?? 'ausente'}»)`);
    }
    if (!canonical || sitio.url !== canonical) {
      err('/', `WebSite.url (${sitio.url ?? 'ausente'}) no coincide con el canonical (${canonical ?? 'ausente'})`);
    }
    const alternativas = Array.isArray(sitio.alternateName)
      ? sitio.alternateName
      : sitio.alternateName
        ? [sitio.alternateName]
        : [];
    const dominio = new URL(ORIGEN).hostname;
    if (!alternativas.includes(dominio)) {
      err('/', `WebSite.alternateName no incluye ${dominio}, el respaldo recomendado por Google`);
    }
  }
}

/**
 * Favicon que Google puede mostrar junto al dominio en sus resultados.
 *
 * La documentación oficial consultada el 30 de agosto de 2026 admite BMP, GIF, ICO,
 * PNG, JPEG, PPM y TIFF, pero NO SVG. El sitio anunciaba `/favicon.svg`: funcionaba en
 * los navegadores y podía acabar sustituido por el icono genérico en Google.
 *
 * Se exige PNG, cuadrado y de al menos 48 px. Google acepta desde 8 px pero recomienda
 * más de 48; elegimos 96 px, rasterizando el símbolo que ya existía, sin inventar un
 * logotipo nuevo. Se leen las dimensiones del IHDR real: el nombre del archivo no
 * prueba nada sobre la imagen que se despliega.
 */
{
  const portada = readFileSync(join(dist, 'index.html'), 'utf-8');
  const href = portada.match(/<link[^>]+rel="icon"[^>]+href="([^"]+)"/)?.[1];

  if (!href) {
    err('/', 'no declara favicon: Google mostraría un icono genérico junto al dominio');
  } else if (!href.endsWith('.png')) {
    err('/', `el favicon ${href} no es PNG; la documentación actual de Google no admite SVG`);
  } else {
    const archivo = join(dist, href.replace(/^\//, ''));
    if (!existsSync(archivo)) {
      err('/', `declara el favicon ${href}, pero el archivo no existe en el despliegue`);
    } else {
      const png = readFileSync(archivo);
      const firma = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
      if (png.length < 24 || !png.subarray(0, 8).equals(firma)) {
        err('/', `${href} se anuncia como PNG pero su contenido no es un PNG válido`);
      } else {
        const ancho = png.readUInt32BE(16);
        const alto = png.readUInt32BE(20);
        if (ancho !== alto) err('/', `el favicon mide ${ancho}×${alto}: Google exige proporción 1:1`);
        if (ancho < 48 || alto < 48) {
          err('/', `el favicon mide ${ancho}×${alto}: debe tener al menos 48×48 px`);
        }
      }
    }
  }
}

/**
 * El sitemap y los canonical deben nombrar la MISMA dirección, carácter por carácter.
 *
 * Es la contradicción más fácil de introducir y de las más caras: si el sitemap ofrece
 * `/curso-ipn/` y la página se declara canónica en `/curso-ipn`, se están anunciando
 * dos direcciones para un solo contenido y Google tiene que elegir, gastando rastreo en
 * decidir algo que debería venir dicho. Medido el 30 de agosto: las seis coincidían
 * exactas, así que esto no arregla nada hoy —vigila que siga siendo verdad, porque cada
 * una se genera en un sitio distinto y nada las ataba.
 */
{
  const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf-8');
  const enSitemap = new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]));
  const enCanonical = new Set();

  for (const { ruta, archivo } of paginas()) {
    const html = readFileSync(archivo, 'utf-8');
    if (/content="noindex/.test(html)) continue;
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical) enCanonical.add(canonical);

    const og = html.match(/property="og:url" content="([^"]+)"/)?.[1];
    if (canonical && og && canonical !== og) {
      err(ruta, `el canonical dice ${canonical} y og:url dice ${og}: deben ser idénticos`);
    }
  }

  for (const url of enSitemap) {
    if (!enCanonical.has(url)) {
      err('(sitemap)', `ofrece ${url}, que ninguna página declara como su canonical`);
    }
  }
  for (const url of enCanonical) {
    if (!enSitemap.has(url)) {
      err('(sitemap)', `no incluye ${url}, declarada canónica por una página indexable`);
    }
  }
}

if (errores.length) {
  console.log(`\nErrores (${errores.length}):`);
  for (const e of errores) console.log(`  ✗ ${e}`);
  console.log('');
  process.exit(1);
}

console.log(`\nSin errores. ${avisos.length} aviso(s).\n`);
