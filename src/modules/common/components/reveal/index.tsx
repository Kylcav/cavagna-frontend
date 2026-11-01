"use client"

import { useEffect, useRef, useState } from "react"

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** délai d'apparition en ms (pour échelonner) */
  delay?: number
  /** translation de départ : "up" (défaut), "left", "right" */
  from?: "up" | "left" | "right"
}

/**
 * Apparition au scroll façon PunCube : opacity 0 + léger décalage → visible
 * quand l'élément entre dans le viewport (IntersectionObserver, une seule fois).
 */
const Reveal = ({ children, className, delay = 0, from = "up" }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Respecte prefers-reduced-motion
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hidden =
    from === "left"
      ? "-translate-x-10 opacity-0"
      : from === "right"
      ? "translate-x-10 opacity-0"
      : "translate-y-10 opacity-0"

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[800ms] ease-out ${
        visible ? "translate-x-0 translate-y-0 opacity-100" : hidden
      } ${className || ""}`}
    >
      {children}
    </div>
  )
}

export default Reveal
