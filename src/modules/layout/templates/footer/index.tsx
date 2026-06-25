import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  return (
    <footer className="w-full bg-white mt-20">

      {/* Bande blanche du haut */}
      <div className="border-t border-[#ebe4dc]" />

      {/* Contenu */}
      <div className="w-full py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-20 text-center md:flex-row md:items-start md:justify-center">

          {/* Colonne gauche */}
          <div className="flex w-full max-w-md flex-col items-center text-center">
            <LocalizedClientLink
              href="/"
              className="text-[24px] font-bold tracking-tight text-[#171412]"
            >
              CAVAGNA
            </LocalizedClientLink>

            <div className="mt-10 flex flex-col gap-5 text-[18px] leading-8 text-[#5f5a55]">
              <p>Des maillots de bain d&apos;exception,</p>
              <p>fabriqués et cousus main en Suisse.</p>
              <p>Chaque pièce allie élégance,</p>
              <p>artisanat et détails précieux.</p>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="flex w-full max-w-md flex-col items-center text-center">
            <h3 className="text-[15px] font-bold uppercase tracking-[0.22em] text-[#8a6f55]">
              INFORMATIONS
            </h3>

            <ul className="mt-10 flex flex-col gap-5 text-[18px] leading-8 text-[#5f5a55]">
              <li>Livraison rapide Suisse</li>
              <li>Paiement sécurisé</li>
              <li>Support client 7j/7</li>
              <li>Garantie satisfaction</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bande blanche du bas */}
      <div className="border-t border-[#ebe4dc]" />

    </footer>
  )
}