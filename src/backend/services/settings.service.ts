import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { requireCapability } from "@/backend/auth/authorize";
import { UnavailableError } from "@/backend/errors";
import * as settingsRepository from "@/backend/repositories/settings.repository";
import { parseOpeningHours, parseRestaurantSettings } from "@/backend/validation/settings";
import type { Database } from "@/types/database";

type Db = SupabaseClient<Database>;

const CLOSED_REASON = "Online-Bestellungen sind derzeit geschlossen.";

async function settingsContext() {
  const { supabase } = await requireCapability("settings:manage");
  return supabase as unknown as Db;
}

/**
 * Manual open/close switch. Closing sets `accepts_orders = false`, which the
 * storefront banner, the checkout page and `createCashOrder` all read, so the
 * shop closes everywhere at once. Opening returns the shop to its regular
 * opening hours rather than forcing it open.
 */
export async function setStoreOpen(isOpen: boolean): Promise<void> {
  const db = await settingsContext();
  const { error } = await settingsRepository.setAcceptsOrders(
    db,
    isOpen,
    isOpen ? null : CLOSED_REASON,
  );
  if (error) throw new UnavailableError("store_toggle_failed", error.message);
}

export async function getStoreOpen(): Promise<boolean> {
  const { supabase } = await requireCapability("orders:read");
  const { data } = await settingsRepository.findAcceptsOrders(
    supabase as unknown as Db,
  );
  return data?.accepts_orders ?? true;
}

export async function getRestaurantSettings() {
  const { supabase } = await requireCapability("settings:manage");
  const db = supabase as unknown as Db;

  const [settings, availability, hours] = await Promise.all([
    settingsRepository.findSiteSettings(db),
    settingsRepository.findAvailability(db),
    settingsRepository.findOpeningHours(db),
  ]);

  return {
    settings: Object.fromEntries(
      (settings.data ?? []).map((row) => [row.key, row.value]),
    ),
    availability: availability.data ?? null,
    hours: hours.data ?? [],
    error:
      settings.error?.message ??
      availability.error?.message ??
      hours.error?.message ??
      null,
  };
}

export async function updateRestaurantSettings(input: Record<string, unknown>) {
  const db = await settingsContext();
  const parsed = parseRestaurantSettings(input);

  const [settings, availability] = await Promise.all([
    settingsRepository.upsertSiteSettings(db, parsed),
    settingsRepository.upsertFulfillmentOptions(db, parsed),
  ]);

  const error = settings.error ?? availability.error;
  if (error) throw new UnavailableError("settings_save_failed", error.message);
}

export async function updateOpeningHours(
  input: ReadonlyArray<Record<string, unknown>>,
) {
  const db = await settingsContext();
  const { error } = await settingsRepository.upsertOpeningHours(
    db,
    parseOpeningHours(input),
  );
  if (error) throw new UnavailableError("hours_save_failed", error.message);
}
