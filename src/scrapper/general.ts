import BaseScraper from "./base-scrapper";

export default class GeneralScraper extends BaseScraper {
  collect() {
    this.extractTitle();
    this.extractAuthors();
    this.extractJournal();
    this.extractYear();
  }

  private extractTitle() {
    const title =
      this.queryMeta("citation_title") ||
      document.title ||
      document.querySelector("h1")?.textContent;
    if (title) this.citation.title = title.trim();
  }

  private extractAuthors() {
    document.querySelectorAll("meta[name='citation_author']").forEach((e) => {
      const name = e.getAttribute("content");
      if (name) this.citation.addAuthor(name);
    });
  }

  private extractJournal() {
    const journal = this.queryMeta("citation_journal_title");
    if (journal) this.citation.journal = journal;
  }

  private extractYear() {
    const year = this.queryMeta("citation_publication_date");
    if (year) this.citation.year = year.split("-")[0];
  }
}
