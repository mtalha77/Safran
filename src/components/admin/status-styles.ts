/** Shared status colour classes — safe for client and server. */

export function statusClass(status: string) {
  if (status === "cancelled") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-slate-100 text-slate-700";
  if (status === "ready") return "bg-emerald-100 text-emerald-800";
  if (status === "preparing") return "bg-amber-100 text-amber-800";
  return "bg-sage/15 text-sage-deep";
}

export function printStatusClass(status: string) {
  if (status === "printed") return "bg-emerald-100 text-emerald-800";
  if (status === "failed") return "bg-red-100 text-red-700";
  if (status === "printing") return "bg-amber-100 text-amber-800";
  if (status === "pending") return "bg-sky-100 text-sky-800";
  return "bg-slate-100 text-slate-700";
}
