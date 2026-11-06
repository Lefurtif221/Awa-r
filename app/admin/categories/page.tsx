import Link from "next/link";
import { redirect } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";
import { requireAdmin } from "@/lib/dal";
import { countProductsInCategory, getCategories } from "@/lib/db";

export const instant = false;

export const metadata = { title: "Catégories — Administration" };

type Props = { searchParams: Promise<{ edit?: string; erreur?: string }> };

export default async function CategoriesAdminPage({ searchParams }: Props) {
  const [isAdmin, categories] = await Promise.all([
    requireAdmin(),
    getCategories(),
  ]);
  if (!isAdmin) redirect("/admin");

  const { edit, erreur } = await searchParams;
  const editing = edit
    ? categories.find((category) => category.slug === edit)
    : undefined;

  const counts = await Promise.all(
    categories.map((category) => countProductsInCategory(category.slug)),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors"
          >
            ← Retour à l&apos;administration
          </Link>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mt-2">
            Catégories
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            {categories.length} univers{" "}
            {categories.length > 1 ? "affichés" : "affiché"} sur l&apos;accueil
            et dans le menu.
          </p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="h-11 px-5 rounded-lg border border-[#E8D7D3] bg-surface-container-lowest text-primary font-label-lg text-label-lg flex items-center justify-center hover:bg-[#F7EBEA] transition-colors"
        >
          Nouveau produit
        </Link>
      </div>

      {erreur ? (
        <p
          role="alert"
          className="font-body-md text-body-md text-error bg-error-container rounded-xl px-4 py-3"
        >
          Impossible de supprimer cette catégorie : des produits l&apos;utilisent
          encore. Réassignez-les d&apos;abord depuis l&apos;édition d&apos;un
          produit.
        </p>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Liste */}
        <div className="rounded-2xl bg-surface-container-lowest border border-[#F0E2DE] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0E2DE] bg-surface-container-low">
            <h2 className="font-headline-sm text-headline-sm text-primary">
              Liste
            </h2>
          </div>

          {categories.length === 0 ? (
            <p className="px-5 py-8 font-body-md text-body-md text-on-surface-variant text-center">
              Aucune catégorie pour l&apos;instant.
            </p>
          ) : (
            <ul className="divide-y divide-[#F0E2DE]">
              {categories.map((category, index) => (
                <li
                  key={category.slug}
                  className="px-5 py-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                    {category.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={category.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-label-lg text-label-lg text-primary truncate">
                      {category.label}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      /categorie/{category.slug} • {counts[index]} produit
                      {counts[index] > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/admin/categories?edit=${encodeURIComponent(category.slug)}`}
                      className="h-9 px-3 rounded-lg font-label-md text-label-md text-primary bg-surface-container hover:bg-secondary-fixed transition-colors"
                    >
                      Modifier
                    </Link>
                    <DeleteCategoryButton slug={category.slug} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Formulaire */}
        <div className="rounded-2xl bg-surface-container-lowest border border-[#F0E2DE] p-5">
          <h2 className="font-headline-sm text-headline-sm text-primary mb-4">
            {editing ? `Modifier — ${editing.label}` : "Nouvelle catégorie"}
          </h2>
          <CategoryForm
            key={editing?.slug ?? "new"}
            category={editing}
          />
        </div>
      </div>
    </div>
  );
}
