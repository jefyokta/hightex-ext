import CitationData from "./citation-data";
import type { Task } from "@/task/manager";


export type ScrapperDocument = Document | HTMLDocument

export interface Scrapper {
  toBib: () => string;
}

type CollectReturnType = Task<"bib.fetch","pending"> | Task<"bib.scrap","done"> | undefined;
export default abstract class BaseScraper implements Scrapper {
  protected citation: CitationData;


  constructor(protected document: ScrapperDocument,protected url:URL,protected target?:number) {
    this.citation = new CitationData();
  }
  abstract  collect():CollectReturnType| Promise<CollectReturnType>;

  abstract toBib():string;
 
  public isCollectPromise(){
    return false;
  }

  protected queryMeta(name: string): string | null {
    return this.document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") || null;
  }

  protected query(name:string){

    return this.document.querySelector(name)
  }

  public getCitation(): CitationData {
    return this.citation;
  }
}
