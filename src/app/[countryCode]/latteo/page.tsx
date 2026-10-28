import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LatteoFunnel from "@modules/latteo/templates"

const HANDLE = "latteo-machine-lait-vegetal"

type Props = {
  params: Promise<{ countryCode: string }>
}

export const metadata: Metadata = {
  title: "Lattéo — Du lait végétal frais, maison, en 60 secondes",
  description:
    "La machine Lattéo prépare du lait d'amande, d'avoine, de noisette ou de soja frais en 60 secondes, à partir d'ingrédients bruts. Sans additifs, moins de déchets, jusqu'à 90 % moins cher que le commerce. Livraison offerte.",
  openGraph: {
    title: "Lattéo — Du lait végétal frais en 60 secondes",
    description:
      "Fais ton lait végétal maison à partir d'ingrédients bruts. Sans additifs, moins de déchets, plus économique. Prêt en 60 secondes.",
    images: ["/latteo/cj-1.jpg"],
  },
}

export default async function LatteoPage(props: Props) {
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
    <LatteoFunnel
      product={product}
      region={region}
      countryCode={params.countryCode}
    />
  )
}
