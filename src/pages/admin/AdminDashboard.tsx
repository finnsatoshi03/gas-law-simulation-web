import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  Ban,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  ShieldMinus,
  ShieldPlus,
  UserCheck,
  UserRound,
  UserX,
  type LucideIcon,
} from "lucide-react";

import {
  AdminProfile,
  getAdminProfileCounts,
  listAdminProfiles,
  ProfileCounts,
  ProfileSort,
  ROLE_ACTIONS,
  STATUS_ACTIONS,
  SortDirection,
  updateAdminProfileRole,
  updateAdminProfileStatus,
} from "@/lib/admin-profiles";
import { ACCOUNT_STATUS, AccountStatus } from "@/lib/account-status";
import { APP_ROLE, AppRole } from "@/lib/permissions";
import { useProfile } from "@/contexts/ProfileContext";
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
    };

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
      STATUS_CLASSES[status]
    )}
  >
    {status}
  </span>
);

const RoleBadge = ({ role }: { role: AppRole }) => (
  <span
    className={cn(
      "inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize",
      role === APP_ROLE.ADMIN
        ? "bg-violet-100 text-violet-700"
        : "bg-sky-100 text-sky-700"
    )}
  >
    {role}
  </span>
);

const getStatusActionPresentation = (
  currentStatus: AccountStatus,
  nextStatus: AccountStatus
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

const getRoleActionPresentation = (
  nextRole: AppRole
): ActionPresentation => {
  if (nextRole === APP_ROLE.ADMIN) {
    return { icon: ShieldPlus, ...ACTION_PRESENTATION.admin };
  }

  return { icon: ShieldMinus, ...ACTION_PRESENTATION.danger };
};

const getPendingActionPresentation = (
  action: PendingAction
): ActionPresentation =>
  action.kind === "status"
    ? getStatusActionPresentation(action.profile.status, action.nextStatus)
    : getRoleActionPresentation(action.nextRole);

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
      activeSort === column && "text-zinc-900"
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
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AppRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<ProfileSort>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<AdminProfile | null>(
    null
  );
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [nextCounts, result] = await Promise.all([
        getAdminProfileCounts(),
        listAdminProfiles({
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
          : "Could not load the admin dashboard."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, roleFilter, search, sortBy, sortDirection, statusFilter]);

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
    [counts]
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
    setSuccess("");

    try {
      const updatedProfile =
        pendingAction.kind === "status"
          ? await updateAdminProfileStatus(
              pendingAction.profile.id,
              pendingAction.nextStatus
            )
          : await updateAdminProfileRole(
              pendingAction.profile.id,
              pendingAction.nextRole
            );

      if (updatedProfile.id === currentProfile?.id) {
        await refreshProfile();
      }

      setSelectedProfile((profile) =>
        profile?.id === updatedProfile.id ? updatedProfile : profile
      );
      setSuccess(`${pendingAction.label} completed successfully.`);
      setPendingAction(null);
      await loadDashboard();
    } catch (mutationError) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Could not update the selected user."
      );
    } finally {
      setIsMutating(false);
    }
  };

  const actionDescription = pendingAction
    ? pendingAction.kind === "role" &&
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

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Admin action failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertTitle>Update complete</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>User management</CardTitle>
          <CardDescription>
            Search, filter, inspect, and manage application profiles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
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
                <SelectItem value={APP_ROLE.ADMIN}>Admin</SelectItem>
                <SelectItem value={APP_ROLE.USER}>User</SelectItem>
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
                    const roleAction = ROLE_ACTIONS[profile.role];
                    const rolePresentation = getRoleActionPresentation(
                      roleAction.nextRole
                    );
                    const RoleActionIcon = rolePresentation.icon;

                    return (
                      <TableRow key={profile.id}>
                        <TableCell
                          className={cn(
                            isCurrentUser
                              ? "font-bold text-zinc-950"
                              : "text-zinc-700"
                          )}
                        >
                          {isCurrentUser
                            ? "You"
                            : profile.fullName ?? "Unnamed user"}
                        </TableCell>
                        <TableCell>{profile.email ?? "No email"}</TableCell>
                        <TableCell>
                          <RoleBadge role={profile.role} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={profile.status} />
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
                                <DropdownMenuSeparator />
                                {STATUS_ACTIONS[profile.status].map(
                                  (action) => {
                                    const presentation =
                                      getStatusActionPresentation(
                                        profile.status,
                                        action.nextStatus
                                      );
                                    const ActionIcon = presentation.icon;

                                    return (
                                      <DropdownMenuItem
                                        className={presentation.itemClassName}
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
                                  }
                                )}
                                <DropdownMenuItem
                                  className={rolePresentation.itemClassName}
                                  onClick={() =>
                                    setPendingAction({
                                      kind: "role",
                                      label: roleAction.label,
                                      nextRole: roleAction.nextRole,
                                      profile,
                                    })
                                  }
                                >
                                  <RoleActionIcon className="size-4" />
                                  {roleAction.label}
                                </DropdownMenuItem>
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
                  <StatusBadge status={selectedProfile.status} />
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
            </dl>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        onOpenChange={(open) => !open && !isMutating && setPendingAction(null)}
        open={Boolean(pendingAction)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm account change</AlertDialogTitle>
            <AlertDialogDescription>
              {actionDescription}
            </AlertDialogDescription>
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
              {isMutating ? "Updating..." : pendingAction?.label ?? "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
