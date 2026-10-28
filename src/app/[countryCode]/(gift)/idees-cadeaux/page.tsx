import { Metadata } from "next"
import IdeesCadeauxHome from "@modules/idees-cadeaux/templates"

export const metadata: Metadata = {
  title: "Idées Cadeaux Cavagna — Le cadeau parfait, trouvé en 2 minutes",
  description:
    "Une sélection de cadeaux malins pour elle, pour lui et pour les enfants. Des trouvailles qui font vraiment plaisir, livrées à temps pour Noël. Livraison offerte dès 50€.",
  openGraph: {
    title: "Idées Cadeaux Cavagna — Le cadeau parfait",
    description:
      "La sélection de cadeaux de l'année : tech, maison, beauté, enfants. Livré à temps pour Noël.",
  },
}

export default function IdeesCadeauxPage() {
  return <IdeesCadeauxHome />
}
