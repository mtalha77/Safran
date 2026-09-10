import { ValidationError } from "@/backend/errors";

export function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function optionalText(value: unknown, max: number): string | null {
  return text(value, max) || null;
}

export function requiredText(
  value: unknown,
  max: number,
  code: string,
  message: string,
): string {
  const parsed = text(value, max);
  if (!parsed) throw new ValidationError(code, message);
  return parsed;
}

export function numberValue(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function nonNegativeNumber(
  value: unknown,
  code: string,
  message: string,
): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new ValidationError(code, message);
  }
  return parsed;
}

export function integerInRange(
  value: unknown,
  min: number,
  max: number,
  code: string,
  message: string,
): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new ValidationError(code, message);
  }
  return parsed;
}

export function boolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "on", "1", "yes"].includes(value.toLowerCase());
  }
  return false;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

/** Turns a slug-ish label into a stable, url-safe category id. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
