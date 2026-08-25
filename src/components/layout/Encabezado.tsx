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
  /** Si es falso, se oculta en pantallas estrechas. */
  readonly enMovil: boolean;
}

const ENLACES: readonly Enlace[] = [
  { a: '/diagnostico', texto: 'Diagnóstico', enMovil: true },
  { a: '/examen-ipn', texto: 'El examen', enMovil: true },
  { a: '/curso', texto: 'El curso', enMovil: false },
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
                <li key={e.a} className={e.enMovil ? '' : 'hidden sm:block'}>
                  <NavLink
                    to={e.a}
                    className={({ isActive }) =>
                      [
                        'block rounded-md px-2 py-2 text-[0.8rem] font-medium whitespace-nowrap sm:px-2.5 sm:text-sm',
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
