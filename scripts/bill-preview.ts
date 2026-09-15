/**
 * Throwaway preview: writes sample bills to public/ so they can be rendered in
 * the browser. Run with: npx tsx scripts/bill-preview.ts
 */
import { writeFile } from "node:fs/promises";
import Module from "node:module";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import type { ReceiptPayload } from "../src/backend/printing/bill-pdf";

const resolveFilename = (
  Module as unknown as { _resolveFilename: (...args: unknown[]) => string }
)._resolveFilename;
(
  Module as unknown as { _resolveFilename: (...args: unknown[]) => string }
)._resolveFilename = function (request: unknown, ...rest: unknown[]) {
  if (request === "server-only") {
    return path.join(process.cwd(), "scripts", "empty-module.cjs");
  }
  return resolveFilename.call(this, request, ...rest);
} as never;

function payload(
  itemCount: number,
  fulfillmentType: "delivery" | "pickup",
): ReceiptPayload {
  const items = Array.from({ length: itemCount }, (_, index) => ({
    name: `Gemuese Pakora / Vegetable Pakora ${index + 1}`,
    quantity: (index % 3) + 1,
    unitPrice: 8.5,
    lineTotal: 8.5 * ((index % 3) + 1),
    notes: index === 1 ? "extra spicy, no coriander" : null,
  }));

  return {
    restaurantName: "Safran",
    orderNumber: "0915-5900",
    createdAt: "15 Sept 2026, 21:35",
    fulfillmentType,
    customerName: "Muhammad Saim",
    customerPhone: "+41 79 123 45 67",
    customerEmail: "saim@bpobrigade.com",
    customerNotes: "Ring the top bell, gate code 1234.",
    address:
      "Johar Town 980-d block Lahore, punjab pakistan, https://maps.app.goo.gl/j7wwbvofjmApMQnM7",
    addressLine1: "Hafenstrasse 31",
    addressLine2: "https://maps.app.goo.gl/j7wwbvofjmApMQnM7",
    postalCode: "8590",
    city: "Romanshorn",
    items,
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
    deliveryFee: fulfillmentType === "delivery" ? 5 : 0,
    total:
      items.reduce((sum, item) => sum + item.lineTotal, 0) +
      (fulfillmentType === "delivery" ? 5 : 0),
    currency: "CHF",
    paymentMethod: "cash",
  };
}

async function main() {
  const { buildBillPdf } = await import("../src/backend/printing/bill-pdf");

  for (const [name, items, type] of [
    ["_bill-delivery.pdf", 6, "delivery"],
    ["_bill-pickup.pdf", 4, "pickup"],
    ["_bill-long.pdf", 30, "delivery"],
  ] as Array<[string, number, "delivery" | "pickup"]>) {
    const bytes = await buildBillPdf(payload(items, type));
    const doc = await PDFDocument.load(bytes);
    await writeFile(path.join(process.cwd(), "public", name), bytes);
    console.log(`${name}: pages=${doc.getPageCount()} bytes=${bytes.byteLength}`);
  }
}

void main();
