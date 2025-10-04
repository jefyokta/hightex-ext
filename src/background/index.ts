chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyBibtex",
    title: "Cite this",
    contexts: ["link", "page"]
  });
});
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "fetchBib") {
    fetch(msg.url)
      .then(res => res.text())
      .then(data => sendResponse({ success: true, content: data }))
      .catch(err => sendResponse({ success: false, error: err.toString() }));
    return true; 
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copyBibtex") {
    chrome.scripting.executeScript({
      target: { tabId: tab?.id! },
      func: test,
      args:[info]
    });
  }
});

const  test = async(props:any)=>{
//   console.log(argument)


}
