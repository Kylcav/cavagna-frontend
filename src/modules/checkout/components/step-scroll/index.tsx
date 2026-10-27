"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

/**
 * Remonte en haut de la page à chaque changement d'étape du checkout
 * (adresse -> livraison -> paiement -> récap), sinon on reste en bas là où on
 * a cliqué "Continuer".
 */
export default function StepScroll() {
  const step = useSearchParams().get("step")

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [step])

  return null
}
