import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import sharp from "sharp";
import { requireCapability } from "@/backend/auth/authorize";
import { listMenu } from "@/backend/services/menu.service";

export type MenuPdfLang = "de" | "en";

const PAGE_PX = { w: 2480, h: 3508 } as const;
const A4 = { w: 595.28, h: 841.89 } as const;
const PX = A4.w / PAGE_PX.w;
/** ~100dpi chrome — still sharp on A4, much faster encode/embed */
const RENDER_SCALE = 0.32;
const THUMB_SCALE = 0.34;

function pt(px: number) {
  return px * PX;
}

/**
 * Category headers: Times Bold (shop Speisekarte style).
 * Custom Playfair subsets were incomplete / crashed fontkit.
 */
const L = {
  titleY: 380,
  contentBottom: 3180,
  rowH: 200,
  maxItems: 12,
  circleX: 300,
  circleD: 148,
  textX: 500,
  priceRight: 2160,
  nameSize: 40,
  descSize: 26,
  /** Shop category caps are large; Times needs a bit more size than Playfair. */
  titleSize: 128,
  subtitleSize: 36,
  titleMaxWidth: 1780,
  footerLabel: "SAFRAN - Speisekarte",
  footerEn: "SAFRAN - Menu",
  footerY: 220,
} as const;

type PdfItem = {
  number: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
};

type PdfCategory = {
  title: string;
  subtitle?: string;
  note?: string;
  items: PdfItem[];
};

type PageBlock =
  | { type: "category"; title: string; subtitle?: string; note?: string }
  | { type: "item"; item: PdfItem };

let templateCache: { cover: Buffer; blank: Buffer; version: number } | null =
  null;
const TEMPLATE_CACHE_VERSION = 6;
const thumbCache = new Map<string, Buffer>();
const THUMB_CACHE_VERSION = 2;

function thumbCacheKey(url: string) {
  return `v${THUMB_CACHE_VERSION}:${url}`;
}

type BuiltPdfCache = {
  signature: string;
  bytes: Uint8Array;
  filename: string;
};
/** Keep DE + EN (and recent revisions) in memory for instant repeat downloads. */
const builtPdfCaches = new Map<string, BuiltPdfCache>();
const BUILT_PDF_CACHE_MAX = 4;

/** Prefetch cover/blank JPEG so the first PDF click is not paying resize cost. */
export async function warmMenuPdfAssets() {
  await loadTemplates();
}

function menuPdfSignature(
  lang: MenuPdfLang,
  categories: Awaited<ReturnType<typeof listMenu>>["categories"],
  items: Awaited<ReturnType<typeof listMenu>>["items"],
) {
  // Compact fingerprint — any catalog/content change invalidates the cache.
  const parts: string[] = [lang];
  for (const category of categories) {
    parts.push(
      `c:${category.id}:${category.sort_order}:${category.is_active ? 1 : 0}:${category.title}:${category.subtitle ?? ""}:${category.note_de ?? ""}:${category.note_en ?? ""}`,
    );
  }
  for (const item of items) {
    parts.push(
      `i:${item.id}:${item.category_id}:${item.item_number}:${item.sort_order}:${item.is_active ? 1 : 0}:${item.name}:${item.price}:${item.description_de ?? ""}:${item.description_en ?? ""}:${item.image_path ?? ""}`,
    );
  }
  return parts.join("|");
}

/** Cover = shop PDF page 1; blank = provided ornate frame (text drawn on top). */
async function loadTemplates() {
  if (templateCache?.version === TEMPLATE_CACHE_VERSION) return templateCache;
  const assetsDir = path.join(process.cwd(), "public", "brand", "menu-pdf");
  const [coverRaw, blankRaw] = await Promise.all([
    readFile(path.join(assetsDir, "cover.jpg")),
    readFile(path.join(assetsDir, "page-blank.jpg")),
  ]);
  const width = Math.round(PAGE_PX.w * RENDER_SCALE);
  const height = Math.round(PAGE_PX.h * RENDER_SCALE);
  const [cover, blank] = await Promise.all([
    sharp(coverRaw).resize(width, height).jpeg({ quality: 58, mozjpeg: true }).toBuffer(),
    sharp(blankRaw).resize(width, height).jpeg({ quality: 62, mozjpeg: true }).toBuffer(),
  ]);
  templateCache = { cover, blank, version: TEMPLATE_CACHE_VERSION };
  return templateCache;
}

function formatPrice(value: number) {
  return `CHF ${value.toFixed(2)}`;
}

function formatItemNumber(n: number) {
  return String(n).padStart(2, "0");
}

/** Circular PNG thumb with gold ring (transparent corners). */
async function circlePng(source: Buffer, diameterPx: number): Promise<Buffer> {
  const size = Math.max(40, Math.round(diameterPx * THUMB_SCALE));
  const ring = 3;
  const cx = size / 2;
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${cx}" cy="${cx}" r="${cx - ring}" fill="white"/></svg>`,
  );
  const overlay = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cx}" r="${cx - ring / 2}" fill="none" stroke="#ebc37d" stroke-width="${ring}"/>
    </svg>`,
  );

  return sharp(source)
    .resize(size, size, { fit: "cover" })
    .ensureAlpha()
    .composite([
      { input: mask, blend: "dest-in" },
      { input: overlay, blend: "over" },
    ])
    .png({ compressionLevel: 6, effort: 1 })
    .toBuffer();
}

async function fetchImage(url: string): Promise<Buffer | null> {
  try {
    // Local public assets — skip HTTP round-trip
    if (url.startsWith("/") && !url.startsWith("//")) {
      return await readFile(path.join(process.cwd(), "public", url.replace(/^\//, "")));
    }
    const absolute = url.startsWith("http")
      ? url
      : new URL(url, process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:3000").toString();
    const res = await fetch(absolute, { cache: "force-cache" });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index]!);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length || 1) }, () => run()),
  );
  return results;
}

/** Prefetch + circle-crop unique dish images (process-wide cache). */
async function prepareThumbs(urls: string[]): Promise<Map<string, Buffer>> {
  const unique = [...new Set(urls)];
  const map = new Map<string, Buffer>();
  const missing = unique.filter((url) => {
    const hit = thumbCache.get(thumbCacheKey(url));
    if (hit) {
      map.set(url, hit);
      return false;
    }
    return true;
  });

  // Keep below Node's default maxListeners (10) — many parallel gzip
  // response streams otherwise spam MaxListenersExceededWarning.
  await mapPool(missing, 6, async (url) => {
    const raw = await fetchImage(url);
    if (!raw) return;
    try {
      const thumb = await circlePng(raw, L.circleD);
      thumbCache.set(thumbCacheKey(url), thumb);
      map.set(url, thumb);
    } catch {
      /* skip broken images */
    }
  });
  return map;
}

function buildCategories(
  categories: Awaited<ReturnType<typeof listMenu>>["categories"],
  items: Awaited<ReturnType<typeof listMenu>>["items"],
  lang: MenuPdfLang,
): PdfCategory[] {
  const activeCategories = [...categories]
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  return activeCategories.flatMap((category) => {
    const categoryItems = items
      .filter((item) => item.category_id === category.id && item.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => {
        const description =
          lang === "de"
            ? (item.description_de || item.description_en || "").trim()
            : (item.description_en || item.description_de || "").trim();
        return {
          number: item.item_number,
          name: item.name,
          description,
          price: Number(item.price),
          imageUrl: item.imageUrl,
        };
      });

    if (!categoryItems.length) return [];

    const title =
      lang === "en" && category.subtitle ? category.subtitle : category.title;
    const subtitle =
      lang === "en" && category.subtitle
        ? category.title
        : category.subtitle ?? undefined;
    const note =
      lang === "de"
        ? category.note_de ?? category.note_en ?? undefined
        : category.note_en ?? category.note_de ?? undefined;

    return [{ title, subtitle, note: note ?? undefined, items: categoryItems }];
  });
}

function paginate(categories: PdfCategory[]): PageBlock[][] {
  const pages: PageBlock[][] = [];
  let current: PageBlock[] = [];
  let itemCount = 0;

  const flush = () => {
    if (current.some((block) => block.type === "item")) pages.push(current);
    current = [];
    itemCount = 0;
  };

  for (const category of categories) {
    if (itemCount >= L.maxItems - 1) flush();

    current.push({
      type: "category",
      title: category.title,
      subtitle: category.subtitle,
      note: category.note,
    });

    for (const item of category.items) {
      if (itemCount >= L.maxItems) {
        flush();
        // Continue items on the next page without repeating the category heading.
      }
      current.push({ type: "item", item });
      itemCount += 1;
    }
  }

  flush();
  return pages;
}

function wrapText(
  text: string,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  size: number,
  maxWidth: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) line = next;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function drawCentered(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  y: number,
  color: ReturnType<typeof rgb>,
) {
  // Center within the parchment content band (not just the raw page edge).
  const contentLeft = pt(L.circleX);
  const contentRight = pt(L.priceRight);
  const contentMid = (contentLeft + contentRight) / 2;
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: contentMid - width / 2,
    y,
    size,
    font,
    color,
  });
}

export async function buildMenuPdf(
  lang: MenuPdfLang,
): Promise<{ bytes: Uint8Array; filename: string }> {
  await requireCapability("menu:manage");
  const [{ categories, items }, templates] = await Promise.all([
    listMenu(),
    loadTemplates(),
  ]);

  const signature = menuPdfSignature(lang, categories, items);
  const cached = builtPdfCaches.get(signature);
  if (cached) {
    return { bytes: cached.bytes, filename: cached.filename };
  }

  const catalog = buildCategories(categories, items, lang);
  const pages = paginate(catalog);

  const imageUrls = catalog.flatMap((category) =>
    category.items.map((item) => item.imageUrl).filter((url): url is string => Boolean(url)),
  );
  const thumbs = await prepareThumbs(imageUrls);

  const pdf = await PDFDocument.create();
  const [font, fontBold, coverImage, blankImage] = await Promise.all([
    pdf.embedFont(StandardFonts.TimesRoman),
    pdf.embedFont(StandardFonts.TimesRomanBold),
    pdf.embedJpg(templates.cover),
    pdf.embedJpg(templates.blank),
  ]);

  {
    const page = pdf.addPage([A4.w, A4.h]);
    page.drawImage(coverImage, { x: 0, y: 0, width: A4.w, height: A4.h });
  }

  const thumbEmbeds = new Map<string, PDFImage>();
  await Promise.all(
    [...thumbs.entries()].map(async ([url, buffer]) => {
      thumbEmbeds.set(url, await pdf.embedPng(buffer));
    }),
  );

  let pageNumber = 2;

  for (const blocks of pages) {
    const page = pdf.addPage([A4.w, A4.h]);
    page.drawImage(blankImage, { x: 0, y: 0, width: A4.w, height: A4.h });

    const itemCount = blocks.filter((block) => block.type === "item").length;
    // Estimate header block height so rows can stretch to fill the page.
    let headerPx = 0;
    for (const block of blocks) {
      if (block.type !== "category") continue;
      const titleLines = wrapText(
        block.title.toUpperCase(),
        fontBold,
        pt(L.titleSize),
        pt(L.titleMaxWidth),
      );
      headerPx += titleLines.length * (L.titleSize + 8) + 20;
      if (block.subtitle) headerPx += L.subtitleSize + 18;
      if (block.note) headerPx += 34 * 2;
      headerPx += 24;
    }
    const startItemsY = L.titleY + headerPx;
    const rowH =
      itemCount > 0
        ? Math.min(
            250,
            Math.max(
              168,
              Math.floor((L.contentBottom - startItemsY) / itemCount),
            ),
          )
        : L.rowH;

    let yPx = L.titleY;
    const ink = rgb(0.1, 0.07, 0.05);

    for (const block of blocks) {
      if (block.type === "category") {
        const titleSize = pt(L.titleSize);
        const titleLines = wrapText(
          block.title.toUpperCase(),
          fontBold,
          titleSize,
          pt(L.titleMaxWidth),
        );
        for (const line of titleLines) {
          drawCentered(
            page,
            line,
            fontBold,
            titleSize,
            A4.h - pt(yPx) - titleSize,
            ink,
          );
          yPx += L.titleSize + 8;
        }
        yPx += 12;

        if (block.subtitle) {
          const subSize = pt(L.subtitleSize);
          drawCentered(
            page,
            block.subtitle,
            font,
            subSize,
            A4.h - pt(yPx) - subSize,
            rgb(0.18, 0.12, 0.08),
          );
          yPx += L.subtitleSize + 18;
        }

        if (block.note) {
          const noteSize = pt(26);
          for (const line of wrapText(block.note, font, noteSize, pt(1800))) {
            drawCentered(
              page,
              line,
              font,
              noteSize,
              A4.h - pt(yPx) - noteSize,
              rgb(0.25, 0.2, 0.15),
            );
            yPx += 34;
          }
        }
        yPx += 24;
        continue;
      }

      const { item } = block;
      const nameSize = pt(L.nameSize);
      const descSize = pt(L.descSize);
      const name = `${formatItemNumber(item.number)}. ${item.name}`;
      const price = formatPrice(item.price);
      const priceWidth = fontBold.widthOfTextAtSize(price, nameSize);
      const rowTop = yPx;
      const circleDraw = Math.min(L.circleD, rowH - 16);

      if (item.imageUrl) {
        const embedded = thumbEmbeds.get(item.imageUrl);
        if (embedded) {
          page.drawImage(embedded, {
            x: pt(L.circleX),
            y: A4.h - pt(rowTop + circleDraw),
            width: pt(circleDraw),
            height: pt(circleDraw),
          });
        }
      }

      const textTop = rowTop + Math.round(circleDraw * 0.28);
      page.drawText(name, {
        x: pt(L.textX),
        y: A4.h - pt(textTop),
        size: nameSize,
        font: fontBold,
        color: rgb(0.1, 0.08, 0.05),
        maxWidth: pt(L.priceRight - L.textX) - priceWidth - pt(24),
      });
      page.drawText(price, {
        x: pt(L.priceRight) - priceWidth,
        y: A4.h - pt(textTop),
        size: nameSize,
        font: fontBold,
        color: rgb(0.1, 0.08, 0.05),
      });

      if (item.description) {
        wrapText(item.description, font, descSize, pt(L.priceRight - L.textX)).forEach(
          (line, index) => {
            page.drawText(line, {
              x: pt(L.textX),
              y: A4.h - pt(textTop + 32) - index * (descSize + 2),
              size: descSize,
              font,
              color: rgb(0.25, 0.2, 0.15),
            });
          },
        );
      }

      yPx += rowH;
    }

    const label = lang === "de" ? L.footerLabel : L.footerEn;
    const footer = `${label} | ${String(pageNumber).padStart(2, "0")}`;
    const footerSize = pt(22);
    const footerWidth = font.widthOfTextAtSize(footer, footerSize);
    page.drawText(footer, {
      x: pt(L.priceRight) - footerWidth,
      y: pt(L.footerY),
      size: footerSize,
      font,
      color: rgb(0.1, 0.08, 0.05),
    });

    pageNumber += 1;
  }

  const bytes = await pdf.save({ useObjectStreams: true });
  const filename =
    lang === "de" ? "safran-speisekarte-de.pdf" : "safran-menu-en.pdf";
  builtPdfCaches.set(signature, { signature, bytes, filename });
  while (builtPdfCaches.size > BUILT_PDF_CACHE_MAX) {
    const oldest = builtPdfCaches.keys().next().value;
    if (oldest === undefined) break;
    builtPdfCaches.delete(oldest);
  }
  return { bytes, filename };
}
