"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { isValidEmailFormat } from "@/backend/validation/email-format";
import { useCart } from "@/components/cart-provider";
import { fetchLiveStoreAvailability } from "@/lib/live-store-status";

type Fulfillment = "delivery" | "pickup";

const inputClass =
  "mt-2 w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-sage focus:ring-2 focus:ring-sage/15";

const inputErrorClass =
  "mt-2 w-full rounded-xl border border-red-400 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-red-500 focus:ring-2 focus:ring-red-200";
function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(value);
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-none stroke-current"
      aria-hidden
    >
      <path
        d="M5 8h14l-1 12H6L5 8Zm4 1V6a3 3 0 0 1 6 0v3"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckoutForm({
  storeOpen = true,
  closedMessage,
}: {
  storeOpen?: boolean;
  closedMessage?: string;
}) {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [notice, setNotice] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailOk, setEmailOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const emailCheckSeq = useRef(0);
  const closedLabel =
    closedMessage || "Das Restaurant nimmt derzeit keine Bestellungen an.";

  useEffect(() => {
    const value = emailValue.trim().toLowerCase();
    if (!value) {
      setEmailError("");
      setEmailChecking(false);
      setEmailOk(false);
      return;
    }

    const at = value.indexOf("@");
    const domain = at >= 0 ? value.slice(at + 1) : "";

    // Still typing — wait until domain looks complete (has a TLD dot).
    if (at < 0 || !domain.includes(".")) {
      setEmailError("");
      setEmailChecking(false);
      setEmailOk(false);
      return;
    }

    if (!isValidEmailFormat(value)) {
      setEmailError(
        "Bitte eine gültige E-Mail-Adresse eingeben (z. B. name@domain.ch).",
      );
      setEmailChecking(false);
      setEmailOk(false);
      return;
    }

    setEmailError("");
    setEmailOk(false);
    setEmailChecking(true);
    const seq = ++emailCheckSeq.current;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const response = await fetch("/api/validate-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: value }),
          });
          const result = (await response.json().catch(() => null)) as {
            ok?: boolean;
            message?: string;
          } | null;
          if (seq !== emailCheckSeq.current) return;
          if (response.ok && result?.ok) {
            setEmailError("");
            setEmailOk(true);
            return;
          }
          // Network/server hiccups: if format is valid, don't block the guest.
          if (response.status >= 500 || response.status === 0) {
            setEmailError("");
            setEmailOk(true);
            return;
          }
          setEmailOk(false);
          setEmailError(
            result?.message ||
              "Diese E-Mail-Adresse scheint ungültig zu sein.",
          );
        } catch {
          if (seq !== emailCheckSeq.current) return;
          // Offline / fetch failed — format already OK, allow checkout.
          setEmailError("");
          setEmailOk(true);
        } finally {
          if (seq === emailCheckSeq.current) setEmailChecking(false);
        }
      })();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [emailValue]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // `event.currentTarget` is only valid while the handler runs synchronously;
    // React clears it once we await. Snapshot the field values up front so the
    // availability check below cannot invalidate them.
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!storeOpen) {
      setNotice(closedLabel);
      return;
    }

    if (!email || !isValidEmailFormat(email)) {
      setEmailError(
        "Bitte eine gültige E-Mail-Adresse eingeben (z. B. name@domain.ch).",
      );
      setEmailOk(false);
      return;
    }

    if (emailChecking || !emailOk) {
      setEmailChecking(true);
      try {
        const response = await fetch("/api/validate-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const result = (await response.json().catch(() => null)) as {
          ok?: boolean;
          message?: string;
        } | null;
        if (response.ok && result?.ok) {
          setEmailOk(true);
          setEmailError("");
        } else if (response.status >= 500) {
          // Don't block a format-valid email on server/DNS outages.
          setEmailOk(true);
          setEmailError("");
        } else {
          setEmailOk(false);
          setEmailError(
            result?.message ||
              "Diese E-Mail-Adresse scheint ungültig zu sein.",
          );
          return;
        }
      } catch {
        setEmailOk(true);
        setEmailError("");
      } finally {
        setEmailChecking(false);
      }
    }

    const live = await fetchLiveStoreAvailability();
    if (live?.closed) {
      setNotice(live.message || closedLabel);
      return;
    }
    if (!items.length || !acceptedPolicy || submitting) return;

    const key =
      idempotencyKey ||
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(36).slice(2)}`);
    setIdempotencyKey(key);
    setSubmitting(true);
    setNotice("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key,
        },
        body: JSON.stringify({
          idempotencyKey: key,
          fulfillment,
          paymentMethod: "cash",
          acceptedNoCancellation: acceptedPolicy,
          customer: {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email,
            phone: formData.get("phone"),
          },
          address:
            fulfillment === "delivery"
              ? {
                  street: formData.get("street"),
                  houseNumber: formData.get("houseNumber"),
                  postalCode: formData.get("postalCode"),
                  city: formData.get("city"),
                  locationUrl: formData.get("locationUrl") || undefined,
                }
              : undefined,
          notes: formData.get("notes"),
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            details: item.details,
          })),
        }),
      });
      const result = (await response.json()) as {
        confirmationToken?: string;
        message?: string;
        error?: string;
      };
      if (!response.ok || !result.confirmationToken) {
        if (
          result.error === "invalid_email" ||
          result.error === "invalid_email_domain" ||
          /e-?mail/i.test(result.message ?? "")
        ) {
          setEmailError(
            result.message ||
              "Diese E-Mail-Adresse scheint ungültig zu sein.",
          );
          setEmailOk(false);
          setSubmitting(false);
          return;
        }
        throw new Error(
          result.message || "Die Bestellung konnte nicht gesendet werden.",
        );
      }

      clearCart();
      router.push(`/bestellung/${result.confirmationToken}`);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Die Bestellung konnte nicht gesendet werden.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start"
    >
      {!storeOpen ? (
        <div
          role="status"
          className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-800 lg:col-span-2"
        >
          <p className="font-semibold">Derzeit geschlossen</p>
          <p className="mt-1">{closedLabel}</p>
        </div>
      ) : null}
      <div className="space-y-6">
        <fieldset className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm sm:p-7">
          <legend className="sr-only">
            Wie möchten Sie bestellen?
          </legend>
          <h2 className="font-serif text-2xl text-ink">
            Wie möchten Sie bestellen?
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              {
                value: "delivery" as const,
                title: "Lieferung",
                description: "Zu Ihnen nach Hause",
              },
              {
                value: "pickup" as const,
                title: "Abholung",
                description: "Direkt im Restaurant",
              },
            ].map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  fulfillment === option.value
                    ? "border-sage bg-sage/8 ring-1 ring-sage"
                    : "border-ink/10 hover:border-sage/50"
                }`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value={option.value}
                  checked={fulfillment === option.value}
                  onChange={() => setFulfillment(option.value)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold">
                  {option.title}
                </span>
                <span className="mt-1 block text-xs text-muted">
                  {option.description}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm sm:p-7">
          <legend className="sr-only">Kontaktdaten</legend>
          <h2 className="font-serif text-2xl text-ink">Kontaktdaten</h2>
          <div className="mt-3 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Vorname
              <input
                className={inputClass}
                type="text"
                name="firstName"
                autoComplete="given-name"
                required
              />
            </label>
            <label className="text-sm font-medium">
              Nachname
              <input
                className={inputClass}
                type="text"
                name="lastName"
                autoComplete="family-name"
                required
              />
            </label>
            <label className="text-sm font-medium sm:col-span-1">
              E-Mail
              <input
                className={emailError ? inputErrorClass : inputClass}
                type="email"
                name="email"
                autoComplete="email"
                required
                inputMode="email"
                value={emailValue}
                aria-invalid={emailError ? true : undefined}
                aria-describedby="checkout-email-status"
                onChange={(event) => setEmailValue(event.currentTarget.value)}
              />
              <span
                id="checkout-email-status"
                className={`mt-1.5 block text-xs font-normal ${
                  emailError
                    ? "text-red-700"
                    : emailOk
                      ? "text-emerald-700"
                      : "text-muted"
                }`}
                aria-live="polite"
              >
                {emailError
                  ? emailError
                  : emailChecking
                    ? "E-Mail wird geprüft…"
                    : emailOk
                      ? "E-Mail ist gültig."
                      : "Bestellbestätigung und Status-Updates gehen an diese Adresse."}
              </span>
            </label>
            <label className="text-sm font-medium">
              Telefonnummer
              <input
                className={inputClass}
                type="tel"
                name="phone"
                autoComplete="tel"
                required
              />
            </label>
          </div>
        </fieldset>

        {fulfillment === "delivery" && (
          <fieldset className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm sm:p-7">
            <legend className="sr-only">Lieferadresse</legend>
            <h2 className="font-serif text-2xl text-ink">Lieferadresse</h2>
            <div className="mt-3 grid gap-5 sm:grid-cols-6">
              <label className="text-sm font-medium sm:col-span-4">
                Strasse
                <input
                  className={inputClass}
                  type="text"
                  name="street"
                  autoComplete="address-line1"
                  required
                />
              </label>
              <label className="text-sm font-medium sm:col-span-2">
                Hausnummer
                <input
                  className={inputClass}
                  type="text"
                  name="houseNumber"
                  required
                />
              </label>
              <label className="text-sm font-medium sm:col-span-2">
                PLZ
                <input
                  className={inputClass}
                  type="text"
                  name="postalCode"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  required
                />
              </label>
              <label className="text-sm font-medium sm:col-span-4">
                Ort
                <input
                  className={inputClass}
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  required
                />
              </label>
              <label className="text-sm font-medium sm:col-span-6">
                Ihr Standort (Link)
                <input
                  className={inputClass}
                  type="url"
                  name="locationUrl"
                  inputMode="url"
                  placeholder="https://maps.google.com/… oder WhatsApp-Standort"
                />
                <span className="mt-1.5 block text-xs font-normal text-muted">
                  Optional — Google Maps, Apple Maps oder WhatsApp-Standortlink einfügen.
                </span>
              </label>
            </div>
          </fieldset>
        )}

        <fieldset className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm sm:p-7">
          <legend className="sr-only">Zahlung</legend>
          <h2 className="font-serif text-2xl text-ink">Zahlung</h2>
          <div className="mt-3 space-y-3">
            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-sage bg-sage/8 p-4">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked
                readOnly
                className="h-4 w-4 accent-sage"
              />
              <span>
                <span className="block text-sm font-semibold">
                  {fulfillment === "delivery"
                    ? "Bar bei Lieferung"
                    : "Bar bei Abholung"}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  Direkt beim Erhalt bezahlen
                </span>
              </span>
            </label>
            <div
              aria-disabled="true"
              className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-ink/[0.02] p-4 opacity-55"
            >
              <input
                type="radio"
                disabled
                aria-label="Online bezahlen – derzeit nicht verfügbar"
                className="h-4 w-4"
              />
              <span>
                <span className="block text-sm font-semibold">
                  Online bezahlen
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  Karte und TWINT – derzeit nicht verfügbar
                </span>
              </span>
            </div>
          </div>
        </fieldset>

        <label className="block rounded-3xl border border-ink/10 bg-white p-5 text-sm font-medium shadow-sm sm:p-7">
          Bemerkungen zur Bestellung
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            name="notes"
            placeholder="Zum Beispiel Hinweise zur Lieferung"
          />
        </label>
      </div>

      <aside className="rounded-3xl bg-ink p-5 text-cream shadow-xl sm:p-7 lg:sticky lg:top-32">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl text-white">Ihre Bestellung</h2>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-cream">
            {itemCount} Artikel
          </span>
        </div>

        {items.length ? (
          <ul className="mt-6 divide-y divide-white/10">
            {items.map((item) => (
              <li key={item.id} className="py-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    {item.details && (
                      <p className="mt-1 text-xs leading-5 text-cream/50">
                        {item.details}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-sm text-cream">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-white/15">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      aria-label={`${item.name} einmal weniger`}
                      className="flex h-8 w-8 items-center justify-center text-cream/70 transition hover:text-white"
                    >
                      −
                    </button>
                    <span className="min-w-7 text-center text-xs">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      aria-label={`${item.name} einmal mehr`}
                      className="flex h-8 w-8 items-center justify-center text-cream/70 transition hover:text-white"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-cream/45 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    Entfernen
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 px-5 py-9 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-cream">
              <BagIcon />
            </span>
            <p className="mt-4 text-sm font-semibold text-white">
              Ihr Warenkorb ist leer
            </p>
            <p className="mt-2 text-xs leading-5 text-cream/50">
              Wählen Sie zuerst Ihre Lieblingsgerichte aus.
            </p>
            <Link
              href="/speisekarte"
              className="mt-5 inline-flex rounded-full border border-cream/50 px-5 py-2.5 text-xs font-semibold text-cream transition hover:bg-sage hover:text-white"
            >
              Zur Speisekarte
            </Link>
          </div>
        )}

        <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
          <div className="flex justify-between text-cream/60">
            <span>Zwischensumme</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-cream/60">
            <span>{fulfillment === "delivery" ? "Lieferkosten" : "Abholung"}</span>
            <span>
              {fulfillment === "delivery"
                ? "Nach Adresse"
                : formatCurrency(0)}
            </span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-4 font-serif text-xl text-white">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <p className="text-right text-[10px] text-cream/40">
            Preise inklusive MwSt.
          </p>
        </div>

        <label className="mt-6 flex items-start gap-3 text-xs leading-5 text-cream/60">
          <input
            type="checkbox"
            checked={acceptedPolicy}
            onChange={(event) => setAcceptedPolicy(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-sage"
            required
          />
          <span>
            Ich bestätige, dass die Bestellung nach dem Absenden nicht
            storniert werden kann.
          </span>
        </label>

        <button
          type="submit"
          disabled={
            !storeOpen ||
            !items.length ||
            !acceptedPolicy ||
            submitting ||
            emailChecking ||
            Boolean(emailError) ||
            (Boolean(emailValue.trim()) && !emailOk)
          }
          className="mt-6 w-full rounded-full bg-gold px-6 py-4 text-sm font-semibold text-ink transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {!storeOpen
            ? "Derzeit geschlossen"
            : submitting
              ? "Bestellung wird gesendet…"
              : emailChecking
                ? "E-Mail wird geprüft…"
                : "Zahlungspflichtig bestellen"}
        </button>

        {notice && (
          <p
            className="mt-4 rounded-xl bg-white/5 p-3 text-xs leading-5 text-cream/60"
            aria-live="polite"
          >
            {notice}
          </p>
        )}
      </aside>
    </form>
  );
}
