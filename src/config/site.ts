/**
 * Configuración central del sitio.
 *
 * TODO lo que un no-programador podría querer cambiar vive aquí:
 * enlaces, teléfono de WhatsApp, datos comerciales del curso y textos legales.
 * Ningún componente debe llevar estos valores escritos a mano.
 *
 * Los campos marcados con `PENDIENTE_*` son SUPUESTOS: se muestran de forma
 * honesta en la interfaz (o se ocultan) hasta que se confirme el dato real.
 * Nunca se inventa un precio, una fecha ni un resultado.
 */

/** Marca del programa (decidida en este proyecto, ver docs/identidad-de-marca.md). */
export const BRAND = {
  /** Nombre del programa de preparación. */
  program: 'Rumbo IPN',
  /** Organización que lo imparte. */
  org: 'WorldBrain México',
  /** Descriptor corto, se usa en el logotipo y en metadatos. */
  tagline: 'Preparación para el examen de admisión al Instituto Politécnico Nacional',
} as const;

/**
 * Estado de un dato comercial que aún no ha sido confirmado por el negocio.
 * La interfaz lo usa para decidir si muestra el dato o un texto honesto.
 */
export type Supuesto<T> = { readonly value: T; readonly confirmado: boolean };

const supuesto = <T,>(value: T): Supuesto<T> => ({ value, confirmado: false });
const confirmado = <T,>(value: T): Supuesto<T> => ({ value, confirmado: true });

/** Enlaces externos. */
export const LINKS = {
  /** Sitio de WorldBrain México. Verificado en vivo el 2026-08-25. */
  worldbrain: confirmado('https://ultravelozmente.com'),
  /**
   * Página real del curso de admisión universitaria, que cubre UNAM, IPN y UAM.
   * Verificada en vivo el 2026-08-25.
   */
  cursoDetalle: confirmado('https://ultravelozmente.com/admision-universitaria'),
  /** Fuentes oficiales del IPN, para que el usuario verifique por su cuenta. */
  ipnOficial: confirmado('https://www.ipn.mx'),
  ipnAdmision: confirmado('https://www.ipn.mx/admision-ipn/'),
  ipnDae: confirmado('https://www.dae.ipn.mx'),
  comipems: confirmado('https://www.comipems.org.mx'),
} as const;

/**
 * WhatsApp de contacto.
 * Confirmado: es el número que WorldBrain México publica en su propio sitio.
 * Formato internacional sin signos, como lo exige wa.me.
 */
export const WHATSAPP = {
  numero: confirmado('525578107837'),
  /** Se muestra al usuario en formato legible. */
  numeroVisible: '55 7810 7837',
} as const;

/**
 * Datos comerciales del curso.
 *
 * Las tres duraciones y las modalidades están confirmadas contra la página real.
 * El precio no lo publica WorldBrain en su sitio, así que aquí sigue sin
 * confirmar y la interfaz invita a pedir informes en lugar de inventar una cifra.
 */
export const CURSO = {
  modalidades: confirmado(['En línea', 'Presencial']),
  /** null = no se muestra precio; se invita a pedir informes. */
  precioMXN: supuesto<number | null>(null),
  /** El sitio dice «grupos reducidos» sin dar una cifra, así que no se afirma. */
  cupoMaximo: supuesto<number | null>(null),
  proximoInicio: supuesto<string | null>(null),
} as const;

/** Textos legales y de transparencia. Se muestran, no se esconden. */
export const LEGAL = {
  independencia:
    'Este es un sitio independiente de WorldBrain México. No es un sitio oficial del Instituto Politécnico Nacional, no está afiliado a él, no lo representa y no tiene relación con su proceso de admisión. El IPN es el único que publica información oficial, y sus datos deben consultarse siempre en ipn.mx.',
  independenciaCorta:
    'Sitio independiente de WorldBrain México. No es un sitio oficial del IPN.',
  diagnostico:
    'Este diagnóstico es un material original de práctica elaborado por WorldBrain México a partir de las áreas y temas publicados públicamente por el IPN. No contiene reactivos del examen real, no los reproduce y su resultado no predice ni garantiza tu admisión.',
  marcas:
    '«Instituto Politécnico Nacional» e «IPN» son denominaciones de su titular. Se mencionan aquí únicamente para describir el examen para el que este curso prepara.',
} as const;

/** Dominio propio del sitio, para canonical, sitemap y datos estructurados. */
export const SITE = {
  /** Confirmado por el propietario el 2026-08-25. */
  origin: confirmado('https://admisionipn.com'),
  locale: 'es-MX',
  pais: 'MX',
} as const;

/** Construye un enlace de WhatsApp con mensaje precargado. */
export function whatsappUrl(mensaje: string): string {
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${WHATSAPP.numero.value}?text=${texto}`;
}

/** Devuelve true si todos los datos comerciales visibles están confirmados. */
export function hayDatosPendientes(): boolean {
  const campos: ReadonlyArray<Supuesto<unknown>> = [
    LINKS.worldbrain,
    LINKS.cursoDetalle,
    WHATSAPP.numero,
    SITE.origin,
  ];
  return campos.some((c) => !c.confirmado);
}
