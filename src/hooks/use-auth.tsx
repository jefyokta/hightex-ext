import { route } from "@/config";
import { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  token?: string;
} | null;

export const useAuth = () => {
  const login = async (u: { password: string; email: string }) => {
    try {
      const res = await fetch(route("/api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(u),
      });

      const {data }= await res.json() as {
       data:{ user?: { name: string; email: string }; token: string;}
      };
      if (res.ok) {
        const userb: User = {
          name: data.user?.name || "",
          email: data.user?.email || "",
          token: data.token,
        };
        chrome.storage.session.set({ user: userb }).then(() => {
          chrome.storage.session.get("user").then(result => {
          });
        });
        return { message: "ok" };

      } else {
        return { error: "Login failed" };
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

  return { login, logout, check };
};
