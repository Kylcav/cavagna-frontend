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

/* --------------------------------- icônes --------------------------------- */

function Icon({ path, className = "" }: { path: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
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
  clock: "M12 7v5l3 2|M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  leaf: "M11 20A7 7 0 0 1 4 13c0-5 5-9 16-9 0 10-4 14-9 14z|M4 20c3-6 7-8 12-9",
  coins:
    "M9 9m-5 0a5 2.5 0 1 0 10 0 5 2.5 0 1 0-10 0|M4 9v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V9|M10 15.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4c0-1.4-2.2-2.5-5-2.5-1 0-1.9.1-2.7.4",
  recycle:
    "M7 19H5a2 2 0 0 1-1.7-3l1.3-2.2|M9.5 4.5l1-1.7a2 2 0 0 1 3.4 0L15 4.5|M17 8l1.3 2.2A2 2 0 0 1 17 13h-2|M7 13l-2 .5.5 2|M15 4.5l2 .5-.5 2|M9 19h5l-1.5 1.5M14 19l-1.5-1.5",
  nut: "M12 3l7 4v8l-7 4-7-4V7z|M12 3v18|M5 7l7 4 7-4",
  water: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  check: "M5 12l5 5L20 7",
  plus: "M12 5v14|M5 12h14",
  truck:
    "M3 7h11v8H3z|M14 10h4l3 3v2h-7z|M7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z|M17.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  shield: "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z|M9 12l2 2 4-4",
  spark: "M12 3v4|M12 17v4|M3 12h4|M17 12h4|M6 6l2 2|M16 16l2 2|M18 6l-2 2|M8 16l-2 2",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  broom: "M3 21l6-6|M14 4l6 6|M9 15l5-11 6 6-11 5z|M9 15l-3 3 3 3 3-3",
}

/* --------------------------------- page ---------------------------------- */

export default function LatteoFunnel({ product, countryCode }: Props) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  const selectedVariant = useMemo(
    () => product.variants?.[0],
    [product.variants]
  )

  const amount = selectedVariant?.calculated_price?.calculated_amount ?? 149
  const currency = selectedVariant?.calculated_price?.currency_code ?? "chf"
  const locale = currency.toLowerCase() === "eur" ? "fr-FR" : "fr-CH"
  const priceLabel = convertToLocale({ amount, currency_code: currency, locale })

  const COMPARE_AMOUNT = 199
  const compareLabel = convertToLocale({
    amount: COMPARE_AMOUNT,
    currency_code: currency,
    locale,
  })
  const discountPct = Math.max(
    0,
    Math.round((1 - amount / COMPARE_AMOUNT) * 100)
  )

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
    <div className="bg-[#F6F2E9] text-[#2B2B24]">
      {/* ============================= HERO ============================= */}
      <section className="relative overflow-hidden">
        <div className="content-container grid grid-cols-1 items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#4F5D43]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#4F5D43]">
              <Icon path={ICONS.leaf} className="h-3.5 w-3.5" />
              Lait végétal maison
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[54px]">
              Du lait végétal frais,
              <br />
              <span className="text-[#4F5D43]">en 60 secondes.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#2B2B24]/70">
              Amande, avoine, noisette, soja… À partir d'ingrédients bruts du
              quotidien. Sans additifs, sans conservateurs, et jusqu'à 90 % moins
              cher que les briques du commerce.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-3xl font-bold">{priceLabel}</span>
              <span className="text-xl text-[#2B2B24]/35 line-through">
                {compareLabel}
              </span>
              <span className="rounded-full bg-[#C97B4A]/15 px-2.5 py-1 text-xs font-bold text-[#C97B4A]">
                -{discountPct}%
              </span>
            </div>
            <div className="mt-1.5 text-sm text-[#2B2B24]/55">
              Livraison offerte · Reçu en 7 à 12 jours · Garantie 2 ans
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CTAButton onClick={handleBuy} loading={isAdding}>
                Commander Lattéo
              </CTAButton>
              <a
                href="#comment"
                className="inline-flex items-center justify-center rounded-full border border-[#2B2B24]/20 px-6 py-4 text-sm font-semibold text-[#2B2B24]/75 transition-colors hover:border-[#4F5D43] hover:text-[#4F5D43]"
              >
                Comment ça marche
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#2B2B24]/60">
              <TrustInline icon={ICONS.clock} label="Prêt en 60 s" />
              <TrustInline icon={ICONS.leaf} label="Sans additifs" />
              <TrustInline icon={ICONS.coins} label="90 % moins cher" />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 -z-10 translate-y-6 scale-110 rounded-full bg-[#DDE4CF] blur-2xl" />
              <div className="overflow-hidden rounded-[2rem] border border-[#2B2B24]/8 bg-white shadow-xl">
                <img
                  src="/latteo/latteo-main.jpg"
                  alt="Machine à lait végétal Lattéo"
                  className="h-auto w-[320px] object-cover sm:w-[420px]"
                  width={420}
                  height={420}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= BANDEAU VALEURS ========================= */}
      <section className="border-y border-[#2B2B24]/8 bg-[#EFE9DC]">
        <div className="content-container grid grid-cols-2 gap-6 py-7 text-center sm:grid-cols-4">
          <ValueItem icon={ICONS.clock} title="60 secondes" sub="Frais à la demande" />
          <ValueItem icon={ICONS.coins} title="Jusqu'à 90 % moins cher" sub="Qu'en magasin" />
          <ValueItem icon={ICONS.nut} title="Tous les ingrédients" sub="Noix, céréales, graines" />
          <ValueItem icon={ICONS.shield} title="Garantie 2 ans" sub="Satisfait ou remboursé 30 j" />
        </div>
      </section>

      {/* ===================== AVIS (placeholder à remplir) ===================== */}
      <section className="content-container py-16 sm:py-20">
        <SectionHead
          eyebrow="Ils en parlent"
          title="Les avis de nos clients"
          sub="À compléter avec de VRAIS avis vérifiés avant le lancement des publicités (ne jamais inventer d'avis)."
        />
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-dashed border-[#2B2B24]/20 bg-white/50 p-6 text-center text-sm text-[#2B2B24]/45"
            >
              Emplacement avis client #{i}
              <div className="mt-2 text-xs">
                (à remplir avec un vrai avis vérifié)
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================= BÉNÉFICES ============================= */}
      <section className="bg-[#FDFBF6]">
        <div className="content-container py-16 sm:py-24">
          <SectionHead
            eyebrow="Pourquoi Lattéo"
            title="Un meilleur choix : pour toi, ton portefeuille et la planète"
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <BenefitCard
              icon={ICONS.clock}
              title="Prêt en 60 secondes"
              text="Tu verses tes ingrédients et de l'eau, tu appuies. La machine chauffe et mixe toute seule. Frais, à la demande."
            />
            <BenefitCard
              icon={ICONS.leaf}
              title="Sans additifs ni conservateurs"
              text="Tu contrôles exactement ce que tu bois. Rien d'autre que ce que tu mets dedans — fini les listes d'ingrédients à rallonge."
            />
            <BenefitCard
              icon={ICONS.nut}
              title="Tous les laits que tu veux"
              text="Amande, avoine, noisette, soja, riz, graines… et même des soupes et des smoothies chauds. Une machine, mille recettes."
            />
            <BenefitCard
              icon={ICONS.water}
              title="Facile et rapide à nettoyer"
              text="Panier-filtre amovible, fonction auto-nettoyage. Un rinçage et c'est reparti. Zéro corvée."
            />
          </div>
        </div>
      </section>

      {/* ========================= ÉCONOMIES (angle clé) ======================= */}
      <section className="content-container py-16 sm:py-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#4F5D43]/15 bg-[#EFF2E6] p-8 sm:p-12">
          <SectionHead
            eyebrow="Fais le calcul"
            title="Rentabilisée en quelques semaines"
            sub="Le lait végétal du commerce coûte cher — et tu paies surtout de l'eau et des emballages."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <CostCard
              label="1 L maison avec Lattéo"
              price="≈ 0,40 €"
              note="Juste les ingrédients bruts"
              highlight
            />
            <CostCard
              label="1 L de lait d'amande en magasin"
              price="≈ 2,50 €"
              note="Rempli d'eau et d'additifs"
            />
            <CostCard
              label="Ton économie / an*"
              price="≈ 110 €"
              note="*Sur une base d'1 L par semaine"
              highlight
            />
          </div>
          <p className="mt-8 text-center text-sm text-[#2B2B24]/60">
            À ce rythme, <strong className="text-[#4F5D43]">la machine est
            remboursée en moins de 2 mois</strong> — et elle continue de te faire
            économiser, bouteille après bouteille.
          </p>
          <div className="mt-6 flex justify-center">
            <CTAButton onClick={handleBuy} loading={isAdding}>
              Je veux économiser
            </CTAButton>
          </div>
        </div>
      </section>

      {/* =========================== COMMENT ÇA MARCHE ======================= */}
      <section id="comment" className="scroll-mt-20 bg-[#FDFBF6]">
        <div className="content-container py-16 sm:py-24">
          <SectionHead
            eyebrow="Simple comme bonjour"
            title="Ton lait frais en 4 étapes"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4">
            <StepCard
              n="1"
              title="Ajoute les ingrédients"
              text="Mets amandes, avoine ou graines dans le panier-filtre Lattéo."
            />
            <StepCard
              n="2"
              title="Verse de l'eau"
              text="Remplis le pichet, referme et appuie sur Start."
            />
            <StepCard
              n="3"
              title="Laisse faire"
              text="La machine chauffe et mixe. 60 secondes plus tard, c'est prêt."
            />
            <StepCard
              n="4"
              title="Savoure & recycle"
              text="Déguste frais. Réutilise la pulpe pour un porridge ou une pâtisserie."
            />
          </div>
        </div>
      </section>

      {/* ============================== RECETTES ============================ */}
      <section id="recettes" className="scroll-mt-20">
        <div className="content-container py-16 sm:py-24">
          <SectionHead
            eyebrow="Bien plus que du lait"
            title="Des recettes pour tous les jours"
            sub="Avec Lattéo et les restes du panier-filtre, tu crées une infinité de boissons et de douceurs."
          />
          <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            <RecipeCard
              img="/latteo/recette-amande.jpg"
              title="Lait d'amande"
              time="60 secondes"
            />
            <RecipeCard
              img="/latteo/recette-golden.jpg"
              title="Golden latte"
              time="5 minutes"
            />
            <RecipeCard
              img="/latteo/recette-chai.jpg"
              title="Chai latte"
              time="10 minutes"
            />
            <RecipeCard
              img="/latteo/recette-granola.jpg"
              title="Granola maison"
              time="30 minutes"
            />
          </div>
        </div>
      </section>

      {/* ============================ ÉCO / DÉCHETS ========================= */}
      <section className="bg-[#EFE9DC]">
        <div className="content-container grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <SectionHead
              align="left"
              eyebrow="Moins de déchets"
              title="Plus goûtu, et plus léger pour la planète"
              sub="Chaque année, des milliards de briques et bouteilles à usage unique sont produites, transportées puis jetées."
            />
            <ul className="mt-8 space-y-4">
              <SolutionLine text="Fini les briques en carton plastifié qui s'empilent dans le tri." />
              <SolutionLine text="Tu achètes des ingrédients bruts, en vrac si tu veux." />
              <SolutionLine text="Tu bois frais, juste ce qu'il te faut — zéro gaspillage." />
            </ul>
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <div className="overflow-hidden rounded-[2rem] border border-[#2B2B24]/8 bg-white shadow-sm">
              <img
                src="/latteo/ingredients.jpg"
                alt="Ingrédients bruts pour lait végétal : amandes, avoine, noisettes"
                className="h-auto w-[320px] object-cover sm:w-[460px]"
                width={460}
                height={345}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================ NOTRE HISTOIRE ======================== */}
      <section id="histoire" className="scroll-mt-20 bg-[#FDFBF6]">
        <div className="content-container grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-[auto_1fr]">
          <div className="flex justify-center">
            <div className="overflow-hidden rounded-[2rem] border border-[#2B2B24]/8 bg-white shadow-sm">
              <img
                src="/latteo/founders.jpg"
                alt="Préparation du lait végétal maison avec Lattéo"
                className="h-auto w-[300px] object-cover sm:w-[380px]"
                width={380}
                height={420}
              />
            </div>
          </div>
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4F5D43]">
              Qui sommes-nous
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Une histoire de famille
            </h2>
            <div className="mt-5 space-y-4 text-[#2B2B24]/70">
              <p>
                Nous sommes <strong className="text-[#2B2B24]">Clara et Louis
                Cavagna</strong>. Il y a quelques années, en voulant manger plus
                végétal, on s'est heurtés à un mur : les laits du commerce étaient
                chers, pleins d'additifs, et emballés dans des montagnes de
                cartons.
              </p>
              <p>
                Les faire nous-mêmes prenait du temps et salissait toute la
                cuisine. On s'est dit qu'il devait exister une façon plus simple,
                plus saine et plus durable de préparer ses boissons au quotidien.
              </p>
              <p>
                C'est comme ça qu'est né <strong className="text-[#4F5D43]">
                Lattéo</strong> : une machine qui te rend le lait végétal frais,
                en 60 secondes, à partir d'ingrédients que tu choisis. Pas
                d'additifs, moins de déchets, et plus de liberté dans ton verre.
              </p>
            </div>
            <div className="mt-6 text-sm font-semibold text-[#4F5D43]">
              Clara & Louis — fondateurs de Lattéo
            </div>
          </div>
        </div>
      </section>

      {/* =============================== OFFRE ============================= */}
      <section id="acheter" className="scroll-mt-20">
        <div className="content-container py-16 sm:py-24">
          <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-[#2B2B24]/10 bg-white shadow-sm lg:grid-cols-2">
            <div className="bg-[#EFF2E6] p-6">
              <img
                src="/latteo/latteo-main.jpg"
                alt="Machine à lait végétal Lattéo"
                className="mx-auto h-auto w-full max-w-sm rounded-2xl object-cover"
                width={420}
                height={420}
              />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  "/latteo/hero-lifestyle.jpg",
                  "/latteo/recette-amande.jpg",
                  "/latteo/ingredients.jpg",
                ].map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt="Boissons végétales préparées avec Lattéo"
                      className="h-20 w-full rounded-xl object-cover"
                      width={120}
                      height={80}
                    />
                  )
                )}
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <h3 className="text-2xl font-bold sm:text-3xl">
                Machine à lait végétal Lattéo
              </h3>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-4xl font-bold">{priceLabel}</span>
                <span className="text-xl text-[#2B2B24]/35 line-through">
                  {compareLabel}
                </span>
                <span className="rounded-full bg-[#C97B4A]/15 px-2.5 py-1 text-xs font-bold text-[#C97B4A]">
                  -{discountPct}%
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                <Included text="La machine Lattéo + panier-filtre" />
                <Included text="Prépare amande, avoine, soja, noisette…" />
                <Included text="Prêt en 60 secondes, sans additifs" />
                <Included text="Livraison offerte · Garantie 2 ans" />
                <Included text="Satisfait ou remboursé 30 jours" />
              </ul>

              <div className="mt-8">
                <CTAButton onClick={handleBuy} loading={isAdding} full>
                  Commander maintenant
                </CTAButton>
              </div>
              <div className="mt-3 flex items-center justify-center gap-5 text-xs text-[#2B2B24]/50">
                <span className="inline-flex items-center gap-1.5">
                  <Icon path={ICONS.shield} className="h-4 w-4" /> Paiement sécurisé
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon path={ICONS.truck} className="h-4 w-4" /> Livraison offerte
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================== FAQ =============================== */}
      <section id="faq" className="scroll-mt-20 bg-[#FDFBF6]">
        <div className="content-container py-16 sm:py-24">
          <SectionHead eyebrow="Tu te demandes…" title="Questions fréquentes" />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-[#2B2B24]/10 border-y border-[#2B2B24]/10">
            <Faq
              q="Quels laits puis-je préparer ?"
              a="Amande, avoine, noisette, soja, riz, graines de chanvre ou de tournesol… Tu peux aussi faire des soupes et des boissons chaudes. Tu contrôles le goût et la texture en ajustant les quantités."
            />
            <Faq
              q="C'est vraiment prêt en 60 secondes ?"
              a="Le cycle de préparation est ultra-rapide. Tu ajoutes les ingrédients et l'eau, tu appuies, la machine chauffe et mixe toute seule — tu obtiens un lait frais et tiède en une minute."
            />
            <Faq
              q="Est-ce facile à nettoyer ?"
              a="Oui. Le panier-filtre est amovible et la machine dispose d'une fonction d'auto-nettoyage : un peu d'eau, un cycle, un rinçage et c'est propre."
            />
            <Faq
              q="Combien je vais réellement économiser ?"
              a="Un litre de lait végétal maison revient à environ 0,40 € d'ingrédients, contre ~2,50 € en magasin. Si tu bois un litre par semaine, tu économises une centaine d'euros par an — la machine est remboursée en moins de deux mois."
            />
            <Faq
              q="Comment se passe la livraison ?"
              a="La livraison est offerte et tu reçois ta machine sous 7 à 12 jours, avec un suivi dès l'expédition. Elle est garantie 2 ans et tu as 30 jours pour être remboursé si elle ne te convient pas."
            />
          </div>
        </div>
      </section>

      {/* ============================ CTA FINAL ============================ */}
      <section className="bg-[#4F5D43] text-white">
        <div className="content-container py-20 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Ton lait végétal frais, quand tu veux.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">
            Sans additifs, moins de déchets, plus d'économies. Pour {priceLabel},
            livraison offerte.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleBuy}
              disabled={isAdding}
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-[#4F5D43] shadow-lg transition-all hover:brightness-95 disabled:opacity-60"
            >
              {isAdding ? "Un instant…" : "Commander Lattéo"}
            </button>
          </div>
        </div>
      </section>

      {/* ======================= BARRE STICKY MOBILE ======================= */}
      <div className="sticky bottom-0 z-40 border-t border-[#2B2B24]/10 bg-[#F6F2E9]/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-[#2B2B24]/55">Machine Lattéo</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold leading-tight">{priceLabel}</span>
              <span className="text-sm text-[#2B2B24]/35 line-through">
                {compareLabel}
              </span>
            </div>
          </div>
          <button
            onClick={handleBuy}
            disabled={isAdding}
            className="flex-1 rounded-full bg-[#4F5D43] px-5 py-3 text-sm font-bold text-white transition-opacity disabled:opacity-60"
          >
            {isAdding ? "Un instant…" : "Commander"}
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
  full,
}: {
  children: React.ReactNode
  onClick: () => void
  loading?: boolean
  full?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#4F5D43] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#4F5D43]/20 transition-all hover:bg-[#3D4834] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 ${
        full ? "w-full" : ""
      }`}
    >
      {loading ? "Un instant…" : children}
    </button>
  )
}

function TrustInline({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon path={icon} className="h-4 w-4 text-[#4F5D43]" />
      {label}
    </span>
  )
}

function ValueItem({
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
      <Icon path={icon} className="h-6 w-6 text-[#4F5D43]" />
      <div className="mt-1 text-sm font-semibold">{title}</div>
      <div className="text-xs text-[#2B2B24]/50">{sub}</div>
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
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4F5D43]">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-[#2B2B24]/60">{sub}</p>}
    </div>
  )
}

function BenefitCard({
  icon,
  title,
  text,
}: {
  icon: string
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-[#2B2B24]/8 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF2E6] text-[#4F5D43]">
        <Icon path={icon} className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#2B2B24]/60">{text}</p>
    </div>
  )
}

function CostCard({
  label,
  price,
  note,
  highlight,
}: {
  label: string
  price: string
  note: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-6 text-center ${
        highlight
          ? "border-[#4F5D43]/25 bg-white"
          : "border-[#2B2B24]/10 bg-white/50"
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-[#2B2B24]/50">
        {label}
      </div>
      <div
        className={`mt-2 text-3xl font-bold ${
          highlight ? "text-[#4F5D43]" : "text-[#2B2B24]/70"
        }`}
      >
        {price}
      </div>
      <div className="mt-1 text-xs text-[#2B2B24]/50">{note}</div>
    </div>
  )
}

function StepCard({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#2B2B24]/8 bg-white p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F5D43] text-sm font-bold text-white">
        {n}
      </div>
      <h3 className="mt-5 text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#2B2B24]/60">{text}</p>
    </div>
  )
}

function RecipeCard({
  img,
  title,
  time,
}: {
  img: string
  title: string
  time: string
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[#2B2B24]/8 bg-white">
      <div className="aspect-square overflow-hidden bg-[#EFE9DC]">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          width={300}
          height={300}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-0.5 text-xs text-[#2B2B24]/50">{time}</div>
      </div>
    </div>
  )
}

function SolutionLine({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#4F5D43]/15 text-[#4F5D43]">
        <Icon path={ICONS.check} className="h-3.5 w-3.5" />
      </span>
      <span className="text-[#2B2B24]/75">{text}</span>
    </li>
  )
}

function Included({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-[#2B2B24]/80">
      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#4F5D43]/15 text-[#4F5D43]">
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
          className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[#2B2B24]/20 transition-transform ${
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
        <p className="overflow-hidden text-sm leading-relaxed text-[#2B2B24]/65">
          {a}
        </p>
      </div>
    </div>
  )
}
