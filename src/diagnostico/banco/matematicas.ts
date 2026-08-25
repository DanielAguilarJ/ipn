import type { Pregunta } from '../tipos';

export const PREGUNTAS_MATEMATICAS: readonly Pregunta[] = [
  {
    id: 'mat-01',
    areaId: 'matematicas',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'Una camioneta consume 7 litros de gasolina para recorrer 84 km. Si mantiene el mismo rendimiento, ¿cuántos litros necesita para recorrer 132 km?',
    opciones: [
      { id: 'a', texto: '10 litros' },
      { id: 'b', texto: '11 litros' },
      { id: 'c', texto: '12 litros' },
      { id: 'd', texto: '14 litros' },
    ],
    correcta: 'b',
    explicacion:
      'El rendimiento es 84/7 = 12 km por litro. Por tanto, para recorrer 132 km se necesitan 132/12 = 11 litros; elegir 12 confunde el rendimiento con la cantidad de gasolina.',
    dificultad: 1,
  },
  {
    id: 'mat-02',
    areaId: 'matematicas',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'En un laboratorio se compraron 18 sensores: cada sensor básico costó $140 y cada sensor de precisión, $260. Si se pagaron $3,240 en total, ¿cuántos sensores de precisión se compraron?',
    opciones: [
      { id: 'a', texto: '4 sensores' },
      { id: 'b', texto: '6 sensores' },
      { id: 'c', texto: '8 sensores' },
      { id: 'd', texto: '12 sensores' },
    ],
    correcta: 'b',
    explicacion:
      'Si p es el número de sensores de precisión, entonces 140(18 - p) + 260p = 3,240. Al simplificar se obtiene 2,520 + 120p = 3,240, así que p = 6; los otros 12 sensores son básicos.',
    dificultad: 2,
  },
  {
    id: 'mat-03',
    areaId: 'matematicas',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'Para 0 ≤ t ≤ 4, la altura de un objeto está dada por h(t) = -5t^2 + 20t + 1, donde t se mide en segundos y h en metros. ¿Cuál es la altura máxima del objeto?',
    opciones: [
      { id: 'a', texto: '2 metros' },
      { id: 'b', texto: '20 metros' },
      { id: 'c', texto: '21 metros' },
      { id: 'd', texto: '41 metros' },
    ],
    correcta: 'c',
    explicacion:
      'El máximo de la parábola ocurre en t = -20/(2(-5)) = 2. Al sustituir, h(2) = -20 + 40 + 1 = 21 metros; el valor 2 corresponde al tiempo, no a la altura.',
    dificultad: 2,
  },
  {
    id: 'mat-04',
    areaId: 'matematicas',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'Una escalera recta de 8 m se apoya en una pared vertical y forma un ángulo de 60° con el piso horizontal. ¿A qué altura de la pared llega?',
    opciones: [
      { id: 'a', texto: '4 m' },
      { id: 'b', texto: '4√3 m' },
      { id: 'c', texto: '8√3 m' },
      { id: 'd', texto: '8 m' },
    ],
    correcta: 'b',
    explicacion:
      'La escalera es la hipotenusa y la altura es el cateto opuesto al ángulo, por lo que h = 8 sen(60°) = 8(√3/2) = 4√3 m. Usar el coseno daría 4 m, que es la distancia horizontal a la pared.',
    dificultad: 1,
  },
  {
    id: 'mat-05',
    areaId: 'matematicas',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: 'Una recta pasa por los puntos (-2, 3) y (4, -9). ¿Cuál es su ecuación?',
    opciones: [
      { id: 'a', texto: 'y = -2x - 1' },
      { id: 'b', texto: 'y = -2x + 1' },
      { id: 'c', texto: 'y = 2x + 7' },
      { id: 'd', texto: 'y = -(1/2)x + 2' },
    ],
    correcta: 'a',
    explicacion:
      'La pendiente es m = (-9 - 3)/(4 - (-2)) = -12/6 = -2. Al usar el punto (-2, 3), se obtiene 3 = -2(-2) + b y por tanto b = -1, así que la ecuación es y = -2x - 1.',
    dificultad: 2,
  },
  {
    id: 'mat-06',
    areaId: 'matematicas',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'Una caja contiene 5 fichas azules, 3 amarillas y 2 verdes. Se extraen dos fichas al azar, una tras otra y sin reemplazo. ¿Cuál es la probabilidad de que ambas sean amarillas?',
    opciones: [
      { id: 'a', texto: '9/100' },
      { id: 'b', texto: '1/15' },
      { id: 'c', texto: '2/15' },
      { id: 'd', texto: '3/10' },
    ],
    correcta: 'b',
    explicacion:
      'La probabilidad de sacar primero una ficha amarilla es 3/10 y después queda una probabilidad de 2/9. El producto es (3/10)(2/9) = 6/90 = 1/15; obtener 9/100 supone erróneamente que la primera ficha se reemplaza.',
    dificultad: 3,
  },
];
