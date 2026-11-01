import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import StarRating from "../star-rating"
import { getReviews, reviewStats } from "@lib/reviews"

type Props = {
  product: HttpTypes.StoreProduct
  images?: HttpTypes.StoreProductImage[]
}

/** Bénéfices génériques porte-cartes/portefeuille (caractéristiques réelles). */
const BENEFITS = [
  {
    eyebrow: "ULTRA-FIN",
    title: "Fini le portefeuille qui déforme ta poche",
    text: "Format pensé pour la poche : tu oublies que tu l'as sur toi. Fini la bosse disgracieuse à l'arrière du jean, place à une silhouette nette.",
  },
  {
    eyebrow: "ANTI-RFID",
    title: "Tes cartes protégées du piratage sans contact",
    text: "La technologie anti-RFID bloque la lecture à distance de tes cartes bancaires. Personne ne peut les scanner à ton insu dans les transports ou la file d'attente.",
  },
  {
    eyebrow: "CAPACITÉ",
    title: "Tout ce qu'il te faut, rien de plus",
    text: "Tes cartes à portée de main, accès instantané d'un seul geste. L'essentiel du quotidien, sans l'encombrement d'un portefeuille classique.",
  },
  {
    eyebrow: "PREMIUM",
    title: "Des matériaux qui en imposent",
    text: "Aluminium et fibre de carbone : léger, robuste, élégant. L'accessoire qu'on remarque — discrètement — au moment où tu payes.",
  },
]

/** Chiffres clés HONNÊTES (faits produit réels, aucune stat client inventée). */
const STATS = [
  { big: "100%", label: "Anti-RFID garanti" },
  { big: "8 j", label: "Livraison rapide" },
  { big: "30 j", label: "Satisfait ou remboursé" },
]

const VideoBlock = ({ src }: { src: string }) => (
  <section className="w-full bg-black">
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="mx-auto block aspect-video w-full max-w-5xl object-cover"
    />
  </section>
)

const ProductStory = ({ product, images }: Props) => {
  const imgs = (images?.length ? images : product.images || [])
    .map((i) => i.url)
    .filter(Boolean)
  const pick = (i: number) =>
    imgs[i % Math.max(imgs.length, 1)] || product.thumbnail || ""

  const reviews = getReviews(product)
  const { count, avg, dist } = reviewStats(reviews)
  const maxN = Math.max(1, ...dist.map((d) => d.n))

  return (
    <div className="w-full">
      {/* ---------- VIDÉO EN ACTION ---------- */}
      <VideoBlock src="/produit-pub.mp4" />

      {/* ---------- CHIFFRES CLÉS ---------- */}
      <section className="content-container py-10 small:py-14">
        <div className="grid grid-cols-3 gap-4">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl small:text-5xl font-bold text-ui-fg-base">
                {s.big}
              </div>
              <div className="mt-2 text-xs small:text-sm font-semibold uppercase tracking-wide text-ui-fg-subtle">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- BÉNÉFICES ---------- */}
      <section className="content-container pb-10 small:pb-16">
        <div className="flex flex-col gap-12 small:gap-20">
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              className={`flex flex-col gap-6 small:items-center small:gap-12 ${
                i % 2 === 0 ? "small:flex-row" : "small:flex-row-reverse"
              }`}
            >
              <div className="relative aspect-square w-full small:w-1/2 overflow-hidden rounded-2xl bg-ui-bg-subtle">
                {pick(i + 1) && (
                  <Image
                    src={pick(i + 1)}
                    alt={b.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="small:w-1/2">
                <p className="text-xs font-semibold tracking-[0.2em] text-ui-fg-muted">
                  {b.eyebrow}
                </p>
                <h3 className="mt-3 text-2xl small:text-3xl font-bold leading-tight text-ui-fg-base">
                  {b.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-ui-fg-subtle">
                  {b.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- VIDÉO CINÉMATIQUE ---------- */}
      <VideoBlock src="/produit-cinematic.mp4" />

      {/* ---------- AVIS ---------- */}
      <section id="avis" className="border-t border-ui-border-base bg-ui-bg-subtle">
        <div className="content-container py-12 small:py-16">
          <h2 className="text-2xl small:text-3xl font-bold text-ui-fg-base">
            Avis clients
          </h2>

          {count === 0 ? (
            <div className="mt-6 max-w-xl">
              <p className="text-ui-fg-subtle">
                Ce produit vient d'arriver dans la boutique. Sois le premier à
                donner ton avis après ta commande — ton retour aide les
                prochains clients.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 flex flex-col gap-8 small:flex-row small:items-center">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-ui-fg-base">
                    {avg.toFixed(1)}
                  </div>
                  <div>
                    <StarRating value={avg} size={20} />
                    <p className="mt-1 text-sm text-ui-fg-subtle">
                      {count} avis
                    </p>
                  </div>
                </div>
                <div className="flex-1 max-w-sm">
                  {dist.map((d) => (
                    <div key={d.star} className="flex items-center gap-2 py-0.5">
                      <span className="w-3 text-sm text-ui-fg-subtle">
                        {d.star}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-ui-bg-base">
                        <div
                          className="h-full rounded-full bg-[#f5a623]"
                          style={{ width: `${(d.n / maxN) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-sm text-ui-fg-subtle">
                        {d.n}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid gap-6 small:grid-cols-2">
                {reviews.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-ui-border-base bg-ui-bg-base p-5"
                  >
                    <div className="flex items-center justify-between">
                      <StarRating value={r.rating} size={15} />
                      {r.verified && (
                        <span className="rounded-full bg-ui-bg-subtle px-2 py-0.5 text-[11px] font-medium text-ui-fg-subtle">
                          Achat vérifié
                        </span>
                      )}
                    </div>
                    {r.title && (
                      <p className="mt-3 font-semibold text-ui-fg-base">
                        {r.title}
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-6 text-ui-fg-subtle">
                      {r.text}
                    </p>
                    <p className="mt-3 text-xs text-ui-fg-muted">
                      {r.author}
                      {r.country ? ` · ${r.country}` : ""}
                      {r.date ? ` · ${r.date}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProductStory
