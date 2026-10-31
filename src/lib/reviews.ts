import { HttpTypes } from "@medusajs/types"

/**
 * Avis clients RÉELS, stockés dans product.metadata.reviews.
 * Aucun avis n'est inventé : la section reste vide tant qu'il n'y a pas de
 * vrais avis (collectés auprès des premiers acheteurs).
 */
export type Review = {
  author: string
  country?: string
  date?: string // "JJ/MM/AAAA"
  rating: number // 1..5
  title?: string
  text: string
  verified?: boolean
}

export function getReviews(product?: HttpTypes.StoreProduct | null): Review[] {
  const raw = (product?.metadata as any)?.reviews
  if (!Array.isArray(raw)) return []
  return raw
    .filter((r) => r && typeof r.rating === "number" && r.text)
    .map((r) => ({
      author: String(r.author || "Client"),
      country: r.country ? String(r.country) : undefined,
      date: r.date ? String(r.date) : undefined,
      rating: Math.max(1, Math.min(5, Math.round(r.rating))),
      title: r.title ? String(r.title) : undefined,
      text: String(r.text),
      verified: !!r.verified,
    }))
}

export function reviewStats(reviews: Review[]) {
  const count = reviews.length
  const avg = count
    ? reviews.reduce((s, r) => s + r.rating, 0) / count
    : 0
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: reviews.filter((r) => r.rating === star).length,
  }))
  return { count, avg, dist }
}
