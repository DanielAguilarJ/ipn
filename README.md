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
servidor. El comando hace cuatro cosas: revisa que no haya errores, genera el
sitio, escribe una versión de cada página que los buscadores puedan leer, y crea el
`sitemap.xml`.

**Importante al publicar:** el servidor debe enviar `index.html` cuando alguien
pida una dirección que no existe como archivo, o las rutas internas darán error 404
al recargar. En Netlify o Vercel esto ya viene configurado. En un servidor propio,
pide a quien lo administre una «regla de reescritura a index.html».

## Cómo revisar que nada se rompió

```bash
npm test
```

Son 97 comprobaciones automáticas. Verifican, entre otras cosas, que ninguna
pregunta tenga la respuesta correcta fuera de sus opciones, que el puntaje se
calcule igual siempre, que no se pueda cerrar el examen dejando preguntas sin
responder, y que los textos del resultado nunca prometan ni descarten tu admisión.

## Cómo revisar que el SEO sigue bien

```bash
npm run build
npm run seo
```

Son comprobaciones distintas de las anteriores: miran el sitio ya compilado y
avisan si un título o una descripción se pasan de largo y Google los va a cortar,
si una página se queda sin H1 o tiene dos, si los datos estructurados dejaron de
ser válidos, o si el sitemap y el `robots.txt` se contradicen.

La más importante es la última: comprueba que cada página siga entregando texto
real **sin ejecutar JavaScript**. Si eso se rompiera, el sitio seguiría viéndose
perfecto en tu navegador mientras Google recibe una página vacía, y es el tipo de
fallo que nadie nota hasta que el tráfico no llega.

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
- `docs/especificacion-preguntas.md` — reglas para redactar preguntas
