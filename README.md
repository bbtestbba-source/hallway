# hallway project

A tiny mobile-friendly starter app.

## Quick test from Chrome address bar (recommended)

If you are chatting in Chrome and a tappable link does nothing, paste this into Chrome's address bar manually:

```text
data:text/html,<button onclick="document.body.append(' Hello')" style="font-size:22px;padding:14px 18px">Tap Me</button>
```

Then tap **Tap Me** and it will show **Hello**.

## What this does

- Shows a button.
- When you tap it, it displays `Hello` on screen.

## Run the full demo on your phone (hosted file method)

1. Put `index.html` somewhere you can access (GitHub Pages, Netlify Drop, or any static hosting).
2. Open that URL in your phone browser.
3. Tap **Tap Me** and you should see `Hello`.

## Run locally on a computer first (optional)

```bash
python3 -m http.server 8000
```

Then open: <http://localhost:8000>
