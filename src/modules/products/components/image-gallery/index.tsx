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

  const image = useMemo(() => {
    const selectedVariant = product?.variants?.find(
      (variant) => variant.id === variantId
    )

    const variantImages = (selectedVariant as any)?.images || []

    const variantImage = variantImages
      .slice()
      .sort((a: any, b: any) => (b.rank ?? 0) - (a.rank ?? 0))[0]

    return variantImage || images?.[0]
  }, [product?.variants, variantId, images])

  const firstImage = images?.[0]?.url || image?.url
  const secondImage = images?.[1]?.url

  if (!firstImage) {
    return null
  }

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        <Container
          key={firstImage}
          className="group relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
          id={image?.id ?? firstImage}
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