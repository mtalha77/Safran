"use client";

import { useMemo, useState } from "react";
import { fieldClass } from "@/components/admin/ui";

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0"),
);

function parseTime(value: string): { hour: string; minute: string } {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return { hour: "", minute: "" };
  const hour = String(Math.min(23, Math.max(0, Number(match[1])))).padStart(
    2,
    "0",
  );
  const rawMinute = Math.min(59, Math.max(0, Number(match[2])));
  // Snap to nearest 5 minutes for the select list.
  const snapped = Math.round(rawMinute / 5) * 5;
  const minute = String(snapped === 60 ? 55 : snapped).padStart(2, "0");
  return { hour, minute };
}

type Time24InputProps = {
  name: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Always shows 24-hour HH:MM picks (native `type="time"` follows the OS clock).
 */
export function Time24Input({
  name,
  defaultValue = "",
  disabled = false,
  className = "",
}: Time24InputProps) {
  const initial = useMemo(() => parseTime(defaultValue), [defaultValue]);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);

  const combined = hour && minute ? `${hour}:${minute}` : "";

  return (
    <div className={`mt-1 flex items-center gap-1.5 ${className}`.trim()}>
      <input type="hidden" name={name} value={combined} disabled={disabled} />
      <select
        aria-label="Hour"
        className={`${fieldClass} mt-0 min-w-0 flex-1`}
        value={hour}
        disabled={disabled}
        onChange={(event) => setHour(event.target.value)}
      >
        <option value="">--</option>
        {HOURS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="shrink-0 text-sm font-semibold text-muted" aria-hidden>
        :
      </span>
      <select
        aria-label="Minute"
        className={`${fieldClass} mt-0 min-w-0 flex-1`}
        value={minute}
        disabled={disabled}
        onChange={(event) => setMinute(event.target.value)}
      >
        <option value="">--</option>
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}
