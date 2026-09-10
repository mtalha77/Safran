"use client";

import { useEffect, useState } from "react";
import { fetchLiveStoreAvailability } from "@/lib/live-store-status";
import {
  getStoreStatus,
  type StoreStatusConfig,
} from "@/lib/store-status";

export function StoreStatusBanner({
  config,
}: {
  config: StoreStatusConfig;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [live, setLive] = useState<{ closed: boolean; message?: string } | null>(null);

  // Only the polled override lives in state, so a fresh server render of
  // `config` is picked up without an extra effect to copy it across.
  const status = getStoreStatus(
    live
      ? {
          ...config,
          manualOverride: live.closed ? "closed" : "auto",
          manualMessage: live.message ?? config.manualMessage,
        }
      : config,
    new Date(now),
  );

  useEffect(() => {
    let cancelled = false;

    async function syncAvailability() {
      const result = await fetchLiveStoreAvailability();
      if (cancelled || !result) return;
      setLive(result);
    }

    void syncAvailability();
    const statusTimer = setInterval(() => setNow(Date.now()), 60_000);
    const liveTimer = setInterval(() => void syncAvailability(), 20_000);
    return () => {
      cancelled = true;
      clearInterval(statusTimer);
      clearInterval(liveTimer);
    };
  }, []);

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
