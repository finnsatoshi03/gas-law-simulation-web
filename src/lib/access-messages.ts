import { getSupabaseClient } from "@/lib/supabase";

export const ACCESS_MESSAGE_KEY = {
  ACCESS_DENIED: "access_denied",
  ACCOUNT_PENDING: "account_pending",
  ACCOUNT_REJECTED: "account_rejected",
  ACCOUNT_SUSPENDED: "account_suspended",
  APP_LOCKED: "app_locked",
  FEATURE_LOCKED: "feature_locked",
  PROFILE_ERROR: "profile_error",
} as const;

export type AccessMessageKey =
  (typeof ACCESS_MESSAGE_KEY)[keyof typeof ACCESS_MESSAGE_KEY];

export interface AccessMessage {
  createdAt: string | null;
  description: string;
  helpText: string;
  key: AccessMessageKey;
  title: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

interface AccessMessageRow {
  created_at: string | null;
  description: string | null;
  help_text: string | null;
  message_key: unknown;
  title: string | null;
  updated_at: string | null;
  updated_by: string | null;
}

export const FALLBACK_ACCESS_MESSAGES: Record<
  AccessMessageKey,
  AccessMessage
> = {
  [ACCESS_MESSAGE_KEY.ACCESS_DENIED]: {
    createdAt: null,
    description: "Your account does not have permission to access this page.",
    helpText: "",
    key: ACCESS_MESSAGE_KEY.ACCESS_DENIED,
    title: "Access denied",
    updatedAt: null,
    updatedBy: null,
  },
  [ACCESS_MESSAGE_KEY.ACCOUNT_PENDING]: {
    createdAt: null,
    description:
      "Your account has been created successfully and is currently awaiting administrator approval.",
    helpText:
      "You will gain access to the simulations once your account has been approved.",
    key: ACCESS_MESSAGE_KEY.ACCOUNT_PENDING,
    title: "Approval pending",
    updatedAt: null,
    updatedBy: null,
  },
  [ACCESS_MESSAGE_KEY.ACCOUNT_REJECTED]: {
    createdAt: null,
    description: "Your account was not approved for access.",
    helpText:
      "Please contact the administrator if you believe this is an error.",
    key: ACCESS_MESSAGE_KEY.ACCOUNT_REJECTED,
    title: "Access request rejected",
    updatedAt: null,
    updatedBy: null,
  },
  [ACCESS_MESSAGE_KEY.ACCOUNT_SUSPENDED]: {
    createdAt: null,
    description: "Your account is currently suspended.",
    helpText: "Please contact the administrator for assistance.",
    key: ACCESS_MESSAGE_KEY.ACCOUNT_SUSPENDED,
    title: "Account suspended",
    updatedAt: null,
    updatedBy: null,
  },
  [ACCESS_MESSAGE_KEY.APP_LOCKED]: {
    createdAt: null,
    description:
      "The Gas Law Simulation app is temporarily unavailable. Please check back later.",
    helpText: "",
    key: ACCESS_MESSAGE_KEY.APP_LOCKED,
    title: "App temporarily locked",
    updatedAt: null,
    updatedBy: null,
  },
  [ACCESS_MESSAGE_KEY.FEATURE_LOCKED]: {
    createdAt: null,
    description: "This feature is currently locked by the administrator.",
    helpText: "",
    key: ACCESS_MESSAGE_KEY.FEATURE_LOCKED,
    title: "Feature locked",
    updatedAt: null,
    updatedBy: null,
  },
  [ACCESS_MESSAGE_KEY.PROFILE_ERROR]: {
    createdAt: null,
    description:
      "Your account profile could not be loaded. Try again or contact the administrator.",
    helpText: "",
    key: ACCESS_MESSAGE_KEY.PROFILE_ERROR,
    title: "Account profile unavailable",
    updatedAt: null,
    updatedBy: null,
  },
};

export const ACCESS_MESSAGE_KEYS = Object.values(ACCESS_MESSAGE_KEY);

export const isAccessMessageKey = (
  value: unknown
): value is AccessMessageKey =>
  ACCESS_MESSAGE_KEYS.some((key) => key === value);

const mapAccessMessage = (row: AccessMessageRow): AccessMessage | null => {
  if (!isAccessMessageKey(row.message_key)) {
    return null;
  }

  const fallback = FALLBACK_ACCESS_MESSAGES[row.message_key];

  return {
    createdAt: row.created_at,
    description: row.description || fallback.description,
    helpText: row.help_text ?? fallback.helpText,
    key: row.message_key,
    title: row.title || fallback.title,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
};

const getFallbackMessageMap = () =>
  new Map<AccessMessageKey, AccessMessage>(
    ACCESS_MESSAGE_KEYS.map((key) => [key, FALLBACK_ACCESS_MESSAGES[key]])
  );

const getSafeAccessMessageError = (error: unknown, fallback: string) => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("administrator access is required")) {
    return "Your administrator access is no longer available.";
  }

  if (
    message.includes("permission denied") ||
    message.includes("row-level security")
  ) {
    return "You do not have permission to update access messages.";
  }

  if (message.includes("message title is required")) {
    return "Add a title before saving this access message.";
  }

  if (message.includes("message description is required")) {
    return "Add a description before saving this access message.";
  }

  return fallback;
};

export const listAccessMessages = async () => {
  const { data, error } = await getSupabaseClient()
    .from("access_messages")
    .select(
      "message_key, title, description, help_text, updated_by, created_at, updated_at"
    )
    .in("message_key", ACCESS_MESSAGE_KEYS)
    .order("message_key", { ascending: true });

  if (error) {
    throw new Error(
      getSafeAccessMessageError(
        error,
        "Could not load access messages. Defaults will be used."
      )
    );
  }

  const messages = getFallbackMessageMap();

  for (const row of (data ?? []) as AccessMessageRow[]) {
    const message = mapAccessMessage(row);

    if (message) {
      messages.set(message.key, message);
    }
  }

  return messages;
};

export const updateAccessMessage = async ({
  description,
  helpText,
  key,
  title,
}: {
  description: string;
  helpText: string;
  key: AccessMessageKey;
  title: string;
}) => {
  const { data, error } = await getSupabaseClient().rpc(
    "admin_update_access_message",
    {
      next_description: description,
      next_help_text: helpText,
      next_title: title,
      target_message_key: key,
    }
  );

  if (error) {
    throw new Error(
      getSafeAccessMessageError(error, "Could not update this access message.")
    );
  }

  const row = Array.isArray(data) ? data[0] : data;
  const message = mapAccessMessage(row as AccessMessageRow);

  if (!message) {
    throw new Error("The updated access message was not returned.");
  }

  return message;
};
