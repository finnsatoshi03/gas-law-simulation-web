import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

/**
 * Shared logout logic so every placement (sidebar, navbar, home) uses a single
 * implementation while still rendering a button that matches its surroundings.
 */
export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    let logoutError: string | undefined;

    try {
      await logout();
    } catch (error) {
      logoutError =
        error instanceof Error
          ? error.message
          : "You were logged out locally, but the sign-out request could not be completed.";
    } finally {
      navigate("/login", {
        replace: true,
        state: logoutError ? { logoutError } : undefined,
      });
    }
  };

  return { handleLogout, isLoggingOut };
};
