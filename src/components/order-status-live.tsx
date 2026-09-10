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
    dateStyle: "medium",
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
    <>
      <OrderStatusExperience
        status={status}
        orderNumber={orderNumber}
        fulfillmentType={fulfillmentType}
        updatedAt={updatedAt}
        connectionState={isTerminal(status) ? "idle" : connectionState}
      />

      <div className="mt-8">
        <h2 className="font-serif text-2xl text-ink">Verlauf</h2>
        {events.length ? (
          <ol className="mt-4 space-y-4">
            {events.map((event, index) => (
              <li key={`${event.createdAt}-${index}`} className="text-sm">
                <p className="font-semibold text-ink">{eventLabel(event)}</p>
                <time className="mt-1 block text-xs text-muted">
                  {formatEventTime(event.createdAt)}
                </time>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Die Bestellung ist bei uns eingegangen.
          </p>
        )}
      </div>
    </>
  );
}
