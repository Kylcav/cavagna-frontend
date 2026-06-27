import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function NotreSavoirFairePage() {
  return (
    <div className="py-6 content-container">
      <div className="mb-10 overflow-x-auto">
        <nav className="flex w-max min-w-full items-center justify-center gap-10 border-b border-black/10 pb-4">
          <LocalizedClientLink
            href="/categories/maillots-de-bain-femme"
            className="group relative whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-[#8a6f55] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-[#b08a68]"
          >
            MAILLOTS DE BAIN FEMME
            <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#b08a68] transition-all duration-300 ease-out group-hover:w-full" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/categories/maillots-de-bain-homme"
            className="group relative whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-[#8a6f55] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-[#b08a68]"
          >
            MAILLOTS DE BAIN HOME
            <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#b08a68] transition-all duration-300 ease-out group-hover:w-full" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/categories/accessoires"
            className="group relative whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-[#8a6f55] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-[#b08a68]"
          >
            ACCESSOIRES
            <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#b08a68] transition-all duration-300 ease-out group-hover:w-full" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/notre-savoir-faire"
            className="group relative whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-[#b08a68]"
          >
            NOTRE SAVOIR-FAIRE
            <span className="absolute -bottom-2 left-1/2 h-px w-full -translate-x-1/2 bg-[#b08a68]" />
          </LocalizedClientLink>
        </nav>
      </div>

      <div className="mx-auto max-w-4xl py-16 text-center">
        <p className="text-sm uppercase tracking-widest text-[#8a6f55]">
          Notre savoir-faire
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Un artisanat suisse, précis et élégant
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-8 text-[#5f5a55]">
          Chaque pièce CAVAGNA est pensée avec soin, fabriquée et cousue main en Suisse.
          Notre savoir-faire repose sur l&apos;exigence du détail, la qualité des matières
          et une finition élégante.
        </p>
      </div>
    </div>
  )
}