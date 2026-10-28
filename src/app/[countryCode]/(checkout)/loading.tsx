export default function CheckoutLoading() {
  return (
    <div className="content-container grid grid-cols-1 gap-x-40 py-12 small:grid-cols-[1fr_416px]">
      {/* Colonne gauche : formulaire d'adresse */}
      <div className="animate-pulse" aria-hidden>
        <div className="mb-6 h-8 w-56 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-11 w-full rounded-lg bg-gray-100" />
          ))}
        </div>
        <div className="mt-6 h-11 w-full rounded-lg bg-gray-100" />
        <div className="mt-8 h-12 w-64 rounded-full bg-gray-200" />
      </div>

      {/* Colonne droite : récapitulatif */}
      <div className="mt-10 animate-pulse small:mt-0" aria-hidden>
        <div className="mb-5 h-7 w-40 rounded bg-gray-200" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-5/6 rounded bg-gray-100" />
          <div className="h-px w-full bg-gray-100" />
          <div className="h-6 w-full rounded bg-gray-100" />
        </div>
        <div className="mt-6 flex gap-3">
          <div className="h-20 w-20 rounded-lg bg-gray-100" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-3/4 rounded bg-gray-100" />
            <div className="h-4 w-1/2 rounded bg-gray-100" />
          </div>
        </div>
      </div>

      <p className="sr-only">Préparation de votre commande…</p>
    </div>
  )
}
