"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowLeft, CreditCard, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

const subscriptionPlans = [
  {
    id: "starter",
    name: "Starter Plan",
    price: 139,
    currency: "EUR",
    interval: "month",
    description: "Für Einsteiger und kleine Projekte",
    features: [
      "Unterstützt bis zu 1 Kunden",
      "Unbegrenzte KI-Bauten",
      "Erweiterte Prompt-Tests",
      "E-Mail Support",
      "Basis Analytics",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Für AI Experten",
    price: 69,
    originalPrice: 279,
    currency: "EUR",
    interval: "month",
    description: "Für professionelle AI-Entwickler",
    features: [
      "Unterstützt unbegrenzt viele Kunden",
      "Unbegrenzte KI-Bauten",
      "Erweiterte Prompt-Tests",
      "Priority Support",
      "Erweiterte Analytics",
      "API Zugang",
      "White-Label Option",
    ],
    popular: true,
    discount: "75% Rabatt",
  },
  {
    id: "custom",
    name: "Custom Plan",
    price: null,
    currency: "EUR",
    interval: "custom",
    description: "Für Unternehmen mit besonderen Anforderungen",
    features: [
      "Unbegrenzte Anpassungen",
      "Unterstützt beliebig viele Kunden",
      "Zugang zu exklusiven Funktionen",
      "Dedizierter Support",
      "Skalierbarkeit für wachsende Unternehmen",
      "On-Premise Deployment",
      "SLA Garantie",
    ],
    popular: false,
  },
]

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async (planId: string) => {
    if (planId === "custom") {
      router.push("/support?inquiry=custom-plan")
      return
    }

    setIsLoading(true)
    setSelectedPlan(planId)

    try {
      const plan = subscriptionPlans.find((p) => p.id === planId)
      if (!plan) throw new Error("Plan not found")

      const response = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          price: plan.price,
          currency: plan.currency,
          interval: plan.interval,
        }),
      })

      const { sessionId, checkoutUrl } = await response.json()

      if (checkoutUrl) {
        toast({
          title: "Weiterleitung zu Stripe...",
          description: "Du wirst zur sicheren Zahlungsseite weitergeleitet.",
        })

        setTimeout(() => {
          window.location.href = checkoutUrl
        }, 1500)
      }
    } catch (error) {
      toast({
        title: "Fehler beim Checkout",
        description: "Es gab einen Fehler beim Starten des Abonnements. Bitte versuche es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setSelectedPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Wähle deinen Plan</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Starte deine KI-Agent-Reise mit dem Plan, der perfekt zu deinen Bedürfnissen passt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`card-container relative ${
                  plan.popular ? "border-2 border-gradient-accent shadow-glow" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-accent text-white px-4 py-1 shadow-glow">Meist gewählt</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-2">
                    {plan.price ? (
                      <div className="flex items-center justify-center gap-2">
                        {plan.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">€{plan.originalPrice}</div>
                        )}
                        <div className="text-4xl font-bold">
                          €{plan.price}
                          <span className="text-lg font-normal text-muted-foreground">/{plan.interval}</span>
                        </div>
                        {plan.discount && (
                          <Badge variant="destructive" className="text-xs">
                            {plan.discount}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="text-4xl font-bold">Auf Anfrage</div>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading && selectedPlan === plan.id}
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-accent hover:bg-gradient-accent/90 text-white shadow-glow"
                        : "bg-transparent"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {isLoading && selectedPlan === plan.id ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Wird geladen...
                      </div>
                    ) : plan.id === "custom" ? (
                      "Kontakt aufnehmen"
                    ) : (
                      "Jetzt starten"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="card-container text-center">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Sicher & DSGVO-konform</h3>
                <p className="text-sm text-muted-foreground">
                  Alle Daten werden verschlüsselt und DSGVO-konform in Deutschland gespeichert.
                </p>
              </CardContent>
            </Card>

            <Card className="card-container text-center">
              <CardContent className="pt-6">
                <CreditCard className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Flexible Zahlungen</h3>
                <p className="text-sm text-muted-foreground">
                  Sichere Zahlungen über Stripe. Jederzeit kündbar, keine versteckten Kosten.
                </p>
              </CardContent>
            </Card>

            <Card className="card-container text-center">
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Sofort einsatzbereit</h3>
                <p className="text-sm text-muted-foreground">
                  Nach der Anmeldung kannst du sofort mit der Erstellung deiner KI-Agenten beginnen.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Fragen zu den Plänen? Unser Support-Team hilft gerne weiter.
            </p>
            <Link href="/support">
              <Button variant="outline" className="bg-transparent">
                Support kontaktieren
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
