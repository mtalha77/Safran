import { ValidationError } from "@/backend/errors";

const ALLOWED_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "audio/mp4",
  "audio/x-m4a",
]);

export const MAX_ORDER_ALERT_AUDIO_BYTES = 3 * 1024 * 1024;

const EXT_BY_TYPE: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
};

export type ValidatedAlertAudio = {
  buffer: Buffer;
  contentType: string;
  extension: string;
};

/** Validate kitchen alert audio upload (no re-encode). */
export async function validateOrderAlertAudio(
  file: File,
): Promise<ValidatedAlertAudio> {
  const type = file.type || "audio/mpeg";
  if (!ALLOWED_TYPES.has(type)) {
    throw new ValidationError(
      "audio_type_invalid",
      "Erlaubt sind MP3, WAV, OGG oder M4A.",
    );
  }
  if (file.size > MAX_ORDER_ALERT_AUDIO_BYTES) {
    throw new ValidationError(
      "audio_too_large",
      "Die Audiodatei darf höchstens 3 MB gross sein.",
    );
  }

  const extension =
    EXT_BY_TYPE[type] ??
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ??
    "mp3";

  return {
    buffer: Buffer.from(await file.arrayBuffer()),
    contentType: type === "audio/mp3" ? "audio/mpeg" : type,
    extension,
  };
}

export function orderAlertSoundPublicUrl(
  path: string | null | undefined,
): string | null {
  const trimmed = path?.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  return `${base}/storage/v1/object/public/order-alerts/${trimmed.replace(/^\//, "")}`;
}
