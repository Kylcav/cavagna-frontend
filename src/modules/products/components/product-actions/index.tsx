"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { fbq } from "@lib/meta-pixel"
import { ttqTrack } from "@lib/tiktok-pixel"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const initialSearchParams = useSearchParams()
  const countryCode = useParams().countryCode as string

  const hasInitialized = useRef(false)
  const lastUrlVariantId = useRef<string | null>(null)

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (hasInitialized.current) return
    if (!product.variants?.length) return

    hasInitialized.current = true

    const variantIdFromUrl = initialSearchParams.get("v_id")

    const initialVariant =
      product.variants.find((variant) => variant.id === variantIdFromUrl) ||
      product.variants[0]

    lastUrlVariantId.current = initialVariant.id

    setOptions(optionsAsKeymap(initialVariant.options) ?? {})
  }, [product.variants, initialSearchParams])

  const selectedVariant = useMemo(() => {
    if (!product.variants?.length) return undefined

    return product.variants.find((variant) => {
      const variantOptions = optionsAsKeymap(variant.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => {
      if (prev[optionId] === value) return prev

      return {
        ...prev,
        [optionId]: value,
      }
    })
  }

  const isValidVariant = !!selectedVariant

  useEffect(() => {
    if (!selectedVariant?.id || !isValidVariant) return
    if (lastUrlVariantId.current === selectedVariant.id) return

    lastUrlVariantId.current = selectedVariant.id

    const params = new URLSearchParams(window.location.search)
    params.set("v_id", selectedVariant.id)

    const query = params.toString()

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    })
  }, [selectedVariant?.id, isValidVariant, pathname, router])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true

    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant.inventory_quantity || 0) > 0
    ) {
      return true
    }

    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })

      const calculatedPrice = selectedVariant.calculated_price
      const value = calculatedPrice?.calculated_amount
      const currency =
        calculatedPrice?.currency_code?.toUpperCase() ||
        product.variants?.[0]?.calculated_price?.currency_code?.toUpperCase() ||
        "CHF"

      fbq("AddToCart", {
        content_ids: [selectedVariant.id],
        content_name: product.title,
        content_type: "product",
        contents: [
          {
            id: selectedVariant.id,
            quantity: 1,
            item_price: value,
          },
        ],
        value,
        currency,
      })

      ttqTrack("AddToCart", {
        content_id: selectedVariant.id,
        content_name: product.title,
        content_type: "product",
        contents: [
          {
            content_id: selectedVariant.id,
            content_name: product.title,
            content_type: "product",
            quantity: 1,
            price: value,
          },
        ],
        value,
        currency,
      })

      router.push(`/${countryCode}/cart`)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              ))}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-14 rounded-full bg-[#171412] text-white text-base font-bold hover:bg-black"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant
            ? "Choisir une option"
            : !inStock || !isValidVariant
            ? "Victime de son succès"
            : "Ajouter au panier"}
        </Button>
      </div>

      {!inView && (
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      )}
    </>
  )
}