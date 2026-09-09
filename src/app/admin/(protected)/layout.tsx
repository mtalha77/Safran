import { redirect } from "next/navigation";
import { getAdminContext } from "@/components/admin/data";
import { AdminShell, SetupState } from "@/components/admin/ui";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getAdminContext();
  if (context.state === "setup") return <SetupState />;
  if (context.state === "anonymous") redirect("/admin/login");
  if (context.state === "forbidden") redirect("/admin/login?error=Admin-Berechtigung%20erforderlich");

  return <AdminShell email={context.email}>{children}</AdminShell>;
}
