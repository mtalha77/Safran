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
      <div className="absolute inset-0 bg-black/52" aria-hidden />

      <HeroSidebar />
      <RotatingHilal />

      <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-6 text-center md:px-24">
        <p className="text-sm font-medium tracking-[0.22em] text-cream uppercase">
          Solothurn · Bielstrasse 3
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-white md:text-7xl">
          Echte indische Küche.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-cream/90">
          Bestellen Sie zur Abholung oder Lieferung — ohne Konto, direkt auf
          Deutsch. Nach dem Absenden kann die Bestellung nicht storniert werden.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/speisekarte"
            className="rounded-full bg-sage px-6 py-3 text-sm font-semibold text-cream transition hover:bg-sage-dark"
          >
            Zur Speisekarte
          </Link>
          <Link
            href="/kasse"
            className="rounded-full border border-cream/40 bg-cream/10 px-6 py-3 text-sm font-semibold text-cream transition hover:bg-cream/20"
          >
            Zur Kasse
          </Link>
        </div>
        <p className="mt-6 text-sm text-cream/75">
          Mo–Sa 11:00–14:00 und 17:00–22:30 · Sonntag geschlossen
        </p>
      </div>
    </section>
  );
}
