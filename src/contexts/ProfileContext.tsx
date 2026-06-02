import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/contexts/AuthContext";
import { AccountStatus, isAccountStatus } from "@/lib/account-status";
import { getSupabaseClient } from "@/lib/supabase";

interface ProfileRow {
  id: string;
  auth_user_id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  status: unknown;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface UserProfile {
  id: string;
  authUserId: string;
  email: string | null;
  fullName: string | null;
  role: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

interface ProfileContextType {
  error: string | null;
  isLoading: boolean;
  profile: UserProfile | null;
  refreshProfile: () => Promise<void>;
}

const PROFILE_SELECT =
  "id, auth_user_id, email, full_name, role, status, created_at, updated_at, last_login_at";

const ProfileContext = createContext<ProfileContextType | null>(null);

const mapProfile = (row: ProfileRow): UserProfile | null => {
  if (!isAccountStatus(row.status)) {
    return null;
  }

  return {
    id: row.id,
    authUserId: row.auth_user_id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at,
  };
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const requestIdRef = useRef(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (!user) {
      setProfile(null);
      setError(null);
      setLoadedUserId(null);
      setIsRequestLoading(false);
      return;
    }

    setIsRequestLoading(true);
    setError(null);

    try {
      const { data, error: profileError } = await getSupabaseClient()
        .from("profiles")
        .select(PROFILE_SELECT)
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (requestIdRef.current !== requestId) {
        return;
      }

      if (profileError) {
        throw profileError;
      }

      if (!data) {
        setProfile(null);
        setError(
          "Your account profile is not available yet. Try again shortly or contact the administrator."
        );
        return;
      }

      const nextProfile = mapProfile(data as ProfileRow);

      if (!nextProfile) {
        setProfile(null);
        setError(
          "Your account has an unsupported status. Contact the administrator for assistance."
        );
        return;
      }

      setProfile(nextProfile);
    } catch {
      if (requestIdRef.current !== requestId) {
        return;
      }

      setProfile(null);
      setError(
        "We could not load your account profile. Check your connection and try again."
      );
    } finally {
      if (requestIdRef.current === requestId) {
        setLoadedUserId(user.id);
        setIsRequestLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      error,
      isLoading:
        Boolean(user) && (isRequestLoading || loadedUserId !== user?.id),
      profile,
      refreshProfile,
    }),
    [error, isRequestLoading, loadedUserId, profile, refreshProfile, user]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return context;
};
