import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, Users, Zap, Shield } from "lucide-react"

export default function AngebotPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto section-spacing content-padding">
        <BackButton />

        <div className="text-center content-spacing">
          <h1 className="text-4xl font-bold text-gradient-accent mb-4">Individuelles Angebot anfordern</h1>
          <p className="text-xl text-muted-foreground">
            Lassen Sie uns gemeinsam die perfekte KI-Lösung für Ihr Unternehmen entwickeln
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="card-container">
              <CardHeader>
                <CardTitle>Ihre Anfrage</CardTitle>
                <CardDescription>
                  Teilen Sie uns Ihre Anforderungen mit und wir erstellen ein maßgeschneidertes Angebot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Vorname *</Label>
                    <Input id="firstName" placeholder="Max" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nachname *</Label>
                    <Input id="lastName" placeholder="Mustermann" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input id="email" type="email" placeholder="max@unternehmen.de" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" type="tel" placeholder="+49 123 456789" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Unternehmen *</Label>
                  <Input id="company" placeholder="Ihr Unternehmen GmbH" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Branche</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Branche auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technologie</SelectItem>
                        <SelectItem value="finance">Finanzwesen</SelectItem>
                        <SelectItem value="healthcare">Gesundheitswesen</SelectItem>
                        <SelectItem value="retail">Einzelhandel</SelectItem>
                        <SelectItem value="manufacturing">Produktion</SelectItem>
                        <SelectItem value="consulting">Beratung</SelectItem>
                        <SelectItem value="other">Sonstiges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees">Mitarbeiteranzahl</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Anzahl auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-1000">201-1000</SelectItem>
                        <SelectItem value="1000+">1000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="useCase">Anwendungsfall *</Label>
                  <Textarea
                    id="useCase"
                    placeholder="Beschreiben Sie, welche Prozesse Sie automatisieren möchten und welche Ziele Sie verfolgen..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Spezielle Anforderungen</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Haben Sie besondere technische Anforderungen, Integrationen oder Compliance-Vorgaben?"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Budget-Bereich auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-1000">Unter 1.000€/Monat</SelectItem>
                      <SelectItem value="1000-5000">1.000€ - 5.000€/Monat</SelectItem>
                      <SelectItem value="5000-10000">5.000€ - 10.000€/Monat</SelectItem>
                      <SelectItem value="10000-25000">10.000€ - 25.000€/Monat</SelectItem>
                      <SelectItem value="over-25000">Über 25.000€/Monat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Gewünschter Projektstart</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Zeitrahmen auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">So schnell wie möglich</SelectItem>
                      <SelectItem value="1-month">In 1 Monat</SelectItem>
                      <SelectItem value="3-months">In 3 Monaten</SelectItem>
                      <SelectItem value="6-months">In 6 Monaten</SelectItem>
                      <SelectItem value="flexible">Flexibel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" />
                  <Label htmlFor="newsletter" className="text-sm">
                    Ich möchte Updates über neue Features und KI-Trends erhalten
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="privacy" required />
                  <Label htmlFor="privacy" className="text-sm">
                    Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                    <a href="/datenschutz" className="text-primary hover:underline">
                      Datenschutzerklärung
                    </a>{" "}
                    zu *
                  </Label>
                </div>

                <Button className="w-full bg-gradient-accent hover:bg-gradient-accent/90 text-white shadow-glow">
                  Angebot anfordern
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="card-container">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Enterprise Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>DSGVO-konforme Datenverarbeitung</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span>Unbegrenzte API-Aufrufe</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>Dedizierter Account Manager</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-green-500" />
                  <span>On-Premise Deployment möglich</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-container">
              <CardHeader>
                <CardTitle>Nächste Schritte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                    1
                  </div>
                  <span>Wir analysieren Ihre Anforderungen</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                    2
                  </div>
                  <span>Erststellung eines maßgeschneiderten Angebots</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                    3
                  </div>
                  <span>Persönliches Beratungsgespräch</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                    4
                  </div>
                  <span>Projektstart nach Ihrer Freigabe</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-container bg-muted/30">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Antwortzeit:</strong> Wir melden uns innerhalb von 24 Stunden bei Ihnen zurück.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
