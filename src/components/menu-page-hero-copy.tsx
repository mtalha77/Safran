"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";

export function MenuPageHeroCopy() {
  const { t } = useLocale();

  return (
    <div className="relative z-10 mx-auto max-w-7xl text-center">
      <p className="text-xs font-semibold tracking-[0.3em] text-cream/80 uppercase">
        {t("menu.eyebrow")}
      </p>
      <h1 className="mt-5 font-serif text-6xl leading-none text-white sm:text-7xl lg:text-8xl">
        {t("menu.title")}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-cream/65 sm:text-base">
        {t("menu.body")}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-cream/55">
        <span>{t("menu.halal")}</span>
        <span aria-hidden>·</span>
        <span>{t("menu.prices")}</span>
        <span aria-hidden>·</span>
        <Link href="/kasse" className="text-cream transition hover:text-white">
          {t("menu.toCart")}
        </Link>
      </div>
    </div>
  );
}
