"use client"

import type { ReactNode } from "react"
import { RouteGuard } from "./route-guard"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <RouteGuard requireAuth={true}>{children}</RouteGuard>
}
