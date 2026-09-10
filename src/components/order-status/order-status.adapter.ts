/**
 * Sole translation point from backend order statuses to customer UI stages.
 * Unknown values never become a successful progress step.
 */

export type CustomerOrderStage =
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivering"
  | "completed"
  | "cancelled"
  | "unknown";

/** Stages that appear in the successful progress sequence. */
export const PROGRESS_STAGES = [
  "confirmed",
  "preparing",
  "ready",
  "delivering",
  "completed",
] as const;

export type ProgressStage = (typeof PROGRESS_STAGES)[number];

const ALIASES: Record<string, CustomerOrderStage> = {
  // Confirmed / accepted
  pending: "confirmed",
  received: "confirmed",
  accepted: "confirmed",
  confirmed: "confirmed",
  // Kitchen
  preparing: "preparing",
  cooking: "preparing",
  in_kitchen: "preparing",
  inkitchen: "preparing",
  // Packed
  ready: "ready",
  packed: "ready",
  awaiting_pickup: "ready",
  awaitingpickup: "ready",
  ready_for_pickup: "ready",
  // Delivery
  assigned: "delivering",
  picked_up: "delivering",
  pickedup: "delivering",
  out_for_delivery: "delivering",
  outfordelivery: "delivering",
  in_delivery: "delivering",
  indelivery: "delivering",
  delivering: "delivering",
  // Done
  delivered: "completed",
  complete: "completed",
  completed: "completed",
  // Stopped
  cancelled: "cancelled",
  canceled: "cancelled",
  rejected: "cancelled",
};

function normalizeRaw(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

/**
 * Maps a backend status string to a canonical customer stage.
 * Logs unknowns through console.warn (no telemetry package in this repo).
 */
export function toCustomerOrderStage(raw: unknown): CustomerOrderStage {
  const key = normalizeRaw(raw);
  if (!key) return "unknown";

  const mapped = ALIASES[key];
  if (mapped) return mapped;

  console.warn("[order-status] unknown backend status:", raw);
  return "unknown";
}

export function isProgressStage(
  stage: CustomerOrderStage,
): stage is ProgressStage {
  return (PROGRESS_STAGES as readonly string[]).includes(stage);
}

/**
 * Progress steps for a fulfillment type. Pickup skips "delivering" because
 * kitchen can move ready → completed without a rider handoff.
 */
export function progressStagesFor(
  fulfillmentType: string | null | undefined,
): ProgressStage[] {
  if (fulfillmentType === "pickup") {
    return ["confirmed", "preparing", "ready", "completed"];
  }
  return [...PROGRESS_STAGES];
}
