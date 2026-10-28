import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Layout de la boutique "Idées Cadeaux Cavagna".
 * Design original, festif mais premium : vert sapin + accents or/rouge sur crème.
 * Angle de vente = le trouveur de cadeaux (gift finder) + saisonnalité Noël.
 */
export default function GiftLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const universes = [
    { href: "/idees-cadeaux#pour-elle", label: "Pour Elle" },
    { href: "/idees-cadeaux#pour-lui", label: "Pour Lui" },
    { href: "/idees-cadeaux#enfants", label: "Enfants" },
    { href: "/idees-cadeaux#petits-prix", label: "Moins de 30€" },
    { href: "/idees-cadeaux#tech", label: "Tech & Maison" },
  ]

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#262621]">
      {/* Bandeau Noël */}
      <div className="bg-[#1F4D3A] text-center text-xs font-medium tracking-wide text-[#F3E7C9]">
        <div className="content-container flex items-center justify-center gap-2 py-2">
          <span className="text-[#E7C568]">★</span>
          Commandez avant le 15 décembre pour être livré à temps pour Noël ·
          Livraison offerte dès 50€
          <span className="text-[#E7C568]">★</span>
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#262621]/8 bg-[#FBF8F2]/90 backdrop-blur">
        <div className="content-container flex h-16 items-center justify-between gap-4">
          <LocalizedClientLink
            href="/idees-cadeaux"
            className="flex items-baseline gap-2 whitespace-nowrap"
          >
            <span className="text-xl font-bold tracking-tight text-[#1F4D3A]">
              CAVAGNA
            </span>
            <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-[#B08A3E] sm:inline">
              Idées Cadeaux
            </span>
          </LocalizedClientLink>

          <nav className="hidden items-center gap-6 lg:flex">
            {universes.map((u) => (
              <LocalizedClientLink
                key={u.href}
                href={u.href}
                className="text-sm font-medium text-[#262621]/70 transition-colors hover:text-[#1F4D3A]"
              >
                {u.label}
              </LocalizedClientLink>
            ))}
          </nav>

          <LocalizedClientLink
            href="/idees-cadeaux#selection"
            className="whitespace-nowrap rounded-full bg-[#1F4D3A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#163a2b]"
          >
            La sélection
          </LocalizedClientLink>
        </div>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#262621]/10 bg-[#F2ECE0]">
        <div className="content-container grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xl font-bold tracking-tight text-[#1F4D3A]">
              CAVAGNA
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#262621]/60">
              La boutique des idées cadeaux malignes. Des trouvailles qui font
              vraiment plaisir, livrées chez vous.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#262621]">Cadeaux</div>
            <ul className="mt-3 space-y-2 text-sm text-[#262621]/60">
              <li><LocalizedClientLink href="/idees-cadeaux#selection" className="hover:text-[#1F4D3A]">La sélection de Noël</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/idees-cadeaux#petits-prix" className="hover:text-[#1F4D3A]">Moins de 30€</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/idees-cadeaux#tech" className="hover:text-[#1F4D3A]">Tech & Maison</LocalizedClientLink></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#262621]">Aide</div>
            <ul className="mt-3 space-y-2 text-sm text-[#262621]/60">
              <li><LocalizedClientLink href="/idees-cadeaux/suivi" className="hover:text-[#1F4D3A]">Suivre ma commande</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/idees-cadeaux/contact" className="hover:text-[#1F4D3A]">Contact</LocalizedClientLink></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#262621]">Infos</div>
            <ul className="mt-3 space-y-2 text-sm text-[#262621]/60">
              <li><LocalizedClientLink href="/conditions-generales" className="hover:text-[#1F4D3A]">Conditions générales</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/politique-confidentialite" className="hover:text-[#1F4D3A]">Confidentialité</LocalizedClientLink></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#262621]/10">
          <div className="content-container py-5 text-xs text-[#262621]/45">
            © {new Date().getFullYear()} CAVAGNA — Idées cadeaux
          </div>
        </div>
      </footer>
    </div>
  )
}
