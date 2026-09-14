"use client";

import { useLocale } from "@/lib/i18n/locale-context";

export function LanguageToggle({
  variant = "light",
}: {
  variant?: "light" | "dark" | "admin";
}) {
  const { locale, toggleLocale, t } = useLocale();
  const nextLabel = locale === "de" ? t("lang.toEn") : t("lang.toDe");
  const aria =
    locale === "de" ? t("lang.switchToEn") : t("lang.switchToDe");

  const styles =
    variant === "admin"
      ? "border-ink/15 bg-white text-ink hover:bg-paper"
      : variant === "dark"
        ? "border-white/35 bg-white/10 text-white hover:bg-white/15"
        : "border-sage/30 bg-white/80 text-sage-deep hover:bg-white";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={aria}
      title={aria}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-2.5 text-[11px] font-bold tracking-wide transition ${styles}`}
    >
      {nextLabel}
    </button>
  );
}
