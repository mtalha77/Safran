import { getBackOfficeOverview } from "@/backend/services/order.service";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { getAdminContext } from "@/components/admin/data";

type OverviewProps = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

export default async function AdminOverviewPage({ searchParams }: OverviewProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;

  const { acceptsOrders, orders: recentOrders, kpis, error } =
    await getBackOfficeOverview();

  return (
    <AdminDashboardView
      acceptsOrders={acceptsOrders}
      recentOrders={recentOrders}
      kpis={kpis}
      message={params.message}
      error={params.error ?? error ?? undefined}
    />
  );
}
