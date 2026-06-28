"use client"

import { useEffect, useRef, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const savoirFaireBlocks = [
  {
    title: "Une sélection rigoureuse des plus belles matières",
    text: "Chaque création naît d'une exigence absolue : celle de ne retenir que les matières les plus nobles. Nos tissus sont soigneusement sélectionnés auprès de fabricants italiens reconnus pour leur excellence et leur maîtrise du textile haut de gamme. Leur douceur, leur résistance, leur tenue impeccable et leur confort offrent à chaque maillot de bain une qualité durable, pensée pour traverser les saisons sans jamais perdre de son élégance.",
  },
  {
    title: "Un bijou façonné à la main en Suisse",
    text: "La signature de nos créations réside dans leur pièce en or massif, entièrement réalisée à la main en Suisse. Chaque élément est fondu, travaillé et poli avec le plus grand soin par un maître artisan, avant d'être marqué de son poinçon, garantissant l'authenticité de l'or massif. Cette pièce n'est pas un simple détail décoratif : elle constitue l'âme de nos créations. Elle transforme chaque maillot de bain en une véritable pièce de joaillerie, où le savoir-faire artisanal rencontre l'univers du luxe.",
  },
  {
    title: "Une confection suisse d'une précision irréprochable",
    text: "Une fois les matières sélectionnées et les éléments précieux réalisés, chaque maillot de bain est confié à une couturière expérimentée en Suisse. Chaque couture, chaque finition et chaque assemblage sont exécutés avec une précision minutieuse afin d'assurer un tombé parfait, un confort exceptionnel et une qualité irréprochable. Cette confection locale nous permet de maîtriser chaque étape de fabrication et de garantir un niveau d'excellence jusque dans les moindres détails.",
  },
  {
    title: "L'excellence à chaque étape",
    text: "De la sélection des tissus italiens à la création artisanale de notre pièce en or massif, jusqu'à la confection finale en Suisse, chaque étape est réalisée avec le même niveau d'exigence. Cette approche entièrement maîtrisée donne naissance à des maillots de bain d'exception, conçus comme de véritables bijoux à porter : des créations rares, intemporelles et pensées pour sublimer celles qui les portent.",
  },
]

export default function NotreSavoirFairePage() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)")

    const updateDevice = () => {
      setIsMobile(mediaQuery.matches)
    }

    updateDevice()
    mediaQuery.addEventListener("change", updateDevice)

    return () => {
      mediaQuery.removeEventListener("change", updateDevice)
    }
  }, [])

  useEffect(() => {
    if (isMobile === null) return

    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const scrollDistance = Math.max(0, -rect.top)

      if (isMobile) {
        const vh = window.innerHeight

        if (scrollDistance < vh * 0.25) setActiveIndex(0)
        else if (scrollDistance < vh * 1.1) setActiveIndex(1)
        else if (scrollDistance < vh * 1.9) setActiveIndex(2)
        else setActiveIndex(3)

        return
      }

      const step = window.innerHeight * 0.85

      const newIndex = Math.min(
        savoirFaireBlocks.length - 1,
        Math.floor(scrollDistance / step)
      )

      setActiveIndex(newIndex)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isMobile])

  return (
    <div className="py-6">
      <div className="content-container mb-10 overflow-x-auto">
        <nav className="flex w-max min-w-full items-center justify-center gap-10 border-b border-black/10 pb-4">
          <LocalizedClientLink
            href="/categories/maillots-de-bain-femme"
            className="group relative whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-[#8a6f55] transition-all duration-300 hover:text-[#b08a68]"
          >
            MAILLOTS DE BAIN FEMME
            <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#b08a68] transition-all duration-300 group-hover:w-full" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/categories/maillots-de-bain-homme"
            className="group relative whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-[#8a6f55] transition-all duration-300 hover:text-[#b08a68]"
          >
            MAILLOTS DE BAIN HOMME
            <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#b08a68] transition-all duration-300 group-hover:w-full" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/categories/accessoires"
            className="group relative whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-[#8a6f55] transition-all duration-300 hover:text-[#b08a68]"
          >
            ACCESSOIRES
            <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-[#b08a68] transition-all duration-300 group-hover:w-full" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/notre-savoir-faire"
            className="group relative whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-[#b08a68]"
          >
            NOTRE SAVOIR-FAIRE
            <span className="absolute -bottom-2 left-1/2 h-px w-full -translate-x-1/2 bg-[#b08a68]" />
          </LocalizedClientLink>
        </nav>
      </div>

      {isMobile === false && (
        <section ref={sectionRef} className="relative h-[360vh]">
          <div className="sticky top-[130px] mx-auto grid h-[calc(100vh-150px)] max-w-[1320px] grid-cols-1 items-center gap-14 lg:grid-cols-[560px_1fr]">
            <div className="flex h-full items-start justify-end pt-2">
              <img
                src="/notre-savoir-faire.png"
                alt="Maillot de bain CAVAGNA"
                className="h-auto max-h-[72vh] w-auto max-w-[560px] rounded-sm object-contain shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
              />
            </div>

            <div className="relative flex h-full items-center justify-start pl-2">
              {savoirFaireBlocks.map((block, index) => (
                <article
                  key={block.title}
                  className={`absolute max-w-[600px] text-left transition-all duration-700 ease-out ${
                    activeIndex === index
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-8 opacity-0"
                  }`}
                >
                  <h2 className="text-[56px] font-semibold leading-[1.05] tracking-tight text-[#2f2a25]">
                    {block.title}
                  </h2>

                  <p className="mt-8 text-justify text-[17px] leading-[2.05] text-[#5f5a55]">
                    {block.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {isMobile === true && (
        <section ref={sectionRef} className="relative h-[360vh]">
          <div className="sticky top-0 h-screen overflow-hidden bg-white">
            <div className="relative flex h-full flex-col px-6 pt-[92px]">
              <div className="shrink-0 px-2">
                <img
                  src="/notre-savoir-faire.png"
                  alt="Maillot de bain CAVAGNA"
                  className="mx-auto h-auto max-h-[31vh] w-auto max-w-full rounded-sm object-contain shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                />
              </div>

              <div className="relative mt-8 flex-1 overflow-hidden">
                {savoirFaireBlocks.map((block, index) => (
                  <article
                    key={block.title}
                    className={`absolute inset-x-0 top-0 transition-all duration-700 ease-out ${
                      activeIndex === index
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-40 opacity-0"
                    }`}
                  >
                    <h2 className="text-[18px] font-semibold leading-[1.18] tracking-tight text-[#2f2a25]">
                      {block.title}
                    </h2>

                    <p className="mt-5 text-justify text-[14px] leading-[1.45] text-[#5f5a55]">
                      {block.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}