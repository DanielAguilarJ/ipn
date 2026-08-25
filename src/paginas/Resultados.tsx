/**
 * Página de resultados.
 *
 * El orden de lectura sigue el patrón que documentamos en Mobbin:
 *   1. Una frase que se entiende sin números.
 *   2. La cifra global, grande, con su tramo descriptivo.
 *   3. El desglose por área, comparable.
 *   4. Fortalezas y áreas de mejora explicadas.
 *   5. El curso recomendado y la acción.
 *
 * Si alguien llega aquí sin haber hecho el examen, no se muestra un resultado
 * vacío ni inventado: se le invita a empezarlo.
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, TrendingUp, Target } from 'lucide-react';
import { BotonRuta } from '@/components/ui/Boton';
import { DesgloseAreas } from '@/components/resultados/DesgloseAreas';
import { CursoRecomendado } from '@/components/resultados/CursoRecomendado';
import { Meta } from '@/lib/Meta';
import { AREAS } from '@/diagnostico/areas';
import { BANCO } from '@/diagnostico/banco';
import { calcularResultado } from '@/diagnostico/puntuacion';
import { interpretar } from '@/diagnostico/interpretacion';
import { borrarGuardado, leerGuardado } from '@/diagnostico/useExamen';
import { RAMAS } from '@/datos/examenOficial';
import { LEGAL } from '@/config/site';

export function Resultados() {
  const guardado = useMemo(() => leerGuardado(), []);

  const datos = useMemo(() => {
    if (!guardado) return null;
    const resultado = calcularResultado(BANCO, AREAS, guardado.respuestas, guardado.rama);
    const rama = RAMAS.find((r) => r.id === guardado.rama);
    return { resultado, interpretacion: interpretar(resultado), rama };
  }, [guardado]);

  if (!datos) {
    return (
      <>
        <Meta
          titulo="Resultados del diagnóstico | Rumbo IPN"
          descripcion="Resultados de tu diagnóstico del examen de admisión al IPN."
          ruta="/resultados"
          noIndexar
        />
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="text-3xl">Todavía no hay un resultado</h1>
          <p className="mt-4 text-tinta-media">
            No encontramos respuestas guardadas en este navegador. Haz el diagnóstico y aquí verás tu
            desglose por área.
          </p>
          <div className="mt-8 flex justify-center">
            <BotonRuta to="/diagnostico" medida="lg">
              Hacer el diagnóstico
            </BotonRuta>
          </div>
        </div>
      </>
    );
  }

  const { resultado, interpretacion, rama } = datos;
  const nombreRama = rama?.nombreCorto ?? 'tu rama';

  return (
    <>
      <Meta
        titulo={`Tu resultado: ${resultado.porcentaje}% | Diagnóstico IPN`}
        descripcion="Resultados de tu diagnóstico del examen de admisión al IPN, desglosados por área."
        ruta="/resultados"
        noIndexar
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        {/* 1 y 2: interpretación primero, cifra después. */}
        <header>
          <p className="eyebrow text-azul-texto">Tu diagnóstico · {nombreRama}</p>
          <h1 className="mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl">
            {interpretacion.titular}
          </h1>

          <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-6 border-y border-regla py-7">
            <div>
              <p className="eyebrow text-tinta-suave">Aciertos</p>
              <p className="mt-1 font-display text-6xl leading-none font-semibold tracking-tight">
                {resultado.porcentaje}
                <span className="text-3xl text-tinta-suave">%</span>
              </p>
              <p className="mt-2 text-sm text-tinta-media">
                {resultado.correctas} de {resultado.total} preguntas
              </p>
            </div>
            <div className="border-l border-regla pl-6">
              <p className="eyebrow text-tinta-suave">Tramo</p>
              <p className="mt-1.5 font-sans text-xl font-semibold">{interpretacion.tramo}</p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-tinta-media">
            {interpretacion.cuerpo}
          </p>
        </header>

        {/* 3: desglose comparable. */}
        <div className="mt-14">
          <DesgloseAreas porArea={resultado.porArea} />
        </div>

        {/* 4: fortalezas y mejoras, nombradas. */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <section className="border border-regla bg-papel-alto p-6">
            <h2 className="flex items-center gap-2 font-sans text-base font-semibold tracking-normal text-solido">
              <TrendingUp aria-hidden="true" className="size-5" />
              Tus fortalezas
            </h2>
            {resultado.fortalezas.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-3">
                {resultado.fortalezas.map((a) => (
                  <li key={a.areaId} className="text-sm leading-relaxed">
                    <span className="font-semibold">{a.nombre}</span>{' '}
                    <span className="text-tinta-suave">· {a.porcentaje}%</span>
                    <p className="mt-0.5 text-tinta-media">
                      Aquí no necesitas reconstruir, solo mantener el ritmo.
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-tinta-media">
                Todavía no hay un área por encima del 75 %. No es un mal punto de partida: significa
                que el trabajo por hacer está repartido y no concentrado en un solo hueco difícil.
              </p>
            )}
          </section>

          <section className="border border-regla bg-papel-alto p-6">
            <h2 className="flex items-center gap-2 font-sans text-base font-semibold tracking-normal text-lapiz">
              <Target aria-hidden="true" className="size-5" />
              Dónde enfocarte primero
            </h2>
            {resultado.mejoras.length > 0 ? (
              <ol className="mt-4 flex flex-col gap-3">
                {resultado.mejoras.slice(0, 4).map((a, i) => (
                  <li key={a.areaId} className="flex gap-3 text-sm leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-px flex size-5 shrink-0 items-center justify-center bg-lapiz text-[0.7rem] font-bold text-white"
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-semibold">{a.nombre}</span>{' '}
                      <span className="text-tinta-suave">· {a.porcentaje}%</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-tinta-media">
                Todas las áreas quedaron en nivel sólido. El siguiente reto ya no es el contenido,
                sino resolver bajo presión de tiempo.
              </p>
            )}
          </section>
        </div>

        {/* 5: la acción, al final del recorrido. */}
        <div className="mt-14">
          <CursoRecomendado resultado={resultado} nombreRama={nombreRama} />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/diagnostico"
            onClick={borrarGuardado}
            className="inline-flex items-center gap-2 text-sm font-medium text-tinta-media hover:text-azul-texto"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Volver a hacer el diagnóstico
          </Link>
          <Link to="/examen-ipn" className="text-sm font-medium text-tinta-media hover:text-azul-texto">
            Cómo es el examen real
          </Link>
        </div>

        <p className="mt-10 border-t border-regla pt-5 text-xs leading-relaxed text-tinta-suave">
          {LEGAL.diagnostico}
        </p>
      </div>
    </>
  );
}
