import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@/route";
import { useEffect } from "react";

export const LogOut = () => {
  const to = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      to({ path: "login" });
      return;
    }

    logout().then(() => {
      to({ path: "login" });
    });
  }, [user]); 

  return null;
};
