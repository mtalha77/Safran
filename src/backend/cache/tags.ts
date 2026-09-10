export const CACHE_TAGS = {
  chrome: "storefront-chrome",
  menu: "storefront-menu",
  status: "store-status",
} as const;

/**
 * A page's revalidate window is the shortest window among the reads it performs,
 * so a short status TTL would re-render the whole storefront — including the
 * large menu page — on that interval. Open/closed freshness does not need it:
 *
 *  - closing from the admin calls `updateTag(status)`, invalidating immediately;
 *  - the storefront banner polls availability directly every 20s, so a stale
 *    cached page still flips within seconds;
 *  - checkout re-checks availability server-side before an order is accepted.
 *
 * Keeping all three windows aligned therefore costs no freshness and avoids a
 * large amount of background re-rendering and Supabase traffic.
 */
export const CACHE_SECONDS = {
  chrome: 300,
  menu: 300,
  status: 300,
} as const;
