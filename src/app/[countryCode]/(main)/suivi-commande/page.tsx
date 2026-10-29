import { Metadata } from "next"
import OrderLookup from "@modules/order/components/order-lookup"

export const metadata: Metadata = {
  title: "Suivre ma commande",
  description:
    "Suivez l'état de votre commande en entrant votre numéro de commande et votre e-mail.",
}

export default function SuiviCommandePage() {
  return (
    <div className="content-container py-10 md:py-16">
      <OrderLookup />
    </div>
  )
}
