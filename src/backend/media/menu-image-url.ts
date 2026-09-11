const MENU_BUCKET = "menu-images";

/** Local fallback when no Storage path is set. */
export function fallbackMenuItemImage(_itemNumber?: number): string {
  return "/brand/safran-parcel.jpg";
}

/**
 * Resolve a `menu_items.image_path` / `menu_categories.image_path` to a URL
 * the storefront can render. Storage paths become public Supabase object URLs.
 */
export function menuImagePublicUrl(imagePath: string | null | undefined): string | undefined {
  const path = imagePath?.trim();
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return undefined;

  return `${base}/storage/v1/object/public/${MENU_BUCKET}/${path.replace(/^\//, "")}`;
}

export function resolveMenuItemImage(
  imagePath: string | null | undefined,
  itemNumber: number,
): string {
  return menuImagePublicUrl(imagePath) ?? fallbackMenuItemImage(itemNumber);
}
