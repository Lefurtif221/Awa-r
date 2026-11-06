export type ProductColor = {
  name: string;
  hex: string;
};

export type BadgeTone = "primary" | "secondary" | "outline";

export type Badge = {
  label: string;
  tone: BadgeTone;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  meta: string;
  /** Slug de la catégorie (pages /categorie/[slug]) */
  category: string;
  /** Onglet de la page d'accueil (Sélection / Soie de Médine / …) */
  collection: string;
  badges: Badge[];
  colors: ProductColor[];
  extraColors: number | null;
  image: string;
  imageAlt: string;
  active: boolean;
  sortOrder: number;
};

export type Category = {
  slug: string;
  label: string;
  image: string;
  alt: string;
  sortOrder: number;
};

export type CategoryInput = {
  slug: string;
  label: string;
  image: string;
  alt: string;
  sortOrder: number;
};
