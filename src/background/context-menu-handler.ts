import type { ScrapperDocument } from "@/translator/scrapper/base-scrapper";
import { DOMParser } from "linkedom";
import { getHost, message } from "./helper";
import { getScrapper } from "@/translator/scrapper/scrapper-map";
import { IEEEScrapper } from "@/translator/ieee/scrapper";
import { injectScript } from "@/translator/ieee";
import { TaskManager } from "@/task/manager";


type MenuHandler = (info:chrome.contextMenus.OnClickData,tab?:chrome.tabs.Tab)=>any

export const ContextMenuHandler:Record<string,MenuHandler> = {
    copyBibtex:async(info,tab)=>{
        if (info.pageUrl) {       
           const parser = new DOMParser
           const res = await fetch(info.pageUrl)
           const html = await res.text()

           //@ts-ignore
            const document = parser.parseFromString(html,'text/html') as ScrapperDocument

            const url = getHost(info.pageUrl) || new URL("")
            if (url.host == 'ieeexplore.ieee.org') {
                message({
                    action:"task",
                    taskName:"ieee.bib",
                    data:{
                        documentId:"",
                        targetTab:tab?.id||0
                    },
                    fresh:true
                },
            
            ()=>{

                })     
              return;
                
            }
            
            const scrapper =getScrapper(document,url)          
            console.log(scrapper)
        //    await scrapper.collect()

           await chrome.action.openPopup()     
          await chrome.storage.local.set({bib:scrapper.toBib()})

        }
    }
}