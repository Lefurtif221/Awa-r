"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/format";
import { SITE, whatsappLink } from "@/lib/site";
import type { Category, Product } from "@/lib/types";

const TONE_CLASS: Record<Product["badges"][number]["tone"], string> = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary-container text-on-secondary-container",
  outline: "bg-surface-container-lowest text-primary border border-secondary-container",
};

export default function ProductDetail({
  product,
  category,
}: {
  product: Product;
  category: Category | null;
}) {
  const [activeColor, setActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const color = product.colors[activeColor];

  const message = [
    `Bonjour ${SITE.name}, je souhaite commander :`,
    `${product.name}${color ? ` — teinte ${color.name}` : ""}`,
    `Quantité : ${quantity}`,
    `Prix : ${formatPrice(product.price * quantity)}`,
    product.meta ? `Référence : ${product.meta}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
      {/* Visuel */}
      <div className="relative">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface-container shadow-float">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.imageAlt || product.name}
            className="w-full h-full object-cover"
          />
          {product.badges.length > 0 ? (
            <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
              {product.badges.map((badge) => (
                <span
                  key={badge.label}
                  className={cn(
                    "px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase shadow-sm",
                    TONE_CLASS[badge.tone],
                  )}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {product.colors.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {product.colors.map((item, index) => (
              <button
                key={`${item.name}-${index}`}
                type="button"
                onClick={() => setActiveColor(index)}
                aria-pressed={activeColor === index}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full border transition-colors",
                  activeColor === index
                    ? "border-primary bg-surface-container-lowest"
                    : "border-[#E8D7D3] bg-surface-container-lowest hover:border-secondary-container",
                )}
              >
                <span
                  className="w-4 h-4 rounded-full ring-1 ring-primary/20"
                  style={{ backgroundColor: item.hex }}
                />
                <span className="font-label-md text-label-md text-primary">
                  {item.name}
                </span>
              </button>
            ))}
            {product.extraColors ? (
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                +{product.extraColors} autres teintes disponibles
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Informations */}
      <div className="flex flex-col gap-6">
        <div>
          {category ? (
            <Link
              href={`/categorie/${category.slug}`}
              className="font-label-caps text-label-caps uppercase text-secondary tracking-widest hover:text-primary transition-colors"
            >
              {category.label}
            </Link>
          ) : null}

          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mt-2">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 mt-4 flex-wrap">
            <span className="font-headline-md text-headline-md text-primary font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="font-body-lg text-body-lg text-on-surface-variant line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <p className="font-body-lg text-body-lg text-on-surface-variant mt-4">
            {product.description}
          </p>

          {product.meta ? (
            <p className="font-label-md text-label-md text-secondary mt-3">
              {product.meta}
            </p>
          ) : null}
        </div>

        {/* Quantité */}
        <div className="flex items-center gap-4">
          <span className="font-label-lg text-label-lg text-primary">
            Quantité
          </span>
          <div className="flex items-center rounded-lg border border-[#E8D7D3] bg-surface-container-lowest overflow-hidden">
            <button
              type="button"
              aria-label="Diminuer"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="w-11 h-11 flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="w-12 text-center font-label-lg text-label-lg text-primary tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Augmenter"
              onClick={() => setQuantity((value) => Math.min(99, value + 1))}
              className="w-11 h-11 flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant">
            Total{" "}
            <strong className="text-primary">
              {formatPrice(product.price * quantity)}
            </strong>
          </span>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noreferrer noopener"
            className="flex-1 h-12 px-8 rounded-lg bg-primary-container text-surface flex items-center justify-center gap-2 font-label-lg text-label-lg shadow-md hover:bg-primary transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-lg">chat</span>
            Commander sur WhatsApp
          </a>
          <a
            href={`tel:+${SITE.whatsapp}`}
            className="h-12 px-7 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center gap-2 font-label-lg text-label-lg border border-[#E8D7D3] hover:bg-secondary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-lg">call</span>
            {SITE.whatsappDisplay}
          </a>
        </div>

        {/* Réassurance */}
        <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col gap-3">
          {[
            ["local_shipping", "Livraison 24/48h à Dakar et à l'intérieur"],
            ["payments", "Paiement à la livraison — en espèces"],
            ["redeem", "Échanges et retours sous 14 jours"],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">
                {icon}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
