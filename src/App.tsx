/**
 * Rutas de la aplicación.
 *
 * Todas comparten el mismo encabezado y pie, así que el aviso de independencia
 * respecto al IPN está presente en cualquier página a la que alguien llegue desde
 * un buscador, no solo en el inicio.
 */

import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Encabezado } from './components/layout/Encabezado';
import { PieDePagina } from './components/layout/PieDePagina';
import { Inicio } from './paginas/Inicio';
import { Diagnostico } from './paginas/Diagnostico';
import { Resultados } from './paginas/Resultados';
import { ExamenIpn } from './paginas/ExamenIpn';
import { Curso } from './paginas/Curso';
import { Fuentes } from './paginas/Fuentes';
import { AvisoLegal } from './paginas/AvisoLegal';
import { NoEncontrada } from './paginas/NoEncontrada';

/** Rutas del sitio. Alimenta también el sitemap generado en la compilación. */
export const RUTAS = [
  '/',
  '/diagnostico',
  '/examen-ipn',
  '/curso',
  '/fuentes',
  '/aviso-legal',
] as const;

/**
 * Al cambiar de página, devuelve el foco al inicio del contenido.
 * Sin esto, quien navega con teclado o lector de pantalla se queda en el pie de
 * la página anterior y parece que nada ocurrió.
 */
function AlCambiarDePagina() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const principal = document.getElementById('contenido');
    principal?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <AlCambiarDePagina />
      <a
        href="#contenido"
        className="solo-lectores focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-azul focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Encabezado />
      <main id="contenido" tabIndex={-1} className="min-h-[60vh] outline-none">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/diagnostico" element={<Diagnostico />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/examen-ipn" element={<ExamenIpn />} />
          <Route path="/curso" element={<Curso />} />
          <Route path="/fuentes" element={<Fuentes />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <PieDePagina />
    </BrowserRouter>
  );
}
