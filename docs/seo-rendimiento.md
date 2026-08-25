# Rendimiento y Core Web Vitals

**Medido el 25 de agosto de 2026** sobre la compilación de producción servida en
local, con Chromium y la API `PerformanceObserver` del propio navegador.

## Qué se midió

| Ruta | CLS | LCP | Elemento del LCP | FCP |
|---|---:|---:|---|---:|
| `/` | 0 | 124 ms | H1 | 124 ms |
| `/examen-ipn` | 0 | 104 ms | párrafo | 104 ms |
| `/curso` | 0 | 116 ms | párrafo | 116 ms |
| `/diagnostico` | 0 | 116 ms | párrafo | 116 ms |

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

| Recurso | Sin comprimir | Comprimido |
|---|---:|---:|
| JavaScript | 344 kB | 105 kB |
| CSS | 32 kB | 7 kB |
| Tipografías latin precargadas | 72 kB | ya comprimidas |

## Decisiones tomadas y descartadas

**Se hizo:** precargar los subconjuntos `latin` de Fraunces y Archivo desde el
prerenderizado, leyendo el nombre con hash del disco. Sin eso, el navegador
descubría la fuente tras tres saltos (HTML, CSS, `@import`) y el LCP se retrasaba.

**Se descartó:** partir el banco de preguntas en un paquete aparte. Se midió: son
unos 35 kB de 342 kB, cerca del 10 %, o unos 12 kB comprimidos. A cambio exigía
dos estados de carga nuevos y una constante generada dentro de un flujo ya
verificado. La relación entre beneficio y riesgo no lo justifica.

**No aplica:** optimización de imágenes, `lazy loading` y dimensiones explícitas,
porque el sitio no usa ninguna imagen de contenido. El único activo gráfico es un
favicon SVG de 300 bytes.

## Cómo repetir la medición

```bash
npm run build
npm run seo        # auditoría técnica: metadatos, schema, sitemap, prerenderizado
npx vite preview   # y medir en el navegador con PerformanceObserver
```
