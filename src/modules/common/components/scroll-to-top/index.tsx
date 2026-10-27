"use client"

import { useEffect } from "react"

/**
 * Force le scroll tout en haut au montage de la page (ex. page de confirmation
 * de commande, qui s'ouvrait sinon en bas selon la position au checkout).
 */
export default function ScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [])

  return null
}
