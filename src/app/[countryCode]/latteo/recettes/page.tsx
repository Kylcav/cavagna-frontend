import { Metadata } from "next"
import { CtaBanner, PageHeader } from "@modules/latteo/components/shared"

export const metadata: Metadata = {
  title: "Recettes de lait végétal maison | Lattéo",
  description:
    "Lait d'amande, golden latte, chai latte, granola maison… Des recettes simples et gourmandes à préparer avec ta machine Lattéo, sans additifs.",
}

const RECIPES = [
  {
    img: "/latteo/recette-amande.jpg",
    title: "Lait d'amande velouté",
    time: "60 secondes",
    desc: "Le classique, crémeux et doux. Parfait dans le café, les céréales ou tel quel.",
    ingredients: [
      "80 g d'amandes",
      "1 L d'eau",
      "1 datte (facultatif, pour sucrer)",
      "1 pincée de sel",
    ],
    steps:
      "Mets les amandes et la datte dans le panier-filtre, verse l'eau, lance le programme. Ajoute la pincée de sel en fin de cycle et mélange.",
  },
  {
    img: "/latteo/recette-golden.jpg",
    title: "Golden latte curcuma",
    time: "5 minutes",
    desc: "Une boisson réconfortante, dorée et légèrement épicée, idéale le soir.",
    ingredients: [
      "Lait d'avoine Lattéo (500 ml)",
      "1 c. à café de curcuma",
      "1 pincée de poivre & de cannelle",
      "1 c. à café de miel ou sirop d'érable",
    ],
    steps:
      "Prépare d'abord un lait d'avoine avec Lattéo, puis relance un cycle en ajoutant le curcuma, les épices et le miel pour tout chauffer et mélanger.",
  },
  {
    img: "/latteo/recette-chai.jpg",
    title: "Chai latte maison",
    time: "10 minutes",
    desc: "Les épices chaudes du chai dans un lait végétal mousseux et parfumé.",
    ingredients: [
      "Lait de noisette Lattéo (500 ml)",
      "1 sachet de thé noir",
      "Cannelle, cardamome, gingembre, anis étoilé",
      "Sucre de canne au goût",
    ],
    steps:
      "Infuse le thé et les épices, filtre, puis relance un cycle avec le lait Lattéo pour obtenir une boisson chaude et mousseuse.",
  },
  {
    img: "/latteo/recette-granola.jpg",
    title: "Bol granola & lait frais",
    time: "30 minutes",
    desc: "Un petit-déjeuner complet : granola croustillant et lait végétal maison.",
    ingredients: [
      "Flocons d'avoine, noix, graines, miel",
      "Lait d'amande ou d'avoine Lattéo",
      "Fruits frais (baies, banane)",
    ],
    steps:
      "Fais dorer le granola au four, verse ton lait Lattéo fraîchement préparé, ajoute les fruits. Croustillant + crémeux, le combo parfait.",
  },
]

export default function RecettesPage() {
  return (
    <div className="bg-[#F6F2E9] text-[#2B2B24]">
      <PageHeader
        eyebrow="Bien plus que du lait"
        title="Recettes maison"
        subtitle="Avec Lattéo et les restes du panier-filtre, tu crées une infinité de boissons et de douceurs. Voici de quoi commencer."
      />

      <section className="content-container py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {RECIPES.map((r) => (
            <article
              key={r.title}
              className="overflow-hidden rounded-3xl border border-[#2B2B24]/8 bg-white shadow-sm"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#EFE9DC]">
                <img
                  src={r.img}
                  alt={r.title}
                  className="h-full w-full object-cover"
                  width={640}
                  height={400}
                  loading="lazy"
                />
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-xl font-bold">{r.title}</h2>
                  <span className="flex-none text-xs font-medium uppercase tracking-wide text-[#4F5D43]">
                    {r.time}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#2B2B24]/65">{r.desc}</p>

                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#2B2B24]/50">
                    Ingrédients
                  </div>
                  <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {r.ingredients.map((i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[#2B2B24]/75"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#4F5D43]/50" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#2B2B24]/50">
                    Préparation
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#2B2B24]/70">
                    {r.steps}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner title="Fais tes propres recettes" />
    </div>
  )
}
