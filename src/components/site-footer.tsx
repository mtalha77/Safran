"use client";

import Link from "next/link";
import type { StorefrontSettings } from "@/backend/services/storefront.service";
import { useLocale } from "@/lib/i18n/locale-context";
import type { MessageKey } from "@/lib/i18n/messages";
import {
  formatOpeningRanges,
  type OpeningDay,
} from "@/lib/store-status";

const navigation = [
  { href: "/", labelKey: "nav.home" as const },
  { href: "/speisekarte", labelKey: "nav.menu" as const },
  { href: "/#ueber-uns", labelKey: "nav.story" as const },
  { href: "/#kontakt", labelKey: "nav.contact" as const },
];

function groupedHours(hours: OpeningDay[]) {
  const ordered = [...hours].sort(
    (a, b) => ((a.day + 6) % 7) - ((b.day + 6) % 7),
  );
  const groups: Array<{ days: number[]; ranges: OpeningDay["ranges"] }> = [];
  for (const day of ordered) {
    const key = JSON.stringify(day.ranges);
    const previous = groups.at(-1);
    if (previous && JSON.stringify(previous.ranges) === key) {
      previous.days.push(day.day);
    } else {
      groups.push({ days: [day.day], ranges: day.ranges });
    }
  }
  return groups;
}

export function SiteFooter({
  settings,
  hours,
}: {
  settings: StorefrontSettings;
  hours: OpeningDay[];
}) {
  const { t } = useLocale();

  return (
    <footer id="kontakt" className="relative overflow-hidden bg-ink text-cream">
      {/* Watermark band on top — not beside content */}
      <div
        className="pointer-events-none relative z-0 flex min-h-[7.5rem] items-end overflow-hidden px-0 pt-8 select-none sm:min-h-[10rem] sm:pt-10"
        aria-hidden
      >
        <svg
          viewBox="0 0 100 18"
          className="notranslate block h-auto w-full"
          preserveAspectRatio="none"
        >
          <text
            x="0"
            y="14.5"
            textLength="100"
            lengthAdjust="spacingAndGlyphs"
            fill="var(--cream)"
            fillOpacity="0.1"
            style={{
              fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
              fontSize: "16px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Safran
          </text>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-6 pb-10 sm:px-8 sm:pt-8 sm:pb-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_0.9fr_1fr] lg:gap-10">
          <div>
            <Link
              href="/"
              translate="no"
              className="notranslate font-serif text-5xl leading-none text-cream"
            >
              {settings.restaurantName}
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-cream/65">
              {settings.description}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-cream/70 uppercase">
              {t("footer.explore")}
            </p>
            <nav className="mt-5 flex flex-col items-start gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-cream/65 transition hover:translate-x-1 hover:text-white"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-cream/70 uppercase">
              {t("footer.hours")}
            </p>
            <div className="mt-5 space-y-4 text-sm text-cream/65">
              {groupedHours(hours).map((group) => {
                const names = group.days.map((day) =>
                  t(`admin.day.${day}` as MessageKey),
                );
                return (
                  <div key={group.days.join("-")}>
                    <p className="text-cream">
                      {names.length > 2
                        ? `${names[0]} – ${names.at(-1)}`
                        : names.join(" & ")}
                    </p>
                    <p className="mt-1">
                      {formatOpeningRanges(
                        group.ranges,
                        t("status.closedWord"),
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-cream/70 uppercase">
              {t("footer.visit")}
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

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-[11px] text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            <span translate="no" className="notranslate">
              Safran
            </span>
            . {t("footer.rights")}
          </p>
          <p>{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
