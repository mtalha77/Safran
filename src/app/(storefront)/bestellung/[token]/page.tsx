import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByToken } from "@/backend/services/order.service";
import { OrderStatusLive } from "@/components/order-status-live";

export const metadata: Metadata = {
  title: "Bestellstatus",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatCurrency(value: unknown) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(Number(value));
}

type OrderItem = {
  name: string;
  quantity: number;
  line_total: number;
};

type StatusEvent = {
  to_status: string;
  note?: string | null;
  created_at: string;
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();

  const items = (order.order_items ?? []) as OrderItem[];
  const events = [...((order.order_status_events ?? []) as StatusEvent[])]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    .map((event) => ({
      toStatus: event.to_status,
      note: event.note ?? null,
      createdAt: event.created_at,
    }));

  return (
    <section className="bg-paper px-4 pt-28 pb-10 sm:px-6 sm:pt-32 sm:pb-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-sage uppercase">
                Bestellung {order.order_number}
              </p>
              <h1 className="mt-1 font-serif text-2xl text-ink sm:text-3xl lg:text-[2rem] lg:leading-tight">
                Vielen Dank für Ihre Bestellung
              </h1>
            </div>
            <Link
              href="/speisekarte"
              className="inline-flex shrink-0 rounded-full bg-sage px-4 py-2 text-xs font-semibold text-white transition hover:bg-sage-dark"
            >
              Zur Speisekarte
            </Link>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-6">
            <OrderStatusLive
              token={token}
              initialStatus={order.status}
              initialEvents={events}
              fulfillmentType={order.fulfillment_type}
              orderNumber={order.order_number}
            />

            <aside className="space-y-4">
              <div className="rounded-xl border border-ink/10 bg-paper/60 p-4">
                <h2 className="font-serif text-xl text-ink">Zusammenfassung</h2>
                <ul className="mt-2 divide-y divide-ink/10">
                  {items.map((item, index) => (
                    <li
                      key={`${item.name}-${index}`}
                      className="flex justify-between gap-3 py-2 text-sm"
                    >
                      <span className="min-w-0">
                        {item.quantity} × {item.name}
                      </span>
                      <span className="shrink-0 tabular-nums">
                        {formatCurrency(item.line_total)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex justify-between border-t border-ink/15 pt-3 text-sm font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-muted">
                  Zahlung bar bei{" "}
                  {order.fulfillment_type === "delivery"
                    ? "Lieferung"
                    : "Abholung"}
                  .
                </p>
              </div>

              <p className="rounded-xl border border-ink/10 px-4 py-3 text-xs leading-5 text-muted">
                Status aktualisiert sich automatisch. Speichern Sie diesen Link,
                um später wieder hereinzuschauen.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
