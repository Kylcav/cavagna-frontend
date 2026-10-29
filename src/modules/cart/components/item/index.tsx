"use client"

import { Table, Text, clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { soieColorImage, soieColorsLabel } from "@lib/util/soie-thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Vignette : image du coloris choisi (colorImages) en priorité, puis soie,
  // puis image variante/produit. -> le panier montre la bonne couleur.
  const colorImages = (item.product?.metadata as any)?.colorImages as
    | Record<string, string[]>
    | undefined
  const selectedOptionVal = (item.variant?.options || [])
    .map((o: any) => o?.value)
    .find((v: string) => v && colorImages?.[v])
  const colorImg =
    selectedOptionVal && colorImages
      ? colorImages[selectedOptionVal]?.[0]
      : undefined

  const soieImg = soieColorImage(item)
  const thumb =
    colorImg || soieImg || item.variant?.images?.[0]?.url || item.thumbnail
  const thumbImages =
    colorImg || soieImg
      ? undefined
      : item.variant?.images || item.variant?.product?.images

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <>
      {/* Mobile */}
      <Table.Row className="w-full small:hidden" data-testid="product-row">
        <Table.Cell className="!p-0" style={{ gridColumn: "1 / -1" }}>
          <div className="flex flex-col gap-y-4 rounded-xl bg-white p-4">
            <LocalizedClientLink
              href={`/products/${item.product_handle}`}
              className="mx-auto flex w-28"
            >
              <Thumbnail
                thumbnail={thumb}
                images={thumbImages}
                size="square"
              />
            </LocalizedClientLink>

            <div className="flex flex-col gap-y-2 text-center">
              <Text
                className="txt-medium-plus text-ui-fg-base"
                data-testid="product-title"
              >
                {item.product_title}
              </Text>

              <LineItemOptions
                variant={item.variant}
                data-testid="product-variant"
              />
              {soieColorsLabel(item) && (
                <Text className="txt-small text-ui-fg-subtle">
                  Coloris : {soieColorsLabel(item)}
                </Text>
              )}
            </div>

            {type === "full" && (
              <div className="flex items-center justify-center gap-x-3">
                <DeleteButton
                  id={item.id}
                  data-testid="product-delete-button"
                />

                <CartItemSelect
                  value={item.quantity}
                  onChange={(value) =>
                    changeQuantity(parseInt(value.target.value))
                  }
                  className="h-10 w-16 p-4"
                  data-testid="product-select-button"
                >
                  {Array.from(
                    {
                      length: Math.min(maxQuantity, 10),
                    },
                    (_, i) => (
                      <option value={i + 1} key={i}>
                        {i + 1}
                      </option>
                    )
                  )}

                  <option value={1} key={1}>
                    1
                  </option>
                </CartItemSelect>

                {updating && <Spinner />}
              </div>
            )}

            <div className="flex justify-center text-ui-fg-base">
              {type === "preview" && (
                <span className="mr-2 flex gap-x-1">
                  <Text className="text-ui-fg-muted">{item.quantity}x</Text>
                  <LineItemUnitPrice
                    item={item}
                    style="tight"
                    currencyCode={currencyCode}
                  />
                </span>
              )}

              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>

            <ErrorMessage error={error} data-testid="product-error-message" />
          </div>
        </Table.Cell>
      </Table.Row>

      {/* Desktop inchangé */}
      <Table.Row className="hidden w-full small:table-row" data-testid="product-row">
        <Table.Cell className="!pl-0 p-4 w-24">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className={clx("flex", {
              "w-16": type === "preview",
              "small:w-24 w-12": type === "full",
            })}
          >
            <Thumbnail
              thumbnail={thumb}
              images={thumbImages}
              size="square"
            />
          </LocalizedClientLink>
        </Table.Cell>

        <Table.Cell className="text-left">
          <Text
            className="txt-medium-plus text-ui-fg-base"
            data-testid="product-title"
          >
            {item.product_title}
          </Text>
          <LineItemOptions
            variant={item.variant}
            data-testid="product-variant"
          />
          {soieColorsLabel(item) && (
            <Text className="txt-small text-ui-fg-subtle">
              Coloris : {soieColorsLabel(item)}
            </Text>
          )}
        </Table.Cell>

        {type === "full" && (
          <Table.Cell>
            <div className="flex gap-2 items-center w-28">
              <DeleteButton id={item.id} data-testid="product-delete-button" />
              <CartItemSelect
                value={item.quantity}
                onChange={(value) =>
                  changeQuantity(parseInt(value.target.value))
                }
                className="w-14 h-10 p-4"
                data-testid="product-select-button"
              >
                {Array.from(
                  {
                    length: Math.min(maxQuantity, 10),
                  },
                  (_, i) => (
                    <option value={i + 1} key={i}>
                      {i + 1}
                    </option>
                  )
                )}

                <option value={1} key={1}>
                  1
                </option>
              </CartItemSelect>
              {updating && <Spinner />}
            </div>
            <ErrorMessage error={error} data-testid="product-error-message" />
          </Table.Cell>
        )}

        {type === "full" && (
          <Table.Cell className="hidden small:table-cell">
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </Table.Cell>
        )}

        <Table.Cell className="!pr-0">
          <span
            className={clx("!pr-0", {
              "flex flex-col items-end h-full justify-center":
                type === "preview",
            })}
          >
            {type === "preview" && (
              <span className="flex gap-x-1 ">
                <Text className="text-ui-fg-muted">{item.quantity}x </Text>
                <LineItemUnitPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </span>
            )}
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </span>
        </Table.Cell>
      </Table.Row>
    </>
  )
}

export default Item