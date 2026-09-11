import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  fallbackMenuItemImage,
  menuImagePublicUrl,
  resolveMenuItemImage,
} from "./menu-image-url";

describe("menuImagePublicUrl", () => {
  it("returns absolute and root-relative paths unchanged", () => {
    assert.equal(menuImagePublicUrl("https://cdn.example/a.webp"), "https://cdn.example/a.webp");
    assert.equal(menuImagePublicUrl("/brand/safran-parcel.jpg"), "/brand/safran-parcel.jpg");
  });

  it("builds a storage public URL from a relative path", () => {
    const prev = process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://abc.supabase.co/";
    try {
      assert.equal(
        menuImagePublicUrl("items/42/photo.webp"),
        "https://abc.supabase.co/storage/v1/object/public/menu-images/items/42/photo.webp",
      );
    } finally {
      if (prev === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      else process.env.NEXT_PUBLIC_SUPABASE_URL = prev;
    }
  });

  it("falls back to the brand parcel asset when no path is set", () => {
    assert.equal(resolveMenuItemImage(undefined, 7), fallbackMenuItemImage(7));
    assert.equal(fallbackMenuItemImage(7), "/brand/safran-parcel.jpg");
  });
});
