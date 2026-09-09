import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreStatusBanner } from "@/components/store-status-banner";
import { getStorefrontChrome } from "@/lib/storefront-data";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getStorefrontChrome();

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <StoreStatusBanner config={data.statusConfig} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={data.settings} hours={data.hours} />
      </div>
    </CartProvider>
  );
}
