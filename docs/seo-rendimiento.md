# Rendimiento y Core Web Vitals

**Medido dos veces.** La primera el 25 de agosto de 2026, en escritorio. La segunda el
**30 de agosto de 2026**, en móvil emulado a 360 px, después de partir los paquetes y
recortar las tipografías. Ambas sobre la compilación de producción servida en local,
con Chromium y la API `PerformanceObserver` del propio navegador.

## Medición del 30 de agosto, en móvil

| Ruta | CLS | LCP | FCP | Carga diferida |
|---|---:|---:|---:|:---:|
| `/` | 0 | 44–48 ms | 28 ms | no |
| `/curso-ipn` | 0 | 44–48 ms | 28 ms | no |
| `/examen-ipn` | 0 | 48 ms | 28 ms | no |
| `/fuentes` | 0 | 56 ms | 24 ms | no |
| `/aviso-legal` | 0 | 44 ms | 20 ms | no |
| `/diagnostico-ipn` | 0 | **340–344 ms** | 20–24 ms | **sí** |
| `/resultados` | 0 | **336 ms** | 20 ms | **sí** |

### El coste medido de partir los paquetes

Las dos rutas que se cargan aparte tienen un LCP unas **siete veces mayor** que el
resto, y es reproducible: se midió tres veces con los mismos valores. Las cinco rutas
no diferidas se mantienen en 44–56 ms y las dos diferidas en 336–348.

**La causa NO es descargar el módulo, y esto está medido.** El 30 de agosto se añadió
`modulepreload` para que el navegador pidiera esos paquetes en paralelo desde el primer
momento. Funcionó como se pretendía —los dos archivos empiezan a llegar a los 7 ms y
terminan a los 11— y **el LCP no se movió**: 348 ms frente a 344 antes, dentro del
ruido. Si el cuello de botella fuera la descarga, con los módulos listos a los 11 ms el
LCP habría bajado.

Lo que queda es el propio proceso de hidratación: React conserva el HTML prerenderizado
mientras resuelve el componente diferido, y el elemento mayor se vuelve a pintar al
terminar. Ese repintado es el que marca el LCP.

Una explicación anterior de este documento decía que el navegador «descubre su módulo
cuando el paquete principal ya se está ejecutando». La medición de recursos la desmiente
y queda corregida aquí, porque una causa escrita con seguridad y equivocada dirige mal
el siguiente intento de arreglo.

**Sigue sin ser un problema, y conviene decirlo con el número.** El umbral de Google
para un LCP «bueno» es 2500 ms; 348 son un 14 % de ese presupuesto. A cambio, quien
entra a la portada o al temario —las dos rutas que captan búsqueda— descarga 59 kB
menos. La decisión se mantiene, ahora medida en lugar de supuesta.

**Por qué se conserva la precarga aunque no mueva el LCP.** En red local la descarga
secuencial cuesta casi cero, así que aquí no puede demostrar nada; con latencia real
ahorra un viaje de ida y vuelta para esos dos archivos. No produce ningún aviso de
«precargado y no usado» —comprobado: cero avisos de consola— y solo se añade en las dos
rutas que los necesitan. Es una mejora razonada, no medida, y se declara como tal.

## Lo que estas cifras NO demuestran

Son mediciones en red local, sin latencia ni CPU limitada. Un estudiante con un
teléfono modesto y datos móviles verá cifras peores. Los umbrales de Google se evalúan
con datos de campo reales, que no existirán hasta que el sitio reciba tráfico. **No se
deduce de aquí que el sitio «apruebe Core Web Vitals».**

Lo que sí demuestran, por comparación entre rutas, es que el prerenderizado funciona:
en las cinco rutas no diferidas LCP y FCP quedan a menos de 30 ms de distancia, lo que
significa que el elemento mayor está en el primer pintado y no espera a JavaScript.

## Medición del 25 de agosto, en escritorio

Las rutas se llamaban entonces «/curso» y «/diagnostico», sin acentos graves aquí
porque ya no existen; hoy son `/curso-ipn` y `/diagnostico-ipn`.

| Ruta | CLS | LCP | Elemento del LCP | FCP |
|---|---:|---:|---|---:|
| `/` | 0 | 124 ms | H1 | 124 ms |
| `/examen-ipn` | 0 | 104 ms | párrafo | 104 ms |
| `/curso-ipn` | 0 | 116 ms | párrafo | 116 ms |
| `/diagnostico-ipn` | 0 | 116 ms | párrafo | 116 ms |

## Qué significa y qué no

**Lo que estas cifras demuestran** es lo que depende del código:

- **CLS de 0.** No hay saltos de maquetación. Se debe a que no hay imágenes ni
  anuncios que carguen tarde, y a que las dos tipografías del primer pintado se
  precargan, así que no hay intercambio de fuente que empuje el texto.
- **LCP y FCP coinciden.** El elemento más grande está en el primer pintado, sin
  esperar a JavaScript: es el efecto directo del prerenderizado. Si el
  prerenderizado se rompiera, LCP se separaría de FCP y crecería.
- **El LCP es texto**, no una imagen. No hay un archivo grande que optimizar.

**Lo que NO demuestran:** son mediciones en red local, sin latencia ni CPU
limitada. Un estudiante con un teléfono modesto y datos móviles verá cifras
peores. Los umbrales de Google se evalúan con datos de campo reales, que no
existirán hasta que el sitio reciba tráfico. No se deduce de aquí que el sitio
«apruebe Core Web Vitals».

## Peso transferido

**Medido el 30 de agosto de 2026** con `npm run seo` sobre la compilación de
producción. Las cifras sin comprimir son las del disco; las comprimidas dependen del
servidor y no se han vuelto a medir desde el 25 de agosto, así que se marcan como
estimadas a partir de la proporción observada entonces (~30 % para texto).

| Recurso | Sin comprimir | Comprimido |
|---|---:|---:|
| JavaScript, paquete inicial | 316,2 kB | ~95 kB (estimado) |
| JavaScript, resto de paquetes | 60,9 kB | ~18 kB (estimado) |
| CSS | 33,1 kB | ~7 kB (estimado) |
| Tipografías latin precargadas | 69,9 kB | ya comprimidas |

El JavaScript se reparte en cuatro archivos: el inicial de 316,2 kB, el banco de
preguntas (33,1 kB), la pantalla de resultados (15,5 kB) y la del diagnóstico
(11,7 kB). Quien entra a leer el temario o la portada descarga solo el primero.

## Decisiones tomadas y descartadas

**Se hizo:** precargar los subconjuntos `latin` de Fraunces y Archivo desde el
prerenderizado, leyendo el nombre con hash del disco. Sin eso, el navegador
descubría la fuente tras tres saltos (HTML, CSS, `@import`) y el LCP se retrasaba.

**Se hizo, después de haberlo descartado:** partir el banco de preguntas y las dos
pantallas del diagnóstico en paquetes aparte. Este documento afirmaba antes que la
relación entre beneficio y riesgo no lo justificaba, y esa conclusión era prematura:
al hacerlo el 30 de agosto de 2026 el paquete inicial bajó de 375,6 a 316,2 kB —un
16 % menos— y el riesgo señalado, un parpadeo al hidratar páginas ya prerenderizadas,
**no se materializó**. Se comprobó en el navegador: cero errores y cero avisos de
consola en `/diagnostico-ipn`, en la portada y en `/resultados`, con el contenido
presente tras hidratar. Se deja escrita la reversión a propósito, porque una
limitación documentada con demasiada seguridad impide que alguien la vuelva a
revisar.

**Se hizo:** recortar los subconjuntos `latin-ext` y `vietnamese` de las dos
tipografías, tras comprobar carácter por carácter que el texto servido cabe entero en
`latin`. Bajó de 158,7 a 69,9 kB desplegados. Precisión importante: el navegador
nunca descargaba esas variantes porque `unicode-range` se lo impedía, así que **esto
no acelera ninguna página**; gana en peso subido al servidor y en tamaño del CSS que
bloquea el pintado. El script queda en `scripts/medir-subconjunto-fuentes.py`.

**No aplica:** optimización de imágenes de contenido, `lazy loading` y dimensiones
explícitas, porque el sitio no usa ninguna. Los dos únicos activos gráficos son el
favicon SVG de 300 bytes y `public/og.png` (1200x630, 90 kB), que no se muestra en
ninguna página: solo lo consumen WhatsApp y las redes al compartir el enlace.

## Cómo repetir la medición

```bash
npm run build
npm run seo        # auditoría técnica: metadatos, schema, sitemap, prerenderizado
npx vite preview   # y medir en el navegador con PerformanceObserver
```
