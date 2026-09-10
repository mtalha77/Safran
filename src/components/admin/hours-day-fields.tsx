"use client";

import { useState } from "react";
import { fieldClass } from "@/components/admin/ui";

type HoursDayFieldsProps = {
  day: string;
  index: number;
  defaultClosed: boolean;
  lunchOpens: string;
  lunchCloses: string;
  dinnerOpens: string;
  dinnerCloses: string;
};

/**
 * One weekday row. Checking "Geschlossen" disables and clears the time inputs
 * so the admin cannot leave stale times on a closed day.
 */
export function HoursDayFields({
  day,
  index,
  defaultClosed,
  lunchOpens,
  lunchCloses,
  dinnerOpens,
  dinnerCloses,
}: HoursDayFieldsProps) {
  const [closed, setClosed] = useState(defaultClosed);

  return (
    <fieldset className="rounded-xl border border-sage/20 bg-white p-3">
      <div className="grid items-end gap-3 md:grid-cols-[130px_1fr_1fr_1fr_1fr]">
        <div>
          <legend className="font-semibold">{day}</legend>
          <label className="mt-2 flex items-center gap-2 text-xs text-muted">
            <input
              name={`day_${index}_closed`}
              type="checkbox"
              checked={closed}
              onChange={(event) => setClosed(event.target.checked)}
            />
            Geschlossen
          </label>
        </div>
        <label className="text-xs font-semibold text-muted">
          Öffnet
          <input
            className={`${fieldClass} mt-1`}
            name={`day_${index}_open`}
            type="time"
            defaultValue={lunchOpens}
            disabled={closed}
          />
        </label>
        <label className="text-xs font-semibold text-muted">
          Schliesst
          <input
            className={`${fieldClass} mt-1`}
            name={`day_${index}_close`}
            type="time"
            defaultValue={lunchCloses}
            disabled={closed}
          />
        </label>
        <label className="text-xs font-semibold text-muted">
          Öffnet wieder
          <input
            className={`${fieldClass} mt-1`}
            name={`day_${index}_second_open`}
            type="time"
            defaultValue={dinnerOpens}
            disabled={closed}
          />
        </label>
        <label className="text-xs font-semibold text-muted">
          Schliesst
          <input
            className={`${fieldClass} mt-1`}
            name={`day_${index}_second_close`}
            type="time"
            defaultValue={dinnerCloses}
            disabled={closed}
          />
        </label>
      </div>
    </fieldset>
  );
}
