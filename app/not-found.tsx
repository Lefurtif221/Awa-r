import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-surface">
      <span className="material-symbols-outlined text-secondary text-5xl">
        search_off
      </span>
      <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mt-6">
        Cette page n&apos;existe pas
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 max-w-md">
        La pièce ou la collection que vous cherchez a peut-être été retirée de
        la boutique.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Link
          href="/"
          className="h-12 px-8 rounded-lg bg-primary-container text-surface flex items-center justify-center font-label-lg text-label-lg shadow-md hover:bg-primary transition-all duration-200 hover:-translate-y-0.5"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/categorie/voiles-de-soie-mousseline"
          className="h-12 px-7 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-label-lg text-label-lg border border-[#E8D7D3] hover:bg-secondary-fixed transition-colors"
        >
          Voir les voiles
        </Link>
      </div>
    </div>
  );
}
