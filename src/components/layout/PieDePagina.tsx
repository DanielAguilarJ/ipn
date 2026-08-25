/**
 * Pie de página.
 *
 * Además de navegación, cumple dos funciones que no son decorativas: repetir el
 * aviso de independencia completo y enlazar las fuentes oficiales del IPN para
 * que cualquiera pueda verificar los datos por su cuenta.
 */

import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Marca } from '@/components/ui/Marca';
import { BRAND, LINKS, WHATSAPP, whatsappUrl } from '@/config/site';
import { BloqueIndependencia } from './AvisoIndependencia';

const FUENTES: ReadonlyArray<{ readonly href: string; readonly texto: string }> = [
  { href: LINKS.ipnOficial.value, texto: 'Portal del IPN' },
  { href: LINKS.ipnAdmision.value, texto: 'Admisión IPN' },
  { href: LINKS.ipnDae.value, texto: 'Administración Escolar (DAE)' },
  { href: LINKS.comipems.value, texto: 'COMIPEMS (nivel medio superior)' },
];

const INTERNOS: ReadonlyArray<{ readonly a: string; readonly texto: string }> = [
  { a: '/diagnostico', texto: 'Diagnóstico gratuito' },
  { a: '/curso', texto: 'El curso' },
  { a: '/examen-ipn', texto: 'Cómo es el examen' },
  { a: '/fuentes', texto: 'Fuentes y fechas de consulta' },
  { a: '/aviso-legal', texto: 'Aviso legal y privacidad' },
];

export function PieDePagina() {
  const anio = 2026;

  return (
    <footer className="mt-seccion border-t border-regla bg-papel-hondo">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <BloqueIndependencia />

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Marca alto={24} />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-tinta-media">
              {BRAND.tagline}. Un programa de {BRAND.org}.
            </p>
          </div>

          <nav aria-label="Secciones del sitio">
            <h2 className="eyebrow text-tinta-suave">Sitio</h2>
            <ul className="mt-3 space-y-2">
              {INTERNOS.map((e) => (
                <li key={e.a}>
                  <Link to={e.a} className="text-sm text-tinta-media hover:text-azul-texto">
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Fuentes oficiales">
            <h2 className="eyebrow text-tinta-suave">Fuentes oficiales</h2>
            <ul className="mt-3 space-y-2">
              {FUENTES.map((f) => (
                <li key={f.href}>
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-tinta-media hover:text-azul-texto"
                  >
                    {f.texto}
                    <ExternalLink aria-hidden="true" className="size-3" />
                    <span className="solo-lectores">(se abre en una pestaña nueva)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-tinta-suave">Contacto</h2>
            <p className="mt-3 text-sm text-tinta-media">
              WhatsApp{' '}
              <a
                href={whatsappUrl('Hola, quiero informes del curso de admisión al IPN.')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-azul-texto hover:underline"
              >
                {WHATSAPP.numeroVisible}
              </a>
            </p>
            <p className="mt-3 text-sm text-tinta-media">
              <a
                href={LINKS.worldbrain.value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-azul-texto"
              >
                Sitio de {BRAND.org}
                <ExternalLink aria-hidden="true" className="size-3" />
              </a>
            </p>
          </div>
        </div>

        <p className="mt-10 border-t border-regla pt-6 text-xs text-tinta-suave">
          © {anio} {BRAND.org}. {BRAND.program} es un material de preparación independiente.
        </p>
      </div>
    </footer>
  );
}
