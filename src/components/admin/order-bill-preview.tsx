"use client";

import { useState } from "react";

type OrderBillPreviewProps = {
  orderId: string;
};

export function OrderBillPreview({ orderId }: OrderBillPreviewProps) {
  const [pending, setPending] = useState<"preview" | "download" | null>(null);
  const [error, setError] = useState("");

  async function loadPdf(mode: "preview" | "download") {
    setPending(mode);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/bill-pdf${mode === "preview" ? "?preview=1" : ""}`,
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
        anchor.download = `safran-rechnung-${orderId.slice(0, 8)}.pdf`;
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
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void loadPdf("preview")}
        disabled={pending !== null}
        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-sage/35 bg-white px-4 py-2 text-sm font-semibold text-sage-deep transition hover:bg-cream disabled:opacity-50"
      >
        {pending === "preview" ? "Oeffnen…" : "Rechnung ansehen"}
      </button>
      <button
        type="button"
        onClick={() => void loadPdf("download")}
        disabled={pending !== null}
        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-sage/35 bg-white px-4 py-2 text-sm font-semibold text-sage-deep transition hover:bg-cream disabled:opacity-50"
      >
        {pending === "download" ? "Laden…" : "PDF speichern"}
      </button>
      {error ? <p className="w-full text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
