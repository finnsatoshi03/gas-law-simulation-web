import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { ACCOUNT_STATUS, getAccountStatusPath } from "@/lib/account-status";
import { AuthLoading } from "@/components/auth/AuthLoading";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const {
    error: profileError,
    isLoading: isProfileLoading,
    profile,
  } = useProfile();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isProfileLoading) {
    return <AuthLoading message="Checking your account..." />;
  }

  if (profileError || !profile) {
    return <Navigate replace to="/account/profile-error" />;
  }

  if (profile.status !== ACCOUNT_STATUS.ACTIVE) {
    return <Navigate replace to={getAccountStatusPath(profile.status)} />;
  }

  return <>{children}</>;
};
