import Link from "next/link"
import { Shield, Scale } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">© 2024 buildro.ai - KI-Agenten für Unternehmen</div>
          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/datenschutz"
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>Datenschutz</span>
            </Link>
            <Link
              href="/ai-act"
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Scale className="h-4 w-4" />
              <span>EU AI Act Info</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
