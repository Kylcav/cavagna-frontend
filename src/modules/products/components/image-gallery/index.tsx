"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

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
        if (colorImages && colorImages[val]?.length) out = colorImages[val]
        if (imageZoom && imageZoom[val]) z = imageZoom[val]
      }
    }
    const urls = out || (images || []).map((i) => i.url).filter(Boolean)
    return { urls, zoom: z }
  }, [colorImages, imageZoom, product?.variants, variantId, images])

  // Une seule image affichée sur la fiche produit (elle change avec la couleur,
  // pas au survol). Le survol "2e couleur" ne concerne que la carte boutique.
  const firstImage = urls[0]

  if (!firstImage) {
    return null
  }

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        <Container
          key={firstImage}
          className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
          id={firstImage}
        >
          <Image
            src={firstImage}
            priority
            className="absolute inset-0 rounded-rounded transition-transform duration-300 ease-out"
            alt="Product image"
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            style={{
              objectFit: "cover",
              transform: zoom !== 1 ? `scale(${zoom})` : undefined,
              transformOrigin: "center",
            }}
          />
        </Container>
      </div>
    </div>
  )
}

export default ImageGallery
