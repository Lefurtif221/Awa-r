import "server-only";

import { connection } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Category, CategoryInput, Product } from "@/lib/types";
import { slugify } from "@/lib/format";

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  meta: string;
  category: string;
  collection: string;
  badges: Product["badges"];
  colors: Product["colors"];
  extraColors: number | null;
  image: string;
  imageAlt: string;
  active: boolean;
  sortOrder: number;
};

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "products.json");

const SEED: Product[] = [
  {
    id: "seed-1",
    slug: "hijab-soie-medine-rose-poudre",
    name: "Hijab Soie de Médine Rose Poudré",
    description: "Toucher peau de pêche, tombé opaque infroissable",
    price: 12400,
    compareAtPrice: 14400,
    meta: "Taille 195×75 cm",
    category: "voiles-de-soie-mousseline",
    collection: "Soie de Médine",
    badges: [
      { label: "Coup de Cœur", tone: "secondary" },
      { label: "Best-Seller", tone: "outline" },
    ],
    colors: [
      { name: "Rose Poudré", hex: "#E8C2B9" },
      { name: "Crème Vanille", hex: "#F4E9DC" },
      { name: "Taupe Céleste", hex: "#D6C5BC" },
    ],
    extraColors: 5,
    image: "/images/prod-hijab-rose.jpg",
    imageAlt:
      "Portrait d'un modèle portant un hijab en soie de Médine rose poudré",
    active: true,
    sortOrder: 1,
  },
  {
    id: "seed-2",
    slug: "ensemble-cache-coeur-creme-nude",
    name: "Ensemble Cache-Cœur Crème & Nude",
    description: "Tissu ultra-doux avec ceinture satinée amovible",
    price: 38700,
    compareAtPrice: null,
    meta: "Du 36 au 46",
    category: "pret-a-porter-feminin",
    collection: "Robes Fluides",
    badges: [{ label: "Nouveau", tone: "primary" }],
    colors: [
      { name: "Crème Nacré", hex: "#F5EFE7" },
      { name: "Nude Rosé", hex: "#E5D7D0" },
      { name: "Terracotta Doux", hex: "#C7A398" },
    ],
    extraColors: null,
    image: "/images/prod-ensemble-creme.jpg",
    imageAlt: "Ensemble deux pièces crème et nude porté avec drapé fluide",
    active: true,
    sortOrder: 2,
  },
  {
    id: "seed-3",
    slug: "abaya-papillon-mauve-pale",
    name: "Abaya Papillon Mauve Pâle",
    description: "Coupe ample vaporeuse, tissu Nidha premium",
    price: 32700,
    compareAtPrice: 36000,
    meta: "Taille Unique",
    category: "abayas-modernes",
    collection: "Robes Fluides",
    badges: [{ label: "Tendance", tone: "secondary" }],
    colors: [
      { name: "Mauve Pâle", hex: "#D8CFDC" },
      { name: "Beige Poudré", hex: "#E5DDD8" },
    ],
    extraColors: null,
    image: "/images/prod-abaya-mauve.jpg",
    imageAlt: "Abaya papillon mauve pâle aux manches brodées",
    active: true,
    sortOrder: 3,
  },
  {
    id: "seed-4",
    slug: "maxi-robe-fleurie-pastel",
    name: "Maxi Robe Fleurie Pastel",
    description: "Doublure intégrale coton doux, manches bouffantes",
    price: 35700,
    compareAtPrice: null,
    meta: "Tailles S - XXL",
    category: "pret-a-porter-feminin",
    collection: "Robes Fluides",
    badges: [{ label: "Édition Limitée", tone: "secondary" }],
    colors: [
      { name: "Fleurs Poudrées", hex: "#EAD8D8" },
      { name: "Sauge Pastel", hex: "#E2E6DF" },
    ],
    extraColors: null,
    image: "/images/prod-robe-fleurie.jpg",
    imageAlt: "Maxi robe fleurie pastel en jardin, bijoux rose doré",
    active: true,
    sortOrder: 4,
  },
];

const WRITE_ERROR =
  "Écriture impossible : configurez DATABASE_URL (Neon) pour activer l'administration en production.";

function hasNeon(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/* ── Neon ──────────────────────────────────────────────────── */

let schemaReady = false;

async function neon() {
  const { neon } = await import("@neondatabase/serverless");
  return neon(process.env.DATABASE_URL!);
}

async function ensureSchema(sql: Awaited<ReturnType<typeof neon>>) {
  if (schemaReady || !hasNeon()) return;

  const existing = await sql`SELECT to_regclass('public.products') AS t`;
  const isFreshDatabase = !existing[0]?.t;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL,
      compare_at_price INTEGER,
      meta TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      collection TEXT NOT NULL DEFAULT '',
      badges JSONB NOT NULL DEFAULT '[]'::jsonb,
      colors JSONB NOT NULL DEFAULT '[]'::jsonb,
      extra_colors INTEGER,
      image TEXT NOT NULL DEFAULT '',
      image_alt TEXT NOT NULL DEFAULT '',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      slug TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      alt TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  if (isFreshDatabase) await seedNeon(sql);

  schemaReady = true;
}

/** Amorce une base neuve avec les catégories et produits de démonstration. */
async function seedNeon(sql: Awaited<ReturnType<typeof neon>>) {
  for (const category of SEED_CATEGORIES) {
    await sql`
      INSERT INTO categories (slug, label, image, alt, sort_order)
      VALUES (${category.slug}, ${category.label}, ${category.image}, ${category.alt}, ${category.sortOrder})
      ON CONFLICT (slug) DO NOTHING
    `;
  }

  for (const product of SEED) {
    await sql`
      INSERT INTO products (
        id, slug, name, description, price, compare_at_price, meta,
        category, collection, badges, colors, extra_colors,
        image, image_alt, active, sort_order
      ) VALUES (
        ${product.id}, ${product.slug}, ${product.name}, ${product.description},
        ${product.price}, ${product.compareAtPrice}, ${product.meta},
        ${product.category}, ${product.collection},
        ${JSON.stringify(product.badges)}::jsonb,
        ${JSON.stringify(product.colors)}::jsonb,
        ${product.extraColors}, ${product.image}, ${product.imageAlt},
        ${product.active}, ${product.sortOrder}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

type Row = Record<string, unknown>;

function toProduct(row: Row): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description ?? ""),
    price: Number(row.price),
    compareAtPrice:
      row.compare_at_price === null || row.compare_at_price === undefined
        ? null
        : Number(row.compare_at_price),
    meta: String(row.meta ?? ""),
    category: String(row.category ?? ""),
    collection: String(row.collection ?? ""),
    badges: (row.badges as Product["badges"]) ?? [],
    colors: (row.colors as Product["colors"]) ?? [],
    extraColors:
      row.extra_colors === null || row.extra_colors === undefined
        ? null
        : Number(row.extra_colors),
    image: String(row.image ?? ""),
    imageAlt: String(row.image_alt ?? ""),
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

async function neonAll(): Promise<Product[]> {
  const sql = await neon();
  await ensureSchema(sql);
  const rows = (await sql`
    SELECT * FROM products ORDER BY sort_order ASC, created_at ASC
  `) as unknown as Row[];
  return rows.map(toProduct);
}

/* ── Stockage fichier (développement, sans Neon) ───────────── */

async function fileAll(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : SEED;
  } catch {
    return SEED;
  }
}

async function fileWrite(items: Product[]) {
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
    await fs.writeFile(STORE_FILE, JSON.stringify(items, null, 2), "utf8");
  } catch {
    throw new Error(WRITE_ERROR);
  }
}

/* ── API publique ──────────────────────────────────────────── */

async function readProducts(options?: { includeInactive?: boolean }) {
  const items = hasNeon() ? await neonAll() : await fileAll();
  const ordered = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  return options?.includeInactive
    ? ordered
    : ordered.filter((item) => item.active);
}

export async function getProducts(options?: { includeInactive?: boolean }) {
  // Exclut la pré-rendu : les prix produits doivent être frais après
  // chaque modification depuis l'administration.
  await connection();
  return readProducts(options);
}

export async function getProductBySlug(slug: string) {
  const items = await getProducts({ includeInactive: true });
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getProductById(id: string) {
  const items = await getProducts({ includeInactive: true });
  return items.find((item) => item.id === id) ?? null;
}

export async function getProductsByCategory(category: string) {
  const items = await getProducts();
  return items.filter((item) => item.category === category);
}

export async function validateSlug(slug: string, ignoreId?: string) {
  const items = await getProducts({ includeInactive: true });
  return !items.some((item) => item.slug === slug && item.id !== ignoreId);
}

function normalize(input: ProductInput): ProductInput {
  return {
    ...input,
    name: input.name.trim(),
    slug: input.slug.trim(),
    description: input.description.trim(),
    meta: input.meta.trim(),
    image: input.image.trim(),
    imageAlt: input.imageAlt.trim(),
    price: Math.max(0, Math.round(input.price)),
    compareAtPrice:
      input.compareAtPrice === null || Number.isNaN(input.compareAtPrice)
        ? null
        : Math.max(0, Math.round(input.compareAtPrice)),
    sortOrder: Math.round(input.sortOrder ?? 0),
  };
}

export async function createProduct(raw: ProductInput): Promise<Product> {
  const input = normalize(raw);
  if (hasNeon()) {
    const sql = await neon();
    await ensureSchema(sql);
    const rows = (await sql`
      INSERT INTO products (
        id, slug, name, description, price, compare_at_price, meta,
        category, collection, badges, colors, extra_colors,
        image, image_alt, active, sort_order
      ) VALUES (
        ${randomUUID()}, ${input.slug}, ${input.name}, ${input.description},
        ${input.price}, ${input.compareAtPrice}, ${input.meta},
        ${input.category}, ${input.collection},
        ${JSON.stringify(input.badges)}::jsonb, ${JSON.stringify(input.colors)}::jsonb,
        ${input.extraColors}, ${input.image}, ${input.imageAlt},
        ${input.active}, ${input.sortOrder}
      ) RETURNING *
    `) as unknown as Row[];
    return toProduct(rows[0]);
  }

  const items = await fileAll();
  const product: Product = { id: randomUUID(), ...input };
  items.push(product);
  await fileWrite(items);
  return product;
}

export async function updateProduct(
  id: string,
  raw: ProductInput,
): Promise<Product> {
  const input = normalize(raw);
  if (hasNeon()) {
    const sql = await neon();
    await ensureSchema(sql);
    const rows = (await sql`
      UPDATE products SET
        slug = ${input.slug}, name = ${input.name},
        description = ${input.description}, price = ${input.price},
        compare_at_price = ${input.compareAtPrice}, meta = ${input.meta},
        category = ${input.category}, collection = ${input.collection},
        badges = ${JSON.stringify(input.badges)}::jsonb,
        colors = ${JSON.stringify(input.colors)}::jsonb,
        extra_colors = ${input.extraColors}, image = ${input.image},
        image_alt = ${input.imageAlt}, active = ${input.active},
        sort_order = ${input.sortOrder}
      WHERE id = ${id} RETURNING *
    `) as unknown as Row[];
    if (!rows[0]) throw new Error("Produit introuvable.");
    return toProduct(rows[0]);
  }

  const items = await fileAll();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Produit introuvable.");
  items[index] = { ...items[index], ...input, id };
  await fileWrite(items);
  return items[index];
}

export async function deleteProduct(id: string) {
  if (hasNeon()) {
    const sql = await neon();
    await ensureSchema(sql);
    await sql`DELETE FROM products WHERE id = ${id}`;
    return;
  }
  const items = await fileAll();
  await fileWrite(items.filter((item) => item.id !== id));
}

/* ══ Catégories ═════════════════════════════════════════════ */

const CATEGORY_STORE_FILE = path.join(STORE_DIR, "categories.json");

const SEED_CATEGORIES: Category[] = [
  {
    slug: "voiles-de-soie-mousseline",
    label: "Voiles de Soie",
    image: "/images/cat-voiles-soie.jpg",
    alt: "Voiles en soie délicatement drapés dans des tons rose poudré et ivoire",
    sortOrder: 1,
  },
  {
    slug: "mousseline-jersey",
    label: "Mousseline & Jersey",
    image: "/images/cat-mousseline.jpg",
    alt: "Mousseline crêpe et jersey modal souple dans des tons crème",
    sortOrder: 2,
  },
  {
    slug: "pret-a-porter-feminin",
    label: "Robes & Ensembles",
    image: "/images/cat-robes.jpg",
    alt: "Ensemble deux pièces rose poudré sur cintre doré",
    sortOrder: 3,
  },
  {
    slug: "abayas-modernes",
    label: "Abayas Chic",
    image: "/images/cat-abayas.jpg",
    alt: "Abaya kimono contemporaine nude taupe",
    sortOrder: 4,
  },
  {
    slug: "bonnets-caps",
    label: "Bonnets & Caps",
    image: "/images/cat-bonnets.jpg",
    alt: "Bonnets sous-voile en bambou pliés, tons nude et amande",
    sortOrder: 5,
  },
  {
    slug: "accessoires-bijoux",
    label: "Épingles & Bijoux",
    image: "/images/cat-epingles.jpg",
    alt: "Épingles à hijab magnétiques rose doré et nacré",
    sortOrder: 6,
  },
];

async function categoryNeonAll(): Promise<Category[]> {
  const sql = await neon();
  await ensureSchema(sql);
  const rows = (await sql`
    SELECT * FROM categories ORDER BY sort_order ASC, created_at ASC
  `) as unknown as Row[];
  return rows.map((row) => ({
    slug: String(row.slug),
    label: String(row.label),
    image: String(row.image ?? ""),
    alt: String(row.alt ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
  }));
}

async function categoryFileAll(): Promise<Category[]> {
  try {
    const raw = await fs.readFile(CATEGORY_STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as Category[];
    return Array.isArray(parsed) ? parsed : SEED_CATEGORIES;
  } catch {
    return SEED_CATEGORIES;
  }
}

async function categoryFileWrite(items: Category[]) {
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
    await fs.writeFile(
      CATEGORY_STORE_FILE,
      JSON.stringify(items, null, 2),
      "utf8",
    );
  } catch {
    throw new Error(WRITE_ERROR);
  }
}

async function readCategories(): Promise<Category[]> {
  const items = hasNeon() ? await categoryNeonAll() : await categoryFileAll();
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategories(): Promise<Category[]> {
  await connection();
  return readCategories();
}

export async function getCategoryBySlug(slug: string) {
  const items = await getCategories();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function validateCategorySlug(slug: string, ignoreSlug?: string) {
  const items = await readCategories();
  return !items.some((item) => item.slug === slug && item.slug !== ignoreSlug);
}

export async function createCategory(raw: CategoryInput): Promise<Category> {
  const input = normalizeCategory(raw);
  if (hasNeon()) {
    const sql = await neon();
    await ensureSchema(sql);
    const rows = (await sql`
      INSERT INTO categories (slug, label, image, alt, sort_order)
      VALUES (${input.slug}, ${input.label}, ${input.image}, ${input.alt}, ${input.sortOrder})
      RETURNING *
    `) as unknown as Row[];
    return {
      slug: String(rows[0].slug),
      label: String(rows[0].label),
      image: String(rows[0].image ?? ""),
      alt: String(rows[0].alt ?? ""),
      sortOrder: Number(rows[0].sort_order ?? 0),
    };
  }

  const items = await categoryFileAll();
  items.push(input);
  await categoryFileWrite(items);
  return input;
}

export async function updateCategory(
  originalSlug: string,
  raw: CategoryInput,
): Promise<Category> {
  const input = normalizeCategory(raw);
  if (hasNeon()) {
    const sql = await neon();
    await ensureSchema(sql);
    const rows = (await sql`
      UPDATE categories SET slug = ${input.slug}, label = ${input.label},
        image = ${input.image}, alt = ${input.alt}, sort_order = ${input.sortOrder}
      WHERE slug = ${originalSlug} RETURNING *
    `) as unknown as Row[];
    if (!rows[0]) throw new Error("Catégorie introuvable.");
    return {
      slug: String(rows[0].slug),
      label: String(rows[0].label),
      image: String(rows[0].image ?? ""),
      alt: String(rows[0].alt ?? ""),
      sortOrder: Number(rows[0].sort_order ?? 0),
    };
  }

  const items = await categoryFileAll();
  const index = items.findIndex((item) => item.slug === originalSlug);
  if (index === -1) throw new Error("Catégorie introuvable.");
  items[index] = input;
  await categoryFileWrite(items);
  return items[index];
}

export async function deleteCategory(slug: string) {
  if (hasNeon()) {
    const sql = await neon();
    await ensureSchema(sql);
    await sql`DELETE FROM categories WHERE slug = ${slug}`;
    return;
  }
  const items = await categoryFileAll();
  await categoryFileWrite(items.filter((item) => item.slug !== slug));
}

function normalizeCategory(input: CategoryInput): Category {
  return {
    slug: slugify(input.slug || input.label),
    label: input.label.trim(),
    image: input.image.trim(),
    alt: input.alt.trim(),
    sortOrder: Math.round(input.sortOrder ?? 0),
  };
}

export async function reassignProductsCategory(from: string, to: string) {
  if (from === to) return;
  if (hasNeon()) {
    const sql = await neon();
    await ensureSchema(sql);
    await sql`UPDATE products SET category = ${to} WHERE category = ${from}`;
    return;
  }
  const items = await fileAll();
  const updated = items.map((item) =>
    item.category === from ? { ...item, category: to } : item,
  );
  if (updated.some((item, index) => item !== items[index])) {
    await fileWrite(updated);
  }
}

export async function countProductsInCategory(slug: string): Promise<number> {
  const items = await readProducts({ includeInactive: true });
  return items.filter((item) => item.category === slug).length;
}
