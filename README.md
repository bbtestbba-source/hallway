# hallway project

A lightweight HTML canvas demo that keeps a glowing ball bouncing inside a 2D box.

## Run locally
You can open the demo either straight from the file system or with a tiny static server.

**Fastest (double-click):**
1. Download or clone this folder so `index.html`, `src/main.js`, and the `vendor` folder all sit together.
2. Double-click `index.html` (or right-click and choose *Open With →* your browser) in a modern desktop browser like Chrome, Edge, Firefox, or Safari.
3. You should immediately see the framed play area with a glowing ball bouncing around. If you only see a blank frame, reload the page or try the static server approach below to avoid local-file security restrictions in some browser setups.

**Most reliable (tiny server):**
1. Open a terminal in this folder (`cd hallway`).
2. Start a simple server: `python -m http.server 8000` (Python 3) or `npx serve` if you have Node installed.
3. Visit `http://localhost:8000` in your browser. You should see the bouncing ball immediately; no additional steps or build commands are required.

If you still see a blank canvas, confirm the JavaScript is loading by opening your browser’s developer console (F12/Cmd+Option+I) and checking for errors about `src/main.js`. Those typically mean the page isn’t being served from the same folder as the script, or the files weren’t fully downloaded—placing all files together and using the tiny server resolves this.

## Usage
1. Load the page.
2. Watch the ball bounce inside the framed play area.

## Testing
Run a quick syntax check to ensure the JavaScript file parses cleanly:

```
node --check src/main.js
```
