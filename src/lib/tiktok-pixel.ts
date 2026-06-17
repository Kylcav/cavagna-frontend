type TikTokEvent =
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "CompletePayment"

export const ttqPage = () => {
  if (typeof window === "undefined") return
  if (!(window as any).ttq) return

  ;(window as any).ttq.page()
}

export const ttqTrack = (
  event: TikTokEvent,
  data?: Record<string, any>,
  options?: Record<string, any>
) => {
  if (typeof window === "undefined") return
  if (!(window as any).ttq) return

  ;(window as any).ttq.track(event, data, options)
}