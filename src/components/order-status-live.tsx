"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { OrderStatusExperience } from "@/components/order-status/OrderStatusExperience";

type LivePayload = {
  orderNumber: string;
  status: string;
  fulfillmentType: string;
};

const POLL_MS = 4000;

function isTerminal(status: string) {
  return status === "completed" || status === "cancelled";
}

/**
 * Preserves the existing 4s token poll so cancelled/completed still update.
 * Progressive kitchen statuses stay admin-only — customers see an ETA message.
 */
export function OrderStatusLive({
  token,
  initialStatus,
  fulfillmentType,
  orderNumber,
}: {
  token: string;
  initialStatus: string;
  fulfillmentType: string;
  orderNumber?: string | null;
}) {
  const { t } = useLocale();
  const [status, setStatus] = useState(initialStatus);
  const [connectionState, setConnectionState] = useState<
    "live" | "updating" | "offline" | "idle"
  >(isTerminal(initialStatus) ? "idle" : "live");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (isTerminal(initialStatus)) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      if (cancelled) return;
      setConnectionState((prev) => (prev === "offline" ? "updating" : prev));

      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(token)}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          if (!cancelled) setConnectionState("offline");
        } else {
          const data = (await response.json()) as LivePayload;
          if (!cancelled) {
            setStatus(data.status);
            setUpdatedAt(new Date());
            setConnectionState("live");
            if (isTerminal(data.status)) return;
          }
        }
      } catch {
        if (!cancelled) setConnectionState("offline");
      }

      if (!cancelled && !isTerminal(statusRef.current)) {
        timer = setTimeout(poll, POLL_MS);
      }
    }

    timer = setTimeout(poll, POLL_MS);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [token, initialStatus]);

  return (
    <div className="space-y-4">
      <OrderStatusExperience
        status={status}
        orderNumber={orderNumber}
        fulfillmentType={fulfillmentType}
        updatedAt={updatedAt}
        connectionState={isTerminal(status) ? "idle" : connectionState}
      />

      <p className="rounded-xl border border-ink/10 px-4 py-3 text-xs leading-5 text-muted">
        {t("order.status.saveLink")}
      </p>
    </div>
  );
}
