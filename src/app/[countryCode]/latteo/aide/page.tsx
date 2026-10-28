import { Metadata } from "next"
import { CtaBanner, PageHeader } from "@modules/latteo/components/shared"

export const metadata: Metadata = {
  title: "Aide & questions fréquentes | Lattéo",
  description:
    "Toutes les réponses sur la machine Lattéo : utilisation, laits possibles, nettoyage, livraison, garantie et paiement.",
}

const GROUPS = [
  {
    cat: "Le produit",
    items: [
      {
        q: "Quels laits puis-je préparer ?",
        a: "Amande, avoine, noisette, soja, riz, graines de chanvre ou de tournesol… et même des soupes et des boissons chaudes. Tu contrôles le goût et la texture en ajustant les quantités d'ingrédients et d'eau.",
      },
      {
        q: "Quelle est la capacité de la machine ?",
        a: "Environ 1,2 litre par cycle — de quoi préparer un pichet pour toute la famille ou plusieurs tasses dans la journée.",
      },
      {
        q: "La prise est-elle compatible ?",
        a: "Oui, la machine est livrée avec une prise européenne standard, compatible avec les prises de France, Suisse et de l'Union européenne.",
      },
    ],
  },
  {
    cat: "Utilisation",
    items: [
      {
        q: "C'est vraiment prêt en 60 secondes ?",
        a: "Le mixage prend environ une minute. La machine chauffe puis mixe automatiquement : tu ajoutes les ingrédients et l'eau, tu appuies, et tu obtiens un lait frais et tiède, sans rien surveiller.",
      },
      {
        q: "Dois-je faire tremper les ingrédients ?",
        a: "Ce n'est pas obligatoire. Pour un lait encore plus crémeux, tu peux faire tremper les amandes quelques heures, mais une poignée d'ingrédients secs suffit pour un bon résultat.",
      },
      {
        q: "Est-ce facile à nettoyer ?",
        a: "Oui. Le panier-filtre est amovible et la machine dispose d'une fonction d'auto-nettoyage : un peu d'eau, un cycle, un rinçage, et c'est propre.",
      },
    ],
  },
  {
    cat: "Livraison, garantie & paiement",
    items: [
      {
        q: "Combien je vais réellement économiser ?",
        a: "Un litre de lait végétal maison revient à environ 0,40 € d'ingrédients, contre ~2,50 € en magasin. Sur une base d'un litre par semaine, tu économises une centaine d'euros par an — la machine est remboursée en moins de deux mois.",
      },
      {
        q: "Comment se passe la livraison ?",
        a: "La livraison est offerte et tu reçois ta machine sous 7 à 12 jours, avec un numéro de suivi dès l'expédition.",
      },
      {
        q: "Quelle est la garantie ?",
        a: "La machine est garantie 2 ans. Et tu disposes de 30 jours après réception pour nous la renvoyer et être remboursé si elle ne te convient pas.",
      },
      {
        q: "Le paiement est-il sécurisé ?",
        a: "Oui, les paiements sont traités de façon 100 % sécurisée (carte bancaire). Tes informations ne sont jamais stockées sur notre site.",
      },
    ],
  },
]

export default function AidePage() {
  return (
    <div className="bg-[#F6F2E9] text-[#2B2B24]">
      <PageHeader
        eyebrow="On est là pour t'aider"
        title="Questions fréquentes"
        subtitle="Tu ne trouves pas ta réponse ? Écris-nous, on répond vite et en français."
      />

      <section className="content-container py-16 sm:py-24">
        <div className="mx-auto max-w-3xl space-y-12">
          {GROUPS.map((g) => (
            <div key={g.cat}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4F5D43]">
                {g.cat}
              </h2>
              <div className="mt-4 divide-y divide-[#2B2B24]/10 border-y border-[#2B2B24]/10">
                {g.items.map((it) => (
                  <details key={it.q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <span className="text-base font-medium">{it.q}</span>
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[#2B2B24]/20 text-lg leading-none transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-[#2B2B24]/65">
                      {it.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-[#2B2B24]/8 bg-white p-7 text-center">
            <div className="text-lg font-semibold">Une autre question ?</div>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#2B2B24]/60">
              Notre équipe te répond par e-mail. Écris-nous et on revient vers toi
              rapidement.
            </p>
            <a
              href="mailto:contact@cavagna.shop"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-[#4F5D43] px-6 py-3 text-sm font-semibold text-[#4F5D43] transition-colors hover:bg-[#4F5D43] hover:text-white"
            >
              contact@cavagna.shop
            </a>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
