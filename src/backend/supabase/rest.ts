import "server-only";

import { cache } from "react";
import { getSupabasePublicEnv } from "@/backend/supabase/clients";

export type Row = Record<string, unknown>;

/**
 * Cacheable read path for public, RLS-protected tables. It uses the publishable
 * key and Next's fetch cache so storefront pages can be served without a
 * per-request round trip. Never use this for privileged reads.
 */
const restGet = cache(
  async (path: string, tags: string[], revalidate: number): Promise<Row[] | null> => {
    const env = getSupabasePublicEnv();
    if (!env) return null;

    try {
      const response = await fetch(`${env.url.replace(/\/$/, "")}/rest/v1/${path}`, {
        headers: {
          apikey: env.key,
          Authorization: `Bearer ${env.key}`,
        },
        next: { tags, revalidate },
      });
      if (!response.ok) return null;
      const rows: unknown = await response.json();
      return Array.isArray(rows) ? (rows as Row[]) : null;
    } catch {
      return null;
    }
  },
);

export function readRows(
  table: string,
  query: string,
  tags: string[],
  revalidate: number,
) {
  return restGet(`${encodeURIComponent(table)}?${query}`, tags, revalidate);
}
