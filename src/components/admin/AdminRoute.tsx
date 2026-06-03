import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { AuthLoading } from "@/components/auth/AuthLoading";
import { useProfile } from "@/contexts/ProfileContext";
import { ACCOUNT_STATUS, getAccountStatusPath } from "@/lib/account-status";
import { canAccess, PERMISSION } from "@/lib/permissions";

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { error, isLoading, profile } = useProfile();

  if (isLoading) {
    return <AuthLoading message="Checking administrator access..." />;
  }

  if (error || !profile) {
    return <Navigate replace to="/account/profile-error" />;
  }

  if (profile.status !== ACCOUNT_STATUS.ACTIVE) {
    return <Navigate replace to={getAccountStatusPath(profile.status)} />;
  }

  if (!canAccess(profile, PERMISSION.ACCESS_ADMIN_DASHBOARD)) {
    return <Navigate replace to="/access-denied" />;
  }

  return <>{children}</>;
};

