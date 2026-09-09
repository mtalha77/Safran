"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Json, OrderStatus } from "@/types/database";

const LOGIN_PATH = "/admin/login";
const MENU_PATH = "/admin/menu";
const SETTINGS_PATH = "/admin/settings";
const MENU_BUCKET = "menu-images";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || null;
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function destination(path: string, kind: "message" | "error", value: string): never {
  const params = new URLSearchParams({ [kind]: value });
  redirect(`${path}?${params}`);
}

async function adminClient(returnTo: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(`${LOGIN_PATH}?next=${encodeURIComponent(returnTo)}`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    await supabase.auth.signOut();
    destination(LOGIN_PATH, "error", "Für dieses Konto fehlt die Admin-Berechtigung.");
  }

  return supabase;
}

async function uploadMenuImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  itemId: string | number,
) {
  if (!file.size) return null;
  if (!file.type.startsWith("image/")) throw new Error("Bitte eine Bilddatei auswählen.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Das Bild darf höchstens 5 MB gross sein.");

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "webp";
  const path = `items/${itemId}-${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from(MENU_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  return path;
}

export async function loginAction(formData: FormData) {
  const email = text(formData, "email");
  const password = text(formData, "password");
  const next = text(formData, "next");
  const safeNext = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

  if (!email || !password) destination(LOGIN_PATH, "error", "E-Mail und Passwort sind erforderlich.");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) destination(LOGIN_PATH, "error", "Anmeldung fehlgeschlagen. Zugangsdaten prüfen.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    destination(LOGIN_PATH, "error", "Für dieses Konto fehlt die Admin-Berechtigung.");
  }

  redirect(safeNext);
}

export async function logoutAction() {
  const supabase = await adminClient("/admin");
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}

export async function setStoreOpenAction(formData: FormData) {
  const supabase = await adminClient("/admin");
  const isOpen = checked(formData, "is_open");
  const { error } = await supabase
    .from("store_availability")
    .upsert({ id: true, accepts_orders: isOpen, paused_reason: isOpen ? null : "Vorübergehend pausiert", updated_at: new Date().toISOString() });
  if (error) destination("/admin", "error", error.message);
  revalidatePath("/", "layout");
  destination("/admin", "message", isOpen ? "Bestellungen wurden geöffnet." : "Bestellungen wurden pausiert.");
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["out_for_delivery", "completed"],
  out_for_delivery: ["completed"],
  completed: [],
  cancelled: [],
};

export async function updateOrderStatusAction(formData: FormData) {
  const id = text(formData, "id");
  const nextStatus = text(formData, "status");
  const returnTo = `/admin/orders/${encodeURIComponent(id)}`;
  const supabase = await adminClient(returnTo);
  const { data: order, error: readError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (readError || !order) destination(returnTo, "error", "Bestellung wurde nicht gefunden.");
  if (!STATUS_TRANSITIONS[order.status]?.includes(nextStatus)) {
    destination(returnTo, "error", `Übergang von ${order.status} zu ${nextStatus} ist nicht erlaubt.`);
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: nextStatus as OrderStatus, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", order.status);
  if (error) destination(returnTo, "error", error.message);
  await supabase.from("order_status_events").insert({
    order_id: id,
    from_status: order.status,
    to_status: nextStatus as OrderStatus,
    changed_by: (await supabase.auth.getUser()).data.user?.id ?? null,
  });
  revalidatePath("/admin/orders");
  destination(returnTo, "message", "Bestellstatus wurde aktualisiert.");
}

export async function createCategoryAction(formData: FormData) {
  const supabase = await adminClient(MENU_PATH);
  const name = text(formData, "name");
  if (!name) destination(MENU_PATH, "error", "Der Kategoriename ist erforderlich.");
  const { error } = await supabase.from("menu_categories").insert({
    id: text(formData, "id") || name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    title: name,
    subtitle: optionalText(formData, "description"),
    sort_order: numberValue(formData, "sort_order"),
    is_active: checked(formData, "is_active"),
  });
  if (error) destination(MENU_PATH, "error", error.message);
  revalidatePath("/admin/menu");
  destination(MENU_PATH, "message", "Kategorie wurde erstellt.");
}

export async function updateCategoryAction(formData: FormData) {
  const supabase = await adminClient(MENU_PATH);
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!id || !name) destination(MENU_PATH, "error", "Kategorie und Name sind erforderlich.");
  const { error } = await supabase.from("menu_categories").update({
    title: name,
    subtitle: optionalText(formData, "description"),
    sort_order: numberValue(formData, "sort_order"),
    is_active: checked(formData, "is_active"),
  }).eq("id", id);
  if (error) destination(MENU_PATH, "error", error.message);
  revalidatePath("/admin/menu");
  destination(MENU_PATH, "message", "Kategorie wurde gespeichert.");
}

export async function deleteCategoryAction(formData: FormData) {
  const supabase = await adminClient(MENU_PATH);
  const id = text(formData, "id");
  const { count } = await supabase
    .from("menu_items")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);
  if (count) destination(MENU_PATH, "error", "Kategorie enthält noch Gerichte und kann nicht gelöscht werden.");
  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  if (error) destination(MENU_PATH, "error", error.message);
  revalidatePath("/admin/menu");
  destination(MENU_PATH, "message", "Kategorie wurde gelöscht.");
}

export async function sortCategoriesAction(formData: FormData) {
  const supabase = await adminClient(MENU_PATH);
  const ids = text(formData, "ordered_ids").split(",").map((id) => id.trim()).filter(Boolean);
  const results = await Promise.all(
    ids.map((id, index) => supabase.from("menu_categories").update({ sort_order: index }).eq("id", id)),
  );
  const error = results.find((result) => result.error)?.error;
  if (error) destination(MENU_PATH, "error", error.message);
  revalidatePath("/admin/menu");
  destination(MENU_PATH, "message", "Kategorien wurden sortiert.");
}

export async function createMenuItemAction(formData: FormData) {
  const supabase = await adminClient(MENU_PATH);
  const name = text(formData, "name");
  const categoryId = text(formData, "category_id");
  if (!name || !categoryId) destination(MENU_PATH, "error", "Name und Kategorie sind erforderlich.");

  const { data: item, error } = await supabase.from("menu_items").insert({
    category_id: categoryId,
    item_number: numberValue(formData, "number"),
    name,
    description_de: optionalText(formData, "description_de"),
    description_en: optionalText(formData, "description_en"),
    price: numberValue(formData, "price"),
    sort_order: numberValue(formData, "sort_order"),
    is_active: checked(formData, "is_available"),
  }).select("id").single();
  if (error || !item) destination(MENU_PATH, "error", error?.message ?? "Gericht konnte nicht erstellt werden.");

  const image = formData.get("image");
  if (image instanceof File && image.size) {
    try {
      const imageUrl = await uploadMenuImage(supabase, image, item.id);
      await supabase.from("menu_items").update({ image_path: imageUrl }).eq("id", item.id);
    } catch (uploadError) {
      await supabase.from("menu_items").delete().eq("id", item.id);
      destination(MENU_PATH, "error", uploadError instanceof Error ? uploadError.message : "Bild-Upload fehlgeschlagen.");
    }
  }
  revalidatePath("/admin/menu");
  destination(MENU_PATH, "message", "Gericht wurde erstellt.");
}

export async function updateMenuItemAction(formData: FormData) {
  const supabase = await adminClient(MENU_PATH);
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!id || !name) destination(MENU_PATH, "error", "Gericht und Name sind erforderlich.");
  const { error } = await supabase.from("menu_items").update({
    category_id: text(formData, "category_id"),
    item_number: numberValue(formData, "number"),
    name,
    description_de: optionalText(formData, "description_de"),
    description_en: optionalText(formData, "description_en"),
    price: numberValue(formData, "price"),
    sort_order: numberValue(formData, "sort_order"),
    is_active: checked(formData, "is_available"),
  }).eq("id", numberValue(formData, "id"));
  if (error) destination(MENU_PATH, "error", error.message);
  revalidatePath("/admin/menu");
  destination(MENU_PATH, "message", "Gericht wurde gespeichert.");
}

export async function setMenuItemAvailabilityAction(formData: FormData) {
  const supabase = await adminClient(MENU_PATH);
  const { error } = await supabase
    .from("menu_items")
    .update({ is_active: checked(formData, "is_available") })
    .eq("id", numberValue(formData, "id"));
  if (error) destination(MENU_PATH, "error", error.message);
  revalidatePath("/admin/menu");
  destination(MENU_PATH, "message", "Verfügbarkeit wurde aktualisiert.");
}

export async function sortMenuItemsAction(formData: FormData) {
  const supabase = await adminClient(MENU_PATH);
  const ids = text(formData, "ordered_ids").split(",").map((id) => id.trim()).filter(Boolean);
  const results = await Promise.all(
    ids.map((id, index) => supabase.from("menu_items").update({ sort_order: index }).eq("id", Number(id))),
  );
  const error = results.find((result) => result.error)?.error;
  if (error) destination(MENU_PATH, "error", error.message);
  revalidatePath("/admin/menu");
  destination(MENU_PATH, "message", "Gerichte wurden sortiert.");
}

export async function replaceMenuItemImageAction(formData: FormData) {
  const supabase = await adminClient(MENU_PATH);
  const id = numberValue(formData, "id");
  const file = formData.get("image");
  if (!(file instanceof File) || !file.size) destination(MENU_PATH, "error", "Bitte ein Bild auswählen.");

  const { data: current } = await supabase.from("menu_items").select("image_path").eq("id", id).maybeSingle();
  try {
    const imageUrl = await uploadMenuImage(supabase, file, id);
    const { error } = await supabase.from("menu_items").update({ image_path: imageUrl }).eq("id", id);
    if (error) throw error;
    if (current?.image_path) await supabase.storage.from(MENU_BUCKET).remove([current.image_path]);
  } catch (uploadError) {
    destination(MENU_PATH, "error", uploadError instanceof Error ? uploadError.message : "Bild-Upload fehlgeschlagen.");
  }
  revalidatePath("/admin/menu");
  destination(MENU_PATH, "message", "Gerichtbild wurde ersetzt.");
}

export async function deleteMenuItemAction(formData: FormData) {
  const supabase = await adminClient(MENU_PATH);
  const id = numberValue(formData, "id");
  const { data: item } = await supabase.from("menu_items").select("image_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) destination(MENU_PATH, "error", error.message);
  if (item?.image_path) await supabase.storage.from(MENU_BUCKET).remove([item.image_path]);
  revalidatePath("/admin/menu");
  destination(MENU_PATH, "message", "Gericht wurde gelöscht.");
}

export async function updateSettingsAction(formData: FormData) {
  const supabase = await adminClient(SETTINGS_PATH);
  const settings = [
    ["restaurant_name", text(formData, "restaurant_name")],
    ["contact_email", optionalText(formData, "email")],
    ["contact_phone", optionalText(formData, "phone")],
    ["address", optionalText(formData, "address")],
    ["delivery_minimum", numberValue(formData, "minimum_order")],
    ["pickup_minimum", numberValue(formData, "pickup_minimum")],
    ["delivery_fee", numberValue(formData, "delivery_fee")],
  ].map(([key, value]) => ({ key: String(key), value: value as Json, is_public: true }));
  const { error } = await supabase.from("site_settings").upsert(settings, { onConflict: "key" });
  const { error: availabilityError } = await supabase.from("store_availability").upsert({
    id: true,
    pickup_enabled: checked(formData, "pickup_enabled"),
    delivery_enabled: checked(formData, "delivery_enabled"),
    minimum_notice_minutes: numberValue(formData, "minimum_notice_minutes", 30),
    updated_at: new Date().toISOString(),
  });
  if (error || availabilityError) destination(SETTINGS_PATH, "error", error?.message ?? availabilityError?.message ?? "Speichern fehlgeschlagen.");
  revalidatePath("/", "layout");
  destination(SETTINGS_PATH, "message", "Restaurant-Einstellungen wurden gespeichert.");
}

export async function updateOpeningHoursAction(formData: FormData) {
  const supabase = await adminClient(SETTINGS_PATH);
  const rows = Array.from({ length: 7 }, (_, day) => ({
    weekday: day,
    is_closed: checked(formData, `day_${day}_closed`),
    lunch_opens: optionalText(formData, `day_${day}_open`),
    lunch_closes: optionalText(formData, `day_${day}_close`),
    dinner_opens: optionalText(formData, `day_${day}_second_open`),
    dinner_closes: optionalText(formData, `day_${day}_second_close`),
  }));
  const { error } = await supabase.from("opening_hours").upsert(rows, { onConflict: "weekday" });
  if (error) destination(SETTINGS_PATH, "error", error.message);
  revalidatePath("/", "layout");
  destination(SETTINGS_PATH, "message", "Öffnungszeiten wurden gespeichert.");
}
