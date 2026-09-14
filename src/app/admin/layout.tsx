import type { Metadata } from "next";
import { caveat } from "@/lib/fonts";
import { LocaleProvider } from "@/lib/i18n/locale-context";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider defaultLocale="en" storageKey="safran-admin-locale">
      <div className={caveat.variable}>{children}</div>
    </LocaleProvider>
  );
}
