import Image from "next/image";
import Link from "next/link";
import { RotatingHilal } from "@/components/rotating-hilal";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current">
      <path d="M3 10h13m-5-5 5 5-5 5" strokeWidth="1.6" />
    </svg>
  );
}

function CrescentIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7 fill-none stroke-current">
      <path
        d="M23.7 24.3A12 12 0 0 1 17 2.2a12 12 0 1 0 6.7 22.1Z"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function GlassIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7 fill-none stroke-current">
      <path
        d="M10 3h12c0 7-2.2 11-6 11S10 10 10 3Zm6 11v11m-5 3h10M11 8h10"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 36 32" className="h-8 w-8 fill-none stroke-current">
      <path
        d="M3 6h18v17H3V6Zm18 6h7l5 6v5H21V12ZM8 27a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm19 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        strokeWidth="1.5"
      />
    </svg>
  );
}

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
      <div className="absolute inset-0 bg-black/20" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10"
        aria-hidden
      />

      <RotatingHilal />

      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-5 pt-16 sm:px-8 lg:px-[54px]">
        <div className="w-full max-w-[640px] translate-y-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-sage" />
            <p className="text-[10px] font-medium tracking-[0.32em] text-cream uppercase sm:text-xs">
              Indische Küche in Solothurn
            </p>
          </div>

          <h1 className="mt-5 font-serif text-[clamp(3rem,5.8vw,5.25rem)] leading-[1.02] tracking-[-0.025em] text-white">
            Echte indische Küche.
            <br />
            Frisch für Sie.
          </h1>

          <p className="mt-5 max-w-[560px] text-base leading-7 text-white/80 sm:text-lg">
            Authentische indische Spezialitäten zur Abholung oder Lieferung —
            schnell, frisch und ohne Anmeldung.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/speisekarte"
              className="inline-flex items-center gap-3 rounded-full bg-sage px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-sage-dark"
            >
              Jetzt bestellen
              <ArrowIcon />
            </Link>
            <Link
              href="/speisekarte"
              className="rounded-full border border-white/60 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Speisekarte ansehen
            </Link>
          </div>

          <div className="mt-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-sage-deep/40 px-3 py-1.5 text-xs text-white/90">
              <span className="h-2.5 w-2.5 rounded-full bg-[#6CD34E] shadow-[0_0_8px_rgba(108,211,78,0.65)]" />
              Heute geöffnet · bis 22:30
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-white/85 sm:gap-x-9">
            <div className="flex items-center gap-3">
              <span className="text-sage">
                <CrescentIcon />
              </span>
              <span>100% Halal</span>
            </div>
            <span className="hidden h-6 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-3">
              <span className="text-sage">
                <GlassIcon />
              </span>
              <span>Ohne Alkohol</span>
            </div>
            <span className="hidden h-6 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-3">
              <span className="text-sage">
                <TruckIcon />
              </span>
              <span>Abholung &amp; Lieferung</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
