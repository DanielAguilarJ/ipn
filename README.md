# Rumbo IPN — admisionipn.com

Landing de captación y diagnóstico gratuito para el curso de preparación al examen
de admisión del IPN, de WorldBrain México.

Sitio **independiente**. No es un sitio oficial del Instituto Politécnico Nacional
ni está afiliado a él. Eso se dice en una franja visible en todas las páginas, en
el pie y en el aviso legal.

---

## Lo primero: qué está confirmado y qué falta

Todo lo que un no-programador podría querer cambiar vive en **un solo archivo**:
`src/config/site.ts`. No hace falta tocar nada más.

Ya quedó confirmado contra tu sitio en vivo el 25 de agosto de 2026:

| Dato | Valor | Cómo se verificó |
|---|---|---|
| WhatsApp | 55 7810 7837 | Es el número que publica ultravelozmente.com |
| Sitio de la empresa | ultravelozmente.com | Título: «Cursos de aprendizaje acelerado \| WorldBrain México» |
| Página del curso | ultravelozmente.com/admision-universitaria | «Curso de preparación para admisión UNAM, IPN y UAM 2026» |
| Los tres programas | Intensivo 4 meses, Estratégico 6, Blindado 8 | Sección «Elige tu ritmo» de esa página |
| Modalidades | En línea o presencial | La misma página |

Queda **un solo dato pendiente**, porque tu propio sitio no lo publica:

| Dato | Qué hace ahora | Dónde cambiarlo |
|---|---|---|
| Precio del curso | No se muestra; invita a pedir informes por WhatsApp | `CURSO.precioMXN` |

También dejé sin afirmar el tamaño de grupo: tu página dice «grupos reducidos» sin
dar una cifra, así que el sitio no inventa un número. Si quieres publicarlo,
confírmalo en `CURSO.cupoMaximo`.

### Cómo confirmar un dato

Cambia `supuesto(...)` por `confirmado(...)` y pon el valor correcto. Para que
aparezca el precio:

```ts
precioMXN: confirmado(4500),
```

En cuanto lo hagas, la página del curso deja de decir «escríbenos para el costo» y
muestra la cifra. Si lo dejas sin confirmar, sigue invitando a pedir informes.

---

## Cómo verlo en tu computadora

Necesitas Node.js 20 o superior. Una sola vez:

```bash
npm install
```

Después, cada vez que quieras verlo:

```bash
npm run dev
```

Te dará una dirección tipo `http://localhost:5173`. Ábrela en el navegador. Los
cambios que guardes aparecen solos, sin recargar.

## Cómo prepararlo para publicar

```bash
npm run build
```

Eso deja todo listo en la carpeta `dist`. Esa carpeta es la que se sube al
servidor. El comando hace cinco cosas: revisa que no haya errores, genera el
sitio, escribe una versión de cada página que los buscadores puedan leer, crea el
`sitemap.xml` y genera un `404.html` de verdad.

**Importante al publicar:** cada página tiene ya su propio archivo, así que **no**
pidas una «regla de reescritura a index.html». Esa regla haría que cualquier
dirección inventada devolviera la portada con estado 200, y Google la registraría
como una página duplicada más, gastando rastreo en direcciones que no existen. Lo
correcto es que el servidor entregue `404.html` cuando la dirección no exista. En
Netlify, Vercel y GitHub Pages eso ya ocurre solo con que el archivo esté ahí. En
un servidor propio, pide a quien lo administre que use `404.html` como página de
error.

**La otra cosa que hay que decirle a quien publique: sin barra al final.** Cada
página se declara a sí misma en `https://admisionipn.com/curso-ipn`, sin barra, y el
`sitemap.xml` ofrece exactamente esa misma dirección. Si el servidor decide redirigir
a `/curso-ipn/` con barra, la dirección que anunciamos deja de ser la que se sirve, y
Google recibe dos versiones de cada página con la instrucción de quedarse con una que
redirige a la otra. No rompe el sitio, pero desperdicia rastreo y retrasa la
indexación justo al principio, que es cuando más importa. En Netlify se controla con
`pretty_urls`; en Vercel con `trailingSlash: false`; en un servidor propio, pídelo
explícitamente. Hay una comprobación que verifica que sitemap y canonical coinciden
carácter por carácter, pero **el comportamiento del servidor no se puede comprobar
desde aquí**: es la única pieza de esta lista que depende de dónde se publique.

## Cómo revisar que nada se rompió

Un solo comando revisa todo:

```bash
npm run verificar
```

Tarda alrededor de dos minutos y se detiene en la primera cosa que falle, diciéndote
cuál es. Si termina sin quejarse, está bien. Por dentro son siete revisiones
distintas, y conviene saber qué caza cada una porque miran cosas que no se ven:

**Las comprobaciones del contenido y del cálculo.** El comando te dice cuántas son
al terminar. Verifican que ninguna pregunta tenga la respuesta correcta fuera de sus
opciones, que el puntaje se calcule igual siempre, que no se pueda cerrar el examen
dejando preguntas sin responder, que los textos del resultado nunca prometan ni
descarten tu admisión, que los tres programas que ofrece la página del curso sean los
mismos que recomienda el diagnóstico, y que la cifra de preguntas que anuncia la
portada siga siendo la real.

**Que el sitio compile y se genere entero.** Las siete páginas, el `sitemap.xml` y el
`404.html`.

**Que el SEO siga en pie.** Avisa si un título o una descripción se pasan de largo y
Google los va a cortar, si una página se queda sin H1 o tiene dos, si pierde sus
datos estructurados o sus migas de pan, si deja de referenciar a WorldBrain México,
si la imagen para compartir desaparece o cambia de tamaño, o si el `robots.txt` y las
propias páginas se contradicen, o si un cambio de texto deja sin cubrir alguna de las
búsquedas reales que el sitio ya cubría, o la baja de un encabezado al cuerpo. Lo más importante que revisa: que cada página siga
entregando texto real **sin ejecutar JavaScript**. Si eso se rompiera, el sitio se
vería perfecto en tu navegador mientras Google recibe una página vacía, y es el tipo
de fallo que nadie nota hasta que el tráfico no llega.

**Que los enlaces internos funcionen.** Ninguno roto, y ninguno con texto vago tipo
«aquí» o «leer más», que no le dicen nada a Google ni a quien usa un lector de
pantalla.

**Que las tipografías cubran el texto.** Comprueba letra por letra que todo lo que
se muestra cabe en el juego de caracteres que se descarga.

**Que el sitio funcione en un teléfono.** Abre las siete páginas en un móvil emulado
y avisa si algo se sale de la pantalla a lo ancho, si un botón o un enlace del menú
queda demasiado pequeño para el dedo, si un texto no contrasta lo suficiente con su
fondo, o si el navegador registra algún error. Ese último es el más traicionero: una
página se ve perfecta aunque su JavaScript reviente, porque el texto ya venía escrito;
lo que se rompe es el diagnóstico.

**Que el diagnóstico se pueda hacer de verdad.** Recorre el examen en el navegador:
elige una rama, comprueba que aparecen las preguntas, que **no** se puede avanzar sin
responder —si eso se rompiera, alguien podría terminar con preguntas en blanco y su
resultado sería falso—, que el progreso avanza al responder, y que la pantalla de
resultados dice honestamente que no hay nada cuando no hay respuestas guardadas.

Si prefieres correr una sola, cada una tiene su comando: `npm test`,
`npm run build`, `npm run seo`, `npm run enlaces`, `npm run fuentes`,
`npm run movil` y `npm run flujo`.

Las dos últimas necesitan un navegador instalado (`playwright-cli`). Si no lo tienes,
avisan y se saltan sin dar error, así que el comando único sigue sirviendo.

## Cómo cambiar la imagen que se ve al compartir el enlace

Cuando alguien pega la dirección del sitio en WhatsApp, aparece una imagen con el
titular. Su texto está en `scripts/og.html`. Si lo cambias, hay que volver a
generarla:

```bash
npm run og
```

La imagen queda guardada en el repositorio, así que este comando solo hace falta
cuando de verdad cambies ese texto. Requiere tener instalado `playwright-cli`; si no
lo tienes, el comando te lo dice y la imagen que ya existe sigue siendo válida.

---

## Qué hay dentro, en una página

- **La portada** vende el curso y lleva al diagnóstico.
- **El diagnóstico** son 38 preguntas originales, distintas según la rama que
  elijas, sin registro y sin enviar nada a ningún servidor: se calcula dentro del
  navegador de quien lo hace.
- **Los resultados** explican el nivel por área, señalan dónde enfocarse, recomiendan
  uno de tres programas y abren WhatsApp con el resultado ya escrito en el mensaje.
- **Cómo es el examen** es la página informativa, y la que más ayuda a aparecer en
  Google.
- **El curso** presenta los tres programas.
- **Fuentes** lista de dónde salió cada dato, con la fecha en que se consultó.
- **Aviso legal** explica que no recogemos datos y que no somos el IPN.

## Cómo cambiar las preguntas del diagnóstico

Están en `src/diagnostico/banco/`, repartidas en cuatro archivos por materia. Cada
pregunta lleva su explicación, que es lo que se muestra al terminar. Si añades o
cambias alguna, corre `npm test`: las comprobaciones avisan si una respuesta
correcta no está entre las opciones o si se repite un identificador.

Las reglas con que se escribieron están en `docs/especificacion-preguntas.md`.

## Sobre la honestidad del contenido

Dos decisiones que conviene no revertir sin pensarlo:

1. **No se publica un reparto de preguntas por materia.** El IPN da el total de 140
   pero no dice cuántas son de cada asignatura, y esa tabla solo la reciben quienes
   elaboran reactivos, bajo confidencialidad. La página lo dice abiertamente y lo
   usa como argumento: quien te dé porcentajes exactos está estimando.
2. **No se promete admisión.** Ni la landing ni el resultado afirman que vas a
   quedar, y hay una prueba automática que falla si aparece ese tipo de lenguaje.

Todo lo que se afirma sobre el examen sale de `src/datos/examenOficial.ts`, donde
cada dato lleva su fuente y su fecha. Si un dato no está ahí con fuente, no debe
afirmarse en la interfaz.

## Documentos de trabajo

- `docs/estado-del-sitio.md` — qué está verificado, qué falta para publicar y qué se
  decidió no hacer, con las cifras medidas

- `docs/investigacion-ipn.md` — convocatoria, temario y calendario, con fuentes y
  limitaciones
- `docs/mobbin-a-examen.md` — patrones de examen y de pantalla de resultados
- `docs/mobbin-b-landing.md` — patrones de landing educativa
- `docs/investigacion-competidores.md` — cómo venden los competidores, objeciones
  reales de compra y términos de búsqueda
- `docs/seo-intencion-busqueda.md` — qué escribe la gente de verdad en Google,
  según su API de sugerencias, y qué consultas NO conviene perseguir
- `docs/seo-competencia-serp.md` — quién ocupa los primeros resultados y cuál es
  el techo realista en cada búsqueda
- `docs/seo-rendimiento.md` — medición de Core Web Vitals, con lo que demuestra y
  lo que no
- `docs/seo-formatos-vigentes.md` — qué resultados enriquecidos de Google siguen
  existiendo y cuáles ya no, para no perseguir formatos retirados
- `docs/especificacion-preguntas.md` — reglas para redactar preguntas
