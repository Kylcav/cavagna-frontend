import { Suspense } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"

export default async function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="h-14 border-b border-black/5 bg-white/95 backdrop-blur-xl">
        <nav className="content-container flex h-full items-center justify-between text-xs font-semibold text-[#171412]">
          
          <LocalizedClientLink href="/" className="text-base font-bold">
            CAVAGNA
          </LocalizedClientLink>

          <div className="flex items-center gap-4">
            <LocalizedClientLink href="/">
              Accueil
            </LocalizedClientLink>

            <LocalizedClientLink href="/store">
              Boutique
            </LocalizedClientLink>

            {/* Nouveau lien compte */}
            <LocalizedClientLink href="/account">
              Compte
            </LocalizedClientLink>

            {/* Panier */}
            <Suspense
              fallback={
                <LocalizedClientLink href="/cart">
                  Panier
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}