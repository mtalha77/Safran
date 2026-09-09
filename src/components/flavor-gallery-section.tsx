import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import biryaniImage from "../../public/images/menu/biryani.webp";
import curryImage from "../../public/images/menu/curry.webp";
import dessertsImage from "../../public/images/menu/desserts.webp";
import tandooriImage from "../../public/images/menu/tandoori.webp";
import vegetarischImage from "../../public/images/menu/vegetarisch.webp";
import vorspeisenImage from "../../public/images/menu/vorspeisen.webp";
import { Reveal } from "@/components/reveal";

const galleryImages: { image: StaticImageData; alt: string }[] = [
  { image: vorspeisenImage, alt: "Samosas und Pakoras" },
  { image: vegetarischImage, alt: "Vegetarische indische Gerichte" },
  { image: tandooriImage, alt: "Tandoori Spezialitäten" },
  { image: curryImage, alt: "Indische Curry-Spezialitäten" },
  { image: biryaniImage, alt: "Aromatisches Biryani" },
  { image: dessertsImage, alt: "Indische Desserts und Getränke" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current">
      <path
        d="M3 10h13m-5-5 5 5-5 5"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GalleryRow({
  reverse = false,
  offset = false,
}: {
  reverse?: boolean;
  offset?: boolean;
}) {
  const items = [...galleryImages, ...galleryImages];

  return (
    <div
      className={`flex w-max gap-3 will-change-transform sm:gap-5 ${
        reverse ? "flavor-marquee-reverse" : "flavor-marquee"
      } ${offset ? "-translate-x-24" : ""}`}
    >
      {items.map((item, index) => (
        <div
          key={`${item.alt}-${index}`}
          className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl border-2 border-white/80 bg-ink shadow-2xl sm:h-40 sm:w-64"
        >
          <Image
            src={item.image}
            alt={index < galleryImages.length ? item.alt : ""}
            fill
            placeholder="blur"
            sizes="(max-width: 640px) 176px, 256px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export function FlavorGallerySection() {
  return (
    <section className="relative isolate -mt-px min-h-[500px] overflow-hidden bg-sage-deep py-8 [content-visibility:auto] [contain-intrinsic-size:auto_560px] sm:min-h-[560px] sm:py-10">
      <div className="absolute inset-0 flex flex-col justify-center gap-3 opacity-70 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_100%)] sm:gap-5">
        <GalleryRow />
        <GalleryRow reverse offset />
        <GalleryRow />
      </div>

      <div
        className="absolute inset-0 bg-ink/40"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,13,41,0.94)_0%,rgba(47,13,41,0.82)_28%,rgba(47,13,41,0.2)_68%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 z-[5] h-28 bg-gradient-to-b from-sage-deep via-sage-deep/80 to-transparent sm:h-36"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[436px] items-center justify-center px-5 text-center sm:min-h-[480px]">
        <Reveal className="blur-reveal">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.3em] text-cream/80 uppercase">
              Mit Liebe zubereitet
            </p>
            <h2 className="mt-5 font-serif text-5xl leading-[0.98] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
              Aroma, Frische,
              <br />
              Leidenschaft &amp; Genuss
            </h2>
            <Link
              href="/speisekarte"
              className="btn-fill btn-fill-inverse mt-9 inline-flex items-center gap-3 rounded-full border border-white/70 px-4 py-2 text-sm font-extrabold text-white"
            >
              Speisekarte ansehen
              <ArrowIcon />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
