# Especificación para redactar preguntas del diagnóstico

Lee este archivo completo antes de escribir. Aplica a todos los redactores.

## Contexto

Diagnóstico gratuito original para aspirantes al examen de admisión al IPN
(nivel superior, México). No es el examen real ni lo reproduce.

Datos oficiales verificados: el examen tiene 140 preguntas, 3 horas, y tres
ramas: `ingenieria` (Ingeniería y Ciencias Físico Matemáticas),
`medico-biologicas` (Ciencias Médico Biológicas) y
`sociales-administrativas` (Ciencias Sociales y Administrativas).

## Reglas duras

1. **Originalidad total.** Redacta desde cero. NO copies, adaptes ni parafrasees
   reactivos de la guía del IPN, de cursos privados, de bancos publicados ni de
   ningún examen. Si reconoces una pregunta de algún material, descártala.
2. **Una sola respuesta correcta**, indiscutible. Si dos opciones podrían
   defenderse, reescribe la pregunta.
3. **Verifica tu propia aritmética.** Resuelve cada problema numérico dos veces
   antes de fijar la opción correcta. Un error aquí arruina el diagnóstico.
4. **Distractores realistas**: cada opción incorrecta debe corresponder a un
   error típico de estudiante (signo invertido, olvidar una unidad, confundir
   dos conceptos parecidos), no a un absurdo evidente.
5. **Cuatro opciones exactas**, con ids `'a'`, `'b'`, `'c'`, `'d'`.
6. **Sin LaTeX ni Markdown** dentro de los textos. Matemáticas en texto plano
   con caracteres normales: `x^2`, `3/4`, `√16`, `≤`, `π`. Se leerán tal cual.
7. **Español de México**, acentos escritos literalmente, archivo en utf-8.
   Excepción: los enunciados y opciones del área `ingles` van en inglés.
8. La `explicacion` enseña: dice por qué la correcta lo es y, cuando aporta,
   por qué falla el error más común. Dos o tres frases, lenguaje claro.
9. `dificultad`: `1` accesible, `2` media, `3` exigente. Reparte, no pongas todo
   en 2.
10. Los `id` de pregunta son únicos en todo el proyecto. Usa el prefijo que se te
    indique más un número de dos dígitos, por ejemplo `mat-01`.

## Forma del archivo

Crea el archivo que se te indique con esta estructura exacta:

```ts
import type { Pregunta } from '../tipos';

export const PREGUNTAS_<NOMBRE>: readonly Pregunta[] = [
  {
    id: 'mat-01',
    areaId: 'matematicas',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: 'Texto de la pregunta.',
    opciones: [
      { id: 'a', texto: 'Primera opción' },
      { id: 'b', texto: 'Segunda opción' },
      { id: 'c', texto: 'Tercera opción' },
      { id: 'd', texto: 'Cuarta opción' },
    ],
    correcta: 'b',
    explicacion: 'Por qué la b es correcta y dónde suele fallar quien se equivoca.',
    dificultad: 2,
  },
];
```

El tipo `Pregunta` está definido en `/Users/hermes/Downloads/IPN/src/diagnostico/tipos.ts`.
Campo opcional `contexto`: úsalo solo cuando la pregunta necesite un texto previo
(una lectura, un planteamiento largo, una tabla en texto). Si varias preguntas
comparten la misma lectura, repite el `contexto` en cada una.

## Al terminar

Ejecuta esta comprobación y arregla lo que marque:

```
cd /Users/hermes/Downloads/IPN && npx tsc --noEmit 2>&1 | head -20
```

Puede reportar errores de OTROS archivos del proyecto: ignóralos, corrige solo
los de tu archivo. Verifica también que no quedó mojibake:

```
grep -c 'Ã\|Â' <tu-archivo>
```

Debe devolver `0`.

Responde con: cuántas preguntas escribiste, su reparto por dificultad, y la
confirmación de que revisaste dos veces cada cálculo.
