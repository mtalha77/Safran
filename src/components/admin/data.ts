import "server-only";

import { getSessionContext, hasSupabaseEnvironment } from "@/backend/auth/session";
import { isBackOfficeRole } from "@/backend/domain/roles";
import type { AppRole } from "@/backend/types";

export type AdminContext =
  | { state: "setup" }
  | { state: "anonymous" }
  | { state: "forbidden" }
  | { state: "ready"; email?: string; role: AppRole };

export { hasSupabaseEnvironment };

/**
 * Render gate for the admin area. It reports why access is denied so the layout
 * can show the setup screen or bounce to login, while pages can bail out
 * quietly during the parallel render.
 *
 * This is not the security boundary: every privileged read and write goes
 * through `requireCapability` in the backend layer and through RLS.
 */
export async function getAdminContext(): Promise<AdminContext> {
  if (!hasSupabaseEnvironment()) return { state: "setup" };

  try {
    const { actor } = await getSessionContext();
    if (!actor) return { state: "anonymous" };
    if (!isBackOfficeRole(actor.role)) return { state: "forbidden" };

    return { state: "ready", email: actor.email, role: actor.role };
  } catch {
    return { state: "setup" };
  }
}

export function formatMoney(value: number | string | null | undefined) {
  const amount = typeof value === "string" ? Number(value) : value ?? 0;
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "–";
  return new Intl.DateTimeFormat("de-CH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export const orderStatusLabels: Record<string, string> = {
  pending: "Neu",
  confirmed: "Bestätigt",
  preparing: "In Zubereitung",
  ready: "Bereit",
  out_for_delivery: "Unterwegs",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

/** Button label shown for the transition into each status. */
export const statusActionLabels: Record<string, string> = {
  confirmed: "Bestätigen",
  preparing: "Zubereitung starten",
  ready: "Als bereit markieren",
  out_for_delivery: "An Lieferung übergeben",
  completed: "Abschliessen",
  cancelled: "Stornieren",
};

export function statusClass(status: string) {
  if (status === "cancelled") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-slate-100 text-slate-700";
  if (status === "ready") return "bg-emerald-100 text-emerald-800";
  if (status === "preparing") return "bg-amber-100 text-amber-800";
  return "bg-sage/15 text-sage-deep";
}
