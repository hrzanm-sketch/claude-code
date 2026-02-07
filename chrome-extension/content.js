// Content script - runs on every page
// Can interact with the DOM of the visited page

(function () {
  "use strict";

  // Send page metadata to the extension when requested
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "getPageInfo") {
      sendResponse({
        title: document.title,
        url: window.location.href,
        description:
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute("content") || "",
        wordCount: document.body?.innerText.split(/\s+/).length || 0,
      });
    }
  });
})();
