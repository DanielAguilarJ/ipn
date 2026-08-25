/**
 * Hechos del examen de admisión al IPN.
 *
 * Cada dato que se muestra al público vive aquí junto con su fuente y la fecha
 * en que se consultó. Regla del proyecto: si un dato no está en este archivo con
 * fuente, no se afirma en la interfaz.
 *
 * Investigación completa y limitaciones: docs/investigacion-ipn.md
 */

export interface Fuente {
  readonly id: string;
  readonly titulo: string;
  readonly url: string;
  /** Formato ISO, para poder mostrarla y ordenarla sin ambigüedad. */
  readonly consultada: string;
}

export const FUENTES = {
  convocatoria2027: {
    id: 'convocatoria2027',
    titulo: 'Convocatoria Nivel Superior escolarizada, febrero–julio 2027',
    url: 'https://www.admision.ipn.mx/nse/convocatoria/index-272.html',
    consultada: '2026-08-25',
  },
  temario: {
    id: 'temario',
    titulo: 'Temario de Estudio para el ingreso al IPN',
    url: 'https://www.ipn.mx/des/tramites-y-servicios/temarios-examen-de-admisi%C3%B3n-nivel-superior.html',
    consultada: '2026-08-25',
  },
  elaboradores: {
    id: 'elaboradores',
    titulo: 'Convocatoria de elaboradores de reactivos, admisión 2027',
    url: 'https://www.dev.desarrolloweb.ipn.mx/assets/files/des/docs/convocatoria-de-elaboradores-de-rom-2026.pdf',
    consultada: '2026-08-25',
  },
  admisionIpn: {
    id: 'admisionIpn',
    titulo: 'Proceso de Admisión IPN',
    url: 'https://www.ipn.mx/admision.html',
    consultada: '2026-08-25',
  },
  miDerechoMiLugar: {
    id: 'miDerechoMiLugar',
    titulo: 'Mi derecho, mi lugar — Proceso de Asignación 2026',
    url: 'https://www.miderechomilugar.gob.mx/',
    consultada: '2026-08-25',
  },
  cecytForaneos: {
    id: 'cecytForaneos',
    titulo: 'Convocatoria Nivel Medio Superior 2026-2027, CECyT foráneos',
    url: 'https://www.admision.ipn.mx/nme/convocatoria/index.html',
    consultada: '2026-08-25',
  },
  noEscolarizada: {
    id: 'noEscolarizada',
    titulo: 'Convocatoria Nivel Superior, Modalidad No Escolarizada, agosto 2026',
    url: 'https://www.admision.ipn.mx/nsd/convocatoria/index.html',
    consultada: '2026-08-25',
  },
} as const satisfies Record<string, Fuente>;

/**
 * La modalidad no escolarizada del nivel superior.
 *
 * Tiene convocatoria propia, distinta de la escolarizada. Se documenta porque
 * «examen de admisión IPN modalidad no escolarizada» es una búsqueda real y la
 * diferencia más importante no es el formato del examen, que es igual, sino que
 * solo ofrece carreras de una rama.
 */
export const NO_ESCOLARIZADA = {
  /** Igual que en la escolarizada: mismo examen. */
  preguntas: 140,
  horas: 3,
  /** La diferencia decisiva: solo una rama. */
  ramaUnica: 'sociales-administrativas' as const,
  /** Y se elige una sola carrera, no dos. */
  opcionesDeCarrera: 1,
  carreras: [
    'Turismo',
    'Archivonomía',
    'Biblioteconomía',
    'Administración y Desarrollo Empresarial',
    'Comercio Internacional',
    'Relaciones Comerciales',
    'Negocios Internacionales',
    'Contador Público',
    'Contaduría y Finanzas Públicas',
    'Ingeniería en Negocios Energéticos Sustentables',
  ],
  /** Obligatorio para quien queda asignado. */
  cursoPropedeutico: 'del 15 de julio al 10 de agosto de 2026, en línea',
  fuenteId: 'noEscolarizada' as const,
} as const;

/**
 * Lo que la gente llama «segunda vuelta».
 *
 * La convocatoria no usa ese término. Lo que existe son varios periodos de
 * ingreso, cada uno con su propia convocatoria, y quien no queda asignado en uno
 * puede participar en el siguiente. Se documenta así, con las palabras de la
 * fuente, en lugar de adoptar un nombre que el IPN no emplea.
 */
export const PERIODOS_DE_INGRESO = {
  cuantos: 4,
  lista: ['agosto de 2026', 'octubre de 2026', 'febrero de 2027', 'abril de 2027'],
  reglaNoAsignados:
    'Quien no resulta asignado en una convocatoria puede participar en la del periodo siguiente. Quien sí resulta asignado, no.',
  fuenteId: 'noEscolarizada' as const,
} as const;
export interface Hecho {
  readonly dato: string;
  readonly detalle: string;
  readonly fuenteId: keyof typeof FUENTES;
}

/** Hechos confirmados del examen de nivel superior. */
export const HECHOS_EXAMEN: readonly Hecho[] = [
  {
    dato: '140 preguntas',
    detalle: 'Es el total del examen de nivel superior, igual para las tres ramas.',
    fuenteId: 'convocatoria2027',
  },
  {
    dato: '3 horas',
    detalle: 'Tiempo efectivo máximo para resolverlo. Salen a poco más de un minuto por pregunta.',
    fuenteId: 'convocatoria2027',
  },
  {
    dato: '3 ramas',
    detalle:
      'Eliges una y las dos carreras que solicites deben pertenecer a esa misma rama. No se pueden mezclar.',
    fuenteId: 'convocatoria2027',
  },
  {
    dato: 'En línea',
    detalle:
      'Se aplica con navegador supervisado en computadora de escritorio o laptop, con cámara, micrófono e internet. No se puede en teléfono ni tableta.',
    fuenteId: 'convocatoria2027',
  },
  {
    dato: 'Sin promedio mínimo',
    detalle:
      'Para nivel superior no se pide un promedio mínimo de bachillerato, pero sí haberlo concluido.',
    fuenteId: 'convocatoria2027',
  },
];

/**
 * Lo que el IPN NO publica.
 *
 * Se muestra al usuario a propósito: es la diferencia entre este sitio y los que
 * afirman conocer el reparto exacto de preguntas por materia.
 */
export const NO_PUBLICADO: readonly string[] = [
  'Cuántas preguntas corresponden a cada materia. La convocatoria da el total de 140, pero no publica el reparto por asignatura, y la tabla de especificaciones se entrega solo a quienes elaboran reactivos, bajo confidencialidad.',
  'Qué unidades de Biología y de Química corresponden a cada rama. El temario público las lista, pero no las etiqueta por rama.',
  'La fecha general del examen de la convocatoria más reciente: se comunica de forma individual en la Ficha de Examen de cada aspirante.',
];

/** Las tres ramas oficiales. */
export interface Rama {
  readonly id: 'ingenieria' | 'medico-biologicas' | 'sociales-administrativas';
  readonly nombre: string;
  readonly nombreCorto: string;
  readonly ejemplos: string;
  /** Ciencia que el temario oficial enfatiza en esta rama. */
  readonly cienciasClave: readonly string[];
}

export const RAMAS: readonly Rama[] = [
  {
    id: 'ingenieria',
    nombre: 'Ingeniería y Ciencias Físico Matemáticas',
    nombreCorto: 'Ingeniería y Físico Matemáticas',
    ejemplos: 'Ingenierías, Sistemas Computacionales, Física y Matemáticas, Arquitectura.',
    cienciasClave: ['Física', 'Química'],
  },
  {
    id: 'medico-biologicas',
    nombre: 'Ciencias Médico Biológicas',
    nombreCorto: 'Médico Biológicas',
    ejemplos: 'Medicina, Enfermería, Odontología, Biología, Nutrición, Químico Farmacobiólogo.',
    cienciasClave: ['Biología', 'Química', 'Física'],
  },
  {
    id: 'sociales-administrativas',
    nombre: 'Ciencias Sociales y Administrativas',
    nombreCorto: 'Sociales y Administrativas',
    ejemplos: 'Contaduría, Administración, Comercio Internacional, Derecho, Turismo.',
    cienciasClave: ['Física', 'Química'],
  },
];

/** Etapas publicadas del proceso más reciente. */
export interface Etapa {
  readonly etapa: string
  readonly cuando: string;
  /** Si es falso, el dato no está publicado de forma general. */
  readonly publicada: boolean;
}

export const CALENDARIO: readonly Etapa[] = [
  { etapa: 'Prerregistro en la Plataforma de Admisión', cuando: '15 de julio al 30 de agosto de 2026', publicada: true },
  { etapa: 'Carga de fotografía e identificación', cuando: 'En la fecha que indique tu Solicitud de Registro', publicada: false },
  { etapa: 'Simulador del examen', cuando: 'En la fecha que indique tu Ficha de Examen', publicada: false },
  { etapa: 'Examen', cuando: 'En la fecha y hora que indique tu Ficha de Examen', publicada: false },
  { etapa: 'Resultados', cuando: 'Sábado 24 de octubre de 2026', publicada: true },
  { etapa: 'Inicio de clases', cuando: 'Febrero de 2027, según el calendario académico', publicada: false },
];

/** Periodo al que corresponde el calendario anterior. */
export const PERIODO_CONVOCATORIA = 'ingreso febrero–julio de 2027';

/** Nota sobre nivel medio superior, para no desinformar a quien busca vocacional. */
export const NOTA_BACHILLERATO = {
  texto:
    'Si buscas entrar a una vocacional del IPN en la Zona Metropolitana, en 2026 el trámite ya no se hace por COMIPEMS: se realiza en la plataforma «Mi derecho, mi lugar», dentro del proceso ECOEMS, y el IPN aplica examen en línea. Los CECyT foráneos tienen convocatoria propia del IPN, con examen de 120 preguntas.',
  fuenteIds: ['admisionIpn', 'miDerechoMiLugar', 'cecytForaneos'] as const,
};
