import { Metadata } from "next"
import { CtaBanner, PageHeader } from "@modules/latteo/components/shared"

export const metadata: Metadata = {
  title: "Notre histoire | Lattéo",
  description:
    "Lattéo est née d'une envie simple : préparer soi-même un lait végétal frais, sans additifs et sans gaspillage. L'histoire de la famille Cavagna.",
}

const VALUES = [
  {
    title: "La simplicité",
    text: "Des ingrédients bruts, de l'eau, un bouton. On a conçu Lattéo pour que le fait-maison soit enfin plus simple que d'acheter une brique.",
  },
  {
    title: "La transparence",
    text: "Tu vois exactement ce que tu mets dans ton verre. Pas d'additifs, pas de conservateurs, pas de listes d'ingrédients incompréhensibles.",
  },
  {
    title: "Moins de déchets",
    text: "Fini les emballages à usage unique qui s'accumulent. Tu achètes en vrac, tu bois frais, tu jettes beaucoup moins.",
  },
  {
    title: "Le goût, le vrai",
    text: "Un lait végétal fraîchement préparé n'a rien à voir avec celui du commerce. Plus de goût, plus de crémeux, à ton réglage.",
  },
]

export default function AProposPage() {
  return (
    <div className="bg-[#F6F2E9] text-[#2B2B24]">
      <PageHeader
        eyebrow="Qui sommes-nous"
        title="Une histoire de famille"
        subtitle="Lattéo n'est pas née dans un laboratoire, mais dans une cuisine."
      />

      {/* Récit */}
      <section className="content-container py-16 sm:py-24">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl space-y-5 text-[#2B2B24]/75">
            <p>
              Nous sommes <strong className="text-[#2B2B24]">Clara et Louis
              Cavagna</strong>, un couple comme tant d'autres qui, il y a quelques
              années, a voulu manger plus végétal et plus sain.
            </p>
            <p>
              Très vite, on s'est heurtés à un mur. Les laits végétaux du commerce
              étaient <strong className="text-[#2B2B24]">chers</strong>, souvent
              remplis d'<strong className="text-[#2B2B24]">additifs douteux</strong>,
              et vendus dans des montagnes d'emballages qu'on jetait aussitôt. Les
              faire nous-mêmes ? Ça voulait dire tremper, mixer, filtrer à la main,
              et nettoyer une cuisine entière à chaque fois.
            </p>
            <p>
              On s'est dit qu'il devait exister une meilleure façon. Une façon
              <strong className="text-[#2B2B24]"> simple</strong>, où l'on contrôle
              ce qu'on boit, sans y passer sa matinée et sans culpabiliser pour la
              planète.
            </p>
            <p>
              C'est comme ça qu'est né <strong className="text-[#4F5D43]">Lattéo
              </strong> : une machine qui prépare un lait végétal frais en 60
              secondes, à partir d'ingrédients que <em>tu</em> choisis. Pas
              d'additifs, moins de déchets, et beaucoup plus de liberté dans ton
              verre.
            </p>
            <p>
              Aujourd'hui, Lattéo, c'est notre façon de rendre le fait-maison
              accessible à tout le monde. Et ça commence peut-être dans ta cuisine.
            </p>
            <div className="pt-2 text-sm font-semibold text-[#4F5D43]">
              Clara &amp; Louis — fondateurs de Lattéo
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[#2B2B24]/8 bg-white shadow-sm lg:w-[360px]">
            <img
              src="/latteo/founders.jpg"
              alt="Préparation du lait végétal maison avec Lattéo"
              className="h-full w-full object-cover"
              width={360}
              height={440}
            />
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-[#FDFBF6]">
        <div className="content-container py-16 sm:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Ce en quoi on croit
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-[#2B2B24]/8 bg-white p-7"
              >
                <h3 className="text-lg font-semibold text-[#4F5D43]">{v.title}</h3>
                <p className="mt-2 text-[#2B2B24]/65">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner title="Rejoins l'aventure Lattéo" />
    </div>
  )
}
