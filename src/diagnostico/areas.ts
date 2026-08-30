/**
 * Áreas del diagnóstico.
 *
 * Los nombres y los temas provienen del temario público del IPN
 * (ver src/datos/examenOficial.ts y docs/investigacion-ipn.md).
 *
 * Nota importante y deliberada: el IPN no publica cuántas preguntas del examen
 * real corresponden a cada materia, así que este diagnóstico NO simula esa
 * proporción. Mide cada área por separado, con un número parecido de preguntas,
 * para decirte dónde estás firme y dónde no. Eso se explica al usuario en la
 * pantalla de inicio del diagnóstico y en la de resultados.
 */

import type { Area } from './tipos';

export const AREAS: readonly Area[] = [
  {
    id: 'matematicas',
    nombre: 'Matemáticas',
    nombreCorto: 'Matemáticas',
    descripcion:
      'Desde aritmética y álgebra hasta geometría analítica y cálculo. Es el área más extensa del temario.',
    temas: [
      'Pensamiento matemático',
      'Álgebra',
      'Geometría y trigonometría',
      'Geometría analítica',
      'Cálculo diferencial e integral',
      'Probabilidad y estadística',
    ],
    comoMejorar:
      'Se sube con práctica diaria y en orden: primero operaciones y álgebra, después funciones, y solo entonces cálculo. Saltarse el orden es lo que hace que el tema se sienta imposible.',
  },
  {
    id: 'comprension-lectora',
    nombre: 'Comprensión lectora',
    nombreCorto: 'Comprensión lectora',
    descripcion:
      'Entender textos informativos, literarios y periodísticos: idea central, argumentos, inferencias e intención del autor.',
    temas: [
      'Textos informativos: expositivos y argumentativos',
      'Textos literarios: narrativo y poético',
      'Texto periodístico: informativo y de opinión',
    ],
    comoMejorar:
      'Mejora leyendo con lápiz en mano: marcar la idea central de cada párrafo y distinguir un hecho de una opinión. Es el área que más rápido se recupera.',
  },
  {
    id: 'redaccion',
    nombre: 'Redacción',
    nombreCorto: 'Redacción',
    descripcion:
      'La parte escrita de Comunicación: gramática, semántica, ortografía y construcción de textos.',
    temas: ['Gramática', 'Semántica', 'Ortografía', 'Redacción'],
    comoMejorar:
      'Se trabaja con reglas concretas y muchos ejemplos: acentuación, concordancia, uso de nexos y precisión al elegir la palabra.',
  },
  {
    id: 'ingles',
    nombre: 'Inglés',
    nombreCorto: 'Inglés',
    descripcion:
      'Vocabulario y estructuras de uso cotidiano según el temario: familia, pasatiempos, compras, trabajo, cine y actualidad.',
    temas: [
      'Family life',
      'Hobbies and pastimes',
      'Holidays and shopping',
      'Work and jobs',
      'Film, news and current affairs',
    ],
    comoMejorar:
      'Rinde mucho estudiar los tiempos verbales básicos y el vocabulario de los temas del temario, en lugar de intentar aprender inglés en general.',
  },
  {
    id: 'historia-entorno',
    nombre: 'Historia y entorno socioeconómico de México',
    nombreCorto: 'Historia de México',
    descripcion:
      'Historia de México contemporáneo y las variables económicas, políticas y sociales del país.',
    temas: [
      'Antecedentes de la identidad nacional',
      'Formación del Estado mexicano',
      'De 1900 a 1940: crisis y reconstrucción',
      'Estado benefactor y su crisis, 1940-1982',
      'Neoliberalismo en México, 1982 a la fecha',
      'Modelos económicos y variables económicas',
      'Globalización y organizaciones sociales',
    ],
    comoMejorar:
      'Funciona mejor con líneas de tiempo y causas que memorizando fechas sueltas: entender por qué ocurrió cada cambio deja el dato pegado.',
  },
  {
    id: 'fisica',
    nombre: 'Física',
    nombreCorto: 'Física',
    descripcion:
      'El temario del IPN publica un bloque de Física distinto para cada rama, así que las preguntas cambian según la que elijas.',
    temas: [
      'Sistemas de unidades y mediciones',
      'Estática, cinemática y dinámica',
      'Propiedades de la materia',
      'Calor y termodinámica',
      'Electricidad y magnetismo',
      'Ondas',
    ],
    comoMejorar:
      'La mayoría de los errores no son de física sino de despeje y de unidades. Practicar el planteamiento antes de calcular es lo que cambia el resultado.',
  },
  {
    id: 'quimica',
    nombre: 'Química',
    nombreCorto: 'Química',
    descripcion:
      'Estructura de la materia, enlaces, nomenclatura, reacciones y estequiometría.',
    temas: [
      'Materia y estructura atómica',
      'Tabla periódica y enlace químico',
      'Nomenclatura inorgánica',
      'Reacciones y balanceo',
      'Estequiometría',
      'Disoluciones, ácidos y bases',
    ],
    comoMejorar:
      'Se apoya en dos cimientos: leer bien la tabla periódica y dominar la regla de tres. Con eso, la estequiometría deja de ser un obstáculo.',
  },
  {
    id: 'biologia',
    nombre: 'Biología',
    nombreCorto: 'Biología',
    descripcion:
      'La célula, los procesos metabólicos, el cuerpo humano, la genética y la evolución.',
    temas: [
      'La célula: procariota y eucariota',
      'Procesos metabólicos',
      'Tejidos, aparatos y sistemas del cuerpo humano',
      'Reproducción y genética',
      'Evolución y biodiversidad',
    ],
    comoMejorar:
      'Rinde estudiar por procesos y no por listas: seguir qué le pasa a una molécula o a una célula de principio a fin fija mejor los nombres.',
  },
];

/** Busca un área por su identificador. */
export function areaPorId(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id);
}
