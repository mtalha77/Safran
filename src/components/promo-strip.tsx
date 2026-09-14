"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import type { MessageKey } from "@/lib/i18n/messages";

const HIGHLIGHTS: MessageKey[] = [
  "nav.freeDelivery",
  "hero.halal",
  "strip.fresh",
  "hero.alcohol",
  "hero.delivery",
  "strip.cash",
];

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 fill-current" aria-hidden>
      <path d="M12 0c.6 5.9 5.5 10.8 11.4 11.4v1.2C17.5 13.2 12.6 18.1 12 24h-1.2C10.2 18.1 5.3 13.2-.6 12.6v-1.2C5.3 10.8 10.2 5.9 10.8 0Z" />
    </svg>
  );
}

export function PromoStrip() {
  const { t } = useLocale();
  const labels = HIGHLIGHTS.map((key) => t(key));
  // Two identical runs: the track slides exactly one run's width, so the second
  // copy is already in place when the animation loops.
  const track = [...labels, ...labels];

  return (
    <aside
      aria-label={labels.join(" · ")}
      className="relative overflow-hidden border-y border-[#2F0D29]/10 bg-gold py-1.5 text-[#2F0D29] sm:py-2"
    >
      <div className="promo-strip flex w-max items-center will-change-transform">
        {track.map((label, index) => (
          <div
            key={`${label}-${index}`}
            className="flex items-center gap-5 pr-5 sm:gap-8 sm:pr-8"
            aria-hidden={index >= labels.length}
          >
            <span className="text-[11px] font-extrabold tracking-[0.18em] whitespace-nowrap uppercase sm:text-sm sm:tracking-[0.2em]">
              {label}
            </span>
            <StarIcon />
          </div>
        ))}
      </div>
    </aside>
  );
}
