import "dotenv/config";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function main() {
  const apiKey = process.env.PRINTNODE_API_KEY?.trim();
  const printerId = Number(process.env.PRINTNODE_PRINTER_ID);
  const provider = process.env.PRINTER_PROVIDER;

  console.log("provider", provider);
  console.log("printerId", printerId);
  console.log("apiKey set", Boolean(apiKey));

  if (!apiKey || !printerId) {
    throw new Error("Missing PRINTNODE_API_KEY or PRINTNODE_PRINTER_ID");
  }

  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  page.drawText("Safran test print", { x: 48, y: 780, size: 18, font, color: rgb(0, 0, 0) });
  page.drawText("If you see this, PrintNode + Brother works.", {
    x: 48,
    y: 750,
    size: 12,
    font: await doc.embedFont(StandardFonts.Helvetica),
    color: rgb(0.2, 0.2, 0.2),
  });
  const pdf = await doc.save();

  const auth = Buffer.from(`${apiKey}:`).toString("base64");
  const response = await fetch("https://api.printnode.com/printjobs", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      printerId,
      title: "Safran direct test",
      contentType: "pdf_base64",
      content: Buffer.from(pdf).toString("base64"),
      source: "Safran-test",
    }),
  });

  const text = await response.text();
  console.log("status", response.status);
  console.log("body", text);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
