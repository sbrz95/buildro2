"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CreditCard, Shield, Trash2, Moon, Sun, User, Crown } from "lucide-react"
import { useTheme } from "next-themes"
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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [dataLogging, setDataLogging] = useState(true)
  const [analyticsConsent, setAnalyticsConsent] = useState(false)

  const userStats = {
    level: 3,
    xp: 2450,
    xpToNext: 3000,
    rank: "Agent Builder",
  }

  const subscription = {
    plan: "Pro",
    status: "Aktiv",
    nextBilling: "15. Januar 2025",
    price: "29€/Monat",
  }

  const handleDeleteData = () => {
    // Handle data deletion
    console.log("Initiating data deletion process...")
  }

  const handleManageSubscription = () => {
    // Redirect to billing portal
    window.open("https://billing.buildro.ai", "_blank")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Einstellungen</h1>
        <p className="text-muted-foreground">Verwalte dein Konto und deine Präferenzen</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile & Rank */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profil & Rang</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Max Mustermann</h3>
                <p className="text-muted-foreground">max@example.com</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <Badge variant="secondary" className="bg-gradient-accent text-white">
                    Level {userStats.level} - {userStats.rank}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fortschritt zu Level {userStats.level + 1}</span>
                <span>
                  {userStats.xp} / {userStats.xpToNext} XP
                </span>
              </div>
              <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Noch {userStats.xpToNext - userStats.xp} XP bis zum nächsten Level
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Moon className="h-5 w-5" />
              <span>Darstellung</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle" className="flex items-center space-x-2">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Dark Mode</span>
              </Label>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Abonnement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Aktueller Plan</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-gradient-accent text-white">{subscription.plan}</Badge>
                  <span className="text-sm text-muted-foreground">({subscription.price})</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <p className="text-sm text-green-600">{subscription.status}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Nächste Abrechnung</h4>
                <p className="text-sm text-muted-foreground">{subscription.nextBilling}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Button onClick={handleManageSubscription} className="w-full">
                Abo & Abrechnung verwalten
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & GDPR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Datenschutz & DSGVO</span>
          </CardTitle>
          <CardDescription>Verwalte deine Datenschutz-Einstellungen und Einverständniserklärungen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="data-logging">Datenprotokollierung für Agent-Training</Label>
                <p className="text-sm text-muted-foreground">
                  Erlaube die Speicherung von Gesprächen zur Verbesserung der KI-Agenten
                </p>
              </div>
              <Switch id="data-logging" checked={dataLogging} onCheckedChange={setDataLogging} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="analytics-consent">Analytics & Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Erlaube die Verwendung von Cookies für Analyse und Verbesserung der Plattform
                </p>
              </div>
              <Switch id="analytics-consent" checked={analyticsConsent} onCheckedChange={setAnalyticsConsent} />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Datenrechte</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Gemäß DSGVO haben Sie das Recht auf Löschung Ihrer personenbezogenen Daten.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full md:w-auto">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Meine Daten löschen
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <span>Daten unwiderruflich löschen?</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten, einschließlich Agenten,
                        Gespräche und Einstellungen, werden permanent gelöscht.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteData} className="bg-red-600 hover:bg-red-700">
                        Daten löschen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EU AI Act Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>EU AI Act Konformität</CardTitle>
          <CardDescription>Transparenz und Erklärbarkeit von KI-Systemen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Modell-Transparenz</h4>
            <p className="text-sm text-muted-foreground">
              Alle verwendeten KI-Modelle werden in der Benutzeroberfläche mit Anbieter und Modellname angezeigt. Dies
              gewährleistet Transparenz über die verwendeten KI-Systeme.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Erklärbarkeit</h4>
            <p className="text-sm text-muted-foreground">
              In Demo-Interfaces ist ein "Wie funktioniert dieser Agent?" Button verfügbar, der die Funktionsweise des
              KI-Agenten erklärt.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
