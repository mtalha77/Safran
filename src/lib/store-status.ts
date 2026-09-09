// Weekly opening hours: Mon–Sat lunch + dinner, Sunday closed.
// TODO: replace with a live read from the admin store-status toggle once it exists.
const HOURS: Record<number, Array<[number, number]>> = {
  1: [[11, 14], [17, 22.5]],
  2: [[11, 14], [17, 22.5]],
  3: [[11, 14], [17, 22.5]],
  4: [[11, 14], [17, 22.5]],
  5: [[11, 14], [17, 22.5]],
  6: [[11, 14], [17, 22.5]],
  0: [],
};

export type StoreStatus = {
  open: boolean;
  label: string;
};

export function getStoreStatus(date: Date = new Date()): StoreStatus {
  const day = date.getDay();
  const hour = date.getHours() + date.getMinutes() / 60;
  const ranges = HOURS[day] ?? [];
  const open = ranges.some(([start, end]) => hour >= start && hour < end);

  return {
    open,
    label: open
      ? "Heute geöffnet · 11:00–14:00 & 17:00–22:30"
      : "Heute geschlossen · Mo–Sa 11:00–14:00 & 17:00–22:30, So geschlossen",
  };
}
