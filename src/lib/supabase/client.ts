import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

import { requireSupabasePublicEnv } from "./env";

export function createClient() {
  const { url, key } = requireSupabasePublicEnv();

  return createBrowserClient<Database>(url, key);
}
