import { ACCOUNT_STATUS, AccountStatus, isAccountStatus } from "./account-status";
import { APP_ROLE, AppRole, isAppRole, isMainAdmin, ROLE_LABELS } from "./permissions";
import { getSupabaseClient } from "./supabase";

export interface AdminProfile {
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

export interface ProfileCounts {
  totalUsers: number;
  pendingUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  rejectedUsers: number;
}

export type ProfileSort = "created_at" | "email" | "full_name" | "last_login_at";
export type SortDirection = "asc" | "desc";
export type ProfileDeletionFilter = "current" | "deleted" | "all";

interface ListAdminProfilesOptions {
  deletion: ProfileDeletionFilter;
  page: number;
  pageSize: number;
  role: AppRole | "all";
  search: string;
  sortBy: ProfileSort;
  sortDirection: SortDirection;
  status: AccountStatus | "all";
}

export interface ListAdminProfilesResult {
  profiles: AdminProfile[];
  total: number;
}

const PROFILE_SELECT =
  "id, auth_user_id, email, full_name, role, status, created_at, updated_at, last_login_at, deleted_at, deleted_by";

const mapProfile = (row: ProfileRow): AdminProfile => {
  if (!isAppRole(row.role) || !isAccountStatus(row.status)) {
    throw new Error("A profile contains an unsupported role or status.");
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

const mapRpcProfile = (data: unknown) => {
  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    throw new Error("The updated user profile was not returned.");
  }

  return mapProfile(row as ProfileRow);
};

const getSafeAdminError = (error: unknown, fallback: string) => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("administrator access is required")) {
    return "Your administrator access is no longer available.";
  }

  if (message.includes("at least one active administrator")) {
    return "This change would remove the last active administrator.";
  }

  if (message.includes("unsupported account status transition")) {
    return "That account status change is not allowed.";
  }

  if (message.includes("profile not found")) {
    return "The selected user profile no longer exists.";
  }

  if (message.includes("administrators cannot delete their own account")) {
    return "You cannot delete your own administrator account.";
  }

  if (message.includes("profile is already deleted")) {
    return "The selected user is already deleted.";
  }

  if (message.includes("profile is not deleted")) {
    return "The selected user is not deleted.";
  }

  if (message.includes("deleted profiles cannot be changed")) {
    return "Deleted users cannot be changed.";
  }

  if (message.includes("sub administrators can only manage standard users")) {
    return "Sub Admins can only manage standard users.";
  }

  if (message.includes("sub administrators cannot modify administrator accounts")) {
    return "Sub Admins cannot modify administrator accounts.";
  }

  if (message.includes("sub administrators cannot change account roles")) {
    return "Sub Admins cannot change account roles.";
  }

  if (message.includes("unsupported account role")) {
    return "That account role is not supported.";
  }

  if (
    message.includes("permission denied") ||
    message.includes("row-level security")
  ) {
    return "You do not have permission to perform this action.";
  }

  return fallback;
};

/**
 * Returns true when an error message reflects a protection rule blocking a
 * sub-admin (used to decide whether to record a `protected_action_blocked` log).
 */
export const isProtectedActionError = (error: unknown): boolean => {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error ?? "").toLowerCase();

  return (
    message.includes("sub administrators") ||
    message.includes("sub admins") ||
    message.includes("administrator access is required") ||
    message.includes("at least one active administrator")
  );
};

const sanitizeSearch = (value: string) =>
  value.trim().replace(/[,%()]/g, " ").replace(/\s+/g, " ");

export const listAdminProfiles = async ({
  deletion,
  page,
  pageSize,
  role,
  search,
  sortBy,
  sortDirection,
  status,
}: ListAdminProfilesOptions): Promise<ListAdminProfilesResult> => {
  const start = (page - 1) * pageSize;
  let query = getSupabaseClient()
    .from("profiles")
    .select(PROFILE_SELECT, { count: "exact" });

  const cleanSearch = sanitizeSearch(search);

  if (cleanSearch) {
    query = query.or(
      `full_name.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%`
    );
  }

  if (role !== "all") {
    query = query.eq("role", role);
  }

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (deletion === "current") {
    query = query.is("deleted_at", null);
  } else if (deletion === "deleted") {
    query = query.not("deleted_at", "is", null);
  }

  const { count, data, error } = await query
    .order(sortBy, { ascending: sortDirection === "asc" })
    .range(start, start + pageSize - 1);

  if (error) {
    throw new Error(
      getSafeAdminError(error, "Could not load user profiles. Try again.")
    );
  }

  return {
    profiles: ((data ?? []) as ProfileRow[]).map(mapProfile),
    total: count ?? 0,
  };
};

export const getAdminProfileCounts = async (): Promise<ProfileCounts> => {
  const { data, error } = await getSupabaseClient().rpc(
    "admin_profile_status_counts"
  );

  if (error) {
    throw new Error(
      getSafeAdminError(error, "Could not load account totals. Try again.")
    );
  }

  const row = Array.isArray(data) ? data[0] : data;

  return {
    totalUsers: Number(row?.total_users ?? 0),
    pendingUsers: Number(row?.pending_users ?? 0),
    activeUsers: Number(row?.active_users ?? 0),
    suspendedUsers: Number(row?.suspended_users ?? 0),
    rejectedUsers: Number(row?.rejected_users ?? 0),
  };
};

export const updateAdminProfileStatus = async (
  profileId: string,
  status: AccountStatus
) => {
  const { data, error } = await getSupabaseClient().rpc(
    "admin_update_profile_status",
    {
      next_status: status,
      target_profile_id: profileId,
    }
  );

  if (error) {
    throw new Error(
      getSafeAdminError(error, "Could not update the account status.")
    );
  }

  return mapRpcProfile(data);
};

export const updateAdminProfileRole = async (
  profileId: string,
  role: AppRole
) => {
  const { data, error } = await getSupabaseClient().rpc(
    "admin_update_profile_role",
    {
      next_role: role,
      target_profile_id: profileId,
    }
  );

  if (error) {
    throw new Error(getSafeAdminError(error, "Could not update the user role."));
  }

  return mapRpcProfile(data);
};

export const restoreAdminProfile = async (profileId: string) => {
  const { data, error } = await getSupabaseClient().rpc(
    "admin_restore_profile",
    {
      target_profile_id: profileId,
    }
  );

  if (error) {
    throw new Error(getSafeAdminError(error, "Could not restore the user."));
  }

  return mapRpcProfile(data);
};

export const deleteAdminProfile = async (profileId: string) => {
  const { data, error } = await getSupabaseClient().rpc(
    "admin_soft_delete_profile",
    {
      target_profile_id: profileId,
    }
  );

  if (error) {
    throw new Error(getSafeAdminError(error, "Could not delete the user."));
  }

  return mapRpcProfile(data);
};

export const STATUS_ACTIONS: Record<
  AccountStatus,
  { label: string; nextStatus: AccountStatus }[]
> = {
  [ACCOUNT_STATUS.PENDING]: [
    { label: "Approve user", nextStatus: ACCOUNT_STATUS.ACTIVE },
    { label: "Reject user", nextStatus: ACCOUNT_STATUS.REJECTED },
  ],
  [ACCOUNT_STATUS.ACTIVE]: [
    { label: "Suspend user", nextStatus: ACCOUNT_STATUS.SUSPENDED },
  ],
  [ACCOUNT_STATUS.SUSPENDED]: [
    { label: "Reactivate user", nextStatus: ACCOUNT_STATUS.ACTIVE },
  ],
  [ACCOUNT_STATUS.REJECTED]: [
    { label: "Re-approve user", nextStatus: ACCOUNT_STATUS.ACTIVE },
  ],
};

export interface RoleAssignmentOption {
  label: string;
  nextRole: AppRole;
}

/**
 * The role changes `actor` may apply to `target`. Only a Main Admin can assign
 * roles; the returned options exclude the target's current role. Sub Admins (and
 * standard users) get no options, so role controls are hidden for them.
 */
export const getAvailableRoleAssignments = (
  actor: { deletedAt?: string | null; role: AppRole; status: AccountStatus } | null,
  target: Pick<AdminProfile, "role">
): RoleAssignmentOption[] => {
  if (!isMainAdmin(actor)) {
    return [];
  }

  return (Object.values(APP_ROLE) as AppRole[])
    .filter((role) => role !== target.role)
    .map((role) => ({
      label: `Change role to ${ROLE_LABELS[role]}`,
      nextRole: role,
    }));
};

/**
 * Best-effort logging of a protected action that the backend rejected. Records a
 * `protected_action_blocked` activity-log entry. Never throws — logging must not
 * disrupt the admin experience.
 */
export const recordProtectedActionBlocked = async (params: {
  actionAttempted: string;
  reason?: string | null;
  targetProfileId?: string | null;
}): Promise<void> => {
  try {
    await getSupabaseClient().rpc("record_protected_action_blocked", {
      action_attempted: params.actionAttempted,
      reason: params.reason ?? null,
      target_profile_id: params.targetProfileId ?? null,
    });
  } catch {
    // Swallow: the action is already denied; failing to log is non-critical.
  }
};
