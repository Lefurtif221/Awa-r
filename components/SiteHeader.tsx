"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import type { Category } from "@/lib/types";

const STATIC_NAV = [
  { label: "Nouveautés", href: "/#coups-de-coeur" },
  { label: "Promos Girly", href: "/#coups-de-coeur" },
];

type Props = { categories?: Category[] };

export default function SiteHeader({ categories = [] }: Props) {
  const [copied, setCopied] = useState(false);

  const navItems = [
    { label: "Accueil", href: "/" },
    ...categories.map((category) => ({
      label: category.label,
      href: `/categorie/${category.slug}`,
    })),
    ...STATIC_NAV,
  ];

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(SITE.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {/* Bandeau d'annonce */}
      <section className="w-full bg-secondary-container text-on-secondary-container py-space-sm px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-center">
          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="text-sm">🌸</span>
            <p className="font-label-caps text-label-caps tracking-widest uppercase">
              Nouvelle Collection Printemps Girly disponible • Livraison offerte
              dès 25 000 FCFA d&apos;achat avec le code{" "}
              <span className="underline decoration-primary font-bold">
                {SITE.promoCode}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={copyCode}
            className="hidden md:inline-flex items-center gap-1 font-label-md text-label-md hover:opacity-80 transition-opacity"
          >
            <span>{copied ? "Copié !" : "Copier"}</span>
            <span className="material-symbols-outlined text-sm">
              {copied ? "check" : "content_copy"}
            </span>
          </button>
        </div>
      </section>

      {/* En-tête principal */}
      <header className="w-full bg-surface border-b border-[#F0E2DE] sticky top-0 z-50 shadow-hairline">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center gap-6">
          <Link
            href="/"
            className="flex-shrink-0"
            aria-label={`${SITE.name} — accueil`}
          >
            <Image
              src="/logo-awa-r.jpeg"
              alt={SITE.name}
              width={80}
              height={80}
              priority
              className="h-16 w-16 lg:h-20 lg:w-20 rounded-full object-cover bg-surface-container-lowest"
            />
          </Link>

          {/* Recherche */}
          <div className="flex-1 hidden md:block">
            <label className="relative block">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="search"
                placeholder="Rechercher un voile, soie, mousseline, abaya..."
                className="w-full h-12 pl-12 pr-4 rounded-lg bg-surface-container-lowest border border-[#E8D7D3] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:field-focus transition-shadow"
              />
            </label>
          </div>

          {/* Actions — pas de compte client */}
          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Nous écrire sur WhatsApp"
              className="hidden sm:flex items-center gap-1.5 h-11 px-4 rounded-lg bg-primary-container text-surface font-label-lg text-label-lg hover:bg-primary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              Commander
            </a>
            <button
              type="button"
              aria-label="Panier"
              className="relative flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              <span className="font-label-md text-label-md">0</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 lg:px-12 pb-3 overflow-x-auto">
          <ul className="flex items-center gap-6 lg:gap-8 whitespace-nowrap">
            {navItems.map((item, index) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`font-label-lg text-label-lg transition-colors hover:text-secondary ${
                    index === 0
                      ? "text-primary font-semibold"
                      : "text-on-surface-variant"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
