"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

interface BillingData {
  subscription: {
    plan: string
    status: string
    current_period_start: string
    current_period_end: string
    cancel_at_period_end: boolean
    price: number
    currency: string
  }
  usage: {
    agents_created: number
    agents_limit: number
    bulk_tests_run: number
    bulk_tests_limit: number
    demos_created: number
    demos_limit: number
  }
  invoices: Array<{
    id: string
    amount: number
    currency: string
    status: string
    created: string
    invoice_pdf: string
  }>
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [canceling, setCanceling] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fetchBillingData = async () => {
      if (!user) return

      try {
        const response = await fetch("/api/user/billing")
        if (response.ok) {
          const data = await response.json()
          setBillingData(data)
        }
      } catch (error) {
        console.error("Error fetching billing data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBillingData()
  }, [user])

  const handleCancelSubscription = async () => {
    setCanceling(true)
    try {
      const response = await fetch("/api/user/subscription/cancel", {
        method: "POST",
      })

      if (response.ok) {
        // Refresh billing data
        const billingResponse = await fetch("/api/user/billing")
        if (billingResponse.ok) {
          const data = await billingResponse.json()
          setBillingData(data)
        }
      }
    } catch (error) {
      console.error("Error canceling subscription:", error)
    } finally {
      setCanceling(false)
    }
  }

  const handleReactivateSubscription = async () => {
    try {
      const response = await fetch("/api/user/subscription/reactivate", {
        method: "POST",
      })

      if (response.ok) {
        // Refresh billing data
        const billingResponse = await fetch("/api/user/billing")
        if (billingResponse.ok) {
          const data = await billingResponse.json()
          setBillingData(data)
        }
      }
    } catch (error) {
      console.error("Error reactivating subscription:", error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Abrechnung & Abonnement</h1>
          <p className="text-muted-foreground">Lade Abrechnungsdaten...</p>
        </div>
      </div>
    )
  }

  if (!billingData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Abrechnung & Abonnement</h1>
          <p className="text-muted-foreground">Abrechnungsdaten konnten nicht geladen werden</p>
        </div>
      </div>
    )
  }

  const { subscription, usage, invoices } = billingData

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Abrechnung & Abonnement</h1>
        <p className="text-muted-foreground">Verwalte dein Abonnement und deine Abrechnungen</p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Aktuelles Abonnement</span>
            </div>
            <Badge
              variant={subscription.status === "active" ? "default" : "secondary"}
              className={subscription.status === "active" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {subscription.status === "active" ? "Aktiv" : "Inaktiv"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Plan</h4>
              <p className="text-lg font-semibold capitalize">{subscription.plan}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Preis</h4>
              <p className="text-lg font-semibold">€{subscription.price}/Monat</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Nächste Abrechnung</h4>
              <p className="text-lg font-semibold">
                {new Date(subscription.current_period_end).toLocaleDateString("de-DE")}
              </p>
            </div>
          </div>

          {subscription.cancel_at_period_end && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Abonnement wird gekündigt
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Dein Abonnement läuft am {new Date(subscription.current_period_end).toLocaleDateString("de-DE")}{" "}
                    aus. Du kannst es jederzeit reaktivieren.
                  </p>
                  <Button
                    onClick={handleReactivateSubscription}
                    size="sm"
                    className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Abonnement reaktivieren
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/subscribe" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Plan ändern
              </Button>
            </Link>

            {!subscription.cancel_at_period_end && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    Abonnement kündigen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Abonnement kündigen?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Dein Abonnement wird am Ende der aktuellen Abrechnungsperiode gekündigt. Du behältst Zugang zu
                      allen Features bis zum {new Date(subscription.current_period_end).toLocaleDateString("de-DE")}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelSubscription}
                      disabled={canceling}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {canceling ? "Kündige..." : "Kündigen"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Nutzungsübersicht</CardTitle>
          <CardDescription>Deine aktuelle Nutzung in diesem Abrechnungszeitraum</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Erstellte Agenten</span>
                <span>
                  {usage.agents_created} / {usage.agents_limit === -1 ? "Unbegrenzt" : usage.agents_limit}
                </span>
              </div>
              <Progress
                value={usage.agents_limit === -1 ? 0 : (usage.agents_created / usage.agents_limit) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Bulk Tests durchgeführt</span>
                <span>
                  {usage.bulk_tests_run} / {usage.bulk_tests_limit === -1 ? "Unbegrenzt" : usage.bulk_tests_limit}
                </span>
              </div>
              <Progress
                value={usage.bulk_tests_limit === -1 ? 0 : (usage.bulk_tests_run / usage.bulk_tests_limit) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Demos erstellt</span>
                <span>
                  {usage.demos_created} / {usage.demos_limit === -1 ? "Unbegrenzt" : usage.demos_limit}
                </span>
              </div>
              <Progress
                value={usage.demos_limit === -1 ? 0 : (usage.demos_created / usage.demos_limit) * 100}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Abrechnungshistorie</span>
            </div>
            <Button variant="ghost" size="sm" className="hover-scale">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>Deine letzten Rechnungen und Zahlungen</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      {invoice.status === "paid" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">€{invoice.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.created).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={invoice.status === "paid" ? "default" : "destructive"}>
                      {invoice.status === "paid" ? "Bezahlt" : "Ausstehend"}
                    </Badge>
                    {invoice.invoice_pdf && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Noch keine Rechnungen vorhanden</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
