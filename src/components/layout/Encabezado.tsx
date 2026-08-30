/**
 * Encabezado del sitio.
 *
 * En móvil no cabe todo: a 390 px la fila de enlaces se partía en tres líneas y
 * el botón de WhatsApp quedaba cortado. Se comprobó en pantalla, no en las
 * pruebas. La solución es dejar visibles solo los dos destinos que importan en un
 * teléfono y mover el resto al pie, que está a un desplazamiento de distancia.
 *
 * El botón se oculta envolviéndolo en un contenedor, no con `hidden` en su propia
 * clase: `hidden` competía con el `inline-flex` de la base del botón y perdía,
 * porque el orden en el atributo class no decide, lo decide la hoja de estilos.
 */

import { NavLink, Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Marca } from '@/components/ui/Marca';
import { BotonExterno } from '@/components/ui/Boton';
import { whatsappUrl } from '@/config/site';
import { FranjaIndependencia } from './AvisoIndependencia';

interface Enlace {
  readonly a: string;
  readonly texto: string;
}

/**
 * Los tres enlaces se muestran en todas las anchuras.
 *
 * Antes «El curso» se ocultaba bajo el punto de corte `sm`, así que en un teléfono
 * la única vía hacia la página que vende estaba en el pie. Google la descubría igual
 * —el enlace seguía en el HTML—, pero un estudiante con el móvil tenía que buscarla,
 * y el móvil es de donde vendrá la mayor parte del tráfico.
 *
 * La solución no fue quitar el ocultamiento y confiar: fue medir en un visor real de
 * 360 px con emulación de móvil, comprobar que los nombres largos desbordaban la
 * navegación por 19 px, y acortar las dos etiquetas hasta que cupieran. «Examen» y
 * «Curso» siguen describiendo el destino, que es lo que necesitan Google y quien usa
 * un lector de pantalla.
 */
/**
 * Los tres enlaces se muestran en todas las anchuras, con UNA sola etiqueta cada uno.
 *
 * Antes «El curso» se ocultaba bajo el punto de corte `sm`, así que en un teléfono
 * —de donde llega la mayoría— el enlace a la página que vende el curso no existía.
 * El primer arreglo renderizaba dos textos, uno corto y uno largo, ocultando el que
 * no tocaba con CSS. Funcionaba a la vista y dejaba un rastro: los dos textos viven
 * en el HTML, así que cualquier lector que no aplique CSS veía el enlace como
 * «CursoEl curso» y «ExamenEl examen». Doce enlaces del sitio anunciaban su destino
 * con una palabra pegada.
 *
 * Un lector de pantalla no se veía afectado (`display: none` sale del árbol de
 * accesibilidad) y Google renderiza CSS, pero los rastreadores que solo leen el HTML
 * —incluidos los de los asistentes— sí. Se resuelve con una etiqueta única, que es
 * además más simple: la medición del ciclo 17 ya demostró que las cortas caben (204 px
 * pedidos y 204 disponibles), así que no hace falta la versión larga para nada.
 *
 * El texto descriptivo que de verdad describe cada destino vive en los enlaces dentro
 * del contenido («qué carreras entran en cada rama y qué materias evalúa»), no en una
 * barra de navegación que debe caber en un teléfono.
 */
const ENLACES: readonly Enlace[] = [
  { a: '/diagnostico-ipn', texto: 'Diagnóstico' },
  { a: '/examen-ipn', texto: 'Examen' },
  { a: '/curso-ipn', texto: 'Curso' },
];

const MENSAJE_ENCABEZADO =
  'Hola, vengo de admisionipn.com y quiero informes del curso de admisión al IPN.';

export function Encabezado() {
  return (
    <>
      <FranjaIndependencia />
      <header className="sticky top-0 z-40 border-b border-regla bg-papel/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4">
          <Link
            to="/"
            className="shrink-0 rounded-sm"
            aria-label="Rumbo IPN, ir al inicio"
          >
            <Marca alto={24} />
          </Link>

          <nav aria-label="Navegación principal" className="ml-auto min-w-0">
            <ul className="flex items-center gap-0.5 sm:gap-2">
              {ENLACES.map((e) => (
                <li key={e.a}>
                  <NavLink
                    to={e.a}
                    className={({ isActive }) =>
                      [
                        // min-h-11 son 44 px: medido en móvil, estos enlaces daban 35
                        // de alto. Pasan el mínimo de WCAG 2.2 AA (24 px) pero quedan
                        // cortos para un dedo, y son los controles más usados del sitio.
                        // Los enlaces dentro de párrafos NO se tocan: están exentos y
                        // agrandarlos rompería el flujo del texto.
                        'flex min-h-11 items-center rounded-md px-2 text-[0.8rem] font-medium whitespace-nowrap sm:px-2.5 sm:text-sm',
                        isActive
                          ? 'text-azul-texto underline decoration-2 underline-offset-4'
                          : 'text-tinta-media hover:text-tinta',
                      ].join(' ')
                    }
                  >
                    {e.texto}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contenedor propio: así el ocultado no depende del orden de clases. */}
          <div className="hidden shrink-0 sm:block">
            <BotonExterno href={whatsappUrl(MENSAJE_ENCABEZADO)} jerarquia="whatsapp" medida="md">
              <MessageCircle aria-hidden="true" className="size-4" />
              Informes
            </BotonExterno>
          </div>
        </div>
      </header>
    </>
  );
}
