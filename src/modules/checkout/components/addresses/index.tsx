"use client"

import { setAddressesData } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    window.history.pushState(null, "", pathname + "?step=address")
  }

  const [message, setMessage] = useState<string | null>(null)

  // Soumission optimiste via onSubmit (et NON via une form action React, qui
  // envelopperait tout dans une transition et différerait la navigation jusqu'à
  // la fin du server action). La validation HTML native s'exécute avant : si un
  // champ requis manque, onSubmit ne se déclenche pas.
  // -> On passe à l'étape livraison IMMÉDIATEMENT (section déjà dans le DOM,
  //    simple changement de ?step côté client), et on sauvegarde l'adresse en
  //    arrière-plan. Une fois sauvegardée, router.refresh() met à jour les
  //    tarifs de livraison.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setMessage(null)

    // Flip instantané vers l'étape livraison SANS refetch serveur :
    // history.pushState change l'URL côté client, et useSearchParams (Next 15)
    // y réagit -> la section Livraison (déjà dans le DOM) s'ouvre immédiatement.
    window.history.pushState(null, "", pathname + "?step=delivery")

    // Sauvegarde de l'adresse en arrière-plan, puis rafraîchissement discret
    // (met à jour le récap d'adresse et les tarifs avec l'adresse saisie).
    setAddressesData(formData).then((error) => {
      if (error) {
        setMessage(error)
        window.history.pushState(null, "", pathname + "?step=address")
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Adresse de livraison
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-address-button"
            >
              Modifier
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form onSubmit={handleSubmit}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="text-3xl-regular gap-x-4 pb-6 pt-8"
                >
                  Adresse de facturation
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton className="mt-6" data-testid="submit-address-button">
              Continuer vers la livraison
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="w-full">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-x-8 w-full">
    <div
      className="flex flex-col w-full min-w-0"
      data-testid="shipping-address-summary"
    >
      <Text className="txt-medium-plus text-ui-fg-base mb-1">
        Adresse de livraison
      </Text>
      <Text className="txt-medium text-ui-fg-subtle">
        {cart.shipping_address.first_name} {cart.shipping_address.last_name}
      </Text>
      <Text className="txt-medium text-ui-fg-subtle">
        {cart.shipping_address.address_1} {cart.shipping_address.address_2}
      </Text>
      <Text className="txt-medium text-ui-fg-subtle">
        {cart.shipping_address.postal_code}, {cart.shipping_address.city}
      </Text>
      <Text className="txt-medium text-ui-fg-subtle">
        {cart.shipping_address.country_code?.toUpperCase()}
      </Text>
    </div>

    <div
      className="flex flex-col w-full min-w-0"
      data-testid="shipping-contact-summary"
    >
      <Text className="txt-medium-plus text-ui-fg-base mb-1">
        Contact
      </Text>
      <Text className="txt-medium text-ui-fg-subtle">
        {cart.shipping_address.phone}
      </Text>
      <Text className="txt-medium text-ui-fg-subtle break-words">
        {cart.email}
      </Text>
    </div>

    <div
      className="flex flex-col w-full min-w-0"
      data-testid="billing-address-summary"
    >
      <Text className="txt-medium-plus text-ui-fg-base mb-1">
        Adresse de facturation
      </Text>

      {sameAsBilling ? (
        <Text className="txt-medium text-ui-fg-subtle">
          Les adresses de facturation et de livraison sont les mêmes.
        </Text>
      ) : (
        <>
          <Text className="txt-medium text-ui-fg-subtle">
            {cart.billing_address?.first_name} {cart.billing_address?.last_name}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {cart.billing_address?.address_1} {cart.billing_address?.address_2}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {cart.billing_address?.postal_code}, {cart.billing_address?.city}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {cart.billing_address?.country_code?.toUpperCase()}
          </Text>
        </>
      )}
    </div>
  </div>
</div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses
