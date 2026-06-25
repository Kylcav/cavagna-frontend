import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  return (
    <footer className="w-full border-t border-[#ebe4dc] bg-white mt-20">
      <div className="mx-auto w-full max-w-5xl px-24 py-20">
        <div className="flex flex-col md:flex-row items-start">
          <div className="w-[420px] pl-20">
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

          <div className="w-[320px] ml-auto pr-20">
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

        <div className="mt-24 border-t border-[#ebe4dc]" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8">
          <Text className="text-[15px] text-[#7a716b]">
            © {new Date().getFullYear()} CAVAGNA. Tous droits réservés.
          </Text>

          <div className="flex items-center gap-8 text-[15px] text-[#7a716b]">
            <span>CHF</span>
            <span>Suisse</span>
          </div>
        </div>
      </div>
    </footer>
  )
}