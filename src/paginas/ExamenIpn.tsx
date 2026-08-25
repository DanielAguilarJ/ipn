/**
 * Cómo es el examen de admisión al IPN.
 *
 * Página de contenido: responde de verdad las preguntas que la gente escribe en
 * el buscador, con datos verificados y su fuente. Es el ancla de SEO del sitio y
 * la que sostiene la credibilidad de la oferta comercial.
 */

import { ArrowRight, ExternalLink } from 'lucide-react';
import { BotonRuta } from '@/components/ui/Boton';
import { Meta } from '@/lib/Meta';
import { AREAS } from '@/diagnostico/areas';
import {
  CALENDARIO,
  FUENTES,
  HECHOS_EXAMEN,
  NOTA_BACHILLERATO,
  PERIODO_CONVOCATORIA,
  RAMAS,
} from '@/datos/examenOficial';

const TITULO = 'Cómo es el examen de admisión al IPN: 140 preguntas, 3 horas y 3 ramas';
const DESCRIPCION =
  'Estructura real del examen de admisión al IPN para nivel superior: número de preguntas, duración, materias del temario oficial, ramas y calendario del proceso, con fuentes.';

export function ExamenIpn() {
  return (
    <>
      <Meta titulo={TITULO} descripcion={DESCRIPCION} ruta="/examen-ipn" />

      <article className="mx-auto max-w-3xl px-4 py-14">
        <p className="eyebrow text-azul-texto">Guía informativa</p>
        <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">
          Cómo es el examen de admisión al IPN
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-tinta-media">
          Esto es lo que el IPN publica de forma abierta sobre su examen de nivel superior, con la
          fuente de cada dato. Donde el IPN no publica algo, lo decimos en lugar de rellenarlo con
          una estimación.
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
        <p className="mt-6 text-xs text-tinta-suave">
          Temario público del IPN, consultado el 25 de agosto de 2026.{' '}
          <a
            href={FUENTES.temario.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-azul-texto hover:underline"
          >
            Ver la fuente
            <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        </p>

        <h2 className="mt-12 text-2xl sm:text-3xl">
          Cuántas preguntas hay de cada materia
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
          estudio hacia donde no conviene.
        </p>

        <h2 className="mt-12 text-2xl sm:text-3xl">El calendario del proceso</h2>
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
          <a
            href={FUENTES.convocatoria2027.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-azul-texto hover:underline"
          >
            la convocatoria oficial
          </a>
          , consultada el 25 de agosto de 2026.
        </p>

        <h2 className="mt-12 text-2xl sm:text-3xl">¿Y si quiero entrar a una vocacional?</h2>
        <p className="mt-4 leading-relaxed text-tinta-media">{NOTA_BACHILLERATO.texto}</p>

        <div className="mt-14 border border-regla bg-papel-alto p-7">
          <h2 className="text-2xl">Ya sabes cómo es. Ahora mide dónde estás.</h2>
          <p className="mt-3 leading-relaxed text-tinta-media">
            El diagnóstico recorre estas mismas áreas y te dice en cuáles estás firme y en cuáles no.
            Gratis, sin registro, y con el resultado desglosado.
          </p>
          <div className="mt-6">
            <BotonRuta to="/diagnostico" medida="lg">
              Hacer el diagnóstico
              <ArrowRight aria-hidden="true" className="size-5" />
            </BotonRuta>
          </div>
        </div>
      </article>
    </>
  );
}
