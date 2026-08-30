# Qué resultados enriquecidos siguen existiendo

Fuente: registro de cambios de Google Search Central, consultado el **2026-08-30** en
<https://developers.google.com/search/updates>. Todas las fechas son de ese registro.

Este documento existe para evitar trabajo inútil. Varios de los formatos que este
sitio podría perseguir **ya no se muestran en Google**, y su marcado sigue siendo
válido para que el buscador entienda la página, pero no va a producir un resultado
visualmente destacado. Sin esta nota es casi seguro que alguien vuelva a intentarlo.

## Descontinuados: no esperar resultado enriquecido

| Formato | Qué pasó | Cuándo |
|---|---|---|
| **Course** (curso) | Google retiró la documentación porque el formato «ya no se muestra en los resultados». Antes, en junio de 2025, se le había puesto aviso de retirada. | Retirado el 2025-09-09 |
| **FAQPage** (preguntas frecuentes) | Dejó de aparecer en los resultados el 2026-05-07; la documentación se eliminó en junio. | Retirado el 2026-06-15 |
| **Sitelinks search box** | El formato ya no existe; la regla `nositelinkssearchbox` quedó archivada. | Retirado el 2024-11-29 |
| **How-to** (cómo hacer) | Retirado años antes, no aplica aquí. | 2023-08 |

### Qué significa para este sitio

`/curso-ipn` declara `Course` dentro de un `ItemList`, y la portada y `/curso-ipn`
declaran `FAQPage`. Por ahora se conservan porque son Schema.org válido, salen de la
misma fuente que el texto visible y no pueden divergir de él sin que fallen las
pruebas. Eso **no demuestra** que mejoren posiciones, comprensión ni citas: no hay
datos propios que lo sostengan y Google solo confirma que ya no producen un resultado
enriquecido. La decisión debe entenderse como mantenimiento de una representación
machine-readable correcta, no como una optimización demostrada.

La conservación tampoco es gratuita: medido sobre el HTML prerenderizado del 30 de
agosto de 2026, el nodo `FAQPage` ocupa **8097 bytes sin comprimir (14,78 %)** en `/`
y **3878 bytes (6,52 %)** en `/curso-ipn`. Estas cifras miden transferencia potencial
antes de compresión; no demuestran por sí solas un efecto perceptible en rendimiento,
pero sí invalidan la idea de que retirarlo «no ganaría nada».

Como control, se reconstruyeron ambos documentos sin el nodo y se comprimieron
completos: la diferencia fue de **230 y 1198 bytes con gzip nivel 9**, y de **228 y
142 bytes con Brotli calidad 11**, respectivamente. Es una simulación reproducible,
no una medición del servidor de producción; muestra que los porcentajes sin comprimir
sobrestiman el ahorro de red cuando el servidor comprime HTML, especialmente porque
el marcado repite texto visible.

Lo que **no** hay que hacer es invertir esfuerzo en cumplir requisitos adicionales
de esos formatos —por ejemplo añadir `offers` con precio al `Course`— con la
expectativa de un resultado enriquecido. Ese resultado no existe.

## Vivos y que sí conviene mantener

| Formato | Estado | Nota |
|---|---|---|
| **BreadcrumbList** | Vivo | Solo aparece en **escritorio**, no en móvil, desde el 2025-01-22. Se mantiene igualmente: es barato y mejora el aspecto del enlace en escritorio. |
| **Article** | Vivo | Lo usa `/examen-ipn`. Sus fechas deben ser reales; ver `src/datos/examenOficial.ts`. |
| **Organization / EducationalOrganization** | Vivo | Parte se usa «detrás de escena» para asociar la entidad, no para dibujar nada. Es donde está el valor real para un dominio nuevo. |
| **WebSite / WebPage** | Vivo | Sostiene la relación entre las siete rutas y su responsable. |

## Cosas que se decidió NO añadir, y por qué

- **`llms.txt`**: Google aclaró el 2026-06-15 que no lo necesita y que **no afecta
  ni positiva ni negativamente** a la visibilidad ni al posicionamiento. Añadirlo
  sería ruido; solo tendría sentido para otros servicios que lo consuman.
- **`SearchAction` / caja de búsqueda**: el formato está retirado y además el sitio
  no tiene buscador. Declararlo sería describir una función inexistente.
- **`aggregateRating` en el curso**: no hay reseñas verificables. Inventarlas es
  exactamente lo que las políticas de spam sancionan.
- **`offers` con precio**: el precio no está confirmado. Declarar uno falso es peor
  que no declarar ninguno.

## Dónde sí queda margen, según Google

El 2026-05-15 Google publicó una guía sobre cómo aparecer en sus funciones
generativas, y su mensaje central es que **las buenas prácticas de SEO siguen siendo
las que valen**; también desmonta ideas comunes de «AEO/GEO». Su recomendación
concreta más aplicable a este sitio es ofrecer contenido que no sea intercambiable
—aquí, decir abiertamente qué NO publica el IPN, con fuente y fecha, algo que la
competencia no hace—, más señales claras de identidad y autoría.
