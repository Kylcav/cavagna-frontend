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

type Color = "Noir" | "Blanc"

const COLOR_IMAGES: Record<Color, string> = {
  Noir: "/aspirateur/robot-noir.webp",
  Blanc: "/aspirateur/robot-blanc.webp",
}

/* ----------------------------- petites icônes ----------------------------- */

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
  suction: "M12 3v7|M12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8|M5 21h14|M7 14l-2 7|M17 14l2 7",
  empty:
    "M4 7h16|M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13|M9 7V4h6v3|M10 11v6|M14 11v6",
  laser:
    "M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0|M12 3v3|M12 18v3|M3 12h3|M18 12h3|M5.6 5.6l2.1 2.1|M16.3 16.3l2.1 2.1|M18.4 5.6l-2.1 2.1|M7.7 16.3l-2.1 2.1",
  app: "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z|M11 18h2",
  battery: "M4 8h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z|M21 11v2|M7 11v2|M10 11v2|M13 11v2",
  shield: "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z|M9 12l2 2 4-4",
  truck: "M3 7h11v8H3z|M14 10h4l3 3v2h-7z|M7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z|M17.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  lock: "M6 10h12v10H6z|M9 10V7a3 3 0 0 1 6 0v3|M12 14v2",
  check: "M5 12l5 5L20 7",
  star: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z",
  map: "M9 4L3 7v13l6-3 6 3 6-3V4l-6 3-6-3z|M9 4v13|M15 7v13",
  phone: "M7 3h10v18H7z|M11 6h2",
  plus: "M12 5v14|M5 12h14",
}

/* --------------------------------- page ---------------------------------- */

export default function AspirateurFunnel({ product, countryCode }: Props) {
  const router = useRouter()
  const [color, setColor] = useState<Color>("Noir")
  const [isAdding, setIsAdding] = useState(false)

  const selectedVariant = useMemo(
    () =>
      product.variants?.find((v) =>
        v.options?.some((o) => o.value === color)
      ) ?? product.variants?.[0],
    [product.variants, color]
  )

  const amount = selectedVariant?.calculated_price?.calculated_amount ?? 199
  const currency =
    selectedVariant?.calculated_price?.currency_code ?? "chf"

  const priceLabel = convertToLocale({
    amount,
    currency_code: currency,
    locale: "fr-CH",
  })

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
    <div className="bg-[#09090B] text-white">
      {/* ============================= HERO ============================= */}
      <section className="relative overflow-hidden">
        {/* halo */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#7C6CFF]/25 blur-[140px]" />
        <div className="pointer-events-none absolute right-0 top-40 h-[380px] w-[380px] rounded-full bg-[#22D3EE]/15 blur-[130px]" />

        <div className="content-container relative grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-2 lg:gap-6 lg:py-20">
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
              Robot aspirateur nouvelle génération
            </span>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]">
              Ne touchez plus jamais
              <br />
              <span className="bg-gradient-to-r from-[#A78BFA] via-[#7C6CFF] to-[#22D3EE] bg-clip-text text-transparent">
                à un balai.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              18 000 Pa d'aspiration, navigation laser et une station qui se
              vide toute seule. Votre maison reste impeccable — sans lever le
              petit doigt.
            </p>

            {/* color selector */}
            <div className="mt-8">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Coloris — {color}
              </div>
              <div className="mt-3 flex gap-3">
                {(["Noir", "Blanc"] as Color[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-pressed={color === c}
                    className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      color === c
                        ? "border-white bg-white text-[#09090B]"
                        : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        c === "Noir"
                          ? "border-white/30 bg-[#17171b]"
                          : "border-black/10 bg-white"
                      }`}
                    />
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* price + CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-3xl font-semibold">{priceLabel}</span>
              <span className="text-sm text-white/50">
                Livraison gratuite en Suisse
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <CTAButton onClick={handleBuy} loading={isAdding} className="sm:w-auto">
                Commander maintenant
              </CTAButton>
              <a
                href="#caracteristiques"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-4 text-sm font-semibold text-white/80 transition-colors hover:border-white/40"
              >
                Voir les caractéristiques
              </a>
            </div>

            {/* mini trust */}
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
              <TrustInline icon={ICONS.lock} label="Paiement sécurisé" />
              <TrustInline icon={ICONS.shield} label="Certifié CE" />
              <TrustInline icon={ICONS.truck} label="Expédié de Suisse" />
            </div>
          </div>

          {/* product image */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-[#7C6CFF]/20 to-transparent blur-2xl" />
              <img
                src={COLOR_IMAGES[color]}
                alt={`Robot aspirateur ${color.toLowerCase()} avec station d'auto-vidage`}
                className="h-auto w-[300px] drop-shadow-2xl sm:w-[380px] lg:w-[460px]"
                width={460}
                height={460}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================= BANDEAU CONFIANCE ========================= */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="content-container grid grid-cols-2 gap-6 py-6 text-center sm:grid-cols-4">
          <TrustBadge icon={ICONS.truck} title="Livraison gratuite" sub="Partout en Suisse" />
          <TrustBadge icon={ICONS.lock} title="Paiement sécurisé" sub="Carte & Stripe" />
          <TrustBadge icon={ICONS.shield} title="Certifié CE" sub="Normes européennes" />
          <TrustBadge icon={ICONS.phone} title="Support en français" sub="Une question ? On répond" />
        </div>
      </section>

      {/* ============================= BÉNÉFICES ============================= */}
      <section className="content-container py-16 sm:py-24">
        <SectionHead
          eyebrow="Pourquoi on l'adore"
          title="Un ménage qui se fait tout seul"
          sub="Pensé pour les gens occupés : vous programmez, il s'occupe du reste."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={ICONS.suction}
            title="18 000 Pa d'aspiration"
            text="Assez de puissance pour déloger poussière, miettes et poils d'animaux, sur sols durs comme sur tapis."
          />
          <FeatureCard
            icon={ICONS.empty}
            title="Station auto-vidage"
            text="Le robot retourne vider son bac tout seul dans la station. Vous n'y touchez que de temps en temps."
          />
          <FeatureCard
            icon={ICONS.laser}
            title="Navigation laser LDS"
            text="Il cartographie votre intérieur au laser, planifie son trajet et évite les obstacles — aucune zone oubliée."
          />
          <FeatureCard
            icon={ICONS.app}
            title="Pilotage par application"
            text="Lancez, programmez et suivez le nettoyage depuis votre téléphone, où que vous soyez."
          />
        </div>
      </section>

      {/* ========================= PROBLÈME / SOLUTION ======================= */}
      <section className="bg-[#0E0E13]">
        <div className="content-container grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <SectionHead
              align="left"
              eyebrow="Le problème"
              title="Le ménage, cette corvée sans fin"
              sub="Passer l'aspirateur plusieurs fois par semaine, se baisser, vider le bac, recommencer. Du temps que vous préféreriez passer autrement."
            />
            <ul className="mt-8 space-y-4">
              <SolutionLine text="Il nettoie seul, tous les jours si vous voulez — même quand vous n'êtes pas là." />
              <SolutionLine text="Il se vide tout seul : des semaines sans y penser." />
              <SolutionLine text="Il se faufile sous les meubles là où le balai ne passe pas." />
              <SolutionLine text="Vous rentrez, c'est propre. C'est tout." />
            </ul>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-[#7C6CFF]/15 to-[#22D3EE]/10 blur-2xl" />
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
              <img
                src={COLOR_IMAGES[color]}
                alt={`Robot aspirateur ${color.toLowerCase()}`}
                className="h-auto w-[280px] sm:w-[360px]"
                width={360}
                height={360}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================== CARACTÉRISTIQUES ========================= */}
      <section id="caracteristiques" className="content-container py-16 sm:py-24">
        <SectionHead
          eyebrow="Les caractéristiques"
          title="Petit robot, grandes capacités"
        />
        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex justify-center">
            <img
              src={COLOR_IMAGES[color]}
              alt={`Robot aspirateur ${color.toLowerCase()} avec station`}
              className="h-auto w-[320px] sm:w-[420px]"
              width={420}
              height={420}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <Spec icon={ICONS.suction} label="Aspiration" value="18 000 Pa" />
            <Spec icon={ICONS.empty} label="Station" value="Vidage automatique" />
            <Spec icon={ICONS.laser} label="Navigation" value="Laser LDS SLAM" />
            <Spec icon={ICONS.map} label="Bac à poussière" value="2,5 litres" />
            <Spec icon={ICONS.battery} label="Autonomie" value="Jusqu'à 120 min" />
            <Spec icon={ICONS.app} label="Contrôle" value="Application mobile" />
            <Spec icon={ICONS.shield} label="Certification" value="CE" />
            <Spec icon={ICONS.plus} label="Tension" value="110–240 V" />
          </div>
        </div>
      </section>

      {/* =========================== COMMENT ÇA MARCHE ======================= */}
      <section className="bg-[#0E0E13]">
        <div className="content-container py-16 sm:py-24">
          <SectionHead
            eyebrow="Simple comme bonjour"
            title="En 3 étapes"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <StepCard
              n="1"
              title="Vous programmez"
              text="Depuis l'application, choisissez l'heure et les pièces à nettoyer. Une fois suffit."
            />
            <StepCard
              n="2"
              title="Il cartographie & nettoie"
              text="Le laser scanne votre intérieur, il planifie son trajet et aspire chaque recoin."
            />
            <StepCard
              n="3"
              title="Il se vide seul"
              text="En fin de cycle, il rejoint sa station, se vide et se recharge. Prêt pour la prochaine fois."
            />
          </div>
        </div>
      </section>

      {/* ============================== AVIS ================================ */}
      {/* Avis réels d'acheteurs du produit (fournis par le client). */}
      <section className="content-container py-16 sm:py-24">
        <SectionHead
          eyebrow="Ils l'ont adopté"
          title="Ce qu'en disent les acheteurs"
        />
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 items-start gap-5 md:grid-cols-3">
          <Review
            initial="A"
            author="A***v"
            country="Bulgarie"
            badge="Acheteur régulier"
            date="16 oct. 2026"
            text="Très bon."
          />
          <Review
            initial="E"
            author="e***a"
            country="Italie"
            date="22 juin 2026"
            helpful={3}
            text="Tout va bien."
          />
          <Review
            initial="M"
            author="M***i"
            country="États-Unis"
            date="30 sept. 2026"
            text="Performance de nettoyage correcte, aspiration un peu en deçà de mes attentes. Le nettoyage à la serpillière est bon. Batterie : bonne. Capacité : bonne. Niveau sonore : excellent. Navigation correcte — un petit souci de retour à la base."
          />
        </div>
      </section>

      {/* ============================== OFFRE =============================== */}
      <section className="bg-[#0E0E13]">
        <div className="content-container py-16 sm:py-24">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-white/[0.06] to-white/[0.02]">
            <div className="relative p-8 sm:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#7C6CFF]/20 blur-3xl" />
              <div className="relative grid grid-cols-1 items-center gap-10 sm:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="text-2xl font-semibold sm:text-3xl">
                    Robot Aspirateur 18 000 Pa
                  </h3>
                  <p className="mt-2 text-white/60">
                    Station d'auto-vidage · Navigation laser · Pilotage par app
                  </p>

                  <ul className="mt-6 space-y-3">
                    <Included text="Robot + station d'auto-vidage" />
                    <Included text="Accessoires et brosses inclus" />
                    <Included text="Livraison gratuite en Suisse" />
                    <Included text="Paiement 100% sécurisé" />
                  </ul>

                  {/* color selector (rappel) */}
                  <div className="mt-7 flex gap-3">
                    {(["Noir", "Blanc"] as Color[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        aria-pressed={color === c}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          color === c
                            ? "border-white bg-white text-[#09090B]"
                            : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                        }`}
                      >
                        <span
                          className={`h-3.5 w-3.5 rounded-full border ${
                            c === "Noir"
                              ? "border-white/30 bg-[#17171b]"
                              : "border-black/10 bg-white"
                          }`}
                        />
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-sm uppercase tracking-[0.16em] text-white/50">
                    Prix
                  </div>
                  <div className="mt-1 text-5xl font-semibold">{priceLabel}</div>
                  <div className="mt-6">
                    <CTAButton onClick={handleBuy} loading={isAdding}>
                      Commander maintenant
                    </CTAButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================== FAQ =============================== */}
      <section className="content-container py-16 sm:py-24">
        <SectionHead eyebrow="Vous vous demandez…" title="Questions fréquentes" />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/10 border-y border-white/10">
          <Faq
            q="Fonctionne-t-il sur les tapis et le parquet ?"
            a="Oui. Avec ses 18 000 Pa, il passe des sols durs (parquet, carrelage) aux tapis courts sans problème, en adaptant son aspiration."
          />
          <Faq
            q="À quelle fréquence faut-il vider la station ?"
            a="Grâce au vidage automatique, le robot se vide seul dans la station après chaque cycle. Il vous suffit de changer le sac/bac de la station toutes les quelques semaines."
          />
          <Faq
            q="Est-ce bruyant ?"
            a="Non, il reste discret en usage normal. Vous pouvez même le programmer pendant vos absences pour ne rien entendre du tout."
          />
          <Faq
            q="Comment se passe la livraison ?"
            a="La livraison est gratuite partout en Suisse. Vous recevez un suivi dès l'expédition de votre commande."
          />
          <Faq
            q="Puis-je le piloter depuis mon téléphone ?"
            a="Oui, via l'application dédiée : démarrage, programmation, zones à nettoyer et suivi en temps réel, sur iOS et Android."
          />
        </div>
      </section>

      {/* ============================ CTA FINAL ============================ */}
      <section className="relative overflow-hidden border-t border-white/10">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#7C6CFF]/20 blur-[140px]" />
        <div className="content-container relative py-20 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Offrez-vous le luxe de ne plus y penser.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Votre maison impeccable chaque jour, pour {priceLabel}. Livraison
            gratuite en Suisse.
          </p>
          <div className="mt-8 flex justify-center">
            <CTAButton onClick={handleBuy} loading={isAdding}>
              Commander mon robot ({color})
            </CTAButton>
          </div>
        </div>
      </section>

      {/* ======================= BARRE STICKY MOBILE ======================= */}
      <div className="sticky bottom-0 z-40 border-t border-white/10 bg-[#09090B]/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-white/50">Robot aspirateur · {color}</div>
            <div className="text-lg font-semibold leading-tight">{priceLabel}</div>
          </div>
          <button
            onClick={handleBuy}
            disabled={isAdding}
            className="flex-1 rounded-full bg-gradient-to-r from-[#7C6CFF] to-[#5B4BE6] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#7C6CFF]/30 transition-opacity disabled:opacity-60"
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
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7C6CFF] to-[#5B4BE6] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#7C6CFF]/30 transition-all hover:shadow-xl hover:shadow-[#7C6CFF]/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? "Un instant…" : children}
    </button>
  )
}

function TrustInline({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon path={icon} className="h-4 w-4 text-[#22D3EE]" />
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
      <Icon path={icon} className="h-6 w-6 text-white/80" />
      <div className="mt-1 text-sm font-semibold">{title}</div>
      <div className="text-xs text-white/45">{sub}</div>
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
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-white/60">{sub}</p>}
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
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.05]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C6CFF]/25 to-[#22D3EE]/15 text-[#C4B5FD]">
        <Icon path={icon} className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
    </div>
  )
}

function SolutionLine({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#7C6CFF]/20 text-[#C4B5FD]">
        <Icon path={ICONS.check} className="h-3.5 w-3.5" />
      </span>
      <span className="text-white/75">{text}</span>
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
    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
      <Icon path={icon} className="h-5 w-5 flex-none text-[#A78BFA]" />
      <div>
        <div className="text-xs uppercase tracking-wide text-white/45">
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7C6CFF] to-[#5B4BE6] text-sm font-bold">
        {n}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
    </div>
  )
}

function Review({
  initial,
  author,
  country,
  badge,
  date,
  helpful,
  text,
}: {
  initial: string
  author: string
  country: string
  badge?: string
  date: string
  helpful?: number
  text: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#7C6CFF] to-[#5B4BE6] text-sm font-bold">
          {initial}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold">
            {author}
            <span className="inline-flex items-center gap-1 rounded-full bg-[#22D3EE]/12 px-2 py-0.5 text-[10px] font-medium text-[#22D3EE]">
              <Icon path={ICONS.check} className="h-3 w-3" />
              Acheteur vérifié
            </span>
          </div>
          <div className="text-xs text-white/45">
            {country}
            {badge ? ` · ${badge}` : ""} · {date}
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-white/75">“{text}”</p>
      {typeof helpful === "number" && helpful > 0 && (
        <div className="mt-4 text-xs text-white/40">Utile ({helpful})</div>
      )}
    </div>
  )
}

function Included({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-white/80">
      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#22D3EE]/15 text-[#22D3EE]">
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
          className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border border-white/20 transition-transform ${
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
        <p className="overflow-hidden text-sm leading-relaxed text-white/60">
          {a}
        </p>
      </div>
    </div>
  )
}
