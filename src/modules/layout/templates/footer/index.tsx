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
              <p>Les meilleures idées cadeaux,</p>
              <p>sélectionnées pour vous.</p>
              <p>Des produits malins et tendance,</p>
              <p>livrés rapidement partout en Europe.</p>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="flex w-full max-w-md flex-col items-center text-center">
            <h3 className="text-[15px] font-bold uppercase tracking-[0.22em] text-[#8a6f55]">
              INFORMATIONS
            </h3>

            <ul className="mt-10 flex flex-col gap-5 text-[18px] leading-8 text-[#5f5a55]">
              <li>Livraison rapide</li>
              <li>Paiement sécurisé</li>
              <li>Support client 7j/7</li>
              <li>Garantie satisfaction</li>
            </ul>

            <ul className="mt-8 flex flex-col gap-4 text-[16px] leading-7">
              <li>
                <LocalizedClientLink
                  href="/account/orders"
                  className="text-[#171412] underline underline-offset-4 hover:text-[#8a6f55]"
                >
                  Suivre ma commande
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/conditions-generales"
                  className="text-[#5f5a55] hover:text-[#171412]"
                >
                  Conditions générales
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/politique-confidentialite"
                  className="text-[#5f5a55] hover:text-[#171412]"
                >
                  Politique de confidentialité
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bande blanche du bas */}
      <div className="border-t border-[#ebe4dc]" />

    </footer>
  )
}