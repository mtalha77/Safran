"use client";

import { useId, useState } from "react";

type AdminFileInputProps = {
  name: string;
  accept?: string;
  required?: boolean;
  className?: string;
  buttonLabel?: string;
};

/**
 * Styled file picker — hides the native “Choose file” control.
 */
export function AdminFileInput({
  name,
  accept,
  required,
  className = "",
  buttonLabel = "Datei wählen",
}: AdminFileInputProps) {
  const id = useId();
  const [fileName, setFileName] = useState("");

  return (
    <div className={`flex min-w-0 flex-1 flex-wrap items-center gap-2 ${className}`.trim()}>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        required={required}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          setFileName(file?.name ?? "");
          // Ensure parent DirtyForm sees the change (some browsers are flaky with file inputs).
          event.currentTarget.dispatchEvent(
            new Event("input", { bubbles: true }),
          );
        }}
      />
      <label
        htmlFor={id}
        className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border border-sage/35 bg-white px-4 py-2 text-sm font-semibold whitespace-nowrap text-sage-deep transition hover:bg-cream"
      >
        {buttonLabel}
      </label>
      <span className="min-w-0 truncate text-sm text-muted" title={fileName || undefined}>
        {fileName || "Keine Datei ausgewählt"}
      </span>
    </div>
  );
}
