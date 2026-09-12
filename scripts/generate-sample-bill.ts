import { writeFileSync } from "node:fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function main() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const left = 48;
  let y = 790;
  const muted = rgb(0.35, 0.35, 0.35);
  const ink = rgb(0.1, 0.1, 0.1);

  const write = (
    text: string,
    size: number,
    options?: { bold?: boolean; color?: ReturnType<typeof rgb>; x?: number },
  ) => {
    page.drawText(text, {
      x: options?.x ?? left,
      y,
      size,
      font: options?.bold ? bold : font,
      color: options?.color ?? ink,
    });
  };

  write("Safran", 18, { bold: true });
  y -= 22;
  write("Bestellung / Kuechenbon", 11, { color: muted });
  y -= 28;
  write("#0912-A1B2", 16, { bold: true });
  y -= 18;
  write("12.09.2026, 03:50", 10, { color: muted });
  y -= 14;
  write("Lieferung", 11, { bold: true });
  y -= 20;
  page.drawLine({
    start: { x: left, y },
    end: { x: 547, y },
    thickness: 1,
    color: rgb(0.75, 0.75, 0.75),
  });
  y -= 22;
  write("2x  Doener", 11, { bold: true });
  write("CHF 24.00", 11, { bold: true, x: 470 });
  y -= 20;
  write("1x  Ayran", 11, { bold: true });
  write("CHF 3.50", 11, { bold: true, x: 470 });
  y -= 24;
  page.drawLine({
    start: { x: left, y },
    end: { x: 547, y },
    thickness: 1,
    color: rgb(0.75, 0.75, 0.75),
  });
  y -= 20;
  write("Zwischensumme: CHF 27.50", 11);
  y -= 16;
  write("Liefergebuehr: CHF 3.00", 11);
  y -= 16;
  write("TOTAL: CHF 30.50", 14, { bold: true });
  y -= 16;
  write("Zahlung: cash", 10, { color: muted });
  y -= 24;
  write("Kunde: Max Muster", 11);
  y -= 16;
  write("Tel: +41 79 000 00 00", 11);
  y -= 16;
  write("Bahnhofstrasse 1, 8280 Kreuzlingen", 10, { color: muted });
  y -= 16;
  write("Hinweis: Bitte klingeln", 10, { color: muted });

  const pdf = await doc.save();
  writeFileSync("public/brand/sample-order-bill.pdf", pdf);
  console.log("wrote public/brand/sample-order-bill.pdf", pdf.byteLength);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
