"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface RouteGuardProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function RouteGuard({ children, requireAuth = false, redirectTo = "/login" }: RouteGuardProps) {
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && requireAuth && !isLoggedIn) {
      // Store the attempted URL for redirect after login
      sessionStorage.setItem("redirectAfterLogin", pathname)
      router.push(redirectTo)
    }
  }, [isLoggedIn, isLoading, requireAuth, router, redirectTo, pathname])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-accent"></div>
      </div>
    )
  }

  // If authentication is required but user is not logged in, don't render children
  if (requireAuth && !isLoggedIn) {
    return null
  }

  return <>{children}</>
}
