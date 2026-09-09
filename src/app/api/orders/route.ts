import { NextResponse } from "next/server";
import {
  createCashOrder,
  OrderError,
  parseOrderRequest,
} from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new OrderError(
        415,
        "unsupported_media_type",
        "Bestelldaten müssen als JSON gesendet werden.",
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new OrderError(400, "invalid_json", "Ungültige Bestelldaten.");
    }

    const orderRequest = parseOrderRequest(
      body,
      request.headers.get("Idempotency-Key"),
    );
    const order = await createCashOrder(orderRequest);

    return NextResponse.json(order, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const known =
      error instanceof OrderError
        ? error
        : new OrderError(
            503,
            "ordering_unavailable",
            "Bestellungen sind vorübergehend nicht verfügbar.",
          );

    return NextResponse.json(
      { error: known.code, message: known.message },
      {
        status: known.status,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
