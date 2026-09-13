"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { useDirtyForm } from "@/components/admin/dirty-form";

type PendingSubmitButtonProps = {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
  /** Visual variant for destructive actions. */
  variant?: "primary" | "secondary" | "danger";
  /**
   * When true (default) and the button sits inside `DirtyForm`, stay disabled
   * until the user changes a field. Set false for actions that should always
   * be available (e.g. remove sound).
   */
  requireDirty?: boolean;
};

const VARIANT_CLASS: Record<
  NonNullable<PendingSubmitButtonProps["variant"]>,
  string
> = {
  primary:
    "inline-flex min-h-10 items-center justify-center rounded-xl bg-sage-deep px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "inline-flex min-h-10 items-center justify-center rounded-xl border border-sage/35 bg-white px-4 py-2 text-sm font-semibold text-sage-deep transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50",
};

/**
 * Submit button that disables and swaps its label while the parent Server Action
 * is pending. Must be rendered inside a React `<form>`.
 */
export function PendingSubmitButton({
  children,
  pendingLabel = "Wird gespeichert…",
  className = "",
  variant = "primary",
  requireDirty = true,
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();
  const dirty = useDirtyForm();
  const blockedByDirty =
    requireDirty && dirty !== null && dirty === false;

  return (
    <button
      type="submit"
      disabled={pending || blockedByDirty}
      aria-busy={pending}
      className={`${VARIANT_CLASS[variant]} ${className}`.trim()}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
