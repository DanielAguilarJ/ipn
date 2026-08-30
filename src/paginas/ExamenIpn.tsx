/**
 * Temario y estructura del examen de admisión al IPN.
 *
 * Página de contenido y ancla de SEO del sitio. El enfoque en «temario» no es
 * arbitrario: los datos de Search Console de ultravelozmente.com muestran que de
 * toda la demanda relacionada con el IPN que ya alcanza al negocio, la mayoría se
 * concentra en «temario ipn», «ipn temario» y «temario examen ipn», en posiciones
 * 9 a 11. Es la única demanda medida, así que es la que este título persigue.
 */

import { Link } from 'react-router-dom';
import { EnlaceExterno } from '@/components/ui/EnlaceExterno';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { BotonRuta } from '@/components/ui/Boton';
import { Meta } from '@/lib/Meta';
import { grafo, identidadDeArticulo, nodoMigas, nodoPagina } from '@/lib/esquemas';
import { AREAS } from '@/diagnostico/areas';
import {
  CALENDARIO,
  FUENTES,
  HECHOS_EXAMEN,
  NOTA_BACHILLERATO,
  NO_ESCOLARIZADA,
  PERIODO_CONVOCATORIA,
  PERIODOS_DE_INGRESO,
  RAMAS,
  ultimaRevision,
} from '@/datos/examenOficial';

/**
 * El año del título es 2026, no 2027, y es deliberado.
 *
 * La API de sugerencias de Google devuelve «temario ipn 2026», «temario ipn 2026
 * nivel superior» y «temario ipn 2026 area 2»: la gente nombra el proceso por el
 * año en que lo hace, no por el año en que entraría. La convocatoria es para
 * ingreso en febrero-julio de 2027, y eso se aclara en el cuerpo de la página, de
 * modo que el título coincide con la búsqueda sin dejar de ser exacto.
 */
const TITULO = 'Temario del examen de admisión al IPN 2026 por área y rama';

/**
 * Fecha en que se publicó esta página.
 *
 * Es la del primer commit que la creó, comprobada en el historial del repositorio
 * (`git log --reverse -- src/paginas/ExamenIpn.tsx`). Se escribe como constante
 * porque el navegador no tiene acceso al historial, y con la fuente anotada para
 * que cualquiera pueda verificarla en lugar de creerla.
 */
const PUBLICADA = '2026-08-25';/** 152 caracteres: por debajo del corte de Google, que ronda los 155. */
const DESCRIPCION =
  'Temario oficial del examen del IPN por área y rama, con las 140 preguntas, las 3 horas y el calendario. Cada dato con su fuente y fecha de consulta.';

/**
 * Datos estructurados de la página.
 *
 * `Article` porque es contenido informativo con fuentes, y `BreadcrumbList`
 * porque Google la usa para mostrar la ruta en el resultado en lugar de la URL
 * cruda, lo que mejora el aspecto del enlace.
 */
function esquemaPagina(): object {
  return grafo(
    nodoPagina({
      nombre: TITULO,
      descripcion: DESCRIPCION,
      ruta: '/examen-ipn',
    }),
    {
      '@type': 'Article',
      headline: TITULO,
      description: DESCRIPCION,
      inLanguage: 'es-MX',
      /**
       * Autor, editor, imagen y pertenencia al sitio.
       *
       * Antes esta página no referenciaba la organización por ningún lado, así que
       * el artículo que más tráfico puede captar quedaba como texto anónimo, sin
       * atar a la entidad que la portada sí describe. Los cuatro campos salen del
       * constructor compartido para que no divergan.
       */
      ...identidadDeArticulo(),
      /**
       * Las dos fechas salen de datos verificables, no de la compilación.
       *
       * `datePublished` es la del commit que publicó esta página, y
       * `dateModified` la de la última consulta a las fuentes oficiales, que se
       * calcula sola desde `FUENTES`. Usar la fecha del build sería fingir una
       * actualización cada vez que se recompila, y Google deja de fiarse de ese
       * tipo de señal cuando no se corresponde con cambios reales.
       */
      datePublished: PUBLICADA,
      dateModified: ultimaRevision(),
      about: { '@type': 'Thing', name: 'Examen de admisión al Instituto Politécnico Nacional' },
      articleSection: AREAS.map((a) => a.nombre),
      isBasedOn: Object.values(FUENTES).map((f) => f.url),
    },
    nodoMigas('Temario y estructura del examen', '/examen-ipn'),
  );
}

export function ExamenIpn() {
  return (
    <>
      <Meta
        titulo={TITULO}
        descripcion={DESCRIPCION}
        ruta="/examen-ipn"
        articulo={{ publicada: PUBLICADA, modificada: ultimaRevision() }}
        datosEstructurados={esquemaPagina()}
      />

      <article className="mx-auto max-w-3xl px-4 py-14">
        <p className="eyebrow text-azul-texto">Guía informativa</p>
        <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">
          Temario y estructura del examen de admisión al IPN 2026
        </h1>
        {/*
          Respuesta directa arriba, antes de cualquier explicación. El análisis de
          resultados de búsqueda mostró que las páginas que rankean para estas
          consultas dan la cifra en el título y el primer párrafo, sin obligar a
          entrar. La fecha de verificación va aquí porque los títulos con año
          dominan estas búsquedas y el dato caduca en cada convocatoria.
        */}
        <div className="mt-8 border-l-4 border-azul bg-azul-tenue p-5 sm:p-6">
          <h2 className="eyebrow text-azul-texto">Respuesta corta</h2>
          <p className="mt-2.5 text-[1.05rem] leading-relaxed text-tinta">
            El examen de admisión al IPN de <strong>nivel superior</strong> tiene{' '}
            <strong>140 preguntas</strong> y se resuelve en un máximo de{' '}
            <strong>tres horas</strong>. Evalúa ocho áreas del temario oficial, y el bloque de
            Física cambia según la rama que elijas. Se aplica en línea, con navegador supervisado.
          </p>
          <p className="mt-2.5 text-sm text-tinta-media">
            Verificado en la convocatoria vigente el 25 de agosto de 2026. Las cifras cambian entre
            convocatorias: confírmalas antes de cualquier trámite.
          </p>
        </div>

        <p className="mt-6 leading-relaxed text-tinta-media">
          Debajo está el detalle: las materias del temario por área, qué cambia según la rama, el
          calendario del proceso y los requisitos. Cada dato lleva su fuente. Donde el IPN no
          publica algo, lo decimos en lugar de rellenarlo con una estimación.
        </p>

        <h2 className="mt-12 text-2xl sm:text-3xl">La estructura, en corto</h2>
        <dl className="mt-6 grid gap-px border border-regla bg-regla sm:grid-cols-2">
          {HECHOS_EXAMEN.map((h) => (
            <div key={h.dato} className="bg-papel-alto p-5">
              <dt className="font-display text-2xl font-semibold tracking-tight">{h.dato}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-tinta-media">{h.detalle}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 text-2xl sm:text-3xl">Las tres ramas del conocimiento</h2>
        <p className="mt-4 leading-relaxed text-tinta-media">
          Durante el prerregistro eliges una rama, y las dos carreras que solicites deben pertenecer
          a ella. No se pueden mezclar, y el orden que elijas no se cambia después. Esta decisión
          también determina qué temario de Física te toca estudiar.
        </p>

        {/*
          «área 1», «área 2» y «área 3» aparecen mucho en las búsquedas sobre el IPN,
          pero esa numeración NO está en su convocatoria: el IPN nombra sus ramas.
          Se aclara en lugar de inventar una equivalencia, que es lo que haría falta
          para «posicionar» esos términos sin fundamento.
        */}
        <div className="mt-6 border-l-4 border-azul bg-azul-tenue p-5">
          <h3 className="eyebrow text-azul-texto">Si buscabas «área 1», «área 2» o «área 3»</h3>
          <p className="mt-2 text-[0.97rem] leading-relaxed text-tinta">
            Esa numeración no aparece en la convocatoria del IPN. El IPN <strong>nombra</strong> sus
            tres ramas en lugar de numerarlas, así que si alguien te habla del «área 2 del IPN» lo
            más probable es que esté trasladando la nomenclatura de otra universidad. Para elegir
            bien, fíjate en el nombre de la rama y en qué carreras incluye, no en un número.
          </p>
        </div>

        <ul className="mt-6 flex flex-col gap-px border-y border-regla">
          {RAMAS.map((rama) => (
            <li key={rama.id} className="bg-papel-alto px-5 py-4">
              <h3 className="font-sans text-base font-semibold tracking-normal">{rama.nombre}</h3>
              <p className="mt-1 text-sm leading-relaxed text-tinta-media">{rama.ejemplos}</p>
              <p className="mt-1.5 text-xs text-tinta-suave">
                Ciencias con más peso en su temario: {rama.cienciasClave.join(', ')}.
              </p>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl sm:text-3xl">Qué materias entran</h2>
        <p className="mt-4 leading-relaxed text-tinta-media">
          El temario público del IPN organiza el contenido en estas áreas. Es la lista completa de lo
          que puede aparecer; lo que no está aquí, no entra.
        </p>
        <div className="mt-6 flex flex-col gap-6">
          {AREAS.map((area) => (
            <section key={area.id} className="border-l-2 border-azul pl-5">
              <h3 className="font-sans text-lg font-semibold tracking-normal">{area.nombre}</h3>
              <p className="mt-1 text-sm leading-relaxed text-tinta-media">{area.descripcion}</p>
              <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
                {area.temas.map((tema) => (
                  <li
                    key={tema}
                    className="border border-regla bg-papel-alto px-2.5 py-1 text-xs text-tinta-media"
                  >
                    {tema}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-tinta-suave">
          Estos temas provienen del <strong>temario de estudio oficial</strong> que publica el IPN,
          el documento que suele buscarse como «guía de estudio del IPN en PDF». No lo alojamos aquí:
          lo consultas directamente en la fuente, y esta página te lo ofrece organizado por área para
          leerlo sin descargar nada.{' '}
          <EnlaceExterno
            href={FUENTES.temario.url}
            className="inline-flex items-center gap-1 font-medium text-azul-texto hover:underline"
          >
            Abrir el temario oficial del IPN
            <ExternalLink aria-hidden="true" className="size-3" />
          </EnlaceExterno>
          . Consultado el 25 de agosto de 2026.
        </p>

        {/*
          El encabezado coincide con la consulta literal que devuelve la API de
          sugerencias de Google: «cuantas preguntas tiene el examen del ipn por
          materia». Es una de las búsquedas con más demanda y justo el dato que el
          IPN no publica, así que responderla con honestidad es la mayor ventaja
          que esta página tiene sobre las que estiman una cifra.
        */}
        <h2 className="mt-12 text-2xl sm:text-3xl">
          ¿Cuántas preguntas tiene el examen del IPN de nivel superior por materia?
        </h2>
        <p className="mt-4 leading-relaxed text-tinta-media">
          El IPN no lo publica, y conviene decirlo con claridad. La convocatoria confirma las 140
          preguntas totales y el temario lista las materias, pero la tabla que reparte esas preguntas
          entre asignaturas solo se entrega a quienes elaboran reactivos, bajo compromiso de
          confidencialidad.
        </p>
        <p className="mt-4 leading-relaxed text-tinta-media">
          Por eso este sitio no te va a dar un porcentaje por materia. Si encuentras una página que
          sí lo hace, no está citando al IPN: está estimando, y su estimación puede desviar tu
          estudio hacia donde no conviene. Lo que sí puedes hacer es medir en qué áreas estás flojo
          con{' '}
          <Link to="/diagnostico-ipn" className="font-medium text-azul-texto hover:underline">
            el diagnóstico gratuito
          </Link>{' '}
          y repartir tu tiempo según eso, que es un criterio propio y comprobable.
        </p>

        <h2 className="mt-12 text-2xl sm:text-3xl">
          ¿Qué rama me toca según la carrera que quiero? Medicina, arquitectura, administración y
          las demás
        </h2>
        <p className="mt-4 leading-relaxed text-tinta-media">
          Es la duda práctica que decide qué estudiar, porque el temario de Física cambia con la
          rama. Estas son las carreras que el IPN agrupa en cada una:
        </p>
        <dl className="mt-6 flex flex-col gap-px border-y border-regla">
          {RAMAS.map((rama) => (
            <div key={rama.id} className="bg-papel-alto px-5 py-4">
              <dt className="font-sans text-base font-semibold">{rama.nombre}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-tinta-media">{rama.ejemplos}</dd>
              <dd className="mt-1.5 text-xs text-tinta-suave">
                Física de esta rama, más {rama.cienciasClave.filter((c) => c !== 'Física').join(' y ')}.
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-tinta-media">
          Si tu carrera no aparece en la lista, búscala en la oferta educativa del IPN: cada carrera
          indica a qué rama pertenece, y ese dato manda sobre cualquier lista resumida como esta.
        </p>

        {/*
          «cómo estudiar para el examen del ipn» es una consulta real del
          autocompletado. La respuesta ya estaba escrita: cada área del diagnóstico
          lleva su propio consejo de cómo se mejora, y hasta ahora solo se veía en
          la pantalla de resultados. Aquí sirve a quien todavía no ha hecho nada.
        */}
        <h2 className="mt-12 text-2xl sm:text-3xl">
          Cómo estudiar para el examen del IPN, área por área
        </h2>
        <p className="mt-4 leading-relaxed text-tinta-media">
          No todas las áreas se preparan igual, y ahí se pierde mucho tiempo. Estas son las
          estrategias que rinden en cada una, y el orden importa: las de arriba sostienen a las de
          abajo.
        </p>
        <ol className="mt-6 flex flex-col gap-px border-y border-regla">
          {AREAS.map((area, i) => (
            <li key={area.id} className="flex gap-4 bg-papel-alto px-5 py-4">
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center bg-azul text-xs font-bold text-white"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-sans text-base font-semibold tracking-normal">{area.nombre}</h3>
                <p className="mt-1 text-sm leading-relaxed text-tinta-media">{area.comoMejorar}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-tinta-media">
          El problema práctico es saber en qué áreas concentrarte, porque estudiar las ocho por igual
          desperdicia el tiempo que te sobra en las que ya dominas.{' '}
          <Link to="/diagnostico-ipn" className="font-medium text-azul-texto hover:underline">
            El diagnóstico gratuito
          </Link>{' '}
          te da ese orden en unos minutos, sin registro.
        </p>

        <h2 className="mt-12 text-2xl sm:text-3xl">
          ¿Cuándo es el examen del IPN? El calendario del proceso
        </h2>
        <p className="mt-4 leading-relaxed text-tinta-media">
          Estas son las etapas del {PERIODO_CONVOCATORIA}. Varias fechas no se publican de forma
          general porque llegan de manera individual en los documentos de cada aspirante.
        </p>
        <ul className="mt-6 flex flex-col gap-px border-y border-regla">
          {CALENDARIO.map((e) => (
            <li
              key={e.etapa}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-papel-alto px-5 py-3.5"
            >
              <span className="font-sans text-[0.95rem] font-medium">{e.etapa}</span>
              <span
                className={`ml-auto text-sm ${e.publicada ? 'font-semibold text-tinta' : 'text-tinta-suave italic'}`}
              >
                {e.cuando}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-tinta-suave">
          Las fechas cambian en cada convocatoria. Verifícalas siempre en{' '}
          <EnlaceExterno
            href={FUENTES.convocatoria2027.url}
            className="text-azul-texto hover:underline"
          >
            la convocatoria oficial
          </EnlaceExterno>
          , consultada el 25 de agosto de 2026.
        </p>

        <h2 className="mt-12 text-2xl sm:text-3xl">
          Por qué unas páginas dicen 140 y otras 120 o 130
        </h2>
        <p className="mt-4 leading-relaxed text-tinta-media">
          Es la confusión más común, y casi siempre viene de mezclar niveles y modalidades
          distintas. Esto es lo que sí pudimos verificar, y lo que no:
        </p>
        <ul className="mt-6 flex flex-col gap-px border-y border-regla">
          <li className="bg-papel-alto px-5 py-4">
            <p className="font-sans text-base font-semibold">140 preguntas · nivel superior</p>
            <p className="mt-1 text-sm leading-relaxed text-tinta-media">
              Es la cifra de la convocatoria vigente para licenciatura, en las tres ramas, con tres
              horas de tiempo máximo. Es la que aplica si buscas una carrera del IPN.
            </p>
            <p className="mt-1.5 text-xs text-tinta-suave">
              Fuente: convocatoria de nivel superior, consultada el 25 de agosto de 2026.
            </p>
          </li>
          <li className="bg-papel-alto px-5 py-4">
            <p className="font-sans text-base font-semibold">
              120 preguntas · CECyT de otros estados
            </p>
            <p className="mt-1 text-sm leading-relaxed text-tinta-media">
              Aplica al nivel medio superior de los CECyT foráneos, que tienen convocatoria propia
              del IPN y examen en línea. No es el examen de licenciatura.
            </p>
            <p className="mt-1.5 text-xs text-tinta-suave">
              Fuente: convocatoria de nivel medio superior para CECyT foráneos, consultada el 25 de
              agosto de 2026.
            </p>
          </li>
          <li className="border-l-4 border-lapiz bg-lapiz-tenue px-5 py-4">
            <p className="font-sans text-base font-semibold text-lapiz">
              130 preguntas · no lo pudimos verificar
            </p>
            <p className="mt-1 text-sm leading-relaxed text-tinta-media">
              Circula en varias páginas, pero no encontramos una convocatoria vigente del IPN que
              la respalde. Puede venir de un ciclo anterior o de otra institución. Preferimos
              decírtelo antes que repetir una cifra sin fuente: si la ves, comprueba de qué
              convocatoria y de qué nivel habla esa página.
            </p>
          </li>
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-tinta-media">
          La regla práctica: antes de creer cualquier número, fíjate en tres cosas —el nivel
          (licenciatura o bachillerato), la modalidad y el año de la convocatoria—. Sin esos tres
          datos, una cifra suelta no significa nada.
        </p>

        <h2 className="mt-12 text-2xl sm:text-3xl">
          ¿Existe una «segunda vuelta» del examen del IPN?
        </h2>
        <p className="mt-4 leading-relaxed text-tinta-media">
          Con ese nombre, no. La convocatoria no usa el término «segunda vuelta» ni «2da vuelta»,
          y por eso conviene entender lo que sí existe: el IPN abre{' '}
          <strong>{PERIODOS_DE_INGRESO.cuantos} periodos de ingreso</strong> —
          {PERIODOS_DE_INGRESO.lista.join(', ')}— y cada uno tiene su propia convocatoria, con sus
          propias fechas de registro y de examen.
        </p>
        <p className="mt-4 leading-relaxed text-tinta-media">
          {PERIODOS_DE_INGRESO.reglaNoAsignados} Es decir: no hay un segundo intento dentro del mismo
          proceso, sino un proceso nuevo más adelante en el que puedes volver a presentarte. En la
          práctica funciona como esa «segunda oportunidad» que la gente busca, pero conviene llamarlo
          por su nombre para no perderse las fechas del periodo correcto.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-tinta-suave">
          Fuente:{' '}
          <EnlaceExterno
            href={FUENTES.noEscolarizada.url}
            className="text-azul-texto hover:underline"
          >
            convocatoria del IPN
          </EnlaceExterno>
          , consultada el 25 de agosto de 2026. Las fechas y el número de periodos pueden cambiar:
          confírmalo en la convocatoria vigente antes de planear.
        </p>

        <h2 className="mt-12 text-2xl sm:text-3xl">
          El examen en la modalidad no escolarizada
        </h2>
        <p className="mt-4 leading-relaxed text-tinta-media">
          Si vas por una licenciatura en línea del IPN, el examen es{' '}
          <strong>el mismo en formato</strong>: {NO_ESCOLARIZADA.preguntas} preguntas y{' '}
          {NO_ESCOLARIZADA.horas} horas. La diferencia importante está en otra parte, y es la que más
          conviene saber antes de estudiar:
        </p>
        <ul className="mt-6 flex flex-col gap-px border-y border-regla">
          <li className="bg-papel-alto px-5 py-4">
            <p className="font-sans text-base font-semibold">
              Solo hay carreras de Ciencias Sociales y Administrativas
            </p>
            <p className="mt-1 text-sm leading-relaxed text-tinta-media">
              La oferta en línea no incluye ingenierías ni carreras médico biológicas. Si tu meta es
              una de esas, la modalidad no escolarizada no es una vía alternativa: tendrías que ir por
              la escolarizada. Las carreras disponibles son {NO_ESCOLARIZADA.carreras.join(', ')}.
            </p>
          </li>
          <li className="bg-papel-alto px-5 py-4">
            <p className="font-sans text-base font-semibold">Eliges una carrera, no dos</p>
            <p className="mt-1 text-sm leading-relaxed text-tinta-media">
              En la escolarizada solicitas dos opciones de la misma rama. Aquí eliges una sola, y no
              hay cambios después del prerregistro, así que la decisión pesa más.
            </p>
          </li>
          <li className="bg-papel-alto px-5 py-4">
            <p className="font-sans text-base font-semibold">Hay un curso propedéutico obligatorio</p>
            <p className="mt-1 text-sm leading-relaxed text-tinta-media">
              Quien resulta asignado debe cursarlo {NO_ESCOLARIZADA.cursoPropedeutico}, para aprender
              a manejar la plataforma educativa antes de empezar. No es un trámite: cuenta con
              tiempo para él.
            </p>
          </li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-tinta-media">
          Para el diagnóstico de este sitio, eso significa una cosa práctica: si vas por una carrera
          en línea, elige la rama de <strong>Ciencias Sociales y Administrativas</strong>, que es la
          que corresponde a tu temario.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
          Fuente:{' '}
          <EnlaceExterno
            href={FUENTES.noEscolarizada.url}
            className="text-azul-texto hover:underline"
          >
            convocatoria de nivel superior, modalidad no escolarizada
          </EnlaceExterno>
          , consultada el 25 de agosto de 2026.
        </p>

        <h2 className="mt-12 text-2xl sm:text-3xl">¿Y si quiero entrar a una vocacional?</h2>
        <p className="mt-4 leading-relaxed text-tinta-media">{NOTA_BACHILLERATO.texto}</p>

        <h2 className="mt-12 text-2xl sm:text-3xl">De dónde sale todo esto</h2>
        <p className="mt-4 leading-relaxed text-tinta-media">
          Cada afirmación de esta página proviene de una convocatoria o un temario público del IPN.
          Puedes revisar{' '}
          <Link to="/fuentes" className="font-medium text-azul-texto hover:underline">
            la lista completa de fuentes con su fecha de consulta
          </Link>{' '}
          y comprobarlo por tu cuenta. Si te toca prepararte para este temario,{' '}
          <Link to="/curso-ipn" className="font-medium text-azul-texto hover:underline">
            los tres programas de WorldBrain México
          </Link>{' '}
          lo cubren completo, con la variante de Física que corresponde a tu rama.
        </p>

        <div className="mt-14 border border-regla bg-papel-alto p-7">
          <h2 className="text-2xl">Ya sabes cómo es. Ahora mide dónde estás.</h2>
          <p className="mt-3 leading-relaxed text-tinta-media">
            El diagnóstico recorre estas mismas áreas y te dice en cuáles estás firme y en cuáles no.
            Gratis, sin registro, y con el resultado desglosado.
          </p>
          <div className="mt-6">
            <BotonRuta to="/diagnostico-ipn" medida="lg">
              Hacer el diagnóstico
              <ArrowRight aria-hidden="true" className="size-5" />
            </BotonRuta>
          </div>
        </div>
      </article>
    </>
  );
}
