"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import {
  countProductsInCategory,
  createCategory,
  deleteCategory,
  reassignProductsCategory,
  updateCategory,
  validateCategorySlug,
} from "@/lib/db";
import { slugify } from "@/lib/format";

export type CategoryFormState = {
  error?: string;
  success?: string;
};

function readForm(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();

  return {
    label,
    slug: rawSlug ? slugify(rawSlug) : slugify(label),
    image: String(formData.get("image") ?? "").trim(),
    alt: String(formData.get("alt") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function saveCategory(
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  if (!(await requireAdmin())) {
    return { error: "Session expirée. Reconnectez-vous." };
  }

  const input = readForm(formData);
  if (!input.label) return { error: "Le nom de la catégorie est obligatoire." };
  if (!input.slug) return { error: "Le slug de la catégorie est obligatoire." };

  const originalSlug = String(formData.get("originalSlug") ?? "").trim();

  if (!(await validateCategorySlug(input.slug, originalSlug || undefined))) {
    return { error: "Ce slug est déjà utilisé par une autre catégorie." };
  }

  try {
    if (originalSlug) {
      await updateCategory(originalSlug, input);
      if (originalSlug !== input.slug) {
        await reassignProductsCategory(originalSlug, input.slug);
      }
    } else {
      await createCategory(input);
    }
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Enregistrement impossible.",
    };
  }

  revalidatePath("/", "layout");
  return {
    success: originalSlug ? "Catégorie mise à jour." : "Catégorie ajoutée.",
  };
}

export async function deleteCategoryAction(formData: Promise<FormData> | FormData) {
  const data = await formData;
  if (!(await requireAdmin())) redirect("/admin");

  const slug = String(data.get("slug") ?? "").trim();
  if (!slug) return;

  const count = await countProductsInCategory(slug);
  if (count > 0) {
    redirect(`/admin?erreur=${encodeURIComponent(slug)}`);
  }

  await deleteCategory(slug);
  revalidatePath("/", "layout");
  redirect("/admin");
}
