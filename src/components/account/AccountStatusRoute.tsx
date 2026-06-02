import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AuthLoading } from "@/components/auth/AuthLoading";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import {
  ACCOUNT_STATUS,
  AccountStatus,
  getAccountStatusPath,
} from "@/lib/account-status";

interface AccountStatusRouteProps {
  children: ReactNode;
  expectedStatus?: AccountStatus;
  profileIssue?: boolean;
}

export const AccountStatusRoute = ({
  children,
  expectedStatus,
  profileIssue = false,
}: AccountStatusRouteProps) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    error: profileError,
    isLoading: isProfileLoading,
    profile,
  } = useProfile();
  const location = useLocation();

  if (isAuthLoading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (isProfileLoading) {
    return <AuthLoading message="Checking your account..." />;
  }

  if (profileError || !profile) {
    return profileIssue ? (
      <>{children}</>
    ) : (
      <Navigate replace to="/account/profile-error" />
    );
  }

  if (profileIssue) {
    return <Navigate replace to={getAccountStatusPath(profile.status)} />;
  }

  if (profile.status === ACCOUNT_STATUS.ACTIVE) {
    return <Navigate replace to="/home" />;
  }

  if (profile.status !== expectedStatus) {
    return <Navigate replace to={getAccountStatusPath(profile.status)} />;
  }

  return <>{children}</>;
};

