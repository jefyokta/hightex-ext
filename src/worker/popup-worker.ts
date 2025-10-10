import { injectScript } from "@/translator/ieee";
import { TaskManager, type DoneTaskResultMap, type Task, type TaskName, type TaskResultMap } from "@/task/manager";

type WorkerTaskResult<T extends TaskName,TD extends boolean =boolean> = {
  done: TD;
} & (TD extends true 
    ? {data:DoneTaskResultMap}
    : {data?:TaskResultMap[T]}) ;

export class PopUpWorker {
  private static workIn: TaskName[] = ["scholar.fetch", "ieee.bib"];
  private static doneTask: TaskName[] = [];
  static async scholarFetch(
    task: Task<"scholar.fetch", "pending">
  ): Promise<WorkerTaskResult<"scholar.fetch">> {
    const { url } = task.result || {};
    if (!url) return { done: false };

    try {
      const res = await fetch(url);
      const text = await res.text();
      return {
        done: true,
        data: { bibtex:text}, 
      };
    } catch {
      return { done: false };
    }
  }

  static async ieeeBib(task: Task<"ieee.bib", "pending">): Promise<WorkerTaskResult<"ieee.bib">> {
    const { documentId, targetTab } = task.result as { documentId: string; targetTab: number };
    if (!documentId || !targetTab) return { done: false };

    try {
      await chrome.scripting.executeScript({
        func: injectScript,
        args: [documentId],
        target: { tabId: targetTab },
      });
      return { done: true };
    } catch (e) {
      console.error("Failed inject:", e);
      return { done: false };
    }
  }

  static async onTask<T extends TaskName>(task: Task<T, "pending">) {
    if (!this.workIn.includes(task.taskName)) return;

    let result: WorkerTaskResult<T> = { done: false };

    switch (task.taskName) {
      case "scholar.fetch":
        result = (await this.scholarFetch(
          task as Task<"scholar.fetch", "pending">
        )) as WorkerTaskResult<T>;
        break;

      case "ieee.bib":
        result = (await this.ieeeBib(
          task as Task<"ieee.bib", "pending">
        )) as WorkerTaskResult<T>;
        break;

      default:
        console.warn("Unhandled task:", task.taskName);
    }

    if (result.done) {
      await TaskManager.set(task.taskName, {
        result:(task as Task<T,"done">).result,
        status: "done",
      });
      this.doneTask.push(task.taskName);
    }
  }

  static onTaskDone<T extends TaskName>(
    task: Task<T, "done">,
    callback: (task: Task<T, "done">) => any
  ) {
    if (this.doneTask.includes(task.taskName)) {
      callback(task);
    }
  }
}
