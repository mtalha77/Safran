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

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.7"
      aria-hidden
    >
      <path d="M12 21s-6.5-5.5-6.5-10a6.5 6.5 0 1 1 13 0c0 4.5-6.5 10-6.5 10Z" />
      <circle cx="12" cy="11" r="2.4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.7"
      aria-hidden
    >
      <path
        d="M4.5 5.5c0-.6.4-1 1-1h2.2c.5 0 .9.3 1 .8l.8 3c.1.4 0 .8-.4 1l-1.4 1a11 11 0 0 0 5 5l1-1.4c.2-.3.6-.5 1-.4l3 .8c.5.1.8.5.8 1v2.2c0 .6-.4 1-1 1A14.5 14.5 0 0 1 4.5 5.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.7"
      aria-hidden
    >
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 5.5L19.5 7" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.7"
      aria-hidden
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ContactPageView({
  settings,
  hours,
  isOpen,
  closedMessage,
}: {
  settings: StorefrontSettings;
  hours: OpeningDay[];
  isOpen: boolean;
  closedMessage?: string;
}) {
  const { t, locale } = useLocale();
  const address = settings.addressLines.join(", ");
  const mapQuery = encodeURIComponent(`${settings.restaurantName}, ${address}`);
  const telHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;
  // Classic Maps embed: no API key, no Places billing, and it honours the
  // viewer's Google locale.
  const embedSrc = `https://www.google.com/maps?q=${mapQuery}&hl=${locale}&z=16&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

  return (
    <>
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-sage uppercase">
          {t("contact.eyebrow")}
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.05] text-ink">
          {t("contact.title")}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted">
          {t("contact.intro")}
        </p>
        <p
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            isOpen ? "bg-sage/12 text-sage-deep" : "bg-ink/8 text-ink/70"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isOpen ? "bg-emerald-500" : "bg-red-500"
            }`}
            aria-hidden
          />
          {isOpen
            ? t("contact.openNow")
            : (closedMessage || t("contact.closedNow"))}
        </p>
      </header>

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-ink/8 bg-white p-7 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage/12 text-sage-deep">
            <PinIcon />
          </span>
          <h2 className="mt-5 font-serif text-2xl text-ink">
            {t("contact.addressTitle")}
          </h2>
          <address className="mt-3 space-y-1 text-sm leading-6 text-muted not-italic">
            {settings.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sage-deep transition hover:text-sage"
          >
            {t("contact.directions")}
            <span aria-hidden>→</span>
          </a>
        </div>

        <div className="rounded-3xl border border-ink/8 bg-white p-7 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage/12 text-sage-deep">
            <PhoneIcon />
          </span>
          <h2 className="mt-5 font-serif text-2xl text-ink">
            {t("contact.reachTitle")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            {t("contact.reachBody")}
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <a
              href={telHref}
              className="flex items-center gap-2 font-semibold text-ink transition hover:text-sage-deep"
            >
              <PhoneIcon />
              {settings.phoneDisplay}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2 break-all font-semibold text-ink transition hover:text-sage-deep"
            >
              <MailIcon />
              {settings.email}
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-ink/8 bg-white p-7 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage/12 text-sage-deep">
            <ClockIcon />
          </span>
          <h2 className="mt-5 font-serif text-2xl text-ink">
            {t("contact.hoursTitle")}
          </h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            {groupOpeningHours(hours).map((group) => {
              const names = group.days.map((day) =>
                t(`admin.day.${day}` as MessageKey),
              );
              return (
                <div
                  key={group.days.join("-")}
                  className="flex justify-between gap-4 border-b border-ink/6 pb-2 last:border-b-0"
                >
                  <dt className="font-semibold text-ink">
                    {names.length > 2
                      ? `${names[0]} – ${names.at(-1)}`
                      : names.join(" & ")}
                  </dt>
                  <dd className="text-right text-muted">
                    {formatOpeningRanges(group.ranges, t("status.closedWord"))}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-6xl overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-sm">
        <iframe
          src={embedSrc}
          title={t("contact.mapTitle")}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[320px] w-full border-0 sm:h-[420px]"
        />
      </div>

      <div className="mx-auto mt-14 max-w-3xl rounded-3xl bg-ink px-7 py-10 text-center text-cream">
        <h2 className="font-serif text-3xl">{t("contact.orderTitle")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-cream/70">
          {t("contact.orderBody")}
        </p>
        <Link
          href="/speisekarte"
          className="btn-fill mt-6 inline-flex items-center rounded-full bg-gold-light px-7 py-3 text-sm font-extrabold text-sage"
        >
          {t("nav.orderNow")}
        </Link>
      </div>
    </>
  );
}
