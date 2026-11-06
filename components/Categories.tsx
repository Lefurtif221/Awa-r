import Link from "next/link";
import { getCategories } from "@/lib/db";

export default async function Categories() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section id="univers" className="w-full py-space-xl bg-surface scroll-mt-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-1">
            Navigation Prémices
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
            Nos Univers Délicats
          </h2>
          <div className="w-12 h-0.5 bg-secondary-container mt-2" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorie/${cat.slug}`}
              className="group flex flex-col items-center text-center gap-3"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-surface-container-lowest shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                <div className="w-full h-full rounded-full overflow-hidden bg-surface-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.alt || cat.label}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="font-label-lg text-label-lg text-primary group-hover:text-secondary transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
