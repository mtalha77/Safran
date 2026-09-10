import { getSupabasePublicEnv } from "@/lib/supabase/env";

export type LiveStoreAvailability = {
  closed: boolean;
  message?: string;
};

export async function fetchLiveStoreAvailability(): Promise<LiveStoreAvailability | null> {
  const env = getSupabasePublicEnv();
  if (!env) return null;

  try {
    const response = await fetch(
      `${env.url.replace(/\/$/, "")}/rest/v1/store_availability?select=accepts_orders,paused_reason&id=eq.true`,
      {
        headers: {
          apikey: env.key,
          Authorization: `Bearer ${env.key}`,
        },
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    const rows: unknown = await response.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row || typeof row !== "object") return null;
    const data = row as { accepts_orders?: unknown; paused_reason?: unknown };
    return {
      closed: data.accepts_orders === false,
      message: typeof data.paused_reason === "string" ? data.paused_reason : undefined,
    };
  } catch {
    return null;
  }
}
