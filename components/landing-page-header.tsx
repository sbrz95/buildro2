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
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl border-border/50">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-glow hover-glow transition-all duration-300">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">buildro.ai</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
          <button
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium hover:text-primary transition-all duration-300 hover-glow px-3 py-2 rounded-lg"
          >
            Funktionen
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-sm font-medium hover:text-primary transition-all duration-300 hover-glow px-3 py-2 rounded-lg"
          >
            Preise
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-sm font-medium hover:text-primary transition-all duration-300 hover-glow px-3 py-2 rounded-lg"
          >
            Kontakt
          </button>
          <a
            href="/public-marketplace"
            className="text-sm font-medium hover:text-primary transition-all duration-300 hover-glow px-3 py-2 rounded-lg"
          >
            Marketplace
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/login">
            <Button className="bg-gradient-accent text-white hover:opacity-90 transition-all duration-300 shadow-glow hover-glow">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
