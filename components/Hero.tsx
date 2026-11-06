import { formatPrice } from "@/lib/format";

const HERO_IMAGE = "/images/hero.jpg";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-surface-container-low py-space-xl lg:py-24">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Contenu gauche */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
              Édition Florale 2026
            </span>
          </div>

          <h1 className="font-display-hero text-display-hero-mobile lg:text-display-hero text-primary tracking-tight leading-tight">
            L&apos;Élégance Voilée,
            <br />
            <span className="italic font-normal text-secondary">
              la Beauté Révélée.
            </span>
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Découvrez notre collection exclusive de hijabs en soie de Médine,
            mousselines vaporeuses, ensembles poudrés et abayas contemporaines
            créés pour célébrer votre féminité raffinée.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#univers"
              className="h-12 px-8 rounded-lg bg-primary-container text-surface flex items-center justify-center font-label-lg text-label-lg shadow-md hover:bg-primary transition-all duration-200 hover:-translate-y-0.5"
            >
              Découvrir la Collection
            </a>
            <a
              href="#coups-de-coeur"
              className="h-12 px-7 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-label-lg text-label-lg shadow-sm hover:bg-secondary-fixed transition-colors"
            >
              Nos Best-sellers Girly
            </a>
          </div>

          {/* Chiffres clés */}
          <div className="grid grid-cols-3 gap-6 pt-6 mt-4 w-full max-w-lg">
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-primary">
                100%
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Tissus d&apos;Exception
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-primary">
                15k+
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Femmes Sublimées
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-primary">
                4.9/5
              </span>
              <div className="flex items-center text-secondary text-xs">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mosaïque visuelle */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-xl bg-surface-container-lowest">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt="Femme élégante en hijab soie de Médine rose poudré, lumière dorée"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

            {/* Carte flottante */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-md shadow-lg flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
                  Iconique de la Saison
                </span>
                <span className="font-headline-sm text-headline-sm text-primary">
                  Soie de Médine Rose Poudré
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Fluidité &amp; tombé royal
                </span>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-secondary-container font-label-md text-label-md text-primary font-bold whitespace-nowrap">
                {formatPrice(12400)}
              </span>
            </div>
          </div>

          {/* Badge superposé */}
          <div className="hidden sm:flex absolute -top-4 -left-6 bg-surface-container-lowest p-4 rounded-2xl shadow-lg items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">spa</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps uppercase text-on-surface">
                Toucher Cachemire
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Zéro repassage requis
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
