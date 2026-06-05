import { ACCOUNT_STATUS, AccountStatus } from "@/lib/account-status";

export const APP_ROLE = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type AppRole = (typeof APP_ROLE)[keyof typeof APP_ROLE];

export const PERMISSION = {
  ACCESS_ADMIN_DASHBOARD: "access_admin_dashboard",
  MANAGE_ACCESS_CONTROLS: "manage_access_controls",
  MANAGE_USERS: "manage_users",
} as const;

export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION];

interface PermissionProfile {
  deletedAt?: string | null;
  role: AppRole;
  status: AccountStatus;
}

const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  [APP_ROLE.ADMIN]: [
    PERMISSION.ACCESS_ADMIN_DASHBOARD,
    PERMISSION.MANAGE_ACCESS_CONTROLS,
    PERMISSION.MANAGE_USERS,
  ],
  [APP_ROLE.USER]: [],
};

export const isAppRole = (value: unknown): value is AppRole =>
  Object.values(APP_ROLE).some((role) => role === value);

export const hasRole = (
  profile: PermissionProfile | null,
  role: AppRole
) => profile?.role === role && !profile.deletedAt;

export const isAdmin = (profile: PermissionProfile | null) =>
  hasRole(profile, APP_ROLE.ADMIN);

export const canAccess = (
  profile: PermissionProfile | null,
  permission: Permission
) =>
  Boolean(
    profile &&
      !profile.deletedAt &&
      profile.status === ACCOUNT_STATUS.ACTIVE &&
      ROLE_PERMISSIONS[profile.role].includes(permission)
  );
