import { route } from "@/config";
import { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  token?: string;
} | null;

export const useAuth = () => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    chrome.storage.session.get("user").then(({ user }) => {
      if (user) setUser(user);
    });
  }, []);

  const login = async (u: { password: string; email: string }) => {
    try {
      const res = await fetch(route("/api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(u),
      });

      const data = await res.json() as {
        message?: { user?: { name: string; email: string }; token: string };
      };
      console.log(data)
      if (res.ok) {
        const user: User = {
          name: data.message?.user?.name || "",
          email: data.message?.user?.email || "",
          token: data.message?.token,
        };
        chrome.storage.session.set({ user }).then(() => {
          chrome.storage.session.get("user").then(result => {
            setUser(result as User);
          });
        });
        return { message: "ok" };

      } else {
        return { error: (data as { error: string }).error || "Login failed" };
      }

    } catch {
      return { error: "No Internet" };
    }
  };

  const logout = async () => {
    const { user } = await chrome.storage.session.get("user");

    await fetch(route("/api/logout"), {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${user?.token}`,
      },
    });

    await chrome.storage.session.remove("user");
    setUser(null);
    return true;
  };

  const check = async () => {
    const { user } = await chrome.storage.session.get("user");
    if (!user?.token) return false;

    const r = await fetch(route("/api/me"), {
      headers: {
        "Authorization": `Bearer ${user.token}`,
      },
    });
    return r.ok;
  };

  return { user, login, logout, check };
};
