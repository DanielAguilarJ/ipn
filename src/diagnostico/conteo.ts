/**
 * Cuántas preguntas ve cada persona en su diagnóstico.
 *
 * La portada anuncia este número en público, y antes lo calculaba importando el
 * banco completo. Eso arrastraba las 40 preguntas con sus explicaciones al paquete
 * inicial del sitio, así que quien solo leía la portada descargaba todo el examen
 * sin abrirlo nunca.
 *
 * Aquí se publica el número y `conteo.test.ts` comprueba contra el banco vivo que
 * siga siendo cierto en las TRES ramas. Si alguien añade o quita preguntas, la
 * prueba falla y dice qué cifra poner: la garantía de honestidad se mantiene, pero
 * se paga en la compilación y no en el navegador de cada visitante.
 *
 * `exacta` distingue dos casos: si todas las ramas tienen el mismo número se dice
 * la cifra tal cual; si una tuviera menos, la interfaz escribe «Desde N», que es
 * cierto para cualquiera.
 */
export const PREGUNTAS_POR_PERSONA = {
  /** Mínimo entre las tres ramas. Medido en ejecución, no estimado. */
  cifra: 38,
  /** Verdadero cuando las tres ramas coinciden en ese número. */
  exacta: true,
} as const;
