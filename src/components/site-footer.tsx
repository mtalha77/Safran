import Link from "next/link";
import type { StorefrontSettings } from "@/backend/services/storefront.service";
import {
  formatOpeningRanges,
  type OpeningDay,
} from "@/lib/store-status";

const navigation = [
  { href: "/", label: "Startseite" },
  { href: "/speisekarte", label: "Speisekarte" },
  { href: "/#ueber-uns", label: "Unsere Geschichte" },
  { href: "/#kontakt", label: "Kontakt" },
];

function groupedHours(hours: OpeningDay[]) {
  const ordered = [...hours].sort(
    (a, b) => ((a.day + 6) % 7) - ((b.day + 6) % 7),
  );
  const groups: Array<{ labels: string[]; ranges: OpeningDay["ranges"] }> = [];
  for (const day of ordered) {
    const key = JSON.stringify(day.ranges);
    const previous = groups.at(-1);
    if (previous && JSON.stringify(previous.ranges) === key) {
      previous.labels.push(day.label);
    } else {
      groups.push({ labels: [day.label], ranges: day.ranges });
    }
  }
  return groups;
}

function dayLabel(labels: string[]) {
  return labels.length > 2
    ? `${labels[0]} – ${labels.at(-1)}`
    : labels.join(" & ");
}

export function SiteFooter({
  settings,
  hours,
}: {
  settings: StorefrontSettings;
  hours: OpeningDay[];
}) {
  return (
    <footer id="kontakt" className="overflow-hidden bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-8 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_0.9fr_1fr] lg:gap-10">
          <div>
            <Link
              href="/"
              className="font-serif text-5xl leading-none text-cream"
            >
              {settings.restaurantName}
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-cream/65">
              {settings.description}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-cream/70 uppercase">
              Entdecken
            </p>
            <nav className="mt-5 flex flex-col items-start gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-cream/65 transition hover:translate-x-1 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-cream/70 uppercase">
              Öffnungszeiten
            </p>
            <div className="mt-5 space-y-4 text-sm text-cream/65">
              {groupedHours(hours).map((group) => (
                <div key={group.labels.join("-")}>
                  <p className="text-cream">{dayLabel(group.labels)}</p>
                  <p className="mt-1">{formatOpeningRanges(group.ranges)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-cream/70 uppercase">
              Besuchen Sie uns
            </p>
            <address className="mt-5 space-y-4 text-sm leading-6 text-cream/65 not-italic">
              <p>
                {settings.addressLines.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </p>
              <p>
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                  className="transition hover:text-white"
                >
                  {settings.phoneDisplay}
                </a>
                <br />
                <a
                  href={`mailto:${settings.email}`}
                  className="break-all transition hover:text-white"
                >
                  {settings.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-[11px] text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Safran. Alle Rechte
              vorbehalten.
          </p>
          <p>100% Halal · Ohne Alkohol · Abholung &amp; Lieferung</p>
        </div>
      </div>
    </footer>
  );
}
