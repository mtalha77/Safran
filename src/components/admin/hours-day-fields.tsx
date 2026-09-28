"use client";

import { useState } from "react";
import { Time24Input } from "@/components/admin/time-24-input";
import { useLocale } from "@/lib/i18n/locale-context";
import type { MessageKey } from "@/lib/i18n/messages";

type HoursDayFieldsProps = {
  index: number;
  defaultClosed: boolean;
  opens: string;
  closes: string;
};

/**
 * One weekday row. Checking "Closed" disables and clears the time inputs
 * so the admin cannot leave stale times on a closed day.
 */
export function HoursDayFields({
  index,
  defaultClosed,
  opens,
  closes,
}: HoursDayFieldsProps) {
  const { t } = useLocale();
  const [closed, setClosed] = useState(defaultClosed);
  const dayKey = `admin.day.${index}` as MessageKey;

  return (
    <fieldset className="rounded-xl border border-sage/20 bg-white p-3">
      <div className="grid items-end gap-3 md:grid-cols-[130px_1fr_1fr]">
        <div>
          <legend className="font-semibold">{t(dayKey)}</legend>
          <label className="mt-2 flex items-center gap-2 text-xs text-muted">
            <input
              name={`day_${index}_closed`}
              type="checkbox"
              checked={closed}
              onChange={(event) => setClosed(event.target.checked)}
            />
            {t("admin.settings.closed")}
          </label>
        </div>
        <label className="text-xs font-semibold text-muted">
          {t("admin.settings.opens")}
          <Time24Input
            name={`day_${index}_open`}
            defaultValue={opens}
            disabled={closed}
          />
        </label>
        <label className="text-xs font-semibold text-muted">
          {t("admin.settings.closes")}
          <Time24Input
            name={`day_${index}_close`}
            defaultValue={closes}
            disabled={closed}
          />
        </label>
      </div>
    </fieldset>
  );
}
