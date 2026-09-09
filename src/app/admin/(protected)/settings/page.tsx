import { updateOpeningHoursAction, updateSettingsAction } from "@/app/admin/actions";
import { getAdminContext } from "@/components/admin/data";
import { Card, Notice, PageHeader, buttonClass, fieldClass } from "@/components/admin/ui";

type SettingsPageProps = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;
  const [
    { data: settingsRows, error: settingsError },
    { data: availability, error: availabilityError },
    { data: hours, error: hoursError },
  ] = await Promise.all([
    context.supabase.from("site_settings").select("key, value").in("key", ["restaurant_name", "contact_email", "contact_phone", "address", "delivery_minimum", "pickup_minimum", "delivery_fee"]),
    context.supabase.from("store_availability").select("*").eq("id", true).maybeSingle(),
    context.supabase.from("opening_hours").select("*").order("weekday"),
  ]);
  const settings = Object.fromEntries((settingsRows ?? []).map((row) => [row.key, row.value]));
  const hoursByDay = new Map(hours?.map((row) => [row.weekday, row]));

  return (
    <>
      <PageHeader
        eyebrow="Konfiguration"
        title="Einstellungen"
        description="Kontaktdaten, Bestellarten, Gebühren und reguläre Öffnungszeiten verwalten."
      />
      <Notice message={params.message} error={params.error ?? settingsError?.message ?? availabilityError?.message ?? hoursError?.message} />

      <div className="space-y-5">
        <Card>
          <h2 className="font-serif text-2xl">Restaurant</h2>
          <form action={updateSettingsAction} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold sm:col-span-2">Restaurantname<input className={`${fieldClass} mt-1.5`} name="restaurant_name" defaultValue={String(settings.restaurant_name ?? "Safran")} required /></label>
            <label className="text-sm font-semibold">E-Mail<input className={`${fieldClass} mt-1.5`} name="email" type="email" defaultValue={String(settings.contact_email ?? "")} /></label>
            <label className="text-sm font-semibold">Telefon<input className={`${fieldClass} mt-1.5`} name="phone" type="tel" defaultValue={String(settings.contact_phone ?? "")} /></label>
            <label className="text-sm font-semibold sm:col-span-2">Adresse<input className={`${fieldClass} mt-1.5`} name="address" defaultValue={String(settings.address ?? "")} /></label>
            <label className="text-sm font-semibold">Liefer-Mindestwert (CHF)<input className={`${fieldClass} mt-1.5`} name="minimum_order" type="number" min="0" step="0.05" defaultValue={Number(settings.delivery_minimum ?? 0)} /></label>
            <label className="text-sm font-semibold">Abhol-Mindestwert (CHF)<input className={`${fieldClass} mt-1.5`} name="pickup_minimum" type="number" min="0" step="0.05" defaultValue={Number(settings.pickup_minimum ?? 0)} /></label>
            <label className="text-sm font-semibold">Liefergebühr (CHF)<input className={`${fieldClass} mt-1.5`} name="delivery_fee" type="number" min="0" step="0.05" defaultValue={Number(settings.delivery_fee ?? 0)} /></label>
            <label className="text-sm font-semibold">Vorlaufzeit (Minuten)<input className={`${fieldClass} mt-1.5`} name="minimum_notice_minutes" type="number" min="0" step="5" defaultValue={availability?.minimum_notice_minutes ?? 30} /></label>
            <div className="flex flex-wrap gap-5 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold"><input name="pickup_enabled" type="checkbox" defaultChecked={availability?.pickup_enabled ?? true} /> Abholung anbieten</label>
              <label className="flex items-center gap-2 text-sm font-semibold"><input name="delivery_enabled" type="checkbox" defaultChecked={availability?.delivery_enabled ?? true} /> Lieferung anbieten</label>
            </div>
            <button className={`${buttonClass} sm:col-span-2 sm:justify-self-start`}>Restaurant speichern</button>
          </form>
        </Card>

        <Card>
          <h2 className="font-serif text-2xl">Öffnungszeiten</h2>
          <p className="mt-1 text-sm text-muted">Pro Tag können zwei Zeitfenster, zum Beispiel Mittag und Abend, gepflegt werden.</p>
          <form action={updateOpeningHoursAction} className="mt-5">
            <div className="space-y-3">
              {days.map((day, index) => {
                const row = hoursByDay.get(index);
                return (
                  <fieldset key={day} className="rounded-xl border border-sage/20 bg-white p-3">
                    <div className="grid items-end gap-3 md:grid-cols-[130px_1fr_1fr_1fr_1fr]">
                      <div>
                        <legend className="font-semibold">{day}</legend>
                        <label className="mt-2 flex items-center gap-2 text-xs text-muted">
                          <input name={`day_${index}_closed`} type="checkbox" defaultChecked={row?.is_closed ?? index === 0} />
                          Geschlossen
                        </label>
                      </div>
                      <label className="text-xs font-semibold text-muted">Öffnet<input className={`${fieldClass} mt-1`} name={`day_${index}_open`} type="time" defaultValue={row?.lunch_opens?.slice(0, 5) ?? (index ? "11:00" : "")} /></label>
                      <label className="text-xs font-semibold text-muted">Schliesst<input className={`${fieldClass} mt-1`} name={`day_${index}_close`} type="time" defaultValue={row?.lunch_closes?.slice(0, 5) ?? (index ? "14:00" : "")} /></label>
                      <label className="text-xs font-semibold text-muted">Öffnet wieder<input className={`${fieldClass} mt-1`} name={`day_${index}_second_open`} type="time" defaultValue={row?.dinner_opens?.slice(0, 5) ?? (index ? "17:00" : "")} /></label>
                      <label className="text-xs font-semibold text-muted">Schliesst<input className={`${fieldClass} mt-1`} name={`day_${index}_second_close`} type="time" defaultValue={row?.dinner_closes?.slice(0, 5) ?? (index ? "22:30" : "")} /></label>
                    </div>
                  </fieldset>
                );
              })}
            </div>
            <button className={`${buttonClass} mt-5`}>Öffnungszeiten speichern</button>
          </form>
        </Card>
      </div>
    </>
  );
}
