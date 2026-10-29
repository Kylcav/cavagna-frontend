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

  const urls = useMemo(() => {
    if (colorImages && product?.variants?.length) {
      const selected =
        product.variants.find((v) => v.id === variantId) || product.variants[0]
      // Valeur d'option de la variante qui correspond à une couleur connue.
      const colorVal = (selected?.options || [])
        .map((o: any) => o?.value)
        .find((val: string) => val && colorImages[val])
      const imgs = colorVal ? colorImages[colorVal] : undefined
      if (imgs && imgs.length) return imgs
    }
    // Repli : images produit classiques.
    return (images || []).map((i) => i.url).filter(Boolean)
  }, [colorImages, product?.variants, variantId, images])

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
            className="absolute inset-0 rounded-rounded transition-opacity duration-300 opacity-100 group-hover:opacity-0"
            alt="Product image"
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            style={{
              objectFit: "cover",
            }}
          />

          {secondImage && (
            <Image
              src={secondImage}
              className="absolute inset-0 rounded-rounded transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              alt="Product image hover"
              fill
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
              style={{
                objectFit: "cover",
              }}
            />
          )}
        </Container>
      </div>
    </div>
  )
}

export default ImageGallery
