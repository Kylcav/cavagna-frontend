import LocalizedClientLink from "@modules/common/components/localized-client-link"

/** En-tête de page de contenu Lattéo (eyebrow + titre + sous-titre). */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <section className="border-b border-[#2B2B24]/8 bg-[#EFE9DC]">
      <div className="content-container py-14 text-center sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4F5D43]">
          {eyebrow}
        </span>
        <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-xl text-lg text-[#2B2B24]/65">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

/** Bouton CTA (renvoie vers l'offre sur la home). */
export function LatteoCTA({
  children = "Commander Lattéo",
  className = "",
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <LocalizedClientLink
      href="/latteo#acheter"
      className={`inline-flex items-center justify-center rounded-full bg-[#4F5D43] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#4F5D43]/20 transition-all hover:bg-[#3D4834] hover:shadow-xl ${className}`}
    >
      {children}
    </LocalizedClientLink>
  )
}

/** Bandeau CTA de fin de page. */
export function CtaBanner({
  title = "Prêt à faire ton lait maison ?",
  text = "Sans additifs, moins de déchets, plus d'économies. Livraison offerte.",
}: {
  title?: string
  text?: string
}) {
  return (
    <section className="bg-[#4F5D43] text-white">
      <div className="content-container py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">{text}</p>
        <div className="mt-8 flex justify-center">
          <LocalizedClientLink
            href="/latteo#acheter"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-[#4F5D43] shadow-lg transition-all hover:brightness-95"
          >
            Commander Lattéo
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
