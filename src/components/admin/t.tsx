"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import type { MessageKey } from "@/lib/i18n/messages";
import { statusClass } from "@/components/admin/status-styles";

export function T({ k }: { k: MessageKey }) {
  const { t } = useLocale();
  return <>{t(k)}</>;
}

const STATUS_KEYS: Record<string, MessageKey> = {
  pending: "admin.status.pending",
  confirmed: "admin.status.confirmed",
  preparing: "admin.status.preparing",
  ready: "admin.status.ready",
  out_for_delivery: "admin.status.out_for_delivery",
  completed: "admin.status.completed",
  cancelled: "admin.status.cancelled",
};

const PRINT_STATUS_KEYS: Record<string, MessageKey> = {
  pending: "admin.print.pending",
  printing: "admin.print.printing",
  printed: "admin.print.printed",
  failed: "admin.print.failed",
  cancelled: "admin.print.cancelled",
};

export function useStatusLabel() {
  const { t } = useLocale();
  return (status: string) => {
    const key = STATUS_KEYS[status];
    return key ? t(key) : status;
  };
}

export function OrderStatusBadge({ status }: { status: string }) {
  const label = useStatusLabel()(status);
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(status)}`}
    >
      {label}
    </span>
  );
}

export function usePrintStatusLabel() {
  const { t } = useLocale();
  return (status: string) => {
    const key = PRINT_STATUS_KEYS[status];
    return key ? t(key) : status;
  };
}

const ACTION_KEYS: Record<string, MessageKey> = {
  confirmed: "admin.action.confirmed",
  preparing: "admin.action.preparing",
  ready: "admin.action.ready",
  out_for_delivery: "admin.action.out_for_delivery",
  completed: "admin.action.completed",
  cancelled: "admin.action.cancelled",
};

export function useActionLabel() {
  const { t } = useLocale();
  return (status: string) => {
    const key = ACTION_KEYS[status];
    return key ? t(key) : status;
  };
}

export const ORDER_STATUS_VALUES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
] as const;
