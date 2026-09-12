import "server-only";

/** Shared bill content for Brother A4 PDF printing. */

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
  customerEmail?: string | null;
  customerNotes?: string | null;
  address?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  items: ReceiptLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  paymentMethod: string;
};

export function receiptPayloadFromJson(value: unknown): ReceiptPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (typeof row.orderNumber !== "string" || !Array.isArray(row.items)) {
    return null;
  }
  return value as ReceiptPayload;
}

function money(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(2)}`;
}

/** Standard PDF fonts only support WinAnsi — map common DE/CH characters. */
function pdfSafe(text: string) {
  return text
    .replaceAll("×", "x")
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("Ä", "Ae")
    .replaceAll("Ö", "Oe")
    .replaceAll("Ü", "Ue")
    .replaceAll("ß", "ss")
    .replaceAll("€", "EUR")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
}

/**
 * Builds a simple A4 kitchen/counter bill PDF for Brother laser printers.
 */
export async function buildBillPdf(payload: ReceiptPayload): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28;
  const left = 48;
  let y = 790;
  const ink = rgb(0.1, 0.1, 0.1);
  const muted = rgb(0.35, 0.35, 0.35);

  const write = (
    text: string,
    size: number,
    options?: { bold?: boolean; color?: ReturnType<typeof rgb>; x?: number },
  ) => {
    page.drawText(pdfSafe(text), {
      x: options?.x ?? left,
      y,
      size,
      font: options?.bold ? bold : font,
      color: options?.color ?? ink,
    });
  };

  const writeCentered = (
    text: string,
    size: number,
    options?: { bold?: boolean; color?: ReturnType<typeof rgb> },
  ) => {
    const safe = pdfSafe(text);
    const usedFont = options?.bold ? bold : font;
    const width = usedFont.widthOfTextAtSize(safe, size);
    page.drawText(safe, {
      x: (pageWidth - width) / 2,
      y,
      size,
      font: usedFont,
      color: options?.color ?? ink,
    });
  };

  // Top banner: fulfillment type — large, bold, centered for kitchen.
  const fulfillmentLabel =
    payload.fulfillmentType === "delivery" ? "LIEFERUNG" : "ABHOLUNG";
  writeCentered(fulfillmentLabel, 28, { bold: true });
  y -= 36;

  write(payload.restaurantName, 16, { bold: true });
  y -= 20;
  write("Bestellung / Kuechenbon", 11, { color: muted });
  y -= 24;
  write(`#${payload.orderNumber}`, 16, { bold: true });
  y -= 18;
  write(payload.createdAt, 10, { color: muted });
  y -= 18;
  page.drawLine({
    start: { x: left, y },
    end: { x: 547, y },
    thickness: 1,
    color: rgb(0.75, 0.75, 0.75),
  });
  y -= 22;

  for (const item of payload.items) {
    write(`${item.quantity}×  ${item.name}`.slice(0, 55), 11, { bold: true });
    write(money(item.lineTotal, payload.currency), 11, {
      bold: true,
      x: 470,
    });
    y -= 16;
    if (item.notes) {
      write(item.notes.slice(0, 70), 9, { color: muted });
      y -= 14;
    }
    y -= 4;
    if (y < 120) break;
  }

  y -= 8;
  page.drawLine({
    start: { x: left, y },
    end: { x: 547, y },
    thickness: 1,
    color: rgb(0.75, 0.75, 0.75),
  });
  y -= 20;
  write(`Zwischensumme: ${money(payload.subtotal, payload.currency)}`, 11);
  y -= 16;
  if (payload.deliveryFee > 0) {
    write(`Liefergebühr: ${money(payload.deliveryFee, payload.currency)}`, 11);
    y -= 16;
  }
  write(`TOTAL: ${money(payload.total, payload.currency)}`, 14, { bold: true });
  y -= 16;
  write(`Zahlung: ${payload.paymentMethod}`, 10, { color: muted });
  y -= 22;

  page.drawLine({
    start: { x: left, y },
    end: { x: 547, y },
    thickness: 1,
    color: rgb(0.75, 0.75, 0.75),
  });
  y -= 22;

  write("KUNDENDATEN", 12, { bold: true });
  y -= 18;
  write(`Name: ${payload.customerName}`, 11);
  y -= 15;
  write(`Tel: ${payload.customerPhone}`, 11);
  y -= 15;
  if (payload.customerEmail) {
    write(`E-Mail: ${payload.customerEmail}`.slice(0, 70), 11);
    y -= 15;
  }

  if (payload.fulfillmentType === "delivery") {
    y -= 6;
    write("LIEFERADRESSE", 12, { bold: true });
    y -= 18;

    const street =
      payload.addressLine1?.trim() ||
      (payload.address ? payload.address.split(",")[0]?.trim() : "");
    const line2 = payload.addressLine2?.trim();
    const cityLine = [payload.postalCode, payload.city]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (street) {
      write(street.slice(0, 70), 11);
      y -= 15;
    }
    if (line2) {
      write(line2.slice(0, 70), 11);
      y -= 15;
    }
    if (cityLine) {
      write(cityLine.slice(0, 70), 11);
      y -= 15;
    } else if (payload.address && !street) {
      write(payload.address.slice(0, 70), 11);
      y -= 15;
    }
    if (!street && !line2 && !cityLine && !payload.address) {
      write("Keine Adresse hinterlegt", 11, { color: muted });
      y -= 15;
    }
  } else {
    y -= 6;
    write("ABHOLUNG", 12, { bold: true });
    y -= 18;
    write("Kunde holt die Bestellung ab", 11, { color: muted });
    y -= 15;
  }

  if (payload.customerNotes) {
    y -= 6;
    write("HINWEIS", 12, { bold: true });
    y -= 18;
    write(payload.customerNotes.slice(0, 90), 11);
  }

  return doc.save();
}
