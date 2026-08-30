/**
 * Página del examen diagnóstico.
 *
 * Dos estados: elegir rama y responder. Al terminar se navega a resultados, que
 * lee las respuestas del almacenamiento de sesión; así una recarga accidental no
 * pierde el trabajo ni el resultado.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCheck } from 'lucide-react';
import { Boton } from '@/components/ui/Boton';
import { BarraProgreso } from '@/components/examen/BarraProgreso';
import { ElegirRama } from '@/components/examen/ElegirRama';
import { IndicePreguntas } from '@/components/examen/IndicePreguntas';
import { TarjetaPregunta } from '@/components/examen/TarjetaPregunta';
import { Meta } from '@/lib/Meta';
import { PREGUNTAS_POR_PERSONA } from '@/diagnostico/conteo';
import { grafo, nodoMigas, nodoPagina } from '@/lib/esquemas';
import { AREAS, areaPorId } from '@/diagnostico/areas';
import { BANCO } from '@/diagnostico/banco';
import { preguntasDeRama } from '@/diagnostico/puntuacion';
import { borrarGuardado, leerGuardado, useExamen } from '@/diagnostico/useExamen';
import type { RamaId } from '@/diagnostico/tipos';

/** Cuántas preguntas le toca a cada rama, para mostrarlo antes de empezar. */
function totalesPorRama(): Readonly<Record<RamaId, number>> {
  return {
    ingenieria: preguntasDeRama(BANCO, 'ingenieria').length,
    'medico-biologicas': preguntasDeRama(BANCO, 'medico-biologicas').length,
    'sociales-administrativas': preguntasDeRama(BANCO, 'sociales-administrativas').length,
  };
}

export function Diagnostico() {
  const guardado = useMemo(() => leerGuardado(), []);
  const [rama, setRama] = useState<RamaId | null>(guardado?.rama ?? null);

  return (
    <>
      <Meta
        titulo="Examen diagnóstico IPN 2026 gratis: mide tu nivel por área"
        descripcion={`Examen diagnóstico gratuito del IPN: ${PREGUNTAS_POR_PERSONA.cifra} preguntas por área del temario, sin registro y con resultado inmediato. Diagnóstico independiente, no oficial.`}
        ruta="/diagnostico-ipn"
        datosEstructurados={grafo(
          nodoPagina({
            nombre: 'Examen diagnóstico gratuito para el IPN',
            descripcion:
              'Diagnóstico de práctica por área del temario público del IPN. No contiene reactivos del examen real, no pide registro y su resultado no predice la admisión.',
            ruta: '/diagnostico-ipn',
          }),
          nodoMigas('Diagnóstico gratuito', '/diagnostico-ipn'),
        )}
      />
      {rama === null ? (
        <ElegirRama
          totalPorRama={totalesPorRama()}
          onEmpezar={(elegida) => {
            borrarGuardado();
            setRama(elegida);
          }}
        />
      ) : (
        <Examen rama={rama} respuestasIniciales={guardado?.respuestas} indiceInicial={guardado?.indice} />
      )}
    </>
  );
}

interface ExamenProps {
  readonly rama: RamaId;
  readonly respuestasIniciales?: Record<string, never> | Readonly<Record<string, 'a' | 'b' | 'c' | 'd'>>;
  readonly indiceInicial?: number;
}

function Examen({ rama, respuestasIniciales, indiceInicial }: ExamenProps) {
  const navegar = useNavigate();
  const preguntas = useMemo(() => preguntasDeRama(BANCO, rama), [rama]);

  const examen = useExamen({
    preguntas,
    rama,
    ...(respuestasIniciales ? { respuestasIniciales } : {}),
    ...(indiceInicial !== undefined ? { indiceInicial } : {}),
  });

  const respondidas = useMemo(
    () =>
      preguntas
        .map((p, i) => (examen.respuestas[p.id] !== undefined ? i + 1 : null))
        .filter((n): n is number => n !== null),
    [preguntas, examen.respuestas],
  );

  const terminar = () => {
    if (examen.intentarTerminar()) {
      navegar('/resultados');
    }
  };

  if (!examen.pregunta) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-tinta-media">No hay preguntas disponibles para esta rama.</p>
      </div>
    );
  }

  const area = areaPorId(examen.pregunta.areaId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <BarraProgreso
        total={examen.totalPreguntas}
        indiceActual={examen.indice}
        respondidas={respondidas}
        contestadas={examen.contestadas}
      />

      <div className="mt-6">
        <TarjetaPregunta
          pregunta={examen.pregunta}
          numero={examen.indice + 1}
          total={examen.totalPreguntas}
          areaNombre={area?.nombre ?? 'Área'}
          elegida={examen.elegida}
          onResponder={examen.responder}
        />
      </div>

      {/* El aviso de validación vive fuera de la tarjeta y se anuncia al leerlo. */}
      <div aria-live="polite" className="mt-4 min-h-6">
        {examen.aviso && (
          <p className="flex items-start gap-2 border-l-4 border-lapiz bg-lapiz-tenue px-4 py-3 text-sm font-medium text-lapiz">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {examen.aviso}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Boton
          jerarquia="secundaria"
          onClick={examen.anterior}
          disabled={examen.indice === 0}
          className="shrink-0"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Atrás
        </Boton>

        {examen.esUltima ? (
          <Boton medida="lg" onClick={terminar} className="ml-auto flex-1 sm:flex-initial">
            <CheckCheck aria-hidden="true" className="size-5" />
            Ver mi resultado
          </Boton>
        ) : (
          <Boton medida="lg" onClick={examen.siguiente} className="ml-auto flex-1 sm:flex-initial">
            Siguiente
            <ArrowRight aria-hidden="true" className="size-5" />
          </Boton>
        )}
      </div>

      <div className="mt-12 border-t border-regla pt-7">
        <IndicePreguntas
          total={examen.totalPreguntas}
          indiceActual={examen.indice}
          respondidas={respondidas}
          onIr={examen.irA}
        />
      </div>

      <p className="mt-8 text-xs text-tinta-suave">
        Este diagnóstico evalúa {AREAS.filter((a) => preguntas.some((p) => p.areaId === a.id)).length}{' '}
        áreas del temario oficial. Tus respuestas se guardan solo en tu navegador; no se envían a
        ningún servidor.
      </p>
    </div>
  );
}
