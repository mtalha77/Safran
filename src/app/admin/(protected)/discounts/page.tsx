import { listMenu } from "@/backend/services/menu.service";
import { AdminDiscountsView } from "@/components/admin/admin-discounts-view";
import { getAdminContext } from "@/components/admin/data";

type DiscountsPageProps = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

export default async function DiscountsAdminPage({ searchParams }: DiscountsPageProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;
  const { categories, items, error } = await listMenu();

  return (
    <AdminDiscountsView
      message={params.message}
      error={params.error ?? error ?? undefined}
      categories={(categories ?? [])
        .map((category) => ({ id: category.id, title: category.title }))
        .filter((category) => Boolean(category.id))}
      items={(items ?? []).map((item) => ({
        id: item.id,
        category_id: item.category_id,
        item_number: item.item_number,
        name: item.name,
        price: Number(item.price),
        discount_percent: Number(item.discount_percent ?? 0),
        is_active: item.is_active,
      }))}
    />
  );
}
