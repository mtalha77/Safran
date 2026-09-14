"use client";

import { useLocale } from "@/lib/i18n/locale-context";

export function CheckoutPageCopy() {
  const { t } = useLocale();

  return (
    <div className="mb-10 max-w-2xl sm:mb-14">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-sage" />
        <p className="text-xs font-semibold tracking-[0.28em] text-sage uppercase">
          {t("checkout.eyebrow")}
        </p>
      </div>
      <h1 className="mt-4 font-serif text-5xl leading-none text-ink sm:text-6xl">
        {t("checkout.title")}
      </h1>
      <p className="mt-5 text-sm leading-7 text-muted sm:text-base">
        {t("checkout.body")}
      </p>
    </div>
  );
}
