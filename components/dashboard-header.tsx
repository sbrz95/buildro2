"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm opacity-80">
      <div className="flex h-16 items-center justify-end px-6">
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
