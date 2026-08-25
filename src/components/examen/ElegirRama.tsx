/**
 * Elección de rama, antes de empezar el examen.
 *
 * Es un paso atómico con una sola decisión, el patrón de onboarding que
 * documentamos: una pantalla, una pregunta, una confirmación.
 *
 * Aquí se dice, sin adornos, qué mide el diagnóstico y qué no. El IPN no publica
 * cuántas preguntas del examen real corresponden a cada materia, y callarlo
 * sería vender una precisión que no existe.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Boton } from '@/components/ui/Boton';
import { RAMAS } from '@/datos/examenOficial';
import { LEGAL } from '@/config/site';
import type { RamaId } from '@/diagnostico/tipos';

interface Props {
  readonly totalPorRama: Readonly<Record<RamaId, number>>;
  readonly onEmpezar: (rama: RamaId) => void;
}

export function ElegirRama({ totalPorRama, onEmpezar }: Props) {
  const [elegida, setElegida] = useState<RamaId | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="eyebrow text-azul-texto">Diagnóstico gratuito</p>
      <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">
        Antes de empezar, elige tu rama
      </h1>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-tinta-media">
        En el examen del IPN eliges una rama y las dos carreras que solicites deben pertenecer a
        ella. Tu diagnóstico cambia según esa elección, porque el temario oficial de Física es
        distinto en cada rama. Si dudas de cuál te toca, mira{' '}
        <Link to="/examen-ipn" className="font-medium text-azul-texto hover:underline">
          qué carreras entran en cada rama y qué materias evalúa
        </Link>
        .
      </p>

      <fieldset className="mt-9">
        <legend className="eyebrow text-tinta-suave">Rama del conocimiento</legend>
        <div className="mt-3 flex flex-col gap-2.5">
          {RAMAS.map((rama) => {
            const activa = elegida === rama.id;
            return (
              <label
                key={rama.id}
                className={[
                  'flex cursor-pointer items-start gap-4 border p-5 transition-colors',
                  'has-focus-visible:outline has-focus-visible:outline-3 has-focus-visible:outline-azul has-focus-visible:outline-offset-2',
                  activa
                    ? 'border-azul bg-azul-tenue'
                    : 'border-regla bg-papel-alto hover:border-regla-fuerte',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="rama"
                  value={rama.id}
                  checked={activa}
                  onChange={() => setElegida(rama.id)}
                  className="solo-lectores"
                />
                <span
                  aria-hidden="true"
                  className={[
                    'mt-0.5 size-5 shrink-0 rounded-full border-2',
                    activa ? 'border-azul bg-azul ring-2 ring-inset ring-papel-alto' : 'border-regla-fuerte',
                  ].join(' ')}
                />
                <span className="flex-1">
                  <span className="block font-sans text-base font-semibold">{rama.nombre}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-tinta-media">
                    {rama.ejemplos}
                  </span>
                  <span className="mt-2 block text-xs text-tinta-suave">
                    {totalPorRama[rama.id]} preguntas en tu diagnóstico
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 border border-regla bg-papel-alto p-5">
        <h2 className="eyebrow text-tinta-suave">Qué mide y qué no</h2>
        <ul className="mt-3 flex flex-col gap-2.5 text-sm leading-relaxed text-tinta-media">
          <li className="flex gap-2.5">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-azul" />
            Mide tu punto de partida en cada área del temario oficial, para saber por dónde empezar
            a estudiar.
          </li>
          <li className="flex gap-2.5">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-azul" />
            Reparte las preguntas de forma parecida entre áreas. No imita la proporción del examen
            real porque el IPN no publica cuántas preguntas corresponden a cada materia.
          </li>
          <li className="flex gap-2.5">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-lapiz" />
            No es el examen real, no contiene sus preguntas y su resultado no predice tu admisión.
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <Boton
          medida="lg"
          disabled={elegida === null}
          onClick={() => elegida && onEmpezar(elegida)}
        >
          Empezar el diagnóstico
          <ArrowRight aria-hidden="true" className="size-5" />
        </Boton>
        {elegida === null && (
          <p className="mt-3 text-sm text-tinta-suave">Elige una rama para continuar.</p>
        )}
      </div>

      <p className="mt-10 border-t border-regla pt-5 text-xs leading-relaxed text-tinta-suave">
        {LEGAL.diagnostico}
      </p>
    </div>
  );
}
