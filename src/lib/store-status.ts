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

export type StoreStatus = {
  open: boolean;
  label: string;
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

export function formatOpeningRanges(ranges: OpeningDay["ranges"]) {
  return ranges.length
    ? ranges.map(([start, end]) => `${start}–${end}`).join(" & ")
    : "Geschlossen";
}

export function getStoreStatus(
  config: StoreStatusConfig,
  date: Date = new Date(),
): StoreStatus {
  if (config.manualOverride !== "auto") {
    const open = config.manualOverride === "open";
    return {
      open,
      label:
        config.manualMessage ??
        (open ? "Heute ausnahmsweise geöffnet" : "Heute geschlossen"),
    };
  }

  const { day, minute } = zonedParts(date, config.timezone);
  const openingDay = config.hours.find((entry) => entry.day === day);
  const ranges = openingDay?.ranges ?? [];
  const open = ranges.some(
    ([start, end]) =>
      minute >= timeToMinutes(start) && minute < timeToMinutes(end),
  );
  const today = formatOpeningRanges(ranges);

  return {
    open,
    label: open
      ? `Heute geöffnet · ${today}`
      : ranges.length
        ? `Momentan geschlossen · Heute ${today}`
        : "Heute geschlossen",
  };
}
