"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  product: HttpTypes.StoreProduct
}

const ImageGallery = ({ images, product }: ImageGalleryProps) => {
  const searchParams = useSearchParams()
  const variantId = searchParams.get("v_id")

  // Photos par couleur, renseignées côté back (product.metadata.colorImages).
  // Permet à l'image de suivre la couleur sélectionnée. N'expose aucun id CJ.
  const colorImages = (product?.metadata as any)?.colorImages as
    | Record<string, string[]>
    | undefined
  // Zoom par option (ex. poêle qui "grandit" avec la taille).
  const imageZoom = (product?.metadata as any)?.imageZoom as
    | Record<string, number>
    | undefined

  const { urls, zoom } = useMemo(() => {
    let out: string[] | undefined
    let z = 1
    let used = false
    if ((colorImages || imageZoom) && product?.variants?.length) {
      const selected =
        product.variants.find((v) => v.id === variantId) || product.variants[0]
      const val = (selected?.options || [])
        .map((o: any) => o?.value)
        .find(
          (v: string) =>
            v && ((colorImages && colorImages[v]) || (imageZoom && imageZoom[v]))
        )
      if (val) {
        if (colorImages && colorImages[val]?.length) {
          out = colorImages[val]
          used = true
        }
        if (imageZoom && imageZoom[val]) z = imageZoom[val]
      }
    }
    const urls = out || (images || []).map((i) => i.url).filter(Boolean)
    return { urls, zoom: z, usedColor: used }
  }, [colorImages, imageZoom, product?.variants, variantId, images])

  // Précharge TOUTES les images de couleurs en arrière-plan dès l'arrivée sur
  // la fiche -> le changement de couleur est instantané (image déjà en cache).
  useEffect(() => {
    if (typeof window === "undefined") return
    const all = new Set<string>()
    if (colorImages) {
      Object.values(colorImages).forEach((arr) =>
        (arr || []).forEach((u) => u && all.add(u))
      )
    }
    ;(images || []).forEach((i) => i.url && all.add(i.url))
    all.forEach((u) => {
      const img = new window.Image()
      img.src = u
    })
  }, [colorImages, images])

  // 1re image = l'image de la couleur (ou la 1re image produit) ; 2e image au
  // survol si elle existe (ex. porte-cartes : intérieur du coloris sélectionné).
  const firstImage = urls[0]
  const secondImage = urls[1]

  if (!firstImage) {
    return null
  }

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        <Container
          key={firstImage}
          className="group relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
          id={firstImage}
        >
          <Image
            src={firstImage}
            priority
            unoptimized
            className={
              "absolute inset-0 rounded-rounded transition-all duration-300 ease-out" +
              (secondImage ? " group-hover:opacity-0" : "")
            }
            alt="Product image"
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            style={{
              objectFit: "cover",
              transform: zoom !== 1 ? `scale(${zoom})` : undefined,
              transformOrigin: "center",
            }}
          />

          {secondImage && (
            <Image
              src={secondImage}
              unoptimized
              className="absolute inset-0 rounded-rounded opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
              alt="Product image hover"
              fill
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
              style={{ objectFit: "cover" }}
            />
          )}
        </Container>
      </div>
    </div>
  )
}

export default ImageGallery
