import type { Session, User } from "@supabase/supabase-js";

import type { UserProfile } from "@/contexts/ProfileContext";
import { ACCOUNT_STATUS } from "@/lib/account-status";
import { APP_ROLE } from "@/lib/permissions";

/**
 * Development-only authentication bypass.
 *
 * When `VITE_DEV_AUTH_BYPASS=true` AND the app is running a dev build
 * (`import.meta.env.DEV`), the auth/profile contexts skip Supabase and inject
 * a mock, fully-active admin user so every route guard passes without logging
 * in. The `import.meta.env.DEV` guard means this can NEVER take effect in a
 * production build, even if the flag leaks into a production env.
 */
export const isDevAuthBypassEnabled =
  import.meta.env.DEV &&
  String(import.meta.env.VITE_DEV_AUTH_BYPASS).toLowerCase() === "true";

/** Stable mock identifiers used across the auth, profile, and access mocks. */
const DEV_USER_ID = "00000000-0000-0000-0000-0000000000de";
const DEV_TIMESTAMP = "2024-01-01T00:00:00.000Z";

export const DEV_MOCK_USER = {
  id: DEV_USER_ID,
  aud: "authenticated",
  role: "authenticated",
  email: "dev@localhost",
  app_metadata: { provider: "dev-bypass" },
  user_metadata: { name: "Dev User" },
  created_at: DEV_TIMESTAMP,
} as unknown as User;

export const DEV_MOCK_SESSION = {
  access_token: "dev-bypass-access-token",
  refresh_token: "dev-bypass-refresh-token",
  token_type: "bearer",
  expires_in: 60 * 60 * 24 * 365,
  expires_at: 4102444800, // 2100-01-01, far future so it never looks expired
  user: DEV_MOCK_USER,
} as unknown as Session;

export const DEV_MOCK_PROFILE: UserProfile = {
  id: DEV_USER_ID,
  authUserId: DEV_USER_ID,
  email: "dev@localhost",
  fullName: "Dev User",
  // Admin so admin-only routes are reachable during local development.
  role: APP_ROLE.ADMIN,
  status: ACCOUNT_STATUS.ACTIVE,
  createdAt: DEV_TIMESTAMP,
  updatedAt: DEV_TIMESTAMP,
  lastLoginAt: DEV_TIMESTAMP,
  deletedAt: null,
  deletedBy: null,
};
