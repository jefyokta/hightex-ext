import type { BackgroundMessage } from "@/worker/background-worker"

export const injectScript = (id:string)=>{
        const body = {
                    recordIds:[id],
                    "download-format":"download-bibtex",
                    lite:true
                    }
                fetch("https://ieeexplore.ieee.org/rest/search/citation/format", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json, text/plain, */*",
                    "X-Security-Request": "required",
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-Mode": "cors"
                    },
                    body: JSON.stringify(body),
                    credentials: "include",
                    referrer: window.location.href
                })
                .then(r=>r.json())
                .then((r)=>{
                  const bib = r.data as string
                  chrome.runtime.sendMessage<BackgroundMessage,{ok:true}>({
                    action:"task",
                    taskName:"bib.scrap",
                    data:{
                      bibtex:bib
                    },
                    fresh:true
                  },async({ok}:{ok:boolean})=>{

                  })
                }


                )
 }