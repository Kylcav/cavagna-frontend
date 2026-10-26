/**
 * Produits "tunnel de vente" (monoproduit) accessibles uniquement via leur
 * page dédiée (/aspirateur, /soie) et volontairement MASQUÉS de la boutique
 * ("Tous nos produits"). Ils restent publiés et dans le sales channel pour que
 * leur page tunnel puisse les charger — on les filtre juste de la liste.
 */
export const HIDDEN_PRODUCT_HANDLES = [
  "aspirateur-robot-18000-pa",
  "taie-soie-mulberry",
]
