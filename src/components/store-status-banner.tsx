"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getStoreStatus,
  type StoreStatusConfig,
} from "@/lib/store-status";

export function StoreStatusBanner({
  config,
}: {
  config: StoreStatusConfig;
}) {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const status = getStoreStatus(config, new Date(now));

  useEffect(() => {
    const statusTimer = setInterval(
      () => setNow(Date.now()),
      60_000,
    );
    const dataTimer = setInterval(() => router.refresh(), 5 * 60_000);
    return () => {
      clearInterval(statusTimer);
      clearInterval(dataTimer);
    };
  }, [router]);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-[60] flex h-9 items-center justify-center px-4 text-center text-xs font-semibold tracking-wide text-white ${
        status.open ? "bg-sage" : "bg-red-700"
      }`}
    >
      {status.label}
    </div>
  );
}
