import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProductsByCategory } from "@/lib/db";
import { SITE } from "@/lib/site";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) return { title: "Catégorie introuvable" };

  return {
    title: `${category.label} — ${SITE.name}`,
    description: `${category.label} : ${SITE.tagline}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) notFound();

  const products = await getProductsByCategory(category.slug);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl">
      <nav className="mb-8 font-body-sm text-body-sm text-on-surface-variant">
        <Link href="/" className="hover:text-secondary transition-colors">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <span className="text-primary">{category.label}</span>
      </nav>

      <div className="flex flex-col items-center text-center mb-10">
        <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-1">
          Notre univers
        </span>
        <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
          {category.label}
        </h1>
        <div className="w-12 h-0.5 bg-secondary-container mt-3" />
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-surface-container-low p-12 text-center">
          <span className="material-symbols-outlined text-secondary text-4xl">
            checkroom
          </span>
          <p className="font-headline-sm text-headline-sm text-primary mt-4">
            Cette collection arrive bientôt
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Écrivez-nous sur WhatsApp pour être prévenue du premier arrivage.
          </p>
        </div>
      )}
    </div>
  );
}
