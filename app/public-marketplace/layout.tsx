import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "KI-Agenten Marketplace | buildro.ai",
  description:
    "Entdecke und kaufe professionelle KI-Agenten für dein Business. Sofort einsatzbereit und vollständig konfiguriert.",
}

export default function PublicMarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
