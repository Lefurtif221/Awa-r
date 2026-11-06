"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  saveProduct,
  type ProductFormState,
} from "@/lib/actions/products";
import { filterTabs } from "@/lib/catalog";
import { slugify, cn } from "@/lib/format";
import type { Badge, BadgeTone, Category, Product, ProductColor } from "@/lib/types";

const TONES: { value: BadgeTone; label: string }[] = [
  { value: "secondary", label: "Rose" },
  { value: "primary", label: "Moka" },
  { value: "outline", label: "Contour" },
];

const INITIAL: ProductFormState = {};

type Props = { product?: Product; categories: Category[] };

export default function ProductForm({ product, categories }: Props) {
  const [state, formAction, pending] = useActionState(
    saveProduct,
    INITIAL,
  );
  const [name, setName] = useState(product?.name ?? "");
  const [manualSlug, setManualSlug] = useState(product?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(product));
  const [image, setImage] = useState(product?.image ?? "");
  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors ?? [{ name: "", hex: "#E8C2B9" }],
  );
  const [badges, setBadges] = useState<Badge[]>(product?.badges ?? []);

  const slug = slugEdited ? manualSlug : slugify(name);

  const updateColor = (
    index: number,
    patch: Partial<ProductColor>,
  ) =>
    setColors((current) =>
      current.map((color, i) => (i === index ? { ...color, ...patch } : color)),
    );

  const updateBadge = (index: number, patch: Partial<Badge>) =>
    setBadges((current) =>
      current.map((badge, i) => (i === index ? { ...badge, ...patch } : badge)),
    );

  const inputClass =
    "w-full h-11 px-3 rounded-lg bg-surface-container-lowest border border-[#E8D7D3] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:field-focus transition-shadow";
  const labelClass = "font-label-lg text-label-lg text-primary";

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input
        type="hidden"
        name="colorsJson"
        value={JSON.stringify(colors.filter((c) => c.name.trim()))}
      />
      <input
        type="hidden"
        name="badgesJson"
        value={JSON.stringify(badges.filter((b) => b.label.trim()))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identité */}
        <div className="rounded-2xl bg-surface-container-lowest border border-[#F0E2DE] p-5 flex flex-col gap-4">
          <h2 className="font-headline-sm text-headline-sm text-primary">
            Identité du produit
          </h2>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Nom *</span>
            <input
              name="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="Hijab Soie de Médine Rose Poudré"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Slug (URL)</span>
            <input
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugEdited(true);
                setManualSlug(event.target.value);
              }}
              className={inputClass}
              placeholder="hijab-soie-medine-rose-poudre"
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {slug ? `/produits/${slug}` : "/produits/…"}
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Description</span>
            <textarea
              name="description"
              rows={3}
              defaultValue={product?.description ?? ""}
              className={cn(inputClass, "h-auto py-2 resize-y")}
              placeholder="Toucher peau de pêche, tombé opaque infroissable"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Détail affiché (taille, coupe…)</span>
            <input
              name="meta"
              defaultValue={product?.meta ?? ""}
              className={inputClass}
              placeholder="Taille Unique"
            />
          </label>
        </div>

        {/* Prix */}
        <div className="rounded-2xl bg-surface-container-lowest border border-[#F0E2DE] p-5 flex flex-col gap-4">
          <h2 className="font-headline-sm text-headline-sm text-primary">
            Prix
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Prix (FCFA) *</span>
              <input
                name="price"
                type="number"
                min={0}
                required
                defaultValue={product?.price ?? ""}
                className={inputClass}
                placeholder="12400"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Prix barré</span>
              <input
                name="compareAtPrice"
                type="number"
                min={0}
                defaultValue={product?.compareAtPrice ?? ""}
                className={inputClass}
                placeholder="14400"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Ordre d&apos;affichage</span>
            <input
              name="sortOrder"
              type="number"
              defaultValue={product?.sortOrder ?? 0}
              className={inputClass}
            />
          </label>

          <label className="flex items-center gap-3 pt-1">
            <input
              name="active"
              type="checkbox"
              defaultChecked={product?.active ?? true}
              className="w-5 h-5 accent-[#4A2E2B]"
            />
            <span className={labelClass}>Visible dans la boutique</span>
          </label>
        </div>
      </div>

      {/* Classement */}
      <div className="rounded-2xl bg-surface-container-lowest border border-[#F0E2DE] p-5 flex flex-col gap-4">
        <h2 className="font-headline-sm text-headline-sm text-primary">
          Classement
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Catégorie (page dédiée)</span>
            <select
              name="category"
              defaultValue={product?.category ?? categories[0]?.slug ?? ""}
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Sélection (onglet d&apos;accueil)</span>
            <select
              name="collection"
              defaultValue={product?.collection ?? filterTabs[1]}
              className={inputClass}
            >
              {filterTabs.slice(1).map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Visuel */}
      <div className="rounded-2xl bg-surface-container-lowest border border-[#F0E2DE] p-5 flex flex-col gap-4">
        <h2 className="font-headline-sm text-headline-sm text-primary">
          Visuel
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Image (URL ou chemin)</span>
            <input
              name="image"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              className={inputClass}
              placeholder="/images/prod-hijab-rose.jpg"
            />
          </label>
          <div className="w-24 h-32 rounded-xl overflow-hidden bg-surface-container border border-[#F0E2DE] flex items-center justify-center">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant">
                image
              </span>
            )}
          </div>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Texte alternatif (accessibilité/SEO)</span>
          <input
            name="imageAlt"
            defaultValue={product?.imageAlt ?? ""}
            className={inputClass}
            placeholder="Portrait d'un modèle portant un hijab rose poudré"
          />
        </label>
      </div>

      {/* Couleurs */}
      <div className="rounded-2xl bg-surface-container-lowest border border-[#F0E2DE] p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-headline-sm text-headline-sm text-primary">
            Teintes
          </h2>
          <button
            type="button"
            onClick={() =>
              setColors((current) => [
                ...current,
                { name: "", hex: "#F4E9DC" },
              ])
            }
            className="h-9 px-4 rounded-full bg-secondary-container text-primary font-label-md text-label-md hover:opacity-80 transition-opacity"
          >
            + Ajouter
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="color"
                value={color.hex}
                onChange={(event) => updateColor(index, { hex: event.target.value })}
                className="w-11 h-11 rounded-lg border border-[#E8D7D3] cursor-pointer p-1 bg-surface-container-lowest"
                aria-label="Couleur"
              />
              <input
                value={color.name}
                onChange={(event) => updateColor(index, { name: event.target.value })}
                placeholder="Rose Poudré"
                className={cn(inputClass, "flex-1")}
              />
              <button
                type="button"
                onClick={() =>
                  setColors((current) => current.filter((_, i) => i !== index))
                }
                aria-label="Retirer la teinte"
                className="w-11 h-11 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
          <label className="flex flex-col gap-1.5 max-w-xs">
            <span className={labelClass}>Autres teintes (nombre)</span>
            <input
              name="extraColors"
              type="number"
              min={0}
              defaultValue={product?.extraColors ?? ""}
              className={inputClass}
              placeholder="5"
            />
          </label>
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-2xl bg-surface-container-lowest border border-[#F0E2DE] p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-headline-sm text-headline-sm text-primary">
            Badges
          </h2>
          <button
            type="button"
            onClick={() =>
              setBadges((current) =>
                current.length >= 3
                  ? current
                  : [...current, { label: "Nouveau", tone: "primary" }],
              )
            }
            className="h-9 px-4 rounded-full bg-secondary-container text-primary font-label-md text-label-md hover:opacity-80 transition-opacity"
          >
            + Ajouter
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                value={badge.label}
                onChange={(event) =>
                  updateBadge(index, { label: event.target.value })
                }
                placeholder="Best-Seller"
                className={cn(inputClass, "flex-1")}
              />
              <select
                value={badge.tone}
                onChange={(event) =>
                  updateBadge(index, {
                    tone: event.target.value as BadgeTone,
                  })
                }
                className={cn(inputClass, "w-40")}
              >
                {TONES.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() =>
                  setBadges((current) => current.filter((_, i) => i !== index))
                }
                aria-label="Retirer le badge"
                className="w-11 h-11 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
          {badges.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Aucun badge — la carte produit n&apos;affichera aucune étiquette.
            </p>
          ) : null}
        </div>
      </div>

      {/* Messages */}
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
          {state.success}{" "}
          <Link href="/admin" className="underline font-semibold">
            Retour à l&apos;administration
          </Link>
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
            : product
              ? "Mettre à jour"
              : "Ajouter le produit"}
        </button>
        <Link
          href="/admin"
          className="h-12 px-6 rounded-lg border border-[#E8D7D3] bg-surface-container-lowest text-primary font-label-lg text-label-lg flex items-center justify-center hover:bg-[#F7EBEA] transition-colors"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
