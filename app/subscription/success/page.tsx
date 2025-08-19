"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, CreditCard, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { updateUser } = useAuth()
  const sessionId = searchParams.get("session_id")
  const planId = searchParams.get("plan_id")

  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const processSubscription = async () => {
      if (!sessionId || !planId) return

      try {
        // Mock subscription processing
        const mockSubscription = {
          id: sessionId,
          planId: planId,
          planName: planId === "starter" ? "Starter Plan" : "Für AI Experten",
          price: planId === "starter" ? 139 : 69,
          currency: "EUR",
          interval: "month",
          status: "active",
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          customer: {
            email: "user@example.com",
            name: "Max Mustermann",
          },
        }

        setSubscriptionData(mockSubscription)

        // Update user plan in auth context
        updateUser({
          plan: planId as "starter" | "pro" | "custom",
        })

        toast({
          title: "Abonnement aktiviert!",
          description: `Willkommen beim ${mockSubscription.planName}. Du kannst jetzt alle Features nutzen.`,
        })
      } catch (error) {
        console.error("Error processing subscription:", error)
        toast({
          title: "Fehler beim Aktivieren",
          description: "Es gab einen Fehler beim Aktivieren deines Abonnements.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    processSubscription()
  }, [sessionId, planId, updateUser])

  const handleContinue = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Abonnement wird aktiviert...</p>
        </div>
      </div>
    )
  }

  if (!subscriptionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Abonnement nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">Die Abonnement-Daten konnten nicht gefunden werden.</p>
          <Button onClick={() => router.push("/subscribe")}>Zurück zur Auswahl</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Abonnement erfolgreich aktiviert!</h1>
            <p className="text-muted-foreground">
              Willkommen bei buildro.ai! Dein Abonnement ist jetzt aktiv und du kannst alle Features nutzen.
            </p>
          </div>

          {/* Subscription Details */}
          <Card className="card-container mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Abonnement Details
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Aktiv</Badge>
              </CardTitle>
              <CardDescription>Abonnement #{subscriptionData.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Plan</h4>
                  <p className="font-semibold">{subscriptionData.planName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Preis</h4>
                  <p className="font-semibold">
                    €{subscriptionData.price}/{subscriptionData.interval}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                  <p className="font-semibold text-green-600">Aktiv</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Nächste Abrechnung</h4>
                  <p className="font-semibold">
                    {new Date(subscriptionData.currentPeriodEnd).toLocaleDateString("de-DE")}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Zahlungsmethode: Kreditkarte (****1234)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Aktiviert am: {new Date(subscriptionData.currentPeriodStart).toLocaleDateString("de-DE")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="card-container mb-6">
            <CardHeader>
              <CardTitle>Nächste Schritte</CardTitle>
              <CardDescription>So kannst du jetzt mit buildro.ai durchstarten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Erstelle deinen ersten KI-Agenten</h4>
                    <p className="text-sm text-muted-foreground">
                      Nutze unseren Build-Wizard, um in wenigen Minuten deinen ersten Agenten zu erstellen.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Teste und optimiere</h4>
                    <p className="text-sm text-muted-foreground">
                      Verwende den Bulk Tester und AI Mentor, um deine Agenten zu perfektionieren.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Deploye und verkaufe</h4>
                    <p className="text-sm text-muted-foreground">
                      Nutze Launch für das Deployment und den Marketplace für den Verkauf deiner Agenten.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="text-center">
            <Button
              onClick={handleContinue}
              className="bg-gradient-accent hover:bg-gradient-accent/90 text-white shadow-glow px-8 py-3"
              size="lg"
            >
              Zum Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
