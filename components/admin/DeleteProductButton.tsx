"use client";

import { deleteProductAction } from "@/lib/actions/products";

export default function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <form
      action={deleteProductAction}
      className="inline"
      onSubmit={(event) => {
        if (!window.confirm(`Supprimer « ${name} » définitivement ?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="h-9 px-3 rounded-lg font-label-md text-label-md text-error hover:bg-error-container transition-colors"
      >
        Supprimer
      </button>
    </form>
  );
}
