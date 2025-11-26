# hallway project

A minimal Three.js scene that lets you send a glowing ball bouncing down a neon hallway. Use the sliders to tweak gravity, forward speed, and bounce factor in real time.

## Run locally

No build step is required. For the most reliable WebGL startup (especially with module loading restrictions in some browsers), serve the folder with a simple static server—for example, `python -m http.server 8000`—and visit `http://localhost:8000`. If you do open `index.html` directly, make sure your browser allows loading external modules from local files.

When the page loads, wait for the overlay to say the scene is ready, then click **Start simulation**. If the canvas stays blank, try refreshing or serving the folder from a local server.
