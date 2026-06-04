import { getSupabaseClient } from "@/lib/supabase";

export interface ActivityLog {
  action: string;
  actorEmail: string | null;
  actorName: string | null;
  actorProfileId: string | null;
  createdAt: string;
  description: string;
  id: string;
  metadata: Record<string, unknown>;
  targetKey: string | null;
  targetLabel: string | null;
  targetProfileId: string | null;
  targetType: string;
}

interface ActivityLogRow {
  action: string;
  actor_email: string | null;
  actor_name: string | null;
  actor_profile_id: string | null;
  created_at: string;
  description: string;
  id: string;
  metadata: Record<string, unknown> | null;
  target_key: string | null;
  target_label: string | null;
  target_profile_id: string | null;
  target_type: string;
}

export type ActivityLogSort =
  | "action"
  | "actor_email"
  | "created_at"
  | "target_label";
export type ActivityLogSortDirection = "asc" | "desc";

interface ListActivityLogsOptions {
  action: string | "all";
  page: number;
  pageSize: number;
  search: string;
  sortBy: ActivityLogSort;
  sortDirection: ActivityLogSortDirection;
  targetType: string | "all";
}

export interface ListActivityLogsResult {
  logs: ActivityLog[];
  total: number;
}

const ACTIVITY_LOG_SELECT =
  "id, actor_profile_id, actor_email, actor_name, action, target_type, target_profile_id, target_key, target_label, description, metadata, created_at";

const sanitizeSearch = (value: string) =>
  value.trim().replace(/[,%()]/g, " ").replace(/\s+/g, " ");

const mapActivityLog = (row: ActivityLogRow): ActivityLog => ({
  action: row.action,
  actorEmail: row.actor_email,
  actorName: row.actor_name,
  actorProfileId: row.actor_profile_id,
  createdAt: row.created_at,
  description: row.description,
  id: row.id,
  metadata: row.metadata ?? {},
  targetKey: row.target_key,
  targetLabel: row.target_label,
  targetProfileId: row.target_profile_id,
  targetType: row.target_type,
});

const getSafeActivityLogError = (error: unknown, fallback: string) => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("administrator access is required")) {
    return "Your administrator access is no longer available.";
  }

  if (
    message.includes("permission denied") ||
    message.includes("row-level security")
  ) {
    return "You do not have permission to view activity logs.";
  }

  return fallback;
};

export const formatActivityAction = (action: string) =>
  action
    .split(".")
    .filter(Boolean)
    .map((part) => part.replace(/_/g, " "))
    .join(" / ");

export const listActivityLogs = async ({
  action,
  page,
  pageSize,
  search,
  sortBy,
  sortDirection,
  targetType,
}: ListActivityLogsOptions): Promise<ListActivityLogsResult> => {
  const start = (page - 1) * pageSize;
  let query = getSupabaseClient()
    .from("activity_logs")
    .select(ACTIVITY_LOG_SELECT, { count: "exact" });

  if (action !== "all") {
    query = query.eq("action", action);
  }

  if (targetType !== "all") {
    query = query.eq("target_type", targetType);
  }

  const cleanSearch = sanitizeSearch(search);

  if (cleanSearch) {
    query = query.or(
      `description.ilike.%${cleanSearch}%,actor_email.ilike.%${cleanSearch}%,actor_name.ilike.%${cleanSearch}%,target_label.ilike.%${cleanSearch}%,target_key.ilike.%${cleanSearch}%`
    );
  }

  const { count, data, error } = await query
    .order(sortBy, { ascending: sortDirection === "asc" })
    .range(start, start + pageSize - 1);

  if (error) {
    throw new Error(
      getSafeActivityLogError(error, "Could not load activity logs.")
    );
  }

  return {
    logs: ((data ?? []) as ActivityLogRow[]).map(mapActivityLog),
    total: count ?? 0,
  };
};

export const listActivityLogOptions = async () => {
  const { data, error } = await getSupabaseClient()
    .from("activity_logs")
    .select("action, target_type")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    throw new Error(
      getSafeActivityLogError(
        error,
        "Could not load activity log filters."
      )
    );
  }

  const actions = new Set<string>();
  const targetTypes = new Set<string>();

  for (const row of (data ?? []) as Pick<
    ActivityLogRow,
    "action" | "target_type"
  >[]) {
    if (row.action) {
      actions.add(row.action);
    }

    if (row.target_type) {
      targetTypes.add(row.target_type);
    }
  }

  return {
    actions: [...actions].sort(),
    targetTypes: [...targetTypes].sort(),
  };
};
