/**
 * Checks the Resend setup end to end: is the key valid, is the sending domain
 * verified, and does a real message go out.
 *
 * Usage: npm run email:test -- you@example.com
 */
import { config as loadEnv } from "dotenv";
import { Resend } from "resend";

loadEnv({ path: [".env.local", ".env"], quiet: true });

type DomainRecord = { name: string; status: string; region?: string };

const recipient = process.argv.slice(2).find((arg) => arg.includes("@"));
const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
const from =
  process.env.RESEND_FROM?.trim() || "Safran Romanshorn <onboarding@resend.dev>";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";

function mask(value: string) {
  return value.length > 12
    ? `${value.slice(0, 6)}…${value.slice(-4)}`
    : "(too short)";
}

/** `Name <address@domain>` or a bare address. */
function senderDomain(sender: string) {
  const address = sender.match(/<([^>]+)>/)?.[1] ?? sender;
  return address.split("@")[1]?.toLowerCase() ?? "";
}

async function listDomains(): Promise<DomainRecord[] | null> {
  const response = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (response.ok) {
    const body = (await response.json()) as { data?: DomainRecord[] };
    return body.data ?? [];
  }

  const detail = (await response.json().catch(() => null)) as {
    name?: string;
    message?: string;
  } | null;

  // A sending-only key is the right kind for this app; it just cannot read the
  // domain list, so fall through to the live send instead of failing.
  if (detail?.name === "restricted_api_key") {
    console.log(
      "\nDomain check skipped: this is a send-only key, which cannot list domains.",
    );
    console.log("  Check the status in the Resend dashboard, or send a test below.");
    return null;
  }

  console.error(
    `  ! could not read domains (HTTP ${response.status}): ${detail?.message ?? "unknown error"}`,
  );
  return null;
}

async function main() {
  console.log("Resend configuration");
  console.log(`  RESEND_API_KEY       ${apiKey ? mask(apiKey) : "MISSING"}`);
  console.log(`  RESEND_FROM          ${from}`);
  console.log(
    `  NEXT_PUBLIC_SITE_URL ${siteUrl || "(empty — order emails will link to localhost or the Vercel preview URL)"}`,
  );

  if (!apiKey) {
    console.error("\nSet RESEND_API_KEY in .env first.");
    process.exit(1);
  }

  const domain = senderDomain(from);
  const domains = await listDomains();
  if (domains) {
    console.log("\nDomains on this Resend account");
    if (!domains.length) console.log("  (none added yet)");
    for (const entry of domains) {
      const marker = entry.name.toLowerCase() === domain ? "->" : "  ";
      console.log(`  ${marker} ${entry.name} — ${entry.status}`);
    }

    const match = domains.find((entry) => entry.name.toLowerCase() === domain);
    if (!match) {
      console.warn(
        `\n  ! ${domain} is not on this account, so sending from ${from} will be rejected.`,
      );
    } else if (match.status !== "verified") {
      console.warn(`\n  ! ${domain} is "${match.status}", not verified yet.`);
    }
  }

  if (!recipient) {
    console.log("\nPass an address to send a real test message:");
    console.log("  npm run email:test -- you@example.com");
    return;
  }

  console.log(`\nSending test message to ${recipient} …`);
  const result = await new Resend(apiKey).emails.send({
    from,
    to: recipient,
    subject: "Safran — Resend test",
    text: "This is a test message from the Safran ordering site. If you received it, order emails will work.",
    html: "<p>This is a test message from the Safran ordering site.</p><p>If you received it, order emails will work.</p>",
  });

  if (result.error) {
    console.error(`  failed: ${result.error.name}: ${result.error.message}`);
    process.exit(1);
  }
  console.log(`  sent — message id ${result.data?.id}`);
}

void main();
