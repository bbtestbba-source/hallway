const STORAGE_KEY = "draftInspector";

const draftList = document.getElementById("draftList");
const emptyState = document.getElementById("emptyState");
const draftCount = document.getElementById("draftCount");
const lastUpdated = document.getElementById("lastUpdated");
const refreshButton = document.getElementById("refreshButton");
const clearButton = document.getElementById("clearButton");

const formatDate = (timestamp) => {
  if (!timestamp) {
    return "--";
  }
  return new Date(timestamp).toLocaleString();
};

const renderDrafts = (drafts) => {
  draftList.innerHTML = "";
  if (!drafts || drafts.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";
  drafts.forEach((draft) => {
    const li = document.createElement("li");
    li.className = "draft-card";

    const img = document.createElement("img");
    img.className = "draft-thumb";
    img.alt = draft.title || "Draft thumbnail";
    img.src = draft.thumbnailUrl;

    const info = document.createElement("div");

    const title = document.createElement("p");
    title.className = "draft-title";
    title.textContent = draft.title || "Untitled draft";

    const meta = document.createElement("p");
    meta.className = "draft-meta";
    meta.textContent = "Last seen: " + formatDate(draft.lastSeenAt);

    info.appendChild(title);
    info.appendChild(meta);

    li.appendChild(img);
    li.appendChild(info);
    draftList.appendChild(li);
  });
};

const loadDrafts = async () => {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  const state = data[STORAGE_KEY] || { drafts: [], updatedAt: 0 };
  renderDrafts(state.drafts);
  draftCount.textContent = state.drafts.length;
  lastUpdated.textContent = formatDate(state.updatedAt);
};

refreshButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: "draftInspector:refresh" });
  }
  loadDrafts();
});

clearButton.addEventListener("click", async () => {
  await chrome.storage.local.set({
    [STORAGE_KEY]: { drafts: [], updatedAt: Date.now() }
  });
  loadDrafts();
});

document.addEventListener("DOMContentLoaded", loadDrafts);
