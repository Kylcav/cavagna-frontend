import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString("fr-CH", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
})

const orderNumber = `#${order.display_id}`

  return (
    <div>
      <Text>
        Nous avons envoyé les détails de confirmation de commande à{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Date de commande :{" "}
        <span data-testid="order-date">
          {formattedDate}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        Numéro de commande : <span data-testid="order-id">{orderNumber}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              Statut de la commande :{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              Statut du paiement :{" "}
              <span
                className="text-ui-fg-subtle "
                sata-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails