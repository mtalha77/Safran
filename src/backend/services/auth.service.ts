import "server-only";

import { isBackOfficeRole, normalizeRole } from "@/backend/domain/roles";
import { AuthorizationError, ValidationError } from "@/backend/errors";
import { createSessionClient } from "@/backend/supabase/clients";
import type { Actor } from "@/backend/types";

/**
 * Signs a user into the back office.
 *
 * The role is read from `profiles` after authentication, never from the login
 * form. A user without a back-office role is signed straight back out so no
 * partially privileged session can linger.
 */
export async function signInToBackOffice(input: {
  email: string;
  password: string;
}): Promise<Actor> {
  if (!input.email || !input.password) {
    throw new ValidationError(
      "credentials_required",
      "E-Mail und Passwort sind erforderlich.",
    );
  }

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.user) {
    throw new AuthorizationError(
      "unauthenticated",
      "Anmeldung fehlgeschlagen. Zugangsdaten prüfen.",
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  const role = normalizeRole(profile?.role);
  if (!isBackOfficeRole(role)) {
    await supabase.auth.signOut();
    throw new AuthorizationError(
      "forbidden",
      "Für dieses Konto fehlt die Admin-Berechtigung.",
    );
  }

  return { userId: data.user.id, email: data.user.email, role: role! };
}

export async function signOut(): Promise<void> {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
}
