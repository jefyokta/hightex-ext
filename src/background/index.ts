import { ContextMenuHandler } from "./context-menu-handler";
import { MessageAction, type MessageActionCallback } from "./message-action";
const {storage } = chrome
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyBibtex",
    title: "Cite this",
    contexts: ["link", "page"]
  });
});



chrome.contextMenus.onClicked.addListener(async(info, tab) => {
  const handler = ContextMenuHandler[info.menuItemId]
    if (handler) {
    await handler(info,tab)    
    }
});
chrome.runtime.onMessage.addListener((m, sm, res) => {
  if (m.action === "openPopUp") {
    chrome.action.openPopup()
      .then(() => {
        res({ ok: true })}
      )
      .catch((e) => {console.log(e);res({ ok: false });});
    return true;
  }

  if (m.action == "getUrl") {
  storage.local.get<{ lastUrl?: { value: string, used: boolean } }>("lastUrl")
    .then(async (r) => {
      if (r && r.lastUrl?.value && !r.lastUrl.used) {
        const resp = await fetch(r.lastUrl.value)
        const text = await resp.text()

        await storage.local.set({
          lastUrl: { value: "", used: true }
        })

        res({ ok: true, data: text })
      } else {
        res({ ok: false })
      }
    })
    .catch(e => {
      console.error(e)
      res({ ok: false })
    })
  return true
}


  if (m.action == "setUrl") {
    storage.local.set({
      lastUrl:{value:m.url,used:false}
    })
    .then(r=>res({ok:true}))
    .catch(e=>res({ok:false}))

    return true;

  }

  res({ ok: false });
  return true;
});

