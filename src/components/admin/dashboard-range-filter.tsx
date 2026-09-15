"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useLocale } from "@/lib/i18n/locale-context";

type DashboardRangeFilterProps = {
  from: string;
  to: string;
  /** Today's date in the restaurant timezone, so presets match the KPIs. */
  today: string;
};

/** Date-key arithmetic on `YYYY-MM-DD`, independent of the viewer's timezone. */
function shiftDays(dateKey: string, delta: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + delta))
    .toISOString()
    .slice(0, 10);
}

function presetsFor(today: string) {
  const yesterday = shiftDays(today, -1);
  return [
    { key: "today", labelKey: "admin.range.today", from: today, to: today },
    {
      key: "yesterday",
      labelKey: "admin.range.yesterday",
      from: yesterday,
      to: yesterday,
    },
    {
      key: "last7",
      labelKey: "admin.range.last7",
      from: shiftDays(today, -6),
      to: today,
    },
    {
      key: "last30",
      labelKey: "admin.range.last30",
      from: shiftDays(today, -29),
      to: today,
    },
    {
      key: "month",
      labelKey: "admin.range.month",
      from: `${today.slice(0, 7)}-01`,
      to: today,
    },
  ] as const;
}

export function DashboardRangeFilter({
  from,
  to,
  today,
}: DashboardRangeFilterProps) {
  const router = useRouter();
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"day" | "range">(
    from === to ? "day" : "range",
  );
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);

  useEffect(() => {
    setDraftFrom(from);
    setDraftTo(to);
    setMode(from === to ? "day" : "range");
  }, [from, to]);

  function navigate(nextFrom: string, nextTo: string) {
    if (nextFrom === from && nextTo === to) return;
    const params = new URLSearchParams({ from: nextFrom, to: nextTo });
    startTransition(() => router.push(`/admin?${params.toString()}`));
  }

  function onDayChange(value: string) {
    if (!value) return;
    setDraftFrom(value);
    setDraftTo(value);
    navigate(value, value);
  }

  function onRangeChange(nextFrom: string, nextTo: string) {
    setDraftFrom(nextFrom);
    setDraftTo(nextTo);
    if (!nextFrom || !nextTo) return;
    const ordered =
      nextFrom <= nextTo ? [nextFrom, nextTo] : [nextTo, nextFrom];
    navigate(ordered[0], ordered[1]);
  }

  const presets = presetsFor(today);
  const activePreset = presets.find(
    (preset) => preset.from === from && preset.to === to,
  );

  const chipClass = (active: boolean) =>
    `inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm font-semibold transition ${
      active
        ? "border-sage-deep bg-sage-deep text-white"
        : "border-sage/30 bg-white text-sage-deep hover:bg-cream"
    }`;

  const dateInputClass =
    "min-h-10 rounded-xl border border-sage/40 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-sage-deep focus:ring-2 focus:ring-sage/20";

  return (
    <div
      aria-busy={isPending}
      className={`mb-4 rounded-2xl border border-sage/15 bg-white/80 p-4 transition ${
        isPending ? "opacity-70" : ""
      }`}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted">
            {t("admin.range.label")}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => navigate(preset.from, preset.to)}
                aria-pressed={activePreset?.key === preset.key}
                className={chipClass(activePreset?.key === preset.key)}
              >
                {t(preset.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex rounded-xl border border-sage/30 bg-white p-1">
            {(["day", "range"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                aria-pressed={mode === value}
                className={`min-h-8 rounded-lg px-3 text-sm font-semibold transition ${
                  mode === value
                    ? "bg-sage-deep text-white"
                    : "text-sage-deep hover:bg-cream"
                }`}
              >
                {t(value === "day" ? "admin.range.modeDay" : "admin.range.modeRange")}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-3">
            {mode === "day" ? (
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wide text-muted">
                  {t("admin.range.day")}
                </span>
                <input
                  type="date"
                  max={today}
                  value={draftFrom}
                  onChange={(event) => onDayChange(event.target.value)}
                  className={dateInputClass}
                />
              </label>
            ) : (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold tracking-wide text-muted">
                    {t("admin.range.from")}
                  </span>
                  <input
                    type="date"
                    max={today}
                    value={draftFrom}
                    onChange={(event) =>
                      onRangeChange(event.target.value, draftTo)
                    }
                    className={dateInputClass}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold tracking-wide text-muted">
                    {t("admin.range.to")}
                  </span>
                  <input
                    type="date"
                    max={today}
                    value={draftTo}
                    onChange={(event) =>
                      onRangeChange(draftFrom, event.target.value)
                    }
                    className={dateInputClass}
                  />
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
