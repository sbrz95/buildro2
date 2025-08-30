"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CreditCard, Shield, Trash2, Moon, Sun, User, Crown, Download, Edit } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
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

interface UserProfile {
  id: string
  email: string
  full_name: string
  subscription_plan: string
  subscription_status: string
  created_at: string
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState("")
  const [dataLogging, setDataLogging] = useState(true)
  const [analyticsConsent, setAnalyticsConsent] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const data = await response.json()
          setProfile(data.profile)
          setFullName(data.profile.full_name || "")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleUpdateProfile = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/privacy/export", {
        method: "POST",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `buildro-data-export-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/privacy/delete-account", {
        method: "DELETE",
      })

      if (response.ok) {
        logout()
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Error deleting account:", error)
    }
  }

  const userStats = {
    level: 3,
    xp: 2450,
    xpToNext: 3000,
    rank: "Agent Builder",
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Einstellungen</h1>
          <p className="text-muted-foreground">Lade Profil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Einstellungen</h1>
          <p className="text-muted-foreground">Profil konnte nicht geladen werden</p>
        </div>
      </div>
    )
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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profil & Rang</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)} className="hover-scale">
                <Edit className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  {profile.full_name
                    ? profile.full_name.charAt(0).toUpperCase()
                    : profile.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-2">
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Vollständiger Name"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleUpdateProfile}>
                        Speichern
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{profile.full_name || "Kein Name"}</h3>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <Badge variant="secondary" className="bg-gradient-accent text-white">
                        Level {userStats.level} - {userStats.rank}
                      </Badge>
                    </div>
                  </>
                )}
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
                  <Badge className="bg-gradient-accent text-white capitalize">{profile.subscription_plan}</Badge>
                  <span className="text-sm text-muted-foreground">
                    (
                    {profile.subscription_plan === "starter"
                      ? "139€/Monat"
                      : profile.subscription_plan === "pro"
                        ? "69€/Monat"
                        : "Individuell"}
                    )
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <p
                  className={`text-sm ${profile.subscription_status === "active" ? "text-green-600" : "text-red-600"}`}
                >
                  {profile.subscription_status === "active" ? "Aktiv" : "Inaktiv"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Mitglied seit</h4>
                <p className="text-sm text-muted-foreground">{new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/billing" className="flex-1">
                <Button className="w-full">Abrechnung verwalten</Button>
              </Link>
              <Link href="/subscribe" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Plan ändern
                </Button>
              </Link>
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
                  Gemäß DSGVO haben Sie das Recht auf Portabilität und Löschung Ihrer personenbezogenen Daten.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={handleExportData} className="flex-1 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Daten exportieren
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Account löschen
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <span>Account unwiderruflich löschen?</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten, einschließlich Agenten,
                          Demos, Bulk-Tests und Einstellungen, werden permanent gelöscht.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                          Account löschen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
