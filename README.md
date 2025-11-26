# Hallway Bouncing Ball

A single-file HTML that draws a glowing ball racing down a stylized hallway on a 2D canvas. Open the file directly or serve it—no external assets or builds required.

## How to run

1. Locate `index.html` in this folder.
2. Either double-click it (opens via `file://`) **or** start a tiny local server and browse to it:
   ```sh
   python -m http.server 8000
   # then visit http://localhost:8000
   ```
3. Watch the ball bounce its way down the corridor. Double-click the canvas to pause/resume.

The page bundles all logic inline, so it works without a network connection. Using a local server is optional; it simply mimics typical hosting if you prefer.

## How it works

- A 2D canvas renders a perspective hallway and a glowing ball projected with a simple focal-length transform.
- Physics apply gravity, wall bounces, and a forward push while the camera follows from behind, giving a chase view down the tunnel.
- Resize events keep the scene full-bleed inside the framed container.
