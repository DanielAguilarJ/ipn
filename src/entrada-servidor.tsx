/**
 * Punto de entrada para el prerenderizado.
 *
 * Necesario porque una aplicación de una sola página entrega a los buscadores un
 * HTML vacío: el contenido aparece cuando el JavaScript ya corrió, y no conviene
 * apostar a que el rastreador lo ejecute. Aquí se genera el HTML real de cada
 * ruta durante la compilación.
 */

import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Encabezado } from './components/layout/Encabezado';
import { PieDePagina } from './components/layout/PieDePagina';
import { Inicio } from './paginas/Inicio';
import { Diagnostico } from './paginas/Diagnostico';
import { ExamenIpn } from './paginas/ExamenIpn';
import { Curso } from './paginas/Curso';
import { Fuentes } from './paginas/Fuentes';
import { AvisoLegal } from './paginas/AvisoLegal';
import { NoEncontrada } from './paginas/NoEncontrada';

/** Qué componente corresponde a cada ruta prerenderizada. */
const PAGINAS: Readonly<Record<string, () => React.ReactElement>> = {
  '/': Inicio,
  '/diagnostico-ipn': Diagnostico,
  '/examen-ipn': ExamenIpn,
  '/curso-ipn': Curso,
  '/fuentes': Fuentes,
  '/aviso-legal': AvisoLegal,
};

export function render(ruta: string): string {
  const Pagina = PAGINAS[ruta] ?? NoEncontrada;

  return renderToString(
    <StrictMode>
      <StaticRouter location={ruta}>
        <Encabezado />
        <main id="contenido" tabIndex={-1} className="min-h-[60vh] outline-none">
          <Pagina />
        </main>
        <PieDePagina />
      </StaticRouter>
    </StrictMode>,
  );
}

export const RUTAS_PRERENDERIZADAS = Object.keys(PAGINAS);
