import { TaskManager, type Task } from "@/task/manager";
import { IEEEScrapper } from "@/translator/ieee/scrapper";
import type { ScrapperDocument } from "@/translator/scrapper/base-scrapper";
import GeneralScraper from "@/translator/scrapper/general";

export interface ResolverInstance {
  collect: () => Task<"bib.scrap", "done"> | Task<"bib.fetch", "pending"> | undefined;
}

export interface ResolverConstructor {
  new (document: ScrapperDocument, url: URL, target?: number): ResolverInstance;
}

export class ContextMenuWorker {
  private id = "scrapBibTex";
  private url: URL;
  private resolvers: Record<string, ResolverConstructor> = {};

  constructor(
    private info?: chrome.contextMenus.OnClickData,
    private tab?: chrome.tabs.Tab
  ) {
    this.url = new URL(this.info?.pageUrl || "");
    this.registResolver("ieeexplore.ieee.org", IEEEScrapper);
  }

  async resolve() {
    const ResolverClass = this.resolvers[this.url.host];
    const parser = new DOMParser();
    const res = await fetch(this.url.href);
    const html = await res.text();

    const document = parser.parseFromString(html, "text/html") as ScrapperDocument;
    let task;

    if (!ResolverClass) {
      const scrapper = new GeneralScraper(document, this.url);
      task = scrapper.collect();
    } else {
      const resolver = new ResolverClass(document, this.url, this.tab?.id);
      task = resolver.collect();
    }

    if (task) {
      await TaskManager.set(task.taskName, task);
    }
  }

  private registResolver(host: string, resolver: ResolverConstructor) {
    this.resolvers[host] = resolver;
  }

  static make() {
    const instance = new this();
    chrome.contextMenus.create({
      id: instance.id,
      title: "Cite this",
      contexts: ["link", "page"],
    });
  }
}
