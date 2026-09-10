import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { compressMenuImage } from "./compress-menu-image";

test("compressMenuImage converts PNG to smaller WebP", async () => {
  const png = await sharp({
    create: {
      width: 800,
      height: 600,
      channels: 3,
      background: { r: 200, g: 120, b: 40 },
    },
  })
    .png()
    .toBuffer();

  const file = new File([png], "dish.png", { type: "image/png" });
  const result = await compressMenuImage(file);

  assert.equal(result.contentType, "image/webp");
  assert.equal(result.extension, "webp");
  assert.ok(result.byteLength > 0);
  assert.ok(result.byteLength < png.byteLength);
});

test("compressMenuImage rejects oversized uploads", async () => {
  const big = Buffer.alloc(5 * 1024 * 1024 + 1, 1);
  const file = new File([big], "huge.jpg", { type: "image/jpeg" });
  await assert.rejects(() => compressMenuImage(file), /5 MB/);
});
