"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <nav className="space-y-1 p-3" aria-label="Admin-Navigation">
      {navigation.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            onClick={onNavigate}
            className={`flex items-center rounded-xl text-sm transition ${
              collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"
            } ${
              active
                ? "bg-white/12 text-white shadow-sm"
                : "text-cream/85 hover:bg-white/10 hover:text-white"
            }`}
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
            {!collapsed ? <span>{item.label}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
