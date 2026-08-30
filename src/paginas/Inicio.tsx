/**
 * Landing de captación.
 *
 * Orden tomado de la investigación (Podia, SuperHi, Skillshare en Mobbin):
 * el hero abre con el resultado que la persona quiere, una acción dominante y una
 * salida secundaria de bajo riesgo. Las cifras aparecen grandes y aisladas, pero
 * solo cifras reales del examen: aquí no hay porcentajes de aceptados inventados
 * ni conteos de alumnos que nadie pueda comprobar.
 */

import { Link } from 'react-router-dom';
import { EnlaceExterno } from '@/components/ui/EnlaceExterno';
import { ArrowRight, BookOpen, ClipboardList, MessageCircle, Route } from 'lucide-react';
import { BotonExterno, BotonRuta } from '@/components/ui/Boton';
import { RotuloSeccion } from '@/components/ui/RotuloSeccion';
import { grafo } from '@/lib/esquemas';
import { Faq, esquemaFaq } from '@/components/inicio/Faq';
import { Meta } from '@/lib/Meta';
import { AREAS } from '@/diagnostico/areas';
import { PREGUNTAS_POR_PERSONA } from '@/diagnostico/conteo';
import { HECHOS_EXAMEN, NO_PUBLICADO, RAMAS, FUENTES } from '@/datos/examenOficial';
import { BRAND, LEGAL, SITE, whatsappUrl } from '@/config/site';

const TITULO = 'Curso de admisión al IPN 2026 y diagnóstico gratis por área';
/** 154 caracteres: entra completa en el resultado de Google. */
const DESCRIPCION =
  'Mide gratis tu nivel en las 8 áreas del temario del IPN, sin registro, y sabe por dónde empezar a estudiar. Curso de preparación de WorldBrain México.';

const MENSAJE_HERO =
  'Hola, vengo de admisionipn.com y quiero informes del curso de preparación para el examen del IPN.';

/**
 * Nodos de la organización y del curso, sin cifras inventadas.
 *
 * Devuelve la LISTA de nodos y no un documento con su propio `@context`: quien la
 * usa la mete en el grafo de la página. Antes devolvía el documento completo y el
 * punto de uso lo envolvía otra vez, así que la portada servía un `@graph` dentro
 * de otro `@graph`. Los nodos quedaban un nivel demasiado abajo y, para un lector
 * de datos estructurados, ahí no hay ninguna entidad: la portada declaraba el sitio
 * y la organización sin que se pudieran extraer.
 */
/** Nodo del curso. El sitio y la organización los aporta `grafo()` en todas las páginas. */
export function nodosSitio(): readonly object[] {
  return [
    {
        '@type': 'Course',
        name: `${BRAND.program}: preparación para el examen de admisión al IPN`,
        description:
          'Programa de preparación que cubre las áreas del temario público del IPN para nivel superior: Matemáticas, Comunicación, Inglés, Historia y Entorno Socioeconómico, Física, Química y Biología.',
        inLanguage: 'es-MX',
        provider: { '@id': `${SITE.origin.value}/#organizacion` },
        teaches: AREAS.map((a) => a.nombre),
      },
  ];
}

/**
 * Cuántas preguntas ve cada persona en su diagnóstico.
 *
 * La cifra se publica en `conteo.ts` y `conteo.test.ts` la comprueba contra el
 * banco vivo en las tres ramas. Antes se calculaba aquí importando el banco
 * completo, lo que metía las 40 preguntas con sus explicaciones en el paquete
 * inicial: quien solo leía la portada descargaba todo el examen sin abrirlo.
 */
export function preguntasPorPersona(): { readonly cifra: number; readonly exacta: boolean } {
  return PREGUNTAS_POR_PERSONA;
}

export function Inicio() {
  const { cifra, exacta } = preguntasPorPersona();

  return (
    <>
      <Meta
        titulo={TITULO}
        descripcion={DESCRIPCION}
        ruta="/"
        datosEstructurados={grafo(...nodosSitio(), esquemaFaq())}
      />

      {/* Hero */}
      <section className="border-b border-regla">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-azul-texto">Examen de admisión · Nivel superior</p>
            <h1 className="mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
              El examen del IPN no premia estudiar más.{' '}
              <span className="text-azul-texto">Premia estudiar lo que te falta.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-tinta-media">
              Son 140 preguntas y tres horas para demostrar años de bachillerato. Empieza por saber
              exactamente dónde estás firme y dónde no: el diagnóstico es gratuito, no pide registro
              y te da el desglose por área en unos minutos.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <BotonRuta to="/diagnostico-ipn" medida="lg">
                Hacer el diagnóstico gratis
                <ArrowRight aria-hidden="true" className="size-5" />
              </BotonRuta>
              <BotonRuta to="/examen-ipn" jerarquia="secundaria" medida="lg">
                Ver cómo es el examen
              </BotonRuta>
            </div>

            <p className="mt-4 text-sm text-tinta-suave">
              {exacta ? cifra : `Desde ${cifra}`} preguntas originales · sin correo ni teléfono ·
              resultado inmediato
            </p>
          </div>

          {/* Cifras reales del examen, grandes y aisladas. */}
          <aside className="border border-regla bg-papel-alto">
            <h2 className="border-b border-regla px-6 py-4 font-sans text-sm font-semibold tracking-normal">
              El examen, en datos oficiales
            </h2>
            <dl className="divide-y divide-regla">
              {HECHOS_EXAMEN.map((h) => (
                <div key={h.dato} className="px-6 py-4">
                  <dt className="font-display text-2xl font-semibold tracking-tight">{h.dato}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-tinta-media">{h.detalle}</dd>
                </div>
              ))}
            </dl>
            <p className="border-t border-regla px-6 py-3.5 text-xs text-tinta-suave">
              Fuente:{' '}
              <EnlaceExterno
                href={FUENTES.convocatoria2027.url}
                className="text-azul-texto hover:underline"
              >
                convocatoria vigente del IPN
              </EnlaceExterno>
              , consultada el 25 de agosto de 2026.
            </p>
          </aside>
        </div>
      </section>

      {/* Las tres ramas */}
      <section className="border-b border-regla bg-papel-hondo">
        <div className="mx-auto max-w-6xl px-4 py-seccion">
          <RotuloSeccion numero={1} texto="Elige tu rama" />
          <h2 className="max-w-2xl text-3xl sm:text-4xl">
            Tres ramas, tres exámenes distintos
          </h2>
          <p className="mt-4 max-w-2xl text-tinta-media">
            Eliges una rama y tus dos opciones de carrera deben pertenecer a ella. El temario de
            Física cambia en cada una, así que estudiar «lo del IPN» en general es la forma más
            rápida de perder tiempo.
          </p>
          <ul className="mt-9 grid gap-px border border-regla bg-regla sm:grid-cols-3">
            {RAMAS.map((rama, i) => (
              <li key={rama.id} className="bg-papel-alto p-6">
                <span
                  aria-hidden="true"
                  className="font-display text-3xl font-semibold text-numeral"
                >
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-sans text-base font-semibold tracking-normal">
                  {rama.nombre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-media">{rama.ejemplos}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="border-b border-regla">
        <div className="mx-auto max-w-6xl px-4 py-seccion">
          <RotuloSeccion numero={2} texto="Cómo funciona" />
          <h2 className="max-w-2xl text-3xl sm:text-4xl">Cómo funciona</h2>
          <ol className="mt-9 grid gap-8 sm:grid-cols-3">
            {[
              {
                icono: ClipboardList,
                titulo: 'Mides tu punto de partida',
                texto:
                  'Respondes el diagnóstico por área. Al terminar sabes qué áreas están sólidas y cuáles requieren refuerzo, con porcentaje por cada una.',
              },
              {
                icono: Route,
                titulo: 'Recibes la ruta que te toca',
                texto:
                  'Según tu resultado te corresponde uno de tres programas: reconstruir bases, recorrido completo del temario, o afinación con simulacros.',
              },
              {
                icono: BookOpen,
                titulo: 'Estudias con acompañamiento',
                texto:
                  'Avanzas el temario oficial de tu rama con seguimiento cercano y simulacros cronometrados, y vuelves a medir para comprobar el avance.',
              },
            ].map((paso, i) => (
              <li key={paso.titulo}>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center bg-azul text-white">
                    <paso.icono aria-hidden="true" className="size-5" />
                  </span>
                  <span className="eyebrow text-tinta-suave">Paso {i + 1}</span>
                </div>
                <h3 className="mt-4 font-sans text-lg font-semibold tracking-normal">
                  {paso.titulo}
                </h3>
                <p className="mt-2 leading-relaxed text-tinta-media">{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Áreas que cubre el curso */}
      <section className="border-b border-regla bg-papel-hondo">
        <div className="mx-auto max-w-6xl px-4 py-seccion">
          <RotuloSeccion numero={3} texto="Temario oficial" />
          <h2 className="max-w-2xl text-3xl sm:text-4xl">
            Las {AREAS.length} áreas del temario, ninguna de adorno
          </h2>
          <p className="mt-4 max-w-2xl text-tinta-media">
            Los temas provienen del temario público del IPN. Cada área del diagnóstico corresponde a
            una del temario, así que tu resultado se traduce directamente en qué estudiar.
          </p>
          <ul className="mt-9 grid gap-px border border-regla bg-regla sm:grid-cols-2 lg:grid-cols-4">
            {AREAS.map((area) => (
              <li key={area.id} className="bg-papel-alto p-5">
                <h3 className="font-sans text-[0.95rem] font-semibold tracking-normal">
                  {area.nombre}
                </h3>
                <ul className="mt-3 flex flex-col gap-1">
                  {area.temas.slice(0, 4).map((tema) => (
                    <li key={tema} className="text-[0.82rem] leading-snug text-tinta-suave">
                      {tema}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-tinta-suave">
            Temario público del IPN, consultado el 25 de agosto de 2026.{' '}
            <EnlaceExterno
              href={FUENTES.temario.url}
              className="text-azul-texto hover:underline"
            >
              Ver la fuente
            </EnlaceExterno>
            .
          </p>
        </div>
      </section>

      {/* Transparencia: convertida en argumento, no en descargo */}
      <section className="border-b border-regla">
        <div className="mx-auto max-w-3xl px-4 py-seccion">
          <RotuloSeccion numero={4} texto="Transparencia" />
          <h2 className="text-3xl sm:text-4xl">Lo que nadie te puede prometer</h2>
          <p className="mt-4 text-tinta-media">
            Hay tres cosas que el IPN no publica. Cualquier curso que te dé una cifra exacta sobre
            ellas está estimando, y conviene que lo sepas antes de pagar.
          </p>
          <ul className="mt-8 flex flex-col gap-5">
            {NO_PUBLICADO.map((texto, i) => (
              <li key={i} className="flex gap-4 border-l-2 border-lapiz pl-4">
                <p className="text-[0.97rem] leading-relaxed text-tinta-media">{texto}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[0.97rem] leading-relaxed text-tinta">
            Lo que sí podemos hacer es cubrir el temario completo de tu rama, medir tu avance con
            datos y prepararte para resolver 140 preguntas en tres horas sin quedarte sin tiempo. Eso
            es lo que hacen{' '}
            <Link to="/curso-ipn" className="font-medium text-azul-texto hover:underline">
              los tres programas de preparación
            </Link>
            , y el diagnóstico existe para saber cuál te toca. Todos los datos que afirmamos sobre el
            examen están en{' '}
            <Link to="/fuentes" className="font-medium text-azul-texto hover:underline">
              la lista de fuentes con su fecha de consulta
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-regla bg-papel-hondo py-seccion">
        <Faq />
      </section>

      {/* Cierre */}
      <section className="bloque-hondo">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <h2 className="text-3xl text-papel sm:text-4xl">
            Empieza por saber dónde estás
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/80">
            El diagnóstico es gratuito y no pide datos. Si al terminar quieres el curso, ahí tendrás
            la recomendación que te corresponde y un WhatsApp directo.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <BotonRuta to="/diagnostico-ipn" medida="lg">
              Hacer el diagnóstico gratis
              <ArrowRight aria-hidden="true" className="size-5" />
            </BotonRuta>
            <BotonExterno href={whatsappUrl(MENSAJE_HERO)} jerarquia="sobre-oscuro" medida="lg">
              <MessageCircle aria-hidden="true" className="size-5" />
              Hablar por WhatsApp
            </BotonExterno>
          </div>
          <p className="mt-8 text-xs leading-relaxed text-white/55">
            {LEGAL.independenciaCorta}
          </p>
        </div>
      </section>
    </>
  );
}
