const PILLARS = [
  {
    icon: "featured_seasonal_and_gifts",
    title: "Écrin Cadeau Parfumé",
    text: "Papier de soie & délicat ruban signature",
  },
  {
    icon: "rocket_launch",
    title: "Livraison sous 24/48h",
    text: "Dakar & intérieur du pays, colis suivi",
  },
  {
    icon: "sync_alt",
    title: "Retours Sereins 14 Jours",
    text: "Échanges facilités et sans tracas",
  },
  {
    icon: "favorite_border",
    title: "Conseil Bienveillant",
    text: "Styliste à votre écoute 6j/7 sur WhatsApp",
  },
];

export default function Reassurance() {
  return (
    <section className="w-full py-12 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="p-8 lg:p-10 rounded-3xl bg-surface-container-lowest shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  {pillar.icon}
                </span>
              </div>
              <div>
                <h4 className="font-label-lg text-label-lg text-primary">
                  {pillar.title}
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {pillar.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
