import {
  updateOpeningHoursAction,
  updateSettingsAction,
} from "@/app/admin/actions";
import { getRestaurantSettings } from "@/backend/services/settings.service";
import { HoursDayFields } from "@/components/admin/hours-day-fields";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";
import { getAdminContext } from "@/components/admin/data";
import { Card, Notice, PageHeader, fieldClass } from "@/components/admin/ui";

type SettingsPageProps = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

const days = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

function timeValue(value: string | null | undefined) {
  return value?.slice(0, 5) ?? "";
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;
  const { settings, availability, hours, error } = await getRestaurantSettings();
  const hoursByDay = new Map(hours.map((row) => [row.weekday, row]));
  // Remount forms after each save so defaultValue fields pick up DB values.
  const formKey = params.message ?? params.error ?? "settings";

  return (
    <>
      <PageHeader
        eyebrow="Konfiguration"
        title="Einstellungen"
        description="Kontaktdaten, Bestellarten, Gebühren und reguläre Öffnungszeiten verwalten."
      />
      <Notice message={params.message} error={params.error ?? error ?? undefined} />

      <div className="space-y-5">
        <Card>
          <h2 className="font-serif text-2xl">Restaurant</h2>
          <form
            key={`restaurant-${formKey}`}
            action={updateSettingsAction}
            className="mt-5 grid gap-4 sm:grid-cols-2"
          >
            <label className="text-sm font-semibold sm:col-span-2">
              Restaurantname
              <input
                className={`${fieldClass} mt-1.5`}
                name="restaurant_name"
                defaultValue={String(settings.restaurant_name ?? "Safran")}
                required
              />
            </label>
            <label className="text-sm font-semibold">
              E-Mail
              <input
                className={`${fieldClass} mt-1.5`}
                name="email"
                type="email"
                defaultValue={String(settings.contact_email ?? "")}
              />
            </label>
            <label className="text-sm font-semibold">
              Telefon
              <input
                className={`${fieldClass} mt-1.5`}
                name="phone"
                type="tel"
                defaultValue={String(settings.contact_phone ?? "")}
              />
            </label>
            <label className="text-sm font-semibold sm:col-span-2">
              Adresse
              <input
                className={`${fieldClass} mt-1.5`}
                name="address"
                defaultValue={String(settings.address ?? "")}
              />
            </label>
            <label className="text-sm font-semibold">
              Liefer-Mindestwert (CHF)
              <input
                className={`${fieldClass} mt-1.5`}
                name="minimum_order"
                type="number"
                min="0"
                step="0.05"
                defaultValue={Number(settings.delivery_minimum ?? 0)}
              />
            </label>
            <label className="text-sm font-semibold">
              Abhol-Mindestwert (CHF)
              <input
                className={`${fieldClass} mt-1.5`}
                name="pickup_minimum"
                type="number"
                min="0"
                step="0.05"
                defaultValue={Number(settings.pickup_minimum ?? 0)}
              />
            </label>
            <label className="text-sm font-semibold">
              Liefergebühr (CHF)
              <input
                className={`${fieldClass} mt-1.5`}
                name="delivery_fee"
                type="number"
                min="0"
                step="0.05"
                defaultValue={Number(settings.delivery_fee ?? 0)}
              />
            </label>
            <label className="text-sm font-semibold">
              Vorlaufzeit (Minuten)
              <input
                className={`${fieldClass} mt-1.5`}
                name="minimum_notice_minutes"
                type="number"
                min="0"
                step="5"
                defaultValue={availability?.minimum_notice_minutes ?? 30}
              />
            </label>
            <div className="flex flex-wrap gap-5 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  name="pickup_enabled"
                  type="checkbox"
                  defaultChecked={availability?.pickup_enabled ?? true}
                />{" "}
                Abholung anbieten
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  name="delivery_enabled"
                  type="checkbox"
                  defaultChecked={availability?.delivery_enabled ?? true}
                />{" "}
                Lieferung anbieten
              </label>
            </div>
            <PendingSubmitButton className="sm:col-span-2 sm:justify-self-start">
              Restaurant speichern
            </PendingSubmitButton>
          </form>
        </Card>

        <Card>
          <h2 className="font-serif text-2xl">Öffnungszeiten</h2>
          <p className="mt-1 text-sm text-muted">
            Pro Tag können zwei Zeitfenster, zum Beispiel Mittag und Abend,
            gepflegt werden. Gespeicherte Zeiten gelten sofort für Website,
            Banner und Bestellungen.
          </p>
          <form
            key={`hours-${formKey}-${hours.map((h) => `${h.weekday}:${h.lunch_opens}`).join("|")}`}
            action={updateOpeningHoursAction}
            className="mt-5"
          >
            <div className="space-y-3">
              {days.map((day, index) => {
                const row = hoursByDay.get(index);
                return (
                  <HoursDayFields
                    key={day}
                    day={day}
                    index={index}
                    defaultClosed={row?.is_closed ?? index === 0}
                    lunchOpens={timeValue(row?.lunch_opens)}
                    lunchCloses={timeValue(row?.lunch_closes)}
                    dinnerOpens={timeValue(row?.dinner_opens)}
                    dinnerCloses={timeValue(row?.dinner_closes)}
                  />
                );
              })}
            </div>
            <PendingSubmitButton className="mt-5" pendingLabel="Öffnungszeiten werden gespeichert…">
              Öffnungszeiten speichern
            </PendingSubmitButton>
          </form>
        </Card>
      </div>
    </>
  );
}
