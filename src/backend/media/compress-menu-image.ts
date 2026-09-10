import sharp from "sharp";
import { ValidationError } from "@/backend/errors";

const ALLOWED_INPUT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

/** Raw upload ceiling before compression (matches admin UI copy). */
export const MAX_MENU_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Longest edge after resize — enough for menu cards, keeps files small. */
const MAX_EDGE_PX = 1600;

/** WebP quality target for menu photos. */
const WEBP_QUALITY = 78;

export type CompressedMenuImage = {
  buffer: Buffer;
  contentType: "image/webp";
  extension: "webp";
  byteLength: number;
};

/**
 * Validates the upload, then compresses to WebP (resized + quality-limited).
 * Call this inside Server Actions after the body has been accepted.
 */
export async function compressMenuImage(file: File): Promise<CompressedMenuImage> {
  if (!ALLOWED_INPUT_TYPES.has(file.type)) {
    throw new ValidationError(
      "image_type_invalid",
      "Erlaubt sind JPEG-, PNG-, WebP- oder AVIF-Bilder.",
    );
  }
  if (file.size > MAX_MENU_IMAGE_UPLOAD_BYTES) {
    throw new ValidationError(
      "image_too_large",
      "Das Bild darf höchstens 5 MB gross sein.",
    );
  }

  const input = Buffer.from(await file.arrayBuffer());

  let pipeline = sharp(input, { failOn: "none" }).rotate();

  const meta = await pipeline.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width > MAX_EDGE_PX || height > MAX_EDGE_PX) {
    pipeline = pipeline.resize({
      width: MAX_EDGE_PX,
      height: MAX_EDGE_PX,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const buffer = await pipeline
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  return {
    buffer,
    contentType: "image/webp",
    extension: "webp",
    byteLength: buffer.byteLength,
  };
}
