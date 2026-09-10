/**
 * Provisions a back-office login.
 *
 * Creates (or re-points) a Supabase auth user and gives its `profiles` row an
 * admin role, so the account passes the back-office check in
 * `signInToBackOffice`. Requires the schema migrations to be applied first,
 * because the role lives in `public.profiles`.
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts <email> <password>
 *   npx tsx scripts/create-admin.ts --check      (report readiness only)
 */
import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";

import type { Database } from "../src/types/database";

loadEnv({ path: [".env.local", ".env"], quiet: true });

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? "";

if (!url || !serviceRoleKey) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY first.",
  );
}

const admin = createClient<Database>(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function reportReadiness(): Promise<boolean> {
  const { error: profilesError } = await admin
    .from("profiles")
    .select("id")
    .limit(1);
  const { error: authError } = await admin.auth.admin.listUsers({ perPage: 1 });

  console.log(
    `auth service:    ${authError ? `UNAVAILABLE (${authError.message})` : "reachable"}`,
  );
  console.log(
    `public.profiles: ${profilesError ? `MISSING (${profilesError.message})` : "present"}`,
  );

  return !profilesError && !authError;
}

async function main() {
  const [emailArg, passwordArg] = process.argv.slice(2);

  if (emailArg === "--check" || !emailArg) {
    const ready = await reportReadiness();
    console.log(
      ready
        ? "READY: schema applied, an admin can be provisioned."
        : "NOT READY: apply the migrations before provisioning an admin.",
    );
    return;
  }

  if (!passwordArg) throw new Error("Provide a password as the second argument.");
  if (!(await reportReadiness())) {
    throw new Error("Schema not ready; aborting without changes.");
  }

  // Reuse the account when it already exists so re-running is safe.
  const { data: list, error: listError } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });
  if (listError) throw listError;

  const existing = list.users.find(
    (user) => user.email?.toLowerCase() === emailArg.toLowerCase(),
  );

  let userId: string;
  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password: passwordArg,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`updated existing auth user ${emailArg}`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: emailArg,
      password: passwordArg,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`created auth user ${emailArg}`);
  }

  // `restaurant_admin` exists only once the roles migration has run. Fall back to
  // the legacy `admin` value, which the app normalizes to the same permissions,
  // so this works whether or not that migration has been applied.
  // `profiles` holds only the role; the email lives in `auth.users`.
  let roleApplied = "restaurant_admin";
  let { error: profileError } = await admin
    .from("profiles")
    .upsert({ id: userId, role: "restaurant_admin" }, { onConflict: "id" });

  if (profileError) {
    console.log(
      `'restaurant_admin' not accepted (${profileError.message}); using legacy 'admin'`,
    );
    roleApplied = "admin";
    ({ error: profileError } = await admin
      .from("profiles")
      .upsert({ id: userId, role: "admin" as never }, { onConflict: "id" }));
  }
  if (profileError) {
    throw new Error(`could not set profile role: ${profileError.message}`);
  }
  console.log(`role written: ${roleApplied}`);

  // End-to-end check with the public key, exactly as the login form would do it.
  const publicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";
  if (!publicKey) {
    console.log("no public key configured; skipping sign-in verification");
    return;
  }

  const asUser = createClient<Database>(url, publicKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: signIn, error: signInError } =
    await asUser.auth.signInWithPassword({
      email: emailArg,
      password: passwordArg,
    });
  if (signInError) throw new Error(`sign-in failed: ${signInError.message}`);

  const { data: profile, error: readError } = await asUser
    .from("profiles")
    .select("role")
    .eq("id", signIn.user.id)
    .maybeSingle();

  console.log(
    `sign-in verified; profile reads back as role=${profile?.role ?? "unreadable"}${
      readError ? ` (${readError.message})` : ""
    }`,
  );
  await asUser.auth.signOut();
  console.log("done — this account can now sign in at /admin/login");
}

void main();
