"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { lookupOrder } from "@lib/data/orders"
import { convertToLocale } from "@lib/util/money"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Recherche…" : "Voir ma commande"}
    </button>
  )
}

const StatusBadge = ({ label }: { label: string }) => {
  const color =
    label === "Livrée"
      ? "bg-green-100 text-green-800"
      : label === "Expédiée"
      ? "bg-blue-100 text-blue-800"
      : "bg-amber-100 text-amber-800"
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${color}`}>
      {label}
    </span>
  )
}

export default function OrderLookup() {
  const [state, formAction] = useActionState(lookupOrder, {
    order: null,
    error: null,
  })
  const order = state?.order

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-2 text-2xl font-semibold">Suivre ma commande</h1>
      <p className="mb-6 text-ui-fg-subtle">
        Entrez votre numéro de commande et l'e-mail utilisé lors de l'achat (ils
        figurent dans votre e-mail de confirmation).
      </p>

      <form action={formAction} className="mb-8 flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Numéro de commande</span>
          <input
            name="display_id"
            inputMode="numeric"
            placeholder="ex. 1360"
            required
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">E-mail de la commande</span>
          <input
            name="email"
            type="email"
            placeholder="vous@email.com"
            required
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />
        </label>
        <SubmitButton />
      </form>

      {state?.error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {state.error}
        </div>
      )}

      {order && (
        <div className="rounded-2xl border border-gray-200 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm text-ui-fg-subtle">Commande</div>
              <div className="text-xl font-semibold">#{order.display_id}</div>
            </div>
            <StatusBadge label={order.status_label} />
          </div>

          {order.status_label === "En préparation" && (
            <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Votre commande est en cours de préparation. Vous recevrez votre
              numéro de suivi par e-mail dès l'expédition. En période de forte
              affluence, le délai peut varier de ± 3 jours.
            </p>
          )}

          {order.tracking?.length > 0 && (
            <div className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm">
              <div className="mb-1 font-medium text-blue-900">Suivi du colis</div>
              {order.tracking.map((t: any, i: number) => (
                <div key={i}>
                  {t.url ? (
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline"
                    >
                      {t.number}
                    </a>
                  ) : (
                    <span>{t.number}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {order.items?.map((item: any) => {
              const colorImages = item?.product?.metadata?.colorImages as
                | Record<string, string[]>
                | undefined
              const optVal = (item?.variant?.options || [])
                .map((o: any) => o?.value)
                .find((v: string) => v && colorImages?.[v])
              const thumb =
                (optVal && colorImages ? colorImages[optVal]?.[0] : undefined) ||
                item?.thumbnail

              return (
                <div key={item.id ?? item.title} className="flex items-center gap-3 py-3">
                  {thumb && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={item.title}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-lg border border-gray-100 object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{item.title}</div>
                    {item.variant?.title && (
                      <div className="text-sm text-ui-fg-subtle">
                        {item.variant.title}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-ui-fg-subtle">x{item.quantity}</div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="font-medium">Total</span>
            <span className="font-semibold">
              {convertToLocale({
                amount: order.total ?? 0,
                currency_code: order.currency_code,
              })}
            </span>
          </div>

          {order.shipping_address && (
            <div className="mt-4 text-sm text-ui-fg-subtle">
              <div className="mb-1 font-medium text-ui-fg-base">Livraison</div>
              <div>
                {order.shipping_address.first_name}{" "}
                {order.shipping_address.last_name}
              </div>
              <div>{order.shipping_address.address_1}</div>
              <div>
                {order.shipping_address.postal_code} {order.shipping_address.city}{" "}
                {order.shipping_address.country_code?.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
