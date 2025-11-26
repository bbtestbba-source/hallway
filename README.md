# hallway project

A single-file HTML canvas demo that keeps a glowing ball bouncing inside a 2D box.

## Why a server was recommended before
Modern browsers often block module imports, fetches, or font/image loads when an HTML file is opened with a `file://` URL because those operations look like cross-origin requests. That’s why the earlier version asked you to run a tiny static server—it avoided those local-file security restrictions by serving everything from `http://localhost`. The downside was extra steps to start the server.

## What changed
The demo is now contained entirely in `index.html` with inline JavaScript and CSS. There are no module imports, no external assets, and no build tools. This removes the `file://` restrictions that were preventing the animation from starting when you double-clicked the file.

## Run locally (no server required)
1. Download or clone this folder so `index.html` sits by itself.
2. Double-click `index.html` (or right-click → *Open With* → your browser) in Chrome, Edge, Firefox, or Safari.
3. You should immediately see the framed play area with a glowing ball bouncing around. If you still get a blank page, try another browser profile or disable extensions that may block canvas rendering.

## Alternative: tiny local server (optional)
If you prefer or if your environment has strict file restrictions, you can still serve the file:
1. Open a terminal in this folder (`cd hallway`).
2. Run `python -m http.server 8000` (Python 3) or `npx serve` if you have Node installed.
3. Visit `http://localhost:8000` in your browser. The experience is identical—you don’t lose anything by opening it directly from the file system.

## Usage
1. Load the page.
2. Watch the ball bounce inside the framed play area.

## Testing
No automated tests are required for this single-file demo. You can manually open `index.html` to verify it renders and animates.
