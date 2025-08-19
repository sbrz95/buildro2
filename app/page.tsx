"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Hammer, Play, TestTube, Rocket, Bot, Zap, Check } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

function DashboardHome() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center section-spacing">
        <div className="content-spacing">
          <h1 className="text-4xl font-bold text-gradient-accent">Willkommen bei buildro.ai</h1>
          <p className="text-xl text-muted-foreground">Erstelle, teste, optimiere und deploye eigene KI-Agenten</p>
        </div>

        <div className="content-spacing">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/build">
              <Card className="hover-scale cursor-pointer group card-container">
                <CardHeader className="text-center p-0">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all">
                    <Hammer className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="mb-2">Build</CardTitle>
                  <CardDescription>Erstelle neue KI-Agenten</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/demo">
              <Card className="hover-scale cursor-pointer group card-container">
                <CardHeader className="text-center p-0">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="mb-2">Demo</CardTitle>
                  <CardDescription>Teste deine Agenten</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/bulk-tester">
              <Card className="hover-scale cursor-pointer group card-container">
                <CardHeader className="text-center p-0">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all">
                    <TestTube className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="mb-2">Bulk Tester</CardTitle>
                  <CardDescription>Massentests durchführen</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/launch">
              <Card className="hover-scale cursor-pointer group card-container">
                <CardHeader className="text-center p-0">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="mb-2">Launch</CardTitle>
                  <CardDescription>Agenten deployen</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

          <div className="bg-card card-container border shadow-sm">
            <div className="text-center content-spacing">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Schnellstart</h2>
                <p className="text-muted-foreground">
                  Beginne mit der Erstellung deines ersten KI-Agenten in wenigen Minuten
                </p>
              </div>
              <Link href="/build">
                <Button className="bg-gradient-accent hover:bg-gradient-accent/90 text-white">
                  Ersten Agenten erstellen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MarketingFooter() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-glow">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">buildro.ai</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Die führende No-Code-Plattform für die Erstellung, das Testen und den Einsatz intelligenter KI-Agenten.
            </p>
            <p className="text-sm text-muted-foreground">© 2024 buildro.ai. Alle Rechte vorbehalten.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Produkt</h3>
            <div className="space-y-2">
              <Link
                href="/public-marketplace"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Marketplace
              </Link>
              <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">
                Funktionen
              </a>
              <a href="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
                Preise
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Rechtliches</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                Über uns
              </Link>
              <Link href="/impressum" className="block text-muted-foreground hover:text-foreground transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="block text-muted-foreground hover:text-foreground transition-colors">
                Datenschutz
              </Link>
              <Link href="/ai-act" className="block text-muted-foreground hover:text-foreground transition-colors">
                EU AI Act
              </Link>
              <Link href="/support" className="block text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
              <Link href="/support" className="block text-muted-foreground hover:text-foreground transition-colors">
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function MarketingLanding() {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing")
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto text-center section-spacing pt-16">
        <div className="content-spacing">
          <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Erstelle und verkaufe <span className="text-gradient-accent">KI-Agenten</span>
            <br />
            ohne Code
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Automatisiere Prozesse und baue leistungsstarke Agenten ohne technische Kenntnisse. buildro.ai ist die
            führende No-Code-Plattform für intelligente KI-Automatisierung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-accent hover:bg-gradient-accent/90 text-white px-8 py-3 text-lg shadow-glow"
              onClick={scrollToPricing}
            >
              Jetzt starten
            </Button>
            <Link href="/public-marketplace">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg bg-transparent">
                Marketplace erkunden
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div id="features" className="max-w-7xl mx-auto section-spacing py-24">
        <div className="text-center content-spacing">
          <h2 className="text-3xl font-bold mb-4">Funktionen, die dich begeistern!</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Von der Erstellung bis zum Deployment – alles in einer Plattform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="card-container text-center">
            <CardHeader className="p-0">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Hammer className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="mb-2">No-Code Editor</CardTitle>
              <CardDescription>
                Baue Agenten ohne Programmierkenntnisse mit unserer intuitiven Drag & Drop Oberfläche
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-container text-center">
            <CardHeader className="p-0">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="mb-2">Automatisierung</CardTitle>
              <CardDescription>
                Automatisiere Prozesse mit intelligenten Agenten und spare Zeit und Ressourcen
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-container text-center">
            <CardHeader className="p-0">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="mb-2">Verkaufsplattform</CardTitle>
              <CardDescription>
                Verkaufe deine Agenten über unseren integrierten Marketplace an andere Nutzer
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-container text-center">
            <CardHeader className="p-0">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <TestTube className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="mb-2">API-Integration</CardTitle>
              <CardDescription>Nutze unsere API für tiefere Integration in deine bestehenden Systeme</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div id="pricing" className="max-w-7xl mx-auto section-spacing py-24">
        <div className="text-center content-spacing">
          <h2 className="text-3xl font-bold mb-4">Preise für jedes Budget</h2>
          <p className="text-xl text-muted-foreground mb-12">Wähle den Plan, der zu deinem Business passt</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="card-container">
            <CardHeader className="text-center p-0 pb-6">
              <CardTitle className="text-2xl mb-2">Starter Plan</CardTitle>
              <div className="text-4xl font-bold mb-2">
                €139<span className="text-lg font-normal text-muted-foreground">/Monat</span>
              </div>
              <CardDescription>Für Einsteiger und kleine Projekte</CardDescription>
            </CardHeader>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unterstützt bis zu 1 Kunden</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unbegrenzte KI-Bauten</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Erweiterte Prompt-Tests</span>
              </div>
            </div>
            <Link href="/subscribe">
              <Button className="w-full bg-transparent" variant="outline">
                Jetzt starten
              </Button>
            </Link>
          </Card>

          <Card className="card-container border-2 border-gradient-accent relative shadow-glow">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-accent text-white px-4 py-1 rounded-full text-sm font-medium shadow-glow">
                Meist gewählt
              </div>
            </div>
            <CardHeader className="text-center p-0 pb-6">
              <CardTitle className="text-2xl mb-2">Für AI Experten</CardTitle>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-4xl font-bold">
                  €69<span className="text-lg font-normal text-muted-foreground">/Monat</span>
                </div>
                <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">75% Rabatt</div>
              </div>
              <div className="text-sm text-muted-foreground line-through mb-2">Regulär: €279/Monat</div>
              <CardDescription>Für professionelle AI-Entwickler</CardDescription>
            </CardHeader>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unterstützt unbegrenzt viele Kunden</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unbegrenzte KI-Bauten</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Erweiterte Prompt-Tests</span>
              </div>
            </div>
            <Link href="/subscribe">
              <Button className="w-full bg-gradient-accent hover:bg-gradient-accent/90 text-white shadow-glow">
                Jetzt starten
              </Button>
            </Link>
          </Card>

          <Card className="card-container">
            <CardHeader className="text-center p-0 pb-6">
              <CardTitle className="text-2xl mb-2">Custom Plan</CardTitle>
              <div className="text-4xl font-bold mb-2">
                Auf Anfrage<span className="text-lg font-normal text-muted-foreground"></span>
              </div>
              <CardDescription>Für Unternehmen mit besonderen Anforderungen</CardDescription>
            </CardHeader>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unbegrenzte Anpassungen</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unterstützt beliebig viele Kunden</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Zugang zu exklusiven Funktionen</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Dedizierter Support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Skalierbarkeit für wachsende Unternehmen</span>
              </div>
            </div>
            <Link href="/angebot">
              <Button className="w-full bg-transparent" variant="outline">
                Kontakt aufnehmen
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center section-spacing py-24">
        <div className="bg-gradient-accent rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Bereit für intelligente Automatisierung?</h2>
          <p className="text-xl mb-8 opacity-90">
            Starte noch heute und erstelle deinen ersten KI-Agenten in unter 5 Minuten.
          </p>
          <Link href="/subscribe">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-glow"
            >
              Jetzt starten
            </Button>
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}

export default function HomePage() {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-accent"></div>
      </div>
    )
  }

  return isLoggedIn ? <DashboardHome /> : <MarketingLanding />
}
