import Image from "next/image";
import Link from "next/link";
import { HeroSidebar } from "@/components/hero-sidebar";
import { RotatingHilal } from "@/components/rotating-hilal";

export default function HomePage() {
  return (
    <section className="relative isolate h-[100svh] overflow-hidden">
      <Image
        src="/images/hero-safran.jpg"
        alt="Caffé Restaurant Safran an der Bielstrasse 3 in Solothurn"
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/40 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
        aria-hidden
      />

      <HeroSidebar />
      <RotatingHilal />

      <div className="absolute inset-0 z-10 mx-auto flex max-w-6xl items-end px-4 pb-10 pt-28 md:items-end md:pr-36 md:pb-16 md:pl-24">
        <div className="max-w-xl">
          <p className="text-sm font-medium tracking-[0.22em] text-safran uppercase">
            Solothurn · Bielstrasse 3
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-white md:text-6xl">
            Indische Küche, frisch für Sie zubereitet.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/90">
            Bestellen Sie zur Abholung oder Lieferung — ohne Konto, direkt auf
            Deutsch. Nach dem Absenden kann die Bestellung nicht storniert
            werden.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/speisekarte"
              className="rounded-full bg-safran px-6 py-3 text-sm font-semibold text-white transition hover:bg-safran-dark"
            >
              Zur Speisekarte
            </Link>
            <Link
              href="/kasse"
              className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Zur Kasse
            </Link>
          </div>
          <p className="mt-6 text-sm text-cream/75">
            Mo–Sa 11:00–14:00 und 17:00–22:30 · Sonntag geschlossen
          </p>
        </div>
      </div>
    </section>
  );
}
