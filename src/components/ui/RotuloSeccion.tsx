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
  /**
   * Verdadero cuando el rótulo va sobre el bloque azul oscuro.
   *
   * Es una VARIANTE del componente, no una clase pasada desde fuera: sobrescribir el
   * color por `className` no es fiable, porque no gana la clase escrita al final sino
   * la que Tailwind coloque después en la hoja de estilos.
   *
   * Existe porque medí el contraste en el navegador y este rótulo daba 2.61 sobre el
   * azul oscuro —`tinta-suave` es un gris pensado para papel claro—, por debajo del
   * 4.5 que exige WCAG AA para texto normal.
   */
  readonly sobreOscuro?: boolean;
}

export function RotuloSeccion({ numero, texto, sobreOscuro }: Props) {
  return (
    <p className={`eyebrow flex items-center gap-2 ${sobreOscuro ? 'text-papel/85' : 'text-tinta-suave'}`}>
      <span aria-hidden="true" className={sobreOscuro ? 'text-papel/55' : 'text-numeral'}>
        {String(numero).padStart(2, '0')} —
      </span>
      <span>{texto}</span>
    </p>
  );
}
