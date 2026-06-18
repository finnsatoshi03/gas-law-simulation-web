/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_API_KEY?: string;
  readonly VITE_SUPABASE_URL?: string;
  // Dev-only: set to "true" to bypass auth in local dev builds. Ignored in production.
  readonly VITE_DEV_AUTH_BYPASS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
