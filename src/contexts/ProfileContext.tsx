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
import { DEV_MOCK_PROFILE, isDevAuthBypassEnabled } from "@/lib/dev-bypass";
import { AppRole, isAppRole } from "@/lib/permissions";
import { getSupabaseClient } from "@/lib/supabase";

interface ProfileRow {
  id: string;
  auth_user_id: string;
  email: string | null;
  full_name: string | null;
  role: unknown;
  status: unknown;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface UserProfile {
  id: string;
  authUserId: string;
  email: string | null;
  fullName: string | null;
  role: AppRole;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

interface ProfileContextType {
  error: string | null;
  isLoading: boolean;
  profile: UserProfile | null;
  refreshProfile: () => Promise<void>;
}

const PROFILE_SELECT =
  "id, auth_user_id, email, full_name, role, status, created_at, updated_at, last_login_at, deleted_at, deleted_by";

const ProfileContext = createContext<ProfileContextType | null>(null);

const mapProfile = (row: ProfileRow): UserProfile | null => {
  if (!isAccountStatus(row.status) || !isAppRole(row.role)) {
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
    deletedAt: row.deleted_at,
    deletedBy: row.deleted_by,
  };
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const requestIdRef = useRef(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    // Dev-only bypass: never touch Supabase, the mock profile is served below.
    if (isDevAuthBypassEnabled) {
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (!userId) {
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
        .eq("auth_user_id", userId)
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
        setLoadedUserId(userId);
        setIsRequestLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    if (isDevAuthBypassEnabled || !userId) {
      return;
    }

    const client = getSupabaseClient();
    const channel = client
      .channel(`profile:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          filter: `auth_user_id=eq.${userId}`,
          schema: "public",
          table: "profiles",
        },
        () => void refreshProfile()
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [refreshProfile, userId]);

  const value = useMemo(
    () => {
      if (isDevAuthBypassEnabled) {
        return {
          error: null,
          isLoading: false,
          profile: DEV_MOCK_PROFILE,
          refreshProfile,
        };
      }

      const hasLoadedProfileForCurrentUser =
        Boolean(userId) &&
        loadedUserId === userId &&
        profile?.authUserId === userId;

      return {
        error,
        isLoading:
          Boolean(userId) &&
          !hasLoadedProfileForCurrentUser &&
          (isRequestLoading || loadedUserId !== userId),
        profile,
        refreshProfile,
      };
    },
    [error, isRequestLoading, loadedUserId, profile, refreshProfile, userId]
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
