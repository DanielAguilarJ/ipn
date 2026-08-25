import type { Pregunta } from '../tipos';

const TODAS_LAS_RAMAS = [
  'ingenieria',
  'medico-biologicas',
  'sociales-administrativas',
] as const;

export const PREGUNTAS_CIENCIAS: readonly Pregunta[] = [
  {
    id: 'fis-01',
    areaId: 'fisica',
    ramas: TODAS_LAS_RAMAS,
    enunciado:
      'Una lámina rectangular mide 25 cm de largo y 40 cm de ancho. ¿Cuál es su área expresada en m^2?',
    opciones: [
      { id: 'a', texto: '0.010 m^2' },
      { id: 'b', texto: '0.10 m^2' },
      { id: 'c', texto: '1.0 m^2' },
      { id: 'd', texto: '1000 m^2' },
    ],
    correcta: 'b',
    explicacion:
      'Las longitudes son 0.25 m y 0.40 m, así que el área es 0.25 m × 0.40 m = 0.10 m^2. Un error común es convertir los centímetros como si el área no involucrara dos dimensiones.',
    dificultad: 1,
  },
  {
    id: 'fis-02',
    areaId: 'fisica',
    ramas: TODAS_LAS_RAMAS,
    enunciado:
      'Una caja de 6 kg recibe una fuerza horizontal de 30 N hacia la derecha, mientras la fricción ejerce 12 N hacia la izquierda. ¿Cuál es la aceleración de la caja?',
    opciones: [
      { id: 'a', texto: '2 m/s^2 hacia la izquierda' },
      { id: 'b', texto: '3 m/s^2 hacia la derecha' },
      { id: 'c', texto: '5 m/s^2 hacia la derecha' },
      { id: 'd', texto: '7 m/s^2 hacia la derecha' },
    ],
    correcta: 'b',
    explicacion:
      'La fuerza neta es 30 N - 12 N = 18 N hacia la derecha; al aplicar a = F/m se obtiene 18 N / 6 kg = 3 m/s^2. Usar 30 N sin restar la fricción conduce erróneamente a 5 m/s^2.',
    dificultad: 2,
  },
  {
    id: 'fis-03',
    areaId: 'fisica',
    ramas: ['ingenieria'],
    enunciado:
      'Una bobina de 200 vueltas experimenta una disminución uniforme del flujo magnético por vuelta, de 3.0 × 10^-4 Wb a 0.5 × 10^-4 Wb, en 0.020 s. ¿Cuál es la magnitud de la fuerza electromotriz inducida promedio?',
    opciones: [
      { id: 'a', texto: '0.0125 V' },
      { id: 'b', texto: '0.050 V' },
      { id: 'c', texto: '2.5 V' },
      { id: 'd', texto: '5.0 V' },
    ],
    correcta: 'c',
    explicacion:
      'La variación del flujo por vuelta es 2.5 × 10^-4 Wb; por la ley de Faraday, la magnitud es 200(2.5 × 10^-4 Wb) / 0.020 s = 2.5 V. La opción 0.0125 V resulta de olvidar multiplicar por las 200 vueltas.',
    dificultad: 3,
  },
  {
    id: 'fis-04',
    areaId: 'fisica',
    ramas: ['medico-biologicas'],
    enunciado:
      'En una prensa hidráulica ideal, el pistón pequeño tiene un área de 5 cm^2 y recibe una fuerza de 80 N. Si el pistón grande tiene un área de 200 cm^2, ¿qué fuerza ejerce?',
    opciones: [
      { id: 'a', texto: '2 N' },
      { id: 'b', texto: '200 N' },
      { id: 'c', texto: '800 N' },
      { id: 'd', texto: '3200 N' },
    ],
    correcta: 'd',
    explicacion:
      'La presión se transmite por igual, por lo que F2 = 80 N × (200 cm^2 / 5 cm^2) = 3200 N. Las unidades de área se cancelan en la razón; invertir esa razón produciría una fuerza menor en vez de amplificarla.',
    dificultad: 2,
  },
  {
    id: 'fis-05',
    areaId: 'fisica',
    ramas: ['sociales-administrativas'],
    enunciado:
      'Se calientan 100 g de agua de 20 °C a 30 °C. Si el calor específico del agua es 4.2 J/(g·°C), ¿cuánto calor absorbe?',
    opciones: [
      { id: 'a', texto: '42 J' },
      { id: 'b', texto: '420 J' },
      { id: 'c', texto: '4200 J' },
      { id: 'd', texto: '12 600 J' },
    ],
    correcta: 'c',
    explicacion:
      'El cambio de temperatura es 10 °C y Q = mcΔT, así que Q = 100 g × 4.2 J/(g·°C) × 10 °C = 4200 J. Sumar las temperaturas en vez de restarlas llevaría al distractor de 12 600 J.',
    dificultad: 1,
  },
  {
    id: 'qui-01',
    areaId: 'quimica',
    ramas: TODAS_LAS_RAMAS,
    enunciado:
      '¿Cuál de los siguientes pares de elementos tiene mayor tendencia a formar un enlace iónico?',
    opciones: [
      { id: 'a', texto: 'Sodio y cloro' },
      { id: 'b', texto: 'Carbono y oxígeno' },
      { id: 'c', texto: 'Nitrógeno e hidrógeno' },
      { id: 'd', texto: 'Cloro y cloro' },
    ],
    correcta: 'a',
    explicacion:
      'El sodio es un metal que tiende a ceder un electrón y el cloro es un no metal que tiende a aceptarlo, por lo que forman iones con cargas opuestas. Los otros pares están formados solo por no metales y suelen compartir electrones en enlaces covalentes.',
    dificultad: 1,
  },
  {
    id: 'qui-02',
    areaId: 'quimica',
    ramas: TODAS_LAS_RAMAS,
    enunciado:
      'Al balancear Fe + O2 → Fe2O3 con los coeficientes enteros positivos más pequeños, ¿qué coeficientes corresponden, en ese orden, a Fe, O2 y Fe2O3?',
    opciones: [
      { id: 'a', texto: '2, 1, 1' },
      { id: 'b', texto: '2, 3, 1' },
      { id: 'c', texto: '4, 2, 2' },
      { id: 'd', texto: '4, 3, 2' },
    ],
    correcta: 'd',
    explicacion:
      'La ecuación balanceada es 4 Fe + 3 O2 → 2 Fe2O3: hay 4 átomos de Fe y 6 de O en cada lado. Cambiar solo un coeficiente puede igualar un elemento, pero deja al otro sin balancear.',
    dificultad: 2,
  },
  {
    id: 'qui-03',
    areaId: 'quimica',
    ramas: TODAS_LAS_RAMAS,
    enunciado:
      'Para la reacción 2 H2 + O2 → 2 H2O se mezclan 8.0 g de H2 con 48.0 g de O2. Si las masas molares son H2 = 2.0 g/mol, O2 = 32.0 g/mol y H2O = 18.0 g/mol, ¿cuál es el reactivo limitante y la masa máxima de agua que puede formarse?',
    opciones: [
      { id: 'a', texto: 'H2; 36 g de H2O' },
      { id: 'b', texto: 'H2; 72 g de H2O' },
      { id: 'c', texto: 'O2; 36 g de H2O' },
      { id: 'd', texto: 'O2; 54 g de H2O' },
    ],
    correcta: 'd',
    explicacion:
      'Hay 4.0 mol de H2 y 1.5 mol de O2; esos 1.5 mol de O2 consumen 3.0 mol de H2, así que el O2 es limitante. Se forman 3.0 mol de H2O, equivalentes a 3.0 mol × 18.0 g/mol = 54 g.',
    dificultad: 3,
  },
  {
    id: 'bio-01',
    areaId: 'biologia',
    ramas: TODAS_LAS_RAMAS,
    enunciado:
      'En una célula eucariota, ¿qué organelo produce la mayor parte del ATP durante la respiración celular aerobia?',
    opciones: [
      { id: 'a', texto: 'Ribosoma' },
      { id: 'b', texto: 'Mitocondria' },
      { id: 'c', texto: 'Lisosoma' },
      { id: 'd', texto: 'Aparato de Golgi' },
    ],
    correcta: 'b',
    explicacion:
      'La mitocondria realiza el ciclo de Krebs y la fosforilación oxidativa, etapas que generan la mayor parte del ATP en presencia de oxígeno. El ribosoma fabrica proteínas, pero no es el principal sitio de producción de ATP.',
    dificultad: 1,
  },
  {
    id: 'bio-02',
    areaId: 'biologia',
    ramas: TODAS_LAS_RAMAS,
    enunciado:
      'Después de una comida rica en carbohidratos aumenta la glucosa en la sangre. ¿Qué respuesta ayuda a devolverla a su intervalo normal?',
    opciones: [
      {
        id: 'a',
        texto: 'El páncreas libera insulina, que favorece la entrada de glucosa a las células y la formación de glucógeno',
      },
      {
        id: 'b',
        texto: 'El páncreas libera glucagón, que favorece la degradación de glucógeno en el hígado',
      },
      {
        id: 'c',
        texto: 'La tiroides libera tiroxina, que bloquea la entrada de glucosa a las células',
      },
      {
        id: 'd',
        texto: 'Las glándulas suprarrenales liberan adrenalina, que convierte toda la glucosa en proteínas',
      },
    ],
    correcta: 'a',
    explicacion:
      'La insulina disminuye la glucosa sanguínea al facilitar su captación por las células y su almacenamiento como glucógeno. El glucagón actúa principalmente cuando la glucosa está baja y tiende a elevarla.',
    dificultad: 2,
  },
  {
    id: 'bio-03',
    areaId: 'biologia',
    ramas: TODAS_LAS_RAMAS,
    enunciado:
      'En una especie, los genes A y B se heredan de manera independiente. Si se cruza un individuo AaBb con uno aabb, ¿cuál es la probabilidad de obtener descendencia con genotipo aabb?',
    opciones: [
      { id: 'a', texto: '1/16' },
      { id: 'b', texto: '1/4' },
      { id: 'c', texto: '1/2' },
      { id: 'd', texto: '3/4' },
    ],
    correcta: 'b',
    explicacion:
      'En el primer gen, la probabilidad de obtener aa es 1/2, y en el segundo la de obtener bb también es 1/2. Como se heredan de manera independiente, se multiplican: 1/2 × 1/2 = 1/4.',
    dificultad: 3,
  },
  {
    id: 'fis-06',
    areaId: 'fisica',
    ramas: TODAS_LAS_RAMAS,
    enunciado:
      'Una barra horizontal de peso despreciable está en equilibrio sobre un punto de apoyo. A 2.0 m a la izquierda del apoyo actúa un peso de 300 N. ¿A qué distancia a la derecha debe actuar un peso de 400 N para mantener el equilibrio?',
    opciones: [
      { id: 'a', texto: '0.75 m' },
      { id: 'b', texto: '1.5 m' },
      { id: 'c', texto: '2.0 m' },
      { id: 'd', texto: '2.67 m' },
    ],
    correcta: 'b',
    explicacion:
      'Para que la barra permanezca en equilibrio, los momentos respecto al apoyo deben ser iguales: 300 N × 2.0 m = 400 N × d. El momento izquierdo es 600 N·m y d = 600 N·m / 400 N = 1.5 m; invertir la razón de las fuerzas llevaría a 2.67 m.',
    dificultad: 2,
  },
  {
    id: 'qui-04',
    areaId: 'quimica',
    ramas: TODAS_LAS_RAMAS,
    enunciado:
      'Una disolución se prepara mezclando 20 g de sal con 180 g de agua. ¿Cuál es el porcentaje en masa de sal en la disolución?',
    opciones: [
      { id: 'a', texto: '10 %' },
      { id: 'b', texto: '11.1 %' },
      { id: 'c', texto: '20 %' },
      { id: 'd', texto: '90 %' },
    ],
    correcta: 'a',
    explicacion:
      'La masa total de la disolución es 20 g + 180 g = 200 g. El porcentaje en masa es (20 g / 200 g) × 100 = 10 %; dividir entre 180 g usa solo la masa del disolvente y produce aproximadamente 11.1 %.',
    dificultad: 1,
  },
  {
    id: 'bio-04',
    areaId: 'biologia',
    ramas: TODAS_LAS_RAMAS,
    enunciado:
      'Antes de aplicar un antibiótico, unas pocas bacterias de una población poseen una variante heredable que les da resistencia. Tras varias generaciones con el antibiótico, ¿por qué aumenta la proporción de bacterias resistentes?',
    opciones: [
      {
        id: 'a',
        texto: 'El antibiótico hace que todas las bacterias desarrollen la variante porque la necesitan',
      },
      {
        id: 'b',
        texto: 'Las bacterias resistentes sobreviven y dejan más descendencia que las sensibles',
      },
      {
        id: 'c',
        texto: 'Las bacterias sensibles se vuelven resistentes al entrar en contacto con las sobrevivientes',
      },
      {
        id: 'd',
        texto: 'El antibiótico sirve de alimento y favorece únicamente a las bacterias resistentes',
      },
    ],
    correcta: 'b',
    explicacion:
      'La variante resistente ya estaba presente y es heredable; el antibiótico favorece a las bacterias que sobreviven y se reproducen más. La selección natural cambia la frecuencia de la variante, no hace que cada bacteria se adapte porque lo necesite.',
    dificultad: 2,
  },
];
