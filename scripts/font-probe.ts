/** Throwaway: is a TTF static or variable, and does "Safran" measure sanely? */
import { readFileSync } from "node:fs";
import fontkit from "@pdf-lib/fontkit";

for (const file of process.argv.slice(2)) {
  const font = fontkit.create(readFileSync(file)) as unknown as {
    postscriptName: string;
    variationAxes: Record<string, unknown>;
    unitsPerEm: number;
    layout: (text: string) => { glyphs: Array<{ id: number; advanceWidth: number }> };
  };
  const run = font.layout("Safran");
  console.log(
    `${file}\n  name=${font.postscriptName} axes=${Object.keys(font.variationAxes).join(",") || "none"} unitsPerEm=${font.unitsPerEm}`,
  );
  console.log(
    `  glyphs=${run.glyphs.map((g) => `${g.id}/${Math.round(g.advanceWidth)}`).join(" ")}`,
  );
}
