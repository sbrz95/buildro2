"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Eye, Database, BarChart3 } from "lucide-react"

interface PrivacySettingsProps {
  area: string
  compact?: boolean
}

export function PrivacySettings({ area, compact = false }: PrivacySettingsProps) {
  const [settings, setSettings] = useState({
    noPII: false,
    anonymize: false,
    allowAnalytics: false,
  })

  useEffect(() => {
    const savedSettings = {
      noPII: localStorage.getItem(`privacy-no-pii-${area}`) === "true",
      anonymize: localStorage.getItem(`privacy-anonymize-${area}`) === "true",
      allowAnalytics: localStorage.getItem(`privacy-analytics-${area}`) === "true",
    }
    setSettings(savedSettings)
  }, [area])

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem(`privacy-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}-${area}`, value.toString())

    console.log(`[v0] Privacy setting updated: ${key} = ${value} for area ${area}`)
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <Checkbox
            id={`no-pii-${area}`}
            checked={settings.noPII}
            onCheckedChange={(checked) => updateSetting("noPII", checked as boolean)}
          />
          <label htmlFor={`no-pii-${area}`} className="text-xs">
            Keine PII speichern
          </label>
        </div>
        <div className="flex items-center space-x-1">
          <Checkbox
            id={`anonymize-${area}`}
            checked={settings.anonymize}
            onCheckedChange={(checked) => updateSetting("anonymize", checked as boolean)}
          />
          <label htmlFor={`anonymize-${area}`} className="text-xs">
            Anonymisieren
          </label>
        </div>
        <div className="flex items-center space-x-1">
          <Checkbox
            id={`analytics-${area}`}
            checked={settings.allowAnalytics}
            onCheckedChange={(checked) => updateSetting("allowAnalytics", checked as boolean)}
          />
          <label htmlFor={`analytics-${area}`} className="text-xs">
            Chat-Logs freigeben
          </label>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>Datenschutz-Einstellungen</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id={`no-pii-full-${area}`}
            checked={settings.noPII}
            onCheckedChange={(checked) => updateSetting("noPII", checked as boolean)}
          />
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <label htmlFor={`no-pii-full-${area}`} className="text-sm">
              Keine personenbezogenen Daten speichern (PII)
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id={`anonymize-full-${area}`}
            checked={settings.anonymize}
            onCheckedChange={(checked) => updateSetting("anonymize", checked as boolean)}
          />
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <label htmlFor={`anonymize-full-${area}`} className="text-sm">
              Eingaben anonymisieren
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id={`analytics-full-${area}`}
            checked={settings.allowAnalytics}
            onCheckedChange={(checked) => updateSetting("allowAnalytics", checked as boolean)}
          />
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <label htmlFor={`analytics-full-${area}`} className="text-sm">
              Chat-Logs für Analysezwecke freigeben
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
