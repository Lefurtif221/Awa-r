import { instagramPosts, testimonials } from "@/lib/catalog";

export default function Community() {
  return (
    <section className="w-full py-space-xl bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-1">
              Communauté • #AWARVoiles
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
              Vos Allures, Notre Fierté
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Identifiez @awarvoiles sur Instagram pour faire partie de notre
              carnet de style.
            </p>
          </div>
          <a
            href="https://instagram.com/awarvoiles"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 font-label-lg text-label-lg text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              photo_camera
            </span>
            <span>Suivre @awarvoiles sur Instagram</span>
          </a>
        </div>

        {/* Grille Instagram */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {instagramPosts.map((post) => (
            <div
              key={post.handle}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-surface-container shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-on-primary">
                <span className="font-label-md text-label-md font-bold">
                  {post.handle}
                </span>
                <span className="font-body-sm text-body-sm text-xs">
                  {post.product}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Avis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review) => (
            <div
              key={review.name}
              className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-4"
            >
              <div className="flex items-center text-secondary text-sm">
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
              <p className="font-body-md text-body-md text-on-surface italic">
                {review.quote}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-label-md text-label-md text-primary font-bold">
                  {review.initials}
                </div>
                <div>
                  <p className="font-label-md text-label-md text-primary font-bold">
                    {review.name}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                    Commande vérifiée • {review.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
