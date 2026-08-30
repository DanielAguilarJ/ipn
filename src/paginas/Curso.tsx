/**
 * El curso.
 *
 * Orden de lectura, tomado de la investigación en Mobbin: promesa que sí
 * controlamos, luego el método, luego la evidencia concreta. La evidencia aquí no
 * puede ser prueba social —no hay testimonios ni tasas verificables— así que es el
 * temario real, el calendario publicado y lo que el curso incluye.
 *
 * El precio no se muestra mientras no esté confirmado en configuración: se invita
 * a pedir informes, prometiendo el costo en el primer mensaje.
 */

import { ArrowRight, MessageCircle } from 'lucide-react';
import { EnlaceExterno } from '@/components/ui/EnlaceExterno';
import { Link } from 'react-router-dom';
import { BotonExterno, BotonRuta } from '@/components/ui/Boton';
import { RotuloSeccion } from '@/components/ui/RotuloSeccion';
import { TarjetaPrograma } from '@/components/curso/TarjetaPrograma';
import { MetodoCurso } from '@/components/curso/MetodoCurso';
import { TemarioAreas } from '@/components/curso/TemarioAreas';
import { FaqCurso } from '@/components/curso/FaqCurso';
import { Meta } from '@/lib/Meta';
import { ID_ORGANIZACION, grafo, nodoMigas, nodoPagina } from '@/lib/esquemas';
import { AREAS } from '@/diagnostico/areas';
import { useDiagnosticoPrevio } from '@/diagnostico/useDiagnosticoPrevio';
import { CALENDARIO, PERIODO_CONVOCATORIA } from '@/datos/examenOficial';
import {
  HECHOS_HERO,
  INCLUYE,
  PROGRAMAS,
  MENSAJE_GENERAL,
  enfasisPrograma,
  mensajeConDiagnostico,
  nodoFaqCurso,
} from '@/contenido/curso';
import { BRAND, CURSO, LEGAL, LINKS, whatsappUrl } from '@/config/site';

/**
 * Título y descripción, ajustados a la intención de búsqueda documentada.
 *
 * La investigación de sugerencias reales recoge «curso ipn para nivel superior 2026»
 * y «curso de ingreso al ipn 2026». El cuerpo de la página ya decía «nivel superior»
 * siete veces, pero ni el título ni la descripción lo declaraban, y son la parte que
 * Google compara primero: la portada y `/examen-ipn` sí llevaban el año y esta no.
 *
 * «Nivel superior» además hace un trabajo honesto de filtro: este curso NO prepara
 * para vocacional, y quien busque eso es mejor que lo sepa antes de entrar.
 *
 * El título mide 60 caracteres, justo en el límite que la auditoría permite, y la
 * descripción 151 de 155. Cualquier palabra que se añada rompe la comprobación, que
 * es exactamente lo que debe pasar.
 */
const TITULO = 'Curso de admisión al IPN 2026: 4, 6 u 8 meses según tu nivel';
const DESCRIPCION =
  'Curso del IPN para nivel superior de WorldBrain México: Intensivo 4 meses, Estratégico 6 o Blindado 8. Haz el diagnóstico gratis y sabrás cuál te toca.';

/** Solo las etapas cuya fecha el IPN publica de forma general. */
const ETAPAS_PUBLICADAS = CALENDARIO.filter((e) => e.publicada);

/**
 * Datos estructurados de la página.
 *
 * Un `Course` por programa dentro de un `ItemList` representa las tres opciones del
 * mismo curso; el breadcrumb apunta a la ruta real, y la FAQ visible se declara
 * una sola vez. No se declara `offers` con precio porque no hay precio publicado:
 * inventarlo sería falso e incumpliría las directrices de datos estructurados.
 *
 * Importante para quien venga a «mejorar» esto: el resultado enriquecido de
 * `Course` y el de `FAQPage` están DESCONTINUADOS —Google retiró el primero el
 * 2025-09-09 y el segundo dejó de mostrarse el 2026-05-07—, así que añadir
 * propiedades para cumplir sus antiguos requisitos no va a producir ninguna
 * tarjeta en el buscador. El marcado se conserva como representación Schema.org
 * del contenido visible; no hay evidencia propia de que mejore posiciones,
 * comprensión ni citas. Detalle y fuentes en `docs/seo-formatos-vigentes.md`.
 */
function esquemaCurso(): object {
  return grafo(
    /**
     * La página, atada al sitio y a la organización.
     *
     * Faltaba: esta ruta declaraba tres nodos y ninguno referenciaba la entidad que
     * la portada describe, así que la página de conversión quedaba desconectada de
     * WorldBrain México a ojos de un buscador.
     */
    nodoPagina({ nombre: TITULO, descripcion: DESCRIPCION, ruta: '/curso-ipn' }),
    {
      '@type': 'ItemList',
      name: 'Programas de preparación para el examen de admisión al IPN',
      itemListElement: PROGRAMAS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Course',
          name: `${p.nombre} · ${p.meses} meses`,
          description: p.idea,
          inLanguage: 'es-MX',
          provider: { '@id': ID_ORGANIZACION },
          teaches: AREAS.map((a) => a.nombre),
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: CURSO.modalidades.value,
            courseWorkload: `P${p.meses}M`,
          },
        },
      })),
    },
    nodoFaqCurso(),
    nodoMigas('El curso', '/curso-ipn'),
  );
}

export function Curso() {
  const previo = useDiagnosticoPrevio();

  const mensaje = previo
    ? mensajeConDiagnostico(previo.programaNombre, previo.porcentaje)
    : MENSAJE_GENERAL;

  return (
    <>
      <Meta
        titulo={TITULO}
        descripcion={DESCRIPCION}
        ruta="/curso-ipn"
        datosEstructurados={esquemaCurso()}
      />

      {/* Hero */}
      <header className="mx-auto max-w-5xl px-4 pt-14 pb-seccion">
        <p className="eyebrow text-azul-texto">
          {BRAND.program} · {BRAND.org}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
          Un curso de admisión al IPN que empieza donde estás, no donde el temario supone
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta-media">
          Son 140 preguntas en tres horas, y el IPN no publica cuántas son de cada materia. Antes de
          venderte meses de clase medimos tu nivel área por área: el diagnóstico es gratuito, no pide
          registro y es lo que decide cuál de los tres programas te rinde más.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {previo ? (
            <BotonRuta to="/resultados" medida="lg">
              Ver mi resultado
              <ArrowRight aria-hidden="true" className="size-5" />
            </BotonRuta>
          ) : (
            <BotonRuta to="/diagnostico-ipn" medida="lg">
              Hacer el diagnóstico gratis
              <ArrowRight aria-hidden="true" className="size-5" />
            </BotonRuta>
          )}
          <BotonExterno href={whatsappUrl(mensaje)} jerarquia="secundaria" medida="lg">
            <MessageCircle aria-hidden="true" className="size-5" />
            Pedir costo por WhatsApp
          </BotonExterno>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-px border border-regla bg-regla sm:grid-cols-4">
          {HECHOS_HERO.map((h) => (
            <div key={h.dato} className="bg-papel-alto px-4 py-5">
              <dt className="font-display text-xl font-semibold tracking-tight">{h.dato}</dt>
              <dd className="mt-1 text-xs leading-snug text-tinta-suave">{h.nota}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-tinta-suave">
          Datos del examen de nivel superior en la convocatoria vigente del IPN, con su fuente y
          fecha en{' '}
          <Link className="font-medium text-azul-texto hover:underline" to="/fuentes">
            fuentes
          </Link>
          . Cómo funciona por dentro, en{' '}
          <Link className="font-medium text-azul-texto hover:underline" to="/examen-ipn">
            cómo es el examen
          </Link>
          .
        </p>
      </header>

      {/* 01 — Por qué el diagnóstico va primero */}
      <section aria-labelledby="titulo-medir" className="bg-papel-hondo py-seccion">
        <div className="mx-auto max-w-5xl px-4">
          <RotuloSeccion numero={1} texto="Por qué medimos primero" />
          <h2 id="titulo-medir" className="mt-4 max-w-3xl text-2xl sm:text-3xl">
            Meter a alguien que no domina álgebra en un curso de simulacros es perder su dinero
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <p className="leading-relaxed text-tinta-media">
              Y meter en ocho meses de reconstrucción a quien ya domina el temario es perder su
              tiempo. Las dos cosas pasan cuando se vende primero y se diagnostica después. Aquí el
              orden es el contrario: el diagnóstico de esta página te da un porcentaje por área en
              unos veinte minutos y de ahí sale la duración que te corresponde.
            </p>
            <p className="leading-relaxed text-tinta-media">
              No pedimos correo ni teléfono para dártelo, y tus respuestas no salen de tu navegador:
              el resultado se calcula en tu propio equipo. Es tuyo aunque nunca nos escribas, y sirve
              igual si al final decides estudiar por tu cuenta.
            </p>
          </div>
        </div>
      </section>

      {/* 02 — Fechas publicadas */}
      <section aria-labelledby="titulo-fechas" className="mx-auto max-w-5xl px-4 py-seccion">
        <RotuloSeccion numero={2} texto="Cuánto margen tienes" />
        <h2 id="titulo-fechas" className="mt-4 max-w-3xl text-2xl sm:text-3xl">
          La duración que te conviene depende de cuánto falta
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-tinta-media">
          Estas son las fechas que el IPN publica para el {PERIODO_CONVOCATORIA}. Las de tu examen y
          del simulador previo no aparecen aquí porque no se publican de forma general: llegan en tu
          Ficha de Examen. Y cambian en cada convocatoria, así que confírmalas siempre en{' '}
          <EnlaceExterno
            className="font-medium text-azul-texto hover:underline"
            href={LINKS.ipnAdmision.value}
          >
            admisión del IPN
          </EnlaceExterno>
          .
        </p>

        <dl className="mt-8 max-w-2xl border-t border-regla">
          {ETAPAS_PUBLICADAS.map((e) => (
            <div
              key={e.etapa}
              className="flex flex-col gap-1 border-b border-regla py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <dt className="font-sans text-sm font-semibold">{e.etapa}</dt>
              <dd className="text-sm text-tinta-media">{e.cuando}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 03 — Los tres programas */}
      <section aria-labelledby="titulo-programas" className="bg-papel-hondo py-seccion">
        <div className="mx-auto max-w-5xl px-4">
          <RotuloSeccion numero={3} texto="Elige tu ritmo" />
          <h2 id="titulo-programas" className="mt-4 max-w-3xl text-2xl sm:text-3xl">
            Tres duraciones, porque no todos empiezan en el mismo punto
          </h2>

          {previo ? (
            <p className="mt-6 max-w-2xl border-l-2 border-azul bg-azul-tenue p-5 leading-relaxed">
              Tu diagnóstico dio <strong>{previo.porcentaje} %</strong> y te corresponde el programa{' '}
              <strong>{previo.programaNombre}</strong>. Abajo está señalado, y también puedes comparar
              los otros dos.
            </p>
          ) : (
            <p className="mt-5 max-w-2xl leading-relaxed text-tinta-media">
              Si aún no has hecho el diagnóstico, aquí va señalado el más elegido. Con tu resultado,
              esta misma página te marca el que te toca.
            </p>
          )}

          <div className="mt-10 grid gap-px border border-regla bg-regla lg:grid-cols-3">
            {PROGRAMAS.map((p) => (
              <TarjetaPrograma
                key={p.id}
                programa={p}
                enfasis={enfasisPrograma(p.id, previo?.programaId ?? null)}
              />
            ))}
          </div>

          <h3 className="mt-12 font-sans text-lg font-semibold tracking-normal">
            Lo que incluyen los tres
          </h3>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUYE.map((linea) => (
              <li key={linea} className="flex gap-2.5 leading-relaxed text-tinta-media">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-azul" />
                {linea}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 — Método */}
      <section aria-labelledby="titulo-metodo" className="mx-auto max-w-5xl px-4 py-seccion">
        <RotuloSeccion numero={4} texto="Cómo trabaja el curso" />
        <h2 id="titulo-metodo" className="mt-4 max-w-3xl text-2xl sm:text-3xl">
          Medir, planear, practicar, corregir
        </h2>
        <MetodoCurso />
      </section>

      {/* 05 — Temario */}
      <section aria-labelledby="titulo-temario" className="bg-papel-hondo py-seccion">
        <div className="mx-auto max-w-5xl px-4">
          <RotuloSeccion numero={5} texto="Qué vas a estudiar" />
          <h2 id="titulo-temario" className="mt-4 max-w-3xl text-2xl sm:text-3xl">
            El temario del IPN, materia por materia
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-tinta-media">
            Estas son las áreas del temario público, con sus temas. El bloque de Física lo publica el
            IPN distinto para cada rama, así que lo que estudias cambia según la carrera que vayas a
            solicitar.
          </p>
          <TemarioAreas enRefuerzo={previo?.areasEnRefuerzo} />
        </div>
      </section>

      {/* 06 — Costo e inscripción */}
      <section aria-labelledby="titulo-costo" className="bloque-hondo py-seccion">
        <div className="mx-auto max-w-5xl px-4">
          <RotuloSeccion numero={6} texto="Costo e inscripción" sobreOscuro />
          <h2 id="titulo-costo" className="mt-4 max-w-2xl text-2xl sm:text-3xl">
            Te decimos el costo en el primer mensaje
          </h2>

          {CURSO.precioMXN.confirmado && CURSO.precioMXN.value !== null ? (
            <p className="mt-6 font-display text-4xl font-semibold tracking-tight">
              ${CURSO.precioMXN.value.toLocaleString('es-MX')} MXN
            </p>
          ) : (
            <p className="mt-6 max-w-2xl leading-relaxed text-papel/85">
              El costo depende del programa que te corresponda, de la modalidad y del grupo
              disponible, así que preferimos decírtelo con tu caso en la mano en lugar de publicar una
              cifra que quizá no aplique a ti.
            </p>
          )}

          <ul className="mt-7 flex flex-col gap-2.5 text-papel/85">
            {[
              'Sin formulario: no pedimos correo ni teléfono en esta página',
              'Sin llamada obligatoria para conocer el precio',
              'Si no continúas, no volvemos a escribirte',
            ].map((linea) => (
              <li key={linea} className="flex gap-2.5 leading-relaxed">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-papel" />
                {linea}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BotonExterno href={whatsappUrl(mensaje)} jerarquia="whatsapp" medida="lg">
              <MessageCircle aria-hidden="true" className="size-5" />
              Pedir informes por WhatsApp
            </BotonExterno>
            {!previo && (
              <BotonRuta to="/diagnostico-ipn" jerarquia="sobre-oscuro" medida="lg">
                Primero haz el diagnóstico
                <ArrowRight aria-hidden="true" className="size-5" />
              </BotonRuta>
            )}
          </div>
        </div>
      </section>

      {/* 07 — Preguntas */}
      <section aria-labelledby="titulo-faq-curso" className="mx-auto max-w-5xl px-4 py-seccion">
        <RotuloSeccion numero={7} texto="Antes de inscribirte" />
        <h2 id="titulo-faq-curso" className="mt-4 max-w-3xl text-2xl sm:text-3xl">
          Lo que se pregunta antes de pagar
        </h2>
        <FaqCurso />

        <p className="mt-12 border-t border-regla pt-6 text-xs leading-relaxed text-tinta-suave">
          {LEGAL.independencia}
        </p>
      </section>
    </>
  );
}
