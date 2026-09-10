import "server-only";

/**
 * Single place the backend reaches for a Supabase client. These are the clients
 * that already exist — nothing new is instantiated here.
 *
 * - `createSessionClient`: cookie-scoped, runs as the signed-in user, RLS applies.
 *   Use it for anything a user is allowed to do themselves.
 * - `createServiceClient`: service-role, bypasses RLS, never reaches the browser.
 *   Use it only for trusted operations such as guest-order creation.
 */
export { createClient as createSessionClient } from "@/lib/supabase/server";
export { createServiceClient } from "@/lib/supabase/service";
export { getSupabasePublicEnv } from "@/lib/supabase/env";

export type SessionClient = Awaited<
  ReturnType<typeof import("@/lib/supabase/server").createClient>
>;

export type ServiceClient = ReturnType<
  typeof import("@/lib/supabase/service").createServiceClient
>;
