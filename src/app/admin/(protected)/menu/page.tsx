import {
  createCategoryAction,
  createMenuItemAction,
  deleteCategoryAction,
  deleteMenuItemAction,
  replaceMenuItemImageAction,
  setMenuItemAvailabilityAction,
  updateCategoryAction,
  updateMenuItemAction,
} from "@/app/admin/actions";
import { listMenu } from "@/backend/services/menu.service";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";
import { formatMoney, getAdminContext } from "@/components/admin/data";
import {
  Card,
  EmptyState,
  Notice,
  PageHeader,
  fieldClass,
} from "@/components/admin/ui";

type MenuPageProps = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

export default async function MenuAdminPage({ searchParams }: MenuPageProps) {
  const [params, context] = await Promise.all([searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;
  const { categories, items, error } = await listMenu();

  return (
    <>
      <PageHeader
        eyebrow="Sortiment"
        title="Speisekarte"
        description="Kategorien und Gerichte bearbeiten, sortieren oder vorÃÂ¼bergehend ausblenden."
      />
      <Notice message={params.message} error={params.error ?? error ?? undefined} />

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="space-y-5">
          <Card>
            <h2 className="font-serif text-xl">Neue Kategorie</h2>
            <form action={createCategoryAction} className="mt-4 space-y-3">
              <label className="block text-sm font-semibold">
                Name
                <input className={`${fieldClass} mt-1`} name="name" required />
              </label>
              <label className="block text-sm font-semibold">
                Beschreibung
                <input className={`${fieldClass} mt-1`} name="description" />
              </label>
              <label className="block text-sm font-semibold">
                Position
                <input
                  className={`${fieldClass} mt-1`}
                  name="sort_order"
                  type="number"
                  defaultValue={categories?.length ?? 0}
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input name="is_active" type="checkbox" defaultChecked /> Im Shop
                sichtbar
              </label>
              <PendingSubmitButton className="w-full" pendingLabel="Wird erstellt...">
                Kategorie erstellen
              </PendingSubmitButton>
            </form>
          </Card>

          <Card>
            <h2 className="font-serif text-xl">Kategorien</h2>
            {!categories?.length ? (
              <div className="mt-4">
                <EmptyState title="Keine Kategorien">
                  Erstelle zuerst eine Kategorie.
                </EmptyState>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                  {categories.map((category) => (
                    <details
                      key={category.id}
                      className="rounded-xl border border-sage/20 bg-white"
                    >
                      <summary className="cursor-pointer list-none px-3 py-3 text-sm font-semibold">
                        <span className="flex items-center justify-between gap-2">
                          <span>
                            {category.sort_order}. {category.title}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] ${
                              category.is_active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {category.is_active ? "sichtbar" : "verborgen"}
                          </span>
                        </span>
                      </summary>
                      <div className="border-t border-sage/15 p-3">
                        <form action={updateCategoryAction} className="space-y-2">
                          <input type="hidden" name="id" value={category.id} />
                          <input
                            className={fieldClass}
                            name="name"
                            defaultValue={category.title}
                            required
                            aria-label="Kategoriename"
                          />
                          <input
                            className={fieldClass}
                            name="description"
                            defaultValue={category.subtitle ?? ""}
                            aria-label="Beschreibung"
                          />
                          <input
                            className={fieldClass}
                            name="sort_order"
                            type="number"
                            defaultValue={category.sort_order}
                            aria-label="Position"
                          />
                          <label className="flex items-center gap-2 text-xs">
                            <input
                              name="is_active"
                              type="checkbox"
                              defaultChecked={category.is_active}
                            />{" "}
                            Im Shop sichtbar
                          </label>
                          <PendingSubmitButton className="w-full">
                            Speichern
                          </PendingSubmitButton>
                        </form>
                        <form action={deleteCategoryAction} className="mt-2">
                          <input type="hidden" name="id" value={category.id} />
                          <PendingSubmitButton
                            variant="danger"
                            className="w-full"
                            pendingLabel="Wird gelÃÂ¶scht..."
                          >
                            Leere Kategorie lÃÂ¶schen
                          </PendingSubmitButton>
                        </form>
                      </div>
                    </details>
                  ))}
                </div>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <details>
              <summary className="cursor-pointer list-none">
                <span className="flex items-center justify-between">
                  <span className="font-serif text-xl">Neues Gericht</span>
                  <span className="inline-flex min-h-10 items-center justify-center rounded-xl bg-sage-deep px-4 py-2 text-sm font-semibold text-white">
                    + HinzufÃÂ¼gen
                  </span>
                </span>
              </summary>
              <form
                action={createMenuItemAction}
                className="mt-5 grid gap-3 sm:grid-cols-2"
              >
                <label className="text-sm font-semibold">
                  Kategorie
                  <select
                    className={`${fieldClass} mt-1`}
                    name="category_id"
                    required
                  >
                    <option value="">AuswÃÂ¤hlen</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold">
                  Nummer
                  <input
                    className={`${fieldClass} mt-1`}
                    name="number"
                    type="number"
                    required
                  />
                </label>
                <label className="text-sm font-semibold sm:col-span-2">
                  Name
                  <input className={`${fieldClass} mt-1`} name="name" required />
                </label>
                <label className="text-sm font-semibold sm:col-span-2">
                  Beschreibung DE
                  <textarea
                    className={`${fieldClass} mt-1`}
                    name="description_de"
                    rows={2}
                  />
                </label>
                <label className="text-sm font-semibold sm:col-span-2">
                  Beschreibung EN
                  <textarea
                    className={`${fieldClass} mt-1`}
                    name="description_en"
                    rows={2}
                  />
                </label>
                <label className="text-sm font-semibold">
                  Preis (CHF)
                  <input
                    className={`${fieldClass} mt-1`}
                    name="price"
                    type="number"
                    min="0"
                    step="0.05"
                    required
                  />
                </label>
                <label className="text-sm font-semibold">
                  Position
                  <input
                    className={`${fieldClass} mt-1`}
                    name="sort_order"
                    type="number"
                    defaultValue={items?.length ?? 0}
                  />
                </label>
                <label className="text-sm font-semibold sm:col-span-2">
                  Bild (max. 5 MB, wird automatisch komprimiert)
                  <input
                    className={`${fieldClass} mt-1`}
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input name="is_available" type="checkbox" defaultChecked />{" "}
                  VerfÃÂ¼gbar
                </label>
                <PendingSubmitButton
                  className="sm:col-span-2"
                  pendingLabel="Wird erstellt..."
                >
                  Gericht erstellen
                </PendingSubmitButton>
              </form>
            </details>
          </Card>

          {!categories?.length || !items?.length ? (
            <Card>
              <EmptyState title="Noch keine Gerichte">
                Gerichte erscheinen hier, sobald sie angelegt wurden.
              </EmptyState>
            </Card>
          ) : (
            categories.map((category) => {
              const categoryItems = items.filter(
                (item) => item.category_id === category.id,
              );
              if (!categoryItems.length) return null;
              return (
                <Card key={category.id}>
                  <div className="mb-4">
                    <h2 className="font-serif text-2xl">{category.title}</h2>
                    <p className="text-sm text-muted">
                      {categoryItems.length} Gerichte
                    </p>
                  </div>
                  <div className="space-y-3">
                    {categoryItems.map((item) => (
                      <details
                        key={item.id}
                        className="overflow-hidden rounded-xl border border-sage/20 bg-white"
                      >
                        <summary className="cursor-pointer list-none p-3">
                          <span className="flex items-center gap-3">
                            <span
                              aria-hidden="true"
                              className="h-14 w-14 shrink-0 rounded-lg bg-cream bg-cover bg-center"
                              style={
                                item.imageUrl
                                  ? {
                                      backgroundImage: `url("${item.imageUrl.replace(/"/g, "%22")}")`,
                                    }
                                  : undefined
                              }
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold">
                                {item.item_number}. {item.name}
                              </span>
                              <span className="mt-1 block text-xs text-muted">
                                {formatMoney(item.price)} ÃÂ· Position{" "}
                                {item.sort_order}
                              </span>
                            </span>
                            <span
                              className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                                item.is_active
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.is_active ? "verfÃÂ¼gbar" : "ausverkauft"}
                            </span>
                          </span>
                        </summary>
                        <div className="border-t border-sage/15 p-4">
                          <form
                            action={setMenuItemAvailabilityAction}
                            className="mb-4"
                          >
                            <input type="hidden" name="id" value={item.id} />
                            <input
                              type="hidden"
                              name="is_available"
                              value={item.is_active ? "false" : "true"}
                            />
                            <PendingSubmitButton
                              variant="secondary"
                              pendingLabel="Wird aktualisiert..."
                            >
                              {item.is_active
                                ? "Als ausverkauft markieren"
                                : "Wieder verfÃÂ¼gbar machen"}
                            </PendingSubmitButton>
                          </form>
                          <form
                            action={updateMenuItemAction}
                            className="grid gap-3 sm:grid-cols-2"
                          >
                            <input type="hidden" name="id" value={item.id} />
                            <label className="text-xs font-semibold">
                              Kategorie
                              <select
                                className={`${fieldClass} mt-1`}
                                name="category_id"
                                defaultValue={item.category_id}
                              >
                                {categories.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.title}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="text-xs font-semibold">
                              Nummer
                              <input
                                className={`${fieldClass} mt-1`}
                                name="number"
                                type="number"
                                defaultValue={item.item_number}
                              />
                            </label>
                            <label className="text-xs font-semibold sm:col-span-2">
                              Name
                              <input
                                className={`${fieldClass} mt-1`}
                                name="name"
                                defaultValue={item.name}
                                required
                              />
                            </label>
                            <label className="text-xs font-semibold sm:col-span-2">
                              Beschreibung DE
                              <textarea
                                className={`${fieldClass} mt-1`}
                                name="description_de"
                                defaultValue={item.description_de ?? ""}
                                rows={2}
                              />
                            </label>
                            <label className="text-xs font-semibold sm:col-span-2">
                              Beschreibung EN
                              <textarea
                                className={`${fieldClass} mt-1`}
                                name="description_en"
                                defaultValue={item.description_en ?? ""}
                                rows={2}
                              />
                            </label>
                            <label className="text-xs font-semibold">
                              Preis
                              <input
                                className={`${fieldClass} mt-1`}
                                name="price"
                                type="number"
                                min="0"
                                step="0.05"
                                defaultValue={item.price}
                              />
                            </label>
                            <label className="text-xs font-semibold">
                              Position
                              <input
                                className={`${fieldClass} mt-1`}
                                name="sort_order"
                                type="number"
                                defaultValue={item.sort_order}
                              />
                            </label>
                            <label className="flex items-center gap-2 text-xs">
                              <input
                                name="is_available"
                                type="checkbox"
                                defaultChecked={item.is_active}
                              />{" "}
                              VerfÃÂ¼gbar
                            </label>
                            <PendingSubmitButton className="sm:col-span-2">
                              ÃÂnderungen speichern
                            </PendingSubmitButton>
                          </form>
                          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                            <form
                              action={replaceMenuItemImageAction}
                              className="flex flex-col gap-2 sm:flex-row"
                            >
                              <input type="hidden" name="id" value={item.id} />
                              <input
                                className={fieldClass}
                                name="image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                required
                              />
                              <PendingSubmitButton
                                variant="secondary"
                                pendingLabel="Bild wird komprimiert..."
                              >
                                Bild ersetzen
                              </PendingSubmitButton>
                            </form>
                            <form action={deleteMenuItemAction}>
                              <input type="hidden" name="id" value={item.id} />
                              <PendingSubmitButton
                                variant="danger"
                                className="w-full"
                                pendingLabel="Wird gelÃÂ¶scht..."
                              >
                                LÃÂ¶schen
                              </PendingSubmitButton>
                            </form>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
