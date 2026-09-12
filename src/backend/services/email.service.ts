import "server-only";

import { Resend } from "resend";
import type { OrderStatus } from "@/backend/domain/order-status";

const STATUS_LABELS: Record<string, string> = {
  pending: "Neu",
  confirmed: "Bestätigt",
  preparing: "In Zubereitung",
  ready: "Bereit",
  out_for_delivery: "Unterwegs",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

function siteUrl() {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

function fromAddress() {
  return (
    process.env.RESEND_FROM?.trim() ||
    "Safran Romanshorn <onboarding@resend.dev>"
  );
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function money(value: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(value);
}

function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

function wrapHtml(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"/><title>${title}</title></head>
<body style="margin:0;background:#f6f3ee;font-family:Georgia,'Times New Roman',serif;color:#2f0d29;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f3ee;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#2f0d29;padding:20px 24px;color:#f6f3ee;font-size:22px;">Safran Romanshorn</td></tr>
        <tr><td style="padding:28px 24px;font-size:16px;line-height:1.55;">${body}</td></tr>
        <tr><td style="padding:0 24px 28px;font-size:13px;color:#6b5b66;line-height:1.5;">
          Bei Fragen erreichen Sie uns unter ${process.env.NEXT_PUBLIC_RESTAURANT_PHONE || "+41 71 244 55 33"}
          oder ${process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || "info@safran-solothurn.ch"}.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export type OrderEmailContext = {
  to: string;
  customerName: string;
  orderNumber: string;
  confirmationToken: string;
  fulfillmentType: "delivery" | "pickup";
  total: number;
  status: string;
};

async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — skipped:", input.subject);
    return { skipped: true as const };
  }

  const result = await resend.emails.send({
    from: fromAddress(),
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  if (result.error) {
    console.error("[email] Resend error:", result.error);
    throw new Error(result.error.message || "email_failed");
  }

  return { skipped: false as const, id: result.data?.id };
}

export async function sendOrderPlacedEmail(ctx: OrderEmailContext) {
  const trackUrl = `${siteUrl()}/bestellung/${ctx.confirmationToken}`;
  const fulfillment =
    ctx.fulfillmentType === "delivery" ? "Lieferung" : "Abholung";
  const subject = `Bestellung #${ctx.orderNumber} erhalten — Safran`;
  const text = [
    `Hallo ${ctx.customerName},`,
    ``,
    `vielen Dank für Ihre Bestellung #${ctx.orderNumber} (${fulfillment}).`,
    `Total: ${money(ctx.total)}`,
    ``,
    `Status und Fortschritt jederzeit hier verfolgen:`,
    trackUrl,
    ``,
    `Bitte speichern oder bookmarken Sie diesen Link.`,
    ``,
    `Freundliche Grüsse`,
    `Safran Romanshorn`,
  ].join("\n");

  const html = wrapHtml(
    subject,
    `
      <p>Hallo ${escapeHtml(ctx.customerName)},</p>
      <p>vielen Dank für Ihre Bestellung <strong>#${escapeHtml(ctx.orderNumber)}</strong> (${escapeHtml(fulfillment)}).</p>
      <p style="font-size:18px;margin:18px 0;"><strong>Total: ${escapeHtml(money(ctx.total))}</strong></p>
      <p>Den aktuellen Status können Sie jederzeit hier verfolgen:</p>
      <p style="margin:22px 0;">
        <a href="${escapeAttr(trackUrl)}" style="display:inline-block;background:#1a6b33;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">
          Bestellung verfolgen
        </a>
      </p>
      <p style="font-size:13px;color:#6b5b66;">Falls der Button nicht funktioniert:<br/>
        <a href="${escapeAttr(trackUrl)}" style="color:#1a6b33;word-break:break-all;">${escapeHtml(trackUrl)}</a>
      </p>
      <p>Bitte speichern oder bookmarken Sie diesen Link — so finden Sie Ihre Bestellung auch wieder, wenn Sie die Seite verlassen.</p>
      <p>Freundliche Grüsse<br/>Safran Romanshorn</p>
    `,
  );

  return sendEmail({ to: ctx.to, subject, html, text });
}

export async function sendOrderStatusEmail(
  ctx: OrderEmailContext & { status: OrderStatus | string },
) {
  const trackUrl = `${siteUrl()}/bestellung/${ctx.confirmationToken}`;
  const label = statusLabel(ctx.status);
  const subject = `Bestellung #${ctx.orderNumber}: ${label} — Safran`;
  const text = [
    `Hallo ${ctx.customerName},`,
    ``,
    `der Status Ihrer Bestellung #${ctx.orderNumber} wurde aktualisiert:`,
    label,
    ``,
    `Details und Fortschritt:`,
    trackUrl,
    ``,
    `Freundliche Grüsse`,
    `Safran Romanshorn`,
  ].join("\n");

  const html = wrapHtml(
    subject,
    `
      <p>Hallo ${escapeHtml(ctx.customerName)},</p>
      <p>der Status Ihrer Bestellung <strong>#${escapeHtml(ctx.orderNumber)}</strong> wurde aktualisiert:</p>
      <p style="font-size:20px;margin:18px 0;"><strong>${escapeHtml(label)}</strong></p>
      <p style="margin:22px 0;">
        <a href="${escapeAttr(trackUrl)}" style="display:inline-block;background:#1a6b33;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">
          Status ansehen
        </a>
      </p>
      <p style="font-size:13px;color:#6b5b66;word-break:break-all;">
        <a href="${escapeAttr(trackUrl)}" style="color:#1a6b33;">${escapeHtml(trackUrl)}</a>
      </p>
      <p>Freundliche Grüsse<br/>Safran Romanshorn</p>
    `,
  );

  return sendEmail({ to: ctx.to, subject, html, text });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value: string) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
