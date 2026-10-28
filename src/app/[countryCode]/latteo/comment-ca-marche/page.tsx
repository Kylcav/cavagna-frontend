import { Metadata } from "next"
import { CtaBanner, PageHeader } from "@modules/latteo/components/shared"

export const metadata: Metadata = {
  title: "Comment ça marche | Lattéo",
  description:
    "Du lait végétal frais en 4 étapes avec Lattéo : ajoute tes ingrédients, verse de l'eau, lance, savoure. La machine chauffe et mixe toute seule en 60 secondes.",
}

const STEPS = [
  {
    n: "1",
    title: "Ajoute tes ingrédients",
    text: "Verse amandes, flocons d'avoine, noisettes, graines ou soja dans le panier-filtre. Pas besoin de les faire tremper des heures : une poignée suffit pour un pichet entier.",
  },
  {
    n: "2",
    title: "Verse de l'eau",
    text: "Remplis le pichet d'eau jusqu'au repère, referme le couvercle et choisis ton programme. Plus ou moins d'eau = lait plus ou moins crémeux, à ton goût.",
  },
  {
    n: "3",
    title: "Lance et laisse faire",
    text: "Appuie sur Start. La machine chauffe puis mixe automatiquement. En environ 60 secondes de mixage, ton lait est prêt — frais et tiède.",
  },
  {
    n: "4",
    title: "Savoure, puis recycle",
    text: "Sers ton lait tout de suite ou laisse-le refroidir. La pulpe restée dans le filtre ? Garde-la pour un porridge, des cookies ou un gommage maison.",
  },
]

export default function CommentCaMarchePage() {
  return (
    <div className="bg-[#F6F2E9] text-[#2B2B24]">
      <PageHeader
        eyebrow="Mode d'emploi"
        title="Comment ça marche"
        subtitle="Du lait végétal frais en 4 étapes, sans effort et sans vaisselle qui déborde."
      />

      {/* Étapes */}
      <section className="content-container py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-[2rem] border border-[#2B2B24]/8 bg-white shadow-sm">
            <img
              src="/latteo/hero-lifestyle.jpg"
              alt="Verre de lait végétal frais préparé avec Lattéo"
              className="h-full w-full object-cover"
              width={600}
              height={700}
            />
          </div>
          <div className="flex flex-col justify-center gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-5">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#4F5D43] text-base font-bold text-white">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-[#2B2B24]/65">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ce dont tu as besoin */}
      <section className="bg-[#FDFBF6]">
        <div className="content-container py-16 sm:py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Tout ce qu'il te faut
          </h2>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              { t: "Des ingrédients bruts", d: "Amandes, avoine, noisettes, soja, graines… en vrac ou en paquet." },
              { t: "De l'eau", d: "Du robinet, c'est parfait. Tu contrôles la quantité." },
              { t: "60 secondes", d: "Le temps que la machine chauffe et mixe pour toi." },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-2xl border border-[#2B2B24]/8 bg-white p-6 text-center"
              >
                <div className="text-base font-semibold">{c.t}</div>
                <p className="mt-2 text-sm text-[#2B2B24]/60">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[#2B2B24]/55">
            Astuce : ajoute une datte, une pincée de vanille ou de cannelle
            directement dans le pichet pour un lait naturellement sucré et
            parfumé.
          </p>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
