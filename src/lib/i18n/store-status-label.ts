"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import type { MessageKey } from "@/lib/i18n/messages";
import { formatOpeningRanges, type StoreStatus } from "@/lib/store-status";

export function useStoreStatusLabel(status: StoreStatus) {
  const { t } = useLocale();

  if (status.message) return status.message;
  if (status.dayIndex === null) {
    return t(status.open ? "status.manualOpen" : "status.manualClosed");
  }

  const day = t(`admin.day.${status.dayIndex}` as MessageKey);
  if (!status.ranges.length) return t("status.closedDay", { day });

  const schedule = formatOpeningRanges(status.ranges, t("status.closedWord"));
  return t(status.open ? "status.open" : "status.closedNow", { day, schedule });
}
