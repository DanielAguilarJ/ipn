/**
 * Logotipo de Rumbo IPN.
 *
 * El símbolo son dos trazos que forman una cuña ascendente: la idea de «rumbo»
 * y de avance. Es geométrico y plano a propósito, sin degradados ni brillos.
 */

interface MarcaProps {
  /** Alto en píxeles del símbolo. El texto escala con él. */
  readonly alto?: number;
  /** Si es falso, solo se dibuja el símbolo. */
  readonly conTexto?: boolean;
  /** Para usar sobre el bloque azul profundo. */
  readonly invertido?: boolean;
}

export function Marca({ alto = 28, conTexto = true, invertido = false }: MarcaProps) {
  const tinta = invertido ? 'var(--color-papel)' : 'var(--color-tinta)';
  // El símbolo puede usar el azul de marca; la palabra es texto y usa el tono
  // oscurecido, que sí cumple contraste sobre el papel hondo del pie de página.
  const azulSimbolo = invertido ? 'var(--color-papel)' : 'var(--color-azul)';
  const azulTexto = invertido ? 'var(--color-papel)' : 'var(--color-azul-texto)';

  return (
    <span className="inline-flex items-center gap-2.5" aria-hidden="true">
      <svg
        width={alto}
        height={alto}
        viewBox="0 0 32 32"
        fill="none"
        role="presentation"
        className="shrink-0"
      >
        <path d="M4 24 L14 8 L20 18" stroke={azulSimbolo} strokeWidth="4" strokeLinecap="square" />
        <path d="M20 18 L24 11 L29 20" stroke={tinta} strokeWidth="4" strokeLinecap="square" />
      </svg>
      {conTexto && (
        <span
          className="font-sans leading-none font-semibold tracking-tight"
          style={{ fontSize: alto * 0.62, color: tinta }}
        >
          Rumbo<span style={{ color: azulTexto }}>IPN</span>
        </span>
      )}
    </span>
  );
}
