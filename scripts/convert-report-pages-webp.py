from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = ROOT / "public" / "assets" / "templates"


def main() -> None:
    converted = 0
    for source in sorted(TEMPLATES.glob("*-equal-height-report-pages/page-*.png")):
        target = source.with_suffix(".webp")
        with Image.open(source) as image:
            image.save(target, "WEBP", quality=88, method=6)
        converted += 1
    print(f"Converted {converted} report pages to WebP.")


if __name__ == "__main__":
    main()
