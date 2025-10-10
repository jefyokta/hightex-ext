import { TaskManager, type Task } from "@/task/manager";
import BaseScraper, { type ScrapperDocument } from "./base-scrapper";

export default class GeneralScraper extends BaseScraper {
  collect() {
    this.extractTitle();
    this.extractAuthors();
    this.extractJournal();
    this.extractYear();
    this.extractPages()
    this.extractIssue()
    this.extractType()
    this.extractDoi()
    this.extractVolume()
    const task = TaskManager.make(
      {
      taskName:"bib.scrap",
      status:"done",
      result:{bibtex:this.citation.toBib()},
      createdAt:Date.now()
    })
    return task 
  }
  private extractTitle() {
    const title =
      this.queryMeta("citation_title") ||
      this.document.title ||
      this.document.querySelector("h1")?.textContent;
    if (title) this.citation.title = title.trim();
  }

  private extractAuthors() {
    this.document.querySelectorAll("meta[name='citation_author']").forEach((e:any) => {
      const name = e.getAttribute("content");
      if (name) this.citation.addAuthor(name);
    });
  }

  private extractJournal() {
    const journal = this.queryMeta("citation_journal_title");
    if (journal) this.citation.journal = journal;
  }

  private extractPages(){
  const pages =[];
   const f = this.queryMeta("citation_firstpage")
   const l = this.queryMeta("citation_lastpage");
   f && pages.push(f)
   l && pages.push(f)
   this.citation.pages = pages.length > 0 ? pages.join('--') :undefined
  }
  private extractType(){
    this.citation.type = (this.queryMeta("DC.Type.articleType") || "misc").toLowerCase()

  }

  private extractIssue(){

    this.citation.issue = this.queryMeta("citation_issue") || undefined
  }


  private extractVolume(){
    this.citation.volume = this.queryMeta("citation_volume") || undefined

  }
  private extractDoi(){
    this.citation.doi = this.queryMeta("citation_doi") || undefined
  }
  private extractYear() {
    const year = this.queryMeta("citation_publication_date") || this.queryMeta("citation_date");
    if (year) {
      this.citation.year = year.includes("-") ? year.split("-")[0] : year.split("/")[0]

    }else{
      this.citation.year = (new Date).getFullYear().toString()
    }
  }
  override toBib(): string {
    return this.citation.toBib()
  }
}
