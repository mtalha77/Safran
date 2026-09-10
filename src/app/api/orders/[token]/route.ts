import { NextResponse } from "next/server";
import { getOrderByToken } from "@/backend/services/order.service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ token: string }>;
};

/**
 * Public, token-gated status feed for the confirmation page. The token is the
 * capability — nothing else is exposed beyond what that page already shows.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  const order = await getOrderByToken(token);

  if (!order) {
    return NextResponse.json(
      { error: "order_not_found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  const events = Array.isArray(order.order_status_events)
    ? [...order.order_status_events].sort(
        (a, b) =>
          new Date(String(a.created_at)).getTime() -
          new Date(String(b.created_at)).getTime(),
      )
    : [];

  return NextResponse.json(
    {
      orderNumber: order.order_number,
      status: order.status,
      fulfillmentType: order.fulfillment_type,
      events: events.map((event) => ({
        toStatus: event.to_status,
        note: event.note ?? null,
        createdAt: event.created_at,
      })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
