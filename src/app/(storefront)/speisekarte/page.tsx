import type { Metadata } from "next";
import Image from "next/image";
import { getMenuCategories } from "@/backend/services/storefront.service";
import { MenuCatalogLazy } from "@/components/menu-catalog-lazy";
import { MenuPageHeroCopy } from "@/components/menu-page-hero-copy";
import menuHeroImage from "../../../../public/images/hero-safran.jpg";

export const metadata: Metadata = {
  title: "Speisekarte",
  description:
    "Entdecken Sie die vollständige Speisekarte von Safran Romanshorn und bestellen Sie indische Spezialitäten online.",
};

export default async function SpeisekartePage() {
  const menuCategories = await getMenuCategories();

  return (
    <>
      <section className="relative overflow-hidden bg-ink px-5 pt-40 pb-20 text-cream sm:px-8 sm:pt-48 sm:pb-28">
        <Image
          src={menuHeroImage}
          alt="Safran Romanshorn"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/72" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/55 to-ink"
          aria-hidden
        />
        <div
          className="absolute -top-28 -right-24 h-96 w-96 rounded-full border border-sage/15"
          aria-hidden
        >
          <div className="absolute inset-12 rounded-full border border-sage/10" />
          <div className="absolute inset-24 rounded-full border border-sage/10" />
        </div>
        <MenuPageHeroCopy />
      </section>

      <MenuCatalogLazy categories={menuCategories} />
    </>
  );
}
