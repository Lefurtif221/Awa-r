export const instant = false;

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProductBySlug, getProducts } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.active) {
    return { title: "Pièce introuvable" };
  }

  return {
    title: `${product.name} — ${SITE.name}`,
    description: `${product.description} — ${formatPrice(product.price)}. ${SITE.tagline}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.active) notFound();

  const [suggestions, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const category =
    categories.find((item) => item.slug === product.category) ?? null;

  const related = suggestions.filter((item) => item.id !== product.id).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "XOF",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl">
        <nav className="mb-8 font-body-sm text-body-sm text-on-surface-variant">
          <Link href="/" className="hover:text-secondary transition-colors">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{product.name}</span>
        </nav>

        <ProductDetail product={product} category={category} />
      </div>

      {related.length > 0 ? (
        <section className="w-full py-space-xl bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mb-8">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
