"use client";

import { useLocale } from "@/lib/i18n/locale-context";

export function CheckoutPageCopy() {
  const { t } = useLocale();

  return (
    <div className="mb-10 max-w-2xl sm:mb-14">
      <h1 className="font-serif text-5xl leading-none text-ink sm:text-6xl">
        {t("checkout.title")}
      </h1>
      <p className="mt-5 text-sm leading-7 text-muted sm:text-base">
        {t("checkout.body")}
      </p>
    </div>
  );
}
