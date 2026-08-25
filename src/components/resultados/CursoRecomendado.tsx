/**
 * Curso recomendado y llamadas a la acción.
 *
 * Va al final de la pantalla de resultados, después de la interpretación y del
 * desglose: el patrón que Mobbin muestra en Liven y Bloom, donde la acción llega
 * cuando la persona ya entendió su resultado, no pegada a la cifra.
 *
 * El mensaje de WhatsApp se precarga con el resultado real del diagnóstico. Sirve
 * a las dos partes: quien escribe no tiene que explicarse, y quien atiende sabe
 * de entrada qué áreas hay que reforzar.
 */

import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { BotonExterno } from '@/components/ui/Boton';
import { BRAND, CURSO, LINKS, WHATSAPP, whatsappUrl } from '@/config/site';
import type { Resultado } from '@/diagnostico/tipos';

/** Construye el mensaje de WhatsApp con el resultado del diagnóstico. */
export function mensajeWhatsApp(resultado: Resultado, nombreRama: string): string {
  const flojas = resultado.mejoras.slice(0, 3).map((a) => a.nombre);
  const detalleFlojas =
    flojas.length > 0
      ? ` Mis áreas más bajas fueron ${flojas.join(', ')}.`
      : ' Salí parejo en todas las áreas.';

  return (
    `Hola, hice el diagnóstico de Rumbo IPN para la rama de ${nombreRama}. ` +
    `Saqué ${resultado.correctas} de ${resultado.total} (${resultado.porcentaje}%).${detalleFlojas}` +
    ` Me recomendó ${resultado.recomendacion.nombre} y quiero informes.`
  );
}

interface Props {
  readonly resultado: Resultado;
  readonly nombreRama: string;
}

export function CursoRecomendado({ resultado, nombreRama }: Props) {
  const { recomendacion } = resultado;
  const mensaje = mensajeWhatsApp(resultado, nombreRama);

  return (
    <section aria-labelledby="titulo-recomendacion" className="bloque-hondo">
      <div className="px-5 py-10 sm:px-10 sm:py-12">
        <p className="eyebrow text-white/60">Lo que te recomendamos</p>
        <h2
          id="titulo-recomendacion"
          className="mt-3 text-3xl text-papel sm:text-4xl"
        >
          {recomendacion.nombre}
        </h2>

        <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-white/85">
          {recomendacion.porQue}
        </p>

        <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-3">
          {recomendacion.enfoque.map((punto) => (
            <li
              key={punto}
              className="border-t border-white/20 pt-3 text-sm leading-relaxed text-white/80"
            >
              {punto}
            </li>
          ))}
        </ul>

        {/*
          Datos comerciales: solo se muestran los que están confirmados en la
          configuración. No se inventa un precio ni una fecha de inicio.
        */}
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {CURSO.modalidades.confirmado && (
            <div>
              <dt className="eyebrow text-white/55">Modalidad</dt>
              <dd className="mt-1 text-lg font-semibold text-papel">
                {CURSO.modalidades.value.join(' o ')}
              </dd>
            </div>
          )}
          {CURSO.cupoMaximo.confirmado && CURSO.cupoMaximo.value !== null && (
            <div>
              <dt className="eyebrow text-white/55">Grupo</dt>
              <dd className="mt-1 text-lg font-semibold text-papel">
                Máximo {CURSO.cupoMaximo.value} alumnos
              </dd>
            </div>
          )}
          {CURSO.proximoInicio.confirmado && CURSO.proximoInicio.value && (
            <div>
              <dt className="eyebrow text-white/55">Próximo inicio</dt>
              <dd className="mt-1 text-lg font-semibold text-papel">
                {CURSO.proximoInicio.value}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <BotonExterno href={whatsappUrl(mensaje)} jerarquia="whatsapp" medida="lg">
            <MessageCircle aria-hidden="true" className="size-5" />
            Pedir informes por WhatsApp
          </BotonExterno>

          <BotonExterno href={LINKS.cursoDetalle.value} jerarquia="sobre-oscuro" medida="lg">
            Ver el curso en {BRAND.org}
            <ArrowUpRight aria-hidden="true" className="size-5" />
          </BotonExterno>
        </div>

        <p className="mt-5 text-sm text-white/65">
          Escribes al {WHATSAPP.numeroVisible} con tu resultado ya incluido, así no tienes que
          explicarlo de nuevo. Sin costo y sin compromiso de inscripción.
        </p>
      </div>
    </section>
  );
}
