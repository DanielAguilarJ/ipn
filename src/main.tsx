import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/theme.css';

/**
 * Arranque de la aplicación.
 *
 * Se usa `createRoot` y NO `hydrateRoot`, aunque el HTML llegue prerenderizado.
 * Es una decisión, no un descuido: el diagnóstico lee el avance guardado en el
 * navegador durante su primer render, algo que en el servidor no existe. Hidratar
 * produciría una discrepancia entre los dos árboles y React avisaría en consola.
 *
 * Lo que se gana con el prerenderizado —que los buscadores reciban texto real— se
 * conserva igual, porque eso depende del HTML servido, no de cómo lo tome React.
 * El costo es un render extra al cargar, imperceptible en una página de este
 * tamaño.
 */

const contenedor = document.getElementById('root');
if (!contenedor) {
  throw new Error('No se encontró el elemento #root en index.html');
}

createRoot(contenedor).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
