import {
  FEATURE_REGISTRY,
  FeatureKey,
  isFeatureKey,
} from "@/lib/features";
import { getSupabaseClient } from "@/lib/supabase";

export const DEFAULT_APP_LOCK_MESSAGE =
  "The Gas Law Simulation app is temporarily unavailable. Please check back later.";

export const DEFAULT_FEATURE_LOCK_MESSAGE =
  "This feature is currently locked by the administrator.";

export interface AppAccessSettings {
  appLockMessage: string;
  createdAt: string | null;
  isAppLocked: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface FeatureAccessSetting {
  createdAt: string | null;
  featureKey: FeatureKey;
  id: string;
  isLocked: boolean;
  lockMessage: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

interface AppAccessSettingsRow {
  app_lock_message: string | null;
  created_at: string | null;
  is_app_locked: boolean | null;
  updated_at: string | null;
  updated_by: string | null;
}

interface FeatureAccessSettingsRow {
  created_at: string | null;
  feature_key: unknown;
  id: string;
  is_locked: boolean | null;
  lock_message: string | null;
  updated_at: string | null;
  updated_by: string | null;
}

export const FALLBACK_APP_ACCESS_SETTINGS: AppAccessSettings = {
  appLockMessage: DEFAULT_APP_LOCK_MESSAGE,
  createdAt: null,
  isAppLocked: false,
  updatedAt: null,
  updatedBy: null,
};

const mapAppAccessSettings = (
  row: AppAccessSettingsRow | null | undefined
): AppAccessSettings =>
  row
    ? {
        appLockMessage: row.app_lock_message || DEFAULT_APP_LOCK_MESSAGE,
        createdAt: row.created_at,
        isAppLocked: Boolean(row.is_app_locked),
        updatedAt: row.updated_at,
        updatedBy: row.updated_by,
      }
    : FALLBACK_APP_ACCESS_SETTINGS;

const mapFeatureAccessSetting = (
  row: FeatureAccessSettingsRow
): FeatureAccessSetting | null => {
  if (!isFeatureKey(row.feature_key)) {
    return null;
  }

  return {
    createdAt: row.created_at,
    featureKey: row.feature_key,
    id: row.id,
    isLocked: Boolean(row.is_locked),
    lockMessage: row.lock_message || DEFAULT_FEATURE_LOCK_MESSAGE,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
};

const getSafeAccessControlError = (error: unknown, fallback: string) => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("administrator access is required")) {
    return "Your administrator access is no longer available.";
  }

  if (
    message.includes("permission denied") ||
    message.includes("row-level security")
  ) {
    return "You do not have permission to update access controls.";
  }

  if (message.includes("feature key is required")) {
    return "Select a valid feature before updating access controls.";
  }

  return fallback;
};

export const listAccessControlSettings = async () => {
  const client = getSupabaseClient();
  const [{ data: appData, error: appError }, { data: featureData, error }] =
    await Promise.all([
      client
        .from("app_access_settings")
        .select(
          "is_app_locked, app_lock_message, updated_by, created_at, updated_at"
        )
        .eq("id", 1)
        .maybeSingle(),
      client
        .from("feature_access_settings")
        .select(
          "id, feature_key, is_locked, lock_message, updated_by, created_at, updated_at"
        )
        .in(
          "feature_key",
          FEATURE_REGISTRY.map((feature) => feature.key)
        )
        .order("feature_key", { ascending: true }),
    ]);

  if (appError || error) {
    throw new Error(
      getSafeAccessControlError(
        appError ?? error,
        "Could not load access-control settings."
      )
    );
  }

  const features = new Map<FeatureKey, FeatureAccessSetting>();

  for (const row of (featureData ?? []) as FeatureAccessSettingsRow[]) {
    const setting = mapFeatureAccessSetting(row);

    if (setting) {
      features.set(setting.featureKey, setting);
    }
  }

  return {
    appSettings: mapAppAccessSettings(appData as AppAccessSettingsRow | null),
    features,
  };
};

export const updateAppAccessSettings = async ({
  appLockMessage,
  isAppLocked,
}: {
  appLockMessage: string;
  isAppLocked: boolean;
}) => {
  const { data, error } = await getSupabaseClient().rpc(
    "admin_update_app_access_settings",
    {
      next_app_lock_message: appLockMessage,
      next_is_app_locked: isAppLocked,
    }
  );

  if (error) {
    throw new Error(
      getSafeAccessControlError(
        error,
        "Could not update the app lock settings."
      )
    );
  }

  return mapAppAccessSettings(data as AppAccessSettingsRow | null);
};

export const updateFeatureAccessSetting = async ({
  featureKey,
  isLocked,
  lockMessage,
}: {
  featureKey: FeatureKey;
  isLocked: boolean;
  lockMessage: string;
}) => {
  const { data, error } = await getSupabaseClient().rpc(
    "admin_update_feature_access_setting",
    {
      next_is_locked: isLocked,
      next_lock_message: lockMessage,
      target_feature_key: featureKey,
    }
  );

  if (error) {
    throw new Error(
      getSafeAccessControlError(
        error,
        "Could not update the feature lock setting."
      )
    );
  }

  const row = Array.isArray(data) ? data[0] : data;
  const setting = mapFeatureAccessSetting(row as FeatureAccessSettingsRow);

  if (!setting) {
    throw new Error("The updated feature lock setting was not returned.");
  }

  return setting;
};
