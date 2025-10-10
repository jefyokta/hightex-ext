import type { Scrapper, ScrapperDocument } from "./base-scrapper";
import GeneralScraper from "./general";
import { IEEEScrapper } from "../ieee/scrapper";

type ScrapperFactory = (doc: ScrapperDocument,url:URL) => Scrapper;

export const ScrapperMap: Record<string, ScrapperFactory> = {
  "default-fallback": (document,url) => new GeneralScraper(document,url),
  "https://ieeexplore.ieee.org": (document,url) => new IEEEScrapper(document,url),
};


export const getScrapper:ScrapperFactory =(document,url)=> {
  const keys = Object.keys(ScrapperMap).filter((k) => k !== "default-fallback");


  const factory = url?.origin? ScrapperMap[url.origin] : ScrapperMap["default-fallback"];
  if (factory) {    
      return factory(document,url);
  }

  return new GeneralScraper(document,url)
}
