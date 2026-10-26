import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import AspirateurFunnel from "@modules/aspirateur/templates"

const HANDLE = "aspirateur-robot-18000-pa"

type Props = {
  params: Promise<{ countryCode: string }>
}

export const metadata: Metadata = {
  title: "Robot Aspirateur & Laveur 35 000 Pa – Station auto-vidage | CAVAGNA",
  description:
    "Le robot qui aspire, lave et se vide tout seul. 35 000 Pa, navigation laser LDS + VSLAM, pilotage par application. Livraison gratuite.",
  openGraph: {
    title: "Robot Aspirateur & Laveur 35 000 Pa – Station auto-vidage",
    description:
      "35 000 Pa d'aspiration, lavage intelligent des sols, navigation laser et station qui se vide toute seule. Votre maison impeccable, sans lever le petit doigt.",
    images: ["/aspirateur/robot.webp"],
  },
}

export default async function AspirateurPage(props: Props) {
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
    <AspirateurFunnel
      product={product}
      region={region}
      countryCode={params.countryCode}
    />
  )
}
