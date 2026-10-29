import { Text } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  const isSale = price.price_type === "sale"

  return (
    <div className="flex items-center gap-x-2">
      {isSale && (
        <Text
          className="line-through text-ui-fg-subtle"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className={isSale ? "text-ui-fg-base font-semibold" : "text-ui-fg-muted"}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </div>
  )
}
