import type { Metadata } from "next";
import { caveat } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className={caveat.variable}>{children}</div>;
}
