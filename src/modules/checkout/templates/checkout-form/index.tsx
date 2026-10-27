import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import MetaInitiateCheckout from "@modules/checkout/components/meta-initiate-checkout"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

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

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <MetaInitiateCheckout cart={cart} />

      <div id="checkout-address" style={{ scrollMarginTop: "24px" }}>
        <Addresses cart={cart} customer={customer} />
      </div>

      <div id="checkout-delivery" style={{ scrollMarginTop: "24px" }}>
        <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      </div>

      <div id="checkout-payment" style={{ scrollMarginTop: "24px" }}>
        <Payment cart={cart} availablePaymentMethods={paymentMethods} />
      </div>

      <div id="checkout-review" style={{ scrollMarginTop: "24px" }}>
        <Review cart={cart} />
      </div>
    </div>
  )
}