"use client";

import { deleteCategoryAction } from "@/lib/actions/categories";

export default function DeleteCategoryButton({ slug }: { slug: string }) {
  return (
    <form
      action={deleteCategoryAction}
      className="inline"
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Supprimer cette catégorie ? Les produits qui l'utilisent devront être réaffectés.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="h-9 px-3 rounded-lg font-label-md text-label-md text-error hover:bg-error-container transition-colors"
      >
        Supprimer
      </button>
    </form>
  );
}
