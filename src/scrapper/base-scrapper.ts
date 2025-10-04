import CitationData from "./scrapper";

export default abstract class BaseScraper {
  protected citation: CitationData;

  constructor() {
    this.citation = new CitationData();
  }

  abstract collect(): void;

  protected queryMeta(name: string): string | null {
    return document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") || null;
  }

  public getCitation(): CitationData {
    return this.citation;
  }
}
