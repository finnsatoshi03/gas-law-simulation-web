import { useState } from "react";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { OAUTH_PROVIDERS, OAuthProvider } from "@/lib/oauth";
import { authSocialButtonClass } from "./auth-styles";

const GoogleIcon = () => (
  <svg
    aria-hidden="true"
    className="size-[19px]"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    aria-hidden="true"
    className="size-[19px]"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#1877F2"
      d="M24 12a12 12 0 1 0-13.875 11.854v-8.385H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.385A12.002 12.002 0 0 0 24 12z"
    />
  </svg>
);

const PROVIDER_ICONS: Record<OAuthProvider, () => JSX.Element> = {
  google: GoogleIcon,
  facebook: FacebookIcon,
};

interface OAuthButtonsProps {
  disabled?: boolean;
  onError: (message: string) => void;
}

export const OAuthButtons = ({ disabled, onError }: OAuthButtonsProps) => {
  const { signInWithProvider } = useAuth();
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(
    null
  );

  const handleSignIn = async (provider: OAuthProvider) => {
    if (pendingProvider) {
      return;
    }

    onError("");
    setPendingProvider(provider);

    try {
      // On success the browser is redirected to the provider, so this promise
      // typically does not resolve within this page lifecycle.
      await signInWithProvider(provider);
    } catch (oauthError) {
      onError(
        oauthError instanceof Error
          ? oauthError.message
          : "We could not complete sign-in with that provider. Try again."
      );
      setPendingProvider(null);
    }
  };

  return (
    <div className="flex flex-col gap-3.5">
      {OAUTH_PROVIDERS.map((provider) => {
        const Icon = PROVIDER_ICONS[provider.id];
        const isPending = pendingProvider === provider.id;

        return (
          <button
            key={provider.id}
            type="button"
            className={authSocialButtonClass}
            disabled={disabled || pendingProvider !== null}
            onClick={() => handleSignIn(provider.id)}
          >
            {isPending ? (
              <Loader2 className="size-[19px] animate-spin" />
            ) : (
              <Icon />
            )}
            {isPending
              ? `Connecting to ${provider.label}...`
              : `Continue with ${provider.label}`}
          </button>
        );
      })}
    </div>
  );
};
