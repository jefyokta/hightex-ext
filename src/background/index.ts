import { ContextMenuHandler } from "./context-menu-handler";
import { MessageAction, type MessageActionCallback } from "./message-action";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyBibtex",
    title: "Cite this",
    contexts: ["link", "page"]
  });
});

chrome.runtime.onMessage.addListener(async(msg, sender, sendResponse) => {

  const func = MessageAction[msg.action as string];
  if(func){ 
      await  (func as MessageActionCallback)(msg,sender,sendResponse)
      return true;
  }
 
});

chrome.contextMenus.onClicked.addListener(async(info, tab) => {


  const handler = ContextMenuHandler[info.menuItemId]
    if (handler) {
    await handler(info,tab)    
    }
});


