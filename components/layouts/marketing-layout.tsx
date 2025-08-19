"use client"

import type React from "react"
import { LandingPageHeader } from "@/components/landing-page-header"
import { Footer } from "@/components/layout/footer"

interface MarketingLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export function MarketingLayout({ children, showHeader = true, showFooter = true }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <LandingPageHeader />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
