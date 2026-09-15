import type { Metadata } from "next";
import { getStorefrontChrome } from "@/backend/services/storefront.service";
import { ContactPageView } from "@/components/contact-page-view";
import { getStoreStatus } from "@/lib/store-status";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Adresse, Öffnungszeiten und Telefonnummer von Safran Romanshorn — indische Küche am Hafen.",
};

export default async function KontaktPage() {
  const chrome = await getStorefrontChrome();
  const status = getStoreStatus(chrome.statusConfig);

  return (
    <section className="bg-paper px-5 pt-32 pb-24 sm:px-8 sm:pt-36 sm:pb-32">
      <ContactPageView
        settings={chrome.settings}
        hours={chrome.hours}
        isOpen={status.open}
        closedMessage={status.message}
      />
    </section>
  );
}
