# David Glazier
## Demo Reel Showcase Page
Date: July 17, 2026

## Change Descriptions
- Added a Demo Reel showcase page matching the standard project layout (header, hero, content section, next-project footer).
- The page features a single demo-reel video so Learn More / See More from the gallery have a real destination.
- Wired site nav, My Work dropdowns, home Learn More, and reel project metadata to `demo-reel.html`.

## Technical Explanations
- `PROJECTS['demo-reel'].href` and `PAGE_PROJECT['demo-reel.html']` now point at the new page so gallery Learn More / See More open it.
- Top-level “demo reel” nav links across pages go to `demo-reel.html` instead of the raw MP4 or reel-open attribute.

## File Location Tracking
No branch moves.

## Communication Context
No other team member code was modified.

# File Locations
| File / Asset | Path |
|--------------|------|
| Demo Reel showcase | `website/demo-reel.html` |
| Gallery project links | `website/js/main.js` |
| Home Learn More + nav | `website/index.html` |
| Nav updates on project/resume pages | `website/fallen-fate.html`, `website/political-party-animal.html`, `website/art-fight.html`, `website/au-bon-cake.html`, `website/personal-3d.html`, `website/resume.html` |
| Demo reel media | `website/media/demo-reel.mp4` |
| Poster | `website/img/posters/demo-reel.jpg` |
