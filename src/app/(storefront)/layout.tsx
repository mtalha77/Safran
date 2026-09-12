import { Suspense } from "react";
import { getStorefrontChrome } from "@/backend/services/storefront.service";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreStatusBanner } from "@/components/store-status-banner";

async function StoreStatusBannerSlot() {
  const data = await getStorefrontChrome();
  return <StoreStatusBanner config={data.statusConfig} />;
}

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
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Suspense
          fallback={
            <div
              className="fixed inset-x-0 top-0 z-[60] h-9 bg-sage"
              aria-hidden
            />
          }
        >
          <StoreStatusBannerSlot />
        </Suspense>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <Suspense fallback={null}>
          <SiteFooterSlot />
        </Suspense>
      </div>
    </CartProvider>
  );
}
