import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { requireCapability } from "@/backend/auth/authorize";
import { ConflictError, UnavailableError, ValidationError } from "@/backend/errors";
import * as menuRepository from "@/backend/repositories/menu.repository";
import type { CategoryInput, MenuItemInput } from "@/backend/types";
import {
  assertMenuImage,
  parseCategoryId,
  parseCategoryInput,
  parseMenuItemId,
  parseMenuItemInput,
  parseOrderedIds,
} from "@/backend/validation/menu";
import type { Database } from "@/types/database";

type Db = SupabaseClient<Database>;

/**
 * Menu management. Every entry point re-checks the caller's capability, so the
 * same functions can back the admin UI today and an authenticated API later.
 */
async function menuContext() {
  const { supabase, actor } = await requireCapability("menu:manage");
  return { db: supabase as unknown as Db, actor };
}

function assertOk(error: { message: string } | null, code: string) {
  if (error) throw new UnavailableError(code, error.message);
}

export async function listMenu() {
  const { db } = await menuContext();
  const [categories, items] = await Promise.all([
    menuRepository.listCategories(db),
    menuRepository.listItems(db),
  ]);

  return {
    categories: categories.data ?? [],
    // Resolving the public URL here keeps storage details out of the UI.
    items: (items.data ?? []).map((item) => ({
      ...item,
      imageUrl: item.image_path
        ? menuRepository.publicImageUrl(db, item.image_path)
        : null,
    })),
    error: categories.error?.message ?? items.error?.message ?? null,
  };
}

export async function createCategory(input: Record<string, unknown>) {
  const { db } = await menuContext();
  const parsed: CategoryInput = parseCategoryInput(input);
  assertOk(await menuRepository.insertCategory(db, parsed).then((r) => r.error), "category_create_failed");
}

export async function updateCategory(input: Record<string, unknown>) {
  const { db } = await menuContext();
  const id = parseCategoryId(input.id);
  const parsed = parseCategoryInput({ ...input, id });
  assertOk(await menuRepository.updateCategory(db, id, parsed).then((r) => r.error), "category_update_failed");
}

/** Refuses to delete a category that still holds dishes, so items never orphan. */
export async function deleteCategory(input: Record<string, unknown>) {
  const { db } = await menuContext();
  const id = parseCategoryId(input.id);

  const { count, error } = await menuRepository.countItemsInCategory(db, id);
  assertOk(error, "category_check_failed");
  if (count) {
    throw new ConflictError(
      "category_not_empty",
      "Kategorie enthält noch Gerichte und kann nicht gelöscht werden.",
    );
  }

  assertOk(await menuRepository.deleteCategory(db, id).then((r) => r.error), "category_delete_failed");
}

export async function sortCategories(input: Record<string, unknown>) {
  const { db } = await menuContext();
  const ids = parseOrderedIds(input.orderedIds);

  const results = await Promise.all(
    ids.map((id, index) => menuRepository.setCategorySortOrder(db, id, index)),
  );
  assertOk(results.find((result) => result.error)?.error ?? null, "category_sort_failed");
}

/**
 * Creates the dish first, then attaches the image. If the upload fails the dish
 * is removed again so the admin never sees a half-created item.
 */
export async function createMenuItem(
  input: Record<string, unknown>,
  image?: File | null,
) {
  const { db } = await menuContext();
  const parsed: MenuItemInput = parseMenuItemInput(input);

  const { data: item, error } = await menuRepository.insertItem(db, parsed);
  assertOk(error, "item_create_failed");
  if (!item) {
    throw new UnavailableError("item_create_failed", "Gericht konnte nicht erstellt werden.");
  }

  if (image && image.size) {
    try {
      const path = await storeImage(db, image, item.id);
      assertOk(await menuRepository.setItemImage(db, item.id, path).then((r) => r.error), "item_image_failed");
    } catch (uploadError) {
      await menuRepository.deleteItem(db, item.id);
      throw uploadError;
    }
  }
}

export async function updateMenuItem(input: Record<string, unknown>) {
  const { db } = await menuContext();
  const id = parseMenuItemId(input.id);
  const parsed = parseMenuItemInput(input);
  assertOk(await menuRepository.updateItem(db, id, parsed).then((r) => r.error), "item_update_failed");
}

export async function setMenuItemAvailability(input: Record<string, unknown>) {
  const { db } = await menuContext();
  const id = parseMenuItemId(input.id);
  const isAvailable = input.isAvailable === true || input.isAvailable === "on";
  assertOk(
    await menuRepository.setItemAvailability(db, id, isAvailable).then((r) => r.error),
    "item_availability_failed",
  );
}

export async function sortMenuItems(input: Record<string, unknown>) {
  const { db } = await menuContext();
  const ids = parseOrderedIds(input.orderedIds).map((id) => parseMenuItemId(id));

  const results = await Promise.all(
    ids.map((id, index) => menuRepository.setItemSortOrder(db, id, index)),
  );
  assertOk(results.find((result) => result.error)?.error ?? null, "item_sort_failed");
}

export async function replaceMenuItemImage(
  input: Record<string, unknown>,
  image: File | null,
) {
  const { db } = await menuContext();
  const id = parseMenuItemId(input.id);
  if (!image || !image.size) {
    throw new ValidationError("image_required", "Bitte ein Bild auswählen.");
  }

  const current = await menuRepository.findItemImage(db, id);
  const path = await storeImage(db, image, id);
  assertOk(await menuRepository.setItemImage(db, id, path).then((r) => r.error), "item_image_failed");

  if (current.data?.image_path) {
    await menuRepository.removeMenuImages(db, [current.data.image_path]);
  }
}

export async function deleteMenuItem(input: Record<string, unknown>) {
  const { db } = await menuContext();
  const id = parseMenuItemId(input.id);

  const current = await menuRepository.findItemImage(db, id);
  assertOk(await menuRepository.deleteItem(db, id).then((r) => r.error), "item_delete_failed");
  if (current.data?.image_path) {
    await menuRepository.removeMenuImages(db, [current.data.image_path]);
  }
}

async function storeImage(db: Db, file: File, itemId: number): Promise<string> {
  assertMenuImage(file);

  const extension =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "webp";
  const path = `items/${itemId}-${Date.now()}.${extension}`;
  const { error } = await menuRepository.uploadMenuImage(db, path, file);
  if (error) {
    throw new UnavailableError("image_upload_failed", error.message);
  }

  return path;
}
