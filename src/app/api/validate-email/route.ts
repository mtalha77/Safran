import { NextResponse } from "next/server";
import { isAppError } from "@/backend/errors";
import { assertDeliverableEmail } from "@/backend/validation/email";
import { isValidEmailFormat } from "@/backend/validation/email-format";

export const runtime = "nodejs";

/**
 * Live email check for checkout: format + domain DNS.
 * Returns `{ ok: true }` or `{ ok: false, message }` — never blocks the storefront UX hard.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: unknown;
    } | null;
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        {
          ok: false,
          message: "Bitte geben Sie eine E-Mail-Adresse ein.",
        },
        { status: 400 },
      );
    }

    if (!isValidEmailFormat(email)) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Bitte eine gültige E-Mail-Adresse eingeben (z. B. name@domain.ch).",
        },
        { status: 400 },
      );
    }

    await assertDeliverableEmail(email);
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 400 },
      );
    }
    console.error("[validate-email]", error);
    return NextResponse.json(
      {
        ok: false,
        message: "E-Mail konnte nicht geprüft werden. Bitte erneut versuchen.",
      },
      { status: 503 },
    );
  }
}
