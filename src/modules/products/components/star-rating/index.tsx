type StarRatingProps = {
  value: number // 0..5
  size?: number
  className?: string
}

/** Étoiles pleines / demi / vides (SVG), couleur ambre façon e-commerce. */
const StarRating = ({ value, size = 16, className }: StarRatingProps) => {
  const stars = [0, 1, 2, 3, 4].map((i) => {
    const fill = Math.max(0, Math.min(1, value - i)) // 0, .5-ish, 1
    return fill >= 0.75 ? "full" : fill >= 0.25 ? "half" : "empty"
  })

  return (
    <div className={`flex items-center gap-0.5 ${className || ""}`} aria-hidden>
      {stars.map((s, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill="none"
        >
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="#f5a623" />
              <stop offset="50%" stopColor="#e5e5e5" />
            </linearGradient>
          </defs>
          <path
            d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.95 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z"
            fill={
              s === "full"
                ? "#f5a623"
                : s === "half"
                ? `url(#half-${i})`
                : "#e5e5e5"
            }
          />
        </svg>
      ))}
    </div>
  )
}

export default StarRating
