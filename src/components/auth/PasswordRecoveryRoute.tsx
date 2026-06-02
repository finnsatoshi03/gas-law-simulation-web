import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { AuthLoading } from "./AuthLoading";

export const PasswordRecoveryRoute = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isAuthenticated, isLoading, isPasswordRecovery } = useAuth();

  if (isLoading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated && !isPasswordRecovery) {
    return <Navigate replace to="/forgot-password" />;
  }

  return <>{children}</>;
};

