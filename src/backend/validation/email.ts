import "server-only";

import { resolve4, resolve6, resolveMx } from "node:dns/promises";
import { ValidationError } from "@/backend/errors";
import { isValidEmailFormat } from "@/backend/validation/email-format";

/** Domain clearly does not exist / has no records. */
const HARD_DNS_CODES = new Set(["ENOTFOUND", "ENODATA", "ESNOTFOUND"]);

function dnsCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    return String((error as { code: unknown }).code ?? "");
  }
  return "";
}

function isDnsTimeout(error: unknown): boolean {
  return error instanceof Error && error.message === "dns_timeout";
}

/** Network/resolver issues must not block checkout (common on Windows/dev). */
function shouldAcceptDespiteDnsError(error: unknown): boolean {
  if (isDnsTimeout(error)) return true;
  const code = dnsCode(error);
  if (!code) return true;
  return !HARD_DNS_CODES.has(code);
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("dns_timeout")), ms),
    ),
  ]);
}

/**
 * Format check + light domain probe. Only rejects when the domain clearly does
 * not exist. Resolver/network failures fail open so real addresses are never
 * blocked by local DNS issues.
 */
export async function assertDeliverableEmail(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!isValidEmailFormat(normalized)) {
    throw new ValidationError(
      "invalid_email",
      "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    );
  }

  const domain = normalized.slice(normalized.lastIndexOf("@") + 1);
  if (!domain || domain.includes("..") || domain.startsWith(".") || domain.endsWith(".")) {
    throw new ValidationError(
      "invalid_email",
      "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    );
  }

  try {
    const mx = await withTimeout(resolveMx(domain), 2500);
    if (Array.isArray(mx) && mx.length > 0) return;
  } catch (error) {
    if (shouldAcceptDespiteDnsError(error)) return;
  }

  try {
    const v4 = await withTimeout(resolve4(domain), 2500);
    if (Array.isArray(v4) && v4.length > 0) return;
  } catch (error) {
    if (shouldAcceptDespiteDnsError(error)) return;
  }

  try {
    const v6 = await withTimeout(resolve6(domain), 2500);
    if (Array.isArray(v6) && v6.length > 0) return;
  } catch (error) {
    if (shouldAcceptDespiteDnsError(error)) return;
  }

  throw new ValidationError(
    "invalid_email_domain",
    "Diese E-Mail-Adresse scheint ungültig zu sein. Bitte prüfen Sie die Schreibweise.",
  );
}
