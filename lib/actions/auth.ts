"use server";

import { redirect } from "next/navigation";
import {
  adminPassword,
  createSession,
  deleteSession,
  safePasswordEqual,
} from "@/lib/session";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const candidate = String(formData.get("password") ?? "");
  const expected = adminPassword();

  if (!expected) {
    return {
      error:
        "Mot de passe administrateur non configuré : définissez ADMIN_PASSWORD.",
    };
  }

  if (!safePasswordEqual(candidate, expected)) {
    return { error: "Mot de passe incorrect." };
  }

  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/admin");
}
