export default function CheckoutLoading() {
  return (
    <div className="content-container flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
      <span
        className="h-10 w-10 animate-spin rounded-full border-[3px] border-gray-200 border-t-gray-900"
        aria-hidden
      />
      <div>
        <p className="text-base font-semibold text-gray-900">
          Préparation de votre commande…
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Un instant, nous sécurisons votre paiement.
        </p>
      </div>
    </div>
  )
}
