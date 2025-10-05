
type ResponseProps<T> = {
    success:boolean,
    data?:T
    message?:string
    error?:string
}
export type MessageActionCallback<TR = unknown,TM={action:string}> = (message: TM, sender: chrome.runtime.MessageSender, sendResponse: (response?: ResponseProps<TR>) => void)=>any


const  fetchBib: MessageActionCallback<string, {url:string}> = async(m,s,res)=>{
    try {
          const response = await fetch(m.url)
        const text = await response.text()
        res({
            success:true,
            message:"bib added",
            data:text

        })
    } catch (error) {
        res({
            success:false,
            error:"Error",
        })

        
    }
  
}


export const MessageAction:Record<string,any> = {
    fetchBib
}

