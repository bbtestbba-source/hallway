const STORAGE_KEY = "draftInspector";

const ensureDefaultState = async () => {
  const existing = await chrome.storage.local.get(STORAGE_KEY);
  if (!existing[STORAGE_KEY]) {
    await chrome.storage.local.set({
      [STORAGE_KEY]: {
        drafts: [],
        updatedAt: Date.now()
      }
    });
  }
};

chrome.runtime.onInstalled.addListener(() => {
  ensureDefaultState();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "draftInspector:addDrafts") {
    return;
  }

  chrome.storage.local.get(STORAGE_KEY, (data) => {
    const state = data[STORAGE_KEY] || { drafts: [], updatedAt: Date.now() };
    const existing = new Map(state.drafts.map((draft) => [draft.id, draft]));
    for (const draft of message.payload || []) {
      if (!draft || !draft.id) {
        continue;
      }
      existing.set(draft.id, { ...draft, lastSeenAt: Date.now() });
    }
    const updatedDrafts = Array.from(existing.values()).sort(
      (a, b) => b.lastSeenAt - a.lastSeenAt
    );
    chrome.storage.local.set(
      {
        [STORAGE_KEY]: {
          drafts: updatedDrafts,
          updatedAt: Date.now()
        }
      },
      () => {
        sendResponse({ ok: true, count: updatedDrafts.length });
      }
    );
  });

  return true;
});
