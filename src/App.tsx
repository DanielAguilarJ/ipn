/**
 * Rutas de la aplicación.
 *
 * Todas comparten el mismo encabezado y pie, así que el aviso de independencia
 * respecto al IPN está presente en cualquier página a la que alguien llegue desde
 * un buscador, no solo en el inicio.
 */

import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Encabezado } from './components/layout/Encabezado';
import { PieDePagina } from './components/layout/PieDePagina';
import { Inicio } from './paginas/Inicio';
import { ExamenIpn } from './paginas/ExamenIpn';
import { Curso } from './paginas/Curso';
import { Fuentes } from './paginas/Fuentes';
import { AvisoLegal } from './paginas/AvisoLegal';
import { NoEncontrada } from './paginas/NoEncontrada';

/**
 * El diagnóstico y sus resultados se cargan aparte.
 *
 * Son las dos únicas pantallas que necesitan el banco de preguntas, y ese banco
 * pesa 52 kB de código fuente. Importándolas como el resto, todo el examen viajaba
 * en el paquete inicial: quien entraba a leer «cómo es el examen» descargaba las 40
 * preguntas con sus explicaciones sin abrir el diagnóstico nunca.
 *
 * No afecta a lo que reciben los buscadores. El prerenderizado usa
 * `entrada-servidor.tsx`, que sigue importando las páginas de forma directa, así
 * que el HTML de las siete rutas se genera igual. En el navegador, React conserva
 * ese HTML mientras el módulo llega, de modo que no hay parpadeo ni salto de
 * maquetación al hidratar.
 */
const Diagnostico = lazy(() =>
  import('./paginas/Diagnostico').then((m) => ({ default: m.Diagnostico })),
);
const Resultados = lazy(() =>
  import('./paginas/Resultados').then((m) => ({ default: m.Resultados })),
);

/** Rutas del sitio. Alimenta también el sitemap generado en la compilación. */
export const RUTAS = [
  '/',
  '/diagnostico-ipn',
  '/examen-ipn',
  '/curso-ipn',
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
        {/*
          El respaldo va vacío a propósito: `main` ya reserva el 60 % del alto, así
          que no aparece ni desaparece nada que mueva la página. Al hidratar una
          ruta prerenderizada, React mantiene el HTML del servidor hasta que el
          módulo llega, y este respaldo no se llega a ver.
        */}
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/diagnostico-ipn" element={<Diagnostico />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/examen-ipn" element={<ExamenIpn />} />
            <Route path="/curso-ipn" element={<Curso />} />
            <Route path="/fuentes" element={<Fuentes />} />
            <Route path="/aviso-legal" element={<AvisoLegal />} />
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </Suspense>
      </main>
      <PieDePagina />
    </BrowserRouter>
  );
}
