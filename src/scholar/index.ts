const observer = new MutationObserver(() => {
  const citePopup = document.querySelector("#gs_cit");
  if (citePopup && !citePopup.querySelector(".myapp-export")) {
    const bibLink = citePopup.querySelector<HTMLAnchorElement>('a.gs_citi');
    if (!bibLink) return;
    const btn = document.createElement("a");
    btn.textContent = "Export to Hightex";
    btn.href = "#";
    btn.className = "gs_citi myapp-export";
    btn.style.fontWeight = "bold";
    btn.style.color = "#1565c0";
    btn.style.marginLeft = "8px";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.runtime.sendMessage({ action: "fetchBib", url: bibLink.href}, (resp) => {
        if (!resp) { console.error("No response"); return; }
               if (resp.success) {
                const toast =document.createElement('div')
                toast.style.position = 'fixed'
                toast.style.right ='10px'
                toast.style.bottom ='10px'
                toast.textContent = "Berhasil"
                document.body.append(toast)
                setTimeout(() => {

                  toast.remove()
                  
                }, 1000);
                
        }
      });
    });

    bibLink.insertAdjacentElement("afterend", btn);
  }
});

observer.observe(document.body, { childList: true, subtree: true });

