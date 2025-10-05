import { config } from "@/config";
import { useEffect, useState } from "react";

type User<T = {}> = {
  name: string;
  email: string;
} & T | null;

export const useAuth = () => {
  const [user, setUser] = useState<User>(null);
  // useEffect(() => {
  //   chrome.storage.session.get("user").then((res) => {
  //     if (res.user) setUser(res.user);
  //   });

  //   const listener = (
  //     changes: Record<string, chrome.storage.StorageChange>,
  //     areaName: string
  //   ) => {
  //     if (areaName === "session" && changes.user) {
  //       setUser(changes.user.newValue || null);
  //     }
  //   };

  //   chrome.storage.onChanged.addListener(listener);

  //   return () => {
  //     chrome.storage.onChanged.removeListener(listener);
  //   };
  // }, []);

  const login = async (user: { password: string; email: string }) => {

    const res = await fetch(`${config.serverHost}/api/login`, {
      method: "post",
      body: JSON.stringify(user)
    })
    const data = await res.json() as Promise<{ message: { user: { name: string, email: string }, token: string } }>

    return res.ok
    // await chrome.storage.session.set({ user: newUser });
    // setUser(user);
  };

  const logout = async () => {
    // await chrome.storage.session.remove("user");
    setUser(null);
  };

  return { user, login, logout };
};
