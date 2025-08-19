"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Download, Receipt, Search, Calendar, DollarSign, Package, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface Purchase {
  id: string
  agentId: string
  agentTitle: string
  agentImage: string
  price: number
  purchaseDate: string
  status: "completed" | "pending" | "failed"
  downloadUrl: string
  receiptUrl: string
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch("/api/marketplace/purchases")
        const data = await response.json()
        setPurchases(data.purchases || [])
      } catch (error) {
        console.error("Error fetching purchases:", error)
        toast({
          title: "Fehler beim Laden",
          description: "Käufe konnten nicht geladen werden.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  const filteredPurchases = purchases.filter((purchase) =>
    purchase.agentTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDownload = async (purchase: Purchase) => {
    toast({
      title: "Download gestartet",
      description: `${purchase.agentTitle} wird heruntergeladen...`,
    })

    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download abgeschlossen",
        description: "Der Agent wurde erfolgreich heruntergeladen.",
      })
    }, 2000)
  }

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price, 0)

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-accent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meine Käufe</h1>
            <p className="text-muted-foreground mt-2">Verwalte deine gekauften Agenten und lade sie erneut herunter</p>
          </div>
          <Link href="/marketplace">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zum Marketplace
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-container">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gekaufte Agenten</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases.length}</div>
              <p className="text-xs text-muted-foreground">Insgesamt erworben</p>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamtausgaben</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Alle Käufe zusammen</p>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Letzter Kauf</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases.length > 0 ? "Heute" : "Nie"}</div>
              <p className="text-xs text-muted-foreground">
                {purchases.length > 0
                  ? new Date(purchases[0].purchaseDate).toLocaleDateString("de-DE")
                  : "Noch keine Käufe"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Käufe durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Purchases List */}
      {filteredPurchases.length > 0 ? (
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => (
            <Card key={purchase.id} className="card-container">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={purchase.agentImage || "/placeholder.svg"}
                      alt={purchase.agentTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{purchase.agentTitle}</h3>
                      <Badge
                        variant={purchase.status === "completed" ? "default" : "secondary"}
                        className={
                          purchase.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : ""
                        }
                      >
                        {purchase.status === "completed" ? "Abgeschlossen" : "Ausstehend"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Gekauft am {new Date(purchase.purchaseDate).toLocaleDateString("de-DE")}</span>
                      <span className="font-medium text-foreground">€{purchase.price}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleDownload(purchase)}
                        className="bg-gradient-accent text-white hover:bg-gradient-accent/90"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Herunterladen
                      </Button>
                      <Button variant="outline">
                        <Receipt className="h-4 w-4 mr-2" />
                        Rechnung
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{searchQuery ? "Keine Käufe gefunden" : "Noch keine Käufe"}</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Versuche einen anderen Suchbegriff."
              : "Entdecke Agenten im Marketplace und tätige deinen ersten Kauf."}
          </p>
          <Link href="/marketplace">
            <Button className="bg-gradient-accent text-white hover:bg-gradient-accent/90 shadow-glow">
              Marketplace erkunden
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
