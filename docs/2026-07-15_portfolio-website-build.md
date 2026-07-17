# David Glazier
## Portfolio Website Build
Date: July 15, 2026

---

## Change Descriptions

Built the full portfolio website from scratch in the new `website/` folder, matching the
four reference mockups (`Pixel_work_refrence_image.png`, `Fallen-fate-showcase_reference_image.png`,
`party-animal-showcase_reference_image.png`, `artfight-showcase_reference_image.png`).
Four pages were created:

| Page | File | Content |
|------|------|---------|
| Pixel Work (portal) | `website/index.html` | Three project cards (Fallen Fate, Political Party Animal, Art Fight Pixel), each with box art, video placeholder, blue underlined title link, and role line |
| Fallen Fate showcase | `website/fallen-fate.html` | Banner, video placeholder, role text, concept art vs. final design comparison, The Infirmary concept, gameplay screenshot, unused character concepts, app icon |
| Political Party Animal showcase | `website/political-party-animal.html` | City banner with logo overlay, video placeholder, character sprite roster, city background, US electoral map |
| Art Fight Pixel showcase | `website/art-fight-pixel.html` | Theater banner with Art Fight icon overlay, video placeholder, Cassie (Doom 1993 style) art |

## Technical Explanations

- **Animated background:** every page has the red (`#630E00`) background with the pixel
  mushroom pattern (`NewPattern.png`). It is rendered on a fixed `body::before` layer and
  animated with a CSS keyframe (`mushroom-drift`, 90 s, linear, infinite) that moves the
  `background-position` from `0 0` to `270px 270px` — equal X and Y deltas produce the
  requested 45° diagonal drift, and because 270px equals one pattern tile the loop repeats
  seamlessly forever.
- **Navigation:** every blue underlined link navigates to its page. Box art images on the
  portal are wrapped in the same anchors, so clicking the box art also opens the project
  page. The hamburger button (top right) opens a full-screen nav overlay (closed with the
  yellow X, matching the mockup icons); `GO BACK` links return to the portal.
- **Responsive design:** a fluid 1125px-max container, `clamp()`-based font and element
  sizing, and a `max-width: 640px` media query that stacks the portal box-art/video rows
  vertically. Verified in-browser at desktop (1024+) and phone (390×844) sizes.
- **Typography and colors** were lifted from the original exported CSS in `Site files/`:
  Pixel Emulator font (served from `website/fonts/`), blue links `#569AFC`, orange
  `#FF9831`, yellow captions `#E8BB00`, red headings `#BE1E2D`.
- **Pixel art fidelity:** `image-rendering: pixelated` is applied to sprites, logos, and
  the pattern so upscaled pixel art stays crisp.
- **Video placeholders** are pure CSS (dark panel, play ring, corner brackets) so they can
  later be swapped for real `<video>`/YouTube embeds without layout changes.
- **Extracted assets:** the box arts, banners, city background, US map, concept art, and
  caption imagery did not exist as standalone files, so they were cropped out of the
  reference mockups at 1:1 scale (the mockups match the original 1125px page exports).
  Character sprites came from `assets/decor/png/political-party-animals/`.

## Update — July 15, 2026 (evening)

Swapped the two static "final design" portraits on the Fallen Fate page for the animated
GIF versions David dropped into `website/img/`:

- `ff-final-design-1.png` → `ff-final-design-1.gif` (64×64, 12-frame walk/idle animation)
- `ff-final-design-2.png` → `DantePortrait_TalkingAnimation(1).gif` (128×128, 3-frame Dante talking portrait)

Both keep `image-rendering: pixelated` so the upscaled animation stays crisp. Also
restored `city-banner.png` (an accidental rename to `city-banner .png` — with a space —
had broken the Political Party Animal header image).

## Update — July 15, 2026 (box art + character animations)

**Box art replacement.** Replaced both cropped box-art images on the portal with the
full-resolution renders David provided (`fallen-fate-boxart.png`, `party-animal-boxart.png`,
619×1024). Their pure-black render background was removed with an exact-match flood fill
from the image borders (interior blacks untouched), so the boxes sit cleanly on the red
page with no crop seam.

**Political Party Animal character animations.** The four characters with animation
folders (RichGuy, Reporter, Extremist, AverageVoter — Chud remains static) are now live
sprites on the PPA page:

- The 256×256 PNG frame sequences from `Site files/<Character>/<Animation>/` were packed
  into 10-column sprite sheets at `website/img/anim/<Character>_<Animation>.png`
  (26 sheets, ~3.5 MB total, far fewer requests than ~1,500 individual frames).
- `website/js/ppa-characters.js` drives them at 30 fps by stepping `background-position`
  over the sheet (with `image-rendering: pixelated`).
- Behavior: characters loop **UseMe** by default. On click/tap (or Enter/Space — the
  sprites are keyboard-focusable buttons) they play **Clicked → AddPop → AddMoney →
  Delete → Spawn → Idle → back to UseMe**. Only Reporter has an Idle animation
  (2 frames, played as a short 2-second beat); the others skip straight from Spawn to
  UseMe. Clicks during a sequence are ignored until it finishes.

## Communication Context

No team member's code was modified — this is a new, self-contained build. Art credited on
the showcase pages (Fabiola Caldron & Jay, Luis Esponisa & Nicolas Salman) is displayed
exactly as in the mockups; no action needed unless credits should be corrected.

# File Locations
| File / Asset | Path |
|--------------|------|
| Portal page | `website/index.html` |
| Fallen Fate page | `website/fallen-fate.html` |
| Political Party Animal page | `website/political-party-animal.html` |
| Art Fight Pixel page | `website/art-fight-pixel.html` |
| Shared stylesheet | `website/css/style.css` |
| Menu script | `website/js/menu.js` |
| Pixel Emulator font | `Fonts/Pixel Emulator.otf → website/fonts/PixelEmulator.otf` |
| Mushroom pattern | `Site files/NewPattern.png → website/img/mushroom-pattern.png` |
| David Glazier logo | `Site files/image14.png → website/img/david-glazier-logo.png` |
| Menu / close icons | `Site files/image11.png, image12.png → website/img/menu-icon.png, close-icon.png` |
| Fallen Fate box art | cropped from `Site files/Pixel_work_refrence_image.png → website/img/fallen-fate-boxart.png` |
| PPA box art | cropped from `Site files/Pixel_work_refrence_image.png → website/img/party-animal-boxart.png` |
| Fallen Fate banner / wordmark | `Site files/image10.png, image9.png → website/img/ff-banner.png, ff-wordmark.png` |
| FF concept & final art | `Site files/image13.png, image4.png → website/img/ff-concept-char.png, ff-concept-guitar.png`; crops → `ff-final-design-1.png, ff-final-design-2.png, ff-infirmary.png, ff-gameplay.png, ff-unused-fly.png` |
| FF unused baphomet / app icon | `Site files/image6.png, image7.png → website/img/ff-unused-baphomet.png, ff-app-icon.png` |
| PPA logo | `Site files/logopsd.png → website/img/ppa-logo.png` |
| PPA city banner / background / US map | cropped from `Site files/party-animal-showcase_reference_image.png → website/img/city-banner.png, city-background.png, us-map.png` |
| PPA character sprites | `assets/decor/png/political-party-animals/*.png → website/img/ppa-*.png` |
| Art Fight icon / theater banner / Cassie | `Site files/image1.png, image2.png, image.png → website/img/artfight-icon.png, af-theater-banner.png, af-cassie.png` |
| Full box art renders (updated) | provided by David → `website/img/fallen-fate-boxart.png, party-animal-boxart.png` (black bg removed) |
| PPA animation sprite sheets | `Site files/<Character>/<Animation>/*.png → website/img/anim/<Character>_<Animation>.png` |
| PPA character animation script | `website/js/ppa-characters.js` |
