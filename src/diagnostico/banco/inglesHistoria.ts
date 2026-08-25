import type { Pregunta } from '../tipos';

export const PREGUNTAS_INGLES_HISTORIA: readonly Pregunta[] = [
  {
    id: 'ing-01',
    areaId: 'ingles',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'Choose the option that correctly completes the sentence: Every Saturday, Maya ___ a film with her family, but today they ___ the news.',
    opciones: [
      { id: 'a', texto: 'watches / are watching' },
      { id: 'b', texto: 'is watching / watch' },
      { id: 'c', texto: 'watched / are watching' },
      { id: 'd', texto: 'watches / watched' },
    ],
    correcta: 'a',
    explicacion:
      '“Every Saturday” señala una rutina, por eso se usa el presente simple “watches”; “today” marca una situación temporal en curso, por eso corresponde “are watching”. El error común es usar el mismo tiempo verbal en ambos espacios sin atender a esas expresiones de tiempo.',
    dificultad: 2,
  },
  {
    id: 'ing-02',
    areaId: 'ingles',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'Leo sees this sign while shopping: “Backpack: regular price $40, now $28.” What does “on sale” mean in this context?',
    opciones: [
      { id: 'a', texto: 'It costs less than its regular price.' },
      { id: 'b', texto: 'It can only be paid for in cash.' },
      { id: 'c', texto: 'It is not available to buy today.' },
      { id: 'd', texto: 'It does not have a fixed price.' },
    ],
    correcta: 'a',
    explicacion:
      'En este contexto, “on sale” indica que el artículo tiene un precio rebajado respecto de su precio regular. No significa que solo admita efectivo ni que el producto no esté disponible para comprar.',
    dificultad: 1,
  },
  {
    id: 'ing-03',
    areaId: 'ingles',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'Read the sentence: Nora works at a hotel during the week and visits her grandparents on Sundays. Which statement is true?',
    opciones: [
      { id: 'a', texto: 'Nora visits her grandparents every workday.' },
      { id: 'b', texto: 'Nora has a hotel job and sees her grandparents once a week.' },
      { id: 'c', texto: 'Nora and her grandparents work together on Sundays.' },
      { id: 'd', texto: 'Nora is looking for a job at a hotel.' },
    ],
    correcta: 'b',
    explicacion:
      'La frase dice que Nora trabaja en un hotel entre semana y visita a sus abuelos los domingos, es decir, una vez por semana. Las demás opciones cambian la frecuencia, mezclan las dos actividades o afirman que todavía busca empleo.',
    dificultad: 1,
  },
  {
    id: 'his-01',
    areaId: 'historia-entorno',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      '¿Qué cambio distinguió a la Constitución surgida de la Revolución Mexicana dentro del proceso de reconstrucción nacional?',
    opciones: [
      {
        id: 'a',
        texto: 'Incorporó derechos sociales vinculados con la educación, la tierra y el trabajo.',
      },
      {
        id: 'b',
        texto: 'Se limitó a organizar elecciones sin regular asuntos sociales.',
      },
      {
        id: 'c',
        texto: 'Devolvió a la Iglesia el control legal de la educación pública.',
      },
      {
        id: 'd',
        texto: 'Ordenó concentrar la propiedad rural en grandes haciendas.',
      },
    ],
    correcta: 'a',
    explicacion:
      'La Constitución de 1917 convirtió demandas revolucionarias en derechos sociales relacionados con la educación, el régimen agrario y el trabajo. Considerarla un texto exclusivamente electoral ignora uno de sus rasgos históricos centrales.',
    dificultad: 2,
  },
  {
    id: 'his-02',
    areaId: 'historia-entorno',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      '¿Cuál fue una estrategia central del modelo de industrialización por sustitución de importaciones aplicado en México durante buena parte del periodo 1940-1982?',
    opciones: [
      {
        id: 'a',
        texto: 'Proteger y apoyar la industria nacional para producir bienes antes comprados en el extranjero.',
      },
      {
        id: 'b',
        texto: 'Eliminar la intervención estatal y abrir sin restricciones las importaciones.',
      },
      {
        id: 'c',
        texto: 'Abandonar la manufactura y depender únicamente de exportaciones agrícolas.',
      },
      {
        id: 'd',
        texto: 'Sustituir la moneda nacional por una divisa extranjera para controlar los precios.',
      },
    ],
    correcta: 'a',
    explicacion:
      'El modelo buscó fabricar dentro del país bienes que antes se importaban, con protección y apoyo estatal a la industria nacional. La apertura irrestricta de importaciones corresponde a una orientación distinta y habría debilitado la lógica de sustitución.',
    dificultad: 3,
  },
  {
    id: 'his-03',
    areaId: 'historia-entorno',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'Un informe señala que disminuyó la producción real de bienes y servicios finales, mientras aumentó de forma general y sostenida el nivel de precios. ¿Qué lectura de las variables económicas es correcta?',
    opciones: [
      { id: 'a', texto: 'El PIB real disminuyó y hubo inflación.' },
      { id: 'b', texto: 'El PIB real aumentó y hubo deflación.' },
      { id: 'c', texto: 'El PIB real no cambió y la inflación fue cero.' },
      { id: 'd', texto: 'El PIB real disminuyó y hubo deflación.' },
    ],
    correcta: 'a',
    explicacion:
      'El PIB real refleja la producción de bienes y servicios finales, por lo que una menor producción implica una caída; un aumento general y sostenido de precios indica inflación. El error común es confundir el alza de precios con mayor producción o llamarla deflación.',
    dificultad: 3,
  },
  {
    id: 'ing-04',
    areaId: 'ingles',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'Read Maya’s message: “I joined a book club. We meet every other Thursday to discuss a novel.” How often does the club meet?',
    opciones: [
      { id: 'a', texto: 'Twice every Thursday.' },
      { id: 'b', texto: 'Every two weeks.' },
      { id: 'c', texto: 'Every weekday.' },
      { id: 'd', texto: 'Once a month.' },
    ],
    correcta: 'b',
    explicacion:
      'La expresión “every other Thursday” significa que el club se reúne un jueves sí y otro no, es decir, cada dos semanas. No indica dos reuniones el mismo jueves ni una reunión mensual.',
    dificultad: 2,
  },
  {
    id: 'ing-05',
    areaId: 'ingles',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'During our holiday, the museum was closed on Monday, so we visited it on Tuesday instead. What did the travelers do?',
    opciones: [
      { id: 'a', texto: 'They canceled their entire holiday.' },
      { id: 'b', texto: 'They visited the museum before Monday.' },
      { id: 'c', texto: 'They changed the day of their museum visit.' },
      { id: 'd', texto: 'They found the museum open on Monday.' },
    ],
    correcta: 'c',
    explicacion:
      'Los viajeros encontraron cerrado el museo el lunes y trasladaron la visita al martes. “Instead” señala el cambio de plan; no implica que hayan cancelado todas sus vacaciones.',
    dificultad: 1,
  },
  {
    id: 'his-04',
    areaId: 'historia-entorno',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      '¿Cuál afirmación explica mejor por qué la identidad nacional mexicana es un proceso histórico y no una característica fija?',
    opciones: [
      {
        id: 'a',
        texto: 'Se ha formado mediante encuentros, conflictos e intercambios entre grupos diversos y continúa reinterpretándose.',
      },
      {
        id: 'b',
        texto: 'Proviene de una sola tradición que ha permanecido intacta y sin influencias externas.',
      },
      {
        id: 'c',
        texto: 'Depende exclusivamente de los límites territoriales y no de experiencias culturales compartidas.',
      },
      {
        id: 'd',
        texto: 'Está compuesta por costumbres decretadas al mismo tiempo por una única autoridad.',
      },
    ],
    correcta: 'a',
    explicacion:
      'La identidad nacional se construye históricamente mediante la convivencia, los intercambios y también los conflictos entre grupos diversos. Pensarla como una tradición única e inmutable elimina la diversidad y los cambios que forman parte de ese proceso.',
    dificultad: 2,
  },
  {
    id: 'his-05',
    areaId: 'historia-entorno',
    ramas: ['ingenieria', 'medico-biologicas', 'sociales-administrativas'],
    enunciado:
      'Una comunidad detecta contaminación en un río cercano. ¿Qué acción refleja mejor el papel del ciudadano en una sociedad democrática?',
    opciones: [
      {
        id: 'a',
        texto: 'Difundir acusaciones sin verificar para presionar de inmediato a cualquier autoridad.',
      },
      {
        id: 'b',
        texto: 'Reunir información, organizarse de manera pacífica, presentar propuestas y pedir rendición de cuentas.',
      },
      {
        id: 'c',
        texto: 'Dejar todas las decisiones a las autoridades y evitar dar seguimiento al problema.',
      },
      {
        id: 'd',
        texto: 'Participar solo si la solución produce un beneficio económico personal.',
      },
    ],
    correcta: 'b',
    explicacion:
      'El papel ciudadano incluye informarse, colaborar, proponer soluciones y exigir que las autoridades expliquen sus decisiones por vías pacíficas. Difundir datos no verificados o desentenderse del seguimiento debilita una participación responsable.',
    dificultad: 2,
  },
];
