console.log("Backgroundjs loaded")

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    var title = activeTab.title
    var url = activeTab.url

    // Post a message back to ...?
  });

});
