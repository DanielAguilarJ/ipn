/**
 * Fuentes y fechas de consulta.
 *
 * Existe para que cualquiera pueda comprobar de dónde salió cada dato del sitio.
 * Es también la respuesta corta a «¿y esto quién lo dice?».
 */

import { ExternalLink } from 'lucide-react';
import { Meta } from '@/lib/Meta';
import { FUENTES, NO_PUBLICADO } from '@/datos/examenOficial';

const FECHA_LEGIBLE = '25 de agosto de 2026';

export function Fuentes() {
  return (
    <>
      <Meta
        titulo="Fuentes y fechas de consulta | Admisión IPN"
        descripcion="Todas las fuentes oficiales del IPN usadas en este sitio, con su URL y la fecha en que se consultaron."
        ruta="/fuentes"
      />

      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="eyebrow text-azul-texto">Transparencia</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Fuentes y fechas de consulta</h1>
        <p className="mt-4 leading-relaxed text-tinta-media">
          Todo dato sobre el examen que aparece en este sitio viene de una de estas páginas públicas
          del IPN o del gobierno. Si encuentras una diferencia con la información oficial, la fuente
          manda: las convocatorias cambian y esta página se actualiza a mano.
        </p>

        <ul className="mt-9 flex flex-col gap-px border-y border-regla">
          {Object.values(FUENTES).map((f) => (
            <li key={f.id} className="bg-papel-alto px-5 py-4">
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1.5 font-sans text-[0.97rem] font-semibold text-azul-texto hover:underline"
              >
                {f.titulo}
                <ExternalLink aria-hidden="true" className="mt-1 size-3.5 shrink-0" />
              </a>
              <p className="mt-1.5 font-mono text-xs break-all text-tinta-suave">{f.url}</p>
              <p className="mt-1 text-xs text-tinta-media">Consultada el {FECHA_LEGIBLE}.</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl">Lo que no encontramos publicado</h2>
        <p className="mt-3 leading-relaxed text-tinta-media">
          Buscamos estos datos en las fuentes anteriores y no están disponibles públicamente. No los
          estimamos ni los presentamos como si los tuviéramos.
        </p>
        <ul className="mt-5 flex flex-col gap-4">
          {NO_PUBLICADO.map((texto, i) => (
            <li
              key={i}
              className="border-l-2 border-lapiz pl-4 text-[0.95rem] leading-relaxed text-tinta-media"
            >
              {texto}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl">Cómo obtuvimos la información</h2>
        <p className="mt-3 leading-relaxed text-tinta-media">
          Solo consultamos páginas y documentos públicos, respetando las exclusiones que cada sitio
          publica en su archivo robots. Extrajimos estructura: nombres de áreas, temas, requisitos y
          fechas. No reprodujimos reactivos de examen, respuestas ni fragmentos extensos de las guías
          oficiales, que son obra protegida de su titular.
        </p>
      </div>
    </>
  );
}
