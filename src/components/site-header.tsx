"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/speisekarte", label: "Speisekarte" },
  { href: "/kasse", label: "Kasse" },
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
      className={`fixed z-50 transition-[top,padding,left] duration-300 ${
        floating
          ? onHero
            ? "inset-x-0 top-4 px-4 md:left-[72px]"
            : "inset-x-0 top-4 px-4"
          : "inset-x-0 top-0 px-0 md:left-[72px]"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 py-3 transition-all duration-300 ${
          floating
            ? "rounded-2xl bg-white shadow-lg"
            : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          className={`font-serif text-2xl ${
            floating ? "text-maroon" : "text-white"
          }`}
        >
          Safran
        </Link>
        <div className="flex items-center gap-6">
          <nav
            className={`flex items-center gap-6 text-sm font-medium ${
              floating ? "text-ink/80" : "text-white/90"
            }`}
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-safran"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/speisekarte"
            className="rounded-full bg-safran px-4 py-2 text-sm font-semibold text-white transition hover:bg-safran-dark"
          >
            Order now
          </Link>
        </div>
      </div>
    </header>
  );
}
