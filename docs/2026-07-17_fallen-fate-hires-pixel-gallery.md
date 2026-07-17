# David Glazier
## Fallen Fate High-Res Images + Gallery Pixel Scale
Date: July 17, 2026

## Change Descriptions
- Relinked Fallen Fate showcase media to the newer high-resolution assets already in `website/img` (concepts, unused enemies, Infirmary).
- Infirmary now uses `ff-infermery.png` (3300×2550) instead of the older lower-res `ff-infirmary.png`.
- Marked sprite GIFs (`ff-final-design-1.gif`, `DantePortrait_TalkingAnimation(1).gif`, Damien idle) as pixel-art sources.
- Gallery blow-up for those sprites uses integer nearest-neighbor scaling with sharp edges and correct aspect ratio (no fractional stretch).

## Technical Explanations
- High-res illustration PNGs are no longer forced through `.pixelated` grid styling so they render cleanly.
- Reel catalog detects `.pixel-art` / `.pixel-art-source` even before `naturalWidth` is available (fixes tiny GIFs that previously skipped pixel upscaling).
- `sizePixelArt` picks the largest integer scale that fits ~70% of the viewport stage, sets explicit `width`/`height` in pixels, and relies on `image-rendering: pixelated` / `crisp-edges`.

## File Location Tracking
No branch moves. New Infirmary filename: `img/ff-infirmary.png` → `img/ff-infermery.png`.

## Communication Context
No other team member code was modified.

# File Locations
| File / Asset | Path |
|--------------|------|
| Fallen Fate page | `website/fallen-fate.html` |
| Gallery pixel sizing | `website/js/main.js` |
| Pixel / concept styles | `website/css/style.css` |
| Infirmary (hi-res) | `website/img/ff-infermery.png` |
| Concept / unused art | `website/img/ff-concept-char.png`, `website/img/ff-concept-guitar.png`, `website/img/ff-unused-baphomet.png`, `website/img/ff-unused-fly.png` |
| Pixel sprites | `website/img/ff-final-design-1.gif`, `website/img/DantePortrait_TalkingAnimation(1).gif`, `website/img/ff-damien-idle.gif` |
