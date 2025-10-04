
export default class CitationData {
  public title: string = "";
  public authors: string[] = [];
  public journal?: string;
  public year?: string;

  addAuthor(name: string) {
    if (name.trim()) {
      this.authors.push(name.trim());
    }
  }

  toJSON() {
    return {
      title: this.title,
      authors: this.authors,
      journal: this.journal,
      year: this.year,
    };
  }
}





