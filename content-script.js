const DRAFT_PATH = "/drafts";
const DRAFT_SELECTOR = [
  "[data-testid*='draft']",
  "[data-testid*='Draft']",
  "[data-testid*='asset']",
  "[data-testid*='Asset']",
  "[aria-label*='Draft']",
  "[aria-label*='draft']",
  "article",
  "li",
  "div"
].join(",");

const FLOAT_BUTTON_ID = "draft-inspector-button";
const PANEL_ID = "draft-inspector-panel";
const BADGE_ID = "draft-inspector-badge";

const inspectorState = {
  observedCount: 0,
  pending: false,
  panelOpen: false
};

const isDraftsPage = () => window.location.pathname.startsWith(DRAFT_PATH);

const getThumbnailUrl = (element) => {
  const img = element.querySelector("img");
  if (img && img.src) {
    return img.src;
  }
  const background = window.getComputedStyle(element).backgroundImage;
  const match = background && background.match(/url\\(\"?(.*?)\"?\\)/);
  return match ? match[1] : "";
};

const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  );
};

const getDraftId = (element, index) => {
  const dataId =
    element.getAttribute("data-id") ||
    element.getAttribute("data-testid") ||
    element.getAttribute("id");
  if (dataId) {
    return dataId;
  }
  const link = element.querySelector("a[href]");
  if (link && link.href) {
    return link.href;
  }
  return `draft-${index}-${element.textContent?.trim().slice(0, 30) || "unknown"}`;
};

const collectDrafts = () => {
  const nodes = Array.from(document.querySelectorAll(DRAFT_SELECTOR));
  const drafts = [];
  nodes.forEach((node, index) => {
    const thumbnailUrl = getThumbnailUrl(node);
    if (!thumbnailUrl) {
      return;
    }
    const title =
      node.querySelector("h1,h2,h3,h4")?.textContent?.trim() ||
      node.getAttribute("aria-label") ||
      node.textContent?.trim().slice(0, 80) ||
      "Untitled draft";
    drafts.push({
      id: getDraftId(node, index),
      title,
      thumbnailUrl,
      pageUrl: window.location.href,
      inView: isInViewport(node)
    });
  });
  return drafts;
};

const sendDrafts = async () => {
  if (inspectorState.pending) {
    return;
  }
  inspectorState.pending = true;
  const drafts = collectDrafts();
  if (drafts.length > 0) {
    chrome.runtime.sendMessage(
      {
        type: "draftInspector:addDrafts",
        payload: drafts
      },
      () => {
        inspectorState.pending = false;
      }
    );
  } else {
    inspectorState.pending = false;
  }
};

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "draftInspector:refresh") {
    sendDrafts();
  }
});

const loadStoredDrafts = async () => {
  const data = await chrome.storage.local.get("draftInspector");
  return data.draftInspector?.drafts || [];
};

const saveDrafts = async (drafts) => {
  await chrome.storage.local.set({
    draftInspector: {
      drafts,
      updatedAt: Date.now()
    }
  });
};

const injectStyles = () => {
  if (document.getElementById("draft-inspector-styles")) {
    return;
  }
  const style = document.createElement("style");
  style.id = "draft-inspector-styles";
  style.textContent = `
    #${FLOAT_BUTTON_ID} {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
      padding: 12px 14px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      background: rgba(20, 24, 40, 0.95);
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    #${PANEL_ID} {
      position: fixed;
      bottom: 70px;
      right: 20px;
      width: 390px;
      height: 480px;
      background: rgba(12, 14, 24, 0.97);
      color: #e9eefc;
      z-index: 2147483647;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
      resize: both;
      overflow: hidden;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
    }
    #${PANEL_ID} header {
      padding: 10px;
      font-weight: 800;
      cursor: move;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #${PANEL_ID} .body {
      padding: 10px;
      font-size: 13px;
      overflow: auto;
      flex: 1;
    }
    #${PANEL_ID} .draft-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }
    #${PANEL_ID} .draft-card {
      background: rgba(30, 36, 60, 0.7);
      border-radius: 10px;
      padding: 6px;
    }
    #${PANEL_ID} .draft-card img {
      width: 100%;
      height: 70px;
      object-fit: cover;
      border-radius: 8px;
      display: block;
    }
    #${PANEL_ID} .draft-card p {
      margin: 6px 0 0;
      font-size: 11px;
      line-height: 1.3;
    }
    #${PANEL_ID} .controls {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    #${PANEL_ID} button {
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(40, 50, 90, 0.6);
      color: #fff;
      cursor: pointer;
      font-weight: 600;
    }
    #${BADGE_ID} {
      position: fixed;
      bottom: 8px;
      left: 8px;
      z-index: 2147483647;
      padding: 4px 8px;
      font-size: 11px;
      border-radius: 8px;
      background: rgba(20, 24, 40, 0.9);
      color: #9fb3ff;
      border: 1px solid rgba(255, 255, 255, 0.18);
      font-family: system-ui, sans-serif;
    }
  `;
  document.head.appendChild(style);
};

const injectBadge = () => {
  if (document.getElementById(BADGE_ID)) {
    return;
  }
  const badge = document.createElement("div");
  badge.id = BADGE_ID;
  badge.textContent = "Draft Inspector active";
  document.documentElement.appendChild(badge);
};

const renderPanel = async (panel) => {
  const drafts = await loadStoredDrafts();
  const body = panel.querySelector(".body");
  body.innerHTML = "";

  const stats = document.createElement("div");
  stats.textContent = `Saved drafts: ${drafts.length}`;
  body.appendChild(stats);

  const controls = document.createElement("div");
  controls.className = "controls";

  const refreshButton = document.createElement("button");
  refreshButton.textContent = "Refresh now";
  refreshButton.addEventListener("click", () => {
    sendDrafts();
    renderPanel(panel);
  });

  const clearButton = document.createElement("button");
  clearButton.textContent = "Clear saved";
  clearButton.addEventListener("click", async () => {
    await saveDrafts([]);
    renderPanel(panel);
  });

  controls.appendChild(refreshButton);
  controls.appendChild(clearButton);
  body.appendChild(controls);

  const grid = document.createElement("div");
  grid.className = "draft-grid";
  drafts.forEach((draft) => {
    const card = document.createElement("div");
    card.className = "draft-card";
    const img = document.createElement("img");
    img.src = draft.thumbnailUrl;
    img.alt = draft.title || "Draft thumbnail";
    const title = document.createElement("p");
    title.textContent = draft.title || "Untitled draft";
    card.appendChild(img);
    card.appendChild(title);
    grid.appendChild(card);
  });
  body.appendChild(grid);
};

const enableDrag = (panel, handle) => {
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  handle.addEventListener("mousedown", (event) => {
    dragging = true;
    offsetX = event.clientX - panel.offsetLeft;
    offsetY = event.clientY - panel.offsetTop;
    document.body.style.userSelect = "none";
  });

  window.addEventListener("mousemove", (event) => {
    if (!dragging) {
      return;
    }
    panel.style.left = `${event.clientX - offsetX}px`;
    panel.style.top = `${event.clientY - offsetY}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
    document.body.style.userSelect = "";
  });
};

const togglePanel = () => {
  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    existing.remove();
    inspectorState.panelOpen = false;
    return;
  }

  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  const header = document.createElement("header");
  header.textContent = "Sora Draft Inspector";

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => togglePanel());
  header.appendChild(closeButton);

  const body = document.createElement("div");
  body.className = "body";

  panel.appendChild(header);
  panel.appendChild(body);
  document.documentElement.appendChild(panel);
  enableDrag(panel, header);
  inspectorState.panelOpen = true;
  renderPanel(panel);
};

const injectFloatingButton = () => {
  if (document.getElementById(FLOAT_BUTTON_ID)) {
    return;
  }
  const button = document.createElement("button");
  button.id = FLOAT_BUTTON_ID;
  button.textContent = "Drafts";
  button.addEventListener("click", togglePanel);
  document.documentElement.appendChild(button);
};

const startObservers = () => {
  sendDrafts();
  const observer = new MutationObserver(() => {
    inspectorState.observedCount += 1;
    if (inspectorState.observedCount % 5 === 0) {
      sendDrafts();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY % 300 === 0) {
      sendDrafts();
    }
  });
};

const boot = () => {
  if (!isDraftsPage()) {
    return;
  }
  injectStyles();
  injectBadge();
  injectFloatingButton();
  startObservers();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
