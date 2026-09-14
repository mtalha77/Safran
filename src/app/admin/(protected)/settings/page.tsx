import { getRestaurantSettings } from "@/backend/services/settings.service";
import { AdminSettingsView } from "@/components/admin/admin-settings-view";
import { getAdminContext } from "@/components/admin/data";

type SettingsPageProps = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;
  const { settings, availability, hours, orderAlert, error } =
    await getRestaurantSettings();
  // Remount forms after each save so defaultValue fields pick up DB values.
  const formKey = params.message ?? params.error ?? "settings";

  return (
    <AdminSettingsView
      message={params.message}
      error={params.error ?? error ?? undefined}
      formKey={formKey}
      settings={(settings ?? {}) as Record<string, unknown>}
      availability={availability}
      hours={hours}
      orderAlert={orderAlert}
    />
  );
}
