"""Mide si el texto del sitio necesita algo más que el subconjunto «latin».

Se compilan cuatro variantes de tipografía por familia --latin, latin-ext y
vietnamese-- y el navegador solo descarga las que hagan falta gracias a
`unicode-range`. La pregunta que responde este script es si alguna hace falta de
verdad, mirando el texto realmente servido en lugar de suponerlo.

Rango «latin» de Google Fonts, tal como lo declara el propio CSS.
"""

import re
import sys
from pathlib import Path

LATIN = [
    (0x0000, 0x00FF), (0x0131, 0x0131), (0x0152, 0x0153),
    (0x02BB, 0x02BC), (0x02C6, 0x02C6), (0x02DA, 0x02DA), (0x02DC, 0x02DC),
    (0x0304, 0x0304), (0x0308, 0x0308), (0x0329, 0x0329),
    (0x2000, 0x206F), (0x2074, 0x2074), (0x20AC, 0x20AC), (0x2122, 0x2122),
    (0x2191, 0x2191), (0x2193, 0x2193), (0x2212, 0x2212), (0x2215, 0x2215),
    (0xFEFF, 0xFEFF), (0xFFFD, 0xFFFD),
]


def en_latin(codigo: int) -> bool:
    return any(inicio <= codigo <= fin for inicio, fin in LATIN)


def texto_visible(html: str) -> str:
    """Quita etiquetas, scripts y estilos: solo lo que una persona lee."""
    sin_script = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    return re.sub(r"<[^>]+>", " ", sin_script)


def main() -> int:
    dist = Path(__file__).resolve().parent.parent / "dist"
    if not dist.exists():
        print("No existe dist/. Ejecuta npm run build primero.")
        return 1

    fuera: dict[str, list[str]] = {}
    for archivo in sorted(dist.rglob("*.html")):
        for caracter in set(texto_visible(archivo.read_text(encoding="utf-8"))):
            if not en_latin(ord(caracter)):
                fuera.setdefault(caracter, []).append(
                    str(archivo.relative_to(dist))
                )

    if not fuera:
        print("Ningún carácter del texto servido sale del subconjunto «latin».")
        print("Las variantes latin-ext y vietnamese no las necesita ningún visitante.")
        return 0

    print(f"Caracteres fuera de «latin»: {len(fuera)}")
    for caracter, archivos in sorted(fuera.items()):
        print(f"  {caracter!r} U+{ord(caracter):04X} en {', '.join(sorted(set(archivos)))}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
