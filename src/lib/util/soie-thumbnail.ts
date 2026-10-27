import { HttpTypes } from "@medusajs/types"

/**
 * Vignette par coloris pour la taie en soie (/soie).
 *
 * Le coloris choisi est stocké dans les metadata de ligne (`couleur_1`) par le
 * storefront. On renvoie l'image locale correspondante (servie depuis
 * public/soie/colors) pour que le panier / la commande montrent la bonne
 * couleur. Renvoie undefined si la ligne n'est pas une taie en soie.
 */
const SOIE_COLOR_CODE: Record<string, string> = {
  "Blanc nacré": "BLNC",
  Champagne: "CHMP",
  "Or rose": "ORRS",
  "Rose poudré": "RSPD",
  Rose: "ROSE",
  "Gris perle": "GRPL",
  "Gris anthracite": "GRAN",
  "Bleu nuit": "BLNT",
  "Bleu paon": "BLPA",
  Émeraude: "EMER",
  Terracotta: "TERR",
  "Rouge rubis": "RUBI",
}

export const soieColorImage = (
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
): string | undefined => {
  const c = (item.metadata as Record<string, unknown> | undefined)?.couleur_1
  const code = typeof c === "string" ? SOIE_COLOR_CODE[c] : undefined
  return code ? `/soie/colors/soie-${code}.jpg` : undefined
}

/**
 * Libellé des coloris pour un "Lot de 2" bicolore (ex. "Blanc nacré + Rouge
 * rubis"). Renvoie undefined pour une seule couleur (déjà affichée par la
 * variante) ou un article non-soie.
 */
export const soieColorsLabel = (
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
): string | undefined => {
  const m = item.metadata as Record<string, unknown> | undefined
  const c1 = typeof m?.couleur_1 === "string" ? m.couleur_1 : undefined
  const c2 = typeof m?.couleur_2 === "string" ? m.couleur_2 : undefined
  if (c1 && c2 && c2 !== c1) return `${c1} + ${c2}`
  return undefined
}
