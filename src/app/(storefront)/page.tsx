import Image from "next/image";
import { AboutStorySection } from "@/components/about-story-section";
import { FlavorGallerySection } from "@/components/flavor-gallery-section";
import { HomeHeroCopy } from "@/components/home-hero-copy";
import { MenuCategoriesSection } from "@/components/menu-categories-section";
import { RotatingHilal } from "@/components/rotating-hilal";
import {
  getFlavorGalleryImages,
  getHomepageCategories,
} from "@/backend/services/storefront.service";
import heroImage from "../../../public/images/hero-safran.jpg";

export default async function HomePage() {
  const [homepageCategories, galleryImages] = await Promise.all([
    getHomepageCategories(),
    getFlavorGalleryImages(6),
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
          <HomeHeroCopy />
        </div>
      </section>

      <MenuCategoriesSection categories={homepageCategories} />
      <AboutStorySection />
      <FlavorGallerySection images={galleryImages} />
    </>
  );
}
