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

import {
  AppAccessSettings,
  FALLBACK_APP_ACCESS_SETTINGS,
  FeatureAccessSetting,
  listAccessControlSettings,
  updateAppAccessSettings as updateAppAccessSettingsRequest,
  updateFeatureAccessSetting as updateFeatureAccessSettingRequest,
} from "@/lib/access-control";
import { isDevAuthBypassEnabled } from "@/lib/dev-bypass";
import { FEATURE_REGISTRY, FeatureKey } from "@/lib/features";
import { getSupabaseClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { isAdminLevel } from "@/lib/permissions";

interface AccessControlContextType {
  appSettings: AppAccessSettings;
  canAccessFeature: (featureKey: FeatureKey) => boolean;
  featureSettings: Map<FeatureKey, FeatureAccessSetting>;
  getFeatureLockMessage: (featureKey: FeatureKey) => string | null;
  isAppLockedForCurrentUser: boolean;
  isFeatureLocked: (featureKey: FeatureKey) => boolean;
  isLoading: boolean;
  refreshAccessControls: () => Promise<void>;
  updateAppAccessSettings: (settings: {
    appLockMessage: string;
    isAppLocked: boolean;
  }) => Promise<AppAccessSettings>;
  updateFeatureAccessSetting: (settings: {
    featureKey: FeatureKey;
    isLocked: boolean;
    lockMessage: string;
  }) => Promise<FeatureAccessSetting>;
}

const AccessControlContext = createContext<AccessControlContextType | null>(
  null
);

export const AccessControlProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  const profileId = profile?.id ?? null;
  const requestIdRef = useRef(0);
  const [appSettings, setAppSettings] = useState<AppAccessSettings>(
    FALLBACK_APP_ACCESS_SETTINGS
  );
  const [featureSettings, setFeatureSettings] = useState<
    Map<FeatureKey, FeatureAccessSetting>
  >(new Map());
  const [hasLoaded, setHasLoaded] = useState(false);

  const refreshAccessControls = useCallback(async () => {
    // Dev-only bypass: the mock admin unlocks everything, so skip Supabase.
    if (isDevAuthBypassEnabled) {
      setAppSettings(FALLBACK_APP_ACCESS_SETTINGS);
      setFeatureSettings(new Map());
      setHasLoaded(true);
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (!isAuthenticated || !profileId) {
      setAppSettings(FALLBACK_APP_ACCESS_SETTINGS);
      setFeatureSettings(new Map());
      setHasLoaded(false);
      return;
    }

    try {
      const nextSettings = await listAccessControlSettings();

      if (requestIdRef.current !== requestId) {
        return;
      }

      setAppSettings(nextSettings.appSettings);
      setFeatureSettings(nextSettings.features);
      setHasLoaded(true);
    } catch {
      if (requestIdRef.current !== requestId) {
        return;
      }

      setAppSettings(FALLBACK_APP_ACCESS_SETTINGS);
      setFeatureSettings(new Map());
      setHasLoaded(true);
    }
  }, [isAuthenticated, profileId]);

  useEffect(() => {
    void refreshAccessControls();
  }, [refreshAccessControls]);

  useEffect(() => {
    if (isDevAuthBypassEnabled || !isAuthenticated || !profileId) {
      return;
    }

    const client = getSupabaseClient();
    const channel = client
      .channel("access-controls")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "app_access_settings",
        },
        () => void refreshAccessControls()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "feature_access_settings",
        },
        () => void refreshAccessControls()
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [isAuthenticated, profileId, refreshAccessControls]);

  const updateAppAccessSettings = useCallback(
    async (settings: { appLockMessage: string; isAppLocked: boolean }) => {
      const updatedSettings = await updateAppAccessSettingsRequest(settings);
      setAppSettings(updatedSettings);
      return updatedSettings;
    },
    []
  );

  const updateFeatureAccessSetting = useCallback(
    async (settings: {
      featureKey: FeatureKey;
      isLocked: boolean;
      lockMessage: string;
    }) => {
      const updatedSetting = await updateFeatureAccessSettingRequest(settings);

      setFeatureSettings((currentSettings) => {
        const nextSettings = new Map(currentSettings);
        nextSettings.set(updatedSetting.featureKey, updatedSetting);
        return nextSettings;
      });

      return updatedSetting;
    },
    []
  );

  const value = useMemo<AccessControlContextType>(() => {
    // Both admin tiers (Main Admin + Sub Admin) bypass feature/app locks.
    const currentUserIsAdmin = isAdminLevel(profile);

    const isFeatureLocked = (featureKey: FeatureKey) =>
      Boolean(featureSettings.get(featureKey)?.isLocked);

    const getFeatureLockMessage = (featureKey: FeatureKey) =>
      featureSettings.get(featureKey)?.lockMessage ?? null;

    const canAccessFeature = (featureKey: FeatureKey) =>
      currentUserIsAdmin || !isFeatureLocked(featureKey);

    return {
      appSettings,
      canAccessFeature,
      featureSettings,
      getFeatureLockMessage,
      isAppLockedForCurrentUser:
        Boolean(appSettings.isAppLocked) && !currentUserIsAdmin,
      isFeatureLocked,
      isLoading: Boolean(isAuthenticated && profileId) && !hasLoaded,
      refreshAccessControls,
      updateAppAccessSettings,
      updateFeatureAccessSetting,
    };
  }, [
    appSettings,
    featureSettings,
    hasLoaded,
    isAuthenticated,
    profile,
    profileId,
    refreshAccessControls,
    updateAppAccessSettings,
    updateFeatureAccessSetting,
  ]);

  return (
    <AccessControlContext.Provider value={value}>
      {children}
    </AccessControlContext.Provider>
  );
};

export const useAccessControl = () => {
  const context = useContext(AccessControlContext);

  if (!context) {
    throw new Error(
      "useAccessControl must be used within an AccessControlProvider"
    );
  }

  return context;
};

export const getDefaultFeatureSettings = () =>
  FEATURE_REGISTRY.map((feature) => ({
    feature,
    setting: null as FeatureAccessSetting | null,
  }));
