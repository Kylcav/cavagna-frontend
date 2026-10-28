import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Layout du mini-site de marque "Lattéo" (machine à lait végétal).
 * Design clair / naturel inspiré des sites DTC bien-être (fond crème, vert
 * sauge). Nav propre + footer de marque, indépendants du site CAVAGNA.
 */
export default function LatteoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nav = [
    { href: "/latteo#comment", label: "Comment ça marche" },
    { href: "/latteo#recettes", label: "Recettes" },
    { href: "/latteo#histoire", label: "Notre histoire" },
    { href: "/latteo#faq", label: "Aide" },
  ]

  return (
    <div className="min-h-screen bg-[#F6F2E9] text-[#2B2B24]">
      {/* Bandeau annonce */}
      <div className="bg-[#4F5D43] text-center text-xs font-medium tracking-wide text-white/90">
        <div className="content-container py-2">
          Livraison offerte dès 50€ · Garantie 2 ans · Satisfait ou remboursé 30 jours
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#2B2B24]/8 bg-[#F6F2E9]/90 backdrop-blur">
        <div className="content-container flex h-16 items-center justify-between">
          <LocalizedClientLink
            href="/latteo"
            className="text-2xl font-bold tracking-tight text-[#4F5D43]"
          >
            lattéo
          </LocalizedClientLink>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((n) => (
              <LocalizedClientLink
                key={n.href}
                href={n.href}
                className="text-sm font-medium text-[#2B2B24]/70 transition-colors hover:text-[#4F5D43]"
              >
                {n.label}
              </LocalizedClientLink>
            ))}
          </nav>

          <LocalizedClientLink
            href="/latteo#acheter"
            className="rounded-full bg-[#4F5D43] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3D4834]"
          >
            Commander
          </LocalizedClientLink>
        </div>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#2B2B24]/10 bg-[#EFE9DC]">
        <div className="content-container grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#4F5D43]">
              lattéo
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#2B2B24]/60">
              Du lait végétal frais, maison, en 60 secondes. Sans additifs,
              moins de déchets.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#2B2B24]">Le produit</div>
            <ul className="mt-3 space-y-2 text-sm text-[#2B2B24]/60">
              <li>
                <LocalizedClientLink href="/latteo#acheter" className="hover:text-[#4F5D43]">
                  Commander la machine
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/latteo#comment" className="hover:text-[#4F5D43]">
                  Comment ça marche
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/latteo#recettes" className="hover:text-[#4F5D43]">
                  Recettes
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#2B2B24]">La marque</div>
            <ul className="mt-3 space-y-2 text-sm text-[#2B2B24]/60">
              <li>
                <LocalizedClientLink href="/latteo#histoire" className="hover:text-[#4F5D43]">
                  Notre histoire
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/latteo#faq" className="hover:text-[#4F5D43]">
                  Questions fréquentes
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#2B2B24]">Infos</div>
            <ul className="mt-3 space-y-2 text-sm text-[#2B2B24]/60">
              <li>
                <LocalizedClientLink href="/conditions-generales" className="hover:text-[#4F5D43]">
                  Conditions générales
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/politique-confidentialite" className="hover:text-[#4F5D43]">
                  Confidentialité
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#2B2B24]/10">
          <div className="content-container py-5 text-xs text-[#2B2B24]/45">
            © {new Date().getFullYear()} Lattéo — une marque de la famille Cavagna.
          </div>
        </div>
      </footer>
    </div>
  )
}
