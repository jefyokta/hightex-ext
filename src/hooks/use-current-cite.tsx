import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { bibToObject, CiteUtils } from "bibtex.js";

type CurrentCiteContextType = {
  bib: string;
  setBib: React.Dispatch<React.SetStateAction<string>>;
  cite?: CiteUtils;
};

export const CurrentCiteContext = createContext<CurrentCiteContextType>({
  bib: "",
  setBib: () => {},
  cite: undefined,
});

export const Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const [bib, setBib] = useState("");
  const [cite, setCite] = useState<CiteUtils>();

  useEffect(() => {
    if (!bib) return
    const cit = bibToObject(bib)[0];
    if (!cit ) return;
    setCite(new CiteUtils(cit));
  }, [bib]);

  return (
    <CurrentCiteContext.Provider value={{ bib, setBib, cite }}>
      {children}
    </CurrentCiteContext.Provider>
  );
};

export const useCite = () => useContext(CurrentCiteContext);
