/**
 * Preguntas frecuentes.
 *
 * Cumple dos funciones a la vez: resuelve las dudas que frenan una inscripción y
 * alimenta los datos estructurados FAQPage. El texto visible y el del schema son
 * el mismo, siempre: publicar en schema algo que no está en pantalla es
 * exactamente lo que Google penaliza.
 */

import { PERIODO_CONVOCATORIA } from '@/datos/examenOficial';
import { LINKS } from '@/config/site';

export interface Pregunta {
  readonly pregunta: string;
  readonly respuesta: string;
}

export const PREGUNTAS_FRECUENTES: readonly Pregunta[] = [
  {
    pregunta: '¿Cuántas preguntas tiene el examen de admisión al IPN?',
    respuesta:
      'El examen de nivel superior tiene 140 preguntas y se resuelve en un máximo de tres horas efectivas. Es el mismo total para las tres ramas del conocimiento, según la convocatoria vigente del IPN.',
  },
  {
    pregunta: '¿Cuántas preguntas hay de cada materia?',
    respuesta:
      'El IPN no lo publica. La convocatoria da el total de 140 preguntas y el temario lista las materias, pero la tabla que reparte las preguntas entre Matemáticas, Comunicación, Inglés, Historia, Física, Química y Biología solo se entrega a quienes elaboran reactivos, bajo confidencialidad. Cualquier página que te dé porcentajes exactos por materia está estimando, no citando.',
  },
  {
    pregunta: '¿Qué materias vienen en el examen del IPN?',
    respuesta:
      'Según el temario público: Matemáticas, Comunicación con competencia lectora y escrita, Inglés, Historia y Entorno Socioeconómico de México, Biología, Química y Física. El temario de Física es distinto para cada rama, así que lo que estudias cambia según la carrera que elijas.',
  },
  {
    pregunta: '¿Se necesita un promedio mínimo para entrar al IPN?',
    respuesta:
      'Para nivel superior no se pide promedio mínimo de bachillerato, pero sí haberlo concluido y poder acreditarlo con documentos si obtienes un lugar. Para las vocacionales sí se pide promedio mínimo de secundaria.',
  },
  {
    pregunta: '¿El examen del IPN es en línea o presencial?',
    respuesta:
      'La convocatoria vigente indica examen en línea con navegador supervisado, en computadora de escritorio o laptop, con cámara, micrófono e internet. No se puede presentar desde teléfono ni tableta, así que conviene resolver ese detalle con tiempo.',
  },
  {
    pregunta: '¿Cuándo es el registro para el IPN?',
    respuesta: `Para el ${PERIODO_CONVOCATORIA}, el prerregistro se abrió del 15 de julio al 30 de agosto de 2026, con ventanas por letra inicial del primer apellido, y los resultados se anuncian el 24 de octubre de 2026. Las fechas cambian cada convocatoria: confirma siempre en ${LINKS.ipnOficial.value}.`,
  },
  {
    pregunta: '¿Qué pasa si se me acaba el tiempo en el examen del IPN?',
    respuesta:
      'Las preguntas que no alcances a responder cuentan como error, así que administrar el reloj es parte del examen y no un detalle. Son 140 preguntas en tres horas: poco más de un minuto por pregunta, sin tiempo para atorarse en una. Por eso el diagnóstico también te dice si tu problema es de contenido o de ritmo, y el programa de Afinación se dedica precisamente a resolver bajo presión de tiempo.',
  },
  {
    pregunta: '¿Qué necesito para presentar el examen en línea y qué pasa si algo falla?',
    respuesta:
      'La convocatoria pide computadora de escritorio o laptop con cámara web, micrófono e internet, y navegador supervisado. No sirve el teléfono ni la tableta. Vale la pena resolver esto semanas antes y no el día del examen: consigue el equipo, prueba la cámara y el micrófono, y presenta el simulador que el IPN programa para cada aspirante, que existe justo para descubrir estos problemas a tiempo.',
  },
  {
    pregunta: '¿Cuántos aciertos necesito para entrar a mi carrera?',
    respuesta:
      'No hay un número fijo que alguien pueda garantizarte, y desconfía de quien te dé uno. La asignación depende del puntaje de todos los aspirantes de ese proceso y de los lugares disponibles en la carrera y el plantel que pidas, así que el corte cambia cada convocatoria y por carrera. Lo que sí puedes controlar es subir tu propio puntaje, y para eso primero hay que saber de dónde partes.',
  },
  {
    pregunta: '¿Cuánto cuesta el curso?',
    respuesta:
      'Depende del programa que te corresponda según tu diagnóstico, de la modalidad y del grupo disponible. Preferimos decírtelo con tu caso concreto en lugar de publicar una cifra que quizá no aplique a ti; si escribes por WhatsApp te damos el costo completo en el primer mensaje, sin rodeos y sin pasar por un asesor que te llame después.',
  },
  {
    pregunta: '¿El diagnóstico de esta página tiene costo o pide registro?',
    respuesta:
      'Ninguno de los dos. No pedimos correo, teléfono ni datos para verlo. Tus respuestas se quedan en tu navegador y el resultado aparece de inmediato, desglosado por área.',
  },
  {
    pregunta: '¿El diagnóstico predice si voy a quedar?',
    respuesta:
      'No, y desconfía de quien te diga lo contrario. Mide tu punto de partida por área para saber por dónde empezar a estudiar. El resultado del examen real depende del puntaje de todos los aspirantes y de los lugares disponibles en la carrera que pidas.',
  },
  {
    pregunta: '¿Este sitio es del IPN?',
    respuesta:
      'No. Es un sitio independiente de WorldBrain México, que ofrece un curso de preparación. No estamos afiliados al Instituto Politécnico Nacional, no lo representamos y no participamos en su proceso de admisión. La información oficial siempre está en ipn.mx.',
  },
  {
    pregunta: '¿Cómo entro a una vocacional del IPN?',
    respuesta:
      'Si es en la Zona Metropolitana, en 2026 ya no se hace por COMIPEMS: el trámite pasó a la plataforma «Mi derecho, mi lugar», dentro del proceso ECOEMS, y el IPN aplica examen en línea. Los CECyT de otros estados tienen convocatoria propia del IPN, con examen de 120 preguntas.',
  },
];

/** Datos estructurados FAQPage, generados desde el mismo texto visible. */
export function esquemaFaq(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PREGUNTAS_FRECUENTES.map((p) => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
    })),
  };
}

export function Faq() {
  return (
    <section aria-labelledby="titulo-faq" className="mx-auto max-w-3xl px-4">
      <h2 id="titulo-faq" className="text-3xl sm:text-4xl">
        Lo que más se pregunta
      </h2>
      <div className="mt-8 border-t border-regla">
        {PREGUNTAS_FRECUENTES.map((p) => (
          <details key={p.pregunta} className="group border-b border-regla">
            <summary className="flex cursor-pointer list-none items-start gap-4 py-5 font-sans text-base font-semibold hover:text-azul-texto">
              <span className="flex-1">{p.pregunta}</span>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-xl leading-none text-azul-texto transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-6 text-[0.97rem] leading-relaxed text-tinta-media">{p.respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
