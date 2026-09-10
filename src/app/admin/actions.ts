"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  refreshMenu,
  refreshSettings,
  refreshStoreStatus,
} from "@/backend/cache/revalidate";
import { AuthorizationError, isAppError } from "@/backend/errors";
import { signInToBackOffice, signOut } from "@/backend/services/auth.service";
import * as menuService from "@/backend/services/menu.service";
import * as orderService from "@/backend/services/order.service";
import * as settingsService from "@/backend/services/settings.service";

/**
 * Server Actions are transport adapters only: read the form, call a service,
 * turn the result into a redirect. Business rules, validation and authorization
 * live in `src/backend`, so the customer and rider apps can reuse them.
 */

const LOGIN_PATH = "/admin/login";
const MENU_PATH = "/admin/menu";
const SETTINGS_PATH = "/admin/settings";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function file(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File && value.size ? value : null;
}

/** Only allows redirects back into the admin area. */
function safeAdminPath(value: string, fallback: string) {
  return value.startsWith("/admin") && !value.startsWith("//")
    ? value.split("?")[0]
    : fallback;
}

function destination(path: string, kind: "message" | "error", value: string): never {
  redirect(`${path}?${new URLSearchParams({ [kind]: value })}`);
}

/**
 * Runs a service call and converts its outcome into a redirect. An expired or
 * unprivileged session ends at the login screen; everything else surfaces the
 * service's own message.
 */
async function handle(
  returnTo: string,
  operation: () => Promise<void>,
  successMessage: string,
  invalidate?: () => void,
): Promise<never> {
  let failure: string | null = null;

  try {
    await operation();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      if (error.code === "unauthenticated") {
        redirect(`${LOGIN_PATH}?next=${encodeURIComponent(returnTo)}`);
      }
      await signOut();
      destination(LOGIN_PATH, "error", error.message);
    }
    failure = isAppError(error)
      ? error.message
      : "Die Aktion konnte nicht ausgeführt werden.";
  }

  if (failure) destination(returnTo, "error", failure);

  invalidate?.();
  destination(returnTo, "message", successMessage);
}

export async function loginAction(formData: FormData) {
  const safeNext = safeAdminPath(text(formData, "next"), "/admin");

  try {
    await signInToBackOffice({
      email: text(formData, "email"),
      password: text(formData, "password"),
    });
  } catch (error) {
    destination(
      LOGIN_PATH,
      "error",
      isAppError(error) ? error.message : "Anmeldung fehlgeschlagen.",
    );
  }

  redirect(safeNext);
}

export async function logoutAction() {
  await signOut();
  redirect(LOGIN_PATH);
}

export async function setStoreOpenAction(formData: FormData) {
  const isOpen = checked(formData, "is_open");
  const returnTo = safeAdminPath(text(formData, "next"), "/admin");

  await handle(
    returnTo,
    () => settingsService.setStoreOpen(isOpen),
    isOpen
      ? "Das Restaurant nimmt wieder Bestellungen an."
      : "Das Restaurant ist jetzt geschlossen.",
    refreshStoreStatus,
  );
}

export async function updateOrderStatusAction(formData: FormData) {
  const id = text(formData, "id");
  const returnTo = `/admin/orders/${encodeURIComponent(id)}`;

  await handle(
    returnTo,
    () =>
      orderService
        .updateOrderStatus({ orderId: id, nextStatus: text(formData, "status") })
        .then(() => undefined),
    "Bestellstatus wurde aktualisiert.",
    () => revalidatePath("/admin/orders"),
  );
}

export async function createCategoryAction(formData: FormData) {
  await handle(
    MENU_PATH,
    () =>
      menuService.createCategory({
        id: text(formData, "id"),
        name: text(formData, "name"),
        description: text(formData, "description"),
        sortOrder: numberValue(formData, "sort_order"),
        isActive: checked(formData, "is_active"),
      }),
    "Kategorie wurde erstellt.",
    refreshMenu,
  );
}

export async function updateCategoryAction(formData: FormData) {
  await handle(
    MENU_PATH,
    () =>
      menuService.updateCategory({
        id: text(formData, "id"),
        name: text(formData, "name"),
        description: text(formData, "description"),
        sortOrder: numberValue(formData, "sort_order"),
        isActive: checked(formData, "is_active"),
      }),
    "Kategorie wurde gespeichert.",
    refreshMenu,
  );
}

export async function deleteCategoryAction(formData: FormData) {
  await handle(
    MENU_PATH,
    () => menuService.deleteCategory({ id: text(formData, "id") }),
    "Kategorie wurde gelöscht.",
    refreshMenu,
  );
}

export async function sortCategoriesAction(formData: FormData) {
  await handle(
    MENU_PATH,
    () => menuService.sortCategories({ orderedIds: text(formData, "ordered_ids") }),
    "Kategorien wurden sortiert.",
    refreshMenu,
  );
}

function menuItemFields(formData: FormData) {
  return {
    categoryId: text(formData, "category_id"),
    itemNumber: numberValue(formData, "number"),
    name: text(formData, "name"),
    descriptionDe: text(formData, "description_de"),
    descriptionEn: text(formData, "description_en"),
    price: numberValue(formData, "price"),
    sortOrder: numberValue(formData, "sort_order"),
    isActive: checked(formData, "is_available"),
  };
}

export async function createMenuItemAction(formData: FormData) {
  await handle(
    MENU_PATH,
    () => menuService.createMenuItem(menuItemFields(formData), file(formData, "image")),
    "Gericht wurde erstellt.",
    refreshMenu,
  );
}

export async function updateMenuItemAction(formData: FormData) {
  await handle(
    MENU_PATH,
    () =>
      menuService.updateMenuItem({
        ...menuItemFields(formData),
        id: numberValue(formData, "id"),
      }),
    "Gericht wurde gespeichert.",
    refreshMenu,
  );
}

export async function setMenuItemAvailabilityAction(formData: FormData) {
  await handle(
    MENU_PATH,
    () =>
      menuService.setMenuItemAvailability({
        id: numberValue(formData, "id"),
        isAvailable: checked(formData, "is_available"),
      }),
    "Verfügbarkeit wurde aktualisiert.",
    refreshMenu,
  );
}

export async function sortMenuItemsAction(formData: FormData) {
  await handle(
    MENU_PATH,
    () => menuService.sortMenuItems({ orderedIds: text(formData, "ordered_ids") }),
    "Gerichte wurden sortiert.",
    refreshMenu,
  );
}

export async function replaceMenuItemImageAction(formData: FormData) {
  await handle(
    MENU_PATH,
    () =>
      menuService.replaceMenuItemImage(
        { id: numberValue(formData, "id") },
        file(formData, "image"),
      ),
    "Gerichtbild wurde ersetzt.",
    refreshMenu,
  );
}

export async function deleteMenuItemAction(formData: FormData) {
  await handle(
    MENU_PATH,
    () => menuService.deleteMenuItem({ id: numberValue(formData, "id") }),
    "Gericht wurde gelöscht.",
    refreshMenu,
  );
}

export async function updateSettingsAction(formData: FormData) {
  await handle(
    SETTINGS_PATH,
    () =>
      settingsService.updateRestaurantSettings({
        restaurantName: text(formData, "restaurant_name"),
        email: text(formData, "email"),
        phone: text(formData, "phone"),
        address: text(formData, "address"),
        deliveryMinimum: numberValue(formData, "minimum_order"),
        pickupMinimum: numberValue(formData, "pickup_minimum"),
        deliveryFee: numberValue(formData, "delivery_fee"),
        pickupEnabled: checked(formData, "pickup_enabled"),
        deliveryEnabled: checked(formData, "delivery_enabled"),
        minimumNoticeMinutes: numberValue(formData, "minimum_notice_minutes", 30),
      }),
    "Restaurant-Einstellungen wurden gespeichert.",
    refreshSettings,
  );
}

export async function updateOpeningHoursAction(formData: FormData) {
  const days = Array.from({ length: 7 }, (_, day) => ({
    weekday: day,
    isClosed: checked(formData, `day_${day}_closed`),
    lunchOpens: text(formData, `day_${day}_open`),
    lunchCloses: text(formData, `day_${day}_close`),
    dinnerOpens: text(formData, `day_${day}_second_open`),
    dinnerCloses: text(formData, `day_${day}_second_close`),
  }));

  await handle(
    SETTINGS_PATH,
    () => settingsService.updateOpeningHours(days),
    "Öffnungszeiten wurden gespeichert.",
    refreshSettings,
  );
}
