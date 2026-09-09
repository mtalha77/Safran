import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { menuCategories } from "../src/data/menu";
import type { Database, Json } from "../src/types/database";

loadEnv({ path: [".env.local", ".env"], quiet: true });

const projectRoot = path.resolve(import.meta.dirname, "..");
const imageRoot = path.join(projectRoot, "public", "images", "menu");
const skipStorage = process.argv.includes("--skip-storage");

const url =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SECRET_KEY ??
  "";

if (!url || !serviceRoleKey) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY before seeding.",
  );
}

const supabase = createClient<Database>(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function categoryImagePath(categoryId: string): string | null {
  const fileName = `${categoryId}.webp`;
  return existsSync(path.join(imageRoot, fileName)) ? fileName : null;
}

async function upsertContent() {
  const categories = menuCategories.map((category, categoryIndex) => ({
    id: category.id,
    title: category.title,
    subtitle: category.subtitle ?? null,
    note_de: category.noteDe ?? null,
    note_en: category.noteEn ?? null,
    image_path: categoryImagePath(category.id),
    sort_order: categoryIndex,
    is_active: true,
  }));

  const items = menuCategories.flatMap((category) =>
    category.items.map((item, itemIndex) => ({
      category_id: category.id,
      item_number: item.number,
      name: item.name,
      description_de: item.descriptionDe ?? null,
      description_en: item.descriptionEn ?? null,
      price: item.price,
      image_path: `items/${String(item.number).padStart(3, "0")}.webp`,
      sort_order: itemIndex,
      is_active: true,
    })),
  );

  if (categories.length !== 16 || items.length !== 119) {
    throw new Error(
      `Expected 16 categories and 119 items, found ${categories.length} and ${items.length}.`,
    );
  }

  const { error: categoryError } = await supabase
    .from("menu_categories")
    .upsert(categories, { onConflict: "id" });
  if (categoryError) throw categoryError;

  const { error: itemError } = await supabase
    .from("menu_items")
    .upsert(items, { onConflict: "item_number" });
  if (itemError) throw itemError;

  const settings: Database["public"]["Tables"]["site_settings"]["Insert"][] = [
    {
      key: "restaurant",
      value: {
        name: "Caffé Restaurant Safran",
        phone: "+41326235959",
        email: "info@safran-solothurn.ch",
        address: {
          street: "Hafenstrasse 31",
          postalCode: "8590",
          city: "Romanshorn",
          country: "CH",
        },
      },
      description: "Public restaurant identity and contact details.",
      is_public: true,
    },
    {
      key: "ordering",
      value: {
        currency: "CHF",
        fulfillmentTypes: ["pickup", "delivery"],
        minimumNoticeMinutes: 30,
      },
      description: "Public checkout defaults.",
      is_public: true,
    },
    { key: "restaurant_name", value: "Caffé Restaurant Safran", is_public: true },
    { key: "contact_email", value: "info@safran-solothurn.ch", is_public: true },
    { key: "contact_phone", value: "+41326235959", is_public: true },
    {
      key: "address",
      value: "Hafenstrasse 31, 8590 Romanshorn, Schweiz",
      is_public: true,
    },
    { key: "delivery_minimum", value: 0, is_public: true },
    { key: "pickup_minimum", value: 0, is_public: true },
    { key: "delivery_fee", value: 0, is_public: true },
  ];

  const contentBlocks: Database["public"]["Tables"]["content_blocks"]["Insert"][] =
    [
      {
        key: "home.hero",
        title: "Indische Küche in Romanshorn",
        body: "Authentische indische Küche am Romanshorner Hafen – frisch zubereitet, herzlich serviert und bequem nach Hause bestellt.",
        data: {} satisfies Json,
        is_published: true,
      },
      {
        key: "home.about",
        title: "Unsere Geschichte",
        body: "Traditionelle indische Küche, Gastfreundschaft und frische Zutaten direkt am Romanshorner Hafen.",
        data: {} satisfies Json,
        is_published: true,
      },
    ];

  const openingHours =
    [0, 1, 2, 3, 4, 5, 6].map<
      Database["public"]["Tables"]["opening_hours"]["Insert"]
    >((weekday) =>
      weekday === 0
        ? {
            weekday,
            is_closed: true,
            lunch_opens: null,
            lunch_closes: null,
            dinner_opens: null,
            dinner_closes: null,
            note: "Geschlossen",
          }
        : {
            weekday,
            is_closed: false,
            lunch_opens: "11:00",
            lunch_closes: "14:00",
            dinner_opens: "17:00",
            dinner_closes: "22:30",
            note: null,
          },
    );

  const { error: settingsError } = await supabase
    .from("site_settings")
    .upsert(settings, { onConflict: "key" });
  if (settingsError) throw settingsError;

  const { error: contentError } = await supabase
    .from("content_blocks")
    .upsert(contentBlocks, { onConflict: "key" });
  if (contentError) throw contentError;

  const { error: hoursError } = await supabase
    .from("opening_hours")
    .upsert(openingHours, { onConflict: "weekday" });
  if (hoursError) throw hoursError;

  const { error: availabilityError } = await supabase
    .from("store_availability")
    .upsert(
      {
        id: true,
        accepts_orders: true,
        pickup_enabled: true,
        delivery_enabled: true,
        minimum_notice_minutes: 30,
        paused_reason: null,
      },
      { onConflict: "id" },
    );
  if (availabilityError) throw availabilityError;

  console.log(`Upserted ${categories.length} categories and ${items.length} items.`);
}

async function uploadMenuImages() {
  if (skipStorage) {
    console.log("Skipped Storage upload (--skip-storage).");
    return;
  }

  const itemsDirectory = path.join(imageRoot, "items");
  const entries = await readdir(itemsDirectory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(?:avif|jpe?g|png|webp)$/i.test(name))
    .sort();

  const contentTypes: Record<string, string> = {
    ".avif": "image/avif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };

  for (let index = 0; index < files.length; index += 8) {
    const batch = files.slice(index, index + 8);
    await Promise.all(
      batch.map(async (fileName) => {
        const body = await readFile(path.join(itemsDirectory, fileName));
        const extension = path.extname(fileName).toLowerCase();
        const { error } = await supabase.storage
          .from("menu-images")
          .upload(`items/${fileName}`, body, {
            contentType: contentTypes[extension],
            cacheControl: "31536000",
            upsert: true,
          });

        if (error) {
          throw new Error(`Could not upload ${fileName}: ${error.message}`);
        }
      }),
    );
  }

  console.log(`Uploaded ${files.length} menu item images.`);
}

async function promoteConfiguredAdmin() {
  const email = process.env.SUPABASE_ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) return;

  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) throw error;

  const user = data.users.find(
    (candidate) => candidate.email?.toLowerCase() === email,
  );
  if (!user) {
    throw new Error(
      `SUPABASE_ADMIN_EMAIL is set to ${email}, but that Auth user does not exist.`,
    );
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: user.id, role: "admin" }, { onConflict: "id" });
  if (profileError) throw profileError;

  console.log(`Promoted ${email} to admin.`);
}

async function main() {
  await upsertContent();
  await uploadMenuImages();
  await promoteConfiguredAdmin();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
