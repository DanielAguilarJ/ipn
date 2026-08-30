/**
 * Página no encontrada.
 *
 * Ofrece salidas útiles en lugar de un callejón sin salida.
 */

import { BotonRuta } from '@/components/ui/Boton';
import { Meta } from '@/lib/Meta';

export function NoEncontrada() {
  return (
    <>
      <Meta
        titulo="Página no encontrada | Admisión IPN"
        descripcion="La página que buscas no existe."
        ruta="/404"
        noIndexar
        sinCanonical
      />

      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p aria-hidden="true" className="font-display text-6xl font-semibold text-numeral">
          404
        </p>
        <h1 className="mt-4 text-3xl">Esta página no existe</h1>
        <p className="mt-4 leading-relaxed text-tinta-media">
          Quizá el enlace cambió. Estas son las páginas que sí existen y probablemente buscabas.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <BotonRuta to="/diagnostico-ipn" medida="lg">
            Hacer el diagnóstico
          </BotonRuta>
          <BotonRuta to="/" jerarquia="secundaria" medida="lg">
            Ir al inicio
          </BotonRuta>
        </div>
      </div>
    </>
  );
}
