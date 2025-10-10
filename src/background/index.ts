import { TaskManager, type Task, type TaskName, type TaskResultMap, type TaskStatus } from "@/task/manager";
import { ContextMenuHandler } from "./context-menu-handler";
import { BackgroundWorker, type BackgroundMessage } from "@/worker/background-worker";


chrome.runtime.onInstalled.addListener(() => {
  BackgroundWorker.onInstalled()
});

chrome.contextMenus.onClicked.addListener(async(info, tab) => {
 await BackgroundWorker.onContextMenuClicked(info,tab)
});
chrome.runtime.onMessage.addListener(async(m:BackgroundMessage, sm, res) => {
  return await BackgroundWorker.onMessage(m,sm,res)
});

