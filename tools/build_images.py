"""Resize and web-optimize project images into website/img/slides/."""
from pathlib import Path
from PIL import Image

SITE = Path(r"c:\Users\dglaz\OneDrive\Desktop\Portfolio\Site files")
OUT = Path(r"c:\Users\dglaz\OneDrive\Desktop\Portfolio\website\img\slides")
MAX_EDGE = 1600

JOBS = {
    "art-fight": [
        (SITE / "Artfight" / "Glazier-Alien.jpg", "alien-space-walk"),
        (SITE / "Artfight" / "Glazier-comic(1).jpg", "comic-page"),
        (SITE / "Artfight" / "Glazier-dinosaur-girl(1).jpg", "dinosaur-girl"),
        (SITE / "Artfight" / "Glazier-Floral.jpg", "floral-portrait"),
        (SITE / "Artfight" / "PPrsvhl1a7tVG0bsYvJIf4tDigOeVbv7iXQQkzvYMt1DATXSZz62QJd60ny7.png", "gunslinger-clown"),
        (SITE / "Artfight" / "sweet william clay.png", "sweet-william-clay"),
        (SITE / "Artfight" / "t7N4x4Ac9vKdOjBX1usrkAnOU1gecjucZbS9mClnR9zjyvEwtEYdyIb3OlSa.jpg", "thunderbird-attack"),
    ],
    "au-bon-cake": [
        (SITE / "AuBonCake" / "cake-bag-adFINAL.png", "designer-bag-ad"),
        (SITE / "AuBonCake" / "1(1).png", "bakery-graphic"),
        (SITE / "AuBonCake" / "apple 2.jpg", "apple"),
        (SITE / "AuBonCake" / "hamsa clock.jpg", "hamsa-clock"),
        (SITE / "AuBonCake" / "hyutt.jpg", "hyutt"),
        (SITE / "AuBonCake" / "perfect hamantashen maker.jpg", "hamantashen-maker"),
        (SITE / "AuBonCake" / "pom 2.jpg", "pomegranate"),
        (SITE / "AuBonCake" / "ty.jpg", "thank-you-card"),
        (SITE / "AuBonCake" / "ty3.jpg", "thank-you-card-2"),
        (SITE / "AuBonCake" / "website+work_pages-to-jpg-0002_edited.jpg", "website-work"),
    ],
    "personal-3d": [
        (SITE / "Personal 3D work" / "FINAL_RENDER.jpg", "lego-living-room"),
        (SITE / "Personal 3D work" / "brickcrab.jpg", "brick-crab"),
        (SITE / "Personal 3D work" / "legoguy.png", "lego-guy"),
    ],
}

EXTRAS = [  # one-off copies (resized) into website/img
    (SITE / "AuBonCake" / "ABC-logo-tall.jpg", Path(r"c:\Users\dglaz\OneDrive\Desktop\Portfolio\website\img\abc-logo.jpg")),
]

def process(src: Path, dest: Path):
    im = Image.open(src)
    im.load()
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    if max(im.size) > MAX_EDGE:
        r = MAX_EDGE / max(im.size)
        im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    if has_alpha:
        # check if alpha actually used
        a = im.convert("RGBA").getchannel("A")
        if a.getextrema()[0] < 250:
            dest = dest.with_suffix(".png")
            im.convert("RGBA").save(dest, optimize=True)
            return dest
    dest = dest.with_suffix(".jpg")
    im.convert("RGB").save(dest, quality=84, optimize=True, progressive=True)
    return dest

for group, items in JOBS.items():
    d = OUT / group
    d.mkdir(parents=True, exist_ok=True)
    for i, (src, name) in enumerate(items, 1):
        dest = d / f"{i:02d}-{name}.xxx"
        final = process(src, dest)
        print(final.name, f"{final.stat().st_size/1024:.0f}KB")

for src, dest in EXTRAS:
    dest.parent.mkdir(parents=True, exist_ok=True)
    final = process(src, dest)
    print("extra:", final.name, f"{final.stat().st_size/1024:.0f}KB")
