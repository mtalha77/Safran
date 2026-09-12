import "server-only";

/**
 * Brother (and other Windows) printers cannot be reached directly from a cloud
 * Next.js server. PrintNode runs a small client on the restaurant PC and exposes
 * an API so Safran can send an A4 PDF job to that PC's installed printer.
 *
 * Providers:
 * - `log` (default): no hardware — marks success for local/dev
 * - `printnode`: send PDF to Brother via PrintNode Cloud API
 */

export type PrintSendResult =
  | { ok: true }
  | { ok: false; error: string };

function provider() {
  return (process.env.PRINTER_PROVIDER ?? "log").trim().toLowerCase();
}

function printNodeApiKey() {
  return (process.env.PRINTNODE_API_KEY ?? "").trim();
}

function printNodePrinterId() {
  const id = Number(process.env.PRINTNODE_PRINTER_ID ?? "");
  return Number.isFinite(id) && id > 0 ? id : null;
}

async function sendPrintNodePdf(
  pdfBytes: Uint8Array,
  title: string,
): Promise<PrintSendResult> {
  const apiKey = printNodeApiKey();
  const printerId = printNodePrinterId();
  if (!apiKey) {
    return { ok: false, error: "PRINTNODE_API_KEY is not configured." };
  }
  if (!printerId) {
    return { ok: false, error: "PRINTNODE_PRINTER_ID is not configured." };
  }

  const content = Buffer.from(pdfBytes).toString("base64");
  const auth = Buffer.from(`${apiKey}:`).toString("base64");

  try {
    const response = await fetch("https://api.printnode.com/printjobs", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        printerId,
        title: title.slice(0, 100),
        contentType: "pdf_base64",
        content,
        source: "Safran",
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[print] PrintNode HTTP ${response.status}`, text.slice(0, 300));
      return {
        ok: false,
        error: `PrintNode HTTP ${response.status}: ${text.slice(0, 200)}`,
      };
    }
    const jobId = await response.text();
    console.info(`[print] PrintNode accepted job ${jobId} printer=${printerId}`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "PrintNode request failed",
    };
  }
}

export async function sendPdfToPrinter(input: {
  pdfBytes: Uint8Array;
  title: string;
}): Promise<PrintSendResult> {
  switch (provider()) {
    case "printnode":
      return sendPrintNodePdf(input.pdfBytes, input.title);
    case "log":
    default:
      console.info(
        `[print] provider=log pdfBytes=${input.pdfBytes.byteLength} title=${input.title} (set PRINTER_PROVIDER=printnode for Brother)`,
      );
      return { ok: true };
  }
}

export function isPrinterConfigured() {
  const mode = provider();
  if (mode === "log") return true;
  if (mode === "printnode") {
    return Boolean(printNodeApiKey() && printNodePrinterId());
  }
  return false;
}
