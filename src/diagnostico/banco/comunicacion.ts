import type { Pregunta } from '../tipos';

export const PREGUNTAS_COMUNICACION: readonly Pregunta[] = [
  {
    id: 'lec-01',
    areaId: 'comprension-lectora',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: '¿Cuál es la idea central del texto?',
    contexto:
      'En muchas ciudades, los árboles urbanos suelen tratarse como decoración, cuando en realidad forman parte de la infraestructura pública. Su sombra reduce la temperatura de calles y edificios, retiene parte del agua de lluvia y ofrece refugio a aves e insectos. Sin embargo, plantar miles de ejemplares no basta. Si se eligen especies inadecuadas, se colocan en espacios mínimos o no se les da mantenimiento, la inversión puede fracasar en pocos años. Por ello, los programas de reforestación deberían medir la supervivencia de los árboles, no solo anunciar cuántos fueron plantados. También conviene involucrar a quienes habitan cada colonia, pues conocen dónde falta sombra y pueden detectar daños tempranos. Una ciudad más verde no surge de una campaña aislada, sino de decisiones técnicas, presupuesto continuo y participación vecinal. Evaluar esos factores permitiría convertir una promesa vistosa en un beneficio duradero.',
    opciones: [
      {
        id: 'a',
        texto: 'Plantar la mayor cantidad posible de árboles basta para mejorar las ciudades.',
      },
      {
        id: 'b',
        texto: 'El arbolado urbano produce beneficios duraderos cuando se acompaña de planeación, seguimiento y participación vecinal.',
      },
      {
        id: 'c',
        texto: 'La población debe asumir por sí sola el cuidado de todos los árboles de su colonia.',
      },
      {
        id: 'd',
        texto: 'La función más importante de los árboles urbanos es dar refugio a aves e insectos.',
      },
    ],
    correcta: 'b',
    explicacion:
      'El texto sostiene que plantar árboles no es suficiente: también se requieren decisiones técnicas, mantenimiento, evaluación y participación vecinal. Las otras opciones reducen el argumento a una sola acción o atribuyen al texto una postura que no presenta.',
    dificultad: 1,
  },
  {
    id: 'lec-02',
    areaId: 'comprension-lectora',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: '¿Qué se puede inferir sobre una campaña que solo informa cuántos árboles plantó?',
    contexto:
      'En muchas ciudades, los árboles urbanos suelen tratarse como decoración, cuando en realidad forman parte de la infraestructura pública. Su sombra reduce la temperatura de calles y edificios, retiene parte del agua de lluvia y ofrece refugio a aves e insectos. Sin embargo, plantar miles de ejemplares no basta. Si se eligen especies inadecuadas, se colocan en espacios mínimos o no se les da mantenimiento, la inversión puede fracasar en pocos años. Por ello, los programas de reforestación deberían medir la supervivencia de los árboles, no solo anunciar cuántos fueron plantados. También conviene involucrar a quienes habitan cada colonia, pues conocen dónde falta sombra y pueden detectar daños tempranos. Una ciudad más verde no surge de una campaña aislada, sino de decisiones técnicas, presupuesto continuo y participación vecinal. Evaluar esos factores permitiría convertir una promesa vistosa en un beneficio duradero.',
    opciones: [
      {
        id: 'a',
        texto: 'Cuenta necesariamente con presupuesto para dar mantenimiento durante varios años.',
      },
      {
        id: 'b',
        texto: 'Eligió especies adecuadas para cada espacio, aunque no publique esa información.',
      },
      {
        id: 'c',
        texto: 'Puede mostrar una cifra llamativa sin demostrar que los árboles sobrevivieron ni generaron beneficios duraderos.',
      },
      {
        id: 'd',
        texto: 'Logró sustituir la planeación técnica por la participación de quienes viven en la zona.',
      },
    ],
    correcta: 'c',
    explicacion:
      'El autor contrasta el número anunciado de árboles con la necesidad de medir su supervivencia. Por eso, una cifra inicial no permite concluir que la campaña tuvo resultados duraderos.',
    dificultad: 2,
  },
  {
    id: 'lec-03',
    areaId: 'comprension-lectora',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: '¿Cuál es la intención principal del autor?',
    contexto:
      'En muchas ciudades, los árboles urbanos suelen tratarse como decoración, cuando en realidad forman parte de la infraestructura pública. Su sombra reduce la temperatura de calles y edificios, retiene parte del agua de lluvia y ofrece refugio a aves e insectos. Sin embargo, plantar miles de ejemplares no basta. Si se eligen especies inadecuadas, se colocan en espacios mínimos o no se les da mantenimiento, la inversión puede fracasar en pocos años. Por ello, los programas de reforestación deberían medir la supervivencia de los árboles, no solo anunciar cuántos fueron plantados. También conviene involucrar a quienes habitan cada colonia, pues conocen dónde falta sombra y pueden detectar daños tempranos. Una ciudad más verde no surge de una campaña aislada, sino de decisiones técnicas, presupuesto continuo y participación vecinal. Evaluar esos factores permitiría convertir una promesa vistosa en un beneficio duradero.',
    opciones: [
      {
        id: 'a',
        texto: 'Convencer de que los programas de arbolado deben evaluarse por su permanencia y apoyarse en planeación, recursos y colaboración ciudadana.',
      },
      {
        id: 'b',
        texto: 'Explicar paso a paso cómo elegir, plantar y podar un árbol en una zona urbana.',
      },
      {
        id: 'c',
        texto: 'Responsabilizar a los habitantes de las colonias por el fracaso de las campañas de reforestación.',
      },
      {
        id: 'd',
        texto: 'Narrar la evolución histórica de las áreas verdes en distintas ciudades.',
      },
    ],
    correcta: 'a',
    explicacion:
      'El texto presenta razones para cambiar la manera de planear y evaluar los programas de arbolado urbano. No ofrece instrucciones detalladas ni una narración histórica, y propone colaboración vecinal en vez de culpar a la población.',
    dificultad: 3,
  },
  {
    id: 'red-01',
    areaId: 'redaccion',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: '¿Cuál oración está escrita correctamente?',
    opciones: [
      {
        id: 'a',
        texto: 'El público aplaudió la actuación del joven interprete.',
      },
      {
        id: 'b',
        texto: 'Aún no sé cómo resolver el ejercicio, pero lo intentaré mañana.',
      },
      {
        id: 'c',
        texto: 'La directora preguntó quien entregaría el informe.',
      },
      {
        id: 'd',
        texto: 'Tú explicación fue clara y fácil de seguir.',
      },
    ],
    correcta: 'b',
    explicacion:
      'La opción b acentúa correctamente aún con sentido de todavía, el verbo sé y el interrogativo indirecto cómo. En las demás faltaría la tilde de intérprete o quién, o se usa Tú cuando corresponde el posesivo Tu.',
    dificultad: 1,
  },
  {
    id: 'red-02',
    areaId: 'redaccion',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: '¿Cuál oración tiene concordancia y construcción gramatical correctas?',
    opciones: [
      {
        id: 'a',
        texto: 'La conclusión y los anexos fue revisada ayer.',
      },
      {
        id: 'b',
        texto: 'Las nuevas medidas de seguridad resultaron eficaz.',
      },
      {
        id: 'c',
        texto: 'El informe y la presentación quedaron listos antes de la reunión.',
      },
      {
        id: 'd',
        texto: 'Hubieron varias propuestas durante la sesión.',
      },
    ],
    correcta: 'c',
    explicacion:
      'En la opción c, el sujeto compuesto exige el verbo en plural y el adjetivo listos concuerda con sustantivos de distinto género. En las otras opciones hay errores de número o se usa hubieron, aunque el verbo haber impersonal debe ir en singular: hubo.',
    dificultad: 2,
  },
  {
    id: 'red-03',
    areaId: 'redaccion',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: '¿Qué par de nexos completa el texto con mayor coherencia? “El informe presenta datos suficientes para identificar el problema; _____, no propone medidas para resolverlo. _____, sirve como diagnóstico, pero no como plan de acción.”',
    opciones: [
      { id: 'a', texto: 'asimismo / En cambio' },
      { id: 'b', texto: 'por ejemplo / Aun así' },
      { id: 'c', texto: 'en consecuencia / Además' },
      { id: 'd', texto: 'sin embargo / Por tanto' },
    ],
    correcta: 'd',
    explicacion:
      'Sin embargo introduce el contraste entre identificar el problema y no proponer soluciones. Por tanto presenta la conclusión que se desprende de ese contraste: el informe diagnostica, pero no constituye un plan.',
    dificultad: 3,
  },
  {
    id: 'lec-04',
    areaId: 'comprension-lectora',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: 'De acuerdo con el texto, ¿qué debe ocurrir cuando un objeto prestado regresa a la biblioteca?',
    contexto:
      'En varias ciudades, algunas bibliotecas públicas han comenzado a prestar objetos además de libros. Sus catálogos incluyen herramientas, instrumentos musicales, juegos de mesa y aparatos para medir el consumo eléctrico. El modelo, conocido como «biblioteca de cosas», busca que las personas usen temporalmente artículos que necesitan pocas veces al año, en lugar de comprarlos. Así, una familia puede reparar una repisa con un taladro prestado o probar un telescopio antes de decidir si adquiere uno. El servicio no consiste solo en entregar objetos: cada pieza debe revisarse, limpiarse y registrarse al volver, y algunos centros ofrecen talleres para usarla con seguridad. Quienes impulsan estas iniciativas señalan que compartir reduce gastos y evita que productos poco utilizados terminen almacenados o desechados. Sin embargo, su continuidad depende de inventarios adecuados, mantenimiento y reglas claras de préstamo.',
    opciones: [
      {
        id: 'a',
        texto: 'Debe venderse a quien ya lo probó y desea conservarlo.',
      },
      {
        id: 'b',
        texto: 'Debe reservarse exclusivamente para quienes tomaron un taller.',
      },
      {
        id: 'c',
        texto: 'Debe revisarse, limpiarse y registrarse antes de volver a circular.',
      },
      {
        id: 'd',
        texto: 'Debe retirarse del catálogo para evitar que vuelva a almacenarse.',
      },
    ],
    correcta: 'c',
    explicacion:
      'El texto indica de manera explícita que cada objeto debe revisarse, limpiarse y registrarse cuando regresa. Las otras opciones mezclan datos de la lectura con acciones que el servicio no realiza.',
    dificultad: 1,
  },
  {
    id: 'lec-05',
    areaId: 'comprension-lectora',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: 'En la última oración, ¿qué significa que la continuidad del servicio “depende de” inventarios, mantenimiento y reglas claras?',
    contexto:
      'En varias ciudades, algunas bibliotecas públicas han comenzado a prestar objetos además de libros. Sus catálogos incluyen herramientas, instrumentos musicales, juegos de mesa y aparatos para medir el consumo eléctrico. El modelo, conocido como «biblioteca de cosas», busca que las personas usen temporalmente artículos que necesitan pocas veces al año, en lugar de comprarlos. Así, una familia puede reparar una repisa con un taladro prestado o probar un telescopio antes de decidir si adquiere uno. El servicio no consiste solo en entregar objetos: cada pieza debe revisarse, limpiarse y registrarse al volver, y algunos centros ofrecen talleres para usarla con seguridad. Quienes impulsan estas iniciativas señalan que compartir reduce gastos y evita que productos poco utilizados terminen almacenados o desechados. Sin embargo, su continuidad depende de inventarios adecuados, mantenimiento y reglas claras de préstamo.',
    opciones: [
      {
        id: 'a',
        texto: 'Esos elementos permiten que el servicio siga funcionando de manera sostenida.',
      },
      {
        id: 'b',
        texto: 'Esos elementos obligan al servicio a aumentar su catálogo cada año.',
      },
      {
        id: 'c',
        texto: 'El servicio solo puede comenzar cuando ya se desecharon los objetos poco usados.',
      },
      {
        id: 'd',
        texto: 'El servicio deja de necesitar revisiones cuando establece normas de préstamo.',
      },
    ],
    correcta: 'a',
    explicacion:
      'En este contexto, depender de ciertos elementos significa que estos son necesarios para que el servicio se mantenga en el tiempo. El texto no afirma que el catálogo deba crecer ni que las reglas sustituyan el cuidado de los objetos.',
    dificultad: 2,
  },
  {
    id: 'red-04',
    areaId: 'redaccion',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: '¿Cuál oración usa correctamente los signos de puntuación?',
    opciones: [
      {
        id: 'a',
        texto: 'La coordinadora explicó, que el registro cerraría a las seis.',
      },
      {
        id: 'b',
        texto: 'Para completar el trámite; necesitamos una identificación vigente.',
      },
      {
        id: 'c',
        texto: 'El aviso fue claro: nadie podría ingresar después de las ocho.',
      },
      {
        id: 'd',
        texto: 'Los visitantes llevaron, agua, sombreros y bloqueador.',
      },
    ],
    correcta: 'c',
    explicacion:
      'En la opción c, los dos puntos introducen una explicación de la afirmación anterior. En a y d se separa indebidamente el verbo de su complemento, mientras que en b el punto y coma rompe la unidad de la oración.',
    dificultad: 2,
  },
  {
    id: 'red-05',
    areaId: 'redaccion',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado: 'La oración “Marina le dijo a Elena que su informe necesitaba cambios” es ambigua. ¿Cuál versión deja claro que el informe pertenece a Elena?',
    opciones: [
      {
        id: 'a',
        texto: 'Marina le comentó a Elena que su informe necesitaba cambios.',
      },
      {
        id: 'b',
        texto: 'Marina le dijo a Elena que el informe de Elena necesitaba cambios.',
      },
      {
        id: 'c',
        texto: 'Marina, cuyo informe necesitaba cambios, se lo dijo a Elena.',
      },
      {
        id: 'd',
        texto: 'Marina dijo que el informe necesitaba cambios cuando habló con Elena.',
      },
    ],
    correcta: 'b',
    explicacion:
      'El complemento de Elena identifica sin duda a la propietaria del informe. El posesivo su de la versión original puede referirse a Marina o a Elena; las demás opciones conservan esa duda o atribuyen el informe a Marina.',
    dificultad: 3,
  },
];
