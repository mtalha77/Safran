/**
 * Roles the platform will carry across the admin site, the customer app and the
 * rider app. `admin` is the legacy value stored by the first release and is
 * treated as `restaurant_admin`.
 *
 * Authorization is always enforced here and in Postgres RLS. Hiding a button in
 * the UI is never authorization.
 */
export const APP_ROLES = [
  "customer",
  "restaurant_staff",
  "restaurant_admin",
  "rider",
  "platform_admin",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

/** Value still present in `public.app_role` from the initial release. */
export const LEGACY_ADMIN_ROLE = "admin";

export type StoredRole = AppRole | typeof LEGACY_ADMIN_ROLE;

export type Capability =
  | "menu:manage"
  | "orders:read"
  | "orders:transition"
  | "settings:manage"
  | "riders:assign"
  | "deliveries:handle";

const CAPABILITIES: Record<AppRole, readonly Capability[]> = {
  customer: [],
  restaurant_staff: ["orders:read", "orders:transition"],
  restaurant_admin: [
    "menu:manage",
    "orders:read",
    "orders:transition",
    "settings:manage",
    "riders:assign",
  ],
  rider: ["deliveries:handle"],
  platform_admin: [
    "menu:manage",
    "orders:read",
    "orders:transition",
    "settings:manage",
    "riders:assign",
    "deliveries:handle",
  ],
};

/** Normalizes whatever is stored in `profiles.role` into a current role. */
export function normalizeRole(value: unknown): AppRole | null {
  if (value === LEGACY_ADMIN_ROLE) return "restaurant_admin";
  return APP_ROLES.includes(value as AppRole) ? (value as AppRole) : null;
}

export function can(role: AppRole | null, capability: Capability): boolean {
  return role ? CAPABILITIES[role].includes(capability) : false;
}

/** Back-office access: everything the current admin area exposes. */
export function isBackOfficeRole(role: AppRole | null): boolean {
  return can(role, "orders:read");
}
