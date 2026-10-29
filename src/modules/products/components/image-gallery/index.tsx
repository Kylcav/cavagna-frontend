"use client"

import { HttpTypes } from "@medusajs/types"
import { clx, Container } from "@medusajs/ui"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  product: HttpTypes.StoreProduct
}

const IMG_SIZES =
  "(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"

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
        if (colorImages && colorImages[val]?.length) {
          out = colorImages[val]
        }
        if (imageZoom && imageZoom[val]) z = imageZoom[val]
      }
    }
    const urls = out || (images || []).map((i) => i.url).filter(Boolean)
    return { urls, zoom: z }
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

  const firstImage = urls[0]
  const secondImage = urls[1]

  // Carousel mobile : point actif + reset au changement de couleur.
  const [active, setActive] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setActive(0)
    if (scrollRef.current) scrollRef.current.scrollLeft = 0
  }, [firstImage])
  const onScroll = () => {
    const el = scrollRef.current
    if (!el || !el.clientWidth) return
    setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  if (!firstImage) {
    return null
  }

  const imgTransform =
    zoom !== 1
      ? { transform: `scale(${zoom})`, transformOrigin: "center" as const }
      : undefined

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {/* Desktop (appareil avec survol) : image + 2e image au survol.
            Sur tactile avec 2 images, on masque ce bloc (carousel à la place). */}
        <Container
          key={firstImage}
          className={clx(
            "group relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle",
            secondImage && "[@media(hover:none)]:hidden"
          )}
          id={firstImage}
        >
          <Image
            src={firstImage}
            priority
            unoptimized
            className={clx(
              "absolute inset-0 rounded-rounded transition-all duration-300 ease-out",
              secondImage && "group-hover:opacity-0"
            )}
            alt="Product image"
            fill
            sizes={IMG_SIZES}
            style={{ objectFit: "cover", ...imgTransform }}
          />

          {secondImage && (
            <Image
              src={secondImage}
              unoptimized
              className="absolute inset-0 rounded-rounded opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
              alt="Product image hover"
              fill
              sizes={IMG_SIZES}
              style={{ objectFit: "cover" }}
            />
          )}
        </Container>

        {/* Mobile / tactile (pas de survol) : CAROUSEL swipe des images du
            coloris sélectionné, avec points indicateurs. */}
        {secondImage && (
          <div className="hidden [@media(hover:none)]:block">
            <div
              ref={scrollRef}
              onScroll={onScroll}
              className="flex w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {urls.map((u, i) => (
                <div
                  key={`${firstImage}-${i}`}
                  className="relative shrink-0 w-full snap-center aspect-[29/34] overflow-hidden rounded-rounded bg-ui-bg-subtle"
                >
                  <Image
                    src={u}
                    unoptimized
                    className="absolute inset-0"
                    alt="Product image"
                    fill
                    sizes={IMG_SIZES}
                    style={{ objectFit: "cover", ...imgTransform }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-center gap-2">
              {urls.map((_, i) => (
                <span
                  key={i}
                  className={clx(
                    "h-2 w-2 rounded-full transition-colors",
                    i === active ? "bg-[#171412]" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGallery
