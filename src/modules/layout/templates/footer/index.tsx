import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  return (
    <footer className="border-t border-[#ebe4dc] bg-white w-full mt-20">
      <div className="content-container py-16">
        <div className="grid grid-cols-1 small:grid-cols-3 gap-10">
          <div>
            <LocalizedClientLink
              href="/"
              className="text-2xl font-bold tracking-tight text-[#171412]"
            >
              CAVAGNA
            </LocalizedClientLink>

            <p className="mt-4 text-sm leading-7 text-[#6b625c] max-w-sm">
              Des maillots de bain d’exception, fabriqués et cousus main en Suisse.
              Chaque pièce allie élégance, artisanat et détails précieux.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#8a6f55]">
              Navigation
            </h3>

            <ul className="mt-4 flex flex-col gap-3 text-sm text-[#5f5a55]">
              <li>
                <LocalizedClientLink href="/" className="hover:text-black transition">
                  Accueil
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/store" className="hover:text-black transition">
                  Boutique
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/cart" className="hover:text-black transition">
                  Panier
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#8a6f55]">
              Informations
            </h3>

            <ul className="mt-4 flex flex-col gap-3 text-sm text-[#5f5a55]">
              <li>Livraison rapide Suisse</li>
              <li>Paiement sécurisé</li>
              <li>Support client 7j/7</li>
              <li>Garantie satisfaction</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-[#ebe4dc] pt-8">
          <div className="flex flex-col small:flex-row items-center justify-between gap-6">
            <Text className="text-sm text-[#7a716b]">
              © {new Date().getFullYear()} CAVAGNA. Tous droits réservés.
            </Text>

            <div className="flex flex-col small:flex-row items-center gap-3 small:gap-6 text-sm text-[#7a716b]">
              <div className="flex items-center gap-4">
                <span className="font-medium">CHF</span>
                <span className="font-medium">Suisse</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}