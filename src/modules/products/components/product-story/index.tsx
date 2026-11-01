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
    title: "Fini le portefeuille qui déforme ta poche",
    text: "Format pensé pour la poche : tu oublies que tu l'as sur toi. Fini la bosse à l'arrière du jean, place à une silhouette nette et discrète.",
  },
  {
    title: "Tes cartes protégées du piratage",
    text: "La technologie anti-RFID bloque la lecture sans contact de tes cartes. Personne ne peut les scanner à ton insu dans les transports ou la file d'attente.",
  },
  {
    title: "Tout ce qu'il te faut, rien de plus",
    text: "Tes cartes à portée de main, accès instantané d'un seul geste. L'essentiel du quotidien, sans l'encombrement d'un portefeuille classique.",
  },
  {
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

/** Vidéo pleine largeur, bord à bord. */
const VideoBlock = ({ src }: { src: string }) => (
  <video
    src={src}
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    className="block aspect-video w-full object-cover"
  />
)

/** Section bénéfice split 50/50 façon PunCube : média + panneau sombre. */
const BenefitSplit = ({
  img,
  title,
  text,
  reverse,
}: {
  img: string
  title: string
  text: string
  reverse?: boolean
}) => (
  <div
    className={`flex w-full flex-col md:flex-row ${
      reverse ? "md:flex-row-reverse" : ""
    }`}
  >
    <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[26rem] md:w-1/2">
      {img && (
        <Image
          src={img}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      )}
    </div>
    <div className="flex w-full items-center bg-[#272727] px-8 py-12 text-white md:w-1/2 md:px-16">
      <div className="max-w-md">
        <h3 className="text-3xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-4xl">
          {title}
        </h3>
        <p className="mt-5 text-base leading-7 text-neutral-300">{text}</p>
      </div>
    </div>
  </div>
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
      {/* VIDÉO EN ACTION — pleine largeur */}
      <VideoBlock src="/produit-pub.mp4" />

      {/* CHIFFRES CLÉS */}
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

      {/* BÉNÉFICES — split pleine largeur façon PunCube */}
      {BENEFITS.map((b, i) => (
        <BenefitSplit
          key={i}
          img={pick(i + 1)}
          title={b.title}
          text={b.text}
          reverse={i % 2 === 1}
        />
      ))}

      {/* VIDÉO CINÉMATIQUE — pleine largeur */}
      <VideoBlock src="/produit-cinematic.mp4" />

      {/* AVIS */}
      <section id="avis" className="border-t border-ui-border-base bg-ui-bg-subtle">
        <div className="content-container py-12 small:py-16">
          <h2 className="text-center text-3xl font-extrabold uppercase text-ui-fg-base">
            Avis clients
          </h2>

          {count === 0 ? (
            <div className="mx-auto mt-6 max-w-xl text-center">
              <p className="text-ui-fg-subtle">
                Ce produit vient d'arriver dans la boutique. Sois le premier à
                donner ton avis après ta commande — ton retour aide les
                prochains clients.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 flex flex-col items-center gap-8 small:flex-row small:justify-center">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-ui-fg-base">
                    {avg.toFixed(1)}
                  </div>
                  <div>
                    <StarRating value={avg} size={20} />
                    <p className="mt-1 text-sm text-ui-fg-subtle">{count} avis</p>
                  </div>
                </div>
                <div className="w-full max-w-sm">
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
