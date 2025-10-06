import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { bibToObject, CiteUtils } from "bibtex.js";
import { route } from "@/config";

type CurrentCiteContextType = {
  bib: string;
  setBib: React.Dispatch<React.SetStateAction<string>>;
  cite?: CiteUtils;
  store: () => Promise<Response>,
  getReference: () => Promise<{ bib?: {bib:string}[],error?:string }>
};

export const CurrentCiteContext = createContext<CurrentCiteContextType>({
  bib: "",
  setBib: () => { },
  cite: undefined,
  // @ts-ignore
  store: async () => { return await null },
  getReference: async () => { return await {} }
});

export const Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const [bib, setBib] = useState("");
  const [cite, setCite] = useState<CiteUtils>();
  const store = async () => {
    return chrome.storage.session.get("user").then(r => {
      return fetch(route("/api/reference"), {
        method: "post",
        headers: {
          "Authorization": `Bearer ${r?.user?.token}`
        },
        body: JSON.stringify({ bib })
      })
    })
  }

  const getReference = async () => {
    return chrome.storage.session.get("user").then(r => {
      return fetch(route("/api/reference"), {
        headers: {
          "Authorization": `Bearer ${r?.user?.token}`
        },
      }).then(res => res.json())
        .then(r => r)
        .catch(e => {
          console.log(e)
          return e;
        })
    })
  }
  useEffect(() => {
    if (!bib) return
    const cit = bibToObject(bib)[0];
    if (!cit) return;
    setCite(new CiteUtils(cit));
  }, [bib]);

  return (
    <CurrentCiteContext.Provider value={{ bib, setBib, cite, store, getReference }}>
      {children}
    </CurrentCiteContext.Provider>
  );
};

export const useCite = () => useContext(CurrentCiteContext);
