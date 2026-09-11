"use client";

import { useState } from "react";

export function MenuPdfDownload() {
  const [lang, setLang] = useState<"de" | "en">("de");
  const [pending, setPending] = useState<"preview" | "download" | null>(null);
  const [error, setError] = useState("");

  async function loadPdf(mode: "preview" | "download") {
    setPending(mode);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/menu-pdf?lang=${lang}${mode === "preview" ? "&preview=1" : ""}`,
      );
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(body?.message || "PDF fehlgeschlagen.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (mode === "preview") {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download =
          lang === "de" ? "safran-speisekarte-de.pdf" : "safran-menu-en.pdf";
        anchor.click();
      }
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF fehlgeschlagen.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="text-sm font-semibold">
        Sprache
        <select
          className="mt-1 block min-w-40 rounded-xl border border-sage/25 bg-white px-3 py-2 text-sm"
          value={lang}
          onChange={(event) => setLang(event.target.value as "de" | "en")}
          disabled={pending !== null}
        >
          <option value="de">Deutsch</option>
          <option value="en">English</option>
        </select>
      </label>
      <button
        type="button"
        onClick={() => void loadPdf("preview")}
        disabled={pending !== null}
        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-sage/30 bg-white px-4 py-2 text-sm font-semibold text-sage-deep disabled:opacity-60"
      >
        {pending === "preview" ? "Vorschau..." : "Menü-Vorschau"}
      </button>
      <button
        type="button"
        onClick={() => void loadPdf("download")}
        disabled={pending !== null}
        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-sage-deep px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending === "download" ? "PDF wird erstellt..." : "PDF herunterladen"}
      </button>
      {error ? <p className="w-full text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
