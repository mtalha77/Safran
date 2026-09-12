"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  {
    href: "/admin",
    label: "Übersicht",
    icon: "/images/home-1-svgrepo-com.svg",
  },
  {
    href: "/admin/orders",
    label: "Bestellungen",
    icon: "/images/online-delivery-svgrepo-com.svg",
  },
  {
    href: "/admin/menu",
    label: "Speisekarte",
    icon: "/images/menu-navigation-grid-1528-svgrepo-com.svg",
  },
  {
    href: "/admin/settings",
    label: "Einstellungen",
    icon: "/images/setting-2-svgrepo-com.svg",
  },
] as const;

export function AdminNav({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  useEffect(() => {
    if (!isPending && pendingHref && pathname === pendingHref) {
      setPendingHref(null);
    }
  }, [isPending, pendingHref, pathname]);

  return (
    <nav className="space-y-1 p-3" aria-label="Admin-Navigation">
      {navigation.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const pending = isPending && pendingHref === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            title={item.label}
            aria-busy={pending || undefined}
            onClick={(event) => {
              if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.altKey ||
                event.ctrlKey ||
                event.shiftKey
              ) {
                return;
              }
              if (active && item.href === "/admin" && pathname === "/admin") return;
              if (active && item.href !== "/admin" && pathname === item.href) return;

              onNavigate?.();
              setPendingHref(item.href);
              window.dispatchEvent(new Event("safran:admin-nav"));
              event.preventDefault();
              startTransition(() => {
                router.push(item.href);
              });
            }}
            className={`relative flex items-center rounded-xl text-sm transition ${
              collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"
            } ${
              active
                ? "bg-white/12 text-white shadow-sm"
                : "text-cream/85 hover:bg-white/10 hover:text-white"
            } ${pending ? "opacity-70" : ""}`}
          >
            <span
              aria-hidden
              className={`block shrink-0 bg-current ${
                active ? "opacity-100" : "opacity-70"
              }`}
              style={{
                width: 20,
                height: 20,
                WebkitMaskImage: `url(${item.icon})`,
                maskImage: `url(${item.icon})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
            {!collapsed ? (
              <span className="flex min-w-0 items-center gap-2">
                <span>{item.label}</span>
                {pending ? (
                  <span
                    className="inline-block size-3 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden
                  />
                ) : null}
              </span>
            ) : pending ? (
              <span
                className="absolute inline-block size-3 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
