import { NextResponse } from "next/server";
import { processPrintQueue } from "@/backend/services/print.service";

/**
 * Drains due print jobs (pending + retryable failures).
 * Protect with PRINT_WORKER_SECRET and call from cron / external scheduler.
 *
 * Example: GET /api/print/process?limit=20
 * Header: Authorization: Bearer <PRINT_WORKER_SECRET>
 */
export async function GET(request: Request) {
  const secret = process.env.PRINT_WORKER_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "PRINT_WORKER_SECRET is not configured." },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (token !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? "15");

  try {
    const result = await processPrintQueue({
      limit: Number.isFinite(limit) ? limit : 15,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Print queue processing failed",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
