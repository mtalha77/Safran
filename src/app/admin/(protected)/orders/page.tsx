import Link from "next/link";
import { formatDate, formatMoney, getAdminContext, orderStatusLabels, statusClass } from "@/components/admin/data";
import { Card, EmptyState, Notice, PageHeader, buttonClass, fieldClass, secondaryButtonClass } from "@/components/admin/ui";
import type { OrderStatus } from "@/types/database";

type OrdersPageProps = {
  searchParams: Promise<{ status?: string; q?: string; message?: string; error?: string; page?: string }>;
};

const PAGE_SIZE = 30;

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;
  const page = Math.max(1, Number(params.page) || 1);
  const from = (page - 1) * PAGE_SIZE;

  let query = context.supabase
    .from("orders")
    .select("id, order_number, customer_name, fulfillment_type, total, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (params.status) query = query.eq("status", params.status as OrderStatus);
  if (params.q) {
    const safeQuery = params.q.replace(/[%_,()]/g, "");
    const number = Number(safeQuery);
    query = query.or(
      Number.isInteger(number)
        ? `customer_name.ilike.%${safeQuery}%,order_number.eq.${number}`
        : `customer_name.ilike.%${safeQuery}%`,
    );
  }

  const { data: orders, count, error } = await query;
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <>
      <PageHeader
        eyebrow="Bestellmanagement"
        title="Bestellungen"
        description={`${count ?? 0} Bestellungen gefunden. Öffne einen Eintrag für Details und Statuswechsel.`}
      />
      <Notice message={params.message} error={params.error ?? error?.message} />

      <Card className="mb-5">
        <form className="grid gap-3 sm:grid-cols-[1fr_220px_auto]" method="get">
          <label className="text-sm font-semibold">
            Suche
            <input className={`${fieldClass} mt-1.5`} name="q" defaultValue={params.q} placeholder="Name oder Bestellnummer" />
          </label>
          <label className="text-sm font-semibold">
            Status
            <select className={`${fieldClass} mt-1.5`} name="status" defaultValue={params.status}>
              <option value="">Alle Status</option>
              {Object.entries(orderStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button className={buttonClass}>Filtern</button>
            <Link className={secondaryButtonClass} href="/admin/orders">Zurücksetzen</Link>
          </div>
        </form>
      </Card>

      <Card>
        {!orders?.length ? (
          <EmptyState title="Keine Bestellungen gefunden">Passe die Filter an oder warte auf eine neue Bestellung.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-sage/15 text-xs uppercase tracking-wider text-muted">
                <tr><th className="pb-3">Bestellung</th><th className="pb-3">Kunde</th><th className="pb-3">Art</th><th className="pb-3">Eingang</th><th className="pb-3">Status</th><th className="pb-3 text-right">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {orders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-cream/35">
                    <td className="py-4 font-semibold"><Link href={`/admin/orders/${order.id}`} className="hover:text-sage-deep hover:underline">#{order.order_number ?? String(order.id).slice(0, 8)}</Link></td>
                    <td className="py-4">{order.customer_name ?? "Gast"}</td>
                    <td className="py-4 text-muted">{order.fulfillment_type === "delivery" ? "Lieferung" : "Abholung"}</td>
                    <td className="py-4 text-muted">{formatDate(order.created_at)}</td>
                    <td className="py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(order.status)}`}>{orderStatusLabels[order.status] ?? order.status}</span></td>
                    <td className="py-4 text-right font-semibold">{formatMoney(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 ? (
          <nav className="mt-5 flex items-center justify-between border-t border-sage/15 pt-4 text-sm" aria-label="Seitennavigation">
            <Link
              aria-disabled={page <= 1}
              className={`${secondaryButtonClass} ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
              href={{ pathname: "/admin/orders", query: { ...params, page: page - 1 } }}
            >Zurück</Link>
            <span className="text-muted">Seite {page} von {pages}</span>
            <Link
              aria-disabled={page >= pages}
              className={`${secondaryButtonClass} ${page >= pages ? "pointer-events-none opacity-40" : ""}`}
              href={{ pathname: "/admin/orders", query: { ...params, page: page + 1 } }}
            >Weiter</Link>
          </nav>
        ) : null}
      </Card>
    </>
  );
}
