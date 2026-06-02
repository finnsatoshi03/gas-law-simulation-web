import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getSafeAuthErrorMessage } from "@/lib/auth-errors";
import { getOAuthRedirectUrl, OAuthProvider } from "@/lib/oauth";
import {
  getSupabaseClient,
  supabase,
  supabaseConfigurationError,
} from "@/lib/supabase";

interface SignUpResult {
  requiresEmailConfirmation: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  session: Session | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<SignUpResult>;
  signInWithProvider: (provider: OAuthProvider) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      setIsLoading(false);

      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
      }

      if (event === "SIGNED_OUT") {
        setIsPasswordRecovery(false);
      }
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }

      setSession(error ? null : data.session);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(
        getSafeAuthErrorMessage(error, "Could not log in. Try again.")
      );
    }
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const { data, error } = await getSupabaseClient().auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) {
        throw new Error(
          getSafeAuthErrorMessage(error, "Could not create your account.")
        );
      }

      // Supabase's email-enumeration protection: when "Confirm email" is on,
      // signing up with an already-registered address returns no error and an
      // obfuscated user whose `identities` array is empty. Treat that as a
      // duplicate account so the user gets a clear message.
      const identities = data.user?.identities;
      if (identities && identities.length === 0) {
        throw new Error(
          "An account with this email address already exists. Log in instead."
        );
      }

      return {
        requiresEmailConfirmation: !data.session,
      };
    },
    []
  );

  const signInWithProvider = useCallback(async (provider: OAuthProvider) => {
    const { error } = await getSupabaseClient().auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getOAuthRedirectUrl(),
      },
    });

    if (error) {
      throw new Error(
        getSafeAuthErrorMessage(
          error,
          "We could not start sign-in with that provider. Try again."
        )
      );
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await getSupabaseClient().auth.signOut({
        scope: "local",
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error(
        getSafeAuthErrorMessage(
          error,
          "You were logged out locally, but the sign-out request could not be completed."
        )
      );
    } finally {
      setSession(null);
      setIsPasswordRecovery(false);
    }
  }, []);

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    const redirectTo = `${window.location.origin}${window.location.pathname}#/reset-password`;
    const { error } = await getSupabaseClient().auth.resetPasswordForEmail(
      email,
      { redirectTo }
    );

    if (error) {
      throw new Error(
        getSafeAuthErrorMessage(
          error,
          "Could not send the recovery email. Try again."
        )
      );
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const client = getSupabaseClient();
    const { error } = await client.auth.updateUser({ password });

    if (error) {
      throw new Error(
        getSafeAuthErrorMessage(error, "Could not update your password.")
      );
    }

    await client.auth.signOut({ scope: "local" });
    setSession(null);
    setIsPasswordRecovery(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session),
      isLoading,
      isPasswordRecovery,
      login,
      logout,
      sendPasswordResetEmail,
      session,
      signInWithProvider,
      signUp,
      updatePassword,
      user: session?.user ?? null,
    }),
    [
      isLoading,
      isPasswordRecovery,
      login,
      logout,
      sendPasswordResetEmail,
      session,
      signInWithProvider,
      signUp,
      updatePassword,
    ]
  );

  if (supabaseConfigurationError) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-50 p-6">
        <section className="max-w-2xl rounded-xl border border-red-200 bg-white p-6 shadow">
          <h1 className="text-lg font-semibold text-red-700">
            Supabase configuration error
          </h1>
          <p className="mt-2 text-sm text-zinc-700">
            {supabaseConfigurationError}
          </p>
          <p className="mt-4 text-sm text-zinc-600">
            Update the local environment variables and restart the Vite
            development server.
          </p>
        </section>
      </main>
    );
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
