# Fun Menu

Fun Menu is a floating in‑page menu that gives you quick access to a set of browser utilities such as:

- Auto clicker (very fast, with keyboard controls)
- Ad remover (continuously removes common ad elements)
- DVD logo screen‑saver
- Tab opener
- Page marker (draw on the page with pen + circular eraser)
- Scroll to top
- Simple tab “cloak” (change title and favicon)

The logic lives in `menu.js` and is intended to run **only in a browser with a DOM** (for example as a bookmarklet, userscript, or directly from a `<script>` tag).

## Usage

1. Include `menu.js` on any web page (or load it as a bookmarklet / userscript).
2. The floating “Quick Menu” card appears in the bottom‑right corner.
3. Drag the menu by its header to reposition it.
4. Click any of the buttons to toggle features:
   - Auto Clicker: follow the on‑screen instructions (`S` to pause/resume, `+` / `-` to change speed, `Esc` to stop).
   - Remove all ads: starts a background cleaner that keeps removing most ad containers.
   - Cloaker: change the current tab’s title and favicon.
   - A DVD bounces around: shows a classic bouncing DVD logo overlay (`1` to hide/show, `Esc` to close).
   - Tab Opener: prompts for a number and opens that many blank tabs (capped for safety).
   - Draw on the Page: opens a full‑screen canvas with pen + circular eraser + clear controls at the top.
   - Scroll to top: smoothly scrolls back to the top of the page.

## Notes

- The code is written using plain browser APIs so it can be minified by standard JavaScript minifiers.
- Running `node menu.js` is supported only as a basic syntax check; actual features require a real browser.
- Some sites with heavy CSP / sandboxing may block parts of the functionality (like opening new tabs or changing favicons). This is expected and not a bug in the script itself.

