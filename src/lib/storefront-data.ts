import "server-only";

import { cache } from "react";
import { menuCategories as fallbackMenuCategories, type MenuCategory } from "@/data/menu";
import type { OpeningDay, StoreStatusConfig } from "@/lib/store-status";

type Row = Record<string, unknown>;

export type StorefrontSettings = {
  restaurantName: string;
  description: string;
  addressLines: string[];
  phone: string;
  phoneDisplay: string;
  email: string;
  timezone: string;
};

export type HomepageCategory = {
  name: string;
  subtitle: string;
  href: string;
  image: string;
};

export type StorefrontChrome = {
  settings: StorefrontSettings;
  hours: OpeningDay[];
  statusConfig: StoreStatusConfig;
};

export type StorefrontData = StorefrontChrome & {
  menuCategories: MenuCategory[];
  homepageCategories: HomepageCategory[];
};

const fallbackSettings: StorefrontSettings = {
  restaurantName: "Safran",
  description:
    "Authentische indische Küche am Romanshorner Hafen – frisch zubereitet, herzlich serviert und bequem nach Hause bestellt.",
  addressLines: ["Hafenstrasse 31", "8590 Romanshorn, Schweiz"],
  phone: "+41326235959",
  phoneDisplay: "032 623 59 59",
  email: "info@safran-solothurn.ch",
  timezone: "Europe/Zurich",
};

const fallbackHours: OpeningDay[] = [
  { day: 1, label: "Montag", ranges: [["11:00", "14:00"], ["17:00", "22:30"]] },
  { day: 2, label: "Dienstag", ranges: [["11:00", "14:00"], ["17:00", "22:30"]] },
  { day: 3, label: "Mittwoch", ranges: [["11:00", "14:00"], ["17:00", "22:30"]] },
  { day: 4, label: "Donnerstag", ranges: [["11:00", "14:00"], ["17:00", "22:30"]] },
  { day: 5, label: "Freitag", ranges: [["11:00", "14:00"], ["17:00", "22:30"]] },
  { day: 6, label: "Samstag", ranges: [["11:00", "14:00"], ["17:00", "22:30"]] },
  { day: 0, label: "Sonntag", ranges: [] },
];

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function number(value: unknown): number | undefined {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function boolean(value: unknown, fallback = true): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (["false", "0", "no", "off"].includes(value.toLowerCase())) return false;
    if (["true", "1", "yes", "on"].includes(value.toLowerCase())) return true;
  }
  return fallback;
}

const readTable = cache(async (table: string): Promise<Row[] | null> => {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!baseUrl || !key) return null;

  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/${encodeURIComponent(table)}?select=*`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        next: { revalidate: 300 },
      },
    );
    if (!response.ok) return null;
    const rows: unknown = await response.json();
    return Array.isArray(rows) ? (rows as Row[]) : null;
  } catch {
    return null;
  }
});

async function readFirstTable(names: string[]): Promise<Row[] | null> {
  for (const name of names) {
    const rows = await readTable(name);
    if (rows !== null) return rows;
  }
  return null;
}

function keyValueMap(rows: Row[] | null): Row {
  if (!rows?.length) return {};
  if (rows.length === 1 && !text(rows[0].key) && !text(rows[0].name)) {
    return rows[0];
  }

  return Object.fromEntries(
    rows.flatMap((row) => {
      const key = text(row.key) ?? text(row.name) ?? text(row.slug);
      return key ? [[key, row.value ?? row.content ?? row.body ?? row.text]] : [];
    }),
  );
}

function normalizeSettings(settingsRows: Row[] | null, contentRows: Row[] | null) {
  const values = { ...keyValueMap(settingsRows), ...keyValueMap(contentRows) };
  const address =
    text(values.address) ?? text(values.restaurant_address) ?? fallbackSettings.addressLines.join("\n");

  return {
    restaurantName:
      text(values.restaurant_name) ?? text(values.site_name) ?? fallbackSettings.restaurantName,
    description:
      text(values.footer_description) ??
      text(values["footer.description"]) ??
      text(values.description) ??
      text(values["home.hero"]) ??
      fallbackSettings.description,
    addressLines: address.split(/\r?\n|,\s*(?=\d{4}\s)/).filter(Boolean),
    phone:
      text(values.contact_phone) ??
      text(values.phone) ??
      process.env.NEXT_PUBLIC_RESTAURANT_PHONE ??
      fallbackSettings.phone,
    phoneDisplay:
      text(values.phone_display) ??
      text(values.contact_phone) ??
      text(values.phone) ??
      fallbackSettings.phoneDisplay,
    email:
      text(values.contact_email) ??
      text(values.email) ??
      process.env.NEXT_PUBLIC_RESTAURANT_EMAIL ??
      fallbackSettings.email,
    timezone: text(values.timezone) ?? fallbackSettings.timezone,
  } satisfies StorefrontSettings;
}

function normalizeHours(rows: Row[] | null): OpeningDay[] {
  if (!rows?.length) return fallbackHours;
  const labels = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const days = new Map<number, OpeningDay>();

  for (const row of rows) {
    const rawDay = number(row.day_of_week ?? row.weekday ?? row.day);
    if (rawDay === undefined) continue;
    const day = rawDay === 7 ? 0 : rawDay;
    if (day < 0 || day > 6) continue;
    const current = days.get(day) ?? {
      day,
      label: text(row.label) ?? labels[day],
      ranges: [],
    };
    const closed = boolean(row.is_closed ?? row.closed, false);
    const start = text(row.open_time ?? row.opens_at ?? row.start_time ?? row.open);
    const end = text(row.close_time ?? row.closes_at ?? row.end_time ?? row.close);
    if (!closed && start && end) current.ranges.push([start.slice(0, 5), end.slice(0, 5)]);
    const secondStart = text(row.second_open_time ?? row.dinner_opens);
    const secondEnd = text(row.second_close_time ?? row.dinner_closes);
    if (!closed && secondStart && secondEnd) {
      current.ranges.push([secondStart.slice(0, 5), secondEnd.slice(0, 5)]);
    }
    days.set(day, current);
  }

  return days.size
    ? fallbackHours.map((fallback) => days.get(fallback.day) ?? fallback)
    : fallbackHours;
}

function normalizeMenu(
  categoryRows: Row[] | null,
  itemRows: Row[] | null,
  availabilityRows: Row[] | null,
): MenuCategory[] {
  if (!categoryRows?.length || !itemRows?.length) return fallbackMenuCategories;

  const availability = new Map<string, boolean>();
  for (const row of availabilityRows ?? []) {
    const id = text(row.menu_item_id ?? row.item_id ?? row.id);
    if (id) availability.set(id, boolean(row.is_available ?? row.available ?? row.enabled));
  }

  const categories = categoryRows
    .filter((row) => boolean(row.is_active ?? row.active ?? row.enabled))
    .sort(
      (a, b) =>
        (number(a.sort_order ?? a.position) ?? 0) -
        (number(b.sort_order ?? b.position) ?? 0),
    )
    .map((row) => {
      const databaseId = String(row.id ?? row.slug ?? "");
      const id = text(row.slug) ?? text(row.id) ?? "";
      const items = itemRows
        .filter((item) => String(item.category_id ?? item.category ?? "") === databaseId)
        .filter((item) => {
          const itemId = String(item.id ?? "");
          return (
            boolean(item.is_active ?? item.active ?? item.enabled) &&
            (availability.get(itemId) ?? boolean(item.is_available ?? item.available))
          );
        })
        .sort(
          (a, b) =>
            (number(a.sort_order ?? a.position ?? a.number) ?? 0) -
            (number(b.sort_order ?? b.position ?? b.number) ?? 0),
        )
        .flatMap((item) => {
          const itemNumber = number(
            item.item_number ?? item.number ?? item.menu_number ?? item.sort_order,
          );
          const name = text(item.name ?? item.title);
          const price = number(item.price ?? item.price_chf);
          if (itemNumber === undefined || !name || price === undefined) return [];
          return [{
            number: itemNumber,
            name,
            descriptionDe: text(item.description_de ?? item.description),
            descriptionEn: text(item.description_en),
            price,
          }];
        });

      return {
        id,
        title: text(row.title_de ?? row.title ?? row.name) ?? id,
        subtitle: text(row.title_en ?? row.subtitle),
        noteDe: text(row.note_de ?? row.note),
        noteEn: text(row.note_en),
        items,
      };
    })
    .filter((category) => category.id && category.items.length);

  return categories.length ? categories : fallbackMenuCategories;
}

function categoryImage(row: Row | undefined, fallbackNumber: number) {
  const imagePath = text(row?.image_path ?? row?.image_url ?? row?.image);
  if (!imagePath) {
    return `/images/menu/items/${String(fallbackNumber).padStart(3, "0")}.webp`;
  }
  return imagePath.startsWith("/") || imagePath.startsWith("http")
    ? imagePath
    : `/images/menu/${imagePath}`;
}

function homepageCategoriesFromRows(rows: Row[]): HomepageCategory[] {
  return [...rows]
    .filter((row) => boolean(row.is_active ?? row.is_visible, true))
    .sort(
      (a, b) =>
        (number(a.sort_order ?? a.position) ?? 0) -
        (number(b.sort_order ?? b.position) ?? 0),
    )
    .flatMap((row) => {
      const id = text(row.slug) ?? text(row.id);
      if (!id) return [];
      return [
        {
          name: text(row.title_de ?? row.title ?? row.name) ?? id,
          subtitle: text(row.title_en ?? row.subtitle) ?? "",
          href: `/speisekarte#${id}`,
          image: categoryImage(row, number(row.sort_order) ?? 1),
        },
      ];
    });
}

function homepageCategories(
  menu: MenuCategory[],
  categoryRows: Row[] | null,
): HomepageCategory[] {
  return menu.map((category) => {
    const row = categoryRows?.find(
      (candidate) => String(candidate.slug ?? candidate.id) === category.id,
    );
    return {
      name: category.title,
      subtitle: category.subtitle ?? "",
      href: `/speisekarte#${category.id}`,
      image: categoryImage(row, category.items[0]?.number ?? 1),
    };
  });
}

function normalizeOverride(settingsRows: Row[] | null, availabilityRows: Row[] | null) {
  const values = keyValueMap(settingsRows);
  const availability = availabilityRows?.find(
    (row) =>
      text(row.scope ?? row.type) === "store" ||
      "manual_override" in row ||
      "store_status" in row,
  );
  const raw = text(
    availability?.manual_override ??
      availability?.store_status ??
      values.store_status_override ??
      values.manual_override,
  )?.toLowerCase();
  const manualOverride =
    raw === "open" || raw === "closed"
      ? raw
      : availability && !boolean(availability.accepts_orders)
        ? "closed"
        : "auto";
  return {
    manualOverride,
    manualMessage:
      text(availability?.message) ??
      text(availability?.paused_reason) ??
      text(values.store_status_message) ??
      text(values.manual_override_message),
  } satisfies Pick<StoreStatusConfig, "manualOverride" | "manualMessage">;
}

export const getStorefrontChrome = cache(async (): Promise<StorefrontChrome> => {
  const [settingsRows, contentRows, hourRows, availabilityRows] = await Promise.all([
    readFirstTable(["restaurant_settings", "site_settings", "settings"]),
    readFirstTable(["content_blocks", "site_content", "content"]),
    readFirstTable(["opening_hours", "business_hours"]),
    readFirstTable(["availability", "menu_availability", "store_availability"]),
  ]);

  const settings = normalizeSettings(settingsRows, contentRows);
  const hours = normalizeHours(hourRows);
  const override = normalizeOverride(settingsRows, availabilityRows);

  return {
    settings,
    hours,
    statusConfig: {
      timezone: settings.timezone,
      hours,
      ...override,
    },
  };
});

export const getHomepageCategories = cache(async (): Promise<HomepageCategory[]> => {
  const categoryRows = await readFirstTable(["menu_categories", "categories"]);
  const fromRows = categoryRows?.length
    ? homepageCategoriesFromRows(categoryRows)
    : [];
  return fromRows.length
    ? fromRows
    : homepageCategories(fallbackMenuCategories, null);
});

export const getMenuCategories = cache(async (): Promise<MenuCategory[]> => {
  const [categoryRows, itemRows, availabilityRows] = await Promise.all([
    readFirstTable(["menu_categories", "categories"]),
    readFirstTable(["menu_items", "products"]),
    readFirstTable(["availability", "menu_availability", "store_availability"]),
  ]);
  return normalizeMenu(categoryRows, itemRows, availabilityRows);
});

export const getStorefrontData = cache(async (): Promise<StorefrontData> => {
  const [chrome, menuCategories, categoryRows] = await Promise.all([
    getStorefrontChrome(),
    getMenuCategories(),
    readFirstTable(["menu_categories", "categories"]),
  ]);

  return {
    ...chrome,
    menuCategories,
    homepageCategories: homepageCategories(menuCategories, categoryRows),
  };
});
