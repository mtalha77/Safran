"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/lib/i18n/locale-context";

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[19px] w-[19px] fill-none stroke-current"
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

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const nav = [
    { href: "/speisekarte", label: t("nav.menu") },
    { href: "/#ueber-uns", label: t("nav.about") },
    { href: "/#kontakt", label: t("nav.contact") },
  ];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A prerendered page cannot trust `usePathname()` — with a Proxy in play the
  // request may have been rewritten, and in production the homepage was served
  // with the solid bar covering its hero. So the server always renders the
  // see-through header and the browser adds the bar for the inner pages.
  const onHero = !mounted || pathname === "/";
  const floating = scrolled || !onHero;

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-[top,padding] duration-300 ${
        floating ? "top-4 px-4" : "top-0 px-0"
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-8 lg:px-[54px] ${
          floating
            ? "scale-[0.99] rounded-2xl bg-gold py-2 shadow-lg"
            : "border-b border-white/20 bg-transparent py-4"
        }`}
      >
        <Link
          href="/"
          translate="no"
          className={`notranslate font-serif text-[34px] leading-none ${
            floating ? "text-sage" : "text-white"
          }`}
        >
          Safran
        </Link>
        <nav
          className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 text-base font-medium md:flex ${
            floating ? "text-sage" : "text-white/90"
          }`}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:opacity-70"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle variant={floating ? "light" : "dark"} />
          <button
            type="button"
            aria-label={menuOpen ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border md:hidden ${
              floating
                ? "border-sage/35 text-sage"
                : "border-white/40 text-white"
            }`}
          >
            <span className="relative h-4 w-4">
              <span
                className={`absolute top-0.5 left-0 h-px w-4 bg-current transition-transform ${
                  menuOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute top-[7px] left-0 h-px w-4 bg-current transition-opacity ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute bottom-0.5 left-0 h-px w-4 bg-current transition-transform ${
                  menuOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
          <Link
            href="/kasse"
            aria-label={`${t("nav.cart")}, ${itemCount}`}
            className={`relative flex h-9 w-9 items-center justify-center rounded-full transition ${
              floating
                ? "bg-sage text-gold hover:bg-sage-dark"
                : "bg-gold text-sage hover:bg-gold-dark"
            }`}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sage px-1 text-[10px] font-bold text-white ring-2 ring-gold">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/speisekarte"
            aria-label={t("nav.orderNow")}
            className={`btn-fill hidden items-center rounded-full px-3 py-1.5 text-xs font-extrabold sm:inline-flex sm:px-4 ${
              floating
                ? "btn-fill-inverse bg-sage text-white"
                : "bg-gold text-sage"
            }`}
          >
            {t("nav.orderNow")}
          </Link>
        </div>
      </div>

      <div
        className={`mx-4 mt-2 overflow-hidden rounded-2xl bg-ink shadow-xl transition-all duration-300 md:hidden ${
          menuOpen
            ? "max-h-64 translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-cream transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
