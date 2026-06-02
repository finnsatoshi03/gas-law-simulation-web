import { getSafeAuthErrorMessage } from "@/lib/auth-errors";

export type OAuthProvider = "google" | "facebook";

export interface OAuthProviderConfig {
  id: OAuthProvider;
  label: string;
}

export const OAUTH_PROVIDERS: OAuthProviderConfig[] = [
  { id: "google", label: "Google" },
  { id: "facebook", label: "Facebook" },
];

/**
 * Where Supabase should send the browser after a successful OAuth round-trip.
 *
 * The app is served through a HashRouter, so we redirect to the application
 * origin (without a hash route). Supabase appends the auth `code` to this URL,
 * the client exchanges it (detectSessionInUrl + PKCE), and the index route then
 * forwards authenticated users to /home.
 */
export const getOAuthRedirectUrl = () =>
  `${window.location.origin}${window.location.pathname}`;

/**
 * Reads an OAuth error that a provider may have appended to the redirect URL
 * (e.g. `?error=access_denied&error_description=...`) and returns a friendly,
 * sanitized message. Returns null when no OAuth error is present.
 */
export const readOAuthErrorFromUrl = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const search = new URLSearchParams(window.location.search);

  // Implicit-flow errors can also land in the hash fragment.
  const rawHash = window.location.hash.replace(/^#\/?/, "");
  const hashQuery = rawHash.includes("?")
    ? rawHash.slice(rawHash.indexOf("?") + 1)
    : rawHash.includes("=")
    ? rawHash
    : "";
  const hash = new URLSearchParams(hashQuery);

  const errorCode = search.get("error") ?? hash.get("error");
  const errorDescription =
    search.get("error_description") ?? hash.get("error_description");

  if (!errorCode && !errorDescription) {
    return null;
  }

  if (errorCode === "access_denied") {
    return "Sign-in was cancelled. Try again to continue.";
  }

  return getSafeAuthErrorMessage(
    new Error(errorDescription ?? errorCode ?? ""),
    "We could not complete sign-in with that provider. Try again."
  );
};

/**
 * Removes OAuth-related query/hash params from the URL so the error or code
 * does not persist across refreshes and navigation.
 */
export const clearOAuthParamsFromUrl = () => {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  const keys = ["error", "error_code", "error_description", "code", "state"];
  let changed = false;

  keys.forEach((key) => {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  });

  if (!changed) {
    return;
  }

  const nextSearch = url.searchParams.toString();
  const cleaned = `${url.origin}${url.pathname}${
    nextSearch ? `?${nextSearch}` : ""
  }${url.hash}`;

  window.history.replaceState({}, document.title, cleaned);
};
