export const instant = false;

import Link from "next/link";
import AdminLogin from "@/components/admin/AdminLogin";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { logout } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/dal";
import { getCategories, getProducts } from "@/lib/db";

import { formatPrice } from "@/lib/format";

export const metadata = { title: "Administration — AWA-R Voiles" };

type Props = { searchParams: Promise<{ erreur?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return (
      <div className="flex justify-center py-10">
        <AdminLogin />
      </div>
    );
  }

  const [products, categories, params] = await Promise.all([
    getProducts({ includeInactive: true }),
    getCategories(),
    searchParams,
  ]);

  const blockedCategory = params.erreur
    ? categories.find((category) => category.slug === params.erreur)
    : undefined;
  const visible = products.filter((product) => product.active).length;
  const totalValue = products.reduce((sum, product) => sum + product.price, 0);

  const categoryLabel = (slug: string) =>
    categories.find((category) => category.slug === slug)?.label ?? slug;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
            Tableau de bord
          </span>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mt-1">
            Vos produits
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            {products.length} référence{products.length > 1 ? "s" : ""} dont{" "}
            {visible} visible{visible > 1 ? "s" : ""} en boutique.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/produits/nouveau"
            className="h-11 px-5 rounded-lg bg-primary-container text-surface font-label-lg text-label-lg flex items-center gap-2 hover:bg-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Nouveau produit
          </Link>
          <Link
            href="/admin/categories"
            className="h-11 px-5 rounded-lg border border-[#E8D7D3] bg-surface-container-lowest text-primary font-label-lg text-label-lg flex items-center justify-center hover:bg-[#F7EBEA] transition-colors"
          >
            Catégories
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="h-11 px-4 rounded-lg border border-[#E8D7D3] bg-surface-container-lowest text-primary font-label-lg text-label-lg hover:bg-[#F7EBEA] transition-colors"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      {params.erreur ? (
        <p
          role="alert"
          className="font-body-md text-body-md text-error bg-error-container rounded-xl px-4 py-3"
        >
          Impossible de supprimer la catégorie
          {blockedCategory ? ` « ${blockedCategory.label} »` : ""} : des
          produits l&apos;utilisent encore. Modifiez d&apos;abord leurs
          catégories.
        </p>
      ) : null}

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Références", value: String(products.length) },
          { label: "Visibles", value: String(visible) },
          {
            label: "Prix moyen",
            value: products.length
              ? formatPrice(Math.round(totalValue / products.length))
              : "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-surface-container-lowest border border-[#F0E2DE] p-5"
          >
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
              {stat.label}
            </p>
            <p className="font-headline-md text-headline-md text-primary mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Liste */}
      {products.length === 0 ? (
        <div className="rounded-3xl bg-surface-container-lowest border border-[#F0E2DE] p-12 text-center">
          <p className="font-headline-sm text-headline-sm text-primary">
            Aucun produit pour l&apos;instant
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 mb-6">
            Ajoutez votre première pièce pour l&apos;afficher dans la boutique.
          </p>
          <Link
            href="/admin/produits/nouveau"
            className="inline-flex h-12 px-8 rounded-lg bg-primary-container text-surface font-label-lg text-label-lg items-center hover:bg-primary transition-colors"
          >
            Ajouter un produit
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-surface-container-lowest border border-[#F0E2DE] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#F0E2DE] bg-surface-container-low">
                  {["Produit", "Catégorie", "Prix", "Statut", ""].map((head) => (
                    <th
                      key={head}
                      className="px-5 py-3 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#F0E2DE] last:border-0 hover:bg-surface-container-low/60 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="font-label-lg text-label-lg text-primary truncate">
                            {product.name}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                            /produits/{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-body-sm text-body-sm text-on-surface-variant">
                      {categoryLabel(product.category)}
                    </td>
                    <td className="px-5 py-4 font-label-lg text-label-lg text-primary whitespace-nowrap">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-label-caps text-label-caps uppercase ${
                          product.active
                            ? "bg-secondary-container text-on-secondary-container"
                            : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {product.active ? "Visible" : "Masqué"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produits/${product.id}`}
                          className="h-9 px-3 rounded-lg font-label-md text-label-md text-primary bg-surface-container hover:bg-secondary-fixed transition-colors"
                        >
                          Modifier
                        </Link>
                        <DeleteProductButton
                          id={product.id}
                          name={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
