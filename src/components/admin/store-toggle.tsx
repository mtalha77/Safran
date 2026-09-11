"use client";

import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { setStoreOpenAction } from "@/app/admin/actions";

function ToggleButton({ open }: { open: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-pressed={!open}
      aria-label={open ? "Restaurant schliessen" : "Restaurant öffnen"}
      className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-60 ${
        open ? "bg-emerald-500" : "bg-red-500"
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
          open ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function AdminStoreToggle({ open }: { open: boolean }) {
  const pathname = usePathname();

  return (
    <form
      action={setStoreOpenAction}
      className="flex items-center gap-2.5 rounded-full border border-ink/8 bg-white px-3 py-1.5 shadow-sm"
    >
      <input type="hidden" name="is_open" value={open ? "false" : "true"} />
      <input type="hidden" name="next" value={pathname || "/admin"} />
      <p className="text-xs font-semibold text-ink">
        {open ? "Bestellungen offen" : "Bestellungen zu"}
      </p>
      <ToggleButton open={open} />
    </form>
  );
}
