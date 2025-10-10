export type TaskStatus = "pending" | "done" | "error";

export type TaskResultMap = {
  "scholar.fetch": { url:string };
  "bib.fetch": { bibtex: string;  };
  "bib.scrap": string;
  "ieee.bib":{ documentId:string,targetTab:number }
};

type BibTeX = {bibtex:string}

export type DoneTaskResultMap = BibTeX

export type TaskName = keyof TaskResultMap;


export type Task<T extends TaskName,Tstatus extends TaskStatus = "pending"> = {
  taskName:TaskName  
  status: Tstatus | TaskStatus;
  createdAt: number;
} & (Tstatus  extends "done"
  ? { result:DoneTaskResultMap }   
  : { result:TaskResultMap[T] }); ;

export type TaskNameWithValue<T extends TaskName,TS extends TaskStatus = "pending">={
    taskName:T,
    task:Task<T,TS>
}

export type StorageListener = (
  changes: { [key: string]: chrome.storage.StorageChange },
  areaName: chrome.storage.AreaName
) => any;

export class TaskManager {
  static expire = 10000;
  static async set<T extends TaskName>(taskname: TaskName, data: Partial<Task<T>>) {
    const existing = (await chrome.storage.local.get(taskname))[taskname] as Task<T> | undefined;
   
    const task = {
      taskName:taskname, 
      status: data.status ?? existing?.status ?? "pending",
      result: data.result ?? existing?.result ?? null,
      createdAt: data.createdAt ?? existing?.createdAt ?? Date.now(),
    };

    await chrome.storage.local.set({ [taskname]: task });
    return task as Task<T>;
  }

static make<T extends TaskName,S extends TaskStatus>(
  task:Task<T,S>
): Task<T,S> {
 return task
}


  static isTaskExpire<T extends TaskName>(task:Task<T>){
    return  Date.now() - task.createdAt > this.expire
  }

  static async removeIfExpire<T extends TaskName>(task:Task<T>){

    if (this.isTaskExpire(task)) {
       await  this.clear(task.taskName)
       
    }
  }

static async removeEveryExpireTasks() {
    const all = await chrome.storage.local.get(null); 
    const entries = Object.entries(all) as [string, any][];

    const expiredKeys: string[] = [];

    for (const [key, value] of entries) {
      if (
        value &&
        typeof value === "object" &&
        "createdAt" in value &&
        Date.now() - value.createdAt > this.expire
      ) {
        expiredKeys.push(key);
      }
    }

    if (expiredKeys.length > 0) {
      await chrome.storage.local.remove(expiredKeys);
      console.log(`[TaskManager] Removed expired tasks:`, expiredKeys);
    }
  }

  static async done(taskName:TaskName,remove = false){

    const task = await this.get(taskName)
    if (!task || task.status == 'done') {
        throw new Error("Task doesnt exists or already done");
        
    }
    if (remove) {
        await this.clear(taskName)
        return        
    }
    await   this.set(taskName,{status:"done"})

  }

  static async bulkCreate<T extends TaskName>(tasks:TaskNameWithValue<T>[]){
    return Promise.all(tasks.map(t=>this.set(t.taskName,t.task)))

  }

  static async get<T extends TaskName>(taskname: TaskName): Promise<Task<T> | null> {
    const res = await chrome.storage.local.get(taskname);
    return (res[taskname] as Task<T>) ?? null;
  }

  static async clear(taskname: TaskName) {
    await chrome.storage.local.remove(taskname);
  }

  static watch<TN extends TaskName,TCReturn = any>(taskname: TN, callback: (task: Task<TN> | null) =>TCReturn) {
    const listener: StorageListener = (changes, area) => {
      if (area === "local" && changes[taskname] && changes[taskname].newValue !== changes[taskname].oldValue) {
         callback(changes[taskname].newValue || null);
       
      }
    };
    
    chrome.storage.onChanged.addListener(listener);
    return listener;
}
  static watchMulti<TN extends TaskName,TCReturn = any>(taskNames: TN[], callback: (tasks: Task<TN>[]) =>TCReturn) {
    const listener: StorageListener = (changes, area) => {
        if (area !== "local") return;

        const changedKeys = taskNames.filter((key) => changes[key]);
        if (!changedKeys.length) return;

        const changedTasks = changedKeys
        .map((key) => changes[key]?.newValue as Task<TN> | undefined)
        .filter((t): t is Task<TN> => !!t);
         callback(changedTasks);
        
    };    
    chrome.storage.onChanged.addListener(listener);
    return listener;
}
  static doMulti<TN extends TaskName, TReturn = any>(
    taskNames: TN[],
    callBack: (tasks: Task<TN>[]) => TReturn
    ) {
   const listener = this.watchMulti(taskNames,(tasks)=>{
      if (tasks.find(t=>t.status=='pending')) {      
          callBack(tasks)
      }
      })

  chrome.storage.onChanged.addListener(listener);
  return listener;
}


  static unwatch(listener: StorageListener) {
    chrome.storage.onChanged.removeListener(listener);
  }

  static do<T extends TaskName,TCReturn = any>(taskName:T,callback:(task:Task<T>)=>TCReturn){
    const listener =  this.watch(taskName,(task)=>{
        if (task && task.status == 'pending') {
            if (this.isTaskExpire(task)) {
                this.removeIfExpire(task)
                return                
            }
            callback(task)            
        }

    })

    return listener

  }

  static async wait<T extends TaskName>(taskname: TaskName, timeout = 10000): Promise<Task<T> | null> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.unwatch(listener);
        resolve(null);
      }, timeout);

      const listener = this.watch(taskname, (task) => {
        if (task && (task.status === "done" || task.status === "error")) {
          clearTimeout(timer);
          this.unwatch(listener);
          resolve(task as Task<T>);
        }
      });
    });
  }
}
