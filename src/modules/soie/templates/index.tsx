"use client"

import { addToCart } from "@lib/data/cart"
import { fbq } from "@lib/meta-pixel"
import { ttqTrack } from "@lib/tiktok-pixel"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const IMG_HERO = "/soie/soie-hero.jpg"
const IMG_TEXTURE = "/soie/soie-texture.jpg"
const IMG_DETAIL = "/soie/soie-detail.jpg"
const IMG_CHAMPAGNE = "/soie/soie-champagne.jpg"

// Photo avant / après (taie coton vs soie, composée en une image).
const AVANT_APRES_IMG = "/soie/avant-apres.jpg"

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

// Photo du coussin dans chaque coloris (change l'image du hero au clic).
const COLOR_IMG: Record<string, string> = {
  "Blanc nacré": "/soie/colors/soie-BLNC.jpg",
  Champagne: "/soie/colors/soie-CHMP.jpg",
  "Or rose": "/soie/colors/soie-ORRS.jpg",
  "Rose poudré": "/soie/colors/soie-RSPD.jpg",
  Rose: "/soie/colors/soie-ROSE.jpg",
  "Gris perle": "/soie/colors/soie-GRPL.jpg",
  "Gris anthracite": "/soie/colors/soie-GRAN.jpg",
  "Bleu nuit": "/soie/colors/soie-BLNT.jpg",
  "Bleu paon": "/soie/colors/soie-BLPA.jpg",
  Émeraude: "/soie/colors/soie-EMER.jpg",
  Terracotta: "/soie/colors/soie-TERR.jpg",
  "Rouge rubis": "/soie/colors/soie-RUBI.jpg",
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

/* ------------------------------- palette --------------------------------- */
const C = {
  bg: "#FAF6F0",
  ink: "#2B2A5C",
  muted: "#6F6A7A",
  lavBg: "#EEEBF8",
  lavBorder: "#CFC9EE",
  lavText: "#6A61B0",
  pinkBg: "#F6DEE4",
  pinkText: "#B55C74",
}

/* ----------------------------- animations -------------------------------- */

function useInView(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(26px)",
        transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function CountUp({
  to,
  suffix = "",
  duration = 1300,
}: {
  to: number
  suffix?: string
  duration?: number
}) {
  const { ref, inView } = useInView(0.4)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

/* ------------------------------- icônes ---------------------------------- */

function Icon({
  path,
  className = "",
  style,
}: {
  path: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
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
  wash: "M4 8h16v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8z|M6 8l1.6-3h8.8L18 8|M8 13c1.1-1 2.9-1 4 0s2.9 1 4 0",
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
  refresh: "M4 12a8 8 0 0 1 13.7-5.6L20 8|M20 4v4h-4|M20 12a8 8 0 0 1-13.7 5.6L4 16|M4 20v-4h4",
  gift: "M4 11h16v9H4z|M4 11V8h16v3|M12 8v12|M12 8C10.5 8 8 7.5 8 5.8 8 4.5 9 4 10 4c2 0 2 4 2 4zM12 8c1.5 0 4-.5 4-2.2C16 4.5 15 4 14 4c-2 0-2 4-2 4z",
  arrows: "M8 7l-4 5 4 5|M16 7l4 5-4 5",
  plane: "M2 12l20-8-8 20-2-8-10-4z",
}

/* --------------------------------- page ---------------------------------- */

export default function SoieFunnel({ product, countryCode }: Props) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [buyError, setBuyError] = useState<string | null>(null)

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
  const [selectedColor2, setSelectedColor2] = useState(colors[0] ?? "Champagne")
  const [selectedFormat, setSelectedFormat] = useState(FORMAT_UNITE)

  const isDuo = selectedFormat === FORMAT_DUO
  const colorImg = COLOR_IMG[selectedColor] ?? IMG_HERO

  const gallery = useMemo(
    () => [colorImg, IMG_TEXTURE, IMG_DETAIL, IMG_CHAMPAGNE],
    [colorImg]
  )
  const [activeImg, setActiveImg] = useState(0)
  useEffect(() => {
    setActiveImg(0)
  }, [selectedColor])
  const mainImg = gallery[activeImg] ?? colorImg

  const galleryRef = useRef<HTMLDivElement>(null)
  const selectColor1 = (c: string) => {
    setSelectedColor(c)
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      requestAnimationFrame(() =>
        galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      )
    }
  }

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
  const discountPct = Math.max(0, Math.round((1 - amount / compareAmount) * 100))

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
    setBuyError(null)
    setIsAdding(true)
    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
        metadata: isDuo
          ? { couleur_1: selectedColor, couleur_2: selectedColor2 }
          : { couleur_1: selectedColor },
      })

      const value = amount
      const cur = currency.toUpperCase()

      try {
        fbq("AddToCart", {
          content_ids: [selectedVariant.id],
          content_name: product.title,
          content_type: "product",
          contents: [
            { id: selectedVariant.id, quantity: 1, item_price: value },
          ],
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
      } catch {
        /* le tracking ne doit jamais bloquer l'achat */
      }

      // On garde l'état "en cours" : la navigation va démonter la page.
      // L'écran de chargement du checkout (loading.tsx) prend le relais.
      router.push(`/${countryCode}/checkout`)
    } catch (e) {
      setIsAdding(false)
      setBuyError(
        "Ajout impossible pour le moment. Vérifiez votre connexion et réessayez."
      )
    }
  }

  const scrollToAvis = () =>
    document.getElementById("avis")?.scrollIntoView({ behavior: "smooth" })

  const BuyCTA = ({ variant = "ink" }: { variant?: "ink" | "white" }) => (
    <div className="w-full">
      <button
        onClick={handleBuy}
        disabled={isAdding}
        aria-busy={isAdding}
        className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        style={
          variant === "white"
            ? { backgroundColor: "#fff", color: C.ink }
            : { backgroundColor: C.ink, color: "#fff" }
        }
      >
        {isAdding && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80"
            aria-hidden
          />
        )}
        {isAdding ? "Redirection vers le paiement…" : "Ajouter au panier"}
      </button>
      {buyError && (
        <p className="mt-2 text-center text-sm font-medium" style={{ color: C.pinkText }}>
          {buyError}
        </p>
      )}
    </div>
  )

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink }}>
      {/* ====================== BANDEAU ANNONCE ======================= */}
      <div
        className="w-full py-2 text-center text-[13px] font-medium"
        style={{ backgroundColor: C.pinkBg, color: C.pinkText }}
      >
        Livraison offerte · Lot de 2 : économisez 29 CHF 🤍
      </div>

      {/* ============================ FICHE PRODUIT ====================== */}
      <section className="content-container py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          {/* ---------- Galerie ---------- */}
          <div
            ref={galleryRef}
            className="lg:sticky lg:top-6 lg:self-start"
            style={{ scrollMarginTop: "72px" }}
          >
            <div
              className="relative overflow-hidden rounded-3xl border"
              style={{ borderColor: C.lavBorder, backgroundColor: "#fff" }}
            >
              <img
                key={mainImg}
                src={mainImg}
                alt={`Taie d'oreiller en soie de mûrier — ${selectedColor}`}
                className="h-auto w-full animate-[fadeIn_.4s_ease] object-cover"
                width={640}
                height={640}
                fetchPriority="high"
                decoding="async"
              />
              <span
                className="absolute bottom-4 left-4 rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm"
                style={{ backgroundColor: C.pinkBg, color: C.pinkText }}
              >
                Réveillez-vous plus belle
              </span>
            </div>

            <div className="mt-4 flex gap-3">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className="h-20 w-20 overflow-hidden rounded-2xl border transition-all hover:scale-105"
                  style={{
                    borderColor: i === activeImg ? C.ink : C.lavBorder,
                    boxShadow: i === activeImg ? `0 0 0 2px ${C.ink}` : "none",
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ---------- Bloc d'achat ---------- */}
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ backgroundColor: C.lavBg, color: C.lavText }}
            >
              Soie de mûrier 100% · 22 Momme
            </span>

            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Taie d'oreiller en soie
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-sm font-semibold"
                style={{ backgroundColor: C.lavBg, color: C.lavText }}
              >
                {selectedColor}
              </span>
              <span className="text-sm" style={{ color: C.muted }}>
                48 × 74 cm
              </span>
            </div>

            <button
              type="button"
              onClick={scrollToAvis}
              className="mt-3 flex items-center gap-2"
            >
              <span className="flex" style={{ color: C.lavText }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} path={ICONS.star} className="h-4 w-4 fill-current" />
                ))}
              </span>
              <span className="text-sm underline" style={{ color: C.muted }}>
                Lire les avis
              </span>
            </button>

            <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: C.muted }}>
              Un contact plus doux pour vos cheveux, votre peau et vous. La soie
              de mûrier glisse au lieu de tirer : moins de frisottis, moins de
              plis d'oreiller au réveil. Nuit après nuit.
            </p>

            {/* Rangée d'icônes-bénéfices */}
            <div className="mt-6 grid grid-cols-5 gap-1 text-center sm:gap-2">
              <IconFeature icon={ICONS.hair} label="Cheveux" />
              <IconFeature icon={ICONS.skin} label="Peau" />
              <IconFeature icon={ICONS.temp} label="Fraîche" />
              <IconFeature icon={ICONS.wash} label="Lavable" />
              <IconFeature icon={ICONS.leaf} label="Naturelle" />
            </div>

            {/* Prix */}
            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-4xl font-bold">{priceLabel}</span>
              <span className="text-xl line-through" style={{ color: `${C.muted}99` }}>
                {compareLabel}
              </span>
              {discountPct > 0 && (
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{ backgroundColor: C.pinkBg, color: C.pinkText }}
                >
                  -{discountPct}%
                </span>
              )}
              <span className="text-sm" style={{ color: C.muted }}>
                · Livraison offerte
              </span>
            </div>

            {/* Encadré bundle */}
            <div
              className="mt-6 rounded-2xl border p-5"
              style={{ borderColor: C.lavBorder, backgroundColor: C.lavBg }}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: C.lavText }}
                >
                  Plus de soie, meilleur prix
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{ backgroundColor: C.pinkBg, color: C.pinkText }}
                >
                  Économisez 29 CHF
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold">
                Lot de 2 taies : {priceForFormat(FORMAT_DUO)}
              </p>
              <p className="text-sm" style={{ color: C.muted }}>
                Une sur l'oreiller, une au lavage — ou une 2ᵉ teinte. Livraison
                offerte.
              </p>
            </div>

            {/* Coloris */}
            <div className="mt-7 space-y-5">
              <ColorRow
                label={isDuo ? "1ᵉ coloris" : "Coloris"}
                colors={colors}
                selected={selectedColor}
                onSelect={selectColor1}
              />
              {isDuo && (
                <ColorRow
                  label="2ᵉ coloris"
                  colors={colors}
                  selected={selectedColor2}
                  onSelect={setSelectedColor2}
                />
              )}
            </div>

            {/* Format / quantité */}
            <div className="mt-6">
              <div className="mb-2 text-sm font-semibold">Quantité</div>
              <div className="grid grid-cols-2 gap-3">
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
              {isDuo && (
                <p className="mt-2 text-xs" style={{ color: C.muted }}>
                  Composez votre lot : choisissez vos 2 coloris ci-dessus.
                </p>
              )}
            </div>

            {/* Add to cart */}
            <div className="mt-6">
              <BuyCTA />
            </div>

            <div
              className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
              style={{ color: C.muted }}
            >
              <TrustInline icon={ICONS.lock} label="Paiement sécurisé" />
              <TrustInline icon={ICONS.refresh} label="Retours faciles" />
              <TrustInline icon={ICONS.truck} label="Livraison offerte" />
            </div>

            {/* Détails produit & entretien (accordéon) */}
            <div className="mt-8">
              <h2 className="mb-2 text-lg font-bold">Détails produit & entretien</h2>
              <div
                className="divide-y rounded-2xl border"
                style={{ borderColor: C.lavBorder }}
              >
                <Disclosure title="Description" defaultOpen>
                  <p>
                    La taie CAVAGNA est confectionnée en soie de mûrier 100%,
                    tissage satin 22 Momme. La face en contact avec la peau et
                    les cheveux glisse au lieu de tirer : moins de frisottis,
                    moins de plis d'oreiller au réveil. Peu absorbante, elle aide
                    à garder vos soins de nuit sur la peau. Hypoallergénique,
                    thermorégulante, sans teintures agressives.
                  </p>
                </Disclosure>
                <Disclosure title="Bénéfices clés">
                  <ul className="space-y-2">
                    <KeyBenefit text="Anti-frisottis : réduit les frottements, aide à limiter la casse." />
                    <KeyBenefit text="Douce pour la peau : aide à préserver l'éclat et à réduire les plis d'oreiller." />
                    <KeyBenefit text="Thermorégulante : fraîche en été, douce en hiver." />
                    <KeyBenefit text="Hypoallergénique : convient aux peaux sensibles." />
                    <KeyBenefit text="Saine : absorbe moins l'humidité et vos soins de nuit." />
                  </ul>
                </Disclosure>
                <Disclosure title="Caractéristiques">
                  <dl className="space-y-2">
                    <SpecLine label="Matière" value="Soie de mûrier 100% · 22 Momme" />
                    <SpecLine label="Dimensions" value="48 × 74 cm (format standard)" />
                    <SpecLine label="Fermeture" value="Enveloppe, sans zip" />
                    <SpecLine label="Tissage" value="Satin, toucher fluide" />
                    <SpecLine label="Coloris" value="12 teintes élégantes" />
                  </dl>
                </Disclosure>
                <Disclosure title="Entretien">
                  <p>
                    Lavage délicat à froid (30°C max), idéalement en filet.
                    Séchage à l'air libre, à plat. Pas de sèche-linge ni
                    d'adoucissant, à l'écart des sources de chaleur, pour
                    préserver la soie.
                  </p>
                </Disclosure>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= BANDE CONFIANCE ======================== */}
      <section className="border-y" style={{ borderColor: C.lavBorder }}>
        <div className="content-container grid grid-cols-2 gap-6 py-6 text-center sm:grid-cols-4">
          <MiniTrust icon={ICONS.leaf} label="Soie de mûrier 100%" />
          <MiniTrust icon={ICONS.truck} label="Livraison offerte" />
          <MiniTrust icon={ICONS.shield} label="Satisfait ou remboursé 30 j" />
          <MiniTrust icon={ICONS.lock} label="Paiement sécurisé" />
        </div>
      </section>

      {/* ========================= BANDE STATS (marine) ================== */}
      <section style={{ backgroundColor: C.ink }} className="text-white">
        <div className="content-container py-12 sm:py-16">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
              La différence soie
            </span>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Pas juste douce. Douce comme la soie.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <Stat numeric={100} suffix="%" label="Soie de mûrier" />
            <Stat numeric={22} label="Momme (densité)" />
            <Stat value="6A" label="Qualité de soie" />
            <Stat value="Oui" label="Lavable en machine" />
          </div>
        </div>
      </section>

      {/* ============================= BÉNÉFICES ======================== */}
      <section className="content-container py-16 sm:py-24">
        <Reveal>
          <SectionHead
            eyebrow="Pourquoi la soie"
            title="Un seul geste, trois bienfaits chaque nuit"
            sub="La soie de mûrier n'est pas qu'un luxe : c'est un vrai soin beauté pendant votre sommeil."
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ICONS.hair,
              n: "01",
              title: "Cheveux lissés",
              text: "La surface ultra-douce réduit les frottements : moins de frisottis, moins de casse, une coiffure qui tient plus longtemps.",
            },
            {
              icon: ICONS.skin,
              n: "02",
              title: "Peau préservée",
              text: "Fini les plis d'oreiller marqués au réveil. La soie glisse au lieu de tirer la peau et aide à préserver son éclat.",
            },
            {
              icon: ICONS.temp,
              n: "03",
              title: "Thermorégulante",
              text: "Fraîche en été, douce en hiver : la soie régule naturellement la température pour des nuits plus confortables.",
            },
            {
              icon: ICONS.leaf,
              n: "04",
              title: "Saine & hypoallergénique",
              text: "Fibre naturelle qui absorbe moins l'humidité et vos soins de nuit, et retient moins les acariens et poussières.",
            },
          ].map((f, i) => (
            <Reveal key={f.n} delay={i * 90}>
              <FeatureCard {...f} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==================== BÉNÉFICES ALTERNÉS (splits) ================ */}
      <BenefitSplit
        eyebrow="Au réveil"
        title="Vos cheveux vous disent merci"
        text="Moins de frottements contre l'oreiller, moins de temps à démêler le matin. Offrez à vos cheveux un endroit plus doux où se reposer."
        bullets={[
          "Une surface lisse qui réduit les frottements",
          "Douce sur cheveux raides, ondulés ou bouclés",
          "Aide à préserver votre coiffure toute la nuit",
        ]}
        img={colorImg}
        onCta={scrollToAvis}
      />
      <BenefitSplit
        reverse
        eyebrow="Votre routine du soir"
        title="Vos soins restent là où il faut : sur votre peau"
        text="Vous prenez soin de votre peau le soir. La soie, peu absorbante, aide à garder l'hydratation et vos produits sur la peau — pas dans la taie."
        bullets={[
          "Soie peu absorbante pour votre routine de nuit",
          "Surface lisse qui aide à réduire les frottements",
          "Soie de mûrier naturellement hypoallergénique",
        ]}
        img={IMG_DETAIL}
        onCta={scrollToAvis}
        bg={C.lavBg}
      />
      <BenefitSplit
        eyebrow="Pour les amoureuses du côté frais"
        title="Moins retourner l'oreiller. Plus l'adorer."
        text="Le côté frais ne devrait pas être si difficile à trouver. Naturellement respirante et thermorégulante, la soie offre un endroit confortable, nuit après nuit."
        bullets={[
          "Soie naturellement respirante",
          "Aide à réguler la température",
          "Un fini doux pour votre routine du coucher",
        ]}
        img={IMG_TEXTURE}
        onCta={scrollToAvis}
      />

      {/* ============================ AVANT / APRÈS ===================== */}
      <section style={{ backgroundColor: C.lavBg }}>
        <div className="content-container py-16 sm:py-24">
          <Reveal>
            <SectionHead
              eyebrow="Voyez la différence"
              title="Le coton accroche. La soie glisse."
              sub="Le coton tire et crée des frottements toute la nuit. La soie laisse glisser les cheveux : moins de frisottis au réveil."
            />
          </Reveal>
          <Reveal delay={120}>
            <figure className="mx-auto mt-10 max-w-2xl">
              <img
                src={AVANT_APRES_IMG}
                alt="Comparaison cheveux au réveil : taie en coton (frisottis) vs taie en soie (lisses)"
                className="w-full rounded-3xl border object-cover shadow-xl"
                style={{ borderColor: C.lavBorder }}
                width={1280}
                height={1600}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mt-3 text-center text-xs" style={{ color: C.muted }}>
                Résultats pouvant varier selon les personnes.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* =========================== DÉTAILS / SPECS ==================== */}
      <section className="content-container py-16 sm:py-24">
        <Reveal>
          <SectionHead eyebrow="Les détails" title="Une qualité qui se voit et se touche" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="flex justify-center">
              <img
                src={IMG_DETAIL}
                alt="Finitions de la taie en soie"
                className="h-auto w-[320px] rounded-3xl object-cover shadow-xl sm:w-[440px]"
                width={440}
                height={440}
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <Spec icon={ICONS.leaf} label="Matière" value="Soie de mûrier 100%" />
              <Spec icon={ICONS.ruler} label="Dimensions" value="48 × 74 cm" />
              <Spec icon={ICONS.box} label="Fermeture" value="Enveloppe (sans zip)" />
              <Spec icon={ICONS.droplet} label="Tissage" value="Satin, toucher fluide" />
              <Spec icon={ICONS.temp} label="Confort" value="Thermorégulant" />
              <Spec icon={ICONS.heart} label="Coloris" value="12 teintes élégantes" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================== ENTRETIEN ======================= */}
      <section style={{ backgroundColor: C.lavBg }}>
        <div className="content-container py-16 sm:py-24">
          <Reveal>
            <SectionHead eyebrow="Un rien d'attention" title="L'entretien de la soie, tout simple" />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                n: "1",
                icon: ICONS.wash,
                title: "Lavez en douceur",
                text: "Eau froide, cycle délicat et une lessive douce adaptée à la soie.",
              },
              {
                n: "2",
                icon: ICONS.shield,
                title: "Protégez-la",
                text: "Un filet de lavage garde votre soie à l'abri des zips et accrocs.",
              },
              {
                n: "3",
                icon: ICONS.droplet,
                title: "Séchage à l'air",
                text: "Séchez à plat, à l'air libre. Gardez la soie loin de la chaleur.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <CareCard {...s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== USAGE =========================== */}
      <section className="content-container py-16 sm:py-24">
        <Reveal>
          <SectionHead eyebrow="Si simple" title="En 3 étapes" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              n: "1",
              title: "Choisissez votre teinte",
              text: "12 coloris élégants pour s'accorder à votre chambre et à votre style.",
            },
            {
              n: "2",
              title: "Glissez-la sur l'oreiller",
              text: "Fermeture enveloppe : elle se met en place en un geste et reste bien en place.",
            },
            {
              n: "3",
              title: "Dormez, elle fait le reste",
              text: "Cheveux plus lisses, peau préservée. La différence se voit dès les premières nuits.",
            },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <StepCard {...s} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================== AVIS ============================ */}
      <section id="avis" style={{ backgroundColor: C.lavBg }}>
        <div className="content-container py-16 sm:py-24">
          <Reveal>
            <SectionHead eyebrow="Témoignages" title="Elles ne reviendraient pas au coton" />
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 items-start gap-5 md:grid-cols-3">
            {[
              {
                initial: "C",
                author: "Camille",
                city: "Lausanne",
                text: "Mes cheveux sont nettement moins emmêlés le matin. Je ne dormirai plus jamais sans.",
              },
              {
                initial: "S",
                author: "Sarah",
                city: "Genève",
                text: "Fini les marques d'oreiller sur le visage. La qualité de la soie est vraiment au rendez-vous.",
              },
              {
                initial: "L",
                author: "Léa",
                city: "Annecy",
                text: "J'ai pris le lot de 2 pour en avoir une au lavage. Douce, élégante, j'adore la couleur.",
              },
            ].map((r, i) => (
              <Reveal key={r.author} delay={i * 90}>
                <Review {...r} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== OFFRE =========================== */}
      <section className="content-container py-16 sm:py-24">
        <Reveal>
          <div
            className="mx-auto max-w-3xl overflow-hidden rounded-3xl border bg-white"
            style={{ borderColor: C.lavBorder }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <img
                key={colorImg}
                src={colorImg}
                alt="Taie d'oreiller en soie"
                loading="lazy"
                decoding="async"
                className="h-56 w-full object-cover sm:h-full"
              />
              <div className="p-8 sm:p-10">
                <h3 className="text-2xl font-bold sm:text-3xl">
                  Taie en soie de mûrier
                </h3>
                <p className="mt-2 text-sm" style={{ color: C.muted }}>
                  {isDuo
                    ? `${selectedColor} + ${selectedColor2}`
                    : selectedColor}{" "}
                  · 48 × 74 cm · {selectedFormat}
                </p>
                <ul className="mt-6 space-y-3">
                  <Included text="Soie de mûrier 100%, tissage satin" />
                  <Included text="12 coloris disponibles" />
                  <Included text="Livraison offerte" />
                  <Included text="Satisfait ou remboursé 30 jours" />
                </ul>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-4xl font-bold">{priceLabel}</span>
                  <span className="text-lg line-through" style={{ color: `${C.muted}99` }}>
                    {compareLabel}
                  </span>
                </div>
                <div className="mt-5">
                  <BuyCTA />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============================== CADEAU ========================== */}
      <section style={{ backgroundColor: C.lavBg }}>
        <div className="content-container grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <Reveal>
            <div className="flex justify-center lg:order-2">
              <img
                src={IMG_CHAMPAGNE}
                alt="Taie en soie, idée cadeau"
                className="h-auto w-[320px] rounded-3xl object-cover shadow-xl sm:w-[440px]"
                width={440}
                height={440}
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="lg:order-1">
              <SectionHead
                align="left"
                eyebrow="Un cadeau qu'elle adorera"
                title="Une pour vous. Une pour celle que vous aimez."
                sub="Le cadeau d'une meilleure nuit ne se démode jamais : anniversaire, remerciement, une attention pour Maman ou l'amie qui a déjà tout."
              />
              <ul className="mt-8 space-y-4">
                <SolutionLine text="12 coloris pour toutes les personnalités" />
                <SolutionLine text="Une attention chic pour toutes les occasions" />
                <SolutionLine text="Lot de 2 : offrez-en une, gardez l'autre" />
              </ul>
              <div className="mt-8 max-w-xs">
                <BuyCTA />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =============================== FAQ ============================ */}
      <section className="content-container py-16 sm:py-24">
        <Reveal>
          <SectionHead eyebrow="Vous vous demandez…" title="Questions fréquentes" />
        </Reveal>
        <Reveal delay={120}>
          <div
            className="mx-auto mt-10 max-w-3xl divide-y border-y"
            style={{ borderColor: C.lavBorder }}
          >
            <Disclosure title="Est-ce de la vraie soie ?">
              <p>
                Oui, la face en contact avec la peau et les cheveux est en soie
                de mûrier 100%, le même type de soie utilisé par les grandes
                marques de literie en soie.
              </p>
            </Disclosure>
            <Disclosure title="Quelle taille d'oreiller ?">
              <p>
                La taie mesure 48 × 74 cm, le format rectangulaire standard le
                plus courant. Fermeture enveloppe pour un maintien parfait, sans
                zip qui gêne.
              </p>
            </Disclosure>
            <Disclosure title="Comment l'entretenir ?">
              <p>
                Lavage délicat à froid (30°C max), idéalement en filet, séchage à
                l'air libre. Pas de sèche-linge ni d'adoucissant pour préserver la
                soie.
              </p>
            </Disclosure>
            <Disclosure title="Combien de temps pour la livraison ?">
              <p>
                La livraison est offerte. Comptez environ 10 à 15 jours de délai.
                Un numéro de suivi vous est envoyé dès l'expédition.
              </p>
            </Disclosure>
            <Disclosure title="Pourquoi le lot de 2 ?">
              <p>
                C'est l'idéal : une sur l'oreiller pendant que l'autre passe au
                lavage, ou une seconde teinte pour varier. Et vous économisez 29
                CHF.
              </p>
            </Disclosure>
          </div>
        </Reveal>
      </section>

      {/* ============================ CTA FINAL ========================= */}
      <section style={{ backgroundColor: C.ink }} className="text-white">
        <div className="content-container py-20 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Offrez à vos nuits le toucher de la soie.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Cheveux sublimés, peau préservée — à partir de{" "}
              {priceForFormat(FORMAT_UNITE)}. Livraison offerte.
            </p>
            <div className="mx-auto mt-8 max-w-xs">
              <BuyCTA variant="white" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======================= BARRE STICKY MOBILE ==================== */}
      <div
        className="sticky bottom-0 z-40 border-t px-4 py-3 backdrop-blur sm:hidden"
        style={{ borderColor: C.lavBorder, backgroundColor: `${C.bg}F2` }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs" style={{ color: C.muted }}>
              Taie en soie · {selectedFormat}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold leading-tight">{priceLabel}</span>
              <span className="text-sm line-through" style={{ color: `${C.muted}99` }}>
                {compareLabel}
              </span>
            </div>
          </div>
          <button
            onClick={handleBuy}
            disabled={isAdding}
            aria-busy={isAdding}
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: C.ink }}
          >
            {isAdding && (
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden
              />
            )}
            {isAdding ? "Redirection…" : "Ajouter"}
          </button>
        </div>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  )
}

/* ----------------------------- sous-composants ---------------------------- */

function BenefitSplit({
  eyebrow,
  title,
  text,
  bullets,
  img,
  reverse,
  bg,
  onCta,
}: {
  eyebrow: string
  title: string
  text: string
  bullets: string[]
  img: string
  reverse?: boolean
  bg?: string
  onCta?: () => void
}) {
  return (
    <section style={bg ? { backgroundColor: bg } : undefined}>
      <div className="content-container grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
        <Reveal className={reverse ? "lg:order-2" : ""}>
          <div className="flex justify-center">
            <img
              src={img}
              alt={title}
              className="h-auto w-full max-w-[460px] rounded-3xl object-cover shadow-xl"
              width={460}
              height={460}
              loading="lazy"
              decoding="async"
            />
          </div>
        </Reveal>
        <Reveal delay={120} className={reverse ? "lg:order-1" : ""}>
          <div>
            <SectionHead align="left" eyebrow={eyebrow} title={title} sub={text} />
            <ul className="mt-8 space-y-4">
              {bullets.map((b) => (
                <SolutionLine key={b} text={b} />
              ))}
            </ul>
            {onCta && (
              <button
                onClick={onCta}
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold underline"
                style={{ color: C.lavText }}
              >
                Voir les avis →
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Disclosure({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="px-4 py-4 first:rounded-t-2xl last:rounded-b-2xl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold">{title}</span>
        <span
          className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border transition-transform ${
            open ? "rotate-45" : ""
          }`}
          style={{ borderColor: C.lavBorder }}
        >
          <Icon path={ICONS.plus} className="h-4 w-4" />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div
          className="overflow-hidden text-sm leading-relaxed"
          style={{ color: C.muted }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function KeyBenefit({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full"
        style={{ backgroundColor: C.lavBg, color: C.lavText }}
      >
        <Icon path={ICONS.check} className="h-3.5 w-3.5" />
      </span>
      <span>{text}</span>
    </li>
  )
}

function SpecLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b py-1.5" style={{ borderColor: `${C.lavBorder}80` }}>
      <dt className="font-medium" style={{ color: C.ink }}>
        {label}
      </dt>
      <dd className="text-right">{value}</dd>
    </div>
  )
}

function CareCard({
  n,
  icon,
  title,
  text,
}: {
  n: string
  icon: string
  title: string
  text: string
}) {
  return (
    <div className="rounded-3xl border bg-white p-7" style={{ borderColor: C.lavBorder }}>
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: C.lavBg, color: C.lavText }}
        >
          <Icon path={icon} className="h-5 w-5" />
        </span>
        <span className="text-sm font-bold" style={{ color: `${C.muted}80` }}>
          0{n}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>
        {text}
      </p>
    </div>
  )
}

function IconFeature({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 px-0.5">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11"
        style={{ backgroundColor: C.lavBg, color: C.lavText }}
      >
        <Icon path={icon} className="h-5 w-5" />
      </span>
      <span className="text-[11px] leading-tight" style={{ color: C.muted }}>
        {label}
      </span>
    </div>
  )
}

function MiniTrust({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Icon path={icon} className="h-6 w-6" style={{ color: C.lavText }} />
      <span className="text-xs font-medium" style={{ color: C.muted }}>
        {label}
      </span>
    </div>
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
      className="relative rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5"
      style={{
        borderColor: active ? C.ink : C.lavBorder,
        backgroundColor: active ? C.lavBg : "#fff",
        boxShadow: active ? `0 0 0 1px ${C.ink}` : "none",
      }}
    >
      {badge && (
        <span
          className="absolute -top-2.5 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: C.pinkBg, color: C.pinkText }}
        >
          {badge}
        </span>
      )}
      <div className="flex items-center gap-2">
        <span
          className="flex h-4 w-4 items-center justify-center rounded-full border"
          style={{
            borderColor: active ? C.ink : `${C.muted}66`,
            backgroundColor: active ? C.ink : "transparent",
          }}
        >
          {active && <Icon path={ICONS.check} className="h-3 w-3 text-white" />}
        </span>
        <span className="font-semibold">{title}</span>
      </div>
      <div className="mt-2 text-lg font-bold">{price}</div>
      {note && (
        <div className="text-xs font-medium" style={{ color: C.pinkText }}>
          {note}
        </div>
      )}
    </button>
  )
}

function ColorRow({
  label,
  colors,
  selected,
  onSelect,
}: {
  label: string
  colors: string[]
  selected: string
  onSelect: (c: string) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">{label} :</span>
        <span style={{ color: C.muted }}>{selected}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {colors.map((c) => {
          const active = c === selected
          return (
            <button
              key={c}
              type="button"
              onClick={() => onSelect(c)}
              title={c}
              aria-label={c}
              aria-pressed={active}
              className="h-9 w-9 rounded-full ring-1 ring-black/10 transition-all hover:scale-105"
              style={{
                backgroundColor: COLOR_HEX[c] ?? "#D9D4CC",
                outline: active ? `2px solid ${C.ink}` : "none",
                outlineOffset: active ? "2px" : "0",
                transform: active ? "scale(1.05)" : "none",
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

function TrustInline({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon path={icon} className="h-4 w-4" style={{ color: C.lavText }} />
      {label}
    </span>
  )
}

function Stat({
  value,
  numeric,
  suffix,
  label,
}: {
  value?: string
  numeric?: number
  suffix?: string
  label: string
}) {
  return (
    <Reveal>
      <div className="text-4xl font-bold sm:text-5xl">
        {typeof numeric === "number" ? (
          <CountUp to={numeric} suffix={suffix} />
        ) : (
          value
        )}
      </div>
      <div className="mt-1 text-sm text-white/60">{label}</div>
    </Reveal>
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
      <span
        className="text-[11px] font-bold uppercase tracking-[0.22em]"
        style={{ color: C.lavText }}
      >
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {sub && (
        <p className="mt-4" style={{ color: C.muted }}>
          {sub}
        </p>
      )}
    </div>
  )
}

function FeatureCard({
  icon,
  n,
  title,
  text,
}: {
  icon: string
  n?: string
  title: string
  text: string
}) {
  return (
    <div
      className="group h-full rounded-3xl border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: C.lavBorder }}
    >
      <div className="flex items-center justify-between">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
          style={{ backgroundColor: C.lavBg, color: C.lavText }}
        >
          <Icon path={icon} className="h-5 w-5" />
        </span>
        {n && (
          <span className="text-sm font-bold" style={{ color: `${C.muted}80` }}>
            {n}
          </span>
        )}
      </div>
      <h3 className="mt-5 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>
        {text}
      </p>
    </div>
  )
}

function SolutionLine({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full"
        style={{ backgroundColor: C.lavBg, color: C.lavText }}
      >
        <Icon path={ICONS.check} className="h-3.5 w-3.5" />
      </span>
      <span style={{ color: C.ink }}>{text}</span>
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
    <div
      className="flex items-center gap-3 border-b pb-4"
      style={{ borderColor: C.lavBorder }}
    >
      <Icon path={icon} className="h-5 w-5 flex-none" style={{ color: C.lavText }} />
      <div>
        <div className="text-xs uppercase tracking-wide" style={{ color: C.muted }}>
          {label}
        </div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  )
}

function StepCard({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="h-full rounded-3xl border bg-white p-7" style={{ borderColor: C.lavBorder }}>
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: C.ink }}
      >
        {n}
      </div>
      <h3 className="mt-5 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>
        {text}
      </p>
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
    <div className="h-full rounded-3xl border bg-white p-6" style={{ borderColor: C.lavBorder }}>
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: C.ink }}
        >
          {initial}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold">{author}</div>
          <div className="text-xs" style={{ color: C.muted }}>
            {city}
          </div>
        </div>
        <div className="ml-auto flex gap-0.5" style={{ color: C.lavText }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} path={ICONS.star} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed" style={{ color: C.ink }}>
        “{text}”
      </p>
    </div>
  )
}

function Included({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3" style={{ color: C.ink }}>
      <span
        className="flex h-5 w-5 flex-none items-center justify-center rounded-full"
        style={{ backgroundColor: C.lavBg, color: C.lavText }}
      >
        <Icon path={ICONS.check} className="h-3.5 w-3.5" />
      </span>
      {text}
    </li>
  )
}
