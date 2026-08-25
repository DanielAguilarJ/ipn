/**
 * Marcador de puntaje: anillo medidor con el porcentaje al centro.
 *
 * Diseño tomado de la investigación en Mobbin (Codecademy, Unity), en
 * docs/mobbin-resultados-a.md: un anillo como ancla visual del resultado, con la
 * cifra grande dentro y el detalle interpretativo en la columna contigua, en vez
 * de un número aislado en una mitad vacía.
 *
 * Es un medidor de tres cuartos (270°), abierto abajo: la forma de «medidor» se
 * lee como puntaje, no como progreso de carga. Azul de marca para el avance, gris
 * cálido para el resto. Sin degradados, sin brillo, sin fondo oscuro.
 *
 * Accesibilidad: el SVG es decorativo (`aria-hidden`) porque la cifra y el nivel
 * ya están en texto real al lado; así el lector de pantalla no lee un arco.
 */

interface Props {
  /** Entero de 0 a 100. */
  readonly porcentaje: number;
  /** Diámetro del anillo en píxeles. */
  readonly tamano?: number;
}

export function MarcadorPuntaje({ porcentaje, tamano = 200 }: Props) {
  const trazo = 15;
  const radio = (tamano - trazo) / 2;
  const centro = tamano / 2;
  const circunferencia = 2 * Math.PI * radio;

  // El medidor abarca 270°: tres cuartos de la circunferencia son visibles.
  const fraccionVisible = 0.75;
  const arco = circunferencia * fraccionVisible;
  const avance = (Math.min(Math.max(porcentaje, 0), 100) / 100) * arco;

  // Se rota para que el hueco de 90° quede centrado abajo.
  const rotacion = 135;

  return (
    <div
      className="relative shrink-0"
      style={{ width: tamano, height: tamano }}
      aria-hidden="true"
    >
      <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`}>
        <circle
          cx={centro}
          cy={centro}
          r={radio}
          fill="none"
          stroke="var(--color-papel-hondo)"
          strokeWidth={trazo}
          strokeLinecap="round"
          strokeDasharray={`${arco} ${circunferencia}`}
          transform={`rotate(${rotacion} ${centro} ${centro})`}
        />
        <circle
          cx={centro}
          cy={centro}
          r={radio}
          fill="none"
          stroke="var(--color-azul)"
          strokeWidth={trazo}
          strokeLinecap="round"
          strokeDasharray={`${avance} ${circunferencia}`}
          transform={`rotate(${rotacion} ${centro} ${centro})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl leading-none font-semibold tracking-tight text-tinta">
          {porcentaje}
          <span className="align-super text-2xl text-tinta-suave">%</span>
        </span>
        <span className="eyebrow mt-1.5 text-tinta-suave">Puntaje global</span>
      </div>
    </div>
  );
}
