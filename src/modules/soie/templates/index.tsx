"use client"

import { addToCart } from "@lib/data/cart"
import { fbq } from "@lib/meta-pixel"
import { ttqTrack } from "@lib/tiktok-pixel"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const IMG_HERO = "/soie/soie-hero.jpg"
const IMG_TEXTURE = "/soie/soie-texture.jpg"
const IMG_DETAIL = "/soie/soie-detail.jpg"
const IMG_CHAMPAGNE = "/soie/soie-champagne.jpg"

const FORMAT_UNITE = "1 taie"
const FORMAT_DUO = "Lot de 2"

// Pastilles coloris (doit refléter les coloris du produit créé par add-soie.ts).
const COLOR_HEX: Record<string, string> = {
  "Blanc nacré": "#EFEAE0",
  Champagne: "#E3D1AE",
  "Or rose": "#E3B7A6",
  "Rose poudré": "#EBC7CC",
  Rose: "#E48AA6",
  "Gris perle": "#C7C5C1",
  "Gris anthracite": "#65656A",
  "Bleu nuit": "#2C3A5B",
  "Bleu paon": "#15707A",
  Émeraude: "#1E6A52",
  Terracotta: "#C65A2E",
  "Rouge rubis": "#8E1F30",
}

// Prix de référence barré selon le format (valeur mise en avant).
const COMPARE_BY_FORMAT: Record<string, number> = {
  [FORMAT_UNITE]: 89,
  [FORMAT_DUO]: 118,
}
const FALLBACK_PRICE: Record<string, number> = {
  [FORMAT_UNITE]: 59,
  [FORMAT_DUO]: 89,
}

/* ------------------------------- icônes ---------------------------------- */

function Icon({ path, className = "" }: { path: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {path.split("|").map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}

const ICONS = {
  hair: "M4 20c0-6 3-12 8-12s8 6 8 12|M8 8c0-2 1.5-4 4-4s4 2 4 4",
  skin: "M12 3a6 6 0 0 0-6 6c0 4 6 12 6 12s6-8 6-12a6 6 0 0 0-6-6z|M12 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  temp: "M12 3a2 2 0 0 0-2 2v8a4 4 0 1 0 4 0V5a2 2 0 0 0-2-2z|M12 15v-6",
  leaf: "M5 21c0-8 6-14 14-14 0 8-6 14-14 14z|M5 21c2-5 5-8 9-10",
  truck: "M3 7h11v8H3z|M14 10h4l3 3v2h-7z|M7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z|M17.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  lock: "M6 10h12v10H6z|M9 10V7a3 3 0 0 1 6 0v3|M12 14v2",
  shield: "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z|M9 12l2 2 4-4",
  heart: "M12 20s-7-4.3-9.3-8.3C1 8.5 2.5 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.5 0 5 3.5 3.3 6.7C19 15.7 12 20 12 20z",
  check: "M5 12l5 5L20 7",
  plus: "M12 5v14|M5 12h14",
  star: "M12 3l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L12 16.6 6.7 19.3l1.1-5.9L3.4 9.3l6-.8L12 3z",
  ruler: "M4 8h16v8H4z|M8 8v4|M12 8v4|M16 8v4",
  box: "M4 7l8-4 8 4-8 4-8-4z|M4 7v10l8 4 8-4V7|M12 11v10",
  droplet: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
}

/* --------------------------------- page ---------------------------------- */

export default function SoieFunnel({ product, countryCode }: Props) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  const colorOption = useMemo(
    () => product.options?.find((o) => o.title === "Couleur"),
    [product.options]
  )
  const colors = useMemo(
    () =>
      (colorOption?.values ?? [])
        .map((v) => v.value)
        .filter((v): v is string => Boolean(v)),
    [colorOption]
  )

  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "Champagne")
  const [selectedFormat, setSelectedFormat] = useState(FORMAT_DUO)

  const selectedVariant = useMemo(() => {
    return product.variants?.find((v) => {
      const vals = (v.options ?? []).map((o: any) => o.value)
      return vals.includes(selectedColor) && vals.includes(selectedFormat)
    })
  }, [product.variants, selectedColor, selectedFormat])

  const currency =
    selectedVariant?.calculated_price?.currency_code ??
    product.variants?.[0]?.calculated_price?.currency_code ??
    "chf"
  const locale = currency.toLowerCase() === "eur" ? "fr-FR" : "fr-CH"

  const amount =
    selectedVariant?.calculated_price?.calculated_amount ??
    FALLBACK_PRICE[selectedFormat]
  const priceLabel = convertToLocale({ amount, currency_code: currency, locale })

  const compareAmount = COMPARE_BY_FORMAT[selectedFormat]
  const compareLabel = convertToLocale({
    amount: compareAmount,
    currency_code: currency,
    locale,
  })
  const discountPct = Math.max(
    0,
    Math.round((1 - amount / compareAmount) * 100)
  )

  const priceForFormat = (fmt: string) => {
    const v = product.variants?.find((variant) => {
      const vals = (variant.options ?? []).map((o: any) => o.value)
      return vals.includes(selectedColor) && vals.includes(fmt)
    })
    const a = v?.calculated_price?.calculated_amount ?? FALLBACK_PRICE[fmt]
    return convertToLocale({ amount: a, currency_code: currency, locale })
  }

  const handleBuy = async () => {
    if (!selectedVariant?.id || isAdding) return
    setIsAdding(true)
    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })

      const value = amount
      const cur = currency.toUpperCase()

      fbq("AddToCart", {
        content_ids: [selectedVariant.id],
        content_name: product.title,
        content_type: "product",
        contents: [{ id: selectedVariant.id, quantity: 1, item_price: value }],
        value,
        currency: cur,
      })
      fbq("InitiateCheckout", {
        content_ids: [selectedVariant.id],
        content_name: product.title,
        value,
        currency: cur,
        num_items: 1,
      })
      ttqTrack("AddToCart", {
        content_id: selectedVariant.id,
        content_name: product.title,
        content_type: "product",
        quantity: 1,
        price: value,
        value,
        currency: cur,
      })

      router.push(`/${countryCode}/checkout`)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-[#FBF8F3] text-[#241E1A]">
      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[460px] rounded-full bg-[#E3D1AE]/40 blur-[130px]" />
        <div className="pointer-events-none absolute -left-24 top-60 h-[360px] w-[360px] rounded-full bg-[#EBC7CC]/40 blur-[130px]" />

        <div className="content-container relative grid grid-cols-1 items-center gap-12 py-12 lg:grid-cols-2 lg:gap-10 lg:py-20">
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A86B]/40 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9A7B3F]">
              Soie de mûrier 100%
            </span>

            <h1 className="mt-5 font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-[54px]">
              Réveillez-vous
              <br />
              <span className="italic text-[#A9823F]">plus belle.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#6B625B] sm:text-lg">
              La soie de mûrier glisse sur la peau et les cheveux au lieu de
              les tirer : moins de frisottis, moins de plis d'oreiller au
              réveil, une peau préservée. Nuit après nuit.
            </p>

            {/* Coloris */}
            <div className="mt-8">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Coloris :</span>
                <span className="text-[#6B625B]">{selectedColor}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {colors.map((c) => {
                  const active = c === selectedColor
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      title={c}
                      aria-label={c}
                      aria-pressed={active}
                      className={`h-9 w-9 rounded-full ring-1 ring-black/10 transition-all ${
                        active
                          ? "ring-2 ring-offset-2 ring-offset-[#FBF8F3] ring-[#A9823F] scale-105"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: COLOR_HEX[c] ?? "#D9D4CC" }}
                    />
                  )
                })}
              </div>
            </div>

            {/* Format */}
            <div className="mt-7 grid grid-cols-2 gap-3">
              <FormatCard
                active={selectedFormat === FORMAT_UNITE}
                onClick={() => setSelectedFormat(FORMAT_UNITE)}
                title="1 taie"
                price={priceForFormat(FORMAT_UNITE)}
              />
              <FormatCard
                active={selectedFormat === FORMAT_DUO}
                onClick={() => setSelectedFormat(FORMAT_DUO)}
                title="Lot de 2"
                price={priceForFormat(FORMAT_DUO)}
                badge="Le plus choisi"
                note="Économisez 29 CHF"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-3xl font-semibold">{priceLabel}</span>
              <span className="text-xl text-[#6B625B]/60 line-through">
                {compareLabel}
              </span>
              {discountPct > 0 && (
                <span className="rounded-full bg-[#A9823F]/12 px-2.5 py-1 text-xs font-bold text-[#A9823F]">
                  -{discountPct}%
                </span>
              )}
            </div>
            <div className="mt-2 text-sm text-[#6B625B]">
              Livraison offerte · Satisfait ou remboursé 30 jours
            </div>

            <div className="mt-6">
              <CTAButton onClick={handleBuy} loading={isAdding}>
                Ajouter au panier
              </CTAButton>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6B625B]">
              <TrustInline icon={ICONS.truck} label="Livraison offerte" />
              <TrustInline icon={ICONS.lock} label="Paiement sécurisé" />
              <TrustInline icon={ICONS.leaf} label="Soie naturelle" />
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-[2rem] bg-[#E3D1AE]/30 blur-2xl" />
              <img
                src={IMG_HERO}
                alt="Taie d'oreiller en soie de mûrier"
                className="h-auto w-[320px] rounded-[1.75rem] object-cover shadow-[0_30px_60px_-20px_rgba(60,40,20,0.35)] sm:w-[420px] lg:w-[520px]"
                width={520}
                height={520}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================= BANDEAU CONFIANCE ======================= */}
      <section className="border-y border-[#241E1A]/8 bg-white/50">
        <div className="content-container grid grid-cols-2 gap-6 py-6 text-center sm:grid-cols-4">
          <TrustBadge icon={ICONS.truck} title="Livraison offerte" sub="Dès aujourd'hui" />
          <TrustBadge icon={ICONS.shield} title="30 jours" sub="Satisfait ou remboursé" />
          <TrustBadge icon={ICONS.lock} title="Paiement sécurisé" sub="Carte, Apple & Google Pay" />
          <TrustBadge icon={ICONS.heart} title="Support en français" sub="On vous répond" />
        </div>
      </section>

      {/* ============================= BÉNÉFICES =========================== */}
      <section className="content-container py-16 sm:py-24">
        <SectionHead
          eyebrow="Pourquoi la soie"
          title="Un seul geste, trois bienfaits chaque nuit"
          sub="La soie de mûrier n'est pas qu'un luxe : c'est un vrai soin beauté pendant votre sommeil."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={ICONS.hair}
            title="Cheveux lissés"
            text="La surface ultra-douce réduit les frottements : moins de frisottis, moins de casse, et une coiffure qui tient plus longtemps."
          />
          <FeatureCard
            icon={ICONS.skin}
            title="Peau préservée"
            text="Fini les plis d'oreiller marqués au réveil. La soie glisse au lieu de tirer la peau et aide à préserver son éclat."
          />
          <FeatureCard
            icon={ICONS.temp}
            title="Thermorégulante"
            text="Fraîche en été, douce en hiver : la soie régule naturellement la température pour des nuits plus confortables."
          />
          <FeatureCard
            icon={ICONS.leaf}
            title="Saine & hypoallergénique"
            text="Fibre naturelle qui absorbe moins l'humidité et vos soins de nuit, et retient moins les acariens et poussières."
          />
        </div>
      </section>

      {/* ========================= PROBLÈME / SOLUTION ===================== */}
      <section className="bg-[#F3ECE1]">
        <div className="content-container grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div className="relative flex justify-center lg:order-2">
            <div className="rounded-[2rem] border border-[#C8A86B]/30 bg-white/50 p-3">
              <img
                src={IMG_TEXTURE}
                alt="Texture de la soie de mûrier"
                className="h-auto w-[300px] rounded-[1.5rem] object-cover sm:w-[400px]"
                width={400}
                height={400}
              />
            </div>
          </div>
          <div className="lg:order-1">
            <SectionHead
              align="left"
              eyebrow="Le coton vous trahit"
              title="Votre taie en coton abîme vos cheveux et votre peau"
              sub="Le coton accroche, tire et absorbe. Chaque nuit, il crée des frottements qui cassent le cheveu, marquent la peau et aspirent vos crèmes de nuit."
            />
            <ul className="mt-8 space-y-4">
              <SolutionLine text="La soie glisse : vos cheveux ne s'emmêlent plus pendant la nuit." />
              <SolutionLine text="Moins de plis d'oreiller — vous vous réveillez le visage reposé." />
              <SolutionLine text="Vos soins restent sur votre peau, pas dans la taie." />
              <SolutionLine text="Un petit geste, une vraie différence visible en quelques nuits." />
            </ul>
          </div>
        </div>
      </section>

      {/* =========================== DÉTAILS / SPECS ======================= */}
      <section className="content-container py-16 sm:py-24">
        <SectionHead eyebrow="Les détails" title="Une qualité qui se voit et se touche" />
        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex justify-center">
            <img
              src={IMG_DETAIL}
              alt="Finitions de la taie en soie"
              className="h-auto w-[320px] rounded-[1.75rem] object-cover shadow-xl sm:w-[440px]"
              width={440}
              height={440}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <Spec icon={ICONS.leaf} label="Matière" value="Soie de mûrier 100%" />
            <Spec icon={ICONS.ruler} label="Dimensions" value="48 × 74 cm" />
            <Spec icon={ICONS.box} label="Fermeture" value="Enveloppe (sans zip)" />
            <Spec icon={ICONS.droplet} label="Tissage" value="Satin, toucher fluide" />
            <Spec icon={ICONS.temp} label="Confort" value="Thermorégulant" />
            <Spec icon={ICONS.heart} label="Coloris" value="12 teintes élégantes" />
          </div>
        </div>
      </section>

      {/* ============================ COMMENT ============================== */}
      <section className="bg-[#F3ECE1]">
        <div className="content-container py-16 sm:py-24">
          <SectionHead eyebrow="Si simple" title="En 3 étapes" />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <StepCard
              n="1"
              title="Choisissez votre teinte"
              text="12 coloris élégants pour s'accorder à votre chambre et à votre style."
            />
            <StepCard
              n="2"
              title="Glissez-la sur l'oreiller"
              text="Fermeture enveloppe : elle se met en place en un geste et reste bien en place."
            />
            <StepCard
              n="3"
              title="Dormez, elle fait le reste"
              text="Cheveux plus lisses, peau préservée. La différence se voit dès les premières nuits."
            />
          </div>
        </div>
      </section>

      {/* ============================== AVIS =============================== */}
      <section className="content-container py-16 sm:py-24">
        <SectionHead eyebrow="Témoignages" title="Elles ne reviendraient pas au coton" />
        <p className="mx-auto -mt-6 mb-2 text-center text-xs italic text-[#6B625B]/70">
          Avis d'exemple — à remplacer par vos avis clients vérifiés avant le
          lancement.
        </p>
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 items-start gap-5 md:grid-cols-3">
          <Review
            initial="C"
            author="Camille"
            city="Lausanne"
            text="Mes cheveux sont nettement moins emmêlés le matin. Je ne dormirai plus jamais sans."
          />
          <Review
            initial="S"
            author="Sarah"
            city="Genève"
            text="Fini les marques d'oreiller sur le visage. La qualité de la soie est vraiment au rendez-vous."
          />
          <Review
            initial="L"
            author="Léa"
            city="Annecy"
            text="J'ai pris le lot de 2 pour en avoir une au lavage. Douce, élégante, j'adore la couleur."
          />
        </div>
      </section>

      {/* ============================== OFFRE ============================== */}
      <section className="bg-[#F3ECE1]">
        <div className="content-container py-16 sm:py-24">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#C8A86B]/30 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <img
                src={IMG_CHAMPAGNE}
                alt="Taie d'oreiller en soie"
                className="h-56 w-full object-cover sm:h-full"
              />
              <div className="p-8 sm:p-10">
                <h3 className="font-serif text-2xl sm:text-3xl">
                  Taie en soie de mûrier
                </h3>
                <p className="mt-2 text-sm text-[#6B625B]">
                  {selectedColor} · 48 × 74 cm · {selectedFormat}
                </p>
                <ul className="mt-6 space-y-3">
                  <Included text="Soie de mûrier 100%, tissage satin" />
                  <Included text="12 coloris disponibles" />
                  <Included text="Livraison offerte" />
                  <Included text="Satisfait ou remboursé 30 jours" />
                </ul>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-4xl font-semibold">{priceLabel}</span>
                  <span className="text-lg text-[#6B625B]/60 line-through">
                    {compareLabel}
                  </span>
                </div>
                <div className="mt-5">
                  <CTAButton onClick={handleBuy} loading={isAdding}>
                    Ajouter au panier
                  </CTAButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================== FAQ =============================== */}
      <section className="content-container py-16 sm:py-24">
        <SectionHead eyebrow="Vous vous demandez…" title="Questions fréquentes" />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-[#241E1A]/10 border-y border-[#241E1A]/10">
          <Faq
            q="Est-ce de la vraie soie ?"
            a="Oui, la face en contact avec la peau et les cheveux est en soie de mûrier 100%, le même type de soie utilisé par les grandes marques de literie en soie."
          />
          <Faq
            q="Quelle taille d'oreiller ?"
            a="La taie mesure 48 × 74 cm, le format rectangulaire standard le plus courant. Fermeture enveloppe pour un maintien parfait, sans zip qui gêne."
          />
          <Faq
            q="Comment l'entretenir ?"
            a="Lavage délicat à froid (30°C max), idéalement en filet, séchage à l'air libre. Pas de sèche-linge ni d'adoucissant pour préserver la soie."
          />
          <Faq
            q="Combien de temps pour la livraison ?"
            a="La livraison est offerte. Comptez environ 10 à 15 jours de délai. Un numéro de suivi vous est envoyé dès l'expédition."
          />
          <Faq
            q="Pourquoi le lot de 2 ?"
            a="C'est l'idéal : une sur l'oreiller pendant que l'autre passe au lavage, ou une seconde teinte pour varier. Et vous économisez 29 CHF."
          />
        </div>
      </section>

      {/* ============================ CTA FINAL =========================== */}
      <section className="relative overflow-hidden border-t border-[#241E1A]/8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-[#E3D1AE]/40 blur-[130px]" />
        <div className="content-container relative py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl tracking-tight sm:text-4xl">
            Offrez à vos nuits le toucher de la soie.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#6B625B]">
            Cheveux sublimés, peau préservée — à partir de {priceForFormat(FORMAT_UNITE)}.
            Livraison offerte.
          </p>
          <div className="mt-8 flex justify-center">
            <CTAButton onClick={handleBuy} loading={isAdding}>
              Ajouter au panier
            </CTAButton>
          </div>
        </div>
      </section>

      {/* ======================= BARRE STICKY MOBILE ====================== */}
      <div className="sticky bottom-0 z-40 border-t border-[#241E1A]/10 bg-[#FBF8F3]/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-[#6B625B]">
              Taie en soie · {selectedFormat}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold leading-tight">
                {priceLabel}
              </span>
              <span className="text-sm text-[#6B625B]/60 line-through">
                {compareLabel}
              </span>
            </div>
          </div>
          <button
            onClick={handleBuy}
            disabled={isAdding}
            className="flex-1 rounded-full bg-[#241E1A] px-5 py-3 text-sm font-bold text-white shadow-lg transition-opacity disabled:opacity-60"
          >
            {isAdding ? "Un instant…" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- sous-composants ---------------------------- */

function CTAButton({
  children,
  onClick,
  loading,
  className = "",
}: {
  children: React.ReactNode
  onClick: () => void
  loading?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#241E1A] px-8 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-10px_rgba(36,30,26,0.6)] transition-all hover:bg-[#3a302a] hover:shadow-[0_18px_36px_-10px_rgba(36,30,26,0.7)] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? "Un instant…" : children}
    </button>
  )
}

function FormatCard({
  active,
  onClick,
  title,
  price,
  badge,
  note,
}: {
  active: boolean
  onClick: () => void
  title: string
  price: string
  badge?: string
  note?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-[#A9823F] bg-white shadow-sm ring-1 ring-[#A9823F]"
          : "border-[#241E1A]/12 bg-white/50 hover:border-[#241E1A]/25"
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 right-3 rounded-full bg-[#A9823F] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {badge}
        </span>
      )}
      <div className="flex items-center gap-2">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
            active ? "border-[#A9823F] bg-[#A9823F]" : "border-[#241E1A]/30"
          }`}
        >
          {active && <Icon path={ICONS.check} className="h-3 w-3 text-white" />}
        </span>
        <span className="font-semibold">{title}</span>
      </div>
      <div className="mt-2 text-lg font-semibold">{price}</div>
      {note && <div className="text-xs font-medium text-[#A9823F]">{note}</div>}
    </button>
  )
}

function TrustInline({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon path={icon} className="h-4 w-4 text-[#A9823F]" />
      {label}
    </span>
  )
}

function TrustBadge({
  icon,
  title,
  sub,
}: {
  icon: string
  title: string
  sub: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon path={icon} className="h-6 w-6 text-[#A9823F]" />
      <div className="mt-1 text-sm font-semibold">{title}</div>
      <div className="text-xs text-[#6B625B]">{sub}</div>
    </div>
  )
}

function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string
  title: string
  sub?: string
  align?: "center" | "left"
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A9823F]">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-[#6B625B]">{sub}</p>}
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: string
  title: string
  text: string
}) {
  return (
    <div className="group rounded-2xl border border-[#241E1A]/8 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE1] text-[#A9823F]">
        <Icon path={icon} className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#6B625B]">{text}</p>
    </div>
  )
}

function SolutionLine({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#A9823F]/15 text-[#A9823F]">
        <Icon path={ICONS.check} className="h-3.5 w-3.5" />
      </span>
      <span className="text-[#3a332d]">{text}</span>
    </li>
  )
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#241E1A]/10 pb-4">
      <Icon path={icon} className="h-5 w-5 flex-none text-[#A9823F]" />
      <div>
        <div className="text-xs uppercase tracking-wide text-[#6B625B]">
          {label}
        </div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  )
}

function StepCard({
  n,
  title,
  text,
}: {
  n: string
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-[#241E1A]/8 bg-white p-7">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A9823F] text-sm font-bold text-white">
        {n}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#6B625B]">{text}</p>
    </div>
  )
}

function Review({
  initial,
  author,
  city,
  text,
}: {
  initial: string
  author: string
  city: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-[#241E1A]/8 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#A9823F] text-sm font-bold text-white">
          {initial}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold">{author}</div>
          <div className="text-xs text-[#6B625B]">{city}</div>
        </div>
        <div className="ml-auto flex gap-0.5 text-[#A9823F]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} path={ICONS.star} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#3a332d]">“{text}”</p>
    </div>
  )
}

function Included({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-[#3a332d]">
      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#A9823F]/15 text-[#A9823F]">
        <Icon path={ICONS.check} className="h-3.5 w-3.5" />
      </span>
      {text}
    </li>
  )
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium">{q}</span>
        <span
          className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[#241E1A]/20 transition-transform ${
            open ? "rotate-45" : ""
          }`}
        >
          <Icon path={ICONS.plus} className="h-4 w-4" />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <p className="overflow-hidden text-sm leading-relaxed text-[#6B625B]">
          {a}
        </p>
      </div>
    </div>
  )
}
