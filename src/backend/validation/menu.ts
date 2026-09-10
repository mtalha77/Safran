import { ValidationError } from "@/backend/errors";
import { MAX_MENU_IMAGE_UPLOAD_BYTES } from "@/backend/media/compress-menu-image";
import {
  boolean,
  integerInRange,
  nonNegativeNumber,
  numberValue,
  optionalText,
  requiredText,
  slugify,
  text,
} from "@/backend/validation/primitives";
import type { CategoryInput, MenuItemInput } from "@/backend/types";

export function parseCategoryInput(input: Record<string, unknown>): CategoryInput {
  const name = requiredText(
    input.name,
    120,
    "category_name_required",
    "Der Kategoriename ist erforderlich.",
  );
  const id = text(input.id, 60) || slugify(name);
  if (!id) {
    throw new ValidationError(
      "category_id_invalid",
      "Aus diesem Namen lässt sich keine Kategorie-ID bilden.",
    );
  }

  return {
    id,
    name,
    description: optionalText(input.description, 300),
    sortOrder: numberValue(input.sortOrder),
    isActive: boolean(input.isActive),
  };
}

export function parseCategoryId(value: unknown): string {
  return requiredText(
    value,
    60,
    "category_id_required",
    "Die Kategorie ist erforderlich.",
  );
}

export function parseMenuItemInput(input: Record<string, unknown>): MenuItemInput {
  return {
    categoryId: parseCategoryId(input.categoryId),
    itemNumber: integerInRange(
      input.itemNumber,
      1,
      999_999,
      "item_number_invalid",
      "Die Artikelnummer muss eine positive Zahl sein.",
    ),
    name: requiredText(
      input.name,
      160,
      "item_name_required",
      "Der Name des Gerichts ist erforderlich.",
    ),
    descriptionDe: optionalText(input.descriptionDe, 600),
    descriptionEn: optionalText(input.descriptionEn, 600),
    price: nonNegativeNumber(
      input.price,
      "item_price_invalid",
      "Der Preis muss 0 oder höher sein.",
    ),
    sortOrder: numberValue(input.sortOrder),
    isActive: boolean(input.isActive),
  };
}

export function parseMenuItemId(value: unknown): number {
  return integerInRange(
    value,
    1,
    Number.MAX_SAFE_INTEGER,
    "item_id_invalid",
    "Das Gericht wurde nicht gefunden.",
  );
}

/** Comma separated id list from the drag-and-drop sort forms. */
export function parseOrderedIds(value: unknown): string[] {
  const ids = text(value, 5000)
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (!ids.length) {
    throw new ValidationError("sort_empty", "Es wurde keine Reihenfolge übermittelt.");
  }
  return ids;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Lightweight pre-check; compression re-validates and rewrites to WebP. */
export function assertMenuImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new ValidationError(
      "image_type_invalid",
      "Erlaubt sind JPEG-, PNG-, WebP- oder AVIF-Bilder.",
    );
  }
  if (file.size > MAX_MENU_IMAGE_UPLOAD_BYTES) {
    throw new ValidationError(
      "image_too_large",
      "Das Bild darf höchstens 5 MB gross sein.",
    );
  }
}
