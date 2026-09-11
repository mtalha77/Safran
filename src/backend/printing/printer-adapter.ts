import "server-only";

/**
 * Printer adapters for Epson network thermals (TM-T20IV / TM-T88VII).
 *
 * Providers:
 * - `log` (default): records success without hardware — safe for local/dev
 * - `epson_epos`: HTTP ePOS-Print XML to the printer's LAN/WAN URL
 * - `raw_tcp`: raw ESC/POS to host:9100 (needs network path to the printer)
 */

export type PrintSendResult =
  | { ok: true }
  | { ok: false; error: string };

function provider() {
  return (process.env.PRINTER_PROVIDER ?? "log").trim().toLowerCase();
}

function eposUrl() {
  return (process.env.EPSON_EPOS_URL ?? "").trim();
}

function rawHost() {
  return (process.env.EPSON_PRINTER_HOST ?? "").trim();
}

function rawPort() {
  const port = Number(process.env.EPSON_PRINTER_PORT ?? "9100");
  return Number.isFinite(port) && port > 0 ? port : 9100;
}

function toBase64(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64");
}

async function sendEpsonEpos(bytes: Uint8Array): Promise<PrintSendResult> {
  const url = eposUrl();
  if (!url) {
    return {
      ok: false,
      error: "EPSON_EPOS_URL is not configured.",
    };
  }

  const body = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
      <raw>${toBase64(bytes)}</raw>
    </epos-print>
  </s:Body>
</s:Envelope>`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: '""',
      },
      body,
      signal: AbortSignal.timeout(12_000),
    });

    const text = await response.text();
    if (!response.ok) {
      return {
        ok: false,
        error: `ePOS HTTP ${response.status}: ${text.slice(0, 200)}`,
      };
    }
    if (/success\s*=\s*"false"/i.test(text) || /<errorcode>/i.test(text)) {
      return {
        ok: false,
        error: `ePOS rejected job: ${text.slice(0, 200)}`,
      };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "ePOS request failed",
    };
  }
}

async function sendRawTcp(bytes: Uint8Array): Promise<PrintSendResult> {
  const host = rawHost();
  if (!host) {
    return { ok: false, error: "EPSON_PRINTER_HOST is not configured." };
  }

  const net = await import("node:net");

  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port: rawPort() }, () => {
      socket.write(Buffer.from(bytes), (writeError) => {
        if (writeError) {
          socket.destroy();
          resolve({ ok: false, error: writeError.message });
          return;
        }
        socket.end();
        resolve({ ok: true });
      });
    });

    socket.setTimeout(10_000);
    socket.on("timeout", () => {
      socket.destroy();
      resolve({ ok: false, error: "Printer TCP timeout" });
    });
    socket.on("error", (error) => {
      resolve({ ok: false, error: error.message });
    });
  });
}

export async function sendToPrinter(bytes: Uint8Array): Promise<PrintSendResult> {
  switch (provider()) {
    case "epson_epos":
      return sendEpsonEpos(bytes);
    case "raw_tcp":
      return sendRawTcp(bytes);
    case "log":
    default:
      console.info(
        `[print] provider=log bytes=${bytes.byteLength} (set PRINTER_PROVIDER=epson_epos|raw_tcp for hardware)`,
      );
      return { ok: true };
  }
}

export function isPrinterConfigured() {
  const mode = provider();
  if (mode === "log") return true;
  if (mode === "epson_epos") return Boolean(eposUrl());
  if (mode === "raw_tcp") return Boolean(rawHost());
  return false;
}
