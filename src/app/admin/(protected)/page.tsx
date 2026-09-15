import {
  getBackOfficeOverview,
  resolveOverviewRange,
  restaurantDateKey,
} from "@/backend/services/order.service";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { getAdminContext } from "@/components/admin/data";

type OverviewProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
    from?: string;
    to?: string;
  }>;
};

export default async function AdminOverviewPage({ searchParams }: OverviewProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;

  const range = resolveOverviewRange({ from: params.from, to: params.to });
  const { acceptsOrders, orders: recentOrders, kpis, error } =
    await getBackOfficeOverview(range);

  return (
    <AdminDashboardView
      acceptsOrders={acceptsOrders}
      recentOrders={recentOrders}
      kpis={kpis}
      range={range}
      today={restaurantDateKey()}
      message={params.message}
      error={params.error ?? error ?? undefined}
    />
  );
}
