import { TaskManager, type Task } from "@/task/manager";
import BaseScraper from "../scrapper/base-scrapper";
type IEEEReqeustBody = {
    recordIds:string[],
    "download-format":"download-bibtex",
    lite:boolean

}

export class IEEEScrapper extends BaseScraper{
    private static patterns: RegExp[] = [  
        /abstract\/document\/(\d+)(?:\/(authors|references|citations|keywords|metrics))?/
    ];
    private bib?:string
    collect(){     

        if (this.shouldFetch(this.url)) {
            const task = TaskManager.make({
                taskName:"bib.fetch",
                status:"pending",
                result:{
                    documentId:IEEEScrapper.getDocumentId(this.url)||"",
                    targetTab:this.target || 0
                },
                createdAt:Date.now()
            })
            return task as Task<"bib.fetch","pending">
            
        }
        this.extractTitle()
        return undefined;        
    }

    static getDocumentId(url:URL){
      return  url.pathname.match(this.patterns[0]!)![1]
    }


    async fetch(){
        if (!this.url) {
            return false;
        }
        const result = IEEEScrapper.patterns[0] && this.url?.pathname.match(IEEEScrapper.patterns[0])
        console.log(result)
        if (!result ) return false
        if (!result[1]) return false

        const body:IEEEReqeustBody = {
            recordIds:[result[1]],
            "download-format":"download-bibtex",
            lite:true
        }
        console.log(body)
        try {

        const res = await fetch("https://ieeexplore.ieee.org/rest/search/citation/format", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            "X-Security-Request": "required",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors"
        },
        body: JSON.stringify(body),
        credentials: "include",
        });
                
        console.log(res)
            const json = await res.json();
            return json.data as string

        } catch (error) {
            console.log(error)
            return false
            
        }
       
        
    
    }

     shouldFetch(url:URL){
        const match = url.pathname.match(IEEEScrapper.patterns[0] as RegExp)
        return !match || !match[1]
        

    }
    extractTitle(){
       const title =this.query(".document-title > span")?.textContent
       if (title) {
        this.citation.title = title       
       }
    }
    extractType(){
        // this.citation.
    }

    public override isCollectPromise(): boolean {
        return true;
    }

    citeButton(){
       return this.query('#xplMainContentLandmark > div > xpl-document-details > div > div.document-main.global-content-width-w-rr > section.document-main-header.row.g-0 > div > xpl-document-header > section > div.document-header-inner-container.row.g-0 > div > div > div.row.g-0.document-title-fix > div > div.left-container.w-100 > div > div:nth-child(2) > xpl-cite-this-modal > div > button')

    }


    override toBib(): string {
        return this.bib ? this.bib : this.citation.toBib()
    }


    
}
