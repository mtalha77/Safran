"use client";

import { useState } from "react";
import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { OrderAlertWatcher } from "@/components/admin/order-alert-watcher";
import { AdminStoreToggle } from "@/components/admin/store-toggle";

export const fieldClass =
  "w-full rounded-xl border border-sage/30 bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-sage-deep focus:ring-2 focus:ring-sage/20";
export const buttonClass =
  "inline-flex min-h-10 items-center justify-center rounded-xl bg-sage-deep px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 disabled:opacity-50";
export const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-xl border border-sage/35 bg-white px-4 py-2 text-sm font-semibold text-sage-deep transition hover:bg-cream";
export const dangerButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100";

function SidebarPanelIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" />
      <path d="M9 4.5v15" />
    </svg>
  );
}

export function AdminShell({
  children,
  email,
  storeOpen,
}: {
  children: React.ReactNode;
  email?: string;
  storeOpen: boolean;
}) {
  const initial = (email?.[0] ?? "A").toUpperCase();
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const expanded = hovered;

  return (
    <div
      className="min-h-screen lg:pl-20"
      style={{
        background:
          "linear-gradient(160deg, var(--cream) 0%, var(--paper) 42%, color-mix(in srgb, var(--sage) 8%, var(--cream)) 100%)",
      }}
    >
      {/* Desktop sidebar — expands on hover */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col overflow-x-hidden bg-ink text-white transition-[width] duration-300 lg:flex ${
          expanded ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex-1 overflow-y-auto py-4">
          <AdminNav collapsed={!expanded} />
        </div>

        <div className="border-t border-white/10 p-3">
          {expanded && email ? (
            <div className="mb-3 flex items-center gap-3 px-1">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-cream">Admin</p>
                <p className="truncate text-xs text-cream/50">{email}</p>
              </div>
            </div>
          ) : null}
          <form action={logoutAction}>
            <button
              className={`w-full rounded-xl border border-white/15 px-3 py-2 text-sm text-cream/80 transition hover:bg-white/10 ${
                expanded ? "text-left" : "text-center text-lg"
              }`}
              title="Abmelden"
            >
              {expanded ? "Abmelden" : "↪"}
            </button>
          </form>
        </div>
      </aside>

      <div className="relative flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-sage/15 bg-cream/80 backdrop-blur-md">
          <div className="relative flex h-16 items-center gap-3 pl-3 pr-3 sm:pl-5 sm:pr-5 lg:pl-6 lg:pr-8">
            <div className="relative z-10 flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink transition hover:bg-ink/5 lg:hidden"
                aria-label={mobileOpen ? "Menü schliessen" : "Menü öffnen"}
                onClick={() => setMobileOpen((value) => !value)}
              >
                <SidebarPanelIcon />
              </button>
              <p
                className="select-none text-[1.85rem] leading-none text-sage-deep sm:text-[2.1rem]"
                style={{ fontFamily: "var(--font-caveat), 'Segoe Script', cursive" }}
                translate="no"
              >
                Safran
              </p>
            </div>

            <div
              id="admin-header-search"
              className="pointer-events-none absolute inset-x-0 flex justify-center px-3 empty:hidden sm:px-5 lg:px-8"
            />

            <div className="relative z-10 ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
              <AdminStoreToggle open={storeOpen} />
              {email ? (
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-cream">
                    {initial}
                  </span>
                  <p className="hidden max-w-[160px] truncate text-xs text-muted lg:block">
                    {email}
                  </p>
                </div>
              ) : null}
              <form action={logoutAction} className="sm:hidden">
                <button className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink">
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </header>

        <div
          id="admin-header-filters"
          className="pointer-events-none absolute top-16 right-0 z-20 empty:hidden"
        />

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ink/50"
              aria-label="Menü schliessen"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 flex w-[min(100%,18rem)] flex-col bg-ink text-white shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <p className="font-serif text-lg text-cream" translate="no">
                  Safran
                </p>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Menü schliessen"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-cream"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <AdminNav onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="border-t border-white/10 p-4">
                {email ? (
                  <p className="mb-3 truncate px-2 text-xs text-cream/55">{email}</p>
                ) : null}
                <form action={logoutAction}>
                  <button className="w-full rounded-xl border border-white/15 px-3 py-2 text-left text-sm text-cream/80 hover:bg-white/10">
                    Abmelden
                  </button>
                </form>
              </div>
            </aside>
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-3 pt-2 pb-5 sm:px-5 sm:pt-3 lg:px-8 lg:pt-3 lg:pb-7">
          {children}
        </main>
      </div>

      <OrderAlertWatcher />
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
    <header className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? (
          <p className="mb-0.5 text-xs font-bold tracking-[0.2em] text-sage-deep uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">{description}</p>
        ) : null}
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
  return (
    <section
      className={`rounded-2xl border border-ink/6 bg-white p-4 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
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
        error
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-sage/30 bg-sage/10 text-sage-deep"
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
        <p className="text-xs font-bold tracking-[0.2em] text-sage-deep uppercase">
          Einrichtung erforderlich
        </p>
        <h1 className="mt-2 font-sans text-3xl font-semibold tracking-tight">
          Admin-Verbindung ist noch nicht konfiguriert
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Hinterlege die Supabase-Umgebungsvariablen und stelle die Server- und
          Browser-Clients bereit. Danach ist dieser Bereich automatisch verfügbar.
        </p>
        <div className="mt-5 rounded-xl bg-ink p-4 font-mono text-xs leading-6 text-cream">
          NEXT_PUBLIC_SUPABASE_URL
          <br />
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </div>
      </Card>
    </div>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-sage/35 px-5 py-10 text-center">
      <h2 className="font-sans text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-muted">{children}</p>
    </div>
  );
}
