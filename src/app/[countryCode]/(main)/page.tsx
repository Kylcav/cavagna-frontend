"use client"

import { useEffect, useRef, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const boxes = [
  { title: "Fontaines", href: "/store", image: "/favicon.ico" },
  { title: "Filtres", href: "/store", image: "/favicon.ico" },
  { title: "Accessoires", href: "/store", image: "/favicon.ico" },
]

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const vh = window.innerHeight

      if (y < vh * 0.25) setStep(0)
      else if (y < vh * 0.7) setStep(1)
      else setStep(2)

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
      <section className="relative h-[260vh]">
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

          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <div className="grid w-full max-w-[1260px] gap-4 md:grid-cols-3">
              {boxes.map((box, index) => (
                <LocalizedClientLink
                  key={box.title}
                  href={box.href}
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
                    style={{ backgroundImage: `url(${box.image})` }}
                  >
                    <div className="flex h-full items-end justify-center bg-black/30 p-6 text-center">
                      <h2 className="text-3xl font-bold md:text-4xl">
                        {box.title}
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