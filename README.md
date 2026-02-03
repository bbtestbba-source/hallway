# Sora Draft Inspector Extension

This project is now a lightweight Chrome extension that collects draft thumbnails
from the Sora drafts page as you scroll and surfaces them in a popup called the
**Draft Inspector**. The popup remembers previously seen drafts, so you can jump
back without scrolling all the way down again.

## What it does

- Watches the drafts page for cards with thumbnails and caches them locally.
- Shows saved thumbnails, titles, and the last-seen timestamp in the popup.
- Lets you refresh the cache or clear it entirely.

## Install locally (Chrome)

1. Open Chrome and go to `chrome://extensions`.
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select this project folder.
4. Visit `https://sora.chatgpt.com/drafts` (or your drafts URL) and scroll.
5. Click the extension icon to open **Draft Inspector** and review saved drafts.

## Notes

- The extension stores thumbnails in `chrome.storage.local`.
- The selectors in `content-script.js` are intentionally broad to work with
  multiple draft card layouts. If nothing is captured, open the console to
  inspect the draft card markup and refine the selectors.
