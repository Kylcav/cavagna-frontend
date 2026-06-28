"use client"

import { useEffect, useRef, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type Props = {
  categories: HttpTypes.StoreProductCategory[]
}

export default function HomeCategories({ categories }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const vh = window.innerHeight
      const isMobile = window.innerWidth < 768

      if (isMobile) {
        if (y < vh * 0.25) setStep(0)
        else if (y < vh * 1.1) setStep(1)
        else if (y < vh * 1.9) setStep(2)
        else setStep(3)
      } else {
        if (y < vh * 0.25) setStep(0)
        else if (y < vh * 0.7) setStep(1)
        else setStep(2)
      }

      if (y > vh * 0.25) {
        videoRef.current?.pause()
      } else {
        videoRef.current?.play()
      }
    }

    window.addEventListener("scroll", onScroll)
    onScroll()

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <main className="bg-black text-white">
      <section className="relative h-[360vh] md:h-[260vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/accueil-tel.mov" type="video/quicktime" media="(max-width: 767px)" />
            <source src="/accueil-site.mov" type="video/quicktime" media="(min-width: 768px)" />
          </video>

          <div
            className={`absolute inset-0 bg-black/55 backdrop-blur-md transition-opacity duration-700 ${
              step >= 1 ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* MOBILE uniquement */}
          <div className="relative z-10 flex h-full items-center justify-center px-6 md:hidden">
            {categories.map((category, index) => (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className={`group absolute aspect-[4/5] w-[calc(100vw-48px)] max-w-[420px] overflow-hidden rounded-xl shadow-2xl transition-all duration-700 ${
                  step === index + 1
                    ? "translate-y-0 opacity-100"
                    : "translate-y-40 opacity-0 pointer-events-none"
                }`}
              >
                <div
                  className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${
                      category.products?.[0]?.thumbnail || "/placeholder.jpg"
                    })`,
                  }}
                >
                  <div className="flex h-full items-end justify-center bg-black/30 p-6 text-center">
                    <h2 className="text-3xl font-bold">{category.name}</h2>
                  </div>
                </div>
              </LocalizedClientLink>
            ))}
          </div>

          {/* DESKTOP intact */}
          <div className="relative z-10 hidden h-full items-center justify-center px-6 md:flex">
            <div className="grid w-full max-w-[1260px] gap-4 md:grid-cols-3">
              {categories.map((category, index) => (
                <LocalizedClientLink
                  key={category.id}
                  href={`/categories/${category.handle}`}
                  className={`group aspect-[9/16] overflow-hidden rounded-xl shadow-2xl transition-all duration-700 md:aspect-[4/5] ${
                    step >= 2
                      ? "translate-y-0 opacity-100"
                      : "translate-y-40 opacity-0"
                  }`}
                  style={{
                    transitionDelay: step >= 2 ? `${index * 220}ms` : "0ms",
                  }}
                >
                  <div
                    className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${
                        category.products?.[0]?.thumbnail || "/placeholder.jpg"
                      })`,
                    }}
                  >
                    <div className="flex h-full items-end justify-center bg-black/30 p-6 text-center">
                      <h2 className="text-3xl font-bold md:text-4xl">
                        {category.name}
                      </h2>
                    </div>
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}