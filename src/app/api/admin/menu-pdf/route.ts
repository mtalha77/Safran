import { NextResponse } from "next/server";
import { isAppError } from "@/backend/errors";
import {
  buildMenuPdf,
  type MenuPdfLang,
} from "@/backend/services/menu-pdf.service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const langParam = url.searchParams.get("lang");
    const preview = url.searchParams.get("preview") === "1";
    const lang: MenuPdfLang = langParam === "en" ? "en" : "de";
    const { bytes, filename } = await buildMenuPdf(lang);

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
    console.error("[menu-pdf]", error);
    const detail =
      error instanceof Error && error.message
        ? error.message
        : "PDF konnte nicht erstellt werden.";
    return NextResponse.json(
      { error: "pdf_failed", message: detail },
      { status: 500 },
    );
  }
}
