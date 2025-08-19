"use client"

import type React from "react"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Footer } from "@/components/layout/footer"

interface DashboardLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  showHeader?: boolean
  showFooter?: boolean
}

export function DashboardLayout({
  children,
  showSidebar = true,
  showHeader = true,
  showFooter = true,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      {showSidebar && <CollapsibleSidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showHeader && <DashboardHeader />}
        <main className="flex-1 overflow-auto page-container">{children}</main>
        {showFooter && <Footer />}
      </div>
    </div>
  )
}
