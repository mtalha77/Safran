"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  toCustomerOrderStage,
  type CustomerOrderStage,
} from "./order-status.adapter";
import { STAGE_COPY } from "./order-status.config";
import { OrderProgress } from "./OrderProgress";
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
const PreparingScene = dynamic(() => import("./scenes/PreparingScene"), {
  loading: SceneSkeleton,
});
const ReadyScene = dynamic(() => import("./scenes/ReadyScene"), {
  loading: SceneSkeleton,
});
const DeliveringScene = dynamic(() => import("./scenes/DeliveringScene"), {
  loading: SceneSkeleton,
});
const CompletedScene = dynamic(() => import("./scenes/CompletedScene"), {
  loading: SceneSkeleton,
});
const CancelledScene = dynamic(() => import("./scenes/CancelledScene"), {
  loading: SceneSkeleton,
});
const NeutralScene = dynamic(() => import("./scenes/NeutralScene"), {
  loading: SceneSkeleton,
});

const SCENE_BY_STAGE: Record<CustomerOrderStage, ComponentType> = {
  confirmed: ConfirmedScene,
  preparing: PreparingScene,
  ready: ReadyScene,
  delivering: DeliveringScene,
  completed: CompletedScene,
  cancelled: CancelledScene,
  unknown: NeutralScene,
};

export type OrderStatusExperienceProps = {
  status: string;
  orderNumber?: string | null;
  estimatedArrival?: string | null;
  updatedAt?: string | Date | null;
  fulfillmentType?: string | null;
  /** Quiet indicator when the existing live channel is reconnecting. */
  connectionState?: "live" | "updating" | "offline" | "idle";
};

function formatUpdatedAt(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("de-CH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function OrderStatusExperience({
  status,
  orderNumber,
  estimatedArrival,
  updatedAt,
  fulfillmentType,
  connectionState = "idle",
}: OrderStatusExperienceProps) {
  const stage = toCustomerOrderStage(status);
  const copy = STAGE_COPY[stage];
  const Scene = SCENE_BY_STAGE[stage];
  const [announcement, setAnnouncement] = useState(`${copy.title}. ${copy.message}`);
  const previousStage = useRef(stage);

  useEffect(() => {
    if (previousStage.current === stage) return;
    previousStage.current = stage;
    // One polite announcement per genuine stage change — not per poll tick.
    setAnnouncement(`${copy.title}. ${copy.message}`);
  }, [stage, copy.title, copy.message]);

  const updatedLabel = updatedAt ? formatUpdatedAt(updatedAt) : null;

  return (
    <div className={styles.root}>
      <div className="rounded-xl bg-sage/10 px-4 py-3.5 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wider text-sage uppercase">
              Aktueller Status
              {orderNumber ? ` · ${orderNumber}` : null}
            </p>
            <h2 className="mt-0.5 font-serif text-xl text-ink sm:text-2xl">
              {copy.title}
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
              {connectionState === "live" ? "Live" : "Aktualisiere…"}
            </span>
          ) : connectionState === "offline" ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
              Verbindung…
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm leading-5 text-muted">{copy.message}</p>
        {estimatedArrival ? (
          <p className="mt-1.5 text-sm font-semibold text-ink">
            Voraussichtliche Ankunft: {estimatedArrival}
          </p>
        ) : null}
        {updatedLabel ? (
          <p className="mt-1 text-[11px] text-muted/80">
            Zuletzt aktualisiert {updatedLabel}
          </p>
        ) : null}
      </div>

      <div className="mt-3" key={stage}>
        <Scene />
      </div>

      <OrderProgress stage={stage} fulfillmentType={fulfillmentType} />

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </div>
  );
}
