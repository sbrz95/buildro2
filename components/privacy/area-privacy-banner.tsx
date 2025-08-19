"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Shield, AlertTriangle } from "lucide-react"

interface AreaPrivacyBannerProps {
  area: string
  title: string
}

export function AreaPrivacyBanner({ area, title }: AreaPrivacyBannerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenBanner = localStorage.getItem(`privacy-banner-${area}`)
    const isLoggedIn = localStorage.getItem("user-logged-in") // Mock login check

    if (!hasSeenBanner && isLoggedIn) {
      setIsVisible(true)
    }
  }, [area])

  const handleAccept = () => {
    localStorage.setItem(`privacy-banner-${area}`, "accepted")
    localStorage.setItem(`privacy-logging-${area}`, "true")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(`privacy-banner-${area}`, "declined")
    localStorage.setItem(`privacy-logging-${area}`, "false")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 max-w-2xl w-full">
      <Card className="shadow-lg border-2 border-orange-200 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Datenschutz - {title}</span>
                </h3>
                <Button variant="ghost" size="icon" onClick={handleDecline} className="h-6 w-6">
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Wir verarbeiten Testeingaben ausschließlich zu Demonstrationszwecken. Sie können das Logging jederzeit
                deaktivieren. Mehr Infos in unseren{" "}
                <a href="/datenschutz" className="text-blue-600 hover:underline">
                  Datenschutzrichtlinien
                </a>
                .
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={handleAccept}
                  size="sm"
                  className="bg-gradient-accent hover:bg-gradient-accent/90 text-white text-xs"
                >
                  Akzeptieren
                </Button>
                <Button variant="outline" onClick={handleDecline} size="sm" className="text-xs bg-transparent">
                  Ablehnen
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
