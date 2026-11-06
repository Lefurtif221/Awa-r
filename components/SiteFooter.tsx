"use client";

import Image from "next/image";
const FOOTER_LINKS = [
  {
    title: "Univers Couture",
    links: [
      "Voiles de Soie & Mousseline",
      "Robes & Ensembles",
      "Abayas Modernes",
      "Épingles & Bijoux",
    ],
  },
  {
    title: "Service Client",
    links: [
      "Suivi de commande",
      "Retours & Échanges",
      "Guide des tailles",
      "Contact & FAQ",
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="w-full bg-surface-container-low mt-space-xl shadow-[0_-1px_12px_rgba(74,46,43,0.03)]">
      {/* Bandeau réassurance */}
      <div className="bg-surface-container py-space-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="material-symbols-outlined text-secondary text-2xl">
              local_shipping
            </span>
            <div>
              <h4 className="font-label-lg text-label-lg text-primary">
                Livraison Rapide &amp; Suivie
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Expédition soignée sous 24h à 48h
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="material-symbols-outlined text-secondary text-2xl">
              featured_seasonal_and_gifts
            </span>
            <div>
              <h4 className="font-label-lg text-label-lg text-primary">
                Emballage Cadeau Raffiné
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Papier de soie parfumé &amp; boîte signature
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="material-symbols-outlined text-secondary text-2xl">
              verified_user
            </span>
            <div>
              <h4 className="font-label-lg text-label-lg text-primary">
                Paiement à la Livraison
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Payez en espèces à la réception du colis
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Colonnes */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Image
            src="/logo-awa-r.jpeg"
            alt="AWA-R Voiles"
            width={160}
            height={160}
            className="w-28 h-28 rounded-full object-cover bg-surface-container-lowest mb-space-sm"
          />
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Sublimer chaque silhouette d&apos;une touche de modestie céleste et
            de féminité couture.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/awarvoiles"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-base">
                photo_camera
              </span>
              Instagram
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-base">
                music_note
              </span>
              TikTok
            </a>
          </div>
        </div>

        {FOOTER_LINKS.map((column) => (
          <div key={column.title}>
            <span className="font-label-caps text-label-caps uppercase text-on-surface tracking-widest block mb-space-md">
              {column.title}
            </span>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <span className="font-label-caps text-label-caps uppercase text-on-surface tracking-widest block mb-space-md">
            Club Privilège VIP
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
            Recevez en avant-première nos collections exclusives.
          </p>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="votre@email.com"
              className="flex-1 min-w-0 h-11 px-3 rounded-lg bg-surface-container-lowest border border-[#E8D7D3] font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:field-focus transition-shadow"
            />
            <button
              type="submit"
              className="h-11 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity"
            >
              S&apos;inscrire
            </button>
          </form>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-[#F0E2DE]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center sm:text-left">
            © 2026 AWA-R Voiles. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors"
            >
              Mentions Légales
            </a>
            <a
              href="#"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors"
            >
              Confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
