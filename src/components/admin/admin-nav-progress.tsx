"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Thin top progress line while admin route transitions run. */
export function AdminNavProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [pathname]);

  useEffect(() => {
    function start() {
      setActive(true);
    }
    window.addEventListener("safran:admin-nav", start);
    return () => window.removeEventListener("safran:admin-nav", start);
  }, []);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden"
      aria-hidden
    >
      <div className="h-full w-1/3 animate-pulse bg-sage-deep" />
    </div>
  );
}
