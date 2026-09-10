/**
 * Opening-hours evaluation, kept pure so the same rule can be reused by the
 * storefront, the checkout guard and the future customer app.
 */
export type DailyHours = {
  is_closed?: boolean | null;
  lunch_opens?: string | null;
  lunch_closes?: string | null;
  dinner_opens?: string | null;
  dinner_closes?: string | null;
};

export type ZonedNow = {
  /** 0 = Sunday, matching `opening_hours.weekday`. */
  weekday: number;
  /** `HH:MM` in the restaurant's timezone. */
  time: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Resolves the current weekday and wall-clock time in the given timezone. */
export function zonedNow(timezone: string, date: Date = new Date()): ZonedNow {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );

  return {
    weekday: Math.max(0, WEEKDAYS.indexOf(parts.weekday ?? "")),
    time: `${parts.hour}:${parts.minute}`,
  };
}

function withinWindow(start: unknown, end: unknown, time: string): boolean {
  return (
    typeof start === "string" &&
    typeof end === "string" &&
    time >= start.slice(0, 5) &&
    time <= end.slice(0, 5)
  );
}

/** True when `time` falls inside the lunch or the dinner window of that day. */
export function isWithinOpeningHours(
  hours: DailyHours | null | undefined,
  time: string,
): boolean {
  if (!hours || hours.is_closed === true) return false;
  return (
    withinWindow(hours.lunch_opens, hours.lunch_closes, time) ||
    withinWindow(hours.dinner_opens, hours.dinner_closes, time)
  );
}
