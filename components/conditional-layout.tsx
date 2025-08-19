"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import { MarketingLayout } from "@/components/layouts/marketing-layout"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { AuthLayout } from "@/components/layouts/auth-layout"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

// Define which routes should use which layout
const authRoutes = ["/login", "/register"]
const publicRoutes = ["/", "/about", "/impressum", "/datenschutz", "/ai-act", "/public-marketplace"]
const publicRoutesWithoutHeader = ["/d"] // Public demo viewer

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { isLoggedIn, isLoading } = useAuth()
  const pathname = usePathname()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-accent"></div>
      </div>
    )
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    return <AuthLayout>{children}</AuthLayout>
  }

  if (!isLoggedIn) {
    const isPublicRouteWithoutHeader = publicRoutesWithoutHeader.some((route) => pathname.startsWith(route))
    return (
      <MarketingLayout showHeader={!isPublicRouteWithoutHeader} showFooter={!isPublicRouteWithoutHeader}>
        {children}
      </MarketingLayout>
    )
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
