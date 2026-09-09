"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useCart } from "@/components/cart-provider";

type Fulfillment = "delivery" | "pickup";

const inputClass =
  "mt-2 w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-sage focus:ring-2 focus:ring-sage/15";

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

export function CheckoutForm() {
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
  const [submitting, setSubmitting] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length || !acceptedPolicy || submitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
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
            email: formData.get("email"),
            phone: formData.get("phone"),
          },
          address:
            fulfillment === "delivery"
              ? {
                  street: formData.get("street"),
                  houseNumber: formData.get("houseNumber"),
                  postalCode: formData.get("postalCode"),
                  city: formData.get("city"),
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
      };
      if (!response.ok || !result.confirmationToken) {
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
            <label className="text-sm font-medium">
              E-Mail
              <input
                className={inputClass}
                type="email"
                name="email"
                autoComplete="email"
                required
              />
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
          disabled={!items.length || !acceptedPolicy || submitting}
          className="mt-6 w-full rounded-full bg-sage px-6 py-4 text-sm font-semibold text-white transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Bestellung wird gesendet…" : "Zahlungspflichtig bestellen"}
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
