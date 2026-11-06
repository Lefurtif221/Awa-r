"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";

const INITIAL: LoginState = {};

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(login, INITIAL);

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-surface-container-lowest shadow-float border border-[#F0E2DE] p-8">
        <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
          Administration
        </span>
        <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mt-2 mb-2">
          Espace boutique
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          Gérez les produits, les prix et les collections d&apos;AWA-R Voiles.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-label-lg text-label-lg text-primary">
              Mot de passe
            </span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="h-12 px-4 rounded-lg bg-surface-container-lowest border border-[#E8D7D3] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:field-focus transition-shadow"
              placeholder="••••••••"
            />
          </label>

          {state.error ? (
            <p
              role="alert"
              className="font-body-sm text-body-sm text-error bg-error-container rounded-lg px-3 py-2"
            >
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="h-12 rounded-lg bg-primary-container text-surface font-label-lg text-label-lg hover:bg-primary transition-colors disabled:opacity-60"
          >
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
