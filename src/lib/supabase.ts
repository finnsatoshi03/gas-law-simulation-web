import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY?.trim();

const getConfigurationError = () => {
  const issues: string[] = [];

  if (!supabaseUrl) {
    issues.push("VITE_SUPABASE_URL is missing");
  } else if (!/^https?:\/\//i.test(supabaseUrl)) {
    issues.push("VITE_SUPABASE_URL must be an HTTP(S) project URL");
  } else {
    const url = new URL(supabaseUrl);

    if (url.pathname !== "/" || url.search || url.hash) {
      issues.push(
        "VITE_SUPABASE_URL must be the project base URL without an API path, query, or hash"
      );
    }
  }

  if (!supabaseApiKey) {
    issues.push("VITE_SUPABASE_API_KEY is missing");
  } else if (/^https?:\/\//i.test(supabaseApiKey)) {
    issues.push(
      "VITE_SUPABASE_API_KEY contains a URL; move that value to VITE_SUPABASE_URL and add a public publishable or legacy anon key"
    );
  }

  if (issues.length === 0) {
    return null;
  }

  return `Supabase authentication is not configured: ${issues.join(
    "; "
  )}. Do not use a service-role key in browser code.`;
};

export const supabaseConfigurationError = getConfigurationError();

export const supabase = supabaseConfigurationError
  ? null
  : createClient(supabaseUrl!, supabaseApiKey!, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        persistSession: true,
      },
    });

export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      supabaseConfigurationError ?? "Supabase authentication is unavailable."
    );
  }

  return supabase;
};
