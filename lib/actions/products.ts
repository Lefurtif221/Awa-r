"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  validateSlug,
  type ProductInput,
} from "@/lib/db";
import { slugify } from "@/lib/format";
import { filterTabs } from "@/lib/catalog";
import { getCategories } from "@/lib/db";
import type { Badge, ProductColor } from "@/lib/types";

export type ProductFormState = {
  error?: string;
  success?: string;
};

function parseList<T>(raw: unknown): T[] {
  if (typeof raw !== "string" || raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function readForm(formData: FormData): ProductInput {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();

  return {
    name,
    slug: rawSlug ? slugify(rawSlug) : slugify(name),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    compareAtPrice: (() => {
      const raw = String(formData.get("compareAtPrice") ?? "").trim();
      return raw === "" ? null : Number(raw);
    })(),
    meta: String(formData.get("meta") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    collection: String(formData.get("collection") ?? "").trim(),
    badges: parseList<Badge>(formData.get("badgesJson")),
    colors: parseList<ProductColor>(formData.get("colorsJson")),
    extraColors: (() => {
      const raw = String(formData.get("extraColors") ?? "").trim();
      return raw === "" ? null : Number(raw);
    })(),
    image: String(formData.get("image") ?? "").trim(),
    imageAlt: String(formData.get("imageAlt") ?? "").trim(),
    active: formData.get("active") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

async function validate(input: ProductInput): Promise<string | null> {
  if (!input.name) return "Le nom du produit est obligatoire.";
  if (!input.slug) return "Le slug du produit est obligatoire.";
  if (!Number.isFinite(input.price) || input.price < 0) {
    return "Le prix doit être un nombre positif.";
  }
  if (
    input.compareAtPrice !== null &&
    (!Number.isFinite(input.compareAtPrice) || input.compareAtPrice < 0)
  ) {
    return "Le prix barré doit être un nombre positif.";
  }

  const categories = await getCategories();
  if (!categories.some((category) => category.slug === input.category)) {
    return "Choisissez une catégorie valide.";
  }
  if (!filterTabs.includes(input.collection)) {
    return "Choisissez une sélection valide.";
  }
  if (input.colors.some((color) => !/^#[0-9a-fA-F]{6}$/.test(color.hex))) {
    return "Chaque couleur doit être au format #RRGGBB.";
  }
  return null;
}

export async function saveProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  if (!(await requireAdmin())) {
    return { error: "Session expirée. Reconnectez-vous." };
  }

  const input = readForm(formData);
  const error = await validate(input);
  if (error) return { error };

  const id = String(formData.get("id") ?? "").trim();

  if (!(await validateSlug(input.slug, id || undefined))) {
    return { error: "Ce slug est déjà utilisé par un autre produit." };
  }

  try {
    if (id) {
      await updateProduct(id, input);
    } else {
      await createProduct(input);
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Enregistrement impossible." };
  }

  revalidatePath("/", "layout");
  return {
    success: id ? "Produit mis à jour." : "Produit ajouté à la boutique.",
  };
}

export async function deleteProductAction(
  formData: FormData,
): Promise<void> {
  if (!(await requireAdmin())) redirect("/admin");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  try {
    await deleteProduct(id);
  } catch {
    // En cas d'échec, on reste sur la page courante.
    return;
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}
