// Background service worker - runs in the background
// Tracks page visits and handles extension lifecycle events

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.local.set({ visitCount: 0, installedAt: Date.now() });
    console.log("Extension installed successfully.");
  }
});

// Track page visits by listening to tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    const result = await chrome.storage.local.get("visitCount");
    const count = (result.visitCount || 0) + 1;
    await chrome.storage.local.set({ visitCount: count });
  }
});
