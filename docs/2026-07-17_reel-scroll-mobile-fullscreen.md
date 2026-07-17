# David Glazier
## Reel Scroll Buffer, Mobile Video Taps, Fullscreen
Date: July 17, 2026

## Change Descriptions
- Softened infinite reel scrolling: one-slide snap with a cooldown buffer, remapping only after settle (no boundary jitter).
- Fixed mobile video taps opening the reel by removing native `controls` and adding a full-area hit layer.
- Added a fullscreen button on page media and inside the reel; media is capped to the viewport on mobile unless the user enters fullscreen / zooms.
- Fixed double-scroll on trackpad/mouse wheel: leftover inertia no longer fires a second snap after unlock (especially noticeable when scrolling up).
- Tuned reel feel: shorter snap (~300ms), brief settle (~60ms), ~55ms idle only when trackpad inertia was active; reverse flicks clear the gate immediately.

## Technical Explanations
- Wheel and swipe advance one slide, then briefly lock input (~60ms) while the strip recycles.
- Idle gate (~55ms) only stays armed if wheel events kept firing during the snap (trackpad inertia). A single mouse notch unlocks immediately. Opposite-direction deltas clear the gate so reverse scrolls feel instant.
- Loop remapping runs after the CSS transform settle (`setTimeout` at `SNAP_MS + 20`), then `pinStrip(0)` — not on every wheel event.
- Video `controls` were removed from showcase HTML; JS also strips them and overlays `.media-reel-hit` for reliable mobile taps.
- `.media-fs-btn` / `.media-reel-fullscreen` call the Fullscreen API (with webkit video fallback).

## File Location Tracking
No branch moves.

## Communication Context
No other team member code was modified.

# File Locations
| File / Asset | Path |
|--------------|------|
| Reel + media binding JS | `website/js/main.js` |
| Reel / hit / fullscreen styles | `website/css/style.css` |
| Pages with video controls removed | `website/index.html`, `website/fallen-fate.html`, `website/political-party-animal.html`, `website/personal-3d.html` |
