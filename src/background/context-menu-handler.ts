import GeneralScraper from "@/scrapper/general"


type MenuHandler = (info:chrome.contextMenus.OnClickData,tab?:chrome.tabs.Tab)=>any

export const ContextMenuHandler:Record<string,MenuHandler> = {
    copyBibTex:(info,tab)=>{
       const scrapper =new GeneralScraper()
       scrapper.collect()
       console.log(scrapper.getCitation())
    }
}