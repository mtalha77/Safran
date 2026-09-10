import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export type HomepageCategory = {
  name: string;
  subtitle: string;
  href: string;
  image: string;
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current">
      <path d="M6 14 14 6M7 6h7v7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuCategoriesSection({
  categories,
}: {
  categories: HomepageCategory[];
}) {
  return (
    <section className="w-full bg-ink py-20 [content-visibility:auto] [contain-intrinsic-size:auto_2300px] sm:py-28">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-1.5 text-xs font-semibold tracking-[0.28em] text-cream uppercase">
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
              className="group relative flex h-32 items-center overflow-hidden rounded-2xl px-5 transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:h-72 sm:h-36 sm:px-10 sm:hover:h-80"
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

              {/*
                Fluid size instead of breakpoint steps: the longest category name
                ("Gerichte mit Fisch & Crevetten") has to stay on one line next to
                the thumbnail, so the size tracks the space actually left over
                rather than jumping at fixed widths.
              */}
              <span className="relative z-10 ml-32 font-serif text-2xl leading-tight tracking-[0.06em] text-cream uppercase transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-0 group-hover:pl-8 group-hover:text-3xl group-hover:text-white sm:ml-48 sm:shrink-0 sm:whitespace-nowrap sm:text-[clamp(1.15rem,calc(4.5vw-16px),2.5rem)] sm:group-hover:pl-10 sm:group-hover:text-[clamp(1.3rem,calc(5vw-16px),3rem)]">
                {category.name}
              </span>
              <span className="relative z-10 ml-6 hidden min-w-0 truncate text-xs tracking-wide text-white/0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/80 sm:block">
                {category.subtitle}
              </span>

              <span className="relative z-10 ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/50 text-cream transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-gold group-hover:bg-gold group-hover:text-ink sm:h-14 sm:w-14">
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
