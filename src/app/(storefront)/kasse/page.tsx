import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { getStoreStatus } from "@/lib/store-status";
import { getStorefrontChrome } from "@/backend/services/storefront.service";

export const metadata: Metadata = {
  title: "Kasse",
  description:
    "Bestellen Sie indische Spezialitäten bei Safran Romanshorn zur Lieferung oder Abholung.",
};

export default async function KassePage() {
  const chrome = await getStorefrontChrome();
  const status = getStoreStatus(chrome.statusConfig);

  return (
    <section className="bg-paper px-5 pt-40 pb-24 sm:px-8 sm:pt-44 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-sage" />
            <p className="text-xs font-semibold tracking-[0.28em] text-sage uppercase">
              Sicher und ohne Konto
            </p>
          </div>
          <h1 className="mt-4 font-serif text-5xl leading-none text-ink sm:text-6xl">
            Ihre Bestellung
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted sm:text-base">
            Kontaktdaten eingeben, Lieferart wählen und direkt bestellen. Eine
            Registrierung ist nicht erforderlich.
          </p>
        </div>

        <CheckoutForm storeOpen={status.open} closedMessage={status.label} />
      </div>
    </section>
  );
}
