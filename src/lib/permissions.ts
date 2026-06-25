import { ACCOUNT_STATUS, AccountStatus } from "@/lib/account-status";

export const APP_ROLE = {
  ADMIN: "admin",
  SUB_ADMIN: "sub_admin",
  USER: "user",
} as const;

export type AppRole = (typeof APP_ROLE)[keyof typeof APP_ROLE];

/** Human-readable labels for each role, used across admin UI. */
export const ROLE_LABELS: Record<AppRole, string> = {
  [APP_ROLE.ADMIN]: "Main Admin",
  [APP_ROLE.SUB_ADMIN]: "Sub Admin",
  [APP_ROLE.USER]: "Standard User",
};

export const PERMISSION = {
  ACCESS_ADMIN_DASHBOARD: "access_admin_dashboard",
  MANAGE_ACCESS_CONTROLS: "manage_access_controls",
  MANAGE_USERS: "manage_users",
  /** Assign/remove any role (incl. sub_admin). Main Admin only. */
  ASSIGN_ROLES: "assign_roles",
} as const;

export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION];

interface PermissionProfile {
  deletedAt?: string | null;
  role: AppRole;
  status: AccountStatus;
}

/** Minimal shape needed to authorize an action against another account. */
interface RoleTarget {
  deletedAt?: string | null;
  id?: string;
  role: AppRole;
}

const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  [APP_ROLE.ADMIN]: [
    PERMISSION.ACCESS_ADMIN_DASHBOARD,
    PERMISSION.MANAGE_ACCESS_CONTROLS,
    PERMISSION.MANAGE_USERS,
    PERMISSION.ASSIGN_ROLES,
  ],
  [APP_ROLE.SUB_ADMIN]: [
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

/** Main Admin: full control, protected from sub admins. */
export const isMainAdmin = (profile: PermissionProfile | null) =>
  hasRole(profile, APP_ROLE.ADMIN);

/** Sub Admin: limited admin helper. */
export const isSubAdmin = (profile: PermissionProfile | null) =>
  hasRole(profile, APP_ROLE.SUB_ADMIN);

/** Either admin tier (Main Admin or Sub Admin). */
export const isAdminLevel = (profile: PermissionProfile | null) =>
  isMainAdmin(profile) || isSubAdmin(profile);

/**
 * Backwards-compatible alias. Historically `isAdmin` meant "has admin powers".
 * It now covers both admin tiers so existing call sites (sidebar/home admin
 * link, feature-lock bypass) treat sub admins as staff. Use `isMainAdmin` where
 * Main-Admin-only behavior is required.
 */
export const isAdmin = isAdminLevel;

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

const isActor = (actor: PermissionProfile | null) =>
  Boolean(
    actor &&
      !actor.deletedAt &&
      actor.status === ACCOUNT_STATUS.ACTIVE
  );

/**
 * Whether `actor` may manage `target` at all (status changes, deletion).
 * - Main Admin: may manage anyone (further guards like last-active-admin and
 *   self-protection are enforced separately and in the backend).
 * - Sub Admin: may only manage standard users that are not deleted.
 * - Standard User: never.
 */
export const canManageUser = (
  actor: PermissionProfile | null,
  target: RoleTarget | null
): boolean => {
  if (!isActor(actor) || !target || target.deletedAt) {
    return false;
  }

  if (isMainAdmin(actor)) {
    return true;
  }

  if (isSubAdmin(actor)) {
    return target.role === APP_ROLE.USER;
  }

  return false;
};

/** Only a Main Admin may assign roles, and only the three supported roles. */
export const canAssignRole = (
  actor: PermissionProfile | null,
  role: AppRole
): boolean => isMainAdmin(actor) && isActor(actor) && isAppRole(role);

/** Suspend/reactivate authorization mirrors general management rules. */
export const canSuspendUser = (
  actor: PermissionProfile | null,
  target: RoleTarget | null
): boolean => canManageUser(actor, target);

/** Deletion: manageable target, and never the actor's own account. */
export const canDeleteUser = (
  actor: PermissionProfile | null,
  target: RoleTarget | null,
  actorProfileId?: string | null
): boolean => {
  if (!canManageUser(actor, target)) {
    return false;
  }

  if (actorProfileId && target?.id && actorProfileId === target.id) {
    return false;
  }

  return true;
};
