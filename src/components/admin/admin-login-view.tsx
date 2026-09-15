"use client";

import { loginAction } from "@/app/admin/actions";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";
import { Card, Notice, fieldClass } from "@/components/admin/ui";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/lib/i18n/locale-context";

export function AdminLoginView({
  error,
  next,
}: {
  error?: string;
  next: string;
}) {
  const { t } = useLocale();

  return (
    <div
      className="notranslate min-h-screen bg-[#f3ede4] px-4 py-36"
      translate="no"
    >
      <div className="mx-auto max-w-md">
        <div className="mb-7 text-center">
          <p className="font-serif text-4xl text-sage-deep">Safran</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-muted">
            {t("admin.login.eyebrow")}
          </p>
          <div className="mt-4 flex justify-center">
            <LanguageToggle variant="admin" />
          </div>
        </div>
        <Card>
          <h1 className="font-sans text-2xl font-semibold tracking-tight">
            {t("admin.login.title")}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            {t("admin.login.desc")}
          </p>
          <div className="mt-5">
            <Notice error={error} />
          </div>
          <form action={loginAction} className="mt-2 space-y-5">
            <input type="hidden" name="next" value={next} />
            <label className="block text-sm font-semibold text-ink">
              {t("admin.login.email")}
              <input
                className={fieldClass}
                type="email"
                name="email"
                autoComplete="email"
                required
                autoFocus
                placeholder="admin@example.com"
              />
            </label>
            <label className="block text-sm font-semibold text-ink">
              {t("admin.login.password")}
              <input
                className={fieldClass}
                type="password"
                name="password"
                autoComplete="current-password"
                minLength={8}
                required
                placeholder="••••••••"
              />
            </label>
            <PendingSubmitButton
              className="w-full"
              pendingLabel={t("admin.login.submitting")}
            >
              {t("admin.login.submit")}
            </PendingSubmitButton>
          </form>
        </Card>
        <p className="mt-5 text-center text-xs text-muted">
          {t("admin.login.footnote")}
        </p>
      </div>
    </div>
  );
}
