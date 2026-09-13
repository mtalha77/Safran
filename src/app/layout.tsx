import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
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
    <html lang="de-CH" translate="no" className="notranslate" data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${dmSans.variable} min-h-screen bg-paper font-sans text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
