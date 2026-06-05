import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useAccessControl } from "@/contexts/AccessControlContext";
import { useAccessMessages } from "@/contexts/AccessMessagesContext";
import { ACCOUNT_STATUS, getAccountStatusPath } from "@/lib/account-status";
import { ACCESS_MESSAGE_KEY } from "@/lib/access-messages";
import { AppLockedPage } from "@/components/access/LockedAccessPages";
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
  const {
    appSettings,
    isAppLockedForCurrentUser,
    isLoading: isAccessLoading,
  } = useAccessControl();
  const { getAccessMessage } = useAccessMessages();
  const location = useLocation();
  const appLockedMessage = getAccessMessage(ACCESS_MESSAGE_KEY.APP_LOCKED);

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

  if (profile.deletedAt) {
    return <Navigate replace to="/account/deleted" />;
  }

  if (profile.status !== ACCOUNT_STATUS.ACTIVE) {
    return <Navigate replace to={getAccountStatusPath(profile.status)} />;
  }

  if (isAccessLoading) {
    return <AuthLoading message="Checking access..." />;
  }

  if (isAppLockedForCurrentUser) {
    return (
      <AppLockedPage
        message={appSettings.appLockMessage || appLockedMessage.description}
        title={appLockedMessage.title}
      />
    );
  }

  return <>{children}</>;
};
