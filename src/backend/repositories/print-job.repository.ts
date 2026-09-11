import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  PrintJob,
  PrintTriggerSource,
} from "@/types/database";

type Db = SupabaseClient<Database>;

export type NewPrintJobRow = Database["public"]["Tables"]["print_jobs"]["Insert"];

export const PRINT_JOB_LIST_COLUMNS =
  "id, order_id, status, trigger_source, attempts, max_attempts, next_attempt_at, last_error, printed_at, payload, created_at, updated_at";

export function insertPrintJob(db: Db, row: NewPrintJobRow) {
  return db.from("print_jobs").insert(row).select(PRINT_JOB_LIST_COLUMNS).single();
}

export function findPrintJobById(db: Db, id: string) {
  return db.from("print_jobs").select("*").eq("id", id).maybeSingle();
}

export function findLatestPrintJobForOrder(db: Db, orderId: string) {
  return db
    .from("print_jobs")
    .select(PRINT_JOB_LIST_COLUMNS)
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

export function findLatestPrintJobsForOrders(db: Db, orderIds: string[]) {
  if (!orderIds.length) {
    return Promise.resolve({ data: [] as PrintJob[], error: null });
  }

  return db
    .from("print_jobs")
    .select(PRINT_JOB_LIST_COLUMNS)
    .in("order_id", orderIds)
    .order("created_at", { ascending: false });
}

/**
 * Claim the next due job. Uses a compare-and-swap so two workers cannot print
 * the same bill at once.
 */
export async function claimNextPrintJob(db: Db): Promise<PrintJob | null> {
  const due = await db
    .from("print_jobs")
    .select("*")
    .eq("status", "pending")
    .lte("next_attempt_at", new Date().toISOString())
    .order("next_attempt_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (due.error || !due.data) return null;

  const job = due.data;

  const claimed = await db
    .from("print_jobs")
    .update({
      status: "printing",
      attempts: job.attempts + 1,
    })
    .eq("id", job.id)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();

  return claimed.data ?? null;
}

export function markPrintJobPrinted(db: Db, id: string) {
  return db
    .from("print_jobs")
    .update({
      status: "printed",
      last_error: null,
      printed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "printing");
}

export function markPrintJobFailed(
  db: Db,
  id: string,
  error: string,
  nextAttemptAt: string | null,
  exhausted: boolean,
) {
  return db
    .from("print_jobs")
    .update({
      status: exhausted ? "failed" : "pending",
      last_error: error.slice(0, 500),
      next_attempt_at: nextAttemptAt ?? new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "printing");
}

export function listPrintJobsForOrder(db: Db, orderId: string) {
  return db
    .from("print_jobs")
    .select(PRINT_JOB_LIST_COLUMNS)
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });
}

export type { PrintTriggerSource };
