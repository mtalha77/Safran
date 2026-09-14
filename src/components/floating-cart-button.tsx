"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { useLocale } from "@/lib/i18n/locale-context";

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      aria-hidden
    >
      <path
        d="M3.5 4.5h2l1.8 10.1a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 1.9-1.5l1.2-6.5H6.4M9.5 20a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Shortcut to checkout while browsing; hidden until something is in the cart. */
export function FloatingCartButton() {
  const { itemCount, subtotal } = useCart();
  const { t, locale } = useLocale();

  if (!itemCount) return null;

  const total = new Intl.NumberFormat(locale === "en" ? "en-CH" : "de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(subtotal);

  return (
    <div className="fixed right-5 bottom-5 z-40 flex flex-col items-end gap-2 sm:right-8 sm:bottom-8">
      <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-bold tracking-wide text-sage shadow-[0_6px_18px_rgba(0,0,0,0.22)]">
        {t("nav.freeDelivery")}
      </span>
      <Link
        href="/kasse"
        className="flex items-center gap-3 rounded-full bg-sage px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(0,0,0,0.28)] transition hover:bg-sage-dark"
      >
        <span className="relative flex">
          <CartIcon />
          <span className="absolute -top-2.5 -right-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-sage ring-2 ring-sage">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        </span>
        <span>{t("menu.toCart")}</span>
        <span className="text-white/50" aria-hidden>
          ·
        </span>
        <span>{total}</span>
      </Link>
    </div>
  );
}
