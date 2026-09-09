import type { Metadata } from "next";
import { Amiri, DM_Sans, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StoreStatusBanner } from "@/components/store-status-banner";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Safran Romanshorn — Indische Küche online bestellen",
    template: "%s | Safran Romanshorn",
  },
  description:
    "Indische Küche in Romanshorn. Bestellen Sie zur Abholung oder Lieferung — ohne Anmeldung.",
  applicationName: "Safran Romanshorn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de-CH">
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${dmSans.variable} ${amiri.variable} min-h-screen bg-paper font-sans text-ink antialiased`}
      >
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <StoreStatusBanner />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
