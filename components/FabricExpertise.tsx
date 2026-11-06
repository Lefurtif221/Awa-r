const FEATURES = [
  {
    icon: "blur_on",
    title: "Opacité Sublime",
    text: "Un grammage précis de 140g/m² garantissant une discrétion irréprochable sans alourdir.",
  },
  {
    icon: "waves",
    title: "Drapé Aérien",
    text: "Une fluidité naturelle qui tombe harmonieusement sur les épaules tout au long du jour.",
  },
  {
    icon: "palette",
    title: "Nuancier Poétique",
    text: "Plus de 35 nuances minérales et blush créées sur-mesure pour sublimer chaque carnation.",
  },
  {
    icon: "iron",
    title: "Infroissable & Durable",
    text: "Lavage doux en machine, prêt à porter dès la sortie d'armoire sans fer contraignant.",
  },
];

export default function FabricExpertise() {
  return (
    <section className="w-full py-space-xl bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visuel */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/fabric-silk.jpg"
                alt="Macro du tissu soie de Médine, texture rose poudré sous la main"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-[-4rem] ml-6 max-w-sm bg-surface-container-lowest p-6 rounded-2xl shadow-xl relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-secondary text-2xl">
                  verified
                </span>
                <h4 className="font-headline-sm text-headline-sm text-primary">
                  Label Toucher Nuage™
                </h4>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Tissé avec des microfibres sélectionnées pour éviter tout
                glissement, garantir une opacité sans sous-couche et épouser
                délicatement le port de tête.
              </p>
            </div>
          </div>

          {/* Bento informatif */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-2">
                L&apos;Excellence du Détail
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary leading-tight">
                L&apos;Art du Voile &amp; Tissus d&apos;Exception
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
                Chaque pièce signée AWA-R Voiles est conçue pour marier pudeur
                sacrée, aisance quotidienne et sophistication de haute facture.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="p-5 rounded-2xl bg-surface-container-low flex flex-col gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-xl">
                      {feature.icon}
                    </span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-primary">
                    {feature.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
