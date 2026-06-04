import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";

import {
  ActivityLog,
  ActivityLogSort,
  ActivityLogSortDirection,
  formatActivityAction,
  listActivityLogOptions,
  listActivityLogs,
} from "@/lib/activity-logs";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const PAGE_SIZE = 15;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getActorLabel = (log: ActivityLog) =>
  log.actorName || log.actorEmail || "System";

const getTargetLabel = (log: ActivityLog) =>
  log.targetLabel || log.targetKey || log.targetType;

const SortButton = ({
  activeSort,
  children,
  column,
  onSort,
}: {
  activeSort: ActivityLogSort;
  children: string;
  column: ActivityLogSort;
  onSort: (column: ActivityLogSort) => void;
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

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string | "all">("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState<string | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<ActivityLogSort>("created_at");
  const [sortDirection, setSortDirection] =
    useState<ActivityLogSortDirection>("desc");
  const [actionOptions, setActionOptions] = useState<string[]>([]);
  const [targetTypeOptions, setTargetTypeOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [result, options] = await Promise.all([
        listActivityLogs({
          action: actionFilter,
          page,
          pageSize: PAGE_SIZE,
          search,
          sortBy,
          sortDirection,
          targetType: targetTypeFilter,
        }),
        listActivityLogOptions(),
      ]);

      setLogs(result.logs);
      setTotal(result.total);
      setActionOptions(options.actions);
      setTargetTypeOptions(options.targetTypes);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load activity logs."
      );
    } finally {
      setIsLoading(false);
    }
  }, [actionFilter, page, search, sortBy, sortDirection, targetTypeFilter]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const overview = useMemo(
    () => ({
      actionCount: actionOptions.length,
      latest: logs[0]?.createdAt ?? null,
      total,
    }),
    [actionOptions.length, logs, total]
  );

  const handleSort = (column: ActivityLogSort) => {
    setPage(1);

    if (sortBy === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(column);
    setSortDirection("asc");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Button asChild className="mb-3" size="sm" variant="outline">
            <Link to="/admin">
              <ChevronLeft className="size-4" />
              Back to dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Activity className="size-6 text-violet-700" />
            <h1 className="text-2xl font-bold">Activity logs</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Review administrator actions for account and access-control changes.
          </p>
        </div>
        <Button
          disabled={isLoading}
          onClick={() => void loadLogs()}
          variant="outline"
        >
          <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-zinc-500">Matching events</p>
              <p className="mt-1 text-2xl font-bold">{overview.total}</p>
            </div>
            <Activity className="size-5 text-zinc-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-zinc-500">Action types</p>
              <p className="mt-1 text-2xl font-bold">{overview.actionCount}</p>
            </div>
            <UserRound className="size-5 text-zinc-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-zinc-500">Latest event</p>
              <p className="mt-1 text-sm font-semibold">
                {overview.latest ? formatDate(overview.latest) : "No events"}
              </p>
            </div>
            <Clock3 className="size-5 text-zinc-600" />
          </CardContent>
        </Card>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Activity logs unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Audit trail</CardTitle>
          <CardDescription>
            Filter by actor, target, action, or event description.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <Input
                className="pl-9"
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Search actor, target, or description"
                value={search}
              />
            </div>
            <Select
              onValueChange={(value) => {
                setPage(1);
                setActionFilter(value);
              }}
              value={actionFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {actionOptions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {formatActivityAction(action)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => {
                setPage(1);
                setTargetTypeFilter(value);
              }}
              value={targetTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All targets</SelectItem>
                {targetTypeOptions.map((targetType) => (
                  <SelectItem key={targetType} value={targetType}>
                    {targetType.replace(/_/g, " ")}
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
                      column="created_at"
                      onSort={handleSort}
                    >
                      Time
                    </SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton
                      activeSort={sortBy}
                      column="action"
                      onSort={handleSort}
                    >
                      Action
                    </SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton
                      activeSort={sortBy}
                      column="actor_email"
                      onSort={handleSort}
                    >
                      Actor
                    </SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton
                      activeSort={sortBy}
                      column="target_label"
                      onSort={handleSort}
                    >
                      Target
                    </SortButton>
                  </TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell className="h-28 text-center" colSpan={5}>
                      <Loader2 className="mx-auto size-5 animate-spin text-zinc-500" />
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      className="h-28 text-center text-zinc-500"
                      colSpan={5}
                    >
                      No activity logs match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatDate(log.createdAt)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {formatActivityAction(log.action)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{getActorLabel(log)}</div>
                        {log.actorEmail && log.actorName ? (
                          <div className="text-xs text-zinc-500">
                            {log.actorEmail}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{getTargetLabel(log)}</div>
                        <div className="text-xs capitalize text-zinc-500">
                          {log.targetType.replace(/_/g, " ")}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-lg text-sm text-zinc-600">
                        {log.description}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col justify-between gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center">
            <span>
              Showing {logs.length} of {total} matching events
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
    </div>
  );
}
