"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/speisekarte", label: "Speisekarte" },
  { href: "/#ueber-uns", label: "Über uns" },
  { href: "/#kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

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
        className={`mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-all duration-300 sm:px-8 lg:px-[54px] ${
          floating
            ? "rounded-2xl bg-ink py-2 shadow-lg"
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
        <div className="flex items-center">
          <Link
            href="/speisekarte"
            className={`rounded-full bg-sage px-5 text-xs font-semibold text-white transition hover:bg-sage-dark sm:px-7 ${
              floating ? "py-2" : "py-3"
            }`}
          >
            Jetzt bestellen
          </Link>
        </div>
      </div>
    </header>
  );
}
