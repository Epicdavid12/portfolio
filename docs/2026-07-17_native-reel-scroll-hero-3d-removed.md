# David Glazier
## Native Gallery Scroll + Hero 3D Removed
Date: July 17, 2026

## Change Descriptions
- Removed the 3D game-room hero point cloud from the home page. The hero now uses the existing gradient background with the card carousel only.
- Purged the custom TikTok-style snap / wheel / touch / recycle scroll logic from the media gallery.
- Gallery now uses the browser’s default vertical scrolling.
- Added a **Go back to top** button that appears only near the bottom of the gallery and, on click, smoothly scrolls back to the first slide.
- Added per-video **Volume ON / OFF** controls in the gallery with exclusive audio (only one unmuted source at a time). Opening the gallery defaults the current video to **Volume ON**.

## Technical Explanations
- Home hero no longer loads Three.js or `room.bin` / `room.json`. `#room-canvas` and `hero3d.js` were removed.
- The media reel builds all slides in a native `overflow-y: auto` track. No `preventDefault` on wheel, no transform snapping, no DOM recycle buffer.
- Playback focuses the most-centered visible video and turns its **Volume ON**; videos scrolled past are paused at their current time and muted so only one audio source plays. Manual OFF on the current clip is kept until the center video changes.
- `media-reel-back-top` toggles from the track `scroll` event when remaining scroll distance is ≤ 72px (hidden if content does not overflow). Click calls `track.scrollTo({ top: 0, behavior: 'smooth' })`.

## File Location Tracking
| Change | Path |
|--------|------|
| Removed | `website/js/hero3d.js` |
| Removed | `website/media/room.bin` |
| Removed | `website/media/room.json` |
| Removed | `website/js/vendor/three.module.js` |
| Removed | `website/js/vendor/three.core.js` |

## Communication Context
No other team member code was modified.

# File Locations
| File / Asset | Path |
|--------------|------|
| Home page (hero markup) | `website/index.html` |
| Gallery + carousel JS | `website/js/main.js` |
| Hero + reel styles | `website/css/style.css` |
