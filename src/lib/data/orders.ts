"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const retrieveOrder = async (id: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      method: "GET",
      query: {
        fields:
          "*payment_collections.payments,*items,*items.metadata,*items.thumbnail,*items.variant,*items.variant.images,*items.variant.options,*items.product,*items.product.images,items.product.metadata,*shipping_methods",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ order }) => order)
    .catch((err) => medusaError(err))
}

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      method: "GET",
      query: {
        limit,
        offset,
        order: "-created_at",
        fields:
          "*items,+items.metadata,*items.thumbnail,*items.variant,*items.variant.images,*items.variant.options,*items.product,*items.product.images,items.product.metadata,*shipping_methods",
        ...filters,
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err))
}

// Recherche de commande pour un invité : numéro (display_id) + e-mail.
// Appelle la route custom backend /store/order-lookup (pas d'auth client).
export const lookupOrder = async (
  _prev: unknown,
  formData: FormData
): Promise<{ order: any | null; error: string | null }> => {
  const display_id = (formData.get("display_id") as string)?.trim()
  const email = (formData.get("email") as string)?.trim()

  if (!display_id || !email) {
    return { order: null, error: "Merci d'indiquer votre numéro de commande et votre e-mail." }
  }

  try {
    const data = await sdk.client.fetch<{ order: any }>(`/store/order-lookup`, {
      method: "POST",
      body: { display_id, email },
      cache: "no-store",
    })
    return { order: data.order, error: null }
  } catch (err: any) {
    const status = err?.status
    if (status === 404) {
      return {
        order: null,
        error:
          "Aucune commande ne correspond à ce numéro et cet e-mail. Vérifiez les informations de votre e-mail de confirmation.",
      }
    }
    return { order: null, error: "Une erreur est survenue. Réessayez dans un instant." }
  }
}

export const createTransferRequest = async (
  state: {
    success: boolean
    error: string | null
    order: HttpTypes.StoreOrder | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  order: HttpTypes.StoreOrder | null
}> => {
  const id = formData.get("order_id") as string

  if (!id) {
    return { success: false, error: "Order ID is required", order: null }
  }

  const headers = await getAuthHeaders()

  return await sdk.store.order
    .requestTransfer(
      id,
      {},
      {
        fields: "id, email",
      },
      headers
    )
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const acceptTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .acceptTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const declineTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .declineTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}