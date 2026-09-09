import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

type Category = {
  name: string;
  subtitle: string;
  href: string;
  image: string;
};

const categories: Category[] = [
  { name: "Vorspeisen", subtitle: "Starters", href: "/speisekarte#vorspeisen", image: "/images/menu/items/001.webp" },
  { name: "Tandoori-Grillvorspeisen", subtitle: "From the Clay Oven", href: "/speisekarte#tandoori", image: "/images/menu/items/015.webp" },
  { name: "Salate", subtitle: "Salads", href: "/speisekarte#salate", image: "/images/menu/items/017.webp" },
  { name: "Brot", subtitle: "Breads from the Oven", href: "/speisekarte#brot", image: "/images/menu/items/023.webp" },
  { name: "Vegetarische Gerichte", subtitle: "Vegetarian Specialities", href: "/speisekarte#vegetarisch", image: "/images/menu/items/038.webp" },
  { name: "Gerichte mit Poulet", subtitle: "Chicken Specialities", href: "/speisekarte#poulet", image: "/images/menu/items/044.webp" },
  { name: "Gerichte mit Lammfleisch", subtitle: "Lamb Specialities", href: "/speisekarte#lamm", image: "/images/menu/items/061.webp" },
  { name: "Gerichte mit Rind", subtitle: "Beef Specialities", href: "/speisekarte#rind", image: "/images/menu/items/067.webp" },
  { name: "Fisch & Crevetten", subtitle: "Fish & Seafood", href: "/speisekarte#fisch", image: "/images/menu/items/074.webp" },
  { name: "Biryani", subtitle: "Aromatic Basmati Rice", href: "/speisekarte#biryani", image: "/images/menu/items/079.webp" },
  { name: "Spezialmenü", subtitle: "Menus for Sharing", href: "/speisekarte#special-menu", image: "/images/menu/items/083.webp" },
  { name: "Kindermenü", subtitle: "Kids Menu", href: "/speisekarte#kinder", image: "/images/menu/items/090.webp" },
  { name: "Indische Nachspeisen", subtitle: "Desserts", href: "/speisekarte#desserts", image: "/images/menu/items/093.webp" },
  { name: "Spezielle Beilagen", subtitle: "Extra Side Dishes", href: "/speisekarte#extras", image: "/images/menu/items/101.webp" },
  { name: "Indische Getränke", subtitle: "Indian Beverages", href: "/speisekarte#indische-getraenke", image: "/images/menu/items/105.webp" },
  { name: "Alkoholfreie Getränke", subtitle: "Soft Drinks", href: "/speisekarte#softdrinks", image: "/images/menu/items/116.webp" },
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
    <section className="w-full bg-ink py-20 [content-visibility:auto] [contain-intrinsic-size:auto_2300px] sm:py-28">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-sage/15 px-4 py-1.5 text-xs font-semibold tracking-[0.28em] text-sage uppercase">
            Entdecken Sie unsere Auswahl
          </span>
          <h2 className="mt-4 font-serif text-3xl text-cream sm:text-5xl">
            Unsere Köstlichkeiten
          </h2>
        </Reveal>
      </div>

      <ul className="mx-auto mt-14 max-w-7xl divide-y divide-white/10 border-y border-white/10">
        {categories.map((category, index) => (
          <li key={category.name}>
            <Reveal delay={(index % 4) * 60}>
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
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
