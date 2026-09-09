import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export const fieldClass =
  "w-full rounded-xl border border-sage/30 bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-sage-deep focus:ring-2 focus:ring-sage/20";
export const buttonClass =
  "inline-flex min-h-10 items-center justify-center rounded-xl bg-sage-deep px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 disabled:opacity-50";
export const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-xl border border-sage/35 bg-white px-4 py-2 text-sm font-semibold text-sage-deep transition hover:bg-cream";
export const dangerButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100";

const navigation = [
  { href: "/admin", label: "Übersicht", mark: "⌂" },
  { href: "/admin/orders", label: "Bestellungen", mark: "◎" },
  { href: "/admin/menu", label: "Speisekarte", mark: "≡" },
  { href: "/admin/settings", label: "Einstellungen", mark: "⚙" },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string;
}) {
  return (
    <div className="min-h-screen bg-[#f3ede4] pt-28 lg:pt-32">
      <div className="mx-auto flex max-w-[1500px] gap-5 px-3 pb-10 sm:px-5 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28 overflow-hidden rounded-3xl bg-ink text-white shadow-sm">
            <div className="border-b border-white/10 px-6 py-6">
              <p className="font-serif text-2xl">Safran</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-cream/60">Administration</p>
            </div>
            <nav className="space-y-1 p-3" aria-label="Admin-Navigation">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-cream/85 transition hover:bg-white/10 hover:text-white"
                >
                  <span aria-hidden="true" className="w-5 text-center text-cream/70">{item.mark}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-white/10 p-4">
              {email ? <p className="mb-3 truncate px-2 text-xs text-cream/55">{email}</p> : null}
              <form action={logoutAction}>
                <button className="w-full rounded-xl border border-white/15 px-3 py-2 text-left text-sm text-cream/80 hover:bg-white/10">
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <details className="mb-4 rounded-2xl bg-ink p-2 text-white shadow-sm lg:hidden">
            <summary className="cursor-pointer list-none rounded-xl px-3 py-2 font-semibold">
              <span className="flex items-center justify-between">Admin-Menü <span aria-hidden="true">☰</span></span>
            </summary>
            <nav className="grid gap-1 border-t border-white/10 pt-2" aria-label="Mobile Admin-Navigation">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2.5 text-sm hover:bg-white/10">
                  {item.mark} <span className="ml-2">{item.label}</span>
                </Link>
              ))}
              <form action={logoutAction}>
                <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm hover:bg-white/10">Abmelden</button>
              </form>
            </nav>
          </details>
          {children}
        </div>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-sage-deep">{eyebrow}</p> : null}
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`rounded-2xl border border-sage/15 bg-[#fffdf9] p-4 shadow-sm sm:p-6 ${className}`}>{children}</section>;
}

export function Notice({
  message,
  error,
}: {
  message?: string;
  error?: string;
}) {
  if (!message && !error) return null;
  return (
    <div
      role={error ? "alert" : "status"}
      className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
        error ? "border-red-200 bg-red-50 text-red-800" : "border-sage/30 bg-sage/10 text-sage-deep"
      }`}
    >
      {error ?? message}
    </div>
  );
}

export function SetupState() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-36">
      <Card>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage-deep">Einrichtung erforderlich</p>
        <h1 className="mt-2 font-serif text-3xl">Admin-Verbindung ist noch nicht konfiguriert</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Hinterlege die Supabase-Umgebungsvariablen und stelle die Server- und Browser-Clients bereit.
          Danach ist dieser Bereich automatisch verfügbar.
        </p>
        <div className="mt-5 rounded-xl bg-ink p-4 font-mono text-xs leading-6 text-cream">
          NEXT_PUBLIC_SUPABASE_URL<br />
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </div>
      </Card>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-sage/35 px-5 py-10 text-center">
      <h2 className="font-serif text-xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-muted">{children}</p>
    </div>
  );
}
