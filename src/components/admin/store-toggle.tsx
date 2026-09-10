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
      className={`relative h-8 w-14 shrink-0 rounded-full transition disabled:opacity-60 ${
        open ? "bg-emerald-500" : "bg-red-600"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
          open ? "left-7" : "left-1"
        }`}
      />
    </button>
  );
}

export function AdminStoreToggle({ open }: { open: boolean }) {
  const pathname = usePathname();

  return (
    <form action={setStoreOpenAction} className="flex items-center gap-3">
      <input type="hidden" name="is_open" value={open ? "false" : "true"} />
      <input type="hidden" name="next" value={pathname || "/admin"} />
      <div className="text-right">
        <p className="text-[10px] font-bold tracking-[0.18em] text-white/55 uppercase">
          Bestellungen
        </p>
        <p className={`text-sm font-semibold ${open ? "text-emerald-300" : "text-amber-300"}`}>
          {open ? "Geöffnet" : "Geschlossen"}
        </p>
      </div>
      <ToggleButton open={open} />
    </form>
  );
}
