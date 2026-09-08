const socials = [
  {
    href: "https://www.facebook.com",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1Z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-5 3.5A4.5 4.5 0 1 1 7.5 13 4.5 4.5 0 0 1 12 8.5Zm0 2A2.5 2.5 0 1 0 14.5 13 2.5 2.5 0 0 0 12 10.5ZM17.2 6.8a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
      </svg>
    ),
  },
  {
    href: "tel:+41326235959",
    label: "Anrufen",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M6.6 3.8c.4-.4 1-.5 1.5-.3l2.2 1c.5.2.8.7.8 1.2l-.2 2.2c0 .4-.2.7-.5.9l-1.2.9a12.2 12.2 0 0 0 5.4 5.4l.9-1.2c.2-.3.5-.5.9-.5l2.2-.2c.5 0 1 .3 1.2.8l1 2.2c.2.5.1 1.1-.3 1.5l-1.3 1.3c-.4.4-1 .6-1.6.5C10.8 19.4 4.6 13.2 3.8 6.7c-.1-.6.1-1.2.5-1.6Z" />
      </svg>
    ),
  },
];

export function HeroSidebar() {
  return (
    <aside className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-[72px] md:flex">
      <div className="pointer-events-auto flex h-full w-full flex-col items-center justify-between border-r border-white/20 bg-ink/25 py-28">
        <span className="text-[10px] font-semibold tracking-[0.35em] text-white/80 uppercase [writing-mode:vertical-rl] rotate-180">
          Solothurn
        </span>
        <div className="flex flex-col items-center gap-4">
          {socials.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-safran hover:text-safran"
            >
              {item.icon}
            </a>
          ))}
        </div>
        <span className="text-[10px] font-semibold tracking-[0.35em] text-white/80 uppercase [writing-mode:vertical-rl] rotate-180">
          Safran
        </span>
      </div>
    </aside>
  );
}
