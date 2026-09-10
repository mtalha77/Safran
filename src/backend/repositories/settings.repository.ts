import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { OpeningHoursInput, RestaurantSettingsInput } from "@/backend/types";
import type { Database, Json } from "@/types/database";

type Db = SupabaseClient<Database>;

export const PUBLIC_SETTING_KEYS = [
  "restaurant_name",
  "contact_email",
  "contact_phone",
  "address",
  "delivery_minimum",
  "pickup_minimum",
  "delivery_fee",
] as const;

/** Flattened checkout rules, exposed by the `store_settings` view. */
export function findStoreSettings(db: Db) {
  return db
    .from("store_settings")
    .select(
      "is_open, closed_message, pickup_enabled, delivery_enabled, minimum_order, pickup_minimum, delivery_fee",
    )
    .eq("id", "default")
    .maybeSingle();
}

export function findSiteSettings(db: Db) {
  return db
    .from("site_settings")
    .select("key, value")
    .in("key", [...PUBLIC_SETTING_KEYS]);
}

export function findAvailability(db: Db) {
  return db.from("store_availability").select("*").eq("id", true).maybeSingle();
}

export function findAcceptsOrders(db: Db) {
  return db
    .from("store_availability")
    .select("accepts_orders")
    .eq("id", true)
    .maybeSingle();
}

export function findOpeningHours(db: Db) {
  return db.from("opening_hours").select("*").order("weekday");
}

export function findOpeningHoursForWeekday(db: Db, weekday: number) {
  return db
    .from("opening_hours")
    .select("is_closed, lunch_opens, lunch_closes, dinner_opens, dinner_closes")
    .eq("weekday", weekday)
    .maybeSingle();
}

export function setAcceptsOrders(
  db: Db,
  acceptsOrders: boolean,
  pausedReason: string | null,
) {
  return db.from("store_availability").upsert({
    id: true,
    accepts_orders: acceptsOrders,
    paused_reason: pausedReason,
    updated_at: new Date().toISOString(),
  });
}

export function upsertSiteSettings(db: Db, input: RestaurantSettingsInput) {
  const rows: Array<{ key: string; value: Json; is_public: boolean }> = [
    { key: "restaurant_name", value: input.restaurantName, is_public: true },
    { key: "contact_email", value: input.email, is_public: true },
    { key: "contact_phone", value: input.phone, is_public: true },
    { key: "address", value: input.address, is_public: true },
    { key: "delivery_minimum", value: input.deliveryMinimum, is_public: true },
    { key: "pickup_minimum", value: input.pickupMinimum, is_public: true },
    { key: "delivery_fee", value: input.deliveryFee, is_public: true },
  ];

  return db.from("site_settings").upsert(rows, { onConflict: "key" });
}

export function upsertFulfillmentOptions(db: Db, input: RestaurantSettingsInput) {
  return db.from("store_availability").upsert({
    id: true,
    pickup_enabled: input.pickupEnabled,
    delivery_enabled: input.deliveryEnabled,
    minimum_notice_minutes: input.minimumNoticeMinutes,
    updated_at: new Date().toISOString(),
  });
}

export function upsertOpeningHours(db: Db, input: OpeningHoursInput) {
  return db.from("opening_hours").upsert(
    input.map((day) => ({
      weekday: day.weekday,
      is_closed: day.isClosed,
      lunch_opens: day.lunchOpens,
      lunch_closes: day.lunchCloses,
      dinner_opens: day.dinnerOpens,
      dinner_closes: day.dinnerCloses,
    })),
    { onConflict: "weekday" },
  );
}
