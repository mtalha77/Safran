"use client";

import { useMemo } from "react";
import { useLocale } from "@/lib/i18n/locale-context";

/** Staff read times in restaurant local time, whatever the device is set to. */
const RESTAURANT_TIMEZONE = "Europe/Zurich";

/**
 * Money and date formatting for the back office. Both follow the admin
 * language toggle, so an English session does not get German number and date
 * wording while the surrounding labels are translated. Pinning the timezone
 * also keeps server and client output identical, so these values never trigger
 * a hydration mismatch.
 */
export function useAdminFormat() {
  const { locale } = useLocale();

  return useMemo(() => {
    const tag = locale === "en" ? "en-CH" : "de-CH";
    const money = new Intl.NumberFormat(tag, {
      style: "currency",
      currency: "CHF",
    });
    const dateTime = new Intl.DateTimeFormat(tag, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: RESTAURANT_TIMEZONE,
    });
    const date = new Intl.DateTimeFormat(tag, {
      dateStyle: "medium",
      timeZone: RESTAURANT_TIMEZONE,
    });

    return {
      formatMoney(value: number | string | null | undefined) {
        const amount = typeof value === "string" ? Number(value) : (value ?? 0);
        return money.format(Number.isFinite(amount) ? amount : 0);
      },
      formatDateTime(value: string | null | undefined) {
        return value ? dateTime.format(new Date(value)) : "–";
      },
      formatDate(value: string | null | undefined) {
        return value ? date.format(new Date(value)) : "–";
      },
    };
  }, [locale]);
}
