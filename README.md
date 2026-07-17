# Omed Abdala Portfolio — V9 Clean Logo Placement

This revision uses the newly supplied SVG logos:

- `assets/branding/logo-black.svg` — black logo for the light theme
- `assets/branding/logo-white.svg` — white logo for the dark theme

The logo is now intentionally limited to:

- The fixed website header
- The footer

Removed logo placements:

- Inside the opened mobile menu
- Below “View Selected Work”
- Beside the philosophy quote
- Beside “Available for Selected Projects”
- Selected Work heading
- About heading
- Work archive heading and toolbar
- Project viewer

This keeps the identity visible without repeating it throughout every section.
The dark/light theme continues to select the correct SVG automatically.


## V10 light-theme adjustment

The light-theme background is now pure white:

`#ffffff`

Light-mode card and image panels use a neutral light gray rather than a cream tone.


## V11 typography and footer

- Major headings now use a restrained condensed display-font stack.
- Paragraphs and information use a clean system sans-serif.
- The philosophy statement retains a contrasting italic serif.
- Contact links and the phone number are larger and easier to read.
- The footer logo is shown at full opacity with no tinting or blending.
- Phone footers remain in one horizontal line, using compact labels.


## V12 professional typography and active navigation

- Home and About now update automatically in the desktop navigation while scrolling.
- About becomes active before the section reaches the top of the viewport.
- Replaced the previous condensed-font treatment with a professional Swiss-style system.
- Major headings use a neutral Helvetica-style display stack.
- Body text uses a modern system sans-serif for consistency and readability.
- The philosophy statement uses a restrained editorial serif.
- All sizes follow a responsive type scale using `clamp()`.
- Contact details, phone number, project labels and information rows have improved hierarchy.


## V13 About section

The About section now presents Omed as a multidisciplinary graphic designer with
experience in both visual design and physical production.

The professional umbrella terms used are:

- Print production
- Wide-format printing
- Visual fabrication
- Sign-making
- CNC routing
- Laser cutting and engraving
- UV printing


## Theme correction

- The dark theme now uses the exact solid background color `#231f20`.
- Noise, transparent header tinting, and dark-theme background gradients are disabled.
- Project data now uses separate `imagesDark` and `imagesLight` arrays.
- Dark project artwork is shown only in dark mode.
- Light project artwork is shown only in light mode.
- The project viewer and its thumbnails update immediately when the theme changes.


## Professional theme transition

- Theme changes now use a fast circular reveal originating from the switch.
- The full page changes as one composed visual instead of separate slow fades.
- Project artwork is preloaded and changes with the theme without flashing.
- Logos cross-fade while preserving the exact original SVG colors.
- A CSS fallback is included for browsers without the View Transitions API.
- Reduced-motion preferences are respected.


## Minimal theme transition

The heavy circular page-snapshot transition was removed.

The replacement:

- lasts roughly 135 milliseconds;
- does not capture or animate the full page;
- uses no mask, blur, overlay, or View Transitions API;
- briefly lowers page opacity to hide the exact swap frame;
- changes project artwork with a very short fade;
- keeps the theme-switch control animation.


## Footer logo fix

The footer logo now uses explicit footer-only theme rules:

- dark theme → `logo-white.svg`
- light theme → `logo-black.svg`

These overrides are stronger than the older generic logo rules, so the footer
always shows the correct version.


## Project image quality and responsive menu

- High-resolution 1200px and 2400px card images are generated from the supplied
  4500×6000 originals.
- Responsive `srcset` lets the browser choose a sharp image for the screen density.
- Fullscreen project viewing still uses the untouched original image.
- Grayscale filtering and hover scaling were removed from project artwork to avoid
  soft GPU-rendered edges.
- Tablets now use the navigation drawer, just like phones.
- The drawer has professional typography, hover/focus feedback, and an active state.
- Home and About active states update while scrolling.


## Touch gestures

The fullscreen project viewer now supports natural touch gestures:

- one finger: move the artwork;
- two fingers: pinch inward or outward to zoom;
- the zoom follows the midpoint between both fingers;
- lifting one finger continues naturally as a one-finger drag;
- desktop wheel, drag, buttons and double-click reset still work.

The separate zoom control is hidden on touch devices because pinch-to-zoom is now
the primary interaction.
