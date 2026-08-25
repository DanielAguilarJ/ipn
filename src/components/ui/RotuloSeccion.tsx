/**
 * Rótulo numerado de sección.
 *
 * Convención tomada del sitio de WorldBrain México, que numera sus secciones con
 * la forma «04 — ELIGE TU RITMO». Adoptarla aquí hace que este sitio se lea como
 * parte de la misma casa sin copiar ni un activo ni una línea de su código.
 *
 * El número es decorativo: la jerarquía real la da el encabezado que lo sigue, así
 * que se oculta a los lectores de pantalla para no leer cifras sin sentido.
 */

interface Props {
  /** Orden de la sección. Se muestra con dos dígitos. */
  readonly numero: number;
  readonly texto: string;
}

export function RotuloSeccion({ numero, texto }: Props) {
  return (
    <p className="eyebrow flex items-center gap-2 text-tinta-suave">
      <span aria-hidden="true" className="text-numeral">
        {String(numero).padStart(2, '0')} —
      </span>
      <span>{texto}</span>
    </p>
  );
}
