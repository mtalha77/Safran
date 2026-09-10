"use client";

import { useEffect, useRef, useState } from "react";
import { toCustomerOrderStage } from "@/components/order-status/order-status.adapter";
import { STAGE_COPY } from "@/components/order-status/order-status.config";
import { OrderStatusExperience } from "@/components/order-status/OrderStatusExperience";

type StatusEvent = {
  toStatus: string;
  note: string | null;
  createdAt: string;
};

type LivePayload = {
  orderNumber: string;
  status: string;
  fulfillmentType: string;
  events: StatusEvent[];
};

const POLL_MS = 4000;

function isTerminal(status: string) {
  return status === "completed" || status === "cancelled";
}

function formatEventTime(value: string) {
  return new Intl.DateTimeFormat("de-CH", {
    timeStyle: "short",
  }).format(new Date(value));
}

function eventLabel(event: StatusEvent) {
  if (event.note) return event.note;
  const stage = toCustomerOrderStage(event.toStatus);
  return STAGE_COPY[stage].progressLabel;
}

/**
 * Preserves the existing 4s token poll. Presentation lives in
 * OrderStatusExperience so polling and illustration stay separate.
 */
export function OrderStatusLive({
  token,
  initialStatus,
  initialEvents,
  fulfillmentType,
  orderNumber,
}: {
  token: string;
  initialStatus: string;
  initialEvents: StatusEvent[];
  fulfillmentType: string;
  orderNumber?: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [events, setEvents] = useState(initialEvents);
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
            setEvents(data.events);
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

      <div className="rounded-xl border border-ink/10 px-4 py-3">
        <h2 className="text-[11px] font-semibold tracking-wider text-muted uppercase">
          Verlauf
        </h2>
        {events.length ? (
          <ol className="mt-2 space-y-1.5">
            {events.map((event, index) => (
              <li
                key={`${event.createdAt}-${index}`}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="min-w-0 font-medium text-ink">
                  {eventLabel(event)}
                </span>
                <time className="shrink-0 text-[11px] text-muted tabular-nums">
                  {formatEventTime(event.createdAt)}
                </time>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Die Bestellung ist bei uns eingegangen.
          </p>
        )}
      </div>
    </div>
  );
}
