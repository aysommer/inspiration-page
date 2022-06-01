
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
   if (changeInfo.status != 'complete') {
      return;
   }
});