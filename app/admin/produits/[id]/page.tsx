export const instant = false;

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/dal";
import { getCategories, getProductById } from "@/lib/db";

export const metadata = { title: "Modifier un produit — Administration" };

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const [isAdmin, categories] = await Promise.all([requireAdmin(), getCategories()]);
  if (!isAdmin) redirect("/admin");

  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

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
          Modifier — {product.name}
        </h1>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
