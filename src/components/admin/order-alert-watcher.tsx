"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const POLL_MS = 5000;
const STORAGE_KEY = "safran-order-alert-seen-id";
const UNMUTE_KEY = "safran-order-alert-unmuted";

type PollPayload = {
  enabled: boolean;
  soundUrl: string | null;
  latestOrderId: string | null;
  latestOrderNumber: number | null;
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
 * Polls for new orders while any admin page is open.
 * Browsers block autoplay until the user unmutes once.
 */
export function OrderAlertWatcher() {
  const router = useRouter();
  const [unmuted, setUnmuted] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [lastOrderNumber, setLastOrderNumber] = useState<number | null>(null);
  const baselineReady = useRef(false);
  const soundUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setUnmuted(window.sessionStorage.getItem(UNMUTE_KEY) === "1");
  }, []);

  useEffect(() => {
    if (!unmuted) return;

    let cancelled = false;
    let timer: number | undefined;

    async function tick() {
      try {
        const response = await fetch("/api/admin/order-alerts", {
          cache: "no-store",
        });
        if (!response.ok || cancelled) return;
        const body = (await response.json()) as PollPayload;
        if (cancelled) return;

        setEnabled(Boolean(body.enabled));
        soundUrlRef.current = body.soundUrl;

        const latestId = body.latestOrderId;
        if (!latestId) return;

        if (!baselineReady.current) {
          baselineReady.current = true;
          window.sessionStorage.setItem(STORAGE_KEY, latestId);
          return;
        }

        const seen = window.sessionStorage.getItem(STORAGE_KEY);
        if (seen === latestId) return;

        window.sessionStorage.setItem(STORAGE_KEY, latestId);
        setLastOrderNumber(body.latestOrderNumber);

        if (body.enabled) {
          await playAlert(body.soundUrl);
          router.refresh();
        }
      } catch {
        /* network blip — retry next tick */
      }
    }

    void tick();
    timer = window.setInterval(() => void tick(), POLL_MS);
    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, [unmuted, router]);

  function enableSound() {
    window.sessionStorage.setItem(UNMUTE_KEY, "1");
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
      ) : null}
    </div>
  );
}
