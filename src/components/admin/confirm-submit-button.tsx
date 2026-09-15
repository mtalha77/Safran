"use client";

import { useEffect, useRef, useState } from "react";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";
import {
  dangerButtonClass,
  secondaryButtonClass,
} from "@/components/admin/ui";
import { useLocale } from "@/lib/i18n/locale-context";

type ConfirmSubmitButtonProps = {
  /** Label of the button that opens the dialog. */
  label: string;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  pendingLabel?: string;
};

/**
 * Guards a destructive Server Action behind a warning dialog. The confirm
 * button stays inside the parent `<form>` so the action and its pending state
 * keep working exactly as with a plain submit button.
 */
export function ConfirmSubmitButton({
  label,
  title,
  body,
  confirmLabel,
  cancelLabel,
  pendingLabel,
}: ConfirmSubmitButtonProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={dangerButtonClass}
      >
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={cancelLabel}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/50"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="relative w-full max-w-md rounded-2xl bg-white p-5 text-left shadow-xl sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <path
                    d="M12 9v4m0 3.5v.5M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <h2
                  id="confirm-dialog-title"
                  className="font-sans text-lg font-semibold tracking-tight text-ink"
                >
                  {title}
                </h2>
                <p className="mt-1.5 text-sm text-muted">{body}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => setOpen(false)}
                className={secondaryButtonClass}
              >
                {cancelLabel}
              </button>
              <PendingSubmitButton
                variant="danger"
                requireDirty={false}
                pendingLabel={pendingLabel ?? t("admin.common.saving")}
              >
                {confirmLabel}
              </PendingSubmitButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
