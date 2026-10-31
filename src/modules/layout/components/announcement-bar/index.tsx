/** Bandeau d'annonce fin en haut du site (façon e-commerce premium). */
const AnnouncementBar = () => {
  const items = [
    "Anti-RFID garanti",
    "Satisfait ou remboursé",
    "Paiement 100% sécurisé",
    "Livraison rapide",
  ]
  return (
    <div className="w-full bg-[#171412] text-white">
      <div className="content-container flex items-center justify-center gap-6 py-2 text-[12px] tracking-wide">
        {items.map((t, i) => (
          <span
            key={i}
            className={i > 1 ? "hidden sm:inline" : "inline"}
          >
            {i === 0 ? "✓ " : "· "}
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default AnnouncementBar
