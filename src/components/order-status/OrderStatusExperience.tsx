"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import type { MessageKey } from "@/lib/i18n/messages";
import { toCustomerOrderStage } from "./order-status.adapter";
import styles from "./order-status.module.css";

function SceneSkeleton() {
  return (
    <div
      className={styles.sceneShell}
      aria-hidden
      style={{ background: "var(--paper)" }}
    />
  );
}

const ConfirmedScene = dynamic(() => import("./scenes/ConfirmedScene"), {
  loading: SceneSkeleton,
});
const CompletedScene = dynamic(() => import("./scenes/CompletedScene"), {
  loading: SceneSkeleton,
});
const CancelledScene = dynamic(() => import("./scenes/CancelledScene"), {
  loading: SceneSkeleton,
});

type CustomerView = "active" | "completed" | "cancelled";

function toCustomerView(status: string): CustomerView {
  const stage = toCustomerOrderStage(status);
  if (stage === "cancelled") return "cancelled";
  if (stage === "completed") return "completed";
  return "active";
}

export type OrderStatusExperienceProps = {
  status: string;
  orderNumber?: string | null;
  updatedAt?: string | Date | null;
  fulfillmentType?: string | null;
  /** Quiet indicator when the existing live channel is reconnecting. */
  connectionState?: "live" | "updating" | "offline" | "idle";
};

function formatUpdatedAt(value: string | Date, locale: string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale === "en" ? "en-CH" : "de-CH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function OrderStatusExperience({
  status,
  orderNumber,
  updatedAt,
  fulfillmentType,
  connectionState = "idle",
}: OrderStatusExperienceProps) {
  const { t, locale } = useLocale();
  const view = toCustomerView(status);
  const isPickup = fulfillmentType === "pickup";

  const titleKey: MessageKey =
    view === "cancelled"
      ? "order.status.cancelledTitle"
      : view === "completed"
        ? "order.status.completedTitle"
        : isPickup
          ? "order.status.pickupTitle"
          : "order.status.deliveryTitle";

  const messageKey: MessageKey =
    view === "cancelled"
      ? "order.status.cancelledMessage"
      : view === "completed"
        ? "order.status.completedMessage"
        : isPickup
          ? "order.status.pickupMessage"
          : "order.status.deliveryMessage";

  const title = t(titleKey);
  const message = t(messageKey);
  const Scene: ComponentType =
    view === "cancelled"
      ? CancelledScene
      : view === "completed"
        ? CompletedScene
        : ConfirmedScene;

  const [announcement, setAnnouncement] = useState(`${title}. ${message}`);
  const previousView = useRef(view);
  const previousFulfillment = useRef(fulfillmentType);

  useEffect(() => {
    if (
      previousView.current === view &&
      previousFulfillment.current === fulfillmentType
    ) {
      return;
    }
    previousView.current = view;
    previousFulfillment.current = fulfillmentType;
    setAnnouncement(`${title}. ${message}`);
  }, [view, fulfillmentType, title, message]);

  const updatedLabel = updatedAt ? formatUpdatedAt(updatedAt, locale) : null;

  return (
    <div className={styles.root}>
      <div className="rounded-xl bg-sage/10 px-4 py-3.5 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wider text-sage uppercase">
              {t("order.status.eyebrow")}
              {orderNumber ? ` · ${orderNumber}` : null}
            </p>
            <h2 className="mt-0.5 font-serif text-xl text-ink sm:text-2xl">
              {title}
            </h2>
          </div>
          {connectionState === "live" || connectionState === "updating" ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-sage">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  connectionState === "live"
                    ? "bg-emerald-500"
                    : "animate-pulse bg-amber-500"
                }`}
              />
              {connectionState === "live"
                ? t("order.status.live")
                : t("order.status.updating")}
            </span>
          ) : connectionState === "offline" ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
              {t("order.status.reconnecting")}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm leading-5 text-muted">{message}</p>
        {updatedLabel ? (
          <p className="mt-1 text-[11px] text-muted/80">
            {t("order.status.updatedAt", { time: updatedLabel })}
          </p>
        ) : null}
      </div>

      <div className="mt-3" key={view}>
        <Scene />
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </div>
  );
}
