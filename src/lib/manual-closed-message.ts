/** Values stored in `store_availability.paused_reason` for a manual close. */
const MANUAL_CLOSED_REASONS = new Set([
  "manual_closed",
  // Legacy German copy written before the reason became a stable key.
  "Online-Bestellungen sind derzeit geschlossen.",
]);

/** True when the UI should show the localized “closed” string instead of raw DB text. */
export function isManualClosedMessage(message?: string | null): boolean {
  if (!message) return true;
  return MANUAL_CLOSED_REASONS.has(message);
}
