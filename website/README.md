# David Glazier — Portfolio Website

Retro-arcade portfolio. Static site — no build step required to run it.

## Running locally

```
cd website
python -m http.server 8642
# open http://localhost:8642
```

## Pages
| Page | File |
|------|------|
| Home (hero carousel + My Work + Contact) | `index.html` |
| Demo Reel | `demo-reel.html` |
| Fallen Fate | `fallen-fate.html` |
| Political Party Animal | `political-party-animal.html` |
| Art Fight | `art-fight.html` |
| Au Bon Cake | `au-bon-cake.html` |
| 3D Personal Projects | `personal-3d.html` |

## Structure
- `css/style.css` — the whole design system (fonts, palette, layouts)
- `js/main.js` — nav, rainbow titles, scroll reveal, slideshows, hero card carousel, media gallery
- `js/ppa-characters.js` — animated Political Party Animal sprites
- `fonts/` — moon get (titles), Pixel Emulator (pixel accents); body font is Fredoka via Google Fonts
- `media/` — web-encoded videos
- `img/slides/` — web-resized project galleries

## Asset pipeline
Regeneration scripts live in `../tools/`:
- `build_images.py` — resizes project images into `img/slides/`
- ffmpeg (via `node_modules/ffmpeg-static`) converted the AVI/large videos in `media/`
