import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Layout dédié aux pages "tunnel de vente" (ex: /aspirateur).
 * Volontairement minimal : un simple bandeau logo (SANS navigation ni panier,
 * pour ne pas distraire le visiteur) + un pied de page légal sobre.
 * PAS de footer maillots ni de section "savoir-faire" (réservés au site principal).
 */
export default function FunnelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="bg-[#09090B]">
        <div className="content-container flex h-14 items-center justify-center">
          <span className="text-base font-bold tracking-[0.12em] text-white">
            CAVAGNA
          </span>
        </div>
      </header>

      {children}

      <footer className="border-t border-white/10 bg-[#09090B] text-white/45">
        <div className="content-container flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
          <span>© {new Date().getFullYear()} CAVAGNA</span>
          <div className="flex gap-5">
            <LocalizedClientLink
              href="/conditions-generales"
              className="transition-colors hover:text-white/80"
            >
              Conditions générales
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/politique-confidentialite"
              className="transition-colors hover:text-white/80"
            >
              Confidentialité
            </LocalizedClientLink>
          </div>
        </div>
      </footer>
    </>
  )
}
