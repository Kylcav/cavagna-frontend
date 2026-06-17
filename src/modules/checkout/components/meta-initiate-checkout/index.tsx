"use client"

import { useEffect } from "react"
import { fbq } from "@lib/meta-pixel"
import { ttqTrack } from "@lib/tiktok-pixel"
import { HttpTypes } from "@medusajs/types"

export default function MetaInitiateCheckout({
  cart,
}: {
  cart: HttpTypes.StoreCart
}) {
  useEffect(() => {
    const value = cart.total
    const currency = cart.currency_code?.toUpperCase() || "CHF"

    // Meta
    fbq("InitiateCheckout", {
      content_ids: cart.items?.map((item) => item.variant_id) || [],
      content_type: "product",
      contents:
        cart.items?.map((item) => ({
          id: item.variant_id,
          quantity: item.quantity,
          item_price: item.unit_price,
        })) || [],
      value,
      currency,
      num_items:
        cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    })

    // TikTok
    ttqTrack("InitiateCheckout", {
      contents:
        cart.items?.map((item) => ({
          content_id: item.variant_id,
          content_type: "product",
          quantity: item.quantity,
          price: item.unit_price,
        })) || [],
      value,
      currency,
    })
  }, [cart])

  return null
}