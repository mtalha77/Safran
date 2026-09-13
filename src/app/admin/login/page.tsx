import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { getAdminContext } from "@/components/admin/data";
import { Card, Notice, SetupState, fieldClass } from "@/components/admin/ui";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state === "ready") redirect("/admin");
  if (context.state === "setup") return <SetupState />;

  return (
    <div className="notranslate min-h-screen bg-[#f3ede4] px-4 py-36" translate="no">
      <div className="mx-auto max-w-md">
        <div className="mb-7 text-center">
          <p className="font-serif text-4xl text-sage-deep">Safran</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-muted">Administration</p>
        </div>
        <Card>
          <h1 className="font-sans text-2xl font-semibold tracking-tight">Willkommen zurück</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Melde dich mit deinem freigeschalteten Admin-Konto an.
          </p>
          <div className="mt-5">
            <Notice error={params.error} />
          </div>
          <form action={loginAction} className="mt-2 space-y-5">
            <input type="hidden" name="next" value={params.next ?? "/admin"} />
            <label className="block text-sm font-semibold text-ink">
              E-Mail
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
              Passwort
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
            <PendingSubmitButton className="w-full" pendingLabel="Anmeldung läuft…">
              Sicher anmelden
            </PendingSubmitButton>
          </form>
        </Card>
        <p className="mt-5 text-center text-xs text-muted">
          Zugriff nur für autorisierte Mitarbeitende.
        </p>
      </div>
    </div>
  );
}
