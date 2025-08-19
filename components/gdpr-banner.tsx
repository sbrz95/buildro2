"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Cookie, Shield } from "lucide-react"

export function GDPRBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasConsented = localStorage.getItem("gdpr-consent")
    if (!hasConsented) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("gdpr-consent", "accepted")
    localStorage.setItem("gdpr-consent-date", new Date().toISOString())
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("gdpr-consent", "declined")
    localStorage.setItem("gdpr-consent-date", new Date().toISOString())
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto shadow-lg border-2">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Cookie className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Datenschutz & Cookies</span>
                </h3>
                <Button variant="ghost" size="icon" onClick={handleDecline} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Wir verwenden Cookies und ähnliche Technologien, um Ihre Erfahrung zu verbessern und unsere Dienste zu
                optimieren. Für KI-Agent-Training können Gespräche protokolliert werden. Sie können Ihre Einstellungen
                jederzeit in den Datenschutz-Einstellungen ändern.
              </p>
              <div className="flex space-x-3">
                <Button onClick={handleAccept} className="bg-gradient-accent hover:bg-gradient-accent/90 text-white">
                  Alle akzeptieren
                </Button>
                <Button variant="outline" onClick={handleDecline} className="bg-transparent">
                  Nur notwendige
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
