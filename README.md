# Sora Draft Inspector Extension

This project is now a lightweight Chrome extension that collects draft thumbnails
from the Sora drafts page as you scroll and surfaces them in a floating **Draft
Inspector** panel plus the extension popup. The inspector remembers previously
seen drafts, so you can jump back without scrolling all the way down again.

## What it does

- Watches the drafts page for cards with thumbnails and caches them locally.
- Shows saved thumbnails, titles, and the last-seen timestamp in the popup and
  on-page inspector.
- Lets you refresh the cache or clear it entirely.

## Install locally (Chrome)

1. Open Chrome and go to `chrome://extensions`.
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select this project folder.
4. Visit `https://sora.chatgpt.com/drafts` (or your drafts URL) and scroll.
5. Click the floating **Drafts** button on the page (bottom-right) to open the
   inspector panel, or click the extension icon to open the popup.

## Notes

- The extension stores thumbnails in `chrome.storage.local`.
- The selectors in `content-script.js` are intentionally broad to work with
  multiple draft card layouts. If nothing is captured, open the console to
  inspect the draft card markup and refine the selectors.
