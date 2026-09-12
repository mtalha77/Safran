import { caveat } from "@/lib/fonts";

export default function BestellungLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={caveat.variable}>{children}</div>;
}
