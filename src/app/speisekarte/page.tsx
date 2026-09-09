import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MenuCatalog } from "@/components/menu-catalog";
import menuHeroImage from "../../../public/images/menu/tandoori.webp";

export const metadata: Metadata = {
  title: "Speisekarte",
  description:
    "Entdecken Sie die vollständige Speisekarte von Safran Romanshorn und bestellen Sie indische Spezialitäten online.",
};

export default function SpeisekartePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink px-5 pt-40 pb-20 text-cream sm:px-8 sm:pt-48 sm:pb-28">
        <Image
          src={menuHeroImage}
          alt="Tandoori-Spezialitäten von Safran"
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
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-sage uppercase">
            Frisch für Sie zubereitet
          </p>
          <h1 className="mt-5 font-serif text-6xl leading-none text-white sm:text-7xl lg:text-8xl">
            Speisekarte
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-cream/65 sm:text-base">
            Authentische indische Spezialitäten, aromatische Gewürze und eine
            grosse Auswahl für jeden Geschmack.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-cream/55">
            <span>100% Halal</span>
            <span aria-hidden>·</span>
            <span>Preise in CHF inkl. MwSt.</span>
            <span aria-hidden>·</span>
            <Link href="/kasse" className="text-sage transition hover:text-white">
              Zum Warenkorb
            </Link>
          </div>
        </div>
      </section>

      <MenuCatalog />
    </>
  );
}
