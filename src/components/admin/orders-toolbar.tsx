"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ChangeEvent,
} from "react";
import { createPortal } from "react-dom";

type StatusOption = { value: string; label: string };

type OrdersToolbarProps = {
  q?: string;
  status?: string;
  statusOptions: StatusOption[];
};

function buildOrdersUrl(q: string, status: string) {
  const params = new URLSearchParams();
  const query = q.trim();
  if (query) params.set("q", query);
  if (status) params.set("status", status);
  const qs = params.toString();
  return qs ? `/admin/orders?${qs}` : "/admin/orders";
}

export function OrdersToolbar({
  q = "",
  status = "",
  statusOptions,
}: OrdersToolbarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState(q);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [isPending, startTransition] = useTransition();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  const navigate = useCallback(
    (nextQ: string, nextStatus: string) => {
      startTransition(() => {
        router.push(buildOrdersUrl(nextQ, nextStatus));
      });
    },
    [router],
  );

  useEffect(() => {
    if (search.trim() === (q ?? "").trim()) return;
    const timer = window.setTimeout(() => {
      navigate(search, selectedStatus);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search, q, selectedStatus, navigate]);

  const searchSlot = useMemo(
    () => (mounted ? document.getElementById("admin-header-search") : null),
    [mounted],
  );
  const filterSlot = useMemo(
    () => (mounted ? document.getElementById("admin-header-filters") : null),
    [mounted],
  );

  function onStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    setSelectedStatus(next);
    navigate(search, next);
  }

  const searchField = (
    <label className="pointer-events-auto relative block w-full max-w-md">
      <span className="sr-only">Suche</span>
      <span
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Name oder Bestellnummer"
        className="h-10 w-full rounded-xl border border-sage/20 bg-white/80 py-2 pr-3 pl-9 text-sm text-ink outline-none transition placeholder:text-muted/55 focus:border-sage focus:bg-white focus:ring-2 focus:ring-sage/15"
      />
    </label>
  );

  const statusField = (
    <div className="pointer-events-auto px-3 pt-2 sm:px-5 lg:px-8">
      <label className="relative block w-[min(100vw-1.5rem,14rem)] sm:w-56">
        <span className="sr-only">Status</span>
        <select
          value={selectedStatus}
          onChange={onStatusChange}
          disabled={isPending}
          aria-busy={isPending}
          className="h-10 w-full appearance-none rounded-xl border border-sage/20 bg-white py-2 pr-10 pl-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/15 disabled:cursor-wait disabled:opacity-70"
        >
          <option value="">Alle Status</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
          aria-hidden
        >
          {isPending ? (
            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-sage/30 border-t-sage" />
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </label>
    </div>
  );

  return (
    <>
      {searchSlot ? createPortal(searchField, searchSlot) : null}
      {filterSlot ? createPortal(statusField, filterSlot) : null}
    </>
  );
}
