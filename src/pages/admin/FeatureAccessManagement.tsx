import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Lock,
  Loader2,
  RefreshCw,
  Save,
  ShieldCheck,
  Unlock,
} from "lucide-react";

import { DEFAULT_FEATURE_LOCK_MESSAGE } from "@/lib/access-control";
import {
  FEATURE_REGISTRY,
  FeatureDefinition,
  FeatureKey,
} from "@/lib/features";
import { useAccessControl } from "@/contexts/AccessControlContext";
import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface FeatureDraft {
  isLocked: boolean;
  lockMessage: string;
}

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Never";

export default function FeatureAccessManagement() {
  const { showToast } = useToast();
  const {
    featureSettings,
    isLoading,
    refreshAccessControls,
    updateFeatureAccessSetting,
  } = useAccessControl();
  const [featureDrafts, setFeatureDrafts] = useState<
    Partial<Record<FeatureKey, FeatureDraft>>
  >({});
  const [mutatingFeatureKey, setMutatingFeatureKey] =
    useState<FeatureKey | null>(null);
  const [pendingFeature, setPendingFeature] =
    useState<FeatureDefinition | null>(null);

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

  const handleSaveFeatureLock = async (
    feature: FeatureDefinition,
    confirmed = false
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
      setPendingFeature(feature);
      return;
    }

    setMutatingFeatureKey(feature.key);

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
      setPendingFeature(null);
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

  const pendingDraft = pendingFeature
    ? featureDrafts[pendingFeature.key]
    : null;
  const lockedFeatureCount = FEATURE_REGISTRY.reduce((count, feature) => {
    const draft = featureDrafts[feature.key];
    return draft?.isLocked ? count + 1 : count;
  }, 0);

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
            <ShieldCheck className="size-6 text-violet-700" />
            <h1 className="text-2xl font-bold">Feature access controls</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Manage feature-level locks and the messages standard users see.
          </p>
        </div>
        <Button
          disabled={isLoading}
          onClick={() => void refreshAccessControls()}
          variant="outline"
        >
          <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-5" />
            Feature locks
          </CardTitle>
          <CardDescription>
            {lockedFeatureCount} of {FEATURE_REGISTRY.length} features are
            currently locked for standard users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-2">
            {FEATURE_REGISTRY.map((feature) => {
              const setting = featureSettings.get(feature.key);
              const draft = featureDrafts[feature.key] ?? {
                isLocked: false,
                lockMessage: DEFAULT_FEATURE_LOCK_MESSAGE,
              };
              const isDirty =
                draft.isLocked !== Boolean(setting?.isLocked) ||
                draft.lockMessage !==
                  (setting?.lockMessage ?? DEFAULT_FEATURE_LOCK_MESSAGE);
              const isFeatureMutating = mutatingFeatureKey === feature.key;

              return (
                <div className="rounded-xl border p-4" key={feature.key}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold">{feature.name}</h4>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                          {feature.category}
                        </span>
                        {draft.isLocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                            <Lock className="size-3" />
                            Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
                            <Unlock className="size-3" />
                            Unlocked
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
                        {feature.description}
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">
                        Last updated {formatDate(setting?.updatedAt ?? null)}
                      </p>
                    </div>

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
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`feature-lock-message-${feature.key}`}>
                      Lock message
                    </Label>
                    <Textarea
                      id={`feature-lock-message-${feature.key}`}
                      onChange={(event) =>
                        setFeatureDrafts((drafts) => ({
                          ...drafts,
                          [feature.key]: {
                            ...draft,
                            lockMessage: event.target.value,
                          },
                        }))
                      }
                      value={draft.lockMessage}
                    />
                  </div>

                  <div className="mt-4 flex justify-end">
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
        </CardContent>
      </Card>

      <AlertDialog
        onOpenChange={(open) => {
          if (!open && !mutatingFeatureKey) {
            setPendingFeature(null);
          }
        }}
        open={Boolean(pendingFeature)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm feature lock</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <span className="block">
                Lock {pendingFeature?.name} for standard users? Admins will keep
                access.
              </span>
              <span className="block rounded-lg border bg-zinc-50 p-3 text-zinc-700">
                <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Lock message users will see
                </span>
                <span className="mt-1 block">
                  {pendingDraft?.lockMessage || DEFAULT_FEATURE_LOCK_MESSAGE}
                </span>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(mutatingFeatureKey)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-700 text-white hover:bg-amber-800 focus-visible:ring-amber-700"
              disabled={Boolean(mutatingFeatureKey)}
              onClick={(event) => {
                event.preventDefault();

                if (pendingFeature) {
                  void handleSaveFeatureLock(pendingFeature, true);
                }
              }}
            >
              {mutatingFeatureKey ? (
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
