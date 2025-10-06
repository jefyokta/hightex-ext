
type Message = <TResponse,TMessage extends { action: string }>(
  m: TMessage,
  resCallback: (props: TResponse & { ok: boolean }) => any
) => any;

export const message: Message = (m, resCallback) =>
  chrome.runtime.sendMessage(m, resCallback);
