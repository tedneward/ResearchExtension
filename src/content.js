// content.js
console.log("ResearchExtension Loaded")

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("onMessage.addListener:", request.message, sender)
    if( request.message === "clicked_browser_action" ) {
      console.log(request);
    }
  }
);

