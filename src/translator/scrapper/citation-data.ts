
export default class CitationData {
  public title: string = "";
  public authors: string[] = [];
  public journal?: string;
  public year?: string;
  public pages?:string;
  public doi?:string;
  public volume?:string
  public issue?:string
  public type:string = "journal";

  addAuthor(name: string) {
    if (name.trim()) {
      this.authors.push(name.trim());
    }
  }
  toBib(){
    let bib = ""
    bib += `@${this.type}{${this.makeId()},\n`
    bib +=  this.getMeta().filter((([k,v])=>!!v)).map(([k,v])=> `    ${k} = {${ v }}`).join(",\n")
    bib += "}"
    return bib
  }

  formatAuthorName(names:string[]){
   return names.map(n=>{
        const na =n.split(" ")
        const lastName = na.pop()
        if (lastName) {
          return lastName + (na.length > 0 ? ', '+na.join(" ") : '');          
        }
        return null
    }).join(" and ")


  }

  private makeId(){

   const author = this.authors.map(a=>{
      const names =a.split(" ")
      return names[names.length -1]
    })[0]     
   return ((author ? author.concat("_") : "" ) +this.title.split(" ").slice(0,2).join("_")+"_"+this.year).toLowerCase()
  }

  getMeta(){
    return   Object.entries(this)
    .filter(([k,v])=>k!=='type' || !v)
    .map(([k,v])=> {
      if (!!v) {       
        if (k == 'authors') {
          return [k,this.formatAuthorName(v) ]          
        }
      }
      return [k,v]
    }) 
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





