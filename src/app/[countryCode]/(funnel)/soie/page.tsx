import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import SoieFunnel from "@modules/soie/templates"

const HANDLE = "taie-soie-mulberry"

type Props = {
  params: Promise<{ countryCode: string }>
}

export const metadata: Metadata = {
  title:
    "Taie d'oreiller en soie de mûrier – Cheveux & peau sublimés | CAVAGNA",
  description:
    "La taie en soie de mûrier 100% : moins de frisottis, moins de plis d'oreiller, une peau préservée. 12 coloris. 59 CHF l'unité ou 2 pour 89 CHF. Livraison offerte.",
  openGraph: {
    title: "Taie d'oreiller en soie de mûrier – CAVAGNA",
    description:
      "Soie de mûrier 100% : vos cheveux et votre peau vous remercient. 12 coloris. Livraison offerte.",
    images: ["/soie/soie-hero.jpg"],
  },
}

export default async function SoiePage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: HANDLE },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return (
    <SoieFunnel
      product={product}
      region={region}
      countryCode={params.countryCode}
    />
  )
}
