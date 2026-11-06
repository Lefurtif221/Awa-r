"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/format";
import type { Product } from "@/lib/types";

const TONE_CLASS: Record<Product["badges"][number]["tone"], string> = {
  primary: "bg-primary text-on-primary border-transparent",
  secondary:
    "bg-secondary-container text-on-secondary-container border-transparent",
  outline:
    "bg-surface-container-lowest text-primary border-secondary-container",
};

export default function ProductCard({ product }: { product: Product }) {
  const [activeColor, setActiveColor] = useState(0);

  return (
    <div className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <Link
        href={`/produits/${product.slug}`}
        className="relative block w-full aspect-[3/4] overflow-hidden bg-surface-container"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.imageAlt || product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {product.badges.length > 0 ? (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {product.badges.map((badge) => (
              <span
                key={badge.label}
                className={cn(
                  "px-2.5 py-1 rounded-full font-label-caps text-label-caps uppercase shadow-sm border",
                  TONE_CLASS[badge.tone],
                )}
              >
                {badge.label}
              </span>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          aria-label="Ajouter aux favoris"
          onClick={(event) => event.preventDefault()}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-base">favorite</span>
        </button>

        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
          <span className="w-full py-2.5 rounded-lg bg-surface-container-lowest/95 backdrop-blur-md text-primary font-label-lg text-label-lg shadow-md hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
            Voir la pièce
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {product.colors.length > 0 ? (
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              {product.colors.map((color, index) => (
                <button
                  key={`${color.name}-${index}`}
                  type="button"
                  title={color.name}
                  aria-label={color.name}
                  onClick={() => setActiveColor(index)}
                  className={cn(
                    "w-3.5 h-3.5 rounded-full ring-1 cursor-pointer transition-shadow",
                    activeColor === index
                      ? "ring-primary/20"
                      : "ring-transparent hover:ring-primary/20",
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.extraColors ? (
                <span className="font-body-sm text-body-sm text-on-surface-variant ml-1 text-xs">
                  +{product.extraColors} teintes
                </span>
              ) : null}
            </div>
          ) : null}

          <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
            <Link href={`/produits/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-label-lg text-label-lg text-primary font-bold whitespace-nowrap">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="font-body-sm text-body-sm text-on-surface-variant line-through text-xs whitespace-nowrap">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>
          <span className="font-label-md text-label-md text-secondary text-right">
            {product.meta}
          </span>
        </div>
      </div>
    </div>
  );
}
