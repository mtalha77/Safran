"use client";

import { useEffect, useState } from "react";
import { getStoreStatus, type StoreStatus } from "@/lib/store-status";

export function StoreStatusBanner() {
  const [status, setStatus] = useState<StoreStatus | null>(null);

  useEffect(() => {
    setStatus(getStoreStatus());
    const id = setInterval(() => setStatus(getStoreStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!status) return null;

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
