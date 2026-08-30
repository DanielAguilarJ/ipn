/**
 * Aviso legal y privacidad.
 *
 * Redactado para ser leído, no para cubrirse. Es corto porque el sitio
 * genuinamente no recoge datos: sin formularios, sin analítica de terceros, sin
 * cookies de seguimiento.
 */

import { Meta } from '@/lib/Meta';
import { grafo, nodoMigas, nodoPagina } from '@/lib/esquemas';
import { BloqueIndependencia } from '@/components/layout/AvisoIndependencia';
import { BRAND, WHATSAPP } from '@/config/site';

export function AvisoLegal() {
  return (
    <>
      <Meta
        titulo="Aviso legal y privacidad | Admisión IPN"
        descripcion="Aviso de independencia respecto al IPN, tratamiento de datos y condiciones de uso del diagnóstico."
        ruta="/aviso-legal"
        datosEstructurados={grafo(
          nodoPagina({
            nombre: 'Aviso legal y privacidad',
            descripcion:
              'Independencia respecto al Instituto Politécnico Nacional, tratamiento de datos y condiciones de uso del diagnóstico.',
            ruta: '/aviso-legal',
          }),
          nodoMigas('Aviso legal y privacidad', '/aviso-legal'),
        )}
      />

      <div className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl sm:text-4xl">Aviso legal y privacidad</h1>

        <div className="mt-8">
          <BloqueIndependencia />
        </div>

        <h2 className="mt-12 text-2xl">Qué datos recogemos</h2>
        <p className="mt-3 leading-relaxed text-tinta-media">
          Ninguno. El diagnóstico no pide nombre, correo ni teléfono, y no hay formularios en el
          sitio. Tus respuestas se guardan únicamente en el almacenamiento de sesión de tu propio
          navegador, para que puedas recargar la página sin perder el avance, y desaparecen al cerrar
          la pestaña. No viajan a ningún servidor nuestro porque no hay servidor: el diagnóstico se
          calcula dentro de tu navegador.
        </p>

        <h2 className="mt-10 text-2xl">Cookies y seguimiento</h2>
        <p className="mt-3 leading-relaxed text-tinta-media">
          No usamos cookies de seguimiento ni analítica de terceros. Las tipografías están alojadas
          en este mismo sitio, así que cargarlas no informa a nadie de tu visita.
        </p>

        <h2 className="mt-10 text-2xl">Cuando escribes por WhatsApp</h2>
        <p className="mt-3 leading-relaxed text-tinta-media">
          Los botones de WhatsApp abren una conversación con {BRAND.org} en el número{' '}
          {WHATSAPP.numeroVisible}, con un mensaje ya escrito que incluye tu resultado del
          diagnóstico. Puedes borrarlo o editarlo antes de enviarlo. Al escribirnos, la conversación
          queda sujeta a las condiciones de WhatsApp, y usaremos lo que nos cuentes solo para
          atenderte y darte informes del curso.
        </p>

        <h2 className="mt-10 text-2xl">Sobre el contenido del diagnóstico</h2>
        <p className="mt-3 leading-relaxed text-tinta-media">
          Las preguntas son originales, redactadas por {BRAND.org} a partir de las áreas y temas que
          el IPN publica de forma abierta. No reproducen reactivos del examen real ni de sus guías de
          estudio. El resultado es una referencia de estudio: no predice ni garantiza tu admisión,
          que depende del puntaje de todos los aspirantes y de los lugares disponibles en cada
          carrera.
        </p>

        <h2 className="mt-10 text-2xl">Exactitud de la información</h2>
        <p className="mt-3 leading-relaxed text-tinta-media">
          Las fechas y requisitos del proceso cambian en cada convocatoria. Publicamos la fuente y la
          fecha de consulta de cada dato en la página de fuentes, pero la información oficial y
          vigente es siempre la del IPN. Antes de tomar cualquier decisión de trámite, verifícala en
          ipn.mx.
        </p>

        <h2 className="mt-10 text-2xl">Contacto</h2>
        <p className="mt-3 leading-relaxed text-tinta-media">
          Para corregir un dato, pedir informes o cualquier otra cuestión, escríbenos por WhatsApp al{' '}
          {WHATSAPP.numeroVisible}.
        </p>
      </div>
    </>
  );
}
