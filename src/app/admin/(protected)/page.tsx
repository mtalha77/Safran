import Link from "next/link";
import type { ReactNode } from "react";
import { getBackOfficeOverview } from "@/backend/services/order.service";
import {
  formatDate,
  formatMoney,
  getAdminContext,
  orderStatusLabels,
  statusClass,
} from "@/components/admin/data";
import {
  Card,
  EmptyState,
  Notice,
  PageHeader,
  secondaryButtonClass,
} from "@/components/admin/ui";

type OverviewProps = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

function IconWrap({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${className}`}
    >
      {children}
    </span>
  );
}

function KpiCard({
  label,
  value,
  hint,
  href,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint: string;
  href?: string;
  icon: ReactNode;
}) {
  const body = (
    <Card className="h-full transition hover:border-sage/25">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-muted">{label}</p>
          <p className="mt-2 font-sans text-3xl font-semibold tracking-tight tabular-nums text-ink">{value}</p>
          <p className="mt-1 text-xs text-muted">{hint}</p>
        </div>
        {icon}
      </div>
    </Card>
  );
  if (!href) return body;
  return (
    <Link href={href} className="block">
      {body}
    </Link>
  );
}

function StatusDonut({
  total,
  segments,
}: {
  total: number;
  segments: Array<{ label: string; value: number; color: string }>;
}) {
  const size = 148;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const safeTotal = Math.max(total, 1);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#ebe6df"
            strokeWidth={stroke}
          />
          {segments.map((segment) => {
            const length = (segment.value / safeTotal) * circumference;
            const circle = (
              <circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={stroke}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += length;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-sans text-2xl font-semibold tracking-tight tabular-nums text-ink">{total}</p>
          <p className="text-[10px] tracking-wide text-muted uppercase">Total</p>
        </div>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {segments.map((segment) => (
          <li
            key={segment.label}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2 text-ink">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: segment.color }}
              />
              {segment.label}
            </span>
            <span className="tabular-nums font-semibold text-ink">
              {segment.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function AdminOverviewPage({ searchParams }: OverviewProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;

  const { acceptsOrders, orders: recentOrders, kpis, error } =
    await getBackOfficeOverview();

  const todayRevenue = kpis.cashRevenue + kpis.onlineRevenue;
  const avgOrder =
    kpis.transactions > 0 ? todayRevenue / kpis.transactions : 0;

  const statusTotal =
    kpis.completed +
    kpis.outForDelivery +
    kpis.preparing +
    kpis.ready +
    kpis.pending +
    kpis.confirmed;
  const statusSegments = [
    { label: "Abgeschlossen", value: kpis.completed, color: "#2f9e6b" },
    { label: "Unterwegs", value: kpis.outForDelivery, color: "#3b82f6" },
    {
      label: "In Zubereitung",
      value: kpis.preparing + kpis.ready + kpis.confirmed,
      color: "#d97706",
    },
    { label: "Neu", value: kpis.pending, color: "#9ca3af" },
  ];

  const paidTotal = kpis.cashRevenue + kpis.onlineRevenue;
  const cashPct = paidTotal > 0 ? (kpis.cashRevenue / paidTotal) * 100 : 0;
  const onlinePct = paidTotal > 0 ? (kpis.onlineRevenue / paidTotal) * 100 : 0;

  return (
    <>
      <PageHeader
        title="Übersicht"
        description="Heutige Bestellungen, Umsatz und Status auf einen Blick."
        action={
          <Link href="/admin/orders" className={secondaryButtonClass}>
            Alle Bestellungen
          </Link>
        }
      />
      <Notice message={params.message} error={params.error ?? error ?? undefined} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Umsatz heute"
          value={formatMoney(todayRevenue)}
          hint={
            acceptsOrders
              ? "Bestellannahme geöffnet"
              : "Bestellannahme pausiert"
          }
          icon={
            <IconWrap className="bg-emerald-50 text-emerald-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </IconWrap>
          }
        />
        <KpiCard
          label="Bestellungen"
          value={kpis.transactions}
          hint={`${kpis.cancelled} storniert · heute`}
          href="/admin/orders"
          icon={
            <IconWrap className="bg-sky-50 text-sky-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 7h15l-1.5 9h-12L6 7Zm0 0L5 4H2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </IconWrap>
          }
        />
        <KpiCard
          label="Ø Bestellung"
          value={formatMoney(avgOrder)}
          hint="Nicht stornierte Bestellungen"
          icon={
            <IconWrap className="bg-violet-50 text-violet-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 3h10v4H7V3Zm-2 4h14v14H5V7Zm4 4h6M9 15h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </IconWrap>
          }
        />
        <KpiCard
          label="Aktive Bestellungen"
          value={kpis.inProgress}
          hint={`von ${kpis.transactions} heute`}
          href="/admin/orders?status=pending"
          icon={
            <IconWrap className="bg-amber-50 text-amber-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M16 11a4 4 0 1 0-8 0M4 20a6 6 0 0 1 16 0M18 8a3 3 0 1 0 0-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </IconWrap>
          }
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          label="Neu"
          value={kpis.pending}
          hint="Warten auf Bestätigung"
          href="/admin/orders?status=pending"
          icon={
            <IconWrap className="bg-slate-100 text-slate-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </IconWrap>
          }
        />
        <KpiCard
          label="In Zubereitung"
          value={kpis.preparing + kpis.confirmed}
          hint={`${kpis.confirmed} bestätigt · ${kpis.preparing} in Küche`}
          href="/admin/orders?status=preparing"
          icon={
            <IconWrap className="bg-orange-50 text-orange-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3v3M8 6h8l1 4H7l1-4Zm-2 4h14v2a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-2Zm4 7v4m4-4v4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </IconWrap>
          }
        />
        <KpiCard
          label="Bereit"
          value={kpis.ready}
          hint="Abholbereit"
          href="/admin/orders?status=ready"
          icon={
            <IconWrap className="bg-emerald-50 text-emerald-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 7 10 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </IconWrap>
          }
        />
        <KpiCard
          label="Unterwegs"
          value={kpis.outForDelivery}
          hint="In Auslieferung"
          href="/admin/orders?status=out_for_delivery"
          icon={
            <IconWrap className="bg-blue-50 text-blue-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 7h11v10H3V7Zm11 3h4l3 3v4h-7v-7ZM6 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </IconWrap>
          }
        />
        <KpiCard
          label="Storniert"
          value={kpis.cancelled}
          hint="Heute storniert"
          href="/admin/orders?status=cancelled"
          icon={
            <IconWrap className="bg-red-50 text-red-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </IconWrap>
          }
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-5">
            <h2 className="font-sans text-2xl font-semibold tracking-tight text-ink">Bestellstatus</h2>
            <p className="mt-1 text-sm text-muted">
              {statusTotal} Bestellung{statusTotal === 1 ? "" : "en"} heute
            </p>
          </div>
          <StatusDonut total={statusTotal} segments={statusSegments} />
          <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/6 pt-4">
            {(
              [
                ["pending", kpis.pending],
                ["preparing", kpis.preparing],
                ["ready", kpis.ready],
                ["out_for_delivery", kpis.outForDelivery],
              ] as const
            ).map(([status, count]) => (
              <Link
                key={status}
                href={`/admin/orders?status=${status}`}
                className="rounded-full bg-[#f5f1eb] px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-sage/10"
              >
                {orderStatusLabels[status]} · {count}
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-5">
            <h2 className="font-sans text-2xl font-semibold tracking-tight text-ink">Zahlungsarten</h2>
            <p className="mt-1 text-sm text-muted">Umsatz heute (ohne Storno)</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#ebe6df]">
            <div className="flex h-full w-full">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${cashPct}%` }}
              />
              <div
                className="h-full bg-ink/55"
                style={{ width: `${onlinePct}%` }}
              />
            </div>
          </div>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Bar {cashPct.toFixed(0)}%
              </span>
              <span className="font-semibold tabular-nums">
                {formatMoney(kpis.cashRevenue)}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-ink/50" />
                Online {onlinePct.toFixed(0)}%
              </span>
              <span className="font-semibold tabular-nums">
                {formatMoney(kpis.onlineRevenue)}
              </span>
            </li>
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-sans text-2xl font-semibold tracking-tight text-ink">Letzte Bestellungen</h2>
            <p className="mt-1 text-sm text-muted">Die neuesten Eingänge</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-sage-deep hover:underline"
          >
            Alle anzeigen
          </Link>
        </div>
        {!recentOrders.length ? (
          <EmptyState title="Noch keine Bestellungen">
            Neue Bestellungen erscheinen hier automatisch.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-ink/8 text-xs tracking-wider text-muted uppercase">
                <tr>
                  <th className="pb-3 font-semibold">Bestellung</th>
                  <th className="pb-3 font-semibold">Kunde</th>
                  <th className="pb-3 font-semibold">Zeit</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/6">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-[#faf7f2]">
                    <td className="py-3.5 font-semibold">
                      <Link
                        className="hover:text-sage-deep hover:underline"
                        href={`/admin/orders/${order.id}`}
                      >
                        #
                        {order.order_number ?? String(order.id).slice(0, 8)}
                      </Link>
                    </td>
                    <td className="py-3.5">{order.customer_name ?? "Gast"}</td>
                    <td className="py-3.5 text-muted">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(order.status)}`}
                      >
                        {orderStatusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-semibold">
                      {formatMoney(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
