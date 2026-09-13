"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { MenuCategory } from "@/data/menu";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" strokeWidth="1.7" />
      <path d="m16 16 4 4" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CartBagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      aria-hidden
    >
      <path
        d="M3.5 4.5h2l1.8 10.1a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 1.9-1.5l1.2-6.5H6.4M9.5 20a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(price);
}

export function MenuCatalog({
  categories,
}: {
  categories: MenuCategory[];
}) {
  const [query, setQuery] = useState("");
  const { items: cartItems, addItem, updateQuantity } = useCart();
  const cartById = useMemo(
    () => new Map(cartItems.map((item) => [item.id, item])),
    [cartItems],
  );

  const visibleCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("de-CH");
    if (!normalizedQuery) return categories;

    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          [
            item.name,
            item.descriptionDe,
            item.descriptionEn,
            category.title,
            category.subtitle,
          ]
            .filter(Boolean)
            .join(" ")
            .toLocaleLowerCase("de-CH")
            .includes(normalizedQuery),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, query]);

  return (
    <>
      <div className="border-b border-ink/10 bg-paper px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <label className="relative mx-auto block max-w-2xl">
            <span className="sr-only">Gerichte suchen</span>
            <span className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-muted">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Gerichte oder Zutaten suchen …"
              className="w-full rounded-full border border-ink/12 bg-white py-4 pr-6 pl-14 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/65 focus:border-sage focus:ring-2 focus:ring-sage/15"
            />
          </label>
        </div>
      </div>

      <div className="bg-paper px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start xl:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-[118px] lg:max-h-[calc(100vh-142px)] lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="overflow-hidden rounded-3xl bg-ink text-cream shadow-lg">
              <div className="border-b border-white/10 px-5 py-5">
                <p className="text-[10px] font-semibold tracking-[0.26em] text-cream/70 uppercase">
                  Speisekarte
                </p>
                <h2 className="mt-1 font-serif text-2xl text-white">
                  Kategorien
                </h2>
              </div>
              <nav
                aria-label="Menükategorien"
                className="grid grid-cols-2 sm:grid-cols-3 lg:block"
              >
                {categories.map((category, index) => (
                  <a
                    key={category.id}
                    href={`#${category.id}`}
                    className="group flex items-center gap-3 border-b border-white/8 px-4 py-3.5 text-xs text-cream/70 transition hover:bg-sage hover:text-white sm:px-5 lg:last:border-b-0"
                  >
                    <span className="font-serif text-cream/55 transition group-hover:text-white/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{category.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0 space-y-20">
            {visibleCategories.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className="scroll-mt-44 [content-visibility:auto] [contain-intrinsic-size:auto_700px]"
            >
              <div className="mb-8 border-b border-sage/30 pb-6 text-center">
                    <p
                      translate="no"
                      className="notranslate text-[10px] font-semibold tracking-[0.28em] text-sage uppercase"
                    >
                      Safran Speisekarte
                    </p>
                    <h2 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">
                      {category.title}
                    </h2>
                    {category.subtitle && (
                      <p className="mt-2 text-sm text-muted">
                        {category.subtitle}
                      </p>
                    )}
                {(() => {
                  const noteDe = category.noteDe?.trim() || "";
                  const noteEn = category.noteEn?.trim() || "";
                  if (!noteDe && !noteEn) return null;
                  const same =
                    Boolean(noteDe && noteEn) &&
                    noteDe.localeCompare(noteEn, undefined, {
                      sensitivity: "accent",
                    }) === 0;
                  return (
                    <div
                      translate="no"
                      className="notranslate mt-5 rounded-2xl bg-sage/10 px-4 py-3 text-left text-xs leading-5 text-sage-deep sm:mx-auto sm:max-w-2xl"
                    >
                      <p>{noteDe || noteEn}</p>
                      {noteDe && noteEn && !same ? (
                        <p className="mt-1 text-muted">{noteEn}</p>
                      ) : null}
                    </div>
                  );
                })()}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {category.items.map((item) => {
                  const cartId = `menu-${item.number}`;
                  const cartItem = cartById.get(cartId);

                  return (
                    <article
                      key={item.number}
                      className="group flex min-h-52 flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sage/40 hover:shadow-lg sm:flex-row sm:p-4"
                    >
                      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-sage/10 sm:w-44">
                        <Image
                          src={item.imageUrl ?? "/brand/safran-parcel.jpg"}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) calc(100vw - 64px), 176px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 font-serif text-sm text-cream backdrop-blur-sm">
                          {String(item.number).padStart(2, "0")}.
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col px-2 pt-5 pb-2 sm:py-2 sm:pr-2 sm:pl-5">
                        <h3 className="font-serif text-xl leading-6 text-ink sm:text-2xl">
                          {item.name}
                        </h3>
                        {item.descriptionDe && (
                          <p className="mt-3 text-sm leading-6 text-muted">
                            {item.descriptionDe}
                          </p>
                        )}
                        {item.descriptionEn && (
                          <p className="mt-1 text-xs leading-5 text-muted/70">
                            {item.descriptionEn}
                          </p>
                        )}

                        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                          <p className="font-serif text-xl text-sage-deep">
                            {formatPrice(item.price)}
                          </p>

                          {cartItem ? (
                            <div className="flex items-center rounded-full border border-sage/40 bg-sage/8">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    cartId,
                                    cartItem.quantity - 1,
                                  )
                                }
                                aria-label={`${item.name} einmal weniger`}
                                className="flex h-10 w-10 items-center justify-center text-lg text-sage-deep transition hover:text-sage"
                              >
                                −
                              </button>
                              <span className="min-w-8 text-center text-sm font-semibold">
                                {cartItem.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    cartId,
                                    cartItem.quantity + 1,
                                  )
                                }
                                aria-label={`${item.name} einmal mehr`}
                                className="flex h-10 w-10 items-center justify-center text-lg text-sage-deep transition hover:text-sage"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                addItem({
                                  id: cartId,
                                  name: item.name,
                                  price: item.price,
                                  details: category.title,
                                })
                              }
                              className="btn-cart"
                              aria-label={`${item.name} hinzufügen`}
                            >
                              <span className="btn-cart-face">
                                <CartBagIcon />
                                <span>Hinzufügen</span>
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
            ))}

            {!visibleCategories.length && (
              <div className="py-24 text-center">
                <p className="font-serif text-3xl text-ink">
                  Kein Gericht gefunden
                </p>
                <p className="mt-3 text-sm text-muted">
                  Versuchen Sie einen anderen Suchbegriff.
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-6 rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-dark"
                >
                  Suche zurücksetzen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
