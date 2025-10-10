import type { BackgroundMessage } from ".";

export type Message = <TResponse>(
  m: BackgroundMessage,
  resCallback: (props: TResponse & { ok: boolean }) => any
) => any;

export const message: Message = (m, resCallback) =>
  chrome.runtime.sendMessage(m, resCallback);


export const getHost = (url: string) => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

export const createToast = (message:string, type = "info") => {
  let container = document.querySelector("#ext-toast-container");
  if (!container) {
    container = document.createElement("div");
    //@ts-ignore
    Object.assign(container.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      zIndex: 999999,
    });
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.textContent = message;

  const colors = {
    info: "#007bff",
    success: "#28a745",
    warning: "#ffc107",
    error: "#dc3545",
  };

  Object.assign(toast.style, {
    background: colors[type as "info"] || colors.info,
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    fontSize: "14px",
    fontFamily: "sans-serif",
    opacity: "0",
    transform: "translateY(10px)",
    transition: "opacity 0.3s, transform 0.3s",
  });

  container.appendChild(toast);

  return container
};
