import Link from "next/link";

const navigation = [
  { href: "/", label: "Startseite" },
  { href: "/speisekarte", label: "Speisekarte" },
  { href: "/#ueber-uns", label: "Unsere Geschichte" },
  { href: "/#kontakt", label: "Kontakt" },
];

export function SiteFooter() {
  return (
    <footer id="kontakt" className="overflow-hidden bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-8 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_0.9fr_1fr] lg:gap-10">
          <div>
            <Link
              href="/"
              className="font-serif text-5xl leading-none text-sage"
            >
              Safran
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-cream/65">
              Authentische indische Küche am Romanshorner Hafen – frisch
              zubereitet, herzlich serviert und bequem nach Hause bestellt.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-sage uppercase">
              Entdecken
            </p>
            <nav className="mt-5 flex flex-col items-start gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-cream/65 transition hover:translate-x-1 hover:text-sage"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-sage uppercase">
              Öffnungszeiten
            </p>
            <div className="mt-5 space-y-4 text-sm text-cream/65">
              <div>
                <p className="text-cream">Montag – Samstag</p>
                <p className="mt-1">11:00 – 14:00 Uhr</p>
                <p>17:00 – 22:30 Uhr</p>
              </div>
              <div>
                <p className="text-cream">Sonntag</p>
                <p className="mt-1">Geschlossen</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-sage uppercase">
              Besuchen Sie uns
            </p>
            <address className="mt-5 space-y-4 text-sm leading-6 text-cream/65 not-italic">
              <p>
                Hafenstrasse 31
                <br />
                8590 Romanshorn, Schweiz
              </p>
              <p>
                <a
                  href="tel:+41326235959"
                  className="transition hover:text-sage"
                >
                  032 623 59 59
                </a>
                <br />
                <a
                  href="mailto:info@safran-solothurn.ch"
                  className="break-all transition hover:text-sage"
                >
                  info@safran-solothurn.ch
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-[11px] text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Caffé Restaurant Safran. Alle Rechte
            vorbehalten.
          </p>
          <p>100% Halal · Ohne Alkohol · Abholung &amp; Lieferung</p>
        </div>
      </div>
    </footer>
  );
}
