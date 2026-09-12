"use client";

import dynamic from "next/dynamic";
import type { MenuCategory } from "@/data/menu";

const MenuCatalogInner = dynamic(
  () => import("@/components/menu-catalog").then((mod) => mod.MenuCatalog),
  {
    loading: () => (
      <div className="mx-auto flex max-w-7xl justify-center px-5 py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-sage/25 border-t-sage"
            aria-hidden
          />
          <p className="text-sm text-muted">Speisekarte wird geladen…</p>
        </div>
      </div>
    ),
  },
);

export function MenuCatalogLazy({
  categories,
}: {
  categories: MenuCategory[];
}) {
  return <MenuCatalogInner categories={categories} />;
}
