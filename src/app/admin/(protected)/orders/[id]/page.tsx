import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { getOrderForBackOffice } from "@/backend/services/order.service";
import {
  formatDate,
  formatMoney,
  getAdminContext,
  orderStatusLabels,
  statusActionLabels,
  statusClass,
} from "@/components/admin/data";
import { Card, Notice, PageHeader, secondaryButtonClass } from "@/components/admin/ui";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";

type OrderDetailProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
};

export default async function OrderDetailPage({ params, searchParams }: OrderDetailProps) {
  const [{ id }, query, context] = await Promise.all([params, searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;

  // Which buttons appear comes from the shared lifecycle rules, and the same
  // rules are re-checked in the service when the form is submitted.
  const { order, items, transitions, error } = await getOrderForBackOffice(id);
  if (!order && !error) notFound();

  const addressData = order?.delivery_address;
  const address = addressData && typeof addressData === "object" && !Array.isArray(addressData)
    ? Object.values(addressData).filter((value) => typeof value === "string").join(", ")
    : "";

  return (
    <>
      <PageHeader
        eyebrow="Bestelldetails"
        title={`Bestellung #${order?.order_number ?? id.slice(0, 8)}`}
        description={`Eingegangen am ${formatDate(order?.created_at)}`}
        action={<Link href="/admin/orders" className={secondaryButtonClass}>← Zur Liste</Link>}
      />
      <Notice message={query.message} error={query.error ?? error ?? undefined} />

      {order ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Aktueller Status</p>
                  <span className={`mt-2 inline-block rounded-full px-3 py-1.5 text-sm font-semibold ${statusClass(order.status)}`}>
                    {orderStatusLabels[order.status] ?? order.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {transitions.map((status) => (
                    <form action={updateOrderStatusAction} key={status}>
                      <input type="hidden" name="id" value={order.id} />
                      <input type="hidden" name="status" value={status} />
                      <PendingSubmitButton
                        variant={status === "cancelled" ? "danger" : "primary"}
                        pendingLabel="Wird aktualisiert…"
                      >
                        {statusActionLabels[status] ?? orderStatusLabels[status] ?? status}
                      </PendingSubmitButton>
                    </form>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="font-serif text-2xl">Positionen</h2>
              <div className="mt-4 divide-y divide-sage/15">
                {items.map((item) => (
                  <div key={String(item.id)} className="grid grid-cols-[auto_1fr_auto] gap-3 py-4 text-sm">
                    <span className="font-bold text-sage-deep">{item.quantity}×</span>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      {item.notes ? <p className="mt-1 text-xs text-muted">{item.notes}</p> : null}
                    </div>
                    <span className="font-semibold">{formatMoney(item.line_total)}</span>
                  </div>
                ))}
              </div>
              <dl className="ml-auto mt-4 max-w-xs space-y-2 border-t border-sage/20 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Zwischensumme</dt><dd>{formatMoney(order.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Liefergebühr</dt><dd>{formatMoney(order.delivery_fee)}</dd></div>
                <div className="flex justify-between text-lg font-bold"><dt>Total</dt><dd>{formatMoney(order.total)}</dd></div>
              </dl>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <h2 className="font-serif text-xl">Kundendaten</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div><dt className="text-xs uppercase tracking-wider text-muted">Name</dt><dd className="mt-1 font-semibold">{order.customer_name ?? "–"}</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-muted">E-Mail</dt><dd className="mt-1 break-all">{order.customer_email ?? "–"}</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-muted">Telefon</dt><dd className="mt-1">{order.customer_phone ?? "–"}</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-muted">Bestellart</dt><dd className="mt-1">{order.fulfillment_type === "delivery" ? "Lieferung" : "Abholung"}</dd></div>
                {address ? <div><dt className="text-xs uppercase tracking-wider text-muted">Adresse</dt><dd className="mt-1">{address}</dd></div> : null}
                {order.customer_notes ? <div><dt className="text-xs uppercase tracking-wider text-muted">Hinweis</dt><dd className="mt-1 rounded-xl bg-cream/60 p-3">{order.customer_notes}</dd></div> : null}
              </dl>
            </Card>
            <Card>
              <h2 className="font-serif text-xl">Zahlung</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Methode</dt><dd className="font-semibold">{order.payment_method ?? "cash"}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Status</dt><dd className="font-semibold">{order.payment_status ?? "Offen"}</dd></div>
              </dl>
            </Card>
          </div>
        </div>
      ) : null}
    </>
  );
}
