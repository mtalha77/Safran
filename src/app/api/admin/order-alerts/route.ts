import { NextResponse } from "next/server";
import { isAppError } from "@/backend/errors";
import { getLatestOrderForAlert } from "@/backend/services/order.service";
import { getOrderAlertConfig } from "@/backend/services/settings.service";

export const runtime = "nodejs";

/** Kitchen poller: alert config + newest order id. */
export async function GET() {
  try {
    const [config, latest] = await Promise.all([
      getOrderAlertConfig(),
      getLatestOrderForAlert(),
    ]);
    return NextResponse.json(
      {
        enabled: config.enabled,
        soundUrl: config.soundUrl,
        latestOrderId: latest?.id ?? null,
        latestOrderNumber: latest?.orderNumber ?? null,
        latestCreatedAt: latest?.createdAt ?? null,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status },
      );
    }
    console.error("[order-alerts]", error);
    return NextResponse.json(
      { error: "order_alerts_failed", message: "Alert-Status konnte nicht geladen werden." },
      { status: 500 },
    );
  }
}
