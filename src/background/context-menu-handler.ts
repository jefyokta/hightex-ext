

type MenuHandler = (info:chrome.contextMenus.OnClickData,tab?:chrome.tabs.Tab)=>any

export const ContextMenuHandler:Record<string,MenuHandler> = {
    copyBibTex:(info,tab)=>{
            chrome.scripting.executeScript({
                target: { tabId: tab?.id! },
                func: (props)=>{},
                args:[info]
            })
    }
}