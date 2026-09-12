import { NextResponse } from "next/server";
import { isAppError } from "@/backend/errors";
import { buildOrderBillPdf } from "@/backend/services/print.service";
import { isUuid } from "@/backend/validation/primitives";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** Same A4 PDF that PrintNode sends to Brother — preview or download. */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!isUuid(id)) {
      return NextResponse.json(
        { error: "order_not_found", message: "Bestellung wurde nicht gefunden." },
        { status: 404 },
      );
    }

    const preview = new URL(request.url).searchParams.get("preview") === "1";
    const { bytes, filename } = await buildOrderBillPdf(id);

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": preview
          ? `inline; filename="${filename}"`
          : `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status },
      );
    }
    console.error("[order-bill-pdf]", error);
    return NextResponse.json(
      {
        error: "pdf_failed",
        message:
          error instanceof Error
            ? error.message
            : "Rechnung-PDF konnte nicht erstellt werden.",
      },
      { status: 500 },
    );
  }
}
