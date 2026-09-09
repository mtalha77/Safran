import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByToken } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Bestellstatus",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  received: "Bestellung eingegangen",
  confirmed: "Bestellung bestätigt",
  preparing: "Wird zubereitet",
  ready: "Bereit",
  out_for_delivery: "Unterwegs",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

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
  const events = [...((order.order_status_events ?? []) as StatusEvent[])].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return (
    <section className="bg-paper px-5 pt-40 pb-24 sm:px-8 sm:pt-44 sm:pb-32">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-semibold tracking-[0.24em] text-sage uppercase">
            Bestellung {order.order_number}
          </p>
          <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">
            Vielen Dank für Ihre Bestellung
          </h1>
          <div className="mt-6 rounded-2xl bg-sage/10 p-5">
            <p className="text-xs font-semibold tracking-wider text-sage uppercase">
              Aktueller Status
            </p>
            <p className="mt-1 font-serif text-2xl text-ink">
              {statusLabels[order.status] ?? order.status}
            </p>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl text-ink">Zusammenfassung</h2>
              <ul className="mt-4 divide-y divide-ink/10">
                {items.map((item, index) => (
                  <li
                    key={`${item.name}-${index}`}
                    className="flex justify-between gap-4 py-3 text-sm"
                  >
                    <span>
                      {item.quantity} × {item.name}
                    </span>
                    <span>{formatCurrency(item.line_total)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-ink/15 pt-4 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <p className="mt-2 text-xs text-muted">
                Zahlung bar bei{" "}
                {order.fulfillment_type === "delivery"
                  ? "Lieferung"
                  : "Abholung"}
                .
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-ink">Verlauf</h2>
              {events.length ? (
                <ol className="mt-4 space-y-4">
                  {events.map((event, index) => (
                    <li key={`${event.created_at}-${index}`} className="text-sm">
                      <p className="font-semibold text-ink">
                        {event.note ||
                          statusLabels[event.to_status] ||
                          event.to_status}
                      </p>
                      <time className="mt-1 block text-xs text-muted">
                        {new Intl.DateTimeFormat("de-CH", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(event.created_at))}
                      </time>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-sm text-muted">
                  Die Bestellung ist bei uns eingegangen.
                </p>
              )}
            </div>
          </div>

          <p className="mt-8 rounded-2xl border border-ink/10 p-4 text-sm leading-6 text-muted">
            Speichern Sie diese Seite, um den aktuellen Bestellstatus später
            erneut aufzurufen.
          </p>
          <Link
            href="/speisekarte"
            className="mt-6 inline-flex rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-dark"
          >
            Zurück zur Speisekarte
          </Link>
        </div>
      </div>
    </section>
  );
}
