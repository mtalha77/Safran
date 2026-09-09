import Link from "next/link";

type IconKey = "samosa" | "leaf" | "skewer" | "curry" | "biryani" | "dessert";

type Category = {
  name: string;
  subtitle: string;
  href: string;
  from: string;
  to: string;
  icon: IconKey;
};

const categories: Category[] = [
  { name: "Vorspeisen", subtitle: "Samosas, Pakoras & mehr", href: "/speisekarte#vorspeisen", from: "#8B9A6E", to: "#4F5A3C", icon: "samosa" },
  { name: "Vegetarisch", subtitle: "Dal, Paneer & Gemüse", href: "/speisekarte#vegetarisch", from: "#A9B98A", to: "#6E7C55", icon: "leaf" },
  { name: "Tandoori & Grill", subtitle: "Direkt aus dem Lehmofen", href: "/speisekarte#tandoori", from: "#C79A56", to: "#8B5E2E", icon: "skewer" },
  { name: "Curry-Spezialitäten", subtitle: "Poulet, Lamm & Fisch", href: "/speisekarte#curry", from: "#B5603E", to: "#6E3420", icon: "curry" },
  { name: "Biryani & Reis", subtitle: "Aromatischer Basmati-Reis", href: "/speisekarte#biryani", from: "#8B9A6E", to: "#2B2E24", icon: "biryani" },
  { name: "Desserts & Getränke", subtitle: "Süsses zum Abschluss", href: "/speisekarte#desserts", from: "#4F5A3C", to: "#8B9A6E", icon: "dessert" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current">
      <path d="M6 14 14 6M7 6h7v7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Hand-drawn line-art per category — no photography available, so these stand in as the "image".
function CategoryIcon({ icon, className }: { icon: IconKey; className?: string }) {
  const common = { className, viewBox: "0 0 64 64", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (icon) {
    case "samosa":
      return (
        <svg {...common}>
          <path d="M12 46 32 14 52 46Z" />
          <path d="M20 46q12-8 24 0" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M14 50C14 26 30 12 50 12c0 20-14 36-38 38Z" />
          <path d="M16 48 42 20" />
        </svg>
      );
    case "skewer":
      return (
        <svg {...common}>
          <path d="M8 32h48" />
          <rect x="16" y="24" width="10" height="16" rx="3" />
          <rect x="30" y="24" width="10" height="16" rx="3" />
          <rect x="44" y="24" width="6" height="16" rx="3" />
        </svg>
      );
    case "curry":
      return (
        <svg {...common}>
          <path d="M10 30h44c0 12-9 22-22 22S10 42 10 30Z" />
          <path d="M22 30c1-6 5-9 5-14M32 30c1-6 5-9 5-14M42 30c1-6 5-9 5-14" />
        </svg>
      );
    case "biryani":
      return (
        <svg {...common}>
          <path d="M12 28h40l-3 20a5 5 0 0 1-5 4H20a5 5 0 0 1-5-4Z" />
          <path d="M8 28h48" />
          <path d="M24 22c1-4 4-6 4-10M40 22c1-4 4-6 4-10" />
        </svg>
      );
    case "dessert":
      return (
        <svg {...common}>
          <path d="M18 26h28l-4 26a4 4 0 0 1-4 3H26a4 4 0 0 1-4-3Z" />
          <path d="M14 26h36" />
          <path d="M24 12c-3 3-3 7 0 10M40 12c-3 3-3 7 0 10" />
        </svg>
      );
  }
}

export function MenuCategoriesSection() {
  return (
    <section className="w-full bg-ink py-20 sm:py-28">
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
              {/* thumbnail: small pill at rest, expands to fill the row on hover — row shares the same radius so no corner ever peeks through */}
              <div
                className="absolute inset-y-4 left-0 flex w-28 items-center justify-center overflow-hidden rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:inset-0 group-hover:w-full group-hover:items-end group-hover:justify-end sm:w-40"
                style={{ background: `linear-gradient(160deg, ${category.from}, ${category.to})` }}
                aria-hidden
              >
                {/* dot texture + light sheen so the gradient reads as a crafted illustration, not a flat block */}
                <span
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.45) 1px, transparent 0)",
                    backgroundSize: "14px 14px",
                  }}
                />
                <span className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-white/25 blur-2xl" />
                <CategoryIcon
                  icon={category.icon}
                  className="relative h-10 w-10 text-white/80 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:m-6 group-hover:h-28 group-hover:w-28 group-hover:text-white/20 sm:group-hover:h-36 sm:group-hover:w-36"
                />
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
