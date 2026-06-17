"use client"

import { useEffect } from "react"
import { fbq } from "@lib/meta-pixel"
import { ttqTrack } from "@lib/tiktok-pixel"
import { HttpTypes } from "@medusajs/types"

export default function MetaViewContent({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  useEffect(() => {
    const variant = product.variants?.[0]
    const price = variant?.calculated_price

    const value = price?.calculated_amount
    const currency = price?.currency_code?.toUpperCase() || "CHF"

    // Meta
    fbq("ViewContent", {
      content_ids: product.variants?.map((v) => v.id) || [product.id],
      content_name: product.title,
      content_type: "product",
      contents:
        product.variants?.map((v) => ({
          id: v.id,
          quantity: 1,
          item_price: v.calculated_price?.calculated_amount,
        })) || [],
      value,
      currency,
    })

    // TikTok
    ttqTrack("ViewContent", {
      content_id: product.id,
      content_name: product.title,
      content_type: "product",
      contents:
        product.variants?.map((v) => ({
          content_id: v.id,
          content_name: product.title,
          content_type: "product",
          quantity: 1,
          price: v.calculated_price?.calculated_amount,
        })) || [],
      value,
      currency,
    })
  }, [product])

  return null
}