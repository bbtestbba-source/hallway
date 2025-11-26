# hallway project

A minimal Three.js scene that lets you send a glowing ball bouncing down a neon hallway. Use the sliders to tweak gravity, forward speed, and bounce factor in real time.

## Run locally

No build step is required, and the bundled copy of Three.js means you don't need network access. For the most reliable WebGL startup (especially with module loading restrictions in some browsers), serve the folder with a simple static server—for example, `python -m http.server 8000`—and visit `http://localhost:8000`. If you do open `index.html` directly, make sure your browser allows loading ES modules from local files and that the `vendor` folder sits next to `index.html`.

When the page loads, wait for the overlay to say the scene is ready, then click **Start simulation**. If the canvas stays blank, try refreshing or serving the folder from a local server.
