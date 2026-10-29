/**
 * Produits volontairement MASQUÉS de la boutique ("Tous nos produits" et
 * catégories). Leur page tunnel dédiée (/aspirateur, /soie…) les charge par
 * handle, donc ils restent accessibles même en étant filtrés ici.
 *
 * Depuis le pivot "boutique cadeaux", l'aspirateur et la taie soie SONT des
 * produits gagnants du catalogue (rangés en catégories) → ils ne sont plus
 * masqués. Leurs pages tunnel restent dispo comme landing pages de campagne.
 */
export const HIDDEN_PRODUCT_HANDLES: string[] = []
