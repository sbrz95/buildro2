"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, ArrowLeft, Receipt, Star } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const agentId = searchParams.get("agent_id")

  const [purchaseData, setPurchaseData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPurchaseData = async () => {
      if (!sessionId || !agentId) return

      try {
        const response = await fetch(`/api/stripe/checkout-session/${sessionId}`)
        const data = await response.json()
        setPurchaseData(data)
      } catch (error) {
        console.error("Error fetching purchase data:", error)
        toast({
          title: "Fehler beim Laden",
          description: "Kaufdaten konnten nicht geladen werden.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseData()
  }, [sessionId, agentId])

  const handleDownload = async () => {
    if (!purchaseData?.agent) return

    // Mock download process
    toast({
      title: "Download gestartet",
      description: `${purchaseData.agent.title} wird heruntergeladen...`,
    })

    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download abgeschlossen",
        description: "Der Agent wurde erfolgreich heruntergeladen.",
      })
    }, 2000)
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-accent"></div>
        </div>
      </div>
    )
  }

  if (!purchaseData) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Kauf nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">Die Kaufdaten konnten nicht gefunden werden.</p>
          <Link href="/marketplace">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zum Marketplace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Kauf erfolgreich!</h1>
          <p className="text-muted-foreground">Vielen Dank für deinen Kauf. Du kannst den Agent jetzt herunterladen.</p>
        </div>

        {/* Purchase Details */}
        <Card className="card-container mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Kaufdetails
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                Bezahlt
              </Badge>
            </CardTitle>
            <CardDescription>Bestellung #{purchaseData.session.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <img
                  src={purchaseData.agent.image || "/placeholder.svg"}
                  alt={purchaseData.agent.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{purchaseData.agent.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{purchaseData.agent.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{purchaseData.agent.rating}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {purchaseData.agent.category}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">€{purchaseData.agent.price}</div>
                <div className="text-xs text-muted-foreground">inkl. MwSt.</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Gesamtbetrag:</span>
                <span className="text-lg font-bold">€{purchaseData.agent.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Zahlungsmethode:</span>
                <span>Kreditkarte (****1234)</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Kaufdatum:</span>
                <span>{new Date().toLocaleDateString("de-DE")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card className="card-container mb-6">
          <CardHeader>
            <CardTitle>Agent herunterladen</CardTitle>
            <CardDescription>Lade deinen gekauften Agent herunter und beginne mit der Nutzung.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-gradient-accent text-white hover:bg-gradient-accent/90 shadow-glow"
              >
                <Download className="h-4 w-4 mr-2" />
                Agent herunterladen
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Receipt className="h-4 w-4 mr-2" />
                Rechnung herunterladen
              </Button>
            </div>

            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Nächste Schritte:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Lade den Agent über den Button oben herunter</li>
                <li>• Folge der Installationsanleitung in der Dokumentation</li>
                <li>• Bei Fragen wende dich an: {purchaseData.agent.supportEmail}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/marketplace" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zum Marketplace
            </Button>
          </Link>
          <Link href="/marketplace/purchases" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Meine Käufe anzeigen
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
