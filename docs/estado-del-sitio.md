# Estado del sitio

**Al 30 de agosto de 2026.** Todas las cifras salen de ejecutar `npm run verificar`;
ninguna está estimada.

## Lo que hay que saber primero

**El trabajo está en el disco, no en el repositorio.** `HEAD` sigue en `1ddee4d`
sobre la rama `seo-20260825`; `git status --short` registra 29 entradas modificadas y
30 nuevas sin confirmar. Si esta carpeta se pierde, se pierde todo. Confirmar y subir es
el primer paso pendiente.

**El sitio no está publicado.** Nada de lo que sigue puntúa en Google hasta que
`admisionipn.com` esté en línea y sea rastreado.

## Qué está verificado

La ejecución integral más reciente de `npm run verificar` terminó en verde y encadenó
siete revisiones: 175 pruebas, compilación con 7 rutas prerenderizadas, auditoría SEO
sin errores ni avisos, enlaces internos, subconjunto de tipografías, revisión en móvil
y recorrido del diagnóstico. La revisión móvil ya exige además que cada ruta conserve
exactamente un H1 visible después de cargar JavaScript.

Texto propio dentro de `<main>` que reciben los buscadores **sin ejecutar
JavaScript** —sin inflarlo con el menú ni el pie compartidos—:

| Ruta | Palabras |
|---|---:|
| `/examen-ipn` | 2115 |
| `/curso-ipn` | 1857 |
| `/` | 1788 |
| `/aviso-legal` | 396 |
| `/fuentes` | 339 |
| `/diagnostico-ipn` | 232 |
| `/resultados` | 24 (no se indexa) |

Quien solo abre la portada descarga **323,8 kB de JavaScript**. El banco de preguntas
pesa **33,9 kB** y sigue en un chunk separado: solo `/diagnostico-ipn` y `/resultados`
lo precargan. La auditoría falla tanto si se cuela en otra página como si falta en una
de esas dos.

Las guardas añadidas después del cierre anterior vigilan también el favicon PNG real
de 96×96, la identidad «Rumbo IPN», el idioma `es-MX`, la correspondencia entre
canonical y entidad `WebPage`, páginas indexables inalcanzables, barras finales y
`nofollow` internos, recursos locales ausentes y enlaces hacia dominios que el proyecto
no haya confirmado. El 30 de agosto se revisaron en vivo 11 destinos externos; todos
respondieron con contenido coherente y se eliminó una redirección evitable de la DAE.
Esa disponibilidad HTTP es una medición puntual, no una dependencia de la verificación
local: una web externa puede cambiar después.

**Cobertura de búsqueda medida:** de las 64 consultas reales que se pueden abordar con
honestidad, **59 están cubiertas** y **51 aparecen en un título, una descripción o un
encabezado**, que es donde pesan. El registro vive en `cobertura-consultas.json` y la
auditoría avisa si una se pierde o si baja al cuerpo.

## Los defectos más serios que se corrigieron

Se listan porque explican qué protege cada comprobación, y porque casi todos eran
invisibles a la vista:

1. **`@graph` anidado en la portada.** En lugar de cuatro entidades entregaba un
   envoltorio sin tipo, así que el sitio, **la organización** y el curso eran
   inextraíbles justo en la página con más probabilidad de indexarse primero.
2. **Cinco de seis páginas referenciaban a un editor inexistente.** `publisher`,
   `isPartOf` y el `author` del artículo apuntaban a nodos definidos solo en la portada,
   y Google no sigue esas referencias entre páginas.
3. **Imagen social declarada y ausente**, así que cada enlace compartido por WhatsApp
   —el canal principal— salía sin vista previa.
4. **`lastmod` del sitemap con la fecha del build**, que miente en cada compilación y
   hace que Google deje de fiarse del sitemap.
5. **Soft-404**: no existía página de error real.
6. **`robots.txt` bloqueando lo que ya pedía `noindex`**, anulando su propia
   instrucción.
7. **Doce enlaces del encabezado decían «CursoEl curso»** a quien no aplica CSS.
8. **El banco de preguntas viajaba en el paquete inicial** de quien solo entraba a leer.

## Lo que falta, y no depende del código

1. **Confirmar y subir el trabajo** al repositorio.
2. **Publicar el sitio**, con dos peticiones para quien lo haga: que sirva `404.html` en
   las direcciones inexistentes y que **no** añada barra al final de las direcciones.
   Las dos están explicadas en el README.
3. **Enlazar desde `ultravelozmente.com`.** Es la palanca de mayor efecto que queda: un
   dominio nuevo sin enlaces entrantes tarda mucho más en ser tomado en serio.
4. **Registrar el sitio en Search Console** y enviar `sitemap.xml`.
5. **Decidir sobre el precio.** Mientras `CURSO.precioMXN` siga sin confirmar, la página
   invita a pedir informes. Es una decisión comercial, no un defecto.

## Lo que se decidió NO hacer, con su motivo

- **Publicar un reparto de preguntas por materia.** El IPN da el total de 140 y no
  publica cuántas son de cada asignatura. Se dice abiertamente y se usa como argumento.
- **Perseguir el resultado enriquecido de cursos o de preguntas frecuentes.** Los dos
  están descontinuados; ver `docs/seo-formatos-vigentes.md` con fechas y fuente.
- **Cubrir las consultas con «2025».** Presentar material de un año que ya pasó como si
  fuera el vigente engaña a quien busca.
- **Afirmar `temario anatomia ipn`.** El temario por rama se publica en PDF y no se pudo
  comprobar que Anatomía figure como asignatura. Sin fuente, no se afirma.
- **Forzar las 8 consultas que quedan solo en el cuerpo.** Piden palabras como
  «universidad» o «ingreso» que no tienen sitio natural en ningún encabezado, y meterlas
  a presión produce texto escrito para un buscador y no para una persona.

## Lo que no se ha medido

- **Datos de campo reales.** No existirán hasta que el sitio reciba tráfico. Las cifras
  de rendimiento de `docs/seo-rendimiento.md` se midieron en red local, así que **no se
  deduce de ahí que el sitio «apruebe Core Web Vitals»**.
- **El comportamiento del servidor de publicación.** Es la única pieza que no se puede
  verificar desde el repositorio.
- **Posiciones en Google.** No se pueden prometer, y no se prometen.
