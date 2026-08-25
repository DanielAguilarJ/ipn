# Mobbin — Tanda B: desglose por categoría y vista de conjunto

## Búsqueda 1 — `skill breakdown by category results bars`

### Codecademy — útil
- **Pantalla:** [Codecademy](https://mobbin.com/screens/4c6387a4-d2d9-4afe-80c7-7afe596e5d27)
- **Cómo agrupa y ordena:** organiza el contenido por bloques claramente titulados y mantiene el detalle en una secuencia vertical; dentro de cada bloque, las métricas comparten una retícula y valores alineados, lo que permite comparar sin releer toda la fila.
- **Vista de conjunto además del detalle:** sí, pero como resumen compacto de progreso y tarjetas antes del detalle, no como radar. La jerarquía «resumen primero, desglose después» se entiende de inmediato.
- **Cómo distingue fuerte de débil:** combina longitud o avance visual con cifra y texto; la diferencia no depende únicamente del color.
- **Qué nos llevamos:** colocar arriba un resumen compacto y encerrar grupos relacionados en superficies claras reduce la sensación de lista plana sin cambiar el patrón accesible de barras.

### Juicebox — útil
- **Pantalla:** [Juicebox](https://mobbin.com/screens/a873e32c-12e7-4bb8-a966-1621e0bdf92b)
- **Cómo agrupa y ordena:** presenta distribuciones en módulos analíticos separados, con categorías en filas y valores alineados; el orden visual favorece la comparación de mayor a menor en vez de seguir un orden arbitrario.
- **Vista de conjunto además del detalle:** usa tarjetas de síntesis y gráficos compactos para dar contexto antes de entrar en cada distribución; no intenta meter toda la explicación en un único gráfico.
- **Cómo distingue fuerte de débil:** por magnitud, posición en el orden y valor numérico visible. El relleno de la barra refuerza la lectura, pero la cifra conserva el significado.
- **Qué nos llevamos:** ordenar por resultado y mostrar primero dos o tres señales-resumen hace que las fortalezas y brechas aparezcan en pocos segundos.

### Zoom — descartada para esta decisión
- **Pantalla revisada:** [Zoom](https://mobbin.com/screens/f6ce6a50-489d-4a69-af9a-aa485311dc64)
- La pantalla emplea módulos y métricas de panel, pero no ofrece una comparación suficientemente clara de ocho áreas ni una relación útil entre vista de conjunto y detalle. No conviene trasladar su densidad ni su patrón de navegación al informe.

## Búsqueda 2 — `personality assessment radar chart result profile`

### Uxcel — útil
- **Pantalla:** [Uxcel](https://mobbin.com/screens/3653e9d6-56f3-45ac-a647-96bda6073a95)
- **Cómo agrupa y ordena:** dispone las competencias alrededor de una figura común para mostrar el perfil completo y acompaña esa síntesis con bloques de información más precisos. El orden responde a una taxonomía estable, no a un ranking que cambie de posición.
- **Vista de conjunto además del detalle:** sí; el radar funciona como huella visual del perfil y el detalle aporta los valores que el polígono no permite comparar con precisión.
- **Cómo distingue fuerte de débil:** la distancia al centro hace visibles picos y valles; los nombres y valores asociados son necesarios para interpretar el nivel sin depender solo del área coloreada.
- **Qué nos llevamos:** un radar sirve para reconocer la forma general, pero debe ser secundario; con ocho ejes pierde precisión y accesibilidad frente a una cuadrícula con texto y cifras.

### 15Five — útil
- **Pantalla:** [15Five](https://mobbin.com/screens/1d575d26-986d-4126-9c12-2dd26aa3d0b3)
- **Cómo agrupa y ordena:** estructura el perfil en módulos y tarjetas con una jerarquía clara entre resumen, dimensiones y explicación. Las categorías conservan una posición estable y el detalle se lee por secciones.
- **Vista de conjunto además del detalle:** sí; una composición compacta de resultados resume el perfil antes de los módulos explicativos, sin exigir que un único gráfico cargue con toda la información.
- **Cómo distingue fuerte de débil:** combina puntuación, rótulo y magnitud visual; el texto mantiene la interpretación cuando el color no se percibe o se imprime en escala de grises.
- **Qué nos llevamos:** una cuadrícula modular ofrece casi la misma lectura de conjunto que un radar, pero admite mejor icono, nivel, aciertos y una breve acción por área.

### Dovetail — descartada para esta decisión
- **Pantalla revisada:** [Dovetail](https://mobbin.com/screens/d562bbc5-a726-4060-97e1-427829bbea2c)
- El perfil organiza bien atributos y contexto, pero no muestra una jerarquía fuerte/débil comparable ni una síntesis cuantitativa aplicable a ocho áreas. Puede inspirar espaciado, no la visualización del resultado.

## Recomendación concreta

- **Elegir una cuadrícula 2 × 4 por encima del detalle, no un radar como vista principal.** Cada tarjeta debe incluir icono, nombre del área, nivel escrito (`Por reforzar`, `En desarrollo`, `Sólido`) y `aciertos / total`; una mini barra azul puede reforzar la magnitud. Si se prueba un radar, que sea opcional y nunca la única fuente del dato.
- **Ordenar el detalle por prioridad de acción:** primero `Por reforzar`, después `En desarrollo` y al final `Sólido`; dentro de cada grupo, de menor a mayor porcentaje. Mantener en cada tarjeta el número o nombre estable del área para que el cambio de posición no desoriente.
- **Hacer la lista menos plana con tres secciones de nivel y filas-tarjeta suaves:** fondo papel cálido, borde fino, más espacio entre grupos y una franja o icono inicial. Conservar nombre, nivel, barra y aciertos alineados; no añadir adornos que compitan con la comparación.
- **Aplicar la paleta con función semántica:** azul `#0d5ef4` para progreso neutro, foco y enlaces; ámbar y rojo para prioridades; verde para `Sólido`. Repetir siempre la señal con icono + texto + cifra, nunca solo con color.
- **No hacer:** radar con ocho etiquetas pequeñas como única vista, ocho colores distintos, anillos sin cifras, orden alfabético que esconda las brechas, tema oscuro neón, glassmorphism, sombras pesadas ni gradientes que reduzcan el contraste.
