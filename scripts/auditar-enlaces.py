"""Audita el enlazado interno del sitio ya compilado.

Mide tres cosas que Google usa para entender qué páginas importan y de qué tratan,
y que ninguna otra comprobación del proyecto cubre:

1. Cuántos enlaces internos recibe cada página, y desde dónde. Una página que solo
   se alcanza desde el pie es una página que Google considera secundaria.
2. Si el texto de cada enlace describe el destino. «Aquí», «este enlace» o «leer
   más» no le dicen nada al buscador ni a quien usa un lector de pantalla.
3. Enlaces internos rotos: los que apuntan a una ruta que no se generó.

Solo lee `dist/`. No modifica nada y no adivina: cuenta lo que hay.
"""

import re
import sys
from collections import defaultdict
from pathlib import Path

# Texto de enlace que no describe el destino.
ANCLAS_VACIAS = {
    "aquí", "aqui", "este enlace", "enlace", "leer más", "leer mas",
    "ver más", "ver mas", "más información", "mas informacion", "clic aquí",
    "haz clic", "pulsa aquí", "más", "mas", "aquí mismo", "este sitio",
}

# El pie y el encabezado enlazan a todo; sus enlaces no indican relevancia.
CONTENEDORES_DE_NAVEGACION = ("<footer", "<header")


def rutas_generadas(dist: Path) -> set[str]:
    rutas = set()
    for archivo in dist.rglob("index.html"):
        relativa = archivo.parent.relative_to(dist).as_posix()
        rutas.add("/" if relativa == "." else f"/{relativa}")
    return rutas


def sin_navegacion(html: str) -> str:
    """Quita encabezado y pie para quedarse con los enlaces del contenido."""
    recortado = html
    for etiqueta in CONTENEDORES_DE_NAVEGACION:
        nombre = etiqueta.lstrip("<")
        recortado = re.sub(
            rf"<{nombre}\b.*?</{nombre}>", " ", recortado, flags=re.S | re.I
        )
    return recortado


def enlaces(html: str) -> list[tuple[str, str]]:
    """Devuelve pares (destino, texto) de los enlaces internos."""
    encontrados = []
    for href, interior in re.findall(r'<a\b[^>]*href="(/[^"]*)"[^>]*>(.*?)</a>', html, re.S):
        texto = re.sub(r"<[^>]+>", " ", interior)
        texto = " ".join(texto.split())
        encontrados.append((href.rstrip("/") or "/", texto))
    return encontrados


def main() -> int:
    dist = Path(__file__).resolve().parent.parent / "dist"
    if not dist.exists():
        print("No existe dist/. Ejecuta npm run build primero.")
        return 1

    rutas = rutas_generadas(dist)
    entrantes: dict[str, list[tuple[str, str]]] = defaultdict(list)
    anclas_pobres: list[tuple[str, str, str]] = []
    rotos: list[tuple[str, str]] = []

    for archivo in sorted(dist.rglob("*.html")):
        relativa = archivo.parent.relative_to(dist).as_posix()
        origen = "/" if relativa == "." else f"/{relativa}"
        if archivo.name != "index.html":
            origen = f"/{archivo.relative_to(dist).as_posix()}"

        html = archivo.read_text(encoding="utf-8")

        for destino, texto in enlaces(html):
            if destino.startswith("/assets/") or "." in destino.rsplit("/", 1)[-1]:
                continue
            if destino not in rutas:
                rotos.append((origen, destino))

        for destino, texto in enlaces(sin_navegacion(html)):
            if destino.startswith("/assets/") or "." in destino.rsplit("/", 1)[-1]:
                continue
            if destino != origen:
                entrantes[destino].append((origen, texto))
            if texto.lower().strip(" .·—–") in ANCLAS_VACIAS:
                anclas_pobres.append((origen, destino, texto))

    print("Enlaces internos de contenido que recibe cada página")
    print("(sin contar encabezado ni pie, que enlazan a todo)\n")
    for ruta in sorted(rutas):
        fuentes = entrantes.get(ruta, [])
        marca = "  " if fuentes else "!!"
        print(f"{marca} {ruta:20} {len(fuentes)}")
        for origen, texto in fuentes:
            recorte = texto if len(texto) <= 46 else f"{texto[:43]}..."
            print(f"       desde {origen:18} «{recorte}»")

    problemas = 0

    # --- `nofollow` accidental en enlaces propios ---
    #
    # El enlace seguiría funcionando en el navegador, así que una revisión visual no
    # mostraría el defecto. Para un destino interno, `nofollow` contradice el grafo
    # que medimos abajo: le pide al buscador no seguir ni respaldar una ruta propia.
    internos_nofollow: list[tuple[str, str]] = []
    for archivo in sorted(dist.rglob("*.html")):
        relativa = archivo.relative_to(dist).as_posix()
        origen = "/" if relativa == "index.html" else f"/{relativa}"
        html = archivo.read_text(encoding="utf-8")

        for etiqueta in re.findall(r"<a\b[^>]*>", html, flags=re.I):
            href = re.search(r"\bhref=([\"'])(.*?)\1", etiqueta, flags=re.I)
            rel = re.search(r"\brel=([\"'])(.*?)\1", etiqueta, flags=re.I)
            if not href or not rel:
                continue
            destino = href.group(2)
            if (
                destino.startswith("/")
                and not destino.startswith("//")
                and "nofollow" in rel.group(2).lower().split()
            ):
                internos_nofollow.append((origen, destino))

    if internos_nofollow:
        problemas += len(internos_nofollow)
        print(f"\nEnlaces internos marcados como nofollow ({len(internos_nofollow)}):")
        for origen, destino in internos_nofollow:
            print(f"  {origen} -> {destino} — pide no seguir una ruta propia")

    # --- Forma canónica de los enlaces internos ---
    #
    # `enlaces()` quita la barra final para comparar rutas, que es correcto para
    # detectar roturas y peligroso para detectar contradicciones: `/curso-ipn/`
    # parecería válido aunque la página, Open Graph y el sitemap anuncien
    # `/curso-ipn`. Si el servidor redirige, cada enlace interno obliga a Google a
    # gastar una petición extra y refuerza la variante que pedimos no usar.
    enlaces_con_barra: list[tuple[str, str]] = []
    for archivo in sorted(dist.rglob("*.html")):
        relativa = archivo.relative_to(dist).as_posix()
        origen = "/" if relativa == "index.html" else f"/{relativa}"
        html = archivo.read_text(encoding="utf-8")
        for destino in re.findall(r'<a\b[^>]*href="(/[^"?#]+/)"', html, flags=re.I):
            if destino != "/":
                enlaces_con_barra.append((origen, destino))

    if enlaces_con_barra:
        problemas += len(enlaces_con_barra)
        print(f"\nEnlaces internos con barra final no canónica ({len(enlaces_con_barra)}):")
        for origen, destino in enlaces_con_barra:
            print(f"  {origen} -> {destino} — enlaza directamente a {destino.rstrip('/')}")

    # --- Alcanzabilidad real desde la portada ---
    #
    # Tener un enlace entrante no basta: dos páginas aisladas pueden enlazarse entre
    # sí y las dos parecer «no huérfanas» aunque Google no pueda llegar desde la
    # portada. El sitemap ayuda a descubrirlas, pero el grafo interno sigue siendo la
    # señal que reparte relevancia y contexto.
    #
    # Se recorre el grafo completo, incluido encabezado y pie. La métrica de contenido
    # de abajo los excluye deliberadamente porque mide importancia; esta responde una
    # pregunta distinta y binaria: «¿se puede llegar siguiendo enlaces?».
    # `/resultados` se excluye leyendo su propio noindex, no por una lista escrita a
    # mano, igual que hace el generador del sitemap.
    grafo: dict[str, set[str]] = {ruta: set() for ruta in rutas}
    indexables: set[str] = set()

    for archivo in sorted(dist.rglob("index.html")):
        relativa = archivo.parent.relative_to(dist).as_posix()
        origen = "/" if relativa == "." else f"/{relativa}"
        html = archivo.read_text(encoding="utf-8")

        noindex = re.search(
            r'<meta\b[^>]*name="robots"[^>]*content="[^"]*\bnoindex\b',
            html,
            flags=re.I,
        )
        if not noindex:
            indexables.add(origen)

        for destino, _ in enlaces(html):
            if destino in rutas:
                grafo[origen].add(destino)

    alcanzables: set[str] = set()
    pendientes = ["/"]
    while pendientes:
        actual = pendientes.pop()
        if actual in alcanzables:
            continue
        alcanzables.add(actual)
        pendientes.extend(grafo.get(actual, set()) - alcanzables)

    inalcanzables = sorted(indexables - alcanzables)
    if inalcanzables:
        problemas += len(inalcanzables)
        print(f"\nPáginas indexables inalcanzables desde la portada ({len(inalcanzables)}):")
        for ruta in inalcanzables:
            print(f"  {ruta} — aparece generada, pero ningún recorrido de enlaces llega a ella")

    if rotos:
        problemas += len(rotos)
        print(f"\nEnlaces internos rotos ({len(rotos)}):")
        for origen, destino in rotos:
            print(f"  {origen} -> {destino} (esa ruta no se generó)")

    if anclas_pobres:
        problemas += len(anclas_pobres)
        print(f"\nTextos de enlace que no describen el destino ({len(anclas_pobres)}):")
        for origen, destino, texto in anclas_pobres:
            print(f"  {origen} -> {destino}: «{texto}»")

    huerfanas = [r for r in sorted(rutas) if not entrantes.get(r) and r != "/"]
    if huerfanas:
        print(f"\nPáginas sin ningún enlace desde el contenido ({len(huerfanas)}):")
        for ruta in huerfanas:
            print(f"  {ruta} — solo se alcanza desde el pie o el menú")

    if problemas:
        print(f"\n{problemas} problema(s) que sí conviene corregir.")
        return 1

    print("\nSin enlaces rotos ni textos de enlace vacíos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
