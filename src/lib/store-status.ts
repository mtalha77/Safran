export type OpeningDay = {
  day: number;
  label: string;
  ranges: Array<[string, string]>;
};

export type StoreStatusConfig = {
  timezone: string;
  hours: OpeningDay[];
  manualOverride: "auto" | "open" | "closed";
  manualMessage?: string;
};

/**
 * Structured so the label can be composed in the viewer's language on the
 * client; only `message` is admin-authored and shown verbatim.
 */
export type StoreStatus = {
  open: boolean;
  message?: string;
  /** Zurich weekday 0–6, or null while a manual override is active. */
  dayIndex: number | null;
  ranges: OpeningDay["ranges"];
};

function zonedParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const weekdays: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return {
    day: weekdays[value("weekday")] ?? 0,
    minute: Number(value("hour")) * 60 + Number(value("minute")),
  };
}

function timeToMinutes(time: string) {
  const [hour = "0", minute = "0"] = time.split(":");
  return Number(hour) * 60 + Number(minute);
}

export function formatOpeningRanges(
  ranges: OpeningDay["ranges"],
  closedLabel = "Geschlossen",
) {
  return ranges.length
    ? ranges.map(([start, end]) => `${start}–${end}`).join(" & ")
    : closedLabel;
}

/**
 * Monday-first list where neighbouring days with identical hours are merged,
 * so the footer and contact page can print "Mon – Fri" instead of five rows.
 */
export function groupOpeningHours(hours: OpeningDay[]) {
  const ordered = [...hours].sort(
    (a, b) => ((a.day + 6) % 7) - ((b.day + 6) % 7),
  );
  const groups: Array<{ days: number[]; ranges: OpeningDay["ranges"] }> = [];
  for (const day of ordered) {
    const key = JSON.stringify(day.ranges);
    const previous = groups.at(-1);
    if (previous && JSON.stringify(previous.ranges) === key) {
      previous.days.push(day.day);
    } else {
      groups.push({ days: [day.day], ranges: day.ranges });
    }
  }
  return groups;
}

export function getStoreStatus(
  config: StoreStatusConfig,
  date: Date = new Date(),
): StoreStatus {
  if (config.manualOverride !== "auto") {
    return {
      open: config.manualOverride === "open",
      message: config.manualMessage,
      dayIndex: null,
      ranges: [],
    };
  }

  const { day, minute } = zonedParts(date, config.timezone);
  const ranges = config.hours.find((entry) => entry.day === day)?.ranges ?? [];

  return {
    open: ranges.some(
      ([start, end]) =>
        minute >= timeToMinutes(start) && minute < timeToMinutes(end),
    ),
    // Carry the Zurich weekday so "today" is not read as the viewer's local day.
    dayIndex: day,
    ranges,
  };
}
