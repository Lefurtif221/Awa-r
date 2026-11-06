/**
 * Réglages de la boutique — à compléter avec les vraies infos de la cliente.
 */
export const SITE = {
  name: "AWA-R Voiles",
  tagline: "L'élégance voilée, la beauté révélée.",
  instagram: "awarvoiles",
  /** Format international sans "+" ni espaces, ex : 221770000000 */
  whatsapp: "221770000000",
  /** Affiché tel quel, ex : "+221 77 000 00 00" */
  whatsappDisplay: "+221 77 000 00 00",
  city: "Dakar",
  country: "Sénégal",
  freeShippingThreshold: 25000,
  promoCode: "ELEGANCE",
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
