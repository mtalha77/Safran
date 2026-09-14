import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const apiKey = process.env.PRINTNODE_API_KEY?.trim();
  const printerId = Number(process.env.PRINTNODE_PRINTER_ID);

  console.log("=== config ===");
  console.log({
    provider: process.env.PRINTER_PROVIDER,
    printerId,
    apiKeySet: Boolean(apiKey),
    workerSecretSet: Boolean(process.env.PRINT_WORKER_SECRET?.trim()),
  });

  const db = createClient(url, key);
  const { data: jobs, error } = await db
    .from("print_jobs")
    .select(
      "id, order_id, status, trigger_source, attempts, max_attempts, last_error, next_attempt_at, printed_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(15);

  console.log("=== print_jobs ===");
  if (error) {
    console.log("DB error:", error.message, error.code, error.details);
  } else {
    console.log("rows:", jobs?.length ?? 0);
    for (const j of jobs ?? []) {
      console.log(
        [
          j.created_at,
          j.status,
          j.trigger_source,
          `attempts=${j.attempts}/${j.max_attempts}`,
          j.last_error ? `err=${String(j.last_error).slice(0, 100)}` : "err=none",
          `order=${String(j.order_id).slice(0, 8)}`,
        ].join(" | "),
      );
    }
  }

  if (!apiKey || !printerId) return;

  const auth = Buffer.from(`${apiKey}:`).toString("base64");
  const headers = { Authorization: `Basic ${auth}` };

  const [printerRes, computersRes, jobsRes] = await Promise.all([
    fetch(`https://api.printnode.com/printers/${printerId}`, { headers }),
    fetch("https://api.printnode.com/computers", { headers }),
    fetch("https://api.printnode.com/printjobs?limit=8", { headers }),
  ]);

  const printerJson = await printerRes.json();
  const computersJson = await computersRes.json();
  const jobsJson = await jobsRes.json();
  const printer = Array.isArray(printerJson) ? printerJson[0] : printerJson;

  console.log("=== printnode ===");
  console.log({
    printerHttp: printerRes.status,
    printerName: printer?.name,
    printerState: printer?.state,
    computerName: printer?.computer?.name,
    computerState: printer?.computer?.state,
  });
  console.log(
    "computers:",
    (Array.isArray(computersJson) ? computersJson : []).map((c: { name: string; state: string }) => ({
      name: c.name,
      state: c.state,
    })),
  );
  console.log(
    "recent printnode jobs:",
    (Array.isArray(jobsJson) ? jobsJson : []).slice(0, 8).map(
      (j: {
        id: number;
        state: string;
        title: string;
        createTimestamp: string;
      }) => ({
        id: j.id,
        state: j.state,
        title: j.title,
        at: j.createTimestamp,
      }),
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
