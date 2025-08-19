"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/ui/back-button"
import { Bot, Users, Target, Zap, Award, Heart, Linkedin, Twitter, Github } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <BackButton />

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-glow">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Über buildro.ai</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Wir revolutionieren die Art, wie Unternehmen KI-Agenten erstellen, testen und deployen. Unsere Mission ist
            es, KI-Technologie für jeden zugänglich und nutzbar zu machen.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="card-container">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Unsere Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Wir demokratisieren KI-Technologie, indem wir intuitive Tools bereitstellen, die es jedem ermöglichen,
                leistungsstarke KI-Agenten ohne technische Hürden zu erstellen. Unser Ziel ist es, die Lücke zwischen
                komplexer KI-Technologie und praktischer Anwendung zu schließen.
              </p>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Unsere Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Eine Welt, in der jedes Unternehmen - unabhängig von Größe oder technischer Expertise - die Kraft der KI
                nutzen kann, um Prozesse zu automatisieren, Kunden besser zu bedienen und innovative Lösungen zu
                entwickeln.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Unsere Werte</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Benutzerfreundlichkeit</h3>
              <p className="text-muted-foreground">
                Komplexe KI-Technologie einfach und intuitiv gestalten, damit sich jeder darauf konzentrieren kann, was
                wirklich wichtig ist: großartige Lösungen zu schaffen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Qualität</h3>
              <p className="text-muted-foreground">
                Wir setzen auf höchste Standards in Entwicklung, Sicherheit und Performance, um unseren Kunden
                zuverlässige und robuste Lösungen zu bieten.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                Wir bleiben an der Spitze der KI-Entwicklung und bringen kontinuierlich neue Features und
                Verbesserungen, um unseren Nutzern immer die besten Tools zu bieten.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Unser Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-container text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">NR</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Nick Reichardt</h3>
                <Badge variant="secondary" className="mb-3">
                  Gründer & Geschäftsführer
                </Badge>
                <p className="text-muted-foreground text-sm mb-4">
                  Visionär und Unternehmer mit Leidenschaft für KI-Technologie. Gründer von Fercon und buildro.ai.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button variant="ghost" size="sm">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-container text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SM</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sarah Müller</h3>
                <Badge variant="secondary" className="mb-3">
                  CTO
                </Badge>
                <p className="text-muted-foreground text-sm mb-4">
                  Expertin für skalierbare KI-Systeme und Cloud-Architekturen. Ex-Amazon Web Services.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button variant="ghost" size="sm">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-container text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">DW</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">David Weber</h3>
                <Badge variant="secondary" className="mb-3">
                  Head of Product
                </Badge>
                <p className="text-muted-foreground text-sm mb-4">
                  UX/UI-Spezialist mit Fokus auf benutzerfreundliche KI-Interfaces. Vorher bei SAP.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button variant="ghost" size="sm">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">buildro.ai in Zahlen</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Erstellte KI-Agenten</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Aktive Unternehmen</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Bereit, mit uns zu arbeiten?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entdecken Sie, wie buildro.ai Ihr Unternehmen mit intelligenten KI-Agenten transformieren kann. Starten Sie
            noch heute Ihre KI-Reise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-accent hover:bg-gradient-accent/90 text-white shadow-glow">
              Jetzt starten
            </Button>
            <Button variant="outline" size="lg">
              Kontakt aufnehmen
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
