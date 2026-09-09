import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import biryaniImage from "../../public/images/menu/biryani.webp";
import curryImage from "../../public/images/menu/curry.webp";
import dessertsImage from "../../public/images/menu/desserts.webp";
import tandooriImage from "../../public/images/menu/tandoori.webp";
import vegetarischImage from "../../public/images/menu/vegetarisch.webp";
import vorspeisenImage from "../../public/images/menu/vorspeisen.webp";

type Category = {
  name: string;
  subtitle: string;
  href: string;
  image: StaticImageData;
};

const categories: Category[] = [
  { name: "Vorspeisen", subtitle: "Samosas, Pakoras & mehr", href: "/speisekarte#vorspeisen", image: vorspeisenImage },
  { name: "Vegetarisch", subtitle: "Dal, Paneer & Gemüse", href: "/speisekarte#vegetarisch", image: vegetarischImage },
  { name: "Tandoori & Grill", subtitle: "Direkt aus dem Lehmofen", href: "/speisekarte#tandoori", image: tandooriImage },
  { name: "Curry-Spezialitäten", subtitle: "Poulet, Lamm & Fisch", href: "/speisekarte#curry", image: curryImage },
  { name: "Biryani & Reis", subtitle: "Aromatischer Basmati-Reis", href: "/speisekarte#biryani", image: biryaniImage },
  { name: "Desserts & Getränke", subtitle: "Süsses zum Abschluss", href: "/speisekarte#desserts", image: dessertsImage },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current">
      <path d="M6 14 14 6M7 6h7v7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuCategoriesSection() {
  return (
    <section className="w-full bg-ink py-20 [content-visibility:auto] [contain-intrinsic-size:auto_1100px] sm:py-28">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-sage/15 px-4 py-1.5 text-xs font-semibold tracking-[0.28em] text-sage uppercase">
          Entdecken Sie unsere Auswahl
        </span>
        <h2 className="mt-4 font-serif text-3xl text-cream sm:text-5xl">
          Unsere Köstlichkeiten
        </h2>
      </div>

      <ul className="mx-auto mt-14 max-w-7xl divide-y divide-white/10 border-y border-white/10">
        {categories.map((category) => (
          <li key={category.name}>
            <Link
              href={category.href}
              className="group relative flex h-28 items-center overflow-hidden rounded-2xl px-5 transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:h-72 sm:h-32 sm:px-10 sm:hover:h-80"
            >
              <div
                className="absolute inset-y-4 left-0 w-28 overflow-hidden rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:inset-0 group-hover:w-full sm:w-40"
                aria-hidden
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(max-width: 640px) 100vw, (hover: hover) 1280px, 160px"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-black/20" />
              </div>
              <span
                className="absolute inset-0 bg-black/0 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-black/30"
                aria-hidden
              />

              <span className="relative z-10 ml-32 font-serif text-xl text-cream transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-0 group-hover:pl-8 group-hover:text-3xl group-hover:text-white sm:ml-48 sm:text-2xl sm:group-hover:pl-10 sm:group-hover:text-4xl">
                {category.name}
              </span>
              <span className="relative z-10 ml-6 hidden text-xs tracking-wide text-white/0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/80 sm:block">
                {category.subtitle}
              </span>

              <span className="relative z-10 ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sage text-sage transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-sage group-hover:text-ink sm:h-12 sm:w-12">
                <ArrowIcon />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
