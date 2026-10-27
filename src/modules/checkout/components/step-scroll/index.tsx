"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

/**
 * À chaque changement d'étape du checkout (adresse -> livraison -> paiement ->
 * récap), amène la SECTION correspondante en haut de l'écran (là où se trouve
 * le bouton de l'étape), au lieu de rester en bas de la page.
 * La page de confirmation, elle, scrolle tout en haut (voir ScrollToTop).
 */
export default function StepScroll() {
  const step = useSearchParams().get("step") || "address"

  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.getElementById(`checkout-${step}`)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 24
        window.scrollTo({ top: top < 0 ? 0 : top, left: 0, behavior: "smooth" })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" })
      }
    }, 60)

    return () => clearTimeout(t)
  }, [step])

  return null
}
