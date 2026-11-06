"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  saveCategory,
  type CategoryFormState,
} from "@/lib/actions/categories";
import { slugify, cn } from "@/lib/format";
import type { Category } from "@/lib/types";

const INITIAL: CategoryFormState = {};

type Props = { category?: Category };

export default function CategoryForm({ category }: Props) {
  const [state, formAction, pending] = useActionState(saveCategory, INITIAL);
  const [label, setLabel] = useState(category?.label ?? "");
  const [manualSlug, setManualSlug] = useState(category?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(category));
  const [image, setImage] = useState(category?.image ?? "");

  const slug = slugEdited ? manualSlug : slugify(label);

  const inputClass =
    "w-full h-11 px-3 rounded-lg bg-surface-container-lowest border border-[#E8D7D3] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:field-focus transition-shadow";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {category ? (
        <input type="hidden" name="originalSlug" value={category.slug} />
      ) : null}

      <label className="flex flex-col gap-1.5">
        <span className="font-label-lg text-label-lg text-primary">
          Nom de la catégorie *
        </span>
        <input
          name="label"
          required
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          className={inputClass}
          placeholder="Robes de soirée"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-label-lg text-label-lg text-primary">
          Slug (URL)
        </span>
        <input
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugEdited(true);
            setManualSlug(event.target.value);
          }}
          className={inputClass}
          placeholder="robes-de-soiree"
        />
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {slug ? `/categorie/${slug}` : "/categorie/…"}
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-label-lg text-label-lg text-primary">
          Image (URL ou chemin)
        </span>
        <input
          name="image"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          className={inputClass}
          placeholder="/images/cat-robes.jpg"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4 items-end">
        <label className="flex flex-col gap-1.5">
          <span className="font-label-lg text-label-lg text-primary">
            Texte alternatif
          </span>
          <input
            name="alt"
            defaultValue={category?.alt ?? ""}
            className={inputClass}
            placeholder="Robes de soirée suspendues"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-label-lg text-label-lg text-primary">
            Ordre
          </span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={category?.sortOrder ?? 0}
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container border border-[#F0E2DE] flex items-center justify-center flex-shrink-0">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant">
              image
            </span>
          )}
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Aperçu de la vignette ronde affichée sur l&apos;accueil.
        </p>
      </div>

      {state.error ? (
        <p
          role="alert"
          className="font-body-md text-body-md text-error bg-error-container rounded-xl px-4 py-3"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          role="status"
          className="font-body-md text-body-md text-primary bg-secondary-fixed rounded-xl px-4 py-3"
        >
          {state.success}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="h-12 px-8 rounded-lg bg-primary-container text-surface font-label-lg text-label-lg hover:bg-primary transition-colors disabled:opacity-60"
        >
          {pending
            ? "Enregistrement…"
            : category
              ? "Mettre à jour"
              : "Ajouter la catégorie"}
        </button>
        {category ? (
          <Link
            href="/admin/categories"
            className={cn(
              "h-12 px-6 rounded-lg border border-[#E8D7D3] bg-surface-container-lowest",
              "text-primary font-label-lg text-label-lg flex items-center justify-center hover:bg-[#F7EBEA] transition-colors",
            )}
          >
            Annuler
          </Link>
        ) : null}
      </div>
    </form>
  );
}
