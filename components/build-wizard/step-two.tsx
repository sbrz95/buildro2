"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Zap, Upload, Key } from "lucide-react"

interface StepTwoProps {
  data: any
  updateData: (data: any) => void
}

export function StepTwo({ data, updateData }: StepTwoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Fähigkeiten & Integrationen</h2>
        <p className="text-muted-foreground">Wähle die Funktionen und Integrationen für deinen Agenten</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Fähigkeiten</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className={`cursor-pointer hover-scale transition-all ${
              data.websearch ? "ring-2 ring-purple-500 bg-gradient-accent/5" : ""
            }`}
            onClick={() => updateData({ websearch: !data.websearch })}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-2">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-base">Websearch</CardTitle>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer hover-scale transition-all ${
              data.apiAccess ? "ring-2 ring-purple-500 bg-gradient-accent/5" : ""
            }`}
            onClick={() => updateData({ apiAccess: !data.apiAccess })}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-base">API-Zugriff</CardTitle>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer hover-scale transition-all ${
              data.fileUpload ? "ring-2 ring-purple-500 bg-gradient-accent/5" : ""
            }`}
            onClick={() => updateData({ fileUpload: !data.fileUpload })}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-2">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-base">Dateiupload</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Integrationstoken</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API-Key</Label>
            <div className="flex space-x-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={data.apiKey || ""}
                onChange={(e) => updateData({ apiKey: e.target.value })}
              />
              <Button variant="outline" size="icon" className="hover-scale bg-transparent">
                <Key className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook-URL</Label>
            <Input
              id="webhookUrl"
              placeholder="https://..."
              value={data.webhookUrl || ""}
              onChange={(e) => updateData({ webhookUrl: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Datenschutz für Integrationen</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="noIntegrationLogging"
              checked={data.noIntegrationLogging || false}
              onCheckedChange={(checked) => updateData({ noIntegrationLogging: checked })}
            />
            <Label htmlFor="noIntegrationLogging" className="text-sm">
              Kein Logging für externe Integrationen
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymizeIntegrationData"
              checked={data.anonymizeIntegrationData || false}
              onCheckedChange={(checked) => updateData({ anonymizeIntegrationData: checked })}
            />
            <Label htmlFor="anonymizeIntegrationData" className="text-sm">
              Integrationsdaten anonymisieren
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
