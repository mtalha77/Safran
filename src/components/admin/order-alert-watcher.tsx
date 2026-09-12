"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** Backup poll if Realtime disconnects — keep short for near-live UX. */
const POLL_MS = 2500;
const STORAGE_KEY = "safran-order-alert-seen-id";
const UNMUTE_KEY = "safran-order-alert-unmuted";

type PollPayload = {
  enabled: boolean;
  soundUrl: string | null;
  latestOrderId: string | null;
  latestOrderNumber: string | number | null;
};

function playFallbackBeep() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    osc.start(now);
    osc.stop(now + 0.6);
    window.setTimeout(() => void ctx.close(), 800);
  } catch {
    /* ignore */
  }
}

async function playAlert(soundUrl: string | null) {
  if (soundUrl) {
    try {
      const audio = new Audio(soundUrl);
      audio.volume = 1;
      await audio.play();
      return;
    } catch {
      /* fall through to beep */
    }
  }
  playFallbackBeep();
}

/**
 * Live kitchen alerts: Supabase Realtime on new orders + short poll fallback.
 * Audio still needs one click ("Bestellalarm aktivieren") because browsers block autoplay.
 */
export function OrderAlertWatcher() {
  const router = useRouter();
  const [unmuted, setUnmuted] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [live, setLive] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<string | null>(null);
  const baselineReady = useRef(false);
  const soundUrlRef = useRef<string | null>(null);
  const enabledRef = useRef(true);
  const unmutedRef = useRef(false);
  const handlingRef = useRef(false);

  useEffect(() => {
    const on = window.sessionStorage.getItem(UNMUTE_KEY) === "1";
    setUnmuted(on);
    unmutedRef.current = on;
  }, []);

  useEffect(() => {
    unmutedRef.current = unmuted;
  }, [unmuted]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  async function handleNewOrder(orderId: string, orderNumber: string | number | null) {
    if (!orderId || handlingRef.current) return;

    if (!baselineReady.current) {
      baselineReady.current = true;
      window.sessionStorage.setItem(STORAGE_KEY, orderId);
      return;
    }

    const seen = window.sessionStorage.getItem(STORAGE_KEY);
    if (seen === orderId) return;

    handlingRef.current = true;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, orderId);
      setLastOrderNumber(orderNumber != null ? String(orderNumber) : null);

      // Always refresh the dashboard list — no manual reload needed.
      router.refresh();

      if (unmutedRef.current && enabledRef.current) {
        await playAlert(soundUrlRef.current);
      }
    } finally {
      handlingRef.current = false;
    }
  }

  // Load alert config once (and refresh occasionally via poll).
  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      try {
        const response = await fetch("/api/admin/order-alerts", {
          cache: "no-store",
        });
        if (!response.ok || cancelled) return;
        const body = (await response.json()) as PollPayload;
        if (cancelled) return;
        setEnabled(Boolean(body.enabled));
        soundUrlRef.current = body.soundUrl;
        if (body.latestOrderId && !baselineReady.current) {
          baselineReady.current = true;
          window.sessionStorage.setItem(STORAGE_KEY, body.latestOrderId);
        }
      } catch {
        /* ignore */
      }
    }

    void loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  // Instant: Realtime INSERT on orders.
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    const channel = supabase
      .channel("admin-order-alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          if (cancelled) return;
          const row = payload.new as {
            id?: string;
            order_number?: string | number | null;
          };
          if (!row.id) return;
          void handleNewOrder(row.id, row.order_number ?? null);
        },
      )
      .subscribe((status) => {
        if (!cancelled) setLive(status === "SUBSCRIBED");
      });

    return () => {
      cancelled = true;
      setLive(false);
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable handlers via refs
  }, [router]);

  // Fallback poll (also refreshes config). Faster when Realtime is down.
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function tick() {
      if (document.hidden) return;

      try {
        const response = await fetch("/api/admin/order-alerts", {
          cache: "no-store",
        });
        if (!response.ok || cancelled) return;
        const body = (await response.json()) as PollPayload;
        if (cancelled) return;

        setEnabled(Boolean(body.enabled));
        soundUrlRef.current = body.soundUrl;

        if (body.latestOrderId) {
          await handleNewOrder(body.latestOrderId, body.latestOrderNumber);
        }
      } catch {
        /* network blip */
      }
    }

    function onVisibility() {
      if (!document.hidden) void tick();
    }

    void tick();
    // When Realtime is live, poll less often; otherwise stay near-live.
    const interval = live ? 15_000 : POLL_MS;
    timer = window.setInterval(() => void tick(), interval);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, router]);

  function enableSound() {
    window.sessionStorage.setItem(UNMUTE_KEY, "1");
    unmutedRef.current = true;
    setUnmuted(true);
    void playAlert(soundUrlRef.current);
  }

  if (!enabled && unmuted) return null;

  return (
    <div className="fixed right-3 bottom-3 z-[60] flex max-w-xs flex-col items-end gap-2 sm:right-5">
      {lastOrderNumber ? (
        <p className="rounded-xl bg-sage-deep px-3 py-2 text-xs font-semibold text-white shadow-lg">
          Neue Bestellung #{lastOrderNumber}
        </p>
      ) : null}
      {!unmuted ? (
        <button
          type="button"
          onClick={enableSound}
          className="rounded-full border border-sage/30 bg-white px-4 py-2.5 text-sm font-semibold text-sage-deep shadow-lg transition hover:bg-cream"
        >
          Bestellalarm aktivieren
        </button>
      ) : (
        <p className="rounded-full border border-sage/25 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-muted shadow">
          {live ? "Live · Alarm an" : "Alarm an · verbindet…"}
        </p>
      )}
    </div>
  );
}
