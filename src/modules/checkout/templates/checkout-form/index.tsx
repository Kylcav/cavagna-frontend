import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import MetaInitiateCheckout from "@modules/checkout/components/meta-initiate-checkout"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { Suspense } from "react"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <MetaInitiateCheckout cart={cart} />

      {/* L'adresse de livraison s'affiche immédiatement : elle ne dépend que
          du panier et du client, pas des méthodes de livraison/paiement. */}
      <div id="checkout-address" style={{ scrollMarginTop: "24px" }}>
        <Addresses cart={cart} customer={customer} />
      </div>

      {/* Livraison + paiement + récap se chargent en arrière-plan (streaming)
          pendant que le client remplit déjà son adresse. */}
      <Suspense fallback={<CheckoutStepsSkeleton />}>
        <CheckoutSteps cart={cart} />
      </Suspense>
    </div>
  )
}

async function CheckoutSteps({ cart }: { cart: HttpTypes.StoreCart }) {
  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <>
      <div id="checkout-delivery" style={{ scrollMarginTop: "24px" }}>
        <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      </div>

      <div id="checkout-payment" style={{ scrollMarginTop: "24px" }}>
        <Payment cart={cart} availablePaymentMethods={paymentMethods} />
      </div>

      <div id="checkout-review" style={{ scrollMarginTop: "24px" }}>
        <Review cart={cart} />
      </div>
    </>
  )
}

function CheckoutStepsSkeleton() {
  return (
    <div className="flex flex-col gap-y-8" aria-hidden>
      {["Livraison", "Paiement"].map((label) => (
        <div key={label} className="animate-pulse">
          <div className="mb-4 h-7 w-40 rounded bg-gray-100" />
          <div className="h-16 w-full rounded-lg bg-gray-50" />
        </div>
      ))}
    </div>
  )
}
