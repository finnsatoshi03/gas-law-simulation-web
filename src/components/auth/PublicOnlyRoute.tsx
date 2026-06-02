import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { AuthLoading } from "./AuthLoading";

export const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoading />;
  }

  if (isAuthenticated) {
    return <Navigate replace to="/home" />;
  }

  return <>{children}</>;
};

