import Link from "next/link";
import { setStoreOpenAction } from "@/app/admin/actions";
import { formatDate, formatMoney, getAdminContext, orderStatusLabels, statusClass } from "@/components/admin/data";
import { Card, EmptyState, Notice, PageHeader, buttonClass, secondaryButtonClass } from "@/components/admin/ui";

type OverviewProps = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

export default async function AdminOverviewPage({ searchParams }: OverviewProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [
    { data: settings, error: settingsError },
    { data: recentOrders, error: ordersError },
    { count: todayCount },
  ] = await Promise.all([
    context.supabase.from("store_availability").select("accepts_orders").eq("id", true).maybeSingle(),
    context.supabase
      .from("orders")
      .select("id, order_number, customer_name, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    context.supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", today.toISOString()),
  ]);

  const openOrders = recentOrders?.filter((order) =>
    ["pending", "confirmed", "preparing", "ready"].includes(order.status),
  ).length ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Restaurantbetrieb"
        title="Guten Tag"
        description="Bestellungen, Verfügbarkeit und Restaurantstatus auf einen Blick."
        action={<Link href="/admin/orders" className={secondaryButtonClass}>Alle Bestellungen</Link>}
      />
      <Notice
        message={params.message}
        error={params.error ?? settingsError?.message ?? ordersError?.message}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Heute</p>
          <p className="mt-2 font-serif text-4xl">{todayCount ?? 0}</p>
          <p className="mt-1 text-sm text-muted">Bestellungen seit Mitternacht</p>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">In Bearbeitung</p>
          <p className="mt-2 font-serif text-4xl">{openOrders}</p>
          <p className="mt-1 text-sm text-muted">unter den letzten Bestellungen</p>
        </Card>
        <Card className={settings?.accepts_orders ? "ring-1 ring-emerald-300" : "ring-1 ring-amber-300"}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Bestellannahme</p>
              <p className="mt-2 font-serif text-2xl">{settings?.accepts_orders ? "Geöffnet" : "Pausiert"}</p>
            </div>
            <span className={`mt-1 h-3 w-3 rounded-full ${settings?.accepts_orders ? "bg-emerald-500" : "bg-amber-500"}`} />
          </div>
          <form action={setStoreOpenAction} className="mt-4">
            <input type="hidden" name="is_open" value={settings?.accepts_orders ? "false" : "true"} />
            <button className={buttonClass}>
              {settings?.accepts_orders ? "Bestellungen pausieren" : "Bestellungen öffnen"}
            </button>
          </form>
        </Card>
      </div>

      <Card className="mt-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl">Letzte Bestellungen</h2>
            <p className="mt-1 text-sm text-muted">Die sechs neuesten Eingänge</p>
          </div>
          <Link href="/admin/orders" className="text-sm font-semibold text-sage-deep hover:underline">Alle anzeigen</Link>
        </div>
        {!recentOrders?.length ? (
          <EmptyState title="Noch keine Bestellungen">Neue Bestellungen erscheinen hier automatisch.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-sage/15 text-xs uppercase tracking-wider text-muted">
                <tr><th className="pb-3">Nummer</th><th className="pb-3">Kunde</th><th className="pb-3">Zeit</th><th className="pb-3">Status</th><th className="pb-3 text-right">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 font-semibold"><Link className="hover:text-sage-deep hover:underline" href={`/admin/orders/${order.id}`}>#{order.order_number ?? String(order.id).slice(0, 8)}</Link></td>
                    <td className="py-4">{order.customer_name ?? "Gast"}</td>
                    <td className="py-4 text-muted">{formatDate(order.created_at)}</td>
                    <td className="py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(order.status)}`}>{orderStatusLabels[order.status] ?? order.status}</span></td>
                    <td className="py-4 text-right font-semibold">{formatMoney(order.total)}</td>
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
