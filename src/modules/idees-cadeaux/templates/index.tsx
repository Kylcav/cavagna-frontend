import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Page d'accueil de la boutique "Idées Cadeaux Cavagna".
 * Angle de vente : le trouveur de cadeaux (gift finder) + saisonnalité Noël.
 * Design original (vert sapin + or sur crème). Les fiches produit sont
 * créées au fur et à mesure ; les cartes pointent vers leur page quand elle
 * existe (href), sinon vers la sélection.
 */

type Gift = {
  icon: string
  name: string
  desc: string
  price: string
  tag: string
  accent: string
  href: string
  badge?: string
}

const GIFTS: Gift[] = [
  {
    icon: "🥛",
    name: "Machine à lait végétal",
    desc: "Du lait d'amande, d'avoine ou de soja frais, maison, en quelques minutes.",
    price: "169€",
    tag: "Premium",
    accent: "#1F4D3A",
    href: "/latteo",
    badge: "Coup de cœur",
  },
  {
    icon: "🎥",
    name: "Mini projecteur Ultra HD",
    desc: "Transforme le salon en cinéma. Le cadeau qui impressionne à coup sûr.",
    price: "89€",
    tag: "Tech & Maison",
    accent: "#2B5D8A",
    href: "/idees-cadeaux#selection",
  },
  {
    icon: "💳",
    name: "Porte-cartes pop-up",
    desc: "Élégant, compact, protection anti-RFID. Les cartes sortent d'un geste.",
    price: "59€",
    tag: "Pour Lui",
    accent: "#44433F",
    href: "/idees-cadeaux#selection",
  },
  {
    icon: "💆",
    name: "Extension de cheveux « Halo »",
    desc: "Du volume et de la longueur en 2 minutes, sans clips ni colle.",
    price: "60€",
    tag: "Pour Elle",
    accent: "#9A5B6B",
    href: "/idees-cadeaux#selection",
  },
  {
    icon: "🍳",
    name: "Poêle 100% titane",
    desc: "Cuisson saine, sans PFAS, ultra-résistante. Un classique qui plaît.",
    price: "59€",
    tag: "Tech & Maison",
    accent: "#4A4A4A",
    href: "/idees-cadeaux#selection",
  },
  {
    icon: "💪",
    name: "Ceinture EMS fitness",
    desc: "Tonifie les abdos à la maison, 15 min par jour. Technologie EMS.",
    price: "69€",
    tag: "Pour Lui",
    accent: "#B5632E",
    href: "/idees-cadeaux#selection",
  },
  {
    icon: "💄",
    name: "Lip plumper repulpant",
    desc: "Des lèvres visiblement plus pulpeuses. Effet immédiat, petit prix.",
    price: "25€",
    tag: "Pour Elle",
    accent: "#B23A5E",
    href: "/idees-cadeaux#selection",
  },
  {
    icon: "✨",
    name: "Feutres à paillettes",
    desc: "Des dessins qui brillent. Le cadeau qui fait briller les yeux des enfants.",
    price: "29€",
    tag: "Enfants",
    accent: "#7A5BB0",
    href: "/idees-cadeaux#selection",
  },
  {
    icon: "🐶",
    name: "Balle indestructible pour chien",
    desc: "Increvable, même pour les plus costauds. Le toutou va adorer.",
    price: "59€",
    tag: "Animaux",
    accent: "#5C7A3E",
    href: "/idees-cadeaux#selection",
  },
  {
    icon: "🦷",
    name: "Gum « jawline »",
    desc: "Le chewing-gum qui sculpte la mâchoire. Fun, viral, petit prix.",
    price: "29€",
    tag: "Moins de 30€",
    accent: "#3E6A6A",
    href: "/idees-cadeaux#selection",
  },
]

const UNIVERSES = [
  { emoji: "👩", label: "Pour Elle", href: "/idees-cadeaux#selection" },
  { emoji: "👨", label: "Pour Lui", href: "/idees-cadeaux#selection" },
  { emoji: "🧒", label: "Enfants", href: "/idees-cadeaux#selection" },
  { emoji: "🎁", label: "Moins de 30€", href: "/idees-cadeaux#selection" },
  { emoji: "📺", label: "Tech & Maison", href: "/idees-cadeaux#selection" },
]

export default function IdeesCadeauxHome() {
  return (
    <div className="bg-[#FBF8F2] text-[#262621]">
      {/* ============================= HERO ============================= */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#1F4D3A]/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-10 h-40 w-40 rounded-full bg-[#E7C568]/20 blur-3xl" />

        <div className="content-container relative py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#1F4D3A]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#1F4D3A]">
            <span className="text-[#C9A24B]">★</span> Spécial Noël 2026
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Le cadeau parfait,
            <br />
            <span className="text-[#1F4D3A]">trouvé en 2 minutes.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-[#262621]/65">
            Une sélection de trouvailles malignes qui font vraiment plaisir —
            pour elle, pour lui, pour les enfants. Livrées chez vous, à temps
            pour les fêtes.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LocalizedClientLink
              href="/idees-cadeaux#selection"
              className="inline-flex items-center justify-center rounded-full bg-[#1F4D3A] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#1F4D3A]/20 transition-all hover:bg-[#163a2b] hover:shadow-xl"
            >
              Voir la sélection de Noël
            </LocalizedClientLink>
            <span className="text-sm text-[#262621]/55">
              🚚 Livraison offerte dès 50€ · Satisfait ou remboursé 30 j
            </span>
          </div>
        </div>
      </section>

      {/* ========================= UNIVERS (gift finder) ========================= */}
      <section className="border-y border-[#262621]/8 bg-white">
        <div className="content-container py-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {UNIVERSES.map((u) => (
              <LocalizedClientLink
                key={u.label}
                href={u.href}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-[#262621]/8 bg-[#FBF8F2] px-4 py-5 text-center transition-all hover:border-[#1F4D3A]/30 hover:shadow-md"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">
                  {u.emoji}
                </span>
                <span className="text-sm font-semibold text-[#262621]">
                  {u.label}
                </span>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= SÉLECTION ========================= */}
      <section id="selection" className="scroll-mt-24">
        <div className="content-container py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B08A3E]">
              Notre sélection
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Les idées cadeaux de l'année
            </h2>
            <p className="mt-4 text-[#262621]/60">
              Testées, approuvées, et choisies pour faire mouche. Chaque cadeau,
              une bonne surprise garantie.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GIFTS.map((g) => (
              <GiftCard key={g.name} gift={g} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================= POURQUOI CAVAGNA ========================= */}
      <section className="bg-[#1F4D3A] text-white">
        <div className="content-container grid grid-cols-2 gap-8 py-14 text-center lg:grid-cols-4">
          <Reassure icon="🎄" title="Livré avant Noël" sub="Commandez avant le 15/12" />
          <Reassure icon="↩️" title="Satisfait ou remboursé" sub="30 jours pour changer d'avis" />
          <Reassure icon="🔒" title="Paiement sécurisé" sub="Carte, Apple & Google Pay" />
          <Reassure icon="💬" title="SAV en français" sub="Une question ? On répond vite" />
        </div>
      </section>

      {/* ========================= CTA FINAL ========================= */}
      <section className="content-container py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Fini le stress du cadeau de dernière minute.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[#262621]/60">
          Choisissez, commandez, c'est emballé. Vous êtes tranquille jusqu'aux
          fêtes.
        </p>
        <div className="mt-8 flex justify-center">
          <LocalizedClientLink
            href="/idees-cadeaux#selection"
            className="inline-flex items-center justify-center rounded-full bg-[#1F4D3A] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-[#163a2b]"
          >
            Trouver mon cadeau
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}

/* ----------------------------- sous-composants ---------------------------- */

function GiftCard({ gift }: { gift: Gift }) {
  return (
    <LocalizedClientLink
      href={gift.href}
      className="group flex flex-col overflow-hidden rounded-3xl border border-[#262621]/8 bg-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div
        className="relative flex h-44 items-center justify-center"
        style={{ backgroundColor: `${gift.accent}14` }}
      >
        <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
          {gift.icon}
        </span>
        <span
          className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: gift.accent }}
        >
          {gift.tag}
        </span>
        {gift.badge && (
          <span className="absolute right-4 top-4 rounded-full bg-[#C9A24B] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {gift.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold">{gift.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#262621]/60">
          {gift.desc}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xl font-bold text-[#1F4D3A]">{gift.price}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1F4D3A] px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-[#163a2b]">
            Offrir →
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

function Reassure({
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
      <span className="text-2xl">{icon}</span>
      <div className="mt-1 text-sm font-semibold">{title}</div>
      <div className="text-xs text-white/60">{sub}</div>
    </div>
  )
}
