import { createClient } from "@/lib/supabase/server";

export type AdminContext =
  | { state: "setup" }
  | { state: "anonymous" }
  | { state: "forbidden" }
  | { state: "ready"; email?: string; supabase: Awaited<ReturnType<typeof createClient>> };

export function hasSupabaseEnvironment() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function getAdminContext(): Promise<AdminContext> {
  if (!hasSupabaseEnvironment()) return { state: "setup" };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { state: "anonymous" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") return { state: "forbidden" };
    return { state: "ready", email: user.email, supabase };
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

export function statusClass(status: string) {
  if (status === "cancelled") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-slate-100 text-slate-700";
  if (status === "ready") return "bg-emerald-100 text-emerald-800";
  if (status === "preparing") return "bg-amber-100 text-amber-800";
  return "bg-sage/15 text-sage-deep";
}
