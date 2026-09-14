import { Suspense } from "react";
import { getStorefrontChrome } from "@/backend/services/storefront.service";
import { CartProvider } from "@/components/cart-provider";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

async function SiteFooterSlot() {
  const data = await getStorefrontChrome();
  return <SiteFooter settings={data.settings} hours={data.hours} />;
}

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LocaleProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <Suspense fallback={null}>
            <SiteFooterSlot />
          </Suspense>
        </div>
      </CartProvider>
    </LocaleProvider>
  );
}
