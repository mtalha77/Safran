import "server-only";

/** ESC/POS helpers for 80mm Epson thermal printers (TM-T20 / TM-T88). */

const ESC = 0x1b;
const GS = 0x1d;

function encode(text: string): number[] {
  // Latin-1 covers German umlauts for typical Epson code pages after ESC t 0/16.
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    bytes.push(code <= 0xff ? code : 0x3f);
  }
  return bytes;
}

function line(text = ""): number[] {
  return [...encode(text), 0x0a];
}

function center(on: boolean): number[] {
  return [ESC, 0x61, on ? 1 : 0];
}

function bold(on: boolean): number[] {
  return [ESC, 0x45, on ? 1 : 0];
}

function doubleSize(on: boolean): number[] {
  return [GS, 0x21, on ? 0x11 : 0x00];
}

function cut(): number[] {
  return [GS, 0x56, 0x41, 0x03];
}

export type ReceiptLine = {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  notes?: string | null;
};

export type ReceiptPayload = {
  restaurantName: string;
  orderNumber: string;
  createdAt: string;
  fulfillmentType: "pickup" | "delivery";
  customerName: string;
  customerPhone: string;
  customerNotes?: string | null;
  address?: string | null;
  items: ReceiptLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  paymentMethod: string;
};

function money(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(2)}`;
}

function padRow(left: string, right: string, width = 42): string {
  const space = Math.max(1, width - left.length - right.length);
  return `${left}${" ".repeat(space)}${right}`;
}

/**
 * Builds a compact kitchen/counter bill as raw ESC/POS bytes.
 */
export function buildEscPosReceipt(payload: ReceiptPayload): Uint8Array {
  const bytes: number[] = [
    ESC, 0x40, // init
    ESC, 0x74, 16, // code page 16 (WPC1252) — better for äöü
  ];

  bytes.push(...center(true), ...bold(true), ...doubleSize(true));
  bytes.push(...line(payload.restaurantName.slice(0, 20)));
  bytes.push(...doubleSize(false), ...bold(false));
  bytes.push(...line("Bestellung / Küchenbon"));
  bytes.push(...center(false));
  bytes.push(...line("-".repeat(42)));

  bytes.push(...bold(true), ...line(`#${payload.orderNumber}`), ...bold(false));
  bytes.push(...line(payload.createdAt));
  bytes.push(
    ...line(
      payload.fulfillmentType === "delivery" ? "Lieferung" : "Abholung",
    ),
  );
  bytes.push(...line("-".repeat(42)));

  for (const item of payload.items) {
    bytes.push(
      ...line(
        padRow(
          `${item.quantity}x ${item.name}`.slice(0, 28),
          money(item.lineTotal, payload.currency),
        ),
      ),
    );
    if (item.notes) bytes.push(...line(`  ${item.notes}`.slice(0, 42)));
  }

  bytes.push(...line("-".repeat(42)));
  bytes.push(
    ...line(padRow("Zwischensumme", money(payload.subtotal, payload.currency))),
  );
  if (payload.deliveryFee > 0) {
    bytes.push(
      ...line(
        padRow("Liefergebühr", money(payload.deliveryFee, payload.currency)),
      ),
    );
  }
  bytes.push(...bold(true));
  bytes.push(...line(padRow("TOTAL", money(payload.total, payload.currency))));
  bytes.push(...bold(false));
  bytes.push(...line(`Zahlung: ${payload.paymentMethod}`));
  bytes.push(...line("-".repeat(42)));

  bytes.push(...line(`Kunde: ${payload.customerName}`.slice(0, 42)));
  bytes.push(...line(`Tel: ${payload.customerPhone}`.slice(0, 42)));
  if (payload.address) bytes.push(...line(payload.address.slice(0, 42)));
  if (payload.customerNotes) {
    bytes.push(...line("Hinweis:"));
    bytes.push(...line(payload.customerNotes.slice(0, 84)));
  }

  bytes.push(...line(""), ...line(""), ...cut());
  return new Uint8Array(bytes);
}

export function receiptPayloadFromJson(value: unknown): ReceiptPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (typeof row.orderNumber !== "string" || !Array.isArray(row.items)) {
    return null;
  }
  return value as ReceiptPayload;
}
