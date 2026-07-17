# David Glazier
## Feedback Pass: Cards, Credits, Resume, Demo Reel
Date: July 17, 2026

## Change Descriptions
Corrected misinterpreted feedback from the annotated Fallen Fate mockup and follow-up notes:
- Hero carousel buttons are Learn More only, except Fallen Fate which has Play Game + Learn More.
- Fallen Fate Play Game links only to https://epicdavid.itch.io/fallen-fate.
- Added Damien idle GIF, Cassie (Art Fight), and extra Au Bon Cake images.
- Artist credits on Fallen Fate match the annotated names (J. West, Samy, David G., David).
- Resume is a branded site page (`resume.html`) with shared nav/header/footer.
- Home Demo Reel thumbnail and Watch Full Reel open the TikTok-style fullscreen media reel.
- Small pixel-art images are enlarged in the fullscreen reel while retaining sharp pixel edges.

## Technical Explanations
- Carousel actions live in `website/js/main.js` project data. Fallen Fate is the only card with two actions; Play Game uses `target="_blank"`.
- Media reel collects `.work-media` videos/images plus `[data-reel-open]` triggers. Home nav and Watch Full Reel use `data-reel-open="demo-reel"` to jump to that clip in the reel.
- Reel images inside pixel-art sections, or with source dimensions at or below 256 x 256, are automatically tagged as pixel art. JavaScript scales them by the largest whole-number multiplier that fits the viewport, and CSS uses pixelated rendering to prevent blur.
- Resume content was rebuilt from the Google Docs HTML export into site-styled markup so fonts, rainbow headings, and navigation match the rest of the portfolio.
- Fallen Fate page footer CTA is Play Game (itch.io), not Political Party Animal.

## File Location Tracking
No branch moves. Resume source copy kept at `website/assets/DavidGlazier_Resume.html` for reference; live page is `website/resume.html`.

## Communication Context
No other team member code was modified. Artist credit labels on Fallen Fate should stay as annotated (J. West / Samy / David G. / David).

# File Locations
| File / Asset | Path |
|--------------|------|
| Home page | `website/index.html` |
| Carousel + media reel JS | `website/js/main.js` |
| Styles (credits, resume, reduced motion) | `website/css/style.css` |
| Resume page | `website/resume.html` |
| Resume HTML source copy | `website/assets/DavidGlazier_Resume.html` |
| Fallen Fate page | `website/fallen-fate.html` |
| Damien idle GIF | `website/img/ff-damien-idle.gif` |
| Art Fight page | `website/art-fight.html` |
| Cassie image | `website/img/slides/art-fight/08-cassie.png` |
| Au Bon Cake page | `website/au-bon-cake.html` |
| New Au Bon Cake slides | `website/img/slides/au-bon-cake/11-is-that-cake.jpg` → `13-vineyard-cake.jpg` |
| Political Party Animal page | `website/political-party-animal.html` |
| 3D Personal Projects page | `website/personal-3d.html` |
