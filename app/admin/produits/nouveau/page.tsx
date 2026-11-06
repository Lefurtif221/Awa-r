export const instant = false;

import Link from "next/link";
import { redirect } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/dal";
import { getCategories } from "@/lib/db";

export const metadata = { title: "Nouveau produit — Administration" };

export default async function NewProductPage() {
  const [isAdmin, categories] = await Promise.all([requireAdmin(), getCategories()]);
  if (!isAdmin) redirect("/admin");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin"
          className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors"
        >
          ← Retour à l&apos;administration
        </Link>
        <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mt-2">
          Nouveau produit
        </h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
