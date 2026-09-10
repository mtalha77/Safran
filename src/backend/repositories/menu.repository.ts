import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryInput, MenuItemInput } from "@/backend/types";
import type { Database } from "@/types/database";

type Db = SupabaseClient<Database>;

export const MENU_BUCKET = "menu-images";

export function listCategories(db: Db) {
  return db.from("menu_categories").select("*").order("sort_order");
}

export function listItems(db: Db) {
  return db.from("menu_items").select("*").order("sort_order");
}

export function countItemsInCategory(db: Db, categoryId: string) {
  return db
    .from("menu_items")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);
}

export function findItemsByNumbers(db: Db, itemNumbers: number[]) {
  return db
    .from("menu_items")
    .select("id, item_number, name, price, is_active")
    .in("item_number", itemNumbers);
}

export function insertCategory(db: Db, input: CategoryInput) {
  return db.from("menu_categories").insert({
    id: input.id as string,
    title: input.name,
    subtitle: input.description,
    sort_order: input.sortOrder,
    is_active: input.isActive,
  });
}

export function updateCategory(db: Db, id: string, input: CategoryInput) {
  return db
    .from("menu_categories")
    .update({
      title: input.name,
      subtitle: input.description,
      sort_order: input.sortOrder,
      is_active: input.isActive,
    })
    .eq("id", id);
}

export function deleteCategory(db: Db, id: string) {
  return db.from("menu_categories").delete().eq("id", id);
}

export function setCategorySortOrder(db: Db, id: string, sortOrder: number) {
  return db.from("menu_categories").update({ sort_order: sortOrder }).eq("id", id);
}

export function insertItem(db: Db, input: MenuItemInput) {
  return db
    .from("menu_items")
    .insert({
      category_id: input.categoryId,
      item_number: input.itemNumber,
      name: input.name,
      description_de: input.descriptionDe,
      description_en: input.descriptionEn,
      price: input.price,
      sort_order: input.sortOrder,
      is_active: input.isActive,
    })
    .select("id")
    .single();
}

export function updateItem(db: Db, id: number, input: MenuItemInput) {
  return db
    .from("menu_items")
    .update({
      category_id: input.categoryId,
      item_number: input.itemNumber,
      name: input.name,
      description_de: input.descriptionDe,
      description_en: input.descriptionEn,
      price: input.price,
      sort_order: input.sortOrder,
      is_active: input.isActive,
    })
    .eq("id", id);
}

export function setItemAvailability(db: Db, id: number, isActive: boolean) {
  return db.from("menu_items").update({ is_active: isActive }).eq("id", id);
}

export function setItemSortOrder(db: Db, id: number, sortOrder: number) {
  return db.from("menu_items").update({ sort_order: sortOrder }).eq("id", id);
}

export function setItemImage(db: Db, id: number, imagePath: string | null) {
  return db.from("menu_items").update({ image_path: imagePath }).eq("id", id);
}

export function findItemImage(db: Db, id: number) {
  return db.from("menu_items").select("image_path").eq("id", id).maybeSingle();
}

export function deleteItem(db: Db, id: number) {
  return db.from("menu_items").delete().eq("id", id);
}

export function uploadMenuImage(
  db: Db,
  path: string,
  body: File | Blob | Buffer,
  contentType?: string,
) {
  const type =
    contentType ??
    (body instanceof File
      ? body.type
      : body instanceof Blob
        ? body.type
        : "application/octet-stream");

  return db.storage.from(MENU_BUCKET).upload(path, body, {
    contentType: type,
    upsert: false,
  });
}

export function removeMenuImages(db: Db, paths: string[]) {
  return db.storage.from(MENU_BUCKET).remove(paths);
}

export function publicImageUrl(db: Db, path: string) {
  return db.storage.from(MENU_BUCKET).getPublicUrl(path).data.publicUrl;
}
