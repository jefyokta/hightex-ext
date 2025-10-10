import { TaskManager, type TaskName, type TaskResultMap, type TaskStatus } from "@/task/manager";
import { ContextMenuWorker } from "./context-menu-worker";

type MessageAction = "task" | "openPopUp"
export type TaskMessage<T extends TaskName> = {
  taskName: T;
  data: TaskResultMap[T];
  fresh:boolean,
  action:MessageAction
};

export type OpenPopupMessage = {
    action: MessageAction
};

export type BackgroundMessage = TaskMessage<TaskName> | OpenPopupMessage;

export class BackgroundWorker {

    static async onMessage(
        message:BackgroundMessage,
        _sender:any,
        res:(props:any)=>void
    ):Promise<boolean>
    {
       if( message.action == 'openPopUp'){
            await this.openPopUp()
            res({ok:true})
            return true
       }else if(message.action == 'task'){
           await this.task(message as TaskMessage<any>)
            res({ok:true})
            return true
       }
       res({ok:false})
       return false

    }
    static async onContextMenuClicked(info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab){

      await (new ContextMenuWorker(info,tab)).resolve()

    }
    static onInstalled(){
        ContextMenuWorker.make()       
    }

    static async openPopUp(){
        await chrome.action.openPopup()        
    }

    static async task<T extends TaskName>(m:TaskMessage<T>){
        await TaskManager.removeEveryExpireTasks()
        const data = m.fresh ?{
        result:m.data,
        createdAt: Date.now(),
        status:"pending" as TaskStatus
        } :{result:m.data}
        TaskManager.set(m.taskName,data)
    }
}