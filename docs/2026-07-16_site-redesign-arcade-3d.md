# David Glazier
## Site Redesign — Retro Arcade Brand + 3D Hero
Date: July 16, 2026

---

## Change Descriptions

Full redesign of the portfolio (`website/`) to match the new mockup
(`Site files/newpixel_layout-copy-[Recovered].png`): a single-page home with a
Three.js 3D game-room hero and floating project-card carousel, a red "My Work"
band with real videos/slideshows, and a plum "Contact Me" footer. Every project
now has its own long-scroll showcase page (layout modeled on
onufszak.com/dreams-between-sleeps, restyled to the arcade brand).

### New branding
- **Logo:** overlapping-letter "David Glazier" mark (`Site files/Logo_NotPixel.png/svg`).
- **Fonts:** *moon get* for all titles (from `Site files/moon_get-Heavy.otf`),
  *Fredoka* (Google Fonts) as the similar-looking rounded body font, *Pixel
  Emulator* kept for small pixel accents (tags, captions, kickers).
- **Palette:** deep maroon background `#30070e`, red work band `#8e1b0c`, plum
  contact band `#2e0c31`, accents yellow `#f2c118`, orange `#ff9831`, pink
  `#ff3eb5`, red `#ed3833`, link blue `#6aa5ff`.
- **Rainbow titles:** headings marked `.rainbow` get per-letter colors
  (yellow → orange → pink → red) applied by `js/main.js`, matching the mockup's
  "My Work" / "Contact Me" lettering.

### New pages
| Page | Content |
|------|---------|
| `index.html` | 3D room hero + 5-project card carousel, My Work band (video or slideshow per project, Demo Reel button), Contact band |
| `fallen-fate.html` | Story-scroll: banner hero, design video, concept→final art, environments, unused enemies |
| `political-party-animal.html` | Story-scroll: city hero, gameplay video, interactive animated sprites, roster, US map |
| `art-fight.html` | NEW — attack gallery slideshow + favorites grid (no video exists, so slideshow per the redesign rule) |
| `au-bon-cake.html` | NEW — bakery design campaign slideshow + highlights (no video, slideshow) |
| `personal-3d.html` | NEW — Blender animation studies (converted videos) + render grid |
| `art-fight-pixel.html` | REMOVED — replaced by `art-fight.html` |

## Technical Explanations

- **3D hero (`js/hero3d.js`):** the SiteScape scan
  (`Site files/retro_game_room_sitescape`) is a 12-million-point glTF point
  cloud (328 MB — unusable on the web). `tools/build_pointcloud.py` bakes node
  transforms, randomly subsamples to ~1.1 M points, voxel-denoises scan
  flyaways (≥14 pts per 8 cm voxel), quantizes positions to int16 over the
  bounding box, and writes `website/media/room.bin` (~10 MB) plus a `room.json`
  header. The page dequantizes into a `THREE.Points` buffer (vertex colors,
  unlit) and renders with **very subtle camera motion**: slow sine drift +
  eased mouse parallax around a fixed pose (`basePos`/`baseTarget`, tunable via
  `?cam=&tgt=&psize=` query params). Rendering pauses when the hero is
  offscreen or the tab is hidden; `prefers-reduced-motion` disables the drift.
- **Hero card carousel:** adapted from the `templatemo_600_prism_flux` template
  the user provided, rewritten without its loader/sections: cards are generated
  in `js/main.js` from a project data array; prev/next buttons, indicator dots,
  keyboard arrows, touch swipe, and 6.5 s auto-advance all navigate it. Each
  card has working **Learn More** (project page) and **See It Below** (#work)
  buttons; clicking a side card focuses it.
- **Videos:** browsers can't play AVI, so `ffmpeg-static` converted/compressed
  everything to H.264 MP4 in `website/media/`: `fallen-fate.mp4` (13.6 MB from
  36 MB), `political-party-animal.mp4` (10.7 MB from 29 MB, 60→30 fps),
  `heavy-object.mp4` + `fancy-walk.mp4` (from the Personal 3D AVIs),
  `demo-reel.mp4` (8 MB from 99 MB). Poster frames extracted to
  `img/posters/`. Work-band videos use `preload="none"` + poster so the page
  stays light.
- **Slideshows:** projects without video (Art Fight, Au Bon Cake) get an
  auto-advancing crossfade slideshow (built in `js/main.js`) with prev/next
  arrows and dots — used on both the My Work cards and their project pages.
  Source images were resized to ≤1600 px web JPEGs by `tools/build_images.py`
  into `img/slides/<project>/`.
- **Scroll-reveal:** project pages use an IntersectionObserver to fade/slide
  sections in as you scroll (the "dreams-between-sleeps" feel), disabled under
  `prefers-reduced-motion`.
- **Kept from previous build:** the Political Party Animal animated sprite
  system (`js/ppa-characters.js` + `img/anim/` sheets) is embedded in the new
  PPA page ("Meet The Animals"); previously extracted art in `img/` (banners,
  concept art, GIFs, sprites) is reused across the new pages.

## Update — July 16, 2026 (evening feedback pass)

Incorporated annotated screenshot feedback:
- Removed every em dash from site HTML/JS/CSS (user-facing)
- Nav simplified to Home / My Work / Contact / Demo Reel / Resume
- Tab titles set to "David Glazier" only
- Contact links set to real Instagram + LinkedIn URLs
- Hero cards: copy/tags updated; Fallen Fate "Play Game"; PPA "Video Demo" + "See in Itch.io"
- My Work: 6 cards with Demo Reel first; Art Fight + Au Bon Cake static thumbs
- Videos autoplay muted sitewide
- PPA/Fallen Fate/Art Fight page copy and layout fixes
- TikTok-style fullscreen media reel with first-visit scroll hint
- 3D camera moved deeper inside the room; hero hint text removed

| File / Asset | Path |
|--------------|------|
| Feedback pass changes | `website/index.html`, project pages, `website/js/main.js`, `website/css/style.css`, `website/js/hero3d.js` |

## Communication Context

No team member's code was modified — self-contained redesign of David's own
site. Third-party template credit: carousel interaction pattern adapted from
TemplateMo 600 "Prism Flux" (user-supplied). The game-room scan is the
user-supplied Sketchfab/SiteScape model in `Site files/retro_game_room_sitescape`
(see its `license.txt`).

# File Locations
| File / Asset | Path |
|--------------|------|
| Home page | `website/index.html` |
| Fallen Fate page | `website/fallen-fate.html` |
| Political Party Animal page | `website/political-party-animal.html` |
| Art Fight page | `website/art-fight.html` (replaces `art-fight-pixel.html`) |
| Au Bon Cake page | `website/au-bon-cake.html` |
| 3D Personal Projects page | `website/personal-3d.html` |
| Design system stylesheet | `website/css/style.css` (rewritten) |
| Shared behavior JS | `website/js/main.js` |
| 3D hero JS | `website/js/hero3d.js` |
| three.js vendor build | `tools/node_modules/three → website/js/vendor/three.module.js, three.core.js` |
| PPA sprite script (kept) | `website/js/ppa-characters.js` |
| moon get font | `Site files/moon_get-Heavy.otf/.ttf → website/fonts/` |
| New logo | `Site files/Logo_NotPixel.png/.svg → website/img/logo-david-glazier.png/.svg` |
| Favicon | generated → `website/img/favicon.png` |
| Compressed room scan | `Site files/retro_game_room_sitescape/scene.gltf+bin → website/media/room.bin + room.json` |
| Fallen Fate video | `Site files/Fallen_fate/YTDown...1080p.mp4 → website/media/fallen-fate.mp4` |
| PPA video | `Site files/Poltical Party Animal/Political party animals_1080p60.mp4 → website/media/political-party-animal.mp4` |
| 3D animation videos | `Site files/Personal 3D work/*.avi → website/media/heavy-object.mp4, fancy-walk.mp4` |
| Demo reel | `Site files/DGlazier_DemoReel.mp4 → website/media/demo-reel.mp4` |
| Video posters | generated → `website/img/posters/*.jpg` |
| Art Fight gallery | `Site files/Artfight/* → website/img/slides/art-fight/*` |
| Au Bon Cake gallery | `Site files/AuBonCake/* → website/img/slides/au-bon-cake/*` |
| Personal 3D gallery | `Site files/Personal 3D work/* → website/img/slides/personal-3d/*` |
| Point cloud build script | `tools/build_pointcloud.py` |
| Image pipeline script | `tools/build_images.py` |
| Screenshot/verify scripts | `tools/screenshot.js`, `tools/probe_cam.js` |
