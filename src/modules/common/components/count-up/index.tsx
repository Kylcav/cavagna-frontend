"use client"

import { useEffect, useRef, useState } from "react"

type CountUpProps = {
  to: number
  suffix?: string
  prefix?: string
  duration?: number // ms
}

/**
 * Compteur animé : monte de 0 à `to` (easeOutCubic) quand l'élément entre dans
 * le viewport. Respecte prefers-reduced-motion (affiche directement la valeur).
 */
const CountUp = ({ to, suffix = "", prefix = "", duration = 1500 }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVal(to)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - p, 3)
            setVal(Math.round(eased * to))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          obs.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [to, duration])

  return (
    <span ref={ref}>
      {prefix}
      {val}
      {suffix}
    </span>
  )
}

export default CountUp
