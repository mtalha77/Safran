"use client";

import Link from "next/link";
import type { StorefrontSettings } from "@/backend/services/storefront.service";
import { useLocale } from "@/lib/i18n/locale-context";
import type { MessageKey } from "@/lib/i18n/messages";
import {
  formatOpeningRanges,
  groupOpeningHours,
  type OpeningDay,
} from "@/lib/store-status";

const navigation = [
  { href: "/", labelKey: "nav.home" as const },
  { href: "/speisekarte", labelKey: "nav.menu" as const },
  { href: "/#ueber-uns", labelKey: "nav.story" as const },
  { href: "/kontakt", labelKey: "nav.contact" as const },
];

const iconClass = "h-4 w-4 fill-current";

const socialLinks = [
  {
    href: "https://www.facebook.com/safranindischesrestaurant/",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
        <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.6l.4-3H14V9z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/safranindischesrestaurant/",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.2-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1zM12 9.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5z" />
      </svg>
    ),
  },
  {
    href: "https://www.pinterest.com/safranindischesrestaurant/",
    label: "Pinterest",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
        <path d="M12 3a9 9 0 0 0-3.3 17.4c-.1-.7-.2-1.8 0-2.6l1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.7 2-2.7.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.5 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.2-3.8-3.1 0-5 2.3-5 4.8 0 .9.3 1.5.7 2l.2.2-.2.9c0 .3-.4.4-.7.3-1.9-.8-2.8-2.9-2.8-5.3 0-3.9 3.3-8.6 9.6-8.6 5.1 0 8.5 3.7 8.5 7.7 0 5.3-2.9 9.2-7.3 9.2-1.5 0-2.8-.8-3.3-1.7l-.9 3.4c-.3 1.1-1.1 2.4-1.7 3.3A9 9 0 1 0 12 3z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/safran_resto",
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
        <path d="M14.3 10.5 22 2h-2.2l-6.4 7.2L8.2 2H2l8.1 11.4L2 22h2.2l7-7.8L15.8 22H22l-7.7-11.5zm-2.5 2.8-1-1.4L5.1 3.7h2.7l4.2 5.9 1 1.4 5.8 8.2h-2.7l-4.3-6z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@safran_resturant",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
        <path d="M14.5 3c.4 2.4 1.8 4.1 4 4.6v2.4c-1.4 0-2.6-.4-3.7-1.1v6.3A5.7 5.7 0 1 1 9 9.6v2.5a3.2 3.2 0 1 0 2.3 3.1V3h3.2z" />
      </svg>
    ),
  },
] as const;

export function SiteFooter({
  settings,
  hours,
}: {
  settings: StorefrontSettings;
  hours: OpeningDay[];
}) {
  const { t, locale } = useLocale();
  // The settings blurb is a single German string, so it only ships on the
  // German site; English falls back to the translated copy.
  const about =
    locale === "de" && settings.descriptionIsCustom
      ? settings.description
      : t("footer.about");

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
              {about}
            </p>
            <p className="mt-6 text-xs font-semibold tracking-[0.24em] text-cream/70 uppercase">
              {t("footer.follow")}
            </p>
            <ul className="mt-3 flex flex-wrap items-center gap-3">
              {socialLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-cream/70 transition hover:border-white/40 hover:text-white"
                  >
                    {item.icon}
                  </a>
                </li>
              ))}
            </ul>
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
              {groupOpeningHours(hours).map((group) => {
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
              {settings.restaurantName}
            </span>
            {`. ${t("footer.rights")}`}
          </p>
          <p>{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
