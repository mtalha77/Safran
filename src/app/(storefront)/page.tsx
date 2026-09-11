import Image from "next/image";
import Link from "next/link";
import { AboutStorySection } from "@/components/about-story-section";
import { FlavorGallerySection } from "@/components/flavor-gallery-section";
import { MenuCategoriesSection } from "@/components/menu-categories-section";
import { RotatingHilal } from "@/components/rotating-hilal";
import {
  getFlavorGalleryImages,
  getHomepageCategories,
} from "@/backend/services/storefront.service";
import heroImage from "../../../public/images/hero-safran.jpg";

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

export default async function HomePage() {
  const [homepageCategories, galleryImages] = await Promise.all([
    getHomepageCategories(),
    getFlavorGalleryImages(8),
  ]);

  return (
    <>
      <section className="relative isolate h-[100svh] overflow-hidden">
        <Image
          src={heroImage}
          alt="Safran in Romanshorn"
          fill
          preload
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10"
          aria-hidden
        />

        <RotatingHilal />

        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-5 pt-24 sm:px-8 lg:px-[54px]">
          <div className="w-full max-w-[640px] sm:translate-y-5">
            <div
              className="hero-reveal flex items-center gap-3"
              style={{ animationDelay: "100ms" }}
            >
              <span className="h-px w-6 bg-cream" />
              <p className="text-[10px] font-medium tracking-[0.32em] text-cream uppercase sm:text-xs">
                Indische Küche in Romanshorn
              </p>
            </div>

            <h1
              className="hero-reveal mt-4 font-serif text-[clamp(2.75rem,5.8vw,5.25rem)] leading-[1.02] tracking-[-0.025em] text-white sm:mt-5"
              style={{ animationDelay: "190ms" }}
            >
              Echte indische Küche.
              <br />
              Frisch für Sie.
            </h1>

            <p
              className="hero-reveal mt-4 max-w-[560px] text-sm leading-6 text-white/80 sm:mt-5 sm:text-lg sm:leading-7"
              style={{ animationDelay: "280ms" }}
            >
              Authentische indische Spezialitäten zur Abholung oder Lieferung —
              schnell, frisch und ohne Anmeldung.
            </p>

            <div
              className="hero-reveal mt-5 flex flex-wrap gap-3 sm:mt-6"
              style={{ animationDelay: "370ms" }}
            >
              <Link
                href="/speisekarte"
                aria-label="Jetzt bestellen"
                className="btn-fill inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-extrabold text-[#2F0D29]"
              >
                Jetzt bestellen
                <ArrowIcon />
              </Link>
              <Link
                href="/speisekarte"
                className="btn-fill btn-fill-inverse inline-flex items-center rounded-full border border-white/60 px-4 py-2 text-sm font-extrabold text-white"
              >
                Speisekarte ansehen
              </Link>
            </div>

            <div
              className="hero-reveal mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/85 sm:mt-6 sm:gap-x-9 sm:gap-y-3 sm:text-xs"
              style={{ animationDelay: "460ms" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-cream"><CrescentIcon /></span>
                <span>100% Halal</span>
              </div>
              <span className="hidden h-6 w-px bg-white/20 sm:block" />
              <div className="flex items-center gap-3">
                <span className="text-cream"><GlassIcon /></span>
                <span>Ohne Alkohol</span>
              </div>
              <span className="hidden h-6 w-px bg-white/20 sm:block" />
              <div className="flex items-center gap-3">
                <span className="text-cream"><TruckIcon /></span>
                <span>Abholung &amp; Lieferung</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MenuCategoriesSection categories={homepageCategories} />
      <AboutStorySection />
      <FlavorGallerySection images={galleryImages} />
    </>
  );
}
