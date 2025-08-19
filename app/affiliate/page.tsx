"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Copy, Users, TrendingUp, MousePointer, UserCheck, Euro, Trophy, Crown, Award } from "lucide-react"

// Mock data
const affiliateStats = {
  rank: "Silber",
  progress: 65,
  currentXP: 6500,
  nextLevelXP: 10000,
  referralLink: "https://buildro.ai/ref/12345",
  monthlyEarnings: 245.5,
  totalEarnings: 1847.25,
  clicks: 1234,
  leads: 89,
  conversions: 23,
}

const referrals = [
  { id: 1, name: "Max Mustermann", email: "m***@example.com", date: "2024-01-15", status: "Aktiv", commission: 25.0 },
  { id: 2, name: "Anna Schmidt", email: "a***@example.com", date: "2024-01-12", status: "Pending", commission: 0.0 },
  { id: 3, name: "Tom Weber", email: "t***@example.com", date: "2024-01-10", status: "Aktiv", commission: 50.0 },
  { id: 4, name: "Lisa Müller", email: "l***@example.com", date: "2024-01-08", status: "Aktiv", commission: 35.0 },
  { id: 5, name: "Peter Klein", email: "p***@example.com", date: "2024-01-05", status: "Inaktiv", commission: 15.0 },
]

const topReferrals = [
  { name: "Max Mustermann", earnings: 125.5, badge: "Gold" },
  { name: "Lisa Müller", earnings: 89.25, badge: "Silber" },
  { name: "Tom Weber", earnings: 67.75, badge: "Bronze" },
]

export default function AffiliatePage() {
  const [sortBy, setSortBy] = useState("date")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const copyReferralLink = () => {
    navigator.clipboard.writeText(affiliateStats.referralLink)
    toast({
      title: "Link kopiert!",
      description: "Dein Referral-Link wurde in die Zwischenablage kopiert.",
    })
  }

  const requestPayout = async () => {
    // Mock API call
    toast({
      title: "Auszahlung angefordert",
      description: "Deine Auszahlungsanfrage wird bearbeitet. Du erhältst eine E-Mail-Bestätigung.",
    })
  }

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "Gold":
        return <Crown className="h-5 w-5 text-yellow-500" />
      case "Silber":
        return <Award className="h-5 w-5 text-gray-400" />
      case "Bronze":
        return <Trophy className="h-5 w-5 text-orange-500" />
      default:
        return <Users className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Aktiv: "default",
      Pending: "secondary",
      Inaktiv: "outline",
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>
  }

  const filteredReferrals = referrals.filter(
    (referral) => filterStatus === "all" || referral.status.toLowerCase() === filterStatus,
  )

  const sortedReferrals = [...filteredReferrals].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "commission":
        return b.commission - a.commission
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      default:
        return 0
    }
  })

  const paginatedReferrals = sortedReferrals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(sortedReferrals.length / itemsPerPage)

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-3xl font-bold">Affiliate Program</h1>
        <p className="text-muted-foreground">Verdiene Provisionen durch das Teilen unseres Produkts</p>
      </div>

      <div className="space-y-6">
        {/* Affiliate Status Card */}
        <Card className="card-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getRankIcon(affiliateStats.rank)}
              Affiliate Status - {affiliateStats.rank}
            </CardTitle>
            <CardDescription>Dein aktueller Rang und Fortschritt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{affiliateStats.currentXP} XP</span>
                <span>{affiliateStats.nextLevelXP} XP</span>
              </div>
              <Progress value={affiliateStats.progress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Noch {affiliateStats.nextLevelXP - affiliateStats.currentXP} XP bis zum nächsten Level
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Referral Link Box */}
        <Card className="card-container">
          <CardHeader>
            <CardTitle>Dein Referral-Link</CardTitle>
            <CardDescription>Teile diesen Link, um Provisionen zu verdienen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={affiliateStats.referralLink} readOnly className="font-mono text-sm" />
              <Button onClick={copyReferralLink} size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-container">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Einnahmen (Monat)</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{affiliateStats.monthlyEarnings}</div>
              <p className="text-xs text-muted-foreground">+12% vom Vormonat</p>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Einnahmen (Gesamt)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{affiliateStats.totalEarnings}</div>
              <p className="text-xs text-muted-foreground">Seit Programmstart</p>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Klicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliateStats.clicks}</div>
              <p className="text-xs text-muted-foreground">{affiliateStats.leads} Leads generiert</p>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliateStats.conversions}</div>
              <p className="text-xs text-muted-foreground">
                {((affiliateStats.conversions / affiliateStats.leads) * 100).toFixed(1)}% Conversion Rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Referrals Section */}
        <Card className="card-container">
          <CardHeader>
            <CardTitle>Top Referrals</CardTitle>
            <CardDescription>Deine erfolgreichsten Empfehlungen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topReferrals.map((referral, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">#{index + 1}</span>
                      {getRankIcon(referral.badge)}
                    </div>
                    <span className="font-medium">{referral.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">€{referral.earnings}</div>
                    <Badge variant="outline" className="text-xs">
                      {referral.badge}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referrals Table */}
        <Card className="card-container">
          <CardHeader>
            <CardTitle>Deine Referrals</CardTitle>
            <CardDescription>Übersicht aller geworbenen Nutzer</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-4 mb-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sortieren nach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Datum</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="commission">Provision</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="aktiv">Aktiv</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inaktiv">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name/Email</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Provision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{referral.name}</div>
                        <div className="text-sm text-muted-foreground">{referral.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(referral.date).toLocaleDateString("de-DE")}</TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                    <TableCell className="text-right font-medium">€{referral.commission.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Zurück
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Seite {currentPage} von {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Weiter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payout Area */}
        <Card className="card-container">
          <CardHeader>
            <CardTitle>Auszahlung</CardTitle>
            <CardDescription>Fordere deine verdienten Provisionen an</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Verfügbarer Betrag für Auszahlung:</p>
              <p className="text-2xl font-bold">€{affiliateStats.totalEarnings}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Auszahlung ab €50 möglich</p>
              <Button
                onClick={requestPayout}
                disabled={affiliateStats.totalEarnings < 50}
                className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 hover:from-purple-600 hover:via-blue-600 hover:to-green-600"
              >
                Jetzt Auszahlung anfordern
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Legal Notice */}
        <Card className="card-container border-muted">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">DSGVO & EU AI Act Hinweis:</p>
              <p>
                Das Tracking erfolgt anonymisiert und DSGVO-konform. Benutzer können jederzeit ein Opt-out durchführen.
                Alle Daten werden gemäß den EU-Datenschutzbestimmungen und dem AI Act verarbeitet.
              </p>
              <div className="flex gap-4 mt-3">
                <Button variant="link" size="sm" className="h-auto p-0">
                  Datenschutzerklärung
                </Button>
                <Button variant="link" size="sm" className="h-auto p-0">
                  AGB Affiliate Program
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
