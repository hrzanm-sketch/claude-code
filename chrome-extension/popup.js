document.addEventListener("DOMContentLoaded", () => {
  loadTabCount();
  loadVisitCount();
  loadCurrentPage();
  loadNotes();

  document.getElementById("save-notes").addEventListener("click", saveNotes);
});

async function loadTabCount() {
  const tabs = await chrome.tabs.query({});
  document.getElementById("tab-count").textContent = tabs.length;
}

async function loadVisitCount() {
  const result = await chrome.storage.local.get("visitCount");
  const count = result.visitCount || 0;
  document.getElementById("visit-count").textContent = count;
}

async function loadCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    document.getElementById("page-title").textContent =
      tab.title || "No title";
    document.getElementById("page-url").textContent = tab.url || "No URL";
  }
}

async function loadNotes() {
  const result = await chrome.storage.local.get("quickNotes");
  if (result.quickNotes) {
    document.getElementById("notes").value = result.quickNotes;
  }
}

async function saveNotes() {
  const notes = document.getElementById("notes").value;
  await chrome.storage.local.set({ quickNotes: notes });

  const status = document.getElementById("save-status");
  status.textContent = "Saved!";
  setTimeout(() => {
    status.textContent = "";
  }, 2000);
}
