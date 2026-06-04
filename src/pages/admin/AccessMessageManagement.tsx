import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  MessageSquareText,
  RefreshCw,
  Save,
} from "lucide-react";

import {
  AccessMessage,
  AccessMessageKey,
  ACCESS_MESSAGE_KEY,
} from "@/lib/access-messages";
import { useAccessMessages } from "@/contexts/AccessMessagesContext";
import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MessageDraft {
  description: string;
  helpText: string;
  title: string;
}

const MESSAGE_ORDER: {
  key: AccessMessageKey;
  label: string;
  note: string;
}[] = [
  {
    key: ACCESS_MESSAGE_KEY.ACCOUNT_PENDING,
    label: "Pending account",
    note: "Shown while a newly registered user waits for approval.",
  },
  {
    key: ACCESS_MESSAGE_KEY.ACCOUNT_SUSPENDED,
    label: "Suspended account",
    note: "Shown when an account is suspended by an administrator.",
  },
  {
    key: ACCESS_MESSAGE_KEY.ACCOUNT_REJECTED,
    label: "Rejected account",
    note: "Shown when a sign-up request is rejected.",
  },
  {
    key: ACCESS_MESSAGE_KEY.PROFILE_ERROR,
    label: "Profile unavailable",
    note: "Shown when the app cannot load the user's profile.",
  },
  {
    key: ACCESS_MESSAGE_KEY.ACCESS_DENIED,
    label: "Access denied",
    note: "Shown when a user reaches a route they cannot access.",
  },
  {
    key: ACCESS_MESSAGE_KEY.APP_LOCKED,
    label: "App locked fallback",
    note: "Fallback copy for full-app lock screens.",
  },
  {
    key: ACCESS_MESSAGE_KEY.FEATURE_LOCKED,
    label: "Feature locked fallback",
    note: "Fallback copy for feature-lock screens.",
  },
];

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Never";

const toDraft = (message: AccessMessage): MessageDraft => ({
  description: message.description,
  helpText: message.helpText,
  title: message.title,
});

export default function AccessMessageManagement() {
  const { showToast } = useToast();
  const {
    getAccessMessage,
    isLoading,
    refreshAccessMessages,
    updateAccessMessage,
  } = useAccessMessages();
  const [drafts, setDrafts] = useState<
    Partial<Record<AccessMessageKey, MessageDraft>>
  >({});
  const [mutatingKey, setMutatingKey] = useState<AccessMessageKey | null>(null);

  useEffect(() => {
    const nextDrafts: Partial<Record<AccessMessageKey, MessageDraft>> = {};

    for (const messageConfig of MESSAGE_ORDER) {
      nextDrafts[messageConfig.key] = toDraft(
        getAccessMessage(messageConfig.key)
      );
    }

    setDrafts(nextDrafts);
  }, [getAccessMessage]);

  const handleSave = async (key: AccessMessageKey) => {
    if (mutatingKey) {
      return;
    }

    const draft = drafts[key];

    if (!draft) {
      return;
    }

    setMutatingKey(key);

    try {
      const updatedMessage = await updateAccessMessage({
        description: draft.description,
        helpText: draft.helpText,
        key,
        title: draft.title,
      });
      showToast({
        description: `${updatedMessage.title} was updated.`,
        title: "Access message updated",
        variant: "success",
      });
    } catch (messageError) {
      showToast({
        description:
          messageError instanceof Error
            ? messageError.message
            : "Could not update this access message.",
        title: "Message update failed",
        variant: "error",
      });
    } finally {
      setMutatingKey(null);
    }
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
            <MessageSquareText className="size-6 text-violet-700" />
            <h1 className="text-2xl font-bold">Access messages</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Manage the messages users see when access is restricted.
          </p>
        </div>
        <Button
          disabled={isLoading}
          onClick={() => void refreshAccessMessages()}
          variant="outline"
        >
          <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {MESSAGE_ORDER.map((messageConfig) => {
          const message = getAccessMessage(messageConfig.key);
          const draft = drafts[messageConfig.key] ?? toDraft(message);
          const isMutating = mutatingKey === messageConfig.key;
          const isDirty =
            draft.title !== message.title ||
            draft.description !== message.description ||
            draft.helpText !== message.helpText;

          return (
            <Card key={messageConfig.key}>
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center gap-2">
                  {messageConfig.label}
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                    {messageConfig.key}
                  </span>
                </CardTitle>
                <CardDescription>
                  {messageConfig.note} Last updated{" "}
                  {formatDate(message.updatedAt)}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`message-title-${messageConfig.key}`}>
                    Title
                  </Label>
                  <Input
                    id={`message-title-${messageConfig.key}`}
                    onChange={(event) =>
                      setDrafts((currentDrafts) => ({
                        ...currentDrafts,
                        [messageConfig.key]: {
                          ...draft,
                          title: event.target.value,
                        },
                      }))
                    }
                    value={draft.title}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`message-description-${messageConfig.key}`}>
                    Description
                  </Label>
                  <Textarea
                    id={`message-description-${messageConfig.key}`}
                    onChange={(event) =>
                      setDrafts((currentDrafts) => ({
                        ...currentDrafts,
                        [messageConfig.key]: {
                          ...draft,
                          description: event.target.value,
                        },
                      }))
                    }
                    value={draft.description}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`message-help-${messageConfig.key}`}>
                    Help text
                  </Label>
                  <Textarea
                    id={`message-help-${messageConfig.key}`}
                    onChange={(event) =>
                      setDrafts((currentDrafts) => ({
                        ...currentDrafts,
                        [messageConfig.key]: {
                          ...draft,
                          helpText: event.target.value,
                        },
                      }))
                    }
                    value={draft.helpText}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    disabled={!isDirty || Boolean(mutatingKey)}
                    onClick={() => void handleSave(messageConfig.key)}
                    size="sm"
                  >
                    {isMutating ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Save message
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
