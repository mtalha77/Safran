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

function KpiCard({
  label,
  value,
  hint,
  href,
  tone,
}: {
  label: string;
  value: ReactNode;
  hint: string;
  href?: string;
  tone?: "default" | "warn" | "ok" | "danger";
}) {
  const ring =
    tone === "warn"
      ? "ring-1 ring-amber-300"
      : tone === "ok"
        ? "ring-1 ring-emerald-300"
        : tone === "danger"
          ? "ring-1 ring-red-200"
          : "";

  const body = (
    <Card className={`h-full ${ring}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-2 font-serif text-4xl tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </Card>
  );

  if (!href) return body;
  return (
    <Link href={href} className="block transition hover:-translate-y-0.5">
      {body}
    </Link>
  );
}

export default async function AdminOverviewPage({ searchParams }: OverviewProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;

  const { acceptsOrders, orders: recentOrders, kpis, error } =
    await getBackOfficeOverview();

  return (
    <>
      <PageHeader
        eyebrow="Restaurantbetrieb"
        title="Guten Tag"
        description="Bestellungen, Umsatz und Status auf einen Blick."
        action={
          <Link href="/admin/orders" className={secondaryButtonClass}>
            Alle Bestellungen
          </Link>
        }
      />
      <Notice message={params.message} error={params.error ?? error ?? undefined} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Onlinezahlung"
          value={formatMoney(kpis.onlineRevenue)}
          hint={
            kpis.onlineCount === 1
              ? "1 Online-Transaktion heute"
              : `${kpis.onlineCount} Online-Transaktionen heute`
          }
        />
        <KpiCard
          label="Barzahlung"
          value={formatMoney(kpis.cashRevenue)}
          hint={
            kpis.cashCount === 1
              ? "1 Barzahlung heute"
              : `${kpis.cashCount} Barzahlungen heute`
          }
        />
        <Card
          className={
            acceptsOrders ? "ring-1 ring-emerald-300" : "ring-1 ring-amber-300"
          }
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                Bestellannahme
              </p>
              <p className="mt-2 font-serif text-2xl">
                {acceptsOrders ? "Geöffnet" : "Pausiert"}
              </p>
            </div>
            <span
              className={`mt-1 h-3 w-3 rounded-full ${
                acceptsOrders ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </div>
          <p className="mt-4 text-sm text-muted">
            Über den Schalter oben rechts schliessen Sie den Shop für die Website
            und die Kasse.
          </p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Neu"
          value={kpis.pending}
          hint="Warten auf Bestätigung"
          href="/admin/orders?status=pending"
          tone={kpis.pending > 0 ? "warn" : "default"}
        />
        <KpiCard
          label="In Zubereitung"
          value={kpis.preparing}
          hint="In der Küche"
          href="/admin/orders?status=preparing"
        />
        <KpiCard
          label="Bereit"
          value={kpis.ready}
          hint="Abholbereit"
          href="/admin/orders?status=ready"
        />
        <KpiCard
          label="Unterwegs"
          value={kpis.outForDelivery}
          hint="In Auslieferung"
          href="/admin/orders?status=out_for_delivery"
        />
        <KpiCard
          label="Abgeschlossen"
          value={kpis.completed}
          hint="Heute geliefert / abgeholt"
          href="/admin/orders?status=completed"
          tone="ok"
        />
        <KpiCard
          label="Storniert"
          value={kpis.cancelled}
          hint="Heute storniert"
          href="/admin/orders?status=cancelled"
          tone={kpis.cancelled > 0 ? "danger" : "default"}
        />
      </div>

      {kpis.inProgress > 0 ? (
        <p className="mt-3 text-sm text-muted">
          {kpis.inProgress} Bestellung{kpis.inProgress === 1 ? "" : "en"} heute
          noch aktiv
          {kpis.confirmed > 0
            ? ` · davon ${kpis.confirmed} bestätigt, noch nicht in Zubereitung`
            : null}
          .
        </p>
      ) : null}

      <Card className="mt-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl">Letzte Bestellungen</h2>
            <p className="mt-1 text-sm text-muted">Die sechs neuesten Eingänge</p>
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
              <thead className="border-b border-sage/15 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="pb-3">Nummer</th>
                  <th className="pb-3">Kunde</th>
                  <th className="pb-3">Zeit</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 font-semibold">
                      <Link
                        className="hover:text-sage-deep hover:underline"
                        href={`/admin/orders/${order.id}`}
                      >
                        #
                        {order.order_number ?? String(order.id).slice(0, 8)}
                      </Link>
                    </td>
                    <td className="py-4">{order.customer_name ?? "Gast"}</td>
                    <td className="py-4 text-muted">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(order.status)}`}
                      >
                        {orderStatusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right font-semibold">
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
