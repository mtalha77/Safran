/**
 * Applies a price list to `menu_items`, keyed by the printed item number.
 * Only `price` is written — names, descriptions, discounts and images are left
 * exactly as they are.
 *
 * Dry run (prints the diff, writes nothing):
 *   npm run menu:prices
 * Apply:
 *   npm run menu:prices -- --apply
 */
import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";

import type { Database } from "../src/types/database";

loadEnv({ path: [".env.local", ".env"], quiet: true });

/** Item number -> price in CHF, from the owner's printed menu (Sept 2026). */
const PRICES: Record<number, number> = {
  1: 8.5,
  2: 7.9,
  3: 8.5,
  4: 8.9,
  5: 12.9,
  6: 12.9,
  7: 12.9,
  8: 15.9,
  9: 11.9,
  10: 6.9,
  11: 32.9,
  12: 33.9,
  13: 34.9,
  14: 33.9,
  15: 38.9,
  16: 8.9,
  17: 9.0,
  18: 16.9,
  19: 5.0,
  20: 5.9,
  21: 5.9,
  22: 6.9,
  23: 6.9,
  24: 6.5,
  25: 6.9,
  26: 7.9,
  27: 7.9,
  28: 23.9,
  29: 24.9,
  30: 24.9,
  31: 23.9,
  32: 24.9,
  33: 24.9,
  34: 25.9,
  35: 24.9,
  36: 25.9,
  37: 24.9,
  38: 24.9,
  39: 24.9,
  40: 24.9,
  41: 25.9,
  42: 28.9,
  43: 28.5,
  44: 28.9,
  45: 28.9,
  46: 28.9,
  47: 28.9,
  48: 28.9,
  49: 28.9,
  50: 28.9,
  51: 28.9,
  52: 28.9,
  53: 28.9,
  54: 28.9,
  55: 31.9,
  56: 31.9,
  57: 31.9,
  58: 31.9,
  59: 31.9,
  60: 31.9,
  61: 31.9,
  62: 31.5,
  63: 31.9,
  64: 31.9,
  65: 30.9,
  66: 30.9,
  67: 30.9,
  68: 30.9,
  69: 30.9,
  70: 30.9,
  71: 30.9,
  72: 30.9,
  73: 30.9,
  74: 31.9,
  75: 26.9,
  76: 29.9,
  77: 32.9,
  78: 33.9,
  79: 35.9,
  80: 89.5,
  81: 115.9,
  82: 148.9,
  83: 105.5,
  84: 138.9,
  85: 107.5,
  86: 149.9,
  87: 7.5,
  88: 15.9,
  89: 16.9,
  90: 17.9,
  91: 8.9,
  92: 8.9,
  93: 12.9,
  94: 6.0,
  95: 7.0,
  96: 2.5,
  97: 2.5,
  98: 2.5,
  99: 3.0,
  100: 4.5,
  101: 7.5,
  102: 7.0,
  103: 7.0,
  104: 7.9,
  105: 6.9,
  106: 7.0,
  107: 7.0,
  108: 7.0,
  109: 7.0,
  110: 3.5,
  111: 3.5,
  112: 4.5,
  113: 4.5,
  114: 4.5,
  115: 4.5,
  116: 4.5,
  117: 4.5,
  118: 4.5,
  119: 4.5,
};

const apply = process.argv.includes("--apply");

const url =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? "";

if (!url || !serviceRoleKey) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.",
  );
}

const supabase = createClient<Database>(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function chf(value: number) {
  return value.toFixed(2).padStart(7);
}

async function main() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, item_number, name, price, discount_percent")
    .order("item_number");

  if (error) throw new Error(`could not read menu_items: ${error.message}`);
  const rows = data ?? [];

  const changed: Array<{ number: number; name: string; from: number; to: number }> =
    [];
  const same: number[] = [];
  const missingInDb: number[] = [];
  const notInList: Array<{ number: number; name: string; price: number }> = [];

  const byNumber = new Map(rows.map((row) => [Number(row.item_number), row]));

  for (const [key, next] of Object.entries(PRICES)) {
    const number = Number(key);
    const row = byNumber.get(number);
    if (!row) {
      missingInDb.push(number);
      continue;
    }
    const current = Number(row.price);
    if (Math.abs(current - next) < 0.005) {
      same.push(number);
    } else {
      changed.push({ number, name: row.name, from: current, to: next });
    }
  }

  for (const row of rows) {
    if (!(Number(row.item_number) in PRICES)) {
      notInList.push({
        number: Number(row.item_number),
        name: row.name,
        price: Number(row.price),
      });
    }
  }

  console.log(
    `${rows.length} items in the database, ${Object.keys(PRICES).length} prices in the list\n`,
  );

  if (changed.length) {
    console.log(`Price changes (${changed.length}):`);
    for (const item of changed) {
      console.log(
        `  ${String(item.number).padStart(3)}. ${chf(item.from)} -> ${chf(item.to)}   ${item.name}`,
      );
    }
  } else {
    console.log("No price differences found.");
  }

  console.log(`\nUnchanged: ${same.length}`);
  if (missingInDb.length) {
    console.log(`Listed but not in the database: ${missingInDb.join(", ")}`);
  }
  if (notInList.length) {
    console.log(`In the database but not in the list:`);
    for (const item of notInList) {
      console.log(
        `  ${String(item.number).padStart(3)}. ${chf(item.price)}   ${item.name}`,
      );
    }
  }

  const discounted = rows.filter((row) => Number(row.discount_percent) > 0);
  if (discounted.length) {
    console.log(
      `\nNote: ${discounted.length} item(s) carry a discount, which stays on top of the new price:`,
    );
    for (const row of discounted) {
      console.log(
        `  ${String(row.item_number).padStart(3)}. -${Number(row.discount_percent)}%   ${row.name}`,
      );
    }
  }

  if (!apply) {
    console.log("\nDry run — nothing written. Re-run with --apply to save.");
    return;
  }
  if (!changed.length) return;

  console.log(`\nWriting ${changed.length} price(s) …`);
  const failures: string[] = [];
  for (const item of changed) {
    const result = await supabase
      .from("menu_items")
      .update({ price: item.to })
      .eq("item_number", item.number);
    if (result.error) {
      failures.push(`${item.number}: ${result.error.message}`);
    }
  }

  if (failures.length) {
    console.error(`Failed for ${failures.length} item(s):`);
    for (const failure of failures) console.error(`  ${failure}`);
    process.exit(1);
  }
  console.log(`Done — ${changed.length} price(s) updated.`);
}

void main();
