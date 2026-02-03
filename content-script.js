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

const inspectorState = {
  observedCount: 0,
  pending: false
};

const getThumbnailUrl = (element) => {
  const img = element.querySelector("img");
  if (img && img.src) {
    return img.src;
  }
  const background = window.getComputedStyle(element).backgroundImage;
  const match = background && background.match(/url\\(\"?(.*?)\"?\\)/);
  return match ? match[1] : "";
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
      pageUrl: window.location.href
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startObservers);
} else {
  startObservers();
}
