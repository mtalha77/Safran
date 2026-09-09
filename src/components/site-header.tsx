"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-provider";

const nav = [
  { href: "/speisekarte", label: "Speisekarte" },
  { href: "/#ueber-uns", label: "Über uns" },
  { href: "/#kontakt", label: "Kontakt" },
];

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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHero = pathname === "/";
  const floating = scrolled || !onHero;

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-[top,padding] duration-300 ${
        floating
          ? "top-[52px] px-4"
          : "top-9 px-0"
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-8 lg:px-[54px] ${
          floating
            ? "scale-[0.99] rounded-2xl bg-ink py-2 shadow-lg"
            : "border-b border-white/20 bg-transparent py-4"
        }`}
      >
        <Link
          href="/"
          className={`font-serif text-[34px] leading-none ${
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
              className="transition hover:text-sage-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
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
                className={`absolute left-0 top-0.5 h-px w-4 bg-current transition-transform ${
                  menuOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-px w-4 bg-current transition-opacity ${
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
            aria-label={`Warenkorb, ${itemCount} Artikel`}
            className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition hover:border-sage hover:bg-sage hover:text-white ${
              floating
                ? "border-sage/35 text-sage"
                : "border-white/40 text-white"
            }`}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sage px-1 text-[10px] font-bold leading-none text-white ring-2 ring-ink">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/speisekarte"
            className={`hidden rounded-full bg-sage px-5 text-xs font-semibold text-white transition hover:bg-sage-dark sm:inline-flex sm:px-7 ${
              floating ? "py-2" : "py-3"
            }`}
          >
            Jetzt bestellen
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
              className="rounded-xl px-4 py-3 text-sm font-medium text-cream transition hover:bg-white/5 hover:text-sage"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
