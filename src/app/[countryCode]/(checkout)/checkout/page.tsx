import { initiatePaymentSession, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartPaymentMethods } from "@lib/data/payment"
import { isStripeLike } from "@lib/constants"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import StepScroll from "@modules/checkout/components/step-scroll"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  let cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  // Préchargement du paiement : on crée la session Stripe DÈS l'arrivée sur
  // le checkout (pendant que le client remplit son adresse), pour que le moyen
  // de paiement (Carte / Apple Pay / Google Pay) soit prêt instantanément à
  // l'étape paiement, au lieu d'attendre ce moment-là.
  const hasStripeSession = cart.payment_collection?.payment_sessions?.some(
    (s) => s.status === "pending" && isStripeLike(s.provider_id)
  )

  if (!hasStripeSession) {
    try {
      const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
      const stripeMethod = paymentMethods?.find((m) => isStripeLike(m.id))

      if (stripeMethod) {
        await initiatePaymentSession(cart, { provider_id: stripeMethod.id })
        // Recharge le panier pour récupérer la session (client_secret) → le
        // wrapper Stripe se monte dès le premier rendu.
        cart = (await retrieveCart()) ?? cart
      }
    } catch {
      // En cas d'échec, le paiement s'initialisera à l'étape paiement (secours).
    }
  }

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
      <Suspense fallback={null}>
        <StepScroll />
      </Suspense>
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>

      <CheckoutSummary cart={cart} />
    </div>
  )
}