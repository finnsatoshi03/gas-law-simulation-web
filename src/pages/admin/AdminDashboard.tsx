import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArchiveRestore,
  ArrowUpDown,
  Ban,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Eye,
  Lock,
  Loader2,
  MessageSquareText,
  MoreHorizontal,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  ShieldMinus,
  ShieldPlus,
  Trash2,
  Unlock,
  UserCheck,
  UserRound,
  UserX,
  type LucideIcon,
} from "lucide-react";

import {
  AdminProfile,
  deleteAdminProfile,
  getAdminProfileCounts,
  getAvailableRoleAssignments,
  isProtectedActionError,
  listAdminProfiles,
  ProfileCounts,
  ProfileDeletionFilter,
  ProfileSort,
  recordProtectedActionBlocked,
  restoreAdminProfile,
  STATUS_ACTIONS,
  SortDirection,
  updateAdminProfileRole,
  updateAdminProfileStatus,
} from "@/lib/admin-profiles";
import { ACCOUNT_STATUS, AccountStatus } from "@/lib/account-status";
import { DEFAULT_FEATURE_LOCK_MESSAGE } from "@/lib/access-control";
import {
  FEATURE_REGISTRY,
  FeatureDefinition,
  FeatureKey,
} from "@/lib/features";
import {
  APP_ROLE,
  AppRole,
  canDeleteUser,
  canManageUser,
  canRestoreUser,
  ROLE_LABELS,
} from "@/lib/permissions";
import { useAccessControl } from "@/contexts/AccessControlContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const PAGE_SIZE = 10;

const EMPTY_COUNTS: ProfileCounts = {
  activeUsers: 0,
  pendingUsers: 0,
  rejectedUsers: 0,
  suspendedUsers: 0,
  totalUsers: 0,
};

type PendingAction =
  | {
      kind: "status";
      label: string;
      nextStatus: AccountStatus;
      profile: AdminProfile;
    }
  | {
      kind: "role";
      label: string;
      nextRole: AppRole;
      profile: AdminProfile;
    }
  | {
      kind: "delete";
      label: string;
      profile: AdminProfile;
    }
  | {
      kind: "restore";
      label: string;
      profile: AdminProfile;
    };

type PendingAccessAction =
  | {
      kind: "app";
    }
  | {
      feature: FeatureDefinition;
      kind: "feature";
    };

interface FeatureDraft {
  isLocked: boolean;
  lockMessage: string;
}

interface ActionPresentation {
  confirmClassName: string;
  icon: LucideIcon;
  itemClassName: string;
}

const ACTION_PRESENTATION = {
  admin: {
    confirmClassName:
      "bg-violet-700 text-white hover:bg-violet-800 focus-visible:ring-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800",
    itemClassName:
      "text-violet-700 focus:bg-violet-50 focus:text-violet-800 dark:text-violet-300 dark:focus:bg-violet-950/30 dark:focus:text-violet-200",
  },
  danger: {
    confirmClassName:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 dark:bg-red-700 dark:hover:bg-red-800",
    itemClassName:
      "text-red-700 focus:bg-red-50 focus:text-red-800 dark:text-red-300 dark:focus:bg-red-950/30 dark:focus:text-red-200",
  },
  success: {
    confirmClassName:
      "bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800",
    itemClassName:
      "text-emerald-700 focus:bg-emerald-50 focus:text-emerald-800 dark:text-emerald-300 dark:focus:bg-emerald-950/30 dark:focus:text-emerald-200",
  },
} as const;

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Never";

const STATUS_CLASSES: Record<AccountStatus, string> = {
  [ACCOUNT_STATUS.ACTIVE]: "bg-green-100 text-green-700",
  [ACCOUNT_STATUS.PENDING]: "bg-amber-100 text-amber-700",
  [ACCOUNT_STATUS.REJECTED]: "bg-red-100 text-red-700",
  [ACCOUNT_STATUS.SUSPENDED]: "bg-zinc-200 text-zinc-700",
};

const StatusBadge = ({ status }: { status: AccountStatus }) => (
  <span
    className={cn(
      "inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize",
      STATUS_CLASSES[status],
    )}
  >
    {status}
  </span>
);

const ROLE_BADGE_CLASSES: Record<AppRole, string> = {
  [APP_ROLE.ADMIN]: "bg-violet-100 text-violet-700",
  [APP_ROLE.SUB_ADMIN]: "bg-amber-100 text-amber-700",
  [APP_ROLE.USER]: "bg-sky-100 text-sky-700",
};

const RoleBadge = ({ role }: { role: AppRole }) => (
  <span
    className={cn(
      "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
      ROLE_BADGE_CLASSES[role],
    )}
  >
    {ROLE_LABELS[role]}
  </span>
);

const getStatusActionPresentation = (
  currentStatus: AccountStatus,
  nextStatus: AccountStatus,
): ActionPresentation => {
  if (nextStatus === ACCOUNT_STATUS.REJECTED) {
    return { icon: UserX, ...ACTION_PRESENTATION.danger };
  }

  if (nextStatus === ACCOUNT_STATUS.SUSPENDED) {
    return { icon: Ban, ...ACTION_PRESENTATION.danger };
  }

  if (nextStatus === ACCOUNT_STATUS.ACTIVE) {
    return {
      icon:
        currentStatus === ACCOUNT_STATUS.SUSPENDED ? RotateCcw : CheckCircle2,
      ...ACTION_PRESENTATION.success,
    };
  }

  return { icon: Clock3, ...ACTION_PRESENTATION.admin };
};

const getRoleActionPresentation = (nextRole: AppRole): ActionPresentation => {
  if (nextRole === APP_ROLE.ADMIN) {
    return { icon: ShieldPlus, ...ACTION_PRESENTATION.admin };
  }

  if (nextRole === APP_ROLE.SUB_ADMIN) {
    return { icon: ShieldCheck, ...ACTION_PRESENTATION.admin };
  }

  return { icon: ShieldMinus, ...ACTION_PRESENTATION.danger };
};

const getPendingActionPresentation = (
  action: PendingAction,
): ActionPresentation => {
  if (action.kind === "delete") {
    return { icon: Trash2, ...ACTION_PRESENTATION.danger };
  }

  if (action.kind === "restore") {
    return { icon: ArchiveRestore, ...ACTION_PRESENTATION.success };
  }

  return action.kind === "status"
    ? getStatusActionPresentation(action.profile.status, action.nextStatus)
    : getRoleActionPresentation(action.nextRole);
};

const OverviewCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: number;
}) => (
  <Card>
    <CardContent className="flex items-center justify-between p-5">
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
      </div>
      <div className="grid size-10 place-items-center rounded-full bg-zinc-100 text-zinc-700">
        <Icon className="size-5" />
      </div>
    </CardContent>
  </Card>
);

const SortButton = ({
  activeSort,
  children,
  column,
  onSort,
}: {
  activeSort: ProfileSort;
  children: string;
  column: ProfileSort;
  onSort: (column: ProfileSort) => void;
}) => (
  <button
    className={cn(
      "inline-flex items-center gap-1 hover:text-zinc-900",
      activeSort === column && "text-zinc-900",
    )}
    onClick={() => onSort(column)}
    type="button"
  >
    {children}
    <ArrowUpDown className="size-3.5" />
  </button>
);

export default function AdminDashboard() {
  const { profile: currentProfile, refreshProfile } = useProfile();
  const { showToast } = useToast();
  const {
    appSettings,
    featureSettings,
    isLoading: isAccessControlLoading,
    updateAppAccessSettings,
    updateFeatureAccessSetting,
  } = useAccessControl();
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AppRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "all">(
    "all",
  );
  const [deletionFilter, setDeletionFilter] =
    useState<ProfileDeletionFilter>("current");
  const [sortBy, setSortBy] = useState<ProfileSort>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<AdminProfile | null>(
    null,
  );
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const [appLockDraft, setAppLockDraft] = useState({
    appLockMessage: appSettings.appLockMessage,
    isAppLocked: appSettings.isAppLocked,
  });
  const [featureDrafts, setFeatureDrafts] = useState<
    Partial<Record<FeatureKey, FeatureDraft>>
  >({});
  const [isAccessMutating, setIsAccessMutating] = useState(false);
  const [mutatingFeatureKey, setMutatingFeatureKey] =
    useState<FeatureKey | null>(null);
  const [pendingAccessAction, setPendingAccessAction] =
    useState<PendingAccessAction | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    setAppLockDraft({
      appLockMessage: appSettings.appLockMessage,
      isAppLocked: appSettings.isAppLocked,
    });
  }, [appSettings]);

  useEffect(() => {
    const nextDrafts: Partial<Record<FeatureKey, FeatureDraft>> = {};

    for (const feature of FEATURE_REGISTRY) {
      const setting = featureSettings.get(feature.key);
      nextDrafts[feature.key] = {
        isLocked: Boolean(setting?.isLocked),
        lockMessage: setting?.lockMessage ?? DEFAULT_FEATURE_LOCK_MESSAGE,
      };
    }

    setFeatureDrafts(nextDrafts);
  }, [featureSettings]);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [nextCounts, result] = await Promise.all([
        getAdminProfileCounts(),
        listAdminProfiles({
          deletion: deletionFilter,
          page,
          pageSize: PAGE_SIZE,
          role: roleFilter,
          search,
          sortBy,
          sortDirection,
          status: statusFilter,
        }),
      ]);

      setCounts(nextCounts);
      setProfiles(result.profiles);
      setTotal(result.total);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load the admin dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    deletionFilter,
    page,
    roleFilter,
    search,
    sortBy,
    sortDirection,
    statusFilter,
  ]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const overviewCards = useMemo(
    () => [
      { icon: UserRound, label: "Total users", value: counts.totalUsers },
      { icon: Clock3, label: "Pending", value: counts.pendingUsers },
      { icon: UserCheck, label: "Active", value: counts.activeUsers },
      { icon: UserX, label: "Suspended", value: counts.suspendedUsers },
      { icon: UserX, label: "Rejected", value: counts.rejectedUsers },
    ],
    [counts],
  );

  const handleSort = (column: ProfileSort) => {
    setPage(1);

    if (sortBy === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(column);
    setSortDirection("asc");
  };

  const handleConfirmAction = async () => {
    if (!pendingAction || isMutating) {
      return;
    }

    setIsMutating(true);
    setError("");

    try {
      const updatedProfile =
        pendingAction.kind === "delete"
          ? await deleteAdminProfile(pendingAction.profile.id)
          : pendingAction.kind === "restore"
            ? await restoreAdminProfile(pendingAction.profile.id)
            : pendingAction.kind === "status"
              ? await updateAdminProfileStatus(
                  pendingAction.profile.id,
                  pendingAction.nextStatus,
                )
              : await updateAdminProfileRole(
                  pendingAction.profile.id,
                  pendingAction.nextRole,
                );

      if (updatedProfile.id === currentProfile?.id) {
        await refreshProfile();
      }

      setSelectedProfile((profile) =>
        pendingAction.kind === "delete"
          ? null
          : profile?.id === updatedProfile.id
            ? updatedProfile
            : profile,
      );
      showToast({
        description: `${pendingAction.label} completed successfully.`,
        title: "Update complete",
        variant: "success",
      });
      setPendingAction(null);
      await loadDashboard();
    } catch (mutationError) {
      const description =
        mutationError instanceof Error
          ? mutationError.message
          : "Could not update the selected user.";

      // Record blocked protected actions out-of-band (best-effort).
      if (isProtectedActionError(mutationError)) {
        const actionAttempted =
          pendingAction.kind === "role"
            ? `role:${pendingAction.nextRole}`
            : pendingAction.kind === "status"
              ? `status:${pendingAction.nextStatus}`
              : "delete";

        void recordProtectedActionBlocked({
          actionAttempted,
          reason: description,
          targetProfileId: pendingAction.profile.id,
        });
      }

      showToast({
        description,
        title: "Admin action failed",
        variant: "error",
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleSaveAppLock = async (confirmed = false) => {
    if (isAccessMutating) {
      return;
    }

    if (appLockDraft.isAppLocked && !appSettings.isAppLocked && !confirmed) {
      setPendingAccessAction({ kind: "app" });
      return;
    }

    setIsAccessMutating(true);
    setError("");

    try {
      await updateAppAccessSettings(appLockDraft);
      showToast({
        description: appLockDraft.isAppLocked
          ? "The app is now locked for standard users."
          : "The app is now unlocked.",
        title: "Access control updated",
        variant: "success",
      });
      setPendingAccessAction(null);
    } catch (accessError) {
      showToast({
        description:
          accessError instanceof Error
            ? accessError.message
            : "Could not update the app lock settings.",
        title: "Access control update failed",
        variant: "error",
      });
    } finally {
      setIsAccessMutating(false);
    }
  };

  const handleSaveFeatureLock = async (
    feature: FeatureDefinition,
    confirmed = false,
  ) => {
    if (mutatingFeatureKey) {
      return;
    }

    const draft = featureDrafts[feature.key];

    if (!draft) {
      return;
    }

    const currentSetting = featureSettings.get(feature.key);

    if (draft.isLocked && !currentSetting?.isLocked && !confirmed) {
      setPendingAccessAction({ feature, kind: "feature" });
      return;
    }

    setMutatingFeatureKey(feature.key);
    setError("");

    try {
      await updateFeatureAccessSetting({
        featureKey: feature.key,
        isLocked: draft.isLocked,
        lockMessage: draft.lockMessage,
      });
      showToast({
        description: draft.isLocked
          ? `${feature.name} is now locked for standard users.`
          : `${feature.name} is now unlocked.`,
        title: "Feature access updated",
        variant: "success",
      });
      setPendingAccessAction(null);
    } catch (accessError) {
      showToast({
        description:
          accessError instanceof Error
            ? accessError.message
            : "Could not update the feature lock setting.",
        title: "Feature access update failed",
        variant: "error",
      });
    } finally {
      setMutatingFeatureKey(null);
    }
  };

  const handleConfirmAccessAction = async () => {
    if (!pendingAccessAction) {
      return;
    }

    if (pendingAccessAction.kind === "app") {
      await handleSaveAppLock(true);
      return;
    }

    await handleSaveFeatureLock(pendingAccessAction.feature, true);
  };

  const actionDescription = pendingAction
    ? pendingAction.kind === "delete"
      ? `Delete ${
          pendingAction.profile.fullName ??
          pendingAction.profile.email ??
          "this user"
        }? This will remove their application access and hide them from the current user list. Their Auth account and activity history will be retained.`
      : pendingAction.kind === "restore"
      ? `Restore ${
          pendingAction.profile.fullName ??
          pendingAction.profile.email ??
          "this user"
        }? Their application access will be reinstated with the same role and the account status they had before deletion.`
      : pendingAction.kind === "role" &&
      pendingAction.profile.id === currentProfile?.id &&
      pendingAction.nextRole === APP_ROLE.USER
      ? "You are changing your own role to user. You will immediately lose administrator access. Continue only if another active administrator exists."
      : `${pendingAction.label} for ${
          pendingAction.profile.fullName ??
          pendingAction.profile.email ??
          "this user"
        }?`
    : "";
  const pendingActionPresentation = pendingAction
    ? getPendingActionPresentation(pendingAction)
    : null;
  const PendingActionIcon = pendingActionPresentation?.icon;
  const isAppLockDirty =
    appLockDraft.isAppLocked !== appSettings.isAppLocked ||
    appLockDraft.appLockMessage !== appSettings.appLockMessage;
  const lockedFeatureCount = FEATURE_REGISTRY.reduce((count, feature) => {
    const draft = featureDrafts[feature.key];
    const isLocked =
      draft?.isLocked ?? Boolean(featureSettings.get(feature.key)?.isLocked);

    return isLocked ? count + 1 : count;
  }, 0);
  const accessActionDescription = pendingAccessAction
    ? pendingAccessAction.kind === "app"
      ? "Lock the entire app for standard users? Admins will keep access and can unlock it from this dashboard."
      : `Lock ${pendingAccessAction.feature.name} for standard users? Admins will keep access.`
    : "";
  const pendingAccessLockMessage = pendingAccessAction
    ? pendingAccessAction.kind === "app"
      ? appLockDraft.appLockMessage
      : (featureDrafts[pendingAccessAction.feature.key]?.lockMessage ??
        DEFAULT_FEATURE_LOCK_MESSAGE)
    : "";

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-6 text-violet-700" />
            <h1 className="text-2xl font-bold">Admin dashboard</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Review users, manage account statuses, and assign administrator
            access.
          </p>
        </div>
        <Button
          disabled={isLoading}
          onClick={() => void loadDashboard()}
          variant="outline"
        >
          <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {overviewCards.map((card) => (
          <OverviewCard key={card.label} {...card} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="size-5" />
            User management
          </CardTitle>
          <CardDescription>
            Search, filter, inspect, and manage application profiles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_160px_160px_160px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <Input
                className="pl-9"
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Search by name or email"
                value={search}
              />
            </div>
            <Select
              onValueChange={(value: AppRole | "all") => {
                setPage(1);
                setRoleFilter(value);
              }}
              value={roleFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value={APP_ROLE.ADMIN}>
                  {ROLE_LABELS[APP_ROLE.ADMIN]}
                </SelectItem>
                <SelectItem value={APP_ROLE.SUB_ADMIN}>
                  {ROLE_LABELS[APP_ROLE.SUB_ADMIN]}
                </SelectItem>
                <SelectItem value={APP_ROLE.USER}>
                  {ROLE_LABELS[APP_ROLE.USER]}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value: AccountStatus | "all") => {
                setPage(1);
                setStatusFilter(value);
              }}
              value={statusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.values(ACCOUNT_STATUS).map((status) => (
                  <SelectItem key={status} value={status}>
                    <span className="capitalize">{status}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value: ProfileDeletionFilter) => {
                setPage(1);
                setDeletionFilter(value);
              }}
              value={deletionFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter deleted" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current users</SelectItem>
                <SelectItem value="deleted">Deleted users</SelectItem>
                <SelectItem value="all">All users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortButton
                      activeSort={sortBy}
                      column="full_name"
                      onSort={handleSort}
                    >
                      Name
                    </SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton
                      activeSort={sortBy}
                      column="email"
                      onSort={handleSort}
                    >
                      Email
                    </SortButton>
                  </TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <SortButton
                      activeSort={sortBy}
                      column="created_at"
                      onSort={handleSort}
                    >
                      Joined
                    </SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton
                      activeSort={sortBy}
                      column="last_login_at"
                      onSort={handleSort}
                    >
                      Last login
                    </SortButton>
                  </TableHead>
                  <TableHead className="w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell className="h-28 text-center" colSpan={7}>
                      <Loader2 className="mx-auto size-5 animate-spin text-zinc-500" />
                    </TableCell>
                  </TableRow>
                ) : profiles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      className="h-28 text-center text-zinc-500"
                      colSpan={7}
                    >
                      No user profiles match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  profiles.map((profile) => {
                    const isCurrentUser = profile.id === currentProfile?.id;
                    const canManage = canManageUser(currentProfile, profile);
                    const canDelete = canDeleteUser(
                      currentProfile,
                      profile,
                      currentProfile?.id,
                    );
                    const roleOptions = getAvailableRoleAssignments(
                      currentProfile,
                      profile,
                    );

                    return (
                      <TableRow key={profile.id}>
                        <TableCell
                          className={cn(
                            isCurrentUser
                              ? "font-bold text-zinc-950"
                              : "text-zinc-700",
                          )}
                        >
                          {isCurrentUser
                            ? "You"
                            : (profile.fullName ?? "Unnamed user")}
                        </TableCell>
                        <TableCell>{profile.email ?? "No email"}</TableCell>
                        <TableCell>
                          <RoleBadge role={profile.role} />
                        </TableCell>
                        <TableCell>
                          {profile.deletedAt ? (
                            <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                              Deleted
                            </span>
                          ) : (
                            <StatusBadge status={profile.status} />
                          )}
                        </TableCell>
                        <TableCell>{formatDate(profile.createdAt)}</TableCell>
                        <TableCell>{formatDate(profile.lastLoginAt)}</TableCell>
                        <TableCell>
                          {isCurrentUser ? null : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Open actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setSelectedProfile(profile)}
                                >
                                  <Eye className="size-4" />
                                  View details
                                </DropdownMenuItem>
                                {!profile.deletedAt ? (
                                  canManage ? (
                                    <>
                                      <DropdownMenuSeparator />
                                      {STATUS_ACTIONS[profile.status].map(
                                        (action) => {
                                          const presentation =
                                            getStatusActionPresentation(
                                              profile.status,
                                              action.nextStatus,
                                            );
                                          const ActionIcon = presentation.icon;

                                          return (
                                            <DropdownMenuItem
                                              className={
                                                presentation.itemClassName
                                              }
                                              key={action.nextStatus}
                                              onClick={() =>
                                                setPendingAction({
                                                  kind: "status",
                                                  label: action.label,
                                                  nextStatus: action.nextStatus,
                                                  profile,
                                                })
                                              }
                                            >
                                              <ActionIcon className="size-4" />
                                              {action.label}
                                            </DropdownMenuItem>
                                          );
                                        },
                                      )}
                                      {roleOptions.map((option) => {
                                        const presentation =
                                          getRoleActionPresentation(
                                            option.nextRole,
                                          );
                                        const RoleActionIcon =
                                          presentation.icon;

                                        return (
                                          <DropdownMenuItem
                                            className={presentation.itemClassName}
                                            key={option.nextRole}
                                            onClick={() =>
                                              setPendingAction({
                                                kind: "role",
                                                label: option.label,
                                                nextRole: option.nextRole,
                                                profile,
                                              })
                                            }
                                          >
                                            <RoleActionIcon className="size-4" />
                                            {option.label}
                                          </DropdownMenuItem>
                                        );
                                      })}
                                      {canDelete ? (
                                        <>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            className={
                                              ACTION_PRESENTATION.danger
                                                .itemClassName
                                            }
                                            onClick={() =>
                                              setPendingAction({
                                                kind: "delete",
                                                label: "Delete user",
                                                profile,
                                              })
                                            }
                                          >
                                            <Trash2 className="size-4" />
                                            Delete user
                                          </DropdownMenuItem>
                                        </>
                                      ) : null}
                                    </>
                                  ) : (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-zinc-400 focus:text-zinc-400"
                                        disabled
                                      >
                                        <Lock className="size-4" />
                                        Only a Main Admin can manage this account
                                      </DropdownMenuItem>
                                    </>
                                  )
                                ) : canRestoreUser(currentProfile, profile) ? (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className={
                                        ACTION_PRESENTATION.success.itemClassName
                                      }
                                      onClick={() =>
                                        setPendingAction({
                                          kind: "restore",
                                          label: "Restore user",
                                          profile,
                                        })
                                      }
                                    >
                                      <ArchiveRestore className="size-4" />
                                      Restore user
                                    </DropdownMenuItem>
                                  </>
                                ) : null}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col justify-between gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center">
            <span>
              Showing {profiles.length} of {total} matching users
            </span>
            <div className="flex items-center gap-2">
              <Button
                disabled={page === 1 || isLoading}
                onClick={() => setPage((value) => value - 1)}
                size="sm"
                variant="outline"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <span>
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page === totalPages || isLoading}
                onClick={() => setPage((value) => value + 1)}
                size="sm"
                variant="outline"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Admin action failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="size-5" />
              Access messages
            </CardTitle>
            <CardDescription>
              Edit the copy shown on pending, suspended, rejected, locked, and
              denied access screens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/admin/messages">
                <ExternalLink className="size-4" />
                Manage messages
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5" />
              Activity logs
            </CardTitle>
            <CardDescription>
              Review administrator changes to users, roles, statuses, and
              access controls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/admin/activity">
                <ExternalLink className="size-4" />
                View logs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-5" />
            Access controls
          </CardTitle>
          <CardDescription>
            Lock the full app or individual features for standard users.
            Administrators always keep access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="rounded-xl border p-4">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {appLockDraft.isAppLocked ? (
                    <Lock className="size-4 text-amber-700" />
                  ) : (
                    <Unlock className="size-4 text-emerald-700" />
                  )}
                  <h3 className="font-semibold">Full app lock</h3>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      appLockDraft.isAppLocked
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800",
                    )}
                  >
                    {appLockDraft.isAppLocked ? "Locked" : "Unlocked"}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">
                  When locked, standard users see a full-page access message.
                </p>
                <p className="text-xs text-zinc-400">
                  Last updated {formatDate(appSettings.updatedAt)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Label htmlFor="app-lock-toggle" className="text-sm">
                  Lock app
                </Label>
                <Switch
                  checked={appLockDraft.isAppLocked}
                  disabled={isAccessControlLoading || isAccessMutating}
                  id="app-lock-toggle"
                  onCheckedChange={(checked) =>
                    setAppLockDraft((draft) => ({
                      ...draft,
                      isAppLocked: checked,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="app-lock-message">Lock message</Label>
              <Textarea
                id="app-lock-message"
                onChange={(event) =>
                  setAppLockDraft((draft) => ({
                    ...draft,
                    appLockMessage: event.target.value,
                  }))
                }
                placeholder="Message standard users see while the app is locked"
                value={appLockDraft.appLockMessage}
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                disabled={
                  isAccessControlLoading || isAccessMutating || !isAppLockDirty
                }
                onClick={() => void handleSaveAppLock()}
              >
                {isAccessMutating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save app lock
              </Button>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-semibold">Feature locks</h3>
                <p className="text-sm text-zinc-500">
                  {lockedFeatureCount} of {FEATURE_REGISTRY.length} features
                  locked. Open the full view to edit lock messages.
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to="/admin/features">
                  <ExternalLink className="size-4" />
                  Full feature view
                </Link>
              </Button>
            </div>

            <div className="overflow-hidden rounded-xl border">
              {FEATURE_REGISTRY.map((feature) => {
                const setting = featureSettings.get(feature.key);
                const draft = featureDrafts[feature.key] ?? {
                  isLocked: false,
                  lockMessage: DEFAULT_FEATURE_LOCK_MESSAGE,
                };
                const isDirty = draft.isLocked !== Boolean(setting?.isLocked);
                const isFeatureMutating = mutatingFeatureKey === feature.key;

                return (
                  <div
                    className="flex flex-col gap-3 border-b px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                    key={feature.key}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {draft.isLocked ? (
                          <Lock className="size-4 text-amber-700" />
                        ) : (
                          <Unlock className="size-4 text-zinc-400" />
                        )}
                        <h4 className="font-semibold">{feature.name}</h4>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                          {feature.category}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-semibold",
                            draft.isLocked
                              ? "bg-amber-100 text-amber-800"
                              : "bg-zinc-100 text-zinc-600",
                          )}
                        >
                          {draft.isLocked ? "Locked" : "Unlocked"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">
                        Last updated {formatDate(setting?.updatedAt ?? null)}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <Switch
                        aria-label={`Lock ${feature.name}`}
                        checked={draft.isLocked}
                        disabled={isFeatureMutating}
                        onCheckedChange={(checked) =>
                          setFeatureDrafts((drafts) => ({
                            ...drafts,
                            [feature.key]: {
                              ...draft,
                              isLocked: checked,
                            },
                          }))
                        }
                      />
                      <Button
                        disabled={!isDirty || Boolean(mutatingFeatureKey)}
                        onClick={() => void handleSaveFeatureLock(feature)}
                        size="sm"
                        variant={draft.isLocked ? "default" : "outline"}
                      >
                        {isFeatureMutating ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Save className="size-4" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </CardContent>
      </Card>

      <Dialog
        onOpenChange={(open) => !open && setSelectedProfile(null)}
        open={Boolean(selectedProfile)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User details</DialogTitle>
            <DialogDescription>
              Application profile and account lifecycle information.
            </DialogDescription>
          </DialogHeader>
          {selectedProfile ? (
            <div className="space-y-5">
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-zinc-500">Name</dt>
                  <dd className="font-medium">
                    {selectedProfile.fullName ?? "Unnamed user"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Email</dt>
                  <dd className="font-medium">
                    {selectedProfile.email ?? "No email"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Role</dt>
                  <dd className="mt-1">
                    <RoleBadge role={selectedProfile.role} />
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Status</dt>
                  <dd className="mt-1">
                    {selectedProfile.deletedAt ? (
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                        Deleted
                      </span>
                    ) : (
                      <StatusBadge status={selectedProfile.status} />
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Created</dt>
                  <dd className="font-medium">
                    {formatDate(selectedProfile.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Last login</dt>
                  <dd className="font-medium">
                    {formatDate(selectedProfile.lastLoginAt)}
                  </dd>
                </div>
                {selectedProfile.deletedAt ? (
                  <div>
                    <dt className="text-zinc-500">Deleted</dt>
                    <dd className="font-medium">
                      {formatDate(selectedProfile.deletedAt)}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {selectedProfile.id !== currentProfile?.id &&
              canManageUser(currentProfile, selectedProfile) ? (
                <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                  {STATUS_ACTIONS[selectedProfile.status].map((action) => {
                    const presentation = getStatusActionPresentation(
                      selectedProfile.status,
                      action.nextStatus,
                    );
                    const ActionIcon = presentation.icon;
                    const isDestructive =
                      action.nextStatus === ACCOUNT_STATUS.REJECTED ||
                      action.nextStatus === ACCOUNT_STATUS.SUSPENDED;

                    return (
                      <Button
                        disabled={isMutating}
                        key={action.nextStatus}
                        onClick={() =>
                          setPendingAction({
                            kind: "status",
                            label: action.label,
                            nextStatus: action.nextStatus,
                            profile: selectedProfile,
                          })
                        }
                        size="sm"
                        variant={isDestructive ? "destructive" : "outline"}
                      >
                        <ActionIcon className="size-4" />
                        {action.label}
                      </Button>
                    );
                  })}
                  {canDeleteUser(
                    currentProfile,
                    selectedProfile,
                    currentProfile?.id,
                  ) ? (
                    <Button
                      disabled={isMutating}
                      onClick={() =>
                        setPendingAction({
                          kind: "delete",
                          label: "Delete user",
                          profile: selectedProfile,
                        })
                      }
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="size-4" />
                      Delete user
                    </Button>
                  ) : null}
                </div>
              ) : null}

              {canRestoreUser(currentProfile, selectedProfile) ? (
                <div className="flex justify-end gap-2 border-t pt-4">
                  <Button
                    disabled={isMutating}
                    onClick={() =>
                      setPendingAction({
                        kind: "restore",
                        label: "Restore user",
                        profile: selectedProfile,
                      })
                    }
                    size="sm"
                  >
                    <ArchiveRestore className="size-4" />
                    Restore user
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        onOpenChange={(open) => !open && !isMutating && setPendingAction(null)}
        open={Boolean(pendingAction)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.kind === "delete"
                ? "Confirm user deletion"
                : "Confirm account change"}
            </AlertDialogTitle>
            <AlertDialogDescription>{actionDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={pendingActionPresentation?.confirmClassName}
              disabled={isMutating}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmAction();
              }}
            >
              {isMutating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : PendingActionIcon ? (
                <PendingActionIcon className="size-4" />
              ) : null}
              {isMutating
                ? pendingAction?.kind === "delete"
                  ? "Deleting..."
                  : "Updating..."
                : (pendingAction?.label ?? "Confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        onOpenChange={(open) =>
          !open && !isAccessMutating && !mutatingFeatureKey
            ? setPendingAccessAction(null)
            : undefined
        }
        open={Boolean(pendingAccessAction)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm access lock</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <span className="block">{accessActionDescription}</span>
              <span className="block rounded-lg border bg-zinc-50 p-3 text-zinc-700">
                <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Lock message users will see
                </span>
                <span className="mt-1 block">
                  {pendingAccessLockMessage || DEFAULT_FEATURE_LOCK_MESSAGE}
                </span>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isAccessMutating || Boolean(mutatingFeatureKey)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-700 text-white hover:bg-amber-800 focus-visible:ring-amber-700"
              disabled={isAccessMutating || Boolean(mutatingFeatureKey)}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmAccessAction();
              }}
            >
              {isAccessMutating || mutatingFeatureKey ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Lock className="size-4" />
              )}
              Confirm lock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
