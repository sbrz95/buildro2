"use client"

import type React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen">{children}</main>
    </div>
  )
}
