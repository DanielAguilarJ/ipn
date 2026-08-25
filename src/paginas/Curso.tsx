/**
 * El curso.
 *
 * Presenta los tres programas y explica por qué se recomienda uno según el
 * diagnóstico. El precio no se muestra mientras no esté confirmado en
 * configuración: se invita a pedir informes, que es también el patrón que usan los
 * competidores del sector.
 */

import { ArrowRight, MessageCircle } from 'lucide-react';
import { BotonExterno, BotonRuta } from '@/components/ui/Boton';
import { Meta } from '@/lib/Meta';
import { AREAS } from '@/diagnostico/areas';
import { UMBRALES_CURSO } from '@/diagnostico/puntuacion';
import { BRAND, CURSO, LEGAL, whatsappUrl } from '@/config/site';

const TITULO = 'Curso de preparación para el examen de admisión al IPN | Rumbo IPN';
const DESCRIPCION =
  'Tres programas de preparación para el examen del IPN según tu nivel de partida: reconstruir bases, recorrido completo del temario o afinación con simulacros. De WorldBrain México.';

const MENSAJE = 'Hola, quiero informes del curso de preparación para el examen de admisión al IPN.';

interface Programa {
  readonly nombre: string;
  readonly paraQuien: string;
  /** Duración real del programa, en meses. */
  readonly meses: number;
  readonly idea: string;
  readonly incluye: readonly string[];
  /** Marca el programa que más se recomienda, para darle peso visual. */
  readonly destacado?: boolean;
}

/**
 * Los tres programas tal como los ofrece WorldBrain México en su página de
 * admisión universitaria, verificada el 2026-08-25. Los nombres, las duraciones y
 * cuál es el más elegido son suyos; lo que este sitio añade es a quién
 * corresponde cada uno según el resultado del diagnóstico.
 */
const PROGRAMAS: readonly Programa[] = [
  {
    nombre: 'Intensivo',
    meses: 4,
    idea: 'Para quien tiene el examen cerca y necesita resultados ya.',
    paraQuien: `Te corresponde si superaste el ${UMBRALES_CURSO.estrategico} % sin áreas en refuerzo: ya dominas el contenido y lo que falta es precisión y reloj.`,
    incluye: [
      'Ritmo alto sobre contenido que ya dominas',
      'Simulacro periódico interno para trabajar el tiempo',
      'Corrección de errores por descuido y estrategia de descarte',
      'Libertad de horario, en línea o presencial',
    ],
  },
  {
    nombre: 'Estratégico',
    meses: 6,
    idea: 'Temario completo con tiempo para simulacros y corrección fina.',
    paraQuien: `Te corresponde si estás entre el ${UMBRALES_CURSO.blindado} % y el ${UMBRALES_CURSO.estrategico} %, o si tienes un área concreta rezagada.`,
    incluye: [
      'Temario completo de tu rama, diferenciado para el IPN',
      'Refuerzo dirigido a tus áreas más bajas del diagnóstico',
      'Simulacros y corrección fina con margen de tiempo',
      'Grupos reducidos con revisión de tareas y seguimiento',
    ],
    destacado: true,
  },
  {
    nombre: 'Blindado',
    meses: 8,
    idea: 'Desde cero. Para carreras de altísima demanda.',
    paraQuien: `Te corresponde si quedaste por debajo del ${UMBRALES_CURSO.blindado} %, o con tres o más áreas en nivel de refuerzo.`,
    incluye: [
      'Reconstrucción desde cero, sin dar nada por sabido',
      'Ocho meses de margen para asentar bases antes de los simulacros',
      'Parciales, control de calificaciones y monitoreo del avance',
      'Instructores especializados en las áreas evaluadas',
    ],
  },
];

export function Curso() {
  return (
    <>
      <Meta titulo={TITULO} descripcion={DESCRIPCION} ruta="/curso" />

      <div className="mx-auto max-w-5xl px-4 py-14">
        <p className="eyebrow text-azul-texto">{BRAND.org}</p>
        <h1 className="mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl">
          Tres duraciones, porque no todos empiezan en el mismo punto
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-tinta-media">
          Meter a alguien que no domina álgebra en un curso de simulacros es perder su dinero y su
          tiempo. Por eso el diagnóstico va primero: define en cuál de los tres programas rindes más.
        </p>

        <div className="mt-10 grid gap-px border border-regla bg-regla lg:grid-cols-3">
          {PROGRAMAS.map((p) => (
            <section
              key={p.nombre}
              className={p.destacado ? 'bg-azul-tenue p-6' : 'bg-papel-alto p-6'}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-sans text-xl font-semibold tracking-normal">
                  {p.nombre} · {p.meses} meses
                </h2>
                {p.destacado && (
                  <span className="eyebrow shrink-0 bg-azul px-2 py-1 text-white">Más común</span>
                )}
              </div>
              <p className="mt-3 font-display text-lg leading-snug">{p.idea}</p>
              <p className="mt-3 text-sm leading-relaxed text-tinta-media">{p.paraQuien}</p>
              <ul className="mt-5 flex flex-col gap-2.5 border-t border-regla pt-4">
                {p.incluye.map((linea) => (
                  <li key={linea} className="flex gap-2.5 text-sm leading-relaxed text-tinta-media">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-azul" />
                    {linea}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <h2 className="mt-16 text-2xl sm:text-3xl">Qué cubren los tres</h2>
        <p className="mt-4 max-w-2xl text-tinta-media">
          Las áreas provienen del temario público del IPN, y el temario de Física cambia según tu
          rama, así que el contenido se ajusta a la carrera que vas a solicitar.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <li
              key={a.id}
              className="border border-regla-fuerte bg-papel-alto px-3 py-1.5 text-sm text-tinta-media"
            >
              {a.nombre}
            </li>
          ))}
        </ul>

        {/* Precio: solo si está confirmado. Si no, se pide informes. */}
        <div className="mt-16 border border-regla bg-papel-alto p-7 sm:p-9">
          <h2 className="text-2xl sm:text-3xl">Inversión e inscripción</h2>
          {CURSO.precioMXN.confirmado && CURSO.precioMXN.value !== null ? (
            <p className="mt-4 font-display text-4xl font-semibold tracking-tight">
              ${CURSO.precioMXN.value.toLocaleString('es-MX')} MXN
            </p>
          ) : (
            <p className="mt-4 max-w-2xl leading-relaxed text-tinta-media">
              El costo depende del programa que te corresponda, de la modalidad y del grupo
              disponible, así que preferimos decírtelo con tu caso en la mano en lugar de publicar una
              cifra que quizá no aplique a ti. Escríbenos y te lo damos completo, sin rodeos, en el
              primer mensaje.
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <BotonExterno href={whatsappUrl(MENSAJE)} jerarquia="whatsapp" medida="lg">
              <MessageCircle aria-hidden="true" className="size-5" />
              Pedir informes por WhatsApp
            </BotonExterno>
            <BotonRuta to="/diagnostico" jerarquia="secundaria" medida="lg">
              Antes hacer el diagnóstico
              <ArrowRight aria-hidden="true" className="size-5" />
            </BotonRuta>
          </div>
        </div>

        <p className="mt-12 border-t border-regla pt-6 text-xs leading-relaxed text-tinta-suave">
          {LEGAL.independencia}
        </p>
      </div>
    </>
  );
}
