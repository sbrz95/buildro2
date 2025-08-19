"use client"

import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export function LandingPageHeader() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur-sm opacity-80">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-glow">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">buildro.ai</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
          <button
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Funktionen
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Preise
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Kontakt
          </button>
          <a href="/public-marketplace" className="text-sm font-medium hover:text-primary transition-colors">
            Marketplace
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/login">
            <Button className="bg-gradient-accent text-white hover:opacity-90 transition-opacity">Login</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
