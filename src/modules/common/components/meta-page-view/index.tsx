"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { fbq } from "@lib/meta-pixel"
import { ttqPage } from "@lib/tiktok-pixel"

export default function MetaPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    fbq("PageView")
    ttqPage()
  }, [pathname, searchParams])

  return null
}