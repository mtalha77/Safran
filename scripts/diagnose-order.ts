/**
 * Diagnoses why placing an order fails: reports what the public key can read,
 * whether the store is open, and then attempts a real order against a running
 * server so the exact rejection is visible.
 *
 * Usage: npx tsx scripts/diagnose-order.ts [baseUrl]
 */
import { config as loadEnv } from "dotenv";

import { requireSupabasePublicEnv } from "../src/lib/supabase/env";

loadEnv({ path: [".env.local", ".env"], quiet: true });

const { url, key } = requireSupabasePublicEnv();
const base = process.argv[2] ?? "http://localhost:3000";
const rest = `${url.replace(/\/$/, "")}/rest/v1`;
const headers = { apikey: key, Authorization: `Bearer ${key}` };

async function read(path: string) {
  const response = await fetch(`${rest}/${path}`, { headers });
  const text = await response.text();
  return { status: response.status, text };
}

async function main() {
  console.log("=== what the browser/public key can read ===");
  for (const path of [
    "store_availability?select=accepts_orders,paused_reason&id=eq.true",
    "store_settings?select=*",
    "menu_categories?select=id&limit=1",
    "menu_items?select=item_number,name,price,is_active&limit=3",
    "opening_hours?select=weekday,is_closed,lunch_opens,lunch_closes,dinner_opens,dinner_closes&limit=3",
    "site_settings?select=key&limit=3",
  ]) {
    const { status, text } = await read(path);
    console.log(`${path.split("?")[0].padEnd(20)} ${status}  ${text.slice(0, 220)}`);
  }

  console.log("\n=== pick a real, active menu item ===");
  const { text: itemsText } = await read(
    "menu_items?select=item_number,name,price&is_active=eq.true&order=item_number&limit=1",
  );
  let itemNumber: number | null = null;
  try {
    const rows = JSON.parse(itemsText) as { item_number: number }[];
    itemNumber = rows[0]?.item_number ?? null;
  } catch {
    /* reported below */
  }
  console.log(`item_number chosen: ${itemNumber ?? "NONE FOUND"} (${itemsText.slice(0, 160)})`);
  if (itemNumber === null) {
    console.log("cannot attempt an order without an active menu item");
    return;
  }

  console.log("\n=== attempt a real order (pickup, cash) ===");
  const payload = {
    idempotencyKey: `diag-${Date.now()}-abcdefghijk`,
    fulfillment: "pickup",
    paymentMethod: "cash",
    acceptedNoCancellation: true,
    customer: {
      firstName: "Diagnose",
      lastName: "Test",
      email: "diagnose@example.com",
      phone: "0791234567",
    },
    items: [{ id: `menu-${itemNumber}`, quantity: 1 }],
  };

  const response = await fetch(`${base}/api/orders`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log(`POST ${base}/api/orders -> ${response.status}`);
  console.log((await response.text()).slice(0, 600));
}

void main();
