import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AccessMessage,
  AccessMessageKey,
  ACCESS_MESSAGE_KEYS,
  FALLBACK_ACCESS_MESSAGES,
  listAccessMessages,
  updateAccessMessage as updateAccessMessageRequest,
} from "@/lib/access-messages";
import { getSupabaseClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface AccessMessagesContextType {
  getAccessMessage: (key: AccessMessageKey) => AccessMessage;
  isLoading: boolean;
  messages: Map<AccessMessageKey, AccessMessage>;
  refreshAccessMessages: () => Promise<void>;
  updateAccessMessage: (message: {
    description: string;
    helpText: string;
    key: AccessMessageKey;
    title: string;
  }) => Promise<AccessMessage>;
}

const AccessMessagesContext =
  createContext<AccessMessagesContextType | null>(null);

const getFallbackMessages = () =>
  new Map<AccessMessageKey, AccessMessage>(
    ACCESS_MESSAGE_KEYS.map((key) => [key, FALLBACK_ACCESS_MESSAGES[key]])
  );

export const AccessMessagesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isAuthenticated } = useAuth();
  const requestIdRef = useRef(0);
  const [messages, setMessages] = useState(getFallbackMessages);
  const [hasLoaded, setHasLoaded] = useState(false);

  const refreshAccessMessages = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (!isAuthenticated) {
      setMessages(getFallbackMessages());
      setHasLoaded(false);
      return;
    }

    try {
      const nextMessages = await listAccessMessages();

      if (requestIdRef.current !== requestId) {
        return;
      }

      setMessages(nextMessages);
      setHasLoaded(true);
    } catch {
      if (requestIdRef.current !== requestId) {
        return;
      }

      setMessages(getFallbackMessages());
      setHasLoaded(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshAccessMessages();
  }, [refreshAccessMessages]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const client = getSupabaseClient();
    const channel = client
      .channel("access-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "access_messages",
        },
        () => void refreshAccessMessages()
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [isAuthenticated, refreshAccessMessages]);

  const updateAccessMessage = useCallback(
    async (message: {
      description: string;
      helpText: string;
      key: AccessMessageKey;
      title: string;
    }) => {
      const updatedMessage = await updateAccessMessageRequest(message);

      setMessages((currentMessages) => {
        const nextMessages = new Map(currentMessages);
        nextMessages.set(updatedMessage.key, updatedMessage);
        return nextMessages;
      });

      return updatedMessage;
    },
    []
  );

  const value = useMemo<AccessMessagesContextType>(
    () => ({
      getAccessMessage: (key: AccessMessageKey) =>
        messages.get(key) ?? FALLBACK_ACCESS_MESSAGES[key],
      isLoading: isAuthenticated && !hasLoaded,
      messages,
      refreshAccessMessages,
      updateAccessMessage,
    }),
    [
      hasLoaded,
      isAuthenticated,
      messages,
      refreshAccessMessages,
      updateAccessMessage,
    ]
  );

  return (
    <AccessMessagesContext.Provider value={value}>
      {children}
    </AccessMessagesContext.Provider>
  );
};

export const useAccessMessages = () => {
  const context = useContext(AccessMessagesContext);

  if (!context) {
    throw new Error(
      "useAccessMessages must be used within an AccessMessagesProvider"
    );
  }

  return context;
};
