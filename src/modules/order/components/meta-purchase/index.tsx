"use client"

import { useEffect } from "react"
import { fbq } from "@lib/meta-pixel"
import { ttqTrack } from "@lib/tiktok-pixel"
import { HttpTypes } from "@medusajs/types"

export default function MetaPurchase({
  order,
}: {
  order: HttpTypes.StoreOrder
}) {
  useEffect(() => {
    const storageKey = `meta_purchase_${order.id}`

    if (sessionStorage.getItem(storageKey)) return
    sessionStorage.setItem(storageKey, "true")

    const eventId = `purchase_${order.id}`
    const value = order.total
    const currency = order.currency_code?.toUpperCase() || "CHF"

    fbq(
      "Purchase",
      {
        content_ids: order.items?.map((item) => item.variant_id) || [],
        content_type: "product",
        contents:
          order.items?.map((item) => ({
            id: item.variant_id,
            quantity: item.quantity,
            item_price: item.unit_price,
          })) || [],
        value,
        currency,
        num_items:
          order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        order_id: order.id,
      },
      {
        eventID: eventId,
      }
    )

    ttqTrack(
      "CompletePayment",
      {
        contents:
          order.items?.map((item) => ({
            content_id: item.variant_id,
            content_type: "product",
            quantity: item.quantity,
            price: item.unit_price,
          })) || [],
        value,
        currency,
        order_id: order.id,
      },
      {
        event_id: eventId,
      }
    )
  }, [order])

  return null
}