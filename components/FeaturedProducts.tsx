"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { filterTabs } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState(filterTabs[0]);

  const visible = useMemo(() => {
    if (activeTab === filterTabs[0]) return products;
    return products.filter((product) => product.collection === activeTab);
  }, [activeTab, products]);

  return (
    <section
      id="coups-de-coeur"
      className="w-full py-space-xl bg-surface-container-low scroll-mt-40"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-1">
              Sélection Printanière
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
              Les Coups de Cœur Girly
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Les pièces favorites plébiscitées par notre communauté pour un
              drapé sublime.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all shadow-sm whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="text-center font-body-md text-body-md text-on-surface-variant py-12">
            Aucune pièce dans cette sélection pour le moment.
          </p>
        ) : null}

        <div className="mt-12 text-center">
          <Link
            href="/categorie/voiles-de-soie-mousseline"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary-container text-surface font-label-lg text-label-lg hover:bg-primary transition-colors shadow-md"
          >
            <span>Explorer l&apos;intégralité du Vestiaire</span>
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
