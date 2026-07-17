# David Glazier
## My Work Dropdown + TikTok Reel Chrome
Date: July 17, 2026

## Change Descriptions
- Added a **My Work** dropdown in the top nav (and expanded project list in the mobile menu) linking to every project showcase page.
- Rebuilt the fullscreen media reel to match the TikTok-style layout mockup: project icon, name, Learn More, See More, Like, Share, Contact Me, X close, dark translucent background, infinite loop scroll.
- Wired project icons from `Site files/Proj_icons` into `website/img/icons/` for each project (including Demo Reel).

## Technical Explanations
- Dropdown opens on hover/focus on desktop and tap-toggle on coarse pointers. Closing after hover-out waits ~350ms so the menu is easier to reach; an invisible bridge covers the gap under the trigger.
- Reel slides are triplicated for seamless infinite scrolling; scroll position is remapped when the user crosses copy boundaries.
- Each media item resolves a project id from the page, work card title, or media path, then renders the matching icon, name, description, and deep links.
- Like toggles between light and bright magenta with an elastic scale/rotate bounce adapted from the provided easeOutElastic timing; likes persist in `localStorage`.
- Share opens a sheet with Email, Text (SMS), and Copy Link for the current page URL.
- Empty-space clicks and the X button close the reel and return to the underlying page.

## File Location Tracking
| Source | Destination |
|--------|-------------|
| `Site files/Proj_icons/Fallen_Fate_icon.png` | `website/img/icons/fallen-fate.png` |
| `Site files/Proj_icons/Party_animal_icon.png` | `website/img/icons/political-party-animal.png` |
| `Site files/Proj_icons/Artfight_comedy_icon.png` | `website/img/icons/art-fight.png` |
| `Site files/Proj_icons/auboncake_icon.jpg` | `website/img/icons/au-bon-cake.jpg` |
| `Site files/Proj_icons/3D_work_icon.png` | `website/img/icons/personal-3d.png` |
| `Site files/Proj_icons/Demo_Reel_general_icon.jpg` | `website/img/icons/demo-reel.jpg` |

## Communication Context
No other team member code was modified.

# File Locations
| File / Asset | Path |
|--------------|------|
| Shared JS (nav dropdown + reel) | `website/js/main.js` |
| Styles | `website/css/style.css` |
| Home / project / resume pages | `website/*.html` |
| Project icons | `website/img/icons/` |
