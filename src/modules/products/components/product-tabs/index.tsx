"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Informations produit",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Livraison & Retours",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

type Spec = { label: string; value: string }

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  // Caractéristiques renseignées depuis CJ (metadata.specs). On n'affiche
  // QUE les champs disponibles — rien d'inventé, pas de "-".
  const metaSpecs = (product.metadata?.specs as Spec[] | undefined) || []

  const specs: Spec[] = metaSpecs.length
    ? metaSpecs.filter((s) => s && s.label && s.value)
    : [
        ...(product.weight
          ? [{ label: "Poids", value: `${product.weight / 1000} kg` }]
          : []),
        ...(product.length && product.width && product.height
          ? [
              {
                label: "Dimensions",
                value: `${product.length} × ${product.width} × ${product.height} cm`,
              },
            ]
          : []),
        ...(product.material
          ? [{ label: "Matière", value: product.material }]
          : []),
      ]

  if (!specs.length) {
    return (
      <div className="text-small-regular py-8 text-ui-fg-subtle">
        Plus d’informations sur ce produit bientôt disponibles.
      </div>
    )
  }

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-8">
        {specs.map((s, i) => (
          <div key={i}>
            <span className="font-semibold">{s.label}</span>
            <p className="text-ui-fg-subtle">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Livraison rapide</span>
            <p className="max-w-sm">
              Votre colis arrivera sous 3 à 5 jours ouvrés, en point de retrait
              ou directement chez vous.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Échanges simples</span>
            <p className="max-w-sm">
              Le produit ne convient pas parfaitement ? Aucun souci, nous
              l’échangerons contre un nouveau.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Retours faciles</span>
            <p className="max-w-sm">
              Retournez simplement votre produit et nous vous rembourserons.
              Nous ferons le nécessaire pour rendre votre retour simple et sans
              stress.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs